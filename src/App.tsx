import {BrowserRouter, Route, Routes} from "react-router-dom";
import Modal from "./Modal";
import {initializeApp} from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyASfhe2jcjVIjSK89sIDRwFHzYIBNLqnlU",
  authDomain: "coquiztest.firebaseapp.com",
  projectId: "coquiztest",
  storageBucket: "coquiztest.appspot.com",
  messagingSenderId: "455002882220",
  appId: "1:455002882220:web:c30c8ea7baf200e5969f09"
};

initializeApp(firebaseConfig);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='modal/:uid' element={<Modal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
