import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import axios from 'axios';


export async function swap(wallet:Keypair,mint1: string, mint2: string, amount: number) {
  console.log("swap", { mint1 }, "to", { mint2 }, ":", { amount });
  let rpcUrl= "https://api.mainnet-beta.solana.com"
  const connection = new Connection(rpcUrl);
  try {
    const data = await (
      await fetch('https://quote-api.jup.ag/v4/quote?inputMint=' + mint1 + '&outputMint=' + mint2 + '&amount='+ amount +'&slippageBps=50'
      )
    ).json();
    const routes = data.data;
    if(!routes.length){
      throw "jupiter did not find any route"
    }
    
    let route0 = routes[0]

    if(!route0){
      console.log("no routes found")
      return await swap(wallet,mint1, mint2, amount)
    }

    const transactions = await (
      await fetch('https://quote-api.jup.ag/v4/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: route0,
          userPublicKey: wallet.publicKey.toString(),
          wrapUnwrapSOL: true,
        })
      })
    ).json().catch(error=>console.log("error**",error))


    const swapTransaction = transactions.swapTransaction;
    if(swapTransaction){
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      transaction.sign([wallet]);
      const rawTransaction = transaction.serialize()
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2
      });
      await connection.confirmTransaction(txid);
      console.log(`https://solscan.io/tx/${txid}`);
    }else{
      console.log("no transaction to process swap")
      return await swap(wallet,mint1, mint2, amount)
    }
    
  } catch (error) {
    //console.error("Error during swap:", error);
    return await swap(wallet,mint1, mint2, amount)
  }
}


