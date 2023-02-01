import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import LogoImg from "../../assets/logo.jpg";
import HamburgerImg from "../../assets/hamburger.svg";
import CartImg from "../../assets/cart.svg";
import { useSelector } from "react-redux";

const Container = styled.div`
  position: sticky;
  z-index: 4;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  width: 100%;
  border-bottom: 1px solid #d9c4b7;
  background-color: #ffffff;
`;

const Hamburger = styled.img`
  margin-left: auto;
`;

const Cart = styled.img`
  margin-left: 12.5rem;
`;

const CartContainer = styled.div`
  position: relative;
  height: fit-content;
  width: fit-content;
`;

const CartNumber = styled.p`
  position: absolute;
  top: -10px;
  right: -5px;
  font-size: 0.8rem;
  font-weight: 700;
  color: red;
`;

const Logo = styled.img`
  height: 2.5rem;
  width: 2.5rem;
  object-fit: cover;
`;

const Navbar = ({ toggleSidebar }) => {
  const user = useSelector(store => store.auth.user);
  const cartItem = useSelector(store => store.cart.cart);
  const cartNumberRef = useRef();

  useEffect(() => {
    cartNumberRef?.current?.animate(
      [
        // keyframes
        { transform: "translateY(-30px)" },
        { transform: "translateY(-10px)" },
      ],
      {
        // timing options
        duration: 500,
        iterations: 1,
      }
    );
  }, [cartItem]);

  return (
    <Container>
      <Logo src={LogoImg} />
      {user?.data?.role === "customer" && (
        <CartContainer>
          <CartNumber ref={cartNumberRef}>{cartItem.length}</CartNumber>
          <Cart
            src={CartImg}
            onClick={() => (window.location.href = "/cart")}
          />
        </CartContainer>
      )}
      <Hamburger src={HamburgerImg} onClick={toggleSidebar} />
    </Container>
  );
};

export default Navbar;
