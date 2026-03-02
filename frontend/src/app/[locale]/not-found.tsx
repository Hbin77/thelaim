import { Link } from '@/i18n/navigation';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-display text-navy">404</h1>
      <p className="text-xl text-ocean">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="rounded-full bg-teal-deep px-8 py-3 text-white transition-colors hover:bg-emerald"
      >
        Go Home
      </Link>
    </div>
  );
}
