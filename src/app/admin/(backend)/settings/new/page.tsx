// app/admin/settings/create/page.tsx
import { fetchLatestSEOAction } from "@/actions/seoActions";
import SettingForm from "./SettingCreateForm";

export default async function SettingCreatePage() {
  const { data: latestSEO } = await fetchLatestSEOAction("settings");

  return <SettingForm latestSEO={latestSEO} />;
}
