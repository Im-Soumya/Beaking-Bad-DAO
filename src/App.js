import {
  useAddress,
  useMetamask,
  useDisconnect,
  useEditionDrop,
  useToken,
  useVote,
  useNetwork,
} from "@thirdweb-dev/react";
import { ChainId } from "@thirdweb-dev/sdk";
import { useEffect, useMemo, useState } from "react";
import { AddressZero } from "@ethersproject/constants";
import { SiHiveBlockchain } from "react-icons/si";
import { BsArrowRightShort } from "react-icons/bs";
import { GiAmethyst } from "react-icons/gi";
import { FaTwitter } from "react-icons/fa";
import { BsGithub } from "react-icons/bs";
import twitterLogo from "./assets/twitter-logo.svg";

const App = () => {
  const editionDrop = useEditionDrop(
    "0x6dEE70a5a86Ce10AF077ae2e8c5820D7Be61C75f"
  );
  const token = useToken("0x11060ADb42C4E60244088012f4bD2ae93F909AA5");
  const vote = useVote("0x6D6d2b6832e8BDE7f2cdBc70C6194C90c6388599");

  const [hasNFT, setHasNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const [membersTokenAmts, setMembersTokenAmts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const [isRinkeby, setIsRinkeby] = useState(true);

  const address = useAddress();
  const network = useNetwork();
  const connectWithMetamask = useMetamask();
  const disconnectMetamask = useDisconnect();

  // console.log("👋 Public address: ", address);

  useEffect(() => {
    if (!address) return;

    const checkBalance = async () => {
      try {
        const nftBalance = await editionDrop.balanceOf(address, 0);

        if (nftBalance.gt(0)) {
          setHasNFT(true);
          console.log("This person has membership NFT.");
        } else {
          setHasNFT(false);
          console.log("This person doesnot have membership NFT");
        }
      } catch (e) {
        setHasNFT(false);
        console.log(e);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  useEffect(() => {
    if (!hasNFT) return;

    const getAllAddresses = async () => {
      try {
        const memberAddresses =
          await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log("Member addresses", memberAddresses);
      } catch (e) {
        console.log("Failed to get all addresses", e);
      }
    };
    getAllAddresses();
  }, [hasNFT, editionDrop.history]);

  useEffect(() => {
    if (!hasNFT) return;

    const getAllBalances = async () => {
      try {
        const memberBalances = await token.history.getAllHolderBalances();
        setMembersTokenAmts(memberBalances);
        console.log("Amount of tokens", memberBalances);
      } catch (e) {
        console.log("Failed to get token balances of members", e);
      }
    };
    getAllBalances();
  }, [hasNFT, token.history]);

  useEffect(() => {
    if (!hasNFT) return;

    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
      } catch (e) {
        console.log("Failed to get all proposals", e);
      }
    };
    getAllProposals();
  }, [hasNFT, vote]);

  useEffect(() => {
    if (!hasNFT) return;
    if (!proposals.length) return;

    const checkIfUserVote = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId);
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log("The user already voted");
        } else {
          console.log("The user didnot vote");
        }
      } catch (e) {
        console.log("Failed to check if the user voted", e);
      }
    };
    checkIfUserVote();
  }, [hasNFT, proposals, address, vote]);

  const membersList = useMemo(() => {
    return memberAddresses.map((address) => {
      const member = membersTokenAmts?.find(({ holder }) => holder === address);

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      };
    });
  }, [memberAddresses, membersTokenAmts]);

  const mintNFT = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(
        `Successfully minted! Check it out on Opensea: https:testnets.opensea.io/assets/${editionDrop.getAddress()}/0`
      );
      setHasNFT(true);
    } catch (e) {
      setIsClaiming(false);
      console.log(e);
    } finally {
      setIsClaiming(false);
    }
  };

  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsVoting(true);

    const votes = proposals.map((proposal) => {
      const results = {
        proposalId: proposal.proposalId,
        vote: 2,
      };

      proposal.votes.forEach((vote) => {
        const radioEl = document.getElementById(
          proposal.proposalId + "-" + vote.type
        );

        if (radioEl.checked) {
          results.vote = vote.type;
          return;
        }
      });
      return results;
    });

    try {
      const delegation = await token.getDelegationOf(address);

      if (delegation === AddressZero) {
        await token.delegateTo(address);
      }

      try {
        await Promise.all(
          votes.map(async ({ proposalId, vote: _vote }) => {
            const proposal = await vote.get(proposalId);

            if (proposal.state === 1) {
              return vote.vote(proposalId, _vote);
            }

            return;
          })
        );

        try {
          await Promise.all(
            votes.map(async ({ proposalId }) => {
              const proposal = await vote.get(proposalId);

              if (proposal.state === 4) {
                return vote.execute(proposalId);
              }

              return;
            })
          );

          setHasVoted(true);
          console.log("Successfully voted on the proposal.");
        } catch (e) {
          console.log("Failed to execute proposal", e);
        }
      } catch (e) {
        console.log("Failed to cast vote", e);
      }
    } catch (e) {
      console.log("Failed to delegate tokens", e);
    } finally {
      setIsVoting(false);
    }
  };

  if (address && network?.[0].data.chain.id !== ChainId.Rinkeby) {
    return (
      <div className="flex flex-col items-center justify-center h-screen ml-230">
        <h1 className="text-5xl font-semibold">
          Please change your network to Rinkeby
        </h1>
        <h3 className="text-2xl font-medium py-5">
          This dApp only works on Rinkeby chain 🙂
        </h3>
      </div>
    );
  }

  const renderNav = () => {
    return (
      <div className="top-0 absolute w-full flex items-center justify-between py-7 px-28">
        <div className="flex items-center">
          <GiAmethyst className="text-2xl text-ocean-green mr-3" />
          <h2 className="text-lg font-semibold">BB DAO</h2>
        </div>
        <div className="flex items-center">
          <a
            className="bg-slate-800 p-2 rounded-md hover:text-ocean-green duration-150"
            href="https://github.com/Im-Soumya/my-dao"
            target="_blank"
            rel="noreferrer"
          >
            <BsGithub className="text-2xl" />
          </a>
          <SiHiveBlockchain className="text-xl mr-2 ml-7" />
          <h2 className="mr-4 text-md font-medium">Rinkeby</h2>
        </div>
      </div>
    );
  };

  const footer = () => {
    return (
      <div className="bottom-0 absolute flex w-full justify-center">
        <div className="pr-4 flex items-center font-medium hover:-translate-y-1 duration-100 hover:underline">
          <img
            alt="twitter-logo"
            className="w-9 h-9 object-contain"
            src={twitterLogo}
          />
          <a
            href="https://twitter.com/_buildspace"
            target="_blank"
            rel="noreferrer"
          >
            built on @_buildspace
          </a>
        </div>
        <div className="flex items-center font-medium hover:-translate-y-1 duration-100 hover:underline">
          <img
            alt="twitter-logo"
            className="w-9 h-9 object-contain"
            src={twitterLogo}
          />
          <a
            href="https://twitter.com/iamsoumyass"
            target="_blank"
            rel="noreferrer"
          >
            built by @iamsoumyass
          </a>
        </div>
      </div>
    );
  };

  if (!address) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>
          {renderNav()}
          <h1 className="text-7xl font-bold ml-80">A DAO for the fans of</h1>
          <h1 className="pb-3 text-7xl font-bold ml-460 text-transparent bg-clip-text  bg-gradient-to-r from-indigo-500 via-blue-400 to-violet-500 background-animate">
            Breaking Bad
          </h1>
          <h3 className="text-3xl mt-6 font-medium ml-460">
            We're in the empire business! 👑
          </h3>
          <div className="flex items-center w-full ml-470 mt-11">
            <button
              onClick={connectWithMetamask}
              className="flex items-center py-4 pl-7 pr-5 text-lg text-gray-900 text-center font-semibold rounded-md bg-ocean-green hover:bg-opacity-90 duration-150"
            >
              Connect Wallet
              <span>
                <BsArrowRightShort className="ml-1 text-3xl" />
              </span>
            </button>
            <a
              className="flex items-center py-4 px-14 ml-7 bg-slate-800 text-white font-semibold rounded-md hover:bg-slate-700 duration-150 text-lg"
              href="https://github.com/Im-Soumya/my-dao"
              target="_blank"
              rel="noreferrer"
            >
              <span>
                <BsGithub className="mr-3" />
              </span>
              Github
            </a>
          </div>
          {footer()}
        </div>
      </div>
    );
  }

  if (hasNFT) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="top-0 absolute w-full flex items-center py-3 pl-247">
          <div className="flex items-center">
            <GiAmethyst className="text-2xl text-ocean-green mr-3" />
            <h2 className="text-lg font-semibold whitespace-nowrap">BB DAO</h2>
          </div>
          <div className="flex items-center ml-345">
            <div className="ml-96 bg-slate-800 p-2 rounded-md hover:text-ocean-green duration-150">
              <a
                href="https://twitter.com/iamsoumyass"
                rel="noreferrer"
                target="_blank"
              >
                <FaTwitter className="text-xl" />
              </a>
            </div>
            <SiHiveBlockchain className="text-xl ml-4 mr-2" />
            <h2 className="mr-4 text-md font-medium">Rinkeby</h2>
            <button
              className="text-md font-medium py-2 px-3 rounded-md my-4 whitespace-nowrap bg-slate-800 text-white hover:bg-slate-700 duration-100"
              onClick={disconnectMetamask}
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
        <h1 className="text-6xl font-semibold ml-253 mt-24">
          💎 Welcome to{" "}
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-600 to-sky-500">
            Our Territory
          </span>
        </h1>
        <p className="text-lg font-medium py-4 ml-290 mb-3">
          Congratulations! Now let's cook some mETH?👀
        </p>
        <div className="flex flex-row ml-230">
          <div className="flex flex-col items-center mr-16 px-8">
            <h2 className="text-xl font-semibold ml-3 mb-2">Member List</h2>
            <div className="bg-gray-300 text-slate-900 pl-7 pr-5 py-3 rounded-md shadow-md">
              <table>
                <thead>
                  <tr>
                    <th>Address</th>
                    <th className="whitespace-nowrap pl-8">Token Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {membersList.map((member) => {
                    return (
                      <tr key={member.address}>
                        <td>{shortenAddress(member.address)}</td>
                        <td className="pl-14">{member.tokenAmount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col items-center w-96">
            <h2 className="text-xl font-semibold mb-2">Active Proposals</h2>
            <form onSubmit={(e) => handleSubmit(e)}>
              {proposals.map((proposal) => (
                <div
                  key={proposal.proposalId}
                  className="flex flex-col shadow-md px-6 py-3 bg-gray-300 text-slate-900 rounded-md mb-3"
                >
                  <h5 className="font-semibold pb-3">{proposal.description}</h5>
                  <div className="flex flex-row justify-start">
                    {proposal.votes.map(({ type, label }) => (
                      <div className="pr-16 mb-2" key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                          defaultChecked={type === 2}
                          className="mr-2"
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex flex-col items-center">
                <button
                  className="py-3 rounded-md w-full text-lg font-semibold mt-1 mb-3 bg-ocean-green text-slate-900 hover:bg-opacity-90 duration-150"
                  disabled={isVoting || hasVoted}
                  type="submit"
                >
                  {isVoting
                    ? "Voting..."
                    : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
                </button>
                {!hasVoted && (
                  <small>
                    This will trigger multiple transactions that you will need
                    to sign.
                  </small>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="top-0 absolute w-full flex items-center justify-between py-3 pl-56">
        <div className="flex items-center">
          <GiAmethyst className="text-2xl text-ocean-green mr-3" />
          <h2 className="text-lg font-semibold whitespace-nowrap">BB DAO</h2>
        </div>
        <div className="flex items-center ml-345">
          <SiHiveBlockchain className="text-xl ml-96 mr-2" />
          <h2 className="mr-4 text-md font-medium">Rinkeby</h2>
          <button
            className="text-md font-medium py-2 px-3 rounded-md my-4 whitespace-nowrap bg-slate-800 text-white hover:bg-slate-700 duration-100"
            onClick={disconnectMetamask}
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
      <h1 className="text-6xl font-semibold ml-64 my-4">
        Say{" "}
        <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-sky-400 to-rose-500 background-animate">
          his name
        </span>{" "}
        to be a member!
      </h1>
      <button
        className="ml-64 my-9 py-5 px-10 text-xl font-semibold rounded-md bg-ocean-green text-slate-900 duration-150"
        onClick={mintNFT}
        disabled={isClaiming}
      >
        {isClaiming ? "Minting..." : "Mint your NFT (FREE)"}
      </button>
      <div className="bottom-0 absolute flex w-full justify-center ml-60">
        <div className="pr-4 flex items-center font-medium hover:-translate-y-1 duration-100 hover:underline">
          <img
            alt="twitter-logo"
            className="w-9 h-9 object-contain"
            src={twitterLogo}
          />
          <a
            href="https://twitter.com/_buildspace"
            target="_blank"
            rel="noreferrer"
          >
            built on @_buildspace
          </a>
        </div>
        <div className="flex items-center font-medium hover:-translate-y-1 duration-100 hover:underline">
          <img
            alt="twitter-logo"
            className="w-9 h-9 object-contain"
            src={twitterLogo}
          />
          <a
            href="https://twitter.com/iamsoumyass"
            target="_blank"
            rel="noreferrer"
          >
            built by @iamsoumyass
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
