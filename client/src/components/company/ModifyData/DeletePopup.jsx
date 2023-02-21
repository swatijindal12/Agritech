import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../common/Button";
import Flexbox from "../../common/Flexbox";
import VerificationPopup from "../../common/VerificationPopup";

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

const Heading = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #a98467;
`;

const Description = styled.p`
  font-size: 1rem;
  margin: 0.8rem 0 1rem;
  max-width: 22rem;
`;

const DeletePopup = ({ deleteItem, toggle }) => {
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [isVisibleEditForm, setIsVisibleEditForm] = useState(true);

  const handleVerification = () => {
    setShowVerificationPopup(true);
    setIsVisibleEditForm(false);
  };

  return (
    <Container>
      {isVisibleEditForm && (
        <InnerContianer>
          <Heading>Delete Item</Heading>
          <Description>
            Are you sure you want to delete this data from the list?
          </Description>
          <Flexbox justify="space-around">
            <Button
              onClick={handleVerification}
              text="DELETE"
              color="#D62828"
            />
            <Button onClick={toggle} text="CANCEL" color="#FCBF49" />
          </Flexbox>
        </InnerContianer>
      )}
      {showVerificationPopup && (
        <VerificationPopup
          togglePopup={toggle}
          isOpen={showVerificationPopup}
          onSubmit={deleteItem}
        />
      )}
    </Container>
  );
};

export default DeletePopup;
