import React from "react";
import styles from "./index.module.scss";

const Index = ({ title, children }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.card_title}>{title}</h2>
      <div className={styles.card_container}>{children}</div>
    </div>
  );
};

export default Index;
