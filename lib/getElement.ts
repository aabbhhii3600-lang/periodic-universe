import { elements, Element } from '../data/elements';
import { elementProperties, ElementProperties } from '../data/elementProperties';

export interface FullElement {
  element: Element;
  properties: ElementProperties | null;
}

// Convert name to URL slug: "Hydrogen" → "hydrogen", "Iron" → "iron"
export function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

// Find element by slug
export function getElementBySlug(slug: string): FullElement | null {
  const element = elements.find(
    el => nameToSlug(el.name) === slug.toLowerCase()
  );
  if (!element) return null;
  return {
    element,
    properties: elementProperties[element.atomicNumber] ?? null,
  };
}

// Get prev/next element for navigation
export function getAdjacentElements(atomicNumber: number) {
  const prev = elements.find(el => el.atomicNumber === atomicNumber - 1) ?? null;
  const next = elements.find(el => el.atomicNumber === atomicNumber + 1) ?? null;
  return { prev, next };
}