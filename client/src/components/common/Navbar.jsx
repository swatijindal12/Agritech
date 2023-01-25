import React from "react";
import styled from "styled-components";
import LogoImg from "../../assets/logo.svg";
import HamburgerImg from "../../assets/hamburger.svg";
import CartImg from "../../assets/cart.svg";

const Container = styled.div`
  position: sticky;
  z-index: 4;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  padding: 1rem;
  width: 100%;
  border-bottom: 1px solid #d9c4b7;
  background-color: #ffffff;
`;

const Hamburger = styled.img`
  margin-left: auto;
`;

const Cart = styled.img`
  margin-left: 6.5rem;
`;

const Navbar = ({ toggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Container>
      <img src={LogoImg} />
      {user.data.role === "customer" && (
        <Cart src={CartImg} onClick={() =>  (window.location.href = "/cart")} />
      )}
      <Hamburger src={HamburgerImg} onClick={toggleSidebar} />
    </Container>
  );
};

export default Navbar;
