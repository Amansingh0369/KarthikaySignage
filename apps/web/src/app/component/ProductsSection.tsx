"use client"

import { useState, useEffect, useRef } from "react";
import Product from "./Product";

// Mock product data - in a real app, this would come from an API
const mockProducts = [
  {
    id: "1",
    name: "Custom Neon Sign",
    description: "Bright and colorful custom neon sign for your business",
    category: "NEON_SIGN",
    price: 2999,
  },
  {
    id: "2",
    name: "Business Logo Neon",
    description: "Professional neon sign with your business logo",
    category: "NEON_SIGN",
    price: 4599,
  },
  {
    id: "3",
    name: "Nameplate Neon",
    description: "Personalized nameplate with neon lighting",
    category: "NEON_SIGN",
    price: 1999,
  },
  {
    id: "4",
    name: "Bar Sign",
    description: "Eye-catching neon sign for bars and restaurants",
    category: "NEON_SIGN",
    price: 3999,
  },
  {
    id: "5",
    name: "Wedding Neon",
    description: "Special neon signs for weddings and events",
    category: "NEON_SIGN",
    price: 5599,
  },
  {
    id: "6",
    name: "Visiting Card Design",
    description: "Professional visiting card design service",
    category: "VISITING_CARD",
    price: 299,
  },
];

const ProductsSection = () => {
  const [products] = useState(mockProducts);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our premium collection of neon signs and branding solutions
          </p>
        </div>
        
        <div className="relative">
          {/* Left Arrow */}
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors hidden md:block"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Products Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide gap-6 pb-4 md:pb-0 md:scrollbar-default py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <Product 
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                category={product.category}
                price={product.price}
              />
            ))}
          </div>
          
          {/* Right Arrow */}
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors hidden md:block"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="text-center mt-10">
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;