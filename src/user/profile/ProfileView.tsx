"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { BUILDINGS, type BuildingSelection } from "@/src/user/buildings";
import styles from "./profile.module.css";

type ProfileViewProps = {
  email: string;
  greetingName: string;
  building: BuildingSelection;
  savedBuilding: BuildingSelection;
  pageState: "loading" | "ready" | "saving" | "error";
  message: string;
  isError: boolean;
  isAuthenticated: boolean;
  isSigningOut: boolean;
  logoutError: string;
  changeAvailableAt: number | null;
  isBuildingChangeLocked: boolean;
  onBuildingChange: (building: BuildingSelection) => void;
  onMessageClear: () => void;
  onSignOut: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ProfileView({
  email,
  greetingName,
  building,
  savedBuilding,
  pageState,
  message,
  isError,
  isAuthenticated,
  isSigningOut,
  logoutError,
  changeAvailableAt,
  isBuildingChangeLocked,
  onBuildingChange,
  onMessageClear,
  onSignOut,
  onSubmit,
}: ProfileViewProps) {
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link className={styles.backLink} href="/">
          Back to dashboard
        </Link>
        {isAuthenticated && (
          <button
            className={styles.signOutButton}
            disabled={isSigningOut}
            onClick={onSignOut}
            type="button"
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
        )}
      </header>

      <section className={styles.profile} aria-labelledby="profile-title">
        {logoutError && (
          <p className={styles.error} role="alert">
            {logoutError}
          </p>
        )}
        <div className={styles.heading}>
          <p className={styles.eyebrow}>Resident profile</p>
          <h1 id="profile-title">Hello, {greetingName}</h1>
          {email && <p className={styles.email}>{email}</p>}
        </div>

        {pageState === "loading" && (
          <p className={styles.status} role="status">
            Loading your profile...
          </p>
        )}

        {pageState === "error" && (
          <p className={styles.error} role="alert">
            {message}
          </p>
        )}

        {(pageState === "ready" || pageState === "saving") && (
          <form className={styles.form} onSubmit={onSubmit}>
            <fieldset
              className={styles.choiceGroup}
              disabled={pageState === "saving"}
            >
              <legend>Your building</legend>
              <div className={styles.buildings}>
                {BUILDINGS.map((option) => (
                  <button
                    aria-pressed={building === option.value}
                    className={styles.buildingChoice}
                    key={option.value}
                    onClick={() => {
                      onBuildingChange(option.value);
                      onMessageClear();
                    }}
                    type="button"
                  >
                    <span
                      aria-hidden="true"
                      className={styles.buildingDot}
                      data-building={option.value}
                    />
                    <span>{option.name}</span>
                  </button>
                ))}
              </div>
              <p className={styles.buildingNotice}>
                {isBuildingChangeLocked && changeAvailableAt !== null
                  ? `You can change your dorm building again on ${new Date(changeAvailableAt).toLocaleDateString()}.`
                  : "You can change your dorm building once every 30 days."}
              </p>
            </fieldset>

            <div className={styles.actions}>
              <button
                className={styles.saveButton}
                disabled={
                  !building ||
                  building === savedBuilding ||
                  isBuildingChangeLocked ||
                  pageState === "saving"
                }
                type="submit"
              >
                {pageState === "saving" ? "Saving..." : "Save changes"}
              </button>
              {message && (
                <p
                  className={isError ? styles.error : styles.success}
                  role="status"
                >
                  {message}
                </p>
              )}
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
