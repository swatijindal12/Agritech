import React, { useState } from "react";
import styled from "styled-components";
import Flexbox from "../../common/Flexbox";
import CrossIcon from "../../../assets/green-cross.svg";

const Cross = styled.img`
  position: absolute;
  top: -1rem;
  right: -1rem;
`;

const DetailCard = styled.div`
  position: relative;
  background-color: #dde5b64d;
  padding: 0.5rem;
  border-radius: 8px;
  margin: 1rem 0;
  width: 100%;
`;

const NameConatiner = styled.div`
  display: flex;
  align-items: center;
`;

const Name = styled.p`
  font-size: 1.5rem;
  color: #6c584c;
  font-weight: 550;
`;

const Date = styled.p`
  font-size: 0.75rem;
  font-weight: 400;
  margin-left: 0.3rem;
`;

const Amount = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
`;

const Card = ({ data }) => {
  return (
    <DetailCard>
      <Cross src={CrossIcon} />
      <Flexbox justify="space-between" margin="0.5rem">
        <NameConatiner margin-left="20%">
          <Name>{data.name}</Name>
        </NameConatiner>
        <p>#{data.id}</p>
      </Flexbox>
      <Date>from {data.start_date}</Date>
      <Date>to {data.end_date}</Date>
      <Flexbox justify="space-between">
        <p margin="1rem">{data.area}</p>
        <Amount>₹ {data.amount}</Amount>
      </Flexbox>
    </DetailCard>
  );
};

export default Card;
