import React from "react";
import styles from "./index.module.scss";

const Index = (props) => {
  return (
    <div className={styles.form_group}>
      <label className={styles.label}>{props.label}</label>
      <input
        className={styles.input}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        accept={props.accept}
        onChange={props.onChange}
        ref={props.inputRef}
        required={props.required}
      />
    </div>
  );
};

export default Index;
