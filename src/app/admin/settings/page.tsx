// app/admin/settings/page.tsx
import SettingsPageClient, { ISetting } from "./SettingsPageClient";
import { fetchAllSettingsAction } from "@/actions/settingActions";

export default async function SettingsPage() {
  const result = await fetchAllSettingsAction();
  let settings: ISetting[] = [];

  if (result?.data && Array.isArray(result.data)) {
    settings = result.data;
  }

  return <SettingsPageClient initialSettings={settings} />;
}
