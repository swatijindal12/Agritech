import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Logo from "../../../assets/logo.png";
import Button from "../../common/Button";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../redux/actions";
import LoginImage from "../../../assets/login.jpg";
import { useRef } from "react";

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  padding: 0;
  display: flex;
  width: 100vw;
  @media only screen and (max-width: 990px) {
    display: block;
    padding: 0.5rem;
    height: auto;
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
  -moz-appearance: textfield; /* remove up/down counter in Firefox */
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

const ResendMessageStyle = styled.p`
  font-size: 0.7rem;
  color: blue;
  margin: 0.5rem 1rem;
  margin-bottom: 2.5rem;
  text-align: right;
  text-decoration: none;
  cursor: pointer;
`;

const Resend = styled.p`
  font-size: 1.25rem;
  color: blue;
  font-weight: 700;
  opacity: ${props => (props.active ? 1 : 0.3)};
`;

const Error = styled.p`
  color: red;
`;

const Login = () => {
  const [number, setNumber] = useState("");
  const [authorised, setAuthorised] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(30);
  const dispatch = useDispatch();
  const user = useSelector(store => store.auth.user);
  const otpError = useSelector(store => store.auth.error);
  const navigate = useNavigate();
  const loginRef = useRef();
  const otpRef = useRef();

  useEffect(() => {
    loginRef.current.focus();
  }, []);

  useEffect(() => {
    setError(otpError);
  }, [otpError]);

  useEffect(() => {
    let interval;
    if (authorised) {
      otpRef.current.focus();
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
        // console.log("res : ", res);
        if (res.status === 200) {
          setAuthorised(true);
        }
      })
      .catch(err => {
        // console.log("error in sending otp", err);
        setError(err?.response?.data?.error);
      });
  };

  const verifyOTP = () => {
    dispatch(loginUser({ phone: number, otp }));
  };

  const handleClick = () => {
    navigate("/register");
  };

  const handleKeyPress = event => {
    if (event.key === "Enter") {
      getOTP();
    }
  };

  const handleKeyPress1 = event => {
    if (event.key === "Enter") {
      verifyOTP();
    }
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
              {error && <Error>Error: {error}</Error>}
              <Input
                ref={loginRef}
                type="number"
                placeholder="Enter Mobile Number"
                value={number}
                onChange={e => setNumber(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button text="SEND OTP" onClick={getOTP} />
              <ResendMessageStyle
                style={{ fontSize: "1rem", marginTop: "1rem" }}
                onClick={handleClick}
              >
                {`Register as a customer`}
              </ResendMessageStyle>
            </MiddleContainer>
          ) : (
            <MiddleContainer>
              <LogoImage src={Logo} alt="logo" />
              <br />
              {error && <Error>Error: {error}</Error>}
              <Input
                ref={otpRef}
                type="number"
                placeholder="Enter OTP"
                style={{ textAlign: "center" }}
                value={otp}
                onChange={e => setOtp(e.target.value)}
                onKeyPress={handleKeyPress1}
              />
              {timeRemaining === 0 ? (
                <ResendMessageStyle
                  onClick={getOTP}
                >{`Resend OTP`}</ResendMessageStyle>
              ) : (
                <ResendMessageStyle>{`Resend OTP in ${timeRemaining} seconds`}</ResendMessageStyle>
              )}
              <Resend active={timeRemaining === 0} onClick={getOTP} />
              <Button text="VERIFY" onClick={verifyOTP} />
            </MiddleContainer>
          )}
          {}
        </RightContainer>
      </Container>
      {/* <Footer /> */}
    </>
  );
};

export default Login;
