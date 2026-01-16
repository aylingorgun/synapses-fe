import Head from 'next/head';
import FavIcon from '../public/favicon.ico';
import Navbar from './components/navbar/navbar';
import { Footer } from './components/footer';

export default function Layout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Head>
        <title>Synapses</title>
        <meta name="description" content="" />
        <link rel="icon" href={FavIcon.src} />
      </Head>
      <Navbar />
      <main className="w-full pt-14 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
