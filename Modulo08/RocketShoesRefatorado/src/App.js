import React from "react";
//import { BrowserRouter } from "react-router-dom";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import "./config/ReactotronConfig"; // tem que ser antes dos demais

import Routes from "./routes";
import GlobalStyles from "./styles/global";
import Header from "./components/Header";

import history from "./services/history";
import store from "./store";

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Header />
        <Routes />
        <GlobalStyles />
        <ToastContainer autoClose={3000} />
      </Router>
    </Provider>
  );
}

export default App;
