import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Arrow from "../../../assets/down-arrow.svg";
import Button from "../Button";
import Flexbox from "../Flexbox";
import ApproveList from "./ApproveList";
import Popup from "./Popup";
import CheckIcon from "../../../assets/green-check.svg";
// import VerificationPopup from "../VerificationPopup";
import TransactionFee from "../../../utils/estimateBlockchainPrice";

const Container = styled.div`
  padding: 1rem;
  height: calc(100vh - 4rem);
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
  min-height: auto;
  /* padding-bottom: 5rem; */
  /* height: calc(100vh-4rem); */
`;

const Table = styled.table`
  border: 1px solid black;
  border-collapse: collapse;
  margin: 2rem 0 0 0;

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
`;

const UploadText = styled.div`
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  opacity: 0.3;
`;

const Heading = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: #6c584c;
  margin: 0.5rem 0 1.5rem;
  text-align: center;
`;

const StatusImage = styled.img`
  height: 50px;
  width: 50px;
  object-fit: cover;
`;

const UrlTd = styled.td`
  color: blue;
  text-decoration: underline;
  cursor: pointer;
`;

const ImagePreview = styled.img`
  height: 5rem;
`;

const Approve = ({ setBackgroundColor }) => {
  const [showList, setShowList] = useState(false);
  const [list, setList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [tableHeading, setTableHeading] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [showVerificationError, setShowVerificationError] = useState(false);
  const [txPrice, setTxPrice] = useState();
  const [maticPrice, setMaticPrice] = useState(null);

  const user = useSelector(store => store.auth.user);
  const selectedType = JSON.parse(
    localStorage.getItem("current-new-upload-data")
  );

  useEffect(() => {
    async function getGasPrice() {
      if (selectedType.name === "Farms") {
        const gasPrice = await TransactionFee(332738);
        setTxPrice(gasPrice);
      } else if (selectedType.name === "Contracts") {
        const gasPrice = await TransactionFee(472726);
        setTxPrice(gasPrice);
      }
    }
    getGasPrice();
  }, []);

  useEffect(() => {
    let tempArr = [];
    tempArr.push("status");
    if (selectedItem) {
      for (const key in selectedItem[0]) {
        if (!key.includes("_id")) tempArr.push(key);
      }
      setTableHeading(tempArr);
    }
    setShowList(!showList);
  }, [selectedItem]);

  useEffect(() => {
    setBackgroundColor("#dde5b633");
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/${selectedType?.staged_list_get}`,
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

  useEffect(() => {
    axios
      .get(
        "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=inr"
      )
      .then(res => {
        setMaticPrice(res.data["matic-network"].inr);
      })
      .catch(error => {
        console.error(error);
        setShowVerificationError(
          "Try after sometime to get estimated transaction price in INR"
        );
      });
  }, []);

  const handleUploadClick = () => {
    alert("CLICK ON ADD");
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/${selectedType?.final_upload_url}`,
        selectedItem,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
          },
        }
      )
      .then(res => {
        if (res.data.error) {
          setShowVerificationError(res.data.error);
        } else {
          sessionStorage.setItem(
            `${selectedType.type}New`,
            JSON.stringify(selectedItem)
          );
          window.location.href = selectedType?.redirection_url;
          console.log("posted Successfully ", res.data);
        }
      });
    setSelectedItem(null);
    setShowList(false);
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && (
        <Popup
          toggle={() => setShowPopup(!showPopup)}
          addToList={() => handleUploadClick()}
          error={showVerificationError}
          selectedEntity={selectedType.name}
          warning={
            selectedType.name === "Farms"
              ? `Approx cost of creating farm will be ${txPrice.toFixed(
                  3
                )} matic or Rs.${(txPrice * maticPrice).toFixed(
                  2
                )} Are you sure you want to proceed?`
              : selectedType.name === "Contracts"
              ? `Approx cost of creating contract will be ${txPrice.toFixed(
                  3
                )} matic or Rs.${(txPrice * maticPrice).toFixed(
                  2
                )} Are you sure you want to proceed?`
              : false
          }
          // addToList={() => setShowVerificationPopup(true)}
        />
      )}
      {/* {showVerificationPopup && (
        <VerificationPopup
          togglePopup={() => setShowVerificationPopup(false)}
          onSubmit={password => handleUploadClick(password)}
          error={showVerificationError}
          setError={setShowVerificationError}
          selectedEntity={selectedType.name}
          selectedModelType="Approve"
          warning={
            selectedType.name === "Farms"
              ? `Approx cost of creating farm will be ${txPrice.toFixed(
                  3
                )} matic or Rs.${(txPrice * maticPrice).toFixed(
                  2
                )} Are you sure you want to proceed?`
              : selectedType.name === "Contracts"
              ? `Approx cost of creating contract will be ${txPrice.toFixed(
                  3
                )} matic or Rs.${(txPrice * maticPrice).toFixed(
                  2
                )} Are you sure you want to proceed?`
              : false
          }
        />
      )} */}
      <Container>
        <Heading>{`Approve ${selectedType.name}`}</Heading>
        <Flexbox>
          <Selector>
            {selectedItem ? selectedItemName : `Select Contract To Review`}
            <ArrowImage
              src={Arrow}
              reverse={showList}
              onClick={() => setShowList(!showList)}
            />
            {showList && (
              <ApproveList
                data={list}
                setSelectedItem={setSelectedItem}
                setSelectedItemName={setSelectedItemName}
              />
            )}
          </Selector>
          <Button
            text="APPROVE LIST"
            onClick={() => setShowPopup(true)}
            margin="0 1rem"
            disabled={!selectedItem}
          />
        </Flexbox>
        {selectedItem ? (
          <TableContainer>
            <Table>
              <tr>
                {tableHeading.map((item, index) => {
                  return <th key={index}>{item.toUpperCase()}</th>;
                })}
              </tr>
              {selectedItem?.map((row, index) => {
                return (
                  <tr key={index}>
                    {tableHeading.map((item, tdIndex) => {
                      if (tdIndex === 0) {
                        return (
                          <td key={`${index}-${item}`}>
                            <StatusImage src={CheckIcon} />
                          </td>
                        );
                      }
                      if (row[item]?.toString()?.includes("http")) {
                        return row[item].includes(".jpg") ||
                          row[item].includes(".png") ||
                          row[item].includes(".jpeg") ? (
                          <UrlTd
                            onClick={() => window.open(row[item])}
                            key={`${index}-${item}`}
                          >
                            <ImagePreview src={row[item]} />
                          </UrlTd>
                        ) : (
                          <UrlTd
                            onClick={() => window.open(row[item])}
                            key={`${index}-${item}`}
                          >
                            {item}
                          </UrlTd>
                        );
                      } else
                        return (
                          <td key={`${index}-${item}`}>
                            {row[item].toString()}
                          </td>
                        );
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
    </>
  );
};

export default Approve;
