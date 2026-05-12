import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CLOUDINARY_CONFIG } from '../config';

function SellerPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );
    const data = await res.json();
    return data.secure_url;
  };

  useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(data);
  });
  return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !image || !stock) return;

    setLoading(true);
    try {
      const imageUrl = await uploadImage();
      await addDoc(collection(db, 'products'), {
        name,
        price: parseFloat(price),
        description,
        imageUrl,
        stock: parseInt(stock),
        createdAt: new Date(),
      });
      setSuccess(true);
      setName('');
      setPrice('');
      setDescription('');
      setImage(null);
      setPreview(null);
      setStock('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (productId) => {
    if (!confirm('Delete this product?')) return;
    await deleteDoc(doc(db, 'products', productId));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
    setDescription(product.description);
    setPreview(product.imageUrl);
    window.scrollTo(0, 0);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name || !price || !stock) return;
    setLoading(true);
    try {
        let imageUrl = editingProduct.imageUrl;
        if (image) {
        imageUrl = await uploadImage();
        }
        await updateDoc(doc(db, 'products', editingProduct.id), {
            name,
            price: parseFloat(price),
            description,
            stock: parseInt(stock),
            imageUrl,
        });
        setEditingProduct(null);
        setName('');
        setPrice('');
        setStock('');
        setDescription('');
        setImage(null);
        setPreview(null);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
        console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-6">🧑‍💼 Seller Dashboard</h1>

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
          ✅ Product added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Image *</label>
        <div className="border-2 border-dashed border-yellow-400 rounded-lg p-4 text-center cursor-pointer hover:bg-yellow-50 transition">
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleImageChange}
            className="hidden"
            id="imageUpload"
          />
          <label htmlFor="imageUpload" className="cursor-pointer">
            <p className="text-3xl mb-2">📷</p>
            <p className="text-green-700 font-medium">Click to choose image</p>
            <p className="text-gray-400 text-sm mt-1">Supported: JPG, JPEG, PNG, WEBP</p>
          </label>
        </div>
          {preview && (
            <img src={preview} alt="preview" className="mt-2 w-full h-48 object-cover rounded-lg" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (฿) *</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="0"
            min="0"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your product..."
            rows={3}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <button
          type="submit"
          onClick={editingProduct ? handleUpdate : handleSubmit}
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 text-green-800 font-bold py-3 rounded-lg transition"
        >
          {loading ? 'Saving...' : editingProduct ? '✏️ Update Product' : '+ Add Product'}
        </button>

        {editingProduct && (
         <button
           type="button"
           onClick={() => {
             setEditingProduct(null);
             setName('');
             setPrice('');
             setStock('');
             setDescription('');
             setImage(null);
             setPreview(null);
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-lg transition"
         >
            Cancel
         </button>
        )}
      </form>

    <div className="mt-10">
      <h2 className="text-xl font-bold text-green-800 mb-4">📦 My Products</h2>
      {products.length === 0 ? (
        <p className="text-gray-400">No products yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map(product => (
            <div key={product.id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow">
              <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="font-bold text-gray-800">{product.name}</p>
                <p className="text-green-700">฿{product.price.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Stock: {product.stock}</p>
              </div>
              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-bold px-4 py-2 rounded-lg transition"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-100 hover:bg-red-200 text-red-600 font-bold px-4 py-2 rounded-lg transition"
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    </div>
  );
}

export default SellerPage;