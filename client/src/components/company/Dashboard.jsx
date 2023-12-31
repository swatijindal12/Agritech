import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Flexbox from "../common/Flexbox";
import Title from "../common/Title";
import FarmImg from "../../assets/dashboard/farms.svg";
import FarmersImg from "../../assets/dashboard/farmers.svg";
import BuyersImage from "../../assets/dashboard/buyers.svg";
import ContractsImage from "../../assets/dashboard/contracts.svg";
import axios from "axios";
import { Navigate } from "react-router-dom";

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
  cursor: pointer;
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
  const user = useSelector(store => store.auth.user);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/admin/dashboard`, {
        headers: {
          Authorization: "Bearer " + user?.data.token,
        },
      })
      .then(res => {
        // console.log("response is ", res);
        setData(res.data.data);
      })
      .catch(err => console.log("Error in fetching dashboard data ", err));
  }, []);

  const navigateTo = url => {
    window.location.href = `/${url}`;
  };
  return (
    <>
      {user?.data?.role === "customer" && (
        <Navigate
          to="/contracts
      "
        />
      )}
      <Container>
        <Title>Dashboard</Title>
        <CardContainer wrap="wrap">
          <Card color="#718355" onClick={() => navigateTo("farms")}>
            <img src={FarmImg} alt="farm-icon" />
            <CardData>
              <Number>{data?.farms || 0}</Number>
              <p>Farms</p>
            </CardData>
          </Card>
          <Card color="#FCBF49" onClick={() => navigateTo("farmers")}>
            <img src={FarmersImg} alt="farmer-icon" />
            <CardData>
              <Number>{data?.farmers || 0}</Number>
              <p>Farmers</p>
            </CardData>
          </Card>
          <Card color="#F77F00" onClick={() => navigateTo("buyers")}>
            <img src={BuyersImage} alt="buyer-icon" />
            <CardData>
              <Number>{data?.customers || 0}</Number>
              <p>Buyers</p>
            </CardData>
          </Card>
          <Card color="#D62828" onClick={() => navigateTo("marketplace")}>
            <img src={ContractsImage} alt="contract-icon" />
            <CardData>
              <Number>{data?.contracts || 0}</Number>
              <p>Contracts</p>
            </CardData>
          </Card>
        </CardContainer>
      </Container>
    </>
  );
};

export default Dashboard;
