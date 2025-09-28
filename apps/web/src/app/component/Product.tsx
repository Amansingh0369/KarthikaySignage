"use client"

import { useState, useEffect } from "react";

interface ProductProps {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  imageUrl?: string;
}

const Product = ({ id, name, description, category, price, imageUrl }: ProductProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Format price to INR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  // Function to get image URL - handles both relative and absolute URLs
  const getImageUrl = (imageUrl: string | undefined, id: string) => {
    // If we have an image URL from S3, use it
    if (imageUrl && imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Fallback to default image
    return `/product-${id}.jpg`;
  };

  // Reset image error state when imageUrl changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [imageUrl]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-72 flex-shrink-0">
      <div className="relative h-48 bg-gray-200">
        {imageError || !imageUrl ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        ) : (
          <img 
            src={getImageUrl(imageUrl, id)} 
            alt={name}
            className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
        <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {category.replace('_', ' ')}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {description || 'No description available'}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-purple-700">{formatPrice(price)}</span>
          <button className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-200 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;