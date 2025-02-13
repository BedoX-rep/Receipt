
import Link from 'next/link';
import { CubeIcon, ReceiptIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>OptiManager</h1>
        <p className="hero-subtitle">Streamline Your Optical Shop Management</p>
      </div>
      
      <div className="dashboard-grid">
        <Link href="/products" className="feature-card">
          <div className="card-icon">
            <CubeIcon />
          </div>
          <div className="card-content">
            <h2>Products</h2>
            <p>Manage frames, lenses & accessories</p>
          </div>
        </Link>
        
        <Link href="/receipts" className="feature-card">
          <div className="card-icon">
            <ReceiptIcon />
          </div>
          <div className="card-content">
            <h2>New Receipt</h2>
            <p>Create customer receipts</p>
          </div>
        </Link>
        
        <Link href="/history" className="feature-card">
          <div className="card-icon">
            <ClockIcon />
          </div>
          <div className="card-content">
            <h2>History</h2>
            <p>Access transaction records</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
