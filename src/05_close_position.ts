import { fetchPosition } from "@orca-so/whirlpools-client";
import { address, createKeyPairFromBytes, createNoopSigner, createSignerFromKeyPair } from "@solana/kit";
import { ORCA_DEV_MULTI_SIG_WALLET } from "./const";
import { Connection  } from "@solana/web3.js";
import { buildAndSendTransaction, setRpc } from "@orca-so/tx-sender";
import { getNextTransactionIndex, getVaultPda, createSquadsVaultTransactionInstruction } from "./squads_utils";

import proposerWalletSecret from "../proposer_wallet.json";
import { closePositionInstructions, setNativeMintWrappingStrategy } from "@orca-so/whirlpools";

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
  const { feesQuote, rewardsQuote, quote: closeQuote, instructions: closeIxs } = await closePositionInstructions(
    kitRpc,
    position.data.positionMint,
    300, // slippage bps (3%)
    createNoopSigner(vaultPda),
  );

  console.log("fees quote:", feesQuote);
  console.log("rewards quote:", rewardsQuote);
  console.log("close quote:", closeQuote);

  const nextTransactionIndex = await getNextTransactionIndex(web3jsConnection, multisigPda);
  const createTransactionIx = await createSquadsVaultTransactionInstruction(
    multisigPda,
    nextTransactionIndex,
    vaultIndex,
    proposerSigner.address,
    [...closeIxs],
  );

  const signature = await buildAndSendTransaction([createTransactionIx], proposerSigner);
  console.info(`Transaction sent: ${signature}`);
}

main();
