// Importing metamask functionality from thirdweb
import { useAddress, useMetamask, useEditionDrop } from '@thirdweb-dev/react';
import { useState, useEffect } from 'react';

const App = () => {
  // use the hooks that were imported via thirdweb
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("Hi Address:", address);
  
  // initialize the editionDrop contract
  const editionDrop = useEditionDrop("0xA3BBB310D49b1B25B92D2eBD8d06D171A2B04296");
  // state variable for us to know if user has the NFT
  const [hasClaimedNFT, setHasClaimedNFT ] = useState(false);
  // is claiming lets us keep a loading state while NFT is minting
  const [isClaiming, setIsClaiming] = useState(false);

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
        <h1>Welcome to SwoleDao</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          connect your wallet bro
        </button>
      </div>
    );
  }
  
  if (hasClaimedNFT) {
    return (
      <div className='member-page'>
        <h1>SwoleDAO Member Page</h1>
        <p>Congrats on being a member bro</p>
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
