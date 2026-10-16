// 첫 화면: 상품 사진이 둥근 진열대(원통)에 걸려 천천히 돈다.
// 처음엔 한 장으로 겹쳐 있다가 부채처럼 펼쳐진다. 빨리 돌면 진열대가 살짝 비틀린다.
// 스크롤을 내리면 카메라가 진열대 안으로 들어가 사진들에 둘러싸인다.
// 마우스를 댄 사진은 밝아지며 앞으로 나오고, 누르면 그 상품으로 간다.
import * as THREE from 'three';

export interface RingItem {
  src: string;
  slug: string;
  name: string;
}

export interface RingHandle {
  setProgress: (p: number) => void;
  dispose: () => void;
}

const VERT = /* glsl */ `
uniform float uHover;
uniform float uTwist;
varying vec2 vUv;
varying float vFacing;
varying float vDist;
void main() {
  vUv = uv;
  vec4 world = modelMatrix * vec4(position, 1.0);
  // 회전 속도만큼 위아래가 어긋나게 비튼다(사진 자체 높이 기준이라 반사도 대칭으로 비틀림)
  float a = uTwist * position.y;
  float c = cos(a), s = sin(a);
  world.xz = mat2(c, -s, s, c) * world.xz;
  // 원통 바깥쪽을 향한 법선(중심축 기준)
  vec3 n = normalize(vec3(world.x, 0.0, world.z));
  vec3 toCam = cameraPosition - world.xyz;
  vDist = length(toCam);
  vFacing = dot(n, normalize(toCam));
  world.xyz += n * uHover * 0.22;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const FRAG = /* glsl */ `
uniform sampler2D uMap;
uniform vec2 uScale;
uniform vec2 uOffset;
uniform float uHover;
uniform float uReady;
uniform float uReflect;
uniform float uInside;
varying vec2 vUv;
varying float vFacing;
varying float vDist;
void main() {
  vec2 uv = vUv;
  // 안쪽 면에서 볼 때 사진이 뒤집혀 보이지 않게
  if (!gl_FrontFacing) uv.x = 1.0 - uv.x;
  vec3 col = texture2D(uMap, uv * uScale + uOffset).rgb;
  // 바깥에서 볼 땐 앞쪽이, 안에 들어가면 안쪽 면이 '정면'
  float facing = mix(vFacing, -vFacing, uInside);
  float grey = dot(col, vec3(0.299, 0.587, 0.114));
  float front = smoothstep(0.15, 0.95, facing);
  float sat = clamp(0.15 + front * 0.65 + uHover * 0.6, 0.0, 1.0);
  col = mix(vec3(grey), col, sat);
  // 뒤쪽은 어둠에 묻히되 완전히 사라지진 않는다(진열대의 깊이)
  float light = mix(0.14, 1.0, smoothstep(-0.3, 0.9, facing));
  col *= light * mix(0.86, 1.1, uHover);
  float a = uReady * mix(0.3, 1.0, smoothstep(-0.25, 0.15, facing));
  // 카메라를 스쳐 지나가는 사진은 투명하게
  a *= smoothstep(0.7, 2.4, vDist);
  // 바닥에 비친 사진: 바닥에서 멀어질수록 사라진다
  a *= mix(1.0, 0.22 * pow(1.0 - vUv.y, 2.0), uReflect);
  gl_FragColor = vec4(col, a);
}
`;

const ease = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 4);
const smooth = (x: number) => {
  const t = Math.min(Math.max(x, 0), 1);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function mountRing(
  canvas: HTMLCanvasElement,
  items: RingItem[],
  opts: {
    reduce: boolean;
    onPick: (slug: string) => void;
    onReady: () => void;
    onHover: (name: string | null) => void;
  }
): RingHandle | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const group = new THREE.Group();
  scene.add(group);

  const n = items.length;
  const R = 4.2;
  const cardH = 1.9;
  const arc = (Math.PI * 2) / n;
  const cardW = 2 * R * Math.sin((arc * 0.78) / 2); // 사진 사이 틈 22%
  const aspect = cardW / cardH;
  const floorY = -cardH - 0.12;

  const loader = new THREE.TextureLoader();
  type Card = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  const meshes: Card[] = [];
  const reflections: Card[] = [];
  // 부채가 펼쳐질 최종 각도(-π~π로 접어 양쪽으로 고르게 펼침)
  const targets: number[] = [];
  let loaded = 0;

  items.forEach((item, i) => {
    // 평면을 원통 곡면으로 휜다
    const geo = new THREE.PlaneGeometry(cardW, cardH, 24, 1);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let v = 0; v < pos.count; v++) {
      const x = pos.getX(v);
      const a = x / R;
      pos.setXYZ(v, Math.sin(a) * R, pos.getY(v), Math.cos(a) * R);
    }
    pos.needsUpdate = true;
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uMap: { value: null },
        uScale: { value: new THREE.Vector2(1, 1) },
        uOffset: { value: new THREE.Vector2(0, 0) },
        uHover: { value: 0 },
        uReady: { value: 0 },
        uReflect: { value: 0 },
        uTwist: { value: 0 },
        uInside: { value: 0 },
      },
    });
    const target = Math.atan2(Math.sin(i * arc), Math.cos(i * arc));
    targets.push(target);
    const mesh: Card = new THREE.Mesh(geo, mat);
    mesh.rotation.y = opts.reduce ? target : 0;
    mesh.userData = { slug: item.slug, name: item.name, hover: 0, ready: 0 };
    group.add(mesh);
    meshes.push(mesh);
    // 바닥 반사: 같은 곡면을 아래로 뒤집어 흐리게
    const rmat = mat.clone();
    rmat.uniforms = { ...mat.uniforms, uReflect: { value: 1 } };
    const refl: Card = new THREE.Mesh(geo, rmat);
    refl.rotation.y = mesh.rotation.y;
    refl.scale.y = -1;
    refl.position.y = floorY;
    group.add(refl);
    reflections.push(refl);

    loader.load(item.src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      // 사진을 카드 비율에 맞춰 가운데로 잘라 쓴다(cover)
      const img = tex.image as HTMLImageElement;
      const ia = img.width / img.height;
      if (ia > aspect) mat.uniforms.uScale.value.set(aspect / ia, 1);
      else mat.uniforms.uScale.value.set(1, ia / aspect);
      mat.uniforms.uOffset.value.set((1 - mat.uniforms.uScale.value.x) / 2, (1 - mat.uniforms.uScale.value.y) / 2);
      mat.uniforms.uMap.value = tex;
      mesh.userData.ready = 1;
      if (++loaded === 1) opts.onReady();
    });
  });

  // 회전 상태
  const base = opts.reduce ? 0 : 0.0018;
  let angle = 0;
  let vel = base;
  let dragging = false;
  let lastX = 0;
  let moved = 0;
  let lastScroll = window.scrollY;
  const pointer = new THREE.Vector2(9, 9);
  const look = new THREE.Vector2(0, 0); // 마우스 위치를 따라 천천히 기우는 시선
  const ray = new THREE.Raycaster();
  let hovered: Card | null = null;
  let progress = 0;
  let prog = 0;
  let introStart = -1;
  let narrow = false;

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    narrow = w < 700;
    // 좁은 화면은 가까이(사진을 크게)
    camera.fov = narrow ? 44 : 30;
    camera.updateProjectionMatrix();
  };

  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    moved = 0;
    canvas.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    if (dragging) {
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      moved += Math.abs(dx);
      vel = -dx * 0.0035;
    }
  };
  const onUp = (e: PointerEvent) => {
    dragging = false;
    canvas.releasePointerCapture(e.pointerId);
    if (moved < 6 && hovered) opts.onPick(hovered.userData.slug);
  };
  const onLeave = () => pointer.set(9, 9);
  const onScroll = () => {
    const y = window.scrollY;
    if (!opts.reduce) vel += (y - lastScroll) * 0.00006;
    lastScroll = y;
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointerleave', onLeave);
  window.addEventListener('scroll', onScroll, { passive: true });

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(canvas);
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const lookAt = new THREE.Vector3();
  let raf = 0;
  let lastHoverName: string | null = null;
  const clock = new THREE.Clock();
  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const t = clock.getElapsedTime();

    // 펼침: 사진이 어느 정도 들어오거나 2.5초가 지나면 시작
    if (introStart < 0 && (loaded >= Math.min(n, 6) || t > 2.5)) introStart = t;
    const intro = opts.reduce ? 1 : introStart < 0 ? 0 : ease((t - introStart - 0.2) / 2.4);

    if (!dragging) vel += (base * intro - vel) * 0.03;
    vel = Math.max(-0.04, Math.min(0.04, vel));
    angle += vel;
    group.rotation.y = angle;
    // 빠르게 돌수록 비틀림. 너무 과하지 않게 제한
    const twist = Math.max(-0.35, Math.min(0.35, vel * 9));

    // 스크롤 진행도(0: 첫 화면, 1: 진열대 안)
    prog += (progress - prog) * (opts.reduce ? 1 : 0.08);
    // 먼저 눈높이로 내려오고, 그다음 앞으로 들어간다
    const drop = smooth(prog / 0.55);
    const dive = smooth((prog - 0.1) / 0.9);
    const inside = smooth((prog - 0.5) / 0.3);

    if (pointer.x < 5) look.lerp(pointer, 0.04);
    else look.lerp(new THREE.Vector2(0, 0), 0.04);

    const baseY = narrow ? 2.4 : 2.9;
    const dist = narrow ? 12 : 14;
    const bob = opts.reduce ? 0 : Math.sin(t * 0.25) * 0.08;
    camera.position.set(
      look.x * 0.7 * (1 - dive),
      lerp(baseY, 0.15, drop) + bob + look.y * 0.25 * (1 - dive),
      lerp(dist + (1 - intro) * 3, R * 0.3, dive)
    );
    lookAt.set(look.x * 0.3 * dive, lerp(narrow ? 0.55 : 0.5, 0.0, drop), lerp(0, -R, dive));
    camera.lookAt(lookAt);

    ray.setFromCamera(pointer, camera);
    const hit = dragging || intro < 0.95 ? undefined : ray.intersectObjects(meshes, false)[0];
    hovered = hit ? (hit.object as Card) : null;
    canvas.style.cursor = hovered ? 'pointer' : dragging ? 'grabbing' : 'grab';
    const name = hovered ? (hovered.userData.name as string) : null;
    if (name !== lastHoverName) {
      lastHoverName = name;
      opts.onHover(name);
    }

    meshes.forEach((m, i) => {
      const refl = reflections[i];
      const lag = (Math.abs(targets[i]) / Math.PI) * 0.12;
      const e = opts.reduce ? 1 : introStart < 0 ? 0 : ease((t - introStart - lag) / 2.2);
      m.rotation.y = refl.rotation.y = targets[i] * e;
      m.position.y = (1 - e) * -0.5;
      refl.position.y = floorY - m.position.y;

      const target = m === hovered ? 1 : 0;
      m.userData.hover += (target - m.userData.hover) * 0.1;
      const u = m.material.uniforms;
      u.uHover.value = m.userData.hover;
      u.uReady.value += (m.userData.ready - u.uReady.value) * 0.05;
      u.uTwist.value = twist;
      u.uInside.value = inside;
      const ru = refl.material.uniforms;
      ru.uTwist.value = twist;
      ru.uInside.value = inside;
      // 투명한 사진끼리 겹칠 때 먼 것부터 그리도록 순서를 매긴다
      const facing = Math.cos(m.rotation.y + angle);
      const order = Math.round((inside > 0.5 ? -facing : facing) * 100);
      m.renderOrder = order;
      refl.renderOrder = order - 300;
    });
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return {
    setProgress(p) {
      progress = Math.min(Math.max(p, 0), 1);
    },
    dispose() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      meshes.forEach((m) => {
        m.geometry.dispose();
        m.material.uniforms.uMap.value?.dispose();
        m.material.dispose();
      });
      reflections.forEach((r) => r.material.dispose());
      renderer.dispose();
    },
  };
}
