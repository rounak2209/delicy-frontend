
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

// Restaurants filtering by city
export const getRestaurantsByCity = (city) => `${BASE_URL}/restaurants?city=${city}`;

// Single restaurant details
export const getRestaurantDetails = (id) => `${BASE_URL}/restaurants/${id}`;

// Menu filtering by restaurantId
export const getMenuByRestaurantId = (resId) => `${BASE_URL}/menus?restaurantId=${resId}`;

export const getAllMenus = () => `${BASE_URL}/menus`;