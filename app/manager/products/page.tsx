
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
    setProducts(data || []);
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    const { data, error } = await supabase
      .from('products')
      .insert([{ 
        name: newProduct.name, 
        price: parseFloat(newProduct.price) 
      }])
      .select();

    if (error) {
      console.error('Error adding product:', error);
      return;
    }
    
    setNewProduct({ name: '', price: '' });
    fetchProducts();
  }

  async function handleUpdateProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editProduct) return;

    const { error } = await supabase
      .from('products')
      .update({ 
        name: editProduct.name, 
        price: editProduct.price 
      })
      .eq('id', editProduct.id);

    if (error) {
      console.error('Error updating product:', error);
      return;
    }

    setEditProduct(null);
    fetchProducts();
  }

  async function handleDeleteProduct(id: number) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return;
    }

    fetchProducts();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>
      
      {/* Add Product Form */}
      <form onSubmit={handleAddProduct} className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="input-field"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="input-field"
          required
        />
        <button type="submit" className="btn-primary">
          Add Product
        </button>
      </form>

      {/* Products List */}
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="product-card p-4 flex justify-between items-center">
            {editProduct?.id === product.id ? (
              <form onSubmit={handleUpdateProduct} className="flex-1 flex gap-4">
                <input
                  type="text"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  className="input-field"
                />
                <input
                  type="number"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) })}
                  className="input-field"
                />
                <button type="submit" className="btn-primary">Save</button>
                <button 
                  type="button" 
                  onClick={() => setEditProduct(null)} 
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <div>
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-gray-600">${product.price}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditProduct(product)}
                    className="btn-secondary"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
