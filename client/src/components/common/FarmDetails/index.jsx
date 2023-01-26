import React from "react";
import styled from "styled-components";
import Title from "../../common/Title";
import Card from "./Card";
import Flexbox from "../../common/Flexbox";
import { farmDetails } from "./tempData";

const Container = styled.div`
  padding: 1rem;
`;

const FarmDetails = () => {
  return (
    <Container>
      {farmDetails.map((item, index) => {
        return <Card data={item} key={item.id} />;
      })}
    </Container>
  );
};

export default FarmDetails;
