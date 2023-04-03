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
  position: relative;
  bottom: 0;
  width: 100%;
  @media only screen and (max-width: 990px) {
    height: auto;
    text-align: left;
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
  font-size: 1.25rem;
  font-weight: 500;
  color: #6c584c;
  margin: 0 0.5rem;
  cursor: pointer;
  text-decoration: ${props => (props.highlight ? "underline" : "none")};
  text-underline-offset: 0.5rem;
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
  margin-left: 2rem;
  text-align: right;
  @media only screen and (max-width: 990px) {
    text-align: center;
    width: 100%;
    font-size: 1rem;
    margin-left: 0.2rem;
    margin-top: 0.5rem;
  }
`;

const Footer = ({}) => {
  const [currentFooterItem, setCurrentFooterItem] = useState(null);
  const [showFooter, setShowFooter] = useState(false);
  const user = useSelector(store => store.auth.user);

  useEffect(() => {
    if (user) {
      setShowFooter(true);
    }
  }, [showFooter]);

  useEffect(() => {
    setCurrentFooterItem(footerItems);
  }, []);

  const handleFooterClick = item => {
    window.location.href = item.url;
  };

  return (
    <>
      {showFooter && (
        <FooterContainer>
          <WebInnerContainer>
            {currentFooterItem?.map(footerItem => {
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
              &copy; {new Date().getFullYear()} SoulBioFarms. All rights
              reserved.
            </CopyRight>
          </WebInnerContainer>
        </FooterContainer>
      )}
    </>
  );
};

export default Footer;
