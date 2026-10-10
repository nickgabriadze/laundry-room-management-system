"use client";

import { useState } from "react";
import { auth } from "@/src/firebase";
import { DormBuilding, listMachinesByBuilding, ListMachinesData } from "../dataconnect-generated";


export const MachineList = () => {
  const [machines, setMachines] =
    useState<ListMachinesData["machines"]>([]);
  const [error, setError] = useState("");

  async function loadMachines() {
    if (!auth.currentUser) {
      setError("Sign in to view machines.");
      return;
    }

    try {
      const { data } = await listMachinesByBuilding({ dormBuilding: DormBuilding.BUILDING_F });
      setMachines(data.machines);
      setError("");
    } catch {
      setError("Could not load machines.");
    }
  }

  return (
    <section>
      <button onClick={loadMachines}>Load machines</button>
      {error && <p>{error}</p>}
      <ul>
        {machines.map((machine) => (
          <li key={machine.id}>
            {machine.type} in {machine.id}
          </li>
        ))}
      </ul>
    </section>
  );
}