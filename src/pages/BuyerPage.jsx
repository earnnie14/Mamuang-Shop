import { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import ProductCard from '../components/ProductCard';

function BuyerPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 px-6">
      <h1 className="text-2xl font-bold text-green-800 mb-6">🛍️ Shop</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      {loading ? (
        <div className="text-center text-gray-500 mt-20">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-4xl mb-4">🥭</p>
          <p>No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BuyerPage;