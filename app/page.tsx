import PeriodicTable from '../components/periodic-table/PeriodicTable';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 px-4 py-6">
      <h1 className="text-3xl font-bold text-white text-center mb-1">
        PeriodicUniverse
      </h1>
      <p className="text-gray-400 text-center text-sm mb-8">
        Interactive Chemistry Reference · Class 11 to MSc
      </p>
      <PeriodicTable />
    </main>
  );
}