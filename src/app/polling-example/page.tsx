"use client";

import Button from "react-bootstrap/Button";
import React, { useEffect, useState, memo, useCallback } from "react";
import { ajax } from "rxjs/ajax";
import {
  mergeMap,
  Subject,
  interval,
  map,
  startWith,
  takeWhile,
  skipWhile,
} from "rxjs";

type ConditionalButtonType = {
  polling: boolean;
  onClick: () => void;
};

const ConditionalButton = memo(function ConditionalButton({
  polling,
  onClick,
}: ConditionalButtonType): React.ReactNode {
  return polling ? (
    <Button variant="danger" onClick={onClick}>
      Stop polling
    </Button>
  ) : (
    <Button onClick={onClick}>Start polling</Button>
  );
});

export default function Polling(): React.ReactNode {
  const [polling, setPolling] = useState<boolean>(false);
  const [catFact, setCatFact] = useState<string>("");

  const togglePolling: () => void = useCallback(() => {
    setPolling((prevState) => !prevState);
  }, [setPolling]);

  useEffect(() => {
    const catFacts = interval(10000).pipe(
      startWith(0),
      takeWhile(() => polling),
      mergeMap(() =>
        ajax
          .getJSON("https://meowfacts.herokuapp.com/")
          .pipe(map((data: unknown): string => (data?.data ? data.data : ""))),
      ),
    );

    const subscription = catFacts.subscribe(setCatFact);
    return () => subscription.unsubscribe();
  }, [polling]);

  return (
    <>
      <h1>{catFact}</h1>
      <ConditionalButton polling={polling} onClick={togglePolling} />
    </>
  );
}
