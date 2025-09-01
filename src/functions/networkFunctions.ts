import { Network } from "@/models/Network";
import { INetwork } from "@/models/Network";

/**
 * Helper to sanitize and format incoming network data.
 */
const sanitizeNetworkData = (data: {
  networkName?: string;
  storeNetworkUrl?: string;
}) => ({
  networkName: data.networkName?.trim(),
  storeNetworkUrl: data.storeNetworkUrl?.trim(),
});

/**
 * Convert a Mongoose document to a plain object safe for Client Components.
 */
const serializeNetwork = (network: {
  _id: any;
  networkName: string;
  storeNetworkUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}) => ({
  _id: network._id.toString(),
  networkName: network.networkName,
  storeNetworkUrl: network.storeNetworkUrl,
  createdAt: network.createdAt?.toISOString?.() ?? null,
  updatedAt: network.updatedAt?.toISOString?.() ?? null,
});

/**
 * Create a new network.
 */
export const createNetwork = async (data: {
  networkName: string;
  storeNetworkUrl: string;
}): Promise<ReturnType<typeof serializeNetwork>> => {
  const networkData = sanitizeNetworkData(data);
  const network = await new Network(networkData).save();
  return serializeNetwork(network);
};

/**
 * Get all networks, sorted by newest first.
 */
export const getAllNetworks = async (): Promise<
  ReturnType<typeof serializeNetwork>[]
> => {
  const networks = await Network.find().sort({ createdAt: -1 }).lean<INetwork[]>();
  return networks.map(serializeNetwork);
};

/**
 * Get a network by its ID.
 */
export const getNetworkById = async (
  id: string
): Promise<ReturnType<typeof serializeNetwork> | null> => {
  const network = await Network.findById(id).lean<INetwork>();
  return network ? serializeNetwork(network) : null;
};

/**
 * Update a network by ID.
 */
export const updateNetwork = async (
  id: string,
  data: {
    networkName?: string;
    storeNetworkUrl?: string;
  }
): Promise<ReturnType<typeof serializeNetwork> | null> => {
  const updatedData = sanitizeNetworkData(data);
  const network = await Network.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean<INetwork>();
  return network ? serializeNetwork(network) : null;
};

/**
 * Delete a network by ID.
 */
export const deleteNetwork = async (
  id: string
): Promise<ReturnType<typeof serializeNetwork> | null> => {
  const network = await Network.findByIdAndDelete(id).lean<INetwork>();
  return network ? serializeNetwork(network) : null;
};

/**
 * Get all network names only.
 */
export const getNetworkNames = async (): Promise<string[]> => {
  const networks = await Network.find().select("networkName").lean<{ networkName: string }[]>();
  return networks.map((net) => net.networkName);
};
