"use client"

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import UserDetails from "../component/UserDetails";
import CreateUser from "../component/CreateUser";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import DeleteConfirmationModal from "../component/DeleteConfirmationModal"; // Import the modal

interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  access: ('DASHBOARD' | 'PRODUCT_UPLOAD' | 'USER_MANAGEMENT')[];
  createdAt: string;
  updatedAt: string;
}

const SuperAdmin = () => {
  const { data: session } = useSession();
  const [showCreateUserPopup, setShowCreateUserPopup] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null); // State for delete confirmation
  const [isDeleting, setIsDeleting] = useState(false); // State for deletion process

  const openPopup = () => setShowCreateUserPopup(true);
  const closePopup = () => setShowCreateUserPopup(false);

  // Fetch admins data
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/Admin');
      
      if (response.data.success) {
        setAdmins(response.data.data);
        setError(null);
      } else {
        setError('Failed to fetch admins');
      }
    } catch (err) {
      setError('Error fetching data');
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle delete user function
  const handleDeleteUser = (admin: Admin) => {
    setDeletingAdmin(admin);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingAdmin) return;

    setIsDeleting(true);
    try {
      const res = await axios.delete(`/api/Admin?id=${deletingAdmin.id}`);

      if (res.status !== 200) {
        throw new Error('Failed to delete user');
      }

      // Close modal and refresh data
      setDeletingAdmin(null);
      fetchAdmins(); // Refresh the user list
    } catch (error) {
      console.error('Delete error:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setDeletingAdmin(null);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-100">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
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
      
      {/* Main Content */}
      <div className="relative z-10 ml-20 pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">User Management</h2>
            <p className="text-blue-100">Manage users and their access permissions</p>
          </div>
          
          <button
            onClick={openPopup}
            className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-medium rounded-lg shadow-lg hover:bg-white/20 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add User
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/20 backdrop-blur-lg border border-red-400/30 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-100">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex text-red-200 hover:text-red-100"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <UserDetails 
            admins={admins} 
            loading={loading} 
            onUserUpdate={fetchAdmins} 
            onDeleteUser={handleDeleteUser} // Pass the delete handler
          />
        </div>
      </div>

      {/* Clean Popup Overlay */}
      {showCreateUserPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Background overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closePopup}
          ></div>
          
          {/* Popup content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Popup header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
                <p className="text-sm text-gray-600 mt-1">Create a new user account with appropriate permissions</p>
              </div>
              <button
                onClick={closePopup}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Popup body */}
            <div className="p-6">
              <CreateUser onSuccess={closePopup} />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Now renders at the page level */}
      {deletingAdmin && (
        <DeleteConfirmationModal
          adminName={deletingAdmin.name}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default SuperAdmin;