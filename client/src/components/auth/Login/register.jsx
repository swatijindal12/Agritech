import React, { useState } from "react";
import styled from "styled-components";
import Logo from "../../../assets/logo.jpg";
import Button from "../../common/Button";
import LoginImage from "../../../assets/login.png";
import axios from "axios";

const Container = styled.div`
  padding: 0;
  display: flex;
  @media only screen and (max-width: 990px) {
    display: block;
    padding: 1rem;
    height: 100vh;
    width: 100vw;
  }
`;

const RightContainer = styled.div`
  width: 50%;
  padding: 1rem;
  @media only screen and (max-width: 990px) {
    height: 100vh;
    width: 100vw;
  }
`;

const LeftContainer = styled.div`
  width: 50%;
  @media only screen and (max-width: 990px) {
    display: none;
  }
`;

const LogoImage = styled.img`
  height: 150px;
  width: 150px;
  object-fit: cover;
`;

const BackGround = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const MiddleContainer = styled.div`
  text-align: center;
  margin-top: 6rem;
  display: block;
`;

const Input = styled.input`
  width: 20rem;
  height: 3rem;
  padding: 0.75rem;
  border: none;
  background-color: #d9d9d933;
  border-radius: 12px;
  margin: 1rem 0;
`;

const Heading = styled.p`
  font-size: 2rem;
  font-weight: 600;
  color: #6c584c;
  margin: 0;
`;

const Register = () => {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [address, setAddress] = useState("");

  return (
    <Container>
      <LeftContainer>
        <BackGround src={LoginImage} />
      </LeftContainer>
      <RightContainer>
        <MiddleContainer>
          <Heading>Register</Heading>
          <LogoImage src={Logo} alt="Logo" />
          <br />
          <Input
            type="string"
            placeholder="Enter Name"
            value={name}
            required
            onChange={e => setName(e.target.value)}
          />
          <br />
          <Input
            type="email"
            placeholder="Enter email address"
            value={mail}
            required
            onChange={e => setMail(e.target.value)}
          />
          <br />
          <Input
            type="number"
            placeholder="Enter Mobile Number"
            value={address}
            required
            onChange={e => setAddress(e.target.value)}
          />
          <br />
          <Input 
          type="address"
          placeholder="Enter Address"
          value={number}
          required
          onChange={e => setNumber(e.target.value)}
        />
          <Button text={"SEND OTP"} />
        </MiddleContainer>
      </RightContainer>
    </Container>
  );
};

export default Register;
