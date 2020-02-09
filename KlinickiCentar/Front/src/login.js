import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./registracija.css";
import AdminLayout from "layouts/Admin.jsx";
import axios from "axios";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Registracija from "registracija.js";
import PrvoLogovanje from "prvoLogovanje.jsx";
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

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      lozinka: null,
      uloga: null,
      redirectToReferrer: false,
      redirectToRegistration: false,
      errorF: false,
      token: "",
      waitToapprove: props.waitToapprove,
      formErrors: {
        log: "",
        email: "",
        lozinka: "",
        uloga: ""
      },
      prvoLogovanje: false,
      redirectToPrvoLogovanje: false,
      korisnik: []
    };
    this.prvoLogovanje = this.prvoLogovanje.bind(this);
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
        this.setState(
          {
            token: response.data.accessToken
          },
          () => {}
        );
        console.log("TOKEN : " + this.state.token);

        this.setState(
          {
            uloga: response.data.uloga
          },
          () => this.prvoLogovanje()
        );

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
    this.setState({
      redirectToRegistration: true
    });
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
  componentDidMount() {
    // fetch("/login", {
    //   method: "post",
    //   headers: {
    //     Accept: "application/json, text/plain, */*",
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({ data: this.state })
    // })
    //   .then(res => res.json())
    //   .then(res => console.log(res));
  }
  prvoLogovanje() {
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    var uloga = this.state.uloga;

    if (uloga === "ADMIN_KC") {
      //preuzimi admina klinickog centra
      const url =
        "http://localhost:8025/api/administratoriKC/pronadjenAdministratorKC";
      axios
        .get(url, config)
        .then(Response => {
          console.log("Preuzet admin klinickog centra: ");
          console.log(Response.data);
          this.setState({
            korisnik: Response.data
          });
          if (Response.data.status == 0) {
            this.setState({
              redirectToPrvoLogovanje: true
            });
          } else {
            this.setState({
              prvoLogovanje: true
            });
          }
        })
        .catch(error => {
          console.log("Admin KC nije preuzet");
        });
    } else if (uloga === "ADMIN_KLINIKE") {
      //preuzmi admina klinike
      const url =
        "http://localhost:8025/api/adminKlinike/getAdminKlinikeByEmail";
      axios
        .get(url, config)
        .then(Response => {
          console.log("Preuzet admin klinike: ");
          console.log(Response.data);
          this.setState({
            korisnik: Response.data
          });
          if (Response.data.status == 0) {
            this.setState({
              redirectToPrvoLogovanje: true
            });
          } else {
            this.setState({
              prvoLogovanje: true
            });
          }
        })
        .catch(error => {
          console.log("Admin klinike nije preuzet");
        });
    } else if (uloga === "LEKAR") {
      console.log("lekar");
      const url = "http://localhost:8025/api/lekari/getLekarByEmail";
      axios
        .get(url, config)
        .then(Response => {
          console.log("Preuzet lekar: ");
          console.log(Response.data);
          this.setState({
            korisnik: Response.data
          });
          if (Response.data.status == 0) {
            this.setState({
              redirectToPrvoLogovanje: true
            });
          } else {
            this.setState({
              prvoLogovanje: true
            });
          }
        })
        .catch(error => {
          console.log("Lekar  nije preuzet");
        });
    } else if (uloga === "MED_SESTRA") {
      console.log("med sestra");
      const url = "http://localhost:8025/api/medicinskaSestra/medicinskaSestra";
      axios
        .get(url, config)
        .then(Response => {
          console.log("Preuzeta med sestra: ");
          console.log(Response.data);
          this.setState({
            korisnik: Response.data
          });
          if (Response.data.status == 0) {
            this.setState({
              redirectToPrvoLogovanje: true
            });
          } else {
            this.setState({
              prvoLogovanje: true
            });
          }
        })
        .catch(error => {
          console.log("Med sestra nije preuzeta");
        });
    }
  }

  render() {
    const { formErrors } = this.state;
    const errorF = this.state.errorF;
    const email = this.state.email;
    const uloga = this.state.uloga;
    const redirectToReferrer = this.state.redirectToReferrer;
    const redirectToRegistration = this.state.redirectToRegistration;
    const token = this.state.token;

    if (uloga === "ADMIN_KC" && this.state.prvoLogovanje === true) {
      return (
        <BrowserRouter>
          <Switch>
            <Route
              path="/kc"
              render={props => (
                <KlinickiCentar
                  {...props}
                  email={email}
                  uloga={uloga}
                  token={token}
                  lozinka={this.state.lozinka}
                />
              )}
            />
            <Redirect from="/" to="/kc/klinickiCentar" />
          </Switch>
        </BrowserRouter>
      );
    }
    if (uloga === "ADMIN_KLINIKE" && this.state.prvoLogovanje === true) {
      return (
        <BrowserRouter>
          <Switch>
            <Route
              path="/admink"
              render={props => (
                <AdministatorKlinike
                  {...props}
                  email={email}
                  uloga={uloga}
                  token={token}
                  lozinka={this.state.lozinka}
                />
              )}
            />
            <Redirect from="/" to="/admink/pocetnaStranica" />
          </Switch>
        </BrowserRouter>
      );
    }
    if (uloga === "LEKAR" && this.state.prvoLogovanje === true) {
      return (
        <BrowserRouter>
          <Switch>
            <Route
              path="/lekar"
              render={props => (
                <Lekar
                  {...props}
                  email={email}
                  uloga={uloga}
                  token={token}
                  lozinka={this.state.lozinka}
                />
              )}
            />
            <Redirect from="/" to="/lekar/pocetnaStranica" />
          </Switch>
        </BrowserRouter>
      );
    }
    if (uloga === "MED_SESTRA" && this.state.prvoLogovanje === true) {
      return (
        <BrowserRouter>
          <Switch>
            <Route
              path="/medses"
              render={props => (
                <MedicinskaSestra
                  {...props}
                  email={email}
                  uloga={uloga}
                  token={token}
                  lozinka={this.state.lozinka}
                />
              )}
            />
            <Redirect from="/" to="/medses/pocetnaStranica" />
          </Switch>
        </BrowserRouter>
      );
    }
    if (uloga === "PACIJENT") {
      return (
        <BrowserRouter>
          <Switch>
            <Route
              path="/pacijent"
              render={props => (
                <Pacijent
                  {...props}
                  email={email}
                  uloga={uloga}
                  token={token}
                  lozinka={this.state.lozinka}
                />
              )}
            />
            <Redirect from="/" to="/pacijent/pocetnaStranica" />
          </Switch>
        </BrowserRouter>
      );
    }

    if (redirectToRegistration === true) {
      return (
        <BrowserRouter>
          <Switch>
            <Route
              path="/registration"
              render={props => <Registracija {...props} />}
            />
            <Redirect from="/" to="/registration" />
          </Switch>
        </BrowserRouter>
      );
    }
    if (this.state.redirectToPrvoLogovanje === true) {
      return (
        <BrowserRouter>
          <Switch>
            <Route
              path="/prvoLogovanje"
              render={props => (
                <PrvoLogovanje
                  {...props}
                  email={email}
                  uloga={uloga}
                  token={token}
                  lozinka={this.state.lozinka}
                  korisnik={this.state.korisnik}
                />
              )}
            />
            <Redirect from="/" to="/prvoLogovanje" />
          </Switch>
        </BrowserRouter>
      );
    }

    return (
      <div>
        <div className="logForm">
          <div className="form-logForm">
            <h1>Prijavi se</h1>
            {this.state.waitToapprove === true && (
              <span className="errorMessage">
                Bicete obavesteni o potvrdi registracije putem mejla u najkracem
                mogucem roku.
              </span>
            )}
            <form onSubmit={this.handleSumbit} noValidate>
              <div className="email">
                <label htmlFor="email">E-mail: </label>
                <input
                  id="txtEmail"
                  type="text"
                  name="email"
                  placeholder="E-mail"
                  noValidate
                  onChange={this.handleChange}
                />
              </div>
              <div className="lozinka">
                <label htmlFor="lozinka">Lozinka: </label>
                <input
                  id="txtLoz"
                  type="password"
                  name="lozinka"
                  placeholder="Lozinka"
                  noValidate
                  onChange={this.handleChange}
                />
              </div>
              <div className="signIn">
                {formErrors.log.length > 0 && (
                  <span className="errorMessage">{formErrors.log}</span>
                )}
                <button id="btnSignIn" type="submit">
                  Uloguj se
                </button>

                <small onClick={this.handleClick}>Napravi nalog</small>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
