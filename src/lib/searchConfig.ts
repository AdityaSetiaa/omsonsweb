export const ROLE_SCOPES: Record<string, string[]> = {
  admin:  ["staff","orders","dealers","products","invoices"],
  staff:  ["orders","products","invoices"],
  dealer: ["orders","products","order_history","invoices"],
};

export const SCOPE_ROUTES: Record<string, string> = {
  staff:         "/dashboard/staff",
  orders:        "/dashboard/orders",
  dealers:       "/dashboard/dealers",
  products:      "/dashboard/products",
  invoices:      "/dashboard/invoices",
  order_history: "/dashboard/my-orders",
};

// builds the exact detail page URL
export function detailUrl(scope: string, id: string) {
  return `${SCOPE_ROUTES[scope]}/${id}`;
}