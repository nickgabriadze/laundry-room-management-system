"use client";

import styles from "./MachinePage.module.css";

export function PreviousMachineUser({
  previousSessionEmail,
  previousSessionEndTime,
}: {
  previousSessionEmail: string;
  previousSessionEndTime: string;
}) {
  if (!previousSessionEmail) {
    return null;
  }

  return (
    <div className={styles.previousUser} role="region" aria-label="Previous machine user">
      <h2>Previously used by</h2>
      <p>
        <a href={`mailto:${previousSessionEmail}`}>{previousSessionEmail}</a>
      </p>
      {previousSessionEndTime && (
        <p className={styles.smallText}>
          Finished at{" "}
          <time dateTime={previousSessionEndTime}>
            {new Date(previousSessionEndTime).toLocaleString()}
          </time>
        </p>
      )}
    </div>
  );
}


