import { Map } from '@/components/map';
import { FilterBar } from '@/components/filters';
import { useFilters } from '@/contexts';

export default function Home() {
  const { filters, isApplied } = useFilters();

  return (
    <div>
      <Map />
      <FilterBar />
      
      {/* Debug: Filter Context State */}
      <div className="p-4 bg-slate-800 text-green-400 font-mono text-sm">
        <div className="mb-2 text-white font-bold">Filter Context State:</div>
        <pre className="whitespace-pre-wrap overflow-auto">
          {JSON.stringify(
            {
              isApplied,
              region: filters.region?.label || null,
              country: filters.country?.label || null,
              startDate: filters.startDate || null,
              endDate: filters.endDate || null,
              disasterTypes: filters.disasterTypes?.map(d => d.label) || [],
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
