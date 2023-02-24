import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { addToCart } from "../../../redux/actions/cartActions";
import Button from "../Button";
import Flexbox from "../Flexbox";
import NFTPopup from "../../common/NFTPopup";
import NewIcon from "../../../assets/new.svg";

const Container = styled.div`
  position: relative;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f0ead254;
  border: ${props => props.highlight && "2px solid #ADC178"};
  margin: 1rem 0;
`;

const Id = styled.p`
  font-size: 0.8rem;
  font-weight: 700;
  opacity: 0.6;
`;

const Name = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
`;

const Date = styled.p`
  font-size: 0.75rem;
  font-weight: 400;
`;

const Address = styled.p`
  font-size: 1.25rem;
  font-weight: 400;
  margin: 1rem 0;
  opacity: 0.6;
`;

const InnerContainer = styled(Flexbox)`
  padding: 1rem;
  background-color: #dde5b654;
  justify-content: space-between;
`;

const Crop = styled.p`
  font-size: 1.25rem;
  font-weight: 400;
`;

const Area = styled.p`
  font-size: 1rem;
  font-weight: 600;
`;

const Amount = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
`;

const PopupContent = styled.p`
  padding: 0.5rem;
  @media screen and (max-width: 990px) {
    overflow-x: scroll;
    scroll-margin-top: 1rem;
  }
`;

const New = styled.img`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  height: 1rem;
`;

const Card = ({ data, highlight }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedNFTId, setSelectedNFTId] = useState("");

  const user = useSelector(store => store.auth.user);
  const cart = useSelector(store => store.cart.cart);
  const dispatch = useDispatch();

  const farmProfile = () => {
    window.location.href = `/farms/${btoa(data?._id.farm_id)}`;
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...data, selected_quantity: quantity }));
  };

  const incrementQuantity = useCallback(() => {
    if (quantity < data.unit_available) {
      setQuantity(quantity + 1);
    }
  });

  const decrementQuantity = useCallback(() => {
    if (quantity > 1 && quantity <= data.unit_available) {
      setQuantity(quantity - 1);
    }
  });

  const togglePopup = nftId => {
    if (selectedNFTId === nftId) {
      setSelectedNFTId("");
    } else {
      setSelectedNFTId(nftId);
    }
  };

  const ButtonText = () => {
    let cartContract = cart.filter(
      item => item.agreements[0] === data.agreements[0]
    );
    return cartContract.length > 0
      ? `${cartContract[0].selected_quantity} Units added`
      : "Add to cart";
  };

  ButtonText();

  return user ? (
    <>
      {selectedNFTId &&
        data?.agreement_nft_id.map((nftId, index) => (
          <NFTPopup
            isOpen={selectedNFTId === nftId}
            togglePopup={togglePopup}
            tx_hash={data.tx_hash[index]}
            width={100}
          >
            <PopupContent>
              IPFS URL:
              <a href={data?.ipfs_url[index]} target="_blank">
                {data?.ipfs_url[index]}
              </a>
            </PopupContent>
          </NFTPopup>
        ))}
      <Container>
        <Id>
          Contract NFT ID{" "}
          {data?.agreement_nft_id.map((nftId, index) => (
            <a style={{ color: "blue" }} onClick={() => togglePopup(nftId)}>
              #{nftId}{" "}
            </a>
          ))}
        </Id>
        <Flexbox justify="space-between">
          <Name onClick={farmProfile}>{data?.farmer_name}</Name>
          <div>
            <Date>{`from ${data?._id.start_date}`}</Date>
            <Date>{`to ${data?._id.end_date}`}</Date>
          </div>
        </Flexbox>
        <Address>{data?.address}</Address>
        <InnerContainer style={{ display: "block" }}>
          <Crop>{data?._id.crop}</Crop>
          <Flexbox justify="space-between">
            <Area style={{ marginTop: "0.5rem" }}>
              Quantity: {data?.unit_available}
            </Area>
            <Area>{data?._id.area}</Area>
          </Flexbox>
        </InnerContainer>
        <Flexbox justify="space-between" margin="1rem 0">
          <Amount>₹ {data?._id.price}</Amount>
          {user.data.role === "customer" && (
            <div>
              <Flexbox justify="space-between" margin="0.5rem 0">
                <Button
                  text="-"
                  margin="0.1rem"
                  onClick={decrementQuantity}
                  disabled={quantity === 1}
                />
                <p>{quantity}</p>
                <Button
                  text="+"
                  margin="0.1rem"
                  onClick={incrementQuantity}
                  disabled={quantity === data?.unit_available}
                />
              </Flexbox>
              <Button
                text={ButtonText()}
                margin="unset"
                onClick={handleAddToCart}
                disabled={ButtonText() !== "Add to cart"}
              />
            </div>
          )}
        </Flexbox>
      </Container>
    </>
  ) : null;
};

export default Card;
