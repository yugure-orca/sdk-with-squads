import { createKeyPairFromBytes, createNoopSigner, createSignerFromKeyPair } from "@solana/kit";
import { ORCA_DEV_MULTI_SIG_WALLET } from "./const";
import { Connection } from "@solana/web3.js";
import { buildAndSendTransaction, setRpc } from "@orca-so/tx-sender";
import { createSquadsVaultTransactionInstruction, getNextTransactionIndex, getVaultPda } from "./squads_utils";
import { getTransferSolInstruction } from "@solana-program/system";

import proposerWalletSecret from "../proposer_wallet.json";

async function main() {
  const rpcUrl = process.env.RPC_ENDPOINT_URL;
  const _kitRpc = await setRpc(rpcUrl);
  const web3jsConnection = new Connection(rpcUrl, "confirmed");

  const multisigPda = ORCA_DEV_MULTI_SIG_WALLET;
  const vaultIndex = 0;
  const vaultPda = await getVaultPda(multisigPda, vaultIndex);
  console.log("multisig pda:", multisigPda);
  console.log("vault pda:", vaultPda);

  const proposerSigner = await createSignerFromKeyPair(await createKeyPairFromBytes(new Uint8Array(proposerWalletSecret)));

  const to = proposerSigner.address;
  const transferIx = getTransferSolInstruction({
    source: createNoopSigner(vaultPda),
    destination: to,
    amount: 1000n, // 0.000001 SOL
  });

  const nextTransactionIndex = await getNextTransactionIndex(web3jsConnection, multisigPda);
  const createTransactionIx = await createSquadsVaultTransactionInstruction(
    multisigPda,
    nextTransactionIndex,
    vaultIndex,
    proposerSigner.address,
    [transferIx],
  );

  const signature = await buildAndSendTransaction([createTransactionIx], proposerSigner);
  console.info(`Transaction sent: ${signature}`);
}

main();
