"use client"

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../component/Navbar";

// Product categories enum
enum ProductCategory {
  NEON_SIGN = "NEON_SIGN",
  VISITING_CARD = "VISITING_CARD"
}

const ProductUploadPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showCategoryModal, setShowCategoryModal] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  
  // Neon sign specific states
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [minWidthFeet, setMinWidthFeet] = useState("");
  const [minHeightFeet, setMinHeightFeet] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You must be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  const handleCategorySelect = (category: ProductCategory) => {
    setSelectedCategory(category);
    setShowCategoryModal(false);
  };

  const handleBackToCategory = () => {
    setSelectedCategory(null);
    setShowCategoryModal(true);
    setProductName("");
    setProductDescription("");
    setMinWidthFeet("");
    setMinHeightFeet("");
    setBasePrice("");
    setDiscountType("");
    setDiscountValue("");
    setUploadSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const response = await axios.post('/api/neon-signs', {
        name: productName,
        description: productDescription,
        minWidthFeet: minWidthFeet,
        minHeightFeet: minHeightFeet,
        basePrice: basePrice,
        discountType: discountType || null,
        discountValue: discountValue || null,
      });
      
      if (response.data.success) {
        // Reset form
        setProductName("");
        setProductDescription("");
        setMinWidthFeet("");
        setMinHeightFeet("");
        setBasePrice("");
        setDiscountType("");
        setDiscountValue("");
        setUploadSuccess(true);
        
        // Redirect to products page after 2 seconds
        setTimeout(() => {
          router.push("/products");
        }, 2000);
      } else {
        console.error("Upload error:", response.data.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Category Selection Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Product Category</h3>
                <p className="text-sm text-gray-500 mb-6">Choose the type of product you want to add</p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handleCategorySelect(ProductCategory.NEON_SIGN)}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-3 text-left">
                        <p className="text-sm font-medium text-gray-900">Neon Signs</p>
                        <p className="text-xs text-gray-500">Custom neon signs with text and colors</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleCategorySelect(ProductCategory.VISITING_CARD)}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-3 text-left">
                        <p className="text-sm font-medium text-gray-900">Visiting Cards</p>
                        <p className="text-xs text-gray-500">Business cards and visiting cards</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Upload Form */}
      {selectedCategory && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Product uploaded successfully! Redirecting to products page...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Neon Sign Form */}
          {selectedCategory === ProductCategory.NEON_SIGN && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Product Name */}
                    <div className="sm:col-span-2">
                      <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                        placeholder="e.g., Custom Neon Sign"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={4}
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                        placeholder="Describe the neon sign product..."
                        required
                      />
                    </div>

                    {/* Minimum Dimensions Section */}
                    <div className="sm:col-span-2">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Minimum Dimensions & Pricing</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Set the minimum size customers can order and the base pricing structure. Pricing will be proportional to size.
                      </p>
                    </div>

                    {/* Minimum Width */}
                    <div>
                      <label htmlFor="minWidthFeet" className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Width (feet)
                      </label>
                      <input
                        type="number"
                        id="minWidthFeet"
                        value={minWidthFeet}
                        onChange={(e) => setMinWidthFeet(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                        placeholder="e.g., 1"
                        min="0.1"
                        step="0.1"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {minWidthFeet ? `${(parseFloat(minWidthFeet) * 12).toFixed(1)}"` : '0"'} in inches
                      </p>
                    </div>

                    {/* Minimum Height */}
                    <div>
                      <label htmlFor="minHeightFeet" className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Height (feet)
                      </label>
                      <input
                        type="number"
                        id="minHeightFeet"
                        value={minHeightFeet}
                        onChange={(e) => setMinHeightFeet(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                        placeholder="e.g., 0.67"
                        min="0.1"
                        step="0.1"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {minHeightFeet ? `${(parseFloat(minHeightFeet) * 12).toFixed(1)}"` : '0"'} in inches
                      </p>
                    </div>

                    {/* Base Price */}
                    <div>
                      <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Base Price (₹)
                      </label>
                      <input
                        type="number"
                        id="basePrice"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                        placeholder="e.g., 5000"
                        min="0"
                        step="0.01"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Price for minimum dimensions ({minWidthFeet || '1'}' × {minHeightFeet || '0.67'}')
                      </p>
                    </div>

                    {/* Discount Type */}
                    <div>
                      <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Type
                      </label>
                      <select
                        id="discountType"
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                      >
                        <option value="">No Discount</option>
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                      </select>
                    </div>

                    {/* Discount Value */}
                    {discountType && (
                      <div className="sm:col-span-2">
                        <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 mb-1">
                          Discount Value
                        </label>
                        <input
                          type="number"
                          id="discountValue"
                          value={discountValue}
                          onChange={(e) => setDiscountValue(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                          placeholder={discountType === "PERCENTAGE" ? "e.g., 10" : "e.g., 500"}
                          min="0"
                          step={discountType === "PERCENTAGE" ? "1" : "0.01"}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {discountType === "PERCENTAGE" 
                            ? "Discount percentage (0-100)" 
                            : "Fixed discount amount in ₹"
                          }
                        </p>
                      </div>
                    )}

                    {/* Pricing Preview */}
                    {minWidthFeet && minHeightFeet && basePrice && (
                      <div className="sm:col-span-2">
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                          <h4 className="text-sm font-medium text-blue-900 mb-2">Pricing Preview</h4>
                          <div className="text-sm text-blue-800 space-y-1">
                            <p>
                              <span className="font-medium">Minimum size:</span> {minWidthFeet}' × {minHeightFeet}' = {(parseFloat(minWidthFeet) * 12).toFixed(1)}" × {(parseFloat(minHeightFeet) * 12).toFixed(1)}"
                            </p>
                            <p>
                              <span className="font-medium">Base price:</span> ₹{basePrice}
                            </p>
                            {discountType && discountValue && (
                              <p>
                                <span className="font-medium">Discount:</span> {discountType === "PERCENTAGE" ? `${discountValue}%` : `₹${discountValue}`}
                              </p>
                            )}
                            <p className="text-xs text-blue-600 mt-2">
                              Example: A 2' × 1.33' sign would cost ₹{(() => {
                                const minWidth = parseFloat(minWidthFeet) || 0;
                                const minHeight = parseFloat(minHeightFeet) || 0;
                                const basePriceValue = parseFloat(basePrice) || 0;
                                const discountValueNum = parseFloat(discountValue) || 0;
                                
                                if (minWidth === 0 || minHeight === 0 || basePriceValue === 0) {
                                  return "0.00";
                                }
                                
                                const minArea = minWidth * minHeight;
                                const exampleArea = 2 * 1.33;
                                const proportionalPrice = (exampleArea / minArea) * basePriceValue;
                                
                                let finalPrice = proportionalPrice;
                                
                                if (discountType && discountValueNum > 0) {
                                  const discount = discountType === "PERCENTAGE" 
                                    ? proportionalPrice * (discountValueNum / 100)
                                    : discountValueNum;
                                  finalPrice = Math.max(0, proportionalPrice - discount);
                                }
                                
                                return finalPrice.toFixed(2);
                              })()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="ml-3 inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        "Upload Neon Sign Product"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Visiting Card Form - Placeholder */}
          {selectedCategory === ProductCategory.VISITING_CARD && (
            <div className="bg-white shadow rounded-lg">
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
  );
};

export default ProductUploadPage;