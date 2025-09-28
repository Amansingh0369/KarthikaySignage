import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Add this import for the S3 upload function
import { uploadFileToS3 } from '../lib/s3-upload';

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
  const [type, setType] = useState("DEFAULT"); // Add type field with default value
  const [imageUrl, setImageUrl] = useState(""); // Add imageUrl field
  const [imageFile, setImageFile] = useState<File | null>(null); // Add imageFile state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null); // Add error state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadSuccess(false);
    setUploadError(null); // Clear previous errors

    try {
      // If there's a file to upload, upload it to S3 first
      let finalImageUrl = imageUrl;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const uploadResult = await uploadResponse.json();
        console.log("Upload result:", uploadResult);
        
        if (uploadResult.success) {
          finalImageUrl = uploadResult.imageUrl;
        } else {
          throw new Error(uploadResult.error || "Failed to upload image");
        }
      }

      const response = await axios.post('/api/neon-signs', {
        name: productName,
        description: productDescription,
        minWidthFeet: minWidthFeet,
        minHeightFeet: minHeightFeet,
        basePrice: basePrice,
        discountType: discountType || null,
        discountValue: discountValue || null,
        type: type, // Add type field
        imageUrl: finalImageUrl, // Use the S3 URL or the manually entered URL
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
        setType("DEFAULT"); // Reset type field
        setImageUrl(""); // Reset imageUrl field
        setImageFile(null); // Reset imageFile field
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
        setUploadError(response.data.error || "Failed to create neon sign product");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error.message || "An unexpected error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-8">
        {/* Display success or error messages */}
        {uploadSuccess && (
          <div className="mb-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Upload successful!</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your neon sign product has been created successfully.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {uploadError && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Upload failed</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{uploadError}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
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

            {/* Neon Sign Type */}
            <div className="sm:col-span-2">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Neon Sign Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              >
                <option value="DEFAULT">Default</option>
                <option value="CUSTOM">Custom</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Default signs are standard products, Custom signs are made-to-order
              </p>
            </div>

            {/* Image URL */}
            <div className="sm:col-span-2">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              {/* File input for image upload */}
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              />
              <p className="text-xs text-gray-500 mt-1">
                Select an image file to upload to S3, or enter a URL below
              </p>
              
              {/* Manual URL input as fallback */}
              <input
                type="text"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border mt-2"
                placeholder="https://your-s3-bucket.s3.amazonaws.com/image.jpg"
                disabled={!!imageFile} // Disable if file is selected
              />
              <p className="text-xs text-gray-500 mt-1">
                Or enter an existing image URL
              </p>
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