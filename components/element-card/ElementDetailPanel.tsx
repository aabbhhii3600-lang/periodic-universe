'use client';

import { Element, categoryColors, categoryLabels, isRadioactive } from '../../data/elements';
import { getElementProperties, kelvinToCelsius } from '../../data/elementProperties';

interface Props {
  element: Element;
  onClose: () => void;
}

const stateLabel: Record<string, string> = {
  solid: '⬛ Solid', liquid: '💧 Liquid', gas: '💨 Gas', unknown: '❓ Unknown',
};

export default function ElementDetailPanel({ element: el, onClose }: Props) {
  const radioactive = isRadioactive(el.atomicNumber);
  const color = categoryColors[el.category];
  const props = getElementProperties(el.atomicNumber);

  return (
    <>
    <div className="fixed inset-0 z-40" style={{backgroundColor: 'rgba(0,0,0,0.3)'}} onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-96 bg-gray-950 border-l border-gray-700 z-50 overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="relative p-6" style={{ backgroundColor: color }}>
          <button onClick={onClose} className="absolute top-3 right-4 text-gray-800 hover:text-black text-2xl font-bold">✕</button>
          <div className="text-gray-900">
            <div className="text-7xl font-black leading-none">{el.symbol}</div>
            <div className="text-xl font-bold mt-2">{el.name}</div>
            <div className="text-sm mt-1 opacity-75">Z = {el.atomicNumber} · A = {el.atomicMass} u</div>
            {radioactive && (
              <span className="mt-2 inline-block bg-black bg-opacity-25 text-xs px-2 py-0.5 rounded-full">
                ☢ Radioactive
              </span>
            )}
          </div>
        </div>

        <div className="p-5 space-y-4">

          {/* Identity */}
          <Section title="Identity">
            <Row label="Category">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                {categoryLabels[el.category]}
              </div>
            </Row>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <Mini label="Period">{el.period}</Mini>
              <Mini label="Group">{el.group ?? '—'}</Mini>
              <Mini label="Block">{el.block.toUpperCase()}-block</Mini>
            </div>
            <Row label="State at 298 K">{stateLabel[el.standardState]}</Row>
          </Section>

          {/* Electronic Configuration */}
          <Section title="Electronic Configuration">
            {props ? (
              <div className="bg-gray-900 rounded p-3 border border-gray-800">
                <p className="text-white text-sm tracking-wide">
                  {props.electronicConfig}
                </p>
              </div>
            ) : <Unavailable />}
          </Section>

          {/* Key Chemical Properties */}
          <Section title="Chemical Properties">
            {props ? (
              <div className="space-y-2">
                <Row label="Electronegativity (Pauling)">
                  {props.electronegativity !== null
                    ? <Bar value={props.electronegativity} max={4.0} label={props.electronegativity.toFixed(2)} />
                    : <span className="text-gray-500 text-sm">Not defined</span>}
                </Row>
                <Row label="1st Ionization Energy">
                  {props.ionizationEnergy !== null
                    ? <>{props.ionizationEnergy.toLocaleString()} kJ/mol</>
                    : <span className="text-gray-500">—</span>}
                </Row>
                <Row label="Common Oxidation States">
                  <div className="flex flex-wrap gap-1 mt-1">
                    {props.oxidationStates.map(os => (
                      <span key={os}
                        className="px-2 py-0.5 rounded text-xs font-bold border"
                        style={{
                          backgroundColor: os > 0 ? '#1e3a5f' : os < 0 ? '#3b1f1f' : '#1f2d1f',
                          borderColor: os > 0 ? '#3b82f6' : os < 0 ? '#ef4444' : '#22c55e',
                          color: os > 0 ? '#93c5fd' : os < 0 ? '#fca5a5' : '#86efac',
                        }}>
                        {os > 0 ? `+${os}` : os}
                      </span>
                    ))}
                  </div>
                </Row>
              </div>
            ) : <Unavailable />}
          </Section>

          {/* Physical Properties */}
          <Section title="Physical Properties">
            {props ? (
              <div className="space-y-2">
                <Row label="Atomic Radius">
                  {props.atomicRadius !== null
                    ? <>{props.atomicRadius} pm</>
                    : <span className="text-gray-500">—</span>}
                </Row>
                <Row label="Density">
                  {props.density !== null
                    ? <>{props.density} g/cm³</>
                    : <span className="text-gray-500">—</span>}
                </Row>
                <Row label="Melting Point">
                  {props.meltingPoint !== null
                    ? <>{props.meltingPoint} K ({kelvinToCelsius(props.meltingPoint)} °C)</>
                    : <span className="text-gray-500">—</span>}
                </Row>
                <Row label="Boiling Point">
                  {props.boilingPoint !== null
                    ? <>{props.boilingPoint} K ({kelvinToCelsius(props.boilingPoint)} °C)</>
                    : <span className="text-gray-500">—</span>}
                </Row>
              </div>
            ) : <Unavailable />}
          </Section>

          {/* Coming soon */}
          <Section title="Coming Soon">
            <div className="space-y-1">
              {['Ionization Enthalpies (all)', 'Bohr Model', 'Compounds', 'Spectra', 'Trends Chart'].map(item => (
                <div key={item} className="flex justify-between px-3 py-1.5 rounded bg-gray-900 border border-gray-800">
                  <span className="text-gray-500 text-xs">{item}</span>
                  <span className="text-gray-700 text-xs">—</span>
                </div>
              ))}
            </div>
          </Section>

        </div>
      </div>
    </>
  );
}

// ── Layout helpers ──────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-gray-400 text-xs uppercase tracking-widest mb-2 border-b border-gray-800 pb-1">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-gray-500 text-xs mb-0.5">{label}</div>
      <div className="text-white text-sm">{children}</div>
    </div>
  );
}

function Mini({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 rounded p-2 border border-gray-800 text-center">
      <div className="text-gray-500 text-xs mb-1">{label}</div>
      <div className="text-white text-sm font-semibold">{children}</div>
    </div>
  );
}

function Bar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-white text-sm w-8 text-right">{label}</span>
    </div>
  );
}

function Unavailable() {
  return <p className="text-gray-600 text-xs italic">Data not available</p>;
}