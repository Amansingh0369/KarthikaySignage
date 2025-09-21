"use client"

import { SITE_INFO } from "../constants";
import Image from "next/image";

const ShareDesignSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Share Your Design
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a design you'd like to print? Share it with us via WhatsApp and our team will get back to you quickly!
          </p>
        </div>
        
        <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <a 
            href={SITE_INFO.socialLinks.whatsapp} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block cursor-pointer"
          >
            <div className="relative w-full h-64 md:h-96">
              <Image
                src="/whatsApp.png"
                alt="Share your design on WhatsApp"
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-500 hover:scale-105"
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ShareDesignSection;