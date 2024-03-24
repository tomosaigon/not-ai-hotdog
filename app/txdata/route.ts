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
// import { storageRegistryABI } from "./contracts/storage-registry";
// import deployedContracts from "./contracts/gho";
import abi from "./contracts/erc721";
const address = '0xf85d352c3c62cf0823aa58233509c7332e0bafd2'; // contract NotDog is ERC721, ERC721Enumerable, Ownable

export async function POST(
  req: NextRequest
): Promise<NextResponse<TransactionTargetResponse>> {
  const json = await req.json();
  // const untrustedDataAddress = json.untrustedData.address;
  // console.log('json', json)

  const frameMessage = await getFrameMessage(json);
  // console.log('frameMessage', frameMessage)

  if (!frameMessage) {
    throw new Error("No frame message");
  }
  const connectedAddress = frameMessage.connectedAddress as `0x${string}` | null;

  const calldata = encodeFunctionData({
    abi,
    functionName: "safeMint",
    args: [connectedAddress ? connectedAddress : `0x${"0".repeat(20)}`], // XXX
  });

  // const publicClient = createPublicClient({
  //   chain: sepolia,
  //   transport: http(),
  // });

  // const notdog = getContract({
  //   address,0xf85d352c3c62cf0823aa58233509c7332e0bafd2
  //   abi,
  //   client: publicClient,
  // });

  // const balanceOf = await gho.read.balanceOf(['0xE3c382A8B72643CC3756D532e967Eb44e885c619']);

  return NextResponse.json({
    // chainId: "eip155:10", // OP Mainnet 10
    chainId: "eip155:11155111", // OP Mainnet 10
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
