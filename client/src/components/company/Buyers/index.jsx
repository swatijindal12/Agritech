import React from "react";
import styled from "styled-components";
import Button from "../../common/Button";
import Card from "./Card";
import { buyers } from "./dummyData";

const Container = styled.div`
  padding: 1rem;
`;

const Buyers = () => {
  return (
    <Container>
      <Button text="ADD NEW" margin="0" />
      {buyers?.map(item => {
        return <Card data={item} />;
      })}
    </Container>
  );
};

export default Buyers;
