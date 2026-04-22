import { useState, useCallback } from "react";
import {
  generateOrderInvoicePDF,
  uploadOrderInvoiceToSupabase,
  listInvoices,
  deleteInvoice,
  downloadOrderInvoice,
  OrderInvoiceData,
  InvoiceResult,
} from "@/lib/invoicegenerator";

// Matches your Supabase `invoices` table exactly
export interface Invoice {
  invoice_id:     string;
  invoice_number: string;
  dealer_id:      string;
  buyer_name:     string;
  file_url:       string;
  file_path:      string;
  invoice_date:   string;
  total_amount:   number;
  created_at:     string;
}

export function useInvoiceManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError    ] = useState<string | null>(null);
  const [invoices,  setInvoices ] = useState<Invoice[]>([]);

  /** Generate PDF from order data and upload to Supabase */
  const generateAndUpload = useCallback(async (order: OrderInvoiceData): Promise<InvoiceResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const blob   = await generateOrderInvoicePDF(order);
      const result = await uploadOrderInvoiceToSupabase(blob, order);
      if (!result.success) setError(result.error || "Upload failed");
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      return { success: false, message: msg, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Download invoice PDF directly to device */
  const downloadInvoicePDF = useCallback(async (order: OrderInvoiceData): Promise<InvoiceResult> => {
    return downloadOrderInvoice(order);
  }, []);

  /** Fetch all invoices list from Supabase */
  const fetchInvoicesList = useCallback(async (_dealerId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await listInvoices(_dealerId || "", 100);
      if (result.success) {
        setInvoices(result.data as Invoice[]);
      } else {
        setError(result.error || "Failed to load invoices");
      }
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      return { success: false, message: msg, error: msg, data: [] };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Download an already-stored invoice via its file_url */
  const downloadStoredInvoice = useCallback(async (invoice: Invoice): Promise<InvoiceResult> => {
    try {
      const response = await fetch(invoice.file_url);
      if (!response.ok) throw new Error("Failed to fetch file");
      const blob = await response.blob();
      const url  = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href     = url;
      link.download = `${invoice.invoice_number.replace(/\//g, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return { success: true, message: "Downloaded" };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      return { success: false, message: "Download failed", error: msg };
    }
  }, []);

  /** Delete an invoice from Supabase storage + DB */
  const removeInvoice = useCallback(async (invoiceId: string, filePath: string): Promise<InvoiceResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await deleteInvoice(invoiceId, filePath);
      if (result.success) {
        setInvoices(prev => prev.filter(inv => inv.invoice_id !== invoiceId));
      } else {
        setError(result.error || "Delete failed");
      }
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      return { success: false, message: msg, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    invoices,
    generateAndUpload,
    downloadInvoicePDF,
    fetchInvoicesList,
    downloadStoredInvoice,
    removeInvoice,
  };
}