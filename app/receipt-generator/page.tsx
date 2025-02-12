
import Link from 'next/link';
import styles from '../page.module.css';

export default function ReceiptGenerator() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Receipt Generator</h1>
        <p>Receipt generation functionality will go here</p>
        <Link href="/" className={styles.button}>
          Back to Home
        </Link>
      </main>
    </div>
  );
}
