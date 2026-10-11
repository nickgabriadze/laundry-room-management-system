import type { ListMachinesByBuildingData } from "@/src/dataconnect-generated";
import { ApplianceIcon } from "./ApplianceIcon";
import styles from "./Machine.module.css";

export type Machine = ListMachinesByBuildingData["machines"][number];

export function MachineCard({
  machine,
  label,
}: {
  machine: Machine;
  label: string;
}) {
  const isInUse =true;
  const kind = machine.type === "WASHER" ? "Washer" : "Dryer";

  return (
    <li
      className={`${styles.machineCard} ${isInUse ? styles.inUse : styles.available}`}
    >
      <div className={styles.cardTopline}>
        <span className={styles.machineId}>{label}</span>
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
        <span>{isInUse ? "Running" : "Ready for a load"}</span>
      </div>
    </li>
  );
}
