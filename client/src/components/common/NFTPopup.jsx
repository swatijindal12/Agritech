import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "./Button";
import Flexbox from "./Flexbox";

const Container = styled.div`
  position: fixed;
  display: grid;
  place-items: center;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
`;

const PopupBox = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  /* max-width: 23rem; */
`;

const Heading = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #a98467;
`;

const NFTPopup = ({ children, tx_hash, togglePopup, isOpen, width }) => {
  const handleClose = () => {
    togglePopup(false);
  };

  const handleTxhash = () => {
    window.open(tx_hash);
  };

  return (
    <Container>
      <PopupBox>
        <Heading style={{ textAlign: "center" }}>Blockchain Details</Heading>
        <br />
        {children}
        <Flexbox justify="center">
          <Button
            margin={"0.5rem"}
            onClick={handleTxhash}
            text={"Tx hash"}
          ></Button>
          <Button
            margin={"0.5rem"}
            onClick={handleClose}
            text={"Close"}
          ></Button>
        </Flexbox>
      </PopupBox>
    </Container>
  );
};

export default NFTPopup;
