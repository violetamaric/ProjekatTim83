import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./registracija.css";
import AdminLayout from "layouts/Admin.jsx";
import axios from "axios";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Registracija from "registracija.js";
import Login from "login";
import Lekar from "views/Lekar.jsx";
import Pacijent from "views/Pacijent.jsx";
import KlinickiCentar from "views/KlinickiCentar.jsx";
import MedicinskaSestra from "views/MedicinskaSestra.jsx";
import AdministatorKlinike from "views/AdministatorKlinike.jsx";

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const formValid = formErrors => {
  let valid = true;
  Object.values(formErrors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};

class potvrdaRegistracije extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      lozinka: null,
      uloga: null,
      redirectToReferrer: false,
      redirectToLogin: false,
      errorF: false,
      token: "",
      waitToapprove: props.waitToapprove,

      formErrors: {
        log: "",
        email: "",
        lozinka: "",
        uloga: ""
      }
    };
  }
  handleSumbit = e => {
    e.preventDefault();
    // formErrors.log = "";
    // this.setState({ formErrors }, () => console.log(this.state));
    let formErrors = { ...this.state.formErrors };

    axios

      .post("http://localhost:8025/api/korisnici/login", {
        email: this.state.email,
        lozinka: this.state.lozinka
      })
      .then(response => {
        console.log(response.data);
        console.log(response.data.accessToken);
        this.setState({
          token: response.data.accessToken
        });
        console.log("TOKEN : " + this.state.token);

        this.setState({
          uloga: response.data.uloga
        });

        this.setState({
          email: response.data.email
        });

        // console.log(this.state.uloga);
        this.setState({
          redirectToReferrer: true
        });
      })
      .catch(error => {
        //   console.log(error.response);
        formErrors.log = "Pogresni kredencijali";
        this.setState({ formErrors }, () => console.log(this.state));
      });
  };
  handleClick = e => {
    e.preventDefault();
    console.log("registracijaa");
    this.setState(
      {
        redirectToLogin: true
      },
      () => {
        console.log(this.state);
      }
    );
  };
  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;

    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "email":
        formErrors.email =
          value.length < 3 && value.length > 0 ? "min 3 karaktera  " : "";
        break;
      case "lozinka":
        formErrors.lozinka =
          value.length < 3 && value.length > 0 ? "min 3 karaktera" : "";
        break;
    }
    if (formErrors.email.length > 0 && formErrors.lozinka.length > 0) {
      formErrors.log = "";
    }

    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  };
  componentWillMount() {
    console.log("PUTANJA");
    console.log(this.props.location.pathname);
    var path = this.props.location.pathname;
    var paths = [];
    paths = path.split("/");
    console.log(paths[paths.length - 1]);
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    axios
      .put(
        "http://localhost:8025/api/korisnici/potvrdaRegistracije/" +
          paths[paths.length - 1],
        config
      )
      .then(Response => {})
      .catch(error => {
        console.log("klinika nije preuzeta");
      });
  }

  render() {
    const { formErrors } = this.state;
    const errorF = this.state.errorF;
    const email = this.state.email;
    const uloga = this.state.uloga;
    const redirectToReferrer = this.state.redirectToReferrer;
    const redirectToLogin = this.state.redirectToLogin;
    const token = this.state.token;

    if (redirectToLogin) {
      return (
        <BrowserRouter>
          <Switch>
            <Route path="/login" render={props => <Login {...props} />} />
            <Redirect from="/" to="/login" />
            {/* <Route path="/admin" render={props => <AdminLayout {...props} />} />
          <Redirect from="/" to="/admin/" /> */}
          </Switch>
        </BrowserRouter>
      );
    }

    return (
      <div>
        <div className="logForm">
          <div className="form-logForm">
            <h1>Vas nalog je aktiviran</h1>
            <div className="signIn">
              <button onClick={this.handleClick}>
                <a href="http://localhost:3000/login">Uloguj se</a>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default potvrdaRegistracije;
