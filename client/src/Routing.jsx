import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import MarketPlace from "./components/common/Marketplace";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Buyers from "./components/company/Buyers";
import Profile from "./components/company/Buyers/Profile";
import Contracts from "./components/company/Contracts";
import CreateContract from "./components/company/CreateContract";
import Dashboard from "./components/company/Dashboard";
import Farmers from "./components/company/Farmers";
import Farms from "./components/company/Farms";
import Cart from "./components/buyer/Carts";
import FarmDetails from "./components/common/FarmDetails";
import Aboutus from "./components/common/Aboutus";
import CsvUpload from "./components/common/CsvUpload";
import Admin from "./components/company/Admin";
import Approve from "./components/common/CsvUpload/Approve";

const Routing = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const user = useSelector(store => store.auth.user);

  useEffect(() => {
    // console.log("here the user is ", user);
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
          <Route path="/marketplace" element={<MarketPlace />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/farms/:slug" element={<FarmDetails />} />
          <Route path="/about-us" element={<Aboutus />} />
          <Route path="/csv-validator" element={<CsvUpload />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/approve" element={<Approve />} />
        </Routes>
      </Router>
    </>
  );
};

export default Routing;
