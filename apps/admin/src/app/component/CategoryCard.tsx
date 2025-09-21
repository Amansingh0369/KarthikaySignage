import React from 'react';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: 'pink' | 'blue';
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  title, 
  description, 
  icon, 
  onClick,
  color
}) => {
  const colorClasses = {
    pink: {
      bg: 'bg-pink-100',
      text: 'text-pink-600',
      ring: 'focus:ring-pink-500'
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      ring: 'focus:ring-blue-500'
    }
  };

  const colors = colorClasses[color];

  return (
    <div 
      onClick={onClick}
      className="border border-gray-200 rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow duration-200 bg-white"
    >
      <div className="flex flex-col items-center text-center">
        <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default CategoryCard;