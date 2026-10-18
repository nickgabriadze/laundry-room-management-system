export function getBuildingDisplayName(building: string) {
  return building.replace("BUILDING_", "Building ");
}

export function sortMachinesByCode<T extends { id: string }>(
  machines: readonly T[],
  codesById: ReadonlyMap<string, string>,
) {
  return [...machines].sort((left, right) =>
    (codesById.get(left.id) ?? left.id).localeCompare(
      codesById.get(right.id) ?? right.id,
      undefined,
      { numeric: true },
    ),
  );
}
