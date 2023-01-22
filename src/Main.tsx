import React, {useState, useEffect} from 'react';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import {Web3Modal, useWeb3Modal} from "@web3modal/react";
import {configureChains, createClient, WagmiConfig, useAccount} from "wagmi";
import {mainnet} from "wagmi/chains";
import {getApps} from "firebase/app";
import {collection, doc, getFirestore, setDoc} from "firebase/firestore";
import {useParams} from "react-router-dom";

const Main = () => {
  const [firstOpen, setFirstOpen] = useState(true);

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

  const {open, isOpen} = useWeb3Modal();

  const {address} = useAccount();

  useEffect(() => {
    setTimeout(() => {
      open();
      setFirstOpen(false);
    }, 500);
  }, []);

  const {uid} = useParams();
  console.log(uid)

  const saveAddress = () => {
    const app = getApps();
    const db = getFirestore(app[0]);
    const collectionRef = collection(db, 'user_wallet_address');
    setDoc(doc(collectionRef, uid), {
      wallet_address: address || ''
    })
  }

  useEffect(() => {
    if (!firstOpen) {
      saveAddress();
    }
  }, [address]);

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <>
          {
            (!isOpen && !firstOpen) &&
            <div style={{textAlign: 'center'}}>
              <h1>Please go back to COQUIZ APP</h1>
            </div>
          }
        </>
      </WagmiConfig>

      <Web3Modal
        projectId="dccff4a005c3731fbd4bce50f884a8ad"
        ethereumClient={ethereumClient}
      />
    </>
  );
}

export default Main;
