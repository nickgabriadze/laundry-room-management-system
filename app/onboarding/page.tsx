"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth } from "@/src/firebase";
import { BUILDINGS, type BuildingSelection } from "@/src/user/buildings";
import {
  createCurrentUserProfile,
  getCurrentUserProfile,
} from "@/src/user/profile";
import styles from "./onboarding.module.css";

type PageState = "checking" | "ready" | "saving" | "error";

export default function OnboardingPage() {
  const router = useRouter();
  const [building, setBuilding] = useState<BuildingSelection>("");
  const [pageState, setPageState] = useState<PageState>("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/signin");
        return;
      }

      void (async () => {
        try {
          const account = await getCurrentUserProfile();
          if (!active) return;

          if (account) {
            router.replace("/");
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!building || !auth.currentUser) return;

    setPageState("saving");
    setError("");

    try {
      await createCurrentUserProfile(building);
      router.replace("/");
    } catch {
      try {
        const account = await getCurrentUserProfile();
        if (account) {
          router.replace("/");
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

  return (
    <main className={styles.page}>
      <section className={styles.content} aria-labelledby="onboarding-title">
        <header className={styles.header}>
          <Image
            src="/dorms.svg"
            alt="Three dorm buildings, each represented by a pair of colors"
            width={162}
            height={30}
            priority
          />
          <div className={styles.eyebrowContainer}>
            <p className={styles.eyebrow}>Resident profile:</p>
            <p className={styles.email}>
              {auth.currentUser?.email?.toLowerCase()}
            </p>
          </div>
          <h1 id="onboarding-title">Which dorm building do you live in?</h1>
        </header>

        {pageState === "checking" && (
          <p className={styles.status} role="status">
            Checking your account...
          </p>
        )}

        {pageState === "error" && (
          <div className={styles.message} role="alert">
            <p>{error}</p>
            <button
              className={styles.secondaryButton}
              onClick={() => window.location.reload()}
              type="button"
            >
              Try again
            </button>
          </div>
        )}

        {(pageState === "ready" || pageState === "saving") && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <fieldset
              className={styles.choiceGroup}
              disabled={pageState === "saving"}
            >
              <div className={styles.buildingChoices}>
                {BUILDINGS.map((option) => (
                  <button
                    aria-pressed={building === option.value}
                    className={styles.buildingChoice}
                    key={option.value}
                    onClick={() => setBuilding(option.value)}
                    type="button"
                  >
                    <span
                      aria-hidden="true"
                      className={styles.buildingDot}
                      data-building={option.value}
                    />
                    <span className={styles.buildingLabel}>
                      {option.letter}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <button
              className={styles.submitButton}
              type="submit"
              disabled={!building || pageState === "saving"}
            >
              {pageState === "saving" ? "Saving..." : "Continue"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
