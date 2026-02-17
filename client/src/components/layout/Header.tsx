import { DateRangePicker } from '../ui/DateRangePicker';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
      <div>
        <h2 className="text-xl font-semibold text-gray-100">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <DateRangePicker />
    </header>
  );
}
