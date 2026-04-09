"use client"

import React, { useState } from 'react'
import { GoLocation } from "react-icons/go";
import indian from "../assets/download.png";
import { IoCartOutline } from "react-icons/io5";
import { categories } from '@/Assets/dataset';
import AccountList from "@/Components/AccountList";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Link from 'next/link';



const Header = () => {



  const [selectedCategory, setSelectedCategory] = useState("all");
  const logoImage = "https://www.omsonsexpo360.com/logo.png";
  return (
    <div>
      <div className="w-full h-16 bg-slate-900 text-white flex items-center px-2 py-2 gap-2">
        <div className="flex items-center border border-transparent hover:border-white rounded px-2 py-1 cursor-pointer">
          <Link href="/home">
            <img src={logoImage} alt="amazonLogo" className="h-12" />
          </Link>
        </div>

        <div className="flex items-start gap-1 border border-transparent hover:border-white rounded px-2 py-1 cursor-pointer min-w-[120px]">
          <GoLocation className="text-xl mt-3 text-white" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-300">Delivering to you</span>
            <span className="text-sm font-bold">Update location</span>
          </div>
        </div>

        <div className="flex flex-1 h-10 rounded-md overflow-hidden">
          <select
            className={`bg-[#f3f3f3] text-black text-sm px-2 border-r border-gray-300 rounded-l-md z-0 focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 ${selectedCategory === "all" ? "w-16" : "w-32"
              }`}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search Amazon"
            className="flex-1 px-3 text-black text-sm outline-none bg-white"
          />
          <button className="bg-[#febd69] hover:bg-[#f3a847] px-4 flex items-center justify-center rounded-r-md">
            <span className="text-black font-bold"><FaMagnifyingGlass /></span>
          </button>
        </div>

        <div className="flex items-center gap-1 border border-transparent hover:border-white rounded px-2 py-1 cursor-pointer">

          <span className="text-sm font-bold">EN</span>
        </div>

        <div className="flex flex-col border border-transparent hover:border-white rounded px-2 py-1 cursor-pointer relative group">
          <div className="flex flex-col">
            <span className="text-xs text-gray-300">Hello, sign in</span>
            <span className="text-sm font-bold">Account & Lists</span>
          </div>
          <div className="absolute right-0 top-full mt-1 w-106 hidden group-hover:block z-60 bg-white shadow-lg border border-gray-200 rounded p-3 transition-all">
            <AccountList />
          </div>
        </div>

        <div className="flex flex-col border border-transparent hover:border-white rounded px-2 py-1 cursor-pointer">
          <span className="text-xs text-gray-300">Returns</span>
          <span className="text-sm font-bold">& Orders</span>
        </div>

        <div className="flex items-center gap-1 border border-transparent hover:border-white rounded px-2 py-1 cursor-pointer">
          <div className="relative">
            <IoCartOutline className="text-3xl" />
            <span className="absolute -top-1 -right-1 bg-[#febd69] text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </div>
          <span className="text-sm font-bold">Cart</span>
        </div>
      </div>
    </div>
  )
}


export default Header
