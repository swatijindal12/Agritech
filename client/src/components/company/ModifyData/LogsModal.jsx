import React from "react";
import { useState } from "react";
import styled from "styled-components";
import Pagination from "../../common/Pagination";
import CrossIcon from "../../../assets/cross.svg";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

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
  padding: 1rem;
  width: 80vw;
  height: 80vh;

  @media screen and (max-width: 990px) {
    width: 95%;
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
  border: 1px solid black;
  border-collapse: collapse;
  margin: 2rem 0 0 0;

  tr {
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
`;

const LogsModal = ({ toggle }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState([]);
  const user = useSelector(store => store.auth.user);
  const [tableHeading, setTableHeading] = useState([]);
  const [totalPage, setTotalpage] = useState(1);

  useEffect(() => {
    getList();
  }, [currentPage]);

  const getList = () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/admin/audit/farmer?page=${currentPage}&limit=6`,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
          },
        }
      )
      .then(res => {
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

  return (
    <Container>
      <InnerContianer>
        <Cross src={CrossIcon} alt="cross-icon" onClick={toggle} />
        <Heading>History of updates</Heading>
        <ListContainer>
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
                      return <td>{row[item] || 0}</td>;
                    })}
                  </tr>
                );
              })}
            </Table>
          </TableContainer>
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
