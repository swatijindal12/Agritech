import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import BackButton from "../../../assets/back-button.svg";
import Flexbox from "../Flexbox";

const Container = styled.div`
  padding: 1rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #6c584c;
  margin-top: 1.5rem;
`;

const Back = styled.img`
  cursor: pointer;
`;

const Title = styled.p`
  font-size: 1.5rem;
  color: #6c584c;
  font-weight: 600;
  text-align: center;
  margin: 0 auto;
`;
const ContactUs = () => {
  const user = useSelector(store => store.auth.user);

  return (
    <Container>
      {!user ? (
        <Flexbox justify="space-between">
          <Back
            src={BackButton}
            onClick={() => (window.location.href = "/login")}
          />
          <Title>Contact Us</Title>
        </Flexbox>
      ) : (
        <Title>Contact Us</Title>
      )}

      <Description>
        <address>
          Address
          <br />
          <br />
          SOUL Societie for Organic Farming R & E Pvt. Ltd
          <br /> A2 402, Coral woods, Hoshangabad Road, Bhopal
          <br />
          Madhya Pradesh 462026
          <br />
          <br />
        </address>
        {/* Email: sb@soullyf.com */}
      </Description>
    </Container>
  );
};

export default ContactUs;
