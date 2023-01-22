import React, {useEffect, useState} from "react";
import {mainnet} from "wagmi/chains";
import {configureChains, createClient, useAccount, WagmiConfig} from "wagmi";
import {EthereumClient, modalConnectors, walletConnectProvider} from "@web3modal/ethereum";
import {useWeb3Modal, Web3Modal} from "@web3modal/react";
import {initializeApp} from "firebase/app";
import {collection, doc, getFirestore, setDoc} from "firebase/firestore";
import queryString from "query-string";

const firebaseConfig = {
  apiKey: "AIzaSyASfhe2jcjVIjSK89sIDRwFHzYIBNLqnlU",
  authDomain: "coquiztest.firebaseapp.com",
  projectId: "coquiztest",
  storageBucket: "coquiztest.appspot.com",
  messagingSenderId: "455002882220",
  appId: "1:455002882220:web:c30c8ea7baf200e5969f09"
};

const app = initializeApp(firebaseConfig);

const App = () => {
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

  const params = window.location.search;
  const {uid} = queryString.parse(params);
  console.log(uid);

  const saveAddress = () => {
    const db = getFirestore(app);
    const collectionRef = collection(db, 'user_wallet_address');
    setDoc(doc(collectionRef, uid as string), {
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

export default App;
