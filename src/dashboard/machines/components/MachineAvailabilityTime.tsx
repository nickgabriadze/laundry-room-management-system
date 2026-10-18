"use client";

import { useEffect, useState } from "react";
import styles from "./MachineCard.module.css";

export function MachineAvailabilityTime({ endsAt }: { endsAt: string }) {
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    setLocalTime(
      new Date(endsAt).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    );
  }, [endsAt]);

  return (
    <p className={styles.availabilityTime}>
      Available at{" "}
      <time dateTime={endsAt}>{localTime || "…"}</time>
    </p>
  );
}
