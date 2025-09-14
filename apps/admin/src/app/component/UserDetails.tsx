"use client"

import React, { useState } from 'react';
import EditUser from './EditUser';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  access: ('DASHBOARD' | 'PRODUCT_UPLOAD' | 'USER_MANAGEMENT')[];
  createdAt: string;
  updatedAt: string;
}

interface UserDetailsProps {
  admins: Admin[];
  loading?: boolean;
  onUserUpdate: () => void;
  onDeleteUser: (admin: Admin) => void; // Add this prop
}

const UserDetails: React.FC<UserDetailsProps> = ({ admins, loading = false, onUserUpdate, onDeleteUser }) => {
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const handleEditClick = (admin: Admin) => {
    setEditingAdmin(admin);
  };

  const handleEditSuccess = () => {
    setEditingAdmin(null);
    onUserUpdate();
  };

  const handleEditCancel = () => {
    setEditingAdmin(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e00885]"></div>
        <span className="ml-2 text-[#e6e0f0]">Loading users...</span>
      </div>
    );
  }

  // Show edit form if editing
  if (editingAdmin) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden p-6">
        <EditUser 
          admin={editingAdmin} 
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      </div>
    );
  }

  if (admins.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-[#e6e0f0] mb-2">
          <svg className="mx-auto h-12 w-12 text-[#3c2a98]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-1">No users found</h3>
        <p className="text-[#e6e0f0]">Get started by adding your first user.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#e6e0f0] uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#e6e0f0] uppercase tracking-wider">
                Access Permissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#e6e0f0] uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#e6e0f0] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-[#3c2a98]/10 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#e00885] to-[#3c2a98] flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {admin.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{admin.name}</div>
                      <div className="text-sm text-[#e6e0f0]">{admin.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    admin.role === 'SUPER_ADMIN' 
                      ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30' 
                      : 'bg-blue-500/20 text-blue-200 border border-blue-400/30'
                  }`}>
                    {admin.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {admin.access.map((permission, index) => (
                      <span
                        key={index}
                        className="inline-flex px-2 py-1 text-xs font-medium bg-[#10b981]/20 text-[#10b981] rounded-md border border-[#10b981]/30"
                      >
                        {permission.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#e6e0f0]">
                  {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleEditClick(admin)}
                    className="text-blue-300 hover:text-blue-100 mr-3 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDeleteUser(admin)} // Changed to call prop function
                    className="text-[#e00885] hover:text-[#e00885] transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDetails;