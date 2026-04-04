"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DealerData = {
  Dealer_Name?: string;
  Dealer_Address?: string;
  Dealer_shipto?: string;
  Dealer_Number?: string;
  Dealer_Email?: string;
  Dealer_Dealercode?: string;
  gst?: string;
  Dealer_Id?: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
};

type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
};

export default function AddOrderForm() {
  const router = useRouter();
  const [dealer, setDealer] = useState<DealerData>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { productId: "", productName: "", quantity: 1, price: 0, discount: 0, total: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [documentDate, setDocumentDate] = useState(new Date().toISOString().split("T")[0]);

  // Load dealer data from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const userData = JSON.parse(localStorage.getItem("UserData") || "{}");
      setDealer(userData);
    } catch (err) {
      console.error("Error loading dealer data:", err);
    }
  }, []);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          "https://mirisoft.co.in/sas/dealerapi/api/productname"
        );
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
          const formattedProducts = data.data.map((product: any) => ({
            id: product.id || product.product_id,
            name: product.product_name || product.name,
            price: Number(product.price) || 0,
          }));
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      productId,
      productName: product?.name || "",
      price: product?.price || 0,
      total: (product?.price || 0) * newItems[index].quantity - newItems[index].discount,
    };
    setOrderItems(newItems);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...orderItems];
    newItems[index].quantity = Math.max(1, quantity);
    newItems[index].total =
      newItems[index].price * newItems[index].quantity - newItems[index].discount;
    setOrderItems(newItems);
  };

  const handleDiscountChange = (index: number, discount: number) => {
    const newItems = [...orderItems];
    newItems[index].discount = Math.max(0, discount);
    newItems[index].total =
      newItems[index].price * newItems[index].quantity - newItems[index].discount;
    setOrderItems(newItems);
  };

  const handleAddRow = () => {
    setOrderItems([
      ...orderItems,
      { productId: "", productName: "", quantity: 1, price: 0, discount: 0, total: 0 },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const grandTotal = orderItems.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate items
      const validItems = orderItems.filter((item) => item.productId && item.quantity > 0);
      
      if (validItems.length === 0) {
        alert("Please add at least one product");
        setSubmitting(false);
        return;
      }

      // Prepare order data
      const orderData = {
        dealer_id: dealer.Dealer_Id,
        document_date: documentDate,
        items: validItems.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
        })),
        grand_total: grandTotal,
      };

      console.log("Order Data:", orderData);
      alert("Order created successfully!");
      setOrderItems([
        { productId: "", productName: "", quantity: 1, price: 0, discount: 0, total: 0 },
      ]);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Error creating order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 flex justify-between items-center bg-white">
          <h1 className="text-xl font-bold text-black">Add Order</h1>
          <button className="bg-white text-indigo-600 px-3 py-1 rounded-lg font-semibold text-xs hover:shadow-lg hover:-translate-y-0.5 transition-all border border-indigo-600">
            Download
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dealer Information */}
            <div className="space-y-3">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Bill To
                </label>
                <div className="text-xs font-medium text-gray-900 p-2 bg-gray-50 border border-gray-300 rounded">
                  {dealer.Dealer_Name || "—"}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  GST
                </label>
                <div className="text-xs font-medium text-gray-900 p-2 bg-gray-50 border border-gray-300 rounded">
                  {dealer.gst || "—"}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Ship To
                </label>
                <div className="text-xs font-medium text-gray-900 p-2 bg-gray-50 border border-gray-300 rounded">
                  {dealer.Dealer_shipto || "—"}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Document Date
                </label>
                <input
                  type="date"
                  value={documentDate}
                  onChange={(e) => setDocumentDate(e.target.value)}
                  className="text-xs text-gray-900 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Phone
                </label>
                <div className="text-xs font-medium text-gray-900 p-2 bg-gray-50 border border-gray-300 rounded">
                  {dealer.Dealer_Number || "—"}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Email
                </label>
                <div className="text-xs font-medium text-gray-900 p-2 bg-gray-50 border border-gray-300 rounded">
                  {dealer.Dealer_Email || "—"}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Product List */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-gray-900">Product List</h2>
              </div>

              <div className="border-2 border-gray-900 rounded px-3 py-2 font-semibold text-gray-900 text-center">
                <div className="text-xs text-gray-600">Grand Total Price</div>
                <div className="text-lg font-bold">₹{grandTotal.toLocaleString("en-IN")}</div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {orderItems.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
                    <select
                      value={item.productId}
                      onChange={(e) => handleProductChange(index, e.target.value)}
                      className="w-full px-2 py-1.5 text-xs text-gray-900 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:text-blue-600 transition-colors"
                      disabled={loading}
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option 
                          key={product.id} 
                          value={product.id}
                          className="text-gray-900"
                        >
                          {product.name}
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 mb-1">Qty</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(index, parseInt(e.target.value) || 1)
                          }
                          className="px-2 py-1.5 text-xs text-gray-900 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 mb-1">Discount</label>
                        <input
                          type="number"
                          min="0"
                          value={item.discount}
                          onChange={(e) =>
                            handleDiscountChange(index, parseFloat(e.target.value) || 0)
                          }
                          className="px-2 py-1.5 text-xs text-gray-900 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex flex-col">
                        <label className="text-gray-600 font-semibold mb-1">Price</label>
                        <div className="font-medium text-gray-900 p-1.5 bg-gray-50 border border-gray-300 rounded">
                          ₹{item.price.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-gray-600 font-semibold mb-1">Total</label>
                        <div className="font-medium text-gray-900 p-1.5 bg-gray-50 border border-gray-300 rounded">
                          ₹{item.total.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveRow(index)}
                      className="w-full px-2 py-1.5 text-xs font-semibold text-red-700 bg-red-100 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                      disabled={orderItems.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddRow}
                className="w-full px-2 py-2 text-xs font-semibold text-blue-700 bg-blue-100 border border-blue-600 rounded hover:bg-blue-200 transition-colors"
              >
                + Add Product
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-2 text-xs font-semibold text-white bg-gray-600 rounded hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 text-xs font-semibold text-white bg-green-600 rounded hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {submitting ? "Creating..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}