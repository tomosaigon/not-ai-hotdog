// import { STORAGE_REGISTRY_ADDRESS } from "@farcaster/core";
import { TransactionTargetResponse } from "frames.js";
import { getFrameMessage } from "frames.js/next/server";
import { NextRequest, NextResponse } from "next/server";
import {
  Abi,
  createPublicClient,
  encodeFunctionData,
  getContract,
  http,
} from "viem";
import { sepolia } from "viem/chains";
// import { storageRegistryABI } from "./contracts/storage-registry";
import deployedContracts from "./contracts/gho";

export async function POST(
  req: NextRequest
): Promise<NextResponse<TransactionTargetResponse>> {
  const json = await req.json();

  const frameMessage = await getFrameMessage(json);

  if (!frameMessage) {
    throw new Error("No frame message");
  }

  // Get current storage price
  // const units = 1n;

  // const calldata = encodeFunctionData({
  //   abi: storageRegistryABI,
  //   functionName: "rent",
  //   args: [BigInt(frameMessage.requesterFid), units],
  // });
  const calldata = encodeFunctionData({
    abi: deployedContracts[11155111].GhoToken.abi,
    functionName: "mint",
    args: ['0xE3c382A8B72643CC3756D532e967Eb44e885c619', BigInt(100)],
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  const gho = getContract({
    address: deployedContracts[11155111].GhoToken.address,
    abi: deployedContracts[11155111].GhoToken.abi,
    client: publicClient,
  });

  // const balanceOf = await gho.read.balanceOf(['0xE3c382A8B72643CC3756D532e967Eb44e885c619']);

  return NextResponse.json({
    // chainId: "eip155:10", // OP Mainnet 10
    chainId: "eip155:11155111", // OP Mainnet 10
    method: "eth_sendTransaction",
    params: {
      abi: deployedContracts[11155111].GhoToken.abi as Abi,
      to: deployedContracts[11155111].GhoToken.address,
      data: calldata,
      // value: balanceOf.toString(),
      value: '0',
    },
  });
}
