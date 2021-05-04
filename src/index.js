import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import "assets/vendor/bootstrap-rtl/bootstrap-rtl.scss";
import "react-notification-alert/dist/animate.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "assets/vendor/fullcalendar/dist/fullcalendar.min.css";
import "assets/vendor/sweetalert2/dist/sweetalert2.min.css";
import "assets/vendor/select2/dist/css/select2.min.css";
import "assets/vendor/quill/dist/quill.core.css";
import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-pro-react.scss?v1.1.0";

import CennznetLayout from "layouts/Cennznet.js";
import Login from "layouts/Auth";

ReactDOM.render(
    <BrowserRouter>
      <Switch>
        <Route path="/cennznet" render={props=> <CennznetLayout {...props} />} />
        <Route path="/" render={props=> <Login {...props} />} />
        <Redirect from="*" to="/" />
      </Switch>
    </BrowserRouter>,
  document.getElementById('root')
);
