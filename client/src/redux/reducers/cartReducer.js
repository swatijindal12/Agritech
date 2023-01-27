import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/types";

const INITIAL_STATE = {
  cart: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return { ...state, cart: [...state.cart, action.payload] };
    // case REMOVE_FROM_CART:
    //   let itemIndex = -1;
    //   state.cart.forEach((item, index) => {
    //     if (item.id === action.payload) itemIndex === index;
    //   });
    //   let tempCart = state.cart.splice(itemIndex, 1);
    //   return { ...state, cart: [...tempCart] };
    default:
      return state;
  }
};
