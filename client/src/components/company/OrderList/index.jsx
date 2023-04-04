import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Pagination from "../../common/Pagination";
import Flexbox from "../../common/Flexbox";
import Button from "../../common/Button";
import Lottie from "lottie-react";
import LoadingLottie from "../../../assets/lottie/loader.json";

const Container = styled.div`
  padding: 1rem;
`;

const Heading = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: #6c584c;
  margin: 0.5rem 0 1.5rem;
  text-align: center;
`;

const TableContainer = styled.div`
  max-width: 100vw;
  overflow-x: scroll;
`;

const Table = styled.table`
  border: 1px solid black;
  border-collapse: collapse;

  tr {
    white-space: nowrap;
    overflow: hidden;
  }

  td {
    border: 1px solid black;
    padding: 1rem;
    text-align: center;
  }
  th {
    border: 1px solid black;
    padding: 1rem;
  }

  img {
    width: 20px;
    cursor: pointer;
  }
`;

const UrlTd = styled.td`
  color: blue;
  text-decoration: underline;
  cursor: pointer;
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TopContainer = styled(Flexbox)`
  @media screen and (max-width: 990px) {
    display: block;
  }
`;

const InputContainer = styled(Flexbox)`
  @media screen and (max-width: 990px) {
    width: 100vw;
    padding: 1rem;
    margin: 0 auto 1rem;
  }
`;

const Input = styled.input`
  padding: 1rem 2rem;
  border: none;
  width: 18rem;
  border-radius: 24px;
  background-color: #f5f5f5;

  @media screen and (max-width: 990px) {
    width: 100%;
  }
`;

const OrderList = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState(null);
  const [tableHeading, setTableHeading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(2);
  const [searchText, setSearchText] = useState("");

  const user = useSelector(store => store.auth.user);
  const selectedType = JSON.parse(
    localStorage.getItem("current-new-upload-data")
  );

  useEffect(() => {
    getOrderList(currentPage);
  }, [currentPage]);
  const getOrderList = page => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/admin/order?page=${page}&limit=8&orderId=${searchText}`,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
          },
        }
      )
      .then(res => {
        let data = res.data.data.data;
        setLoading(false);
        console.log("here the response is ", res.data);
        if (data.length > 0) {
          setList(data);
          setTotalPage(res.data.data.totalPages);
          let tempArr = [];
          for (const key in data[0]) {
            tempArr.push(key);
          }
          setTableHeading(tempArr);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log("error in fetching list ", err);
      });
  };

  return (
    <>
      <Container>
        <TopContainer justify="flex-start">
          <Heading>{"Order History"}</Heading>
          <InputContainer margin="0 2rem">
            <Input
              type="text"
              placeholder="Search by order id"
              onChange={e => setSearchText(e.target.value)}
            />
            <Button
              text={loading ? "...LOADING" : "SEARCH"}
              margin="0 1rem"
              onClick={() => {
                setCurrentPage(1);
                getOrderList(1);
              }}
              disabled={loading}
            />
          </InputContainer>
        </TopContainer>
        {loading ? (
          <Lottie
            animationData={LoadingLottie}
            loop={true}
            style={{ height: "100px" }}
          />
        ) : (
          <TableContainer>
            <Table>
              <tr>
                {tableHeading?.map(item => {
                  return <th>{item.toUpperCase()}</th>;
                })}
              </tr>
              {list?.map(row => {
                return (
                  <tr>
                    {tableHeading?.map(item => {
                      if (item === "orderItemsList") {
                        return <td>{row[item].join(", ")}</td>;
                      }
                      if (row[item] === true) return <td>1</td>;
                      else return <td>{row[item] || 0}</td>;
                    })}
                  </tr>
                );
              })}
            </Table>
          </TableContainer>
        )}
        <PaginationContainer>
          <Pagination
            currentPage={currentPage}
            totalCount={totalPage}
            pageSize={1}
            onPageChange={page => setCurrentPage(page)}
          />
        </PaginationContainer>
      </Container>
    </>
  );
};

export default OrderList;
