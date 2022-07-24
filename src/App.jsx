import { useAddress, useMetamask, useDisconnect, useEditionDrop } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

const App = () => {
  const [hasNFT, setHasNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectMetamask = useDisconnect();
  console.log("👋 Public address: ", address);

  const editionDrop = useEditionDrop("0x8eab038128f59937C718B8389A3bfD17eE2195F2");


  useEffect(() => {
    if(!address) return;

    const checkBalance = async () => {
      try {
        const nftBalance = await editionDrop.balanceOf(address, 0);

        if(nftBalance.gt(0)) {
          setHasNFT(true);
          console.log("🌟 This person has membership NFT.");
        } else {
          console.log("😭 This person doesnot have membership NFT");
        }
      } catch(e) {
        setHasNFT(false);
        console.log(e);
      }
    }
    checkBalance();

  }, [address, editionDrop]);
  
  const mintNFT = async() => {
    try {
      setIsClaiming(true);
      const what = await editionDrop.claim("0", 1);
      console.log(`✅ Successfully minted! Check it out on Opensea: https:testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasNFT(true);
    } catch(e) {
      setIsClaiming(false);
      console.log(e);
    } finally {
      setIsClaiming(false);
    }
  }

  if(!address) {
    return (
      <div className="landing">
        <h1>Welcome to MetalDAO</h1>
        <button onClick={connectWithMetamask}>
          Connect your wallet
        </button>
      </div>
    )
  }

  if(hasNFT) {
    return (
      <div className="landing">
        <h1>This the DAO Dashboard</h1>
        <p>Congratulations on joining!</p>
        <button onClick={disconnectMetamask}>
          Disconnect wallet
        </button>
      </div>
    )
  }
  
  return (
    <div className="landing">
      <h1>
        Mint your NFT to be a member!
      </h1>
      <button onClick={mintNFT} disabled={isClaiming}>
        {isClaiming ? "Minting..." : "Mint your NFT (FREE)"}
      </button>
      <button onClick={disconnectMetamask}>
        Disconnect Wallet
      </button>
    </div>
  );
};

export default App;
