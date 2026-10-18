"use client";

import { useEffect, useState } from "react";
import { OAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirebaseAuth } from "@/src/firebase";
import { getMyUserAccount } from "@/src/dataconnect-generated";
import { getMachineRedirect } from "../machineRedirect";

export function useSignIn() {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      if (!user) {
        setIsCheckingSession(false);
        return;
      }

      setIsCheckingSession(true);
      void (async () => {
        try {
          const { data } = await getMyUserAccount();
          const returnRoute = getMachineRedirect(window.location.search);
          if (!active) return;

          router.replace(
            data.userAccount
              ? (returnRoute ?? "/")
              : returnRoute
                ? `/onboarding?redirect=${encodeURIComponent(returnRoute)}`
                : "/onboarding",
          );
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

  async function signIn() {
    setIsSigningIn(true);
    setError("");

    try {
      const provider = new OAuthProvider("microsoft.com");
      provider.setCustomParameters({
        tenant: process.env.NEXT_PUBLIC_KIU_ENTRA_TENANT_ID ?? "consumers",
      });

      await signInWithPopup(getFirebaseAuth(), provider);
    } catch {
      setError("Sign-in failed. Please try again.");
      setIsSigningIn(false);
    }
  }

  return { isSigningIn, isCheckingSession, error, signIn };
}
