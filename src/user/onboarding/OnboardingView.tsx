"use client";

import Image from "next/image";
import { BUILDINGS, type BuildingSelection } from "@/src/user/buildings";
import type { FormEvent } from "react";
import styles from "./onboarding.module.css";

type OnboardingViewProps = {
  building: BuildingSelection;
  guidelinesAccepted: boolean;
  pageState: "checking" | "ready" | "saving" | "error";
  error: string;
  userEmail?: string;
  onBuildingChange: (building: BuildingSelection) => void;
  onGuidelinesAcceptedChange: (accepted: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRetry: () => void;
};

export function OnboardingView({
  building,
  guidelinesAccepted,
  pageState,
  error,
  userEmail,
  onBuildingChange,
  onGuidelinesAcceptedChange,
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
            <p className={styles.eyebrow}>Resident profile</p>
            <p className={styles.email}>{userEmail}</p>
          </div>
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
          <>
            <section className={styles.rulesSection} aria-labelledby="rules-title">
              <h2 id="rules-title">Community Guidelines</h2>
              <p className={styles.rulesSubtitle}>(please read)</p>
              <ul className={styles.rulesList}>
                <li>
                  <strong>Be respectful to your peers, your contact info is visible.</strong> Watch for laundry machine alerts in your Outlook inbox. Others can reach out to you if you forget to get your laundry.
                </li>
                <li>
                  <strong>Check your spam folder for laundry machine alerts.</strong> Initial emails might end up there. Mark them as "not spam" so future notifications go to your inbox.
                </li>
                <li>
                  <strong>Use software responsibly.</strong> If you mark a machine as in-use to reserve it, please visit the laundry room promptly so others don't make unnecessary trips.
                </li>
                <li>
                  <strong>Maximum one machine per type.</strong> You can use one washer and one dryer simultaneously, but not two of the same.
                </li>
                <li>
                  <strong>Help maintain the QR stickers.</strong> If stickers get damaged, please print them out and attach them to dryers and washers so other students can scan them for easy access.
                </li>
              </ul>
            </section>

            <h1 id="onboarding-title">Which dorm building do you live in?</h1>

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

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={guidelinesAccepted}
                  onChange={(e) => onGuidelinesAcceptedChange(e.target.checked)}
                  disabled={pageState === "saving"}
                  className={styles.checkbox}
                />
                <span>I have read and accept the Community Guidelines</span>
              </label>

              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}

              <button
                className={styles.submitButton}
                type="submit"
                disabled={!building || !guidelinesAccepted || pageState === "saving"}
              >
                {pageState === "saving" ? "Saving..." : "Continue"}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
