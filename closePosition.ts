import { PublicKey } from "@solana/web3.js";
import {
  WhirlpoolContext, buildWhirlpoolClient, ORCA_WHIRLPOOL_PROGRAM_ID,
} from "@orca-so/whirlpools-sdk";
import { AnchorProvider } from "@project-serum/anchor";
import { Percentage, TransactionBuilder } from "@orca-so/common-sdk";
import * as dotenv from "dotenv";
import * as path from "path";
import { getPositionAddressFromNFTMint } from "./getPositionAddressFromNFTMint";
dotenv.config({ path: path.join(__dirname, ".env") });


const closePosition = async (nftMintAddress:string) => {    
  const provider :any = AnchorProvider.env();
  const ctx = WhirlpoolContext.withProvider(provider, ORCA_WHIRLPOOL_PROGRAM_ID);
  const client = buildWhirlpoolClient(ctx);

  let positionAddress = await getPositionAddressFromNFTMint(nftMintAddress)

  
  const position_pubkey = new PublicKey(positionAddress);
  const position = await client.getPosition(position_pubkey);
  const whirlpool = await client.getPool(position.getData().whirlpool);

  const slippage = Percentage.fromFraction(10, 1000); // 1%    
  const transactionBuilder = new TransactionBuilder(provider);
  const close_tx = await whirlpool.closePosition(positionAddress,slippage)
  close_tx.map((ix) => transactionBuilder.addInstruction(ix.compressIx(true)));

  const signature = await transactionBuilder.buildAndExecute();
  console.log("signature==>",signature)
  const latest_blockhash = await ctx.connection.getLatestBlockhash();
  await ctx.connection.confirmTransaction({signature, ...latest_blockhash}, "confirmed");
};



closePosition("<you postion NFT>")

