"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Navbar from "./component/Navbar"
import Sidebar from "./component/Sidebar"
import { PRIMARY_COLOR_PINK, SECONDARY_COLOR_PURPLE, TERTIARY_COLOR_BLUE } from "./constant"

const Page = () => {
  const session = useSession()
  const router = useRouter()

  const { data: sessionData, status } = session || { data: null, status: "loading" }

  if (status === "loading") {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(15deg, ${PRIMARY_COLOR_PINK}, ${SECONDARY_COLOR_PURPLE})`
        }}
      >
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"
        ></div>
      </div>
    )
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(0deg, ${TERTIARY_COLOR_BLUE}, ${SECONDARY_COLOR_PURPLE})`
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

      <Sidebar />
      <Navbar />

      <div className="relative z-10 min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 ml-20 md:ml-20 pt-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-4">
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-2xl shadow-[#e00885]/25 transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/logo.jpeg" 
                  alt="Kartikay Signage Logo" 
                  className="w-full h-full object-contain rounded-full hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">Kartikay Signage</h1>
            <p className="text-xl md:text-2xl text-[#e6e0f0] max-w-4xl mx-auto text-pretty">
              Professional signage solutions that make your business stand out
            </p>
          </div>

          {sessionData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div
                className="group bg-white/10 backdrop-blur-lg border border-[#e00885]/20 rounded-3xl shadow-2xl overflow-hidden hover:shadow-[#e00885]/25 hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:bg-white/15"
                onClick={() => handleNavigation("/super_admin")}
              >
                <div className="p-10">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#3c2a98] to-[#3c2a98] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white ml-6">Admin Panel</h2>
                  </div>
                  <p className="text-[#e6e0f0] mb-8 text-lg leading-relaxed">
                    Manage users, permissions, and system settings. Access advanced administrative controls with full
                    oversight capabilities.
                  </p>
                  <div className="flex items-center text-[#e6e0f0] font-semibold text-lg group-hover:text-[#e00885] transition-colors">
                    <span>Access Dashboard</span>
                    <svg
                      className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>

              <div
                className="group bg-white/10 backdrop-blur-lg border border-[#e00885]/20 rounded-3xl shadow-2xl overflow-hidden hover:shadow-[#3c2a98]/25 hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:bg-white/15"
                onClick={() => handleNavigation("/product_upload")}
              >
                <div className="p-10">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#e00885] to-[#3c2a98] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white ml-6">Product Upload</h2>
                  </div>
                  <p className="text-[#e6e0f0] mb-8 text-lg leading-relaxed">
                    Upload new products, manage inventory, and update product information with streamlined workflows.
                  </p>
                  <div className="flex items-center text-[#e6e0f0] font-semibold text-lg group-hover:text-[#e00885] transition-colors">
                    <span>Upload Products</span>
                    <svg
                      className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-white/10 backdrop-blur-lg border border-[#e00885]/20 rounded-3xl shadow-2xl p-12">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <img 
                    src="/logo.jpeg" 
                    alt="Kartikay Signage Logo" 
                    className="w-full h-full object-contain rounded-2xl"
                  />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">Admin Access Required</h3>
                <p className="text-xl text-[#e6e0f0] leading-relaxed">
                  Please sign in to access the admin dashboard and manage your signage products and users with our
                  comprehensive management tools.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page