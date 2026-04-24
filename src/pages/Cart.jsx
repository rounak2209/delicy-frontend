import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [formData, setFormData] = useState({ address: '', phone: '', payment: 'upi' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const gst = subtotal * 0.05;
  const platformFee = 5;
  const total = subtotal + deliveryFee + gst + platformFee;

  const handleCheckout = (e) => {
    //  FIX: Agar event (e) hai tabhi preventDefault call hoga
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const newErrors = {};
    if (formData.address.trim().length < 10) newErrors.address = "Address must be at least 10 characters.";
    if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = "Enter a valid 10-digit Indian phone number.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Order History Logic: LocalStorage mein save kar rahe hain
      const newOrder = {
        orderId: "#" + Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        items: cart,
        total: total.toFixed(2),
        status: "Delivered",
        restaurantName: cart[0].restaurantName || "Delicious Restaurant"
      };

      const existingOrders = JSON.parse(localStorage.getItem('delicy-orders')) || [];
      localStorage.setItem('delicy-orders', JSON.stringify([newOrder, ...existingOrders]));

      alert("Order Placed Successfully!");
      clearCart();
      navigate('/orders'); // Order history par redirect
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <ShoppingBag size={80} className="text-gray-300 dark:text-gray-600 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Your cart is empty</h2>
        <Link to="/" className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors">Browse Restaurants</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {checkoutStep === 1 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Review your Order</h2>
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b dark:border-gray-700 last:border-0">
                <div className="flex-1">
                  <h3 className="font-semibold dark:text-gray-200">{item.name}</h3>
                  <p className="text-gray-500 text-sm">₹{item.price} x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border dark:border-gray-600 rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white"><Minus size={16} /></button>
                    <span className="px-3 font-semibold dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white"><Plus size={16} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-2"><Trash2 size={20} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form id="checkout-form" onSubmit={handleCheckout} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Delivery Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium dark:text-gray-300 mb-1">Delivery Address</label>
              <textarea rows="3" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Complete address..."></textarea>
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium dark:text-gray-300 mb-1">Mobile Number</label>
              <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="10-digit number" />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            <h3 className="text-lg font-bold mb-3 dark:text-white">Payment</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 dark:text-gray-300 cursor-pointer"><input type="radio" name="payment" value="upi" checked={formData.payment === 'upi'} onChange={e => setFormData({...formData, payment: e.target.value})} /> UPI</label>
              <label className="flex items-center gap-2 dark:text-gray-300 cursor-pointer"><input type="radio" name="payment" value="cod" checked={formData.payment === 'cod'} onChange={e => setFormData({...formData, payment: e.target.value})} /> Cash on Delivery</label>
            </div>
          </form>
        )}
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 sticky top-24">
          <h3 className="text-xl font-bold mb-6 dark:text-white">Bill Details</h3>
          <div className="space-y-3 text-gray-600 dark:text-gray-300 mb-6 border-b dark:border-gray-700 pb-6">
            <div className="flex justify-between"><span>Item Total</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Delivery Fee</span><span className={deliveryFee === 0 ? "text-green-500" : ""}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
            <div className="flex justify-between"><span>GST (5%)</span><span>₹{gst.toFixed(2)}</span></div>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white mb-6"><span>TO PAY</span><span>₹{total.toFixed(2)}</span></div>
          <button 
            onClick={(e) => checkoutStep === 1 ? setCheckoutStep(2) : handleCheckout(e)} 
            className={`w-full py-3 text-white font-bold rounded-lg shadow-md ${checkoutStep === 1 ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {checkoutStep === 1 ? 'PROCEED TO CHECKOUT' : 'PLACE ORDER'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;