import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CrossIcon from "../../assets/cross.svg";
import Button from "./Button";
import { adminNavItems, buyerNavItems } from "../../metaData/navItems";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, logout } from "../../redux/actions";

const Container = styled.div`
  display: ${props => (props.show ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.099);
  height: 100vh;
  z-index: 5;
`;

const InnerContainer = styled.div`
  position: fixed;
  width: 80vw;
  height: 100vh;
  z-index: 5;
  right: 0;
  top: 0;
  background-color: white;
  padding: 1rem;
`;

const Cross = styled.img`
  float: right;
`;

const NavItem = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  color: #6c584c;
  color: ${props => (props.highlight ? "#ADC178" : "#6c584c")};
  margin: 2.5rem 0;
  pointer-events: ${props => (props.disabled ? "none" : "auto")};

  /* text-decoration: ${props => (props.highlight ? "underline" : "none")};
  text-underline-offset: 0.5rem; */
`;

const Logout = styled.p`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #d62828cc;
`;

const Sidebar = ({ show, toggle }) => {
  const [currentNavItem, setCurrentNavItem] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(store => store.auth.user);

  useEffect(() => {
    console.log(
      "Admin title",
      adminNavItems.filter(item => item.title)
    );
    const NavItems =
      user?.data?.role === "customer"
        ? buyerNavItems
        : adminNavItems.filter(item => item.title !== "Admin");
    setCurrentNavItem(NavItems);
  }, [user]);

  const handleNavClick = item => {
    toggle();
    window.location.href = item.url;
  };

  const handleLogout = () => {
    dispatch(clearCart());
    dispatch(logout());
  };

  return (
    <Container show={show}>
      <InnerContainer>
        <Cross src={CrossIcon} onClick={toggle} />
        {currentNavItem?.map(navItem => {
          return (
            <NavItem
              onClick={() => handleNavClick(navItem)}
              key={navItem.title}
              highlight={window.location.pathname === navItem.url}
              disabled={navItem.title === "Admin"}
            >
              {navItem.title}
            </NavItem>
          );
        })}
        {user?.data?.role === "admin" && (
          <Button
            text="DASHBOARD"
            margin="2.5rem 0"
            onClick={() => handleNavClick({ url: "/" })}
          />
        )}
        <Logout onClick={handleLogout}>LOGOUT</Logout>
      </InnerContainer>
    </Container>
  );
};

export default Sidebar;
