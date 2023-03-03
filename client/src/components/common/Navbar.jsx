import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import LogoImg from "../../assets/logo.jpg";
import HamburgerImg from "../../assets/hamburger.svg";
import CartImg from "../../assets/cart.svg";
import { useSelector, useDispatch } from "react-redux";
import { adminNavItems, buyerNavItems } from "../../metaData/navItems";
import Flexbox from "./Flexbox";
import Button from "./Button";
import { logout } from "../../redux/actions";

const WebContainer = styled.div`
  position: sticky;
  z-index: 4;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  width: 100%;
  background-color: #f0ead2;

  @media only screen and (max-width: 990px) {
    display: none;
  }
`;

const NavItemsContainer = styled(Flexbox)`
  margin: 0 1rem;
`;

const NavItem = styled.div`
  font-size: 1.25rem;
  font-weight: 500;
  color: #6c584c;
  margin: 0 0.5rem;
  cursor: pointer;
  text-decoration: ${props => (props.highlight ? "underline" : "none")};
  text-underline-offset: 0.5rem;
`;

const MobileContainer = styled.div`
  display: none;
  @media only screen and (max-width: 990px) {
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
  }
`;

const NavRightContainer = styled(Flexbox)`
  margin-left: auto;
`;

const Logout = styled.p`
  margin: 0 1rem;
  font-size: 1rem;
  font-weight: 700;
  color: #d62828cc;
  cursor: pointer;
`;

const Hamburger = styled.img`
  margin-left: auto;
`;

const Cart = styled.img`
  margin-left: 12.5rem;
  cursor: pointer;
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
  const [currentNavItem, setCurrentNavItem] = useState(null);
  const user = useSelector(store => store.auth.user);
  const cartItem = useSelector(store => store.cart.cart);
  const cartNumberRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setCurrentNavItem(
      user?.data?.role === "customer" ? buyerNavItems : adminNavItems
    );
  }, []);

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

  const handleNavClick = item => {
    window.location.href = item.url;
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <WebContainer>
        <Logo src={LogoImg} />
        <NavItemsContainer>
          {currentNavItem?.map(navItem => {
            return (
              <NavItem
                onClick={() => handleNavClick(navItem)}
                key={navItem.title}
                highlight={
                  window.location.pathname === navItem.url ||
                  window.location.pathname.includes(navItem.url)
                }
              >
                {navItem.title}
              </NavItem>
            );
          })}
        </NavItemsContainer>
        <NavRightContainer>
          {user?.data?.role === "customer" && (
            <CartContainer>
              <CartNumber ref={cartNumberRef}>{cartItem.length}</CartNumber>
              <Cart
                src={CartImg}
                onClick={() => (window.location.href = "/cart")}
              />
            </CartContainer>
          )}
          <Logout onClick={handleLogout}>LOGOUT</Logout>
          {user?.data?.role === "admin" && (
            <Button
              text="DASHBOARD"
              onClick={() => handleNavClick({ url: "/" })}
            />
          )}
        </NavRightContainer>
      </WebContainer>
      <MobileContainer>
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
      </MobileContainer>
    </>
  );
};

export default Navbar;
