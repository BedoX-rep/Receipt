
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1 className="title">Welcome to OptiShop Manager</h1>
      <p className="subtitle">Streamline your optical shop operations</p>
      
      <div className="grid">
        <Link href="/products" className="card">
          <h2>Products 👓</h2>
          <p>Manage frames, lenses, and accessories inventory</p>
        </Link>
        
        <Link href="/receipts" className="card">
          <h2>New Receipt 📝</h2>
          <p>Create a new receipt for customer purchases</p>
        </Link>
        
        <Link href="/history" className="card">
          <h2>History 📊</h2>
          <p>View and manage transaction records</p>
        </Link>
      </div>
    </div>
  );
}
