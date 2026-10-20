import styles from "../MachinePage.module.css";

export function MachinePageNotFound() {
  return (
    <div className={styles.message} role="alert">
      <h1 id="machine-title">Machine not found</h1>
      <p>This machine is not listed for your dorm building.</p>
    </div>
  );
}
