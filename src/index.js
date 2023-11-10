
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "./App.css";
import AdminLayout from "layouts/Admin.js";
import Login from "views/Login/Login";
import '@fortawesome/fontawesome-free/css/all.min.css'; 
const root = ReactDOM.createRoot(document.getElementById("root"));
const pass=localStorage.getItem("user_alfalah_data")

root.render(
  <BrowserRouter basename={"alfalah_pharma_front"}>
    <Switch>
      <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
      <Route path="/login" component={Login} />
      {JSON.parse(pass)?.user?
        <Redirect to="/admin/dashboard" />:
        <Redirect to="/login" />
      }
    </Switch>
  </BrowserRouter>
);
