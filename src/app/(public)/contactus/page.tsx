// In app/contact/page.tsx
import { fetchLatestSettingAction } from "@/actions/settingActions";
import ContactSection from "@/components/ContactSection";
import { SettingData } from "@/types/setting";

export default async function ContactPage() {
  const settingResult = await fetchLatestSettingAction();
  const latestSetting: SettingData | null = settingResult?.data || null;

  return <ContactSection latestSetting={latestSetting} />;
}
