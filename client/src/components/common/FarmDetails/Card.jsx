import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Flexbox from "../Flexbox";
import stars from "../stars";
import LocationIcon from "../../../assets/farms/location.svg";
import BackButton from "../../../assets/back-button.svg";
import Title from "../../common/Title";
import { useParams } from "react-router-dom";

const Container = styled.div`
  background-color: #f0ead2;
  padding: 0.5rem;
  border-radius: 8px;
  margin: 1rem 0;
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const NameContainer = styled.div``;

const Name = styled.p`
  font-size: 1.5rem;
  color: #6c584c;
  font-weight: 500;
`;

const Id = styled.p`
  font-size: 0.8rem;
  color: #00000099;
`;

const Star = styled.img`
  margin-right: 8.5rem;
`;

const Address = styled.p`
  font-size: 1.25rem;
  color: #00000099;
  max-width: 70%;
`;

const Video = styled.video`
  width: 100%;
  margin-bottom: 1rem;
`;

const ViewMore = styled.p`
  font-size: 1.25rem;
  color: #0000ff;
  margin: 1rem 0;
`;

const Number = styled.p`
  font-size: 1.25rem;
  opacity: 60%;
  font-weight: 400;
  margin-top: -1rem;
`;

const FarmerName = styled.h2`
  padding-top: 0;
  margin-top: 0;
  position: "absolute";
  color: "#000000";
`;

const Card = ({ data }) => {
  const { slug } = useParams();

  useEffect(() => {
    console.log("here the user id is ", slug);
  }, []);

  return (
    <div>
      <Flexbox justify="space-between">
        <img src={BackButton} onClick={() => window.history.go(-1)} />
        <Title>{data.name}</Title>
      </Flexbox>
      <br />
      <Image src={data.image_url} key={data.farm_nft_id} />
      <Flexbox justify="space-between" margin="0.5rem">
        <NameContainer>
          <Id>
            NFT TOKEN ID{" "}
            <a href={data.tx_hash} target="_blank">
              #{data.farm_nft_id}
            </a>
          </Id>
        </NameContainer>
        <Star src={stars[Math.floor(data.rating) - 1]} />
      </Flexbox>

      <Name>{data.area}</Name>
      <Flexbox justify="space-between" margin="0.5rem 0.5rem 0.5rem 0">
        <Address>{data.address}</Address>
        <img src={LocationIcon} onClick={() => window.open(data.location)} />
      </Flexbox>
      <Video height="240" controls>
        <source src={data.video_url} type="video/mp4" />
        Your browser does not support the video tag.
      </Video>

      <Id>{data.crops}</Id>
      <ViewMore onClick={() => window.open(data.farm_practice_pdf)}>
        Read more about farm practices
        <img
          src={stars[Math.floor(data.farm_practice_rating) - 1]}
          style={{ width: "25px", height: "25px", marginRight: "0.5rem" }}
        />
      </ViewMore>
      <ViewMore onClick={() => window.open(data.farm_pdf)}>View more</ViewMore>
      <br />
      <p color="#6c584c">Farmer Details</p>
      <FarmerName>{data.farmer_name}</FarmerName>
      <Number>{data.number}</Number>
      <Address>{data.address}</Address>
      <ViewMore onClick={() => window.open(data.farm_pdf)}>View more</ViewMore>
    </div>
  );
};

export default Card;
