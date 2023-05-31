import React, { useState, useEffect } from "react";
import styles from "./Dialog.module.scss";
import { Contact } from "../Contact/Contact";
import axios from "axios";

export const Dialog = () => {
  const [dialogsPage, setDialogsPage] = useState(false);
  const [currentValue, setCurrentValue] = useState("");
  const [dialogsItem, setDialogsItem] = useState([]);

  const idInstance = localStorage.getItem("idInstance");
  const apiTokenInstance = localStorage.getItem("apiTokenInstance");
  const numberPhone = localStorage.getItem("numberPhone");

  const filterData = (data) => {
    if (data?.messageData?.extendedTextMessageData?.text)
      return setDialogsItem((prev) => [
        ...prev,
        {
          text: data.messageData.extendedTextMessageData.text,
          sender: data.senderData.senderName,
        },
      ]);
    else if (data?.messageData?.textMessageData?.textMessage)
      return setDialogsItem((prev) => [
        ...prev,
        {
          text: data.messageData.textMessageData.textMessage,
          sender: !!data.senderData.senderName,
        },
      ]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setCurrentValue("");
    sendMessage();
  };

  const handleEnter = (event) => {
    if (event.code === "Enter") {
      handleSubmit(event);
    }
  };

  const sendMessage = () => {
    axios
      .post(
        `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
        {
          chatId: `${numberPhone}@c.us`,
          message: `${currentValue}`,
        }
      )
      .then(receiveNotification())
      .catch(() => console.error("Ошибка при отправке"));
  };

  // При нажатии на поверхность messageBoard
  const receiveNotification = async () => {
    try {
      const res = await axios.get(
        `https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`
      );

      if (res.data == null) return;

      axios.delete(
        `https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${res.data.receiptId}`
      );

      filterData(res.data.body);
    } catch (error) {
      console.error("Ошибка уведомления");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.dialogsList}>
        <Contact
          numberPhone={numberPhone}
          handleClick={() => setDialogsPage(!dialogsPage)}
        />
      </div>
      {dialogsPage ? (
        <div className={styles.dialogsPage}>
          <div className={styles.header}>
            <img
              width={24}
              height={24}
              src="./img/account.png"
              alt="Avatar"
              className={styles.avatar}
            />
            <p>{numberPhone}</p>
          </div>
          {/* Область на которой находится событие receiveNotification */}
          <div onClick={receiveNotification} className={styles.messageBoard}>
            <div className={styles.messageBlock}>
              {dialogsItem.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`${styles.messageWrapper} ${
                      item.sender ? styles.active : ""
                    }`}
                  >
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <form className={styles.inputArea} onSubmit={handleSubmit}>
            <textarea
              value={currentValue}
              onChange={(event) => setCurrentValue(event.target.value)}
              type="text"
              placeholder="Введите сообщение"
              onKeyUp={handleEnter}
              maxLength={10000}
            />
            {currentValue ? (
              <button type="submit">
                <img
                  width={50}
                  height={50}
                  src="./img/arrow.png"
                  alt="send-message"
                />
              </button>
            ) : null}
          </form>
        </div>
      ) : (
        <div className={styles.emptyDialogs}>
          <img
            width={950}
            height={450}
            src="./img/bck.jpg"
            alt="backgroundIMG"
          />
          <p>Green API</p>
        </div>
      )}
    </div>
  );
};
