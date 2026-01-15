import Head from 'next/head';
import FavIcon from '../public/favicon.ico';
import Navbar from './components/navbar/navbar';

export default function Layout({ children, breadcrumbs = [] }) {
 
  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>Synapses</title>
        <meta
          name="description"
          content=""
        />
        <link rel="icon" href={FavIcon.src} />
      </Head>
      {/* <Navbar breadcrumbs={breadcrumbs} /> */}
      <main className="w-full">{children}</main>
    </div>
  );
}