export interface FoodItem {
  id: string;
  name: string;
  caloriesPer: number;
  baseQty: number;
  unit: "g" | "buc" | "ml";
  defaultQty: number;
}

export const foodDatabase: FoodItem[] = [
  // Fructe
  { id: "mar", name: "Măr", caloriesPer: 52, baseQty: 100, unit: "g", defaultQty: 150 },
  { id: "banana", name: "Banană", caloriesPer: 89, baseQty: 100, unit: "g", defaultQty: 120 },
  { id: "portocala", name: "Portocală", caloriesPer: 47, baseQty: 100, unit: "g", defaultQty: 180 },
  { id: "struguri", name: "Struguri", caloriesPer: 69, baseQty: 100, unit: "g", defaultQty: 100 },
  { id: "capsuni", name: "Căpșuni", caloriesPer: 32, baseQty: 100, unit: "g", defaultQty: 100 },
  { id: "mango", name: "Mango", caloriesPer: 60, baseQty: 100, unit: "g", defaultQty: 150 },
  { id: "kiwi", name: "Kiwi", caloriesPer: 61, baseQty: 1, unit: "buc", defaultQty: 1 },
  { id: "perisoare", name: "Peră", caloriesPer: 57, baseQty: 100, unit: "g", defaultQty: 160 },
  { id: "piersica", name: "Piersică", caloriesPer: 39, baseQty: 100, unit: "g", defaultQty: 150 },

  // Legume
  { id: "morcov", name: "Morcov", caloriesPer: 41, baseQty: 100, unit: "g", defaultQty: 100 },
  { id: "rosie", name: "Roșie", caloriesPer: 18, baseQty: 100, unit: "g", defaultQty: 120 },
  { id: "castravete", name: "Castravete", caloriesPer: 16, baseQty: 100, unit: "g", defaultQty: 100 },
  { id: "spanac", name: "Spanac", caloriesPer: 23, baseQty: 100, unit: "g", defaultQty: 80 },
  { id: "broccoli", name: "Broccoli", caloriesPer: 34, baseQty: 100, unit: "g", defaultQty: 150 },
  { id: "ardei", name: "Ardei gras", caloriesPer: 31, baseQty: 100, unit: "g", defaultQty: 100 },
  { id: "cartofi", name: "Cartofi fierți", caloriesPer: 87, baseQty: 100, unit: "g", defaultQty: 200 },
  { id: "dovlecel", name: "Dovlecel", caloriesPer: 17, baseQty: 100, unit: "g", defaultQty: 150 },

  // Proteine
  { id: "ou", name: "Ou fiert", caloriesPer: 78, baseQty: 1, unit: "buc", defaultQty: 2 },
  { id: "pui-piept", name: "Piept pui gătit", caloriesPer: 165, baseQty: 100, unit: "g", defaultQty: 150 },
  { id: "somon", name: "Somon gătit", caloriesPer: 208, baseQty: 100, unit: "g", defaultQty: 150 },
  { id: "ton-conserva", name: "Ton conservă", caloriesPer: 116, baseQty: 100, unit: "g", defaultQty: 80 },
  { id: "carne-vita", name: "Carne vită slabă", caloriesPer: 250, baseQty: 100, unit: "g", defaultQty: 150 },
  { id: "naut", name: "Năut fiert", caloriesPer: 164, baseQty: 100, unit: "g", defaultQty: 150 },
  { id: "linte", name: "Linte fiartă", caloriesPer: 116, baseQty: 100, unit: "g", defaultQty: 150 },

  // Lactate
  { id: "lapte", name: "Lapte 1.5%", caloriesPer: 46, baseQty: 100, unit: "ml", defaultQty: 200 },
  { id: "iaurt-natural", name: "Iaurt natural", caloriesPer: 61, baseQty: 100, unit: "g", defaultQty: 150 },
  { id: "branza-vaci", name: "Brânză de vaci", caloriesPer: 98, baseQty: 100, unit: "g", defaultQty: 100 },
  { id: "cascaval", name: "Cașcaval", caloriesPer: 356, baseQty: 100, unit: "g", defaultQty: 30 },
  { id: "unt", name: "Unt", caloriesPer: 717, baseQty: 100, unit: "g", defaultQty: 10 },

  // Cereale / Pâine
  { id: "paine-alba", name: "Pâine albă", caloriesPer: 265, baseQty: 100, unit: "g", defaultQty: 50 },
  { id: "paine-integrala", name: "Pâine integrală", caloriesPer: 247, baseQty: 100, unit: "g", defaultQty: 50 },
  { id: "orez-fiert", name: "Orez fiert", caloriesPer: 130, baseQty: 100, unit: "g", defaultQty: 200 },
  { id: "paste-fierte", name: "Paste fierte", caloriesPer: 131, baseQty: 100, unit: "g", defaultQty: 200 },
  { id: "ovaz", name: "Fulgi de ovăz", caloriesPer: 389, baseQty: 100, unit: "g", defaultQty: 50 },
  { id: "musli", name: "Muesli", caloriesPer: 378, baseQty: 100, unit: "g", defaultQty: 50 },

  // Băuturi
  { id: "apa", name: "Apă", caloriesPer: 0, baseQty: 100, unit: "ml", defaultQty: 250 },
  { id: "suc-portocale", name: "Suc portocale", caloriesPer: 45, baseQty: 100, unit: "ml", defaultQty: 200 },
  { id: "cafea-neagra", name: "Cafea neagră", caloriesPer: 2, baseQty: 100, unit: "ml", defaultQty: 150 },
  { id: "ceai", name: "Ceai neîndulcit", caloriesPer: 1, baseQty: 100, unit: "ml", defaultQty: 250 },

  // Gustări
  { id: "migdale", name: "Migdale", caloriesPer: 579, baseQty: 100, unit: "g", defaultQty: 30 },
  { id: "nuci", name: "Nuci", caloriesPer: 654, baseQty: 100, unit: "g", defaultQty: 30 },
  { id: "ciocolata-neagra", name: "Ciocolată neagră", caloriesPer: 546, baseQty: 100, unit: "g", defaultQty: 20 },
  { id: "biscuiti", name: "Biscuiți", caloriesPer: 450, baseQty: 100, unit: "g", defaultQty: 30 },

  // Mâncăruri
  { id: "supa-pui", name: "Supă pui", caloriesPer: 40, baseQty: 100, unit: "ml", defaultQty: 300 },
  { id: "salata-greceasca", name: "Salată grecească", caloriesPer: 95, baseQty: 100, unit: "g", defaultQty: 200 },
  { id: "pizza-margherita", name: "Pizza Margherita", caloriesPer: 266, baseQty: 100, unit: "g", defaultQty: 200 },
];
