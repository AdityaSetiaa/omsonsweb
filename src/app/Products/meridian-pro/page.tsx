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

const products: Product[] = [
  {
    id: 1,
    name: 'Pycnometers Class A',
    category: 'Bottle',
    price: '₹299',
    image: 'https://omsonslabs.com/wp-content/uploads/Pycnometers-Class-A-Individual-Work-Certificate-product-image.webp',
    description: '253 – Pycnometers Class A with NABL',
    link: '/product/pycnometers-class-a'
  },
  {
    id: 2,
    name: 'Bottles Tooled Neck Amber',
    category: 'Bottle',
    price: '₹189',
    image: 'https://omsonslabs.com/wp-content/uploads/Bottles-Tooled-Neck-Amber-product-image.webp',
    description: 'Recommended use with light-sensitive media and for long-term storage of substances.',
    link: '/product/bottles-tooled-neck-amber'
  },
  {
    id: 3,
    name: 'Reagent Bottle Amber with GL 80 Cap',
    category: 'Bottle',
    price: '₹1,299',
    image: 'https://omsonslabs.com/wp-content/uploads/Reagent-Bottle-Amber-with-GL-80-Cap-product-image.webp',
    description: 'These bottles are ideal for long term storage of light sensitive media & substance.',
    link: '/product/reagent-bottle-amber-gl80'
  },
  {
    id: 4,
    name: 'Reagent Bottle High Recovery',
    category: 'Bottle',
    price: '₹399',
    image: 'https://omsonslabs.com/wp-content/uploads/Reagent-Bottle-High-Recovery-image.webp',
    description: 'Complies With USP Type/Boro 3.3 Glass.',
    link: '/product/reagent-bottle-high-recovery'
  },
  {
    id: 5,
    name: 'Specific Gravity Bottles Class B',
    category: 'Bottle',
    price: '₹149',
    image: 'https://omsonslabs.com/wp-content/uploads/Specific-Gravity-Bottles-Class-B-product-image.webp',
    description: 'Made from High Quality Boro 3.3 Low Exp. Glass.',
    link: '/product/specific-gravity-bottles-class-b'
  }
];

export default function ProductDetailPage() {
  const mainProduct = products[0];
  const relatedProducts = products.slice(1);
  const [selectedImage, setSelectedImage] = useState(mainProduct.image);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-gray-900">Bottles</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{mainProduct.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded aspect-square flex items-center justify-center overflow-hidden hover:border duration-300 h-20">
                <img
                  src={selectedImage}
                  alt={mainProduct.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>

              <div className="bg-gray-50 rounded aspect-square flex items-center justify-center overflow-hidden hover:border duration-300 h-20">
                <img
                  src={selectedImage}
                  alt={mainProduct.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>

            </div>
            <div>
            <img
                  src={selectedImage}
                  alt={mainProduct.name}
                  className="w-full h-full object-contain p-2"
                />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="mb-3">
              <span className="bg-slate-100 text-slate-900 text-xs font-medium px-3 py-1 rounded">
                {mainProduct.category}
              </span>
            </div>

            <h1 className="text-3xl font-light text-gray-900 mb-4 leading-tight">
              {mainProduct.name}
            </h1>

            <div className=" border-gray-200 pb-4 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-gray-900">
                  {mainProduct.price}
                </span>
                <span className="text-sm text-gray-600">Inclusive of all taxes</span>
              </div>
            </div>
            <div className='flex gap-4'>
            <div className="mb-8">
              <p className='bg-gray-400 h-[0.5] w-full mb-7'></p>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">About this item</h3>
              <ul className="space-y-3 text-sm text-gray-700 leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Premium laboratory-grade borosilicate glass construction for durability and chemical resistance</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>NABL certified Class A pycnometers with precise volumetric measurements for accurate density determination</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{mainProduct.description}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Ideal for pharmaceutical, chemical, and research laboratories requiring precision and consistency</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Graduated markings for easy reading and comes with individual work certificate for quality assurance</span>
                </li>
              </ul>
              <p className='bg-gray-400 h-[0.5] w-full mt-6'></p>

            </div>
            <div className="space-y-4 mb-8 border-2 border-gray-300 py-3 px-2 rounded-2xl -mt-40 h-full">
              <div className="flex items-center gap-4 flex-col">
                
                <div className="flex flex-col gap-1 mb-3">
                  <p className='text-lg font-bold'>Price: </p>
                  <div className="flex flex-colitems-baseline gap-2">
                    <span className="text-xl font-bold text-slate-900">₹399</span>
                    <span className="text-sm line-through text-gray-400">₹499</span>
                    <span className="ml-2 text-xs font-semibold text-green-600">20% off</span>
                  </div>
                  <div className="flex text-left gap-1 mt-1 flex-col">
                    <span className="text-xs font-semibold text-gray-700 ">Available at:</span>
                    <div className='text-2xl'>
                    <span className="text-xl font-bold text-gray-900">Delhi</span>,
                    <span className="text-xl font-bold text-gray-900">Mumbai</span>,
                    <span className="text-xl font-bold text-gray-900">Chennai</span>
                    </div>
                  </div>
                </div>
                <label className="text-sm font-medium text-gray-900">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <button className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold py-3 rounded transition">
                Add to Cart
              </button>

              <button className="w-full border-2 border-slate-900 text-slate-900 font-semibold py-3 rounded hover:bg-slate-50 transition">
                Buy Now
              </button>
            </div>
           </div>

            <div className="space-y-3 text-sm text-gray-600 border-gray-200 pt-6 -mt-10">
              <div className="flex items-start gap-2">
                <span className="font-medium text-gray-900 min-w-[120px]">Supplier:</span>
                <span>Omson Scientific Labs</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-gray-900 min-w-[120px]">Category:</span>
                <span>Laboratory Glassware</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-gray-900 min-w-[120px]">Certification:</span>
                <span>NABL Certified, ISO 9001:2015</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-gray-50 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-light text-gray-900 mb-8">Related Products</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Link
                key={product.id}
                href={product.link}
                className="group bg-white rounded shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative overflow-hidden bg-gray-100 rounded-t">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-contain p-6 group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900 text-white text-xs font-medium px-2.5 py-1 rounded">
                    {product.category}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-4 line-clamp-2">
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
        </div>
      </div>
    </div>
  );
}