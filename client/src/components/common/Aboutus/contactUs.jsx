import React from "react";
import styled from "styled-components";
import Title from "../Title";
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
        <br />
        Address : Bhopal: A2 402, Coral woods, Hoshangabad Road, Bhopal (MP)
        <br /> <br />
        Mobile:+91-6284274669
        <br />
        {/* Email: sb@soullyf.com */}
      </Description>
    </Container>
  );
};

export default ContactUs;
