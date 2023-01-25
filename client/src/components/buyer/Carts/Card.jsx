import React from "react";
import styled from "styled-components";
import Flexbox from "../../common/Flexbox";

const Container = styled.div`
  background-color: #f0ead2;
  padding: 0.5rem;
  border-radius: 8px;
  margin: 1rem 0;
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
  margin-right: 1.5rem;
  position: absolute;
  right: 0;
`;

const Box = styled.div`
  position: absolute;
  width: 28px;
  height: 28px;
  left: 11px;
  top: 184px;

  background: ${props => (props.selected ? "#adc178" : "#d9d9d9")};
`;

const Card = ({data}) => {
  return (
    <Container>
      <Flexbox justify="space-between" margin="0.5rem">
        {/* <Box /> */}
        <NameConatiner margin-left="20%">
          <Name>{data.name}</Name>
          <Amount>{data.amount}</Amount>
        </NameConatiner>
      </Flexbox>
      <Date>from {data.start_date}</Date>
      <Flexbox justify="space-between">
        <Date>to {data.end_date}</Date>
        <p margin="1rem">{data.area}</p>
        <p>#{data.id}</p>
      </Flexbox>
    </Container>
  );
};

export default Card;
