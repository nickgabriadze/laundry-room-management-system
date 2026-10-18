"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { QueryFetchPolicy } from "firebase/data-connect";
import { useRouter } from "next/navigation";
import { getFirebaseAuth } from "@/src/firebase";
import { listMachinesByBuilding } from "@/src/dataconnect-generated";
import { getCurrentUserProfile } from "@/src/user/profile";
import { createMachineLabels, type MachineLabel } from "../utils/machineLabels";
import styles from "./MachineLabelsPage.module.css";

type PageState = "loading" | "ready" | "error";

export function MachineLabelsPage() {
  const router = useRouter();
  const [labels, setLabels] = useState<MachineLabel[]>([]);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      if (!user) {
        router.replace("/signin");
        return;
      }

      void (async () => {
        try {
          const profile = await getCurrentUserProfile();
          if (!active) return;
          if (!profile) {
            router.replace("/onboarding");
            return;
          }

          const { data } = await listMachinesByBuilding(
            { dormBuilding: profile.dormBuilding },
            { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
          );
          if (!active) return;

          const machineLabels = await createMachineLabels(
            data.machines,
            window.location.origin,
          );

          if (!active) return;
          setLabels(machineLabels);
          setPageState("ready");
        } catch {
          if (!active) return;
          setError("We couldn't create the QR labels. Please try again.");
          setPageState("error");
        }
      })();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [router]);

  return (
    <main className={styles.page}>
      <header className={styles.toolbar}>
        <Link className={styles.backLink} href="/">
          Back to laundry room
        </Link>
        <button
          className={styles.printButton}
          disabled={pageState !== "ready" || labels.length === 0}
          onClick={() => window.print()}
          type="button"
        >
          Print stickers
        </button>
      </header>

      <section className={styles.content} aria-labelledby="labels-title">
        <h1 id="labels-title">Laundry Machine QR stickers</h1>
        <p className={styles.intro}>
          Print these labels and attach each one to the matching machine. The QR
          code opens its machine page on this site.
        </p>

        {pageState === "loading" && (
          <p className={styles.status} role="status">
            Preparing QR stickers...
          </p>
        )}
        {pageState === "error" && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        {pageState === "ready" && labels.length === 0 && (
          <p className={styles.status}>No machines are listed for your building.</p>
        )}
        {labels.length > 0 && (
          <div className={styles.labelGrid}>
            {labels.map((label) => (
              <article className={styles.label} key={label.code}>
                <img
                  alt={`QR code for machine ${label.code}`}
                  className={styles.qrCode}
                  src={label.image}
                />
                <h2>{label.code}</h2>
                <p>{label.description}</p>
                <span className={styles.url}>{label.url}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
