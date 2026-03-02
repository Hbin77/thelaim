'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface TextRevealProps {
  children: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
}

export default function TextReveal({
  children,
  className,
  tag: Tag = 'p',
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const chars = children.split('');
    element.innerHTML = chars
      .map((char) =>
        char === ' '
          ? ' '
          : `<span style="display:inline-block;opacity:0">${char}</span>`
      )
      .join('');

    const spans = element.querySelectorAll('span');

    let ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
    import('gsap/ScrollTrigger').then((mod) => {
      ScrollTrigger = mod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      gsap.to(spans, {
        opacity: 1,
        y: 0,
        duration: 0.05,
        stagger: 0.03,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          once: true,
        },
      });
    });

    return () => {
      element.textContent = children;
    };
  }, [children, delay]);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement & HTMLParagraphElement & HTMLHeadingElement & HTMLSpanElement>}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
