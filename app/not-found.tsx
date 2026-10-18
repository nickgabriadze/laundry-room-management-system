import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="not-found-title">
        <p className={styles.code}>404</p>
        <h1 id="not-found-title">This page isn’t in the laundry room</h1>
        <p className={styles.description}>
          The link may be incorrect, or the page may have moved. Check the
          address or return to the laundry room dashboard.
        </p>
        <Link className={styles.homeLink} href="/">
          Back to laundry room
        </Link>
      </section>
    </main>
  );
}
