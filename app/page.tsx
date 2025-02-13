
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to OptiManager</h1>
      <p className="subtitle">Manage your optical shop with ease</p>
      
      <div className="dashboard-grid">
        <Link href="/products" className="card">
          <h2>Products</h2>
          <p>Manage your inventory of frames, lenses, and accessories</p>
        </Link>
        
        <Link href="/receipts" className="card">
          <h2>New Receipt</h2>
          <p>Create a new receipt for customer purchases</p>
        </Link>
        
        <Link href="/history" className="card">
          <h2>History</h2>
          <p>View and manage past transactions</p>
        </Link>
        
        <div className="card">
          <h2>Today's Summary</h2>
          <p>Quick overview of today's transactions</p>
        </div>
      </div>
    </div>
  );
}
