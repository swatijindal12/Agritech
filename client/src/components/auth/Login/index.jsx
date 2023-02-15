import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Logo from "../../../assets/logo.jpg";
import Button from "../../common/Button";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { loginUser } from "../../../redux/actions";
import LoginImage from "../../../assets/login.png";

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

const BackGround = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const Heading = styled.p`
  font-size: 2rem;
  font-weight: 600;
  color: #6c584c;
  margin: 0;
`;

const MiddleContainer = styled.div`
  text-align: center;
  margin-top: 6rem;
`;

const LogoImage = styled.img`
  height: 150px;
  width: 150px;
  object-fit: cover;
`;

const Input = styled.input`
  width: 20rem;
  height: 3rem;
  padding: 0.75rem;
  border: none;
  background-color: #d9d9d933;
  border-radius: 12px;
  margin: 2rem 0;
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

const Login = () => {
  const [number, setNumber] = useState("");
  const [authorised, setAuthorised] = useState(false);
  const [otp, setOtp] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(30);
  const dispatch = useDispatch();
  const user = useSelector(store => store.auth.user);

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
    dispatch(loginUser({ phone: number, otp }));
  };

  return (
    <>
      {user && (
        <Navigate
          to={user?.data?.role === "admin" ? "/" : "/contracts"}
          replace={true}
        />
      )}
      <Container>
        <LeftContainer>
          <BackGround src={LoginImage} />
        </LeftContainer>
        <RightContainer>
          {!authorised ? (
            <MiddleContainer>
              <Heading>Login</Heading>
              <LogoImage src={Logo} alt="logo" />
              <br />
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
                  onClick={getOTP}
                >{`Resend OTP`}</ResendMessageStyle>
              ) : (
                <ResendMessageStyle>
                  {`Resend OTP in ${timeRemaining} seconds`}
                </ResendMessageStyle>
              )}
              <Resend active={timeRemaining === 0} onClick={getOTP}></Resend>
              <Button text="VERIFY" onClick={verifyOTP} />
            </MiddleContainer>
          )}
        </RightContainer>
      </Container>
    </>
  );
};

export default Login;
