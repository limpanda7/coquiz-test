import React, {useEffect, useState} from "react";
import {mainnet} from "wagmi/chains";
import {configureChains, createClient, useAccount, WagmiConfig} from "wagmi";
import {EthereumClient, modalConnectors, walletConnectProvider} from "@web3modal/ethereum";
import {useWeb3Modal, Web3Modal} from "@web3modal/react";
import {initializeApp} from "firebase/app";
import {collection, doc, getFirestore, setDoc} from "firebase/firestore";
import queryString from "query-string";

const firebaseConfig = {
  apiKey: "AIzaSyA4AZDvV_Exi4EarJ34_bzKfZSkRYpcn1s",
  authDomain: "coquiz-19d0e.firebaseapp.com",
  projectId: "coquiz-19d0e",
  storageBucket: "coquiz-19d0e.appspot.com",
  messagingSenderId: "1053063364183",
  appId: "1:1053063364183:web:a4875ad4a14e9d41b32d12",
  measurementId: "G-1N9TYREP0Q"
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

  useEffect(() => {
    const openModal = async() => {
      await open();
      setFirstOpen(false);
    }
    openModal();
  }, []);

  // firestore에 uid 및 지갑주소 저장
  // uid는 url 파라미터로 담겨서 온다
  const params = window.location.search;
  const {uid} = queryString.parse(params);
  const {address} = useAccount();

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
