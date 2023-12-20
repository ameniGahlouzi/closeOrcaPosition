import axios from 'axios'
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.join(__dirname, ".env") });


export async function getBalance(accountAddress: any) {
    let rpcUrl= "https://api.mainnet-beta.solana.com"
    let paramaddress = {
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [accountAddress],
    };
    let balance: any;
    await axios
        .post(rpcUrl, paramaddress)
        .then((response: any) => {
            balance = parseFloat(response.data.result.value) / 1000000000;
        })
        .catch(async (error: any) => {
            console.log(error);
        });
        console.log(balance)
    return balance;
}

getBalance("B1fGkNTZCDGpByfSxfc9iegUAR62wBA97r1HfUqeTU6L")