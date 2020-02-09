import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import axios from "axios";
import moment from "moment";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

class PregledKlinika extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
      uloga: props.uloga,
      token: props.token,
      listaKlinika: [],
      listaLekara: [],
      redirectNext: false,
      flag: 0,
      izabranPregled: 0,
      formError: "",
      izabraniLekar: 0,
      izabranaKlinika: 0,
      izabraniDatum: new Date(),
      izabraniTipPregleda: 0,
      izabranaCena: 0,
      izabraniPopust: 0,
      canClick: false
    };
    // this.redirectReferer = this.redirectReferer.bind(this);
    this.sortMyArray = this.sortMyArray.bind(this);
    this.handlePrikaziZaposlene = this.handlePrikaziZaposlene.bind(this);
  }
  sortMyArray(sortBy) {
    const lista = this.state.listaPregleda;
    if (sortBy === "klinika") {
      this.setState({
        listaPregleda: lista.sort((a, b) =>
          a.klinikaN.localeCompare(b.klinikaN)
        )
      });
    } else if (sortBy === "lekarI") {
      this.setState({
        listaPregleda: lista.sort((a, b) =>
          a.lekarIme.localeCompare(b.lekarIme)
        )
      });
    } else if (sortBy === "lekarP") {
      this.setState({
        listaPregleda: lista.sort((a, b) =>
          a.lekarPrezime.localeCompare(b.lekarPrezime)
        )
      });
    } else if (sortBy === "cenar") {
      this.setState({
        listaPregleda: lista.sort((a, b) => a.cena - b.cena)
      });
    } else if (sortBy === "cenao") {
      this.setState({
        listaPregleda: lista.sort((a, b) => b.cena - a.cena)
      });
    } else if (sortBy === "popustr") {
      this.setState({
        listaPregleda: lista.sort((a, b) => a.popust - b.popust)
      });
    } else if (sortBy === "popusto") {
      this.setState({
        listaPregleda: lista.sort((a, b) => b.popust - a.popust)
      });
    } else if (sortBy === "tipPregleda") {
      this.setState({
        listaPregleda: lista.sort((a, b) =>
          a.tipPregledaN.localeCompare(b.tipPregledaN)
        )
      });
    }
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
          listaKlinika: Response.data
        });
      })

      .catch(error => {});
  }
  handleSortKlinika(sortBy) {
    const lista = this.state.listaPregleda;
    if (sortBy === "datumUp") {
      this.setState({
        listaPregleda: lista.sort((a, b) => {
          return new Date(a.datum).getTime() - new Date(b.datum).getTime();
        })
      });
    } else if (sortBy === "datumDown") {
      this.setState({
        listaPregleda: lista.sort((b, a) => {
          return new Date(a.datum).getTime() - new Date(b.datum).getTime();
        })
      });
    } else if (sortBy === "tipPregledaUp") {
      this.setState({
        listaPregleda: lista.sort((a, b) =>
          a.tipPregledaN.localeCompare(b.tipPregledaN)
        )
      });
    } else if (sortBy === "tipPregledaDown") {
      this.setState({
        listaPregleda: lista.sort((b, a) =>
          a.tipPregledaN.localeCompare(b.tipPregledaN)
        )
      });
    } else if (sortBy === "klinikaUp") {
      this.setState({
        listaPregleda: lista.sort((a, b) =>
          a.klinikaN.localeCompare(b.klinikaN)
        )
      });
    } else if (sortBy === "klinikaDown") {
      this.setState({
        listaPregleda: lista.sort((b, a) =>
          a.klinikaN.localeCompare(b.klinikaN)
        )
      });
    } else if (sortBy === "lekarUp") {
      this.setState({
        listaPregleda: lista.sort((a, b) =>
          a.lekarIme.localeCompare(b.lekarIme)
        )
      });
    } else if (sortBy === "lekarDown") {
      this.setState({
        listaPregleda: lista.sort((b, a) =>
          a.lekarIme.localeCompare(b.lekarIme)
        )
      });
    } else if (sortBy === "cenaUp") {
      this.setState({
        listaPregleda: lista.sort((a, b) => a.cena - b.cena)
      });
    } else if (sortBy === "cenaDown") {
      this.setState({
        listaPregleda: lista.sort((a, b) => b.cena - a.cena)
      });
    } else if (sortBy === "popustUp") {
      this.setState({
        listaPregleda: lista.sort((a, b) => a.popust - b.popust)
      });
    } else if (sortBy === "popustDown") {
      this.setState({
        listaPregleda: lista.sort((a, b) => b.popust - a.popust)
      });
    }
  }
  promenjenOdabirPregleda = e => {
    const lista = this.state.listaPregleda;
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id == e.currentTarget.value) {
        this.setState({
          izabranPregled: e.currentTarget.value,
          izabraniLekar: lista[i].lekarID,
          izabranaKlinika: lista[i].klinikaID,
          izabraniDatum: lista[i].datum,
          izabranaCena: lista[i].cena,
          izabraniTipPregleda: lista[i].tipPregledaID

          // izabraniPopust:lista[i].popust
        });
      }
    }
  };
  odabranPrelged = e => {
    //treba redirektovati na pretragu i filtriranje lekara
    e.preventDefault();

    const ol = this.state.izabranPregled;
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    if (ol != 0 && ol != undefined) {
      axios

        .post(
          "http://localhost:8025/api/pregledi/newST",
          {
            lekarID: this.state.izabraniLekar,
            klinikaID: this.state.izabranaKlinika,
            tipPregledaID: this.state.izabraniTipPregleda,
            pacijentEmail: this.state.email,
            cena: this.state.izabranaCena,
            datum: this.state.izabraniDatum,
            canClick: true
          },
          config
        )
        .then(response => {
          this.setState({
            redirectNext: true,
            flag: 1
          });
        })
        .catch(error => {});
    } else {
      this.setState({
        formError: "Odaberite Pregled"
      });
    }
  };
  listaUnapredDefinisanihPregleda() {
    let res = [];

    // const pretraga = this.state.pretraziPoljeKlinika;
    // const oc = this.state.ocenaKlinike;
    //
    // if ((pretraga == "" || pretraga == undefined) && oc < 5) {
    let lista = this.state.listaPregleda;

    for (var i = 0; i < lista.length; i++) {
      res.push(
        <tr key={i}>
          <td>
            <input
              name="odabranPregled"
              type="radio"
              value={lista[i].id}
              checked={this.state.izabranPregled == lista[i].id}
              onChange={e => {
                this.promenjenOdabirPregleda(e);
              }}
            ></input>
          </td>

          <td key={lista[i].datum}>
            {moment(lista[i].datum).format("DD.MM.YYYY HH:mm")}
          </td>
          <td key={lista[i].tipPregledaId}>{lista[i].tipPregledaN}</td>
          <td key={lista[i].klinikaId}>{lista[i].klinikaN}</td>
          <td key={lista[i].lekarId}>
            {lista[i].lekarIme} {lista[i].lekarPrezime}
          </td>

          <td key={lista[i].cena}>{lista[i].cena} RSD</td>
          <td key={lista[i].popust}>{lista[i].popust}%</td>
        </tr>
      );
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
    //       }
    //     }
    //   }
    // }

    return res;
  }
  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };
  handlePrikaziZaposlene = kl => {
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    axios
      .get("http://localhost:8025/api/klinike/listaLekaraKlinika/" + kl, config)
      .then(Response => {
        this.setState({
          listaLekara: Response.data
        });
      })

      .catch(error => {});
  };
  // handleSumbit = e => {
  //   e.preventDefault();
  //
  //   // let formErrors = { ...this.state.formErrors };
  //
  //
  //
  //   axios
  //     .put("http://localhost:8025/api/pacijenti/update", {
  //       ime: this.state.ime,
  //       prezime: this.state.prezime,
  //       telefon: this.state.telefon,
  //       email: this.state.email,
  //       adresa: this.state.adresa,
  //       grad: this.state.grad,
  //       drzava: this.state.drzava,
  //       lbo: this.state.lbo
  //     })
  //     .then(response => {
  //

  //       this.setState({
  //         ime: response.data.ime
  //       });

  //       this.setState({
  //         prezime: response.data.prezime
  //       });

  //       this.setState({
  //         telefon: response.data.telefon,
  //         adresa: response.data.adresa,
  //         grad: response.data.grad,
  //         drzava: response.data.drzava,
  //         lbo: response.data.lbo
  //       });

  //       // this.setState({
  //       //   redirectToReferrer: true
  //       // });
  //     })
  //     .catch(error => {
  //
  //     });
  // };
  //   redirectReferer() {
  //     var flag = 1;
  //     if (this.state.redirectNext == true) {
  //       return (
  //         <Route
  //           path="/registration"
  //           render={props => (
  //             <BrzoZakazivanje
  //               {...props}
  //               flag={flag}
  //               izabranPregled={this.state.izabranaKlinika}
  //             />
  //           )}
  //         >
  //           <Redirect from="/" to="/admin/klinikePacijenta" />
  //         </Route>
  //       );
  //     }
  //   }

  render() {
    const email = this.state.email;
    const uloga = this.state.uloga;
    const prikaziZaposlene = (
      <Tooltip id="zaposleni_tooltip">Prikazi Zaposlene</Tooltip>
    );

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <div>
                {this.state.listaKlinika.map(klinika => {
                  return (
                    <Card
                      title={klinika.naziv}
                      content={
                        <div>
                          <Grid fluid>
                            <Row>
                              <Col md={8}>
                                <h5>Adresa: {klinika.adresa}</h5>
                              </Col>
                              <Col md={4}>
                                <h5>Ocena: {klinika.ocena}</h5>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={prikaziZaposlene}
                                >
                                  <i
                                    value={klinika.id}
                                    onClick={() =>
                                      this.handlePrikaziZaposlene(klinika.id)
                                    }
                                    className="pe-7s-id text-info"
                                  ></i>
                                </OverlayTrigger>
                              </Col>
                            </Row>
                          </Grid>
                        </div>
                      }
                    />
                  );
                })}
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default PregledKlinika;
