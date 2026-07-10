'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { useState, useMemo } from 'react';
import { elements } from '../../data/elements';
import { elementProperties } from '../../data/elementProperties';

// ── Properties available to plot ─────────────────────────────
const PROPERTIES = [
  { key: 'electronegativity',  label: 'Electronegativity (Pauling)',   unit: '',        color: '#60a5fa' },
  { key: 'ionizationEnergy',   label: '1st Ionization Energy',         unit: 'kJ/mol',  color: '#f87171' },
  { key: 'atomicRadius',       label: 'Atomic Radius',                 unit: 'pm',      color: '#34d399' },
  { key: 'meltingPoint',       label: 'Melting Point',                 unit: 'K',       color: '#fb923c' },
  { key: 'boilingPoint',       label: 'Boiling Point',                 unit: 'K',       color: '#a78bfa' },
  { key: 'density',            label: 'Density',                       unit: 'g/cm³',   color: '#facc15' },
] as const;

type PropKey = typeof PROPERTIES[number]['key'];

// Period boundary atomic numbers (last element of each period)
const PERIOD_ENDS = [2, 10, 18, 36, 54, 86, 118];
const PERIOD_LABELS: Record<number, string> = {
  2: 'P1/2', 10: 'P2/3', 18: 'P3/4',
  36: 'P4/5', 54: 'P5/6', 86: 'P6/7',
};

// Custom tooltip
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  if (d.value === null) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-xs shadow-xl">
      <p className="text-white font-bold">{d.symbol} — {d.name}</p>
      <p className="text-gray-300">Z = {d.atomicNumber}</p>
      <p style={{ color: payload[0].color }}>
        {payload[0].value} {d.unit}
      </p>
    </div>
  );
}

interface Props {
  highlightZ?: number | null; // atomic number of selected element
}

export default function TrendsChart({ highlightZ }: Props) {
  const [selectedProp, setSelectedProp] = useState<PropKey>('electronegativity');

  const propMeta = PROPERTIES.find(p => p.key === selectedProp)!;

  // Build chart data — one point per element
  const data = useMemo(() => {
    return elements.map(el => {
      const props = elementProperties[el.atomicNumber];
      const raw = props ? props[selectedProp] : null;
      return {
        atomicNumber: el.atomicNumber,
        symbol: el.symbol,
        name: el.name,
        value: typeof raw === 'number' ? raw : null,
        unit: propMeta.unit,
      };
    });
  }, [selectedProp, propMeta.unit]);

  return (
    <div className="mt-10 px-4">

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-white font-bold text-lg">Periodic Trends</h2>
          <p className="text-gray-500 text-xs mt-0.5">
            Hover any point · null values = data unavailable
          </p>
        </div>

        {/* Property selector */}
        <select
          value={selectedProp}
          onChange={e => setSelectedProp(e.target.value as PropKey)}
          className="bg-gray-800 text-white text-sm border border-gray-600 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
        >
          {PROPERTIES.map(p => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4" style={{ minWidth: 320 }}>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 12, right: 18, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />

            <XAxis
              dataKey="atomicNumber"
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              label={{ value: 'Atomic Number (Z)', position: 'insideBottom', offset: -4, fill: '#6b7280', fontSize: 12 }}
              height={40}
            />

            <YAxis
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              label={{
                value: propMeta.unit ? `${propMeta.label} (${propMeta.unit})` : propMeta.label,
                angle: -90, position: 'insideLeft', offset: 10, fill: '#6b7280', fontSize: 11
              }}
              width={70}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Period boundary lines */}
            {PERIOD_ENDS.map(z => (
              <ReferenceLine
                key={z}
                x={z}
                stroke="#374151"
                strokeDasharray="4 4"
                label={{ value: PERIOD_LABELS[z] ?? '', position: 'top', fill: '#4b5563', fontSize: 9 }}
              />
            ))}

            {/* Highlight selected element */}
            {highlightZ && (
              <ReferenceLine
                x={highlightZ}
                stroke="#ffffff"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                label={{ value: elements.find(e => e.atomicNumber === highlightZ)?.symbol ?? '', position: 'top', fill: '#fff', fontSize: 11 }}
              />
            )}

            <Line
              type="monotone"
              dataKey="value"
              stroke={propMeta.color}
              strokeWidth={2}
              dot={{ r: 3, fill: propMeta.color, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#ffffff', stroke: propMeta.color, strokeWidth: 2 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Property quick-select pills */}
      <div className="flex flex-wrap gap-2 mt-3">
        {PROPERTIES.map(p => (
          <button
            key={p.key}
            onClick={() => setSelectedProp(p.key)}
            className="px-3 py-1 rounded-full text-xs border transition-all"
            style={{
              backgroundColor: selectedProp === p.key ? p.color + '22' : 'transparent',
              borderColor: selectedProp === p.key ? p.color : '#374151',
              color: selectedProp === p.key ? p.color : '#6b7280',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

    </div>
  );
}