import React from "react";
import styled from "styled-components";
import Lottie from "lottie-react";
import SuccessLottie from "../../../assets/lottie/success.json";

const Container = styled.div`
  position: fixed;
  display: grid;
  place-items: center;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
`;

const InnerContianer = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
`;

const Message = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: #adc178;
  margin-bottom: 1rem;
`;

const Modal = () => {
  return (
    <>
      <Container>
        <InnerContianer>
          <Message>Payment Successfull</Message>
          <Lottie
            animationData={SuccessLottie}
            loop={false}
            style={{ height: "100px" }}
          />
        </InnerContianer>
      </Container>
    </>
  );
};

export default Modal;
