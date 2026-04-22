export const categories = {
  adapters: [
    "adapter",
    "adapters",
    "expansion",
    "reduction",
    "multiple",
    "swan neck",
  ],

  receiver_adapters: [
    "receiver",
    "delivery",
    "vent",
    "vacuum",
    "bend",
    "straight",
    "angled",
    "side socket",
  ],

  distillation: [
    "distillation",
    "still head",
    "claisen",
  ],

  flasks: [
    "flask",
    "flasks",
  ],

  bottles: [
    "bottle",
    "bottles",
  ],
} as const;

export function filterProducts(products: any[], selectedCategory: keyof typeof categories) {
  const keywords = categories[selectedCategory];

  return products.filter((product) => {
    const name = product.Name.toLowerCase();

    return keywords.some((keyword) =>
      name.includes(keyword.toLowerCase())
    );
  });
}