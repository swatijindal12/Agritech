import React from "react";
import styled from "styled-components";
import CheckIcon from "../../assets/checkbox.svg";

const Container = styled.div`
  margin: ${props => props.margin && props.margin};
  width: fit-content;
  display: inline;
`;

const Box = styled.div`
  height: 1.8rem;
  width: 1.8rem;
  border-radius: 2px;
  background-color: #dde5b64d;
`;

const Image = styled.img`
  height: 1.8rem;
  width: 1.8rem;
`;

const Checkbox = ({ checked, margin }) => {
  return (
    <Container margin={margin}>
      {checked ? <Image src={CheckIcon} /> : <Box />}
    </Container>
  );
};

export default Checkbox;
