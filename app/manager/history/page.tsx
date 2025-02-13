
import Link from 'next/link';

export default function History() {
  return (
    <div className="content">
      <h1 className="title">Receipt History</h1>
      <div className="card">
        <h2>Transaction History</h2>
        <div className="history-container">
          {/* History list will go here */}
          <p>Transaction history interface coming soon...</p>
        </div>
      </div>
      <Link href="/manager" className="back-button">
        Back to Dashboard
      </Link>
    </div>
  );
}
