import React from "react";
import styled from "styled-components";
import Button from "../../common/Button";
import Flexbox from "../../common/Flexbox";

const Container = styled.div`
  box-sizing: border-box;
  position: absolute;
  top: 40px;
  right: 0;
  padding: 1rem;
  background-color: #ffffff;
  z-index: 3;
  width: fit-content;
  border: 0.4px solid #00000066;
  border-radius: 10px;
  min-width: 15rem;
`;

const Title = styled.p`
  font-size: 1.5rem;
  color: #adc178;
  font-family: 700;
  text-align: left;
`;

const Name = styled.p`
  font-size: 1rem;
  white-space: nowrap;
`;

const Box = styled.div`
  height: 1.25rem;
  width: 1.25rem;
  background-color: ${props => (props.selected ? "#adc178" : "#d9d9d9")};
`;

const Cancel = styled.div`
  border: 3px solid #adc178;
  color: #adc178;
  background-color: #ffffff;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.42rem 1rem;
  border-radius: 24px;
  font-size: 1rem;
  letter-spacing: 1.4px;
  font-weight: 700;
  width: fit-content;
  margin-left: 1rem;
`;

const Filter = ({ toggle, setSelectedFilter, selectedFilter, applyFilter }) => {
  const handleHighToLowClick = () => {
    setSelectedFilter({
      ...selectedFilter,
      rating: "high",
    });
  };

  const handleLowToHighClick = () => {
    setSelectedFilter({
      ...selectedFilter,
      rating: "low",
    });
  };
  return (
    <Container>
      <Title>Filters</Title>
      <Flexbox justify="space-between" margin="0.5rem 0">
        <Name>Rating High to low</Name>
        <Box
          onClick={handleHighToLowClick}
          selected={selectedFilter.rating === "high"}
        />
      </Flexbox>
      <Flexbox justify="space-between" margin="0.5rem 0">
        <Name>Rating Low to high</Name>
        <Box
          onClick={handleLowToHighClick}
          selected={selectedFilter.rating === "low"}
        />
      </Flexbox>
      <Flexbox justify="space-between" margin="1rem 0 0">
        <Button text="APPLY" onClick={applyFilter}/>
        <Cancel onClick={toggle}>CANCEL</Cancel>
      </Flexbox>
    </Container>
  );
};

export default Filter;
