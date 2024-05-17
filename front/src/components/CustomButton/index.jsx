import React from "react";
import styles from "./index.module.scss";

const index = (props) => {
  const { classes, label, onclick, icon } = props;
  return (
    <button
      className={!classes ? "" : `${classes} ` + styles.submitBtn}
      onClick={onclick}
    >
      {icon ? <i className={"pi " + icon}></i> : label ? label : ""}
    </button>
  );
};

export default index;
