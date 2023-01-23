import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../../common/Button";
import Flexbox from "../../common/Flexbox";
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

const CardsContainer = styled.div`
  margin: 2rem 0;
`;

const Farmers = () => {
  const [showFilter, setShowFilter] = useState(false);
  const toggleFilter = () => setShowFilter(!showFilter);

  const [selectedFilter, setSelectedFilter] = useState({});
  const [farmers, setFarmers] = useState(null);

  useEffect(() => {
    let queryString = "";
    console.log(selectedFilter.rating)
    if (selectedFilter.rating) {
      queryString += `sortOrder=${selectedFilter.rating}`;
      console.log("QUERY IS ", queryString);
    }
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/admin/farmers?${queryString}`, {
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("user")).data.token,
        },
      })
      .then(res => {
        console.log("response is ", res);
        setFarmers(res.data.data);
      })
      .catch(err => console.log("Error in fetching dashboard data ", err));
  }, [selectedFilter]);

  return (
    <Container>
      <Flexbox justify="space-between">
        <Button text="ADD FARMER" margin="unset" />
        <FilterContainer>
          <img src={FilterIcon} onClick={toggleFilter} />
          {showFilter && (
            <Filter
              toggle={toggleFilter}
              setSelectedFilter={setSelectedFilter}
              selectedFilter={selectedFilter}
            />
          )}
        </FilterContainer>
      </Flexbox>
      <CardsContainer>
        {farmers?.map(item => {
          return <Card data={item} />;
        })}
      </CardsContainer>
    </Container>
  );
};

export default Farmers;
