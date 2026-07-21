'use client';

import { useState, useMemo } from 'react';

// ── TYPES ──────────────────────────────────────────────────────

interface SpectralLine {
  wavelength_nm: number;
  intensity: number;
  hex_color: string;
  transition?: string;
  series?: string;
  series_line_name?: string;
  n_upper?: number;
  n_lower?: number;
  wavenumber_cm?: number;
}

// ── CONSTANTS ──────────────────────────────────────────────────

const R_H = 1.0973731568539e7; // Rydberg constant in m⁻¹

const SERIES_COLORS: Record<string, string> = {
  'Lyman':     '#c77dff',
  'Balmer':    '#06d6a0',
  'Paschen':   '#ef476f',
  'Brackett':  '#ffd166',
  'Pfund':     '#118ab2',
  'Humphreys': '#ff9f1c',
};

const SERIES_REGIONS: Record<string, string> = {
  'Lyman':     'Ultraviolet — 91 to 122 nm',
  'Balmer':    'Visible + UV — 365 to 656 nm',
  'Paschen':   'Near-Infrared — 820 to 1875 nm',
  'Brackett':  'Infrared — 1458 to 4051 nm',
  'Pfund':     'Far-Infrared — 2279 to 7460 nm',
  'Humphreys': 'Far-Infrared — 3282 to 12368 nm',
};

const SERIES_NAMES: Record<number, string> = {
  1: 'Lyman', 2: 'Balmer', 3: 'Paschen',
  4: 'Brackett', 5: 'Pfund', 6: 'Humphreys',
};

const GREEK = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ'];

// ── NIST SPECTRAL DATA ─────────────────────────────────────────
// Source: NIST Atomic Spectra Database — physics.nist.gov
// Prominent lines only. All wavelengths in nm (air wavelengths).
// Intensities are relative (0–1000 scale).

const ELEMENT_SPECTRA: Record<number, SpectralLine[]> = {
  // Helium (Z=2) — He gas discharge tube spectrum
  2: [
    { wavelength_nm: 388.9, intensity: 500, hex_color: '#6600cc' },
    { wavelength_nm: 447.1, intensity: 200, hex_color: '#3333ff' },
    { wavelength_nm: 471.3, intensity: 100, hex_color: '#0077ff' },
    { wavelength_nm: 492.2, intensity: 100, hex_color: '#00aaff' },
    { wavelength_nm: 501.6, intensity: 100, hex_color: '#00cc88' },
    { wavelength_nm: 587.6, intensity: 1000, hex_color: '#ffdd00', transition: 'D3 line — basis of helium discovery' },
    { wavelength_nm: 667.8, intensity: 200, hex_color: '#ff4400' },
    { wavelength_nm: 706.5, intensity: 500, hex_color: '#cc0000' },
  ],
  // Lithium (Z=3)
  3: [
    { wavelength_nm: 460.3, intensity: 200, hex_color: '#2244ff' },
    { wavelength_nm: 497.2, intensity: 100, hex_color: '#00aacc' },
    { wavelength_nm: 610.4, intensity: 100, hex_color: '#ff8800' },
    { wavelength_nm: 670.8, intensity: 1000, hex_color: '#ff2200', transition: '2p → 2s doublet — crimson red flame' },
    { wavelength_nm: 812.6, intensity: 200, hex_color: '#990000' },
  ],
  // Neon (Z=10) — Neon sign orange-red
  10: [
    { wavelength_nm: 585.2, intensity: 600, hex_color: '#ffcc00' },
    { wavelength_nm: 594.5, intensity: 500, hex_color: '#ffaa00' },
    { wavelength_nm: 607.4, intensity: 500, hex_color: '#ff8800' },
    { wavelength_nm: 614.3, intensity: 400, hex_color: '#ff6600' },
    { wavelength_nm: 616.4, intensity: 400, hex_color: '#ff5500' },
    { wavelength_nm: 621.7, intensity: 300, hex_color: '#ff4400' },
    { wavelength_nm: 626.6, intensity: 800, hex_color: '#ff3300' },
    { wavelength_nm: 630.5, intensity: 600, hex_color: '#ff2200' },
    { wavelength_nm: 638.3, intensity: 700, hex_color: '#ff1100' },
    { wavelength_nm: 640.2, intensity: 1000, hex_color: '#ff0000', transition: 'Brightest neon line' },
    { wavelength_nm: 650.6, intensity: 800, hex_color: '#ee0000' },
    { wavelength_nm: 659.9, intensity: 700, hex_color: '#dd0000' },
    { wavelength_nm: 667.8, intensity: 400, hex_color: '#cc0000' },
    { wavelength_nm: 671.7, intensity: 400, hex_color: '#cc0000' },
    { wavelength_nm: 692.9, intensity: 300, hex_color: '#bb0000' },
    { wavelength_nm: 703.2, intensity: 900, hex_color: '#aa0000' },
    { wavelength_nm: 717.4, intensity: 200, hex_color: '#990000' },
    { wavelength_nm: 724.5, intensity: 300, hex_color: '#880000' },
  ],
  // Sodium (Z=11) — Famous D lines
  11: [
    { wavelength_nm: 568.8, intensity: 200, hex_color: '#ffcc00' },
    { wavelength_nm: 589.0, intensity: 1000, hex_color: '#ffaa00', transition: 'D2: 3p₃/₂ → 3s₁/₂ — streetlight yellow' },
    { wavelength_nm: 589.6, intensity: 1000, hex_color: '#ff9900', transition: 'D1: 3p₁/₂ → 3s₁/₂ — streetlight yellow' },
    { wavelength_nm: 615.4, intensity: 100, hex_color: '#ff6600' },
    { wavelength_nm: 616.1, intensity: 100, hex_color: '#ff5500' },
  ],
  // Magnesium (Z=12)
  12: [
    { wavelength_nm: 383.2, intensity: 200, hex_color: '#8844ff' },
    { wavelength_nm: 383.8, intensity: 200, hex_color: '#8844ff' },
    { wavelength_nm: 516.7, intensity: 200, hex_color: '#00ee44' },
    { wavelength_nm: 517.3, intensity: 300, hex_color: '#00ee44' },
    { wavelength_nm: 518.4, intensity: 500, hex_color: '#00ee33', transition: 'Mg b lines — solar Fraunhofer absorption' },
  ],
  // Argon (Z=18) — Blue-violet discharge
  18: [
    { wavelength_nm: 415.9, intensity: 700, hex_color: '#9900ff' },
    { wavelength_nm: 419.8, intensity: 500, hex_color: '#8800ff' },
    { wavelength_nm: 425.9, intensity: 500, hex_color: '#7700ff' },
    { wavelength_nm: 427.2, intensity: 400, hex_color: '#6600ff' },
    { wavelength_nm: 430.0, intensity: 400, hex_color: '#5500ff' },
    { wavelength_nm: 433.4, intensity: 400, hex_color: '#4400ff' },
    { wavelength_nm: 696.5, intensity: 1000, hex_color: '#cc0000', transition: 'Brightest Ar line' },
    { wavelength_nm: 706.7, intensity: 700, hex_color: '#bb0000' },
    { wavelength_nm: 714.7, intensity: 400, hex_color: '#aa0000' },
    { wavelength_nm: 727.3, intensity: 500, hex_color: '#990000' },
    { wavelength_nm: 738.4, intensity: 400, hex_color: '#880000' },
    { wavelength_nm: 750.4, intensity: 900, hex_color: '#880000' },
    { wavelength_nm: 763.5, intensity: 800, hex_color: '#770000' },
  ],
  // Potassium (Z=19)
  19: [
    { wavelength_nm: 404.4, intensity: 300, hex_color: '#9900ff' },
    { wavelength_nm: 404.7, intensity: 300, hex_color: '#9900ff' },
    { wavelength_nm: 693.9, intensity: 100, hex_color: '#cc0000' },
    { wavelength_nm: 766.5, intensity: 1000, hex_color: '#990000', transition: '4p₃/₂ → 4s — violet flame' },
    { wavelength_nm: 769.9, intensity: 1000, hex_color: '#880000', transition: '4p₁/₂ → 4s — violet flame' },
  ],
  // Calcium (Z=20)
  20: [
    { wavelength_nm: 393.4, intensity: 1000, hex_color: '#7700ff', transition: 'Ca K line — strongest solar absorption' },
    { wavelength_nm: 396.8, intensity: 800, hex_color: '#8800ff', transition: 'Ca H line — solar absorption' },
    { wavelength_nm: 422.7, intensity: 1000, hex_color: '#5500ff', transition: 'Brick-red flame line' },
    { wavelength_nm: 430.8, intensity: 100, hex_color: '#4400ff' },
    { wavelength_nm: 616.2, intensity: 100, hex_color: '#ff5500' },
  ],
  // Iron (Z=26) — Complex spectrum, many lines
  26: [
    { wavelength_nm: 371.9, intensity: 600, hex_color: '#aa44ff' },
    { wavelength_nm: 373.5, intensity: 500, hex_color: '#9944ff' },
    { wavelength_nm: 374.6, intensity: 500, hex_color: '#9944ff' },
    { wavelength_nm: 382.0, intensity: 400, hex_color: '#7744ff' },
    { wavelength_nm: 382.4, intensity: 400, hex_color: '#7744ff' },
    { wavelength_nm: 404.6, intensity: 300, hex_color: '#9900ff' },
    { wavelength_nm: 406.4, intensity: 200, hex_color: '#8800ff' },
    { wavelength_nm: 438.4, intensity: 300, hex_color: '#4444ff' },
    { wavelength_nm: 440.5, intensity: 300, hex_color: '#4455ff' },
    { wavelength_nm: 516.7, intensity: 200, hex_color: '#00ee44' },
    { wavelength_nm: 526.9, intensity: 200, hex_color: '#44ee00' },
    { wavelength_nm: 532.8, intensity: 200, hex_color: '#55ee00' },
    { wavelength_nm: 538.3, intensity: 200, hex_color: '#66ff00' },
  ],
  // Copper (Z=29)
  29: [
    { wavelength_nm: 406.3, intensity: 200, hex_color: '#9900ff' },
    { wavelength_nm: 427.5, intensity: 100, hex_color: '#5500ff' },
    { wavelength_nm: 465.1, intensity: 100, hex_color: '#0055ff' },
    { wavelength_nm: 510.6, intensity: 300, hex_color: '#00cc44' },
    { wavelength_nm: 515.3, intensity: 200, hex_color: '#00dd33' },
    { wavelength_nm: 521.8, intensity: 200, hex_color: '#44dd00' },
    { wavelength_nm: 578.2, intensity: 100, hex_color: '#ffcc00' },
  ],
  // Zinc (Z=30)
  30: [
    { wavelength_nm: 468.0, intensity: 200, hex_color: '#2299ff' },
    { wavelength_nm: 472.2, intensity: 200, hex_color: '#1188ff' },
    { wavelength_nm: 481.1, intensity: 200, hex_color: '#00aaff' },
    { wavelength_nm: 636.2, intensity: 100, hex_color: '#ff3300' },
  ],
  // Barium (Z=56) — Green/blue-green flame
  56: [
    { wavelength_nm: 455.4, intensity: 1000, hex_color: '#2255ff' },
    { wavelength_nm: 493.4, intensity: 500, hex_color: '#00aacc' },
    { wavelength_nm: 553.5, intensity: 800, hex_color: '#aaee00', transition: 'Brightest Ba line — green flame' },
    { wavelength_nm: 614.2, intensity: 300, hex_color: '#ff6600' },
    { wavelength_nm: 649.7, intensity: 100, hex_color: '#ff2200' },
  ],
  // Mercury (Z=80) — Fluorescent lamp spectrum
  80: [
    { wavelength_nm: 365.0, intensity: 500, hex_color: '#bb00ff', transition: 'UV — causes fluorescence' },
    { wavelength_nm: 404.7, intensity: 500, hex_color: '#9900ff' },
    { wavelength_nm: 435.8, intensity: 1000, hex_color: '#3300ff', transition: 'Bright violet-blue line' },
    { wavelength_nm: 546.1, intensity: 1000, hex_color: '#55ff00', transition: 'Bright green line — dominant in Hg lamps' },
    { wavelength_nm: 577.0, intensity: 500, hex_color: '#ffee00' },
    { wavelength_nm: 579.1, intensity: 500, hex_color: '#ffdd00', transition: 'Yellow doublet' },
    { wavelength_nm: 623.4, intensity: 100, hex_color: '#ff4400' },
  ],
};

// ── UTILITY FUNCTIONS ──────────────────────────────────────────

function wavelengthToColor(lambda: number): string {
  if (lambda < 380) return '#bb00ff';
  if (lambda > 780) return '#8B0000';
  let r = 0, g = 0, b = 0;
  if (lambda < 440) { r = (440 - lambda) / 60; b = 1; }
  else if (lambda < 490) { g = (lambda - 440) / 50; b = 1; }
  else if (lambda < 510) { g = 1; b = (510 - lambda) / 20; }
  else if (lambda < 580) { r = (lambda - 510) / 70; g = 1; }
  else if (lambda < 645) { r = 1; g = (645 - lambda) / 65; }
  else { r = 1; }
  let f = 1;
  if (lambda < 420) f = 0.3 + 0.7 * (lambda - 380) / 40;
  else if (lambda > 700) f = 0.3 + 0.7 * (780 - lambda) / 80;
  const h = (c: number) => Math.round(Math.min(255, c * 255 * f)).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

function nmToWavenumber(nm: number): number {
  return Math.round(1e7 / nm);
}

function nmToFrequencyTHz(nm: number): string {
  return (3e8 / (nm * 1e-9) / 1e12).toFixed(2);
}

function nmToEV(nm: number): string {
  return (1240 / nm).toFixed(3);
}

function calculateHydrogenLines(): SpectralLine[] {
  const lines: SpectralLine[] = [];
  for (let nl = 1; nl <= 6; nl++) {
    for (let nu = nl + 1; nu <= nl + 8; nu++) {
      const wn_m = R_H * (1 / (nl * nl) - 1 / (nu * nu));
      const lambda_nm = Math.round((1e9 / wn_m) * 10) / 10;
      const wn_cm = Math.round(wn_m / 100);
      const greek = nu - nl <= GREEK.length ? GREEK[nu - nl - 1] : `n${nu}`;
      lines.push({
        wavelength_nm: lambda_nm,
        wavenumber_cm: wn_cm,
        intensity: Math.max(50, Math.round(1000 / (nu - nl + 0.5))),
        hex_color: wavelengthToColor(lambda_nm),
        series: SERIES_NAMES[nl],
        series_line_name: `${SERIES_NAMES[nl]} ${greek}`,
        n_upper: nu,
        n_lower: nl,
        transition: `n = ${nu} → n = ${nl}`,
      });
    }
  }
  return lines;
}

// ── SPECTRUM BAR ───────────────────────────────────────────────

function SpectrumBar({
  lines,
  selectedLine,
  onSelectLine,
  unit,
  minNm,
  maxNm,
}: {
  lines: SpectralLine[];
  selectedLine: SpectralLine | null;
  onSelectLine: (line: SpectralLine) => void;
  unit: 'nm' | 'cm';
  minNm: number;
  maxNm: number;
}) {
  const W = 700;
  const H = 90;

  function x(nm: number) {
    return ((nm - minNm) / (maxNm - minNm)) * W;
  }

  const visStart = x(380);
  const visEnd = x(780);

  const tickNm = [200, 300, 380, 400, 450, 500, 550, 600, 650, 700, 780, 900, 1000];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full min-w-96">
        {/* Dark background */}
        <rect width={W} height={H} rx={6} fill="#080810" />

        {/* Visible light gradient overlay */}
        <defs>
          <linearGradient id="vis" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8B00FF" stopOpacity="0.20" />
            <stop offset="0.15" stopColor="#0000FF" stopOpacity="0.20" />
            <stop offset="0.30" stopColor="#00FFFF" stopOpacity="0.20" />
            <stop offset="0.50" stopColor="#00FF00" stopOpacity="0.20" />
            <stop offset="0.65" stopColor="#FFFF00" stopOpacity="0.20" />
            <stop offset="0.80" stopColor="#FF7700" stopOpacity="0.20" />
            <stop offset="1"    stopColor="#FF0000" stopOpacity="0.20" />
          </linearGradient>
        </defs>
        {visStart < W && visEnd > 0 && (
          <rect
            x={Math.max(0, visStart)}
            width={Math.min(W, visEnd) - Math.max(0, visStart)}
            height={H}
            fill="url(#vis)"
          />
        )}

        {/* UV / Visible / IR boundary lines */}
        {visStart > 0 && visStart < W && (
          <>
            <line x1={visStart} y1={0} x2={visStart} y2={H} stroke="#444" strokeWidth={0.8} strokeDasharray="3,2" />
            <text x={visStart + 3} y={10} fontSize={7} fill="#555">380 nm</text>
          </>
        )}
        {visEnd > 0 && visEnd < W && (
          <>
            <line x1={visEnd} y1={0} x2={visEnd} y2={H} stroke="#444" strokeWidth={0.8} strokeDasharray="3,2" />
            <text x={visEnd - 40} y={10} fontSize={7} fill="#555">780 nm</text>
          </>
        )}

        {/* Region labels */}
        {visStart > 30 && (
          <text x={visStart / 2} y={H - 5} textAnchor="middle" fontSize={8} fill="#444">UV</text>
        )}
        {visEnd < W - 20 && (
          <text x={(visEnd + W) / 2} y={H - 5} textAnchor="middle" fontSize={8} fill="#444">IR</text>
        )}
        <text x={(visStart + visEnd) / 2} y={H - 5} textAnchor="middle" fontSize={8} fill="#555">Visible</text>

        {/* Tick marks */}
        {tickNm.map(nm => {
          const xp = x(nm);
          if (xp < 0 || xp > W) return null;
          const label = unit === 'nm' ? `${nm}` : `${nmToWavenumber(nm).toLocaleString()}`;
          return (
            <g key={nm}>
              <line x1={xp} y1={H - 8} x2={xp} y2={H} stroke="#333" strokeWidth={0.5} />
              <text x={xp} y={H + 13} textAnchor="middle" fontSize={6.5} fill="#555">{label}</text>
            </g>
          );
        })}

        {/* Unit label */}
        <text x={W} y={H + 13} textAnchor="end" fontSize={7} fill="#444">
          {unit === 'nm' ? 'λ (nm)' : 'ν̃ (cm⁻¹)'}
        </text>

        {/* Spectral lines */}
        {lines.map((line, i) => {
          const xp = x(line.wavelength_nm);
          if (xp < -2 || xp > W + 2) return null;
          const isSelected =
            selectedLine?.wavelength_nm === line.wavelength_nm &&
            selectedLine?.series === line.series;
          const frac = Math.max(0.15, line.intensity / 1000);
          const lineH = Math.round(frac * (H - 16));
          return (
            <g key={i} style={{ cursor: 'pointer' }} onClick={() => onSelectLine(line)}>
              {/* Glow effect for selected */}
              {isSelected && (
                <line
                  x1={xp} y1={H - lineH - 5}
                  x2={xp} y2={H}
                  stroke={line.hex_color}
                  strokeWidth={6}
                  opacity={0.2}
                />
              )}
              {/* Main line */}
              <line
                x1={xp} y1={H - lineH}
                x2={xp} y2={H}
                stroke={line.hex_color}
                strokeWidth={isSelected ? 2.5 : 1.5}
                opacity={isSelected ? 1 : 0.85}
              />
              {/* Selected dot at top */}
              {isSelected && (
                <circle cx={xp} cy={H - lineH - 4} r={3.5} fill={line.hex_color} />
              )}
              {/* Wide invisible click area */}
              <line x1={xp} y1={0} x2={xp} y2={H} stroke="transparent" strokeWidth={10} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── HYDROGEN BOHR TRANSITION DIAGRAM ──────────────────────────

function HydrogenBohrDiagram({ line }: { line: SpectralLine | null }) {
  const cx = 145, cy = 145;
  // Radii for shells n=1..7
  const R = [0, 22, 44, 66, 88, 108, 125, 140];

  const nl = line?.n_lower ?? 2;
  const nu = line?.n_upper ?? 3;
  const photonColor = line?.hex_color ?? '#888';

  return (
    <svg viewBox="0 0 290 290" className="w-full max-w-xs mx-auto">
      <rect width={290} height={290} fill="#060610" rx={10} />

      {/* Orbit rings */}
      {[1, 2, 3, 4, 5, 6].map(n => (
        <g key={n}>
          <circle
            cx={cx} cy={cy} r={R[n]}
            fill="none"
            stroke={n === nl ? '#06d6a0' : n === nu ? '#c77dff' : '#1a1a2e'}
            strokeWidth={n === nl || n === nu ? 1.8 : 1}
          />
          <text
            x={cx + R[n] + 2}
            y={cy - 2}
            fontSize={8}
            fill={n === nl ? '#06d6a0' : n === nu ? '#c77dff' : '#2a2a4e'}
          >
            n={n}
          </text>
        </g>
      ))}

      {/* Nucleus */}
      <circle cx={cx} cy={cy} r={9} fill="#ff6644" />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={7} fill="white" fontWeight="bold">H</text>

      {line && (
        <>
          {/* Dashed arc from nu to nl (transition path) */}
          <path
            d={`M ${cx} ${cy - R[Math.min(nu, 6)]}
                A ${R[Math.min(nu, 6)] + 15} ${R[Math.min(nu, 6)] + 15} 0 0 1
                  ${cx + R[Math.min(nu, 6)] * 0.7} ${cy - R[Math.min(nu, 6)] * 0.7}`}
            fill="none"
            stroke={photonColor}
            strokeWidth={1.2}
            strokeDasharray="4,3"
            opacity={0.7}
          />
          <path
            d={`M ${cx + R[Math.min(nu, 6)] * 0.7} ${cy - R[Math.min(nu, 6)] * 0.7}
                A ${R[Math.min(nl, 6)] + 15} ${R[Math.min(nl, 6)] + 15} 0 0 1
                  ${cx + R[Math.min(nl, 6)]} ${cy}`}
            fill="none"
            stroke={photonColor}
            strokeWidth={1.2}
            strokeDasharray="4,3"
            opacity={0.7}
          />

          {/* Arrow head at lower orbit */}
          <polygon
            points={`${cx + R[Math.min(nl, 6)]} ${cy},
                     ${cx + R[Math.min(nl, 6)] - 4} ${cy - 5},
                     ${cx + R[Math.min(nl, 6)] - 4} ${cy + 5}`}
            fill={photonColor}
            opacity={0.8}
          />

          {/* Electron at upper orbit */}
          <circle
            cx={cx}
            cy={cy - R[Math.min(nu, 6)]}
            r={5}
            fill="#c77dff"
            stroke="white"
            strokeWidth={1}
          />
          <text
            x={cx + 7}
            y={cy - R[Math.min(nu, 6)] - 5}
            fontSize={7}
            fill="#c77dff"
          >
            e⁻ (before)
          </text>

          {/* Electron at lower orbit */}
          <circle
            cx={cx + R[Math.min(nl, 6)]}
            cy={cy}
            r={5}
            fill="#06d6a0"
            stroke="white"
            strokeWidth={1}
          />
          <text
            x={cx + R[Math.min(nl, 6)] + 7}
            y={cy + 4}
            fontSize={7}
            fill="#06d6a0"
          >
            e⁻ (after)
          </text>

          {/* Photon leaving */}
          <circle
            cx={Math.min(270, cx + R[Math.min(nu, 6)] + 28)}
            cy={cy - R[Math.min(nu, 6)] * 0.3}
            r={8}
            fill={photonColor}
            opacity={0.9}
          />
          <text
            x={Math.min(270, cx + R[Math.min(nu, 6)] + 28)}
            y={cy - R[Math.min(nu, 6)] * 0.3 + 4}
            textAnchor="middle"
            fontSize={8}
            fill="#000"
            fontWeight="bold"
          >
            hν
          </text>

          {/* Series label */}
          <text x={145} y={278} textAnchor="middle" fontSize={9} fill={SERIES_COLORS[line.series ?? ''] ?? '#aaa'}>
            {line.series_line_name}
          </text>
        </>
      )}

      {!line && (
        <text x={145} y={cy + R[6] + 25} textAnchor="middle" fontSize={9} fill="#333">
          Select a spectral line above
        </text>
      )}
    </svg>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────

interface Props {
  atomicNumber: number;
  elementColor: string;
  elementName: string;
}

export default function SpectraViewer({ atomicNumber, elementColor, elementName }: Props) {
  const [unit, setUnit] = useState<'nm' | 'cm'>('nm');
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [selectedLine, setSelectedLine] = useState<SpectralLine | null>(null);
  const [range, setRange] = useState<'visible' | 'uv-vis' | 'full'>('uv-vis');

  const isHydrogen = atomicNumber === 1;
  const hasData = isHydrogen || ELEMENT_SPECTRA[atomicNumber] !== undefined;

  const allHLines = useMemo(() => calculateHydrogenLines(), []);

  const lines = useMemo(() => {
    if (isHydrogen) {
      return selectedSeries ? allHLines.filter(l => l.series === selectedSeries) : allHLines;
    }
    return ELEMENT_SPECTRA[atomicNumber] ?? [];
  }, [atomicNumber, isHydrogen, selectedSeries, allHLines]);

  const [minNm, maxNm] = range === 'visible' ? [380, 780] : range === 'uv-vis' ? [200, 800] : [100, 1200];

  if (!hasData) {
    return (
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 text-center">
        <div className="text-4xl mb-3">🔭</div>
  
        <p className="text-gray-400 text-sm font-medium">
          Spectral data coming for {elementName}
        </p>
  
        <p className="text-gray-600 text-xs mt-1">
          Lines will be added from the NIST Atomic Spectra Database.
        </p>
  
        <a
          href={`https://physics.nist.gov/cgi-bin/ASD/lines1.pl?spectra=${encodeURIComponent(elementName)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-xs text-blue-400 hover:text-blue-300 underline"
        >
          View raw NIST data for {elementName} →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">

        {/* Unit toggle */}
        <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-0.5 border border-gray-700">
          {(['nm', 'cm'] as const).map(u => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className="px-3 py-1.5 rounded text-xs font-mono font-bold transition-all"
              style={{
                backgroundColor: unit === u ? elementColor : 'transparent',
                color: unit === u ? '#000' : '#6b7280',
              }}
            >
              {u === 'nm' ? 'λ  nm' : 'ν̃  cm⁻¹'}
            </button>
          ))}
        </div>

        {/* Range toggle */}
        <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-0.5 border border-gray-700">
          {([
            { k: 'visible', l: 'Visible' },
            { k: 'uv-vis', l: 'UV + Visible' },
            { k: 'full', l: 'Full range' },
          ] as const).map(({ k, l }) => (
            <button
              key={k}
              onClick={() => setRange(k)}
              className="px-2 py-1.5 rounded text-xs transition-all"
              style={{
                backgroundColor: range === k ? elementColor + '22' : 'transparent',
                color: range === k ? elementColor : '#6b7280',
                border: range === k ? `1px solid ${elementColor}` : '1px solid transparent',
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Hydrogen series selector */}
      {isHydrogen && (
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Select Spectral Series</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setSelectedSeries(null); setSelectedLine(null); }}
              className="px-3 py-1 rounded-full text-xs border transition-all"
              style={{
                backgroundColor: !selectedSeries ? '#ffffff22' : 'transparent',
                borderColor: !selectedSeries ? '#ffffff66' : '#374151',
                color: !selectedSeries ? '#ffffff' : '#6b7280',
              }}
            >
              All series
            </button>
            {Object.entries(SERIES_NAMES).map(([n, name]) => (
              <button
                key={n}
                onClick={() => { setSelectedSeries(selectedSeries === name ? null : name); setSelectedLine(null); }}
                className="px-3 py-1 rounded-full text-xs border transition-all"
                style={{
                  backgroundColor: selectedSeries === name ? SERIES_COLORS[name] + '22' : 'transparent',
                  borderColor: selectedSeries === name ? SERIES_COLORS[name] : '#374151',
                  color: selectedSeries === name ? SERIES_COLORS[name] : '#6b7280',
                }}
              >
                {name} (n₁={n})
              </button>
            ))}
          </div>
          {selectedSeries && (
            <p className="text-xs mt-1" style={{ color: SERIES_COLORS[selectedSeries] }}>
              {SERIES_REGIONS[selectedSeries]}
            </p>
          )}
        </div>
      )}

      {/* Spectrum bar */}
      <div className="bg-gray-950 rounded-xl border border-gray-800 p-3">
        <p className="text-gray-600 text-xs mb-2">
          Emission spectrum — click any line to see details
          {!isHydrogen && ` · ${lines.length} prominent lines (NIST ASD)`}
        </p>
        <SpectrumBar
          lines={lines}
          selectedLine={selectedLine}
          onSelectLine={setSelectedLine}
          unit={unit}
          minNm={minNm}
          maxNm={maxNm}
        />
      </div>

      {/* Detail + Bohr diagram (side by side for H) */}
      <div className={`grid gap-4 ${isHydrogen ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>

        {/* Line details */}
        {selectedLine ? (
          <div
            className="rounded-xl border p-4 space-y-3"
            style={{
              borderColor: selectedLine.hex_color + '55',
              backgroundColor: selectedLine.hex_color + '0d',
            }}
          >
            {/* Color swatch + name */}
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-14 rounded flex-shrink-0"
                style={{
                  backgroundColor: selectedLine.hex_color,
                  boxShadow: `0 0 12px ${selectedLine.hex_color}`,
                }}
              />
              <div>
                <div className="text-white font-bold">
                  {selectedLine.series_line_name ?? `${elementName} — ${selectedLine.wavelength_nm} nm`}
                </div>
                {selectedLine.transition && (
                  <div className="text-gray-400 text-xs mt-0.5">{selectedLine.transition}</div>
                )}
                <div className="text-xs mt-1" style={{ color: selectedLine.hex_color }}>
                  {selectedLine.wavelength_nm >= 380 && selectedLine.wavelength_nm <= 780
                    ? '● Visible light'
                    : selectedLine.wavelength_nm < 380
                    ? '● Ultraviolet'
                    : '● Infrared'}
                </div>
              </div>
            </div>

            {/* 4-box grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-900 rounded-lg p-2 border border-gray-800">
                <div className="text-gray-500 text-xs">Wavelength (λ)</div>
                <div className="text-white font-mono font-bold">
                  {selectedLine.wavelength_nm.toFixed(1)} nm
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-2 border border-gray-800">
                <div className="text-gray-500 text-xs">Wavenumber (ν̃)</div>
                <div className="text-white font-mono font-bold">
                  {(selectedLine.wavenumber_cm ?? nmToWavenumber(selectedLine.wavelength_nm)).toLocaleString()} cm⁻¹
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-2 border border-gray-800">
                <div className="text-gray-500 text-xs">Frequency (ν)</div>
                <div className="text-white font-mono text-sm">
                  {nmToFrequencyTHz(selectedLine.wavelength_nm)} THz
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-2 border border-gray-800">
                <div className="text-gray-500 text-xs">Photon Energy</div>
                <div className="text-white font-mono text-sm">
                  {nmToEV(selectedLine.wavelength_nm)} eV
                </div>
              </div>
              {isHydrogen && selectedLine.n_upper && selectedLine.n_lower && (
                <>
                  <div className="bg-gray-900 rounded-lg p-2 border border-gray-800">
                    <div className="text-gray-500 text-xs">Upper level</div>
                    <div className="font-bold" style={{ color: '#c77dff' }}>
                      n = {selectedLine.n_upper}
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-2 border border-gray-800">
                    <div className="text-gray-500 text-xs">Lower level</div>
                    <div className="font-bold" style={{ color: '#06d6a0' }}>
                      n = {selectedLine.n_lower}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Conversion reminder */}
            <div className="bg-gray-900 rounded p-2 border border-gray-800">
              <p className="text-gray-500 text-xs">
                <span className="text-gray-400 font-mono">ν̃ (cm⁻¹) = 10⁷ / λ (nm)</span>
                {' '}&nbsp;·&nbsp;{' '}
                <span className="text-gray-400 font-mono">E (eV) = 1240 / λ (nm)</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-800 p-6 flex flex-col items-center justify-center gap-2">
            <div className="text-3xl">👆</div>
            <p className="text-gray-600 text-sm">Click any line on the spectrum</p>
            <p className="text-gray-700 text-xs">See wavelength, wavenumber, frequency, energy</p>
          </div>
        )}

        {/* Hydrogen Bohr transition diagram */}
        {isHydrogen && (
          <div className="bg-gray-950 rounded-xl border border-gray-800 p-3">
            <p className="text-gray-600 text-xs text-center mb-2">
              Electron Transition (Bohr Model)
            </p>
            <HydrogenBohrDiagram line={selectedLine} />
          </div>
        )}
      </div>

      {/* Hydrogen lines table for selected series */}
      {isHydrogen && selectedSeries && (
        <div className="bg-gray-950 rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-800">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: SERIES_COLORS[selectedSeries] }}>
              {selectedSeries} Series — Complete Line Table
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-600 border-b border-gray-800">
                  <th className="text-left px-3 py-2">Line</th>
                  <th className="text-left px-3 py-2">Transition</th>
                  <th className="text-right px-3 py-2">λ (nm)</th>
                  <th className="text-right px-3 py-2">ν̃ (cm⁻¹)</th>
                  <th className="text-right px-3 py-2">E (eV)</th>
                  <th className="text-right px-3 py-2">Region</th>
                </tr>
              </thead>
              <tbody>
                {allHLines
                  .filter(l => l.series === selectedSeries)
                  .map((line, i) => {
                    const isSelected = selectedLine?.series_line_name === line.series_line_name;
                    return (
                      <tr
                        key={i}
                        onClick={() => setSelectedLine(line)}
                        className="border-b border-gray-900 cursor-pointer hover:bg-gray-800 transition-colors"
                        style={{ backgroundColor: isSelected ? '#ffffff0d' : undefined }}
                      >
                        <td className="px-3 py-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: line.hex_color }}
                            />
                            <span className="text-white font-medium">{line.series_line_name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-1.5 font-mono text-gray-400">
                          n={line.n_upper} → n={line.n_lower}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono text-white">
                          {line.wavelength_nm.toFixed(1)}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono text-gray-300">
                          {(line.wavenumber_cm ?? 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono text-gray-400">
                          {nmToEV(line.wavelength_nm)}
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          <span className="px-1.5 py-0.5 rounded text-gray-500 bg-gray-900">
                            {line.wavelength_nm < 380 ? 'UV' : line.wavelength_nm > 780 ? 'IR' : 'Visible'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notable line notes */}
      {atomicNumber === 11 && (
        <div className="bg-yellow-950 border border-yellow-900 rounded-xl p-3">
          <p className="text-yellow-300 text-xs leading-relaxed">
            <span className="font-bold">Sodium D lines (589.0 & 589.6 nm):</span> The famous yellow doublet.
            Produced by 3p → 3s transitions in Na. Fraunhofer found these as dark absorption lines in sunlight (1814),
            proving Na exists in the Sun. Their 0.6 nm separation was early evidence for electron spin (fine structure splitting).
            Basis of sodium streetlamps.
          </p>
        </div>
      )}
      {atomicNumber === 20 && (
        <div className="bg-purple-950 border border-purple-900 rounded-xl p-3">
          <p className="text-purple-300 text-xs leading-relaxed">
            <span className="font-bold">Calcium H & K lines (393.4 & 396.8 nm):</span> Two of the strongest
            Fraunhofer absorption lines in the solar spectrum. Discovered by Fraunhofer (1815) as dark lines
            in sunlight. Later identified as Ca absorption, proving Ca exists in the solar atmosphere.
            Used by astronomers to determine stellar composition and radial velocity (Doppler shift of these lines).
          </p>
        </div>
      )}
      {atomicNumber === 80 && (
        <div className="bg-green-950 border border-green-900 rounded-xl p-3">
          <p className="text-green-300 text-xs leading-relaxed">
            <span className="font-bold">Mercury spectrum:</span> The 546.1 nm green and 435.8 nm blue lines
            dominate fluorescent lamps. UV lines (253.7 nm) excite the phosphor coating which emits white light.
            The yellow doublet (577/579 nm) is used as a standard wavelength reference in spectroscopy.
          </p>
        </div>
      )}

    </div>
  );
}