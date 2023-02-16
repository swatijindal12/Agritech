import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { navigationData } from "./metaData";

const Container = styled.div`
  padding: 1rem;
`;

const Card = styled.div`
  border: 1px solid white;
  background-color: ${props => props.color};
  width: 48%;
  border-radius: 8px;
  @media only screen and (max-width: 990px) {
    width: 100%;
  }
`;

const CardContainer = styled.div`
  width: 80vw;
  margin: 2rem auto;
  display: flex;
  flex-wrap: wrap;
  row-gap: 1rem;
  justify-content: center;
  column-gap: 1rem;
`;

const CardTopContainer = styled.div`
  padding: 1rem;
  text-align: center;
  font-size: 1.5rem;
  color: #ffffff;
  font-weight: 700;
  border-bottom: 1px solid #ffffff;
`;

const CardBottomContainer = styled.div`
  display: flex;
  align-items: center;
`;

const BottomContainer = styled.div`
  padding: 1rem;
  border-right: 1px solid #ffffff;
  width: 33.33%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #ffffff;
  font-weight: 500;
`;

const Admin = () => {
  const user = useSelector(store => store.auth.user);

  useEffect(() => {
    if (user.data.role !== "admin") window.location.href = "/marketplace";
  }, []);

  const setToLocalStorage = item => {
    localStorage.setItem("current-new-upload-data", JSON.stringify(item));
  };

  const handleClick = (item, url) => {
    setToLocalStorage(item);
    window.location.href = url;
  };

  return (
    <Container>
      <CardContainer>
        {navigationData?.map(item => {
          return (
            <Card color={item.color}>
              <CardTopContainer>Manage {item.name}</CardTopContainer>
              <CardBottomContainer>
                <BottomContainer
                  onClick={() => handleClick(item, "/csv-validator")}
                >
                  Upload New
                </BottomContainer>
                <BottomContainer onClick={() => handleClick(item, "/approve")}>
                  Approve Existing
                </BottomContainer>
                <BottomContainer onClick={() => handleClick(item, "/modify")}>
                  Modify
                </BottomContainer>
              </CardBottomContainer>
            </Card>
          );
        })}
      </CardContainer>
    </Container>
  );
};

export default Admin;
