import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";

const Index = ({ title }) => {
  return (
    <div className={styles.title}>
      <h1>{title}</h1>
    </div>
  );
};
export default Index;
