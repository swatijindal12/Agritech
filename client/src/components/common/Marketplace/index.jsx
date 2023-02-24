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
  justify-content: space-evenly;
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
  const [newAddedIds, setNewAddedIds] = useState([]);
  const user = useSelector(store => store.auth.user);

  useEffect(() => {
    getList();
    getNewAddedIds();
  }, []);

  const getNewAddedIds = () => {
    let newAddedArray = JSON.parse(sessionStorage.getItem("agreementNew"));
    let tempArr = [];
    if (newAddedArray) {
      newAddedArray.forEach(item => tempArr.push(item._id));
    }
    console.log("here the new added is ", tempArr);
    setNewAddedIds(tempArr);
  };

  const getList = () => {
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
  };

  return (
    <Container>
      <CardsContainer>
        {contract?.map(item => {
          return (
            <Card
              data={item}
              key={item.agreements[0]}
              highlight={item.agreements.some(item =>
                newAddedIds.includes(item)
              )}
            />
          );
        })}
      </CardsContainer>
    </Container>
  );
};

export default MarketPlace;
