import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config';

function CartPage() {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();
  const [buyerId, setBuyerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleOrder = async () => {
    if (!buyerId || cart.length === 0) return;
    setLoading(true);

    const itemList = cart
      .map(item => `${item.name} x${item.quantity} = ฿${(item.price * item.quantity).toLocaleString()}`)
      .join('\n');

    try {
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          buyer_id: buyerId,
          items: itemList,
          total: `฿${totalPrice.toLocaleString()}`,
        },
        EMAILJS_CONFIG.publicKey
      );

      // Update stock in Firestore
      for (const item of cart) {
        const productRef = doc(db, 'products', item.id);
        await updateDoc(productRef, {
          stock: item.stock - item.quantity
        });
      }

      clearCart();
      setBuyerId('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (cart.length === 0 && !success) {
    return (
      <div className="text-center mt-20">
        <p className="text-4xl mb-4">🛒</p>
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 px-6">
      <h1 className="text-2xl font-bold text-green-800 mb-6">🛒 Your Cart</h1>

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
          ✅ Order placed successfully! Seller has been notified.
        </div>
      )}

      <div className="flex flex-col gap-4 mb-6">
        {cart.map(item => (
          <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow">
            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
            <div className="flex-1">
              <p className="font-bold text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-500">x{item.quantity}</p>
              <p className="text-green-700 font-bold">฿{(item.price * item.quantity).toLocaleString()}</p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-400 hover:text-red-600 text-xl"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 p-4 rounded-xl mb-4">
        <p className="text-lg font-bold text-green-800">Total: ฿{totalPrice.toLocaleString()}</p>
      </div>

      <input
        type="text"
        placeholder="Enter your Buyer ID"
        value={buyerId}
        onChange={(e) => setBuyerId(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <button
        onClick={handleOrder}
        disabled={loading || !buyerId}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-green-800 font-bold py-3 rounded-lg transition disabled:opacity-50"
      >
        {loading ? 'Placing order...' : '✅ Place Order'}
      </button>
    </div>
  );
}

export default CartPage;