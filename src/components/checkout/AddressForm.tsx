'use client';

import React, { useState } from 'react';
import { FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';

export interface Address {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  notes?: string;
}

interface AddressFormProps {
  onAddressChange: (address: Address) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({ onAddressChange }) => {
  const [address, setAddress] = useState<Address>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    streetAddress: '',
    city: 'Nakuru',
    postalCode: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Address>>({});

  const validateForm = () => {
    const newErrors: Partial<Address> = {};

    if (!address.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!address.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!address.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!address.email.trim()) newErrors.email = 'Email is required';
    if (!address.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    // Validate phone number (simple validation)
    if (address.phone && !/^254\d{9}$/.test(address.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone must be in format: 254712345678';
    }

    // Validate email
    if (address.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedAddress = { ...address, [name]: value };
    setAddress(updatedAddress);
    
    // Clear error for this field
    if (errors[name as keyof Address]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }

    onAddressChange(updatedAddress);
  };

  const handleBlur = () => {
    validateForm();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg shadow-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <FiMapPin size={24} className="text-woolmatt-primary" />
        <h2 className="text-2xl font-bold text-woolmatt-dark">Delivery Address</h2>
      </div>

      <div className="space-y-4">
        {/* Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-woolmatt-dark mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={address.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-woolmatt-primary transition ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-woolmatt-dark mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={address.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Doe"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-woolmatt-primary transition ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Contact Info Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-woolmatt-dark mb-2">
              Phone Number * (e.g., 254712345678)
            </label>
            <input
              type="tel"
              name="phone"
              value={address.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="254712345678"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-woolmatt-primary transition ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-woolmatt-dark mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={address.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="john@example.com"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-woolmatt-primary transition ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Address Row */}
        <div>
          <label className="block text-sm font-semibold text-woolmatt-dark mb-2">
            Street Address *
          </label>
          <input
            type="text"
            name="streetAddress"
            value={address.streetAddress}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="123 Main Street"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-woolmatt-primary transition ${
              errors.streetAddress ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.streetAddress && (
            <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>
          )}
        </div>

        {/* City and Postal Code Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-woolmatt-dark mb-2">
              City *
            </label>
            <select
              name="city"
              value={address.city}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-woolmatt-primary transition ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="Nakuru">Nakuru</option>
              <option value="Nairobi">Nairobi</option>
              <option value="Kisumu">Kisumu</option>
              <option value="Mombasa">Mombasa</option>
              <option value="Kericho">Kericho</option>
              <option value="Other">Other</option>
            </select>
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-woolmatt-dark mb-2">
              Postal Code *
            </label>
            <input
              type="text"
              name="postalCode"
              value={address.postalCode}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="20100"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-woolmatt-primary transition ${
                errors.postalCode ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.postalCode && (
              <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
            )}
          </div>
        </div>

        {/* Delivery Notes */}
        <div>
          <label className="block text-sm font-semibold text-woolmatt-dark mb-2">
            Delivery Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={address.notes}
            onChange={handleChange}
            placeholder="Any special instructions for delivery..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-woolmatt-primary transition"
          />
        </div>
      </div>
    </motion.div>
  );
};