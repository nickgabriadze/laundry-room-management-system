import { DashboardHeader } from "@/src/dashboard/machines/components/DashboardHeader";
import { MachineList } from "@/src/dashboard/machines/list/MachineList";

export function HomePage() {
  return (
    <>
      <DashboardHeader />
      <MachineList />
    </>
  );
}
