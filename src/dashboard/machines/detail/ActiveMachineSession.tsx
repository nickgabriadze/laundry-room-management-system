"use client";

import { useState } from "react";
import type { GetMyActiveMachineSessionData } from "@/src/dataconnect-generated";
import type { Machine } from "../components/MachineCard";
import styles from "./MachinePage.module.css";

type ActiveSession = GetMyActiveMachineSessionData["laundryActivities"][number];

export function ActiveMachineSession({
  machine,
  activeSession,
  activeSessionEmail,
  myActiveSession,
  hasOtherMachineOfTypeInUse,
  busy,
  onBeginCancel,
  onForceCancel,
}: {
  machine: Machine;
  activeSession: NonNullable<Machine["activeSessions"][number]>;
  activeSessionEmail: string;
  myActiveSession: ActiveSession | null;
  hasOtherMachineOfTypeInUse: boolean;
  busy: boolean;
  onBeginCancel: () => void;
  onForceCancel: () => Promise<boolean>;
}) {
  const [confirmationStep, setConfirmationStep] = useState(0);
  const machineType = machine.type === "WASHER" ? "washer" : "dryer";

  return (
    <>
      <div className={styles.occupied} role="status">
        <h2>This machine is in use</h2>
        <p>
          This machine is expected to finish at{" "}
          <time dateTime={activeSession.endsAt}>
            {new Date(activeSession.endsAt).toLocaleString()}
          </time>
          .
        </p>
        {activeSessionEmail && (
          <p>
            In use by{" "}
            <a href={`mailto:${activeSessionEmail}`}>{activeSessionEmail}</a>
          </p>
        )}
      </div>

      {myActiveSession && (
        <div className={styles.cancelSection}>
          {confirmationStep === 0 ? (
            <button
              className={styles.forceCancelButton}
              disabled={busy}
              onClick={() => {
                onBeginCancel();
                setConfirmationStep(1);
              }}
              type="button"
            >
              Force stop my machine
            </button>
          ) : hasOtherMachineOfTypeInUse ? (
            <div className={styles.occupied} role="status">
              <h2>
                You already have a {machineType} in use
              </h2>
              <p>
                Wait for or stop your current{" "}
                {machineType}.
              </p>
            </div>
          ) : (
            <div
              aria-labelledby="cancel-confirmation-title"
              className={styles.confirmation}
              role="group"
            >
              <h2 id="cancel-confirmation-title">
                {confirmationStep === 1
                  ? "Are you sure you want to cancel?"
                  : "Confirm force cancel"}
              </h2>
              <p>
                {confirmationStep === 1
                  ? "The machine will stop immediately, even if its cycle has already started."
                  : "This cannot be undone. The machine will be made available to other students immediately."}
              </p>
              <div className={styles.confirmationActions}>
                <button
                  className={styles.secondaryButton}
                  disabled={busy}
                  onClick={() => setConfirmationStep(0)}
                  type="button"
                >
                  Keep machine running
                </button>
                <button
                  className={styles.forceCancelButton}
                  disabled={busy}
                  onClick={() => {
                    if (confirmationStep === 1) {
                      setConfirmationStep(2);
                    } else {
                      void onForceCancel().then((cancelled) => {
                        if (!cancelled) setConfirmationStep(0);
                      });
                    }
                  }}
                  type="button"
                >
                  {confirmationStep === 1
                    ? "Continue"
                    : busy
                      ? "Cancelling..."
                      : "Yes, force cancel"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
