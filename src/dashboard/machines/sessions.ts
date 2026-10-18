import {
  MachineType,
  forceCancelMyMachineSession,
  occupyMachine,
} from "@/src/dataconnect-generated";

const MILLISECONDS_PER_MINUTE = 60_000;
export const MAX_WASHER_SESSION_MINUTES = 120;

export async function startMachineSession(
  machineId: string,
  durationMinutes: number,
  machineType: MachineType,
) {
  if (!Number.isSafeInteger(durationMinutes) || durationMinutes < 1) {
    throw new RangeError("Duration must be a positive whole number of minutes.");
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

  return { activityId: data.laundryActivity_insert.id, endsAt };
}

export async function forceCancelMyMachineSessionById(machineId: string) {
  await forceCancelMyMachineSession({ machineId });
}
