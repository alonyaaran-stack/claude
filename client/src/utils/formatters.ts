export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatRoas(value: number): string {
  return `${value.toFixed(2)}x`;
}

export function formatCta(cta: string | null): string {
  if (!cta) return 'None';
  return cta
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatDateRange(since: string, until: string): string {
  const start = new Date(since).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const end = new Date(until).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${start} - ${end}`;
}
