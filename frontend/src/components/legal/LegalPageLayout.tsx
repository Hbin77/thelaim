import { useTranslations } from 'next-intl';
import PageHero from '@/components/ui/PageHero';

interface LegalPageLayoutProps {
  namespace: string;
  sections: readonly string[];
  showIntro?: boolean;
}

export default function LegalPageLayout({ namespace, sections, showIntro }: LegalPageLayoutProps) {
  const t = useTranslations(namespace);

  return (
    <>
      <PageHero eyebrow="Policy" title={t('title')} />
      <div className="wrap grid gap-12 py-14 md:py-20 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
        {/* 목차 */}
        <nav aria-label={t('title')} className="hidden lg:block">
          <ol className="sticky top-28 space-y-1 border-l border-line text-sm">
            {sections.map((key, i) => (
              <li key={key}>
                <a href={`#${key}`} className="-ml-px flex min-h-9 items-center border-l-2 border-transparent pl-4 text-ink-3 transition-colors hover:border-ink hover:text-ink">
                  <span className="serif-i mr-2 text-olive">{String(i + 1).padStart(2, '0')}</span>
                  <span className="line-clamp-1">{t(`${key}.title`)}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-3xl">
          {showIntro && <p className="mb-12 text-lg leading-relaxed text-ink-2">{t('intro')}</p>}

          {sections.map((key) => (
            <article key={key} id={key} className="scroll-mt-28 border-t border-line py-9">
              <h2 className="text-xl font-bold tracking-[-0.03em] text-ink">{t(`${key}.title`)}</h2>
              <div className="mt-4 whitespace-pre-line text-[15px] leading-[1.85] text-ink-2">{t(`${key}.content`)}</div>
            </article>
          ))}

          <div className="mt-8 rounded-[4px] border border-line bg-white p-6 md:p-8">
            <h3 className="text-base font-bold text-ink">{t('business_info.title')}</h3>
            <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-2">{t('business_info.content')}</div>
          </div>
        </div>
      </div>
    </>
  );
}
