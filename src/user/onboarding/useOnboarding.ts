"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirebaseAuth } from "@/src/firebase";
import { type BuildingSelection } from "@/src/user/buildings";
import {
  createCurrentUserProfile,
  getCurrentUserProfile,
} from "@/src/user/profile";
import { getPostOnboardingRoute } from "@/src/auth/machineRedirect";

type PageState = "checking" | "ready" | "saving" | "error";

export function useOnboarding() {
  const router = useRouter();
  const [building, setBuilding] = useState<BuildingSelection>("");
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [pageState, setPageState] = useState<PageState>("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      if (!user) {
        router.replace("/signin");
        return;
      }
      setUserEmail(user.email?.toLowerCase());

      void (async () => {
        try {
          const account = await getCurrentUserProfile();
          if (!active) return;

          if (account) {
            router.replace(getPostOnboardingRoute(window.location.search));
            return;
          }
          setPageState("ready");
        } catch {
          if (!active) return;
          setError("We couldn't check your account. Please try again.");
          setPageState("error");
        }
      })();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!building || !guidelinesAccepted || !getFirebaseAuth().currentUser) return;

    setPageState("saving");
    setError("");

    try {
      await createCurrentUserProfile(building);
      router.replace(getPostOnboardingRoute(window.location.search));
    } catch {
      try {
        const account = await getCurrentUserProfile();
        if (account) {
          router.replace(getPostOnboardingRoute(window.location.search));
          return;
        }
      } catch {
        setError("We couldn't verify your profile. Please try again.");
        setPageState("ready");
        return;
      }

      setError("We couldn't save your profile. Please try again.");
      setPageState("ready");
    }
  }

  return {
    building,
    setBuilding,
    guidelinesAccepted,
    setGuidelinesAccepted,
    pageState,
    error,
    setError,
    userEmail,
    submit,
  };
}
