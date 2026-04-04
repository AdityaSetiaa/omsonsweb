"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DealerFormData = {
  name: string;
  email: string;
  staff: string;
  whatsapp: string;
  billAddress: string;
  pincode: string;
  discount: string;
  password: string;
  dealerCode: string;
  gstNo: string;
  city: string;
  creditDays: string;
  annualTarget: string;
  currentLimit: string;
  notes: string;
};

const staffOptions = [
  "Select Staff",
  "MANPREET SINGH (Exe)",
  "NEERAJ SHARMA (Fie-Exe)",
  "KAMALPREET SINGH (Fie-Exe)",
  "HARMAN SHARMA (Fie-Exe)",
];

export default function AddDealerForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DealerFormData>({
    name: "",
    email: "",
    staff: "",
    whatsapp: "",
    billAddress: "",
    pincode: "",
    discount: "",
    password: "",
    dealerCode: "",
    gstNo: "",
    city: "",
    creditDays: "",
    annualTarget: "",
    currentLimit: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.staff) {
        alert("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Log form data for now
      console.log("Dealer Form Data:", formData);
      alert("Dealer added successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        staff: "",
        whatsapp: "",
        billAddress: "",
        pincode: "",
        discount: "",
        password: "",
        dealerCode: "",
        gstNo: "",
        city: "",
        creditDays: "",
        annualTarget: "",
        currentLimit: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error adding dealer:", error);
      alert("Error adding dealer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Add Dealer</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-900 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-900 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                required
              />
            </div>
          </div>

          {/* Row 2: Select Staff and Whatsapp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-900 mb-2">Select Staff</label>
              <select
                name="staff"
                value={formData.staff}
                onChange={handleInputChange}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                required
              >
                {staffOptions.map((option, index) => (
                  <option key={index} value={option} disabled={index === 0}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-900 mb-2">Whatsapp Number</label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                placeholder="Whatsapp number"
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
            </div>
          </div>

          {/* Row 3: Bill to Address and Pin code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-900 mb-2">Bill to Address</label>
              <input
                type="text"
                name="billAddress"
                value={formData.billAddress}
                onChange={handleInputChange}
                placeholder="Address"
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-900 mb-2">Pin code</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="Pin code"
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
            </div>
          </div>

          {/* Row 4: Discount % and Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-900 mb-2">Discount %</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                placeholder="Discount"
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-900 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
            </div>
          </div>

          {/* Row 5: Dealer code and GST No */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-900 mb-2">Dealer code</label>
              <input
                type="text"
                name="dealerCode"
                value={formData.dealerCode}
                onChange={handleInputChange}
                placeholder="Dealer code"
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-900 mb-2">GST No</label>
              <input
                type="text"
                name="gstNo"
                value={formData.gstNo}
                onChange={handleInputChange}
                placeholder="Enter GST No"
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
            </div>
          </div>

          {/* Row 6: City and Credit Days */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-900 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Location"
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-900 mb-2">Credit Days</label>
              <input
                type="number"
                name="creditDays"
                value={formData.creditDays}
                onChange={handleInputChange}
                placeholder="Credit Days"
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
            </div>
          </div>

          {/* Row 7: Annual Target and Current Limit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-900 mb-2">Annual Target</label>
              <input
                type="number"
                name="annualTarget"
                value={formData.annualTarget}
                onChange={handleInputChange}
                placeholder="Annual Target"
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-900 mb-2">Current Limit</label>
              <input
                type="number"
                name="currentLimit"
                value={formData.currentLimit}
                onChange={handleInputChange}
                placeholder="Current Limit"
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
            </div>
          </div>

          {/* Row 8: Notes */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-900 mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Notes"
              rows={4}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4.5 h-10 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}