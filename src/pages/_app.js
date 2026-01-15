import Layout from '../layout';
import '../globals.css';
import 'leaflet/dist/leaflet.css';

export default function App({ Component, pageProps }) {
  const breadcrumbs = pageProps.breadcrumbs || [];

  return (
    <Layout breadcrumbs={breadcrumbs}>
        <Component {...pageProps} />
    </Layout>
  );
}