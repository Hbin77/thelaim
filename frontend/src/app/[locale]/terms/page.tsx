import { getTranslations } from 'next-intl/server';
import LegalPageLayout from '@/components/legal/LegalPageLayout';

const sections = [
  'purpose', 'definitions', 'posting', 'services',
  'suspension', 'user_obligations', 'company_obligations',
  'ip', 'disclaimer', 'dispute', 'jurisdiction', 'effective',
] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms' });
  return {
    title: t('title'),
  };
}

export default function TermsPage() {
  return <LegalPageLayout namespace="terms" sections={sections} />;
}
