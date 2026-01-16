import { Map } from '@/components/map';
import { FilterBar } from '@/components/filters';
import { StatisticsSection } from '@/components/statistics';

export default function Home() {

  return (
    <div>
      {/* Map Section */}
      <Map />
      
      {/* Filter Bar */}
      <FilterBar />
      
      {/* Statistics Section */}
      <StatisticsSection />
    </div>
  );
}
