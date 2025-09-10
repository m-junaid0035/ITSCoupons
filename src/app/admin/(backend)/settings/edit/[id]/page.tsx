// app/admin/settings/[id]/page.tsx
import { fetchSettingByIdAction } from "@/actions/settingActions";
import { fetchLatestSEOAction } from "@/actions/seoActions";
import EditSettingFormClient from "./EditSettingFormClient";


export default async function EditSettingPage({ params }: { params: Promise<{ id: "" }>}) {
  const { id = "" } = await params;
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
