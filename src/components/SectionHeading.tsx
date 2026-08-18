import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  link?: string;
  linkLabel?: string;
  center?: boolean;
}

export function SectionHeading({ title, subtitle, link, linkLabel, center }: SectionHeadingProps) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${center ? 'sm:flex-col sm:items-center' : ''}`}>
      <div className={center ? 'text-center' : ''}>
        <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-ink-muted sm:text-base">{subtitle}</p>}
      </div>
      {link && linkLabel && (
        <Link
          to={link}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink transition hover:text-accent"
        >
          {linkLabel}
          <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
        </Link>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-cream-dark text-ink-muted">
        {icon}
      </div>
      <h3 className="font-serif text-2xl font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
