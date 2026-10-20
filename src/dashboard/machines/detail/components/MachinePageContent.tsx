import { ApplianceIcon } from "@/src/dashboard/machines/components/ApplianceIcon";
import type { Machine } from "@/src/dashboard/machines/components/MachineCard";
import { ActiveMachineSession } from "../ActiveMachineSession";
import { MachineSessionForm } from "../MachineSessionForm";
import { PreviousMachineUser } from "../PreviousMachineUser";
import styles from "../MachinePage.module.css";
import type { GetMyActiveMachineSessionData } from "@/src/dataconnect-generated";

type ActiveSession = GetMyActiveMachineSessionData["laundryActivities"][number];

export function MachinePageContent({
  machineCode,
  machine,
  isOccupied,
  activeSession,
  activeSessionEmail,
  previousSessionEmail,
  previousSessionEndTime,
  myActiveSession,
  hasOtherMachineOfTypeInUse,
  isBusy,
  isReadOnly,
  tokenValid,
  message,
  isMessageError,
  onBeginCancel,
  onForceCancel,
  onInputChange,
  onStart,
}: {
  machineCode: string;
  machine: Machine;
  isOccupied: boolean;
  activeSession: ActiveSession | null | undefined;
  activeSessionEmail: string;
  previousSessionEmail: string;
  previousSessionEndTime: string;
  myActiveSession: ActiveSession | null;
  hasOtherMachineOfTypeInUse: boolean;
  isBusy: boolean;
  isReadOnly: boolean;
  tokenValid: boolean;
  message: string;
  isMessageError: boolean;
  onBeginCancel: () => void;
  onForceCancel: () => void;
  onInputChange: () => void;
  onStart: (duration: string) => void;
}) {
  return (
    <>
      <p className={styles.eyebrow}>Laundry room</p>
      <p className={styles.machineCode}>#{machineCode}</p>
      <h1 id="machine-title">
        {machine.type === "WASHER" ? "Washer" : "Dryer"}
      </h1>

      {!isOccupied && previousSessionEmail && (
        <PreviousMachineUser
          previousSessionEmail={previousSessionEmail}
          previousSessionEndTime={previousSessionEndTime}
        />
      )}

      <div
        className={`${styles.applianceArea} ${isOccupied ? styles.applianceAreaOccupied : ""}`}
      >
        <ApplianceIcon type={machine.type} isInUse={isOccupied} />
      </div>

      {isOccupied && activeSession ? (
        <ActiveMachineSession
          activeSession={activeSession as NonNullable<Machine["activeSessions"][number]>}
          activeSessionEmail={activeSessionEmail}
          busy={isBusy}
          hasOtherMachineOfTypeInUse={hasOtherMachineOfTypeInUse}
          machine={machine}
          myActiveSession={myActiveSession}
          onBeginCancel={onBeginCancel}
          onForceCancel={onForceCancel as () => Promise<boolean>}
        />
      ) : !isReadOnly && tokenValid ? (
        <MachineSessionForm
          busy={isBusy}
          hasOtherMachineOfTypeInUse={hasOtherMachineOfTypeInUse}
          machine={machine}
          onInputChange={onInputChange}
          onStart={onStart as (duration: string) => Promise<void>}
        />
      ) : isReadOnly ? (
        <div className={styles.message}>
          <p>To start a session, go to the laundry room and scan the QR code on the machine.</p>
        </div>
      ) : (
        <div className={styles.message}>
          <p>Scan the QR code on the machine to start a session.</p>
        </div>
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
  );
}
