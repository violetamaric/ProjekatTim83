import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";
// import Button from "components/CustomButton/CustomButton.jsx";
import { Button, ButtonToolbar } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import "izmenaProfila.css";
import "klinickiCentar.css";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
//dodam link za sliku  mozda od doktora!!
// import avatar from "assets/img/faces/face-3.jpg";
import "login.js";
import { log } from "util";
import Login from "login";
import slikaPacijent from "assets/img/pacijentImage.jpg";
import axios from "axios";
import Dialog from "react-bootstrap-dialog";

class IstorijaPOPacijenta extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: props.email,
      uloga: props.uloga,
      token: props.token,
      ime: "",
      prezime: "",
      formMessage: "",
      lbo: "",
      pregledi: [],
      operacije: [],
      OnazivKl: "",
      OimeL: "",
      OprezimeL: "",
      OklinikaID: "",
      OlekarID: "",
      OpregledID: ""
    };
    this.listaPregleda = this.listaPregleda.bind(this);
    this.listaOperacija = this.listaOperacija.bind(this);
    this.oceniKliniku = this.oceniKliniku.bind(this);
    this.oceniLekara = this.oceniLekara.bind(this);
    this.ocenjenaKlinika = this.ocenjenaKlinika.bind(this);
    this.ocenjenLekar = this.ocenjenLekar.bind(this);
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
        this.setState(
          {
            email: Response.data.email,
            telefon: Response.data.telefon,
            adresa: Response.data.adresa,
            grad: Response.data.grad,
            drzava: Response.data.drzava,
            lbo: Response.data.lbo,
            ime: Response.data.ime,
            prezime: Response.data.prezime
          },
          () => {
            this.ucitaj();
          }
        );
      })

      .catch(error => {});
  }
  ucitaj() {
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
        this.setState(
          {
            pregledi: res.data.sort((a, b) => b.id - a.id)
          },
          () => {
            axios
              .get(
                "http://localhost:8025/api/operacije/operacijePacijenta",
                config
              )
              .then(res2 => {
                this.setState(
                  {
                    operacije: res2.data.sort((a, b) => b.id - a.id)
                  },
                  () => {}
                );
              })
              .catch(error => {});
          }
        );
      })
      .catch(error => {});
  }
  handleSort = sortKriterijum => {
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
    }
  };
  ocenjenaKlinika(h, e, klinikaID, pregledID) {
    h.dialog.hide();

    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    axios
      .put(
        "http://localhost:8025/api/klinike/oceni/" +
          klinikaID +
          "/" +
          e.currentTarget.value +
          "/" +
          pregledID,
        {},
        config
      )
      .then(response => {
        this.props.handleClick("OCENJENA KLINIKA");
        this.ucitaj();
      })
      .catch(error => {});
  }
  ocenjenLekar(h, e, lekarID, pregledID) {
    h.dialog.hide();

    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    axios
      .put(
        "http://localhost:8025/api/lekari/oceni/" +
          lekarID +
          "/" +
          e.currentTarget.value +
          "/" +
          pregledID,
        {},
        config
      )
      .then(response => {
        this.props.handleClick("OCENJEN LEKAR");
        this.ucitaj();
      })
      .catch(error => {});
  }
  oceniKliniku = e => {
    let lista = this.state.pregledi;

    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id == e.currentTarget.value) {
        this.setState(
          {
            OnazivKl: lista[i].nazivKl,
            OimeL: lista[i].imeL,
            OprezimeL: lista[i].prezimeL,
            OklinikaID: lista[i].klinikaID,
            OlekarID: lista[i].lekarID,
            OpregledID: lista[i].id
          },
          () => {
            this.dialog.show({
              title: "Ocenite kliniku",
              body: [
                <form className="formaIzmenaProfilaLekara">
                  <div className="ime">
                    <h6>{this.state.OnazivKl}</h6>
                    <div>
                      <ButtonToolbar>
                        <Button
                          fill
                          bsStyle="danger"
                          value="1"
                          onClick={e =>
                            this.ocenjenaKlinika(
                              this,
                              e,
                              this.state.OklinikaID,
                              this.state.OpregledID
                            )
                          }
                        >
                          1
                        </Button>
                        <Button
                          fill
                          bsStyle="danger"
                          value="2"
                          onClick={e =>
                            this.ocenjenaKlinika(
                              this,
                              e,
                              this.state.OklinikaID,
                              this.state.OpregledID
                            )
                          }
                        >
                          2
                        </Button>
                        <Button
                          fill
                          bsStyle="warning"
                          value="3"
                          onClick={e =>
                            this.ocenjenaKlinika(
                              this,
                              e,
                              this.state.OklinikaID,
                              this.state.OpregledID
                            )
                          }
                        >
                          3
                        </Button>
                        <Button
                          fill
                          bsStyle="warning"
                          value="4"
                          onClick={e =>
                            this.ocenjenaKlinika(
                              this,
                              e,
                              this.state.OklinikaID,
                              this.state.OpregledID
                            )
                          }
                        >
                          4
                        </Button>
                        <Button
                          fill
                          bsStyle="info"
                          value="5"
                          onClick={e =>
                            this.ocenjenaKlinika(
                              this,
                              e,
                              this.state.OklinikaID,
                              this.state.OpregledID
                            )
                          }
                        >
                          5
                        </Button>
                        <Button
                          fill
                          bsStyle="info"
                          value="6"
                          onClick={e =>
                            this.ocenjenaKlinika(
                              this,
                              e,
                              this.state.OklinikaID,
                              this.state.OpregledID
                            )
                          }
                        >
                          6
                        </Button>
                        <Button
                          fill
                          bsStyle="info"
                          value="7"
                          onClick={e =>
                            this.ocenjenaKlinika(
                              this,
                              e,
                              this.state.OklinikaID,
                              this.state.OpregledID
                            )
                          }
                        >
                          7
                        </Button>
                        <Button
                          fill
                          bsStyle="success"
                          value="8"
                          onClick={e =>
                            this.ocenjenaKlinika(
                              this,
                              e,
                              this.state.OklinikaID,
                              this.state.OpregledID
                            )
                          }
                        >
                          8
                        </Button>
                        <Button
                          fill
                          bsStyle="success"
                          value="9"
                          onClick={e =>
                            this.ocenjenaKlinika(
                              this,
                              e,
                              this.state.OklinikaID,
                              this.state.OpregledID
                            )
                          }
                        >
                          9
                        </Button>
                        <Button
                          fill
                          bsStyle="success"
                          value="10"
                          onClick={e =>
                            this.ocenjenaKlinika(
                              this,
                              e,
                              this.state.OklinikaID,
                              this.state.OpregledID
                            )
                          }
                        >
                          10
                        </Button>
                      </ButtonToolbar>
                    </div>
                  </div>
                </form>
              ],
              actions: [Dialog.CancelAction()],
              bsSize: "medium",
              onHide: dialog => {
                dialog.hide();
              }
            });
          }
        );
      }
    }
  };
  oceniLekara = e => {
    let lista = this.state.pregledi;

    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id == e.currentTarget.value) {
        this.setState(
          {
            OnazivKl: lista[i].nazivKl,
            OimeL: lista[i].imeL,
            OprezimeL: lista[i].prezimeL,
            OklinikaID: lista[i].klinikaID,
            OlekarID: lista[i].lekarID,
            OpregledID: lista[i].id
          },
          () => {
            this.dialog.show({
              title: "Oceni lekara",
              body: [
                <form className="formaIzmenaProfilaLekara">
                  <div className="ime">
                    <h6>
                      {this.state.OimeL} {this.state.OprezimeL}
                    </h6>
                    <div>
                      <ButtonToolbar>
                        <Button
                          fill
                          bsStyle="danger"
                          value="1"
                          onClick={e =>
                            this.ocenjenLekar(
                              this,
                              e,
                              this.state.OlekarID,
                              this.state.OpregledID
                            )
                          }
                        >
                          1
                        </Button>
                        <Button
                          fill
                          bsStyle="danger"
                          value="2"
                          onClick={e =>
                            this.ocenjenLekar(
                              this,
                              e,
                              this.state.OlekarID,
                              this.state.OpregledID
                            )
                          }
                        >
                          2
                        </Button>
                        <Button
                          fill
                          bsStyle="warning"
                          value="3"
                          onClick={e =>
                            this.ocenjenLekar(
                              this,
                              e,
                              this.state.OlekarID,
                              this.state.OpregledID
                            )
                          }
                        >
                          3
                        </Button>
                        <Button
                          fill
                          bsStyle="warning"
                          value="4"
                          onClick={e =>
                            this.ocenjenLekar(
                              this,
                              e,
                              this.state.OlekarID,
                              this.state.OpregledID
                            )
                          }
                        >
                          4
                        </Button>
                        <Button
                          fill
                          bsStyle="info"
                          value="5"
                          onClick={e =>
                            this.ocenjenLekar(
                              this,
                              e,
                              this.state.OlekarID,
                              this.state.OpregledID
                            )
                          }
                        >
                          5
                        </Button>
                        <Button
                          fill
                          bsStyle="info"
                          value="6"
                          onClick={e =>
                            this.ocenjenLekar(
                              this,
                              e,
                              this.state.OlekarID,
                              this.state.OpregledID
                            )
                          }
                        >
                          6
                        </Button>
                        <Button
                          fill
                          bsStyle="info"
                          value="7"
                          onClick={e =>
                            this.ocenjenLekar(
                              this,
                              e,
                              this.state.OlekarID,
                              this.state.OpregledID
                            )
                          }
                        >
                          7
                        </Button>
                        <Button
                          fill
                          bsStyle="success"
                          value="8"
                          onClick={e =>
                            this.ocenjenLekar(
                              this,
                              e,
                              this.state.OlekarID,
                              this.state.OpregledID
                            )
                          }
                        >
                          8
                        </Button>
                        <Button
                          fill
                          bsStyle="success"
                          value="9"
                          onClick={e =>
                            this.ocenjenLekar(
                              this,
                              e,
                              this.state.OlekarID,
                              this.state.OpregledID
                            )
                          }
                        >
                          9
                        </Button>
                        <Button
                          fill
                          bsStyle="success"
                          value="10"
                          onClick={e =>
                            this.ocenjenLekar(
                              this,
                              e,
                              this.state.OlekarID,
                              this.state.OpregledID
                            )
                          }
                        >
                          10
                        </Button>
                      </ButtonToolbar>
                    </div>
                  </div>

                  {/* <div className="izmeniPodatkeLekar">
                         <Button type="submit">Izmeni podatke</Button>
                      </div> */}
                </form>
              ],
              actions: [Dialog.CancelAction()],
              bsSize: "medium",
              onHide: dialog => {
                dialog.hide();
              }
            });
          }
        );
      }
    }
  };
  listaPregleda() {
    let res = [];

    // const pretraga = this.state.pretraziPoljeKlinika;
    // const oc = this.state.ocenaKlinike;
    //
    // if ((pretraga == "" || pretraga == undefined) && oc < 5) {
    let lista = this.state.pregledi;
    const oceniK = <Tooltip id="oceni_tooltip">Oceni Kliniku</Tooltip>;
    const oceniL = <Tooltip id="oceni_tooltip">Oceni Lekara</Tooltip>;

    for (var i = 0; i < lista.length; i++) {
      if (lista[i].status == 3) {
        res.push(
          <tr key={i}>
            <td key={lista[i].nazivKl}>{lista[i].nazivKl}</td>
            <td key={lista[i].lekarID}>
              {lista[i].imeL} {lista[i].prezimeL}
            </td>
            <td key={lista[i].nazivTP}>{lista[i].nazivTP}</td>
            <td key={lista[i].cena}>{lista[i].cena} RSD</td>
            <td>
              <OverlayTrigger placement="top" overlay={oceniK}>
                <Button
                  bsStyle="info"
                  simple
                  type="button"
                  bsSize="sm"
                  value={lista[i].id}
                  onClick={e => this.oceniKliniku(e)}
                >
                  <i className="pe-7s-like2 text-info" />
                </Button>
              </OverlayTrigger>
              <Dialog
                ref={el => {
                  this.dialog = el;
                }}
              ></Dialog>
            </td>
            <td>
              <OverlayTrigger placement="top" overlay={oceniL}>
                <Button
                  bsStyle="info"
                  simple
                  type="button"
                  bsSize="sm"
                  value={lista[i].id}
                  onClick={e => this.oceniLekara(e)}
                >
                  <i className="pe-7s-like2 text-info" />
                </Button>
              </OverlayTrigger>
              <Dialog
                ref={el => {
                  this.dialog = el;
                }}
              ></Dialog>
            </td>
          </tr>
        );
      } else if (lista[i].status == 4) {
        res.push(
          <tr key={i}>
            <td key={lista[i].nazivKl}>{lista[i].nazivKl}</td>
            <td key={lista[i].lekarID}>
              {lista[i].imeL} {lista[i].prezimeL}
            </td>
            <td key={lista[i].nazivTP}>{lista[i].nazivTP}</td>
            <td key={lista[i].cena}>{lista[i].cena} RSD</td>
            <td>
              <i className="pe-7s-like2 text-info" />
            </td>
            <td>
              <OverlayTrigger placement="top" overlay={oceniL}>
                <Button
                  bsStyle="info"
                  simple
                  type="button"
                  bsSize="sm"
                  value={lista[i].id}
                  onClick={e => this.oceniLekara(e)}
                >
                  <i className="pe-7s-like2 text-info" />
                </Button>
              </OverlayTrigger>
              <Dialog
                ref={el => {
                  this.dialog = el;
                }}
              ></Dialog>
            </td>
          </tr>
        );
      } else if (lista[i].status == 5) {
        res.push(
          <tr key={i}>
            <td key={lista[i].nazivKl}>{lista[i].nazivKl}</td>
            <td key={lista[i].lekarID}>
              {lista[i].imeL} {lista[i].prezimeL}
            </td>
            <td key={lista[i].nazivTP}>{lista[i].nazivTP}</td>
            <td key={lista[i].cena}>{lista[i].cena} RSD</td>
            <td>
              <OverlayTrigger placement="top" overlay={oceniK}>
                <Button
                  bsStyle="info"
                  simple
                  type="button"
                  bsSize="sm"
                  value={lista[i].id}
                  onClick={e => this.oceniKliniku(e)}
                >
                  <i className="pe-7s-like2 text-info" />
                </Button>
              </OverlayTrigger>
              <Dialog
                ref={el => {
                  this.dialog = el;
                }}
              ></Dialog>
            </td>
            <td>
              <i className="pe-7s-like2 text-info" />
            </td>
          </tr>
        );
      } else if (lista[i].status == 6) {
        res.push(
          <tr key={i}>
            <td key={lista[i].nazivKl}>{lista[i].nazivKl}</td>
            <td key={lista[i].lekarID}>
              {lista[i].imeL} {lista[i].prezimeL}
            </td>
            <td key={lista[i].nazivTP}>{lista[i].nazivTP}</td>
            <td key={lista[i].cena}>{lista[i].cena} RSD</td>
            <td>
              <i className="pe-7s-like2 text-info" />
            </td>
            <td>
              <i className="pe-7s-like2 text-info" />
            </td>
          </tr>
        );
      }
    }
    // } else {
    //
    //
    //   let lista = this.state.listaKlinika;

    //   for (var i = 0; i < lista.length; i++) {
    //     var naziv = lista[i].naziv;
    //     var adresa = lista[i].adresa;
    //     var opis = lista[i].opis;
    //     var ocena = lista[i].ocena;
    //     if (
    //       naziv.toLowerCase().includes(pretraga.toLowerCase()) ||
    //       adresa.toLowerCase().includes(pretraga.toLowerCase()) ||
    //       opis.toLowerCase().includes(pretraga.toLowerCase())
    //     ) {
    //       if (oc <= ocena) {
    //         res.push(
    //           <tr key={i}>
    //             <td>
    //               <input
    //                 name="odabranaKlinika"
    //                 type="radio"
    //                 value={lista[i].id}
    //                 checked={this.state.izabranaKlinika == lista[i].id}
    //                 onChange={e => {
    //                   this.promenjenOdabirKlinike(e);
    //                 }}
    //               ></input>
    //             </td>
    //             <td key={lista[i].id}>{lista[i].id}</td>
    //             <td key={lista[i].naziv}>{lista[i].naziv}</td>
    //             <td key={lista[i].adresa}>{lista[i].adresa}</td>
    //             <td key={lista[i].opis}>{lista[i].opis}</td>
    //             <td key={lista[i].ocena}>{lista[i].ocena}</td>
    //           </tr>
    //         );
    //   }
    // }
    //   }
    // }

    return res;
  }
  ispisLekaraOperacija(operacija) {
    let lista = this.state.operacije;
    var res = [];
    operacija.listaLekara.map(lekar => {
      res.push(
        <div>
          {lekar.ime} {lekar.prezime}
        </div>
      );
    });
    return res;
  }
  listaOperacija() {
    let res = [];

    // const pretraga = this.state.pretraziPoljeKlinika;
    // const oc = this.state.ocenaKlinike;
    //
    // if ((pretraga == "" || pretraga == undefined) && oc < 5) {
    let lista = this.state.operacije;
    const oceniK = <Tooltip id="oceni_tooltip">Oceni Kliniku</Tooltip>;
    const oceniL = <Tooltip id="oceni_tooltip">Oceni Lekara</Tooltip>;

    for (var i = 0; i < lista.length; i++) {
      var rezultat;
      res.push(
        <tr key={i}>
          <td key={lista[i].nazivKl}>{lista[i].nazivKl}</td>
          <td>{this.ispisLekaraOperacija(lista[i])}</td>
          <td key={lista[i].nazivTP}>{lista[i].tipOperacije}</td>
          <td key={lista[i].cena}>{lista[i].cena} RSD</td>
          {/* <td>
            <i className="pe-7s-like2 text-info" />
          </td>
          <td>
            <i className="pe-7s-like2 text-info" />
            </td> */}
        </tr>
      );
      // );
      // }
    }

    return res;
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
      .catch(error => {});
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
                  <Table striped hover style={{ width: 800 }}>
                    <thead className="thead-dark">
                      <tr>
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
                          Cena
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
                        <th id="OcenaKlinike">Ocena Klinike</th>
                        <th id="OcenaLekara">Ocena Lekara</th>
                      </tr>
                    </thead>
                    <tbody>{this.listaPregleda()}</tbody>
                  </Table>
                }
              />
              <Card
                ctTableFullWidth
                ctTableResponsive
                title="Operacije"
                content={
                  <Table striped hover style={{ width: 800 }}>
                    <thead className="thead-dark">
                      <tr>
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
                          Cena
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
                      </tr>
                    </thead>
                    <tbody>{this.listaOperacija()}</tbody>
                  </Table>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default IstorijaPOPacijenta;
