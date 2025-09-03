"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createNetwork,
  deleteNetwork,
  getAllNetworks,
  getNetworkById,
  updateNetwork,
  getNetworkNames,
  getStoreCountByNetworkId,
} from "@/functions/networkFunctions";

// ✅ Network Validation Schema
const networkSchema = z.object({
  networkName: z
    .string()
    .trim()
    .min(2, "Network name must be at least 2 characters")
    .max(100, "Network name must be less than 100 characters"),
  storeNetworkUrl: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .max(200, "Network URL must be less than 200 characters"),
});

type NetworkFormData = z.infer<typeof networkSchema>;

export type NetworkFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

// ✅ Helper: Parse FormData to NetworkFormData
function parseNetworkFormData(formData: FormData): NetworkFormData {
  return {
    networkName: String(formData.get("networkName") || ""),
    storeNetworkUrl: String(formData.get("storeNetworkUrl") || ""),
  };
}

// ✅ CREATE NETWORK
export async function createNetworkAction(
  prevState: NetworkFormState,
  formData: FormData
): Promise<NetworkFormState> {
  await connectToDatabase();

  const parsed = parseNetworkFormData(formData);
  const result = networkSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const network = await createNetwork(result.data);
    return { data: network };
  } catch (error: any) {
    if (error.code === 11000) {
      return { error: { networkName: ["Network name must be unique"] } };
    }
    return {
      error: { message: [error.message || "Failed to create network"] },
    };
  }
}

// ✅ UPDATE NETWORK
export async function updateNetworkAction(
  prevState: NetworkFormState,
  id: string,
  formData: FormData
): Promise<NetworkFormState> {
  await connectToDatabase();

  const parsed = parseNetworkFormData(formData);
  const result = networkSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const updated = await updateNetwork(id, result.data);
    return { data: updated };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to update network"] },
    };
  }
}

// ✅ DELETE NETWORK
export async function deleteNetworkAction(id: string) {
  await connectToDatabase();
  try {
    const deleted = await deleteNetwork(id);
    return { data: deleted };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to delete network"] },
    };
  }
}

// ✅ FETCH ALL NETWORKS
export async function fetchAllNetworksAction() {
  await connectToDatabase();
  try {
    const networks = await getAllNetworks();
    return { data: networks };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to fetch networks"] },
    };
  }
}

// ✅ FETCH SINGLE NETWORK
export async function fetchNetworkByIdAction(id: string) {
  await connectToDatabase();
  try {
    const network = await getNetworkById(id);
    if (!network) {
      return { error: { message: ["Network not found"] } };
    }
    return { data: network };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to fetch network"] },
    };
  }
}

// ✅ FETCH ONLY NETWORK NAMES
export async function fetchNetworkNamesAction() {
  await connectToDatabase();
  try {
    const names = await getNetworkNames();
    return { data: names }; // array of strings
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to fetch network names"] },
    };
  }
}
export async function fetchStoreCountByNetworkIdAction(networkId: string) {
  await connectToDatabase();
  try {
    const count = await getStoreCountByNetworkId(networkId);
    return { data: count };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch store count"] } };
  }
}