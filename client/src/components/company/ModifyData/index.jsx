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
import Flexbox from "../../common/Flexbox";
import Button from "../../common/Button";
import LogsModal from "./LogsModal";
import Lottie from "lottie-react";
import LoadingLottie from "../../../assets/lottie/loader.json";
import TransactionFee from "../../../utils/estimateBlockchainPrice";

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
  overflow-x: scroll;
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

const TopContainer = styled(Flexbox)`
  @media screen and (max-width: 990px) {
    display: block;
  }
`;

const InputContainer = styled(Flexbox)`
  @media screen and (max-width: 990px) {
    width: 100vw;
    padding: 1rem;
    margin: 0 auto 1rem;
  }
`;

const Input = styled.input`
  padding: 1rem 2rem;
  border: none;
  width: 18rem;
  border-radius: 24px;
  background-color: #f5f5f5;

  @media screen and (max-width: 990px) {
    width: 100%;
  }
`;

const Logs = styled.p`
  margin: 0 2rem 0 auto;
  font-weight: 700;
  letter-spacing: 1px;
  text-decoration: underline;
  text-underline-offset: 6px;
  color: #adc178;
  cursor: pointer;

  @media screen and (max-width: 990px) {
    margin: 1rem 0;
  }
`;

const ModifyData = () => {
  const [loading, setLoading] = useState(false);
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
  const [searchText, setSearchText] = useState("");
  const [showLogs, setShowLogs] = useState(false);
  const [txPrice, setTxPrice] = useState(false);
  const [maticPrice, setMaticPrice] = useState(null);

  const user = useSelector(store => store.auth.user);
  const selectedType = JSON.parse(
    localStorage.getItem("current-new-upload-data")
  );

  useEffect(() => {
    async function getGasPrice() {
      if (selectedType.name === "Farms") {
        const gasPrice = await TransactionFee(60046);
        setTxPrice(gasPrice);
      } else if (selectedType.name === "Contracts") {
        const gasPrice = await TransactionFee(81661);
        setTxPrice(gasPrice);
      }
    }
    getGasPrice();
  }, []);

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=inr"
    )
      .then(response => response.json())
      .then(data => setMaticPrice(data["matic-network"].inr))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    getList(currentPage);
  }, [currentPage]);

  const getList = page => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/${selectedType?.get_list}?page=${page}&limit=5&search=${searchText}`,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
          },
        }
      )
      .then(res => {
        let data = res.data.data.data;
        setLoading(false);
        // console.log("here the response is ", res.data);
        if (data.length > 0) {
          setList(data);
          setTotalPage(res.data.data.totalPages);
          let tempArr = [];
          tempArr.push("Edit");
          tempArr.push("Delete");
          for (const key in data[0]) {
            tempArr.push(key);
          }
          setTableHeading(tempArr);
        }
      })
      .catch(err => {
        setLoading(false);
        // console.log("error in fetching list ", err);
      });
  };

  const handleEdit = (password, reason) => {
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/admin/${selectedType.type}/${selectedData._id}`,
        editData,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
            password: password,
            reason,
          },
        }
      )
      .then(res => {
        // console.log("res : ", res);
        setShowUpdatePopup(false);
        if (res.data.error) {
          // console.log("Error while deleting farmer:", res.data.error);
          setVerificationError(res.data.error);
        } else {
          window.location.reload();
          // console.log("edit response is ", res.data);
        }
      })
      .catch(err => {
        console.log("error in updating data", err);
      });
  };

  const handleDelete = (adminPassword, reason) => {
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/admin/${selectedType.type}/${selectedData._id}`,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
            password: adminPassword,
            reason: reason,
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
          onSubmit={(password, reason) => {
            if (showVerificationFor === "delete")
              handleDelete(password, reason);
            else if (showVerificationFor === "update")
              handleEdit(password, reason);
          }}
          togglePopup={() => setShowVerificationFor(false)}
          error={verificationError}
          setError={setVerificationError}
          getReason={true}
          warning={
            showVerificationFor === "update" &&
            (selectedType.name === "Farms"
              ? `Approx cost of modifying farm will be ${txPrice.toFixed(
                  3
                )} matic or Rs.${(txPrice * maticPrice).toFixed(
                  2
                )} Are you sure you want to proceed?`
              : selectedType.name === "Contracts"
              ? ` Approx cost of modifying contract will be ${txPrice.toFixed(
                  3
                )} matic or Rs.${(txPrice * maticPrice).toFixed(
                  2
                )} Are you sure you want to proceed?`
              : false)
          }
          selectedModelType={showVerificationFor}
          selectedEntity={selectedType.name}
        />
      )}
      {showLogs && <LogsModal toggle={() => setShowLogs(false)} />}
      <Container>
        <TopContainer justify="flex-start">
          <Heading>{`Manage ${selectedType?.name}`}</Heading>
          <InputContainer margin="0 2rem">
            <Input
              type="text"
              placeholder={selectedType.search_text}
              onChange={e => setSearchText(e.target.value)}
            />
            <Button
              text={loading ? "...LOADING" : "SEARCH"}
              margin="0 1rem"
              onClick={() => {
                setCurrentPage(1);
                getList(1);
              }}
              disabled={loading}
            />
          </InputContainer>
          <Logs onClick={() => setShowLogs(true)}>VIEW LOGS</Logs>
        </TopContainer>
        {loading ? (
          <Lottie
            animationData={LoadingLottie}
            loop={true}
            style={{ height: "100px" }}
          />
        ) : (
          <TableContainer>
            <Table>
              <tr>
                {tableHeading?.map((item, index) => {
                  return <th key={index}>{item.toUpperCase()}</th>;
                })}
              </tr>
              {list?.map((row, index) => {
                return (
                  <tr key={index}>
                    {tableHeading?.map((item, tdIndex) => {
                      if (tdIndex === 0)
                        return (
                          <td key={`${tdIndex}-${item}`}>
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
                          <td key={`${tdIndex}-${item}`}>
                            <img
                              src={DeleteIcon}
                              onClick={() => {
                                setSelectedData(row);
                                setShowDeletePopup(true);
                              }}
                            />
                          </td>
                        );
                      if (row[item] === true)
                        return <td key={`${tdIndex}-${item}`}>1</td>;
                      if (row[item]?.toString()?.includes("http"))
                        return (
                          <UrlTd
                            onClick={() => window.open(row[item])}
                            key={`${tdIndex}-${item}`}
                          >
                            {item}
                          </UrlTd>
                        );
                      else
                        return (
                          <td key={`${tdIndex}-${item}`}>{row[item] || 0}</td>
                        );
                    })}
                  </tr>
                );
              })}
            </Table>
          </TableContainer>
        )}
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
