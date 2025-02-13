
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to OptiManager</h1>
      <p className="subtitle">Your optical shop management solution</p>
      
      <div className="dashboard-grid">
        <Link href="/products" className="card">
          <h2>Products</h2>
          <p>Frames, lenses, and accessories inventory</p>
        </Link>
        
        <Link href="/receipts" className="card">
          <h2>New Receipt</h2>
          <p>Generate customer receipts</p>
        </Link>
        
        <Link href="/history" className="card">
          <h2>History</h2>
          <p>View transaction records</p>
        </Link>
      </div>
    </div>
  );
}
