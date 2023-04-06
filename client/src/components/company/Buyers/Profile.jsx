import React, { useState , useEffect} from "react";
import styled from "styled-components";
import Flexbox from "../../common/Flexbox";
import ProfileCard from "./ProfileCard";
import {useParams} from "react-router-dom"

const Container = styled.div`
  padding: 1rem;
  text-align: center;
`;

const Image = styled.img`
  height: 11rem;
  width: 11rem;
  border-radius: 50%;
`;

const Name = styled.p`
  font-size: 2rem;
  font-weight: 600;
`;

const OptionContainer = styled(Flexbox)`
  margin: 2rem 0 1rem;
  border-bottom: 0.5px solid #71835533;
  justify-content: space-around;
`;

const Option = styled.div`
  width: 35%;
  text-align: center;
  color: #718355;
  font-size: 1.8rem;
  font-weight: 600;
  border-bottom: ${props => props.selected && "4px solid #718355"};
  padding-bottom: 0.5rem;
`;

const Profile = () => {
  const [currentPage, setCurrentpage] = useState("active");
  const {slug} = useParams();

useEffect(()=> {
  // console.log("here the user id is ", slug);
}, [])

  return (
    <Container>
      <Image src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200" />
      <Name>Rajeev Kumar</Name>
      <OptionContainer>
        <Option
          selected={currentPage === "active"}
          onClick={() => setCurrentpage("active")}
        >
          Active
        </Option>
        <Option
          selected={currentPage === "closed"}
          onClick={() => setCurrentpage("closed")}
        >
          Closed
        </Option>
      </OptionContainer>
      <ProfileCard />
    </Container>
  );
};

export default Profile;
