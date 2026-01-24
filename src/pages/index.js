import { Map } from '@/components/map';
import { FilterBar } from '@/components/filters';
import { StatisticsSection } from '@/components/statistics';
import { DisasterDistributionSection, DisasterChronology } from '@/components/charts';
import { DisasterRecords } from '@/components/disasters';

export default function Home() {

  return (
    <div>
      {/* Map Section */}
      <Map />
      
      {/* Filter Bar */}
      <FilterBar />
      
      {/* Statistics Section */}
      <StatisticsSection />

      {/* Distribution Chart Section */}
      <DisasterDistributionSection title="Disaster Distribution by Region" />

      {/* Disaster Chronology Section */}
      <DisasterChronology />

      {/* Disaster Records Section */}
      <DisasterRecords />
    </div>
  );
}
