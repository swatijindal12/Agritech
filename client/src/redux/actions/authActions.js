import { AUTH_LOADING, LOGIN, AUTH_ERROR, LOGOUT } from "./types";
import localforage from "localforage";
import axios from "axios";

export const loginUser = userData => {
  return async dispatch => {
    dispatch({ type: AUTH_LOADING, payload: true });
    dispatch({ type: AUTH_ERROR, payload: "" });
    await axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/verify`, userData)
      .then(response => {
        let user = response.data;
        dispatch({ type: LOGIN, payload: user });
        dispatch({ type: AUTH_ERROR, payload: "" });
      })
      .catch(error => {
        dispatch({ type: AUTH_ERROR, payload: error?.response?.data?.error });
        dispatch({ type: AUTH_LOADING, payload: false });
      });
  };
};

export const logout = () => {
  return dispatch => {
    dispatch({ type: LOGOUT });
    localforage.clear();
    window.location.href = "/login";
  };
};
