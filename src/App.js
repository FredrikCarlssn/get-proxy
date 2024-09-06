import React, { useState } from "react";
import Web3 from "web3";
import "./App.css";

function App() {
  const [web3, setWeb3] = useState(null);
  const [proxyAddress, setProxyAddress] = useState("");
  const [realAddress, setRealAddress] = useState("");
  const [rpcUrl, setRpcUrl] = useState("");

  const initWeb3 = async () => {
    if (rpcUrl) {
      try {
        const web3Instance = new Web3(new Web3.providers.HttpProvider(rpcUrl));
        setWeb3(web3Instance);
        return web3Instance;
      } catch (error) {
        console.error("Error initializing Web3:", error);
        alert("Failed to initialize Web3. Please check your RPC URL.");
        return null;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let web3Instance = web3;
    if (!web3Instance) {
      web3Instance = await initWeb3();
      if (!web3Instance) {
        alert("Web3 is not initialized. Please enter a valid RPC URL.");
        return;
      }
    }

    const storagePosition =
      "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
    try {
      let address = await web3Instance.eth.getStorageAt(
        proxyAddress,
        storagePosition
      );
      // Remove leading zeros and '0x' prefix
      address = "0x" + address.slice(26);
      setRealAddress(address);
    } catch (error) {
      console.error("Error fetching real address:", error);
      setRealAddress("Error: Unable to fetch real address");
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Proxy Address Resolver</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={rpcUrl}
            onChange={(e) => setRpcUrl(e.target.value)}
            placeholder="Enter RPC URL"
          />
          <input
            type="text"
            value={proxyAddress}
            onChange={(e) => setProxyAddress(e.target.value)}
            placeholder="Enter proxy address"
          />
          <button type="submit">Resolve</button>
        </form>
        {realAddress && (
          <div className="result">
            <h2>Real Address:</h2>
            <p>{realAddress}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
