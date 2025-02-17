
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../page.module.css';

interface Prescription {
  sph: string;
  cyl: string;
  axe: string;
}

interface Product {
  name: string;
  price: number;
  quantity: number;
}

interface Receipt {
  id: string;
  date: string;
  clientName: string;
  clientPhone: string;
  rightEye: Prescription;
  leftEye: Prescription;
  products: Product[];
  discount: number;
  numericalDiscount: number;
  advancePayment: number;
  total: number;
  balanceDue: number;
}

export default function History() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const response = await fetch('/api/receipts');
      if (response.ok) {
        const data = await response.json();
        setReceipts(data);
      }
    } catch (error) {
      console.error('Error fetching receipts:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this receipt?')) {
      try {
        const response = await fetch(`/api/receipts/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setReceipts(receipts.filter(receipt => receipt.id !== id));
        }
      } catch (error) {
        console.error('Error deleting receipt:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Receipt History</h1>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Client</th>
              <th>Total</th>
              <th>Discount</th>
              <th>Balance Due</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => (
              <tr key={receipt.id}>
                <td>{formatDate(receipt.date)}</td>
                <td>{receipt.clientName}</td>
                <td>${receipt.total.toFixed(2)}</td>
                <td>{receipt.discount}%</td>
                <td>${receipt.balanceDue.toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => setSelectedReceipt(receipt)}
                    className={styles.viewButton}
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(receipt.id)}
                    className={styles.deleteButton}
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
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Receipt Details</h2>
            <p>Date: {formatDate(selectedReceipt.date)}</p>
            <p>Client: {selectedReceipt.clientName}</p>
            <p>Total: ${selectedReceipt.total.toFixed(2)}</p>
            <p>Discount: {selectedReceipt.discount}%</p>
            <p>Balance Due: ${selectedReceipt.balanceDue.toFixed(2)}</p>
            <button onClick={() => setSelectedReceipt(null)}>Close</button>
          </div>
        </div>
      )}

      <Link href="/manager" className={styles.backButton}>
        Back to Dashboard
      </Link>
    </div>
  );
}
