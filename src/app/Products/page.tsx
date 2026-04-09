'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import AddToCart from '@/Components/AddToCart';


type Product = {
  SKU: string;
  Name: string;
  Description: string;
  "Short description": string;
};

const PAGE_SIZE = 20;

const image =
  "https://omsonslabs.com/wp-content/uploads/Pycnometers-Class-A-Individual-Work-Certificate-product-image.webp";

const deals = [
  { label: "Today's Deals", value: "today" },
  { label: "Best Sellers", value: "bestsellers" },
  { label: "New Arrivals", value: "new" },
  { label: "Discounts on Sale", value: "discount" },
];

export default function ProductsPage() {
  const [allData, setAllData] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("data/nested_products.json")
      .then((res) => {
        setAllData(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("FETCH ERROR:", e);
        setLoading(false);
      });
  }, []);


  const totalPages = Math.ceil(allData.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const displayed = allData.slice(start, start + PAGE_SIZE);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const getPaginationRange = () => {
    const delta = 2;
    const range: (number | "...")[] = [];

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push("...");
    if (totalPages > 1) range.push(totalPages);

    return range;
  };


  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <header className="bg-white text-black py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex justify-between">
          <h1 className="text-4xl font-light tracking-tight mb-2">
            Featured Products
          </h1>
          <div className="my-auto">
            <select className="text-sm text-black border rounded-sm py-1 px-3">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
              <option>Best Sellers</option>
            </select>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8 text-black">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* SIDEBAR */}
          <aside className="lg:col-span-1">
            <div className="space-y-6 sticky top-4">

              {/* PRICE */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-sm mb-4">Price</h3>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full accent-amber-400"
                />
                <div className="flex justify-between text-xs mt-2">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              {/* CATEGORY */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-sm mb-4">Categories</h3>
                {["Bottle"].map((category) => (
                  <label key={category} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    <span className="ml-2 text-sm">{category}</span>
                  </label>
                ))}
              </div>

              {/* DEALS */}
              <div>
                <h3 className="font-semibold text-sm mb-4">Deals</h3>
                {deals.map((deal) => (
                  <label key={deal.value} className="flex items-center mb-2">
                    <input
                      type="radio"
                      checked={selectedDeal === deal.value}
                      onChange={() => setSelectedDeal(deal.value)}
                    />
                    <span className="ml-2 text-sm">{deal.label}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={() => {
                  setPriceRange([0, 2000]);
                  setSelectedCategories([]);
                  setSelectedDeal(null);
                }}
                className="w-full py-2 text-xs border mt-4"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* PRODUCTS GRID */}
          <main className="lg:col-span-4">

            {loading && (
              <p className="text-gray-400 text-sm">Loading products...</p>
            )}

            {/* RESULT COUNT */}
            {!loading && (
              <p className="text-xs text-gray-500 mb-4">
                Showing {start + 1}–{Math.min(start + PAGE_SIZE, allData.length)} of{" "}
                {allData.length} products
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayed.map((product) => (
                <div key={product.SKU} className="group flex flex-col bg-white rounded shadow-sm hover:shadow-md transition p-2">
                  <Link
                    href={`/Products/${product.SKU}`}

                  >
                    <img
                      src={image}
                      alt={product.Name}
                      className="w-full aspect-square object-cover hover:underline"
                      loading="lazy"
                    />
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold mb-2">{product.Name}</h3>
                      {/* <div
                        dangerouslySetInnerHTML={{ __html: product["Short description"].replace(/<br>\\n/g, "") }}
                      /> */}

                    </div>
                  </Link>
                  <div className='flex'>
                    <AddToCart product={product.Name} quantity={1} />

                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center ml-auto gap-1 mt-10">

                {/* Prev */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm border rounded disabled:opacity-30 hover:bg-gray-50 transition h-10 w-19"
                >
                  ‹ Prev
                </button>

                {/* Page numbers */}
                {getPaginationRange().map((item, idx) =>
                  item === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm select-none w-10">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => goToPage(item as number)}
                      className={`w-10 h-10 text-sm rounded border transition ${currentPage === item
                          ? "bg-yellow-500 text-white border-yellow-500 font-semibold"
                          : "hover:bg-gray-50"
                        }`}
                    >
                      {item}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm border rounded disabled:opacity-30 hover:bg-gray-50 transition h-10 w-19 "
                >
                  Next ›
                </button>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
} 