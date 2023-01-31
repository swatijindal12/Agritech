import { LOGIN, AUTH_ERROR, AUTH_LOADING, LOGOUT } from "../actions/types";

const INITIAL_STATE = {
  user: null,
  error: "",
  loading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, user: action.payload, loading: false, error: "" };
    case AUTH_LOADING:
      return { ...state, loading: action.payload };
    case AUTH_ERROR:
      return { ...state, error: action.payload };
    case LOGOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};
