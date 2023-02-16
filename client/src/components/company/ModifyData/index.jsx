import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import EditIcon from "../../../assets/edit.svg";
import DeleteIcon from "../../../assets/delete.svg";

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
  overflow-x: auto;
`;

const Table = styled.table`
  border: 1px solid black;
  border-collapse: collapse;

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
    height: 48px;
    width: 48px;
    cursor: pointer;
  }
`;

const ModifyData = () => {
  const [list, setList] = useState(null);
  const [tableHeading, setTableHeading] = useState(null);
  const user = useSelector(store => store.auth.user);
  const selectedType = JSON.parse(
    localStorage.getItem("current-new-upload-data")
  );

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/${selectedType?.get_list}`, {
        headers: {
          Authorization: "Bearer " + user?.data.token,
        },
      })
      .then(res => {
        console.log("here the response is ", res.data.data);
        setList(res.data.data);
        let tempArr = [];
        tempArr.push("Edit");
        tempArr.push("Delete");
        for (const key in res.data.data[0]) {
          if (!key.includes("_id")) tempArr.push(key);
        }
        setTableHeading(tempArr);
      });
  }, []);

  const handleEdit = id => {};

  const handleDelete = id => {};

  return (
    <Container>
      <Heading>{`Modify ${selectedType?.name} Lists`}</Heading>
      <TableContainer>
        <Table>
          <tr>
            {tableHeading?.map(item => {
              return <th>{item}</th>;
            })}
          </tr>
          {list?.map(row => {
            return (
              <tr>
                {tableHeading?.map((item, tdIndex) => {
                  if (tdIndex === 0)
                    return (
                      <td>
                        <img
                          src={EditIcon}
                          onClick={() => handleEdit(row._id)}
                        />
                      </td>
                    );
                  if (tdIndex === 1)
                    return (
                      <td>
                        <img
                          src={DeleteIcon}
                          onClick={() => handleDelete(row._id)}
                        />
                      </td>
                    );
                  if (row[item] === true) return <td>1</td>;
                  else return <td>{row[item] || 0}</td>;
                })}
              </tr>
            );
          })}
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ModifyData;
