import React, { useState } from "react";
import { Form } from "./components/Form/Form";
import { Dialog } from "./components/Dialog/Dialog";

export const App = () => {
  const [dialog, setDialog] = useState(false);

  return (
    <>
      {dialog ? <Dialog /> : <Form setDialog={setDialog} />}
    </>
  );
};









