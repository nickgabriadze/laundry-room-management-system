"use client";
import Image from "next/image";
import styles from "./signin.module.css";
import { OAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/src/firebase";

export default function SignInPage() {
  const provider = new OAuthProvider("microsoft.com");

  provider.setCustomParameters({
    // will be switched to the tenant ID of KIU Entra when the app is deployed
    tenant: process.env.NEXT_PUBLIC_KIU_ENTRA_TENANT_ID ?? "consumers",
  });

  return (
    <main className={styles.page}>
      <section className={styles.content} aria-labelledby="signin-title">
        <Image
          src="/dorms.svg"
          alt="KIU Dormitories"
          width={200}
          height={200}
          priority
          draggable="false"
        />
        <Image
          src="/lms.svg"
          alt="Laundry Management System"
          width={200}
          height={200}
          priority
          draggable="false"
        />
        <button
          className={styles.microsoftButton}
          onClick={() => signInWithPopup(auth, provider)}
          type="button"
        >
          <Image
            src="/microsoft.svg"
            draggable="false"
            alt="Microsoft Icon"
            width={40}
            height={40}
          />
          <span>Sign in with Microsoft</span>
        </button>
      </section>
    </main>
  );
}
