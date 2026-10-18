import QRCode from "qrcode";
import type { ListMachinesByBuildingData } from "@/src/dataconnect-generated";
import { getMachineCodeMap } from "./machineCodes";

export type MachineLabel = {
  code: string;
  description: string;
  url: string;
  image: string;
};

type Machine = ListMachinesByBuildingData["machines"][number];

export async function createMachineLabels(
  machines: readonly Machine[],
  origin: string,
): Promise<MachineLabel[]> {
  const codesById = getMachineCodeMap(machines);
  const labels = await Promise.all(
    machines.map(async (machine) => {
      const code = codesById.get(machine.id);
      if (!code) {
        throw new Error(`No machine code is available for ${machine.id}.`);
      }

      const url = new URL(
        `/machine/${encodeURIComponent(code)}`,
        origin,
      ).toString();
      const image = await QRCode.toDataURL(url, {
        errorCorrectionLevel: "M",
        margin: 2,
        width: 256,
      });

      return {
        code,
        description: `${machine.type === "WASHER" ? "Washer" : "Dryer"} · Building ${machine.dormBuilding.slice(-1)}`,
        url,
        image,
      };
    }),
  );

  return labels.sort((left, right) =>
    left.code.localeCompare(right.code, undefined, { numeric: true }),
  );
}
