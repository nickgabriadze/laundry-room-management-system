import {
  MachineType,
  forceCancelMyMachineSession,
  getMyActiveMachineSession,
  occupyMachine,
  saveSessionReminderEmailId,
} from "@/src/dataconnect-generated";
import { QueryFetchPolicy } from "firebase/data-connect";
import { getFirebaseAuth } from "@/src/firebase";

const MILLISECONDS_PER_MINUTE = 60_000;
export const MIN_SESSION_MINUTES = 10;
export const MAX_WASHER_SESSION_MINUTES = 120;

type ReminderResponse = {
  reminderStatus?: "scheduled" | "not-needed";
  remindersCancelled?: boolean;
  emailId?: string;
  error?: string;
};

async function manageSessionReminder(
  payload:
    | {
        action: "schedule";
        activityId: string;
        endsAt: string;
        machineCode: string;
        machineType: MachineType;
      }
    | { action: "cancel"; activityId: string; emailId: string },
) {
  const user = getFirebaseAuth().currentUser;
  if (!user) {
    throw new Error("Sign in to manage laundry session reminders.");
  }
  const token = await user.getIdToken(true);
  const response = await fetch("/api/session-reminders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  let result: ReminderResponse;
  try {
    result = (await response.json()) as ReminderResponse;
  } catch {
    throw new Error(
      `The reminder API returned an invalid response (${response.status}).`,
    );
  }
  if (!response.ok) {
    throw new Error(
      result.error ??
        `Could not manage the session reminder (HTTP ${response.status}).`,
    );
  }
  return result;
}

export async function startMachineSession(
  machineId: string,
  durationMinutes: number,
  machineType: MachineType,
  machineCode: string,
) {
  if (
    !Number.isSafeInteger(durationMinutes) ||
    durationMinutes < MIN_SESSION_MINUTES
  ) {
    throw new RangeError(
      `Duration must be at least ${MIN_SESSION_MINUTES} whole minutes.`,
    );
  }
  if (
    machineType === MachineType.WASHER &&
    durationMinutes > MAX_WASHER_SESSION_MINUTES
  ) {
    throw new RangeError("Washer sessions cannot exceed 120 minutes.");
  }

  const endTime = new Date(Date.now() + durationMinutes * MILLISECONDS_PER_MINUTE);
  if (Number.isNaN(endTime.getTime())) {
    throw new RangeError("Duration is outside the supported time range.");
  }

  const endsAt = endTime.toISOString();
  const { data } = await occupyMachine({ machineId, endsAt });
  const activityId = data.laundryActivity_insert.id;
  let reminderStatus: "scheduled" | "not-needed" | "failed" = "failed";
  let scheduledReminderEmailId: string | null = null;

  try {
    const response = await manageSessionReminder({
      action: "schedule",
      activityId,
      endsAt,
      machineCode,
      machineType,
    });
    if (response.reminderStatus === "scheduled" && response.emailId) {
      try {
        const { data } = await saveSessionReminderEmailId({
          activityId,
          emailId: response.emailId,
        });
        if (data.laundryActivity_update?.id !== activityId) {
          throw new Error(
            "Data Connect did not save the reminder ID for this laundry activity.",
          );
        }
      } catch (error) {
        try {
          await manageSessionReminder({
            action: "cancel",
            activityId,
            emailId: response.emailId,
          });
        } catch (cancellationError) {
          console.error(
            "Could not cancel a reminder after its ID failed to save.",
            cancellationError,
          );
        }
        throw error;
      }
      scheduledReminderEmailId = response.emailId;
      reminderStatus = "scheduled";
    } else {
      reminderStatus = response.reminderStatus ?? "failed";
    }
  } catch (error) {
    console.error("Could not schedule laundry session reminder emails.", error);
    reminderStatus = "failed";
  }

  return {
    activityId,
    endsAt,
    reminderStatus,
    scheduledReminderEmailId,
  };
}

export async function forceCancelMyMachineSessionById(
  machineId: string,
  activityId: string,
  scheduledReminderEmailId?: string | null,
) {
  let emailId = scheduledReminderEmailId;
  let emailIdLookupFailed = false;
  try {
    if (!emailId) {
      const { data: activeSessionData } = await getMyActiveMachineSession(
        { machineId },
        { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
      );
      emailId =
        activeSessionData.laundryActivities[0]?.scheduledReminderEmailId ?? null;
    }
  } catch (error) {
    console.error("Could not load the scheduled laundry reminder email ID.", error);
    emailIdLookupFailed = true;
  }

  let remindersCancelled = !emailIdLookupFailed;
  if (emailId) {
    try {
      const response = await manageSessionReminder({
        action: "cancel",
        activityId,
        emailId,
      });
      remindersCancelled = response.remindersCancelled ?? false;
      if (remindersCancelled) {
        await saveSessionReminderEmailId({ activityId, emailId: null });
      }
    } catch (error) {
      console.error("Could not cancel laundry session reminder emails.", error);
      remindersCancelled = false;
    }
  }

  await forceCancelMyMachineSession({ machineId });
  return { remindersCancelled };
}
