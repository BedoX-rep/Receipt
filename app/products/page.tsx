
import Link from 'next/link';
import styles from '../page.module.css';

export default function Products() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Products</h1>
        <p>Product management functionality will go here</p>
        <Link href="/" className={styles.button}>
          Back to Home
        </Link>
      </main>
    </div>
  );
}
