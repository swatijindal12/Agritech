import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import EditIcon from "../../../assets/edit.svg";
import DeleteIcon from "../../../assets/delete.svg";
import DeletePopup from "./DeletePopup";
import EditForm from "./EditForm";
import Pagination from "../../common/Pagination";
import VerificationPopup from "../../common/VerificationPopup";

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

  img {
    width: 20px;
    cursor: pointer;
  }
`;

const UrlTd = styled.td`
  color: blue;
  text-decoration: underline;
  cursor: pointer;
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModifyData = () => {
  const [list, setList] = useState(null);
  const [tableHeading, setTableHeading] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [editData, setEditData] = useState([]);
  const [showVerificationFor, setShowVerificationFor] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(2);

  const user = useSelector(store => store.auth.user);
  const selectedType = JSON.parse(
    localStorage.getItem("current-new-upload-data")
  );

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/${selectedType?.get_list}?page=${currentPage}&limit=2`,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
          },
        }
      )
      .then(res => {
        console.log("here the response is ", res.data);
        setList(res.data.data.data);
        setTotalPage(res.data.data.totalPages);
        let tempArr = [];
        tempArr.push("Edit");
        tempArr.push("Delete");
        for (const key in res.data.data.data[0]) {
          tempArr.push(key);
        }
        setTableHeading(tempArr);
      });
  }, [currentPage]);

  const handleEdit = password => {
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/admin/${selectedType.type}/${selectedData._id}`,
        editData,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
            password: password,
          },
        }
      )
      .then(res => {
        console.log("res : ", res);
        setShowUpdatePopup(false);
        if (res.data.error) {
          console.log("Error while deleting farmer:", res.data.error);
          setVerificationError(res.data.error);
        } else {
          window.location.reload();
          console.log("edit response is ", res.data);
        }
      })
      .catch(err => {
        console.log("error in updating data", err);
      });
  };

  const handleDelete = adminPassword => {
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/admin/${selectedType.type}/${selectedData._id}`,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
            password: adminPassword,
          },
        }
      )
      .then(res => {
        setShowDeletePopup(false);
        if (res.data.error) {
          setVerificationError(res.data.error);
        } else {
          window.location.reload();
        }
      })
      .catch(err => console.log("error in deleting data ", err));
  };

  return (
    <>
      {showDeletePopup && (
        <DeletePopup
          deleteItem={() => setShowVerificationFor("delete")}
          toggle={() => setShowDeletePopup(!showDeletePopup)}
        />
      )}
      {showUpdatePopup && (
        <EditForm
          setEditData={data => {
            setEditData(data);
            setShowVerificationFor("update");
            setShowUpdatePopup(false);
          }}
          toggle={() => setShowUpdatePopup(!showUpdatePopup)}
          data={selectedData}
        />
      )}
      {showVerificationFor && (
        <VerificationPopup
          onSubmit={password => {
            if (showVerificationFor === "delete") handleDelete(password);
            else if (showVerificationFor === "update") handleEdit(password);
          }}
          togglePopup={() => setShowVerificationFor(false)}
          error={verificationError}
        />
      )}
      <Container>
        <Heading>{`Modify ${selectedType?.name} Lists`}</Heading>
        <TableContainer>
          <Table>
            <tr>
              {tableHeading?.map(item => {
                return <th>{item.toUpperCase()}</th>;
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
                            onClick={() => {
                              setSelectedData(row);
                              setShowUpdatePopup(true);
                            }}
                          />
                        </td>
                      );
                    if (tdIndex === 1)
                      return (
                        <td>
                          <img
                            src={DeleteIcon}
                            onClick={() => {
                              setSelectedData(row);
                              setShowDeletePopup(true);
                            }}
                          />
                        </td>
                      );
                    if (row[item] === true) return <td>1</td>;
                    if (row[item]?.toString()?.includes("http"))
                      return (
                        <UrlTd onClick={() => window.open(row[item])}>
                          {item}
                        </UrlTd>
                      );
                    else return <td>{row[item] || 0}</td>;
                  })}
                </tr>
              );
            })}
          </Table>
        </TableContainer>
        <PaginationContainer>
          <Pagination
            currentPage={currentPage}
            totalCount={totalPage}
            pageSize={1}
            onPageChange={page => setCurrentPage(page)}
          />
        </PaginationContainer>
      </Container>
    </>
  );
};

export default ModifyData;
