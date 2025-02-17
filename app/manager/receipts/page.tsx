
'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from '../../page.module.css';

interface Product {
  name: string;
  price: number;
  quantity: number;
}

export default function Receipts() {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [discount, setDiscount] = useState(0);
  const [advancePayment, setAdvancePayment] = useState(0);

  const addProduct = () => {
    setProducts([...products, { name: '', price: 0, quantity: 1 }]);
  };

  const updateProduct = (index: number, field: keyof Product, value: string | number) => {
    const updatedProducts = [...products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setProducts(updatedProducts);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const subtotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const discountAmount = subtotal * (discount / 100);
    return subtotal - discountAmount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const receipt = {
      date: new Date().toISOString(),
      clientName,
      clientPhone,
      products,
      discount,
      advancePayment,
      total: calculateTotal(),
      balanceDue: calculateTotal() - advancePayment
    };

    try {
      const response = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(receipt)
      });
      if (response.ok) {
        alert('Receipt saved successfully');
        // Reset form
        setClientName('');
        setClientPhone('');
        setProducts([]);
        setDiscount(0);
        setAdvancePayment(0);
      }
    } catch (error) {
      console.error('Error saving receipt:', error);
      alert('Error saving receipt');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Generate Receipt</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Client Name:</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Phone:</label>
          <input
            type="tel"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            required
          />
        </div>

        <h2>Products</h2>
        {products.map((product, index) => (
          <div key={index} className={styles.productRow}>
            <input
              type="text"
              placeholder="Product name"
              value={product.name}
              onChange={(e) => updateProduct(index, 'name', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={product.price}
              onChange={(e) => updateProduct(index, 'price', parseFloat(e.target.value))}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={product.quantity}
              onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value))}
              required
              min="1"
            />
            <button type="button" onClick={() => removeProduct(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addProduct}>Add Product</button>

        <div className={styles.formGroup}>
          <label>Discount (%):</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value))}
            min="0"
            max="100"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Advance Payment:</label>
          <input
            type="number"
            value={advancePayment}
            onChange={(e) => setAdvancePayment(parseFloat(e.target.value))}
            min="0"
          />
        </div>

        <div className={styles.summary}>
          <p>Total: ${calculateTotal().toFixed(2)}</p>
          <p>Balance Due: ${(calculateTotal() - advancePayment).toFixed(2)}</p>
        </div>

        <button type="submit" className={styles.submitButton}>Generate Receipt</button>
      </form>
      <Link href="/manager" className={styles.backButton}>
        Back to Dashboard
      </Link>
    </div>
  );
}
