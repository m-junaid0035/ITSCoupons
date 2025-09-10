import { fetchLatestHomeDescriptionAction } from "@/actions/homeDesActions";
import HomeDescriptionEditorClient from "./HomeDescriptionEditorClient.tsx";

export default async function HomeDescriptionPage() {
  const result = await fetchLatestHomeDescriptionAction();
  console.log(result.data?._id)

  return (
    <HomeDescriptionEditorClient
      initialDescription={result?.data?.description || ""}
      descriptionId={result?.data?._id || null}
    />
  );
}
