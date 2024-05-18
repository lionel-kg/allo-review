import React from "react";
import styles from "./index.module.scss";

const Index = (props) => {
  const { onClick, text, icon } = props;

  return (
    <button className={styles.button} onClick={onClick}>
      {icon ? icon : null}
      {text}
    </button>
  );
};

export default Index;
