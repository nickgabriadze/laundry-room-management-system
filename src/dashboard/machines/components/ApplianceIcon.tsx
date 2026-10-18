import type { MachineType } from "@/src/dataconnect-generated";
import styles from "./ApplianceIcon.module.css";

export function ApplianceIcon({
  type,
  isInUse,
}: {
  type: MachineType;
  isInUse: boolean;
}) {
  const kind = type === "WASHER" ? "Washer" : "Dryer";

  return (
    <div
      aria-label={`${kind}, ${isInUse ? "in use" : "available"}`}
      className={`${styles.appliance} ${type === "DRYER" ? styles.dryer : styles.washer} ${isInUse ? styles.inUse : ""}`}
      role="img"
    >
      <div className={styles.controlPanel}>
        <span className={styles.controlDisplay} />
        <span className={styles.controlKnob} />
        <span className={styles.controlDot} />
      </div>
      <div className={styles.drum}>
        {type === "WASHER" ? (
          <span className={styles.waterWave} />
        ) : (
          <span className={styles.dryerVents} />
        )}
      </div>
      <span className={styles.applianceFoot} />
    </div>
  );
}
