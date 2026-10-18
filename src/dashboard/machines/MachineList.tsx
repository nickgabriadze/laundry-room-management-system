"use client";

import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { QueryFetchPolicy } from "firebase/data-connect";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/src/firebase";
import {
  MachineType,
  listMachinesByBuilding,
} from "@/src/dataconnect-generated";
import { getCurrentUserProfile } from "@/src/user/profile";
import { ApplianceIcon } from "./ApplianceIcon";
import { MachineCard, type Machine } from "./Machine";
import { getMachineCodeMap } from "./machineCodes";
import styles from "./MachineList.module.css";

export function MachineList() {
  const router = useRouter();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedType, setSelectedType] = useState<MachineType>(
    MachineType.WASHER,
  );
  const [buildingName, setBuildingName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadMachines = useCallback(
    async (refresh = false) => {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError("");
      let shouldKeepLoading = false;

      try {
        const profile = await getCurrentUserProfile();
        if (!profile) {
          shouldKeepLoading = true;
          setIsLoading(true);
          router.replace("/onboarding");
          return;
        }

        const { data } = await listMachinesByBuilding(
          { dormBuilding: profile.dormBuilding },
          { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
        );
        setMachines(data.machines);
        setBuildingName(profile.dormBuilding.replace("BUILDING_", "Building "));
      } catch {
        setError(
          "We couldn't load the machines. Check your connection and retry.",
        );
      } finally {
        if (!shouldKeepLoading) setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [router],
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsLoading(true);
        router.replace("/signin");
        return;
      }
      void loadMachines();
    });

    return unsubscribe;
  }, [loadMachines, router]);

  const washerCount = machines.filter(
    (machine) => machine.type === MachineType.WASHER,
  ).length;
  const dryerCount = machines.length - washerCount;
  const visibleMachines = machines.filter(
    (machine) => machine.type === selectedType,
  );
  const machineCodes = getMachineCodeMap(machines);
  const orderedVisibleMachines = [...visibleMachines].sort((left, right) =>
    (machineCodes.get(left.id) ?? left.id).localeCompare(
      machineCodes.get(right.id) ?? right.id,
      undefined,
      { numeric: true },
    ),
  );

  if (isLoading) {
    return (
      <main className={`${styles.page} ${styles.loadingPage}`}>
        <div className={styles.loaderContent} role="status" aria-live="polite">
          <div className={styles.loaderAppliance} aria-hidden="true">
            <ApplianceIcon type={MachineType.WASHER} isInUse />
          </div>
          <p className={styles.loaderLabel}>Checking your laundry room</p>
          <span className={styles.loaderTrack} aria-hidden="true">
            <span />
          </span>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className={styles.page}>
        <section className={styles.board} aria-labelledby="machines-title">
          <header className={styles.heading}>
            <div>
              <p className={styles.eyebrow}>Laundry room</p>
              <h1 id="machines-title">{buildingName || "Your machines"}</h1>
              <p className={styles.subtitle}>
                Choose an available machine to get started.
              </p>
            </div>
            <div className={styles.machineActions}>
              <Link className={styles.refreshButton} href="/machine-labels">
                Print QR stickers
              </Link>
              <button
                className={styles.refreshButton}
                disabled={isLoading || isRefreshing}
                onClick={() => void loadMachines(true)}
                type="button"
              >
                <span aria-hidden="true" className={styles.refreshIcon}>
                  ↻
                </span>
                {isRefreshing ? "Refreshing" : "Refresh"}
              </button>
            </div>
          </header>

          {machines.length > 0 && (
            <div
              className={styles.typeSwitch}
              role="group"
              aria-label="Filter by machine type"
            >
              <button
                aria-pressed={selectedType === MachineType.WASHER}
                className={`${styles.typeButton} ${selectedType === MachineType.WASHER ? styles.typeButtonActive : ""}`}
                onClick={() => setSelectedType(MachineType.WASHER)}
                type="button"
              >
                Washers <span className={styles.typeCount}>{washerCount}</span>
              </button>
              <button
                aria-pressed={selectedType === MachineType.DRYER}
                className={`${styles.typeButton} ${selectedType === MachineType.DRYER ? styles.typeButtonActive : ""}`}
                onClick={() => setSelectedType(MachineType.DRYER)}
                type="button"
              >
                Dryers <span className={styles.typeCount}>{dryerCount}</span>
              </button>
            </div>
          )}

          {isLoading && (
            <p className={styles.message} role="status">
              Loading machines...
            </p>
          )}
          {!isLoading && error && (
            <div className={styles.emptyState} role="alert">
              <p>{error}</p>
              <button
                className={styles.retryButton}
                onClick={() => void loadMachines()}
                type="button"
              >
                Try again
              </button>
            </div>
          )}
          {!isLoading && !error && machines.length === 0 && (
            <p className={styles.emptyState}>
              No machines are listed for this building yet.
            </p>
          )}

          {!isLoading &&
            !error &&
            machines.length > 0 &&
            visibleMachines.length === 0 && (
              <p className={styles.emptyState}>
                No {selectedType === MachineType.WASHER ? "washers" : "dryers"}{" "}
                are listed for this building.
              </p>
            )}

          {!isLoading && !error && visibleMachines.length > 0 && (
            <ul className={styles.machineGrid}>
              {orderedVisibleMachines.map((machine) => (
                <MachineCard
                  key={machine.id}
                  machineCode={machineCodes.get(machine.id) ?? ""}
                  machine={machine}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
