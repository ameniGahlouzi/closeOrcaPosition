import { getPositionPda, toX64 } from "@orca-so/whirlpool-client-sdk";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";



export async function getPositionAddressFromNFTMint(nftMintAddress:string): Promise<any> {  
    const PROGRAM_ID = new PublicKey("whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc");
    const mint = new PublicKey(nftMintAddress)
    const positionPda = getPositionPda(PROGRAM_ID, mint);
    return positionPda.publicKey.toBase58();
}