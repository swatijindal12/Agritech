import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../../common/Button";
import Card from "./Card";

const Container = styled.div`
  padding: 1rem;
`;

const Buyers = () => {
  const [buyers, setBuyers] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/admin/customers`, {
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("user")).data.token,
        },
      })
      .then(res => {
        // console.log("response is ", res);
        setBuyers(res.data.data);
      })
      .catch(err => console.log("Error in fetching dashboard data ", err));
  }, []);

  return (
    <Container>
      <Button text="ADD NEW" margin="0" />
      {buyers?.map(item => {
        return <Card data={item} />;
      })}
    </Container>
  );
};

export default Buyers;
