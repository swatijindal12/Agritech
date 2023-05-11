import React, { useState } from "react";
import styled from "styled-components";
import Flexbox from "../../common/Flexbox";
import NFTPopup from "../../common/NFTPopup";

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
  font-size: 0.8rem;
  opacity: 60%;
  margin-left: 0rem;
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
  margin: 0.5rem 0;
`;

const TypeBox = styled(Flexbox)`
  margin: 1rem 0;
  padding: 1rem;
  background-color:  #dde5b654;
  justify-content: space-between;
`;

const Amount = styled.p`
  font-size: 1.5rem;
  font-weight: 400;
`;

const Area = styled.p`
  font-size: 1rem;
  font-weight: 600;
  margin-right: 0.5rem;
`;
const Number = styled.p`
  font-size: 1.25rem;
  opacity: 60%;
  font-weight: 400;
  margin-top: 0rem;
`;

const PopupContent = styled.p`
  padding: 0.5rem;
  @media screen and (max-width: 990px) {
    scroll-margin-top: 1rem;
    max-width: 20rem;
    overflow-x: scroll;
  }
`;

const ClosedCard = ({ data }) => {
  const [selectedNFTId, setSelectedNFTId] = useState("");

  const togglePopup = nftId => {
    if (selectedNFTId === nftId) {
      setSelectedNFTId("");
    } else {
      setSelectedNFTId(nftId);
    }
  };

  return (
    <>
      {selectedNFTId &&
        data?.agreement_nft_id.map((nftId, index) => (
          <NFTPopup
            type="Contract"
            isOpen={selectedNFTId === nftId}
            togglePopup={togglePopup}
            tx_hash={data.tx_hash[index]}
            width={100}
            getUrl={data?.ipfs_url[index]}
            dbData={data._id}
            requiredFields={["start_date", "end_date", "crop", "area"]}
          />
        ))}
      <Container>
        <Id onClick={() => window.open(data?.tx_hash)}>
          Contract NFT ID{" "}
          {data.agreement_nft_id.map((nftId, index) => (
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
            <Date>{data?._id.start_date}</Date>
            <Date>{data?._id.end_date}</Date>
          </div>
        </Flexbox>
        <Address>{data.address}</Address>
        <TypeBox>
          <Id styele={{ opacity: 1 }}>{data?._id?.crop?.toUpperCase()}</Id>
          <Area>Quantity: {data?.unit_bought}</Area>
          <Area>{data?._id.area}</Area>
        </TypeBox>
        <TypeBox style={{ display: "block" }}>
          <Name>{data?.customer_name || "Buyer Name"}</Name>
          <Number>{data?.customer_phone}</Number>
          <Address>{data?.customer_address || "Buyer Address"}</Address>
        </TypeBox>
        <Amount>₹{data?._id.price}</Amount>
      </Container>
    </>
  );
};

export default ClosedCard;
