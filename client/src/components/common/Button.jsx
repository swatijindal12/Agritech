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
  color: ${props => (props.border ? props.border : "#ffffff")};
  font-size: 1rem;
  letter-spacing: 1.4px;
  font-weight: 700;
  width: ${props => (props.width ? props.width : "fit-content")};
  opacity: ${props => (props.disabled ? 0.3 : 1)};
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
  border: ${props => props.border && `2px solid ${props.border}`};
  @media only screen and (max-width: 990px) {
    width: ${props => (props.mobileWidth ? props.mobileWidth : "fit-content")};
    padding: 0.62rem 1.5rem;
    white-space: nowrap;
    font-size: 0.8rem;
    letter-spacing: 1px;
    font-weight: 600;
  }
`;

const Button = ({
  color,
  margin,
  width,
  text,
  disabled,
  onClick,
  mobileWidth,
  border,
}) => {
  return (
    <Container
      color={color}
      margin={margin}
      width={width}
      mobileWidth={mobileWidth}
      disabled={disabled}
      onClick={() => {
        if (!disabled) onClick();
      }}
      border={border}
    >
      {text}
    </Container>
  );
};

export default Button;
