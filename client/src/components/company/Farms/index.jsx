import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Flexbox from "../../common/Flexbox";
import Title from "../../common/Title";
import FilterIcon from "../../../assets/filter.svg";
import Card from "./Card";
import Filter from "./Filter";
import Button from "../../common/Button";
import axios from "axios";
import { useSelector } from "react-redux";

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

const InputContainer = styled(Flexbox)`
  @media screen and (max-width: 990px) {
    width: 100vw;
    padding: 1rem;
    margin: 0 auto 1rem;
    flex-direction: column;
    display: none;
  }
`;

const SearchContainer = styled(Flexbox)`
  @media screen and (max-width: 990px) {
    width: 100vw;
    padding: 1rem;
    margin: 0 auto 1rem;
    flex-direction: row;
  }

  @media screen and (min-width: 991px) {
    display: none;
  }
`;

const Input = styled.input`
  padding: 1rem 2rem;
  border: none;
  width: 18rem;
  border-radius: 24px;
  background-color: #f5f5f5;

  @media screen and (max-width: 990px) {
    width: 70%;
  }
`;

const Farms = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({});
  const [farms, setFarms] = useState(null);
  const [newAddedIds, setNewAddedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const user = useSelector(store => store.auth.user);

  const toggleFilter = () => setShowFilter(!showFilter);

  useEffect(() => {
    getList();
    getNewAddedIds();
  }, []);

  const getNewAddedIds = () => {
    let newAddedArray = JSON.parse(sessionStorage.getItem("farmNew"));
    let tempArr = [];
    if (newAddedArray) {
      newAddedArray.forEach(item => tempArr.push(item._id));
    }
    setNewAddedIds(tempArr);
  };

  const getList = () => {
    setLoading(true);
    let queryString = "";

    if (selectedFilter.rating) {
      queryString += `sortOrder=${selectedFilter.rating}`;
    }
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/admin/farms?${queryString}&search=${searchText}`,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
          },
        }
      )
      .then(res => {
        setLoading(false);
        setFarms(res.data.data);
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
        <Title>Farms</Title>
        <InputContainer margin="0 2rem">
          <Input
            type="text"
            placeholder="Search by name, pin"
            onChange={e => setSearchText(e.target.value)}
          />
          <Button
            text={loading ? "...LOADING" : "SEARCH"}
            margin="0 1rem"
            onClick={() => {
              getList();
            }}
            disabled={loading}
          />
        </InputContainer>
        <FilterContainer>
          <img src={FilterIcon} onClick={toggleFilter} />
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
      <SearchContainer margin="0 2rem">
        <Input
          type="text"
          placeholder="Search by name, pin"
          onChange={e => setSearchText(e.target.value)}
        />
        <Button
          text={loading ? "...LOADING" : "SEARCH"}
          margin="0 1rem"
          onClick={() => {
            getList();
          }}
          disabled={loading}
        />
      </SearchContainer>

      <CardsContainer>
        {farms?.map(item => {
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

export default Farms;
