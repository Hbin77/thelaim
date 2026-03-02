import { gsap } from 'gsap';

export const fadeInUp = (element: Element, delay = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, delay, ease: 'power3.out' }
  );
};

export const staggerReveal = (elements: Element[], stagger = 0.1) => {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6, stagger, ease: 'power2.out' }
  );
};

export const setupHorizontalScroll = (
  container: Element,
  scrollContainer: Element
) => {
  const { ScrollTrigger } = require('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const scrollWidth =
    (scrollContainer as HTMLElement).scrollWidth -
    (container as HTMLElement).offsetWidth;

  return gsap.to(scrollContainer, {
    x: -scrollWidth,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: () => `+=${scrollWidth}`,
      scrub: 1,
      pin: true,
    },
  });
};

export const setupParallax = (element: Element, speed = 0.5) => {
  const { ScrollTrigger } = require('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  return gsap.to(element, {
    y: `${speed * 100}%`,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};
