import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styled from "styled-components";
import Flexbox from "../../common/Flexbox";
import ActiveCard from "./ActiveCard";
import ClosedCard from "./ClosedCard";
import EmptyIcon from "../../../assets/empty-box.svg";
import Button from "../../common/Button";
import Pagination from "../../common/Pagination";
import { useLocation } from "react-router-dom";

const Container = styled.div`
  padding: 1rem;
`;

const OptionContainer = styled(Flexbox)`
  margin: 1rem 0;
  border-bottom: 0.5px solid #71835533;
  justify-content: space-around;
`;

const Option = styled.div`
  width: 35%;
  text-align: center;
  color: #718355;
  font-size: 1.8rem;
  font-weight: 600;
  border-bottom: ${props => props.selected && "3px solid #718355"};
  padding-bottom: 0.5rem;
  cursor: pointer;
`;

const EmptyImage = styled.img``;

const ImageContainer = styled.div`
  text-align: center;
  margin-top: 10rem;
  opacity: 0.3;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  @media only screen and (max-width: 990px) {
    display: block;
  }
`;

const InputContainer = styled(Flexbox)`
  @media screen and (max-width: 990px) {
    width: 100%;
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
  min-height: auto;
  padding-bottom: 3rem;
`;

const Contracts = () => {
  const [currentPage, setCurrentpage] = useState("active");
  const [active, setActive] = useState([]);
  const [closed, setClosed] = useState([]);
  const [loading, setLoading] = useState(false);
  let [searchText, setSearchText] = useState("");
  const [totalPage, setTotalPage] = useState(2);
  const [currentPageNum, setCurrentPageNum] = useState(1);

  const user = useSelector(store => store.auth.user);

  useEffect(() => {
    getList(currentPageNum);
  }, [currentPage, currentPageNum]);

  const handleKeyPress = event => {
    if (event.key === "Enter") {
      setCurrentPageNum(1);
      getList(currentPageNum);
    }
  };

  const location = useLocation();
  const NFTIdSearch = new URLSearchParams(location.search).get("search");

  const getList = page => {
    setLoading(true);
    if (NFTIdSearch) {
      searchText = NFTIdSearch;
    }
    axios
      .get(
        user?.data.role === "admin"
          ? `${process.env.REACT_APP_BASE_URL}/admin/agreement?search=${searchText}&page=${page}&limit=6`
          : `${process.env.REACT_APP_BASE_URL}/marketplace/agreement?search=${searchText}`,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
          },
        }
      )
      .then(res => {
        setLoading(false);
        if (user?.data.role === "admin") {
          setActive(res.data.data.active[0].data);
          setClosed(res.data.data.close[0].data);
        } else {
          setActive(res.data.data.active);
          setClosed(res.data.data.close);
        }

        if (currentPage === "active") {
          setTotalPage(res.data.data.totalPagesForActive);
        } else if (currentPage === "closed") {
          setTotalPage(res.data.data.totalPagesForClosed);
        }
      })
      .catch(err => {
        setLoading(false);
        // console.log("Error in fetching dashboard data ", err);
      });
  };

  return (
    <Container>
      {user?.data.role === "admin" && (
        <InputContainer margin="0 2rem">
          <Input
            type="text"
            placeholder="Search by Name and Crop"
            onChange={e => setSearchText(e.target.value)}
            value={searchText}
            onKeyPress={handleKeyPress}
          />
          <Button
            text={loading ? "...LOADING" : "SEARCH"}
            margin="0 1rem"
            onClick={() => {
              setCurrentPageNum(1);
              getList(1);
            }}
            disabled={loading}
          />
        </InputContainer>
      )}
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
      {((currentPage === "active" && active?.length === 0) ||
        (currentPage === "closed" && closed?.length === 0)) && (
        <ImageContainer>
          <EmptyImage src={EmptyIcon} />
        </ImageContainer>
      )}
      <CardsContainer>
        {currentPage === "active"
          ? active?.map(item => {
              return <ActiveCard data={item} key={item.agreements[0]} />;
            })
          : closed?.map(item => {
              return <ClosedCard data={item} key={item.agreements[0]} />;
            })}
      </CardsContainer>
      <PaginationContainer>
        <Pagination
          currentPage={currentPageNum}
          totalCount={totalPage}
          pageSize={1}
          onPageChange={page => setCurrentPageNum(page)}
        />
      </PaginationContainer>
    </Container>
  );
};

export default Contracts;
