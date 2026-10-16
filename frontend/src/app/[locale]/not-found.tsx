import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { buttonClass, Arrow } from '@/components/ui/Button';
import { SWATCHES } from '@/lib/swatches';

export default async function NotFound() {
  const t = await getTranslations('ui');

  return (
    <section className="wrap flex min-h-[86svh] flex-col items-start justify-center pt-28 pb-20">
      <div aria-hidden="true" className="mb-10 flex gap-1.5">
        {SWATCHES.map((s, i) => (
          <span key={s.key} className="h-20 w-8 rounded-[3px] bg-cover bg-center" style={{ backgroundImage: `url(${s.thumb})`, transform: `rotate(${(i - 2) * 4}deg)` }} />
        ))}
      </div>
      <p className="serif-i text-[clamp(4rem,12vw,9rem)] leading-none text-olive">404</p>
      <h1 className="mt-4 text-h2 font-extrabold text-ink">{t('not_found_title')}</h1>
      <p className="mt-4 text-lg text-ink-2">{t('not_found_desc')}</p>
      <Link href="/" className={buttonClass('primary', 'lg', 'mt-10')}>
        {t('go_home')}
        <Arrow />
      </Link>
    </section>
  );
}
