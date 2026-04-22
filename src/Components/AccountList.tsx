"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

type UserData = {
  Dealer_Name?: string
  Dealer_Email?: string
  username?: string
  email?: string
  name?: string
}

function AccountList() {
  const [user, setUser] = useState<UserData>({})
  const [role, setRole] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const roleType = localStorage.getItem("roletype")
      const userData = JSON.parse(localStorage.getItem("UserData") || "{}")

      setRole(roleType)
      setUser(userData)
    } catch (error) {
      console.error("Error loading user data:", error)
    }
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const image = "https://i.sstatic.net/l60Hf.png"


  const userName =
    role === "3"
      ? user.name || user.username || "Administrator"
      : role === "2"
        ? user.Dealer_Name || user.name || "Dealer"
        : user.name || user.username || "Staff"

  const userEmail =
    role === "3"
      ? user.email || "admin@omsons.com"
      : role === "2"
        ? user.Dealer_Email || user.email || "dealer@omsons.com"
        : user.email || "staff@omsons.com"

  // Dynamic route
  const dashboardLink =
    role === "3"
      ? "dashboard/admin"
      : role === "2"
        ? "dashboard/dealer"
        : "dashboard/staff"

  const roleLabel =
    role === "3"
      ? "Admin"
      : role === "2"
        ? "Dealer"
        : "Staff"

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = "/auth/login"
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden text-black">
      <div className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 p-2 border-b border-indigo-100">
        <div className="flex items-center justify-between gap-9">
          <div className="flex items-center gap-3 flex-1 mr-3">
            <img
              src={image}
              alt="profile picture"
              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200"
            />
            <div className="flex flex-col min-w-0 mr-2">
              {/* <span className="text-sm font-semibold text-gray-900 truncate w-12">
                {userName}
              </span> */}
              <span className="text-xs text-gray-600 truncate">
                {userEmail}
              </span>
              <span className="text-xs font-medium text-indigo-600 mt-1">
                {roleLabel}
              </span>
            </div>
          </div>

          <div className="flex sm:flex-row">
            <Link href={dashboardLink}>
              <button className="p-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:text-blue-500 rounded-lg transition-colors">
                {role === "3" ? "Admin Panel " : "Dashboard "}
              </button>
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
        {/* LEFT */}
        <div className="px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
            Your Lists
          </h3>
          <ul className="space-y-2">
            <li>
              <button className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                Create a List
              </button>
            </li>
            <li>
              <button className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                Find a List or Registry
              </button>
            </li>
            <li>
              <button className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                Your Saved Books
              </button>
            </li>
          </ul>
        </div>

        {/* RIGHT */}
        <div className="px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
            Your Account
          </h3>
          <ul className="space-y-2">
            <li>
              <button className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                Account
              </button>
            </li>
            <li>
              <button className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                Orders
              </button>
            </li>
            <li>
              <button className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                Recommendations
              </button>
            </li>
            <li>
              <button className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                Browsing History
              </button>
            </li>
            <li>
              <button className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                Your Preferences
              </button>
            </li>
            <li>
              <button className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                Watchlist
              </button>
            </li>
            <li>
              <button className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                Video Purchases
              </button>
            </li>
            <li>
              <button className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                Kindle Unlimited
              </button>
            </li>
            <li>
              <button className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                Content & Devices
              </button>
            </li>
            <li>
              <button className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                Subscribe & Save Items
              </button>
            </li>
            <li>
              <button className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                Memberships
              </button>
            </li>
            <li>
              <button className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                Music Library
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AccountList