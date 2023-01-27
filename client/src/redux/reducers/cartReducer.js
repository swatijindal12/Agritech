import { ADD_TO_CART, CLEAR_CART, REMOVE_FROM_CART } from "../actions/types";

const INITIAL_STATE = {
  cart: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      console.log("Inside add to cart ", action.payload);
      let currentItem = state.cart.filter(
        item => item.farm_id === action.payload.farm_id
      );
      if (currentItem.length > 0) {
        return state;
      } else return { ...state, cart: [...state.cart, action.payload] };

    case REMOVE_FROM_CART:
      let tempCart = state.cart;
      tempCart.splice(action.payload, 1);
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
