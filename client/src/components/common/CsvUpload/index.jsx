import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useSelector } from "react-redux";
import Flexbox from "../Flexbox";
import Button from "../Button";

const allowedExtensions = ["csv", "json"];

const Container = styled.div`
  padding: 1rem;
`;

const Table = styled.table`
  border: 1px solid black;
  border-collapse: collapse;
  margin: 2rem 0 0 0;

  td {
    border: 1px solid black;
    padding: 1rem;
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

const CsvUpload = () => {
  const [data, setData] = useState(null);
  const [tableHeading, setTableHeading] = useState([]);
  const [errors, setErrors] = useState([]);
  const [file, setFile] = useState(null);
  const user = useSelector(store => store.auth.user);
  const uploadData = JSON.parse(
    localStorage.getItem("current-new-upload-data")
  );

  const handleFileChange = e => {
    const inputFile = e.target.files[0];
    setFile(inputFile);
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(inputFile);

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
        console.log("res : ", res);
        setErrors(res.data.error);
      })
      .catch(err => {
        console.log("error in validating", err);
      });
  };

  const onReaderLoad = event => {
    console.log(event.target.result);
    var obj = JSON.parse(event.target.result);
    console.log("Here the object is ", obj);
    setData(obj);
    let tempArr = [];
    for (const key in obj[0]) {
      tempArr.push(key);
    }
    setTableHeading(tempArr);
  };

  const handleUpload = () => {
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
        console.log("res in setting new data: ", res);
        window.location.href = uploadData.redirection_url;
      })
      .catch(err => {
        console.log("error in setting new data", err);
        alert("error in setting new data ", err);
      });
  };

  return (
    <Container>
      <Flexbox justify="flex-start">
        <input
          onChange={handleFileChange}
          id="csvInput"
          name="file"
          type="File"
        />
        <Button
          text="UPLOAD"
          margin="0 1rem"
          disabled={errors?.length > 0 || !data}
          onClick={handleUpload}
        />
        <ErrorTag show={errors?.length > 0}>
          Resolve errors and choose file again
        </ErrorTag>
      </Flexbox>
      <Table>
        <tr>
          {tableHeading.map(item => {
            return <th>{item}</th>;
          })}
        </tr>
        {data?.map((row, index) => {
          return (
            <Tr error={errors?.includes(index)}>
              {tableHeading.map(item => {
                return <td>{row[item]}</td>;
              })}
            </Tr>
          );
        })}
      </Table>
    </Container>
  );
};

export default CsvUpload;
