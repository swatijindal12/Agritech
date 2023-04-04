import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login/index";
import MarketPlace from "./components/common/Marketplace";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Buyers from "./components/company/Buyers";
import Profile from "./components/company/Buyers/Profile";
import Contracts from "./components/company/Contracts";
import Dashboard from "./components/company/Dashboard";
import Farmers from "./components/company/Farmers";
import Farms from "./components/company/Farms";
import Cart from "./components/buyer/Carts";
import FarmDetails from "./components/common/FarmDetails";
import Aboutus from "./components/common/Aboutus";
import CsvUpload from "./components/common/CsvUpload";
import Admin from "./components/company/Admin";
import Approve from "./components/common/CsvUpload/Approve";
import Register from "./components/auth/Login/register";
import ModifyData from "./components/company/ModifyData";
import styled from "styled-components";
import AdminContracts from "./components/company/AdminContracts";
import OrderList from "./components/company/OrderList";
import Footer from "./components/common/Footer";
import TermsConditions from "./components/common/Aboutus/termsAndCondition";
import PrivacyPolicy from "./components/common/Aboutus/privacyPolicy";
import ContactUs from "./components/common/Aboutus/contactUs";
import RefundPolicy from "./components/common/Aboutus/RefundPolicy";

const Container = styled.div`
  background-color: ${props => props.backgroundColor && props.backgroundColor};
`;

const InnerContainer = styled.div`
  max-width: 1280px;
  margin: auto;
  min-height: 86vh;
`;

const Routing = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("");
  const user = useSelector(store => store.auth.user);

  useEffect(() => {
    if (!user && window.location.pathname === "/privacy") {
      console.log("inside if loop", window.location.pathname);
      return;
    } else if (!user && window.location.pathname === "/terms-condition") {
      return;
    } else if (!user && window.location.pathname === "/contact-us") {
      return;
    } else if (!user && window.location.pathname === "/return-policy") {
      return;
    } else if (!user && window.location.href.indexOf("login") === -1) {
      window.location.href = "/login";
    }
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <Container backgroundColor={backgroundColor}>
      <Router>
        {user && (
          <>
            <Sidebar show={showSidebar} toggle={toggleSidebar} />
            <Navbar toggleSidebar={toggleSidebar} />
          </>
        )}
        <InnerContainer>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/farms" element={<Farms />} />
            <Route path="/farmers" element={<Farmers />} />
            <Route path="/buyers" element={<Buyers />} />
            <Route path="/buyers/:slug" element={<Profile />} />
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/marketplace" element={<MarketPlace />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/farms/:slug" element={<FarmDetails />} />
            <Route path="/about-us" element={<Aboutus />} />
            <Route path="/admin/csv-validator" element={<CsvUpload />} />
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/admin/approve"
              element={<Approve setBackgroundColor={setBackgroundColor} />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/modify" element={<ModifyData />} />
            <Route path="/contracts-admin" element={<AdminContracts />} />
            <Route path="/orderList" element={<OrderList />} />
            <Route path="/terms-condition" element={<TermsConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/return-policy" element={<RefundPolicy />} />
          </Routes>
        </InnerContainer>
      </Router>
      <Footer />
    </Container>
  );
};

export default Routing;
