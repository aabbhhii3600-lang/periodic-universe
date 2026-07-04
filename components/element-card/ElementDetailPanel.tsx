'use client';

import { Element, categoryColors, categoryLabels, isRadioactive } from '../../data/elements';

interface Props {
  element: Element;
  onClose: () => void;
}

const stateLabel: Record<string, string> = {
  solid:   '⬛ Solid',
  liquid:  '💧 Liquid',
  gas:     '💨 Gas',
  unknown: '❓ Unknown',
};

export default function ElementDetailPanel({ element: el, onClose }: Props) {
  const radioactive = isRadioactive(el.atomicNumber);
  const color = categoryColors[el.category];

  return (
    <>
      {/* Dark backdrop — click to close */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-40"
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div className="fixed top-0 right-0 h-full w-80 bg-gray-950 border-l border-gray-700 z-50 overflow-y-auto shadow-2xl">

        {/* Coloured header */}
        <div className="relative p-6" style={{ backgroundColor: color }}>
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-800 hover:text-black text-2xl font-bold"
          >
            ✕
          </button>

          <div className="text-gray-900">
            <div className="text-7xl font-black leading-none">{el.symbol}</div>
            <div className="text-xl font-bold mt-2">{el.name}</div>
            <div className="text-sm mt-1 opacity-75">Z = {el.atomicNumber}</div>
            {radioactive && (
              <span className="mt-2 inline-block bg-black bg-opacity-25 text-gray-900 text-xs px-2 py-0.5 rounded-full">
                ☢ Radioactive
              </span>
            )}
          </div>
        </div>

        {/* Properties */}
        <div className="p-5 space-y-5">

          {/* Category */}
          <Row label="Category">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
              <span>{categoryLabels[el.category]}</span>
            </div>
          </Row>

          {/* Atomic mass */}
          <Row label="Atomic Mass">
            {el.atomicMass} u
            {radioactive && <span className="text-gray-500 text-xs ml-1">(most stable isotope)</span>}
          </Row>

          {/* Period / Group / Block */}
          <div className="grid grid-cols-3 gap-3">
            <MiniRow label="Period">{el.period}</MiniRow>
            <MiniRow label="Group">{el.group ?? '—'}</MiniRow>
            <MiniRow label="Block">{el.block.toUpperCase()}-block</MiniRow>
          </div>

          {/* Standard state */}
          <Row label="State at 298 K">
            {stateLabel[el.standardState]}
          </Row>

          {/* Divider */}
          <div className="border-t border-gray-800 pt-4">
            <p className="text-gray-600 text-xs uppercase tracking-wider mb-3">
              More data — coming soon
            </p>
            <div className="space-y-2">
              {[
                'Electronic Configuration',
                'Ionization Enthalpy',
                'Electronegativity',
                'Atomic Radius',
                'Melting & Boiling Point',
                'Compounds',
              ].map((prop) => (
                <div
                  key={prop}
                  className="flex justify-between items-center px-3 py-2 rounded bg-gray-900 border border-gray-800"
                >
                  <span className="text-gray-400 text-xs">{prop}</span>
                  <span className="text-gray-700 text-xs">—</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

// ── Small reusable layout helpers ─────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</div>
      <div className="text-white text-sm">{children}</div>
    </div>
  );
}

function MiniRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 rounded p-2 border border-gray-800">
      <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</div>
      <div className="text-white text-sm">{children}</div>
    </div>
  );
}