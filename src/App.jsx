// Importing metamask functionality from thirdweb
import { useAddress, useMetamask, useEditionDrop, useToken, useVote, useNetwork } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import { AddressZero } from "@ethersproject/constants";
import { ChainId } from '@thirdweb-dev/sdk';

const App = () => {
  // use the hooks that were imported via thirdweb
  const address = useAddress();
  const network = useNetwork();
  const connectWithMetamask = useMetamask();
  console.log("Hi Address:", address);
  
// governance contract - 0xFB1671979373D97255eD96eD9D290e9Bd230ddeB

  // initialize the editionDrop contract
  const editionDrop = useEditionDrop("0xA3BBB310D49b1B25B92D2eBD8d06D171A2B04296");
  // token contract
  const token = useToken("0xc43cf0577E53Ba0b1854bD0196388B1282fde02b")
  // voting contract 
  const vote = useVote("0xFB1671979373D97255eD96eD9D290e9Bd230ddeB")
  // state variable for us to know if user has the NFT
  const [hasClaimedNFT, setHasClaimedNFT ] = useState(false);
  // is claiming lets us keep a loading state while NFT is minting
  const [isClaiming, setIsClaiming] = useState(false);
  // holds the amount of tokens each member has in state
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  // the array holding all of the member addresses
  const [memberAddresses, setMemberAddresses] = useState([]);

  // function for wallet readability
  const shortenAddress = (str) => {
    return str.substring(0,6) + "..." + str.substring(str.length - 4);
  };

  // setting up voting ability
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // get all existing proposals from the contract
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // call to vote.getAll to get all the proposals
    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        // after grabbing, set proposals (mapping) so we can render later
        setProposals(proposals);
        console.log("Proposals:", proposals);
      } catch (error) {
        console.log("failed to get proposals", error);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  // checking to ensure user hasn't voted already
  useEffect(() => {
    // if user has already claimed their NFT, want to display the internal DAO page
    if (!hasClaimedNFT) {
      return;
    }

    // if we haven't finished getting the proposals from useEffect, we can't check if there have been votes
    if (!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        // check if the address has voted on the first proposal
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log("User has already voted");
        } else {
          console.log("User hasn't voted");
        }
      } catch (error) {
        console.error("failed to check if wallet has voted", error);
      }
    };
    checkIfUserHasVoted();
  }, [hasClaimedNFT, proposals, address, vote]);

  // useEffect that grabs all members holding the NFT
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // like done in the airdrop file, grab the holders of tokenid 0
    // calling this to get all addresses of members who hold a NFT from the ERC 1155
    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log("Members of the gym", memberAddresses);
      } catch (error) {
        console.error("failed to get member list", error);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop.history]);

  // grabs the number of tokens each member holds (everyone on the ERC 20)
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("Amounts", amounts);
      } catch (error) {
        console.error("failed to get member balances", error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token.history]);

  // now we combine the memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      // checking if we are finding the address in the memberTokenAmounts array
      // if yes, return amounts of tokens the user has. Otherwise, 0
      const member = memberTokenAmounts?.find(({ holder }) => holder === address);

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    // if they don't have a connected wallet, exit
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        // check balance of to see if user owns the 0 tokenid NFT - views the blockchain / smart contract data
        const balance = await editionDrop.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("This user has a membership NFT!")
        } else {
          setHasClaimedNFT(false);
          console.log("This user does not have a membership NFT.")
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("Failed to get balance", error);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  // 
  const mintNft = async () => {
    try {
      // initializes the loading state to set up signer
      setIsClaiming(true);
      // mint the NFT to users wallet when they click the onclick button
      // passing 0 for the token id and 1 for the mint number
      await editionDrop.claim("0", 1);
      console.log(`Successfully minted! Check it out on OpenSea: https://testnest.opensea.io/assets/${editionDrop.getAddress()}/0`);
      // stops the loading state and sets to true for successful mint
      setHasClaimedNFT(true);
    } catch(error) {
      setHasClaimedNFT(false);
      console.error("failed to mint NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };

  // check to make sure wallet is conneted to correct network
  if (address && (network?.[0].data.chain.id !== ChainId.Rinkeby)) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp is designed to work on Rinkeby, please swtich networks to continue.
        </p>
      </div>
    );
  }

  // if user hasn't connected their wallet to the app,
  // then you allow a connectWallet call
  if (!address) {
    return (
      <div className = "landing">
        <h1>🏋️‍♀️ Swole DAO 🏋️</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          connect your wallet bro
        </button>
      </div>
    );
  }
  
  // if user has already claimed NFT, want to display internal DAO page to them
  // only dao members will see this, renders all of the members and token amounts
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>Members Only Room</h1>
        <p>Congrats bro 🤝 you made it in</p>
        <div>
          <div>
            <h2>🪪 Gym Members</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>🏋️‍♂️ Address</th>
                  <th>🏋️ Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
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
            <h2>📜 Gym Rules</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);

                // lets get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // first we need to make sure the user delegates their token to vote
                try {
                  //we'll check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await token.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await token.delegateTo(address);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await vote.get(proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return vote.vote(proposalId, _vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      })
                    );
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await vote.get(proposalId);

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      // and log out a success message
                      console.log("successfully voted");
                    } catch (err) {
                      console.error("failed to execute votes", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  }
                } catch (err) {
                  console.error("failed to delegate tokens");
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
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
      </div>
    );
  };


  // render mint nft screen
  return (
    <div className="mint-nft">
      <h1>Get your free gym pass NFT! 🏋️‍♀️</h1>
      <button
      disabled={isClaiming}
      onClick={mintNft}
      >
        {isClaiming ? "Minting..." : "Mint your free NFT!"}
      </button>
    </div>
  );
}
  
  export default App;
