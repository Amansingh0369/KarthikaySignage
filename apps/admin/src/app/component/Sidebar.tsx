"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const Sidebar = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)

  const navigationItems = [
    { name: "Dashboard", path: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "User Management", path: "/super_admin", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239" },
    { name: "Product Upload", path: "/product_upload", icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" },
    { name: "Products", path: "/products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" }
  ]

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const navigateTo = (path: string) => {
    router.push(path)
  }

  if (!session) {
    return null
  }

  return (
    <>
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 bg-gradient-to-b from-slate-900 to-slate-800 text-white h-full transform transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-64' : 'w-20'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex flex-col h-full pt-20">
          {/* Navigation items */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigateTo(item.path)}
                  className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span className={`ml-3 overflow-hidden transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 h-0'}`}>
                    {item.name}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* User profile and logout */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <img
                className="w-10 h-10 rounded-full ring-2 ring-blue-500 flex-shrink-0"
                src={session.user?.image || "https://via.placeholder.com/40"}
                alt={session.user?.name || "User"}
              />
              <div className={`overflow-hidden transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 h-0'}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{session.user?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{session.user?.email}</p>
                </div>
              </div>
            </div>
            <div className={`overflow-hidden transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 h-0'}`}>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-lg text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar