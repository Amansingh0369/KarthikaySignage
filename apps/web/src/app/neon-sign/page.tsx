"use client"

import { useSession } from "next-auth/react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import Image from "next/image";
import { SITE_INFO } from "../constants";
import { useState } from "react";
import { calculateNeonSignPrice, calculateFinalDimensions } from "./functions/priceCalculator";

const NeonSignPage = () => {
  const { data: session } = useSession();
  const [text, setText] = useState("Your Text Here");
  const [selectedColor, setSelectedColor] = useState("text-pink-500");
  const [selectedFont, setSelectedFont] = useState("font-['Roboto']");
  const [selectedSize, setSelectedSize] = useState("regular");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");

  // Count letters (excluding spaces)
  const letterCount = text.trim() !== "" ? text.replace(/\s/g, '').length : 0;
  
  // Get dimensions for each size based on current text
  const regularDimensions = calculateFinalDimensions(text, "regular");
  const mediumDimensions = calculateFinalDimensions(text, "medium");
  const largeDimensions = calculateFinalDimensions(text, "large");

  const colors = [
    { name: "Pink", value: "text-pink-500", bg: "bg-pink-500" },
    { name: "Blue", value: "text-blue-500", bg: "bg-blue-500" },
    { name: "Green", value: "text-green-500", bg: "bg-green-500" },
    { name: "Purple", value: "text-purple-500", bg: "bg-purple-500" },
    { name: "Yellow", value: "text-yellow-500", bg: "bg-yellow-500" },
    { name: "Red", value: "text-red-500", bg: "bg-red-500" },
    { name: "Cyan", value: "text-cyan-500", bg: "bg-cyan-500" },
    { name: "Orange", value: "text-orange-500", bg: "bg-orange-500" },
    { name: "Lime", value: "text-lime-500", bg: "bg-lime-500" },
    { name: "Indigo", value: "text-indigo-500", bg: "bg-indigo-500" },
    { name: "Teal", value: "text-teal-500", bg: "bg-teal-500" },
    { name: "Rose", value: "text-rose-500", bg: "bg-rose-500" },
  ];

  const fonts = [
    { name: "Roboto", value: "font-['Roboto']" },
    { name: "Montserrat", value: "font-['Montserrat']" },
    { name: "Lobster", value: "font-['Lobster']" },
    { name: "Pacifico", value: "font-['Pacifico']" },
    { name: "Dancing Script", value: "font-['Dancing_Script']" },
    { name: "Bangers", value: "font-['Bangers']" },
    { name: "Anton", value: "font-['Anton']" },
    { name: "Oswald", value: "font-['Oswald']" },
    { name: "Playfair Display", value: "font-['Playfair_Display']" },
    { name: "Merriweather", value: "font-['Merriweather']" },
    { name: "Raleway", value: "font-['Raleway']" },
    { name: "Ubuntu", value: "font-['Ubuntu']" },
    { name: "Poppins", value: "font-['Poppins']" },
    { name: "Quicksand", value: "font-['Quicksand']" },
    { name: "Comfortaa", value: "font-['Comfortaa']" },
    { name: "Righteous", value: "font-['Righteous']" },
  ];

  const sizes = [
    { id: "regular", name: "Regular", height: 10, widthPerLetter: 3, textSize: "text-4xl" },
    { id: "medium", name: "Medium", height: 13, widthPerLetter: 4, textSize: "text-5xl" },
    { id: "large", name: "Large", height: 15, widthPerLetter: 5, textSize: "text-6xl" },
  ];

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    
    // When size changes, validate the current text length
    const letterCount = text.trim() !== "" ? text.replace(/\s/g, '').length : 0;
    let maxLetters = 32; // Default to Regular size limit
    
    if (size === "medium") {
      maxLetters = 24;
    } else if (size === "large") {
      maxLetters = 19;
    }
    
    // If current text exceeds the new limit, trim it
    if (letterCount > maxLetters) {
      // Create a new text with only the allowed number of letters
      let newText = "";
      let letterCounter = 0;
      
      for (let i = 0; i < text.length && letterCounter < maxLetters; i++) {
        if (text[i] !== ' ') {
          letterCounter++;
        }
        newText += text[i];
      }
      
      setText(newText);
    }
  };

  const getSelectedSizeDetails = () => {
    return calculateFinalDimensions(text, selectedSize, customWidth, customHeight);
  };

  const calculatePrice = () => {
    const sizeDetails = getSelectedSizeDetails();
    // If width or height is 0, return 0 price
    if (sizeDetails.width === 0 || sizeDetails.height === 0) {
      return 0;
    }
    // Using ₹7 per square inch as the rate
    return calculateNeonSignPrice(sizeDetails.width, sizeDetails.height, 7);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full h-[50vh] md:h-[60vh]">
          <div className="absolute inset-0 z-0">
            <div className="bg-black opacity-100 absolute inset-0"></div>
            <Image
              src="/neonsignBranch.png"
              alt="Neon Sign Hero"
              fill
              style={{ objectFit: "contain", objectPosition: "right" ,paddingRight:160 }}
              priority
            />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center   px-4">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                Neon Signs
              </h1>
              <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto">
                Illuminate your business with our custom neon signs. Bright, bold, and beautiful.
              </p>
            </div>
          </div>
        </section>

        {/* Customization Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Customize Your Neon Sign
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Design your perfect neon sign with our easy customization tool
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Preview Section - Sticky */}
              <div className="bg-black rounded-2xl p-8 flex items-center justify-center min-h-[700px] sticky top-24">
                <div className="text-center w-full">
                  <div className="relative inline-block w-full h-full">
                    <div className="absolute inset-0 bg-black rounded-lg"></div>
                    <div className="relative bg-black rounded-lg p-8 border-2 border-gray-700 h-[500px] flex justify-center">
                      {/* Background Image */}
                      <div className="absolute inset-0 rounded-lg overflow-hidden">
                        <Image
                          src="/TestNeonSign.png"
                          alt="Neon Sign Background"
                          fill
                          style={{ objectFit: "cover" }}
                          className="opacity-80"
                        />
                      </div>
                      
                      {/* Neon Text */}
                      <div className="absolute  z-10 bottom-40 flex items-center justify-center h-full w-full">
                        <div 
                          className={`${selectedColor} ${selectedFont} ${selectedSize === "regular" ? "text-4xl" : selectedSize === "medium" ? "text-5xl" : selectedSize === "large" ? "text-6xl" : "text-5xl"} font-bold p-4 tracking-wider drop-shadow-[0_0_28px_currentColor] transition-all duration-300 text-center whitespace-nowrap overflow-hidden`}
                          style={{ 
                            textShadow: "0 0 10px currentColor",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {text || "Your Text Here"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customization Options */}
              <div className="bg-black rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-white mb-6">Customise Neon Sign</h3>
                
                {/* Price Display at Top */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Estimated Price:</span>
                    <span className="text-xl font-bold text-green-400">₹{calculatePrice().toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">₹7 per square inch</div>
                </div>
                
                {/* Text Input */}
                <div className="mb-8">
                  <label htmlFor="neon-text" className="block text-lg font-medium text-white mb-2">
                    Your Text ({letterCount} {letterCount === 1 ? 'letter' : 'letters'})
                  </label>
                  <input
                    type="text"
                    id="neon-text"
                    value={text}
                    onChange={(e) => {
                      const newText = e.target.value;
                      // Calculate letter count (excluding spaces)
                      const letterCount = newText.trim() !== "" ? newText.replace(/\s/g, '').length : 0;
                      
                      // Calculate max letters based on max dimensions
                      // For Regular: max width 96 / 3 = 32 letters
                      // For Medium: max width 96 / 4 = 24 letters
                      // For Large: max width 96 / 5 = 19 letters
                      let maxLetters = 32; // Default to Regular size limit
                      
                      if (selectedSize === "medium") {
                        maxLetters = 24;
                      } else if (selectedSize === "large") {
                        maxLetters = 19;
                      }
                      
                      // Check if the new text exceeds the limit
                      if (letterCount > maxLetters) {
                        e.target.setCustomValidity(`Maximum ${maxLetters} letters allowed for ${selectedSize} size`);
                        e.target.reportValidity();
                        return;
                      }
                      
                      e.target.setCustomValidity("");
                      setText(newText);
                    }}
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-lg bg-gray-700 text-white"
                    placeholder="Enter your text"
                    maxLength={100}
                  />
                  <div className="text-sm text-gray-400 mt-1">Spaces are not counted</div>
                </div>

                {/* Font Selection */}
                <div className="mb-8">
                  <label className="block text-lg font-medium text-white mb-3">
                    Pick Font Style
                  </label>
                  <div className="max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {fonts.map((font) => (
                        <button
                          key={font.value}
                          onClick={() => setSelectedFont(font.value)}
                          className={`px-4 py-3 rounded-lg border transition-all text-sm ${
                            selectedFont === font.value
                              ? "border-pink-500 bg-pink-900/30 text-pink-300"
                              : "border-gray-600 hover:border-gray-400 bg-gray-700 text-gray-200"
                          } ${font.value}`}
                        >
                          {font.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Color Selection */}
                <div className="mb-8">
                  <label className="block text-lg font-medium text-white mb-3">
                    Pick Neon Color
                  </label>
                  <div className="grid grid-cols-6 sm:grid-cols-6 gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedColor(color.value)}
                        className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                          selectedColor === color.value
                            ? "border-pink-500 ring-2 ring-pink-500 ring-opacity-50"
                            : "border-gray-600 hover:border-gray-400"
                        }`}
                      >
                        <div 
                          className={`w-8 h-8 rounded-full ${color.bg} mb-1`}
                        ></div>
                        <span className="text-xs text-gray-300">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-8">
                  <label className="block text-lg font-medium text-white mb-3">
                    Pick Size
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      key="regular"
                      onClick={() => handleSizeChange("regular")}
                      className={`px-4 py-3 rounded-lg border transition-all ${
                        selectedSize === "regular"
                          ? "border-pink-500 bg-pink-900/30 text-pink-300"
                          : "border-gray-600 hover:border-gray-400 bg-gray-700 text-gray-200"
                      }`}
                    >
                      <div className="font-medium border-b border-gray-600 pb-2 mb-2">Regular</div>
                      <div className="text-left text-sm text-gray-300">
                        <div className="border border-gray-600 rounded p-1 mb-1">Width: {regularDimensions.width}"</div>
                        <div className="border border-gray-600 rounded p-1">Height: {regularDimensions.height}"</div>
                      </div>
                    </button>
                    <button
                      key="medium"
                      onClick={() => handleSizeChange("medium")}
                      className={`px-4 py-3 rounded-lg border transition-all ${
                        selectedSize === "medium"
                          ? "border-pink-500 bg-pink-900/30 text-pink-300"
                          : "border-gray-600 hover:border-gray-400 bg-gray-700 text-gray-200"
                      }`}
                    >
                      <div className="font-medium border-b border-gray-600 pb-2 mb-2">Medium</div>
                      <div className="text-left text-sm text-gray-300">
                        <div className="border border-gray-600 rounded p-1 mb-1">Width: {mediumDimensions.width}"</div>
                        <div className="border border-gray-600 rounded p-1">Height: {mediumDimensions.height}"</div>
                      </div>
                    </button>
                    <button
                      key="large"
                      onClick={() => handleSizeChange("large")}
                      className={`px-4 py-3 rounded-lg border transition-all ${
                        selectedSize === "large"
                          ? "border-pink-500 bg-pink-900/30 text-pink-300"
                          : "border-gray-600 hover:border-gray-400 bg-gray-700 text-gray-200"
                      }`}
                    >
                      <div className="font-medium border-b border-gray-600 pb-2 mb-2">Large</div>
                      <div className="text-left text-sm text-gray-300">
                        <div className="border border-gray-600 rounded p-1 mb-1">Width: {largeDimensions.width}"</div>
                        <div className="border border-gray-600 rounded p-1">Height: {largeDimensions.height}"</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSizeChange("custom")}
                      className={`px-4 py-3 rounded-lg border transition-all ${
                        selectedSize === "custom"
                          ? "border-pink-500 bg-pink-900/30 text-pink-300"
                          : "border-gray-600 hover:border-gray-400 bg-gray-700 text-gray-200"
                      }`}
                    >
                      <div className="font-medium border-b border-gray-600 pb-2 mb-2">Custom</div>
                      <div className="text-left text-sm text-gray-300">
                        <div className="border border-gray-600 rounded p-1 mb-1">Set your</div>
                        <div className="border border-gray-600 rounded p-1">own size</div>
                      </div>
                    </button>
                  </div>
                  
                  {/* Custom Size Input */}
                  {selectedSize === "custom" && (
                    <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Width (inches)</label>
                          <input
                            type="number"
                            value={customWidth}
                            onChange={(e) => {
                              const value = e.target.value;
                              const numValue = parseFloat(value) || 0;
                              if (numValue > 96) {
                                e.target.setCustomValidity("Maximum width is 96 inches");
                                e.target.reportValidity();
                                return;
                              }
                              if (numValue !== 0 && numValue < 10) {
                                e.target.setCustomValidity("Minimum width is 10 inches");
                                e.target.reportValidity();
                                return;
                              }
                              e.target.setCustomValidity("");
                              setCustomWidth(value);
                            }}
                            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                            placeholder="Width"
                            min="10"
                            max="96"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Height (inches)</label>
                          <input
                            type="number"
                            value={customHeight}
                            onChange={(e) => {
                              const value = e.target.value;
                              const numValue = parseFloat(value) || 0;
                              if (numValue > 48) {
                                e.target.setCustomValidity("Maximum height is 48 inches");
                                e.target.reportValidity();
                                return;
                              }
                              if (numValue !== 0 && numValue < 10) {
                                e.target.setCustomValidity("Minimum height is 10 inches");
                                e.target.reportValidity();
                                return;
                              }
                              e.target.setCustomValidity("");
                              setCustomHeight(value);
                            }}
                            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                            placeholder="Height"
                            min="10"
                            max="48"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3 text-sm text-gray-400 p-2 border border-gray-700 rounded bg-gray-700/50">
                    Selected: {selectedSize === "custom" ? "Custom" : sizes.find(s => s.id === selectedSize)?.name || "Regular"} - 
                    Width: {getSelectedSizeDetails().width}" × Height: {getSelectedSizeDetails().height}"
                  </div>
                </div>

                <button 
                  onClick={() => window.location.href = `tel:${SITE_INFO.phone}`}
                  className="w-full px-6 py-4 bg-gradient-to-r from-pink-600 to-purple-700 text-white font-bold rounded-lg shadow-lg hover:from-pink-700 hover:to-purple-800 transform hover:scale-[1.02] transition-all duration-300"
                >
                  Get Your Custom Neon Sign
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Custom Neon Signs
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Transform your space with our premium custom neon signs. Perfect for businesses, events, and personal use.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Why Choose Our Neon Signs?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-pink-600 to-purple-700 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-300">High-quality LED technology for energy efficiency</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-pink-600 to-purple-700 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-300">Custom designs tailored to your specifications</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-pink-600 to-purple-700 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-300">Durable materials for long-lasting performance</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-pink-600 to-purple-700 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-300">Easy installation with mounting hardware included</p>
                  </li>
                </ul>
              </div>
              
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <div className="relative w-full h-96">
                  <Image
                    src="/brand.png"
                    alt="Neon Sign Example"
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-8 md:p-12 border border-gray-800">
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Light Up Your Space?</h3>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Contact us today to discuss your custom neon sign requirements. Our design experts will help bring your vision to life.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a 
                    href={SITE_INFO.socialLinks.whatsapp} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-700 text-white font-bold rounded-full shadow-lg hover:from-pink-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-300 text-center"
                  >
                    Get a Quote
                  </a>
                  <button 
                    onClick={() => window.location.href = `tel:${SITE_INFO.phone}`}
                    className="px-8 py-4 bg-gray-800 text-white font-bold rounded-full shadow-lg hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 border border-gray-700 text-center"
                  >
                    Call Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NeonSignPage;