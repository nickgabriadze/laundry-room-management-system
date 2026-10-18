"use client";

import Image from "next/image";
import styles from "./signin.module.css";

type SignInViewProps = {
  isSigningIn: boolean;
  isCheckingSession: boolean;
  error: string;
  onSignIn: () => void;
};

export function SignInView({
  isSigningIn,
  isCheckingSession,
  error,
  onSignIn,
}: SignInViewProps) {
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
          src="/lrms.svg"
          alt="Laundry Room Management System"
          width={200}
          height={200}
          priority
          draggable="false"
        />
        <button
          className={styles.microsoftButton}
          onClick={onSignIn}
          disabled={isSigningIn || isCheckingSession}
          type="button"
        >
          <Image
            src="/microsoft.svg"
            draggable="false"
            alt="Microsoft Icon"
            width={40}
            height={40}
          />
          <span className={styles.microsoftButtonLabel}>
            {isCheckingSession
              ? "Checking your session..."
              : isSigningIn
                ? "Signing in..."
                : "Sign in with Microsoft"}
          </span>
        </button>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
