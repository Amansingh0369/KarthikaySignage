"use client"

import { SITE_INFO } from "../constants";
import { Mail, Phone, MapPin, Facebook, Instagram, MessageCircle} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                <img 
                  src="/logo.jpeg" 
                  alt="Kartikay Signage Logo" 
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                {SITE_INFO.name}
              </h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              {SITE_INFO.description}
            </p>
            <div className="flex space-x-4">
              <a href={SITE_INFO.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6 text-pink-500 " />
              </a>
              <a href={SITE_INFO.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6 text-pink-500 " />
              </a>
              <a href={SITE_INFO.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">WhatsApp</span>
                <MessageCircle className="h-6 w-6 text-pink-500 " />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Products</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-pink-500 flex-shrink-0" />
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE_INFO.address)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {SITE_INFO.address}
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-pink-500 flex-shrink-0" />
                <a 
                  href={`tel:${SITE_INFO.phone}`} 
                  className="hover:text-white transition-colors"
                >
                  {SITE_INFO.phone}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-pink-500 flex-shrink-0" />
                <a 
                  href={`mailto:${SITE_INFO.email}`} 
                  className="hover:text-white transition-colors"
                >
                  {SITE_INFO.email}
                </a>
              </li>
              <li className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-pink-500 flex-shrink-0" />
                <a 
                  href={SITE_INFO.socialLinks.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Chat with us on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 Kartikay Signage. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;