import React, { useState, useEffect, useCallback, useReducer } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error("Should not get here");
  }
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { isLoading: true, error: null };
    case "RESPONSE":
      return { ...curHttpState, isLoading: false };
    case "ERROR":
      return { isLoading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...curHttpState, error: null };
    default:
      throw new Error("Should not have reached here");
  }
};

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  // const [userIngredients, setUserIngredients] = useState([]);

  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    isLoading: false,
    error: null
  });

  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  const filteredIngredientHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  useEffect(() => console.log("RENDERING INGREDIENTS", userIngredients), [
    userIngredients
  ]);

  const addIngredientHandler = ingredient => {
    // setIsLoading(true);
    dispatchHttp({ type: "SEND" });
    fetch("https://marker-1516988810351.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        // setIsLoading(false);
        dispatchHttp({ type: "RESPONSE" });
        return response.json();
      })
      .then(responseData => {
        // setUserIngredients(prevIngredients => [
        //   ...prevIngredients,
        //   {
        //     id: responseData.name,
        //     ...ingredient
        //   }
        // ]);
        dispatch({
          type: "ADD",
          ingredient: {
            id: responseData.name,
            ...ingredient
          }
        });
      })
      .catch(error => {
        // setIsLoading(false);
        // setError(error.message);
        dispatchHttp({ type: "ERROR", errorMessage: error.message });
      });
  };

  const removeIngredientHandler = ingredientId => {
    //setIsLoading(true);
    dispatchHttp({ type: "SEND" });
    fetch(
      `https://marker-1516988810351.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE"
      }
    )
      .then(response => {
        //setIsLoading(false);
        dispatchHttp({ type: "RESPONSE" });
        // setUserIngredients(prevIngredients =>
        //   prevIngredients.filter(item => item.id !== ingredientId)
        // );
        dispatch({ type: "DELETE", id: ingredientId });
      })
      .catch(error => {
        // setIsLoading(false);
        // setError(error.message);
        dispatchHttp({ type: "ERROR", errorMessage: error.message });
        console.log("err before ", httpState);
      });
  };

  const clearError = () => dispatchHttp({ type: "CLEAR" });

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
