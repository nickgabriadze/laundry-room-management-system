import { DormBuilding } from "@/src/dataconnect-generated";

export const BUILDINGS = [
  { value: DormBuilding.BUILDING_E, name: "Building E", letter: "E" },
  { value: DormBuilding.BUILDING_F, name: "Building F", letter: "F" },
  { value: DormBuilding.BUILDING_G, name: "Building G", letter: "G" },
] as const;

export type BuildingSelection = DormBuilding | "";
