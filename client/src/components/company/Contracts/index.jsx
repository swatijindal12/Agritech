import React, { useState } from "react";
import styled from "styled-components";
import Flexbox from "../../common/Flexbox";
import Title from "../../common/Title";
import ActiveCard from "./ActiveCard";
import ClosedCard from "./ClosedCard";
import { active, closed } from "./dummyData";

const Container = styled.div`
  padding: 1rem;
`;

const OptionContainer = styled(Flexbox)`
  margin: 1rem 0;
  border-bottom: 0.5px solid #71835533;
`;

const Option = styled.div`
  width: 50%;
  text-align: center;
  color: #718355;
  font-size: 1.8rem;
  font-weight: 600;
  border-bottom: ${props => props.selected && "3px solid #718355"};
  padding-bottom: 0.5rem;
`;

const Contracts = () => {
  const [currentPage, setCurrentpage] = useState("active");
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
      {currentPage === "active"
        ? active.map(item => {
            return <ActiveCard data={item} />;
          })
        : closed.map(item => {
            return <ClosedCard data={item} />;
          })}
    </Container>
  );
};

export default Contracts;
