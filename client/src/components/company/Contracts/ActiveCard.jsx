import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Flexbox from "../../common/Flexbox";
import Button from "../../common/Button";
import NFTPopup from "../../common/NFTPopup";
import VerificationPopup from "../../common/VerificationPopup";
import TransactionFee from "../../../utils/estimateBlockchainPrice";

import axios from "axios";

const Container = styled.div`
  box-sizing: border-box;
  width: 48%;
  background-color: #f0ead254;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  @media only screen and (max-width: 990px) {
    width: 100%;
  }
`;

const Id = styled.p`
  font-size: 1rem;
  opacity: 60%;
  font-weight: 700;
`;

const Name = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  color: #6c584c;
`;

const Date = styled.p`
  font-size: 0.75rem;
  font-weight: 400;
`;

const Address = styled.p`
  font-size: 1.25rem;
  opacity: 60%;
  font-weight: 400;
  width: 90%;
  margin: 0.7rem 0;
`;

const TypeBox = styled(Flexbox)`
  margin: 1rem 0;
  padding: 1rem;
  background-color: #dde5b654;
  justify-content: space-between;
`;

const Number = styled.p`
  font-size: 1.25rem;
  opacity: 60%;
  font-weight: 400;
  margin-top: 0rem;
`;

const Area = styled.p`
  font-size: 1rem;
  font-weight: 600;
`;

const PopupContent = styled.p`
  padding: 0.5rem;
  @media screen and (max-width: 990px) {
    scroll-margin-top: 1rem;
    max-width: 20rem;
    overflow-x: scroll;
  }
`;

const ActiveCard = ({ data }) => {
  const [selectedNFTId, setSelectedNFTId] = useState("");
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [showVerificationError, setShowVerificationError] = useState("");
  const user = useSelector(store => store.auth.user);
  const [txPrice, setTxPrice] = useState(false);
  const [maticPrice, setMaticPrice] = useState(null);

  useEffect(() => {
    async function getGasPrice() {
      const gasPrice = await TransactionFee(54073);
      setTxPrice(gasPrice);
    }
    getGasPrice();
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=inr"
      )
      .then(res => {
        setMaticPrice(res.data["matic-network"].inr);
      })
      .catch(error => {console.error(error)
      setShowVerificationError("Try after sometime to get estimated transaction price in INR")});
  }, []);

  const togglePopup = nftId => {
    if (selectedNFTId === nftId) {
      setSelectedNFTId("");
    } else {
      setSelectedNFTId(nftId);
    }
  };

  const closeContract = adminPassord => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/admin/agreement/closed/${data.agreements[0]}`,
        {
          headers: {
            Authorization: "Bearer " + user?.data.token,
            password: adminPassord,
          },
        }
      )
      .then(res => {
        if (res.data.error) {
          setShowVerificationError(res.data.error);
        } else {
          window.location.reload();
          console.log("Successfully updated ", res);
        }
      })
      .catch(err => console.log("Error in closing contract ", err));
  };

  return (
    <>
      {showVerificationPopup && (
        <VerificationPopup
          togglePopup={() => setShowVerificationPopup(false)}
          onSubmit={password => closeContract(password)}
          error={showVerificationError}
          warning={`Approx cost of close contract will be ${txPrice.toFixed(
            3
          )} matic or Rs.${(txPrice * maticPrice).toFixed(
            2
          )} Are you sure you want to proceed?`}
        />
      )}

      {selectedNFTId &&
        data?.agreement_nft_id.map((nftId, index) => (
          <NFTPopup
            type="Contract"
            isOpen={selectedNFTId === nftId}
            togglePopup={togglePopup}
            tx_hash={data.tx_hash[index]}
            getUrl={data?.ipfs_url[index]}
            dbData={data._id}
            requiredFields={["start_date", "end_date", "crop", "area"]}
          />
        ))}
      <Container>
        <Id>
          Contract NFT ID{" "}
          {data?.agreement_nft_id.map((nftId, index) => (
            <React.Fragment key={index}>
              <a style={{ color: "blue" }} onClick={() => togglePopup(nftId)}>
                #{nftId}{" "}
              </a>
            </React.Fragment>
          ))}
        </Id>
        <Flexbox justify="space-between" margin="0.3rem 0">
          <Name>{data?.farmer_name}</Name>
          <div>
            <Date>{`from ${data?._id.start_date}`}</Date>
            <Date>{`to ${data?._id.end_date}`}</Date>
          </div>
        </Flexbox>
        <Address>{data.address}</Address>
        <TypeBox style={{ display: "block" }}>
          <Id styele={{ opacity: 1 }}>{data?._id?.crop?.toUpperCase()}</Id>
          <Flexbox justify="space-between">
            <Area style={{ marginTop: "0.5rem" }}>
              Quantity: {data?.unit_bought}
            </Area>
            <Area>{data?._id.area}</Area>
          </Flexbox>
        </TypeBox>

        <TypeBox style={{ display: "block" }}>
          <Name>{data?.customer_name}</Name>
          <Number>{data?.customer_phone}</Number>
          <Address>{data?.customer_address || "Buyer Address"}</Address>
        </TypeBox>

        <Flexbox justify="space-between">
          <Area>₹ {data?._id.price}</Area>
          {user.data.role === "admin" && (
            <Button
              text="CLOSE"
              margin="0 0 0 2rem"
              onClick={() => setShowVerificationPopup(true)}
            /> //{closeContract}
          )}
        </Flexbox>
      </Container>
    </>
  );
};

export default ActiveCard;
