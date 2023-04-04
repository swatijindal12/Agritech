import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Title from "../../common/Title";
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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin: 2rem 0;

  @media only screen and (max-width: 990px) {
    display: block;
  }
`;

const Farmers = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({});
  const [farmers, setFarmers] = useState(null);
  const [newAddedIds, setNewAddedIds] = useState([]);
  const user = useSelector(store => store.auth.user);

  const toggleFilter = () => setShowFilter(!showFilter);

  useEffect(() => {
    getList();
    getNewAddedIds();
  }, []);

  const getNewAddedIds = () => {
    let newAddedArray = JSON.parse(sessionStorage.getItem("farmerNew"));
    let tempArr = [];
    if (newAddedArray) {
      newAddedArray.forEach(item => tempArr.push(item._id));
    }
    setNewAddedIds(tempArr);
  };

  const getList = () => {
    let queryString = "";
    if (selectedFilter.rating) {
      queryString += `sortOrder=${selectedFilter.rating}`;
    }
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/admin/farmers?${queryString}`, {
        headers: {
          Authorization: "Bearer " + user?.data.token,
        },
      })
      .then(res => {
        console.log("response is ", res);
        setFarmers(res.data.data);
      })
      .catch(err => console.log("Error in fetching dashboard data ", err));
  };

  const applyFilter = () => {
    getList();
    setShowFilter(false);
  };

  return (
    <Container>
      <Flexbox justify="space-between">
        <Title>Farmers</Title>
        <FilterContainer>
          <img
            src={FilterIcon}
            onClick={toggleFilter}
            style={{ marginLeft: "10rem" }}
          />
          {showFilter && (
            <Filter
              toggle={toggleFilter}
              setSelectedFilter={setSelectedFilter}
              selectedFilter={selectedFilter}
              applyFilter={applyFilter}
            />
          )}
        </FilterContainer>
      </Flexbox>
      <CardsContainer>
        {farmers?.map(item => {
          return (
            <Card
              data={item}
              key={item._id}
              highlight={newAddedIds.includes(item._id)}
            />
          );
        })}
      </CardsContainer>
    </Container>
  );
};

export default Farmers;
