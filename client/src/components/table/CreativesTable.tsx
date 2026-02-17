import { useState, useMemo } from 'react';
import type { Creative, SortField, SortDirection } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { SearchInput } from '../ui/SearchInput';
import { TableRowSkeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { useDebounce } from '../../hooks/useDebounce';
import { useComparison } from '../../context/ComparisonContext';
import { formatCurrency, formatPercent, formatRoas, formatCta, formatNumber } from '../../utils/formatters';

interface CreativesTableProps {
  creatives: Creative[];
  loading: boolean;
}

const sortableColumns: { key: SortField; label: string }[] = [
  { key: 'ad_name', label: 'Ad Name' },
  { key: 'spend', label: 'Spend' },
  { key: 'impressions', label: 'Impressions' },
  { key: 'clicks', label: 'Clicks' },
  { key: 'ctr', label: 'CTR' },
  { key: 'cpc', label: 'CPC' },
  { key: 'roas', label: 'ROAS' },
  { key: 'frequency', label: 'Frequency' },
];

export function CreativesTable({ creatives, loading }: CreativesTableProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('roas');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [ctaFilter, setCtaFilter] = useState<string>('all');

  const debouncedSearch = useDebounce(search, 300);
  const { addToComparison, removeFromComparison, isSelected } = useComparison();

  const ctaOptions = useMemo(() => {
    const ctas = new Set(creatives.map((c) => c.call_to_action_type).filter(Boolean));
    return Array.from(ctas) as string[];
  }, [creatives]);

  const filtered = useMemo(() => {
    let result = [...creatives];

    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((c) => c.ad_name.toLowerCase().includes(q));
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((c) => c.scoring.status === statusFilter);
    }

    // Format filter
    if (formatFilter !== 'all') {
      result = result.filter((c) => c.object_type === formatFilter);
    }

    // CTA filter
    if (ctaFilter !== 'all') {
      result = result.filter((c) => c.call_to_action_type === ctaFilter);
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      const aNum = Number(aVal) || 0;
      const bNum = Number(bVal) || 0;
      return sortDir === 'asc' ? aNum - bNum : bNum - aNum;
    });

    return result;
  }, [creatives, debouncedSearch, statusFilter, formatFilter, ctaFilter, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const handleCheckbox = (id: string) => {
    if (isSelected(id)) {
      removeFromComparison(id);
    } else {
      addToComparison(id);
    }
  };

  return (
    <div>
      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex-1 min-w-[200px] max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by ad name..." />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="winning">Winning</option>
          <option value="watch">Watch</option>
          <option value="fatigued">Fatigued</option>
          <option value="low_spend">Low Spend</option>
        </select>
        <select
          value={formatFilter}
          onChange={(e) => setFormatFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Formats</option>
          <option value="IMAGE">Image</option>
          <option value="VIDEO">Video</option>
        </select>
        <select
          value={ctaFilter}
          onChange={(e) => setCtaFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All CTAs</option>
          {ctaOptions.map((cta) => (
            <option key={cta} value={cta}>{formatCta(cta)}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3 text-left">
                  <span className="sr-only">Select</span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Preview
                </th>
                {sortableColumns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-300 transition-colors select-none"
                    onClick={() => handleSort(col.key)}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {sortField === col.key && (
                        <span className="text-blue-400">{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>
                      )}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Format
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  CTA
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8">
                    <EmptyState
                      title="No creatives match"
                      description="Try adjusting your search or filters."
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((creative) => (
                  <tr
                    key={creative.ad_id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected(creative.ad_id)}
                        onChange={() => handleCheckbox(creative.ad_id)}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      {creative.thumbnail_url ? (
                        <img
                          src={creative.thumbnail_url}
                          alt=""
                          className="w-10 h-10 rounded object-cover bg-gray-800"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-600 text-xs">
                          -
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-200 max-w-[200px] truncate">{creative.ad_name}</td>
                    <td className="px-4 py-3 text-gray-300">{formatCurrency(creative.spend)}</td>
                    <td className="px-4 py-3 text-gray-300">{formatNumber(creative.impressions)}</td>
                    <td className="px-4 py-3 text-gray-300">{formatNumber(creative.clicks)}</td>
                    <td className="px-4 py-3 text-gray-300">{formatPercent(creative.ctr)}</td>
                    <td className="px-4 py-3 text-gray-300">{formatCurrency(creative.cpc)}</td>
                    <td className="px-4 py-3 text-gray-300 font-medium">{formatRoas(creative.roas)}</td>
                    <td className="px-4 py-3 text-gray-300">{creative.frequency.toFixed(1)}</td>
                    <td className="px-4 py-3 text-gray-400 capitalize text-xs">{creative.object_type?.toLowerCase() || '-'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{formatCta(creative.call_to_action_type)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge scoring={creative.scoring} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
