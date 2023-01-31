import React, { useState } from "react";
import styled from "styled-components";
import Flexbox from "../../common/Flexbox";
import ExpandIcon from "../../../assets/down-arrow.svg";

const Container = styled.div`
  padding: 1rem;
  background-color: #f0ead299;
  border-radius: 10px;
`;

const NameContainer = styled.div``;

const Name = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  color: #6c584c;
`;

const Date = styled.p`
  font-size: 1rem;
  font-weight: 400;
  text-align: left;
`;

const Arrow = styled.img`
  transform: ${props => props.opened && "rotate(180deg)"};
`;

const Address = styled.p`
  font-size: 1.25rem;
  opacity: 60%;
  font-weight: 400;
  width: 90%;
  margin: 0.5rem 0;
  text-align: left;
`;

const Id = styled.p`
  font-size: 0.8rem;
  text-align: left;
  font-weight: 500;
`;

const WalletAddress = styled.p`
  font-size: 0.8rem;
  font-weight: 400;
  text-align: left;
  margin: 0.5rem 0;
`;

const ProfileCard = ({ data }) => {
  const [opened, setOpened] = useState(false);
  return (
    <Container>
      <Flexbox justify="space-between">
        <NameContainer>
          <Name>MG FARMS</Name>
          <Date>21/02/2022</Date>
        </NameContainer>
        <Arrow
          src={ExpandIcon}
          opened={opened}
          onClick={() => setOpened(!opened)}
        />
      </Flexbox>
      {opened && (
        <>
          <Address>
            c/o MG Contractors Panchkula Ind Are PKL Haryana, India
          </Address>
          <Id>Farm Token ID #123456</Id>
          <WalletAddress>
            Producer wallet Address Here
            <br /> In Two Lines
          </WalletAddress>
        </>
      )}
    </Container>
  );
};

export default ProfileCard;
