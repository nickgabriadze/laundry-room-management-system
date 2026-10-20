import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QueryFetchPolicy } from "firebase/data-connect";
import { getFirebaseAuth } from "@/src/firebase";
import {
  getMachineActiveSessionOwner,
  getMyActiveMachineSession,
  listMachinesByBuilding,
  getMachinePreviousSessionOwner,
} from "@/src/dataconnect-generated";
import type { GetMyActiveMachineSessionData } from "@/src/dataconnect-generated";
import { getCurrentUserProfile } from "@/src/user/profile";
import type { Machine } from "@/src/dashboard/machines/components/MachineCard";
import { getMachineCodeMap } from "@/src/dashboard/machines/utils/machineCodes";

type PageState = "loading" | "ready" | "submitting" | "cancelling" | "error" | "not-found";
type ActiveSession = GetMyActiveMachineSessionData["laundryActivities"][number];

export function useMachineData(machineCode: string) {
  const router = useRouter();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [myActiveSession, setMyActiveSession] = useState<ActiveSession | null>(null);
  const [activeSessionEmail, setActiveSessionEmail] = useState("");
  const [previousSessionEmail, setPreviousSessionEmail] = useState("");
  const [previousSessionEndTime, setPreviousSessionEndTime] = useState<string>("");
  const [hasOtherMachineOfTypeInUse, setHasOtherMachineOfTypeInUse] = useState(false);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [message, setMessage] = useState("");

  const loadMachine = useCallback(
    async (isActive: () => boolean) => {
      setPageState("loading");
      setMessage("");
      setMachine(null);
      setMyActiveSession(null);
      setActiveSessionEmail("");
      setPreviousSessionEmail("");
      setPreviousSessionEndTime("");
      setHasOtherMachineOfTypeInUse(false);

      try {
        const profile = await getCurrentUserProfile();
        if (!isActive()) return;
        if (!profile) {
          router.replace(
            `/onboarding?redirect=${encodeURIComponent(`/machine/${machineCode}`)}`,
          );
          return;
        }

        const machinesResponse = await listMachinesByBuilding(
          { dormBuilding: profile.dormBuilding },
          { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
        );
        if (!isActive()) return;

        const availableMachines = machinesResponse.data.machines;
        const codesById = getMachineCodeMap(availableMachines);
        const foundMachine =
          availableMachines.find(
            (item) => codesById.get(item.id) === machineCode,
          ) ?? null;
        if (!foundMachine) {
          setPageState("not-found");
          return;
        }

        const currentUserUid = getFirebaseAuth().currentUser?.uid;
        setHasOtherMachineOfTypeInUse(
          availableMachines.some(
            (item) =>
              item.id !== foundMachine.id &&
              item.type === foundMachine.type &&
              item.activeSessions.some(
                (session) => session.user.uid === currentUserUid,
              ),
          ),
        );

        const sessionResponse = await getMyActiveMachineSession(
          { machineId: foundMachine.id },
          { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
        );
        if (!isActive()) return;

        const ownerResponse =
          foundMachine.activeSessions.length > 0
            ? await getMachineActiveSessionOwner(
                { machineId: foundMachine.id },
                { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
              )
            : null;
        if (!isActive()) return;

        const previousOwnerResponse = await getMachinePreviousSessionOwner(
          { machineId: foundMachine.id },
          { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
        );
        if (!isActive()) return;

        setMachine(foundMachine);
        setMyActiveSession(sessionResponse.data.laundryActivities[0] ?? null);
        setActiveSessionEmail(
          ownerResponse?.data.laundryActivities[0]?.user.email ?? "",
        );
        setPreviousSessionEmail(
          previousOwnerResponse?.data.laundryActivities[0]?.user.email ?? "",
        );
        setPreviousSessionEndTime(
          previousOwnerResponse?.data.laundryActivities[0]?.endsAt ?? "",
        );
        setPageState("ready");
      } catch {
        if (!isActive()) return;
        setMessage("We couldn't load this machine. Please try again.");
        setPageState("error");
      }
    },
    [machineCode, router],
  );

  return {
    machine,
    setMachine,
    myActiveSession,
    activeSessionEmail,
    previousSessionEmail,
    previousSessionEndTime,
    hasOtherMachineOfTypeInUse,
    setHasOtherMachineOfTypeInUse,
    pageState,
    setPageState,
    message,
    setMessage,
    loadMachine,
  };
}
