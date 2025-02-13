
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Vision Plus Optical</h1>
          <p className="hero-subtitle">Discover Premium Eyewear for Every Style</p>
          <Link href="/book-appointment" className="cta-button">
            Book an Eye Exam
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">👓</div>
            <h3>Designer Frames</h3>
            <p>Exclusive collection of premium brands</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Eye Exams</h3>
            <p>Comprehensive vision care</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>1-Hour Service</h3>
            <p>Quick turnaround on most prescriptions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>Luxury Eyewear</h3>
            <p>High-end fashion and luxury brands</p>
          </div>
        </div>
      </section>
      
      <section className="featured-products">
        <h2>Featured Collections</h2>
        <div className="product-preview">
          <Link href="/products" className="preview-card">
            <div className="preview-content">
              <h3>Designer Sunglasses</h3>
              <p>View Collection →</p>
            </div>
          </Link>
          <Link href="/products" className="preview-card">
            <div className="preview-content">
              <h3>Premium Eyeglasses</h3>
              <p>View Collection →</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
