import Link from "next/link";
import styles from "./DashboardHeader.module.css";

export function DashboardHeader() {
  return (
    <header className={styles.header}>
      <Link className={styles.profileLink} href="/profile">
        <span aria-hidden="true" className={styles.studentIcon} />
        <span>Profile</span>
      </Link>
    </header>
  );
}
