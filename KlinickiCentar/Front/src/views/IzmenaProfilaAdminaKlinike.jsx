import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import "izmenaProfila.css";

import "login.js";
import slikaLekar from "assets/img/a.ico";
import axios from "axios";

class IzmenaProfilaAdminaKlinike extends Component {
  constructor(props) {
    super(props);
    console.log("IZMENA PROFILA ADMINA KLINIKE");
    console.log("PROPS PRINT OD AK: " + this.props);
    this.state = {
      email: props.email,
      token: props.token,
      uloga: props.uloga,
      lozinka: this.props.lozinka,
      ime: "",
      telefon: "",
      prezime: "",
      imeN: "",
      prezimeN: "",
      lozinkaN: "",
      brTelefonaN: "",
      idKlinika: "",
      imeKlinike: "",
      staraLoz: props.lozinka,
      novaLoz: "",
      potvrdaLoz: "",
      promenaLozinke: false,
      formError: ""
    };
    this.config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
  }
  prikazPromenaLozinke() {
    var res = [];
    if (this.state.promenaLozinke) {
      res.push(
        <table>
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
      console.log(this.state);
      console.log(this.props.lozinka);
      console.log(this.props);
      axios
        .put(
          "http://localhost:8025/api/adminKlinike/promeniLozinku",
          {
            newPassword: this.state.novaLoz,
            oldPassword: this.props.lozinka
          },
          this.config
        )
        .then(response => {
          console.log(response.data);
          this.props.handleClick("LOZINKA JE PROMENJENA");
          this.setState(
            {
              lozinka: this.state.novaLoz
              // lozinka: response.data.lozinka
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

  componentWillMount() {
    console.log("wmount!!!!");
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const url = "http://localhost:8025/api/adminKlinike/getAdminKlinikeByEmail";
    axios.get(url, config).then(Response => {
      console.log("Preuzet admin klinike: ");
      console.log(Response.data);

      this.setState(
        {
          email: Response.data.email,
          idKlinika: Response.data.idKlinike,
          ime: Response.data.ime,
          prezime: Response.data.prezime,
          telefon: Response.data.telefon
        },
        () => {
          console.log("ucitaj mi kliniku " + this.state.idKlinika);
          const urlKlinike =
            "http://localhost:8025/api/klinike/" + this.state.idKlinika;
          console.log(urlKlinike);
          axios
            .get(urlKlinike, config)
            .then(klinika => {
              console.log("Preuzeta klinika");
              console.log(klinika.data);

              this.setState({
                imeKlinike: klinika.data.naziv
              });
            })
            .catch(error => {
              console.log("Admin klinike nije preuzet");
            });
        }
      );
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
    this.props.handleClick("USPESNA IZMENA");
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
        "http://localhost:8025/api/adminKlinike/update",
        {
          ime: this.state.imeN,
          prezime: this.state.prezimeN,
          telefon: this.state.telefonN,
          email: this.state.email
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
          telefon: response.data.telefon
        });

        // this.setState({
        //   redirectToReferrer: true
        // });
      })
      .catch(error => {
        console.log("Izmena nije uspela! ");
      });
  };

  render() {
    const email = this.state.email;
    const uloga = this.state.uloga;
    const ime = this.state.ime;
    const prezime = this.state.prezime;
    const telefon = this.state.telefon;

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
                    className="formaIzmenaProfilaLekara"
                  >
                    <div className="ime">
                      <label htmlFor="ime">Ime: </label>
                      <input
                        type="text"
                        name="imeN"
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
                        name="prezimeN"
                        defaultValue={prezime}
                        // placeholder="prezime"
                        // noValidate
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="email">
                      <label htmlFor="email">Email: </label>
                      <input
                        type="email"
                        name="email"
                        value={email}
                        disabled="disabled"
                        // placeholder="email"
                        // noValidate
                        // onChange={this.handleChange}
                      />
                    </div>
                    <div className="email">
                      <label htmlFor="klinika">Klinika: </label>
                      <input
                        type="klinika"
                        name="klinika"
                        value={this.state.imeKlinike}
                        disabled="disabled"
                        // placeholder="email"
                        // noValidate
                        // onChange={this.handleChange}
                      />
                    </div>
                    {/* <div className="klinikaK">
                        <label htmlFor="klinikaK">klinika: </label>
                        <input
                          type="text"
                          name="klinikaK"
                          placeholder="klinikaK"
                          // noValidate
                          // onChange={this.handleChange}
                        />
                      </div> */}
                    {/* <div className="klinika">
                        <label htmlFor="klinika">Klinika: </label>
                        <input
                          type="text"
                          name="klinika"
                          placeholder="klinika"
                          // noValidate
                          // onChange={this.handleChange}
                        />
                      </div> */}
                    <div className="telefon">
                      <label htmlFor="telefon">Broj telefona: </label>
                      <input
                        type="text"
                        name="telefonN"
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
                      <Button type="submit" variant="outline-primary">
                        {" "}
                        Izmeni podatke
                      </Button>
                    </div>
                  </form>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                // statsIcon="fa fa-clock-o"
                title="O Adminu klinike"
                // category="Ime"
                content={
                  <div id="a">
                    <div className="slikaKCdiv">
                      <h2>
                        <img className="slikaPacijent" src={slikaLekar}></img>
                      </h2>
                    </div>
                    <Table striped hover>
                      <thead className="thead-dark">
                        <tr>
                          <td>E-mail:</td>
                          <td>
                            <label>{email}</label>
                          </td>
                        </tr>
                        <tr>
                          <td>Klinika:</td>
                          <td>
                            <label>{this.state.imeKlinike}</label>
                          </td>
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

                // category="opis ... naziv adresa i opis  "
                // stats="Campaign sent 2 days ago"
                // content={
                //   <div
                //     id="chartPreferences"
                //     className="ct-chart ct-perfect-fourth"
                //   >
                //     <ChartistGraph data={dataPie} type="Pie" />
                //   </div>
                // }
                // legend={
                //   <div className="legend">{this.createLegend(legendPie)}</div>
                // }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default IzmenaProfilaAdminaKlinike;
