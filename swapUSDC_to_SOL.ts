import { OrcaPoolConfig } from "@orca-so/sdk";
import {setupForSwap } from "./setup";
import Decimal from "decimal.js";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.join(__dirname, ".env") });

export const swapUSDC_to_SOL = async (amount:number) => {
    /*** Setup ***/
   let cntx = await setupForSwap()
   let SOLAmount: any;
   try {
    console.log("\nstart swap from usdc to sol")
     const solUSDCPool = cntx.orca.getPool(OrcaPoolConfig.SOL_USDC);
     const usdcToken = solUSDCPool.getTokenB();
     const usdcAmount = new Decimal(amount);
     const quote = await solUSDCPool.getQuote(usdcToken, usdcAmount);
     SOLAmount = quote.getMinOutputAmount();
 
     const swapPayload = await solUSDCPool.swap(cntx.owner, usdcToken, usdcAmount, SOLAmount);
     const swapTxId = await swapPayload.execute();
     console.log("====>signature:", swapTxId, "\n");
     return SOLAmount.toNumber();
   } catch (err) {
     console.warn(err);
     return SOLAmount?.toNumber();
   }
 };

 //swapUSDC_to_SOL(5)
