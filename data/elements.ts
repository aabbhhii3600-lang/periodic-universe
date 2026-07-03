// ============================================================
// PERIODIC UNIVERSE — Core Element Data
// Source: IUPAC 2021 atomic weights, NIST element data
// DO NOT edit values without cross-checking against
// CRC Handbook or NIST (https://www.nist.gov)
// ============================================================

export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

export type Block = 's' | 'p' | 'd' | 'f';
export type StandardState = 'solid' | 'liquid' | 'gas' | 'unknown';

export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  category: ElementCategory;
  period: number;
  group: number | null;  // null for lanthanides and actinides in standard table
  block: Block;
  atomicMass: number;    // standard atomic weight (u); for radioactive elements = most stable isotope mass number
  standardState: StandardState; // physical state at 298 K, 1 atm
  xpos: number;          // column in display grid (1–18)
  ypos: number;          // row in display grid (1–7 main table; 8 = lanthanides; 9 = actinides)
}

export const elements: Element[] = [

  // ─── PERIOD 1 ───────────────────────────────────────────
  { atomicNumber: 1,   symbol: 'H',  name: 'Hydrogen',      category: 'nonmetal',             period: 1, group: 1,    block: 's', atomicMass: 1.008,    standardState: 'gas',     xpos: 1,  ypos: 1 },
  { atomicNumber: 2,   symbol: 'He', name: 'Helium',         category: 'noble-gas',            period: 1, group: 18,   block: 's', atomicMass: 4.003,    standardState: 'gas',     xpos: 18, ypos: 1 },

  // ─── PERIOD 2 ───────────────────────────────────────────
  { atomicNumber: 3,   symbol: 'Li', name: 'Lithium',        category: 'alkali-metal',         period: 2, group: 1,    block: 's', atomicMass: 6.941,    standardState: 'solid',   xpos: 1,  ypos: 2 },
  { atomicNumber: 4,   symbol: 'Be', name: 'Beryllium',      category: 'alkaline-earth-metal', period: 2, group: 2,    block: 's', atomicMass: 9.012,    standardState: 'solid',   xpos: 2,  ypos: 2 },
  { atomicNumber: 5,   symbol: 'B',  name: 'Boron',          category: 'metalloid',            period: 2, group: 13,   block: 'p', atomicMass: 10.811,   standardState: 'solid',   xpos: 13, ypos: 2 },
  { atomicNumber: 6,   symbol: 'C',  name: 'Carbon',         category: 'nonmetal',             period: 2, group: 14,   block: 'p', atomicMass: 12.011,   standardState: 'solid',   xpos: 14, ypos: 2 },
  { atomicNumber: 7,   symbol: 'N',  name: 'Nitrogen',       category: 'nonmetal',             period: 2, group: 15,   block: 'p', atomicMass: 14.007,   standardState: 'gas',     xpos: 15, ypos: 2 },
  { atomicNumber: 8,   symbol: 'O',  name: 'Oxygen',         category: 'nonmetal',             period: 2, group: 16,   block: 'p', atomicMass: 15.999,   standardState: 'gas',     xpos: 16, ypos: 2 },
  { atomicNumber: 9,   symbol: 'F',  name: 'Fluorine',       category: 'halogen',              period: 2, group: 17,   block: 'p', atomicMass: 18.998,   standardState: 'gas',     xpos: 17, ypos: 2 },
  { atomicNumber: 10,  symbol: 'Ne', name: 'Neon',           category: 'noble-gas',            period: 2, group: 18,   block: 'p', atomicMass: 20.180,   standardState: 'gas',     xpos: 18, ypos: 2 },

  // ─── PERIOD 3 ───────────────────────────────────────────
  { atomicNumber: 11,  symbol: 'Na', name: 'Sodium',         category: 'alkali-metal',         period: 3, group: 1,    block: 's', atomicMass: 22.990,   standardState: 'solid',   xpos: 1,  ypos: 3 },
  { atomicNumber: 12,  symbol: 'Mg', name: 'Magnesium',      category: 'alkaline-earth-metal', period: 3, group: 2,    block: 's', atomicMass: 24.305,   standardState: 'solid',   xpos: 2,  ypos: 3 },
  { atomicNumber: 13,  symbol: 'Al', name: 'Aluminum',       category: 'post-transition-metal',period: 3, group: 13,   block: 'p', atomicMass: 26.982,   standardState: 'solid',   xpos: 13, ypos: 3 },
  { atomicNumber: 14,  symbol: 'Si', name: 'Silicon',        category: 'metalloid',            period: 3, group: 14,   block: 'p', atomicMass: 28.085,   standardState: 'solid',   xpos: 14, ypos: 3 },
  { atomicNumber: 15,  symbol: 'P',  name: 'Phosphorus',     category: 'nonmetal',             period: 3, group: 15,   block: 'p', atomicMass: 30.974,   standardState: 'solid',   xpos: 15, ypos: 3 },
  { atomicNumber: 16,  symbol: 'S',  name: 'Sulfur',         category: 'nonmetal',             period: 3, group: 16,   block: 'p', atomicMass: 32.065,   standardState: 'solid',   xpos: 16, ypos: 3 },
  { atomicNumber: 17,  symbol: 'Cl', name: 'Chlorine',       category: 'halogen',              period: 3, group: 17,   block: 'p', atomicMass: 35.453,   standardState: 'gas',     xpos: 17, ypos: 3 },
  { atomicNumber: 18,  symbol: 'Ar', name: 'Argon',          category: 'noble-gas',            period: 3, group: 18,   block: 'p', atomicMass: 39.948,   standardState: 'gas',     xpos: 18, ypos: 3 },

  // ─── PERIOD 4 ───────────────────────────────────────────
  { atomicNumber: 19,  symbol: 'K',  name: 'Potassium',      category: 'alkali-metal',         period: 4, group: 1,    block: 's', atomicMass: 39.098,   standardState: 'solid',   xpos: 1,  ypos: 4 },
  { atomicNumber: 20,  symbol: 'Ca', name: 'Calcium',        category: 'alkaline-earth-metal', period: 4, group: 2,    block: 's', atomicMass: 40.078,   standardState: 'solid',   xpos: 2,  ypos: 4 },
  { atomicNumber: 21,  symbol: 'Sc', name: 'Scandium',       category: 'transition-metal',     period: 4, group: 3,    block: 'd', atomicMass: 44.956,   standardState: 'solid',   xpos: 3,  ypos: 4 },
  { atomicNumber: 22,  symbol: 'Ti', name: 'Titanium',       category: 'transition-metal',     period: 4, group: 4,    block: 'd', atomicMass: 47.867,   standardState: 'solid',   xpos: 4,  ypos: 4 },
  { atomicNumber: 23,  symbol: 'V',  name: 'Vanadium',       category: 'transition-metal',     period: 4, group: 5,    block: 'd', atomicMass: 50.942,   standardState: 'solid',   xpos: 5,  ypos: 4 },
  { atomicNumber: 24,  symbol: 'Cr', name: 'Chromium',       category: 'transition-metal',     period: 4, group: 6,    block: 'd', atomicMass: 51.996,   standardState: 'solid',   xpos: 6,  ypos: 4 },
  { atomicNumber: 25,  symbol: 'Mn', name: 'Manganese',      category: 'transition-metal',     period: 4, group: 7,    block: 'd', atomicMass: 54.938,   standardState: 'solid',   xpos: 7,  ypos: 4 },
  { atomicNumber: 26,  symbol: 'Fe', name: 'Iron',           category: 'transition-metal',     period: 4, group: 8,    block: 'd', atomicMass: 55.845,   standardState: 'solid',   xpos: 8,  ypos: 4 },
  { atomicNumber: 27,  symbol: 'Co', name: 'Cobalt',         category: 'transition-metal',     period: 4, group: 9,    block: 'd', atomicMass: 58.933,   standardState: 'solid',   xpos: 9,  ypos: 4 },
  { atomicNumber: 28,  symbol: 'Ni', name: 'Nickel',         category: 'transition-metal',     period: 4, group: 10,   block: 'd', atomicMass: 58.693,   standardState: 'solid',   xpos: 10, ypos: 4 },
  { atomicNumber: 29,  symbol: 'Cu', name: 'Copper',         category: 'transition-metal',     period: 4, group: 11,   block: 'd', atomicMass: 63.546,   standardState: 'solid',   xpos: 11, ypos: 4 },
  { atomicNumber: 30,  symbol: 'Zn', name: 'Zinc',           category: 'transition-metal',     period: 4, group: 12,   block: 'd', atomicMass: 65.38,    standardState: 'solid',   xpos: 12, ypos: 4 },
  { atomicNumber: 31,  symbol: 'Ga', name: 'Gallium',        category: 'post-transition-metal',period: 4, group: 13,   block: 'p', atomicMass: 69.723,   standardState: 'solid',   xpos: 13, ypos: 4 },
  { atomicNumber: 32,  symbol: 'Ge', name: 'Germanium',      category: 'metalloid',            period: 4, group: 14,   block: 'p', atomicMass: 72.630,   standardState: 'solid',   xpos: 14, ypos: 4 },
  { atomicNumber: 33,  symbol: 'As', name: 'Arsenic',        category: 'metalloid',            period: 4, group: 15,   block: 'p', atomicMass: 74.922,   standardState: 'solid',   xpos: 15, ypos: 4 },
  { atomicNumber: 34,  symbol: 'Se', name: 'Selenium',       category: 'nonmetal',             period: 4, group: 16,   block: 'p', atomicMass: 78.971,   standardState: 'solid',   xpos: 16, ypos: 4 },
  { atomicNumber: 35,  symbol: 'Br', name: 'Bromine',        category: 'halogen',              period: 4, group: 17,   block: 'p', atomicMass: 79.904,   standardState: 'liquid',  xpos: 17, ypos: 4 },
  { atomicNumber: 36,  symbol: 'Kr', name: 'Krypton',        category: 'noble-gas',            period: 4, group: 18,   block: 'p', atomicMass: 83.798,   standardState: 'gas',     xpos: 18, ypos: 4 },

  // ─── PERIOD 5 ───────────────────────────────────────────
  { atomicNumber: 37,  symbol: 'Rb', name: 'Rubidium',       category: 'alkali-metal',         period: 5, group: 1,    block: 's', atomicMass: 85.468,   standardState: 'solid',   xpos: 1,  ypos: 5 },
  { atomicNumber: 38,  symbol: 'Sr', name: 'Strontium',      category: 'alkaline-earth-metal', period: 5, group: 2,    block: 's', atomicMass: 87.62,    standardState: 'solid',   xpos: 2,  ypos: 5 },
  { atomicNumber: 39,  symbol: 'Y',  name: 'Yttrium',        category: 'transition-metal',     period: 5, group: 3,    block: 'd', atomicMass: 88.906,   standardState: 'solid',   xpos: 3,  ypos: 5 },
  { atomicNumber: 40,  symbol: 'Zr', name: 'Zirconium',      category: 'transition-metal',     period: 5, group: 4,    block: 'd', atomicMass: 91.224,   standardState: 'solid',   xpos: 4,  ypos: 5 },
  { atomicNumber: 41,  symbol: 'Nb', name: 'Niobium',        category: 'transition-metal',     period: 5, group: 5,    block: 'd', atomicMass: 92.906,   standardState: 'solid',   xpos: 5,  ypos: 5 },
  { atomicNumber: 42,  symbol: 'Mo', name: 'Molybdenum',     category: 'transition-metal',     period: 5, group: 6,    block: 'd', atomicMass: 95.96,    standardState: 'solid',   xpos: 6,  ypos: 5 },
  { atomicNumber: 43,  symbol: 'Tc', name: 'Technetium',     category: 'transition-metal',     period: 5, group: 7,    block: 'd', atomicMass: 98,       standardState: 'solid',   xpos: 7,  ypos: 5 },
  { atomicNumber: 44,  symbol: 'Ru', name: 'Ruthenium',      category: 'transition-metal',     period: 5, group: 8,    block: 'd', atomicMass: 101.07,   standardState: 'solid',   xpos: 8,  ypos: 5 },
  { atomicNumber: 45,  symbol: 'Rh', name: 'Rhodium',        category: 'transition-metal',     period: 5, group: 9,    block: 'd', atomicMass: 102.906,  standardState: 'solid',   xpos: 9,  ypos: 5 },
  { atomicNumber: 46,  symbol: 'Pd', name: 'Palladium',      category: 'transition-metal',     period: 5, group: 10,   block: 'd', atomicMass: 106.42,   standardState: 'solid',   xpos: 10, ypos: 5 },
  { atomicNumber: 47,  symbol: 'Ag', name: 'Silver',         category: 'transition-metal',     period: 5, group: 11,   block: 'd', atomicMass: 107.868,  standardState: 'solid',   xpos: 11, ypos: 5 },
  { atomicNumber: 48,  symbol: 'Cd', name: 'Cadmium',        category: 'transition-metal',     period: 5, group: 12,   block: 'd', atomicMass: 112.411,  standardState: 'solid',   xpos: 12, ypos: 5 },
  { atomicNumber: 49,  symbol: 'In', name: 'Indium',         category: 'post-transition-metal',period: 5, group: 13,   block: 'p', atomicMass: 114.818,  standardState: 'solid',   xpos: 13, ypos: 5 },
  { atomicNumber: 50,  symbol: 'Sn', name: 'Tin',            category: 'post-transition-metal',period: 5, group: 14,   block: 'p', atomicMass: 118.710,  standardState: 'solid',   xpos: 14, ypos: 5 },
  { atomicNumber: 51,  symbol: 'Sb', name: 'Antimony',       category: 'metalloid',            period: 5, group: 15,   block: 'p', atomicMass: 121.760,  standardState: 'solid',   xpos: 15, ypos: 5 },
  { atomicNumber: 52,  symbol: 'Te', name: 'Tellurium',      category: 'metalloid',            period: 5, group: 16,   block: 'p', atomicMass: 127.60,   standardState: 'solid',   xpos: 16, ypos: 5 },
  { atomicNumber: 53,  symbol: 'I',  name: 'Iodine',         category: 'halogen',              period: 5, group: 17,   block: 'p', atomicMass: 126.904,  standardState: 'solid',   xpos: 17, ypos: 5 },
  { atomicNumber: 54,  symbol: 'Xe', name: 'Xenon',          category: 'noble-gas',            period: 5, group: 18,   block: 'p', atomicMass: 131.293,  standardState: 'gas',     xpos: 18, ypos: 5 },

  // ─── PERIOD 6 (main table) ───────────────────────────────
  { atomicNumber: 55,  symbol: 'Cs', name: 'Cesium',         category: 'alkali-metal',         period: 6, group: 1,    block: 's', atomicMass: 132.905,  standardState: 'solid',   xpos: 1,  ypos: 6 },
  { atomicNumber: 56,  symbol: 'Ba', name: 'Barium',         category: 'alkaline-earth-metal', period: 6, group: 2,    block: 's', atomicMass: 137.327,  standardState: 'solid',   xpos: 2,  ypos: 6 },
  // Z=57–71 (lanthanides) are in ypos=8 — see below
  { atomicNumber: 72,  symbol: 'Hf', name: 'Hafnium',        category: 'transition-metal',     period: 6, group: 4,    block: 'd', atomicMass: 178.49,   standardState: 'solid',   xpos: 4,  ypos: 6 },
  { atomicNumber: 73,  symbol: 'Ta', name: 'Tantalum',       category: 'transition-metal',     period: 6, group: 5,    block: 'd', atomicMass: 180.948,  standardState: 'solid',   xpos: 5,  ypos: 6 },
  { atomicNumber: 74,  symbol: 'W',  name: 'Tungsten',       category: 'transition-metal',     period: 6, group: 6,    block: 'd', atomicMass: 183.84,   standardState: 'solid',   xpos: 6,  ypos: 6 },
  { atomicNumber: 75,  symbol: 'Re', name: 'Rhenium',        category: 'transition-metal',     period: 6, group: 7,    block: 'd', atomicMass: 186.207,  standardState: 'solid',   xpos: 7,  ypos: 6 },
  { atomicNumber: 76,  symbol: 'Os', name: 'Osmium',         category: 'transition-metal',     period: 6, group: 8,    block: 'd', atomicMass: 190.23,   standardState: 'solid',   xpos: 8,  ypos: 6 },
  { atomicNumber: 77,  symbol: 'Ir', name: 'Iridium',        category: 'transition-metal',     period: 6, group: 9,    block: 'd', atomicMass: 192.217,  standardState: 'solid',   xpos: 9,  ypos: 6 },
  { atomicNumber: 78,  symbol: 'Pt', name: 'Platinum',       category: 'transition-metal',     period: 6, group: 10,   block: 'd', atomicMass: 195.084,  standardState: 'solid',   xpos: 10, ypos: 6 },
  { atomicNumber: 79,  symbol: 'Au', name: 'Gold',           category: 'transition-metal',     period: 6, group: 11,   block: 'd', atomicMass: 196.967,  standardState: 'solid',   xpos: 11, ypos: 6 },
  { atomicNumber: 80,  symbol: 'Hg', name: 'Mercury',        category: 'transition-metal',     period: 6, group: 12,   block: 'd', atomicMass: 200.592,  standardState: 'liquid',  xpos: 12, ypos: 6 },
  { atomicNumber: 81,  symbol: 'Tl', name: 'Thallium',       category: 'post-transition-metal',period: 6, group: 13,   block: 'p', atomicMass: 204.383,  standardState: 'solid',   xpos: 13, ypos: 6 },
  { atomicNumber: 82,  symbol: 'Pb', name: 'Lead',           category: 'post-transition-metal',period: 6, group: 14,   block: 'p', atomicMass: 207.2,    standardState: 'solid',   xpos: 14, ypos: 6 },
  { atomicNumber: 83,  symbol: 'Bi', name: 'Bismuth',        category: 'post-transition-metal',period: 6, group: 15,   block: 'p', atomicMass: 208.980,  standardState: 'solid',   xpos: 15, ypos: 6 },
  { atomicNumber: 84,  symbol: 'Po', name: 'Polonium',       category: 'post-transition-metal',period: 6, group: 16,   block: 'p', atomicMass: 209,      standardState: 'solid',   xpos: 16, ypos: 6 },
  { atomicNumber: 85,  symbol: 'At', name: 'Astatine',       category: 'halogen',              period: 6, group: 17,   block: 'p', atomicMass: 210,      standardState: 'solid',   xpos: 17, ypos: 6 },
  { atomicNumber: 86,  symbol: 'Rn', name: 'Radon',          category: 'noble-gas',            period: 6, group: 18,   block: 'p', atomicMass: 222,      standardState: 'gas',     xpos: 18, ypos: 6 },

  // ─── PERIOD 7 (main table) ───────────────────────────────
  { atomicNumber: 87,  symbol: 'Fr', name: 'Francium',       category: 'alkali-metal',         period: 7, group: 1,    block: 's', atomicMass: 223,      standardState: 'solid',   xpos: 1,  ypos: 7 },
  { atomicNumber: 88,  symbol: 'Ra', name: 'Radium',         category: 'alkaline-earth-metal', period: 7, group: 2,    block: 's', atomicMass: 226,      standardState: 'solid',   xpos: 2,  ypos: 7 },
  // Z=89–103 (actinides) are in ypos=9 — see below
  { atomicNumber: 104, symbol: 'Rf', name: 'Rutherfordium',  category: 'transition-metal',     period: 7, group: 4,    block: 'd', atomicMass: 267,      standardState: 'unknown', xpos: 4,  ypos: 7 },
  { atomicNumber: 105, symbol: 'Db', name: 'Dubnium',        category: 'transition-metal',     period: 7, group: 5,    block: 'd', atomicMass: 268,      standardState: 'unknown', xpos: 5,  ypos: 7 },
  { atomicNumber: 106, symbol: 'Sg', name: 'Seaborgium',     category: 'transition-metal',     period: 7, group: 6,    block: 'd', atomicMass: 269,      standardState: 'unknown', xpos: 6,  ypos: 7 },
  { atomicNumber: 107, symbol: 'Bh', name: 'Bohrium',        category: 'transition-metal',     period: 7, group: 7,    block: 'd', atomicMass: 270,      standardState: 'unknown', xpos: 7,  ypos: 7 },
  { atomicNumber: 108, symbol: 'Hs', name: 'Hassium',        category: 'transition-metal',     period: 7, group: 8,    block: 'd', atomicMass: 277,      standardState: 'unknown', xpos: 8,  ypos: 7 },
  { atomicNumber: 109, symbol: 'Mt', name: 'Meitnerium',     category: 'transition-metal',     period: 7, group: 9,    block: 'd', atomicMass: 278,      standardState: 'unknown', xpos: 9,  ypos: 7 },
  { atomicNumber: 110, symbol: 'Ds', name: 'Darmstadtium',   category: 'transition-metal',     period: 7, group: 10,   block: 'd', atomicMass: 281,      standardState: 'unknown', xpos: 10, ypos: 7 },
  { atomicNumber: 111, symbol: 'Rg', name: 'Roentgenium',    category: 'transition-metal',     period: 7, group: 11,   block: 'd', atomicMass: 282,      standardState: 'unknown', xpos: 11, ypos: 7 },
  { atomicNumber: 112, symbol: 'Cn', name: 'Copernicium',    category: 'transition-metal',     period: 7, group: 12,   block: 'd', atomicMass: 285,      standardState: 'unknown', xpos: 12, ypos: 7 },
  { atomicNumber: 113, symbol: 'Nh', name: 'Nihonium',       category: 'post-transition-metal',period: 7, group: 13,   block: 'p', atomicMass: 286,      standardState: 'unknown', xpos: 13, ypos: 7 },
  { atomicNumber: 114, symbol: 'Fl', name: 'Flerovium',      category: 'post-transition-metal',period: 7, group: 14,   block: 'p', atomicMass: 289,      standardState: 'unknown', xpos: 14, ypos: 7 },
  { atomicNumber: 115, symbol: 'Mc', name: 'Moscovium',      category: 'post-transition-metal',period: 7, group: 15,   block: 'p', atomicMass: 290,      standardState: 'unknown', xpos: 15, ypos: 7 },
  { atomicNumber: 116, symbol: 'Lv', name: 'Livermorium',    category: 'post-transition-metal',period: 7, group: 16,   block: 'p', atomicMass: 293,      standardState: 'unknown', xpos: 16, ypos: 7 },
  { atomicNumber: 117, symbol: 'Ts', name: 'Tennessine',     category: 'halogen',              period: 7, group: 17,   block: 'p', atomicMass: 294,      standardState: 'unknown', xpos: 17, ypos: 7 },
  { atomicNumber: 118, symbol: 'Og', name: 'Oganesson',      category: 'noble-gas',            period: 7, group: 18,   block: 'p', atomicMass: 294,      standardState: 'unknown', xpos: 18, ypos: 7 },

  // ─── LANTHANIDES (ypos = 8) ──────────────────────────────
  // Displayed in the f-block row below the main table
  // xpos 3–17 corresponds to the columns under groups 3–17
  { atomicNumber: 57,  symbol: 'La', name: 'Lanthanum',      category: 'lanthanide',           period: 6, group: null, block: 'f', atomicMass: 138.905,  standardState: 'solid',   xpos: 3,  ypos: 8 },
  { atomicNumber: 58,  symbol: 'Ce', name: 'Cerium',         category: 'lanthanide',           period: 6, group: null, block: 'f', atomicMass: 140.116,  standardState: 'solid',   xpos: 4,  ypos: 8 },
  { atomicNumber: 59,  symbol: 'Pr', name: 'Praseodymium',   category: 'lanthanide',           period: 6, group: null, block: 'f', atomicMass: 140.908,  standardState: 'solid',   xpos: 5,  ypos: 8 },
  { atomicNumber: 60,  symbol: 'Nd', name: 'Neodymium',      category: 'lanthanide',           period: 6, group: null, block: 'f', atomicMass: 144.242,  standardState: 'solid',   xpos: 6,  ypos: 8 },
  { atomicNumber: 61,  symbol: 'Pm', name: 'Promethium',     category: 'lanthanide',           period: 6, group: null, block: 'f', atomicMass: 145,      standardState: 'solid',   xpos: 7,  ypos: 8 },
  { atomicNumber: 62,  symbol: 'Sm', name: 'Samarium',       category: 'lanthanide',           period: 6, group: null, block: 'f', atomicMass: 150.36,   standardState: 'solid',   xpos: 8,  ypos: 8 },
  { atomicNumber: 63,  symbol: 'Eu', name: 'Europium',       category: 'lanthanide',           period: 6, group: null, block: 'f', atomicMass: 151.964,  standardState: 'solid',   xpos: 9,  ypos: 8 },
  { atomicNumber: 64,  symbol: 'Gd', name: 'Gadolinium',     category: 'lanthanide',           period: 6, group: null, block: 'f', atomicMass: 157.25,   standardState: 'solid',   xpos: 10, ypos: 8 },
  { atomicNumber: 65,  symbol: 'Tb', name: 'Terbium',        category: 'lanthanide',           period: 6, group: null, block: 'f', atomicMass: 158.925,  standardState: 'solid',   xpos: 11, ypos: 8 },
  { atomicNumber: 66,  symbol: 'Dy', name: 'Dysprosium',     category: 'lanthanide',           period: 6, group: null, block: 'f', atomicMass: 162.500,  standardState: 'solid',   xpos: 12, ypos: 8 },
  { atomicNumber: 67,  symbol: 'Ho', name: 'Holmium',        category: 'lanthanide',           period: 6, group: null, block: 'f', atomicMass: 164.930,  standardState: 'solid',   xpos: 13, ypos: 8 },
  { atomicNumber: 68,  symbol: 'Er', name: 'Erbium',         category: 'lanthanide',           period: 6, group: null, block: 'f', atomicMass: 167.259,  standardState: 'solid',   xpos: 14, ypos: 8 },
  { atomicNumber: 69,  symbol: 'Tm', name: 'Thulium',        category: 'lanthanide',           period: 6, group: null, block: 'f', atomicMass: 168.934,  standardState: 'solid',   xpos: 15, ypos: 8 },
  { atomicNumber: 70,  symbol: 'Yb', name: 'Ytterbium',      category: 'lanthanide',           period: 6, group: null, block: 'f', atomicMass: 173.054,  standardState: 'solid',   xpos: 16, ypos: 8 },
  { atomicNumber: 71,  symbol: 'Lu', name: 'Lutetium',       category: 'lanthanide',           period: 6, group: null, block: 'f', atomicMass: 174.967,  standardState: 'solid',   xpos: 17, ypos: 8 },

  // ─── ACTINIDES (ypos = 9) ────────────────────────────────
  { atomicNumber: 89,  symbol: 'Ac', name: 'Actinium',       category: 'actinide',             period: 7, group: null, block: 'f', atomicMass: 227,      standardState: 'solid',   xpos: 3,  ypos: 9 },
  { atomicNumber: 90,  symbol: 'Th', name: 'Thorium',        category: 'actinide',             period: 7, group: null, block: 'f', atomicMass: 232.038,  standardState: 'solid',   xpos: 4,  ypos: 9 },
  { atomicNumber: 91,  symbol: 'Pa', name: 'Protactinium',   category: 'actinide',             period: 7, group: null, block: 'f', atomicMass: 231.036,  standardState: 'solid',   xpos: 5,  ypos: 9 },
  { atomicNumber: 92,  symbol: 'U',  name: 'Uranium',        category: 'actinide',             period: 7, group: null, block: 'f', atomicMass: 238.029,  standardState: 'solid',   xpos: 6,  ypos: 9 },
  { atomicNumber: 93,  symbol: 'Np', name: 'Neptunium',      category: 'actinide',             period: 7, group: null, block: 'f', atomicMass: 237,      standardState: 'solid',   xpos: 7,  ypos: 9 },
  { atomicNumber: 94,  symbol: 'Pu', name: 'Plutonium',      category: 'actinide',             period: 7, group: null, block: 'f', atomicMass: 244,      standardState: 'solid',   xpos: 8,  ypos: 9 },
  { atomicNumber: 95,  symbol: 'Am', name: 'Americium',      category: 'actinide',             period: 7, group: null, block: 'f', atomicMass: 243,      standardState: 'solid',   xpos: 9,  ypos: 9 },
  { atomicNumber: 96,  symbol: 'Cm', name: 'Curium',         category: 'actinide',             period: 7, group: null, block: 'f', atomicMass: 247,      standardState: 'solid',   xpos: 10, ypos: 9 },
  { atomicNumber: 97,  symbol: 'Bk', name: 'Berkelium',      category: 'actinide',             period: 7, group: null, block: 'f', atomicMass: 247,      standardState: 'solid',   xpos: 11, ypos: 9 },
  { atomicNumber: 98,  symbol: 'Cf', name: 'Californium',    category: 'actinide',             period: 7, group: null, block: 'f', atomicMass: 251,      standardState: 'solid',   xpos: 12, ypos: 9 },
  { atomicNumber: 99,  symbol: 'Es', name: 'Einsteinium',    category: 'actinide',             period: 7, group: null, block: 'f', atomicMass: 252,      standardState: 'solid',   xpos: 13, ypos: 9 },
  { atomicNumber: 100, symbol: 'Fm', name: 'Fermium',        category: 'actinide',             period: 7, group: null, block: 'f', atomicMass: 257,      standardState: 'solid',   xpos: 14, ypos: 9 },
  { atomicNumber: 101, symbol: 'Md', name: 'Mendelevium',    category: 'actinide',             period: 7, group: null, block: 'f', atomicMass: 258,      standardState: 'solid',   xpos: 15, ypos: 9 },
  { atomicNumber: 102, symbol: 'No', name: 'Nobelium',       category: 'actinide',             period: 7, group: null, block: 'f', atomicMass: 259,      standardState: 'solid',   xpos: 16, ypos: 9 },
  { atomicNumber: 103, symbol: 'Lr', name: 'Lawrencium',     category: 'actinide',             period: 7, group: null, block: 'f', atomicMass: 262,      standardState: 'solid',   xpos: 17, ypos: 9 },
];

// ─── HELPER FUNCTIONS ────────────────────────────────────────

/** Get element by atomic number. Returns undefined if not found. */
export function getElementById(atomicNumber: number): Element | undefined {
  return elements.find(el => el.atomicNumber === atomicNumber);
}

/** Get element by symbol (case-sensitive). Returns undefined if not found. */
export function getElementBySymbol(symbol: string): Element | undefined {
  return elements.find(el => el.symbol === symbol);
}

/** Get all elements in a given period (1–7). */
export function getElementsByPeriod(period: number): Element[] {
  return elements.filter(el => el.period === period);
}

/** Get all elements in a given group (1–18). Returns empty array for groups with no match. */
export function getElementsByGroup(group: number): Element[] {
  return elements.filter(el => el.group === group);
}

/** Get all elements by category. */
export function getElementsByCategory(category: ElementCategory): Element[] {
  return elements.filter(el => el.category === category);
}

/** Returns true if the element has no stable isotopes (and is thus radioactive).
 *  Technetium (43) and Promethium (61) have no stable isotopes.
 *  All elements with Z >= 84 (Polonium onwards) have no stable isotopes. */
export function isRadioactive(atomicNumber: number): boolean {
  return atomicNumber === 43 || atomicNumber === 61 || atomicNumber >= 84;
}

// ─── CATEGORY COLOR MAP ──────────────────────────────────────
// Consistent colors used across the entire app.
// Only change these values if you change them everywhere simultaneously.

export const categoryColors: Record<ElementCategory, string> = {
  'alkali-metal':          '#ff6b6b',
  'alkaline-earth-metal':  '#ffa94d',
  'transition-metal':      '#ffd43b',
  'post-transition-metal': '#a9e34b',
  'metalloid':             '#63e6be',
  'nonmetal':              '#74c0fc',
  'halogen':               '#da77f2',
  'noble-gas':             '#f783ac',
  'lanthanide':            '#94d82d',
  'actinide':              '#ff8787',
};

export const categoryLabels: Record<ElementCategory, string> = {
  'alkali-metal':          'Alkali Metal',
  'alkaline-earth-metal':  'Alkaline Earth Metal',
  'transition-metal':      'Transition Metal',
  'post-transition-metal': 'Post-Transition Metal',
  'metalloid':             'Metalloid',
  'nonmetal':              'Nonmetal',
  'halogen':               'Halogen',
  'noble-gas':             'Noble Gas',
  'lanthanide':            'Lanthanide',
  'actinide':              'Actinide',
};
