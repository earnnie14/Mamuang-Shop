import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="bg-yellow-400 shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-green-800">
        🥭 Mamuang
      </Link>
      <div className="flex gap-6 items-center">
        <Link to="/" className="text-green-800 font-medium hover:text-green-600">
          Shop
        </Link>
        <Link to="/seller" className="text-green-800 font-medium hover:text-green-600">
          Seller
        </Link>
        <Link to="/cart" className="relative text-green-800 font-medium hover:text-green-600">
          🛒 Cart
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;