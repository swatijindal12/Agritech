import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Arrow from "../../../assets/down-arrow.svg";
import Button from "../Button";
import Flexbox from "../Flexbox";
import ApproveList from "./ApproveList";

const Container = styled.div`
  padding: 1rem;
`;

const Selector = styled.div`
  position: relative;
  padding: 0.8rem 1rem;
  background-color: #d9d9d94d;
  font-size: 1.25rem;
  width: fit-content;
  display: flex;
  align-items: center;
  column-gap: 2rem;
  border-radius: 8px;
`;

const ArrowImage = styled.img`
  transform: ${props => props.reverse && "rotate(180deg)"};
`;

const TableContainer = styled.div`
  max-width: 100vw;
  overflow-x: auto;
`;

const Table = styled.table`
  border: 1px solid black;
  border-collapse: collapse;
  margin: 2rem 0 0 0;

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

const UploadText = styled.div`
  width: 100vw;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  opacity: 0.3;
`;

const Approve = () => {
  const [showList, setShowList] = useState(false);
  const [list, setList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tableHeading, setTableHeading] = useState([]);
  const user = useSelector(store => store.auth.user);

  useEffect(() => {
    let tempArr = [];
    if (selectedItem) {
      for (const key in selectedItem[0]) {
        tempArr.push(key);
      }
      setTableHeading(tempArr);
    }
    setShowList(!showList);
  }, [selectedItem]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/${
          JSON.parse(localStorage.getItem("current-new-upload-data"))
            ?.staged_list_get
        }`,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
          },
        }
      )
      .then(res => {
        setList(res.data.data);
      });
  }, []);

  const handleUploadClick = () => {
    setSelectedItem(null);
    setShowList(false);
  };

  return (
    <Container>
      <Flexbox justify="flex-start">
        <Selector>
          Select Contract To Review
          <ArrowImage
            src={Arrow}
            reverse={showList}
            onClick={() => setShowList(!showList)}
          />
          {showList && (
            <ApproveList data={list} setSelectedItem={setSelectedItem} />
          )}
        </Selector>
        <Button text="UPLOAD" onClick={handleUploadClick} />
      </Flexbox>
      {selectedItem ? (
        <TableContainer>
          <Table>
            <tr>
              {tableHeading.map(item => {
                return <th>{item}</th>;
              })}
            </tr>
            {selectedItem?.map(row => {
              return (
                <tr>
                  {tableHeading.map(item => {
                    return <td>{row[item]}</td>;
                  })}
                </tr>
              );
            })}
          </Table>
        </TableContainer>
      ) : (
        <UploadText>Select file for preview</UploadText>
      )}
    </Container>
  );
};

export default Approve;
