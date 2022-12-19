import React from "react";
import '../../sass/common/button.scss';

const Button = (props:any) => {
  const {text} = props;
  return <div className="btn">{text}</div>;
};

export default Button;
