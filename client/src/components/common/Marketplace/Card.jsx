import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { addToCart } from "../../../redux/actions/cartActions";
import Button from "../Button";
import Flexbox from "../Flexbox";

const Container = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background-color: #f0ead254;
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

const Card = ({ data }) => {
  const [quantity, setQuantity] = useState(1);
  const user = useSelector(store => store.auth.user);
  const dispatch = useDispatch();

  const farmProfile = () => {
    window.location.href = `/farms/${btoa(data.farm_id)}`;
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

  return user ? (
    <Container>
      <Id>
        Contract NFT ID{" "}
        {data.agreement_nft_id.map((nftId, index) => (
          <React.Fragment key={index}>
            <a href={data.tx_hash[index]} target="_blank">
              #{nftId}
            </a>{" "}
          </React.Fragment>
        ))}
      </Id>
      <Flexbox justify="space-between">
        <Name onClick={farmProfile}>{data.farmer_name}</Name>
        <div>
          <Date>{`from ${data.start_date}`}</Date>
          <Date>{`to ${data.end_date}`}</Date>
        </div>
      </Flexbox>
      <Address>{data.address}</Address>
      <InnerContainer>
        <Crop>{data.crop.toUpperCase()}</Crop>
        <Area>Quantity: {data.unit_available}</Area>
        <Area>{data._id}</Area>
      </InnerContainer>
      <Flexbox justify="space-between" margin="1rem 0">
        <Amount>₹ {data.price}</Amount>
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
                disabled={quantity === data.unit_available}
              />
            </Flexbox>
            <Button
              text="Add to cart"
              margin="unset"
              onClick={handleAddToCart}
            />
          </div>
        )}
      </Flexbox>
    </Container>
  ) : null;
};

export default Card;
