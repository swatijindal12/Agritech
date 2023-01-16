import React from "react";
import styled from "styled-components";
import Flexbox from "../../common/Flexbox";

const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  background-color: #f0ead254;
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

const TypeBox = styled(Flexbox)`
  margin: 1rem 0;
  padding: 1rem;
  background-color: #dde5b654;
  justify-content: space-between;
`;

const ActiveCard = ({ data }) => {
  return (
    <Container>
      <Id>NFT Token ID #{data.id}</Id>
      <Flexbox justify="space-between" margin="0.3rem 0">
        <Name>{data.name}</Name>
        <div>
          <Date>{`from ${data.start_date}`}</Date>
          <Date>{`to ${data.end_date}`}</Date>
        </div>
      </Flexbox>
      <Address>{data.address}</Address>
      <TypeBox>
        <p>Marginal</p>
        <p>171 Acres</p>
      </TypeBox>
      <Id styele={{ opacity: 1 }}>{data.crop_type}</Id>
    </Container>
  );
};

export default ActiveCard;
