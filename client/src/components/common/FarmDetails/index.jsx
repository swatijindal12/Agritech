import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import styled from "styled-components";
import Title from "../../common/Title";
import Flexbox from "../../common/Flexbox";
import LocationIcon from "../../../assets/farms/location.svg";
import Stars from "../../../assets/farms/star.svg";
import BackButton from "../../../assets/back-button.svg";
import InfoIcon from "../../../assets/info-icon.svg";
import NFTPopup from "../../common/NFTPopup";
import axios from "axios";
// import { farmDetails } from "./tempData";

const Container = styled.div`
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

const PopupContent = styled.p`
  padding: 0.5rem;
  @media screen and (max-width: 990px) {
    overflow-x: scroll;
    scroll-margin-top: 1rem;
  }
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

const InfoImg = styled.img`
  width: 1.5rem;
  height: 1.2rem;
  margin-left: 0.5rem;
  position: relative;
  margin-top: 0.5rem;
`;

const Tooltip = styled.div`
  position: absolute;
  visibility: ${props => (props.show ? "visible" : "hidden")};
  z-index: 1;
  left: 50%;
  transform: translated(-50%, -100%);
  background-color: #00000099;
  color: #fff;
  padding: 0.5rem;
  border-radius: 8px;
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

const RatingNumber = styled.p`
  font-size: 1.25rem;
  opacity: 60%;
  font-weight: 400;
  color: "#6C584C";
  padding: 0;
  margin-right: 5.5rem;
`;

const FarmDetails = () => {
  const [farmDetails, setFarmDetails] = useState(null);
  const [showTooltip1, setShowTooltip1] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const user = useSelector(store => store.auth.user);

  const { slug } = useParams();

  const togglePopup = value => setIsPopupOpen(value);
  const handleInfoIcon1Hover = () => setShowTooltip1(!showTooltip1);
  const handleInfoIcon2Hover = () => setShowTooltip2(!showTooltip2);

  useEffect(() => {
    console.log("here the user id is ", atob(slug));
  }, [slug]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/marketplace/farm/${atob(slug)}`, {
        headers: {
          Authorization: "Bearer " + user?.data.token,
        },
      })
      .then(res => {
        console.log("res is", res.data.data.farm);
        console.log("farmer data is", res.data.data.farmer);
        setFarmDetails(res.data.data);
        // console.log("data", res.data.data.farm);
      })
      .catch(err => console.log("Error in fetching dashboard data ", err));
  }, [slug]);

  return (
    <Container>
      {farmDetails && (
        <div>
          <Flexbox justify="space-between">
            <img src={BackButton} onClick={() => window.history.go(-1)} />
            <Title>{farmDetails?.farm?.name}</Title>
          </Flexbox>
          <br />
          <Image
            src={farmDetails?.farm?.image_url}
            key={farmDetails?.farm?.farm_nft_id}
          />
          <Flexbox justify="space-between" margin="0.5rem">
            <NameContainer>
              <Id>
                NFT TOKEN ID{" "}
                {/* <a href={farmDetails?.farm?.tx_hash} target="_blank">
                  #{farmDetails?.farm?.farm_nft_id}
                </a> */}
                <a style={{ color: "blue" }} onClick={() => togglePopup(true)}>
                  #{farmDetails?.farm?.farm_nft_id}
                </a>
                <NFTPopup
                  isOpen={isPopupOpen}
                  togglePopup={togglePopup}
                  tx_hash={farmDetails?.farm?.tx_hash}
                >
                 <PopupContent>
                    IPFS URL:
                    <a href={farmDetails?.farm?.ipfs_url} target="_blank">
                      {farmDetails?.farm?.ipfs_url}
                    </a>
                  </PopupContent>
                </NFTPopup>
              </Id>
            </NameContainer>
          </Flexbox>

          <Name>{farmDetails?.farm?.area}</Name>
          <Flexbox justify="space-between" margin="0.5rem 0.5rem 0.5rem 0">
            <Address>{farmDetails?.farm?.address}</Address>
            <img
              src={LocationIcon}
              onClick={() => window.open(farmDetails?.farm?.location)}
            />
          </Flexbox>
          <Video height="240" controls>
            <source src={farmDetails?.farm?.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </Video>

          <Id>{farmDetails?.farm?.crops}</Id>
          <ViewMore
            onClick={() => window.open(farmDetails?.farm?.farm_practice_pdf)}
          >
            Read more about farm practices
          </ViewMore>
          <ViewMore onClick={() => window.open(farmDetails?.farm?.farm_pdf)}>
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
              <img src={Stars} style={{ marginLeft: "5.8rem" }} />
              <RatingNumber>{farmDetails?.farm?.rating}</RatingNumber>
            </Flexbox>
            <Flexbox justify="space-content">
              <p style={{ color: "#6c584c", marginTop: "0.7rem" }}>
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
              <RatingNumber>
                {farmDetails?.farm?.farm_practice_rating}
              </RatingNumber>
            </Flexbox>
          </Flexbox>
          <br />
          <p color="#6c584c">Farmer Details</p>
          <FarmerName>{farmDetails?.farmer?.name}</FarmerName>
          <Number>{farmDetails?.farmer?.phone}</Number>
          <Address>{farmDetails?.farmer?.address}</Address>
          <ViewMore
            onClick={() => window.open(farmDetails?.farmer?.farmer_pdf)}
          >
            View more
          </ViewMore>
        </div>
      )}
    </Container>
  );
};

export default FarmDetails;
