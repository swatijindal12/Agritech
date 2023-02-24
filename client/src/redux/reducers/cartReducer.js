import { ADD_TO_CART, CLEAR_CART, REMOVE_FROM_CART } from "../actions/types";

const INITIAL_STATE = {
  cart: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      console.log("Inside add to cart ", action.payload);
      let currentItem = state.cart.filter(
        item => item.agreements[0] === action.payload.agreements[0]
      );
      if (currentItem.length > 0) {
        return state;
      } else return { ...state, cart: [...state.cart, action.payload] };

    case REMOVE_FROM_CART:
      let tempCart = state.cart;
      let index;
      tempCart.forEach((item, i) => {
        if (item.agreements[0] === action.payload) index = i;
      });
      tempCart.splice(index, 1);
      return {
        ...state,
        cart: [...tempCart],
      };

    case CLEAR_CART:
      return {
        ...state,
        cart: [],
      };

    default:
      return state;
  }
};
