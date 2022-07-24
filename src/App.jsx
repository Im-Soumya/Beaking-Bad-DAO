import { useAddress, useMetamask, useDisconnect } from "@thirdweb-dev/react";

const App = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectMetamask = useDisconnect();
  console.log("👋 Public address: ", address);
  
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
  
  return (
    <div className="landing">
      <h1>
        👀 wallet connected
        now what?
      </h1>
      <button onClick={disconnectMetamask}>
        Disconnect Wallet
      </button>
    </div>
  );
};

export default App;
