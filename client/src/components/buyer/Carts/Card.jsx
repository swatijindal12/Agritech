import React, { useState } from "react";
import styled from "styled-components";
import Flexbox from "../../common/Flexbox";
import CrossIcon from "../../../assets/green-cross.svg";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../../redux/actions/cartActions";

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
  width: 95%;
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

const Area = styled.p`
  font-size: 1rem;
  font-weight: 600;
`;

const Card = ({ data, index }) => {
  const dispatch = useDispatch();
  const cart = useSelector(store => store.cart.cart);

  const removeItemFromCart = () => {
    dispatch(removeFromCart(index));
  };

  return (
    <DetailCard>
      <Cross src={CrossIcon} onClick={removeItemFromCart} />
      <Flexbox justify="space-between" margin="0.5rem">
        <NameConatiner margin-left="20%">
          <Name>{data.farmer_name}</Name>
        </NameConatiner>
        <p>#{data.farm_id}</p>
      </Flexbox>
      <Flexbox justify="space-between">
        <div>
          <Date>from {data.start_date}</Date>
          <Date>to {data.end_date}</Date>
        </div>
        <Area>Selected Unit: {data.selected_quantity}</Area>
      </Flexbox>
      <Flexbox justify="space-between">
        <p margin="1rem">{data._id}</p>
        <Amount>₹ {data.price * data.selected_quantity}</Amount>
      </Flexbox>
    </DetailCard>
  );
};

export default Card;
