
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Business Management App</h1>
        <div className={styles.buttonContainer}>
          <Link href="/receipt-generator" className={styles.button}>
            Receipt Generator
          </Link>
          <Link href="/products" className={styles.button}>
            Products
          </Link>
        </div>
      </main>
    </div>
  );
}
