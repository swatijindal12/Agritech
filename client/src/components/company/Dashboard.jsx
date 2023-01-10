import React from "react";
import styled from "styled-components";
import Flexbox from "../common/Flexbox";
import Title from "../common/Title";
import FarmImg from "../../assets/dashboard/farms.svg";
import FarmersImg from "../../assets/dashboard/farmers.svg";
import BuyersImage from "../../assets/dashboard/buyers.svg";
import ContractsImage from "../../assets/dashboard/contracts.svg";

const Container = styled.div`
  padding: 1rem;
`;

const CardContainer = styled(Flexbox)`
  row-gap: 0.6rem;
  column-gap: 0.6rem;
  margin-top: 2.5rem;
`;

const Card = styled(Flexbox)`
  background-color: ${props => props.color};
  padding: 0.8rem 1.5rem;
  border-radius: 20px;
  width: 48%;
  justify-content: flex-start;
`;

const CardData = styled.div`
  margin-left: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;

  p {
    margin: 0;
  }
`;

const Number = styled.p`
  font-size: 2rem;
`;

const Dashboard = () => {
  return (
    <Container>
      <Title>Dashboard</Title>
      <CardContainer wrap="wrap">
        <Card color="#718355">
          <img src={FarmImg} />
          <CardData>
            <Number>26</Number>
            <p>Farms</p>
          </CardData>
        </Card>
        <Card color="#FCBF49">
          <img src={FarmersImg} />
          <CardData>
            <Number>200</Number>
            <p>Farmers</p>
          </CardData>
        </Card>
        <Card color="#F77F00">
          <img src={BuyersImage} />
          <CardData>
            <Number>20</Number>
            <p>Buyers</p>
          </CardData>
        </Card>
        <Card color="#D62828">
          <img src={ContractsImage} />
          <CardData>
            <Number>3</Number>
            <p>Contracts</p>
          </CardData>
        </Card>
      </CardContainer>
    </Container>
  );
};

export default Dashboard;
