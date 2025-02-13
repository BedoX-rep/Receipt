
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Vision Plus Optical</h1>
          <p className="hero-subtitle">Premium Eyewear for Every Style</p>
          <div className="cta-section">
            <Link href="/book-appointment" className="cta-button">
              Book an Eye Exam
            </Link>
            <Link href="/products" className="secondary-button">
              Browse Collection
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <Image
            src="/images/hero/hero-glasses.jpg"
            alt="Luxury Eyewear"
            width={600}
            height={400}
            priority
            className="floating-image"
          />
        </div>
      </section>

      <section className="brands">
        <h2>Trusted Brands</h2>
        <div className="brand-grid">
          {['rayban', 'oakley', 'gucci', 'prada'].map((brand) => (
            <div key={brand} className="brand-item">
              <Image
                src={`/images/brands/${brand}.png`}
                alt={brand}
                width={120}
                height={60}
                className="brand-logo"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="featured-products">
        <h2>Latest Collections</h2>
        <div className="product-grid">
          {[
            { name: 'Designer Sunglasses', image: '/products/sunglasses.jpg' },
            { name: 'Premium Eyeglasses', image: '/products/eyeglasses.jpg' },
            { name: 'Sports Eyewear', image: '/products/sports.jpg' },
            { name: 'Kids Collection', image: '/products/kids.jpg' }
          ].map((product) => (
            <Link href="/products" key={product.name} className="product-card">
              <div className="product-image">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="collection-image"
                />
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <span className="view-collection">View Collection →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="services">
        <h2>Our Services</h2>
        <div className="services-grid">
          {[
            { icon: '👁️', title: 'Eye Exams', desc: 'Comprehensive vision tests' },
            { icon: '⚡', title: 'Quick Service', desc: '1-hour service available' },
            { icon: '🔧', title: 'Adjustments', desc: 'Free frame adjustments' },
            { icon: '💎', title: 'Custom Fitting', desc: 'Perfect fit guarantee' }
          ].map((service) => (
            <div key={service.title} className="service-card">
              <span className="service-icon">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
