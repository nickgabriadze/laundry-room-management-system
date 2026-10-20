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
  getMachinePreviousSessionOwner,
} from "@/src/dataconnect-generated";
import type { GetMyActiveMachineSessionData } from "@/src/dataconnect-generated";
import { getCurrentUserProfile } from "@/src/user/profile";
import type { Machine } from "../components/MachineCard";
import {
  forceCancelMyMachineSessionById,
  MIN_SESSION_MINUTES,
  MAX_WASHER_SESSION_MINUTES,
  startMachineSession,
} from "../data/sessions";
import styles from "./MachinePage.module.css";
import { getMachineCodeMap } from "../utils/machineCodes";
import { MachinePageLoading } from "./components/MachinePageLoading";
import { MachinePageError } from "./components/MachinePageError";
import { MachinePageNotFound } from "./components/MachinePageNotFound";
import { MachinePageContent } from "./components/MachinePageContent";

type PageState =
  | "loading"
  | "ready"
  | "submitting"
  | "cancelling"
  | "error"
  | "not-found";
type ActiveSession = GetMyActiveMachineSessionData["laundryActivities"][number];

export function MachinePage({
  machineCode,
  readOnly = false,
  qrToken,
}: {
  machineCode: string;
  readOnly?: boolean;
  qrToken?: string;
}) {
  const router = useRouter();
  // If no qrToken provided, automatically set readOnly mode
  const isReadOnly = !qrToken || readOnly;
  const [machine, setMachine] = useState<Machine | null>(null);
  const [myActiveSession, setMyActiveSession] = useState<ActiveSession | null>(
    null,
  );
  const [activeSessionEmail, setActiveSessionEmail] = useState("");
  const [previousSessionEmail, setPreviousSessionEmail] = useState("");
  const [previousSessionEndTime, setPreviousSessionEndTime] = useState<string>("");
  const [hasOtherMachineOfTypeInUse, setHasOtherMachineOfTypeInUse] =
    useState(false);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [message, setMessage] = useState("");
  const [isMessageError, setIsMessageError] = useState(false);
  const [tokenValid, setTokenValid] = useState(!!qrToken);

  const loadMachine = useCallback(
    async (isActive: () => boolean) => {
      setPageState("loading");
      setMessage("");
      setMachine(null);
      setMyActiveSession(null);
      setActiveSessionEmail("");
      setPreviousSessionEmail("");
      setPreviousSessionEndTime("");
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

        const previousOwnerResponse = await getMachinePreviousSessionOwner(
          { machineId: foundMachine.id },
          { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
        );
        if (!isActive()) return;

        setMachine(foundMachine);
        setMyActiveSession(sessionResponse.data.laundryActivities[0] ?? null);
        setActiveSessionEmail(
          ownerResponse?.data.laundryActivities[0]?.user.email ?? "",
        );
        setPreviousSessionEmail(
          previousOwnerResponse?.data.laundryActivities[0]?.user.email ?? "",
        );
        setPreviousSessionEndTime(
          previousOwnerResponse?.data.laundryActivities[0]?.endsAt ?? "",
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

      if (qrToken) {
        import("@/src/lib/jwt-utils").then(({ validateToken }) => {
          const isValid = validateToken(qrToken, machineCode);
          if (!isValid) {
            if (active) {
              setTokenValid(false);
              setMessage("Either machine was not found or you should scan the QR code once again.");
              setIsMessageError(true);
            }
            // Still load machine data even with invalid token, so we can show the error message
            void loadMachine(() => active);
            return;
          }
          if (active) {
            setTokenValid(true);
            void loadMachine(() => active);
          }
        });
      } else {
        void loadMachine(() => active);
      }
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
        cancellation.reminderStatus === "queued"
          ? "The machine was stopped and is now available. A reminder email may be on its way, check your inbox if you receive it."
          : cancellation.reminderStatus === "already-sent"
            ? "The machine was stopped and is now available. The 10-minute reminder email was already sent, you can ignore it."
            : cancellation.remindersCancelled
              ? "The machine was stopped and is now available."
              : "The machine was stopped and is now available, but we couldn't cancel the scheduled reminder email.",
      );
      setIsMessageError(
        !cancellation.remindersCancelled ||
          cancellation.reminderStatus === "queued",
      );
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
        {pageState === "loading" && <MachinePageLoading />}

        {pageState === "error" && (
          <MachinePageError
            message={message}
            onRetry={() => void loadMachine(() => true)}
          />
        )}

        {pageState === "not-found" && <MachinePageNotFound />}

        {machine && pageState !== "loading" && pageState !== "error" && (
          <MachinePageContent
            machineCode={machineCode}
            machine={machine}
            isOccupied={isOccupied}
            activeSession={activeSession}
            activeSessionEmail={activeSessionEmail}
            previousSessionEmail={previousSessionEmail}
            previousSessionEndTime={previousSessionEndTime}
            myActiveSession={myActiveSession}
            hasOtherMachineOfTypeInUse={hasOtherMachineOfTypeInUse}
            isBusy={isBusy}
            isReadOnly={isReadOnly}
            tokenValid={tokenValid}
            message={message}
            isMessageError={isMessageError}
            onBeginCancel={() => {
              setMessage("");
              setIsMessageError(false);
            }}
            onForceCancel={handleForceCancel}
            onInputChange={() => {
              setMessage("");
              setIsMessageError(false);
            }}
            onStart={handleStartSession}
          />
        )}
      </section>
    </main>
  );
}
