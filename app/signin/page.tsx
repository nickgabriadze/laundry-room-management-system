"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./signin.module.css";
import {
  OAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/src/firebase";
import { getMyUserAccount } from "@/src/dataconnect-generated";

export default function SignInPage() {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsCheckingSession(false);
        return;
      }

      setIsCheckingSession(true);
      void (async () => {
        try {
          const { data } = await getMyUserAccount();
          if (active) router.replace(data.userAccount ? "/" : "/onboarding");
        } catch {
          if (!active) return;
          setError("We couldn't check your profile. Please try again.");
          setIsCheckingSession(false);
        }
      })();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [router]);

  async function handleSignIn() {
    setIsSigningIn(true);
    setError("");

    try {
      const provider = new OAuthProvider("microsoft.com");
      provider.setCustomParameters({
        tenant: process.env.NEXT_PUBLIC_KIU_ENTRA_TENANT_ID ?? "consumers",
      });

      await signInWithPopup(auth, provider);
    } catch {
      setError("Sign-in failed. Please try again.");
      setIsSigningIn(false);
    }
  }

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
          onClick={handleSignIn}
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
