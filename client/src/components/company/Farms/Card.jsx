import React, { useState } from "react";
import styled from "styled-components";
import ExpandIcon from "../../../assets/down-arrow.svg";
import Flexbox from "../../common/Flexbox";
import LocationIcon from "../../../assets/farms/location.svg";
import Stars from "../../../assets/farms/starYellow.svg";
import StarRed from "../../../assets/farms/starRed.svg";
import StarBlue from "../../../assets/farms/starBlue.svg";
import InfoIcon from "../../../assets/info-icon.svg";
import NFTPopup from "../../common/NFTPopup";
import NewIcon from "../../../assets/new.svg";

const Container = styled.div`
  position: relative;
  width: 48%;
  height: fit-content;
  background-color: #f0ead2;
  padding: 0.5rem;
  border-radius: 8px;
  margin: 1rem 0;
  border: ${props => props.highlight && "2px solid #ADC178"};
  @media only screen and (max-width: 990px) {
    width: 100%;
  }
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
  max-height: 19rem;
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
  cursor: pointer;
`;

const Down = styled.img`
  transform: ${props => props.opened && "rotate(180deg)"};
  position: absolute;
  right: 10px;
  @media screen and (max-width: 990px) {
    margin-left: 18.5rem;
  }
`;

const Star = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-left: -10.5rem;
  margin-left: ${props => (props.marginLeft ? props.marginLeft : "-10.5rem")};
  margin-top: 0.6rem;
  top: 2rem;
  @media only screen and (max-width: 990px) {
    margin-left: ${props =>
      props.marginLeftMobile ? props.marginLeftMobile : "1rem"};
    margin-top: 0.5rem;
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
  margin: 0.5rem 0;
`;

const RatingNumber = styled.p`
  font-size: 1.25rem;
  opacity: 60%;
  font-weight: 400;
  color: "#6C584C";
  margin-top: 0.3rem;
  @media screen and (max-width: 990px) {
    margin-top: 0.5rem;
  }
`;

const RatingNumber2 = styled.p`
  font-size: 1.25rem;
  opacity: 60%;
  font-weight: 400;
  color: "#6C584C";
  margin-top: 0.7rem;
  @media screen and (max-width: 990px) {
    margin-top: 0.7rem;
  }
`;

const InfoImg = styled.img`
  width: 1.5rem;
  height: 1.2rem;
  margin-left: 0.5rem;
  position: relative;
  margin-top: 1.5rem;
  @media screen and (max-width: 990px) {
    margin-top: 0.7rem;
  }
`;

const Tooltip = styled.div`
  visibility: ${props => (props.show ? "visible" : "hidden")};
  z-index: 1;
  transform: translate(-50%, -100%);
  background-color: #0000099f;
  color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: -8.5rem;
  margin-left: 3rem;
  @media only screen and (max-width: 990px) {
    left: 30%;
    position: absolute;
    padding: 0.5rem;
    margin-bottom: -5.5rem;
    width: 80%;
  }
`;

const PopupContent = styled.p`
  padding: 0.5rem;
  @media screen and (max-width: 990px) {
    scroll-margin-top: 1rem;
    max-width: 20rem;
    overflow-x: scroll;
  }
`;

const RatingName = styled.p`
  color: #6c584c;
  margin-top: 1.5rem;
  @media screen and (max-width: 990px) {
    margin-top: 0.5rem;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
`;

const New = styled.img`
  position: absolute;
  top: 1rem;
  right: 1rem;
  height: 1rem;
`;

const Card = ({ data, highlight }) => {
  const [opened, setOpened] = useState(false);
  const [showTooltip1, setShowTooltip1] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showTooltip3, setShowTooltip3] = useState(false);

  const togglePopup = value => setIsPopupOpen(value);
  const handleInfoIcon1Hover = () => setShowTooltip1(!showTooltip1);
  const handleInfoIcon2Hover = () => setShowTooltip2(!showTooltip2);
  const handleInfoIcon3Hover = () => setShowTooltip3(!showTooltip3);

  // const createContract = () => {
  //   localStorage.setItem("current-selected-farm", JSON.stringify(data));
  //   window.location.href = "/create-contract";
  // };

  return (
    <>
      <Container>
        <Image src={data.image_url} key={data.farm_nft_id} />
        <Flexbox justify="space-between" margin="0.5rem">
          {opened ? (
            <Flexbox>
              <NameContainer>
                <Name>{data.name}</Name>
                <Id>
                  NFT TOKEN ID{" "}
                  <a
                    style={{ color: "blue" }}
                    onClick={() => togglePopup(true)}
                  >
                    #{data.farm_nft_id}
                  </a>
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
              Read more about farm
            </ViewMore>
            <Flexbox style={{ display: "block" }}>
              <p style={{ marginTop: "1.5rem", fontSize: "20px" }}>Rating</p>
              <Flexbox justify="space-content" style={{ maxHeight: "0.8rem" }}>
                <RatingName>Farm</RatingName>
                <InfoImg
                  src={InfoIcon}
                  onMouseEnter={handleInfoIcon1Hover}
                  onMouseLeave={handleInfoIcon1Hover}
                />
                <Tooltip show={showTooltip1}>
                  Farm Rating parameters:
                  <p>
                    <br />{" "}
                  </p>
                  <p>1. Farm details</p>
                  <p>2. Farm land record</p>
                  <p>3. Soil type quality</p>
                  <p>4. Water quality</p>
                </Tooltip>
                <Star
                  src={Stars}
                  marginLeft={"-3.8rem"}
                  marginLeftMobile={"6.5rem"}
                />
                <RatingNumber>{data?.rating}</RatingNumber>
              </Flexbox>
              <Flexbox
                justify="space-content"
                style={{ alignItems: "baseline", maxHeight: "2rem" }}
              >
                <RatingName>Farm practices</RatingName>
                <InfoImg
                  src={InfoIcon}
                  onMouseEnter={handleInfoIcon2Hover}
                  onMouseLeave={handleInfoIcon2Hover}
                />
                <Tooltip show={showTooltip2}>
                  Farm practices rating parameters:
                  <p>
                    <br />{" "}
                  </p>
                  <p>1. Process identified</p>
                  <p>2. Quality of products utilized</p>
                  <p>3. Process Documented</p>
                  <p>4. Compliance process</p>
                </Tooltip>
                <RatingContainer>
                  {" "}
                  <Star
                    src={StarRed}
                    marginLeft={"-12.2rem"}
                    marginLeftMobile={"2.2rem"}
                  />
                  <RatingNumber2>{data?.farm_practice_rating}</RatingNumber2>
                </RatingContainer>
              </Flexbox>
              <Flexbox
                justify="space-content"
                style={{ alignItems: "baseline", maxHeight: "3rem" }}
              >
                <RatingName>Farmer</RatingName>
                <InfoImg
                  src={InfoIcon}
                  onMouseEnter={handleInfoIcon3Hover}
                  onMouseLeave={handleInfoIcon3Hover}
                />
                <Tooltip show={showTooltip3}>
                  Farmer rating parameters:
                  <p>
                    <br />{" "}
                  </p>
                  <p>1. Process identified</p>
                  <p>2. Quality of products utilized</p>
                  <p>3. Process Documented</p>
                  <p>4. Compliance process</p>
                </Tooltip>
                <RatingContainer>
                  {" "}
                  <Star
                    src={StarBlue}
                    marginLeft={"-7rem"}
                    marginLeftMobile={"5.5rem"}
                  />
                  <RatingNumber2>{data?.farmer_rating}</RatingNumber2>
                </RatingContainer>
              </Flexbox>
            </Flexbox>
          </>
        )}
      </Container>
      {isPopupOpen && (
        <NFTPopup
          heading="Farm NFT"
          isOpen={isPopupOpen}
          togglePopup={togglePopup}
          tx_hash={data.tx_hash}
          getUrl={data?.ipfs_url}
          dbData={data}
          requiredFields={[
            "rating",
            "farmer_rating",
            "farm_practice_rating",
            "location",
          ]}
        />
      )}
    </>
  );
};

export default Card;
