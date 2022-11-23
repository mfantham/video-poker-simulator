import { ReactNode } from "react";
import { Provider } from "react-redux";
import { setupStore } from "./store";

const store = setupStore();

const StoreProvider = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

export { StoreProvider };
