import { combineReducers } from "redux";

import authReducer from "./authReducer";
import cartReducer from "./cartReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});
