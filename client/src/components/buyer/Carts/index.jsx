import React from "react";
import styled from "styled-components";
import Title from "../../common/Title";
import Card from "./Card";
import Button from "../../common/Button";
import Flexbox from "../../common/Flexbox";
import { contracts } from "./tempData";

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
  margin-top: 1rem;
  margin-left: 13.5rem;
`;

const Cart = () => {
  return (
    <Container>
      <Flexbox justify="space-between">
        <Title>My Cart</Title>
      </Flexbox>
      <br />
      {contracts.map(item => {
        return <Card data={item} key={item.id} />;
      })}
      <Box>
        <FinalAmount>Rs. Final amount</FinalAmount>
        <Button text="CHECKOUT" width="100%" />
      </Box>
    </Container>
  );
};

export default Cart;
