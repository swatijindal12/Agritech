import { ADD_TO_CART, CLEAR_CART, REMOVE_FROM_CART } from "./types";

export const addToCart = data => {
  return { type: ADD_TO_CART, payload: data };
};

export const removeFromCart = newItemArray => {
  return { type: REMOVE_FROM_CART, payload: newItemArray };
};

export const clearCart = () => {
  return { type: CLEAR_CART };
};
