import React from "react";
import styled from "styled-components";
import Flexbox from "../../common/Flexbox";

const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  background-color: #dde5b699;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
`;

const Id = styled.p`
  font-size: 0.8rem;
  opacity: 60%;
`;

const Name = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  color: #6c584c;
`;

const Date = styled.p`
  font-size: 0.75rem;
  font-weight: 400;
`;

const Address = styled.p`
  font-size: 1.25rem;
  opacity: 60%;
  font-weight: 400;
  width: 90%;
  margin: 0.5rem 0;
`;

const TypeBox = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background-color: #dde5b6;
  justify-content: space-between;
`;

const Amount = styled.p`
  font-size: 1.5rem;
  font-weight: 400;
`;

const ClosedCard = ({ data }) => {
  return (
    <Container>
      <Id>NFT Token ID #{data.id}</Id>
      <Flexbox justify="space-between" margin="0.3rem 0">
        <Name>{data.name}</Name>
        <div>
          <Date>{data.date}</Date>
        </div>
      </Flexbox>
      <Address>{data.address}</Address>
      <TypeBox>
        <Name>{data?.buyer?.name}</Name>
        <Address>{data?.buyer?.address}</Address>
      </TypeBox>
      <Amount>{data.amount}</Amount>
    </Container>
  );
};

export default ClosedCard;
