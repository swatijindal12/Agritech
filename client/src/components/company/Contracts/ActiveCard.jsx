import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Flexbox from "../../common/Flexbox";
import Button from "../../common/Button";
import axios from "axios";

const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  background-color: #f0ead254;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
`;

const Id = styled.p`
  font-size: 1.25rem;
  opacity: 60%;
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
  background-color: #dde5b654;
  justify-content: space-between;
`;

const Area = styled.p`
  font-size: 1rem;
  font-weight: 600;
`;

const ActiveCard = ({ data }) => {
  const user = useSelector(store => store.auth.user);

  const closeContract = () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/admin/agreement/closed/${data.agreements[0]}`
      )
      .then(res => console.log("Successfully updated ", res))
      .catch(err => console.log("Error in closing contract ", err));
  };

  return (
    <Container>
      <Id onClick={() => window.open(data.tx_hash)}>
        Contract Token ID #{data.agreement_nft_id}
      </Id>
      <Flexbox justify="space-between" margin="0.3rem 0">
        <Name>{data.farmer_name}</Name>
        <div>
          <Date>{`from ${data.start_date}`}</Date>
          <Date>{`to ${data.end_date}`}</Date>
        </div>
      </Flexbox>
      <Address>{data.address}</Address>
      <TypeBox>
        <Id styele={{ opacity: 1 }}>{data.crop.toUpperCase()}</Id>
        <Area>{data._id}</Area>
      </TypeBox>
      <Flexbox justify="space-between">
        <Area>₹ {data.price}</Area>
        {user.data.role === "admin" && (
          <Button text="CLOSE" margin="0 0 0 2rem" onClick={closeContract} />
        )}
      </Flexbox>
    </Container>
  );
};

export default ActiveCard;
