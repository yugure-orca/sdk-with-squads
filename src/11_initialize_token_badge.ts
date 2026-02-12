import { getDeleteTokenBadgeInstruction, getInitializeTokenBadgeInstruction, getTokenBadgeAddress } from "@orca-so/whirlpools-client";
import { address, createKeyPairFromBytes, createNoopSigner, createSignerFromKeyPair } from "@solana/kit";
import { Connection  } from "@solana/web3.js";
import { buildAndSendTransaction, setRpc } from "@orca-so/tx-sender";
import { getNextTransactionIndex, getVaultPda, createSquadsVaultTransactionInstruction } from "./squads_utils";

import proposerWalletSecret from "../proposer_wallet_banana.json";

const ORCA_WP_OPS_MULTI_SIG_WALLET = address("5J.................");
const ORCA_WP_CONFIG = address("2LecshUwdy9xi7meFgHtFJQNSKk4KdTrcpvaB56dP2NQ");
const ORCA_WP_CONFIG_EXTENSION = address("777H5H3Tp9U11uRVRzFwM8BinfiakbaLT8vQpeuhvEiH");

async function main() {
  const rpcUrl = process.env.RPC_ENDPOINT_URL;
  const kitRpc = await setRpc(rpcUrl);
  const web3jsConnection = new Connection(rpcUrl, "confirmed");

  const multisigPda = ORCA_WP_OPS_MULTI_SIG_WALLET;
  const vaultIndex = 0;
  const vaultPda = await getVaultPda(multisigPda, vaultIndex);
  console.log("multisig pda:", multisigPda);
  console.log("vault pda:", vaultPda);

  const proposerSigner = await createSignerFromKeyPair(await createKeyPairFromBytes(new Uint8Array(proposerWalletSecret)));

  const tokenMint = address("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
  const [tokenBadge] = await getTokenBadgeAddress(ORCA_WP_CONFIG, tokenMint);
/*
  const ix = getInitializeTokenBadgeInstruction({
    whirlpoolsConfig: ORCA_WP_CONFIG,
    whirlpoolsConfigExtension: ORCA_WP_CONFIG_EXTENSION,
    funder: createNoopSigner(vaultPda),
    tokenBadgeAuthority: createNoopSigner(vaultPda),
    tokenMint,
    tokenBadge,
  });
*/
/*
  const ix = getDeleteTokenBadgeInstruction({
    whirlpoolsConfig: ORCA_WP_CONFIG,
    whirlpoolsConfigExtension: ORCA_WP_CONFIG_EXTENSION,
    receiver: vaultPda,
    tokenBadgeAuthority: createNoopSigner(vaultPda),
    tokenMint,
    tokenBadge,
  });
*/
  const nextTransactionIndex = await getNextTransactionIndex(web3jsConnection, multisigPda);
  const createTransactionIx = await createSquadsVaultTransactionInstruction(
    multisigPda,
    nextTransactionIndex,
    vaultIndex,
    proposerSigner.address,
    [ix],
  );

  const signature = await buildAndSendTransaction([createTransactionIx], proposerSigner);
  console.info(`Transaction sent: ${signature}`);
}

main();
