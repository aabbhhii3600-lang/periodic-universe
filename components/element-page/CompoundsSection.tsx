'use client';

import { useState, useEffect } from 'react';

interface Compound {
  id: number;
  formula: string;
  name_common: string;
  name_iupac: string;
  cas_number: string;
  oxidation_state_of_element: number;
  compound_class: string;
  molecular_mass: number;
  physical_state_298k: string;
  color: string;
  appearance: string;
  odor: string;
  melting_point: number | null;
  boiling_point: number | null;
  density: number | null;
  solubility_in_water: string;
  molecular_geometry: string;
  electron_pair_geometry: string;
  hybridization: string;
  bond_angle: string;
  vsepr_notation: string;
  is_polar: boolean | null;
  dipole_moment: number | null;
  is_acid: boolean;
  is_base: boolean;
  is_amphoteric: boolean;
  acid_base_notes: string;
  std_enthalpy_formation: number | null;
  std_gibbs_free_energy: number | null;
  std_entropy: number | null;
  lattice_energy: number | null;
  ghs_hazard_codes: string;
  nfpa_health: number | null;
  nfpa_flammability: number | null;
  nfpa_reactivity: number | null;
  is_toxic: boolean;
  is_carcinogenic: boolean;
  environmental_impact: string;
  uses: string;
  industrial_production_method: string;
  notes: string;
}

interface Props {
  atomicNumber: number;
  elementColor: string;
}

const CLASS_LABELS: Record<string, string> = {
  oxide: 'Oxide',
  hydroxide: 'Hydroxide',
  halide: 'Halide',
  hydride: 'Hydride',
  oxoacid: 'Oxoacid',
  salt: 'Salt',
  sulfide: 'Sulfide',
  nitride: 'Nitride',
  carbide: 'Carbide',
  complex: 'Complex',
};

const STATE_ICON: Record<string, string> = {
  solid: '⬛',
  liquid: '💧',
  gas: '💨',
  unknown: '❓',
};

const NFPA_COLORS: Record<string, string> = {
  health: '#003FFF',
  flammability: '#FF0000',
  reactivity: '#FFFF00',
};

function NfpaBox({ value, type }: { value: number | null; type: string }) {
  if (value === null) return null;
  return (
    <div
      className="w-7 h-7 flex items-center justify-center rounded text-xs font-black"
      style={{
        backgroundColor: NFPA_COLORS[type],
        color: type === 'reactivity' ? '#000' : '#fff',
      }}
    >
      {value}
    </div>
  );
}

function CompoundCard({ compound, color }: { compound: Compound; color: string }) {
  const [expanded, setExpanded] = useState(false);

  const osSign = compound.oxidation_state_of_element > 0
    ? `+${compound.oxidation_state_of_element}`
    : `${compound.oxidation_state_of_element}`;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">

      {/* Header */}
      <div className="p-4" style={{ borderLeft: `4px solid ${color}` }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-bold text-lg">{compound.formula}</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded border font-bold"
                style={{
                  borderColor: compound.oxidation_state_of_element > 0 ? '#3b82f6' :
                    compound.oxidation_state_of_element < 0 ? '#ef4444' : '#22c55e',
                  color: compound.oxidation_state_of_element > 0 ? '#93c5fd' :
                    compound.oxidation_state_of_element < 0 ? '#fca5a5' : '#86efac',
                  backgroundColor: compound.oxidation_state_of_element > 0 ? '#1e3a5f' :
                    compound.oxidation_state_of_element < 0 ? '#3b1f1f' : '#1f2d1f',
                }}
              >
                {osSign}
              </span>
              {compound.is_toxic && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-red-950 border border-red-800 text-red-400">
                  ⚠ Toxic
                </span>
              )}
              {compound.is_amphoteric && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-400">
                  Amphoteric
                </span>
              )}
            </div>
            <div className="text-gray-300 text-sm mt-0.5">{compound.name_common}</div>
            {compound.name_iupac && compound.name_iupac !== compound.name_common && (
              <div className="text-gray-500 text-xs mt-0.5">IUPAC: {compound.name_iupac}</div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="text-gray-500 text-xs">
              {CLASS_LABELS[compound.compound_class] ?? compound.compound_class}
            </span>
            <span className="text-gray-600 text-xs">
              {STATE_ICON[compound.physical_state_298k]} {compound.physical_state_298k}
            </span>
          </div>
        </div>

        {/* Quick properties row */}
        <div className="flex flex-wrap gap-3 mt-3">
          {compound.molecular_mass && (
            <span className="text-gray-400 text-xs">M = {compound.molecular_mass} g/mol</span>
          )}
          {compound.cas_number && (
            <span className="text-gray-600 text-xs">CAS: {compound.cas_number}</span>
          )}
          {compound.color && compound.color !== 'colorless' && (
            <span className="text-gray-400 text-xs">Color: {compound.color}</span>
          )}
        </div>

        {/* Acid-base nature */}
        <div className="flex gap-2 mt-2">
          {compound.is_acid && (
            <span className="text-xs px-2 py-0.5 rounded bg-orange-950 border border-orange-800 text-orange-300">
              Acid
            </span>
          )}
          {compound.is_base && (
            <span className="text-xs px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
              Base
            </span>
          )}
          {!compound.is_acid && !compound.is_base && !compound.is_amphoteric && (
            <span className="text-xs px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-500">
              Neutral
            </span>
          )}
        </div>
      </div>

      {/* Expandable details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2 text-left text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors border-t border-gray-800 flex items-center justify-between"
      >
        <span>{expanded ? 'Hide details' : 'Show all data'}</span>
        <span>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-800">

          {/* Acid-base notes */}
          {compound.acid_base_notes && (
            <div className="mt-3">
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                Acid-Base Character
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">
                {compound.acid_base_notes}
              </p>
            </div>
          )}

          {/* Structure & Bonding */}
          {(compound.molecular_geometry || compound.hybridization) && (
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                Structure & Bonding
              </div>
              <div className="grid grid-cols-2 gap-2">
                {compound.molecular_geometry && (
                  <Detail label="Shape" value={compound.molecular_geometry} />
                )}
                {compound.electron_pair_geometry && (
                  <Detail label="Electron pair geometry" value={compound.electron_pair_geometry} />
                )}
                {compound.hybridization && (
                  <Detail label="Hybridization" value={compound.hybridization} />
                )}
                {compound.bond_angle && (
                  <Detail label="Bond angle" value={compound.bond_angle} />
                )}
                {compound.vsepr_notation && (
                  <Detail label="VSEPR" value={compound.vsepr_notation} />
                )}
                {compound.is_polar !== null && (
                  <Detail label="Polar" value={compound.is_polar ? 'Yes' : 'No'} />
                )}
                {compound.dipole_moment !== null && compound.dipole_moment !== undefined && (
                  <Detail label="Dipole moment" value={`${compound.dipole_moment} D`} />
                )}
              </div>
            </div>
          )}

          {/* Physical Properties */}
          <div>
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">
              Physical Properties
            </div>
            <div className="grid grid-cols-2 gap-2">
              {compound.melting_point && (
                <Detail label="Melting point" value={`${compound.melting_point} K`} />
              )}
              {compound.boiling_point && (
                <Detail label="Boiling point" value={`${compound.boiling_point} K`} />
              )}
              {compound.density && (
                <Detail label="Density" value={`${compound.density} g/cm³`} />
              )}
              {compound.solubility_in_water && (
                <Detail label="Solubility" value={compound.solubility_in_water} />
              )}
              {compound.appearance && (
                <Detail label="Appearance" value={compound.appearance} />
              )}
              {compound.odor && compound.odor !== 'Odorless' && (
                <Detail label="Odor" value={compound.odor} />
              )}
            </div>
          </div>

          {/* Thermodynamic Data */}
          {(compound.std_enthalpy_formation !== null ||
            compound.std_gibbs_free_energy !== null) && (
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                Thermodynamic Data (298K)
              </div>
              <div className="grid grid-cols-2 gap-2">
                {compound.std_enthalpy_formation !== null && (
                  <Detail
                    label="ΔHf°"
                    value={`${compound.std_enthalpy_formation} kJ/mol`}
                  />
                )}
                {compound.std_gibbs_free_energy !== null && (
                  <Detail
                    label="ΔGf°"
                    value={`${compound.std_gibbs_free_energy} kJ/mol`}
                  />
                )}
                {compound.std_entropy !== null && (
                  <Detail
                    label="S°"
                    value={`${compound.std_entropy} J/(mol·K)`}
                  />
                )}
                {compound.lattice_energy !== null && (
                  <Detail
                    label="Lattice energy"
                    value={`${compound.lattice_energy} kJ/mol`}
                  />
                )}
              </div>
            </div>
          )}

          {/* Safety */}
          <div>
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Safety</div>
            <div className="flex items-center gap-3 flex-wrap">
              {(compound.nfpa_health !== null ||
                compound.nfpa_flammability !== null ||
                compound.nfpa_reactivity !== null) && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 text-xs mr-1">NFPA:</span>
                  <NfpaBox value={compound.nfpa_health} type="health" />
                  <NfpaBox value={compound.nfpa_flammability} type="flammability" />
                  <NfpaBox value={compound.nfpa_reactivity} type="reactivity" />
                  <span className="text-gray-600 text-xs ml-1">H/F/R</span>
                </div>
              )}
              {compound.ghs_hazard_codes && compound.ghs_hazard_codes !== 'None' && (
                <span className="text-yellow-400 text-xs">GHS: {compound.ghs_hazard_codes}</span>
              )}
              {compound.is_carcinogenic && (
                <span className="text-red-400 text-xs">⚠ Carcinogenic</span>
              )}
            </div>
            {compound.environmental_impact && (
              <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                🌍 {compound.environmental_impact}
              </p>
            )}
          </div>

          {/* Uses */}
          {compound.uses && (
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Uses</div>
              <p className="text-gray-300 text-xs leading-relaxed">{compound.uses}</p>
            </div>
          )}

          {/* Production */}
          {compound.industrial_production_method && (
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                Industrial Production
              </div>
              <p className="text-gray-300 text-xs leading-relaxed font-mono">
                {compound.industrial_production_method}
              </p>
            </div>
          )}

          {/* Notes */}
          {compound.notes && (
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Notes</div>
              <p className="text-gray-400 text-xs leading-relaxed italic">{compound.notes}</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-800 rounded p-2">
      <div className="text-gray-500 text-xs mb-0.5">{label}</div>
      <div className="text-white text-xs">{value}</div>
    </div>
  );
}

export default function CompoundsSection({ atomicNumber, elementColor }: Props) {
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeClass, setActiveClass] = useState<string>('all');

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    fetch(`${apiUrl}/api/v1/elements/${atomicNumber}/compounds`)
      .then(res => res.json())
      .then(data => {
        setCompounds(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load compound data.');
        setLoading(false);
      });
  }, [atomicNumber]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-400 text-sm">{error}</p>;
  }

  if (compounds.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
        <p className="text-gray-500 text-sm">No compound data available yet for this element.</p>
        <p className="text-gray-600 text-xs mt-1">Data is being added progressively.</p>
      </div>
    );
  }

  // Get unique compound classes
  const classes = ['all', ...Array.from(new Set(compounds.map(c => c.compound_class)))];

  const filtered = activeClass === 'all'
    ? compounds
    : compounds.filter(c => c.compound_class === activeClass);

  return (
    <div>
      {/* Class filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {classes.map(cls => (
          <button
            key={cls}
            onClick={() => setActiveClass(cls)}
            className="px-3 py-1 rounded-full text-xs border transition-all"
            style={{
              backgroundColor: activeClass === cls ? elementColor + '22' : 'transparent',
              borderColor: activeClass === cls ? elementColor : '#374151',
              color: activeClass === cls ? elementColor : '#6b7280',
            }}
          >
            {cls === 'all' ? `All (${compounds.length})` : CLASS_LABELS[cls] ?? cls}
          </button>
        ))}
      </div>

      {/* Compound cards */}
      <div className="space-y-3">
        {filtered.map(compound => (
          <CompoundCard
            key={compound.id}
            compound={compound}
            color={elementColor}
          />
        ))}
      </div>
    </div>
  );
}