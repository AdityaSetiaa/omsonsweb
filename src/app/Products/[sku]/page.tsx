'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useCartStore } from "@/Store/store";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
type Variant = {
  SKU: string;
  Name: string;
  "Short description": string;
  Description: string;
  "Regular price": number | null;
  "Sale price": number | null;
  "In stock": boolean;
  "Attribute value": string;
};

type Product = {
  SKU: number | string;
  Name: string;
  "Short description": string;
  Description: string;
  Categories: string[];
  Brands: string | null;
  Images: string[];
  "Regular price": number | null;
  "Sale price": number | null;
  "In stock": boolean;
  Stock: number | null;
  "Weight (kg)": number | null;
  variants?: Variant[];
  SEO?: { title?: string; meta_description?: string; focus_keyword?: string };
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

/** Get product image at index. Returns null (not a placeholder) if missing. */
function getImage(product: Product, idx = 0): string | null {
  const imgs = product.Images ?? [];
  return imgs[idx] || null;
}

/**
 * Prices are on variants only, in paise (100 paise = ₹1).
 * 10000 paise = ₹100.00 — this is the price PER PACK (as listed in "PACK OF" column).
 */
function getVariantPrice(v: Variant | null): { regular: number | null; sale: number | null } {
  if (!v) return { regular: null, sale: null };
  return { regular: v["Regular price"], sale: v["Sale price"] };
}

/** Format paise → ₹ rupees string */
function fmt(paise: number | null): string {
  if (paise === null) return "—";
  return `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Clean HTML tags from a string */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim();
}

/** Parse description HTML table → headers + rows */
function parseDescTable(html: string): { headers: string[]; rows: Record<string, string>[] } {
  if (!html) return { headers: [], rows: [] };
  const theadMatch = html.match(/<thead>([\s\S]*?)<\/thead>/i);
  const headers: string[] = [];
  if (theadMatch) {
    [...theadMatch[1].matchAll(/<td>([\s\S]*?)<\/td>/gi)].forEach(m => headers.push(stripHtml(m[1])));
  }
  const tbodyMatch = html.match(/<tbody>([\s\S]*?)<\/tbody>/i);
  const rows: Record<string, string>[] = [];
  if (tbodyMatch) {
    [...tbodyMatch[1].matchAll(/<tr>([\s\S]*?)<\/tr>/gi)].forEach(tr => {
      const cells = [...tr[1].matchAll(/<td>([\s\S]*?)<\/td>/gi)].map(m => stripHtml(m[1]));
      const row: Record<string, string> = {};
      cells.forEach((cell, i) => { row[headers[i] ?? `col${i}`] = cell; });
      rows.push(row);
    });
  }
  return { headers, rows };
}

/** Parse bullet points from Short description HTML */
function parseBullets(html: string): string[] {
  if (!html) return [];
  return [...html.matchAll(/<li>([\s\S]*?)<\/li>/gi)]
    .map(m => stripHtml(m[1]))
    .filter(Boolean);
}

/**
 * Find the "pack" column key in table headers.
 * Handles: "PACK OF", "Pack of", "Pack Unit", "Qty/Pack", "Quantity", "Minimum Qty/Pack", etc.
 */
function findPackCol(headers: string[]): string | undefined {
  return headers.find(h => /pack|qty|quantity/i.test(h));
}

/** Parse pack size from a string like "10", "10 Mtr", "100", etc. */
function parsePackSize(s: string): number {
  const n = parseInt(s, 10);
  return isNaN(n) ? 1 : n;
}

/** Returns up to `limit` products from same top-level category, excluding self */
function getRelated(all: Product[], current: Product, limit = 6): Product[] {
  if (!current.Categories?.length) return [];
  const topCat = current.Categories[0].split(">")[0].trim();
  return all
    .filter(p => String(p.SKU) !== String(current.SKU) && (p.Categories ?? []).some(c => c.startsWith(topCat)))
    .slice(0, limit);
}

// ─────────────────────────────────────────────────────────────
// CART TOAST
// ─────────────────────────────────────────────────────────────
function CartToast({ item, onDone }: { item: { name: string; sku: string; bulk?: boolean } | null; onDone: () => void }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (!item) return;
    setVis(true);
    const t = setTimeout(() => { setVis(false); setTimeout(onDone, 300); }, 2500);
    return () => clearTimeout(t);
  }, [item, onDone]);
  if (!item) return null;
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, transform: vis ? "translateY(0)" : "translateY(-14px)", opacity: vis ? 1 : 0, transition: "all 0.28s cubic-bezier(0.34,1.56,0.64,1)", pointerEvents: "none" }}>
      <div style={{ background: "#0f172a", color: "#fff", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.22)", minWidth: 260 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700 }}>{item.bulk ? "All variants added" : "Added to cart"}</p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8" }}>{item.name} · SKU {item.sku}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// NO IMAGE PLACEHOLDER (inline SVG, no external URL)
// ─────────────────────────────────────────────────────────────
function NoImageBox({ height = 280 }: { height?: number }) {
  return (
    <div style={{ width: "100%", height, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "#cbd5e1", background: "#f8fafc", borderRadius: 8 }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <path d="m21 15-5-5L5 21"/>
      </svg>
      <span style={{ fontSize: 12 }}>No image available</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RELATED CARD
// ─────────────────────────────────────────────────────────────
function RelatedCard({ product }: { product: Product }) {
  const img = getImage(product, 0);
  const firstVariant = product.variants?.[0];
  const regular = firstVariant?.["Regular price"] ?? null;
  const sale    = firstVariant?.["Sale price"] ?? null;
  const display = sale ?? regular;

  // get pack size for per-unit calculation
  const { rows, headers } = parseDescTable(product.Description ?? "");
  const packCol = findPackCol(headers);
  const packStr = packCol && rows[0] ? rows[0][packCol] : "1";
  const packSize = parsePackSize(packStr);
  const perUnit = display && packSize > 1 ? Math.round(display / packSize) : null;

  return (
    <Link href={`/Products/${product.SKU}`} style={{ textDecoration: "none" }}>
      <div
        style={{ background: "#fff", borderRadius: 10, border: "1px solid #e8edf3", overflow: "hidden", transition: "box-shadow .2s, transform .2s" }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)"; el.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}
      >
        <div style={{ background: "#f8fafc", padding: 14, aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {img
            ? <img src={img} alt={product.Name} style={{ width: "100%", height: "100%", objectFit: "contain" }} loading="lazy" />
            : <NoImageBox height={120} />
          }
        </div>
        <div style={{ padding: "10px 12px 12px" }}>
          <h4 style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", lineHeight: 1.4, margin: "0 0 4px" }}>{product.Name}</h4>
          <span style={{ fontSize: 10.5, color: "#94a3b8", display: "block", marginBottom: 5 }}>SKU: {product.SKU}</span>
          {display !== null && (
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#6A5ACD" }}>{fmt(display)}</span>
                {sale !== null && regular !== null && <span style={{ fontSize: 11, color: "#94a3b8", textDecoration: "line-through" }}>{fmt(regular)}</span>}
              </div>
              {packSize > 1 && (
                <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                  <span style={{ fontSize: 10, color: "#64748b", background: "#f1f5f9", padding: "1px 5px", borderRadius: 3 }}>Pack of {packSize}</span>
                  {perUnit && <span style={{ fontSize: 10, color: "#94a3b8" }}>{fmt(perUnit)}/unit</span>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function ProductDetailsPage({ params }: { params: Promise<{ sku: string }> }) {
  const sku = decodeURIComponent(React.use(params).sku);

  const [allProducts, setAllProducts]   = useState<Product[]>([]);
  const [product, setProduct]           = useState<Product | null>(null);
  const [loading, setLoading]           = useState(true);
  const [notFound, setNotFound]         = useState(false);
  const [selectedVariantSKU, setSelectedVariantSKU] = useState<string | null>(null);
  const [selectedImageIdx, setSelectedImageIdx]     = useState(0);
  const [quantity, setQuantity]         = useState(1);
  const [rowPacks, setRowPacks]         = useState<Record<string, number>>({});
  const [bulkMode, setBulkMode]         = useState(false);
  const [toast, setToast]               = useState<{ name: string; sku: string; bulk?: boolean } | null>(null);

  const addToCart = useCartStore(s => s.addToCart);
  const cart      = useCartStore(s => s.cart);

  useEffect(() => {
    setRowPacks(prev => {
      const u = { ...prev };
      cart.forEach(item => { if (item.id in u) u[item.id] = item.quantity ?? u[item.id]; });
      return u;
    });
  }, [cart]);

  useEffect(() => {
    axios.get("/data/products.json")
      .then(res => {
        const data: Product[] = res.data;
        setAllProducts(data);

        let found = data.find(p => String(p.SKU) === sku);
        if (!found) {
          found = data.find(p => p.variants?.some(v => v.SKU === sku));
          if (found) setSelectedVariantSKU(sku);
        }

        if (found) {
          setProduct(found);
          if (!selectedVariantSKU && found.variants?.length) setSelectedVariantSKU(found.variants[0].SKU);
          const init: Record<string, number> = {};
          found.variants?.forEach(v => { init[v.SKU] = cart.find(c => c.id === v.SKU)?.quantity ?? 1; });
          setRowPacks(init);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [sku]);

  // Derived
  const selectedVariant = product?.variants?.find(v => v.SKU === selectedVariantSKU) ?? null;
  const bullets         = parseBullets(product?.["Short description"] ?? "");
  const { headers: tableHeaders, rows: tableRows } = parseDescTable(product?.Description ?? "");
  const packColKey = findPackCol(tableHeaders);

  // Price of currently selected variant (paise)
  const { regular: varRegular, sale: varSale } = getVariantPrice(selectedVariant);
  const displayPricePaise  = varSale ?? varRegular;
  const originalPricePaise = varSale !== null ? varRegular : null;

  // Pack size for selected variant (from matching row in description table)
  const selectedRow   = tableRows.find(r => (r["CAT NO"] ?? r[tableHeaders[0]]) === selectedVariantSKU);
  const selectedPackStr  = selectedRow && packColKey ? selectedRow[packColKey] : "1";
  const selectedPackSize = parsePackSize(selectedPackStr);
  const perUnitPaise  = displayPricePaise !== null && selectedPackSize > 1
    ? Math.round(displayPricePaise / selectedPackSize)
    : null;

  // Total for quantity spinner
  const lineTotalPaise = displayPricePaise !== null ? displayPricePaise * quantity : null;

  // Discount %
  const discountPct = originalPricePaise && displayPricePaise
    ? Math.round(((originalPricePaise - displayPricePaise) / originalPricePaise) * 100) : 0;

  // Per-row helper
  const rowCalc = (catNo: string, packStr: string) => {
    const numPacks  = rowPacks[catNo] ?? 1;
    const packSize  = parsePackSize(packStr);
    const vm        = product?.variants?.find(v => v.SKU === catNo);
    const unitPaise = vm?.["Sale price"] ?? vm?.["Regular price"] ?? 0;
    return { numPacks, packSize, unitPaise, totalPaise: unitPaise * numPacks, perUnit: packSize > 1 && unitPaise ? Math.round(unitPaise / packSize) : null };
  };

  const related = product ? getRelated(allProducts, product) : [];

  // ── Cart actions ─────────────────────────────────────────
  const addVariant = (catNo: string, name: string, pricePaise: number, qty: number, packSize: number) => {
    addToCart({ id: catNo, name, price: pricePaise, packSize, initialQty: qty });
    setToast({ name, sku: catNo });
  };

  const addAll = () => {
    if (!product) return;
    tableRows.forEach(row => {
      const catNo = row["CAT NO"] ?? row[tableHeaders[0]] ?? "";
      if (!catNo) return;
      const { numPacks, packSize, unitPaise } = rowCalc(catNo, packColKey ? row[packColKey] : "1");
      const vm = product.variants?.find(v => v.SKU === catNo);
      addToCart({ id: catNo, name: vm?.Name ?? product.Name, price: unitPaise, packSize, initialQty: numPacks });
    });
    setToast({ name: product.Name, sku: `${tableRows.length} variants`, bulk: true });
  };

  const handleAddSelected = () => {
    if (!selectedVariantSKU || !product || displayPricePaise === null) return;
    if (bulkMode) { addAll(); return; }
    addVariant(selectedVariantSKU, selectedVariant?.Name ?? product.Name, displayPricePaise, quantity, selectedPackSize);
  };

  const handleAddRow = (catNo: string) => {
    if (bulkMode) { addAll(); return; }
    if (!product) return;
    const vm      = product.variants?.find(v => v.SKU === catNo);
    const packStr = (tableRows.find(r => (r["CAT NO"] ?? r[tableHeaders[0]]) === catNo) ?? {})[packColKey ?? ""] ?? "1";
    const { numPacks, packSize, unitPaise } = rowCalc(catNo, packStr);
    addVariant(catNo, vm?.Name ?? product.Name, unitPaise, numPacks, packSize);
    setSelectedVariantSKU(catNo);
  };

  // ── Guards ───────────────────────────────────────────────
  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#94a3b8", fontSize: 14 }}>Loading product…</p></div>;
  if (notFound || !product) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <p style={{ color: "#64748b", fontSize: 14 }}>Product not found: <strong>{sku}</strong></p>
      <Link href="/Products" style={{ color: "#d97706", fontSize: 14, textDecoration: "underline" }}>← Back to Products</Link>
    </div>
  );

  const images       = product.Images?.filter(Boolean) ?? [];
  const stickyInCart = cart.some(c => c.id === selectedVariantSKU);

  return (
    <>
      <CartToast item={toast} onDone={() => setToast(null)} />

      <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif", color: "#0f172a" }}>

        {/* BREADCRUMB */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 28px", fontSize: 13, color: "#64748b", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <Link href="/Products" style={{ color: "#64748b", textDecoration: "none" }}>Products</Link>
            {product.Categories?.length > 0 && <>
              <span>/</span>
              <span>{product.Categories[0].split(">").pop()?.trim()}</span>
            </>}
            <span>/</span>
            <span style={{ color: "#0f172a", fontWeight: 600 }}>{product.Name}</span>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 28px" }}>

          {/* ── 3-COLUMN LAYOUT ─────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 320px", gap: 36, alignItems: "start" }}>

            {/* IMAGE COLUMN */}
            <div style={{ display: "flex", gap: 10 }}>
              {/* Thumbnails — only show if images exist */}
              {images.length > 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {images.map((img, i) => (
                    <div key={i} onClick={() => setSelectedImageIdx(i)}
                      style={{ width: 58, height: 58, border: `2px solid ${selectedImageIdx === i ? "#6A5ACD" : "#e2e8f0"}`, borderRadius: 8, overflow: "hidden", cursor: "pointer", background: "#fff", padding: 4, transition: "border-color .2s", flexShrink: 0 }}>
                      <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                  ))}
                </div>
              )}
              {/* Main image */}
              <div style={{ flex: 1, background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, minHeight: 320 }}>
                {images.length > 0
                  ? <img src={images[selectedImageIdx] ?? images[0]} alt={product.Name} style={{ maxWidth: "100%", maxHeight: 280, objectFit: "contain" }} />
                  : <NoImageBox height={280} />
                }
              </div>
            </div>

            {/* INFO COLUMN */}
            <div>
              {/* Category tags */}
              {product.Categories?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  {product.Categories.map((cat, i) => (
                    <span key={i} style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", background: "#eff6ff", color: "#1e40af", borderRadius: 4, letterSpacing: ".05em", textTransform: "uppercase" }}>
                      {cat.split(">").pop()?.trim()}
                    </span>
                  ))}
                </div>
              )}

              <span style={{ fontSize: 11, color: "#94a3b8", display: "inline-block", marginBottom: 8, background: "#f1f5f9", padding: "2px 8px", borderRadius: 4 }}>SKU: {product.SKU}</span>

              <h1 style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.3, margin: "0 0 16px" }}>{product.Name}</h1>

              {/* Bullets */}
              {bullets.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: ".07em", textTransform: "uppercase", margin: "0 0 10px" }}>About this item</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {bullets.map((b, i) => (
                      <li key={i} style={{ display: "flex", gap: 10, fontSize: 13.5, color: "#374151", lineHeight: 1.5 }}>
                        <span style={{ color: "#f59e0b", fontWeight: 700, marginTop: 2, flexShrink: 0 }}>▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Variant chips */}
              {product.variants && product.variants.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: ".07em", textTransform: "uppercase", margin: "0 0 10px" }}>
                    Select Variant
                    {selectedVariantSKU && <span style={{ color: "#f59e0b", textTransform: "none", marginLeft: 6, fontWeight: 600 }}>({selectedVariantSKU})</span>}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {product.variants.map(v => {
                      const isSel  = selectedVariantSKU === v.SKU;
                      const inCart = cart.some(c => c.id === v.SKU);
                      return (
                        <button key={v.SKU} onClick={() => { setSelectedVariantSKU(v.SKU); setQuantity(1); }}
                          style={{ position: "relative", padding: "6px 12px", fontSize: 12, borderRadius: 6,
                            border: `2px solid ${isSel ? "#6A5ACD" : inCart ? "#22c55e" : "#e2e8f0"}`,
                            background: isSel ? "#6A5ACD" : inCart ? "#f0fdf4" : "#fff",
                            color: isSel ? "#fff" : inCart ? "#15803d" : "#374151",
                            fontWeight: isSel ? 700 : 500, cursor: "pointer", transition: "all .15s" }}>
                          {v["Attribute value"] || v.SKU}
                          {inCart && !isSel && <span style={{ position: "absolute", top: -5, right: -5, width: 10, height: 10, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff" }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Selected variant summary */}
              {selectedVariant && displayPricePaise !== null && (
                <div style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 14px", marginBottom: 16, fontSize: 13 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "#64748b" }}>Catalogue No.</span>
                    <span style={{ fontWeight: 700 }}>{selectedVariant.SKU}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "#64748b" }}>Pack of</span>
                    <span style={{ fontWeight: 700 }}>{selectedPackSize} {selectedPackStr.toLowerCase().includes('mtr') ? 'Mtr' : 'units'}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "#64748b" }}>Price per pack</span>
                    <span style={{ fontWeight: 700, color: "#6A5ACD" }}>{fmt(displayPricePaise)}</span>
                  </div>
                  {perUnitPaise && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ color: "#64748b" }}>Price per unit</span>
                      <span style={{ fontWeight: 700, color: "#64748b" }}>{fmt(perUnitPaise)}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>Availability</span>
                    <span style={{ fontWeight: 700, color: selectedVariant["In stock"] ? "#16a34a" : "#dc2626" }}>
                      {selectedVariant["In stock"] ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              )}

              {/* Meta */}
              <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 13, color: "#475569", borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontWeight: 600, color: "#0f172a", minWidth: 110 }}>Supplier:</span>
                  <span>Omson Scientific Labs</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontWeight: 600, color: "#0f172a", minWidth: 110 }}>Certification:</span>
                  <span>NABL Certified, ISO 9001:2015</span>
                </div>
                {product.Brands && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontWeight: 600, color: "#0f172a", minWidth: 110 }}>Brand:</span>
                    <span>{product.Brands}</span>
                  </div>
                )}
              </div>
            </div>

            {/* PURCHASE CARD */}
            <div style={{ background: "#fff", border: "2px solid #e2e8f0", borderRadius: 16, padding: 22, display: "flex", flexDirection: "column", gap: 18, position: "sticky", top: 20 }}>

              {/* Price */}
              <div>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 4px" }}>
                  {product.variants && product.variants.length > 1 ? "Starting from" : "Price"} 
                </p>
                {displayPricePaise !== null ? (
                  <>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{fmt(displayPricePaise)}</span>
                      {originalPricePaise !== null && (
                        <>
                          <span style={{ fontSize: 14, color: "#94a3b8", textDecoration: "line-through" }}>{fmt(originalPricePaise)}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", background: "#f0fdf4", padding: "2px 6px", borderRadius: 4 }}>{discountPct}% OFF</span>
                        </>
                      )}
                    </div>
                    {/* Pack info below price */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5, flexWrap: "wrap" }}>
                      {selectedPackSize > 1 && (
                        <span style={{ fontSize: 11.5, color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
                          Pack of {selectedPackSize}
                        </span>
                      )}
                      {perUnitPaise && (
                        <span style={{ fontSize: 11.5, color: "#94a3b8" }}>
                          = {fmt(perUnitPaise)} / unit
                        </span>
                      )}
                    </div>
                    {quantity > 1 && lineTotalPaise !== null && (
                      <p style={{ fontSize: 12, color: "#64748b", margin: "6px 0 0" }}>
                        {quantity} packs = <strong>{fmt(lineTotalPaise)}</strong>
                      </p>
                    )}
                  </>
                ) : (
                  <p style={{ fontSize: 16, fontWeight: 600, color: "#94a3b8", margin: 0 }}>Select a variant</p>
                )}
              </div>

              {/* Availability */}
              <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 12px", fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "#64748b" }}>Availability</span>
                  <span style={{ fontWeight: 700, color: product["In stock"] ? "#16a34a" : "#dc2626" }}>
                    {product["In stock"] ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Ships from</span>
                  <span style={{ fontWeight: 600 }}>Delhi · Mumbai · Chennai</span>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 8px" }}>Packs:</p>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: 8, width: "fit-content" }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ padding: "8px 16px", border: "none", background: "transparent", cursor: "pointer", fontSize: 18, color: "#374151" }}>−</button>
                  <span style={{ padding: "8px 20px", fontSize: 15, fontWeight: 700, borderLeft: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0" }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} style={{ padding: "8px 16px", border: "none", background: "transparent", cursor: "pointer", fontSize: 18, color: "#374151" }}>+</button>
                </div>
              </div>

              <button onClick={handleAddSelected} disabled={!selectedVariantSKU || !product["In stock"]}
                style={{ width: "100%", padding: "13px 0", fontSize: 14, fontWeight: 700, borderRadius: 10, border: "2px solid", cursor: (!selectedVariantSKU || !product["In stock"]) ? "not-allowed" : "pointer", transition: "all .15s",
                  background: stickyInCart ? "#f0fdf4" : "#6A5ACD", borderColor: stickyInCart ? "#22c55e" : "#6A5ACD",
                  color: stickyInCart ? "#15803d" : "#fff", opacity: (!selectedVariantSKU || !product["In stock"]) ? 0.5 : 1 }}>
                {stickyInCart ? "✓ Added — Add More" : "Add to Cart"}
              </button>

              <button style={{ width: "100%", padding: "13px 0", fontSize: 14, fontWeight: 700, borderRadius: 10, border: "2px solid #0f172a", background: "#fff", cursor: "pointer", color: "#0f172a", transition: "background .15s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={e => (e.currentTarget.style.background = "#fff")}>
                Buy Now
              </button>

              {product.variants && product.variants.length > 1 && (
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, textAlign: "center" }}>
                  {product.variants.length} variants · prices may vary by size
                </p>
              )}
            </div>
          </div>

          {/* ── VARIANTS TABLE ─────────────────────────────── */}
          {tableRows.length > 0 && (
            <div style={{ marginTop: 56 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                <h2 style={{ fontSize: 20, fontWeight: 300, margin: 0 }}>Variants &amp; Specifications</h2>
                <button onClick={() => setBulkMode(v => !v)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", fontSize: 13, fontWeight: 700, borderRadius: 8, border: "none", cursor: "pointer", background: bulkMode ? "#6A5ACD" : "#0f172a", color: "#fff", transition: "background .15s" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  {bulkMode ? "✓ Bulk Mode ON" : "Bulk Order — Add All"}
                </button>
              </div>

              <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #e2e8f0", background: "#fff" }}>
                <table style={{ width: "100%", fontSize: 13, textAlign: "left", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      {tableHeaders.map(h => <th key={h} style={{ padding: "12px 16px", fontWeight: 700, color: "#374151", whiteSpace: "nowrap" }}>{h}</th>)}
                      <th style={{ padding: "12px 16px", fontWeight: 700, color: "#374151" }}>Qty (packs)</th>
                      <th style={{ padding: "12px 16px", fontWeight: 700, color: "#374151" }}>Price / Pack</th>
                      <th style={{ padding: "12px 16px", fontWeight: 700, color: "#374151" }}>Per Unit</th>
                      <th style={{ padding: "12px 16px", fontWeight: 700, color: "#374151" }}>Total</th>
                      <th style={{ padding: "12px 16px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row, i) => {
                      const catNo    = row["CAT NO"] ?? row[tableHeaders[0]] ?? "";
                      const packStr  = packColKey ? row[packColKey] : "1";
                      const isSel    = catNo === selectedVariantSKU;
                      const { numPacks, packSize, unitPaise, totalPaise, perUnit } = rowCalc(catNo, packStr);
                      const vm       = product.variants?.find(v => v.SKU === catNo);
                      const cartItem = cart.find(c => c.id === catNo);

                      return (
                        <tr key={i}
                          onClick={() => { if (vm) setSelectedVariantSKU(catNo); }}
                          style={{ borderBottom: "1px solid #f1f5f9", cursor: "pointer", background: isSel ? "#fefce8" : "transparent", transition: "background .15s" }}
                          onMouseEnter={e => { if (!isSel) (e.currentTarget as HTMLElement).style.background = "#f8fafc"; }}
                          onMouseLeave={e => { if (!isSel) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>

                          {/* Description table columns */}
                          {tableHeaders.map(h => (
                            <td key={h} style={{ padding: "11px 16px", color: h === "CAT NO" ? "#d97706" : "#374151", fontWeight: h === "CAT NO" ? 700 : 400 }}>
                              {row[h]}
                            </td>
                          ))}

                          {/* Qty spinner */}
                          <td style={{ padding: "11px 16px" }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: 6, overflow: "hidden" }}>
                                <button onClick={() => setRowPacks(p => ({ ...p, [catNo]: Math.max(1, (p[catNo] ?? 1) - 1) }))}
                                  style={{ padding: "4px 8px", border: "none", background: "#f8fafc", cursor: "pointer", fontSize: 14, color: "#374151" }}>−</button>
                                <span style={{ padding: "4px 10px", fontSize: 12, fontWeight: 700, borderLeft: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0" }}>{numPacks}</span>
                                <button onClick={() => setRowPacks(p => ({ ...p, [catNo]: (p[catNo] ?? 1) + 1 }))}
                                  style={{ padding: "4px 8px", border: "none", background: "#f8fafc", cursor: "pointer", fontSize: 14, color: "#374151" }}>+</button>
                              </div>
                              {(cartItem?.quantity ?? 0) > 0 && (
                                <span style={{ fontSize: 10, fontWeight: 700, color: "#15803d", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 4, padding: "2px 6px", whiteSpace: "nowrap" }}>
                                  {cartItem!.quantity} in cart
                                </span>
                              )}
                            </div>
                            {/* Show total units when pack size > 1 */}
                            {packSize > 1 && (
                              <span style={{ fontSize: 10, color: "#94a3b8", marginTop: 3, display: "block" }}>
                                = {numPacks * packSize} units
                              </span>
                            )}
                          </td>

                          {/* Price per pack */}
                          <td style={{ padding: "11px 16px", color: "#374151", fontWeight: 600 }}>
                            {unitPaise ? fmt(unitPaise) : "—"}
                          </td>

                          {/* Per unit price */}
                          <td style={{ padding: "11px 16px", color: "#94a3b8", fontSize: 12 }}>
                            {perUnit ? fmt(perUnit) : "—"}
                          </td>

                          {/* Running total */}
                          <td style={{ padding: "11px 16px" }} onClick={e => e.stopPropagation()}>
                            <span style={{ fontWeight: 700, color: "#15803d" }}>{totalPaise ? fmt(totalPaise) : "—"}</span>
                          </td>

                          {/* Add to cart */}
                          <td style={{ padding: "11px 16px" }} onClick={e => e.stopPropagation()}>
                            <button onClick={() => handleAddRow(catNo)}
                              style={{ padding: "6px 14px", fontSize: 12, fontWeight: 700, background: "#6A5ACD", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap", transition: "background .15s" }}
                              onMouseEnter={e => (e.currentTarget.style.background = "#0f2a4a")}
                              onMouseLeave={e => (e.currentTarget.style.background = "#6A5ACD")}>
                              Add to Cart
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>
                Click a row to select · Prices shown per pack · Use Bulk Order to add all variants at once.
              </p>
            </div>
          )}

          {/* ── RELATED PRODUCTS ──────────────────────────── */}
          <div style={{ marginTop: 64, paddingTop: 48, borderTop: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 300, margin: 0 }}>Related Products</h2>
              <Link href="/Products" style={{ fontSize: 13, color: "#6A5ACD", fontWeight: 700, textDecoration: "none" }}>View All →</Link>
            </div>
            {related.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 16 }}>
                {related.map(p => <RelatedCard key={p.SKU} product={p} />)}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
                <Link href="/Products" style={{ display: "inline-block", padding: "10px 24px", background: "#6A5ACD", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
                  Browse All Products →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}