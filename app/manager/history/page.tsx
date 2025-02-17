
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Product {
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface Receipt {
  id: string;
  date: string;
  client_name: string;
  client_phone: string;
  products: Product[];
  discount: number;
  numerical_discount: number;
  advance_payment: number;
  total: number;
  balance_due: number;
}

export default function History() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) throw error;
      if (data) {
        // Parse JSON strings back into objects
        const parsedReceipts = data.map(receipt => ({
          ...receipt,
          products: typeof receipt.products === 'string' ? JSON.parse(receipt.products) : receipt.products
        }));
        setReceipts(parsedReceipts);
      }
    } catch (error) {
      console.error('Error fetching receipts:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this receipt?')) {
      try {
        const { error } = await supabase
          .from('receipts')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        await fetchReceipts();
      } catch (error) {
        console.error('Error deleting receipt:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Receipt History</h1>
        <Link
          href="/manager"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance Due</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {receipts.map((receipt) => (
              <tr key={receipt.id}>
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(receipt.date)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{receipt.client_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">${receipt.total.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">${receipt.balance_due.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setSelectedReceipt(receipt)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(receipt.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReceipt && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Receipt Details</h2>
            <div className="space-y-2">
              <p><strong>Date:</strong> {formatDate(selectedReceipt.date)}</p>
              <p><strong>Client:</strong> {selectedReceipt.client_name}</p>
              <p><strong>Phone:</strong> {selectedReceipt.client_phone || 'N/A'}</p>
              
              <div className="mt-4">
                <h3 className="font-bold mb-2">Products</h3>
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Product</th>
                      <th className="text-left">Quantity</th>
                      <th className="text-left">Price</th>
                      <th className="text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReceipt.products.map((product, index) => (
                      <tr key={index}>
                        <td>{product.name}</td>
                        <td>{product.quantity}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>${product.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <p><strong>Discount:</strong> {selectedReceipt.discount}%</p>
                <p><strong>Numerical Discount:</strong> ${selectedReceipt.numerical_discount.toFixed(2)}</p>
                <p><strong>Advance Payment:</strong> ${selectedReceipt.advance_payment.toFixed(2)}</p>
                <p><strong>Total:</strong> ${selectedReceipt.total.toFixed(2)}</p>
                <p><strong>Balance Due:</strong> ${selectedReceipt.balance_due.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedReceipt(null)}
              className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
