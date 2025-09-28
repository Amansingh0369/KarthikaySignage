"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";

interface NeonSign {
  id: string;
  productId: string;
  minWidth: number;
  minHeight: number;
  basePrice: number;
  discountType: string | null;
  discountValue: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  neonSigns: NeonSign[];
}

const ProductDetailsPage = ({ params }: { params: { id: string } }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/products/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Product not found");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setProduct(data.product);
        } else {
          throw new Error(data.error || "Failed to fetch product");
        }
      } catch (error: any) {
        console.error("Error fetching product:", error);
        setError(error.message || "Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const formatPrice = (price: number) => {
    if (price === 0) return "Price on request";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!session) {
      router.push('/login');
      return;
    }
    
    // Add to cart logic would go here
    alert(`Added ${quantity} ${product?.name} to cart`);
  };

  const handleBuyNow = () => {
    if (!session) {
      router.push('/login');
      return;
    }
    
    // Buy now logic would go here
    alert(`Proceeding to checkout for ${quantity} ${product?.name}`);
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => router.push('/neon-sign')}
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Browse Other Products
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Available</h2>
            <p className="text-gray-600">This product is no longer available.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get the first neon sign for dimensions
  const neonSign = product.neonSigns[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-purple-600 hover:text-purple-800 mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </button>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
              {/* Product Image */}
              <div className="flex flex-col">
                <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden bg-gray-100">
                  {imageError || !product.imageUrl ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500">No image available</p>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={getImageUrl(product.imageUrl, product.id)}
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-xl"
                      onError={() => setImageError(true)}
                    />
                  )}
                </div>
                
                {/* Dimensions Display */}
                {neonSign && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Dimensions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500">Width</p>
                          <p className="font-medium">{neonSign.minWidth}"</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500">Height</p>
                          <p className="font-medium">{neonSign.minHeight}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div>
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full mb-4">
                    {product.category.replace('_', ' ')}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                  <p className="text-2xl font-bold text-purple-700 mb-6">{formatPrice(product.price)}</p>
                  
                  {product.description && (
                    <div className="prose max-w-none mb-8">
                      <p className="text-gray-700 text-lg whitespace-pre-line">{product.description}</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <div className="flex items-center mb-4 sm:mb-0">
                      <span className="text-gray-700 mr-3">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-lg font-semibold text-gray-900">
                      Total: {formatPrice(product.price * quantity)}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 px-6 py-4 bg-gray-100 text-gray-900 font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center"
                    >
                      Buy Now
                    </button>
                  </div>

                  {!session && (
                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-yellow-800 text-center">
                        Please <button 
                          onClick={() => router.push('/login')} 
                          className="font-semibold text-yellow-900 underline hover:text-yellow-700"
                        >
                          log in
                        </button> to add items to cart or purchase.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;