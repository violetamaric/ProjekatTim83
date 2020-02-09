import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import "izmenaProfila.css";
import "login.js";
import slikaLekar from "assets/img/doctor-icon.ico";
import axios from "axios";

class izmenaProfila extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: props.email,
      uloga: props.uloga,
      token: props.token,
      lozinka: this.props.lozinka,
      ime: "",
      telefon: "",
      prezime: "",
      imeN: "",
      telefonN: "",
      prezimeN: "",
      imeKlinike: "",
      idKlinike: "",
      staraLoz: props.lozinka,
      novaLoz: "",
      potvrdaLoz: "",
      promenaLozinke: false,
      formError: "",
      idLekara:props.id
    };
    this.config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
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
    // const url11 = "http://localhost:8025/api/lekari/izmena" + this.state.idLekara;
    // axios.get(url11, config).then(Response => {
    //   this.setState({
    //     email: Response.data.email,
    //     idKlinike: Response.data.klinikaID,
    //     ime: Response.data.ime,
    //     prezime: Response.data.prezime,
    //     telefon: Response.data.telefon,
    //     idLekara: Response.data.id
    //   });
    // })
    const url = "http://localhost:8025/api/lekari/getLekarByEmail";
    axios.get(url, config).then(Response => {
      this.setState({
        email: Response.data.email,
        idKlinike: Response.data.klinikaID,
        ime: Response.data.ime,
        prezime: Response.data.prezime,
        telefon: Response.data.telefon,
        idLekara: Response.data.id
      });

      const urlKlinike =
        "http://localhost:8025/api/klinike/findKlinikaById/" +
        this.state.idKlinike;

      axios.get(urlKlinike, config).then(klinika => {
        this.setState({
          imeKlinike: klinika.data.naziv
        });
      });
    });
  }
  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSumbit = e => {
    e.preventDefault();

    // let formErrors = { ...this.state.formErrors };

    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    axios
      .put(
        "http://localhost:8025/api/lekari/update",
        {
          ime: this.state.ime,
          prezime: this.state.prezime,
          telefon: this.state.telefon,
          email: this.state.email,
          id: this.state.idLekara
        },
        config
      )
      .then(response => {
        this.props.handleClick("USPESNO PROMENJENI PODACI");

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
      .catch(error => {});
  };
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
    this.setState({
      promenaLozinke: true
    });
  }
  PotvrdiPromenuLozinkeClick() {
    if (this.state.novaLoz === this.state.potvrdaLoz) {
      //
      //
      //
      axios
        .put(
          "http://localhost:8025/api/lekari/promeniLozinku",
          {
            newPassword: this.state.novaLoz,
            oldPassword: this.props.lozinka
          },
          this.config
        )
        .then(response => {
          this.props.handleClick("USPESNO PROMENJENA LOZINKA");
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
        .catch(error => {});
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
                      <Button type="submit">Izmeni podatke</Button>
                    </div>
                  </form>
                  // <form className="formUserProfile">
                  //   <FormInputs
                  //     ncols={["col-md-100", "col-md-10"]}
                  //     properties={[
                  //       {
                  //         // label: "Klinika (disabled)",
                  //         label: "Klinika ",
                  //         type: "text",
                  //         bsClass: "form-control",
                  //         placeholder: "Company",
                  //         defaultValue: "staviti ime od klinike",
                  //         disabled: true
                  //       },
                  //       {
                  //         label: "Email adresa",
                  //         type: "email",
                  //         bsClass: "form-control",
                  //         placeholder: "Email",
                  //         defaultValue: "Emai"
                  //       }
                  //     ]}
                  //   />
                  //    <FormInputs
                  //     ncols={["col-md-10", "col-md-10"]}
                  //     properties={[
                  //       {
                  //         label: "Ime",
                  //         type: "text",
                  //         bsClass: "form-control",
                  //         placeholder: "First name",
                  //         defaultValue: "ime"
                  //       },
                  //       {
                  //         label: "Prezime",
                  //         type: "text",
                  //         bsClass: "form-control",
                  //         placeholder: "Last name",
                  //         defaultValue: "Neko prezime"
                  //       }
                  //     ]}
                  //   />
                  //   <FormInputs
                  //     ncols={["col-md-10000"]}
                  //     properties={[
                  //       {
                  //         label: "Adress",
                  //         type: "text",
                  //         bsClass: "form-control",
                  //         placeholder: "Home Adress",
                  //         defaultValue:
                  //           "Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                  //       }
                  //     ]}
                  //   />

                  //   <Row>
                  //     <Col md={12}>
                  //     </Col>
                  //   </Row>
                  //   <Button bsStyle="info" pullRight fill type="submit">
                  //     Izmeni profil
                  //   </Button>
                  //   <div className="clearfix" />
                  // </form>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                // statsIcon="fa fa-clock-o"
                title="O lekaru"
                // category="Ime"
                content={
                  <div id="a">
                    <div className="slikaKCdiv">
                      <h2>
                        <img className="slikaLekar" src={slikaLekar}></img>
                      </h2>
                    </div>

                    {/* <div className="typo-line">
                      <h2>
                        <p className="category">Klinika:</p>
                        <label className="adresaKC">ucitati data</label>
                      </h2>
                    </div> */}
                    {/* <div className="typo-line">
                      <h2>
                        <p className="category">Ime:</p>
                  <label className="opisKC">{this.state.ime}</label>
                      </h2>
                    </div>
                    <div className="typo-line">
                      <h2>
                        <p className="category">Prezime:</p>
                  <label className="opisKC">{this.state.prezime}</label>
                      </h2>
                    </div> */}
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

export default izmenaProfila;
