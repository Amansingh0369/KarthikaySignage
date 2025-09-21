"use client"

import { useRouter } from "next/navigation";
import Image from "next/image";

const CategorySection = () => {
  const router = useRouter();

  const categories = [
    {
      id: "visiting-card",
      name: "Visiting Card",
      image: "/logo.jpeg", // Using existing logo as placeholder
      description: "Professional business cards for your brand",
    },
    {
      id: "neon-sign",
      name: "Neon Sign",
      image: "/brand.png", // Using existing brand image as placeholder
      description: "Custom neon signs for your business",
      route: "/neon-sign", // Adding route for neon sign page
    },
  ];

  const handleCategoryClick = (categoryId: string, route?: string) => {
    if (route) {
      // Navigate to specific route
      router.push(route);
    } else {
      // Navigate to products page with category filter
      router.push(`/products?category=${categoryId}`);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of printing solutions
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => handleCategoryClick(category.id, category.route)}
            >
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-lg mb-6 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-600 opacity-20"></div>
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-gray-600 text-center max-w-xs">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;