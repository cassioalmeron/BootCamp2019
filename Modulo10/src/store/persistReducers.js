// usa o storage conforme o ambiente:
// se for web, usa o local storage
// se for react-native usa o sqlite
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

export default reducers => {
  const persistedReducer = persistReducer(
    {
      key: "gobarber",
      storage,
      whitelist: ["auth", "user"],
    },
    reducers
  );

  return persistedReducer;
};
