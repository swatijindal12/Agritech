import React from "react";
import styled from "styled-components";

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.62rem 2rem;
  border-radius: 24px;
  background-color: ${props => (props.color ? props.color : "#ADC178")};
  margin: ${props => (props.margin ? props.margin : "auto")};
  color: #ffffff;
  font-size: 1rem;
  letter-spacing: 1.4px;
  font-weight: 700;
  width: ${props => (props.width ? props.width : "fit-content")};
  opacity: ${props => (props.disabled ? 0.3 : 1)};
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
`;

const Button = ({ color, margin, width, text, disabled, onClick }) => {
  return (
    <Container
      color={color}
      margin={margin}
      width={width}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </Container>
  );
};

export default Button;
