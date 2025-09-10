'use client';

import React, { useState } from 'react';
import axios from 'axios';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  access: ('DASHBOARD' | 'PRODUCT_UPLOAD' | 'USER_MANAGEMENT')[];
}

interface EditUserProps {
  admin: Admin;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditUser: React.FC<EditUserProps> = ({ admin, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    access: [...admin.access] as ('DASHBOARD' | 'PRODUCT_UPLOAD' | 'USER_MANAGEMENT')[]
  });

  const [errors, setErrors] = useState<{ role?: string; access?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const accessOptions = [
    { value: 'DASHBOARD', label: 'Dashboard', desc: 'Access to main dashboard and analytics' },
    { value: 'PRODUCT_UPLOAD', label: 'Product Upload', desc: 'Can upload and manage products' },
    { value: 'USER_MANAGEMENT', label: 'User Management', desc: 'Can manage users and permissions' }
  ] as const;

  const validateForm = (): boolean => {
    const newErrors: { role?: string; access?: string } = {};

    // Access validation
    if (formData.access.length === 0) {
      newErrors.access = 'At least one access permission is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleAccessChange = (accessValue: 'DASHBOARD' | 'PRODUCT_UPLOAD' | 'USER_MANAGEMENT') => {
    setFormData(prev => ({
      ...prev,
      access: prev.access.includes(accessValue)
        ? prev.access.filter(a => a !== accessValue)
        : [...prev.access, accessValue]
    }));

    // Clear access error when user selects at least one permission
    if (errors.access && (formData.access.length > 0 || !formData.access.includes(accessValue))) {
      setErrors(prev => ({
        ...prev,
        access: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.put('/api/Admin', {
        id: formData.id,
        role: formData.role,
        access: formData.access
      });

      if (res.status !== 200) {
        throw new Error('Failed to update user');
      }

      setSubmitSuccess(true);
      
      // Close the form after successful submission
      setTimeout(() => {
        onSuccess();
      }, 1500);
      
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ access: 'Failed to update user. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                User details updated successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Row - Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">Name cannot be edited</p>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">Email cannot be edited</p>
          </div>
        </div>

        {/* Second Row - Role and Access Permissions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors bg-white"
            >
              <option value="ADMIN">Admin - Standard administrative access</option>
              <option value="SUPER_ADMIN">Super Admin - Complete system control</option>
            </select>
          </div>

          {/* Access Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access Permissions <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
              {accessOptions.map((option) => (
                <div key={option.value} className="flex items-start">
                  <input
                    type="checkbox"
                    id={option.value}
                    checked={formData.access.includes(option.value)}
                    onChange={() => handleAccessChange(option.value)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={option.value} className="ml-2 cursor-pointer">
                    <span className="block text-sm font-medium text-gray-700">{option.label}</span>
                    <span className="block text-xs text-gray-500">{option.desc}</span>
                  </label>
                </div>
              ))}
            </div>
            {errors.access && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.access}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              'Update User'
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;