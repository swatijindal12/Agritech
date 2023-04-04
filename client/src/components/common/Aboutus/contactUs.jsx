import React from "react";
import styled from "styled-components";
import Title from "../Title";

const Container = styled.div`
  padding: 1rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #6c584c;
  margin-top: 1.5rem;
`;

const ContactUs = () => {
  return (
    <Container>
      <Title>Contact Us</Title>
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
