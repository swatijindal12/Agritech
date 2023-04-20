import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card";
import axios from "axios";
import { useSelector } from "react-redux";
import Flexbox from "../Flexbox";
import Button from "../Button";
import Pagination from "../../common/Pagination";

const Container = styled.div`
  padding: 1rem;
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  column-gap: 1rem;
  margin-top: 1rem;

  @media only screen and (max-width: 990px) {
    display: block;
    margin: 0;
  }
`;

const InputContainer = styled(Flexbox)`
  @media screen and (max-width: 990px) {
    width: 100vw;
    padding: 0;
    margin: 0 auto 1rem;
  }
`;

const Input = styled.input`
  padding: 1rem 2rem;
  border: none;
  width: 20rem;
  border-radius: 24px;
  background-color: #f5f5f5;

  @media screen and (max-width: 990px) {
    width: 100%;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MarketPlace = () => {
  const [contract, setContract] = useState(null);
  const [newAddedIds, setNewAddedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(2);
  const user = useSelector(store => store.auth.user);

  useEffect(() => {
    getList(currentPage);
    getNewAddedIds();
  }, [currentPage]);

  const getNewAddedIds = () => {
    let newAddedArray = JSON.parse(sessionStorage.getItem("agreementNew"));
    let tempArr = [];
    if (newAddedArray) {
      newAddedArray.forEach(item => tempArr.push(item._id));
    }
    // console.log("here the new added is ", tempArr);
    setNewAddedIds(tempArr);
  };

  const getList = page => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/marketplace/agreements?search=${searchText}&page=${page}&limit=5`,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
          },
        }
      )
      .then(res => {
        setLoading(false);
        setContract(res.data.data);
      })
      .catch(err => {
        setLoading(false);
        // console.log("Error in fetching dashboard data ", err);
      });
  };

  return (
    <Container>
      <InputContainer margin="0 2rem">
        <Input
          type="text"
          placeholder="Search by Name and Crop"
          onChange={e => setSearchText(e.target.value)}
          value={searchText}
        />
        <Button
          text={loading ? "...LOADING" : "SEARCH"}
          margin="0 1rem"
          onClick={getList}
          disabled={loading}
        />
      </InputContainer>
      <CardsContainer>
        {contract?.map(item => {
          return (
            <Card
              data={item}
              key={item.agreements[0]}
              highlight={item.agreements.some(item =>
                newAddedIds.includes(item)
              )}
            />
          );
        })}
      </CardsContainer>
      <PaginationContainer>
        <Pagination
          currentPage={currentPage}
          totalCount={totalPage}
          pageSize={1}
          onPageChange={page => setCurrentPage(page)}
        />
      </PaginationContainer>
    </Container>
  );
};

export default MarketPlace;
