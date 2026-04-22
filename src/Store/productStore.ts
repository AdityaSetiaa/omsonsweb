import { create } from "zustand";

type Product = {
  SKU: string;
  Name: string;
  Description: string;
  "Short description": string;
};

type Filters = {
  search: string;
  categories: string[];
  deal: string | null;
};

type Store = {
  products: Product[];
  filters: Filters;

  setProducts: (p: Product[]) => void;
  setSearch: (s: string) => void;
  toggleCategory: (c: string) => void;
  setDeal: (d: string | null) => void;
  clearFilters: () => void;

  filteredProducts: () => Product[];
};

const getCategory = (name: string) => {
  const n = name.toLowerCase();

  if (n.includes("reduction")) return "reduction";
  if (n.includes("expansion")) return "expansion";
  if (n.includes("multiple")) return "multiple";
  if (n.includes("receiver")) return "receiver";
  if (n.includes("swan")) return "swan";
  return "other";
};

export const useProductStore = create<Store>((set, get) => ({
  products: [],

  filters: {
    search: "",
    categories: [],
    deal: null,
  },

  setProducts: (p) => set({ products: p }),

  setSearch: (s) =>
    set((state) => ({
      filters: { ...state.filters, search: s },
    })),

  toggleCategory: (c) =>
    set((state) => ({
      filters: {
        ...state.filters,
        categories: state.filters.categories.includes(c)
          ? state.filters.categories.filter((x) => x !== c)
          : [...state.filters.categories, c],
      },
    })),

  setDeal: (d) =>
    set((state) => ({
      filters: { ...state.filters, deal: d },
    })),

  clearFilters: () =>
    set({
      filters: { search: "", categories: [], deal: null },
    }),

  filteredProducts: () => {
    const { products, filters } = get();

    return products.filter((p) => {
      const category = getCategory(p.Name);

      return (
        (!filters.search ||
          p.Name.toLowerCase().includes(filters.search.toLowerCase())) &&
        (filters.categories.length === 0 ||
          filters.categories.includes(category))
      );
    });
  },
}));