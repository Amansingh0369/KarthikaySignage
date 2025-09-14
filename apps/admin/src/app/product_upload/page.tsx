"use client"

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import CategoryCard from "../component/CategoryCard";
import NeonSignForm from "../component/NeonSignForm";

// Product categories enum
enum ProductCategory {
  NEON_SIGN = "NEON_SIGN",
  VISITING_CARD = "VISITING_CARD"
}

const ProductUploadPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f9f3fa] to-[#e6e0f0]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e00885]"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f9f3fa] to-[#e6e0f0]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You must be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  const handleCategorySelect = (category: ProductCategory) => {
    setSelectedCategory(category);
  };

  const handleBackToCategory = () => {
    setSelectedCategory(null);
    setUploadSuccess(false);
  };

  const handleUploadSuccess = () => {
    setUploadSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f3fa] to-[#e6e0f0]">
      <Sidebar />
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ml-20 pt-20">
        {/* Category Selection - Now on the page instead of modal */}
        {!selectedCategory && (
          <div className="bg-white/80 border border-[#3c2a98]/20 shadow rounded-lg p-6 mb-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Product Upload</h1>
              <p className="text-gray-600 mt-2">Select a category to add a new product</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CategoryCard
                title="Neon Signs"
                description="Custom neon signs with text and colors"
                color="pink"
                onClick={() => handleCategorySelect(ProductCategory.NEON_SIGN)}
                icon={
                  <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                }
              />
              
              <CategoryCard
                title="Visiting Cards"
                description="Business cards and visiting cards"
                color="blue"
                onClick={() => handleCategorySelect(ProductCategory.VISITING_CARD)}
                icon={
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
              />
            </div>
          </div>
        )}

        {/* Product Upload Form */}
        {selectedCategory && (
          <div>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Product Upload</h1>
                  <p className="text-gray-600 mt-2">
                    Add new {selectedCategory === ProductCategory.NEON_SIGN ? 'neon sign' : 'visiting card'} to the catalog
                  </p>
                </div>
                <button
                  onClick={handleBackToCategory}
                  className="inline-flex items-center px-4 py-2 border border-[#3c2a98]/30 rounded-md shadow-sm text-sm font-medium text-[#3c2a98] bg-white hover:bg-[#3c2a98]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e00885]"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Change Category
                </button>
              </div>
            </div>

            {/* Success Message */}
            {uploadSuccess && (
              <div className="mb-6 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-[#10b981]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-[#10b981]">
                      Product uploaded successfully! Redirecting to products page...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Neon Sign Form */}
            {selectedCategory === ProductCategory.NEON_SIGN && (
              <NeonSignForm 
                onBackToCategory={handleBackToCategory}
                onUploadSuccess={handleUploadSuccess}
              />
            )}

            {/* Visiting Card Form - Placeholder */}
            {selectedCategory === ProductCategory.VISITING_CARD && (
              <div className="bg-white/80 border border-[#3c2a98]/20 shadow rounded-lg">
                <div className="px-6 py-8">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Visiting Card Upload</h3>
                    <p className="text-gray-500">Visiting card upload form will be implemented soon.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductUploadPage;