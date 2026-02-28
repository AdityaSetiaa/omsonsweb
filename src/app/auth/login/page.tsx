"use client"


import Link from "next/link"
import { useState } from "react"


export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false);


  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 dark:bg-black">
      <form
        className="w-full max-w-sm"
      >
        <div className="mb-10">
          <h1 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white">
            Sign in
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Enter your details to continue
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-0 py-3 text-sm bg-transparent border-b border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-200"
            disabled={isLoading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-0 py-3 text-sm bg-transparent border-b border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-200"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <Link
        href={"/home"}>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gray-900 text-white text-sm font-medium rounded-sm hover:bg-gray-800 active:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
        </Link>
      </form>
    </div>
  )
}