import Layout from '../layout';
import '../globals.css';
import 'leaflet/dist/leaflet.css';
import { FilterProvider, MapSelectionProvider } from '@/contexts';

export default function App({ Component, pageProps }) {
  const breadcrumbs = pageProps.breadcrumbs || [];

  return (
    <FilterProvider>
      <MapSelectionProvider>
        <Layout breadcrumbs={breadcrumbs}>
          <Component {...pageProps} />
        </Layout>
      </MapSelectionProvider>
    </FilterProvider>
  );
}
