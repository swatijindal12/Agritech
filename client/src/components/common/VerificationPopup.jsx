import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "./Button";
import Flexbox from "./Flexbox";

const PopupBox = styled.div`
  position: fixed;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  width: 20%;
  height: 23%;
  @media screen and (max-width: 1280px) {
    width: 40%;
    height: 27%;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  margin: 0.5rem 0;
  width: 100%;
  border: none;
  border-radius: 12px;
`;

const Title = styled.p`
  font-weight: 600;
  color: #6c584c;
  margin-top: 1rem;
`;

const Heading = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #a98467;
`;

const VerificationPopup = ({ togglePopup, isOpen, width, onSubmit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    togglePopup(false);
  };

  const handleSubmit = () => {
    onSubmit(password);
  };

  return (
    <PopupBox style={{ display: isVisible ? "block" : "none" }} width={width}>
      <Heading style={{ textAlign: "center" }}>Master Admin</Heading>
      <Title>Password</Title>
      <Input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <Flexbox justify="center">
        <Button
          onClick={handleSubmit}
          text={"Submit"}
          margin="0.3rem 1rem"
        ></Button>
        <Button
          onClick={handleClose}
          text={"Close"}
          margin="0rem 0rem"
        ></Button>
      </Flexbox>
    </PopupBox>
  );
};

export default VerificationPopup;
