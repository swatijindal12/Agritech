import React from "react";
import styled from "styled-components";
import Button from "../Button";
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
  padding: 1rem;
`;

const Message = styled.p`
  font-size: 1.5rem;
  font-weight: 500;
  color: #adc178;
  margin-bottom: 1rem;
`;

const Popup = ({ toggle, addToList }) => {
  return (
    <Container>
      <InnerContianer>
        <Message>Add items to the list</Message>
        <Flexbox justify="space-between">
          <Button text="Add" onClick={addToList} margin="0 1rem 0 0" />
          <Button text="Cancel" color="#FCBF49" onClick={toggle} />
        </Flexbox>
      </InnerContianer>
    </Container>
  );
};

export default Popup;
