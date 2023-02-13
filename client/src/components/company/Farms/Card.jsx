import React, { useState } from "react";
import styled from "styled-components";
import ExpandIcon from "../../../assets/down-arrow.svg";
import Flexbox from "../../common/Flexbox";
import LocationIcon from "../../../assets/farms/location.svg";
import Stars from "../../../assets/farms/star.svg";
import InfoIcon from "../../../assets/info-icon.svg";
import NFTPopup from "../../common/NFTPopup";

const Container = styled.div`
  width: 45%;
  height: fit-content;
  background-color: #f0ead2;
  padding: 0.5rem;
  border-radius: 8px;
  margin: 1rem 0;
  @media only screen and (max-width: 990px) {
    width: 100%;
  }
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

const Down = styled.img`
  transform: ${props => props.opened && "rotate(180deg)"};
  position: absolute;
  margin-left: 47.5rem;
  @media screen and (max-width: 990px) {
    margin-left: 18.5rem;
  }
`;

const Star = styled.img`
  margin-left: 9.5rem;
  @media only screen and (max-width: 990px) {
    margin-left: 5.5rem;
  }
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

const RatingNumber = styled.p`
  font-size: 1.25rem;
  opacity: 60%;
  font-weight: 400;
  color: "#6C584C";
`;

const InfoImg = styled.img`
  width: 1.5rem;
  height: 1.2rem;
  margin-left: 0.5rem;
  position: relative;
  margin-top: 0.5rem;
`;

const Tooltip = styled.div`
  visibility: ${props => (props.show ? "visible" : "hidden")};
  z-index: 1;
  left: 25%;
  transform: translate(-50%, -100%);
  background-color: #00000099;
  color: #fff;
  padding: 0rem;
  border-radius: 8px;
  @media only screen and (max-width: 990px) {
    left: 50%;
    position: absolute;
    padding: 0.5rem;
  }
`;

const PopupContent = styled.p`
  padding: 0.5rem;
  @media screen and (max-width: 990px) {
    overflow-x: scroll;
    scroll-margin-top: 1rem;
  }
`;

const Card = ({ data }) => {
  const [opened, setOpened] = useState(false);
  const [showTooltip1, setShowTooltip1] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = value => setIsPopupOpen(value);
  const handleInfoIcon1Hover = () => setShowTooltip1(!showTooltip1);
  const handleInfoIcon2Hover = () => setShowTooltip2(!showTooltip2);

  // const createContract = () => {
  //   localStorage.setItem("current-selected-farm", JSON.stringify(data));
  //   window.location.href = "/create-contract";
  // };

  return (
    <Container>
      <Image src={data.image_url} key={data.farm_nft_id} />
      <Flexbox justify="space-between" margin="0.5rem">
        {opened ? (
          <Flexbox>
            <NameContainer>
              <Name>{data.name}</Name>
              <Id>
                NFT TOKEN ID{" "}
                <a style={{ color: "blue" }} onClick={() => togglePopup(true)}>
                  #{data.farm_nft_id}
                </a>
                <NFTPopup
                  isOpen={isPopupOpen}
                  togglePopup={togglePopup}
                  tx_hash={data.tx_hash}
                >
                  <PopupContent>farm_id:{data.farmer_id}</PopupContent>
                  <PopupContent>
                    IPFS URL:
                    <a href={data?.ipfs_url} target="_blank">
                      {data?.ipfs_url}
                    </a>
                  </PopupContent>
                </NFTPopup>
              </Id>
            </NameContainer>
          </Flexbox>
        ) : (
          <Name>{data.name}</Name>
        )}
        {!isPopupOpen && (
          <Down
            src={ExpandIcon}
            opened={opened}
            onClick={() => setOpened(!opened)}
          />
        )}
      </Flexbox>
      {opened && (
        <>
          <Name>{data.area}</Name>
          <Flexbox justify="space-between" margin="0.5rem 0.5rem 0.5rem 0">
            <Address>{data.address}</Address>
            <img
              src={LocationIcon}
              onClick={() => window.open(data.location)}
            />
          </Flexbox>
          <Video height="240" controls>
            <source src={data.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </Video>

          <Id>{data.crops}</Id>
          <Flexbox justify="space-between">
            <ViewMore onClick={() => window.open(data.farm_practice_pdf)}>
              Read more about farm practices
            </ViewMore>
          </Flexbox>
          <ViewMore onClick={() => window.open(data.farm_pdf)}>
            View more
          </ViewMore>
          <Flexbox style={{ display: "block" }}>
            <p style={{ marginTop: "0.5rem" }}>Rating</p>
            <Flexbox justify="space-content">
              <p style={{ color: "#6c584c", marginTop: "0.7rem" }}>Farm</p>
              <InfoImg src={InfoIcon} onClick={handleInfoIcon1Hover} />
              <Tooltip show={showTooltip1}>
                Farm Rating parameters:
                <p>1. Farm details</p>
                <p>2. Farm land record</p>
                <p>3. Soil type quality</p>
                <p>4. Water quality</p>
              </Tooltip>
              <Star src={Stars} />
              <RatingNumber>{data?.rating}</RatingNumber>
            </Flexbox>
            <Flexbox justify="space-content" style={{ alignItems: "baseline" }}>
              <p style={{ color: "#6c584c", marginTop: "0.2rem" }}>
                Farm practices
              </p>
              <InfoImg
                src={InfoIcon}
                onMouseEnter={handleInfoIcon2Hover}
                onMouseLeave={handleInfoIcon2Hover}
              />
              <Tooltip show={showTooltip2}>
                Farm practices rating parameters:
                <p>1. Process identified</p>
                <p>2. Quality of products utilized</p>
                <p>3. Process Documented</p>
                <p>4. Compliance process</p>
              </Tooltip>
              <img src={Stars} style={{ marginLeft: "1.3rem" }} />
              <RatingNumber>{data?.farm_practice_rating}</RatingNumber>
            </Flexbox>
          </Flexbox>
          {/* <Button text="CREATE CONTRACT" onClick={createContract} /> */}
        </>
      )}
    </Container>
  );
};

export default Card;
