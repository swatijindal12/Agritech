import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useSelector } from "react-redux";
import Flexbox from "../Flexbox";
import Button from "../Button";
import CrossIcon from "../../../assets/red-cross.svg";
import CheckIcon from "../../../assets/green-check.svg";
import ErrorPopup from "./ErrorPopup";

const Container = styled.div`
  padding: 1rem;
`;

const TopContainer = styled(Flexbox)`
  @media only screen and (max-width: 990px) {
    flex-direction: column;
    row-gap: 1rem;
    justify-content: flex-start;

    button {
      margin: 0;
    }
  }
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

const Tr = styled.tr`
  border: ${props => (props.error ? "4px solid red" : "none")};
`;

const ErrorTag = styled.p`
  font-size: 1.5rem;
  color: red;
  display: ${props => (props.show ? "block" : "none")};
`;

const StatusImageContainer = styled.td`
  position: realtive;

  .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    padding: 0.5rem 1rem;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
  }

  :hover .tooltiptext {
    visibility: visible;
  }
`;

const StatusImage = styled.img`
  height: 50px;
  width: 50px;
  object-fit: cover;
  cursor: pointer;
`;

const UploadText = styled.div`
  width: 100vw;
  height: 70vh;
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

const CsvUpload = () => {
  const [data, setData] = useState(null);
  const [tableHeading, setTableHeading] = useState([]);
  const [errors, setErrors] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector(store => store.auth.user);
  const [uploadData, setUploadData] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    setUploadData(JSON.parse(localStorage.getItem("current-new-upload-data")));
  }, [file]);

  const handleFileChange = e => {
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      setFile(inputFile);
      const formData = new FormData();
      formData.append("file", inputFile);
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/${uploadData.validate_url}`,
          formData,
          {
            headers: {
              Authorization: "Bearer " + user?.data.token,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then(res => {
          setErrors(res.data.error);
          setData(res.data.data);
          let tempArr = [];
          tempArr.push("Status");
          for (const key in res.data.data[0]) {
            tempArr.push(key);
          }
          setTableHeading(tempArr);
          console.log("res : ", res);
        })
        .catch(err => {
          console.log("error in validating", err);
        });
    }
  };

  const handleSampleData = () => {
    console.log(uploadData.name);
    if (uploadData.name == "Farmers") {
      window.open(
        "https://samplevideoyoutube.s3.ap-northeast-1.amazonaws.com/ImportTemplate/FarmerTemplate.csv"
      );
    } else if (uploadData.name == "Farms") {
      window.open(
        "https://samplevideoyoutube.s3.ap-northeast-1.amazonaws.com/ImportTemplate/farmTemplate.csv"
      );
    } else if (uploadData.name == "Contracts") {
      window.open(
        "https://samplevideoyoutube.s3.ap-northeast-1.amazonaws.com/ImportTemplate/AgreementTemplate.csv"
      );
    }
  };

  const handleUpload = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/${uploadData.post_url}`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(res => {
        setLoading(false);
        console.log("res in setting new data: ", res);
        window.location.href = "/approve";
      })
      .catch(err => {
        setLoading(false);
        console.log("error in setting new data", err);
        alert("error in setting new data ", err);
      });
  };

  const getErrorIndex = index => {
    let item = errors?.filter(error => error.line === index);
    return item?.length > 0 ? item[0] : false;
  };

  return (
    <Container>
      <Heading>{`Upload ${uploadData.name}`}</Heading>
      <TopContainer justify="center">
        <input
          onChange={handleFileChange}
          id="csvInput"
          name="file"
          type="File"
        />
        <Button
          text={loading ? "...UPLOADING" : "SEND FOR APPROVAL"}
          margin="0 1rem"
          disabled={errors?.length > 0 || !data || loading}
          onClick={handleUpload}
        />
        <Button
          text={"Download Template"}
          margin="0 1rem"
          color={"#d62828cc"}
          onClick={handleSampleData}
        />
        <ErrorTag show={errors?.length > 0}>
          Resolve errors and choose file again
        </ErrorTag>
      </TopContainer>
      {data?.length > 0 ? (
        <TableContainer>
          <Table>
            <tr>
              {tableHeading.map(item => {
                return <th>{item.toUpperCase()}</th>;
              })}
            </tr>
            {data?.map((row, index) => {
              return (
                <Tr error={errors?.includes(index)}>
                  {tableHeading.map((item, tdIndex) => {
                    if (tdIndex === 0)
                      return (
                        <StatusImageContainer>
                          <StatusImage
                            onClick={() => {
                              if (getErrorIndex(index)) {
                                setShowErrorModal(index);
                              }
                            }}
                            src={getErrorIndex(index) ? CrossIcon : CheckIcon}
                          />
                          {getErrorIndex(index) && showErrorModal === index && (
                            <ErrorPopup
                              errors={getErrorIndex(index)}
                              toggle={() => setShowErrorModal(false)}
                            />
                          )}
                        </StatusImageContainer>
                      );
                    return <td>{row[item]}</td>;
                  })}
                </Tr>
              );
            })}
          </Table>
        </TableContainer>
      ) : (
        <UploadText>Upload csv file</UploadText>
      )}
    </Container>
  );
};

export default CsvUpload;
