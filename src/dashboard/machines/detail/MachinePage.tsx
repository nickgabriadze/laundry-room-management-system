"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { QueryFetchPolicy } from "firebase/data-connect";
import { useRouter } from "next/navigation";
import { auth } from "@/src/firebase";
import {
  getMyActiveMachineSession,
  listMachinesByBuilding,
} from "@/src/dataconnect-generated";
import type { GetMyActiveMachineSessionData } from "@/src/dataconnect-generated";
import { getCurrentUserProfile } from "@/src/user/profile";
import { ApplianceIcon } from "../components/ApplianceIcon";
import type { Machine } from "../components/MachineCard";
import { getMachineCodeMap } from "../utils/machineCodes";
import {
  forceCancelMyMachineSessionById,
  MAX_WASHER_SESSION_MINUTES,
  startMachineSession,
} from "../data/sessions";
import styles from "./MachinePage.module.css";

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
  const [duration, setDuration] = useState("");
  const [cancelConfirmationStep, setCancelConfirmationStep] = useState(0);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [message, setMessage] = useState("");
  const [isMessageError, setIsMessageError] = useState(false);

  const loadMachine = useCallback(
    async (isActive: () => boolean) => {
      setPageState("loading");
      setMessage("");
      setMachine(null);
      setMyActiveSession(null);

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
          setMachine(null);
          setPageState("not-found");
          return;
        }

        const sessionResponse = await getMyActiveMachineSession(
          { machineId: foundMachine.id },
          { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
        );
        if (!isActive()) return;

        setMachine(foundMachine);
        setMyActiveSession(sessionResponse.data.laundryActivities[0] ?? null);
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

    const unsubscribe = onAuthStateChanged(auth, (user) => {
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!machine || machine.activeSessions.length > 0) return;

    const durationMinutes = Number(duration);
    if (!Number.isSafeInteger(durationMinutes) || durationMinutes < 1) {
      setMessage("Enter a whole number of minutes greater than zero.");
      setIsMessageError(true);
      return;
    }
    if (
      machine.type === "WASHER" &&
      durationMinutes > MAX_WASHER_SESSION_MINUTES
    ) {
      setMessage("Washer sessions can be up to 120 minutes.");
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
      );
      setMachine({
        ...machine,
        activeSessions: [
          { id: session.activityId, endsAt: session.endsAt },
        ],
      });
      setMyActiveSession({ id: session.activityId, endsAt: session.endsAt });
      setMessage(
        `Your session is active until ${new Date(session.endsAt).toLocaleString()}.`,
      );
      setIsMessageError(false);
      setPageState("ready");
    } catch {
      setMessage(
        "We couldn't occupy this machine. It may have been taken; refresh and try again.",
      );
      setIsMessageError(true);
      setPageState("ready");
    }
  }

  async function handleForceCancel() {
    if (!machine || !myActiveSession) return;

    setPageState("cancelling");
    setMessage("");
    setIsMessageError(false);

    try {
      await forceCancelMyMachineSessionById(machine.id);
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
      setCancelConfirmationStep(0);
      setMessage("Your session was cancelled. The machine is now available.");
      setPageState("ready");
    } catch {
      setMessage(
        "We couldn't cancel your session. It may have already ended; refresh and check the machine status.",
      );
      setIsMessageError(true);
      setCancelConfirmationStep(0);
      setPageState("ready");
    }
  }

  const isOccupied = (machine?.activeSessions.length ?? 0) > 0;
  const machineType =
    machine?.type === "WASHER" ? "Washer" : "Dryer";
  const activeSession = machine?.activeSessions[0];
  const isBusy = pageState === "submitting" || pageState === "cancelling";

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

        {machine &&
          (pageState === "ready" ||
            pageState === "submitting" ||
            pageState === "cancelling") && (
          <>
            <p className={styles.eyebrow}>Laundry room</p>
            <p className={styles.machineCode}>{machineCode}</p>
            <h1 id="machine-title">{machineType}</h1>
            <div
              className={`${styles.applianceArea} ${isOccupied ? styles.applianceAreaOccupied : ""}`}
            >
              <ApplianceIcon type={machine.type} isInUse={isOccupied} />
            </div>

            {isOccupied && activeSession ? (
              <>
                <div className={styles.occupied} role="status">
                  <h2>This machine is in use</h2>
                  <p>
                    It will become available{" "}
                    <time dateTime={activeSession.endsAt}>
                      {new Date(activeSession.endsAt).toLocaleString()}
                    </time>
                    .
                  </p>
                </div>
                {myActiveSession && (
                  <div className={styles.cancelSection}>
                    {cancelConfirmationStep === 0 ? (
                      <button
                        className={styles.forceCancelButton}
                        disabled={isBusy}
                        onClick={() => {
                          setMessage("");
                          setCancelConfirmationStep(1);
                        }}
                        type="button"
                      >
                        Force cancel my session
                      </button>
                    ) : (
                      <div
                        aria-labelledby="cancel-confirmation-title"
                        className={styles.confirmation}
                        role="group"
                      >
                        <h2 id="cancel-confirmation-title">
                          {cancelConfirmationStep === 1
                            ? "Are you sure you want to cancel?"
                            : "Confirm force cancel"}
                        </h2>
                        <p>
                          {cancelConfirmationStep === 1
                            ? "Your session will end immediately, even if the machine has already started."
                            : "This cannot be undone. The machine will be made available to other students immediately."}
                        </p>
                        <div className={styles.confirmationActions}>
                          <button
                            className={styles.secondaryButton}
                            disabled={isBusy}
                            onClick={() => setCancelConfirmationStep(0)}
                            type="button"
                          >
                            Keep my session
                          </button>
                          <button
                            className={styles.forceCancelButton}
                            disabled={isBusy}
                            onClick={() => {
                              if (cancelConfirmationStep === 1) {
                                setCancelConfirmationStep(2);
                              } else {
                                void handleForceCancel();
                              }
                            }}
                            type="button"
                          >
                            {cancelConfirmationStep === 1
                              ? "Continue"
                              : pageState === "cancelling"
                                ? "Cancelling..."
                                : "Yes, force cancel"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.durationLabel} htmlFor="duration">
                  How many minutes would you like to use it?
                </label>
                <input
                  autoComplete="off"
                  className={styles.durationInput}
                  id="duration"
                  min="1"
                  max={
                    machine.type === "WASHER"
                      ? MAX_WASHER_SESSION_MINUTES
                      : undefined
                  }
                  onChange={(event) => {
                    setDuration(event.target.value);
                    setMessage("");
                    setIsMessageError(false);
                  }}
                  required
                  step="1"
                  type="number"
                  value={duration}
                />
                <p className={styles.hint}>
                  Enter a whole number of minutes
                  {machine.type === "WASHER"
                    ? ` (maximum ${MAX_WASHER_SESSION_MINUTES})`
                    : ""}
                  . The machine becomes available automatically when the
                  session ends.
                </p>
                <button
                  className={styles.primaryButton}
                  disabled={isBusy || duration.length === 0}
                  type="submit"
                >
                  {pageState === "submitting"
                    ? "Starting session..."
                    : "Use this machine"}
                </button>
              </form>
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
