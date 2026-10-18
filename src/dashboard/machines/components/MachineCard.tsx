import Link from "next/link";
import type { ListMachinesByBuildingData } from "@/src/dataconnect-generated";
import { ApplianceIcon } from "./ApplianceIcon";
import { MachineAvailabilityTime } from "./MachineAvailabilityTime";
import styles from "./MachineCard.module.css";

export type Machine = ListMachinesByBuildingData["machines"][number];

export function MachineCard({
  machine,
  machineCode,
}: {
  machine: Machine;
  machineCode: string;
}) {
  const isInUse = machine.activeSessions.length > 0;
  const kind = machine.type === "WASHER" ? "Washer" : "Dryer";
  const activeSession = machine.activeSessions[0];

  return (
    <li
      className={`${styles.machineCard} ${isInUse ? styles.inUse : styles.available}`}
    >
      <Link className={styles.cardLink} href={`/machine/${machineCode}`}>
        <div className={styles.cardTopline}>
          <span className={styles.machineId}>{machineCode}</span>
          <span className={styles.status}>
            <i aria-hidden="true" />
            {isInUse ? "In use" : "Available"}
          </span>
        </div>

        <div className={styles.applianceArea}>
          <ApplianceIcon type={machine.type} isInUse={isInUse} />
        </div>

        <div className={styles.cardFooter}>
          <h2>{kind}</h2>
          <span>{isInUse ? "View session" : "Select a duration"}</span>
          {activeSession && (
            <MachineAvailabilityTime endsAt={activeSession.endsAt} />
          )}
        </div>
      </Link>
    </li>
  );
}
