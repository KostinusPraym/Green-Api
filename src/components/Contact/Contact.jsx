import React from "react";
import styles from "./Contact.module.scss";

export const Contact = ({numberPhone, handleClick}) => {

  return (
    <div onClick={handleClick} className={styles.contact}>
      <img width={24} height={24} src="./img/account.png" alt="Avatar" className={styles.avatar} />
      <div>
        <p>{numberPhone}</p>
      </div>
    </div>
  );
};
