import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BecomeAPro = () => {
  return (
    <section className="section">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Become a HomeMaidy Professional</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join our network of trusted cleaning professionals. Set your own schedule, earn competitive pay, and build your client base.
          </p>
          <Link to="/pro-signup" className="btn btn-primary btn-lg">
            Become a Pro
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BecomeAPro;