import React from "react";
import styled from "styled-components";
import Flexbox from "../../common/Flexbox";
import stars from "../../common/stars";
import Star from "../../../assets/farms/star.svg";

const Container = styled.div`
  box-sizing: border-box;
  padding: 1rem 1.5rem;
  background-color: #f0ead24d;
  border-radius: 8px;
  width: 32%;
  margin: 1rem 0;

  @media only screen and (max-width: 990px) {
    width: 100%;
  }
`;

const NameContainer = styled.div`
  margin: 0 0 0 1.5rem;
`;

const Name = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
`;

const Number = styled.p`
  font-size: 1.25rem;
  opacity: 60%;
  font-weight: 400;
`;

const ViewMore = styled.p`
  font-size: 1.25rem;
  color: #0000ff;
  margin: 1rem 0;
`;

const Card = ({ data }) => {
  return (
    <Container>
      <Flexbox justify="unset" margin="0 0 1rem">
        <Flexbox justify="space-between">
          <img src={Star} width="80%" />
          <Number>{data.rating}</Number>
        </Flexbox>
        <NameContainer>
          <Name>{data.name}</Name>
          <Number>{data.phone}</Number>
        </NameContainer>
      </Flexbox>
      <Number style={{ opacity: "1" }}>{data.address}</Number>
      <ViewMore onClick={() => window.open(data.farmer_pdf)}>
        view more
      </ViewMore>
    </Container>
  );
};

export default Card;
