"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/src/firebase";
import { BUILDINGS, type BuildingSelection } from "@/src/user/buildings";
import {
  getBuildingChangeAvailableAt,
  getCurrentUserProfile,
  updateCurrentUserBuilding,
} from "@/src/user/profile";
import styles from "./profile.module.css";

type PageState = "loading" | "ready" | "saving" | "error";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [greetingName, setGreetingName] = useState("there");
  const [building, setBuilding] = useState<BuildingSelection>("");
  const [savedBuilding, setSavedBuilding] = useState<BuildingSelection>("");
  const [buildingUpdatedAt, setBuildingUpdatedAt] = useState<string | null>(
    null,
  );
  const [pageState, setPageState] = useState<PageState>("loading");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/signin");
        return;
      }

      setGreetingName(
        user.displayName?.trim() || user.email?.split("@")[0] || "there",
      );

      void (async () => {
        try {
          const account = await getCurrentUserProfile();
          if (!active) return;

          if (!account) {
            router.replace("/onboarding");
            return;
          }

          setEmail(account.email);
          setBuilding(account.dormBuilding);
          setSavedBuilding(account.dormBuilding);
          setBuildingUpdatedAt(account.buildingUpdatedAt ?? null);
          setPageState("ready");
        } catch {
          if (!active) return;
          setMessage("We couldn't load your profile. Please try again.");
          setIsError(true);
          setPageState("error");
        }
      })();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [router]);

  const changeAvailableAt = getBuildingChangeAvailableAt(buildingUpdatedAt);
  const isBuildingChangeLocked =
    changeAvailableAt !== null && changeAvailableAt > Date.now();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!building || building === savedBuilding || isBuildingChangeLocked)
      return;

    setPageState("saving");
    setMessage("");
    setIsError(false);

    try {
      const wasUpdated = await updateCurrentUserBuilding(building);
      if (!wasUpdated) {
        const account = await getCurrentUserProfile();
        if (account?.buildingUpdatedAt) {
          setBuildingUpdatedAt(account.buildingUpdatedAt);
        }
        setMessage("You can change your dorm building once every 30 days.");
        setIsError(true);
        setPageState("ready");
        return;
      }

      setSavedBuilding(building);
      const updatedProfile = await getCurrentUserProfile().catch(() => null);
      setBuildingUpdatedAt(
        updatedProfile?.buildingUpdatedAt ?? new Date().toISOString(),
      );
      setMessage("Your building has been updated.");
      setPageState("ready");
    } catch {
      setMessage("We couldn't update your building. Please try again.");
      setIsError(true);
      setPageState("ready");
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link className={styles.backLink} href="/">
          Back to dashboard
        </Link>
      </header>

      <section className={styles.profile} aria-labelledby="profile-title">
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
          <form className={styles.form} onSubmit={handleSubmit}>
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
                      setBuilding(option.value);
                      setMessage("");
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
