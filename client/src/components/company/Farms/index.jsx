import React, { useState } from "react";
import styled from "styled-components";
import Flexbox from "../../common/Flexbox";
import Title from "../../common/Title";
import FilterIcon from "../../../assets/filter.svg";
import { data } from "./tempData";
import Card from "./Card";
import Filter from "./Filter";

const Container = styled.div`
  padding: 1rem;
`;

const FilterContainer = styled.div`
  position: relative;
`;

const Farms = () => {
  const [showFilter, setShowFilter] = useState(false);
  const toggleFilter = () => setShowFilter(!showFilter);

  return (
    <Container>
      <Flexbox justify="space-between">
        <Title>Farms</Title>
        <FilterContainer>
          <img src={FilterIcon} onClick={toggleFilter} />
          {showFilter && <Filter toggle={toggleFilter} />}
        </FilterContainer>
      </Flexbox>
      <br />
      {data.map(item => {
        return <Card data={item} />;
      })}
    </Container>
  );
};

export default Farms;
