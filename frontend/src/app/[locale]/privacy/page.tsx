import { getTranslations } from 'next-intl/server';
import LegalPageLayout from '@/components/legal/LegalPageLayout';

const sections = [
  'purpose', 'retention', 'items', 'third_party',
  'consignment', 'destruction', 'rights', 'safety',
  'cookies', 'officer', 'remedy', 'changes', 'effective',
] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return {
    title: t('title'),
    description: t('intro'),
  };
}

export default function PrivacyPage() {
  return <LegalPageLayout namespace="privacy" sections={sections} showIntro />;
}
