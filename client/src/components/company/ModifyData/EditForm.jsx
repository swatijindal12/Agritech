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
  border-radius: 12px;
  padding: 1rem;
`;

const Heading = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #a98467;
`;

const Form = styled.form`
  input {
    border-radius: 8px;
    border: none;
    background-color: #d9d9d954;
  }
`;

const EditForm = () => {
  return (
    <Container>
      <InnerContianer>
        <Heading>Edit Form</Heading>
        <Form></Form>
      </InnerContianer>
    </Container>
  );
};

export default EditForm;
