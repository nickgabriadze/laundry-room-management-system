import { MachineList } from "@/src/dashboard/machines/MachineList";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <header className={styles.header}>
        <Link className={styles.profileLink} href="/profile">
          <span aria-hidden="true" className={styles.studentIcon} />
          <span>Profile</span>
        </Link>
      </header>
      <MachineList />
    </>
  );
}
