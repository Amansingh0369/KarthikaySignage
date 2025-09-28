"use client"

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { SITE_INFO } from "../constants";

interface NeonSign {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  description: string | null;
  isActive: boolean;
  category: string;
}

const PreMadeNeonSigns = () => {
  const [neonSigns, setNeonSigns] = useState<NeonSign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNeonSigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/products?category=NEON_SIGN');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Filter for active neon signs only
        const activeNeonSigns = data.products
          .filter((product: any) => product.isActive)
          .map((product: any) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl || null,
            description: product.description,
            isActive: product.isActive,
            category: product.category,
          }));
        
        setNeonSigns(activeNeonSigns);
      } else {
        throw new Error(data.error || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching neon signs:", error);
      setError("Failed to load neon signs. Please try again later.");
      setNeonSigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNeonSigns();
  }, [fetchNeonSigns]);

  const formatPrice = (price: number) => {
    if (price === 0) return "Price on request";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  // Function to get image URL - handles both relative and absolute URLs
  const getImageUrl = (imageUrl: string | null, id: string) => {
    if (!imageUrl) return `/product-${id}.jpg`;
    
    // If it's already an absolute URL, return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If it's a relative URL, return as is
    if (imageUrl.startsWith('/')) {
      return imageUrl;
    }
    
    // Otherwise, assume it's a relative path
    return `/${imageUrl}`;
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pre-Made Neon Signs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our collection of ready-to-order neon signs
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-72 bg-gray-200 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
            <button 
              onClick={fetchNeonSigns}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
            {neonSigns.map((sign) => (
              <div 
                key={sign.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 lg:col-span-2 cursor-pointer"
                onClick={() => window.location.href = `/product/${sign.id}`}
              >
                <div className="relative h-64">
                  {sign.imageUrl ? (
                    <Image
                      src={getImageUrl(sign.imageUrl, sign.id)}
                      alt={sign.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        // Handle image loading errors by setting a fallback
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/300x200?text=Neon+Sign";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{sign.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-purple-700">{formatPrice(sign.price)}</span>
                    <button className="px-4 py-2 bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Share on WhatsApp Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 lg:col-span-2 cursor-pointer"
              onClick={() => window.open(SITE_INFO.socialLinks.whatsapp, '_blank')}
            >
              <div className="relative h-64">
                <Image
                  src="/whatsApp.png"
                  alt="Share on WhatsApp"
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Share on WhatsApp</h3>
                <p className="text-gray-600 mb-3">
                  Have a design idea? Share it with us on WhatsApp
                </p>
              </div>
            </div>
            
            {/* Customize Your Neon Sign Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 lg:col-span-2 cursor-pointer"
                onClick={() => {
                        const element = document.getElementById('customization-section');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
              >
              <div className="relative h-64">
                <Image
                  src="/neonsign.png"
                  alt="Customize Your Neon Sign"
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Customize Your Neon Sign</h3>
                <p className="text-gray-600 mb-3">
                  Create your own unique neon sign with our customization tool
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PreMadeNeonSigns;