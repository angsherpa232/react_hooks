import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  const filteredIngredientHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);

  useEffect(() => console.log("RENDERING INGREDIENTS", userIngredients), [
    userIngredients
  ]);

  const addIngredientHandler = ingredient => {
    fetch("https://marker-1516988810351.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseData => {
        setUserIngredients(prevIngredients => [
          ...prevIngredients,
          {
            id: responseData.name,
            ...ingredient
          }
        ]);
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={() => {}} />
      </section>
    </div>
  );
}

export default Ingredients;
