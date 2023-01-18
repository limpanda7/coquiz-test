import React from 'react';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import {Web3Modal, useWeb3Modal} from "@web3modal/react";
import {configureChains, createClient, WagmiConfig, useAccount} from "wagmi";
import {mainnet} from "wagmi/chains";

const App = () => {

  const chains = [mainnet];

  // Wagmi client
  const {provider} = configureChains(chains, [
    walletConnectProvider({projectId: 'dccff4a005c3731fbd4bce50f884a8ad'}),
  ]);
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({appName: "web3Modal", chains}),
    provider,
  });

  // Web3Modal Ethereum Client
  const ethereumClient = new EthereumClient(wagmiClient, chains);

  const {open} = useWeb3Modal();

  const { address } = useAccount();

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <>
          <button onClick={() => open()}>지갑연결</button>
          <div>연결된 주소: {address}</div>
        </>
      </WagmiConfig>

      <Web3Modal
        projectId="dccff4a005c3731fbd4bce50f884a8ad"
        ethereumClient={ethereumClient}
      />
    </>
  );
}

export default App;
