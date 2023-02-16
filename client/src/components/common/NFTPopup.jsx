import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "./Button";
import Flexbox from "./Flexbox";

const PopupBox = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  @media only screen and (max-width: 990px) {
    width: ${props => (props.width ? props.width : "60%")};
  }
`;

const NFTPopup = ({ children, tx_hash, togglePopup, isOpen, width }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    togglePopup(false);
  };

  return (
    <PopupBox style={{ display: isVisible ? "block" : "none" }} width={width}>
      <h3 style={{ textAlign: "center" }}>Blockchain details</h3>
      {children}
      <Flexbox justify="space-content">
        <Button
          margin={"0.5rem"}
          text={
            <a
              href={tx_hash}
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
              target="_blank"
            >
              Tx hash
            </a>
          }
        ></Button>
        <Button margin={"0.5rem"} onClick={handleClose} text={"Close"}></Button>
      </Flexbox>
    </PopupBox>
  );
};

export default NFTPopup;
