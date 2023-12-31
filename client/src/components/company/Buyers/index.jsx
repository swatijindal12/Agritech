import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
// import Button from "../../common/Button";
import Title from "../../common/Title";
import Card from "./Card";

const Container = styled.div`
  padding: 1rem 1rem 5rem 1rem;
  min-height: auto;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  @media only screen and (max-width: 990px) {
    display: block;
  }
`;

const Buyers = () => {
  const [buyers, setBuyers] = useState(null);
  const user = useSelector(store => store.auth.user);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/admin/customers`, {
        headers: {
          Authorization: "Bearer " + user?.data.token,
        },
      })
      .then(res => {
        // console.log("response is ", res);
        setBuyers(res.data.data);
      })
      .catch(err => console.log("Error in fetching dashboard data ", err));
  }, []);

  return (
    <Container>
      {/* <Button text="ADD NEW" margin="0" /> */}
      <Title>Buyers</Title>
      <CardsContainer>
        {buyers?.map(item => {
          return <Card data={item} key={item._id} />;
        })}
      </CardsContainer>
    </Container>
  );
};

export default Buyers;
