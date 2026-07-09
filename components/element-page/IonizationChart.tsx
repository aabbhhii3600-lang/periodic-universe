'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface Props {
  energies: number[];
  elementColor: string;
  elementSymbol: string;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-xs shadow-xl">
      <p className="text-white font-bold">IE{d.order}</p>
      <p className="text-gray-300">{d.value.toLocaleString()} kJ/mol</p>
      {d.isJump && (
        <p className="text-yellow-400 mt-1">⚡ Large jump — shell boundary</p>
      )}
    </div>
  );
}

export default function IonizationChart({ energies, elementColor, elementSymbol }: Props) {
  if (!energies || energies.length === 0) {
    return (
      <p className="text-gray-600 text-sm italic">
        Full ionization data not yet available for this element.
      </p>
    );
  }

  // Detect large jumps (ratio > 2.5x previous)
  const data = energies.map((val, i) => {
    const prev = i > 0 ? energies[i - 1] : null;
    const isJump = prev !== null && val / prev > 2.5;
    return {
      order: i + 1,
      value: val,
      label: `IE${i + 1}`,
      isJump,
    };
  });

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="label"
            stroke="#6b7280"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            scale="log"
            domain={['auto','auto']}
            tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
            label={{
              value: 'kJ/mol',
              angle: -90,
              position: 'insideLeft',
              fill: '#6b7280',
              fontSize: 10,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[3, 3, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.isJump ? '#f59e0b' : elementColor}
                opacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Jump explanation */}
      {data.some(d => d.isJump) && (
        <div className="mt-2 flex items-start gap-2 bg-yellow-950 border border-yellow-800 rounded p-2">
          <span className="text-yellow-400 text-sm">⚡</span>
          <p className="text-yellow-300 text-xs">
            Yellow bars show large jumps in ionization energy — these indicate
            a shell boundary. The next electron being removed is from a
            closer, more tightly held shell.
          </p>
        </div>
      )}
    </div>
  );
}