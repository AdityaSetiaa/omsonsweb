"use client";

import DealerComponent from "@/Components/DealerComponent";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const orderData = [
  { month: "Jan", value: 65 },
  { month: "Feb", value: 55 },
  { month: "Mar", value: 10 },
];

const saleData = [
  { month: "Jan", value: 18000 },
  { month: "Feb", value: 21000 },
  { month: "Mar", value: 3000 },
];

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6 font-semibold text-lg text-black">Admin Panel</div>
        <nav className="space-y-2 px-4 text-sm">
          <div ><SidebarItem label="Dashboard" active /></div>
          <div className="absolute right-0 top-full mt-1 w-106 hidden group-hover:block z-60 bg-white shadow-lg border border-gray-200 rounded p-3">
            <DealerComponent />
          </div>          <div ><SidebarItem label="Orders" /></div>
          <div ><SidebarItem label="Staff Management" /></div>
          <div ><SidebarItem label="Reports" /></div>
          <div ><SidebarItem label="Settings" /></div>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        
        {/* Topbar */}
        <header className="h-14 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between px-6 text-white">
          <div className="font-medium">Welcome Ravi</div>
          <div className="flex gap-3 text-sm">
            <button className="bg-white/20 px-3 py-1 rounded">Admin</button>
            <button className="bg-white/20 px-3 py-1 rounded"><Link href={"/"}>Logout</Link></button>
          </div>
        </header>

        <main className="p-6 space-y-6">

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card title="Total Orders" value="155" />
            <Card title="Total Staff" value="8" />
            <Card title="Number of Dealers" value="5477" highlight />
            <Card title="Total Pending Orders" value="27535" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <ChartCard title="Order Details">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orderData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#5B5BD6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Sale Report">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={saleData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#5B5BD6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ListCard title="Top Dealer Reports" />
            <ListCard title="Top Order Reports" />
          </div>

        </main>
      </div>
    </div>
  );
}

/* Components */

function SidebarItem({ label, active = false }: any) {
  return (
    <div
      className={`px-3 py-2 rounded cursor-pointer ${
        active
          ? "bg-indigo-100 text-indigo-700 font-medium"
          : "hover:bg-slate-100 text-slate-600"
      }`}
    >
      {label}
    </div>
  );
}

function Card({
  title,
  value,
  highlight = false,
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-5 shadow-sm ${
        highlight
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          : "bg-white"
      }`}
    >
      <div className="text-sm text-slate-500 mb-1">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="text-sm font-medium mb-4">{title}</div>
      {children}
    </div>
  );
}

function ListCard({ title }: { title: string }) {
  const dummy = [
    { name: "Dealer A", value: "8745" },
    { name: "Dealer B", value: "6523" },
    { name: "Dealer C", value: "4421" },
    { name: "Dealer D", value: "3120" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="text-sm font-medium mb-4">{title}</div>
      <div className="space-y-3">
        {dummy.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-slate-600">{item.name}</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}