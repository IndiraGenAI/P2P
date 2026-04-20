import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./state/store";
import reportWebVitals from "./reportWebVitals";
import "./assets/vendors/style";
import "./styles/wieldy.less";
import Interceptor from "./lib/axios/Interceptor";
import { AbilityContext } from "./ability/can";
import { ability } from "./ability";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

let persistor = persistStore(store);

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AbilityContext.Provider value={ability}>
        <Interceptor />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AbilityContext.Provider>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
