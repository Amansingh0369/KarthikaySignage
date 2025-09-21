"use client"

import { useSession } from "next-auth/react";
import Image from "next/image";
import { SITE_INFO } from "../constants";

const HeroSection = () => {
  const { data: session } = useSession();

  return (
    <section className="relative w-full">
      {/* Hero Content */}
      <div className="relative h-[60vh] md:h-[70vh] w-full">
        <div className="absolute align-top inset-0 z-0 flex">
            <div className="bg-[#0d0c0c] opacity-100 absolute inset-0"></div>
            <Image
                src="/brand.png" 
                alt="Kartikay Signage Hero" 
                fill
                style={{ 
                objectFit: "contain", 
                objectPosition: "right center" 
                }}
                priority
            />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center">
          <div className="text-left px-4 sm:px-6 lg:px-8 max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              {SITE_INFO.tagline}
            </h1>
            <p className="text-lg md:text-xl text-white mb-10">
              {SITE_INFO.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300">
                Explore Products
              </button>
              
              {session ? (
                <button className="px-8 py-4 bg-white text-purple-700 font-bold rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
                  View Dashboard
                </button>
              ) : (
                <button className="px-8 py-4 bg-white text-purple-700 font-bold rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;