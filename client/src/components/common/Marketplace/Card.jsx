import React from "react";
import styled from "styled-components";
import Button from "../Button";
import Flexbox from "../Flexbox";

const Container = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background-color: #f0ead254;
  margin: 1rem 0;
`;

const Id = styled.p`
  font-size: 0.8rem;
  font-weight: 700;
  opacity: 0.6;
`;

const Name = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
`;

const Date = styled.p`
  font-size: 0.75rem;
  font-weight: 400;
`;

const Address = styled.p`
  font-size: 1.25rem;
  font-weight: 400;
  margin: 1rem 0;
  opacity: 0.6;
`;

const InnerContainer = styled(Flexbox)`
  padding: 1rem;
  background-color: #dde5b654;
  justify-content: space-between;
`;

const Crop = styled.p`
  font-size: 1.25rem;
  font-weight: 400;
`;

const Area = styled.p`
  font-size: 1rem;
  font-weight: 600;
`;

const Amount = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
`;

const Card = ({ data }) => {
  return (
    <Container>
      <Id>NFT Token ID #{data.id}</Id>
      <Flexbox justify="space-between">
        <Name>{data.name}</Name>
        <div>
          <Date>{`from ${data.start_date}`}</Date>
          <Date>{`to ${data.end_date}`}</Date>
        </div>
      </Flexbox>
      <Address>{data.address}</Address>
      <InnerContainer>
        <Crop>{data.crop}</Crop>
        <Area>{data.area}</Area>
      </InnerContainer>
      <Flexbox justify="space-between" margin="1rem 0">
        <Amount>{data.amount}</Amount>
        <Button text="BUY" margin="unset" />
      </Flexbox>
    </Container>
  );
};

export default Card;
