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
  box-sizing: border-box;
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  min-width: 30rem;

  @media screen and (max-width: 990px) {
    min-width: unset;
    width: 90%;
  }
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
  background-color: #f5f5f5;
  border-radius: 12px;

  @media screen and (max-width: 990px) {
    min-width: unset;
    width: 100%;
  }
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

const VerificationPopup = ({
  togglePopup,
  onSubmit,
  error,
  setError,
  getReason,
}) => {
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const selectedType = JSON.parse(
    localStorage.getItem("current-new-upload-data")
  );

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
        {getReason && (
          <>
            <Title>Specify reason of update</Title>
            <Input
              type="text"
              placeholder="Reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
              required
            />
          </>
        )}

        {selectedType.name === "Farms" && (
          <Error>Approx cost of modifying farm will be $0.0097</Error>
        )}
        {selectedType.name === "Contracts" && (
          <Error>Approx cost of modifying contract will be $0.0113</Error>
        )}

        <Flexbox justify="center">
          <Button
            onClick={() => onSubmit(password, reason)}
            text={"Submit"}
            margin="0.3rem 1rem"
            disabled={(getReason && reason.length == 0) || password.length == 0}
          ></Button>
          <Button
            onClick={() => {
              setError(false);
              togglePopup();
            }}
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
