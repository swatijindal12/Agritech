import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Title from "../Title";
import Card from "./Card";
// import { contracts } from "./tempData";
import axios from "axios";

const Container = styled.div`
  padding: 1rem;
`;

const MarketPlace = () => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/customer/agreements`, {
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("user")).data.token,
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
      {contract?.map((item, index) => {
        return <Card data={item} key={item.id} />;
      })}
    </Container>
  );
};

export default MarketPlace;
