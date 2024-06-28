"use client";

import Button from "react-bootstrap/Button";
import { useState } from "react";

function ConditionalButton({ polling, onClick }) {
  return polling ? (
    <Button variant="danger" onClick={onClick}>
      Stop polling
    </Button>
  ) : (
    <Button onClick={onClick}>Start polling</Button>
  );
}

export default function Polling() {
  const [polling, setPolling] = useState<boolean>(false);

  const togglePolling: void = () => {
    setPolling((prevState) => !prevState);
  };

  return (
    <>
      <p>The app is currently {polling ? "polling" : "not polling"}</p>
      <ConditionalButton polling={polling} onClick={togglePolling} />
    </>
  );
}
