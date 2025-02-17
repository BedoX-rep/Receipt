
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  name: string;
  price: number;
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
    setProducts(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: newProduct.name,
      price: parseFloat(newProduct.price)
    };
    
    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('name', editingProduct.name);
      if (error) {
        console.error('Error updating product:', error);
        return;
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);
      if (error) {
        console.error('Error adding product:', error);
        return;
      }
    }
    
    setShowModal(false);
    setEditingProduct(null);
    setNewProduct({ name: '', price: '' });
    fetchProducts();
  };

  const handleDelete = async (name: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('name', name);
      if (error) {
        console.error('Error deleting product:', error);
        return;
      }
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-violet-900 p-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div>
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-violet-200 mb-4">
                Product Inventory
              </h1>
              <p className="text-blue-200 text-lg">
                Manage your optical products with style
              </p>
            </div>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                + Add Product
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
                className="px-4 py-3 bg-white/20 rounded-xl text-white"
              >
                {view === 'grid' ? '📋' : '📱'}
              </motion.button>
            </div>
          </div>

          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 border border-blue-300/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <AnimatePresence>
            {view === 'grid' ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-6 border border-blue-300/20 hover:border-blue-300/40 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                      <span className="text-lg font-bold text-blue-300">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setNewProduct({
                            name: product.name,
                            price: product.price.toString()
                          });
                          setShowModal(true);
                        }}
                        className="px-4 py-2 bg-blue-500/20 rounded-lg text-blue-200 hover:bg-blue-500/30 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.name)}
                        className="px-4 py-2 bg-red-500/20 rounded-lg text-red-200 hover:bg-red-500/30 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden rounded-2xl border border-blue-300/20"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-6 bg-white/5 border-b border-blue-300/20 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                      <p className="text-blue-300">${product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setNewProduct({
                            name: product.name,
                            price: product.price.toString()
                          });
                          setShowModal(true);
                        }}
                        className="px-4 py-2 bg-blue-500/20 rounded-lg text-blue-200 hover:bg-blue-500/30 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.name)}
                        className="px-4 py-2 bg-red-500/20 rounded-lg text-red-200 hover:bg-red-500/30 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <Link
          href="/manager"
          className="inline-flex items-center mt-8 text-blue-200 hover:text-white transition-colors"
        >
          <span className="mr-2">←</span> Back to Dashboard
        </Link>
      </div>

      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-blue-300/20"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-blue-300/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-blue-300/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    setNewProduct({ name: '', price: '' });
                  }}
                  className="px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
