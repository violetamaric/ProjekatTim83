import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";
import { NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Form } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

// import "izmenaProfila.css";

//dodam link za sliku  mozda od doktora!!
// import avatar from "assets/img/faces/face-3.jpg";

import { log } from "util";
import slikaPacijent from "assets/img/pacijentImage.jpg";
import axios from "axios";
import moment from "moment";

class BrzoZakazivanje extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
      uloga: props.uloga,
      token: props.token,
      listaPregleda: [],
      pretraziPoljeKlinika: "",
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
      izabraniTermin: 0,
      izabranaSala: 0,
      canClick: false
    };
    this.redirectReferer = this.redirectReferer.bind(this);
    this.sortMyArray = this.sortMyArray.bind(this);
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
    // axios
    //   .get(url, config)
    //   .then(Response => {
    //
    //
    //   })
    //   .catch(error => {
    //
    //   });
    const url = "http://localhost:8025/api/ST/unapredDef";
    const config = {
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
            listaPregleda: Response.data.sort((a, b) => {
              let startA = new Date(a.datum);
              startA.setHours(a.termin);

              let startB = new Date(b.datum);
              startB.setHours(b.termin);

              return new Date(startA).getTime() - new Date(startB).getTime();
            })
          },
          () => {
            // this.setState({
            //   lekarID: listaPregleda[0].lekar,
            //   klinikaID: Response.data,
            //   tipPregledaID: this.state.izabraniTipPregleda,
            //   pacijentEmail: this.state.email,
            //   cena: this.state.izabranaCena,
            //   datum: this.state.izabraniDatum,
            //   termin: t
            // })
          }
        );
      })

      .catch(error => {});
  }
  handleSortKlinika(sortBy) {
    const lista = this.state.listaPregleda;
    if (sortBy === "datumUp") {
      this.setState({
        listaPregleda: lista.sort((a, b) => {
          let startA = new Date(a.datum);
          startA.setHours(a.termin);

          let startB = new Date(b.datum);
          startB.setHours(b.termin);

          return new Date(startA).getTime() - new Date(startB).getTime();
        })
      });
    } else if (sortBy === "datumDown") {
      this.setState({
        listaPregleda: lista.sort((b, a) => {
          this.setState({
            pregledi: lista.sort((b, a) => {
              let startA = new Date(a.datum);
              startA.setHours(a.termin);

              let startB = new Date(b.datum);
              startB.setHours(b.termin);

              return new Date(startA).getTime() - new Date(startB).getTime();
            })
          });
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
          izabraniTipPregleda: lista[i].tipPregledaID,
          izabraniTermin: lista[i].termin,
          izabranaSala: lista[i].salaID

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
            termin: this.state.izabraniTermin,
            salaID: this.state.izabranaSala
          },
          config
        )
        .then(response => {
          this.setState(
            {
              redirectNext: true,
              flag: 1,
              canClick: true
            },
            () => {
              this.props.handleClick("ZAHTEV JE POSLAT");
            }
          );
        });
    } else {
      this.setState({
        formError: "Odaberite Pregled"
      });
    }
  };
  listaUnapredDefinisanihPregleda() {
    let res = [];

    const pretraga = this.state.pretraziPoljeKlinika;
    // const oc = this.state.ocenaKlinike;
    //
    // if ((pretraga == "" || pretraga == undefined) && oc < 5) {
    let lista = this.state.listaPregleda;

    if (pretraga == "" || pretraga == undefined) {
      for (var i = 0; i < lista.length; i++) {
        const id2 = "odabranPregled" + i;
        res.push(
          <tr key={i}>
            <td>
              <input
                id={id2}
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
              {moment(lista[i].datum).format("DD.MM.YYYY.")} {lista[i].termin}h
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
    } else {
      for (var i = 0; i < lista.length; i++) {
        if (lista[i].klinikaN.toLowerCase().includes(pretraga.toLowerCase())) {
          const id2 = "odabranPregled" + i;
          res.push(
            <tr key={i}>
              <td>
                <input
                  id={id2}
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
                {moment(lista[i].datum).format("DD.MM.YYYY.")} {lista[i].termin}
                h
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
  redirectReferer() {
    var flag = 1;
    if (this.state.redirectNext == true) {
      return (
        <Route
          path="/registration"
          render={props => (
            <BrzoZakazivanje
              {...props}
              flag={flag}
              izabranPregled={this.state.izabranaKlinika}
            />
          )}
        >
          <Redirect from="/" to="/pacijent/brzoZakazivanje" />
        </Route>
      );
    }
  }

  render() {
    const email = this.state.email;
    const uloga = this.state.uloga;
    if (this.state.flag == 0) {
      return (
        <div className="content">
          <Grid fluid>
            <Row>
              <Col md={12}>
                <div>
                  <h5>
                    <input
                      placeholder="Pretrazi po klinikama"
                      type="text"
                      aria-label="Search"
                      name="pretraziPoljeKlinika"
                      onChange={this.handleChange}
                      value={this.state.pretraziPoljeKlinika}
                    />
                  </h5>
                </div>
                <Card
                  ctTableFullWidth
                  ctTableResponsive
                  title="Izaberi pregled"
                  content={
                    <div>
                      {/* <NavDropdown
                        onSelect={e => {
                          this.sortMyArray(e);
                        }}
                        title="Sortiraj"
                        id="nav-item dropdown"
                      >

                        <MenuItem eventKey={"tipPregleda"}>
                          Tip pregleda
                        </MenuItem>
                        <MenuItem eventKey={"klinika"}>Klinika</MenuItem>
                        <MenuItem eventKey={"lekarI"}>Lekar Ime</MenuItem>
                        <MenuItem eventKey={"lekarP"}>Lekar Prezime</MenuItem>
                        <MenuItem eventKey={"cenar"}>Cena rastuce</MenuItem>
                        <MenuItem eventKey={"cenao"}>Cena opadajuce</MenuItem>
                        <MenuItem eventKey={"popustr"}>Popust rastuce</MenuItem>
                        <MenuItem eventKey={"popusto"}>
                          Popust opadajuce
                        </MenuItem>
                      </NavDropdown> */}

                      <Table striped responsive hover style={{ width: 800 }}>
                        <thead className="thead-dark">
                          <tr>
                            <th></th>
                            <th id="Datum">
                              Datum
                              <i
                                onClick={e => {
                                  this.handleSortKlinika("datumUp");
                                }}
                                style={{
                                  cursor: "pointer"
                                }}
                                className="pe-7s-angle-up"
                              />
                              <i
                                onClick={e => {
                                  this.handleSortKlinika("datumDown");
                                }}
                                style={{
                                  cursor: "pointer"
                                }}
                                className="pe-7s-angle-down"
                              />
                            </th>
                            <th id="Tip pregleda">
                              {" "}
                              Tip pregleda
                              <i
                                onClick={e => {
                                  this.handleSortKlinika("tipPregledaUp");
                                }}
                                style={{
                                  cursor: "pointer"
                                }}
                                className="pe-7s-angle-up"
                              />
                              <i
                                onClick={e => {
                                  this.handleSortKlinika("tipPregledaDown");
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
                                  this.handleSortKlinika("klinikaUp");
                                }}
                                style={{
                                  cursor: "pointer"
                                }}
                                className="pe-7s-angle-up"
                              />
                              <i
                                onClick={e => {
                                  this.handleSortKlinika("klinikaDown");
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
                                  this.handleSortKlinika("lekarUp");
                                }}
                                style={{
                                  cursor: "pointer"
                                }}
                                className="pe-7s-angle-up"
                              />
                              <i
                                onClick={e => {
                                  this.handleSortKlinika("lekarDown");
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
                                  this.handleSortKlinika("cenaUp");
                                }}
                                style={{
                                  cursor: "pointer"
                                }}
                                className="pe-7s-angle-up"
                              />
                              <i
                                onClick={e => {
                                  this.handleSortKlinika("cenaDown");
                                }}
                                style={{
                                  cursor: "pointer"
                                }}
                                className="pe-7s-angle-down"
                              />
                            </th>
                            <th id="Popust">
                              Popust
                              <i
                                onClick={e => {
                                  this.handleSortKlinika("popustUp");
                                }}
                                style={{
                                  cursor: "pointer"
                                }}
                                className="pe-7s-angle-up"
                              />
                              <i
                                onClick={e => {
                                  this.handleSortKlinika("popustDown");
                                }}
                                style={{
                                  cursor: "pointer"
                                }}
                                className="pe-7s-angle-down"
                              />
                            </th>
                          </tr>
                        </thead>
                        <tbody>{this.listaUnapredDefinisanihPregleda()}</tbody>
                      </Table>

                      {this.redirectReferer}
                    </div>
                  }
                />
                <form
                  onSubmit={e => {
                    this.odabranPrelged(e);
                  }}
                >
                  <Button
                    id="potvrdiPregled"
                    type="submit"
                    bsStyle="success"
                    // onClick={
                    //   this.state.canClick
                    //     ? this.props.handleClick("Zahtev je poslat!")
                    //     : null
                    // }
                  >
                    Zakazi
                  </Button>
                  <h5>
                    {(this.state.izabranPregled == undefined ||
                      this.state.izabranPregled == 0) && (
                      <span className="errorMessage">
                        {this.state.formError}
                      </span>
                    )}
                  </h5>
                </form>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    } else if (this.state.flag == 1) {
      return <Redirect from="/" to="/pacijent/pocetnaStranica" />;
    }
    //   return (
    //     <div className="content">
    //       <Grid fluid>
    //         <Row>
    //           <Col md={10}>
    //             <Card
    //               title="Zahtev za pregled je uspesno poslat!"
    //               content={
    //                 <h3 className="successMessage">
    //                   Potvrdite zahtev za pregled preko E-maila!
    //                 </h3>
    //               }
    //             />
    //           </Col>
    //         </Row>
    //       </Grid>
    //     </div>
    //   );
    // }
  }
}

export default BrzoZakazivanje;
