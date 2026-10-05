import Image from "next/image";
import styles from "./signin.module.css";

export default function SignInPage() {
  return (
    <main className={styles.page}>
      <section className={styles.content} aria-labelledby="signin-title">
        <Image
          src="/dorms.svg"
          alt="KIU Dormitories"
          width={200}
          height={30}
          priority
          draggable="false"
        />
        <Image
          src="/lms.svg"
          alt="Laundry Management System"
          width={200}
          height={30}
          priority
          draggable="false"
        />
        <button className={styles.microsoftButton} type="button">
          <Image
            src="/microsoft.svg"
            draggable="false"
            alt="Microsoft Icon"
            width={40}
            height={20}
          />
          <span>Sign in with Microsoft</span>
        </button>
      </section>
    </main>
  );
}
