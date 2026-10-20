import styles from "../MachinePage.module.css";

export function MachinePageError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className={styles.message} role="alert">
      <p>{message}</p>
      <button
        className={styles.secondaryButton}
        onClick={onRetry}
        type="button"
      >
        Try again
      </button>
    </div>
  );
}
