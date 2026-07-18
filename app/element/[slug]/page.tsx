import { getElementBySlug, getAdjacentElements, nameToSlug } from '../../../lib/getElement';
import { elements } from '../../../data/elements';
import { categoryColors, categoryLabels } from '../../../data/elements';
import { kelvinToCelsius } from '../../../data/elementProperties';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BohrModel from '../../../components/element-page/BohrModel';
import IonizationChart from '../../../components/element-page/IonizationChart';
import CompoundsSection from '../../../components/element-page/CompoundsSection';

// Tell Next.js all valid slugs at build time
export function generateStaticParams() {
  return elements.map(el => ({ slug: nameToSlug(el.name) }));
}

export default async function ElementPage({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }) {
    const { slug } = await params;
    const data = getElementBySlug(slug);
  if (!data) notFound();

  const { element: el, properties: props } = data;
  const { prev, next } = getAdjacentElements(el.atomicNumber);
  const color = categoryColors[el.category];

  const stateLabel: Record<string, string> = {
    solid: '⬛ Solid', liquid: '💧 Liquid',
    gas: '💨 Gas', unknown: '❓ Unknown',
  };

  
  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* ── Top nav ── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-950">
        <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
          ← Periodic Table
        </Link>
        <span className="text-gray-600 text-xs">PeriodicUniverse</span>
        <div className="flex gap-2">
          {prev && (
            <Link
              href={`/element/${nameToSlug(prev.name)}`}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← {prev.symbol}
            </Link>
          )}
          {next && (
            <Link
              href={`/element/${nameToSlug(next.name)}`}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              {next.symbol} →
            </Link>
          )}
        </div>
      </div>

      {/* ── Hero header ── */}
      <div className="px-6 py-10" style={{ backgroundColor: color }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-6">
            <div className="text-9xl font-black text-gray-900 leading-none">
              {el.symbol}
            </div>
            <div className="text-gray-900 pb-2">
              <div className="text-3xl font-bold">{el.name}</div>
              <div className="text-lg opacity-70 mt-1">
                Z = {el.atomicNumber} · {el.atomicMass} u
              </div>
              <div className="text-sm opacity-60 mt-1">
                {categoryLabels[el.category]} · {el.block.toUpperCase()}-block · Period {el.period}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content grid ── */}
      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Electronic Configuration + Bohr Model */}
<Card title="Electronic Configuration">
  {props ? (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded p-4 border border-gray-700">
        <p className="text-white text-lg tracking-wide">
          {props.electronicConfig}
        </p>
      </div>
      <BohrModel
        shells={el.bohrShells}
        elementSymbol={el.symbol}
        elementColor={color}
      />
    </div>
  ) : <NoData />}
</Card>
        
        {/* Identity */}
        <Card title="Identity">
          <Row label="Category">{categoryLabels[el.category]}</Row>
          <Row label="Group">{el.group ?? '— (f-block)'}</Row>
          <Row label="Period">{el.period}</Row>
          <Row label="Block">{el.block.toUpperCase()}-block</Row>
          <Row label="State at 298 K">{stateLabel[el.standardState]}</Row>
        </Card>

        {/* Chemical Properties */}
        <Card title="Chemical Properties">
          {props ? (
            <>
              <Row label="Electronegativity (Pauling)">
                {props.electronegativity ?? '—'}
              </Row>
              <Row label="1st Ionization Energy">
                {props.ionizationEnergy
                  ? `${props.ionizationEnergy.toLocaleString()} kJ/mol`
                  : '—'}
              </Row>
              <Row label="Oxidation States">
                <div className="flex flex-wrap gap-1 mt-1">
                  {props.oxidationStates.map(os => (
                    <span
                      key={os}
                      className="px-2 py-0.5 rounded text-xs font-bold border"
                      style={{
                        backgroundColor: os > 0 ? '#1e3a5f' : os < 0 ? '#3b1f1f' : '#1f2d1f',
                        borderColor: os > 0 ? '#3b82f6' : os < 0 ? '#ef4444' : '#22c55e',
                        color: os > 0 ? '#93c5fd' : os < 0 ? '#fca5a5' : '#86efac',
                      }}
                    >
                      {os > 0 ? `+${os}` : os}
                    </span>
                  ))}
                </div>
              </Row>
            </>
          ) : <NoData />}
        </Card>

        {/* Physical Properties */}
        <Card title="Physical Properties">
          {props ? (
            <>
              <Row label="Atomic Radius">
                {props.atomicRadius ? `${props.atomicRadius} pm` : '—'}
              </Row>
              <Row label="Density">
                {props.density ? `${props.density} g/cm³` : '—'}
              </Row>
              <Row label="Melting Point">
                {props.meltingPoint
                  ? `${props.meltingPoint} K (${kelvinToCelsius(props.meltingPoint)} °C)`
                  : '—'}
              </Row>
              <Row label="Boiling Point">
                {props.boilingPoint
                  ? `${props.boilingPoint} K (${kelvinToCelsius(props.boilingPoint)} °C)`
                  : '—'}
              </Row>
            </>
          ) : <NoData />}
        </Card>

        {/* Atomic Mass */}
        <Card title="Atomic Mass">
          <div className="text-4xl font-bold text-white mt-2">
            {el.atomicMass}
            <span className="text-lg text-gray-400 ml-2">u</span>
          </div>
          <p className="text-gray-500 text-xs mt-3">
            Standard atomic weight (IUPAC 2021).
            {el.atomicNumber >= 84 || el.atomicNumber === 43 || el.atomicNumber === 61
              ? ' Radioactive — value shown is most stable isotope mass number.'
              : ''}
          </p>
        </Card>

        {/* Ionization Energies */}
<Card title="Ionization Energies">
  {props ? (
    <IonizationChart
      energies={props.allIonizationEnergies}
      elementColor={color}
      elementSymbol={el.symbol}
    />
  ) : <NoData />}
</Card>

{/* Compounds */}
<Card title={`Compounds of ${el.name}`}>
  <CompoundsSection
    atomicNumber={el.atomicNumber}
    elementColor={color}
  />
</Card>

        {/* Coming Soon */}
        <Card title="Coming Soon">
          <div className="space-y-2">
            {[
              'All Ionization Enthalpies',
              'Line Spectra',
              'Nuclear & Isotopes',
              'Periodic Trends Position',
            ].map(item => (
              <div
                key={item}
                className="flex justify-between px-3 py-1.5 rounded bg-gray-800 border border-gray-700"
              >
                <span className="text-gray-500 text-xs">{item}</span>
                <span className="text-gray-600 text-xs">—</span>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}

// ── Layout helpers ──────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
      <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-gray-500 text-sm flex-shrink-0">{label}</span>
      <span className="text-white text-sm text-right">{children}</span>
    </div>
  );
}

function NoData() {
  return <p className="text-gray-600 text-sm italic">Data not available</p>;
}