"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { QueryFetchPolicy } from "firebase/data-connect";
import { useRouter } from "next/navigation";
import { getFirebaseAuth } from "@/src/firebase";
import {
  getMachineActiveSessionOwner,
  getMyActiveMachineSession,
  listMachinesByBuilding,
} from "@/src/dataconnect-generated";
import type { GetMyActiveMachineSessionData } from "@/src/dataconnect-generated";
import { getCurrentUserProfile } from "@/src/user/profile";
import { ApplianceIcon } from "../components/ApplianceIcon";
import type { Machine } from "../components/MachineCard";
import {
  forceCancelMyMachineSessionById,
  MIN_SESSION_MINUTES,
  MAX_WASHER_SESSION_MINUTES,
  startMachineSession,
} from "../data/sessions";
import { ActiveMachineSession } from "./ActiveMachineSession";
import styles from "./MachinePage.module.css";
import { MachineSessionForm } from "./MachineSessionForm";
import { getMachineCodeMap } from "../utils/machineCodes";

type PageState =
  | "loading"
  | "ready"
  | "submitting"
  | "cancelling"
  | "error"
  | "not-found";
type ActiveSession = GetMyActiveMachineSessionData["laundryActivities"][number];

export function MachinePage({ machineCode }: { machineCode: string }) {
  const router = useRouter();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [myActiveSession, setMyActiveSession] = useState<ActiveSession | null>(
    null,
  );
  const [activeSessionEmail, setActiveSessionEmail] = useState("");
  const [hasOtherMachineOfTypeInUse, setHasOtherMachineOfTypeInUse] =
    useState(false);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [message, setMessage] = useState("");
  const [isMessageError, setIsMessageError] = useState(false);

  const loadMachine = useCallback(
    async (isActive: () => boolean) => {
      setPageState("loading");
      setMessage("");
      setMachine(null);
      setMyActiveSession(null);
      setActiveSessionEmail("");
      setHasOtherMachineOfTypeInUse(false);

      try {
        const profile = await getCurrentUserProfile();
        if (!isActive()) return;
        if (!profile) {
          router.replace(
            `/onboarding?redirect=${encodeURIComponent(`/machine/${machineCode}`)}`,
          );
          return;
        }

        const machinesResponse = await listMachinesByBuilding(
          { dormBuilding: profile.dormBuilding },
          { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
        );
        if (!isActive()) return;

        const availableMachines = machinesResponse.data.machines;
        const codesById = getMachineCodeMap(availableMachines);
        const foundMachine =
          availableMachines.find(
            (item) => codesById.get(item.id) === machineCode,
          ) ?? null;
        if (!foundMachine) {
          setPageState("not-found");
          return;
        }

        const currentUserUid = getFirebaseAuth().currentUser?.uid;
        setHasOtherMachineOfTypeInUse(
          availableMachines.some(
            (item) =>
              item.id !== foundMachine.id &&
              item.type === foundMachine.type &&
              item.activeSessions.some(
                (session) => session.user.uid === currentUserUid,
              ),
          ),
        );

        const sessionResponse = await getMyActiveMachineSession(
          { machineId: foundMachine.id },
          { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
        );
        if (!isActive()) return;

        const ownerResponse =
          foundMachine.activeSessions.length > 0
            ? await getMachineActiveSessionOwner(
                { machineId: foundMachine.id },
                { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
              )
            : null;
        if (!isActive()) return;

        setMachine(foundMachine);
        setMyActiveSession(sessionResponse.data.laundryActivities[0] ?? null);
        setActiveSessionEmail(
          ownerResponse?.data.laundryActivities[0]?.user.email ?? "",
        );
        setPageState("ready");
      } catch {
        if (!isActive()) return;
        setMessage("We couldn't load this machine. Please try again.");
        setPageState("error");
      }
    },
    [machineCode, router],
  );

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      if (!user) {
        router.replace(
          `/signin?redirect=${encodeURIComponent(`/machine/${machineCode}`)}`,
        );
        return;
      }
      void loadMachine(() => active);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [loadMachine, machineCode, router]);

  async function handleStartSession(duration: string) {
    if (!machine || machine.activeSessions.length > 0) return;

    const currentUser = getFirebaseAuth().currentUser;
    if (!currentUser) {
      router.replace(
        `/signin?redirect=${encodeURIComponent(`/machine/${machineCode}`)}`,
      );
      return;
    }

    const durationMinutes = Number(duration);
    if (
      !Number.isSafeInteger(durationMinutes) ||
      durationMinutes < MIN_SESSION_MINUTES
    ) {
      setMessage(`Enter at least ${MIN_SESSION_MINUTES} whole minutes.`);
      setIsMessageError(true);
      return;
    }
    if (
      machine.type === "WASHER" &&
      durationMinutes > MAX_WASHER_SESSION_MINUTES
    ) {
      setMessage("Washer cycles can be up to 120 minutes.");
      setIsMessageError(true);
      return;
    }

    setPageState("submitting");
    setMessage("");
    setIsMessageError(false);

    try {
      const session = await startMachineSession(
        machine.id,
        durationMinutes,
        machine.type,
        machineCode,
      );
      setMachine({
        ...machine,
        activeSessions: [
          {
            id: session.activityId,
            endsAt: session.endsAt,
            user: { uid: currentUser.uid },
          },
        ],
      });
      setMyActiveSession({
        id: session.activityId,
        endsAt: session.endsAt,
        scheduledReminderEmailId: session.scheduledReminderEmailId,
      });
      setActiveSessionEmail(currentUser.email ?? "");
      setMessage(
        session.reminderStatus === "failed"
          ? `Your laundry machine is expected to finish at ${new Date(session.endsAt).toLocaleString()}, but we couldn't schedule the 10-minute reminder email.`
          : session.reminderStatus === "scheduled"
            ? `Your laundry machine is expected to finish at ${new Date(session.endsAt).toLocaleString()}. We'll email you 10 minutes before it finishes.`
            : `Your laundry machine is expected to finish at ${new Date(session.endsAt).toLocaleString()}.`,
      );
      setIsMessageError(session.reminderStatus === "failed");
      setPageState("ready");
    } catch {
      const machineType = machine.type === "WASHER" ? "washer" : "dryer";
      setMessage(
        `We couldn't occupy this machine. It may have been taken, or you may already have another ${machineType} in use. Refresh and try again.`,
      );
      setIsMessageError(true);
      setPageState("ready");
    }
  }

  async function handleForceCancel() {
    if (!machine || !myActiveSession) return false;

    setPageState("cancelling");
    setMessage("");
    setIsMessageError(false);

    try {
      const cancellation = await forceCancelMyMachineSessionById(
        machine.id,
        myActiveSession.id,
        myActiveSession.scheduledReminderEmailId,
      );
      setMachine((currentMachine) =>
        currentMachine
          ? {
              ...currentMachine,
              activeSessions: currentMachine.activeSessions.filter(
                (session) => session.id !== myActiveSession.id,
              ),
            }
          : currentMachine,
      );
      setMyActiveSession(null);
      setActiveSessionEmail("");
      setMessage(
        cancellation.remindersCancelled
          ? "The machine was stopped and is now available."
          : "The machine was stopped and is now available, but we couldn't cancel the scheduled reminder email.",
      );
      setIsMessageError(!cancellation.remindersCancelled);
      setPageState("ready");
      return true;
    } catch {
      setMessage(
        "We couldn't stop the machine. It may have already finished; refresh and check its status.",
      );
      setIsMessageError(true);
      setPageState("ready");
      return false;
    }
  }

  const isBusy = pageState === "submitting" || pageState === "cancelling";
  const isOccupied = (machine?.activeSessions.length ?? 0) > 0;
  const activeSession = machine?.activeSessions[0];

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link className={styles.backLink} href="/">
          Back to laundry room
        </Link>
      </header>

      <section className={styles.panel} aria-labelledby="machine-title">
        {pageState === "loading" && (
          <p className={styles.message} role="status">
            Loading machine...
          </p>
        )}

        {pageState === "error" && (
          <div className={styles.message} role="alert">
            <p>{message}</p>
            <button
              className={styles.secondaryButton}
              onClick={() => void loadMachine(() => true)}
              type="button"
            >
              Try again
            </button>
          </div>
        )}

        {pageState === "not-found" && (
          <div className={styles.message} role="alert">
            <h1 id="machine-title">Machine not found</h1>
            <p>This machine is not listed for your dorm building.</p>
          </div>
        )}

        {machine && pageState !== "loading" && pageState !== "error" && (
          <>
            <p className={styles.eyebrow}>Laundry room</p>
            <p className={styles.machineCode}>{machineCode}</p>
            <h1 id="machine-title">
              {machine.type === "WASHER" ? "Washer" : "Dryer"}
            </h1>
            <div
              className={`${styles.applianceArea} ${isOccupied ? styles.applianceAreaOccupied : ""}`}
            >
              <ApplianceIcon type={machine.type} isInUse={isOccupied} />
            </div>

            {isOccupied && activeSession ? (
              <ActiveMachineSession
                activeSession={activeSession}
                activeSessionEmail={activeSessionEmail}
                busy={isBusy}
                hasOtherMachineOfTypeInUse={hasOtherMachineOfTypeInUse}
                machine={machine}
                myActiveSession={myActiveSession}
                onBeginCancel={() => {
                  setMessage("");
                  setIsMessageError(false);
                }}
                onForceCancel={handleForceCancel}
              />
            ) : (
              <MachineSessionForm
                busy={isBusy}
                hasOtherMachineOfTypeInUse={hasOtherMachineOfTypeInUse}
                machine={machine}
                onInputChange={() => {
                  setMessage("");
                  setIsMessageError(false);
                }}
                onStart={handleStartSession}
              />
            )}

            {message && (
              <p
                className={isMessageError ? styles.error : styles.success}
                role={isMessageError ? "alert" : "status"}
              >
                {message}
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
