
import Link from 'next/link';

export default function Receipts() {
  return (
    <div className="content">
      <h1 className="title">New Receipt</h1>
      <div className="card">
        <h2>Create Receipt</h2>
        <div className="form-container">
          {/* Receipt form will go here */}
          <p>Receipt generation interface coming soon...</p>
        </div>
      </div>
      <Link href="/manager" className="back-button">
        Back to Dashboard
      </Link>
    </div>
  );
}
