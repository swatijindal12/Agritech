import React from "react";
import styled from "styled-components";
import CrossIcon from "../../assets/cross.svg";
import { navItems } from "../../metaData/navItems";
import Button from "./Button";

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
  margin: 2.5rem 0;
`;

const Sidebar = ({ show, toggle }) => {
  const handleNavClick = item => {
    toggle();
    window.location.href = item.url;
  };

  return (
    <Container show={show}>
      <InnerContainer>
        <Cross src={CrossIcon} onClick={toggle} />
        {navItems.map(navItem => {
          return (
            <NavItem onClick={() => handleNavClick(navItem)}>
              {navItem.title}
            </NavItem>
          );
        })}
        <Button
          text="DASHBOARD"
          margin="2.5rem 0"
          onClick={() => handleNavClick({ url: "/" })}
        />
      </InnerContainer>
    </Container>
  );
};

export default Sidebar;
