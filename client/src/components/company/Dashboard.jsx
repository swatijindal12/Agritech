import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Flexbox from "../common/Flexbox";
import Title from "../common/Title";
import FarmImg from "../../assets/dashboard/farms.svg";
import FarmersImg from "../../assets/dashboard/farmers.svg";
import BuyersImage from "../../assets/dashboard/buyers.svg";
import ContractsImage from "../../assets/dashboard/contracts.svg";
import axios from "axios";

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
  const [data, setData] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/admin/dashboard", {
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("user")).data.token,
        },
      })
      .then(res => {
        console.log("response is ", res);
        setData(res.data.data);
      })
      .catch(err => console.log("Error in fetching dashboard data ", err));
  }, []);

  const navigateTo = url => {
    window.location.href = `/${url}`;
  };
  return (
    <Container>
      <Title>Dashboard</Title>
      <CardContainer wrap="wrap">
        <Card color="#718355" onClick={() => navigateTo("farms")}>
          <img src={FarmImg} />
          <CardData>
            <Number>{data?.farms || 0}</Number>
            <p>Farms</p>
          </CardData>
        </Card>
        <Card color="#FCBF49" onClick={() => navigateTo("farmers")}>
          <img src={FarmersImg} />
          <CardData>
            <Number>{data?.farmers || 0}</Number>
            <p>Farmers</p>
          </CardData>
        </Card>
        <Card color="#F77F00" onClick={() => navigateTo("buyers")}>
          <img src={BuyersImage} />
          <CardData>
            <Number>{data?.customers || 0}</Number>
            <p>Buyers</p>
          </CardData>
        </Card>
        <Card color="#D62828" onClick={() => navigateTo("contracts")}>
          <img src={ContractsImage} />
          <CardData>
            <Number>{data?.contracts || 0}</Number>
            <p>Contracts</p>
          </CardData>
        </Card>
      </CardContainer>
    </Container>
  );
};

export default Dashboard;
