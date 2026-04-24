import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, IndianRupee, Menu as MenuIcon, X, Clock, Info, Leaf, MapPin, ArrowUpDown, Plus, Minus } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import Shimmer from '../components/Shimmer';
import { getRestaurantDetails, getAllMenus } from '../utils/api';

const Menu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [error, setError] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  
  // Filters & Sorting States
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("NONE"); 
  
  //  CartContext se cart, updateQuantity aur removeFromCart nikaal liya
  const { cart, addToCart, updateQuantity, removeFromCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const resResp = await fetch(getRestaurantDetails(id));
        if (!resResp.ok) throw new Error("Restaurant not found");
        const resData = await resResp.json();
        setRestaurant(resData);

        const menuResp = await fetch(getAllMenus());
        if (!menuResp.ok) throw new Error("Menu list fetch failed");
        const menuJson = await menuResp.json();
        
        const matchedMenu = menuJson.find(m => String(m.restaurantId) === String(id));
        
        if (matchedMenu && matchedMenu.categories) {
          setMenuData(matchedMenu.categories);
          setActiveCategory(matchedMenu.categories[0].title);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(true);
      }
    };
    
    fetchMenu();
  }, [id]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-4">Error Loading Menu</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Data load nahi ho paaya. Backend check karo.</p>
        <Link to="/" className="px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600">Back to Home</Link>
      </div>
    );
  }

  if (!restaurant) return <Shimmer />;

  const activeCategoryData = menuData.find(cat => cat.title === activeCategory);
  
  let processedItems = activeCategoryData?.itemCards.filter(item => 
    isVegOnly ? item.info.vegClassifier === 'VEG' : true
  ) || [];

  if (sortOrder === "LOW_TO_HIGH") {
    processedItems.sort((a, b) => a.info.price - b.info.price);
  } else if (sortOrder === "HIGH_TO_LOW") {
    processedItems.sort((a, b) => b.info.price - a.info.price);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-orange-500 mb-6 transition-colors font-medium">
        <ArrowLeft size={20} className="mr-2" /> Back to Home
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 dark:bg-gray-700/30 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex justify-between items-start z-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 dark:text-white tracking-tight">{restaurant.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-1">{restaurant.cuisines.join(", ")}</p>
            <p className="flex items-center text-gray-500 dark:text-gray-500 text-sm mb-5 font-medium">
              <MapPin size={16} className="mr-1 text-orange-500" />
              Downtown Area, {restaurant.city}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <span className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full shadow-sm"><Clock size={16} className="mr-1.5 text-orange-500"/> {restaurant.deliveryTime} mins</span>
              <span className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full shadow-sm"><IndianRupee size={16} className="mr-1 text-orange-500"/> {restaurant.costForTwo} for two</span>
            </div>
          </div>
          <div className="flex flex-col items-center bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800 p-3 rounded-2xl shadow-sm">
            <div className="flex items-center text-green-700 dark:text-green-400 font-black text-2xl mb-1">
              <Star size={20} className="mr-1 fill-current" /> {restaurant.rating}
            </div>
            <div className="text-[10px] text-green-600 dark:text-green-500 font-bold uppercase tracking-widest border-t border-green-200 dark:border-green-800 pt-1.5 mt-1">1K+ Ratings</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-5 border-b border-gray-200 dark:border-gray-800">
        <label className="flex items-center gap-3 cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2.5 rounded-2xl shadow-sm hover:shadow transition-all">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={isVegOnly} onChange={() => setIsVegOnly(!isVegOnly)} />
            <div className={`block w-11 h-6 rounded-full transition-colors ${isVegOnly ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isVegOnly ? 'translate-x-5' : ''}`}></div>
          </div>
          <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Leaf size={18} className={isVegOnly ? 'text-green-500' : 'text-gray-400'}/> Veg Only
          </span>
        </label>

        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2.5 rounded-2xl shadow-sm hover:shadow transition-all">
          <ArrowUpDown size={18} className="text-orange-500" />
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-transparent text-sm font-bold text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer w-full"
          >
            {/* Options mein explicitly bg aur text color define kiya hai */}
            
            <option value="LOW_TO_HIGH" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">
              Price: Low to High
            </option>
            <option value="HIGH_TO_LOW" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">
              Price: High to Low
            </option>
          </select>
        </div>
      </div>

      <div className="w-full pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black flex items-center dark:text-white">
            {activeCategory}
          </h2>
          <span className="text-sm font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-lg">
            {processedItems.length} items
          </span>
        </div>
        
        {processedItems.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 text-lg font-medium mb-2">No matching items found.</p>
            <p className="text-gray-400 text-sm">Try disabling the Veg Only filter.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {processedItems.map(item => {
              
              //  Item ki quantity cart se check kar rahe hain
              const cartItem = cart.find(c => c.id === item.info.id);
              const quantity = cartItem ? cartItem.quantity : 0;

              return (
                <div key={item.info.id} className="flex justify-between gap-6 pb-10 border-b border-gray-100 dark:border-gray-800 last:border-0 group">
                  <div className="flex-1 pr-2 md:pr-10">
                    <div className={`w-4 h-4 border-2 flex items-center justify-center mb-3 rounded-sm ${item.info.vegClassifier === 'VEG' ? 'border-green-600' : 'border-red-600'}`}>
                      <div className={`w-2 h-2 rounded-full ${item.info.vegClassifier === 'VEG' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                    </div>
                    
                    <h3 className="text-xl font-bold dark:text-gray-100 text-gray-800 mb-2">{item.info.name}</h3>
                    <p className="flex items-center font-bold text-gray-900 dark:text-white text-lg mb-3">
                      <IndianRupee size={16}/> {item.info.price}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 md:line-clamp-none leading-relaxed">
                      {item.info.description}
                    </p>
                  </div>
                  
                  <div className="relative w-36 h-36 md:w-44 md:h-44 flex-shrink-0">
                    <img 
                      src={item.info.imageId} 
                      alt={item.info.name} 
                      className="w-full h-full object-cover rounded-3xl shadow-sm group-hover:scale-105 transition-transform duration-300" 
                    />
                    
                    {/* 🚀 CONDITIONAL RENDER: Agar quantity 0 hai toh white ADD button, warna RED + / - button */}
                    {quantity === 0 ? (
                      <button 
                        onClick={() => addToCart({ id: item.info.id, name: item.info.name, price: item.info.price, image: item.info.imageId ,restaurantName: restaurant.name}, id)}
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-green-600 font-extrabold text-sm px-10 py-3 rounded-xl shadow-lg border border-gray-100 hover:bg-gray-50 hover:shadow-xl transition-all z-10"
                      >
                        ADD
                      </button>
                    ) : (
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white font-extrabold text-sm flex items-center justify-between w-32 h-11 rounded-xl shadow-lg hover:shadow-xl transition-all z-10 overflow-hidden">
                        <button 
                          onClick={() => quantity === 1 ? removeFromCart(item.info.id) : updateQuantity(item.info.id, -1)}
                          className="w-1/3 h-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <Minus size={18} strokeWidth={3} />
                        </button>
                        <span className="w-1/3 text-center text-base">{quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.info.id, 1)}
                          className="w-1/3 h-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <Plus size={18} strokeWidth={3} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button 
        onClick={() => setShowMenuModal(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-black dark:bg-white text-white dark:text-black px-6 py-3.5 rounded-full shadow-2xl z-40 flex items-center gap-2 hover:scale-105 transition-transform"
      >
        <MenuIcon size={18} /> <span className="font-extrabold text-sm tracking-widest">MENU</span>
      </button>

      {showMenuModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-gray-900 w-full md:w-[400px] rounded-t-[2.5rem] md:rounded-[2.5rem] p-6 pb-10 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-800">
              <h3 className="text-xl font-bold dark:text-white uppercase tracking-wider">Categories</h3>
              <button onClick={() => setShowMenuModal(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {menuData.map(cat => (
                <button
                  key={cat.title}
                  onClick={() => {
                    setActiveCategory(cat.title);
                    setShowMenuModal(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left px-5 py-4 rounded-2xl flex justify-between items-center transition-all ${
                    activeCategory === cat.title 
                      ? 'bg-orange-500 text-white font-bold shadow-md scale-[1.02]' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 dark:text-gray-300 font-semibold'
                  }`}
                >
                  {cat.title}
                  <span className={`text-sm ${activeCategory === cat.title ? 'text-orange-100' : 'text-gray-500'}`}>
                    {cat.itemCards.length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;