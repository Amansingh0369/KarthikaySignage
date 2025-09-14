"use client"

import { useSession, signIn, signOut, SessionProvider } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const NavbarContent = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" })
  }

  const navigateTo = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  if (status === "loading") {
    return (
      <nav className="bg-gradient-to-r from-white via-[#f9f3fa] to-[#e6e0f0] backdrop-blur-sm border-b border-[#e00885]/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="animate-pulse flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-sm"></div>
              <div className="h-7 w-40 bg-slate-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-gradient-to-r from-white via-[#f9f3fa] to-[#e6e0f0] backdrop-blur-sm border-b border-[#e00885]/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-5">
          {/* Logo and Company Name */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => router.push("/")}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <img 
                src="/logo.jpeg" 
                alt="Kartikay Signage Logo" 
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#e00885] to-[#3c2a98] bg-clip-text text-transparent">
                Kartikay Signage
              </h1>
            </div>
          </div>

          {/* Login/Logout button always at the end */}
          <div className="flex items-center space-x-4">
            {session ? (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-5 py-2.5 border border-[#3c2a98] text-sm font-medium rounded-xl text-[#3c2a98] bg-white/80 hover:bg-[#3c2a98]/10 hover:border-[#3c2a98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e00885] transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-[#e00885] to-[#e00885] hover:from-[#e00885] hover:to-[#e00885] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e00885] transition-all duration-200 hover:shadow-xl hover:scale-105"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#3c2a98] hover:text-[#e00885] hover:bg-[#e00885]/10 rounded-lg focus:outline-none transition-all duration-200"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12M6 12h12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-[#e00885]/30 bg-white/80 backdrop-blur-sm rounded-b-2xl shadow-lg">
            <div className="flex flex-col space-y-2">
              {session && (
                <>
                  <button
                    onClick={() => navigateTo("/")}
                    className="text-left px-4 py-3 text-[#3c2a98] hover:text-[#e00885] hover:bg-[#e00885]/10 font-medium transition-all duration-200 rounded-lg mx-2"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigateTo("/super_admin")}
                    className="text-left px-4 py-3 text-[#3c2a98] hover:text-[#e00885] hover:bg-[#e00885]/10 font-medium transition-all duration-200 rounded-lg mx-2"
                  >
                    User Management
                  </button>
                  <button
                    onClick={() => navigateTo("/product_upload")}
                    className="text-left px-4 py-3 text-[#3c2a98] hover:text-[#e00885] hover:bg-[#e00885]/10 font-medium transition-all duration-200 rounded-lg mx-2"
                  >
                    Product Upload
                  </button>
                </>
              )}

              {session ? (
                <div className="pt-4 mt-4 border-t border-slate-200/60 mx-2">
                  <div className="flex items-center space-x-3 mb-4 p-3 bg-[#f9f3fa]/80 rounded-xl">
                    <img
                      className="w-10 h-10 rounded-full ring-2 ring-[#e00885]/30 shadow-sm"
                      src={session.user?.image || "https://via.placeholder.com/40"}
                      alt={session.user?.name || "User"}
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{session.user?.name}</p>
                      <p className="text-xs text-slate-600">{session.user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full inline-flex justify-center items-center px-4 py-3 border border-[#3c2a98] text-sm font-medium rounded-xl text-[#3c2a98] bg-white hover:bg-[#3c2a98]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e00885] transition-all duration-200 shadow-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="mx-2 mt-4">
                  <button
                    onClick={handleSignIn}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-[#e00885] to-[#e00885] hover:from-[#e00885] hover:to-[#e00885] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e00885] transition-all duration-200"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

const Navbar = () => {
  return (
    <SessionProvider>
      <NavbarContent />
    </SessionProvider>
  )
}

export default Navbar