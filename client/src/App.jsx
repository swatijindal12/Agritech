import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import configStore from "./redux/store";
import Routing from "./Routing";

// External module exports.
import Web3 from "web3";

const { store, persistor } = configStore();

const App = () => {
  // Checking for web3 connection.

  useEffect(() => {
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    console.log("web3 : ", web3);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Routing />
      </PersistGate>
    </Provider>
  );
};

export default App;
