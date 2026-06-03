import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-woolmatt-dark text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h4 className="font-bold mb-4">About Woolmatt</h4>
            <p className="text-gray-300 text-sm">
              Your trusted supermarket in Nakuru, offering quality products and exceptional service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-woolmatt-secondary">Home</a></li>
              <li><a href="#" className="hover:text-woolmatt-secondary">Products</a></li>
              <li><a href="#" className="hover:text-woolmatt-secondary">About Us</a></li>
              <li><a href="#" className="hover:text-woolmatt-secondary">Contact</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-woolmatt-secondary">FAQs</a></li>
              <li><a href="#" className="hover:text-woolmatt-secondary">Shipping Info</a></li>
              <li><a href="#" className="hover:text-woolmatt-secondary">Returns</a></li>
              <li><a href="#" className="hover:text-woolmatt-secondary">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <p className="text-sm text-gray-300 mb-2">📞 +254 797625506</p>
            <p className="text-sm text-gray-300 mb-2">📧 info@woolmatt.co.ke</p>
            <p className="text-sm text-gray-300">📍 Nakuru, Kenya</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-400 text-sm">
            © 2026 Woolmatt Supermarket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};