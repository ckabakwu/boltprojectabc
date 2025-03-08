import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Privacy Policy | HomeMaidy';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-28 pb-16">
        <div className="container-narrow">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last Updated: June 1, 2025</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-gray-700 mb-4">
              HomeMaidy ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, mobile application, and use our services.
            </p>
            <p className="text-gray-700 mb-4">
              Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
            <p className="text-gray-700">
              This Privacy Policy may change from time to time. Your continued use of our services after we make changes is deemed to be acceptance of those changes, so please check the policy periodically for updates.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
            <p className="text-gray-700 mb-4">
              We may collect personal information that you provide directly to us, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Name, email address, phone number, and mailing address</li>
              <li>Account login credentials</li>
              <li>Billing information, such as credit card details and billing address</li>
              <li>Home details, such as size, number of rooms, and cleaning preferences</li>
              <li>Communications you send to us</li>
              <li>Survey responses and feedback</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-3">Information Collected Automatically</h3>
            <p className="text-gray-700 mb-4">
              When you access or use our services, we may automatically collect information about you, including:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Log information (e.g., IP address, browser type, pages visited)</li>
              <li>Device information (e.g., device ID, operating system)</li>
              <li>Location information (with your permission)</li>
              <li>Usage information (e.g., how you interact with our services)</li>
              <li>Cookies and similar technologies</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-3">Information from Third Parties</h3>
            <p className="text-gray-700">
              We may receive information about you from third parties, such as:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Business partners</li>
              <li>Service providers</li>
              <li>Social media platforms, if you choose to link your account</li>
              <li>Background check providers (for cleaning professionals)</li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We may use the information we collect for various purposes, including to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Match customers with cleaning professionals</li>
              <li>Send confirmations, updates, security alerts, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Communicate with you about products, services, offers, and events</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Personalize and improve your experience</li>
              <li>Facilitate contests, sweepstakes, and promotions</li>
              <li>Carry out any other purpose described to you at the time the information was collected</li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Sharing of Information</h2>
            <p className="text-gray-700 mb-4">
              We may share the information we collect in various ways, including:
            </p>
            
            <h3 className="text-xl font-semibold mb-3">With Cleaning Professionals</h3>
            <p className="text-gray-700 mb-4">
              We share your information with cleaning professionals to facilitate the cleaning services you request. This includes your name, address, contact information, and specific cleaning instructions.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">With Service Providers</h3>
            <p className="text-gray-700 mb-4">
              We may share your information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">For Legal Reasons</h3>
            <p className="text-gray-700 mb-4">
              We may share information if we believe disclosure is in accordance with, or required by, any applicable law, regulation, legal process, or governmental request.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Business Transfers</h3>
            <p className="text-gray-700 mb-4">
              We may share information in connection with a merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">With Your Consent</h3>
            <p className="text-gray-700">
              We may share information with your consent or at your direction.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Your Choices</h2>
            
            <h3 className="text-xl font-semibold mb-3">Account Information</h3>
            <p className="text-gray-700 mb-4">
              You may update, correct, or delete your account information at any time by logging into your account or contacting us. Note that we may retain certain information as required by law or for legitimate business purposes.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Cookies</h3>
            <p className="text-gray-700 mb-4">
              Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our services.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Promotional Communications</h3>
            <p className="text-gray-700 mb-4">
              You may opt out of receiving promotional emails from us by following the instructions in those emails. If you opt out, we may still send you non-promotional emails, such as those about your account or our ongoing business relations.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Mobile Push Notifications</h3>
            <p className="text-gray-700">
              With your consent, we may send promotional and non-promotional push notifications to your mobile device. You can deactivate these messages at any time by changing the notification settings on your mobile device.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Data Security</h2>
            <p className="text-gray-700">
              We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%. In the event that any information under our control is compromised as a result of a breach of security, we will take reasonable steps to investigate the situation and, where appropriate, notify those individuals whose information may have been compromised and take other steps, in accordance with any applicable laws and regulations.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
            <p className="text-gray-700">
              Our services are not directed to children under 16, and we do not knowingly collect personal information from children under 16. If we learn we have collected or received personal information from a child under 16 without verification of parental consent, we will delete that information. If you believe we might have any information from or about a child under 16, please contact us.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="text-gray-700">
              <p>HomeMaidy</p>
              <p>123 Cleaning Street, Suite 456</p>
              <p>Dallas, TX 75201</p>
              <p>Email: <a href="mailto:privacy@homemaidy.com" className="text-blue-600 hover:text-blue-800">privacy@homemaidy.com</a></p>
              <p>Phone: (800) 123-4567</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;