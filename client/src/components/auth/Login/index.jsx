import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../../../assets/logo.svg";
import Button from "../../common/Button";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  padding: 1rem;
`;

const Heading = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  color: #6c584c;
  margin: 0;
`;

const MiddleContainer = styled.div`
  text-align: center;
  margin-top: 6rem;
`;

const LogoImage = styled.img``;

const Input = styled.input`
  width: 20rem;
  height: 3rem;
  padding: 0.75rem;
  border: none;
  background-color: #d9d9d933;
  border-radius: 12px;
  margin: 2rem 0;
`;

const Login = () => {
  const [number, setNumber] = useState("");
  const [authorised, setAuthorised] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [otp, setOtp] = useState("");

  const getOTP = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/login`, {
        phone: number,
      })
      .then(res => {
        console.log("res : ", res);

        if (res.status === 200) {
          setAuthorised(true);
        }
      })
      .catch(err => {
        console.log("error in sending otp", err);
      });
  };

  const verifyOTP = () => {
    console.log("Inside verify otp");
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/verify`, {
        phone: number,
        otp,
      })
      .then(res => {
        localStorage.setItem("user", JSON.stringify(res?.data));
        setUser(res?.data);
        console.log("res : ", res);
      })
      .catch(err => {
        console.log("error in submitting otp", err);
      });
  };

  return (
    <>
      {user && <Navigate to="/" replace={true} />}
      <Container>
        <Heading>Login</Heading>
        {!authorised ? (
          <MiddleContainer>
            <LogoImage src={Logo} alt="logo" />
            <Input
              type="number"
              placeholder="Enter Moblile Number"
              value={number}
              onChange={e => setNumber(e.target.value)}
            />
            <Button text="SEND OTP" onClick={getOTP} />
          </MiddleContainer>
        ) : (
          <MiddleContainer>
            <LogoImage src={Logo} alt="logo" />
            <Input
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
            <Button text="VERIFY" onClick={verifyOTP} />
          </MiddleContainer>
        )}
      </Container>
    </>
  );
};

export default Login;
