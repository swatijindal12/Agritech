import React from "react";
import { useState } from "react";
import styled from "styled-components";
import Pagination from "../../common/Pagination";
import CrossIcon from "../../../assets/cross.svg";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import Button from "../../common/Button";
import Flexbox from "../../common/Flexbox";
import EmptyIcon from "../../../assets/empty-list.svg";

const Container = styled.div`
  position: fixed;
  display: grid;
  place-items: center;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
`;

const InnerContianer = styled.div`
  position: absolute;
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  width: 80vw;
  height: 80vh;

  @media screen and (max-width: 990px) {
    width: 95%;
    padding: 2rem 1rem 1rem;
  }
`;

const ListContainer = styled.div`
  height: 70%;
  margin-top: 1rem;
  overflow-y: auto;
  @media screen and (max-width: 990px) {
    height: 80%;
  }
`;

const PaginationContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 0;
  height: 20%;
  width: 100%;
`;

const Heading = styled.p`
  font-size: 1.5rem;
  color: #6c584c;
  font-weight: 700;
  text-align: center;

  @media screen and (max-width: 990px) {
    font-size: 1.2rem;
    text-align: left;
  }
`;

const Cross = styled.img`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  cursor: pointer;

  @media screen and (max-width: 990px) {
    height: 1rem;
    top: 1rem;
    right: 1rem;
  }
`;

const TableContainer = styled.div`
  max-width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  border: 1px solid #a9846733;
  border-collapse: collapse;
  margin: 2rem 0 0 0;

  tr {
    overflow: hidden;
  }

  td {
    border: 1px solid #a9846733;
    padding: 1rem;
    text-align: center;

    p {
      white-space: nowrap;
    }
  }
  th {
    border: 1px solid #a9846733;
    padding: 1rem;
  }
`;

const HeadingContainer = styled(Flexbox)`
  justify-content: flex-start;

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

const EmptyContianer = styled(Flexbox)`
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  img {
    opacity: 0.5;
  }

  p {
    opacity: 0.5;
  }
`;

const LogsModal = ({ toggle }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState([]);
  const user = useSelector(store => store.auth.user);
  const [tableHeading, setTableHeading] = useState([]);
  const [totalPage, setTotalpage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedType = JSON.parse(
    localStorage.getItem("current-new-upload-data")
  );

  useEffect(() => {
    getList();
  }, [currentPage]);

  const getList = () => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/admin/audit/${selectedType.type}?page=${currentPage}&limit=5&search=${searchText}`,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
          },
        }
      )
      .then(res => {
        setLoading(false);
        const data = res.data.data.data;
        setList(data);
        setTotalpage(res.data.data.totalPages);
        console.log("Here the response is ", res);

        let tempArr = [];
        for (const key in data[0]) {
          if (!key.includes("_id")) tempArr.push(key);
        }
        setTableHeading(tempArr);
      });
  };

  const isJson = str => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  return (
    <Container>
      <InnerContianer>
        <Cross src={CrossIcon} alt="cross-icon" onClick={toggle} />
        <HeadingContainer>
          <Heading>History of Update and Delete</Heading>
          <InputContainer margin="0 2rem">
            <Input
              type="text"
              placeholder={selectedType.search_text}
              onChange={e => setSearchText(e.target.value)}
            />
            <Button
              text={loading ? "...LOADING" : "SEARCH"}
              margin="0 1rem"
              onClick={getList}
              disabled={loading}
            />
          </InputContainer>
        </HeadingContainer>
        <ListContainer>
          {list.length > 0 ? (
            <TableContainer>
              <Table>
                <tr>
                  {tableHeading.map(item => {
                    return <th>{item.toUpperCase()}</th>;
                  })}
                </tr>
                {list?.map(row => {
                  return (
                    <tr>
                      {tableHeading.map((item, tdIndex) => {
                        if (isJson(row[item])) {
                          const obj = JSON.parse(row[item]);
                          let keyValueArray = [];
                          for (const key in obj) {
                            keyValueArray.push(`${key} = ${obj[key]}`);
                          }
                          return (
                            <td>
                              {keyValueArray.map(objectItem => {
                                return <p>{objectItem}</p>;
                              })}
                            </td>
                          );
                        }
                        return <td key={tdIndex}>{row[item] || 0}</td>;
                      })}
                    </tr>
                  );
                })}
              </Table>
            </TableContainer>
          ) : (
            <EmptyContianer>
              <img src={EmptyIcon} />
              <p>Empty</p>
            </EmptyContianer>
          )}
        </ListContainer>
        <PaginationContainer>
          <Pagination
            currentPage={currentPage}
            totalCount={totalPage}
            pageSize={1}
            onPageChange={page => setCurrentPage(page)}
          />
        </PaginationContainer>
      </InnerContianer>
    </Container>
  );
};

export default LogsModal;
