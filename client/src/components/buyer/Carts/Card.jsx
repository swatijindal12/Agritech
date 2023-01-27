import React, { useState } from "react";
import styled from "styled-components";
import Checkbox from "../../common/Checkbox";
import Flexbox from "../../common/Flexbox";
import CrossIcon from "../../../assets/green-cross.svg";
import ArrowIcon from "../../../assets/down-arrow.svg";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

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
  margin: 1rem;
  min-width: 15.5rem;
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

const QuantityContainer = styled.div`
  text-align: center;
`;

const UpArrow = styled.img`
  transform: rotate(180deg);
  opacity: ${props => (props.disable ? 0.3 : 1)};
`;

const DownArrow = styled.img`
  opacity: ${props => (props.disable ? 0.3 : 1)};
`;

const Card = ({ data, checked }) => {
  const [selecetedAmount, setSelectedAmount] = useState(data.selected_amount);

  const handleUpArrow = () => {
    if (data.max > selecetedAmount) setSelectedAmount(selecetedAmount + 1);
  };

  const handleDownArrow = () => {
    if (selecetedAmount !== 1) setSelectedAmount(selecetedAmount - 1);
  };

  return (
    <Container>
      <Checkbox checked={checked} />
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
          <Amount>₹ {data.amount * selecetedAmount}</Amount>
        </Flexbox>
      </DetailCard>
      <QuantityContainer>
        <UpArrow
          src={ArrowIcon}
          onClick={handleUpArrow}
          disable={selecetedAmount === data.max}
        />
        <Amount>{selecetedAmount}</Amount>
        <DownArrow
          src={ArrowIcon}
          onClick={handleDownArrow}
          disable={selecetedAmount === 1}
        />
      </QuantityContainer>
    </Container>
  );
};

export default Card;
