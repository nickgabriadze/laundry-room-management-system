import type { ListMachinesByBuildingData } from "@/src/dataconnect-generated";

type MachineIdentity = Pick<
  ListMachinesByBuildingData["machines"][number],
  "id" | "machineCode" | "type" | "dormBuilding"
>;

export function getMachineCodeMap(machines: readonly MachineIdentity[]) {
  const groups = new Map<string, MachineIdentity[]>();

  for (const machine of machines) {
    const groupKey = `${machine.dormBuilding}:${machine.type}`;
    const group = groups.get(groupKey) ?? [];
    group.push(machine);
    groups.set(groupKey, group);
  }

  const codes = new Map<string, string>();

  for (const group of groups.values()) {
    const usedCodes = new Set<string>();
    const sortedGroup = [...group].sort((left, right) =>
      left.id.localeCompare(right.id),
    );

    for (const machine of sortedGroup) {
      if (!machine.machineCode) continue;
      codes.set(machine.id, machine.machineCode);
      usedCodes.add(machine.machineCode);
    }

    const prefix = `${sortedGroup[0].type === "WASHER" ? "W" : "D"}${sortedGroup[0].dormBuilding.slice(-1)}`;
    let nextNumber = 1;

    for (const machine of sortedGroup) {
      if (machine.machineCode) continue;

      let code = `${prefix}${nextNumber}`;
      while (usedCodes.has(code)) {
        nextNumber += 1;
        code = `${prefix}${nextNumber}`;
      }
      codes.set(machine.id, code);
      usedCodes.add(code);
      nextNumber += 1;
    }
  }

  return codes;
}
