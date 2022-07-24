import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

import dotenv from "dotenv";
dotenv.config();

const rinkebyPrivateKey = process.env.PRIVATE_KEY;
const alchemyPrivateKey = process.env.ALCHEMY_API_URL;
const walletAddress = process.env.WALLET_ADDRESS;

if (!rinkebyPrivateKey || rinkebyPrivateKey === "") {
  console.log("Private Key not found");
}

if (!alchemyPrivateKey || alchemyPrivateKey === "") {
  console.log("Alchemy API key not found");
}

if (!walletAddress || walletAddress === "") {
  console.log("Wallet address not found");
}

const provider = new ethers.providers.JsonRpcProvider(alchemyPrivateKey);
const wallet = new ethers.Wallet(rinkebyPrivateKey, provider);

const sdk = new ThirdwebSDK(wallet);

// const init = async () => {
//   try {
//     const address = await sdk.getSigner().getAddress();
//     console.log("👋 SDK initialized at address: ", address);
//   } catch (e) {
//     console.log(e);
//     process.exit(1);
//   }
// };

// init();

(async () => {
  try {
    const address = await sdk.getSigner().getAddress();
    console.log("👋 SDK initialized at address: ", address);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();

export default sdk;
