import React, { useState, useEffect } from "react";
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
  text-decoration: center;
`;

const BackGround = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const MiddleContainer = styled.div`
  margin-top: 6rem;
  display: block;
  text-align: center;
`;

const Input = styled.input`
  width: 45rem;
  height: 3rem;
  padding: 0.75rem;
  border: none;
  background-color: #d9d9d933;
  border-radius: 12px;
  margin: 1rem 1rem;
  text-align: left;
  -moz-appearance: textfield; /* remove up/down counter in Firefox */
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  @media screen and (max-width: 990px) {
    width: 20rem;
  }
`;

const Heading = styled.p`
  font-size: 2rem;
  font-weight: 600;
  color: #6c584c;
  margin: 0;
`;

const Title = styled.p`
  font-weight: 600;
  color: #6c584c;
  text-align: left;
  margin-left: 5.3rem;
  @media screen and (max-width: 990px) {
    margin-left: 1.5rem;
  }
`;

const ResendMessageStyle = styled.p`
  font-size: 0.7rem;
  color: blue;
  margin: 0.5rem 1rem;
  margin-bottom: 2.5rem;
  text-align: right;
  text-decoration: underline;
`;

const Resend = styled.p`
  font-size: 1.25rem;
  color: blue;
  font-weight: 700;
  opacity: ${props => (props.active ? 1 : 0.3)};
`;

const Register = () => {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [address, setAddress] = useState("");
  const [otp, setOtp] = useState("");
  const [authorised, setAuthorised] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);

  useEffect(() => {
    let interval;
    if (authorised) {
      interval = setInterval(() => {
        if (timeRemaining > 0) {
          setTimeRemaining(timeRemaining => timeRemaining - 1);
        } else {
          setTimeRemaining(0);
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [authorised, timeRemaining]);

  const getRegisterOTP = () => {
    console.log("register", name, number, mail, address);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/register`, {
        name: name,
        phone: number,
        email: mail,
        address: address,
      })
      .then(res => {
        if (res.status === 200) {
          console.log("res", res);
          setAuthorised(true);
        }
      })
      .catch(err => {
        console.log("error in sending otp", err);
      });
  };

  const verifyOTP = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/verify-register`, {
        phone: number,
        otp: otp,
      })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          window.location.href = "/login";
        }
      })
      .catch(err => {
        console.log("error in otp", err);
      });
  };

  return (
    <Container>
      <LeftContainer>
        <BackGround src={LoginImage} />
      </LeftContainer>
      <RightContainer>
        {!authorised ? (
          <MiddleContainer>
            <Heading>Register</Heading>
            <LogoImage src={Logo} alt="Logo" />
            <br />
            <Title>NAME</Title>
            <Input
              type="string"
              placeholder="Enter Name"
              value={name}
              required
              onChange={e => setName(e.target.value)}
            />
            <br />
            <Title>EMAIL</Title>
            <Input
              type="email"
              placeholder="Enter Email Address"
              value={mail}
              required
              onChange={e => setMail(e.target.value)}
            />
            <br />
            <Title>PHONE</Title>
            <Input
              type="number"
              placeholder="Enter Mobile Number"
              value={number}
              required
              onChange={e => setNumber(e.target.value)}
            />
            <br />
            <Title>ADDRESS</Title>
            <Input
              type="address"
              placeholder="Enter Address"
              value={address}
              required
              onChange={e => setAddress(e.target.value)}
            />
            <Button text={"SEND OTP"} onClick={getRegisterOTP} />
          </MiddleContainer>
        ) : (
          <MiddleContainer>
            <LogoImage src={Logo} alt="logo" />
            <br />
            <Input
              type="number"
              placeholder="Enter OTP"
              style={{ textAlign: "center" }}
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
            {timeRemaining === 0 ? (
              <ResendMessageStyle
                onClick={verifyOTP}
              >{`Resend OTP`}</ResendMessageStyle>
            ) : (
              <ResendMessageStyle>{`Resend OTP in ${timeRemaining} seconds`}</ResendMessageStyle>
            )}
            <Resend active={timeRemaining === 0} onClick={verifyOTP} />
            <Button text="VERIFY" onClick={verifyOTP} />
          </MiddleContainer>
        )}
      </RightContainer>
    </Container>
  );
};

export default Register;
