'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'

type StaffOption = {
  staff_id: string
  staff_name: string
  staff_roletype: string
}

const BACKEND_URL = "https://mirisoft.co.in/sas/dealerapi/api"

function InputField({
  label, value, onChange, type = "text", placeholder, required = true
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">{label}</label>
      <input
        required={required}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || label}
        className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
      />
    </div>
  )
}

export default function EditDealerPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([])

  // Form fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [city, setCity] = useState("")
  const [pincode, setPincode] = useState("")
  const [password, setPassword] = useState("")
  const [dealercode, setDealercode] = useState("")
  const [notes, setNotes] = useState("")
  const [number, setNumber] = useState("")
  const [address, setAddress] = useState("")
  const [discount, setDiscount] = useState("")
  const [gst, setGst] = useState("")
  const [creditdays, setCreditdays] = useState("")
  const [annualtarget, setAnnualtarget] = useState("")
  const [currentlimit, setCurrentlimit] = useState("")
  const [dealerid, setDealerid] = useState("")
  const [staffname, setStaffname] = useState("")
  const [assignedStaffIds, setAssignedStaffIds] = useState<string[]>([])

  // Toast auto-dismiss
  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(null), 3500)
    return () => clearTimeout(t)
  }, [toastMsg])

  // Fetch dealer data
  const fetchDealer = async () => {
    if (!id) return
    setIsLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/getdealer?id=${id}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ type: 'type' }),
      })
      const json = await res.json()
      if (json.status) {
        const d = json.data
        setName(d.Dealer_Name || "")
        setEmail(d.Dealer_Email || "")
        setNumber(d.Dealer_Number || "")
        setCity(d.Dealer_City || "")
        setPincode(d.Dealer_Pincode || "")
        setAddress(d.Dealer_Address || "")
        setDiscount(d.discount || "")
        setPassword(d.Dealer_Password || "")
        setDealercode(d.Dealer_Dealercode || "")
        setStaffname(d.staffname || "")
        setGst(d.gst || "")
        setCreditdays(d.creditdays || "")
        setNotes(d.Dealer_Notes || "")
        setDealerid(d.Dealer_Id || "")
        setAnnualtarget(d.annualtarget || "")
        setCurrentlimit(d.currentlimit || "")
        setAssignedStaffIds(d.assignedstaff ? d.assignedstaff.split(',') : [])
      } else {
        setToastMsg({ text: json.msz || "Failed to load dealer", type: 'error' })
      }
    } catch {
      setToastMsg({ text: "Failed to load dealer data", type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch staff options for multi-select
  const fetchStaff = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/staffassign`)
      const json = await res.json()
      setStaffOptions(json.data || [])
    } catch {
      console.error("Failed to fetch staff")
    }
  }

  useEffect(() => {
    fetchDealer()
    fetchStaff()
  }, [])

  const handleStaffSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, o => o.value)
    setAssignedStaffIds(selected)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append("Dealer_Name", name)
      formData.append("Dealer_Email", email)
      formData.append("Dealer_Number", number)
      formData.append("Dealer_City", city)
      formData.append("assignedstaff", assignedStaffIds.join(','))
      formData.append("Dealer_Pincode", pincode)
      formData.append("Dealer_Password", password)
      formData.append("Dealer_Dealercode", dealercode)
      formData.append("Dealer_Notes", notes)
      formData.append("Dealer_Address", address)
      formData.append("staffname", staffname)
      formData.append("discount", discount)
      formData.append("gst", gst)
      formData.append("creditdays", creditdays)
      formData.append("id", dealerid)
      formData.append("annualtarget", annualtarget)
      formData.append("currentlimit", currentlimit)

      const res = await axios.post(`${BACKEND_URL}/updateDealer`, formData)
      setToastMsg({ text: res.data.msg || "Dealer updated successfully", type: 'success' })
    } catch {
      setToastMsg({ text: "Failed to update dealer", type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading dealer data…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Toast */}
      {toastMsg && (
        <div className={`fixed top-5 right-5 z-50 text-sm px-4 py-3 rounded-lg shadow-lg transition-all ${
          toastMsg.type === 'success'
            ? 'bg-emerald-600 text-white'
            : 'bg-red-500 text-white'
        }`}>
          {toastMsg.text}
        </div>
      )}

      <div className="p-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Dealer</h1>
          <p className="text-sm text-gray-500 mt-1">Update dealer information and settings</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">

            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-5 pb-3 border-b border-gray-100">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Name" value={name} onChange={setName} />
                <InputField label="Email Address" value={email} onChange={setEmail} type="email" />
                <InputField label="Whatsapp Number" value={number} onChange={setNumber} type="number" />
                <InputField label="City" value={city} onChange={setCity} />
                <InputField label="Address" value={address} onChange={setAddress} />
                <InputField label="Pin Code" value={pincode} onChange={setPincode} type="number" />
              </div>
            </div>

            {/* Account & Auth */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-5 pb-3 border-b border-gray-100">
                Account & Auth
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Dealer Code" value={dealercode} onChange={setDealercode} />
                <InputField label="Password" value={password} onChange={setPassword} type="password" />
                <InputField label="GST No." value={gst} onChange={setGst} />
              </div>
            </div>

            {/* Financial */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-5 pb-3 border-b border-gray-100">
                Financial Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Discount %" value={discount} onChange={setDiscount} type="number" />
                <InputField label="Credit Days" value={creditdays} onChange={setCreditdays} type="number" />
                <InputField label="Annual Target" value={annualtarget} onChange={setAnnualtarget} type="number" />
                <InputField label="Current Limit" value={currentlimit} onChange={setCurrentlimit} type="number" />
              </div>
            </div>

            {/* Staff Assignment */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-5 pb-3 border-b border-gray-100">
                Staff Assignment
              </h2>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Assign Staff <span className="text-gray-400 normal-case font-normal">(hold Ctrl / Cmd to select multiple)</span>
                </label>
                <select
                  multiple
                  value={assignedStaffIds}
                  onChange={handleStaffSelect}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition h-40"
                >
                  {staffOptions.map(staff => (
                    <option key={staff.staff_id} value={staff.staff_id}>
                      {staff.staff_name} {staff.staff_roletype === "1" ? "(Exe)" : "(Fie-Exe)"}
                    </option>
                  ))}
                </select>
                {assignedStaffIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {assignedStaffIds.map(sid => {
                      const staff = staffOptions.find(s => s.staff_id === sid)
                      return staff ? (
                        <span key={sid} className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          {staff.staff_name}
                        </span>
                      ) : null
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-5 pb-3 border-b border-gray-100">
                Notes
              </h2>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Internal Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Add any notes about this dealer…"
                  className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pb-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition font-medium"
              >
                {isSaving && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isSaving ? "Saving…" : "Save Changes"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}