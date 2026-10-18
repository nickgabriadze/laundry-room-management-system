import Link from "next/link";
import styles from "./DashboardHeader.module.css";
import Image from "next/image";

export function DashboardHeader() {
  return (
    <header className={styles.header}>
      <div>
        <Image
          src="/lrms.svg"
          alt="Laundry Room Management System"
          width={50}
          height={50}
          draggable={false}
        />
        <Link className={styles.profileLink} href="/profile">
          <span aria-hidden="true" className={styles.studentIcon} />
          <span>Profile</span>
        </Link>
      </div>
    </header>
  );
}
