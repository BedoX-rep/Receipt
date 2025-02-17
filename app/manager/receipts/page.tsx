'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
  const [existingProducts, setExistingProducts] = useState<{name: string, price: number}[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<{name: string, price: number, quantity: number}>({ name: '', price: 0, quantity: 1 });
  const [discount, setDiscount] = useState(0);
  const [numericalDiscount, setNumericalDiscount] = useState(0);
  const [advancePayment, setAdvancePayment] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      if (data) {
        setExistingProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductSelect = (name: string) => {
    const product = existingProducts.find(p => p.name === name);
    if (product) {
      setSelectedProduct({ name: product.name, price: product.price, quantity: 1 });
    }
  };

  const addProduct = () => {
    if (selectedProduct.name && selectedProduct.price > 0 && selectedProduct.quantity > 0) {
      const total = selectedProduct.price * selectedProduct.quantity;
      setProducts([...products, { ...selectedProduct, total }]);
      setSelectedProduct({ name: '', price: 0, quantity: 1 });
    }
  };

  const addTax = () => {
    const baseAmount = prompt('Enter base amount for tax calculation:');
    if (baseAmount) {
      const amount = parseFloat(baseAmount);
      if (!isNaN(amount)) {
        const tax = amount * 0.10;
        setProducts([...products, {
          name: 'Assurance Tax',
          price: tax,
          quantity: 1,
          total: tax
        }]);
      }
    }
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
    if (products.length === 0) {
      alert('Please add at least one product');
      return;
    }

    const total = calculateTotal();
    const receipt: Receipt = {
      date: new Date().toISOString(),
      client_name: clientName || 'Walk-in Customer',
      client_phone: clientPhone,
      right_eye: rightEye || { sph: '', cyl: '', axe: '' },
      left_eye: leftEye || { sph: '', cyl: '', axe: '' },
      products: products || [],
      discount: Number(discount) || 0,
      numerical_discount: Number(numericalDiscount) || 0,
      advance_payment: Number(advancePayment) || 0,
      total: Number(total) || 0,
      balance_due: Number(total - advancePayment) || 0
    };

    try {
      // First save to database
      const { error: saveError } = await supabase
        .from('receipts')
        .insert([{
          ...receipt,
          products: JSON.stringify(receipt.products),
          right_eye: JSON.stringify(receipt.right_eye),
          left_eye: JSON.stringify(receipt.left_eye)
        }]);

      if (saveError) {
        console.error('Supabase error:', saveError);
        throw saveError;
      }

      // Then generate PDF
      const response = await fetch('/api/receipts/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(receipt),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate PDF');
      }

      if (response.headers.get('Content-Type') === 'application/pdf') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${new Date().getTime()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate PDF');
      }

      alert('Receipt saved and PDF generated successfully');

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
      console.error('Error processing receipt:', error);
      alert('Error processing receipt');
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Generate Receipt</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Client Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Prescription */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Prescription</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Right Eye</h3>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="SPH"
                  value={rightEye.sph}
                  onChange={(e) => setRightEye({...rightEye, sph: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="CYL"
                  value={rightEye.cyl}
                  onChange={(e) => setRightEye({...rightEye, cyl: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="AXE"
                  value={rightEye.axe}
                  onChange={(e) => setRightEye({...rightEye, axe: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Left Eye</h3>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="SPH"
                  value={leftEye.sph}
                  onChange={(e) => setLeftEye({...leftEye, sph: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="CYL"
                  value={leftEye.cyl}
                  onChange={(e) => setLeftEye({...leftEye, cyl: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="AXE"
                  value={leftEye.axe}
                  onChange={(e) => setLeftEye({...leftEye, axe: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <div className="flex gap-4 mb-4">
            <select
              value={selectedProduct.name}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="flex-1 p-2 border rounded"
            >
              <option value="">Select Product</option>
              {existingProducts.map((product) => (
                <option key={product.name} value={product.name}>
                  {product.name} - ${product.price}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={selectedProduct.quantity}
              onChange={(e) => setSelectedProduct({...selectedProduct, quantity: parseInt(e.target.value) || 1})}
              min="1"
              className="w-20 p-2 border rounded"
            />
            <button
              type="button"
              onClick={addProduct}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
            <button
              type="button"
              onClick={addTax}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Add Tax
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{product.quantity}</td>
                    <td className="px-4 py-2">${product.price.toFixed(2)}</td>
                    <td className="px-4 py-2">${product.total.toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Discount (%)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value))}
                min="0"
                max="100"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Numerical Discount ($)</label>
              <input
                type="number"
                value={numericalDiscount}
                onChange={(e) => setNumericalDiscount(parseFloat(e.target.value))}
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Advance Payment</label>
              <input
                type="number"
                value={advancePayment}
                onChange={(e) => setAdvancePayment(parseFloat(e.target.value))}
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mt-4 text-right">
            <p className="text-lg font-semibold">Total: ${calculateTotal().toFixed(2)}</p>
            <p className="text-lg font-semibold">Balance Due: ${(calculateTotal() - advancePayment).toFixed(2)}</p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/manager"
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={async () => {
              try {
                if (products.length === 0) {
                  alert('Please add at least one product');
                  return;
                }

                const calculatedTotal = calculateTotal();
                const balanceDue = calculatedTotal - (Number(advancePayment) || 0);

                const receiptData = {
                  date: new Date().toISOString(),
                  client_name: clientName || 'Walk-in Customer',
                  client_phone: clientPhone || '',
                  right_eye: {
                    sph: rightEye.sph || '',
                    cyl: rightEye.cyl || '',
                    axe: rightEye.axe || ''
                  },
                  left_eye: {
                    sph: leftEye.sph || '',
                    cyl: leftEye.cyl || '',
                    axe: leftEye.axe || ''
                  },
                  products: products.map(p => ({
                    name: p.name,
                    price: Number(p.price) || 0,
                    quantity: Number(p.quantity) || 0,
                    total: Number(p.total) || 0
                  })),
                  discount: Number(discount) || 0,
                  numerical_discount: Number(numericalDiscount) || 0,
                  advance_payment: Number(advancePayment) || 0,
                  total: calculatedTotal,
                  balance_due: balanceDue
                };

                const { data, error: saveError } = await supabase
                  .from('receipts')
                  .insert([receiptData])
                  .select()
                  .single();

                if (saveError) {
                  console.error('Supabase error:', saveError);
                  throw new Error(saveError.message);
                }

                if (!data) {
                  throw new Error('No data returned from insert');
                }

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
                alert(error instanceof Error ? error.message : 'Error saving receipt');
              }
            }}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save Receipt
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                if (products.length === 0) {
                  alert('Please add at least one product');
                  return;
                }

                const total = calculateTotal();
                const receipt = {
                  date: new Date().toISOString(),
                  client_name: clientName || 'Walk-in Customer',
                  client_phone: clientPhone,
                  right_eye: rightEye || { sph: '', cyl: '', axe: '' },
                  left_eye: leftEye || { sph: '', cyl: '', axe: '' },
                  products: products || [],
                  discount: Number(discount) || 0,
                  numerical_discount: Number(numericalDiscount) || 0,
                  advance_payment: Number(advancePayment) || 0,
                  total: Number(total) || 0,
                  balance_due: Number(total - advancePayment) || 0
                };

                const response = await fetch('/api/receipts/generate-pdf', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(receipt),
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.details || 'Failed to generate PDF');
                }

                if (response.headers.get('Content-Type') === 'application/pdf') {
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `receipt-${new Date().getTime()}.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                }
              } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Error generating PDF');
              }
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Generate PDF
          </button>
        </div>
      </form>
    </div>
  );
}