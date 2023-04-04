import React from "react";
import { useState } from "react";
import Button from "../../common/Button";
import Flexbox from "../../common/Flexbox";
import MarketPlace from "../../common/Marketplace";
import Contracts from "../Contracts";

const AdminContracts = () => {
  const [selectedtype, setSelectedType] = useState("subscribed");
  return (
    <div>
      <Flexbox justify="center" margin="1rem 1rem 0" columnGap="1rem">
        <Button
          border={selectedtype === "subscribed" ? "#ffffff" : "#718355"}
          color={selectedtype === "subscribed" ? "#718355" : "#ffffff"}
          text="SUBSCRIBED"
          onClick={() => setSelectedType("subscribed")}
          margin="0"
        />
        <Button
          border={selectedtype === "unsubscribed" ? "#ffffff" : "#718355"}
          color={selectedtype === "unsubscribed" ? "#718355" : "#ffffff"}
          text="UN-SUBSCRIBED"
          onClick={() => setSelectedType("unsubscribed")}
          margin="0"
        />
      </Flexbox>
      {selectedtype === "subscribed" ? <Contracts /> : <MarketPlace />}
    </div>
  );
};

export default AdminContracts;
