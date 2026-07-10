'use client';

import { useState } from 'react';
import PeriodicTable from '../components/periodic-table/PeriodicTable';
import TrendsChart from '../components/trends/TrendsChart';
import ElementSearch from '../components/search/ElementSearch';

export default function Home() {
  const [selectedZ, setSelectedZ] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-gray-900 px-4 py-6">
      <h1 className="text-3xl font-bold text-white text-center mb-1">
        PeriodicUniverse
      </h1>
      <p className="text-gray-400 text-center text-sm mb-8">
        Interactive Chemistry Reference · Class 11 to MSc
      </p>

    <ElementSearch />
      <PeriodicTable onElementSelect={(z) => setSelectedZ(z)} />

      <TrendsChart highlightZ={selectedZ} />
    </main>
  );
}