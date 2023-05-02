import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../../common/Button";
import Flexbox from "../../common/Flexbox";
import VerificationPopup from "../../common/VerificationPopup";
import crossIcon from "../../../assets/cross.svg";

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
  position: relative;
  background-color: white;
  border-radius: 12px;
  padding: 3rem 6rem;
  width: 40rem;
  max-width: 40rem;
  max-height: 70vh;
  overflow-y: auto;

  ::-webkit-scrollbar {
    display: none;
  }

  @media screen and (max-width: 990px) {
    max-width: 96vw;
    padding: 1rem;
  }
`;

const Cross = styled.img`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  cursor: pointer;
`;

const Heading = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: #a98467;
  text-align: center;

  @media screen and (max-width: 990px) {
    font-size: 1.5rem;
  }
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

  @media screen and (max-width: 990px) {
    width: 100%;
  }
`;

const EditForm = ({ data, toggle, setEditData }) => {
  const [inputs, setInputs] = useState([]);
  const [inputValues, setInputValues] = useState(data);
  const selectedType = JSON.parse(
    localStorage.getItem("current-new-upload-data")
  );

  useEffect(() => {
    let tempData = [];
    for (const key in data) {
      if (
        !key.includes("id") &&
        !key.includes("updatedAt") &&
        !key.includes("createdAt")
      )
        tempData.push(key);
    }
    setInputs(tempData);
  }, []);

  const handleChange = (e, type) => {
    setInputValues({ ...inputValues, [type]: e.target.value });
  };

  return (
    <Container>
      <InnerContianer>
        <Cross src={crossIcon} alt="cross-icon" onClick={toggle} />
        <Heading>
          {`Edit ${selectedType.type
            .charAt(0)
            .toUpperCase()}${selectedType.type.slice(1)}  Details`}
        </Heading>
        <Form>
          {inputs?.map(item => {
            return (
              <InputContainer key={item}>
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
              type="button"
              onClick={() => setEditData(inputValues)}
            />
            <Button text="CANCEL" color="#FCBF49" onClick={toggle} />
          </Flexbox>
        </Form>
      </InnerContianer>
    </Container>
  );
};

export default EditForm;
