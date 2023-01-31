import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../common/Button";
import Flexbox from "../../common/Flexbox";
import Title from "../../common/Title";

const Contianer = styled.div`
  padding: 1rem;

  input {
    box-sizing: border-box;
    border: none;
    background-color: #dde5b633;
    border-radius: 12px;
    padding: 1rem;
    display: block;
    margin: 0.5rem 0;
    width: 100%;
    min-width: 150px;
  }
`;

const Name = styled.p`
  font-size: 1.25rem;
  color: #6c584c;
  font-weight: 600;
  margin-top: 1rem;
`;

const InputContianer = styled.div`
  font-size: 1.25rem;
  font-weight: 400;
  margin: 2rem 0 0;
`;

const CreateContract = () => {
  const [data, setData] = useState({
    start: "",
    end: "",
    price: "",
    crop: "",
  });
  const currentFarm = JSON.parse(localStorage.getItem("current-selected-farm"));

  const handleChange = (type, e) => {
    setData({ ...data, [type]: e.target.value });
  };
  return (
    <Contianer>
      <Title>Create Contract</Title>
      <Name>{currentFarm.name}</Name>
      <Flexbox justify="space-between">
        <InputContianer>
          Start
          <input
            type="date"
            value={data.start}
            onChange={e => handleChange("start", e)}
          />
        </InputContianer>
        <InputContianer>
          End
          <input
            type="date"
            value={data.end}
            onChange={e => handleChange("end", e)}
          />
        </InputContianer>
      </Flexbox>
      <InputContianer>
        Price
        <input
          type="number"
          value={data.price}
          onChange={e => handleChange("price", e)}
          placeholder="₹"
        />
      </InputContianer>
      <InputContianer>
        Crop
        <input
          type="text"
          value={data.crop}
          onChange={e => handleChange("crop", e)}
          placeholder="Comma saperated, if more than one"
        />
      </InputContianer>
      <Button
        text="CREATE"
        margin="2rem auto"
        onClick={() => console.log(data)}
      />
    </Contianer>
  );
};

export default CreateContract;
