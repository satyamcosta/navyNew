import "../styles/_app.scss";
import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import MatxTheme from "./MatxLayout/MatxTheme/MatxTheme";
import { AppProvider } from "./appContext";
import history from "history.js";
import Auth from "./auth/Auth";
import MatxLayout from "./MatxLayout/MatxLayout";
import AuthGuard from "./auth/AuthGuard";
import configureStore from "./camunda_redux/redux/configureStore";
import Snackbar from "./views/sessions/Snackbar";
import GatewayPopper from "./views/sessions/GatewayPopper";
import IdleHandler from "./views/sessions/IdleHandler";
import NotificationHandler from "./views/sessions/NotificationHandler";

const Store = configureStore();
const App = () => {
  return (
    <Provider store={Store}>
      <AppProvider>
        <MatxTheme>
          <Auth>
            <Router history={history}>
              <AuthGuard>
                <MatxLayout />
              </AuthGuard>
            </Router>
            <Snackbar />
            <GatewayPopper />
            {/* <IdleHandler /> */}
            {/* <NotificationHandler/> */}
          </Auth>
        </MatxTheme>
      </AppProvider>
    </Provider>
  );
};

export default App;

// Here the above Router component execute its children everytime new url is hit on browser
// Css for main table of app is present in common.scss imported by app.scss
