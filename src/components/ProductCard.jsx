import { useState } from 'react';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({ ...product, quantity });
    setQuantity(1);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition ${isOutOfStock ? 'opacity-60' : ''}`}>
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
        <p className="text-sm text-gray-400 mt-1">Stock: {product.stock}</p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-green-700 font-bold text-lg">
            ฿{product.price.toLocaleString()}
          </span>

          {!isOutOfStock && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-gray-600"
              >
                -
              </button>
              <span className="w-6 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-gray-600"
              >
                +
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full mt-3 bg-yellow-400 hover:bg-yellow-500 text-green-800 font-bold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? 'Out of Stock' : '+ Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;