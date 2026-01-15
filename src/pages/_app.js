import Layout from '../layout';
import '../globals.css';
import 'leaflet/dist/leaflet.css';
import { FilterProvider } from '@/contexts';

export default function App({ Component, pageProps }) {
  const breadcrumbs = pageProps.breadcrumbs || [];

  return (
    <FilterProvider>
      <Layout breadcrumbs={breadcrumbs}>
        <Component {...pageProps} />
      </Layout>
    </FilterProvider>
  );
}
