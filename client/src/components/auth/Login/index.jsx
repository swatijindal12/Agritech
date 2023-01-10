import React from 'react'
import styled from "styled-components"
import Logo from "../../../assets/logo.svg"
import Button from '../../common/Button';
import {Link} from "react-router-dom"

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    padding: 1rem;
`;

const Heading = styled.p`
    font-size: 1.5rem;
    font-weight: 600;
    color: #6C584C;
    margin: 0;
`

const MiddleContainer = styled.div`
    text-align: center;
    margin-top: 6rem;
`

const LogoImage = styled.img``

const Input = styled.input`
    width: 20rem;
    height: 3rem;
    padding: 0.75rem;
    border: none;
    background-color: #D9D9D933;
    border-radius: 12px;
    margin: 2rem 0;
`

const RegisterText = styled.p`
    font-size: 1.25rem;
    font-weight: 400;

`

const Login = () => {
  return (
    <Container>
        <Heading>Login</Heading>
        <MiddleContainer>
            <LogoImage src={Logo} alt="logo" />
            <Input type="number" placeholder="Enter Moblile Number" />
            <Button text="SEND OTP" />
            <RegisterText>Don’t have Account <Link to="/register">Register</Link> </RegisterText>
        </MiddleContainer>
    </Container>
  )
}

export default Login