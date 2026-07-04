'use client';

import { useState } from 'react';
import { elements, categoryColors, categoryLabels, ElementCategory, Element } from '../../data/elements';
import ElementDetailPanel from '../element-card/ElementDetailPanel';

function getGridRow(ypos: number): number {
  if (ypos <= 7) return ypos;
  if (ypos === 8) return 9;
  return 10;
}

function ElementCell({
  el,
  isSelected,
  onClick,
}: {
  el: Element;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        gridColumn: el.xpos,
        gridRow: getGridRow(el.ypos),
        backgroundColor: categoryColors[el.category],
        outline: isSelected ? '2px solid white' : 'none',
        outlineOffset: '-2px',
      }}
      className="
        relative cursor-pointer rounded-sm
        border border-black border-opacity-20
        hover:scale-110 hover:z-10 transition-transform duration-150
        flex flex-col items-center justify-between
        p-[2px] overflow-hidden
      "
    >
      <span className="self-start text-[9px] font-semibold text-gray-800 leading-none">
        {el.atomicNumber}
      </span>
      <span className="text-sm font-bold text-gray-900 leading-none">
        {el.symbol}
      </span>
      <span className="text-[7px] text-gray-700 leading-none text-center w-full truncate">
        {el.name}
      </span>
      <span className="text-[7px] text-gray-600 leading-none">
        {el.atomicMass}
      </span>
    </div>
  );
}

interface PeriodicTableProps {
  onElementSelect?: (atomicNumber: number | null) => void;
}

export default function PeriodicTable({ onElementSelect }: PeriodicTableProps) {
  const [selected, setSelected] = useState<Element | null>(null);

  function handleClick(el: Element) {
    const next = selected?.atomicNumber === el.atomicNumber ? null : el;
    setSelected(next);
    onElementSelect?.(next?.atomicNumber ?? null);
  }

  return (
    <div className="w-full overflow-x-auto pb-6">

      {/* Grid */}
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
          <ElementCell
            key={el.atomicNumber}
            el={el}
            isSelected={selected?.atomicNumber === el.atomicNumber}
            onClick={() => handleClick(el)}
          />
        ))}
      </div>

      {/* Legend */}
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

      {/* Detail panel — only renders when an element is selected */}
      {selected && (
        <ElementDetailPanel
          element={selected}
          onClose={() => setSelected(null)}
        />
      )}

    </div>
  );
}