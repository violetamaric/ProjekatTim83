import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";
import Login from "login.js";
import PotvrdaRegistracije from "potvrdaRegistracije.jsx";
import Pacijent from "views/Pacijent.jsx";
import AdministatorKlinike from "views/AdministatorKlinike.jsx";
import KlinickiCentar from "views/KlinickiCentar.jsx";
import MedicinskaSestra from "views/MedicinskaSestra.jsx";
import Lekar from "views/Lekar.jsx";

console.log("-----------------------------");
console.log(document.documentURI);
if (
  document.documentURI == "http://localhost:3000/" ||
  document.documentURI == "http://localhost:3000" ||
  document.documentURI == "http://localhost:3000/login"
) {
  console.log("LOGIN");
  ReactDOM.render(
    <BrowserRouter>
      <Switch>
        <Route path="/login" render={props => <Login {...props} />} />
        <Redirect from="/" to="/login" />
        {/* <Route path="/admin" render={props => <AdminLayout {...props} />} />
        <Redirect from="/" to="/admin/" /> */}
      </Switch>
    </BrowserRouter>,
    document.getElementById("root")
  );
} else if (document.documentURI.includes("/pacijent")) {
  ReactDOM.render(
    <BrowserRouter>
      <Switch>
        <Route path="/pacijent" render={props => <Pacijent {...props} />} />
        {/* <Redirect from="/" to="/login" /> */}
        {/* <Route path="/admin" render={props => <AdminLayout {...props} />} />
        <Redirect from="/" to="/admin/" /> */}
      </Switch>
    </BrowserRouter>,
    document.getElementById("root")
  );
} else if (document.documentURI.includes("/lekar")) {
  ReactDOM.render(
    <BrowserRouter>
      <Switch>
        <Route path="/lekar" render={props => <Lekar {...props} />} />
        {/* <Redirect from="/" to="/login" /> */}
        {/* <Route path="/admin" render={props => <AdminLayout {...props} />} />
        <Redirect from="/" to="/admin/" /> */}
      </Switch>
    </BrowserRouter>,
    document.getElementById("root")
  );
} else if (document.documentURI.includes("/medses")) {
  ReactDOM.render(
    <BrowserRouter>
      <Switch>
        <Route
          path="/medses"
          render={props => <MedicinskaSestra {...props} />}
        />
        {/* <Redirect from="/" to="/login" /> */}
        {/* <Route path="/admin" render={props => <AdminLayout {...props} />} />
        <Redirect from="/" to="/admin/" /> */}
      </Switch>
    </BrowserRouter>,
    document.getElementById("root")
  );
} else if (document.documentURI.includes("/kc")) {
  ReactDOM.render(
    <BrowserRouter>
      <Switch>
        <Route path="/kc" render={props => <KlinickiCentar {...props} />} />
        {/* <Redirect from="/" to="/login" /> */}
        {/* <Route path="/admin" render={props => <AdminLayout {...props} />} />
        <Redirect from="/" to="/admin/" /> */}
      </Switch>
    </BrowserRouter>,
    document.getElementById("root")
  );
} else if (document.documentURI.includes("/admink")) {
  console.log("ADMIN k");
  ReactDOM.render(
    <BrowserRouter>
      <Switch>
        <Route
          path="/admink"
          render={props => <AdministatorKlinike {...props} />}
        />
        {/* <Redirect from="/" to="/login" /> */}
        {/* <Route path="/admin" render={props => <AdminLayout {...props} />} />
        <Redirect from="/" to="/admin/" /> */}
      </Switch>
    </BrowserRouter>,
    document.getElementById("root")
  );
} else if (
  document.documentURI.includes("http://localhost:3000/potvrdaRegistracije")
) {
  console.log("potvrda registracije");
  ReactDOM.render(
    <BrowserRouter>
      <Switch>
        <Route
          path="/potvrdaRegistracije"
          render={props => <PotvrdaRegistracije {...props} />}
        />
        <Redirect from="/" to="/potvrdaRegistracije" />
        {/* <Route path="/admin" render={props => <AdminLayout {...props} />} />
        <Redirect from="/" to="/admin/" /> */}
      </Switch>
    </BrowserRouter>,
    document.getElementById("root")
  );
}
