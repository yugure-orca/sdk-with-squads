import { AccountRole, Address, address, IInstruction } from "@solana/kit";
import { Connection, PublicKey, TransactionInstruction, TransactionMessage } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";

export async function getNextTransactionIndex(web3jsConnection: Connection, multisigPda: Address): Promise<number> {
  const web3jsMultisigPda = new PublicKey(multisigPda);

  const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(web3jsConnection, web3jsMultisigPda);
  const currentTransactionIndex = Number(multisigInfo.transactionIndex);
  const nextTransactionIndex = currentTransactionIndex + 1;

  return nextTransactionIndex;
}

export function getTransactionPda(multisigPda: Address, transactionIndex: number): Address {
  const web3jsMultisigPda = new PublicKey(multisigPda);
  const [transactionPda] = multisig.getTransactionPda({
    multisigPda: web3jsMultisigPda,
    index: BigInt(transactionIndex),
  });
  return address(transactionPda.toBase58());
}

export function getVaultPda(multisigPda: Address, vaultIndex: number): Address {
  const web3jsMultisigPda = new PublicKey(multisigPda);
  const [vaultPda] = multisig.getVaultPda({
    multisigPda: web3jsMultisigPda,
    index: vaultIndex,
  });
  return address(vaultPda.toBase58());
}

export function getEphemeralSignerPda(transactionPda: Address, ephemeralSignerIndex: number): Address {
  const web3jsTransactionPda = new PublicKey(transactionPda);
  const [ephemeralSignerPda] = multisig.getEphemeralSignerPda({
    transactionPda: web3jsTransactionPda,
    ephemeralSignerIndex,
  });
  return address(ephemeralSignerPda.toBase58());
}

export async function createSquadsVaultTransactionInstruction(
  multisigPda: Address,
  nextTransactionIndex: number,
  vaultIndex: number,
  proposer: Address,
  instructions: IInstruction[],
  ephemeralSigners: number = 0,
): Promise<IInstruction> {
  const web3jsMultisigPda = new PublicKey(multisigPda);
  const web3jsProposer = new PublicKey(proposer);
  const web3jsVaultPda = new PublicKey(getVaultPda(multisigPda, vaultIndex));

  const web3jsInstructions = instructions.map(convertKitInstructionToWeb3jsInstruction);
  const transactionMessage = new TransactionMessage({
    payerKey: web3jsVaultPda, // vault must be the payer
    recentBlockhash: "3SbA3GcdQFgVLAcUytFXWfDzYBBWLUqf52y27Q6nHkCD", // dummy
    instructions: web3jsInstructions,
  });

  const ix = await multisig.instructions.vaultTransactionCreate({
    multisigPda: web3jsMultisigPda,
    transactionIndex: BigInt(nextTransactionIndex),
    creator: web3jsProposer,
    vaultIndex,
    ephemeralSigners,
    transactionMessage,
  });

  return convertWeb3jsInstructionToKitInstruction(ix);
}

function convertKitInstructionToWeb3jsInstruction(instruction: IInstruction): TransactionInstruction {
  const web3jsProgramId = new PublicKey(instruction.programAddress);
  const web3jsKeys = instruction.accounts.map((a) => ({
    pubkey: new PublicKey(a.address),
    isSigner: a.role === AccountRole.READONLY_SIGNER || a.role === AccountRole.WRITABLE_SIGNER,
    isWritable: a.role === AccountRole.WRITABLE || a.role === AccountRole.WRITABLE_SIGNER,
  }));
  const web3jsData = Buffer.from(instruction.data);
  return new TransactionInstruction({
    programId: web3jsProgramId,
    keys: web3jsKeys,
    data: web3jsData,
  });
}

function convertWeb3jsInstructionToKitInstruction(instruction: TransactionInstruction): IInstruction {
  const kitProgramId = address(instruction.programId.toBase58());
  const kitAccounts = instruction.keys.map((k) => {
    const role = [
      AccountRole.READONLY,
      AccountRole.WRITABLE,
      AccountRole.READONLY_SIGNER,
      AccountRole.WRITABLE_SIGNER,
    ][(k.isSigner ? 2 : 0) + (k.isWritable ? 1 : 0)];
    return {
      role,
      address: address(k.pubkey.toBase58()),
    };
  });
  const kitData = Uint8Array.from(instruction.data);
  return {
    programAddress: kitProgramId,
    accounts: kitAccounts,
    data: kitData,
  };
}
