/**
 * lib/drafts.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * All Supabase CRUD helpers for order drafts.
 * Dealer isolation is enforced by always filtering on dealer_id.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from "@supabase/supabase-js";

// ── Supabase client ───────────────────────────────────────────────────────────
// Replace the env vars with your actual Supabase project URL and anon key,
// or set them in .env.local:
//   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL2!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY2!
);

export { supabase };

// ── Types ─────────────────────────────────────────────────────────────────────

/** Mirrors ProductRow in app/order/page.tsx */
export type DraftProductRow = {
  key: number;
  productname: string;
  displayName: string;
  variantCode: string;
  producQuanity: number;
  price: number;
  packSize: number;
};

export type OrderDraft = {
  id: string;
  dealer_id: string;
  name: string;
  shipto: string | null;
  refno: string | null;
  coupon_code: string | null;
  coupon_pct: number | null;
  rows: DraftProductRow[];
  created_at: string;
  updated_at: string;
};

export type DraftPayload = {
  dealer_id: string;
  name: string;
  shipto?: string;
  refno?: string;
  coupon_code?: string | null;
  coupon_pct?: number | null;
  rows: DraftProductRow[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * List all drafts for a dealer, newest first.
 */
export async function getDrafts(dealerId: string): Promise<OrderDraft[]> {
  const { data, error } = await supabase
    .from("order_drafts")
    .select("*")
    .eq("dealer_id", dealerId)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as OrderDraft[];
}

/**
 * Fetch a single draft by id, verified to belong to dealerId.
 */
export async function getDraftById(
  id: string,
  dealerId: string
): Promise<OrderDraft | null> {
  const { data, error } = await supabase
    .from("order_drafts")
    .select("*")
    .eq("id", id)
    .eq("dealer_id", dealerId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw new Error(error.message);
  }
  return data as OrderDraft;
}

/**
 * Save a brand-new draft. Returns the created row.
 */
export async function saveDraft(payload: DraftPayload): Promise<OrderDraft> {
  const { data, error } = await supabase
    .from("order_drafts")
    .insert([
      {
        order_rows: payload.rows,
        dealer_id:   payload.dealer_id,
        name:        payload.name,
        shipto:      payload.shipto ?? null,
        refno:       payload.refno ?? null,
        coupon_code: payload.coupon_code ?? null,
        coupon_pct:  payload.coupon_pct ?? null,
        rows:        payload.rows,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as OrderDraft;
}

/**
 * Overwrite an existing draft (must belong to dealerId).
 */
export async function updateDraft(
  id: string,
  dealerId: string,
  payload: Partial<Omit<DraftPayload, "dealer_id">>
): Promise<OrderDraft> {
  const { data, error } = await supabase
    .from("order_drafts")
    .update({
      ...(payload.name        !== undefined && { name:        payload.name }),
      ...(payload.shipto      !== undefined && { shipto:      payload.shipto }),
      ...(payload.refno       !== undefined && { refno:       payload.refno }),
      ...(payload.coupon_code !== undefined && { coupon_code: payload.coupon_code }),
      ...(payload.coupon_pct  !== undefined && { coupon_pct:  payload.coupon_pct }),
      ...(payload.rows        !== undefined && { rows:        payload.rows }),
      ...(payload.rows !== undefined && { order_rows: payload.rows }),

    })
    .eq("id", id)
    .eq("dealer_id", dealerId)   // enforce ownership
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as OrderDraft;
}

/**
 * Rename a draft without touching its rows.
 */
export async function renameDraft(
  id: string,
  dealerId: string,
  name: string
): Promise<void> {
  const { error } = await supabase
    .from("order_drafts")
    .update({ name })
    .eq("id", id)
    .eq("dealer_id", dealerId);

  if (error) throw new Error(error.message);
}

/**
 * Permanently delete a draft.
 */
export async function deleteDraft(
  id: string,
  dealerId: string
): Promise<void> {
  const { error } = await supabase
    .from("order_drafts")
    .delete()
    .eq("id", id)
    .eq("dealer_id", dealerId);

  if (error) throw new Error(error.message);
}

/**
 * Count how many drafts a dealer has (for badges / limits).
 */
export async function getDraftCount(dealerId: string): Promise<number> {
  const { count, error } = await supabase
    .from("order_drafts")
    .select("id", { count: "exact", head: true })
    .eq("dealer_id", dealerId);

  if (error) throw new Error(error.message);
  return count ?? 0;
}