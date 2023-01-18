import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  redirect,
  Navigate,
} from "react-router-dom";

// External module exports.
import Web3 from "web3";
import Login from "./components/auth/Login";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Buyers from "./components/company/Buyers";
import Profile from "./components/company/Buyers/Profile";
import Contracts from "./components/company/Contracts";
import CreateContract from "./components/company/CreateContract";
import Dashboard from "./components/company/Dashboard";
import Farmers from "./components/company/Farmers";
import Farms from "./components/company/Farms";

const App = () => {
  // Checking for web3 connection.

  const [showSidebar, setShowSidebar] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    console.log("web3 : ", web3);
    setUser(JSON.parse(localStorage.getItem("user")));
    if (!user && window.location.href.indexOf("login") === -1) {
      window.location.href = "/login";
    }
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      <Router>
        {user && (
          <>
            <Sidebar show={showSidebar} toggle={toggleSidebar} />
            <Navbar toggleSidebar={toggleSidebar} />
          </>
        )}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/farms" element={<Farms />} />
          <Route path="/create-contract" element={<CreateContract />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/buyers" element={<Buyers />} />
          <Route path="/buyers/:slug" element={<Profile />} />
          <Route path="/contracts" element={<Contracts />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
