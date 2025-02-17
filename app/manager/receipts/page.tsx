
'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import styles from '../../page.module.css';

interface Product {
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface Prescription {
  sph: string;
  cyl: string;
  axe: string;
}

interface Receipt {
  date: string;
  client_name: string;
  client_phone: string;
  right_eye: Prescription;
  left_eye: Prescription;
  products: Product[];
  discount: number;
  numerical_discount: number;
  advance_payment: number;
  total: number;
  balance_due: number;
}

export default function Receipts() {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [rightEye, setRightEye] = useState<Prescription>({ sph: '', cyl: '', axe: '' });
  const [leftEye, setLeftEye] = useState<Prescription>({ sph: '', cyl: '', axe: '' });
  const [products, setProducts] = useState<Product[]>([]);
  const [customProduct, setCustomProduct] = useState({ name: '', price: 0 });
  const [discount, setDiscount] = useState(0);
  const [numericalDiscount, setNumericalDiscount] = useState(0);
  const [advancePayment, setAdvancePayment] = useState(0);

  const addProduct = async () => {
    const newProduct = {
      name: customProduct.name,
      price: customProduct.price,
      quantity: 1,
      total: customProduct.price
    };
    setProducts([...products, newProduct]);
    setCustomProduct({ name: '', price: 0 });
  };

  const addTax = () => {
    const baseAmount = prompt('Enter base amount for tax calculation:');
    if (baseAmount) {
      const amount = parseFloat(baseAmount);
      if (!isNaN(amount)) {
        const tax = amount * 0.10;
        const taxProduct = {
          name: 'Assurance Tax',
          price: tax,
          quantity: 1,
          total: tax
        };
        setProducts([...products, taxProduct]);
      }
    }
  };

  const updateProduct = (index: number, field: keyof Product, value: number | string) => {
    const updatedProducts = [...products];
    const product = { ...updatedProducts[index] };
    
    if (field === 'quantity' || field === 'price') {
      product[field] = typeof value === 'number' ? value : parseFloat(value as string);
      product.total = product.price * product.quantity;
    } else {
      product[field] = value;
    }
    
    updatedProducts[index] = product;
    setProducts(updatedProducts);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const subtotal = products.reduce((sum, product) => sum + product.total, 0);
    const percentageDiscount = subtotal * (discount / 100);
    return Math.max(subtotal - percentageDiscount - numericalDiscount, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const total = calculateTotal();
    const receipt: Receipt = {
      date: new Date().toISOString(),
      client_name: clientName,
      client_phone: clientPhone,
      right_eye: rightEye,
      left_eye: leftEye,
      products: products,
      discount: discount,
      numerical_discount: numericalDiscount,
      advance_payment: advancePayment,
      total: total,
      balance_due: total - advancePayment
    };

    try {
      const supabase = createClient();
      const { error } = await supabase.from('receipts').insert([receipt]);
      
      if (error) throw error;
      
      alert('Receipt saved successfully');
      // Reset form
      setClientName('');
      setClientPhone('');
      setRightEye({ sph: '', cyl: '', axe: '' });
      setLeftEye({ sph: '', cyl: '', axe: '' });
      setProducts([]);
      setDiscount(0);
      setNumericalDiscount(0);
      setAdvancePayment(0);
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
          <h2>Client Information</h2>
          <input
            type="text"
            placeholder="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <h2>Prescription</h2>
          <div className={styles.prescriptionGrid}>
            <div>
              <h3>Right Eye</h3>
              <input
                type="text"
                placeholder="SPH"
                value={rightEye.sph}
                onChange={(e) => setRightEye({...rightEye, sph: e.target.value})}
              />
              <input
                type="text"
                placeholder="CYL"
                value={rightEye.cyl}
                onChange={(e) => setRightEye({...rightEye, cyl: e.target.value})}
              />
              <input
                type="text"
                placeholder="AXE"
                value={rightEye.axe}
                onChange={(e) => setRightEye({...rightEye, axe: e.target.value})}
              />
            </div>
            <div>
              <h3>Left Eye</h3>
              <input
                type="text"
                placeholder="SPH"
                value={leftEye.sph}
                onChange={(e) => setLeftEye({...leftEye, sph: e.target.value})}
              />
              <input
                type="text"
                placeholder="CYL"
                value={leftEye.cyl}
                onChange={(e) => setLeftEye({...leftEye, cyl: e.target.value})}
              />
              <input
                type="text"
                placeholder="AXE"
                value={leftEye.axe}
                onChange={(e) => setLeftEye({...leftEye, axe: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <h2>Products</h2>
          <div className={styles.productInput}>
            <input
              type="text"
              placeholder="Product name"
              value={customProduct.name}
              onChange={(e) => setCustomProduct({...customProduct, name: e.target.value})}
            />
            <input
              type="number"
              placeholder="Price"
              value={customProduct.price || ''}
              onChange={(e) => setCustomProduct({...customProduct, price: parseFloat(e.target.value)})}
            />
            <button type="button" onClick={addProduct}>Add Product</button>
            <button type="button" onClick={addTax}>Add Tax</button>
          </div>

          {products.map((product, index) => (
            <div key={index} className={styles.productRow}>
              <input
                type="text"
                value={product.name}
                onChange={(e) => updateProduct(index, 'name', e.target.value)}
                readOnly={product.name === 'Assurance Tax'}
              />
              <input
                type="number"
                value={product.price}
                onChange={(e) => updateProduct(index, 'price', parseFloat(e.target.value))}
                readOnly={product.name === 'Assurance Tax'}
              />
              <input
                type="number"
                value={product.quantity}
                onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value))}
                min="1"
              />
              <span>${product.total.toFixed(2)}</span>
              <button type="button" onClick={() => removeProduct(index)}>Remove</button>
            </div>
          ))}
        </div>

        <div className={styles.formGroup}>
          <h2>Payment Details</h2>
          <div>
            <label>Discount (%):</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value))}
              min="0"
              max="100"
            />
          </div>
          <div>
            <label>Numerical Discount ($):</label>
            <input
              type="number"
              value={numericalDiscount}
              onChange={(e) => setNumericalDiscount(parseFloat(e.target.value))}
              min="0"
            />
          </div>
          <div>
            <label>Advance Payment:</label>
            <input
              type="number"
              value={advancePayment}
              onChange={(e) => setAdvancePayment(parseFloat(e.target.value))}
              min="0"
            />
          </div>
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
