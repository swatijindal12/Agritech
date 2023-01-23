import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Flexbox from "../../common/Flexbox";
import Title from "../../common/Title";
import FilterIcon from "../../../assets/filter.svg";
import Card from "./Card";
import Filter from "./Filter";
import axios from "axios";

const Container = styled.div`
  padding: 1rem;
`;

const FilterContainer = styled.div`
  position: relative;
`;

const Farms = () => {
  const [showFilter, setShowFilter] = useState(false);
  const toggleFilter = () => setShowFilter(!showFilter);

  const [farms, setFarms] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/admin/farms`, {
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("user")).data.token,
        },
      })
      .then(res => {
        console.log("response is ", res);
        setFarms(res.data.data);
      })
      .catch(err => console.log("Error in fetching dashboard data ", err));
  }, []);

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
      {farms?.map(item => {
        return <Card data={item} />;
      })}
    </Container>
  );
};

export default Farms;