import {
  forceCancelMyMachineSession,
  occupyMachine,
} from "@/src/dataconnect-generated";

const MILLISECONDS_PER_MINUTE = 60_000;

export async function startMachineSession(
  machineId: string,
  durationMinutes: number,
) {
  if (!Number.isSafeInteger(durationMinutes) || durationMinutes < 1) {
    throw new RangeError("Duration must be a positive whole number of minutes.");
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
