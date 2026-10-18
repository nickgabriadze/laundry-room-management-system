import { MachinePage } from "@/src/dashboard/machines/MachinePage";

export default async function Page({
  params,
}: {
  params: Promise<{ machineId: string }>;
}) {
  const { machineId } = await params;
  return <MachinePage machineId={machineId} />;
}
