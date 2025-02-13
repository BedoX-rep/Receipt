
import Link from 'next/link';

export default function Products() {
  return (
    <div className="content">
      <h1 className="title">Product Management</h1>
      <div className="card">
        <h2>Inventory</h2>
        <div className="grid">
          {/* Product list will go here */}
          <p>Product inventory management interface coming soon...</p>
        </div>
      </div>
      <Link href="/manager" className="back-button">
        Back to Dashboard
      </Link>
    </div>
  );
}
