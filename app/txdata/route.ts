// import { STORAGE_REGISTRY_ADDRESS } from "@farcaster/core";
import { TransactionTargetResponse } from "frames.js";
import { getFrameMessage } from "frames.js/next/server";
import { NextRequest, NextResponse } from "next/server";
import {
  // Abi,
  // createPublicClient,
  // createWalletClient,
  // custom,
  encodeFunctionData,
  // getContract,
  // http,
} from "viem";
// import { sepolia } from "viem/chains";
import abi from "./contracts/erc721";
const address = '0xb620b3616d5649CC5369BD9e11a7b4f6Bc5fc313'; // contract NotDog is ERC721, ERC721Enumerable, Ownable

export async function POST(
  req: NextRequest
): Promise<NextResponse<TransactionTargetResponse>> {
  const json = await req.json();

  const frameMessage = await getFrameMessage(json);

  if (!frameMessage) {
    throw new Error("No frame message");
  }
  if (!frameMessage.connectedAddress) {
    throw new Error("No frame message connectedAddress");
  }
  const connectedAddress = frameMessage.connectedAddress as `0x${string}`;

  const calldata = encodeFunctionData({
    abi,
    functionName: "safeMint",
    args: [connectedAddress],
  });

  return NextResponse.json({
    // chainId: "eip155:10", // OP Mainnet 10
    chainId: "eip155:84532", // Base Sepolia Testnet
    method: "eth_sendTransaction",
    params: {
      abi,
      to: address,
      data: calldata,
      // value: balanceOf.toString(),
      value: '0',
    },
  });
}
