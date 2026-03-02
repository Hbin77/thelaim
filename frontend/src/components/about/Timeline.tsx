'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import FadeIn from '@/components/animations/FadeIn';

const TIMELINE_EVENTS = [
  { year: '2003', key: 'timeline_2003' },
  { year: '2005', key: 'timeline_2005' },
  { year: '2008', key: 'timeline_2008' },
  { year: '2010', key: 'timeline_2010' },
  { year: '2013', key: 'timeline_2013' },
  { year: '2015', key: 'timeline_2015' },
  { year: '2018', key: 'timeline_2018' },
  { year: '2020', key: 'timeline_2020' },
  { year: '2023', key: 'timeline_2023' },
] as const;

export default function Timeline() {
  const t = useTranslations('about');
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    import('gsap/ScrollTrigger').then((mod) => {
      const ScrollTrigger = mod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: line.parentElement,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1,
          },
        }
      );
    });
  }, []);

  return (
    <section className="py-24 bg-navy/[0.02]">
      <Container>
        <SectionHeading title={t('timeline_title')} />

        <div className="relative mt-16">
          {/* Vertical line */}
          <div
            ref={lineRef}
            className="absolute left-4 top-0 h-full w-0.5 origin-top bg-emerald md:left-1/2 md:-translate-x-1/2"
          />

          <div className="space-y-12">
            {TIMELINE_EVENTS.map((event, i) => {
              const isLeft = i % 2 === 0;
              return (
                <FadeIn key={event.year} delay={i * 0.05} direction={isLeft ? 'right' : 'left'}>
                  <div
                    className={`relative flex items-center ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-emerald bg-white md:left-1/2" />

                    {/* Content */}
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                      <span className="font-playfair text-2xl font-bold text-emerald">
                        {event.year}
                      </span>
                      <p className="mt-1 text-lg text-navy/70">
                        {t(event.key)}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
