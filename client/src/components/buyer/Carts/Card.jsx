import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Flexbox from "../../common/Flexbox";
import CrossIcon from "../../../assets/green-cross.svg";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../../redux/actions/cartActions";
import NFTPopup from "../../common/NFTPopup";

const Cross = styled.img`
  position: absolute;
  top: -1rem;
  right: -1rem;
`;

const DetailCard = styled.div`
  position: relative;
  background-color: #dde5b64d;
  padding: 0.5rem;
  border-radius: 8px;
  margin: 1rem 0;
  width: 45%;

  @media screen and (max-width: 990px) {
    width: 95%;
  }
`;

const NameConatiner = styled.div`
  display: flex;
  align-items: center;
`;

const Name = styled.p`
  font-size: 1.5rem;
  color: #6c584c;
  font-weight: 550;
`;

const Date = styled.p`
  font-size: 0.75rem;
  font-weight: 400;
  margin-left: 0.3rem;
`;

const Amount = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
`;

const Area = styled.p`
  font-size: 1rem;
  font-weight: 600;
`;

const Id = styled.p`
  font-size: 1rem;
  opacity: 60%;
  font-weight: 700;
`;

const PopupContent = styled.p`
  padding: 0.5rem;
  @media screen and (max-width: 990px) {
    scroll-margin-top: 1rem;
    max-width: 20rem;
    overflow-x: scroll;
  }
`;

const Card = ({ data, index }) => {
  const [selectedNFTId, setSelectedNFTId] = useState("");

  const dispatch = useDispatch();

  const removeItemFromCart = () => {
    dispatch(removeFromCart(data.agreements[0]));
  };

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
      <DetailCard>
        <Cross src={CrossIcon} onClick={removeItemFromCart} />
        <Flexbox justify="space-between" margin="0.5rem">
          <NameConatiner margin-left="20%">
            <Name>{data?.farmer_name}</Name>
          </NameConatiner>
          <Id>
            {data?.agreement_nft_id.map((nftId, index) => {
              if (data?.selected_quantity > index) {
                return (
                  <a
                    style={{ color: "blue" }}
                    onClick={() => togglePopup(nftId)}
                  >
                    #{nftId}
                  </a>
                );
              }
            })}
          </Id>
        </Flexbox>
        <Flexbox justify="space-between">
          <div>
            <Date>from {data?._id.start_date}</Date>
            <Date>to {data?._id.end_date}</Date>
          </div>
          <Area>Selected Unit: {data.selected_quantity}</Area>
        </Flexbox>
        <Flexbox justify="space-between">
          <p margin="1rem">{data?._id.crop}</p>
          <Amount>₹ {data?._id.price * data.selected_quantity}</Amount>
        </Flexbox>
      </DetailCard>
    </>
  );
};

export default Card;
