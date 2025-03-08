import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Terms & Conditions | HomeMaidy';
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
            <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
            <p className="text-gray-600">Last Updated: June 1, 2025</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 mb-4">
              These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and HomeMaidy ("we," "us" or "our"), concerning your access to and use of the HomeMaidy website, mobile application, and services.
            </p>
            <p className="text-gray-700 mb-4">
              By accessing or using our services, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, then you may not access our services.
            </p>
            <p className="text-gray-700">
              We reserve the right to make changes to these Terms and Conditions at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of these Terms and Conditions, and you waive any right to receive specific notice of each such change.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Services</h2>
            
            <h3 className="text-xl font-semibold mb-3">Service Description</h3>
            <p className="text-gray-700 mb-4">
              HomeMaidy provides a platform that connects customers with independent cleaning professionals. We do not provide cleaning services directly. Instead, we facilitate the connection between customers and cleaning professionals who provide such services.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Booking and Payment</h3>
            <p className="text-gray-700 mb-4">
              By booking a cleaning service through our platform, you agree to pay the specified fees for such services. All payments are processed securely through our platform. You agree to provide accurate and complete payment information.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Cancellation Policy</h3>
            <p className="text-gray-700">
              Cancellations made at least 24 hours before the scheduled cleaning are eligible for a full refund. Cancellations made less than 24 hours before the scheduled cleaning may be subject to a cancellation fee. No-shows will be charged the full amount of the scheduled service.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">User Accounts</h2>
            
            <h3 className="text-xl font-semibold mb-3">Account Creation</h3>
            <p className="text-gray-700 mb-4">
              To use certain features of our services, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Account Responsibilities</h3>
            <p className="text-gray-700 mb-4">
              You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or mobile device. You agree to accept responsibility for all activities that occur under your account or password.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Account Termination</h3>
            <p className="text-gray-700">
              We reserve the right to terminate or suspend your account and access to our services, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms and Conditions.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">User Conduct</h2>
            <p className="text-gray-700 mb-4">
              By using our services, you agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Use our services in any way that violates any applicable federal, state, local, or international law or regulation</li>
              <li>Use our services for the purpose of exploiting, harming, or attempting to exploit or harm minors in any way</li>
              <li>Impersonate or attempt to impersonate HomeMaidy, a HomeMaidy employee, another user, or any other person or entity</li>
              <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of our services</li>
              <li>Use our services in any manner that could disable, overburden, damage, or impair the site or interfere with any other party's use of our services</li>
              <li>Use any robot, spider, or other automatic device, process, or means to access our services for any purpose, including monitoring or copying any of the material on our services</li>
              <li>Use any manual process to monitor or copy any of the material on our services or for any other unauthorized purpose without our prior written consent</li>
              <li>Use any device, software, or routine that interferes with the proper working of our services</li>
              <li>Introduce any viruses, trojan horses, worms, logic bombs, or other material which is malicious or technologically harmful</li>
              <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of our services, the server on which our services are stored, or any server, computer, or database connected to our services</li>
              <li>Attack our services via a denial-of-service attack or a distributed denial-of-service attack</li>
              <li>Otherwise attempt to interfere with the proper working of our services</li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              Our services and their entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by HomeMaidy, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
            <p className="text-gray-700">
              These Terms and Conditions permit you to use our services for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our services.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Disclaimer of Warranties</h2>
            <p className="text-gray-700 mb-4">
              You understand that we cannot and do not guarantee or warrant that files available for downloading from the internet or our services will be free of viruses or other destructive code. You are responsible for implementing sufficient procedures and checkpoints to satisfy your particular requirements for anti-virus protection and accuracy of data input and output, and for maintaining a means external to our site for any reconstruction of any lost data.
            </p>
            <p className="text-gray-700 mb-4">
              TO THE FULLEST EXTENT PROVIDED BY LAW, WE WILL NOT BE LIABLE FOR ANY LOSS OR DAMAGE CAUSED BY A DISTRIBUTED DENIAL-OF-SERVICE ATTACK, VIRUSES, OR OTHER TECHNOLOGICALLY HARMFUL MATERIAL THAT MAY INFECT YOUR COMPUTER EQUIPMENT, COMPUTER PROGRAMS, DATA, OR OTHER PROPRIETARY MATERIAL DUE TO YOUR USE OF OUR SERVICES OR ANY SERVICES OR ITEMS OBTAINED THROUGH OUR SERVICES OR TO YOUR DOWNLOADING OF ANY MATERIAL POSTED ON IT, OR ON ANY WEBSITE LINKED TO IT.
            </p>
            <p className="text-gray-700">
              YOUR USE OF OUR SERVICES, THEIR CONTENT, AND ANY SERVICES OR ITEMS OBTAINED THROUGH OUR SERVICES IS AT YOUR OWN RISK. OUR SERVICES, THEIR CONTENT, AND ANY SERVICES OR ITEMS OBTAINED THROUGH OUR SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
            <p className="text-gray-700">
              TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO EVENT WILL HOMEMAIDY, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, OUR SERVICES, ANY WEBSITES LINKED TO IT, ANY CONTENT ON OUR SERVICES OR SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND WHETHER CAUSED BY TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT, OR OTHERWISE, EVEN IF FORESEEABLE.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Indemnification</h2>
            <p className="text-gray-700">
              You agree to defend, indemnify, and hold harmless HomeMaidy, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms and Conditions or your use of our services, including, but not limited to, any use of our services' content, services, and products other than as expressly authorized in these Terms and Conditions or your use of any information obtained from our services.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Governing Law and Jurisdiction</h2>
            <p className="text-gray-700">
              All matters relating to our services and these Terms and Conditions and any dispute or claim arising therefrom or related thereto (in each case, including non-contractual disputes or claims), shall be governed by and construed in accordance with the internal laws of the State of Texas without giving effect to any choice or conflict of law provision or rule. Any legal suit, action, or proceeding arising out of, or related to, these Terms and Conditions or our services shall be instituted exclusively in the federal courts of the United States or the courts of the State of Texas, in each case located in the City of Dallas and County of Dallas. You waive any and all objections to the exercise of jurisdiction over you by such courts and to venue in such courts.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8"
          >
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions or concerns about these Terms and Conditions, please contact us at:
            </p>
            <div className="text-gray-700">
              <p>HomeMaidy</p>
              <p>123 Cleaning Street, Suite 456</p>
              <p>Dallas, TX 75201</p>
              <p>Email: <a href="mailto:legal@homemaidy.com" className="text-blue-600 hover:text-blue-800">legal@homemaidy.com</a></p>
              <p>Phone: (800) 123-4567</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsPage;