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

const Aboutus = () => {
  return (
    <Container>
      <Title>About Us</Title>
      <Description>
        We're a group of farmers, trainers, researchers, and technologists to
        transform sustainable & organic farming across India and the world. Our
        vision is to make organic farming mainstream through a transformational
        end-to-end solution consisting of breakthrough research, training &
        education, innovative agri-input products, and associated services
        delivered through cutting-edge technology platforms. Our mission is to
        double the income of 100,000 farmers & bring 1,000,000 acres under
        organic farming techniques by 2025 (or earlier). <br /> <br />
        <br /> TCBT Stands for Tarachand Belji Techniques in the field of
        organic agriculture. These techniques are based upon a set of core
        beliefs from Ancient Indian Knowledge Systems in sustainable
        agriculture. TCBT constitutes processes and agri-products for farmers in
        order to improve soil quality, and plant nutrition resulting in
        disease-resistant growth and development of all kinds of crops. Our
        mission is to double the income of farmers in 36 months or less. To know
        more about us, please visit our website at https://www.soulbiofarms.com/.
      </Description>
    </Container>
  );
};

export default Aboutus;
