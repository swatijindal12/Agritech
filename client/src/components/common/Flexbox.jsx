import styled from "styled-components";

export default styled.div`
  display: flex;
  align-items: ${props => (props.align ? props.align : "center")};
  justify-content: ${props => (props.justify ? props.justify : "center")};
  flex-wrap: ${props => (props.wrap ? props.wrap : "no-wrap")};
  margin: ${props => (props.margin ? props.margin : "0")};
  padding: ${props => (props.padding ? props.padding : "0")};
  background-color: ${props =>
    props.background ? props.background : "transparent"};
`;
