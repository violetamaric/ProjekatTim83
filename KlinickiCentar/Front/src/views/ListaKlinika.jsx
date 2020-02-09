import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "klinickiCentar.css";
import { Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { ButtonToolbar } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "izmenaProfila.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "login.js";
import axios from "axios";
import Dialog from "react-bootstrap-dialog";
import moment from "moment";

class ListaKlinika extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
      uloga: props.uloga,
      token: props.token,
      listaKlinika: [],
      terminiOdredjenogLekara: false,
      lekariKlinikeZaposleni: [],
      listaFiltriranihKlinika: [],
      pretraziPoljeKlinika: "",
      pretraziPoljeLekara: "",
      datumZaPregled: new Date(),
      ocenaKlinike: 0,
      ocenaLekara: 0,
      izabranaKlinika: 1,
      formError: "",
      flag: 0,
      redirectNext: false,
      redirectNext2: false,
      listaLekara: [],
      listaKlinikaPocetna: [],
      listaLekaraPocetna: [],
      izabranLekar: 0,
      nazivIzabranogLekara: "",
      nazivIzabraneKlinike: "",
      tipoviPregleda: [],
      oznaceniTipPregleda: 1,
      nazivOznacenogPregleda: "",
      back: false,
      quit: false,
      uspesnoPoslatZahtev: false,
      odabranFilter: "",
      odabranFilterL: "",
      terminiIzabranogLekara: [],
      terminiZaIzabraniDatum: [],
      prikazTerminaClick: false,
      lekarTerminClick: 0,
      izabranTermin: "",
      prikazaniTerminiLekara: 0
    };

    this.listaKlinikaUKC = this.listaKlinikaUKC.bind(this);
    // this.sortMyArray = this.sortMyArray.bind(this);
    this.handleSortKlinika = this.handleSortKlinika.bind(this);
    this.sortMyArrayLekari = this.sortMyArrayLekari.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.podesiOcenuKlinike = this.podesiOcenuKlinike.bind(this);
    this.podesiOcenuLekara = this.podesiOcenuLekara.bind(this);
    this.slobodniTermini = this.slobodniTermini.bind(this);
    this.prikazTermina = this.prikazTermina.bind(this);
    this.promenjenOdabirKlinike = this.promenjenOdabirKlinike.bind(this);
    this.promenjenOdabirLekara = this.promenjenOdabirLekara.bind(this);
    this.izaberiVrstuPregleda = this.izaberiVrstuPregleda.bind(this);
    this.redirectReferer = this.redirectReferer(this);
    this.redirectReferer2 = this.redirectReferer2(this);
    this.prethodno = this.prethodno.bind(this);
    this.prethodno2 = this.prethodno2.bind(this);
    this.odustani = this.odustani.bind(this);
    this.vidiZaposlene = this.vidiZaposlene.bind(this);
    this.odustani2 = this.odustani2.bind(this);
    this.vidiTermineClick = this.vidiTermineClick.bind(this);
    this.biranjeTermina = this.biranjeTermina.bind(this);
  }

  componentWillMount() {
    const url = "http://localhost:8025/api/klinike/all";
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    axios
      .get(url, config)
      .then(Response => {
        this.setState({
          listaKlinika: Response.data,
          listaKlinikaPocetna: Response.data,
          nazivIzabraneKlinike: Response.data[0].naziv
        });
      })

      .catch(error => {});
    axios
      .get("http://localhost:8025/api/tipPregleda/all", config)
      .then(Response => {
        this.setState({
          tipoviPregleda: Response.data,
          nazivOznacenogPregleda: Response.data[0].naziv
        });
      })

      .catch(error => {});
  }
  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };
  listaLekaraDijalog() {
    var res = [];
    this.state.lekariKlinikeZaposleni.map(lekar => {
      res.push(
        <tr>
          <td>{lekar.ime}</td>
          <td>{lekar.prezime}</td>
        </tr>
      );
    });
    return res;
  }
  promenjenOdabirKlinike = e => {
    this.setState({
      izabranaKlinika: e.currentTarget.value
    });
    if (e.currentTarget.value != 0 && e.currentTarget.value != undefined) {
      const lista = this.state.listaKlinika;
      for (var i = 0; i < lista.length; i++) {
        if (lista[i].id == e.currentTarget.value) {
          this.setState({
            nazivIzabraneKlinike: lista[i].naziv
          });
          break;
        }
      }
    }
    this.listaKlinikaUKC();
  };
  promenjenOdabirLekara = e => {
    this.setState({
      izabranLekar: e.currentTarget.value
    });
    if (e.currentTarget.value != 0 && e.currentTarget.value != undefined) {
      const lista = this.state.listaLekara;
      for (var i = 0; i < lista.length; i++) {
        if (lista[i].id == e.currentTarget.value) {
          this.setState(
            {
              nazivIzabranogLekara: ""
            },
            () =>
              this.setState({
                nazivIzabranogLekara: lista[i].ime + " " + lista[i].prezime
              })
          );
          break;
        }
      }
      // this.setState(
      //   {
      //     nazivIzabranogLekara:
      //       this.state.listaLekara[this.state.izabranLekar - 1].ime +
      //       " " +
      //       this.state.listaLekara[this.state.izabranLekar - 1].prezime
      //   },
      //   () =>
      // );
    }
    this.listaLekaraKlinike();
  };
  vidiZaposlene = e => {
    e.preventDefault();

    var klinikaID = e.currentTarget.value;
    var url =
      "http://localhost:8025/api/klinike/listaLekaraKlinika/" + klinikaID;
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    axios
      .get(url, config)
      .then(Response => {
        this.setState(
          {
            lekariKlinikeZaposleni: Response.data
          },
          () => {
            this.dialog.show({
              title: "Lekari zaposleni",
              body: [
                <div>
                  <Table striped hover>
                    <thead className="thead-dark">
                      <tr>
                        <th id="Naziv">Ime</th>
                        <th id="Adresa"> Prezime</th>
                      </tr>
                    </thead>
                    <tbody>{this.listaLekaraDijalog()}</tbody>
                  </Table>
                </div>
              ],
              actions: [Dialog.CancelAction()],
              bsSize: "medium",
              onHide: dialog => {
                dialog.hide();
              }
            });
          }
        );
      })
      .catch(error => {});
  };
  listaKlinikaUKC() {
    let res = [];

    const PrikaziZaposleneTooltip = (
      <Tooltip id="remove_tooltip">Vidi zaposlene</Tooltip>
    );
    const pretraga = this.state.pretraziPoljeKlinika;
    const oc = this.state.ocenaKlinike;

    if ((pretraga == "" || pretraga == undefined) && oc < 5) {
      let lista = this.state.listaKlinika;

      for (var i = 0; i < lista.length; i++) {
        res.push(
          <tr key={i}>
            <td>
              <input
                name="odabranaKlinika"
                type="radio"
                value={lista[i].id}
                checked={this.state.izabranaKlinika == lista[i].id}
                onChange={e => {
                  this.promenjenOdabirKlinike(e);
                }}
              ></input>
            </td>
            <td key={lista[i].naziv}>{lista[i].naziv}</td>
            <td key={lista[i].adresa}>{lista[i].adresa}</td>
            <td key={lista[i].opis}>{lista[i].opis}</td>
            <td key={lista[i].ocena}>{lista[i].ocena}</td>
            <td>
              <OverlayTrigger placement="top" overlay={PrikaziZaposleneTooltip}>
                <Button
                  bsStyle="info"
                  simple
                  type="button"
                  bsSize="sm"
                  value={lista[i].id}
                  onClick={e => this.vidiZaposlene(e)}
                >
                  <i className="pe-7s-id text-info" />
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
      }
    } else {
      let lista = this.state.listaKlinika;
      for (var i = 0; i < lista.length; i++) {
        var naziv = lista[i].naziv;
        var adresa = lista[i].adresa;
        var opis = lista[i].opis;
        var ocena = lista[i].ocena;
        if (
          naziv.toLowerCase().includes(pretraga.toLowerCase()) ||
          adresa.toLowerCase().includes(pretraga.toLowerCase()) ||
          opis.toLowerCase().includes(pretraga.toLowerCase())
        ) {
          if (oc <= ocena) {
            res.push(
              <tr key={i}>
                <td>
                  <input
                    name="odabranaKlinika"
                    type="radio"
                    value={lista[i].id}
                    checked={this.state.izabranaKlinika == lista[i].id}
                    onChange={e => {
                      this.promenjenOdabirKlinike(e);
                    }}
                  ></input>
                </td>
                <td key={lista[i].naziv}>{lista[i].naziv}</td>
                <td key={lista[i].adresa}>{lista[i].adresa}</td>
                <td key={lista[i].opis}>{lista[i].opis}</td>
                <td key={lista[i].ocena}>{lista[i].ocena}</td>
                <td>
                  <OverlayTrigger
                    placement="top"
                    overlay={PrikaziZaposleneTooltip}
                  >
                    <Button
                      bsStyle="info"
                      simple
                      type="button"
                      bsSize="sm"
                      value={lista[i].id}
                      onClick={e => this.vidiZaposlene(e)}
                    >
                      <i className="pe-7s-id text-info" />
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
          }
        }
      }
    }

    return res;
  }
  pregledZahteva() {
    let res = [];
    res.push(
      <tr>
        <td>{this.state.nazivIzabraneKlinike}</td>

        <td>{this.state.nazivOznacenogPregleda}</td>
        <td>{this.state.nazivIzabranogLekara}</td>
        <td>2000 RSD</td>
      </tr>
    );
    return res;
  }
  vidiTermineClick = e => {
    //

    var lekarid = e.currentTarget.value;
    var url =
      "http://localhost:8025/api/lekari/listaZauzetostiLekara/" +
      lekarid +
      "/" +
      this.state.datumZaPregled;
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    axios
      .get(url, config)
      .then(Response => {
        this.setState(
          {
            terminiOdredjenogLekara: true,
            terminiIzabranogLekara: Response.data.sort((a, b) => {
              let startA = new Date(a.datumPocetka);
              startA.setHours(a.termin);

              let startB = new Date(b.datumPocetka);
              startB.setHours(b.termin);

              return new Date(startA).getTime() - new Date(startB).getTime();
            })
          },
          () => {
            var niz = [false, false, false, false];
            this.state.terminiIzabranogLekara.map(termin => {
              const dat = moment(this.state.datumZaPregled).format(
                "DD.MM.YYYY."
              );
              const datPoc = moment(termin.datumPocetka).format("DD.MM.YYYY.");
              //

              if (dat.valueOf() === datPoc.valueOf()) {
                if (termin.termin == 9) {
                  niz[0] = true;
                } else if (termin.termin == 11) {
                  niz[1] = true;
                } else if (termin.termin == 13) {
                  niz[2] = true;
                } else if (termin.termin == 15) {
                  niz[3] = true;
                }
              }
            });
            this.setState({
              prikazTerminaClick: true,
              lekarTerminClick: lekarid,
              terminiZaIzabraniDatum: niz,
              prikazaniTerminiLekara: lekarid
            });
          }
        );
      })

      .catch(error => {});
  };
  prikazTermina() {
    var res = [];
    if (this.state.prikazTerminaClick == true) {
      res.push(
        <select id="izaberiTermin" onChange={e => this.biranjeTermina(e)}>
          <option value="odaberiTermin">Izaberite termin</option>
          {this.state.terminiZaIzabraniDatum[0] == false && (
            <option value="9">09:00 - 11:00</option>
          )}
          {this.state.terminiZaIzabraniDatum[1] == false && (
            <option value="11">11:00 - 13:00</option>
          )}
          {this.state.terminiZaIzabraniDatum[2] == false && (
            <option value="13">13:00 - 15:00</option>
          )}
          {this.state.terminiZaIzabraniDatum[3] == false && (
            <option value="15">15:00 - 17:00</option>
          )}
        </select>
      );
    }

    return res;
  }
  biranjeTermina = e => {
    const termin = e.target.value;

    this.setState(
      {
        izabranTermin: termin
      },
      () => {}
    );
  };
  listaLekaraKlinike() {
    let res = [];

    const pretraga = this.state.pretraziPoljeLekara;
    const oc = this.state.ocenaLekara;

    const vidiTermine = <Tooltip>Vidi termine</Tooltip>;
    if ((pretraga == "" || pretraga == undefined) && oc < 5) {
      let lista = this.state.listaLekara;

      for (var i = 0; i < lista.length; i++) {
        const id2 = "odabranLekar" + i;
        const vt2 = "vidiTermine" + i;
        res.push(
          <tr key={i}>
            <td>
              <input
                id={id2}
                name="odabranLekar"
                type="radio"
                value={lista[i].id}
                checked={this.state.izabranLekar == lista[i].id}
                onChange={e => {
                  this.promenjenOdabirLekara(e);
                }}
              ></input>
            </td>

            <td key={lista[i].ime}>{lista[i].ime}</td>
            <td key={lista[i].prezime}>{lista[i].prezime}</td>
            <td key={lista[i].ocena}>{lista[i].ocena}</td>

            <td>
              <OverlayTrigger placement="top" overlay={vidiTermine}>
                <Button
                  id={vt2}
                  bsStyle="info"
                  // style={{ outline: "#42f5a4" }}
                  simple
                  type="button"
                  bsSize="sm"
                  value={lista[i].id}
                  onClick={e => this.vidiTermineClick(e)}
                >
                  <i className="pe-7s-clock text-info" />
                </Button>
              </OverlayTrigger>
              <Dialog
                ref={el => {
                  this.dialog = el;
                }}
              ></Dialog>
            </td>
            <td>
              {this.state.lekarTerminClick == lista[i].id &&
                this.prikazTermina()}
            </td>
          </tr>
        );
      }
    } else {
      let lista = this.state.listaLekara;

      for (var i = 0; i < lista.length; i++) {
        var ime = lista[i].ime;
        var prezime = lista[i].prezime;
        var ocena;
        if (lista[i].ocena == undefined) {
          ocena = 0;
        } else {
          ocena = lista[i].ocena;
        }
        if (
          ime.toLowerCase().includes(pretraga.toLowerCase()) ||
          prezime.toLowerCase().includes(pretraga.toLowerCase())
        ) {
          if (oc <= ocena) {
            const id2 = "odabranLekar" + i;
            const vt2 = "vidiTermine" + i;

            res.push(
              <tr key={i}>
                <td>
                  <input
                    id={id2}
                    name="odabranLekar"
                    type="radio"
                    value={lista[i].id}
                    checked={this.state.izabranLekar == lista[i].id}
                    onChange={e => {
                      this.promenjenOdabirLekara(e);
                    }}
                  ></input>
                </td>

                <td key={lista[i].ime}>{lista[i].ime}</td>
                <td key={lista[i].prezime}>{lista[i].prezime}</td>
                <td key={lista[i].ocena}>{lista[i].ocena}</td>

                <td>
                  <OverlayTrigger placement="top" overlay={vidiTermine}>
                    <Button
                      id={vt2}
                      bsStyle="info"
                      simple
                      type="button"
                      bsSize="sm"
                      value={lista[i].id}
                      onClick={e => this.vidiTermineClick(e)}
                    >
                      <i className="pe-7s-clock text-info" />
                    </Button>
                  </OverlayTrigger>
                  <Dialog
                    ref={el => {
                      this.dialog = el;
                    }}
                  ></Dialog>
                </td>
                <td>{this.prikazTermina()}</td>
              </tr>
            );
          }
        }
      }
    }

    return res;
  }
  handleSortKlinika(sortBy) {
    const lista = this.state.listaKlinika;
    if (sortBy === "nazivUp") {
      this.setState({
        listaKlinika: lista.sort((a, b) => a.naziv.localeCompare(b.naziv))
      });
    } else if (sortBy === "nazivDown") {
      this.setState({
        listaKlinika: lista.sort((b, a) => a.naziv.localeCompare(b.naziv))
      });
    } else if (sortBy === "opisUp") {
      this.setState({
        listaKlinika: lista.sort((a, b) => a.opis.localeCompare(b.opis))
      });
    } else if (sortBy === "opisDown") {
      this.setState({
        listaKlinika: lista.sort((b, a) => a.opis.localeCompare(b.opis))
      });
    } else if (sortBy === "adresaUp") {
      this.setState({
        listaKlinika: lista.sort((a, b) => a.adresa.localeCompare(b.adresa))
      });
    } else if (sortBy === "adresaDown") {
      this.setState({
        listaKlinika: lista.sort((b, a) => a.adresa.localeCompare(b.adresa))
      });
    } else if (sortBy === "ocenaUp") {
      this.setState({
        listaKlinika: lista.sort((a, b) => a.ocena - b.ocena)
      });
    } else if (sortBy === "ocenaDown") {
      this.setState({
        listaKlinika: lista.sort((a, b) => b.ocena - a.ocena)
      });
    }
  }
  handleSortLekari(sortBy) {
    const lista = this.state.listaLekara;
    if (sortBy === "imeUp") {
      this.setState({
        listaLekara: lista.sort((a, b) => a.ime.localeCompare(b.ime))
      });
    } else if (sortBy === "imeDown") {
      this.setState({
        listaLekara: lista.sort((b, a) => a.ime.localeCompare(b.ime))
      });
    } else if (sortBy === "prezimeUp") {
      this.setState({
        listaLekara: lista.sort((a, b) => a.prezime.localeCompare(b.prezime))
      });
    } else if (sortBy === "prezimeDown") {
      this.setState({
        listaLekara: lista.sort((b, a) => a.prezime.localeCompare(b.prezime))
      });
    } else if (sortBy === "ocenaUp") {
      this.setState({
        listaLekara: lista.sort((a, b) => a.ocena - b.ocena)
      });
    } else if (sortBy === "ocenaDown") {
      this.setState({
        listaLekara: lista.sort((a, b) => b.ocena - a.ocena)
      });
    }
  }
  sortMyArrayLekari(sortBy) {
    const lista = this.state.listaLekara;
    if (sortBy === "ime") {
      this.setState({
        listaKlinika: lista.sort((a, b) => a.ime.localeCompare(b.ime))
      });
    } else if (sortBy === "prezime") {
      this.setState({
        listaKlinika: lista.sort((a, b) => a.prezime.localeCompare(b.prezime))
      });
    } else if (sortBy === "ocena") {
      this.setState({
        listaKlinika: lista.sort((a, b) => b.ocena - a.ocena)
      });
    }
  }
  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;

    this.setState({ [name]: value });
  };
  handleChangeDate = date => {
    this.setState(
      {
        datumZaPregled: date
      },
      () => {
        var config = {
          headers: {
            Authorization: "Bearer " + this.state.token,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        };
        axios
          .get(
            "http://localhost:8025/api/klinike/slobodneKlinike/" +
              this.state.datumZaPregled,
            config
          )
          .then(Response => {
            this.setState({
              listaKlinika: Response.data
            });
          })

          .catch(error => {});
      }
    );
  };
  podesiOcenuKlinike = e => {
    e.preventDefault();
    if (e.target.value == "9") {
      this.setState({
        ocenaKlinike: 9
      });
      this.listaKlinikaUKC();
    } else if (e.target.value == "8") {
      this.setState({
        ocenaKlinike: 8
      });
      this.listaKlinikaUKC();
    } else if (e.target.value == "7") {
      this.setState({
        ocenaKlinike: 7
      });
      this.listaKlinikaUKC();
    } else if (e.target.value == "6") {
      this.setState({
        ocenaKlinike: 6
      });
      this.listaKlinikaUKC();
    } else if (e.target.value == "5") {
      this.setState({
        ocenaKlinike: 5
      });
      this.listaKlinikaUKC();
    }
  };
  podesiOcenuLekara = e => {
    e.preventDefault();
    if (e.target.value == "9") {
      this.setState({
        ocenaLekara: 9
      });
      this.listaLekaraKlinike();
    } else if (e.target.value == "8") {
      this.setState({
        ocenaLekara: 8
      });
      this.listaLekaraKlinike();
    } else if (e.target.value == "7") {
      this.setState({
        ocenaLekara: 7
      });
      this.listaLekaraKlinike();
    } else if (e.target.value == "6") {
      this.setState({
        ocenaLekara: 6
      });
      this.listaLekaraKlinike();
    } else if (e.target.value == "5") {
      this.setState({
        ocenaLekara: 5
      });
      this.listaLekaraKlinike();
    }
  };
  slobodniTermini() {
    //get zahtev za preuzimanje termina iz baze za zadati datum
  }

  odabranaKlinika = e => {
    //treba redirektovati na pretragu i filtriranje lekara
    e.preventDefault();
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    axios
      .get(
        "http://localhost:8025/api/klinike/listaLekaraKlinika/" +
          this.state.izabranaKlinika,
        config
      )
      .then(Response => {
        this.setState({
          listaLekara: Response.data,
          listaLekaraPocetna: Response.data,
          nazivIzabranogLekara:
            Response.data[0].ime + " " + Response.data[0].prezime,
          redirectNext: true,
          flag: 1
        });
      })

      .catch(error => {});
    // this.setState({

    // });
  };
  odabranLekar = e => {
    //treba redirektovati na pregled zahteva za pregled
    e.preventDefault();

    const ol = this.state.izabranLekar;
    var porukaErr = "";
    if (this.state.prikazaniTerminiLekara != ol) {
      porukaErr = "Odaberite termin koji odgovara izabranom lekaru";
    }
    if (
      this.state.izabranTermin == "odaberiTermin" ||
      this.state.izabranTermin == ""
    ) {
      porukaErr = "Odaberite termin";
    }
    if (ol == 0 || ol == undefined) {
      porukaErr = "Odaberite lekara";
    }
    if (
      ol != 0 &&
      ol != undefined &&
      this.state.izabranTermin != "odaberiTermin" &&
      this.state.izabranTermin != "" &&
      this.state.prikazaniTerminiLekara == ol
    ) {
      this.setState({
        redirectNext2: true,
        flag: 2
      });
    } else {
      // if (this.state.back == false) {
      this.setState({
        formError: porukaErr
      });
      // }
    }
  };
  redirectReferer() {
    var flag = 1;

    if (this.state.redirectNext == true) {
      return (
        <Route
          path="/registration"
          render={props => (
            <ListaKlinika
              {...props}
              flag={flag}
              izabranaKlinika={this.state.izabranaKlinika}
              nazivIzabraneKlinike={this.state.nazivIzabraneKlinike}
              listaLekara={this.state.listaLekara}
            />
          )}
        >
          <Redirect from="/" to="/pacijent/klinikePacijenta" />
        </Route>
      );
    }
  }
  redirectReferer2() {
    var flag = 2;
    // axios
    //   .get(
    //     "http://localhost:8025/api/klinike/listaLekaraKlinika/" +
    //       this.state.izabranaKlinika
    //   )
    //   .then(Response => {
    //
    //
    //     this.setState({
    //       listaLekara: Response.data
    //     });
    //
    //   })

    //   .catch(error => {
    //
    //   });
    if (this.state.redirectNext2 == true) {
      return (
        <Route
          path="/registration"
          render={props => (
            <ListaKlinika
              {...props}
              flag={flag}
              izabranaKlinika={this.state.izabranaKlinika}
              izabranLekar={this.state.izabranLekar}
              nazivIzabraneKlinike={this.state.nazivIzabraneKlinike}
              nazivIzabranogLekara={this.state.nazivIzabranogLekara}
              nazivOznacenogPregleda={this.state.nazivOznacenogPregleda}
            />
          )}
        >
          <Redirect from="/" to="/pacijent/klinikePacijenta" />
        </Route>
      );
    }
  }
  biranjeTipaPregleda(tip) {
    const idTP = tip.target.value;
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    axios
      .get("http://localhost:8025/api/tipPregleda/klinikeTP/" + idTP, config)
      .then(Response => {
        var filtrirane = Response.data;
        var listaFK = [];
        var lista = this.state.listaKlinika;
        for (var i = 0; i < this.state.listaKlinika; i++) {
          if (filtrirane.some(item => lista[i].id === item.id)) {
            listaFK.concat(lista[i]);
          }
        }

        this.setState(
          {
            listaKlinika: listaFK,
            oznaceniTipPregleda: tip.target.value
          },
          () => {
            for (var i = 0; i < lista.length; i++) {
              var naziv = lista[i].naziv;
              var id = lista[i].id;
              if (id == tip.target.value) {
                this.setState({
                  nazivOznacenogPregleda: naziv
                });
              }
            }
          }
        );
      })

      .catch(error => {});
  }

  izaberiVrstuPregleda() {
    let res = [];
    let lista = this.state.tipoviPregleda;
    for (var i = 0; i < lista.length; i++) {
      res.push(<option value={lista[i].id}>{lista[i].naziv}</option>);
    }
    return res;
  }
  slanjeZahtevaZaPregled = e => {
    e.preventDefault();

    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };

    axios

      .post(
        "http://localhost:8025/api/pregledi/new",
        {
          lekarID: this.state.izabranLekar,
          klinikaID: this.state.izabranaKlinika,
          tipPregledaID: this.state.oznaceniTipPregleda,
          pacijentEmail: this.state.email,
          cena: 500,
          datum: this.state.datumZaPregled,
          termin: this.state.izabranTermin
        },
        config
      )
      .then(response => {
        this.setState(
          {
            uspesnoPoslatZahtev: true
          },
          () => this.props.handleClick("ZAHTEV JE POSLAT")
        );
      })
      .catch(error => {});
  };
  prethodno = e => {
    e.preventDefault();

    var flag = 0;
    this.setState({
      back: true,
      flag: 0,
      prikazTerminaClick: false,
      izabraniLekar: 0
    });
  };
  prethodno2() {
    var flag = 0;

    if (this.state.back == true) {
      this.setState(
        {
          prikazTerminaClick: false,
          izabraniLekar: 0
        },
        () => {
          return (
            <Route
              path="/registration"
              render={props => (
                <ListaKlinika
                  {...props}
                  flag={this.state.flag}
                  back={this.state.back}
                />
              )}
            >
              <Redirect from="/" to="/pacijent/klinikePacijenta" />
            </Route>
          );
        }
      );
    }
  }
  prikazFiltera() {
    let res = [];
    if (this.state.odabranFilter == "pretraga") {
      res.push(
        <h5>
          <input
            id="pretraziPoljeKlinika"
            placeholder="Pretrazi"
            type="text"
            aria-label="Search"
            name="pretraziPoljeKlinika"
            onChange={this.handleChange}
            value={this.state.pretraziPoljeKlinika}
          />
        </h5>
      );
    } else if (this.state.odabranFilter == "tipPregleda") {
      res.push(
        <h5>
          {" "}
          <select
            id="selectTipPregleda"
            name="tipPregleda"
            onChange={e => this.biranjeTipaPregleda(e)}
          >
            {this.izaberiVrstuPregleda()}
          </select>
        </h5>
      );
    } else if (this.state.odabranFilter == "datum") {
      res.push(
        <h5>
          <DatePicker
            id="odabirDatuma"
            placeholderText="Izaberi datum"
            selected={this.state.datumZaPregled}
            onChange={date => this.handleChangeDate(date)}
            // showTimeSelect
            minDate={new Date()}
            // timeCaption="Vreme"
            withPortal
            // excludeTimes={[
            //   setHours(setMinutes(new Date(), 0), 17)
            // ]}
            // minTime={setHours(setMinutes(new Date(), 0), 7)}
            // maxTime={setHours(setMinutes(new Date(), 0), 20)}
            dateFormat="dd.MM.yyyy."

            // onChange={date => setStartDate(date)}
          />
          {/* <br></br>
          <Button onClick={this.slobodniTermini}>Pronadji termine</Button> */}
        </h5>
      );
    } else if (this.state.odabranFilter == "ocena") {
      res.push(
        <div>
          <ButtonToolbar>
            <Button
              id="klinikaOcena9"
              value="9"
              onClick={e => this.podesiOcenuKlinike(e)}
            >
              9+
            </Button>
            <Button value="8" onClick={e => this.podesiOcenuKlinike(e)}>
              8+
            </Button>
            <Button value="7" onClick={e => this.podesiOcenuKlinike(e)}>
              7+
            </Button>
            <Button value="6" onClick={e => this.podesiOcenuKlinike(e)}>
              6+
            </Button>
            <Button value="5" onClick={e => this.podesiOcenuKlinike(e)}>
              5+
            </Button>
          </ButtonToolbar>
        </div>
      );
    }
    return res;
  }
  prikazFilteraL() {
    let res = [];
    if (this.state.odabranFilterL == "pretraga") {
      res.push(
        <h5>
          <input
            placeholder="Pretrazi"
            type="text"
            aria-label="Search"
            name="pretraziPoljeLekara"
            onChange={this.handleChange}
            value={this.state.pretraziPoljeLekara}
          />
        </h5>
      );
    } else if (this.state.odabranFilterL == "ocena") {
      res.push(
        <div>
          <ButtonToolbar>
            <Button value="9" onClick={e => this.podesiOcenuLekara(e)}>
              9+
            </Button>
            <Button value="8" onClick={e => this.podesiOcenuLekara(e)}>
              8+
            </Button>
            <Button value="7" onClick={e => this.podesiOcenuLekara(e)}>
              7+
            </Button>
            <Button value="6" onClick={e => this.podesiOcenuLekara(e)}>
              6+
            </Button>
            <Button value="5" onClick={e => this.podesiOcenuLekara(e)}>
              5+
            </Button>
          </ButtonToolbar>
        </div>
      );
    }
    return res;
  }
  odustani = e => {
    e.preventDefault();

    this.setState({
      quit: true
    });
  };
  odustani2 = () => {
    if (this.state.quit == true) {
      return <Redirect from="/" to="/pacijent/pocetnaStranica" />;
    }
  };
  clickPretraga() {
    if (this.state.odabranFilter == "pretraga") {
      this.setState({
        odabranFilter: ""
      });
    } else {
      this.setState({
        odabranFilter: "pretraga"
      });
    }
  }
  clickTipPregleda() {
    if (this.state.odabranFilter == "tipPregleda") {
      this.setState({
        odabranFilter: ""
      });
    } else {
      this.setState({
        odabranFilter: "tipPregleda"
      });
    }
  }
  clickDatum() {
    if (this.state.odabranFilter == "datum") {
      this.setState({
        odabranFilter: ""
      });
    } else {
      this.setState({
        odabranFilter: "datum"
      });
    }
  }
  clickOcena() {
    if (this.state.odabranFilter == "ocena") {
      this.setState({
        odabranFilter: ""
      });
    } else {
      this.setState({
        odabranFilter: "ocena"
      });
    }
  }
  clickOcenaL() {
    if (this.state.odabranFilterL == "ocena") {
      this.setState({
        odabranFilterL: ""
      });
    } else {
      this.setState({
        odabranFilterL: "ocena"
      });
    }
  }
  clickPretragaL() {
    if (this.state.odabranFilterL == "pretraga") {
      this.setState({
        odabranFilterL: ""
      });
    } else {
      this.setState({
        odabranFilterL: "pretraga"
      });
    }
  }
  ponistiFiltere() {
    this.setState({
      listaKlinika: this.state.listaKlinikaPocetna,
      odabranFilter: "",
      ocenaKlinike: 0,
      pretraziPoljeKlinika: ""
    });
  }
  ponistiFiltereL() {
    this.setState({
      listaLekara: this.state.listaLekaraPocetna,
      odabranFilterL: "",
      ocenaLekara: 0,
      pretraziPoljeLekara: ""
    });
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
    const lista = this.state.listaKlinika;

    // const [startDate, setStartDate] = useState(new Date());

    if (this.state.uspesnoPoslatZahtev == true) {
      return (
        <div className="content">
          <Grid fluid>
            <Row>
              <Col md={12}>
                <Card
                  title="Zahtev za pregled je uspesno poslat!"
                  content={
                    <div>
                      <h3 className="successMessage">
                        Sala za pregled ce Vam biti dodeljena najkasnije sutra.
                      </h3>
                      <h3 className="successMessage">
                        Bicete obavesteni putem elektronske poste, nakon cega je
                        neophodno potvrditi pregled.
                      </h3>
                    </div>
                  }
                />
              </Col>
            </Row>
          </Grid>
        </div>
      );
    } else {
      //ako klinika nije odabrana
      if (this.state.flag == 0) {
        // const [startDate, setStartDate] = useState(
        //   setHours(setMinutes(new Date(), 30), 16)
        // );
        return (
          <div className="content">
            <Grid fluid>
              <Row>
                <Col md={12}>
                  <Card
                    content={
                      <div>
                        <ButtonToolbar>
                          <Button
                            id="btnPretragaKlinika"
                            fill
                            bsStyle="info"
                            value="1"
                            onClick={e => this.clickPretraga()}
                          >
                            Pretrazi
                          </Button>
                          <Button
                            id="btnTipPregleda"
                            fill
                            bsStyle="danger"
                            value="2"
                            onClick={e => this.clickTipPregleda()}
                          >
                            Izaberi tip pregleda
                          </Button>
                          <Button
                            id="btnDatum"
                            fill
                            bsStyle="success"
                            value="3"
                            onClick={e => this.clickDatum()}
                          >
                            Izaberi datum
                          </Button>
                          <Button
                            id="btnOcena"
                            fill
                            bsStyle="warning"
                            value="4"
                            onClick={e => this.clickOcena()}
                          >
                            Filtriraj po oceni
                          </Button>
                          <Button
                            id="btnPonistiFilter"
                            fill
                            value="4"
                            onClick={e => this.ponistiFiltere()}
                          >
                            <i className="pe-7s-close" />
                          </Button>
                        </ButtonToolbar>
                        <br></br>
                        <div>{this.prikazFiltera()}</div>
                        {/* <Table striped hover style={{ width: 800 }}>
                       <thead className="thead-dark">
                                <tr>
                                  <th>
                                  <input
                      placeholder="Pretrazi"
                      type="text"
                      aria-label="Search"
                      name="pretraziPoljeKlinika"
                      onChange={this.handleChange}
                    />
                                  </th>
                                  <th>
                                  <h5>Datum za pregled:</h5>

                                    <DatePicker
                                      placeholderText="Izaberi datum"
                                      selected={this.state.datumZaPregled}
                                      onChange={date=>this.handleChangeDate(date)}
                                      // showTimeSelect
                                      minDate={new Date()}
                                      // timeCaption="Vreme"
                                      withPortal
                                      // excludeTimes={[
                                      //   setHours(setMinutes(new Date(), 0), 17)
                                      // ]}
                                      // minTime={setHours(setMinutes(new Date(), 0), 7)}
                                      // maxTime={setHours(setMinutes(new Date(), 0), 20)}
                                      dateFormat="dd.MM.yyyy"

                                      // onChange={date => setStartDate(date)}
                                    />
                                    <Button onClick={this.slobodniTermini}>
                                      Pronadji termine
                                    </Button>
                                  </th>
                                  
                                </tr>
                                <tr>
                                  <th>
                                  <h5>Tip Pregleda:</h5>
                                    <select
                                      name="tipPregleda"
                                      onChange={e => this.biranjeTipaPregleda(e)}
                                    >
                                      {this.izaberiVrstuPregleda()}
                                    </select>
                                  </th>
                                  <th>
                                  <h5>Ocena: </h5>
                    <Button value="9" onClick={e => this.podesiOcenuKlinike(e)}>
                      9+
                    </Button>
                    <Button value="8" onClick={e => this.podesiOcenuKlinike(e)}>
                      8+
                    </Button>
                    <Button value="7" onClick={e => this.podesiOcenuKlinike(e)}>
                      7+
                    </Button>
                    <Button value="6" onClick={e => this.podesiOcenuKlinike(e)}>
                      6+
                    </Button>
                    <Button value="5" onClick={e => this.podesiOcenuKlinike(e)}>
                      5+
                    </Button>
                                  </th>
                                </tr>
                        </thead>
                       </Table> */}
                        {/* <form>

                  </form>
                  <div>
                    <h5>Datum za pregled:</h5>

                    <DatePicker
                      placeholderText="Izaberi datum"
                      selected={this.state.datumZaPregled}
                      onChange={date=>this.handleChangeDate(date)}
                      // showTimeSelect
                      minDate={new Date()}
                      // timeCaption="Vreme"
                      withPortal
                      // excludeTimes={[
                      //   setHours(setMinutes(new Date(), 0), 17)
                      // ]}
                      // minTime={setHours(setMinutes(new Date(), 0), 7)}
                      // maxTime={setHours(setMinutes(new Date(), 0), 20)}
                      dateFormat="dd.MM.yyyy"

                      // onChange={date => setStartDate(date)}
                    />
                    <Button onClick={this.slobodniTermini}>
                      Pronadji termine
                    </Button>
                  </div>
                  <div>
                    <div>
                      <h5>Tip Pregleda:</h5>
                      <select
                        name="tipPregleda"
                        onChange={e => this.biranjeTipaPregleda(e)}
                      >
                        {this.izaberiVrstuPregleda()}
                      </select>

                    </div>
                  </div>
                  <div>
                    <h5>Ocena: </h5>
                    <Button value="9" onClick={e => this.podesiOcenuKlinike(e)}>
                      9+
                    </Button>
                    <Button value="8" onClick={e => this.podesiOcenuKlinike(e)}>
                      8+
                    </Button>
                    <Button value="7" onClick={e => this.podesiOcenuKlinike(e)}>
                      7+
                    </Button>
                    <Button value="6" onClick={e => this.podesiOcenuKlinike(e)}>
                      6+
                    </Button>
                    <Button value="5" onClick={e => this.podesiOcenuKlinike(e)}>
                      5+
                    </Button>
                  </div> */}
                      </div>
                    }
                  />

                  <Card
                    title="Izaberi kliniku za pregled"
                    content={
                      <form>
                        {/* <NavDropdown
                          onSelect={e => {
                            this.sortMyArray(e);
                          }}
                          title="Sortiraj"
                          id="nav-item dropdown"
                        >
                          <MenuItem eventKey={"id"}>id</MenuItem>
                          <MenuItem eventKey={"naziv"}>Naziv</MenuItem>
                          <MenuItem eventKey={"opis"}>Opis</MenuItem>
                          <MenuItem eventKey={"adresa"}>Adresa</MenuItem>
                          <MenuItem eventKey={"ocena"}>Ocena</MenuItem>
                        </NavDropdown> */}

                        <Card
                          // category="Here is a subtitle for this table"
                          ctTableFullWidth
                          ctTableResponsive
                          content={
                            <Table striped hover style={{ width: 800 }}>
                              <thead className="thead-dark">
                                <tr>
                                  <th></th>
                                  <th id="Naziv">
                                    Naziv
                                    <i
                                      onClick={e => {
                                        this.handleSortKlinika("nazivUp");
                                      }}
                                      style={{
                                        cursor: "pointer"
                                      }}
                                      className="pe-7s-angle-up"
                                    />
                                    <i
                                      onClick={e => {
                                        this.handleSortKlinika("nazivDown");
                                      }}
                                      style={{
                                        cursor: "pointer"
                                      }}
                                      className="pe-7s-angle-down"
                                    />
                                  </th>
                                  <th id="Adresa">
                                    {" "}
                                    Adresa
                                    <i
                                      onClick={e => {
                                        this.handleSortKlinika("adresaUp");
                                      }}
                                      style={{
                                        cursor: "pointer"
                                      }}
                                      className="pe-7s-angle-up"
                                    />
                                    <i
                                      onClick={e => {
                                        this.handleSortKlinika("adresaDown");
                                      }}
                                      style={{
                                        cursor: "pointer"
                                      }}
                                      className="pe-7s-angle-down"
                                    />
                                  </th>
                                  <th id="Opis">
                                    Opis
                                    <i
                                      onClick={e => {
                                        this.handleSortKlinika("opisUp");
                                      }}
                                      style={{
                                        cursor: "pointer"
                                      }}
                                      className="pe-7s-angle-up"
                                    />
                                    <i
                                      onClick={e => {
                                        this.handleSortKlinika("opisDown");
                                      }}
                                      style={{
                                        cursor: "pointer"
                                      }}
                                      className="pe-7s-angle-down"
                                    />
                                  </th>
                                  <th id="Ocena">
                                    Ocena
                                    <i
                                      onClick={e => {
                                        this.handleSortKlinika("ocenaUp");
                                      }}
                                      style={{
                                        cursor: "pointer"
                                      }}
                                      className="pe-7s-angle-up"
                                    />
                                    <i
                                      onClick={e => {
                                        this.handleSortKlinika("ocenaDown");
                                      }}
                                      style={{
                                        cursor: "pointer"
                                      }}
                                      className="pe-7s-angle-down"
                                    />
                                  </th>
                                </tr>
                              </thead>
                              <tbody>{this.listaKlinikaUKC()}</tbody>
                            </Table>
                          }
                        />
                        {this.redirectReferer}
                      </form>
                    }
                  />
                  <ButtonToolbar>
                    <Button
                      id="zakaziPregled"
                      fill
                      bsStyle="success"
                      onClick={e => {
                        this.odabranaKlinika(e);
                      }}
                      type="submit"
                    >
                      ZAKAZI PREGLED
                    </Button>
                  </ButtonToolbar>
                </Col>
                {/* <Col md={4}>
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

                      <div className="typo-line">
                        <h2>
                          <p className="category">Email: </p>
                          <label className="adresaKC">{email}</label>
                        </h2>
                      </div>
                      <div className="typo-line">
                        <h2>
                          <p className="category">LBO: </p>
                          <label className="opisKC">{lbo}</label>
                        </h2>
                      </div>
                    </div>
                  }
                />
              </Col> */}
              </Row>
            </Grid>
          </div>
        );
      }
      //ako lekar nije odabran
      else if (this.state.flag == 1) {
        return (
          <div className="content">
            <Grid fluid>
              <Row>
                <Col md={12}>
                  <Card
                    content={
                      <div>
                        <ButtonToolbar>
                          <Button
                            fill
                            bsStyle="info"
                            value="1"
                            onClick={e => this.clickPretragaL()}
                          >
                            Pretrazi
                          </Button>

                          <Button
                            fill
                            bsStyle="warning"
                            value="4"
                            onClick={e => this.clickOcenaL()}
                          >
                            Filtriraj po oceni
                          </Button>
                          <Button
                            fill
                            value="4"
                            onClick={e => this.ponistiFiltereL()}
                          >
                            <i className="pe-7s-close" />
                          </Button>
                        </ButtonToolbar>
                        <br></br>
                        <div>{this.prikazFilteraL()}</div>
                      </div>
                    }
                  />

                  <Card
                    title="Izaberi lekara za pregled"
                    // category="Here is a subtitle for this table"
                    ctTableFullWidth
                    ctTableResponsive
                    content={
                      <Table style={{ width: 800 }} striped hover>
                        <thead className="thead-dark">
                          <tr>
                            <th></th>
                            <th id="ime">
                              Ime
                              <i
                                onClick={e => {
                                  this.handleSortLekari("imeUp");
                                }}
                                style={{
                                  cursor: "pointer"
                                }}
                                className="pe-7s-angle-up"
                              />
                              <i
                                onClick={e => {
                                  this.handleSortLekari("imeDown");
                                }}
                                style={{
                                  cursor: "pointer"
                                }}
                                className="pe-7s-angle-down"
                              />
                            </th>
                            <th id="prezime">
                              {" "}
                              Prezime
                              <i
                                onClick={e => {
                                  this.handleSortLekari("prezimeUp");
                                }}
                                style={{
                                  cursor: "pointer"
                                }}
                                className="pe-7s-angle-up"
                              />
                              <i
                                onClick={e => {
                                  this.handleSortLekari("prezimeDown");
                                }}
                                style={{
                                  cursor: "pointer"
                                }}
                                className="pe-7s-angle-down"
                              />
                            </th>
                            <th id="ocena">
                              Ocena
                              <i
                                onClick={e => {
                                  this.handleSortLekari("ocenaUp");
                                }}
                                style={{
                                  cursor: "pointer"
                                }}
                                className="pe-7s-angle-up"
                              />
                              <i
                                onClick={e => {
                                  this.handleSortLekari("ocenaDown");
                                }}
                                style={{
                                  cursor: "pointer"
                                }}
                                className="pe-7s-angle-down"
                              />
                            </th>
                            <th></th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>{this.listaLekaraKlinike()}</tbody>
                      </Table>
                    }
                  />
                  {this.prethodno2}
                  {this.redirectReferer2}

                  <ButtonToolbar>
                    <Button
                      onClick={e => {
                        this.prethodno(e);
                      }}
                      type="submit"
                    >
                      PRETHODNO
                    </Button>
                    <Button
                      id="btnOdabranLekar"
                      onClick={e => this.odabranLekar(e)}
                      fill
                      bsStyle="success"
                      type="submit"
                    >
                      DALJE
                    </Button>
                  </ButtonToolbar>
                  <h5>
                    {this.state.formError != "" && (
                      <span className="errorMessage">
                        {this.state.formError}
                      </span>
                    )}
                  </h5>
                </Col>
                {/* <Col md={4}>
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

                      <div className="typo-line">
                        <h2>
                          <p className="category">Email: </p>
                          <label className="adresaKC">{email}</label>
                        </h2>
                      </div>
                      <div className="typo-line">
                        <h2>
                          <p className="category">LBO: </p>
                          <label className="opisKC">{lbo}</label>
                        </h2>
                      </div>
                    </div>
                  }
                />
              </Col> */}
              </Row>
            </Grid>
          </div>
        );
      }
      //odabrani su klinika i lekar
      else if (this.state.flag == 2) {
        return (
          <div className="content">
            <Grid fluid>
              <Row>
                <Col md={12}>
                  <Card
                    title="Detalji o zahtevu za zdravstveni pregled"
                    content={
                      <div>
                        <form>
                          <div>
                            <Card
                              // category="Here is a subtitle for this table"
                              ctTableFullWidth
                              ctTableResponsive
                              content={
                                <Table style={{ width: 800 }} striped hover>
                                  <thead className="thead-dark">
                                    <tr>
                                      <th id="id">Klinika</th>
                                      <th id="ime">Tip pregleda</th>
                                      <th id="prezime"> Lekar</th>
                                      <th id="ocena">Cena</th>
                                    </tr>
                                  </thead>
                                  <tbody>{this.pregledZahteva()}</tbody>
                                </Table>
                              }
                            />
                          </div>
                          {this.odustani2()}
                        </form>
                      </div>
                    }
                  />
                  <ButtonToolbar>
                    <Button onClick={this.odustani}>Odustani</Button>

                    <Button
                      id="potvrdiPregled"
                      type="submit"
                      fill
                      bsStyle="success"
                      onClick={e => this.slanjeZahtevaZaPregled(e)}
                    >
                      Potvrdi
                    </Button>
                  </ButtonToolbar>
                </Col>
              </Row>
            </Grid>
          </div>
        );
      }
    }
  }
}

export default ListaKlinika;
