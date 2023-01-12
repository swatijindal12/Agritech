import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  redirect,
} from "react-router-dom";

// External module exports.
import Web3 from "web3";
import Login from "./components/auth/Login";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import CreateContract from "./components/company/CreateContract";
import Dashboard from "./components/company/Dashboard";
import Farms from "./components/company/Farms";

const App = () => {
  // Checking for web3 connection.

  const [showSidebar, setShowSidebar] = useState(false);
  const [user, setUser] = useState(true);

  useEffect(() => {
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    console.log("web3 : ", web3);
    if (!user) {
      redirect("/login");
    }
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <Router>
      {user && (
        <>
          <Sidebar show={showSidebar} toggle={toggleSidebar} />
          <Navbar toggleSidebar={toggleSidebar} />
        </>
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/farms" element={<Farms />} />
        <Route path="/create-contract" element={<CreateContract />} />
      </Routes>
    </Router>
  );
};

export default App;
