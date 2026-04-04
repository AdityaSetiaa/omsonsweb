'use client'
import { useState, useEffect } from 'react'
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'

type Dealer = {
  Dealer_Id: string;
  Dealer_Name: string;
  Dealer_City: string;
  Dealer_Email: string;
  Dealer_Number: string;
  Dealer_Address: string;
  Dealer_shipto: string;
  Dealer_Pincode: string;
  Dealer_Username: string;
  Dealer_Password: string;
  Dealer_Dealercode: string;
  Dealer_Notes: string;
  Dealer_Image: string;
  status: string;
  dealerAddByStaff: string;
  assignedstaff: string;
  staffname: string;
  discount: string;
  gst: string;
  creditdays: string;
  annualtarget: string;
  currentlimit: string;
}

type DealerResponse = {
  data: Dealer[];
  total: number;
  last_page: number;
}

function initials(name: string) {
  return name?.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";
}

function statusBadge(s: string) {
  return s === "1"
    ? { bg: "bg-emerald-100", text: "text-emerald-700", label: "Active" }
    : { bg: "bg-red-100", text: "text-red-700", label: "Inactive" };
}

const SHIMMER = "animate-pulse bg-gray-300 rounded";

export default function DealerList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
  const itemsPerPage = 10;

  const queryClient = useQueryClient();

  // 🔥 TanStack Query
  const { data: response, isLoading } = useQuery<DealerResponse>({
    queryKey: ['dealers', page, search],
    queryFn: async () => {
      const res = await fetch(
        `${BACKEND_URL}/dealerpegination?page=${page}&search=${search}`
      );
      return res.json();
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });

  const data: Dealer[] = response?.data || [];

  const total =
    typeof response?.total === "number"
      ? response.total
      : (page - 1) * itemsPerPage + data.length;

  const totalPages =
    response?.last_page ||
    Math.ceil(total / itemsPerPage) ||
    (data.length < itemsPerPage ? page : page + 1);

  // 🔥 Prefetch next page
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['dealers', page + 1, search],
      queryFn: async () => {
        const res = await fetch(
          `${BACKEND_URL}/dealerpegination?page=${page + 1}&search=${search}`
        );
        return res.json();
      },
    });
  }, [page, search]);

  // 🔍 Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  function pageNumbers(): (number | "…")[] {
    const pages: (number | "…")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("…");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startIndex = (page - 1) * itemsPerPage + 1;
  const endIndex = Math.min(page * itemsPerPage, total);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dealer List</h1>
              <p className="text-sm text-gray-600 mt-1">Manage all registered dealers</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search dealers…"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="pl-10 pr-4 py-2 px-8 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition w-72"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">S.No.</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Dealer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">City</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Password</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading && Array.from({ length: itemsPerPage }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className={`${SHIMMER} h-4 w-8`} /></td>
                    <td className="px-6 py-4"><div className={`${SHIMMER} h-4 w-40`} /></td>
                    <td className="px-6 py-4"><div className={`${SHIMMER} h-4 w-20`} /></td>
                    <td className="px-6 py-4"><div className={`${SHIMMER} h-4 w-32`} /></td>
                    <td className="px-6 py-4"><div className={`${SHIMMER} h-4 w-24`} /></td>
                    <td className="px-6 py-4"><div className={`${SHIMMER} h-4 w-20`} /></td>
                    <td className="px-6 py-4"><div className={`${SHIMMER} h-6 w-16`} /></td>
                  </tr>
                ))}

                {!isLoading && data.map((item, i) => {
                  const badge = statusBadge(item.status);
                  return (
                    <tr key={item.Dealer_Id}>
                      <td className="px-6 py-4 text-gray-600">{startIndex + i}</td>
                      <td className="px-6 py-4 text-gray-600">{item.Dealer_Name}</td>
                      <td className="px-6 py-4 text-gray-600">{item.Dealer_City}</td>
                      <td className="px-6 py-4 text-gray-600">{item.Dealer_Email}</td>
                      <td className="px-6 py-4 text-gray-600">{item.Dealer_Number}</td>
                      <td className="px-6 py-4 text-gray-600">{item.Dealer_Password}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`${badge.bg} ${badge.text} px-2 py-1 rounded`}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between p-4 text-gray-600">
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Prev</button>
            <span>{page} / {totalPages}</span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}