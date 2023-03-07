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
import VerificationPopup from "../VerificationPopup";

const Container = styled.div`
  padding: 1rem;
  height: calc(100vh - 4rem);
  background-color: #dde5b633;
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
  width: 100vw;
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

const Approve = () => {
  const [showList, setShowList] = useState(false);
  const [list, setList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [tableHeading, setTableHeading] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [showVerificationError, setShowVerificationError] = useState(false);

  const user = useSelector(store => store.auth.user);
  const selectedType = JSON.parse(
    localStorage.getItem("current-new-upload-data")
  );

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

  const handleUploadClick = adminPassword => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/${selectedType?.final_upload_url}`,
        selectedItem,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
            password: adminPassword,
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
          console.log("posted Succssfully ", res.data);
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
          addToList={() => setShowVerificationPopup(true)}
        />
      )}
      {showVerificationPopup && (
        <VerificationPopup
          togglePopup={() => setShowVerificationPopup(false)}
          onSubmit={password => handleUploadClick(password)}
          error={showVerificationError}
          setError={setShowVerificationError}
        />
      )}
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
                {tableHeading.map(item => {
                  return <th>{item.toUpperCase()}</th>;
                })}
              </tr>
              {selectedItem?.map(row => {
                return (
                  <tr>
                    {tableHeading.map((item, tdIndex) => {
                      if (tdIndex === 0) {
                        return (
                          <td>
                            <StatusImage src={CheckIcon} />
                          </td>
                        );
                      }
                      if (row[item]?.toString()?.includes("http"))
                        return (
                          <UrlTd onClick={() => window.open(row[item])}>
                            {row[item].includes(".pdf") ? (
                              item
                            ) : (
                              <ImagePreview src={row[item]} />
                            )}
                          </UrlTd>
                        );
                      else return <td>{row[item] || 0}</td>;
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
