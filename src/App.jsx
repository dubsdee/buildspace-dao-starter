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
  
  // in the case where we have the user's address, 
  // aka they've connected to our site
  return (
    <div className = "landing">
      <h1>wallet connected, welcome back bro</h1>
    </div>);
}

  export default App;
