"use client";

import Image from "next/image";
import { BUILDINGS, type BuildingSelection } from "@/src/user/buildings";
import type { FormEvent } from "react";
import styles from "./onboarding.module.css";

type OnboardingViewProps = {
  building: BuildingSelection;
  pageState: "checking" | "ready" | "saving" | "error";
  error: string;
  userEmail?: string;
  onBuildingChange: (building: BuildingSelection) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRetry: () => void;
};

export function OnboardingView({
  building,
  pageState,
  error,
  userEmail,
  onBuildingChange,
  onSubmit,
  onRetry,
}: OnboardingViewProps) {
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
            <p className={styles.email}>{userEmail}</p>
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
            <button className={styles.secondaryButton} onClick={onRetry} type="button">
              Try again
            </button>
          </div>
        )}

        {(pageState === "ready" || pageState === "saving") && (
          <form className={styles.form} onSubmit={onSubmit}>
            <fieldset className={styles.choiceGroup} disabled={pageState === "saving"}>
              <div className={styles.buildingChoices}>
                {BUILDINGS.map((option) => (
                  <button
                    aria-pressed={building === option.value}
                    className={styles.buildingChoice}
                    key={option.value}
                    onClick={() => onBuildingChange(option.value)}
                    type="button"
                  >
                    <span
                      aria-hidden="true"
                      className={styles.buildingDot}
                      data-building={option.value}
                    />
                    <span className={styles.buildingLabel}>{option.letter}</span>
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
