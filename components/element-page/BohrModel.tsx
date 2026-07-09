'use client';

import { useState } from 'react';

interface Props {
  shells: number[];
  elementSymbol: string;
  elementColor: string;
}

export default function BohrModel({ shells, elementSymbol, elementColor }: Props) {
  const [hoveredShell, setHoveredShell] = useState<number | null>(null);

  // Filter out trailing zero shells (like Pd's empty 5s)
  const activeShells = shells[shells.length - 1] === 0
    ? shells.slice(0, -1)
    : shells;
  const emptyShell = shells[shells.length - 1] === 0;

  const totalShells = shells.length;
  const cx = 200;
  const cy = 200;
  const nucleusR = 22;
  const minOrbitR = 40;
  const orbitSpacing = totalShells <= 4 ? 36 : totalShells <= 6 ? 28 : 22;

  const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 400 400"
        className="w-full max-w-sm"
        style={{ maxHeight: 340 }}
      >
        {/* Orbit rings */}
        {shells.map((_, i) => {
          const r = minOrbitR + i * orbitSpacing;
          const isHovered = hoveredShell === i;
          const isEmpty = i === shells.length - 1 && emptyShell;
          return (
            <circle
              key={`orbit-${i}`}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={isEmpty ? '#374151' : isHovered ? elementColor : '#374151'}
              strokeWidth={isHovered ? 1.5 : 1}
              strokeDasharray={isEmpty ? '4 4' : 'none'}
              style={{ transition: 'stroke 0.2s' }}
            />
          );
        })}

        {/* Electrons */}
        {activeShells.map((count, shellIndex) => {
          const r = minOrbitR + shellIndex * orbitSpacing;
          const isHovered = hoveredShell === shellIndex;

          return Array.from({ length: count }).map((_, electronIndex) => {
            const angle = (2 * Math.PI * electronIndex) / count - Math.PI / 2;
            const ex = cx + r * Math.cos(angle);
            const ey = cy + r * Math.sin(angle);

            return (
              <circle
                key={`e-${shellIndex}-${electronIndex}`}
                cx={ex}
                cy={ey}
                r={isHovered ? 5 : 4}
                fill={isHovered ? elementColor : '#60a5fa'}
                stroke={isHovered ? '#fff' : '#1e40af'}
                strokeWidth={1}
                style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={() => setHoveredShell(shellIndex)}
                onMouseLeave={() => setHoveredShell(null)}
              />
            );
          });
        })}

        {/* Nucleus */}
        <circle
          cx={cx}
          cy={cy}
          r={nucleusR}
          fill={elementColor}
          opacity={0.9}
        />
        <text
          x={cx}
          y={cy + 5}
          textAnchor="middle"
          fontSize={14}
          fontWeight="bold"
          fill="#111"
        >
          {elementSymbol}
        </text>

        {/* Shell hover hit areas — invisible, just for interaction */}
        {shells.map((_, i) => {
          const r = minOrbitR + i * orbitSpacing;
          const innerR = i === 0 ? nucleusR : minOrbitR + (i - 1) * orbitSpacing;
          return (
            <circle
              key={`hit-${i}`}
              cx={cx}
              cy={cy}
              r={r}
              fill="transparent"
              stroke="transparent"
              strokeWidth={orbitSpacing}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredShell(i)}
              onMouseLeave={() => setHoveredShell(null)}
            />
          );
        })}
      </svg>

      {/* Shell info table */}
      <div className="w-full mt-2 space-y-1">
        {shells.map((count, i) => {
          const isHovered = hoveredShell === i;
          const isEmpty = i === shells.length - 1 && emptyShell;
          return (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-1.5 rounded border transition-all cursor-pointer"
              style={{
                backgroundColor: isHovered ? elementColor + '22' : 'transparent',
                borderColor: isHovered ? elementColor : '#374151',
              }}
              onMouseEnter={() => setHoveredShell(i)}
              onMouseLeave={() => setHoveredShell(null)}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold w-5 text-center"
                  style={{ color: isHovered ? elementColor : '#9ca3af' }}
                >
                  {shellNames[i]}
                </span>
                <span className="text-gray-500 text-xs">Shell {i + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-semibold">
                  {isEmpty ? '0' : count}
                </span>
                <span className="text-gray-600 text-xs">
                  {count === 1 ? 'electron' : 'electrons'}
                </span>
                {isEmpty && (
                  <span className="text-yellow-600 text-xs">(empty)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total electron count */}
      <div className="mt-3 text-center">
        <span className="text-gray-500 text-xs">Total electrons: </span>
        <span className="text-white text-sm font-bold">
          {shells.reduce((a, b) => a + b, 0)}
        </span>
      </div>
    </div>
  );
}