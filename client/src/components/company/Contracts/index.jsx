import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styled from "styled-components";
import Flexbox from "../../common/Flexbox";
import Title from "../../common/Title";
import ActiveCard from "./ActiveCard";
import ClosedCard from "./ClosedCard";
import EmptyIcon from "../../../assets/empty-box.svg";

const Container = styled.div`
  padding: 1rem;
`;

const OptionContainer = styled(Flexbox)`
  margin: 1rem 0;
  border-bottom: 0.5px solid #71835533;
  justify-content: space-around;
`;

const Option = styled.div`
  width: 35%;
  text-align: center;
  color: #718355;
  font-size: 1.8rem;
  font-weight: 600;
  border-bottom: ${props => props.selected && "3px solid #718355"};
  padding-bottom: 0.5rem;
`;

const EmptyImage = styled.img``;

const ImageContainer = styled.div`
  text-align: center;
  margin-top: 10rem;
  opacity: 0.3;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  @media only screen and (max-width: 990px) {
    display: block;
  }
`;

const Contracts = () => {
  const [currentPage, setCurrentpage] = useState("active");
  const [active, setActive] = useState([]);
  const [closed, setClosed] = useState([]);
  const user = useSelector(store => store.auth.user);

  useEffect(() => {
    axios
      .get(
        user?.data.role === "admin"
          ? `${process.env.REACT_APP_BASE_URL}/admin/agreement`
          : `${process.env.REACT_APP_BASE_URL}/marketplace/agreements`,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
          },
        }
      )
      .then(res => {
        console.log("response is ", res);
        setActive(res.data.data.active);
        setClosed(res.data.data.close);
      })
      .catch(err => console.log("Error in fetching dashboard data ", err));
  }, []);

  return (
    <Container>
      <Title>Farming Contracts</Title>
      <OptionContainer>
        <Option
          selected={currentPage === "active"}
          onClick={() => setCurrentpage("active")}
        >
          Active
        </Option>
        <Option
          selected={currentPage === "closed"}
          onClick={() => setCurrentpage("closed")}
        >
          Closed
        </Option>
      </OptionContainer>
      {((currentPage === "active" && active.length == 0) ||
        (currentPage === "closed" && closed.length == 0)) && (
        <ImageContainer>
          <EmptyImage src={EmptyIcon} />
        </ImageContainer>
      )}
      <CardsContainer>
        {currentPage === "active"
          ? active.map(item => {
              return <ActiveCard data={item} key={item.agreements[0]} />;
            })
          : closed.map(item => {
              return <ClosedCard data={item} key={item.agreements[0]} />;
            })}
      </CardsContainer>
    </Container>
  );
};

export default Contracts;
