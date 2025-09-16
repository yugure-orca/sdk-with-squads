import { fetchPosition } from "@orca-so/whirlpools-client";
import { address, createKeyPairFromBytes, createNoopSigner, createSignerFromKeyPair } from "@solana/kit";
import { ORCA_DEV_MULTI_SIG_WALLET } from "./const";
import { Connection  } from "@solana/web3.js";
import { buildAndSendTransaction, setRpc } from "@orca-so/tx-sender";
import { getNextTransactionIndex, getVaultPda, createSquadsVaultTransactionInstruction } from "./squads_utils";

import proposerWalletSecret from "../proposer_wallet.json";
import { decreaseLiquidityInstructions, setNativeMintWrappingStrategy } from "@orca-so/whirlpools";

async function main() {
  const rpcUrl = process.env.RPC_ENDPOINT_URL;
  const kitRpc = await setRpc(rpcUrl);
  const web3jsConnection = new Connection(rpcUrl, "confirmed");

  const multisigPda = ORCA_DEV_MULTI_SIG_WALLET;
  const vaultIndex = 0;
  const vaultPda = await getVaultPda(multisigPda, vaultIndex);
  console.log("multisig pda:", multisigPda);
  console.log("vault pda:", vaultPda);

  const proposerSigner = await createSignerFromKeyPair(await createKeyPairFromBytes(new Uint8Array(proposerWalletSecret)));

  // THIS ADDRESS MUST BE UPDATED TO THE POSITION OPENED IN 01_open_position.ts
  const positionAddress = address("HMbQ1zMW73nvAyW285gtJbhEBcsMtdHigr7sSQvbEgfV");

  const position = await fetchPosition(kitRpc, positionAddress);
  console.log("position:", positionAddress, position.data.liquidity.toString());

  setNativeMintWrappingStrategy("ata"); // use ATA even for SOL
  const { quote: withdrawQuote, instructions: withdrawIxs } = await decreaseLiquidityInstructions(
    kitRpc,
    position.data.positionMint,
    { liquidity: position.data.liquidity / 2n }, // withdraw half of the liquidity
    300, // slippage bps (3%)
    createNoopSigner(vaultPda),
  );

  console.log("withdraw quote:", withdrawQuote);

  const nextTransactionIndex = await getNextTransactionIndex(web3jsConnection, multisigPda);
  const createTransactionIx = await createSquadsVaultTransactionInstruction(
    multisigPda,
    nextTransactionIndex,
    vaultIndex,
    proposerSigner.address,
    [...withdrawIxs],
  );

  const signature = await buildAndSendTransaction([createTransactionIx], proposerSigner);
  console.info(`Transaction sent: ${signature}`);
}

main();
