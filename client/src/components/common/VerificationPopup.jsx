import React, { useState } from "react";
import styled from "styled-components";
import Button from "./Button";
import Flexbox from "./Flexbox";
import Lottie from "lottie-react";
import LoadingLottie from "../../assets/lottie/loader.json";

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
  box-sizing: border-box;
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  min-width: 30rem;

  @media screen and (max-width: 990px) {
    min-width: unset;
    width: 90%;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  margin: 0.5rem 0;
  width: 100%;
  min-width: 360px;
  border: none;
  background-color: #f5f5f5;
  border-radius: 12px;

  @media screen and (max-width: 990px) {
    min-width: unset;
    width: 100%;
  }
`;

const Title = styled.p`
  font-weight: 600;
  color: #6c584c;
  margin-top: 1rem;
`;

const Heading = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #a98467;
`;

const Error = styled.p`
  color: red;
  font-size: 1rem;
  margin: 1rem 0;
`;

const WarningMessage = styled.p`
  color: #6c584c;
  font-size: 1rem;
  margin: 1rem 0;
`;

const Message = styled.p`
  color: #a98467;
  font-size: 1rem;
  margin: 1rem 0;
  align-content: center;
`;

const VerificationPopup = ({
  togglePopup,
  onSubmit,
  onDelete,
  error,
  setError,
  getReason,
  warning,
  selectedModelType,
  selectedEntity,
  entityType,
}) => {
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (
      selectedModelType === "update" ||
      (selectedModelType === "Approve" && entityType === "Add")
    ) {
      await onSubmit(password, reason);
      if (selectedEntity === "Farms" || selectedEntity === "Contracts") {
        setIsSubmitting(true);
      } else {
        setIsSubmitting(false);
      }
    } else if (entityType === "Delete") {
      await onDelete(password);
    }
  };

  return (
    <Container>
      <InnerContianer>
        {!error && isSubmitting ? (
          <>
            <Lottie
              animationData={LoadingLottie}
              loop={true}
              style={{ height: "100px" }}
            />
            <Message>
              Blockchain transactions usually take time (may be more than a
              minute). So please wait while the transaction succeeds.
            </Message>
          </>
        ) : (
          <>
            <Heading style={{ textAlign: "center" }}>Master Admin</Heading>
            <Title>Password</Title>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <Error>Error: {error}</Error>}
            {getReason && (
              <>
                <Title>Specify reason of update</Title>
                <Input
                  type="text"
                  placeholder="Reason"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  required
                />
              </>
            )}
            {entityType === "Add" && <WarningMessage>{warning}</WarningMessage>}
            <Flexbox justify="center">
              <Button
                onClick={handleSubmit}
                text={"Submit"}
                margin="0.3rem 1rem"
                disabled={
                  (getReason && reason.length === 0) || password.length === 0
                }
              ></Button>
              <Button
                onClick={() => {
                  if (setError) setError(false);
                  togglePopup();
                }}
                text={"Close"}
                margin="0rem 0rem"
                color="#FCBF49"
              ></Button>
            </Flexbox>
          </>
        )}
      </InnerContianer>
    </Container>
  );
};

export default VerificationPopup;
