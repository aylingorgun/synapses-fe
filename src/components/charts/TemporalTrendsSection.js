'use client';

import { useMapSelection } from '@/contexts';
import CorrelationAnalysis from './CorrelationAnalysis';

/**
 * Temporal Trends Section - Only renders when a country is selected
 * Displays environmental, demographic, and disaster variable correlations
 */
export default function TemporalTrendsSection() {
  const { selectedCountryName } = useMapSelection();

  // Don't render if no country is selected
  if (!selectedCountryName) {
    return null;
  }

  return (
    <section className="py-8 px-12 bg-white border-t border-slate-200 max-md:py-6 max-md:px-4">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-2xl font-bold text-undp-navy mb-4">
          Temporal Trends in Key Indicators
        </h2>
        <CorrelationAnalysis countryName={selectedCountryName} />
      </div>
    </section>
  );
}
