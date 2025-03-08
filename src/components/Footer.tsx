import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Sparkles, Mail, Phone, Linkedin, BookText as TikTok } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container-narrow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">HomeMaidy</span>
            </div>
            <p className="text-gray-400 mb-4">
              Professional cleaning services on demand. Book in minutes, get a spotless home.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <TikTok size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/pro-signup" className="text-gray-400 hover:text-white transition-colors">Become a Pro</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/admin/login" className="text-gray-400 hover:text-white transition-colors">Admin Login</Link></li>
              <li><Link to="/pro-signup" className="text-gray-400 hover:text-white transition-colors">Pro Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Locations</h3>
            <ul className="space-y-2">
              <li><Link to="/service-areas" className="text-gray-400 hover:text-white transition-colors">Dallas, TX</Link></li>
              <li><Link to="/service-areas" className="text-gray-400 hover:text-white transition-colors">Austin, TX</Link></li>
              <li><Link to="/service-areas" className="text-gray-400 hover:text-white transition-colors">Houston, TX</Link></li>
              <li><Link to="/service-areas" className="text-gray-400 hover:text-white transition-colors">Phoenix, AZ</Link></li>
              <li><Link to="/service-areas" className="text-gray-400 hover:text-white transition-colors">Seattle, WA</Link></li>
              <li><Link to="/service-areas" className="text-gray-400 hover:text-white transition-colors">Los Angeles, CA</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li>
                <a href="mailto:support@homemaidy.com" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Mail size={16} /> support@homemaidy.com
                </a>
              </li>
              <li>
                <a href="tel:+18001234567" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Phone size={16} /> (800) 123-4567
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} HomeMaidy. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-gray-500 hover:text-white text-sm transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;