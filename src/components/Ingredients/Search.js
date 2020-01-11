import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";
import useHttp from "../../hooks/http";
import ErrorModal from "../UI/ErrorModal";

const Search = React.memo(props => {
  const [enteredFilter, setEnteredFilter] = useState("");
  const { onLoadIngredients } = props;

  const inputRef = useRef();

  const { isLoading, data, error, sendRequest, clear } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;

        sendRequest(
          "https://marker-1516988810351.firebaseio.com/ingredients.json" +
            query,
          "GET"
        );
      }
    }, 500);
    // Clear the old timer that is created for every key stroke pressed
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoadIngredients(loadedIngredients);
    }
  }, [data, onLoadIngredients, isLoading, error]);

  return (
    <section className="search">
      <Card>
        {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading ...</span>}
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={e => setEnteredFilter(e.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
