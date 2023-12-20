import { Connection, PublicKey } from "@solana/web3.js";
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID } from "@orca-so/sdk";
import BN from "bn.js";



const USDC="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"


export class u64 extends BN {
  /**
   * Convert to Buffer representation
   */
  //@ts-ignore
  toBuffer(): typeof Buffer {
    const a = super.toArray().reverse();
    const b = Buffer.from(a);
    if (b.length === 8) {
      //@ts-ignore
      return b;
    }

    const zeroPad = Buffer.alloc(8);
    b.copy(zeroPad);
    //@ts-ignore
    return zeroPad;
  }

  /**
   * Construct a u64 from Buffer representation
   */
  static fromBuffer(buffer: typeof Buffer): u64 {
    return new u64(
      //@ts-ignore
      [...buffer]
        .reverse()
        .map(i => `00${i.toString(16)}`.slice(-2))
        .join(''),
      16,
    );
  }
}

export async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey> {
  return (
    await PublicKey.findProgramAddressSync(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0];
}



export async function getWalletTokenAccountBalance(wallet: PublicKey,mint:string) {
      try{
        let rpcUrl= "https://api.mainnet-beta.solana.com"
        const connection = new Connection(rpcUrl);
        let associatedAcc = await findAssociatedTokenAddress(
          wallet,
          new PublicKey(mint)
        );
        let info:any = await connection.getAccountInfo(associatedAcc)

        if (info) {
          const data = Buffer.from(info.data);
          const accountInfo = AccountLayout.decode(data);
          accountInfo.amount = u64.fromBuffer(accountInfo.amount);
          let amount = parseInt(accountInfo.amount.toString()) / 10**6;
          console.log("amount",amount)
        }
      }
      catch(error){
        console.log(error)
        return
      }
}


getWalletTokenAccountBalance(new PublicKey("B1fGkNTZCDGpByfSxfc9iegUAR62wBA97r1HfUqeTU6L"),USDC)
 