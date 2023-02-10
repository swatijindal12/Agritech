import React from "react";
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
`;

const CardContainer = styled.div`
  width: 80vw;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  row-gap: 1rem;
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
  const handleNewUpload = item => {
    localStorage.setItem(
      "current-new-upload-data",
      JSON.stringify({
        validate_url: item.validate_url,
        post_url: item.post_url,
        redirection_url: item.redirection_url,
      })
    );
    window.location.href = "/csv-validator";
  };

  return (
    <Container>
      <CardContainer>
        {navigationData?.map(item => {
          return (
            <Card color={item.color}>
              <CardTopContainer>{item.name}</CardTopContainer>
              <CardBottomContainer>
                <BottomContainer onClick={() => handleNewUpload(item)}>
                  Upload New
                </BottomContainer>
                <BottomContainer>Aprrove Existing</BottomContainer>
                <BottomContainer>Modify</BottomContainer>
              </CardBottomContainer>
            </Card>
          );
        })}
      </CardContainer>
    </Container>
  );
};

export default Admin;
