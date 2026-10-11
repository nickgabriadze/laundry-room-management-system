import {
  createMyUserAccount,
  getMyUserAccount,
  updateMyBuilding,
  type DormBuilding,
} from "@/src/dataconnect-generated";

export const BUILDING_CHANGE_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

export async function getCurrentUserProfile() {
  const { data } = await getMyUserAccount();
  return data.userAccount ?? null;
}

export async function createCurrentUserProfile(dormBuilding: DormBuilding) {
  return createMyUserAccount({ dormBuilding });
}

export async function updateCurrentUserBuilding(dormBuilding: DormBuilding) {
  const { data } = await updateMyBuilding({ dormBuilding });
  return data.userAccount_update != null;
}

export function getBuildingChangeAvailableAt(
  buildingUpdatedAt?: string | null,
) {
  if (!buildingUpdatedAt) return null;

  const updatedAt = Date.parse(buildingUpdatedAt);
  return Number.isNaN(updatedAt)
    ? null
    : updatedAt + BUILDING_CHANGE_COOLDOWN_MS;
}
