
import Link from 'next/link';

export default function ManagerDashboard() {
  return (
    <div>
      <h1 className="title">OptiShop Manager</h1>
      <p className="subtitle">
        Your all-in-one solution for managing optical shop operations, 
        from inventory to receipts, all in one place.
      </p>
      
      <div className="grid">
        <Link href="/manager/products" className="card">
          <h2>
            <span>👓</span>
            Products
          </h2>
          <p>
            Browse and manage your inventory of frames, 
            lenses, and accessories with ease.
          </p>
        </Link>
        
        <Link href="/manager/receipts" className="card">
          <h2>
            <span>📝</span>
            New Receipt
          </h2>
          <p>
            Generate professional receipts for customer 
            purchases in seconds.
          </p>
        </Link>
        
        <Link href="/manager/history" className="card">
          <h2>
            <span>📊</span>
            History
          </h2>
          <p>
            Access and manage your complete transaction 
            history in one place.
          </p>
        </Link>
      </div>
    </div>
  );
}
