import { MachinePage } from "@/src/dashboard/machines/detail/MachinePage";

export default async function Page({
  params,
}: {
  params: Promise<{ machineCode: string }>;
}) {
  const { machineCode } = await params;
  return <MachinePage machineCode={machineCode} />;
}
