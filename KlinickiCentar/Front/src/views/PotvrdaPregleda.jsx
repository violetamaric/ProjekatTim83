import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";
import moment from "moment";
import sortDown from "assets/img/icons8-down-button-50.png";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
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

class PotvrdaPregleda extends Component {
  constructor(props) {
    super(props);
    console.log("IZMENA PROFILA Pacijent");
    this.state = {
      email: props.email,
      uloga: props.uloga,
      token: props.token,
      ime: "",
      prezime: "",
      formMessage: "",
      lbo: "",
      pregledi: []
    };
    console.log(this.state);
    this.listaPregleda = this.listaPregleda.bind(this);
    this.handleOdobren = this.handleOdobren.bind(this);
    this.handleOdbijen = this.handleOdbijen.bind(this);
    this.handleOtkazan = this.handleOtkazan.bind(this);
    this.handleSort = this.handleSort.bind(this);
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
        this.setState(
          {
            telefon: Response.data.telefon,
            adresa: Response.data.adresa,
            grad: Response.data.grad,
            drzava: Response.data.drzava,
            lbo: Response.data.lbo
          },
          () => {
            this.ucitaj();
          }
        );
      })

      .catch(error => {
        console.log("Pacijent  nije preuzet");
      });
  }
  ucitaj() {
    console.log("UCITAAAJ");
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    axios
      .get("http://localhost:8025/api/pregledi/preglediPacijenta", config)
      .then(res => {
        console.log(res.data);
        this.setState({
          pregledi: res.data.sort((a, b) => {
            let startA = new Date(a.datum);
            startA.setHours(a.termin);

            let startB = new Date(b.datum);
            startB.setHours(b.termin);

            return new Date(startA).getTime() - new Date(startB).getTime();
          })
        });
      })
      .catch(error => {
        console.log("Pacijent  nije preuzet");
      });
  }
  handleOdobren = e => {
    e.preventDefault();
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    console.log(config);
    console.log("odobren");
    console.log(e.currentTarget.value);
    const url2 =
      "http://localhost:8025/api/pregledi/potvrda/" + e.currentTarget.value;
    axios
      .put(url2, {}, config)
      .then(response => {
        console.log("ODOBRENOOOO");
        console.log(response);
        this.props.handleClick("ZAHTEV JE POTVRDJEN");
        this.ucitaj();
      })
      .catch(error => {
        console.log(error.response);
      });
  };
  handleOdbijen = e => {
    e.preventDefault();
    console.log("odbijen");
    console.log(e.currentTarget.value);
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const url2 =
      "http://localhost:8025/api/pregledi/odbijanje/" + e.currentTarget.value;
    axios
      .put(url2, {}, config)
      .then(response => {
        console.log("ODBIJENO");
        console.log(response);
        this.props.handleClick("ZAHTEV JE ODBIJEN");
        this.ucitaj();
      })
      .catch(error => {
        console.log(error.response);
      });
  };
  handleOtkazan = e => {
    e.preventDefault();
    console.log("otkazan");
    console.log(e.currentTarget.value);
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const url2 =
      "http://localhost:8025/api/pregledi/otkazivanje/" + e.currentTarget.value;
    axios
      .put(url2, {}, config)
      .then(response => {
        console.log("OTKAZANO");
        console.log(response);
        console.log(response.status);
        this.props.handleClick("ZAHTEV JE OTKAZAN");
        this.ucitaj();
      })
      .catch(error => {
        // if (error.status == 409) {
        this.props.handleClick("ZAHTEV SE NE MOZE OTKAZATI");
        // }
      });
  };
  listaPregleda() {
    let res = [];
    console.log("lista kl");
    const odbij = <Tooltip id="remove_tooltip">Odbij</Tooltip>;
    const potvrdi = <Tooltip id="remove_tooltip">Potvrdi</Tooltip>;
    const otkazi = <Tooltip id="remove_tooltip">Otkazi</Tooltip>;
    // const pretraga = this.state.pretraziPoljeKlinika;
    // const oc = this.state.ocenaKlinike;
    // console.log(oc);
    // if ((pretraga == "" || pretraga == undefined) && oc < 5) {
    let lista = this.state.pregledi;

    for (var i = 0; i < lista.length; i++) {
      console.log(lista[i]);
      if (lista[i].salaN == "" || lista[i].salaN == undefined) {
        res.push(
          <tr key={i}>
            <td key={lista[i].datum}>
              {moment(lista[i].datum).format("DD.MM.YYYY.")} {lista[i].termin} h
            </td>
            <td key={lista[i].nazivKl}>{lista[i].nazivKl}</td>
            <td key={lista[i].lekarID}>
              {lista[i].imeL} {lista[i].prezimeL}
            </td>
            <td key={lista[i].nazivTP}>{lista[i].nazivTP}</td>
            <td key={lista[i].cena}>{lista[i].cena} RSD</td>

            <td align={"center"}>
              <i className="pe-7s-clock text-warning" />
            </td>
            <td align={"center"}>
              <i className="pe-7s-clock text-warning" />
            </td>
            <td></td>
            <td></td>
          </tr>
        );
      } else {
        if (lista[i].status == 1) {
          res.push(
            <tr key={i}>
              <td key={lista[i].datum}>
                {moment(lista[i].datum).format("DD.MM.YYYY.")} {lista[i].termin}{" "}
                h
              </td>
              <td key={lista[i].nazivKl}>{lista[i].nazivKl}</td>
              <td key={lista[i].lekarID}>
                {lista[i].imeL} {lista[i].prezimeL}
              </td>
              <td key={lista[i].nazivTP}>{lista[i].nazivTP}</td>
              <td key={lista[i].cena}>{lista[i].cena} RSD</td>

              <td align={"center"} key={lista[i].status}>
                {" "}
                <i className="pe-7s-check text-success" />
              </td>
              <td key={lista[i].sala}>
                {lista[i].salaN} {lista[i].salaBR}
              </td>
              <td></td>
             
              <td>
                <OverlayTrigger placement="top" overlay={otkazi}>
                  <Button
                    bsStyle="warning"
                    simple
                    type="button"
                    bsSize="sm"
                    value={lista[i].id}
                    onClick={e => this.handleOtkazan(e)}
                  >
                    <i className="pe-7s-trash text-warning" />
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          );
        } else if (lista[i].status == 0) {
          res.push(
            <tr key={i}>
              <td key={lista[i].datum}>
                {moment(lista[i].datum).format("DD.MM.YYYY.")} {lista[i].termin}{" "}
                h
              </td>
              <td key={lista[i].nazivKl}>{lista[i].nazivKl}</td>
              <td key={lista[i].lekarID}>
                {lista[i].imeL} {lista[i].prezimeL}
              </td>
              <td key={lista[i].nazivTP}>{lista[i].nazivTP}</td>
              <td key={lista[i].cena}>{lista[i].cena} RSD</td>
              <td key={lista[i].status} align={"center"}>
                <i className="pe-7s-timer text-warning" />
              </td>
              <td key={lista[i].sala}>
                {lista[i].salaN} {lista[i].salaBR}{" "}
              </td>
              <td>
                <OverlayTrigger placement="top" overlay={potvrdi}>
                  <Button
                    bsStyle="success"
                    simple
                    type="button"
                    bsSize="sm"
                    value={lista[i].id}
                    onClick={e => this.handleOdobren(e)}
                  >
                    <i className="pe-7s-check text-success" />
                  </Button>
                </OverlayTrigger>
              </td>
              <td>
                <OverlayTrigger placement="top" overlay={odbij}>
                  <Button
                    bsStyle="danger"
                    simple
                    type="button"
                    bsSize="sm"
                    value={lista[i].id}
                    onClick={e => this.handleOdbijen(e)}
                  >
                    <i className="pe-7s-close-circle text-danger" />
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          );
        } else if (lista[i].status == 2) {
          res.push(
            <tr key={i}>
              <td key={lista[i].datum}>
                {moment(lista[i].datum).format("DD.MM.YYYY.")} {lista[i].termin}{" "}
                h
              </td>
              <td key={lista[i].nazivKl}>{lista[i].nazivKl}</td>
              <td key={lista[i].lekarID}>
                {lista[i].imeL} {lista[i].prezimeL}
              </td>
              <td key={lista[i].nazivTP}>{lista[i].nazivTP}</td>
              <td key={lista[i].cena}>{lista[i].cena} RSD</td>

              <td align={"center"} key={lista[i].status}>
                {" "}
                <i className="pe-7s-close-circle text-danger" />
              </td>
              <td key={lista[i].sala}>
                {lista[i].salaN} {lista[i].salaBR}
              </td>
              <td></td>
              <td></td>
            </tr>
          );
        }
      }
    }

    return res;
  }
  handleSort = sortKriterijum => {
    console.log(sortKriterijum);
    const lista = this.state.pregledi;

    if (sortKriterijum == "klinikaUp") {
      this.setState({
        pregledi: lista.sort((a, b) => a.nazivKl.localeCompare(b.nazivKl))
      });
    } else if (sortKriterijum == "klinikaDown") {
      this.setState({
        pregledi: lista.sort((b, a) => a.nazivKl.localeCompare(b.nazivKl))
      });
    } else if (sortKriterijum == "lekarUp") {
      this.setState({
        pregledi: lista.sort((a, b) => a.imeL.localeCompare(b.imeL))
      });
    } else if (sortKriterijum == "lekarDown") {
      this.setState({
        pregledi: lista.sort((b, a) => a.imeL.localeCompare(b.imeL))
      });
    } else if (sortKriterijum == "tpUp") {
      this.setState({
        pregledi: lista.sort((a, b) => a.nazivTP.localeCompare(b.nazivTP))
      });
    } else if (sortKriterijum == "tpDown") {
      this.setState({
        pregledi: lista.sort((b, a) => a.nazivTP.localeCompare(b.nazivTP))
      });
    } else if (sortKriterijum == "cenaUp") {
      this.setState({
        pregledi: lista.sort((a, b) => a.cena - b.cena)
      });
    } else if (sortKriterijum == "cenaDown") {
      this.setState({
        pregledi: lista.sort((a, b) => b.cena - a.cena)
      });
    } else if (sortKriterijum == "statusUp") {
      this.setState({
        pregledi: lista.sort((a, b) => a.status - b.status)
      });
    } else if (sortKriterijum == "statusDown") {
      this.setState({
        pregledi: lista.sort((a, b) => b.status - a.status)
      });
    } else if (sortKriterijum == "salaUp") {
      this.setState({
        pregledi: lista.sort((a, b) => a.salaID - b.salaID)
      });
    } else if (sortKriterijum == "salaDown") {
      this.setState({
        pregledi: lista.sort((a, b) => b.salaID - a.salaID)
      });
    } else if (sortKriterijum == "datumUp") {
      console.log("datum");

      this.setState({
        pregledi: lista.sort((a, b) => {
          let startA = new Date(a.datum);
          startA.setHours(a.termin);

          let startB = new Date(b.datum);
          startB.setHours(b.termin);

          return new Date(startA).getTime() - new Date(startB).getTime();
        })
      });
    } else if (sortKriterijum == "datumDown") {
      console.log("datum");
      this.setState({
        pregledi: lista.sort((b, a) => {
          let startA = new Date(a.datum);
          startA.setHours(a.termin);

          let startB = new Date(b.datum);
          startB.setHours(b.termin);

          return new Date(startA).getTime() - new Date(startB).getTime();
        })
      });
    }
  };

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
            <Col md={12}>
              <Card
                ctTableFullWidth
                ctTableResponsive
                title="Pregledi"
                content={
                  <Table striped hover>
                    <thead className="thead-dark">
                      <tr>
                        <th id="datum">
                          Datum
                          <i
                            onClick={e => {
                              this.handleSort("datumUp");
                            }}
                            style={{
                              cursor: "pointer"
                            }}
                            className="pe-7s-angle-up"
                          />
                          <i
                            onClick={e => {
                              this.handleSort("datumDown");
                            }}
                            style={{
                              cursor: "pointer"
                            }}
                            className="pe-7s-angle-down"
                          />
                        </th>
                        <th id="Klinika">
                          Klinika
                          <i
                            onClick={e => {
                              this.handleSort("klinikaUp");
                            }}
                            style={{
                              cursor: "pointer"
                            }}
                            className="pe-7s-angle-up"
                          />
                          <i
                            onClick={e => {
                              this.handleSort("klinikaDown");
                            }}
                            style={{
                              cursor: "pointer"
                            }}
                            className="pe-7s-angle-down"
                          />
                        </th>
                        <th id="Lekar">
                          Lekar
                          <i
                            onClick={e => {
                              this.handleSort("lekarUp");
                            }}
                            style={{
                              cursor: "pointer"
                            }}
                            className="pe-7s-angle-up"
                          />
                          <i
                            onClick={e => {
                              this.handleSort("lekarDown");
                            }}
                            style={{
                              cursor: "pointer"
                            }}
                            className="pe-7s-angle-down"
                          />
                        </th>

                        <th id="TipPregleda">
                          {" "}
                          Tip Pregleda
                          <i
                            onClick={e => {
                              this.handleSort("tpUp");
                            }}
                            style={{
                              cursor: "pointer"
                            }}
                            className="pe-7s-angle-up"
                          />
                          <i
                            onClick={e => {
                              this.handleSort("tpDown");
                            }}
                            style={{
                              cursor: "pointer"
                            }}
                            className="pe-7s-angle-down"
                          />
                        </th>
                        <th id="Cena">
                          Cena (RSD)
                          <i
                            onClick={e => {
                              this.handleSort("cenaUp");
                            }}
                            style={{
                              cursor: "pointer"
                            }}
                            className="pe-7s-angle-up"
                          />
                          <i
                            onClick={e => {
                              this.handleSort("cenaDown");
                            }}
                            style={{
                              cursor: "pointer"
                            }}
                            className="pe-7s-angle-down"
                          />
                        </th>
                        <th id="Status">
                          Status
                          <i
                            onClick={e => {
                              this.handleSort("statusUp");
                            }}
                            style={{
                              cursor: "pointer"
                            }}
                            className="pe-7s-angle-up"
                          />
                          <i
                            onClick={e => {
                              this.handleSort("statusDown");
                            }}
                            style={{
                              cursor: "pointer"
                            }}
                            className="pe-7s-angle-down"
                          />
                        </th>
                        <th id="Sala">
                          Sala
                          <i
                            onClick={e => {
                              this.handleSort("salaUp");
                            }}
                            style={{
                              cursor: "pointer"
                            }}
                            className="pe-7s-angle-up"
                          />
                          <i
                            onClick={e => {
                              this.handleSort("salaDown");
                            }}
                            style={{
                              cursor: "pointer"
                            }}
                            className="pe-7s-angle-down"
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>{this.listaPregleda()}</tbody>
                  </Table>
                }
              />
              {/* <Card
                ctTableFullWidth
                ctTableResponsive
                title="Operacije"
                content={
                  <Table striped hover style={{ width: 800 }}>
                    <thead className="thead-dark">
                      <tr>
                        <th id="Klinika">Klinika</th>
                        <th id="Lekar">Lekar</th>
                        <th id="Pregled"> Pregled</th>
                        <th id="Cena">Cena</th>
                      </tr>
                    </thead>
                    <tbody>{this.listaPregleda()}</tbody>
                  </Table>
                }
              /> */}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default PotvrdaPregleda;
