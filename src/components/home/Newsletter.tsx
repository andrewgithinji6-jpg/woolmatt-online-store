'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiMail } from 'react-icons/fi';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="py-12 md:py-16 bg-gradient-to-r from-woolmatt-primary to-blue-700 rounded-2xl px-6 md:px-12 text-white overflow-hidden relative"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20" />

      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <FiBell size={32} />
          <h2 className="text-3xl md:text-4xl font-bold">Stay Updated</h2>
        </div>

        <p className="text-lg text-white/90 mb-6">
          Get exclusive deals, new arrivals, and special offers delivered to your inbox!
        </p>

        <form onSubmit={handleSubscribe} className="flex gap-3">
          <div className="flex-1 flex items-center bg-white rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-yellow-300">
            <FiMail className="text-woolmatt-primary mr-2" size={20} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none text-woolmatt-dark"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-8 py-3 bg-woolmatt-secondary text-white rounded-lg font-bold hover:bg-red-700 transition whitespace-nowrap"
          >
            {subscribed ? '✓ Subscribed!' : 'Subscribe'}
          </motion.button>
        </form>

        <p className="text-white/70 text-sm mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </motion.section>
  );
};