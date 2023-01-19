import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../../common/Button";
import Flexbox from "../../common/Flexbox";
import FilterIcon from "../../../assets/filter.svg";
import Card from "./Card";
import axios from "axios";

const Container = styled.div`
  padding: 1rem;
`;

const CardsContainer = styled.div`
  margin: 2rem 0;
`;

const Farmers = () => {
  const [farmers, setFarmers] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/admin/farmers`, {
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("user")).data.token,
        },
      })
      .then(res => {
        // console.log("response is ", res);
        setFarmers(res.data.data);
      })
      .catch(err => console.log("Error in fetching dashboard data ", err));
  }, []);

  return (
    <Container>
      <Flexbox justify="space-between">
        <Button text="ADD FARMER" margin="unset" />
        <img src={FilterIcon} />
      </Flexbox>
      <CardsContainer>
        {farmers?.map(item => {
          return <Card data={item} />;
        })}
      </CardsContainer>
    </Container>
  );
};

export default Farmers;
