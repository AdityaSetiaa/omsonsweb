'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  link: string;
}

export default function ProductsPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);

  const products: Product[] = [
    {
      id: 1,
      name: 'Pycnometers Class A ',
      category: 'Bottle',
      price: '₹299',
      image: 'https://omsonslabs.com/wp-content/uploads/Pycnometers-Class-A-Individual-Work-Certificate-product-image.webp',
      description: '253 – Pycnometers Class A with NABL',
      link: '/Products/meridian-pro'
    },
    {
      id: 2,
      name: 'Bottles Tooled Neck Amber ',
      category: 'Bottle',
      price: '₹189',
      image: 'https://omsonslabs.com/wp-content/uploads/Bottles-Tooled-Neck-Amber-product-image.webp',
      description: 'Recommended use with light-sensitive media and for long-term storage of substances.',
      link: '/product/velocity-x'
    },
    {
      id: 3,
      name: ' Reagent Bottle Amber with GL 80 Cap ',
      category: 'Bottle',
      price: '₹1,299',
      image: 'https://omsonslabs.com/wp-content/uploads/Reagent-Bottle-Amber-with-GL-80-Cap-product-image.webp',
      description: 'These bottles are ideal for long term storage of light sensitive media & substance.',
      link: '/product/lumina-desk'
    },
    {
      id: 4,
      name: ' Reagent Bottle High Recovery ',
      category: 'Bottle',
      price: '₹399',
      image: 'https://omsonslabs.com/wp-content/uploads/Reagent-Bottle-High-Recovery-image.webp',
      description: 'Complies With USP Type/Boro 3.3 Glass.',
      link: '/product/nova-watch'
    },
    {
      id: 5,
      name: ' Specific Gravity Bottles Class B r',
      category: 'Bottle',
      price: '₹149',
      image: 'https://omsonslabs.com/wp-content/uploads/Specific-Gravity-Bottles-Class-B-product-image.webp',
      description: 'Made from High Quality Boro 3.3 Low Exp. Glass.',
      link: '/product/echo-speaker'
    },
    {
      id: 6,
      name: ' BOD Bottle ',
      category: 'Bottle',
      price: '₹799',
      image: 'https://omsonslabs.com/wp-content/uploads/BOD-Bottle-product-image.webp',
      description: 'Made from ASTM-438, TYPE-1, Borosilicate 3.3 Glass',
      link: '/product/prism-lens'
    },
    {
      id: 7,
      name: ' Bottles Dropping Amber ',
      category: 'Bottle',
      price: '₹249',
      image: 'https://omsonslabs.com/wp-content/uploads/Bottles-Dropping-Amber-product-image.webp',
      description: 'Made from heat resistant Boro 3.3 Glass.',
      link: '/product/zenith-keyboard'
    },
    {
      id: 8,
      name: 'Bottles Reagent Clear Glass with PE Screw Cap ',
      category: 'Bottle',
      price: '₹99',
      image: 'https://omsonslabs.com/wp-content/uploads/Bottles-Reagent-Clear-Glass-with-PE-Screw-Cap-product-image.webp',
      description: 'Complies with DIN/ISO 4796.',
      link: '/product/orbit-ring'
    }
  ];

  const deals = [
    { label: 'Today\'s Deals', value: 'today' },
    { label: 'Best Sellers', value: 'bestsellers' },
    { label: 'New Arrivals', value: 'new' },
    { label: 'Discounts on Sale', value: 'discount' }
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white text-black py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex justify-between">
          <h1 className="text-4xl font-light tracking-tight mb-2">Featured Products</h1>
         <div className='my-auto'>
         <select className="text-sm text-black border rounded-sm py-1 px-3">
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Avg. Customer Review</option>
            <option>Newest Arrivals</option>
            <option>Best Sellers</option>
          </select>
         </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <aside className="lg:col-span-1">
            <div className="space-y-6 sticky top-4">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-gray-900 text-sm mb-4">Price</h3>
                <div className="space-y-3">
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>₹{priceRange[0]}</span>
                    <span>to ₹{priceRange[1]}</span>
                  </div>
                  
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-gray-900 text-sm mb-4">Categories</h3>
                <div className="space-y-3">
                  {['Bottle'].map((category) => (
                    <label key={category} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-2 focus:ring-amber-400 cursor-pointer"
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-gray-900 text-sm mb-4">Offers & Deals</h3>
                <div className="space-y-3">
                  {deals.map((deal) => (
                    <label key={deal.value} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="deals"
                        checked={selectedDeal === deal.value}
                        onChange={() => setSelectedDeal(deal.value)}
                        className="w-4 h-4 border-gray-300 text-slate-900 focus:ring-2 focus:ring-amber-400 cursor-pointer"
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                        {deal.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={() => {
                    setPriceRange([0, 2000]);
                    setSelectedCategories([]);
                    setSelectedDeal(null);
                  }}
                  className="w-full py-2 text-xs font-medium text-slate-900 border border-slate-300 rounded hover:bg-slate-50 transition"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={product.link}
                  className="group flex flex-col bg-white rounded shadow-sm hover:shadow-md transition-shadow duration-200"
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="relative overflow-hidden bg-gray-100 rounded-t flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-square object-cover group-hover:opacity-90 transition-opacity duration-200"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900 text-white text-xs font-medium px-2.5 py-1 rounded">
                      {product.category}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex flex-col justify-between pt-3 border-t text-left border-gray-100">
                      <span className="text-lg font-semibold text-gray-900 ">
                        {product.price}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        className="text-xs font-medium text-white hover:text-amber-700 transition bg-yellow-500 h-8 w-22 rounded-2xl"
                      >
                        Add to Cart 
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>

      <section className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-4">Explore More</h2>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-slate-900 text-white text-sm font-medium rounded hover:bg-slate-800 transition"
          >
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}