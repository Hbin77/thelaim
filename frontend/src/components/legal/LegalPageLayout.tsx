import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';

interface LegalPageLayoutProps {
  namespace: string;
  sections: readonly string[];
  showIntro?: boolean;
}

export default function LegalPageLayout({ namespace, sections, showIntro }: LegalPageLayoutProps) {
  const t = useTranslations(namespace);

  return (
    <>
      <section
        className="flex min-h-[40vh] items-center justify-center"
        style={{ backgroundImage: 'linear-gradient(135deg, #004346 0%, #172A3A 100%)' }}
      >
        <div className="px-4 text-center">
          <h1 className="font-serif-kr text-4xl font-normal text-white md:text-5xl">
            {t('title')}
          </h1>
          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-emerald" />
        </div>
      </section>

      <div className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            {showIntro && (
              <p className="mb-10 text-base leading-relaxed text-navy/70">
                {t('intro')}
              </p>
            )}

            {sections.map((key) => (
              <article key={key} className="mb-10">
                <h2 className="mb-4 text-lg font-semibold text-navy">
                  {t(`${key}.title`)}
                </h2>
                <div className="whitespace-pre-line text-[15px] leading-relaxed text-navy/70">
                  {t(`${key}.content`)}
                </div>
              </article>
            ))}

            <div className="mt-12 rounded-xl border border-navy/10 bg-navy/[0.02] p-6">
              <h3 className="mb-3 text-base font-semibold text-navy">{t('business_info.title')}</h3>
              <div className="whitespace-pre-line text-sm leading-relaxed text-navy/60">
                {t('business_info.content')}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
