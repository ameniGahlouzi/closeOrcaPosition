import * as dotenv from "dotenv";
import * as path from "path";
import { Keypair } from "@solana/web3.js";
import { readFile } from "mz/fs";
import { swap } from "./jupiter/jupiter-swap";
dotenv.config({ path: path.join(__dirname, ".env") });
const SOL="So11111111111111111111111111111111111111112"
const USDC="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
function SOL_to_USDC(wallet,amount) {
    swap(wallet,SOL,USDC,amount*10**9)

}

function USDC_to_SOL(wallet,amount) {
    swap(wallet,USDC,SOL,amount*10**6)

}

async function getWallet(){
    const secretKeyString = await readFile("./"+process.env.ANCHOR_WALLET, {
        encoding: "utf8",
    });
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const wallet = Keypair.fromSecretKey(secretKey);
    return wallet
}


getWallet()
.then(wallet=>{
    USDC_to_SOL(wallet,5) 
})