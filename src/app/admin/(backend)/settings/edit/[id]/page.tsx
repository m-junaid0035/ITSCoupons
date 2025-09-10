// app/admin/settings/[id]/page.tsx
import { fetchSettingByIdAction } from "@/actions/settingActions";
import { fetchLatestSEOAction } from "@/actions/seoActions";
import EditSettingFormClient from "./EditSettingFormClient";

interface Props {
  params: { id: string };
}

export default async function EditSettingPage({ params }: Props) {
  const { id } = params;

  // ✅ fetch in parallel
  const [settingResult, seoResult] = await Promise.allSettled([
    fetchSettingByIdAction(id),
    fetchLatestSEOAction("settings"),
  ]);

  const setting =
    settingResult.status === "fulfilled" ? settingResult.value?.data : null;
  const latestSEO =
    seoResult.status === "fulfilled" ? seoResult.value?.data : null;

  return (
    <EditSettingFormClient
      settingId={id}
      initialSetting={setting}
      latestSEO={latestSEO}
    />
  );
}
