import { Map } from '@/components/map';
import { FilterBar } from '@/components/filters';
import { StatisticsSection } from '@/components/statistics';
import { DisasterDistributionSection, DisasterChronology, TemporalTrendsSection } from '@/components/charts';
import { DisasterRecords } from '@/components/disasters';

export default function Home() {
  return (
    <div>
      {/* Map Section */}
      <Map />
      
      {/* Filter Bar */}
      <FilterBar />
      
      {/* Disclaimer */}
      <div className="px-6 pb-2">
        <ul className="text-xxs text-slate-600 italic text-left list-disc list-inside">
          <li>The designations employed and the presentation of material on this map do not imply the expression of any opinion whatsoever on the part of the Secretariat of the United Nations or UNDP concerning the legal status of any country, territory, city or area or its authorities, or concerning the delimitation of its frontiers or boundaries. </li>
          <li>References to Kosovo shall be understood to be in the context of UN Security Council resolution 1244 (1999).</li>
        </ul>
      </div>
      
      {/* Statistics Section */}
      <StatisticsSection />

      {/* Distribution Chart Section */}
      <DisasterDistributionSection title="Disaster Distribution by Region" />

      {/* Temporal Trends Section - Only shows when country is selected */}
      <TemporalTrendsSection />

      {/* Disaster Chronology Section */}
      <DisasterChronology />

      {/* Disaster Records Section */}
      <DisasterRecords />
    </div>
  );
}
