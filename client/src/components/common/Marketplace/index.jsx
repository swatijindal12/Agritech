import React from "react";
import styled from "styled-components";
import Title from "../Title";
import Card from "./Card";
import { contracts } from "./tempData";

const Container = styled.div`
  padding: 1rem;
`;

const MarketPlace = () => {
  return (
    <Container>
      <Title>MarketPlace</Title>
      {contracts.map((item, index) => {
        return <Card data={item} key={item.id} />;
      })}
    </Container>
  );
};

export default MarketPlace;
