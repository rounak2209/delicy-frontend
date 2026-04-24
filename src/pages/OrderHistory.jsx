import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('delicy-orders')) || [];
    setOrders(savedOrders);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <ShoppingBag size={80} className="text-gray-300 dark:text-gray-600 mb-6" />
        <h2 className="text-2xl font-bold dark:text-white mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6 text-center px-4">Aapne abhi tak koi order nahi kiya hai. Kuch tasty mangaiye!</p>
        <Link to="/" className="px-8 py-3 bg-orange-500 text-white font-bold rounded-2xl shadow-lg">Browse Restaurants</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-8 dark:text-white">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4 border-b dark:border-gray-700 pb-4">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order {order.orderId}</p>
                <h3 className="text-xl font-bold dark:text-white">{order.restaurantName}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Clock size={14}/> {order.date}
                </p>
              </div>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-sm font-bold">
                <CheckCircle2 size={16}/> {order.status}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700 font-black text-lg dark:text-white">
              <span>Total Paid</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;