import { fetchNetworkByIdAction } from "@/actions/networkActions";
import EditNetworkForm from "./EditNetworkForm";

export default async function EditNetworkPage({ params }: { params: Promise<{ id: "" }>}) {
  const { id = "" } = await params;
  const res = await fetchNetworkByIdAction(id);

  if (!res?.data) {
    return <p className="text-red-500 text-center mt-4">Network not found</p>;
  }

  return <EditNetworkForm network={res.data} />;
}
