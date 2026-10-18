import { MachinePage } from "@/src/dashboard/machines/MachinePage";

export default async function Page({
  params,
}: {
  params: Promise<{ machineCode: string }>;
}) {
  const { machineCode } = await params;
  return <MachinePage machineCode={machineCode} />;
}
