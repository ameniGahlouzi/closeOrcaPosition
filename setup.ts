import { Connection, Keypair } from "@solana/web3.js";
import { readFile } from "mz/fs";
import { getOrca } from "@orca-so/sdk";



export const setupForSwap= async ()=>{
    /*** Setup ***/
    // 1. Read secret key file to get owner keypair
    const secretKeyString = await readFile("./"+process.env.ANCHOR_WALLET, {
        encoding: "utf8",
    });
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const owner = Keypair.fromSecretKey(secretKey);

    // 2. Initialzie Orca object with mainnet connection
    let rpcUrl= "https://api.mainnet-beta.solana.com"
    //console.log("url for swap:",rpcUrl)
    const connection = new Connection(rpcUrl);
    const orca = getOrca(connection);
    return {orca,owner,connection,secretKeyString};
}