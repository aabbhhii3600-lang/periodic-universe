'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { elements } from '../../data/elements';
import { categoryColors } from '../../data/elements';
import { nameToSlug } from '../../lib/getElement';

export default function ElementSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter elements based on query
  const results = query.trim().length === 0 ? [] : elements.filter(el => {
    const q = query.toLowerCase();
    return (
      el.name.toLowerCase().startsWith(q) ||
      el.symbol.toLowerCase() === q ||
      el.atomicNumber.toString() === q.trim()
    );
  }).slice(0, 8);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      setSelected(s => Math.min(s + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      setSelected(s => Math.max(s - 1, -1));
    } else if (e.key === 'Enter') {
      const target = selected >= 0 ? results[selected] : results[0];
      if (target) navigate(target.name);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  }

  function navigate(name: string) {
    setQuery('');
    setIsOpen(false);
    setSelected(-1);
    router.push(`/element/${nameToSlug(name)}`);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto mb-6">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
          🔍
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelected(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKey}
          placeholder="Search element by name, symbol or atomic number..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-lg"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden">
          {results.map((el, i) => (
            <button
              key={el.atomicNumber}
              onClick={() => navigate(el.name)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 transition-colors text-left"
              style={{
                backgroundColor: i === selected ? '#1f2937' : 'transparent',
              }}
            >
              {/* Color swatch */}
              <div
                className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-gray-900 font-bold text-xs"
                style={{ backgroundColor: categoryColors[el.category] }}
              >
                {el.symbol}
              </div>

              {/* Name and number */}
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium">{el.name}</div>
                <div className="text-gray-500 text-xs">
                  Z = {el.atomicNumber} · {el.category.replace(/-/g, ' ')}
                </div>
              </div>

              {/* Atomic mass */}
              <div className="text-gray-600 text-xs flex-shrink-0">
                {el.atomicMass} u
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && query.trim().length > 0 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 px-4 py-3">
          <p className="text-gray-500 text-sm">No element found for "{query}"</p>
        </div>
      )}
    </div>
  );
}