import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { footerItems } from "../../metaData/footerItem";

const FooterContainer = styled.footer`
  background-color: #f0ead2;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  width: 100%;
  position: ${props => (props.user ? "static" : "fixed")};
  right: 0;
  @media only screen and (max-width: 990px) {
    height: auto;
    text-align: left;
    position: ${props => (props.user ? "static" : "relative")};
  }
`;

const WebInnerContainer = styled.div`
  max-width: 1280px;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0.8rem 1.5rem;
`;

const FooterItem = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #6c584c;
  margin: 0 0.5rem;
  cursor: pointer;
  width: auto;
  margin-right: 1rem;
  @media only screen and (max-width: 990px) {
    width: 100%;
    margin-bottom: 0.7rem;
    text-align: center;
  }
`;

const CopyRight = styled.div`
  font-size: 1rem;
  color: #6c584c;
  margin-left: 0.8rem;
  text-align: right;
  @media only screen and (max-width: 990px) {
    text-align: center;
    width: 100%;
    margin-left: 0.2rem;
    margin-top: 0.5rem;
  }
`;

const Footer = () => {
  const [currentFooterItem, setCurrentFooterItem] = useState(null);
  const user = useSelector(store => store.auth.user);

  useEffect(() => {
    setCurrentFooterItem(footerItems);
  }, []);

  const handleFooterClick = item => {
    window.location.href = item.url;
  };

  return (
    <FooterContainer user={user}>
      <WebInnerContainer>
        {currentFooterItem?.map(footerItem => {
          console.log(footerItem);
          return (
            <FooterItem
              onClick={() => handleFooterClick(footerItem)}
              key={footerItem.title}
              highlight={
                window.location.pathname === footerItem.url ||
                window.location.pathname.includes(footerItem.url)
              }
            >
              {footerItem.title}
            </FooterItem>
          );
        })}
        <CopyRight>
          &copy;{new Date().getFullYear()} SOUL Societie for Organic Farming R &
          E Pvt. Ltd. All rights reserved.
        </CopyRight>
      </WebInnerContainer>
    </FooterContainer>
  );
};

export default Footer;
