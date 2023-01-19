import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 1rem;
  width: 100%;
  text-align: center;
  background-color: #f0ead24d;
  border-radius: 8px;
  margin: 1rem 0;
`;

const Image = styled.img`
  height: 5rem;
  width: 5rem;
  border-radius: 50%;
`;

const Name = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
`;

const Address = styled.p`
  font-size: 1.25rem;
  font-weight: 400;
`;

const Number = styled.p`
  font-size: 1.25rem;
  opacity: 40%;
  font-weight: 400;
  margin: 0.5rem;
`;

const Email = styled.p`
  font-size: 1.25rem;
  opacity: 60%;
  text-decoration: underline;
`;

const Card = ({ data }) => {
  return (
    <Container>
      <Image
        src={
          data.image ||
          "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
        }
      />
      <Name>{data.name}</Name>
      <Address>{data.address}</Address>
      <Number>{data.phone}</Number>
      <Email>{data.email}</Email>
    </Container>
  );
};

export default Card;
