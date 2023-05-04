import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Pagination from "../../common/Pagination";
import Flexbox from "../../common/Flexbox";
import Button from "../../common/Button";
import Lottie from "lottie-react";
import LoadingLottie from "../../../assets/lottie/loader.json";
import { Link } from "react-router-dom";

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
  const [searchEmailText, setSearchEmailText] = useState("");
  const [searchPhoneText, setSearchPhoneText] = useState("");
  const [searchText, setSearchText] = useState("");
  const user = useSelector(store => store.auth.user);

  useEffect(() => {
    getOrderList(currentPage);
  }, [currentPage]);

  const setEmailOrPhone = () => {
    if (!isNaN(searchText)) {
      setSearchPhoneText(searchText);
    } else if (searchText.length !== 10) {
      setSearchEmailText(searchText);
    }
  };

  useEffect(() => {
    setEmailOrPhone();
  });

  const handleKeyPress = event => {
    if (event.key === "Enter") {
      getOrderList(currentPage);
    }
  };

  const getOrderList = page => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/admin/order?page=${page}&limit=8&email=${searchEmailText}&phone=${searchPhoneText}`,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
          },
        }
      )
      .then(res => {
        let data = res.data.data.data.map(item => {
          return {
            ...item,
            order_Id: item._id, // Change the field name here
            Contract_NFT_ID: item.itemList, // Change the field name here
            Payment_status: item.status,
          };
        });

        setLoading(false);
        if (data.length > 0) {
          setList(data);
          setTotalPage(res.data.data.totalPages);
          let tempArr = [];
          for (const key in data[0].customer_id) {
            if (key === "_id") {
              continue;
            }
            tempArr.push(key);
          }
          for (const key in data[0]) {
            if (
              key === "customer_id" ||
              key === "_id" ||
              key === "itemList" ||
              key === "status"
            ) {
              continue;
            }
            tempArr.push(key);
          }

          setTableHeading(tempArr);
        }
      })
      .catch(err => {
        setLoading(false);
        // console.log("error in fetching list ", err);
      });
  };

  const redirectHandler = NFTId => {
    window.location.href = `http://agritrustfrontend.s3-website-ap-northeast-1.amazonaws.com/contracts-admin?search=${NFTId}`;
    axios.get(
      `${process.env.REACT_APP_BASE_URL}/admin/agreement?page=1&limit=8&search=${NFTId}`,
      {
        headers: {
          Authorization: "Bearer " + user?.data.token,
        },
      }
    );
  };

  return (
    <>
      <Container>
        <TopContainer justify="flex-start">
          <Heading>{"Order History"}</Heading>
          <InputContainer margin="0 2rem">
            <Input
              type="text"
              placeholder="Search by email, phone"
              onChange={e => setSearchText(e.target.value)}
              onKeyPress={handleKeyPress}
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
                {tableHeading?.map((item, index) => {
                  return <th key={index}>{item.toUpperCase()}</th>;
                })}
              </tr>

              {list?.map((row, index) => {
                return (
                  <tr key={index}>
                    {tableHeading?.map(item => {
                      if (item === "name") {
                        return (
                          <td key={`${index}-${item}`}>
                            {row.customer_id.name}
                          </td>
                        );
                      }
                      if (item === "phone") {
                        return (
                          <td key={`${index}-${item}`}>
                            {row.customer_id.phone}
                          </td>
                        );
                      }
                      if (item === "email") {
                        return (
                          <td key={`${index}-${item}`}>
                            {row.customer_id.email}
                          </td>
                        );
                      }

                      if (item === "Contract_NFT_ID") {
                        return (
                          <td>
                            {row[item].map((item, index) => (
                              <Link
                                style={{ cursor: "pointer" , textDecoration: "none"}}
                                onClick={() => {
                                  redirectHandler(item);
                                }}
                                key={index}
                              >
                                <span key={index}>
                                  {(index ? ", " : "") + item}
                                </span>
                              </Link>
                            ))}
                          </td>
                        );
                      }
                      if (row[item] === true)
                        return <td key={`${index}-${item}`}>Done</td>;
                      else
                        return (
                          <td key={`${index}-${item}`}>
                            {row[item] || "Not Done"}
                          </td>
                        );
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
