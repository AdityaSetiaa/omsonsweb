'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';


type Variant = {
  SKU: string;
  Name: string;
  "Short description": string;
  Description: string;
};

type Product = {
  SKU: number | string;
  Name: string;
  "Short description": string;
  Description: string;
  variants?: Variant[];
};




const stripHTML = (html: string) =>
  html?.replace(/<[^>]*>/g, '').replace(/\\n/g, '').trim() ?? '';

const parseDescriptionTable = (html: string): Record<string, string>[] => {
  if (!html) return [];


  const theadMatch = html.match(/<thead>([\s\S]*?)<\/thead>/i);
  const headers: string[] = [];
  if (theadMatch) {
    const hdMatches = [...theadMatch[1].matchAll(/<td>([\s\S]*?)<\/td>/gi)];
    hdMatches.forEach(m => headers.push(m[1].replace(/\\n/g, '').trim()));
  }


  const tbodyMatch = html.match(/<tbody>([\s\S]*?)<\/tbody>/i);
  const rows: Record<string, string>[] = [];
  if (tbodyMatch) {
    const trMatches = [...tbodyMatch[1].matchAll(/<tr>([\s\S]*?)<\/tr>/gi)];
    trMatches.forEach(tr => {
      const tdMatches = [...tr[1].matchAll(/<td>([\s\S]*?)<\/td>/gi)];
      const row: Record<string, string> = {};
      tdMatches.forEach((td, i) => {
        row[headers[i] ?? `col${i}`] = td[1].replace(/\\n/g, '').trim();
      });
      rows.push(row);
    });
  }
  return rows;
};


const parseShortDescBullets = (html: string): string[] => {
  if (!html) return [];
  const matches = [...html.matchAll(/<li>([\s\S]*?)<\/li>/gi)];
  return matches.map(m => m[1].replace(/<[^>]*>/g, '').replace(/\\n/g, '').trim());
};

const placeholderImage =
  'https://omsonslabs.com/wp-content/uploads/Pycnometers-Class-A-Individual-Work-Certificate-product-image.webp';


export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const rawSKU = React.use(params).sku;
  const sku = decodeURIComponent(rawSKU);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedVariantSKU, setSelectedVariantSKU] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);


  useEffect(() => {
    axios.get('/data/nested_products.json')
      .then(res => {
        const data: Product[] = res.data;


        let found = data.find(p => String(p.SKU) === sku);


        if (!found) {
          found = data.find(p =>
            p.variants?.some(v => v.SKU === sku)
          );
          if (found) {

            setSelectedVariantSKU(sku);
          }
        }

        if (found) {
          setProduct(found);
          if (!selectedVariantSKU && found.variants?.length) {
            setSelectedVariantSKU(found.variants[0].SKU);
          }
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [sku]);


  const selectedVariant = product?.variants?.find(v => v.SKU === selectedVariantSKU) ?? null;
  const bullets = parseShortDescBullets(product?.["Short description"] ?? '');
  const tableRows = parseDescriptionTable(product?.Description ?? '');


  const tableHeaders = tableRows.length > 0 ? Object.keys(tableRows[0]) : [];


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Loading product...
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-sm">Product not found for SKU: <strong>{sku}</strong></p>
        <Link href="/Products" className="text-sm underline text-amber-600">← Back to Products</Link>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white text-black">


      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/Products" className="hover:text-gray-900">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.Name}</span>
          {selectedVariant && (
            <>
              <span className="mx-2">/</span>
              <span className="text-gray-500">{selectedVariant.SKU}</span>
            </>
          )}
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">


          <div className="lg:col-span-1 flex gap-3">

            <div className="flex flex-col gap-2">
              {[placeholderImage, placeholderImage].map((img, i) => (
                <div
                  key={i}
                  className="w-16 h-16 border border-gray-200 rounded overflow-hidden cursor-pointer hover:border-amber-400 transition"
                >
                  <img src={img} alt={product.Name} className="w-full h-full object-contain p-1" />
                </div>
              ))}
            </div>

            <div className="flex-1 border border-gray-100 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
              <img
                src={placeholderImage}
                alt={product.Name}
                className="w-full h-full object-contain p-4 max-h-80"
              />
            </div>
          </div>


          <div className="lg:col-span-1">
            <span className="bg-slate-100 text-slate-900 text-xs font-medium px-3 py-1 rounded">
              SKU: {product.SKU}
            </span>

            <h1 className="text-3xl font-light text-gray-900 mt-3 mb-4 leading-tight">
              {product.Name}
            </h1>


            {bullets.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">About this item</h3>
                <ul className="space-y-2 text-sm text-gray-700 leading-relaxed">
                  {bullets.map((b, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-amber-600 font-bold mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}


            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Select Variant
                {selectedVariantSKU && (
                  <span className="ml-2 text-amber-600 font-normal">
                    ({selectedVariantSKU})
                  </span>
                )}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {product.variants?.map((v) => (
                  <button
                    key={v.SKU}
                    onClick={() => setSelectedVariantSKU(v.SKU)}
                    className={`px-3 py-2 text-xs rounded border transition text-center ${selectedVariantSKU === v.SKU
                        ? "bg-amber-400 border-amber-400 text-slate-900 font-semibold"
                        : "border-gray-300 text-gray-700 hover:border-amber-300 hover:bg-amber-50"
                      }`}
                  >
                    {v.SKU}
                  </button>
                ))}
              </div>
            </div>


            <div className="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-4">
              <div className="flex gap-2">
                <span className="font-medium text-gray-900 min-w-[120px]">Supplier:</span>
                <span>Omson Scientific Labs</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-gray-900 min-w-[120px]">Certification:</span>
                <span>NABL Certified, ISO 9001:2015</span>
              </div>
            </div>
          </div>


          <div className="lg:col-span-1 mt-2">
            <div className="border-2 border-gray-200 rounded-2xl p-5 space-y-4 sticky top-4 ml-2">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-slate-900">₹399</span>
                  <span className="text-sm line-through text-gray-400">₹499</span>
                  <span className="text-xs font-semibold text-green-600">20% off</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Available at:</p>
                <p className="text-base font-bold text-gray-900">Delhi, Mumbai, Chennai</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Quantity:</p>
                <div className="flex items-center border border-gray-300 rounded w-fit">
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

              {selectedVariant && (
                <p className="text-xs text-gray-500 bg-gray-50 rounded px-3 py-2">
                  Selected: <strong>{selectedVariant.SKU}</strong> — {selectedVariant.Name}
                </p>
              )}

              <button className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold py-3 rounded transition">
                Add to Cart
              </button>
              <button className="w-full border-2 border-slate-900 text-slate-900 font-semibold py-3 rounded hover:bg-slate-50 transition">
                Buy Now
              </button>
            </div>
          </div>
        </div>


        {tableRows.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-light text-gray-900 mb-4">Variants / Specifications</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {tableHeaders.map(h => (
                      <th key={h} className="px-4 py-3 font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => {

                    const catNo = row['CAT NO'] ?? '';
                    const isSelected = catNo === selectedVariantSKU;
                    return (
                      <tr
                        key={i}
                        onClick={() => {
                          const match = product.variants?.find(v => v.SKU === catNo);
                          if (match) setSelectedVariantSKU(match.SKU);
                        }}
                        className={`border-b border-gray-100 cursor-pointer transition ${isSelected
                            ? 'bg-amber-50 border-amber-200'
                            : 'hover:bg-gray-50'
                          }`}
                      >
                        {tableHeaders.map(h => (
                          <td key={h} className={`px-4 py-3 ${h === 'CAT NO' ? 'font-medium text-amber-700' : 'text-gray-700'}`}>
                            {row[h]}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">Click a row to select that variant.</p>
          </div>
        )}
      </div>


      <div className="border-t border-gray-200 bg-gray-50 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-light text-gray-900 mb-2">Related Products</h2>
          <p className="text-sm text-gray-400">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}