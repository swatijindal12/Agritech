import React,{useEffect} from 'react';
import './App.css';

// External module exports.
import Web3 from 'web3';

const App = () => {

  // Checking for web3 connection.
  useEffect(() => {
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545")
    console.log("web3 : " ,web3);
  }, [])
  
  return (
    <div className="App">
        <h1>Welcome !</h1>
    </div>
  );
}

export default App;
