import { useState, useEffect, useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Search, WifiOff, ArrowUpDown, SlidersHorizontal, History } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import Shimmer from '../components/Shimmer';
import useOnlineStatus from '../hooks/useOnlineStatus';
import useDebounce from '../hooks/useDebounce';
import { LocationContext } from '../context/LocationContext';
import { getRestaurantsByCity, getAllMenus } from '../utils/api';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menus, setMenus] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("RELEVANCE"); 
  const [priceFilter, setPriceFilter] = useState(null); 
  
  const isOnline = useOnlineStatus();
  const debouncedSearch = useDebounce(searchText, 500);
  const { location } = useContext(LocationContext);


  const foodCategories = [
    { name: "All", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=150&q=80" },
    { name: "Biryani", img: "https://media.istockphoto.com/photos/chicken-biryani-on-black-background-spicy-indian-handi-biryani-picture-id1300007487?b=1&k=20&m=1300007487&s=170667a&w=0&h=Jh7AGJEwKk7Gfn-MT7eJv6LCE9HqNrTwXnv0W0lgSeM=" },
    { name: "Pizza", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&q=80" },
    { name: "Burgers", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&q=80" },
    { name: "Main Course", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&q=80" },
    { name: "Chinese", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=150&q=80" },
    { name: "Desserts", img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=150&q=80" },
    { name: "Beverages", img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=150&q=80" }
  ];

  const priceRanges = [250, 500, 750, 1000];

  useEffect(() => {
    fetchAllData();
  }, [location]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Dono restaurants aur menus fetch kar rahe hain deep search ke liye
      const [resResp, menuResp] = await Promise.all([
        fetch(getRestaurantsByCity(location.city)), // 👈 Yahan function call kiya
        fetch(getAllMenus())
      ]);
      
      const resData = await resResp.json();
      const menuData = await menuResp.json();

      setRestaurants(resData);
      setMenus(menuData);
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedRestaurants = useMemo(() => {
    let result = [...restaurants];

    //  ADVANCED DEEP SEARCH: Name + Cuisine + Menu Category + Dish Name
    if (debouncedSearch) {
      const s = debouncedSearch.toLowerCase();
      result = result.filter(res => {
        const matchesRes = res.name.toLowerCase().includes(s) || 
                          res.cuisines.some(c => c.toLowerCase().includes(s));
        
        const resMenu = menus.find(m => String(m.restaurantId) === String(res.id));
        const matchesMenu = resMenu?.categories.some(cat => 
          cat.title.toLowerCase().includes(s) || // Search by Category Heading
          cat.itemCards.some(item => item.info.name.toLowerCase().includes(s)) // Search by Dish Name
        );

        return matchesRes || matchesMenu;
      });
    }

    // CATEGORY QUICK FILTER (Zomato Style)
    if (activeFilter !== "ALL" && !["RATING", "VEG", "FAST"].includes(activeFilter)) {
      const f = activeFilter.toLowerCase();
      result = result.filter(res => {
        const matchesCuisine = res.cuisines.some(c => c.toLowerCase().includes(f));
        
        const resMenu = menus.find(m => String(m.restaurantId) === String(res.id));
        const matchesMenuContent = resMenu?.categories.some(cat => 
          cat.title.toLowerCase().includes(f) || 
          cat.itemCards.some(item => item.info.name.toLowerCase().includes(f)) 
        );

        return matchesCuisine || matchesMenuContent;
      });
    }

    // Quick Action Filters
    if (activeFilter === "RATING") result = result.filter(res => res.rating >= 4.0);
    if (activeFilter === "VEG") result = result.filter(res => res.veg === true);
    if (activeFilter === "FAST") result = result.filter(res => res.deliveryTime <= 30);

    // Price Filter
    if (priceFilter) result = result.filter(res => res.costForTwo <= priceFilter);

    // Sorting Logic
    if (sortBy === "TIME_LOW") result.sort((a, b) => a.deliveryTime - b.deliveryTime);
    if (sortBy === "COST_LOW") result.sort((a, b) => a.costForTwo - b.costForTwo);
    if (sortBy === "COST_HIGH") result.sort((a, b) => b.costForTwo - a.costForTwo);

    return result;
  }, [restaurants, menus, debouncedSearch, activeFilter, sortBy, priceFilter]);

  if (!isOnline) return <div className="flex flex-col items-center justify-center h-[80vh] text-red-500 font-bold">You are Offline!</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* 1. Zomato Style Search & Sort Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-10 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative w-full lg:w-2/3">
          <input 
            type="text" 
            placeholder="Search for 'Pizza', 'Main Course' or restaurants..."
            value={searchText} 
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-14 pr-6 py-4 border-none bg-gray-50 dark:bg-gray-900 rounded-2xl focus:ring-2 focus:ring-orange-500 dark:text-white text-lg transition-all"
          />
          <Search size={24} className="absolute left-5 top-4 text-gray-400" />
        </div>

        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 px-5 py-4 rounded-2xl w-full lg:w-1/3 border border-gray-100 dark:border-gray-700">
          <ArrowUpDown size={20} className="text-orange-500 flex-shrink-0" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-gray-700 dark:text-gray-200 font-semibold focus:outline-none cursor-pointer w-full"
          >
            <option value="RELEVANCE" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">Sort by Relevance</option>
            <option value="TIME_LOW" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">Delivery Time: Low to High</option>
            <option value="COST_LOW" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">Cost: Low to High</option>
            <option value="COST_HIGH" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">Cost: High to Low</option>
          </select>
        </div>
      </div>

      {/* 2. "What's on your mind?" */}
      <div className="mb-12">
        <h3 className="text-2xl font-black dark:text-white mb-8 tracking-tight">What's on your mind?</h3>
        <div className="flex gap-8 overflow-x-auto no-scrollbar pb-4">
          {foodCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveFilter(cat.name === "All" ? "ALL" : cat.name)}
              className="flex flex-col items-center flex-shrink-0 group focus:outline-none"
            >
              <div className={`w-28 h-28 rounded-full mb-4 overflow-hidden border-4 transition-all duration-300 ${
                (activeFilter === cat.name || (cat.name === "All" && activeFilter === "ALL")) 
                ? "border-orange-500 scale-110 shadow-xl" 
                : "border-transparent bg-gray-100 dark:bg-gray-800 group-hover:scale-105 shadow-sm"
              }`}>
                 <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <span className={`text-base font-extrabold transition-colors ${
                (activeFilter === cat.name || (cat.name === "All" && activeFilter === "ALL")) 
                ? "text-orange-500" : "text-gray-600 dark:text-gray-400"
              }`}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Actionable Filter Chips & Order History Link */}
      <div className="flex flex-wrap items-center gap-4 mb-12 pb-6 border-b dark:border-gray-800">
        <div className="flex items-center text-gray-400 mr-2 uppercase text-xs font-black tracking-widest">
          <SlidersHorizontal size={18} className="mr-2" /> Filters
        </div>
        <button onClick={() => setActiveFilter("RATING")} className={`filter-chip ${activeFilter === 'RATING' ? 'active' : ''}`}>4.0+ Star</button>
        <button onClick={() => setActiveFilter("VEG")} className={`filter-chip ${activeFilter === 'VEG' ? 'active' : ''}`}>Pure Veg</button>
        <button onClick={() => setActiveFilter("FAST")} className={`filter-chip ${activeFilter === 'FAST' ? 'active' : ''}`}>Fast Delivery</button>
        
        <div className="h-8 w-[2px] bg-gray-200 dark:bg-gray-700 mx-3 hidden md:block"></div>
        
        {priceRanges.map(price => (
          <button 
            key={price}
            onClick={() => setPriceFilter(priceFilter === price ? null : price)}
            className={`filter-chip ${priceFilter === price ? 'active-price' : ''}`}
          >
            Under ₹{price}
          </button>
        ))}

        {/*  Order History Link Button */}
        <Link 
          to="/orders" 
          className="filter-chip flex items-center gap-2 ml-auto border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/50 shadow-sm"
        >
          <History size={16} /> My Orders
        </Link>
      </div>

      {/* 4. Dynamic Restaurant Grid */}
      {loading ? <Shimmer /> : (
        <>
          <h2 className="text-2xl font-black mb-10 dark:text-white flex items-center gap-3">
            Top Restaurants in {location.city}
            <span className="text-sm font-bold bg-orange-500 text-white px-3 py-1 rounded-full">
              {filteredAndSortedRestaurants.length}
            </span>
          </h2>
          
          {filteredAndSortedRestaurants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] border border-dashed dark:border-gray-700">
              <div className="text-7xl mb-6">🕵️‍♂️</div>
              <h3 className="text-2xl font-bold dark:text-white mb-2">Kuch nahi mila!</h3>
              <p className="text-gray-500 mb-8">Try searching for something else or clear the filters.</p>
              <button 
                onClick={() => {setActiveFilter("ALL"); setPriceFilter(null); setSearchText(""); setSortBy("RELEVANCE");}} 
                className="px-8 py-3 bg-orange-500 text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600 transition-all"
              >
                Clear Everything
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {filteredAndSortedRestaurants.map(res => (
                <RestaurantCard 
                  key={res.id} 
                  {...res} 
                  image={res.cloudinaryImageId} 
                  isVeg={res.veg} 
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;