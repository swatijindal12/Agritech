import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Title from "../Title";
import Card from "./Card";
import axios from "axios";
import { useSelector } from "react-redux";
import Flexbox from "../Flexbox";
import Button from "../Button";

const Container = styled.div`
  padding: 1rem;
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  column-gap: 1rem;
  margin-top: 1rem;

  @media only screen and (max-width: 990px) {
    display: block;
    margin: 0;
  }
`;

const ButtonContainer = styled(Flexbox)`
  column-gap: 2rem;
  @media only screen and (max-width: 990px) {
    display: block;
  }
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
        console.log("response is ", res.data.data);
        setContract(res.data.data);
      })
      .catch(err => console.log("Error in fetching dashboard data ", err));
  }, []);

  const handleNewUpload = () => {
    localStorage.setItem(
      "current-new-upload-data",
      JSON.stringify({
        validate_url: "admin/validate-data",
        post_url: "marketplace/agreement",
        redirection_url: "/marketplace",
      })
    );
    window.location.href = "/csv-validator";
  };

  return (
    <Container>
      <ButtonContainer justify="flex-start">
        <Title>MarketPlace</Title>
        {user.data.role === "admin" && (
          <Button
            text="UPLOAD NEW CONRACT"
            margin="0"
            onClick={handleNewUpload}
          />
        )}
      </ButtonContainer>
      <CardsContainer>
        {contract?.map(item => {
          return <Card data={item} key={item.agreements[0]} />;
        })}
      </CardsContainer>
    </Container>
  );
};

export default MarketPlace;
