import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import "izmenaProfila.css";
import "klinickiCentar.css";
//dodam link za sliku  mozda od doktora!!
// import avatar from "assets/img/faces/face-3.jpg";
import "login.js";
import { log } from "util";
import Login from "login";
import slikaPacijent from "assets/img/pacijentImage.jpg";
import axios from "axios";

class IzmenaProfilaPacijent extends Component {
  constructor(props) {
    super(props);
    console.log("IZMENA PROFILA Pacijent");
    this.state = {
      email: props.email,
      uloga: props.uloga,
      token: props.token,
      promenaLozinke: false,
      ime: "",
      telefon: "",
      prezime: "",
      formMessage: "",
      lbo: "",
      staraLoz: "",
      novaLoz: "",
      potvrdaLoz: "",
      lozinka: props.lozinka,
      adresa: "",
      grad: "",
      drzava: "",
      imeN: "",
      telefonN: "",
      prezimeN: "",
      lboN: "",
      lozinkaN: "",
      adresaN: "",
      gradN: "",
      drzavaN: "",
      formError: ""
    };
  }

  componentWillMount() {
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const url = "http://localhost:8025/api/pacijenti/findPacijentEmail";
    axios
      .get(url, config)
      .then(Response => {
        console.log("Preuzet pacijent: ");
        console.log(Response.data);

        this.setState({
          email: Response.data.email
        });
        this.setState({
          ime: Response.data.ime
        });

        this.setState({
          prezime: Response.data.prezime
        });
        this.setState({
          telefon: Response.data.telefon,
          adresa: Response.data.adresa,
          grad: Response.data.grad,
          drzava: Response.data.drzava,
          lbo: Response.data.lbo
        });
      })

      .catch(error => {
        console.log("Pacijent  nije preuzet");
      });
  }
  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
    console.log("On change !!!");
  };

  handleSumbit = e => {
    e.preventDefault();
    console.log("KLIK SUBMITTT");
    // let formErrors = { ...this.state.formErrors };
    console.log("Izmjena : ---------------");
    console.log(this.state.ime);
    console.log(this.state.prezime);
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    axios
      .put(
        "http://localhost:8025/api/pacijenti/update",
        {
          ime: this.state.ime,
          prezime: this.state.prezime,
          telefon: this.state.telefon,
          email: this.state.email,
          adresa: this.state.adresa,
          grad: this.state.grad,
          drzava: this.state.drzava,
          lbo: this.state.lbo
        },
        config
      )
      .then(response => {
        console.log(response.data);

        this.setState({
          ime: response.data.ime
        });

        this.setState({
          prezime: response.data.prezime
        });

        this.setState({
          telefon: response.data.telefon,
          adresa: response.data.adresa,
          grad: response.data.grad,
          drzava: response.data.drzava,
          lbo: response.data.lbo
        });

        // this.setState({
        //   redirectToReferrer: true
        // });
      })
      .catch(error => {
        console.log("Izmena nije uspela! ");
      });
  };
  prikazPromenaLozinke() {
    var res = [];
    if (this.state.promenaLozinke) {
      res.push(
        <table>
          {/* <tr>
            <td>Stara lozinka:</td>
            <td>
              <input
                type="password"
                name="staraLoz"
                // placeholder={this.state.ime}
                // noValidate
                onChange={this.handleChange}
              />
            </td>
          </tr>
          <br></br> */}
          <tr>
            <td>Nova lozinka:</td>
            <td>
              <input
                type="password"
                name="novaLoz"
                // placeholder={this.state.ime}
                // noValidate
                onChange={this.handleChange}
              />
            </td>
          </tr>
          <br></br>
          <tr>
            <td>Potvrdite novu lozinku:</td>
            <td>
              <input
                type="password"
                name="potvrdaLoz"
                // placeholder={this.state.ime}
                // noValidate
                onChange={this.handleChange}
              />
            </td>
          </tr>
          <br></br>
        </table>
      );
    }
    return res;
  }
  promenaLozinkeClick() {
    console.log("promenaLozinke");
    this.setState({
      promenaLozinke: true
    });
  }
  PotvrdiPromenuLozinkeClick() {
    console.log("potvrdaaa lozinkee");
    if (this.state.novaLoz === this.state.potvrdaLoz) {
      var config = {
        headers: {
          Authorization: "Bearer " + this.state.token,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      };
      axios
        .put(
          "http://localhost:8025/api/pacijenti/promeniLozinku",
          {
            newPassword: this.state.novaLoz,
            oldPassword: this.state.lozinka
          },
          config
        )
        .then(response => {
          console.log(response.data);
          this.props.handleClick("LOZINKA JE PROMENJENA");
          this.setState(
            {
              lozinka: this.state.novaLoz
            },
            () => {
              this.props.promeniLozinku(this.state.novaLoz);
            }
          );
        })
        .catch(error => {
          console.log("Izmena nije uspela! ");
        });
    } else {
      this.setState({
        formError: "Lozinke se ne poklapaju"
      });
    }
  }
  render() {
    const email = this.state.email;
    const uloga = this.state.uloga;
    const ime = this.state.ime;
    const prezime = this.state.prezime;
    const telefon = this.state.telefon;
    const adresa = this.state.adresa;
    const grad = this.state.grad;
    const drzava = this.state.drzava;
    const lbo = this.state.lbo;

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={8}>
              <Card
                title="Izmena podataka"
                content={
                  <form
                    onSubmit={this.handleSumbit}
                    className="formaIzmenaProfilaPacijent"
                  >
                    <div className="ime">
                      <label htmlFor="ime">Ime: </label>
                      <input
                        type="text"
                        name="ime"
                        defaultValue={ime}
                        // placeholder={this.state.ime}
                        // noValidate
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="prezime">
                      <label htmlFor="prezime">Prezime: </label>
                      <input
                        type="text"
                        name="prezime"
                        defaultValue={prezime}
                        // placeholder="prezime"
                        // noValidate
                        onChange={this.handleChange}
                      />
                    </div>

                    <div className="adresa">
                      <label htmlFor="adresa">Adresa: </label>
                      <input
                        type="text"
                        name="adresa"
                        defaultValue={adresa}
                        // placeholder={this.state.adresa}
                        // noValidate
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="grad">
                      <label htmlFor="grad">Grad: </label>
                      <input
                        type="text"
                        name="grad"
                        defaultValue={grad}
                        // placeholder={this.state.grad}
                        // noValidate
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="drzava">
                      <label htmlFor="drzava">Drzava: </label>
                      <input
                        type="text"
                        name="drzava"
                        defaultValue={drzava}
                        // placeholder={this.state.drzava}
                        // noValidate
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="telefon">
                      <label htmlFor="telefon">Broj telefona: </label>
                      <input
                        type="text"
                        name="telefon"
                        defaultValue={this.state.telefon}
                        // placeholder="telefon"
                        // noValidate
                        onChange={this.handleChange}
                      />

                      {/* <div className="">
                        <label htmlFor="">: </label>
                        <input
                          type="text"
                          name=""
                          placeholder=""
                          // noValidate
                          // onChange={this.handleChange}
                        />*/}
                    </div>

                    <div className="izmeniPodatkePacijent">
                      <Button
                        variant="outline-primary"
                        type="submit"
                        onClick={() => this.props.handleClick("USPESNA IZMENA")}
                      >
                        Izmeni podatke
                      </Button>

                      {this.state.formMessage.length > 0 && (
                        <span className="successMessage">
                          {this.state.formMessage}
                        </span>
                      )}
                    </div>
                  </form>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                // statsIcon="fa fa-clock-o"
                title="O Pacijentu"
                // category="Ime"
                content={
                  <div id="a">
                    <div className="slikaKCdiv">
                      <h2>
                        <img
                          className="slikaPacijent"
                          src={slikaPacijent}
                        ></img>
                      </h2>
                    </div>
                    <Table striped hover>
                      <thead className="thead-dark">
                        <tr>
                          <td>E-mail:</td>
                          <td>{email}</td>
                        </tr>
                        <tr>
                          <td>LBO:</td>
                          <td>{lbo}</td>
                        </tr>
                      </thead>
                    </Table>
                    <div>
                      <div>{this.prikazPromenaLozinke()}</div>
                      {this.state.promenaLozinke == false && (
                        <Button
                          variant="outline-primary"
                          onClick={e => this.promenaLozinkeClick()}
                        >
                          Izmeni lozinku
                        </Button>
                      )}
                      {this.state.promenaLozinke && (
                        <Button
                          variant="outline-primary"
                          onClick={e => this.PotvrdiPromenuLozinkeClick()}
                        >
                          Potvrdi lozinku
                        </Button>
                      )}
                      {this.state.formError.length > 0 && (
                        <spam>{this.state.formError}</spam>
                      )}
                    </div>
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default IzmenaProfilaPacijent;
