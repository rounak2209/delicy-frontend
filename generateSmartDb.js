import fs from 'fs';

const cities = ["Kolkata", "Delhi", "Patna", "Lucknow", "Jaipur", "Mumbai", "Bangalore", "Chennai", "Bhopal", "Ranchi", "Hyderabad", "Chandigarh"];

const locations = {
  "Kolkata": ["Park Street", "Salt Lake Sector V", "Ballygunge", "New Town", "Gariahat"],
  "Delhi": ["Connaught Place", "Hauz Khas", "Karol Bagh", "Saket", "Vasant Kunj"],
  "Mumbai": ["Bandra West", "Andheri East", "Colaba", "Juhu", "Powai"],
  "Bangalore": ["Indiranagar", "Koramangala", "Whitefield", "Jayanagar", "HSR Layout"],
  "Chennai": ["T Nagar", "Velachery", "Adyar", "Anna Nagar", "Nungambakkam"],
  "Hyderabad": ["Banjara Hills", "Jubilee Hills", "Hi-Tech City", "Kondapur", "Gachibowli"],
  "Patna": ["Frazer Road", "Boring Road", "Kankarbagh", "Patliputra Colony", "Rajendra Nagar"],
  "Lucknow": ["Hazratganj", "Gomti Nagar", "Aliganj", "Indira Nagar", "Aminabad"],
  "Jaipur": ["Malviya Nagar", "C Scheme", "Vaishali Nagar", "Raja Park", "Bapu Nagar"],
  "Chandigarh": ["Sector 17", "Sector 22", "Sector 35", "Elante Mall", "Sector 8"],
  "Bhopal": ["MP Nagar", "Arera Colony", "TT Nagar", "Koefiza", "Habibganj"],
  "Ranchi": ["Main Road", "Lalpur", "Doranda", "Kanke Road", "Harmu Housing"]
};

// Name Generators
const resPrefixes = ["The Grand", "Royal", "Spicy", "Golden", "Urban", "Classic", "Desi", "Authentic", "Sizzling", "Secret"];
const resSuffixes = ["Bites", "Kitchen", "Diner", "Restaurant", "Cafe", "Eatery", "Lounge", "Grill", "Bistro", "House"];

// 100% Working High Quality Images
const resImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80",
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600&q=80"
];

// Contextual Food Database with exact matching images
const foodDatabase = {
  "Starters": [
    { name: "Paneer Tikka", veg: "VEG", price: 220, img: "https://images.unsplash.com/photo-1599487405705-8178a87eeaf5?w=400&q=80" },
    { name: "Chilli Chicken", veg: "NONVEG", price: 250, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80" },
    { name: "Crispy Veg", veg: "VEG", price: 180, img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80" },
    { name: "Mutton Seekh Kebab", veg: "NONVEG", price: 320, img: "https://images.unsplash.com/photo-1599487405705-8178a87eeaf5?w=400&q=80" }
  ],
  "Main Course": [
    { name: "Butter Chicken", veg: "NONVEG", price: 350, img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80" },
    { name: "Paneer Butter Masala", veg: "VEG", price: 300, img: "https://images.unsplash.com/photo-1567621113695-6d7500950214?w=400&q=80" },
    { name: "Dal Makhani", veg: "VEG", price: 240, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" },
    { name: "Chicken Dum Biryani", veg: "NONVEG", price: 380, img: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=400&q=80" }
  ],
  "Pizzas & Burgers": [
    { name: "Margherita Pizza", veg: "VEG", price: 299, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
    { name: "Chicken Burger", veg: "NONVEG", price: 199, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
    { name: "Veggie Burger", veg: "VEG", price: 149, img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80" },
    { name: "Pepperoni Pizza", veg: "NONVEG", price: 450, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80" }
  ],
  "Desserts": [
    { name: "Chocolate Brownie", veg: "VEG", price: 150, img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80" },
    { name: "Gulab Jamun", veg: "VEG", price: 90, img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80" },
    { name: "Ice Cream Sundae", veg: "VEG", price: 180, img: "https://images.unsplash.com/photo-1553177595-4de2bb0842b9?w=400&q=80" }
  ],
  "Beverages": [
    { name: "Cold Coffee", veg: "VEG", price: 120, img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80" },
    { name: "Mango Lassi", veg: "VEG", price: 100, img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&q=80" },
    { name: "Mint Mojito", veg: "VEG", price: 140, img: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&q=80" }
  ]
};

const cuisinesList = ["North Indian", "South Indian", "Chinese", "Italian", "Desserts", "Beverages", "Fast Food"];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomMultiple = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const restaurants = [];
const menus = [];
let resIdCounter = 1;
let itemIdCounter = 1;

cities.forEach(city => {
  for (let i = 1; i <= 12; i++) {
    const resId = resIdCounter.toString();
    const isVegOnly = Math.random() > 0.7; // 30% chance for a restaurant to be pure veg
    
    // Dynamic Restaurant Details
    const resName = `${getRandom(resPrefixes)} ${Math.random() > 0.5 ? city : ''} ${getRandom(resSuffixes)}`.replace(/\s+/g, ' ').trim();
    const cityLocs = locations[city] || ["City Center"];

    restaurants.push({
      id: resId,
      city: city,
      name: resName,
      cloudinaryImageId: getRandom(resImages),
      rating: Number((Math.random() * (5.0 - 3.8) + 3.8).toFixed(1)),
      veg: isVegOnly,
      cuisines: getRandomMultiple(cuisinesList, 2),
      costForTwo: Math.floor(Math.random() * 600) + 300,
      deliveryTime: Math.floor(Math.random() * 30) + 20,
      address: `${getRandom(cityLocs)}, ${city}`
    });

    // Pick 3 to 4 random categories for this specific restaurant
    const allCategories = Object.keys(foodDatabase);
    const selectedCategories = getRandomMultiple(allCategories, Math.floor(Math.random() * 2) + 3);

    const categoriesArray = selectedCategories.map(catTitle => {
      // Get foods for this category, filter if restaurant is pure veg
      let foodsInCategory = foodDatabase[catTitle];
      if (isVegOnly) {
        foodsInCategory = foodsInCategory.filter(f => f.veg === "VEG");
      }

      // Select random 2-3 items from the available foods in this category
      const selectedFoods = getRandomMultiple(foodsInCategory, Math.floor(Math.random() * 2) + 2);

      return {
        title: catTitle,
        itemCards: selectedFoods.map(food => ({
          info: {
            id: `i${itemIdCounter++}`,
            name: food.name,
            price: food.price + Math.floor(Math.random() * 50), // Slight price variation per restaurant
            description: `A delicious and flavorful ${food.name.toLowerCase()} prepared freshly for you.`,
            imageId: food.img,
            vegClassifier: food.veg
          }
        }))
      };
    }).filter(cat => cat.itemCards.length > 0); // Remove empty categories if any

    menus.push({
      id: `m${resId}`,
      restaurantId: resId,
      categories: categoriesArray
    });

    resIdCounter++;
  }
});

const db = { restaurants, menus };
fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
console.log('✅ Success! db.json generated with unique restaurants, varied menus, and accurate food images!');