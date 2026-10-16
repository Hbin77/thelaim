import { getTranslations } from 'next-intl/server';

export default async function Loading() {
  const t = await getTranslations('common');
  return (
    <div className="flex min-h-[70svh] items-center justify-center" role="status" aria-label={t('loading')}>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-10 w-2.5 animate-pulse rounded-full bg-ink/20" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}
