import React from "react";
import styled from "styled-components";

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
`;

const Modal = () => {
  return (
    <Container>
      <InnerContianer></InnerContianer>
    </Container>
  );
};

export default Modal;
