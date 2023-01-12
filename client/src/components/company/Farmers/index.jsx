import React from "react";
import styled from "styled-components";
import Button from "../../common/Button";
import Flexbox from "../../common/Flexbox";
import FilterIcon from "../../../assets/filter.svg";
import { tempdata } from "./tempData";
import Card from "./Card";

const Container = styled.div`
  padding: 1rem;
`;

const CardsContainer = styled.div`
  margin: 2rem 0;
`;

const Farmers = () => {
  return (
    <Container>
      <Flexbox justify="space-between">
        <Button text="ADD FARMER" margin="unset" />
        <img src={FilterIcon} />
      </Flexbox>
      <CardsContainer>
        {tempdata.map(item => {
          return <Card data={item} />;
        })}
      </CardsContainer>
    </Container>
  );
};

export default Farmers;
