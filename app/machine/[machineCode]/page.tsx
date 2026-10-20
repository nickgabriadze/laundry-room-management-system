import { MachinePage } from "@/src/dashboard/machines/detail/MachinePage";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ machineCode: string }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const { machineCode } = await params;
  const { code } = await searchParams;
  return <MachinePage machineCode={machineCode} qrToken={code} />;
}
