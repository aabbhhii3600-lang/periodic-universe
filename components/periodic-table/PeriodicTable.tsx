'use client';

import { elements, categoryColors, categoryLabels, ElementCategory, Element } from '../../data/elements';

// Lanthanides (ypos=8) and actinides (ypos=9) get pushed down
// one extra row to create a visible gap between main table and f-block
function getGridRow(ypos: number): number {
  if (ypos <= 7) return ypos;
  if (ypos === 8) return 9;   // lanthanides — row 8 is left empty as gap
  return 10;                   // actinides
}

function ElementCell({ el }: { el: Element }) {
  return (
    <div
      style={{
        gridColumn: el.xpos,
        gridRow: getGridRow(el.ypos),
        backgroundColor: categoryColors[el.category],
      }}
      className="
        relative cursor-pointer rounded-sm
        border border-black border-opacity-20
        hover:scale-110 hover:z-10 transition-transform duration-150
        flex flex-col items-center justify-between
        p-[2px] overflow-hidden
      "
    >
      {/* Atomic number — top left */}
      <span className="self-start text-[9px] font-semibold text-gray-800 leading-none">
        {el.atomicNumber}
      </span>

      {/* Symbol — center, largest text */}
      <span className="text-sm font-bold text-gray-900 leading-none">
        {el.symbol}
      </span>

      {/* Name — small, may truncate on small screens */}
      <span className="text-[7px] text-gray-700 leading-none text-center w-full truncate">
        {el.name}
      </span>

      {/* Atomic mass — bottom */}
      <span className="text-[6px] text-gray-600 leading-none">
        {el.atomicMass}
      </span>
    </div>
  );
}

export default function PeriodicTable() {
  return (
    <div className="w-full overflow-x-auto pb-6">

      {/* ── Periodic Table Grid ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(18, minmax(54px, 1fr))',
          gridTemplateRows: 'repeat(10, 62px)',
          gap: '2px',
          minWidth: '900px',
        }}
      >
        {elements.map((el) => (
          <ElementCell key={el.atomicNumber} el={el} />
        ))}
      </div>

      {/* ── Legend ── */}
      <div className="mt-8 flex flex-wrap gap-3 justify-center px-4">
        {(Object.entries(categoryColors) as [ElementCategory, string][]).map(
          ([cat, color]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <div
                className="w-3.5 h-3.5 rounded-sm border border-gray-500 flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-300 whitespace-nowrap">
                {categoryLabels[cat]}
              </span>
            </div>
          )
        )}
      </div>

    </div>
  );
}//