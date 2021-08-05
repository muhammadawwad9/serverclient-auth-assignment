/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { createStore } from "redux";
import { Provider } from "react-redux";
//reducers imports
import userReducer from "./reducers/userReducer";

// core components
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";

import "assets/css/material-dashboard-react.css?v=1.8.0";

//views imports
import Login from "views/Login/Login";
import Register from "views/Register/Register";

const hist = createBrowserHistory();
toast.configure();

const store = createStore(
  userReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

/*the hook can be called inside functional component, so I will make the <App/> component here and then put it the render method below*/
const App = () => {
  const globalState = useSelector((state) => state);
  console.log("GLOBAL STATEEEEEEE: ", globalState);

  return (
    <Router history={hist}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        {!globalState ? (
          <Redirect to="/login" />
        ) : (
          <Fragment>
            <Route path="/admin" component={Admin} />
            <Route path="/rtl" component={RTL} />
            <Redirect from="/" to="/admin/dashboard" />
          </Fragment>
        )}
      </Switch>
    </Router>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
