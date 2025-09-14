import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface NeonSignFormProps {
  onUploadSuccess?: () => void;
  onBackToCategory: () => void;
}

const NeonSignForm: React.FC<NeonSignFormProps> = ({ onUploadSuccess, onBackToCategory }) => {
  const router = useRouter();
  
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
        
        // Notify parent component of success
        if (onUploadSuccess) {
          onUploadSuccess();
        }
        
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
              type="button"
              onClick={onBackToCategory}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Category
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
  );
};

export default NeonSignForm;