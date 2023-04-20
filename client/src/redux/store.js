import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import ReduxThunk from "redux-thunk";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { rootReducer } from "./reducers/rootReducer";

const persistConfig = {
  key: "agritech",
  storage,
};

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const enhancer = composeEnhancers(
  applyMiddleware(ReduxThunk)
  // other store enhancers if any
);

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  let store = createStore(persistedReducer, enhancer);
  let persistor = persistStore(store);
  return { store, persistor };
};
