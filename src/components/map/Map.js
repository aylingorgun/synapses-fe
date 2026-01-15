'use client';

import dynamic from 'next/dynamic';

const MapContent = dynamic(() => import('./MapContent'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-slate-100 flex items-center justify-center rounded-lg">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

export default function Map() {
  return <MapContent />;
}
