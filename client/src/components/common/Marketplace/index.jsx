import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Title from "../Title";
import Card from "./Card";
import axios from "axios";
import { useSelector } from "react-redux";
// import { contracts } from "./tempData";

const Container = styled.div`
  padding: 1rem;
`;

const MarketPlace = () => {
  const [contract, setContract] = useState(null);
  const user = useSelector(store => store.auth.user);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/marketplace/agreements`, {
        headers: {
          Authorization: "Bearer " + user?.data.token,
        },
      })
      .then(res => {
        console.log("response is ", res);
        setContract(res.data.data);
      })
      .catch(err => console.log("Error in fetching dashboard data ", err));
  }, []);
  return (
    <Container>
      <Title>MarketPlace</Title>
      {contract?.map(item => {
        return <Card data={item} key={item.agreements[0]} />;
      })}
    </Container>
  );
};

export default MarketPlace;
