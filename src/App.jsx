// Importing metamask functionality from thirdweb
import { useAddress, useMetamask, useEditionDrop, useToken } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';

const App = () => {
  // use the hooks that were imported via thirdweb
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("Hi Address:", address);
  
  // initialize the editionDrop contract
  const editionDrop = useEditionDrop("0xA3BBB310D49b1B25B92D2eBD8d06D171A2B04296");
  // token contract
  const token = useToken("0xc43cf0577E53Ba0b1854bD0196388B1282fde02b")
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


  // if user hasn't connected their wallet to the app,
  // then you allow a connectWallet call
  if (!address) {
    return (
      <div className = "landing">
        <h1>Welcome to SwoleDAO</h1>
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
        <h1>SwoleDAO Member Page</h1>
        <p>Congrats bro you made it</p>
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
        </div>
      </div>
    );
  };


  // render mint nft screen
  return (
    <div className="mint-nft">
      <h1>Mint your free SwoleDAO Membership NFT!</h1>
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
