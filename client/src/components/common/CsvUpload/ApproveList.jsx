import React from "react";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 56px;
  left: 0;
  z-index: 5;
  background-color: #f0ead2;
`;

const ListItem = styled.div`
  border: 1px solid #ffffff;
  min-width: 20rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
`;

const ApproveList = ({ data, setSelectedItem }) => {
  return (
    <Container>
      {data.map(item => {
        return (
          <ListItem onClick={() => setSelectedItem(item.data)}>
            {item.name}
          </ListItem>
        );
      })}
    </Container>
  );
};

export default ApproveList;
