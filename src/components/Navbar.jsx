import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Moon, Sun, MapPin } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { CartContext } from '../context/CartContext';
import { LocationContext } from '../context/LocationContext';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { cartCount } = useContext(CartContext);
  const { location, setLocation, cities } = useContext(LocationContext); // Context use kiya

  const handleLocationChange = (e) => {
    const selectedCity = cities.find(c => c.city === e.target.value);
    if(selectedCity) setLocation(selectedCity);
  };

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-800 shadow-md z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/" className="text-2xl font-bold text-orange-500">Delicy</Link>
            
            {/* Dynamic Location Selector */}
            <div className="hidden md:flex items-center text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600">
              <MapPin size={16} className="text-orange-500 mr-2" />
              <select 
                value={location.city} 
                onChange={handleLocationChange}
                className="bg-transparent text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer font-medium"
              >
                {cities.map(c => (
                  <option key={c.city} value={c.city} className="bg-white dark:bg-gray-800">{c.city}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <Link to="/cart" className="relative p-2 flex items-center group">
              <ShoppingCart size={24} className="text-gray-700 dark:text-gray-200 group-hover:text-orange-500" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;