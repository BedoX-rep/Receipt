
import './globals.css';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Vision Plus Optical',
  description: 'Your trusted partner for quality eyewear',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="navbar">
          <div className="nav-content">
            <Link href="/" className="logo">
              Vision Plus
            </Link>
            <div className="nav-links">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <Link href="/about" className="nav-link">
                About
              </Link>
              <Link href="/services" className="nav-link">
                Services
              </Link>
              <Link href="/contact" className="nav-link">
                Contact
              </Link>
              <Link href="/manager" className="nav-link manager-link">
                Manager
              </Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
