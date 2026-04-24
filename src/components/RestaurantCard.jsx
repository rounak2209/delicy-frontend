import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ id, name, image, rating, deliveryTime, costForTwo, cuisines, isVeg }) => {
  return (
    <Link to={`/restaurant/${id}`} className="group block">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
        
        {/* Image Container with Native Lazy Loading */}
        <div className="relative overflow-hidden rounded-xl h-44 mb-4">
          <img 
            src={image} 
            alt={name} 
            loading="lazy" // Native browser lazy loading
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Veg/Non-Veg Badge */}
          <div className="absolute top-2 right-2 bg-white p-1 rounded-sm shadow-sm">
            <div className={`w-3 h-3 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate pr-2">{name}</h3>
            <div className="flex items-center bg-green-600 text-white text-xs px-2 py-1 rounded">
              <Star size={12} className="mr-1 fill-current" />
              <span className="font-bold">{rating}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-2">{cuisines.join(', ')}</p>
          
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-3 mt-2">
            <span>{deliveryTime} MINS</span>
            <span>•</span>
            <span>₹{costForTwo} FOR TWO</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;