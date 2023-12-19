create a file .env in the project root
and fill it as below:

ANCHOR_PROVIDER_URL=https://api.mainnet-beta.solana.com
ANCHOR_WALLET=my-keypair.json


fill your  my-keypair.json file with the owner position account
add your nft possition address in the call of the function in the closePosition.ts

then run:
ts-node closePosition.ts

