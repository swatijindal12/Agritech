import React, { useState } from "react";
import "../../sass/auth/login.scss";
import Button from "../common/Button";
import Input from "../common/Input";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  return (
    <>
      {isLoggedIn ? (
        <div className="login_wrapper">
          <h1 className="logo_title">AgriTech</h1>
          <Input type={"text"} placeholder={"Mobile Number"} />
          <Button text="Login" />
        </div>
      ) : (
        <div className="login_wrapper">
          <h1 className="logo_title">AgriTech</h1>
          <div className="verify-otp-wrapper">
            <Input type={"number"} maxlength="1" placeholder={""} />
            <Input type={"number"} maxlength="1" placeholder={""} />
            <Input type={"number"} maxlength="1" placeholder={""} />
            <Input type={"number"} maxlength="1" placeholder={""} />
            <Input type={"number"} maxlength="1" placeholder={""} />
          </div>
          <Button text="Verify OTP" />
        </div>
      )}
    </>
  );
};

export default Login;
