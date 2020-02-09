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
import moment from "moment";

class ListaKlinika extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
      uloga: props.uloga,
      token: props.token,
      listaKlinika: [],
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
    console.log(this.state);
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

    console.log(this.state.flag);
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
        console.log("Preuzeta lista klinika: ");
        console.log(Response.data);
        this.setState({
          listaKlinika: Response.data,
          listaKlinikaPocetna: Response.data,
          nazivIzabraneKlinike: Response.data[0].naziv
        });
        console.log(this.state.listaKlinika);
      })

      .catch(error => {
        console.log("klinike nisu preuzete");
      });
    axios
      .get("http://localhost:8025/api/tipPregleda/all", config)
      .then(Response => {
        console.log("Preuzeta lista tipova pregleda: ");
        console.log(Response.data);
        this.setState({
          tipoviPregleda: Response.data,
          nazivOznacenogPregleda: Response.data[0].naziv
        });
        console.log(this.state.nazivOznacenogPregleda);
      })

      .catch(error => {
        console.log("klinike nisu preuzete");
      });
  }
  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
    console.log("On change !!!");
  };

  promenjenOdabirKlinike = e => {
    this.setState(
      {
        izabranaKlinika: e.currentTarget.value
      },
      () => console.log(this.state.izabranaKlinika)
    );
    if (e.currentTarget.value != 0 && e.currentTarget.value != undefined) {
      const lista = this.state.listaKlinika;
      for (var i = 0; i < lista.length; i++) {
        if (lista[i].id == e.currentTarget.value) {
          this.setState(
            {
              nazivIzabraneKlinike: lista[i].naziv
            },
            () => console.log(this.state)
          );
          break;
        }
      }
    }
    this.listaKlinikaUKC();
  };
  promenjenOdabirLekara = e => {
    console.log("promenjen odabir lekara");
    console.log(e.currentTarget.value);
    this.setState(
      {
        izabranLekar: e.currentTarget.value
      },
      () => console.log(this.state)
    );
    if (e.currentTarget.value != 0 && e.currentTarget.value != undefined) {
      const lista = this.state.listaLekara;
      for (var i = 0; i < lista.length; i++) {
        if (lista[i].id == e.currentTarget.value) {
          this.setState(
            {
              nazivIzabranogLekara: ""
            },
            () =>
              this.setState(
                {
                  nazivIzabranogLekara: lista[i].ime + " " + lista[i].prezime
                },
                () => console.log(this.state)
              )
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
      //   () => console.log(this.state)
      // );
    }
    this.listaLekaraKlinike();
  };
  vidiZaposlene = e =>{
    console.log("VIDI ZAPOSLENE" + e.currentTarget.value);
  }
  listaKlinikaUKC() {
    let res = [];
    console.log("lista kl");

    const pretraga = this.state.pretraziPoljeKlinika;
    const oc = this.state.ocenaKlinike;
    console.log(oc);
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
            <td><i className="pe-7s-id text-info" value={lista[i].id} onClick={(e)=>this.vidiZaposlene(e)}></i></td>
          </tr>
        );
      }
    } else {
      console.log("===========");
      console.log(pretraga);
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
                <td><i className="pe-7s-id text-info" value={lista[i].id} onClick={(e)=>this.vidiZaposlene(e)}></i></td>
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
    e.preventDefault(); 

    // console.log(e.target.value);

    var lekarid = e.target.value;
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
        console.log("Preuzeti termini lekara: ");
        console.log(Response.data);

        this.setState(
          {
            terminiIzabranogLekara: Response.data.sort((a, b) => {
              let startA = new Date(a.datumPocetka);
              startA.setHours(a.termin);

              let startB = new Date(b.datumPocetka);
              startB.setHours(b.termin);

              return new Date(startA).getTime() - new Date(startB).getTime();
            })
          },
          () => {
            console.log(this.state.terminiIzabranogLekara);
            console.log("TERMINI");
            var niz = [false, false, false, false];
            this.state.terminiIzabranogLekara.map(termin => {
              const dat = moment(this.state.datumZaPregled).format(
                "DD.MM.YYYY."
              );
              const datPoc = moment(termin.datumPocetka).format("DD.MM.YYYY.");
              // console.log(moment(termin.datumZaPregled).format("HH:mm"));
              console.log("******");

              console.log(datPoc + " " + termin.termin);
              console.log("******");
              if (dat.valueOf() === datPoc.valueOf()) {
                console.log("ISTI SU");
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
            this.setState(
              {
                prikazTerminaClick: true,
                lekarTerminClick: lekarid,
                terminiZaIzabraniDatum: niz,
                prikazaniTerminiLekara: lekarid
              },
              () => console.log(this.state)
            );
          }
        );
      })

      .catch(error => {
        console.log("Nisu preuzeti termini lekara");
      });
  }
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
    console.log(e.target.value);
    const termin = e.target.value;
    console.log("IF");
    this.setState(
      {
        izabranTermin: termin
      },
      () => {
        console.log(this.state.izabranTermin);
      }
    );
  };
  listaLekaraKlinike() {
    let res = [];
    console.log("lista lekara");

    const pretraga = this.state.pretraziPoljeLekara;
    const oc = this.state.ocenaLekara;
    console.log(oc);
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
            </td>
            <td>
            {this.state.lekarTerminClick == lista[i].id && (
              this.prikazTermina()
            )}
            </td>
          </tr>
        );
      }
    } else {
      console.log("===========");
      console.log(pretraga);
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
          console.log(oc);
          console.log(ocena);
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
    console.log("sort funkcija");
    console.log(sortBy);
    const lista = this.state.listaKlinika;
    if (sortBy === "nazivUp") {
      console.log("naziv");
      this.setState({
        listaKlinika: lista.sort((a, b) => a.naziv.localeCompare(b.naziv))
      });
    } else if (sortBy === "nazivDown") {
      console.log("naziv");
      this.setState({
        listaKlinika: lista.sort((b, a) => a.naziv.localeCompare(b.naziv))
      });
    } else if (sortBy === "opisUp") {
      console.log("opis");
      this.setState({
        listaKlinika: lista.sort((a, b) => a.opis.localeCompare(b.opis))
      });
    } else if (sortBy === "opisDown") {
      console.log("opis");
      this.setState({
        listaKlinika: lista.sort((b, a) => a.opis.localeCompare(b.opis))
      });
    } else if (sortBy === "adresaUp") {
      console.log("adresa");
      this.setState({
        listaKlinika: lista.sort((a, b) => a.adresa.localeCompare(b.adresa))
      });
    } else if (sortBy === "adresaDown") {
      console.log("adresa");
      this.setState({
        listaKlinika: lista.sort((b, a) => a.adresa.localeCompare(b.adresa))
      });
    } else if (sortBy === "ocenaUp") {
      console.log("ocena");

      this.setState({
        listaKlinika: lista.sort((a, b) => a.ocena - b.ocena)
      });
    } else if (sortBy === "ocenaDown") {
      console.log("ocena");

      this.setState({
        listaKlinika: lista.sort((a, b) => b.ocena - a.ocena)
      });
    }
  }
  handleSortLekari(sortBy) {
    console.log("sort funkcija");
    console.log(sortBy);
    const lista = this.state.listaLekara;
    if (sortBy === "imeUp") {
      console.log("ime");
      this.setState({
        listaLekara: lista.sort((a, b) => a.ime.localeCompare(b.ime))
      });
    } else if (sortBy === "imeDown") {
      console.log("ime");
      this.setState({
        listaLekara: lista.sort((b, a) => a.ime.localeCompare(b.ime))
      });
    } else if (sortBy === "prezimeUp") {
      console.log("prezime");
      this.setState({
        listaLekara: lista.sort((a, b) => a.prezime.localeCompare(b.prezime))
      });
    } else if (sortBy === "prezimeDown") {
      console.log("prezime");
      this.setState({
        listaLekara: lista.sort((b, a) => a.prezime.localeCompare(b.prezime))
      });
    } else if (sortBy === "ocenaUp") {
      console.log("ocena");

      this.setState({
        listaLekara: lista.sort((a, b) => a.ocena - b.ocena)
      });
    } else if (sortBy === "ocenaDown") {
      console.log("ocena");

      this.setState({
        listaLekara: lista.sort((a, b) => b.ocena - a.ocena)
      });
    }
  }
  sortMyArrayLekari(sortBy) {
    console.log("sort funkcija");
    console.log(sortBy);
    const lista = this.state.listaLekara;
    if (sortBy === "ime") {
      console.log("ime");
      this.setState({
        listaKlinika: lista.sort((a, b) => a.ime.localeCompare(b.ime))
      });
    } else if (sortBy === "prezime") {
      console.log("prezime");
      this.setState({
        listaKlinika: lista.sort((a, b) => a.prezime.localeCompare(b.prezime))
      });
    } else if (sortBy === "ocena") {
      console.log("ocena");

      this.setState({
        listaKlinika: lista.sort((a, b) => b.ocena - a.ocena)
      });
    }
  }
  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;

    this.setState({ [name]: value }, () => console.log(this.state));
  };
  handleChangeDate = date => {
    console.log(date);
    this.setState(
      {
        datumZaPregled: date
      },
      () => {
        console.log(this.state);

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
            console.log("Preuzeta lista klinika: ");
            console.log(Response.data);
            this.setState({
              listaKlinika: Response.data
            });
          })

          .catch(error => {
            console.log("klinike nisu preuzete");
          });
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
    console.log(this.state.ocenaKlinike);
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
    console.log(this.state.ocenaLekara);
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
        console.log("Preuzeta lista lekara: ");
        console.log(Response.data);
        this.setState({
          listaLekara: Response.data,
          listaLekaraPocetna: Response.data,
          nazivIzabranogLekara:
            Response.data[0].ime + " " + Response.data[0].prezime,
          redirectNext: true,
          flag: 1
        });
        console.log(this.state.listaLekara);
      })

      .catch(error => {
        console.log("lekari nisu preuzete");
      });
    // this.setState({

    // });
  };
  odabranLekar = e => {
    //treba redirektovati na pregled zahteva za pregled
    e.preventDefault();
    console.log(this.state.izabranLekar);
    console.log(this.state.flag);
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
      console.log(this.state.back);

      // if (this.state.back == false) {
      this.setState(
        {
          formError: porukaErr
        },
        () => console.log(this.state.formError)
      );
      // }
    }
  };
  redirectReferer() {
    console.log("REDIRECT REFF");
    var flag = 1;
    console.log(this.state.izabranaKlinika);

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
    //     console.log("Preuzeta lista lekara: ");
    //     console.log(Response.data);
    //     this.setState({
    //       listaLekara: Response.data
    //     });
    //     console.log(this.state.listaLekara);
    //   })

    //   .catch(error => {
    //     console.log("lekari nisu preuzete");
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
    console.log("prosledjen pregled");
    console.log(tip.target.value);
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
        console.log("--------------------");
        console.log(Response.data);
        var filtrirane = Response.data;
        var listaFK = [];
        var lista = this.state.listaKlinika;
        for (var i = 0; i < this.state.listaKlinika; i++) {
          if (filtrirane.some(item => lista[i].id === item.id)) {
            listaFK.concat(lista[i]);
            console.log(lista[i].id);
            console.log("*********");
          }
        }
        console.log("--------------------");
        this.setState(
          {
            listaKlinika: listaFK,
            oznaceniTipPregleda: tip.target.value
          },
          () => {
            console.log("--------------------");
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

      .catch(error => {
        console.log("klinike nisu preuzete");
      });
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
    console.log("slanje zahteva....");
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
        console.log("PREGLED");
        console.log(response);

        this.setState(
          {
            uspesnoPoslatZahtev: true
          },
          () => this.props.handleClick("ZAHTEV JE POSLAT")
        );
      })
      .catch(error => {
        console.log("greska pregled");
        console.log(error.response);
      });
  };
  prethodno = e => {
    e.preventDefault();
    console.log("vrati se");
    var flag = 0;
    this.setState(
      {
        back: true,
        flag: 0,
        prikazTerminaClick: false,
        izabraniLekar: 0
      },
      () => console.log(this.state.back)
    );
  };
  prethodno2() {
    var flag = 0;
    console.log("prethodno 2");
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
    console.log(this.state.odabranFilter);
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
    console.log(this.state.odabranFilter);
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
    console.log("odustani od pregleda");
    this.setState({
      quit: true
    });
  };
  odustani2 = () => {
    console.log("odustani 2");
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
    console.log("ponistavanje filtera");
    this.setState({
      listaKlinika: this.state.listaKlinikaPocetna,
      odabranFilter: "",
      ocenaKlinike: 0,
      pretraziPoljeKlinika: ""
    });
  }
  ponistiFiltereL() {
    console.log("ponistavanje filtera");
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
    console.log(this.state.flag);
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
