import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../../common/Button";
import Flexbox from "../../common/Flexbox";

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
  width: 26rem;
  max-width: 26.5rem;
  max-height: 70vh;
  overflow-y: auto;

  ::-webkit-scrollbar {
    display: none;
  }
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

const InputContainer = styled.div`
  margin: 1rem 0;
`;

const Title = styled.p`
  font-weight: 600;
  color: #6c584c;
`;

const Input = styled.input`
  padding: 1rem;
  margin: 0.5rem 0;
  width: 100%;
`;

const EditForm = ({ data, updateItem, toggle }) => {
  const [inputs, setInputs] = useState([]);
  const [inputValues, setInputValues] = useState(data);

  useEffect(() => {
    let tempData = [];
    for (const key in data) {
      if (!key.includes("id")) tempData.push(key);
    }
    setInputs(tempData);
  }, []);

  const handleSubmit = () => {
    updateItem(inputValues);
    console.log("Inside submit ", inputValues);
  };

  const handleChange = (e, type) => {
    setInputValues({ ...inputValues, [type]: e.target.value });
  };

  return (
    <Container>
      <InnerContianer>
        <Heading>Edit Form</Heading>
        <Form>
          {inputs?.map(item => {
            return (
              <InputContainer>
                <Title>{item.toUpperCase()}</Title>
                <Input
                  type="text"
                  value={inputValues[item]}
                  onChange={e => handleChange(e, item)}
                />
              </InputContainer>
            );
          })}
          <Flexbox justify="space-around">
            <Button
              text="UPDATE"
              color="#ADC178"
              type="submit"
              onClick={handleSubmit}
            />
            <Button text="CANCEL" color="#FCBF49" onClick={toggle} />
          </Flexbox>
        </Form>
      </InnerContianer>
    </Container>
  );
};

export default EditForm;
