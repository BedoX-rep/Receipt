import Link from 'next/link';

export default function Home() {
  return (
    <div className="hero">
      <h1 className="hero-title">Vision Plus Optical</h1>
      <p className="hero-subtitle">Your trusted partner for quality eyewear and eye care</p>

      <div className="features-grid">
        <div className="feature">
          <h2>Quality Frames</h2>
          <p>Wide selection of designer frames and sunglasses</p>
        </div>

        <div className="feature">
          <h2>Expert Service</h2>
          <p>Professional fitting and adjustments by certified opticians</p>
        </div>

        <div className="feature">
          <h2>Eye Care</h2>
          <p>Comprehensive eye examinations and consultations</p>
        </div>
      </div>

      <div className="cta-section">
        <Link href="/book-appointment" className="cta-button">Book Appointment</Link>
        <Link href="/manager" className="secondary-button">Store Manager</Link>
      </div>
    </div>
  );
}