import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ROLE_SCOPES: Record<string, string[]> = {
  admin:  ["staff","orders","dealers","products","invoices"],
  staff:  ["orders","products","invoices"],
  dealer: ["orders","products","order_history","invoices"],
};

const DETAIL_ROUTES: Record<string, string> = {
  staff:         "/dashboard/staff",
  orders:        "/dashboard/orders",
  dealers:       "/dashboard/dealers",
  products:      "/dashboard/products",
  invoices:      "/dashboard/invoices",
  order_history: "/dashboard/my-orders",
};

export async function POST(req: NextRequest) {
  const { query, role, scopes } = await req.json();

  const allowed = ROLE_SCOPES[role] ?? [];
  const safe = ((scopes as string[]) ?? allowed).filter(s => allowed.includes(s));

  // Step 1: Gemini extracts keywords fast
  const intentRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text:
          `Extract search intent. Query: "${query}"
Return JSON only:
{"keywords":["word1"],"scope_hint":"orders|products|staff|dealers|invoices|null","status":null}`
        }]}]
      }),
    }
  );
  const intentJson = await intentRes.json();
  const intentText = intentJson.candidates[0].content.parts[0].text;
  const intent = JSON.parse(intentText.replace(/```json|```/g,"").trim());

  const targetScopes = intent.scope_hint && safe.includes(intent.scope_hint)
    ? [intent.scope_hint]
    : safe;

  // Step 2: search Supabase with ilike (fast, no full table scan)
  const results: any[] = [];
  const keyword = intent.keywords?.[0] ?? query;

  for (const scope of targetScopes) {
    let q = supabase.from(scope).select("*").limit(10);

    // text search across name/title/description
    q = q.or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%,status.ilike.%${keyword}%`);

    const { data, error } = await q;
    if (error || !data) continue;

    data.forEach(row => {
      results.push({
        id:      row.id,
        scope,
        title:   row.name || row.order_number || row.id,
        snippet: row.description || row.notes || row.status || "",
        meta:    row.status || row.price || row.total || "",
        url:     `${DETAIL_ROUTES[scope]}/${row.id}`,
      });
    });
  }

  return NextResponse.json(results);
}