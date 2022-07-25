import { useAddress, useMetamask, useDisconnect, useEditionDrop, useToken, useVote } from "@thirdweb-dev/react";
import { useEffect, useMemo, useState } from "react";
import {AddressZero} from "@ethersproject/constants";

const App = () => {
  const editionDrop = useEditionDrop("0x59BCB6F1D92154ED8A881F2E9b1afBC113f9b06E");
  const token = useToken("0x6c57726C77467aC95CA9476d1e5658B9133f24Fd");
  const vote = useVote("0x0a5Adb1911832484d97C96e6DC9FB47E776142c1");

  const [hasNFT, setHasNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const [membersTokenAmts, setMembersTokenAmts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);
  
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectMetamask = useDisconnect();
  console.log("👋 Public address: ", address);

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
    if(!hasNFT) return;

    const getAllBalances = async () => {
      try {
        const memberBalances = await token.history.getAllHolderBalances();
        setMembersTokenAmts(memberBalances);
        console.log("Amount of tokens", memberBalances);
      } catch(e) {
        console.log("Failed to get token balances of members", e);
      }
    }
    getAllBalances();

  }, [hasNFT, token.history])

  useEffect(() => {
    if(!hasNFT) return;

    const getAllProposals = async () => {
      try {
        const allProposals = await vote.getAll();
        setProposals(allProposals);
        console.log("All proposals: ", allProposals);
        console.log(allProposals[0])
      } catch(e) {
        console.log("Failed to get all proposals", e);
      }
    }
    getAllProposals();

  }, [hasNFT, vote])

  useEffect(() => {
    if(!hasNFT) return;
    if(!proposals.length) return;

    const checkIfUserVote = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasNFT(hasVoted);
        if(hasVoted) {
          console.log("The user already voted");
        } else {
          console.log("The user didnot vote");
        }
      } catch(e) {
        console.log("Failed to check if the user voted", e);
      }
    }
    checkIfUserVote();

  }, [hasNFT, address, proposals, vote])

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsVoting(true);

    const votes = proposals.map(proposal => {
      const results = {
        proposalId: proposal.proposalId,
        vote: 2,
      }

      proposal.votes.forEach(vote => {
        const radioEl = document.getElementById(proposal.proposalId + "-" + vote.type);

        if(radioEl.checked) {
          results.vote = vote.type;
          return;
        }
      })
      return results;
    })

    try {
      const delegation = await token.getDelegationOf(address);
      
      if(delegation === AddressZero) {
        await token.delegateTo(address);
      }

      try {
        await Promise.all(
          votes.map(async ({proposalId, vote: _vote}) => {
            const proposal = await vote.get(proposalId);

            if(proposal.state === 1) {
              return vote.vote(proposalId, _vote);
            }

            return;
          })
        )

        try {
          await Promise.all(
            votes.map(async ({proposalId}) => {
              const proposal = await vote.get(proposalId);

              if(proposal.state === 4) {
                return vote.execute(proposalId);
              }

              return;
            })
          )

          setHasVoted(true);
          console.log("✅ Successfully voted on the proposal.");
        } catch(e) {
          console.log("Failed to execute proposal", e);
        }
      } catch(e) {
        console.log("Failed to cast vote", e);
      }
    } catch(e) {
      console.log("Failed to delegate tokens", e);
    } finally {
      setIsVoting(false);
    }
  }

  if (hasNFT) {
    return (
      <div className="member-page">
        <h1>🍪DAO Member Page</h1>
        <p>Congratulations on being a member</p>
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
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={(e) => handleSubmit(e)}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                          //default the "abstain" vote to checked
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
              </button>
              {!hasVoted && (
                <small>
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
            </form>
          </div>
        </div>
          <button onClick={disconnectMetamask}>Disconnect Wallet</button>
      </div>
    );
  };
  
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
