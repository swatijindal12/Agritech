import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Button from "./Button";
import Flexbox from "./Flexbox";

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

const PopupBox = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  height: 80vh;
  width: 70rem;
`;

const Heading = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #a98467;
`;

const TableContainer = styled.div`
  height: 80%;
  overflow-y: auto;
  display: flex;
  justify-content: center;

  table {
    border: 1px solid black;
    border-collapse: collapse;
    margin: 2rem 0 0 0;

    tr {
      white-space: pre-wrap;
      overflow: hidden;
      max-width: 4rem;
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
  }
`;

const TableData = styled.div`
  width: 25rem;
  word-wrap: break-word;
`;

const NFTPopup = ({ tx_hash, getUrl, togglePopup, dbData, requiredFields }) => {
  const [blockchainData, setBlockchainData] = useState(null);

  useEffect(() => {
    axios
      .get(getUrl)
      .then(res => {
        setBlockchainData(res.data);
      })
      .catch(err => console.log("Error in fetching blockchain data ", err));
  }, []);

  const handleClose = () => {
    togglePopup(false);
  };

  const handleTxhash = () => {
    window.open(tx_hash);
  };

  return (
    <Container>
      <PopupBox>
        <Heading style={{ textAlign: "center" }}>Blockchain Details</Heading>
        <br />
        <TableContainer>
          <table>
            <tr>
              <th></th>
              <th>Soul</th>
              <th>Blockchain</th>
            </tr>
            {requiredFields.map((row, rowIndex) => {
              return (
                <tr>
                  <th>{row}</th>
                  <td>
                    <TableData>
                      {dbData[row] && dbData[row]?.toString()}{" "}
                    </TableData>
                  </td>
                  <td>
                    <TableData>
                      {blockchainData && blockchainData[row]?.toString()}
                    </TableData>
                  </td>
                </tr>
              );
            })}
          </table>
        </TableContainer>
        <Flexbox justify="center">
          <Button margin="1rem" onClick={handleTxhash} text="Tx hash"></Button>
          <Button
            margin="1rem"
            onClick={handleClose}
            text="Close"
            color="#FCBF49"
          />
        </Flexbox>
      </PopupBox>
    </Container>
  );
};

export default NFTPopup;
