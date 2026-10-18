"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { Machine } from "../components/MachineCard";
import {
  MAX_WASHER_SESSION_MINUTES,
  MIN_SESSION_MINUTES,
} from "../data/sessions";
import styles from "./MachinePage.module.css";

export function MachineSessionForm({
  machine,
  busy,
  hasOtherMachineOfTypeInUse,
  onStart,
  onInputChange,
}: {
  machine: Machine;
  busy: boolean;
  hasOtherMachineOfTypeInUse: boolean;
  onStart: (duration: string) => Promise<void>;
  onInputChange: () => void;
}) {
  const [duration, setDuration] = useState("");
  const [showOtherMachineWarning, setShowOtherMachineWarning] = useState(false);
  const machineType = machine.type === "WASHER" ? "washer" : "dryer";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (machine.activeSessions.length > 0) return;

    if (hasOtherMachineOfTypeInUse) {
      setShowOtherMachineWarning(true);
      return;
    }

    setShowOtherMachineWarning(false);
    await onStart(duration);
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.durationLabel} htmlFor="duration">
          How many minutes are shown on the laundry machine?
        </label>
        <input
          autoComplete="off"
          className={styles.durationInput}
          id="duration"
          min={MIN_SESSION_MINUTES}
          max={
            machine.type === "WASHER"
              ? MAX_WASHER_SESSION_MINUTES
              : undefined
          }
          onChange={(event) => {
            setDuration(event.target.value);
            setShowOtherMachineWarning(false);
            onInputChange();
          }}
          required
          step="1"
          type="number"
          value={duration}
        />
        <p className={styles.hint}>
          Enter a whole number of minutes (minimum {MIN_SESSION_MINUTES}
          {machine.type === "WASHER"
            ? `, maximum ${MAX_WASHER_SESSION_MINUTES}`
            : ""}
          ). Enter the displayed time in minutes. The machine becomes available
          when its cycle finishes.
        </p>
        <aside className={styles.reminderNotice} role="note">
          <span aria-hidden="true" className={styles.reminderBadge}>
            10 min
          </span>
          <span>
            <strong>Email reminder</strong>
            <span className={styles.reminderDescription}>
              We'll email you 10 minutes before your laundry machine finishes working.
            </span>
          </span>
        </aside>
        <button
          className={styles.primaryButton}
          disabled={busy || duration.length === 0}
          type="submit"
        >
          {busy ? "Starting machine..." : "Start machine"}
        </button>
      </form>

      {showOtherMachineWarning && (
        <div className={styles.occupied} role="alert">
          <h2>You already have a {machineType} in use</h2>
          <p>
            Wait for or stop your current{" "}
            {machineType}.
          </p>
        </div>
      )}
    </>
  );
}
