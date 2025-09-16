import { fetchWhirlpool, getInitializeDynamicTickArrayInstruction, getOpenPositionWithTokenExtensionsInstruction, getPositionAddress, getTickArrayAddress } from "@orca-so/whirlpools-client";
import { createKeyPairFromBytes, createNoopSigner, createSignerFromKeyPair } from "@solana/kit";
import { METADATA_UPDATE_AUTH, ORCA_DEV_MULTI_SIG_WALLET, SOL_USDC_TS_4 } from "./const";
import { Connection  } from "@solana/web3.js";
import { buildAndSendTransaction, setRpc } from "@orca-so/tx-sender";
import { getEphemeralSignerPda, getNextTransactionIndex, getTransactionPda, getVaultPda, createSquadsVaultTransactionInstruction } from "./squads_utils";
import { getTickArrayStartTickIndex, priceToTickIndex } from "@orca-so/whirlpools-core";
import { ASSOCIATED_TOKEN_PROGRAM_ADDRESS, fetchAllMint, findAssociatedTokenPda, TOKEN_2022_PROGRAM_ADDRESS } from "@solana-program/token-2022";

import proposerWalletSecret from "../proposer_wallet.json";

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

  // fetch whirlpool
  const whirlpoolAddress = SOL_USDC_TS_4;
  const whirlpool = await fetchWhirlpool(kitRpc, whirlpoolAddress);
  const [mintA, mintB] = await fetchAllMint(kitRpc, [whirlpool.data.tokenMintA, whirlpool.data.tokenMintB]);

  // convert price range to tick index range
  const lowerPrice = 200;
  const upperPrice = 300;
  const lowerTickIndex = priceToTickIndex(lowerPrice, mintA.data.decimals, mintB.data.decimals);
  const upperTickIndex = priceToTickIndex(upperPrice, mintA.data.decimals, mintB.data.decimals);
  const initializableLowerTickIndex = Math.floor(lowerTickIndex / whirlpool.data.tickSpacing) * whirlpool.data.tickSpacing;
  const initializableUpperTickIndex = Math.ceil(upperTickIndex / whirlpool.data.tickSpacing) * whirlpool.data.tickSpacing;
  console.log(`Price range: [${lowerPrice}, ${upperPrice}]`);
  console.log(`Tick index range: [${initializableLowerTickIndex}, ${initializableUpperTickIndex}]`);

  // derive ephemeral signer and position PDAs
  const nextTransactionIndex = await getNextTransactionIndex(web3jsConnection, multisigPda);
  const transactionPda = getTransactionPda(multisigPda, nextTransactionIndex);
  const ephemeralSignerPda0 = getEphemeralSignerPda(transactionPda, 0);
  const positionMint = ephemeralSignerPda0; // use ephemeral signer as position mint
  const [positionPda] = await getPositionAddress(positionMint);
  const [positionTokenAccount] = await findAssociatedTokenPda({
    mint: positionMint,
    owner: vaultPda,
    tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
  });

  // build open position instruction (liquidity is empty)
  const openPositionIx = getOpenPositionWithTokenExtensionsInstruction({
    whirlpool: whirlpoolAddress,
    funder: createNoopSigner(vaultPda),
    owner: vaultPda,
    tickLowerIndex: initializableLowerTickIndex,
    tickUpperIndex: initializableUpperTickIndex,
    withTokenMetadataExtension: true,
    token2022Program: TOKEN_2022_PROGRAM_ADDRESS,
    metadataUpdateAuth: METADATA_UPDATE_AUTH,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
    position: positionPda,
    positionMint: createNoopSigner(positionMint),
    positionTokenAccount: positionTokenAccount,
  });

  // build init dynamic tick array instructions (lower, idempotent)
  const lowerStartTickIndex = getTickArrayStartTickIndex(initializableLowerTickIndex, whirlpool.data.tickSpacing);
  const [lowerTickArrayPda] = await getTickArrayAddress(whirlpoolAddress, lowerStartTickIndex);
  const initLowerTickArrayIx = getInitializeDynamicTickArrayInstruction({
    funder: createNoopSigner(vaultPda),
    whirlpool: whirlpoolAddress,
    startTickIndex: lowerStartTickIndex,
    tickArray: lowerTickArrayPda,
    idempotent: true,
  });

  // build init dynamic tick array instructions (upper, idempotent)
  const upperStartTickIndex = getTickArrayStartTickIndex(initializableUpperTickIndex, whirlpool.data.tickSpacing);
  const [upperTickArrayPda] = await getTickArrayAddress(whirlpoolAddress, upperStartTickIndex);
  const initUpperTickArrayIx = getInitializeDynamicTickArrayInstruction({
    funder: createNoopSigner(vaultPda),
    whirlpool: whirlpoolAddress,
    startTickIndex: upperStartTickIndex,
    tickArray: upperTickArrayPda,
    idempotent: true,
  });

  const createTransactionIx = await createSquadsVaultTransactionInstruction(
    multisigPda,
    nextTransactionIndex,
    vaultIndex,
    proposerSigner.address,
    [openPositionIx, initLowerTickArrayIx, initUpperTickArrayIx],
    1, // num of ephemeralSigners
  );

  const signature = await buildAndSendTransaction([createTransactionIx], proposerSigner);
  console.info(`Transaction sent: ${signature}`);
}

main();
