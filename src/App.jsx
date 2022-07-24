import { useAddress, useMetamask, useDisconnect, useEditionDrop, useToken } from "@thirdweb-dev/react";
import { useEffect, useMemo, useState } from "react";

const App = () => {
  const [hasNFT, setHasNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const [membersTokenAmts, setMembersTokenAmts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);
  
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectMetamask = useDisconnect();
  console.log("👋 Public address: ", address);

  const editionDrop = useEditionDrop("0x59BCB6F1D92154ED8A881F2E9b1afBC113f9b06E");
  const token = useToken("0x6c57726C77467aC95CA9476d1e5658B9133f24Fd");

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

  useEffect(() => {
    if(!hasNFT) return; 

    const getAllAddresses = async () => {
        try {
          const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
          setMemberAddresses(memberAddresses);
          console.log("Member addresses", memberAddresses);
        } catch(e) {
          console.log("Failed to get all addresses", e);
        }
    }
    getAllAddresses();
    
  }, [hasNFT, editionDrop.history])
  
  useEffect(() => {
    try {
      const getAllTokenAmounts = async () => {
      const tokenAmounts = await token.history.getAllHolderBalances()
      setMembersTokenAmts(tokenAmounts);
      console.log("Tokens of all members ", tokenAmounts);
      }
      getAllTokenAmounts();
    } catch(e) {
      console.log("Failed to get all holders' token amount.");
    }
  }, [hasNFT, token.history])

  const membersList = useMemo(() => {
    return memberAddresses.map((address) => {
      const member = membersTokenAmts?.find(({holder}) => holder === address);

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    })
  }, [memberAddresses, membersTokenAmts])

  const mintNFT = async() => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(`✅ Successfully minted! Check it out on Opensea: https:testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasNFT(true);
    } catch(e) {
      setIsClaiming(false);
      console.log(e);
    } finally {
      setIsClaiming(false);
    }
  }

  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  }

  if(!address) {
    return (
      <div className="landing">
        <h1>Welcome to BBDAO</h1>
        <button onClick={connectWithMetamask}>
          Connect your wallet
        </button>
      </div>
    )
  }

  if(hasNFT) {
    return (
      <div className="landing">
        <h1>DAO Member Page</h1>
        <p>Congratulations on joining!</p>
        <div>
        <div>
          <h2>Member List</h2>
          <table className="card">
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {membersList.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
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
