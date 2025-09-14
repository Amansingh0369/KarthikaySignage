"use client"

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import Link from "next/link";

interface NeonSign {
  id: string;
  minWidth: number;
  minHeight: number;
  basePrice: number;
  discountType: string | null;
  discountValue: number | null;
  isActive: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  isActive: boolean;
  createdAt: string;
  neonSigns: NeonSign[];
  _count: {
    orderItems: number;
    reviews: number;
  };
}

const ProductsPage = () => {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    minWidthFeet: '',
    minHeightFeet: '',
    basePrice: '',
    discountType: '',
    discountValue: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const category = selectedCategory === "all" ? "" : selectedCategory;
      const response = await axios.get(`/api/products?category=${category}`);
      
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await axios.patch(`/api/neon-signs/${productId}`, {
        isActive: !currentStatus,
      });
      
      if (response.data.success) {
        setProducts(products.map(p => 
          p.id === productId ? { ...p, isActive: !currentStatus } : p
        ));
      }
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    if (product.neonSigns.length > 0) {
      const neonSign = product.neonSigns[0];
      setEditFormData({
        name: product.name,
        description: product.description || '',
        minWidthFeet: (neonSign.minWidth / 12).toFixed(1),
        minHeightFeet: (neonSign.minHeight / 12).toFixed(1),
        basePrice: neonSign.basePrice.toString(),
        discountType: neonSign.discountType || '',
        discountValue: neonSign.discountValue?.toString() || '',
      });
    } else {
      setEditFormData({
        name: product.name,
        description: product.description || '',
        minWidthFeet: '',
        minHeightFeet: '',
        basePrice: '',
        discountType: '',
        discountValue: '',
      });
    }
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsUpdating(true);
    try {
      const response = await axios.put(`/api/neon-signs/${editingProduct.id}`, editFormData);
      
      if (response.data.success) {
        // Refresh products list
        await fetchProducts();
        setShowEditModal(false);
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    setEditFormData({
      name: '',
      description: '',
      minWidthFeet: '',
      minHeightFeet: '',
      basePrice: '',
      discountType: '',
      discountValue: '',
    });
  };


  const formatDimensions = (width: number, height: number) => {
    const widthFeet = (width / 12).toFixed(1);
    const heightFeet = (height / 12).toFixed(1);
    return `${widthFeet}' × ${heightFeet}'`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e00885]"></div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8 ml-20 pt-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
              <p className="text-gray-600 mt-2">Manage all your products and their configurations</p>
            </div>
            <Link
              href="/product_upload"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#e00885] hover:bg-[#e00885] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e00885]"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Product
            </Link>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedCategory === "all"
                  ? "bg-[#e00885]/20 text-[#e00885] border-[#e00885]/30"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setSelectedCategory("NEON_SIGN")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedCategory === "NEON_SIGN"
                  ? "bg-[#e00885]/20 text-[#e00885] border-[#e00885]/30"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Neon Signs
            </button>
            <button
              onClick={() => setSelectedCategory("VISITING_CARD")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedCategory === "VISITING_CARD"
                  ? "bg-[#e00885]/20 text-[#e00885] border-[#e00885]/30"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Visiting Cards
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e00885]"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dimensions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pricing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {product.description || 'No description provided'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#3c2a98]/20 text-[#3c2a98] border-[#3c2a98]/30">
                          {product.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.neonSigns.length > 0 ? (
                          formatDimensions(product.neonSigns[0].minWidth, product.neonSigns[0].minHeight)
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.neonSigns.length > 0 ? (
                          <div>
                            <div className="font-medium">{formatPrice(product.neonSigns[0].basePrice)}</div>
                            {product.neonSigns[0].discountType && (
                              <div className="text-xs text-gray-500">
                                {product.neonSigns[0].discountType === 'PERCENTAGE' 
                                  ? `${product.neonSigns[0].discountValue}% off`
                                  : `${formatPrice(product.neonSigns[0].discountValue || 0)} off`
                                }
                              </div>
                            )}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-4">
                          <span>{product._count.orderItems} orders</span>
                          <span>{product._count.reviews} reviews</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.isActive 
                            ? 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30' 
                            : 'bg-[#e00885]/20 text-[#e00885] border-[#e00885]/30'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleActive(product.id, product.isActive)}
                            className={`px-3 py-1 rounded-md text-xs font-medium ${
                              product.isActive 
                                ? 'bg-[#e00885]/20 text-[#e00885] border-[#e00885]/30 hover:bg-[#e00885]/30' 
                                : 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30 hover:bg-[#10b981]/30'
                            }`}
                          >
                            {product.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleEditClick(product)}
                            className="px-3 py-1 rounded-md text-xs font-medium text-blue-600 hover:text-blue-500 hover:bg-blue-50"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Product</h3>
                <button
                  onClick={handleCloseEditModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Product Name */}
                  <div className="sm:col-span-2">
                    <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      id="editName"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="editDescription"
                      rows={3}
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                    />
                  </div>

                  {/* Minimum Width */}
                  <div>
                    <label htmlFor="editMinWidth" className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Width (feet)
                    </label>
                    <input
                      type="number"
                      id="editMinWidth"
                      value={editFormData.minWidthFeet}
                      onChange={(e) => setEditFormData({...editFormData, minWidthFeet: e.target.value})}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                      min="0.1"
                      step="0.1"
                      required
                    />
                  </div>

                  {/* Minimum Height */}
                  <div>
                    <label htmlFor="editMinHeight" className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Height (feet)
                    </label>
                    <input
                      type="number"
                      id="editMinHeight"
                      value={editFormData.minHeightFeet}
                      onChange={(e) => setEditFormData({...editFormData, minHeightFeet: e.target.value})}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                      min="0.1"
                      step="0.1"
                      required
                    />
                  </div>

                  {/* Base Price */}
                  <div>
                    <label htmlFor="editBasePrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Base Price (₹)
                    </label>
                    <input
                      type="number"
                      id="editBasePrice"
                      value={editFormData.basePrice}
                      onChange={(e) => setEditFormData({...editFormData, basePrice: e.target.value})}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  {/* Discount Type */}
                  <div>
                    <label htmlFor="editDiscountType" className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type
                    </label>
                    <select
                      id="editDiscountType"
                      value={editFormData.discountType}
                      onChange={(e) => setEditFormData({...editFormData, discountType: e.target.value})}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                    >
                      <option value="">No Discount</option>
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  {/* Discount Value */}
                  {editFormData.discountType && (
                    <div className="sm:col-span-2">
                      <label htmlFor="editDiscountValue" className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Value
                      </label>
                      <input
                        type="number"
                        id="editDiscountValue"
                        value={editFormData.discountValue}
                        onChange={(e) => setEditFormData({...editFormData, discountValue: e.target.value})}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                        min="0"
                        step={editFormData.discountType === "PERCENTAGE" ? "1" : "0.01"}
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isUpdating ? 'Updating...' : 'Update Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;