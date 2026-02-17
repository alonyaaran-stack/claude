import { useDateRange } from '../../context/DateRangeContext';

const presets = [
  { label: '7D', value: '7' },
  { label: '14D', value: '14' },
  { label: '30D', value: '30' },
  { label: '90D', value: '90' },
];

export function DateRangePicker() {
  const { preset, setPreset, dateRange, setDateRange } = useDateRange();

  return (
    <div className="flex items-center gap-2">
      {presets.map((p) => (
        <button
          key={p.value}
          onClick={() => setPreset(p.value)}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            preset === p.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
          }`}
        >
          {p.label}
        </button>
      ))}
      <div className="flex items-center gap-1 ml-2">
        <input
          type="date"
          value={dateRange.since}
          onChange={(e) => setDateRange({ ...dateRange, since: e.target.value })}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500"
        />
        <span className="text-gray-500">-</span>
        <input
          type="date"
          value={dateRange.until}
          onChange={(e) => setDateRange({ ...dateRange, until: e.target.value })}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
}
