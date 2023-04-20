import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "./Button";
import Flexbox from "./Flexbox";
import CrossIcon from "../../assets/cross.svg";

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
  position: relative;
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  height: 80vh;
  width: 70rem;
`;

const CrossImage = styled.img`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
`;

const Heading = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #a98467;
`;

const Heading2 = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: #a98467;
  margin-top: 1.5rem;
`;

const Link = styled.p`
  font-size: 0.8rem;
  color: blue;
  cursor: pointer;
  margin: 0.5rem 0;
`;

const TableContainer = styled.div`
  height: 70%;
  overflow-y: auto;
  display: flex;
  justify-content: center;

  table {
    border: 1px solid black;
    border-collapse: collapse;
    margin: 1rem 0 0 0;
    width: 100%;

    tr {
      white-space: pre-wrap;
      overflow: hidden;
      max-width: 4rem;
    }

    td {
      border: 1px solid black;
      padding: 0 1rem;
      text-align: center;
    }
    th {
      border: 1px solid black;
      padding: 0 1rem;
    }
  }
`;

const TableData = styled.div`
  width: 25rem;
  word-wrap: break-word;
`;

const NFTPopup = ({
  tx_hash,
  getUrl,
  togglePopup,
  dbData,
  requiredFields,
  type,
}) => {
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
        <CrossImage src={CrossIcon} alt="cross-icon" onClick={handleClose} />
        <Heading style={{ textAlign: "center" }}>{type} NFT</Heading>
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
                    {dbData && dbData[row]?.toString()?.includes("https://") ? (
                      <TableData>
                        <a href={dbData[row]} target="_blank">
                          {dbData && dbData[row]?.toString()}
                        </a>
                      </TableData>
                    ) : (
                      <TableData>{dbData && dbData[row]?.toString()}</TableData>
                    )}
                  </td>
                  <td>
                    {blockchainData &&
                    blockchainData[row]?.toString()?.includes("https://") ? (
                      <TableData>
                        <a href={blockchainData[row]} target="_blank">
                          {blockchainData && blockchainData[row]?.toString()}
                        </a>
                      </TableData>
                    ) : (
                      <TableData>
                        {blockchainData && blockchainData[row]?.toString()}
                      </TableData>
                    )}
                  </td>
                </tr>
              );
            })}
          </table>
        </TableContainer>
        <Heading2>Verify in Blockchain</Heading2>
        <Link onClick={() => window.open(getUrl)}>
          {type} NFT metadata (IPFS)
        </Link>
        <Link onClick={handleTxhash}>{type} NFT transaction (Polygon)</Link>
      </PopupBox>
    </Container>
  );
};

export default NFTPopup;
