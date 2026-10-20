import styles from "../MachinePage.module.css";

export function MachinePageLoading() {
  return (
    <p className={styles.message} role="status">
      Loading machine...
    </p>
  );
}
