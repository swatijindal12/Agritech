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

const InnerContianer = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
`;

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
  min-width: 360px;
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

const Error = styled.p`
  color: red;
  font-size: 1rem;
  margin: 1rem 0;
`;

const VerificationPopup = ({ togglePopup, onSubmit, error }) => {
  const [password, setPassword] = useState("");

  return (
    <Container>
      <InnerContianer>
        <Heading style={{ textAlign: "center" }}>Master Admin</Heading>
        <Title>Password</Title>
        <Input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <Error>Error: {error}</Error>}
        <Flexbox justify="center">
          <Button
            onClick={() => onSubmit(password)}
            text={"Submit"}
            margin="0.3rem 1rem"
          ></Button>
          <Button
            onClick={togglePopup}
            text={"Close"}
            margin="0rem 0rem"
            color="#FCBF49"
          ></Button>
        </Flexbox>
      </InnerContianer>
    </Container>
  );
};

export default VerificationPopup;
