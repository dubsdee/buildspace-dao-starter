// Importing metamask functionality from thirdweb
import { useAddress, useMetamask } from '@thirdweb-dev/react';

const App = () => {
  // use the hooks that were imported via thirdweb
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("Hi Address:", address);

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
