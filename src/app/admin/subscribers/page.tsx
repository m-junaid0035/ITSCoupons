// app/admin/subscribers/page.tsx
import SubscribersPageClient, { ISubscriber } from "./SubscribersPageClient";
import { fetchAllSubscribersAction } from "@/actions/subscriberActions";

export default async function SubscribersPage() {
  const result = await fetchAllSubscribersAction();
  let subscribers: ISubscriber[] = [];

  if (result?.data && Array.isArray(result.data)) {
    subscribers = result.data;
  }

  return <SubscribersPageClient initialSubscribers={subscribers} />;
}
