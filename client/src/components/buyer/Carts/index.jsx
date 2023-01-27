import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Title from "../../common/Title";
import Card from "./Card";
import Button from "../../common/Button";
import Flexbox from "../../common/Flexbox";
// import { data } from "./tempData";

const Container = styled.div`
  padding: 1rem 1rem 10rem;
`;

const Box = styled.div`
  box-sizing: border-box;
  position: fixed;
  width: 100vw;
  height: fit-content;
  left: 0px;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #000000;
  padding: 1rem;
`;

const FinalAmount = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 1rem 0;

  span {
    font-weight: 400;
  }
`;

const Cart = () => {
  const [finalAmount, setFinalAmount] = useState(0);
  const data = useSelector(store => store.cart.cart);

  useEffect(() => {
    const amount = data.reduce(
      (acc, curr) => curr.price * curr.selected_quantity + acc,
      0
    );
    setFinalAmount(amount);
  }, [data]);

  return (
    <Container>
      <Flexbox justify="space-between">
        <Title>My Cart</Title>
      </Flexbox>
      <br />
      {data?.map((item, index) => {
        return <Card data={item} key={item.id} index={index} />;
      })}
      <Box>
        <FinalAmount>
          <span>Total </span> ₹ {finalAmount}
        </FinalAmount>

        <Button text="CHECKOUT" width="100%" />
      </Box>
    </Container>
  );
};

export default Cart;
