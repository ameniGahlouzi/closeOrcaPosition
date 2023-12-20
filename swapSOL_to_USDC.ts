import { OrcaPoolConfig } from "@orca-so/sdk";
import { setupForSwap } from "./setup";
import Decimal from "decimal.js";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.join(__dirname, ".env") });

export const swapSOL_to_USDC = async (amount:number) => {
    /*** Setup ***/
    let cntx = await setupForSwap()
    let USDCAmount: any;

    try {
      console.log("\nstart swap from sol to usdc")
      const solUSDCPool = cntx.orca.getPool(OrcaPoolConfig.SOL_USDC);
      const solToken = solUSDCPool.getTokenA();
      const solAmount = new Decimal(amount);
      const quote = await solUSDCPool.getQuote(solToken, solAmount);
      USDCAmount = quote.getMinOutputAmount();
  
      const swapPayload = await solUSDCPool.swap(cntx.owner, solToken, solAmount, USDCAmount);
      const swapTxId = await swapPayload.execute();
      console.log("====>signature:", swapTxId, "\n");
      return USDCAmount.toNumber();
    } catch (err) {
      console.warn(err);
      return USDCAmount?.toNumber();
    }
};


//swapSOL_to_USDC(0.05)