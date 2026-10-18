"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/src/firebase";
import { type BuildingSelection } from "@/src/user/buildings";
import {
  getBuildingChangeAvailableAt,
  getCurrentUserProfile,
  updateCurrentUserBuilding,
} from "@/src/user/profile";

type PageState = "loading" | "ready" | "saving" | "error";

export function useProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [greetingName, setGreetingName] = useState("there");
  const [building, setBuilding] = useState<BuildingSelection>("");
  const [savedBuilding, setSavedBuilding] = useState<BuildingSelection>("");
  const [buildingUpdatedAt, setBuildingUpdatedAt] = useState<string | null>(null);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/signin");
        return;
      }

      setIsAuthenticated(true);
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

  async function signOutUser() {
    setIsSigningOut(true);
    setLogoutError("");

    try {
      await signOut(auth);
      router.replace("/signin");
    } catch {
      setLogoutError("We couldn't sign you out. Please try again.");
      setIsSigningOut(false);
    }
  }

  const changeAvailableAt = getBuildingChangeAvailableAt(buildingUpdatedAt);
  const isBuildingChangeLocked =
    changeAvailableAt !== null && changeAvailableAt > Date.now();

  async function submit(event: FormEvent<HTMLFormElement>) {
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

  return {
    email,
    greetingName,
    building,
    setBuilding,
    savedBuilding,
    pageState,
    message,
    setMessage,
    isError,
    isAuthenticated,
    isSigningOut,
    logoutError,
    changeAvailableAt,
    isBuildingChangeLocked,
    signOutUser,
    submit,
  };
}
