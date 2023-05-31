import React, { useState } from "react";
import axios from "axios";
import styles from "./Form.module.scss";

export const Form = ({ setDialog }) => {

  const [error, setError] = useState(false);
  const [idInstance, setIdInstance] = useState(
    localStorage.getItem("idInstance")
  );
  const [apiTokenInstance, setApiTokenInstance] = useState(
    localStorage.getItem("apiTokenInstance")
  );
  const [numberPhone, setNumberPhone] = useState(
    localStorage.getItem("numberPhone")
  );
  const [valid, setValid] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    valid
      ? enterPhoneNumber()
      : axios
          .get(
            `https://api.green-api.com/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`
          )
          .then(() => setValid(true))
          .catch(handleError);
  };

  const enterPhoneNumber = () => {
    //setDialog from App.jsx
    return numberPhone.length !== 12 ? null : setDialog(true);
  };

  const handleError = () => {
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 3000);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.title}>
        Введите данные вашей учетной записи из <strong>GREEN-API</strong>
      </h3>
      {valid ? (
        <div className={styles.inputBlock}>
          <label htmlFor="phone"> Номер получателя*</label>
          <input
            className={styles.input}
            id="phone"
            type="number"
            name="phone"
            value={localStorage.getItem("numberPhone")}
            onChange={(e) => {
              localStorage.setItem("numberPhone", e.target.value);
              setNumberPhone(e.target.value);
            }}
            placeholder="375292772596"
            required
          />
        </div>
      ) : (
        <>
          <div className={styles.inputBlock}>
            <label htmlFor="idInstance"> idInstance* </label>
            <input
              onChange={(e) => {
                localStorage.setItem("idInstance", e.target.value);
                setIdInstance(e.target.value);
              }}
              className={styles.input}
              id="idInstance"
              type="text"
              name="idInstance"
              value={localStorage.getItem("idInstance")}
              placeholder=""
              required
            />
          </div>

          <div className={styles.inputBlock}>
            <label htmlFor="apiTokenInstance"> apiTokenInstance* </label>
            <input
              className={styles.input}
              id="apiTokenInstance"
              type="text"
              name="apiTokenInstance"
              value={localStorage.getItem("apiTokenInstance")}
              onChange={(e) => {
                localStorage.setItem("apiTokenInstance", e.target.value);
                setApiTokenInstance(e.target.value);
              }}
              placeholder=""
              required
            />
          </div>
        </>
      )}
      <button className={styles.submitBtn} type="submit">
        ОТПРАВИТЬ
      </button>
      {error ? <p className={styles.error}>Неверно, попробуйте еще раз</p> : ""}
    </form>
  );
};
