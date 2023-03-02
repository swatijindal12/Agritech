import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CrossIcon from "../../../assets/cross.svg";
import Flexbox from "../Flexbox";

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
  padding: 1.5rem;
  position: relative;
  min-width: 30rem;
  min-height: 19rem;
  text-align: left;

  @media screen and (max-width: 990px) {
    width: 90%;
    min-width: unset;
  }
`;

const Cross = styled.img`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
`;

const Heading = styled.p`
  font-size: 1.5rem;
  font-weight: 500;
  color: #adc178;
  margin-bottom: 0.5rem;
  text-align: left;
  max-width: 18rem;
  white-space: nowrap;
`;

const Message = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  color: #6c584c;
  margin-bottom: 1rem;
  text-align: left;
  max-width: 18rem;
  white-space: pre-wrap;
`;

const ErrorContainer = styled(Flexbox)`
  p {
    margin-left: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    color: #6c584c;
    font-weight: 600;
    white-space: pre-wrap;
  }
`;

const Dot = styled.div`
  height: 5px;
  width: 5px;
  border-radius: 50%;
  border: 1px solid black;
  background-color: black;
  margin-top: 10px;
`;

const ErrorPopup = ({ errors, toggle }) => {
  const [errorsList, setErrorsList] = useState([]);

  useEffect(() => {
    getErrors();
  }, []);

  const getErrors = () => {
    let tempErrors = [];
    for (const error in errors) {
      if (typeof errors[error] == "string" && errors[error].length > 0) {
        tempErrors.push(errors[error]);
      }
    }
    setErrorsList(tempErrors);
  };

  return (
    <Container>
      <InnerContianer>
        <Cross src={CrossIcon} alt="cross-icon" onClick={toggle} />
        <Heading>Errors List</Heading>
        <Message>Please fix them and try again </Message>
        {errorsList?.length > 0 &&
          errorsList?.map(item => {
            return (
              <ErrorContainer justify="flex-start" align="flex-start">
                <Dot />
                <p>{item}</p>
              </ErrorContainer>
            );
          })}
      </InnerContianer>
    </Container>
  );
};

export default ErrorPopup;
