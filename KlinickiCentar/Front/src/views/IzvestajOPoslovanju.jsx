import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";
// import {
//   dataPie,
//   legendPie,
//   dataSales,
//   optionsSales,
//   responsiveSales,
//   legendSales,
//   dataBar,
//   optionsBar,
//   responsiveBar,
//   legendBar
// } from "variables/Variables.jsx";
import { ButtonToolbar } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Form } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import ChartistGraph from "react-chartist";

// import "izmenaProfila.css";

//dodam link za sliku  mozda od doktora!!
// import avatar from "assets/img/faces/face-3.jpg";

import { log } from "util";
import slikaPacijent from "assets/img/pacijentImage.jpg";
import axios from "axios";
import moment from "moment";

class IzvestajOPoslovanju extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
      uloga: props.uloga,
      token: props.token,
      listaPregleda: [],
      redirectPrihodi: false,
      redirectGrafik: false,
      izabranPregled: 0,
      formError: "",
      izabraniLekar: 0,
      izabranaKlinika: 0,
      izabraniDatum: new Date(),
      izabraniTipPregleda: 0,
      izabranaCena: 0,
      izabraniPopust: 0,
      canClick: false,
      listaLekara: [],
      klinikaNaziv: "",
      klinikaOcena: 0,
      klinikaID: 0,
      flag: 0,
      nedeljniPrihod: 0,
      mesecniPrihod: 0,
      godisnjiPrihod: 0,
      dataSalesMesecniNivoL: [],
      dataSalesMesecniNivoS: [[]],
      dataSalesNedeljniNivoL: [],
      dataSalesNedeljniNivoS: [[]],
      dataSalesDnevniNivoL: [],
      dataSalesDnevniNivoS: [[]]
    };
    this.redirectReferer = this.redirectReferer.bind(this);
    this.sortMyArray = this.sortMyArray.bind(this);
    this.prikaziGrafik = this.prikaziGrafik.bind(this);
    this.prikaziPrihode = this.prikaziPrihode.bind(this);
  }
  sortMyArray(sortBy) {
    console.log("sort funkcija");
    console.log(sortBy);
    const lista = this.state.listaPregleda;
    if (sortBy === "klinika") {
      console.log("klinika");
      this.setState({
        listaPregleda: lista.sort((a, b) =>
          a.klinikaN.localeCompare(b.klinikaN)
        )
      });
    } else if (sortBy === "lekarI") {
      console.log("lekarI");
      this.setState({
        listaPregleda: lista.sort((a, b) =>
          a.lekarIme.localeCompare(b.lekarIme)
        )
      });
    } else if (sortBy === "lekarP") {
      console.log("lekarP");
      this.setState({
        listaPregleda: lista.sort((a, b) =>
          a.lekarPrezime.localeCompare(b.lekarPrezime)
        )
      });
    } else if (sortBy === "cenar") {
      console.log("cenar");

      this.setState({
        listaPregleda: lista.sort((a, b) => a.cena - b.cena)
      });
    } else if (sortBy === "cenao") {
      console.log("cenao");

      this.setState({
        listaPregleda: lista.sort((a, b) => b.cena - a.cena)
      });
    } else if (sortBy === "popustr") {
      console.log("popustr");

      this.setState({
        listaPregleda: lista.sort((a, b) => a.popust - b.popust)
      });
    } else if (sortBy === "popusto") {
      console.log("popusto");

      this.setState({
        listaPregleda: lista.sort((a, b) => b.popust - a.popust)
      });
    } else if (sortBy === "tipPregleda") {
      console.log("tipPregleda");

      this.setState({
        listaPregleda: lista.sort((a, b) =>
          a.tipPregledaN.localeCompare(b.tipPregledaN)
        )
      });
    }
  }
  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }
  componentWillMount() {
    const url = "http://localhost:8025/api/adminKlinike/getAdminKlinikeByEmail";
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };

    var klinikaID = 0;
    var listaLekara = [];
    var klinikaNaziv = "";
    var klinikaOcena = "";
    var nedeljniPrihod = 0;
    var mesecniPrihod = 0;
    var godisnjiPrihod = 0;

    axios
      .get(url, config)
      .then(Response => {
        klinikaID = Response.data.idKlinike;
        this.setState(
          {
            klinikaID: Response.data.idKlinike
          },
          () => {
            console.log(this.state);
          }
        );
        console.log(klinikaID);
        console.log("lekariklinike");
        console.log(klinikaID);
        axios
          .get(
            "http://localhost:8025/api/klinike/listaLekaraKlinika/" + klinikaID,
            config
          )
          .then(Response => {
            this.setState(
              {
                listaLekara: Response.data.sort((b, a) => a.ocena - b.ocena)
              },
              () => {
                console.log(this.state);
              }
            );
            listaLekara = Response.data;
            console.log(listaLekara);
          })
          .catch(error => {
            console.log("lista lekara nije preuzeta");
          });
        axios
          .get("http://localhost:8025/api/klinike/" + klinikaID, config)
          .then(Response => {
            klinikaNaziv = Response.data.naziv;
            klinikaOcena = Response.data.ocena;
            this.setState(
              {
                klinikaNaziv: Response.data.naziv,
                klinikaOcena: Response.data.ocena
              },
              () => {
                console.log(this.state);
              }
            );
          })
          .catch(error => {
            console.log("klinika nije preuzeta");
          });
        axios
          .get(
            "http://localhost:8025/api/klinike/nedeljniPrihodi/" + klinikaID,
            config
          )
          .then(Response => {
            nedeljniPrihod = Response.data;
            console.log(nedeljniPrihod);
            this.setState(
              {
                nedeljniPrihod: Response.data
              },
              () => {
                console.log(this.state);
              }
            );
          })
          .catch(error => {
            console.log("nedeljniPrihodi nisu preuzeti");
          });
        axios
          .get(
            "http://localhost:8025/api/klinike/mesecniPrihodi/" + klinikaID,
            config
          )
          .then(Response => {
            mesecniPrihod = Response.data;
            console.log(mesecniPrihod);
            this.setState(
              {
                mesecniPrihod: Response.data
              },
              () => {
                console.log(this.state);
              }
            );
          })
          .catch(error => {
            console.log("mesecniPrihodi nisu preuzeti");
          });
        axios
          .get(
            "http://localhost:8025/api/klinike/godisnjiPrihodi/" + klinikaID,
            config
          )
          .then(Response => {
            godisnjiPrihod = Response.data;
            console.log(godisnjiPrihod);
            this.setState(
              {
                godisnjiPrihod: Response.data
              },
              () => {
                console.log(this.state);
              }
            );
          })
          .catch(error => {
            console.log("godisnjiPrihodi nisu preuzeti");
          });
        axios
          .get(
            "http://localhost:8025/api/klinike/godisnjiPrihodi/" + klinikaID,
            config
          )
          .then(Response => {
            godisnjiPrihod = Response.data;
            console.log(godisnjiPrihod);
            this.setState(
              {
                godisnjiPrihod: Response.data
              },
              () => {
                console.log(this.state);
              }
            );
          })
          .catch(error => {
            console.log("godisnjiPrihodi nisu preuzeti");
          });
        axios
          .get(
            "http://localhost:8025/api/klinike/dnevniNivo/" + klinikaID,
            config
          )
          .then(Response => {
            console.log("DNEVNI NIVO");
            console.log(Response.data);

            var dnevni = [];
            var series = [];
            Object.entries(Response.data).sort(([a], [b]) =>  a - b).map(([key, value]) => {
              dnevni = dnevni.concat(key);
              series = series.concat(value);
              // dnevni = dnevni.sort((a, b) => a - b);
            });
            this.setState(
              {
                dataSalesDnevniNivoL: dnevni,
                dataSalesDnevniNivoS: series
              },
              () => {
                console.log(this.state);
              }
            );
          })
          .catch(error => {
            console.log("godisnjiPrihodi nisu preuzeti");
          });
        axios
          .get(
            "http://localhost:8025/api/klinike/nedeljniNivo/" + klinikaID,
            config
          )
          .then(Response => {
            console.log("NEDELJNI NIVO");
            console.log(Response.data);
            // var podaci = Response.data.sort((a, b) => {
            //   return (
            //     new Date(Response.data[0]).getTime() -
            //     new Date(Response.data[0]).getTime()
            //   );
            // });
            var nedeljni = [];
            var series = [];
            Object.entries(Response.data).sort(([a], [b]) =>  new Date(a).getTime() - new Date(b).getTime()).map(([key, value]) => {
              nedeljni = nedeljni.concat(moment(key).format("DD.MM."));
              series = series.concat(value);
              // nedeljni = nedeljni.sort((a, b) => {
              //   return new Date(a).getTime() - new Date(b).getTime();
              // });
            });
            this.setState(
              {
                dataSalesNedeljniNivoL: nedeljni,
                dataSalesNedeljniNivoS: series
              },
              () => {
                console.log(this.state);
              }
            );
          })
          .catch(error => {
            console.log("godisnjiPrihodi nisu preuzeti");
          });
        axios
          .get(
            "http://localhost:8025/api/klinike/mesecniNivo/" + klinikaID,
            config
          )
          .then(Response => {
            console.log("MESECNI NIVO");
            console.log(Response.data);
            var mesecni = [];
            var series = [];
            Object.entries(Response.data).sort(([a], [b]) =>  new Date(a).getTime() - new Date(b).getTime()).map(([key, value]) => {
              mesecni = mesecni.concat(moment(key).format("DD.MM."));
              series = series.concat(value);
              // mesecni = mesecni.sort((a, b) => {
              //   return new Date(a).getTime() - new Date(b).getTime();
              // });
            });
            this.setState(
              {
                dataSalesMesecniNivoL: mesecni,
                dataSalesMesecniNivoS: series
              },
              () => {
                console.log(this.state);
              }
            );
            // godisnjiPrihod = Response.data;
            // console.log(godisnjiPrihod);
            // this.setState(
            //   {
            //     godisnjiPrihod: Response.data
            //   },
            //   () => {
            //     console.log(this.state);
            //   }
            // );
          })
          .catch(error => {
            console.log("godisnjiPrihodi nisu preuzeti");
          });
      })
      .catch(error => {
        console.log("admin nije preuzet");
      });
  }
  handleSortKlinika(sortBy) {
    console.log("sort funkcija");
    console.log(sortBy);
    const lista = this.state.listaPregleda;
    if (sortBy === "datumUp") {
      console.log("datum");
      this.setState({
        listaPregleda: lista.sort((a, b) => {
          return new Date(a.datum).getTime() - new Date(b.datum).getTime();
        })
      });
    } else if (sortBy === "datumDown") {
      console.log("datum");
      this.setState({
        listaPregleda: lista.sort((b, a) => {
          return new Date(a.datum).getTime() - new Date(b.datum).getTime();
        })
      });
    } else if (sortBy === "tipPregledaUp") {
      console.log("tipPregleda");
      this.setState({
        listaPregleda: lista.sort((a, b) =>
          a.tipPregledaN.localeCompare(b.tipPregledaN)
        )
      });
    } else if (sortBy === "tipPregledaDown") {
      console.log("tipPregleda");
      this.setState({
        listaPregleda: lista.sort((b, a) =>
          a.tipPregledaN.localeCompare(b.tipPregledaN)
        )
      });
    } else if (sortBy === "klinikaUp") {
      console.log("klinika");
      this.setState({
        listaPregleda: lista.sort((a, b) =>
          a.klinikaN.localeCompare(b.klinikaN)
        )
      });
    } else if (sortBy === "klinikaDown") {
      console.log("klinika");
      this.setState({
        listaPregleda: lista.sort((b, a) =>
          a.klinikaN.localeCompare(b.klinikaN)
        )
      });
    } else if (sortBy === "lekarUp") {
      console.log("lekar");
      this.setState({
        listaPregleda: lista.sort((a, b) =>
          a.lekarIme.localeCompare(b.lekarIme)
        )
      });
    } else if (sortBy === "lekarDown") {
      console.log("lekar");
      this.setState({
        listaPregleda: lista.sort((b, a) =>
          a.lekarIme.localeCompare(b.lekarIme)
        )
      });
    } else if (sortBy === "cenaUp") {
      console.log("cena");

      this.setState({
        listaPregleda: lista.sort((a, b) => a.cena - b.cena)
      });
    } else if (sortBy === "cenaDown") {
      console.log("cena");

      this.setState({
        listaPregleda: lista.sort((a, b) => b.cena - a.cena)
      });
    } else if (sortBy === "popustUp") {
      console.log("popust");

      this.setState({
        listaPregleda: lista.sort((a, b) => a.popust - b.popust)
      });
    } else if (sortBy === "popustDown") {
      console.log("popust");

      this.setState({
        listaPregleda: lista.sort((a, b) => b.popust - a.popust)
      });
    }
  }
  promenjenOdabirPregleda = e => {
    console.log("promenjen odabrir");
    console.log(e.currentTarget.value);
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
    console.log(this.state);
  };
  odabranPrelged = e => {
    //treba redirektovati na pretragu i filtriranje lekara
    e.preventDefault();
    console.log(this.state.izabranPregled);
    const ol = this.state.izabranPregled;
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    var t = 0;
    if (
      moment(this.state.izabraniDatum)
        .format("HH:mm")
        .valueOf() == "09:00"
    ) {
      console.log("9");
      t = 9;
    } else if (
      moment(this.state.izabraniDatum)
        .format("HH:mm")
        .valueOf() == "11:00"
    ) {
      console.log("11");
      t = 11;
    } else if (
      moment(this.state.izabraniDatum)
        .format("HH:mm")
        .valueOf() == "13:00"
    ) {
      console.log("13");
      t = 13;
    } else if (
      moment(this.state.izabraniDatum)
        .format("HH:mm")
        .valueOf() == "15:00"
    ) {
      console.log("15");
      t = 15;
    }
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
            termin: t
          },
          config
        )
        .then(response => {
          console.log("PREGLED");
          console.log(response);
          //   this.setState(
          //     {
          //       redirectNext: true,
          //       flag: 1,
          //       canClick: true
          //     },
          //     () => {
          //       this.props.handleClick("ZAHTEV JE POSLAT");
          //     }
          //   );
        })
        .catch(error => {
          console.log("greska pregled");
          console.log(error.response);
        });
    } else {
      this.setState(
        {
          formError: "Odaberite Pregled"
        },
        () => console.log(this.state.formError)
      );
    }
  };
  listaUnapredDefinisanihPregleda() {}
  listaOcenaLekara() {
    let res = [];
    console.log("lista ocena lekar");

    let lista = this.state.listaLekara;

    for (var i = 0; i < lista.length; i++) {
      res.push(
        <tr key={i}>
          <td>
            {lista[i].ime} {lista[i].prezime}
          </td>

          <td>{lista[i].ocena}</td>
        </tr>
      );
    }

    return res;
  }
  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
    console.log("On change !!!");
  };

  // handleSumbit = e => {
  //   e.preventDefault();
  //   console.log("KLIK SUBMITTT");
  //   // let formErrors = { ...this.state.formErrors };
  //   console.log("Izmjena : ---------------");
  //   console.log(this.state.ime);
  //   console.log(this.state.prezime);
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
  //       console.log(response.data);

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
  //       console.log("Izmena nije uspela! ");
  //     });
  // };
  prikaziGrafik() {
    console.log("Prikazi grafik");
    this.setState(
      {
        redirectGrafik: true
      },
      () => {
        console.log(this.state.flag);
      }
    );
  }
  prikaziPrihode() {
    console.log("prikazi prihode");
    this.setState(
      {
        redirectPrihodi: true
      },
      () => {
        console.log(this.state.flag);
      }
    );
  }
  redirectReferer() {
    console.log("REDIRECT");
    var flag = 0;
    console.log(this.state.redirectPrihodi);
    console.log(this.state.redirectGrafik);
    if (this.state.redirectPrihodi == true && this.state.flag == 0) {
      flag = 1;
      return (
        <Route
          path="/registration"
          render={props => <IzvestajOPoslovanju {...props} flag={flag} />}
        >
          <Redirect from="/" to="/admink/izvestaj" />
        </Route>
      );
    } else if (this.state.redirectGrafik == true && this.state.flag == 0) {
      flag = 2;

      return (
        <Route
          path="/registration"
          render={props => <IzvestajOPoslovanju {...props} flag={flag} />}
        >
          <Redirect from="/" to="/admink/izvestaj" />
        </Route>
      );
    }
  }

  render() {
    console.log("RENDER");
    const email = this.state.email;
    const uloga = this.state.uloga;
    var dataSalesDnevniNivo = {
      labels: this.state.dataSalesDnevniNivoL,
      series: [this.state.dataSalesDnevniNivoS]
    };
    var dataSalesNedeljniNivo = {
      labels: this.state.dataSalesNedeljniNivoL,
      series: [[], [], this.state.dataSalesNedeljniNivoS]
    };
    var dataSalesMesecniNivo = {
      labels: this.state.dataSalesMesecniNivoL,
      series: [[], this.state.dataSalesMesecniNivoS]
    };
    var optionsSales = {
      low: 0,
      high: 10,
      showArea: false,
      height: "245px",
      axisX: {
        showGrid: false
      },
      lineSmooth: true,
      showLine: true,
      showPoint: true,
      fullWidth: true,
      chartPadding: {
        right: 50
      }
    };
    var responsiveSales = [
      [
        "screen and (max-width: 640px)",
        {
          axisX: {
            labelInterpolationFnc: function(value) {
              return value[0];
            }
          }
        }
      ]
    ];
    var legendSalesDnevniNivo = {
      names: ["Broj pregleda"],
      types: ["info"]
    };
    var legendSalesNedeljniNivo = {
      names: ["Broj pregleda"],
      types: ["warning"]
    };
    var legendSalesMesecniNivo = {
      names: ["Broj pregleda"],
      types: ["danger"]
    };

    if (this.state.flag == 0) {
      return (
        <div className="content">
          <Grid fluid>
            <Row>
              <Col md={4}>
                <Card
                  // statsIcon="fa fa-clock-o"
                  title="Administator klinike"
                  // category="Ime"
                  content={
                    <div id="a">
                      {/* <div className="slikaKCdiv">
                            <h6> 
                              <img className="slikaLekar" src={slikaLekar}></img>
                            </h6>
                          </div> */}
                      <div className="typo-line">
                        <h6>
                          <p className="category">Klinika:</p>
                          <label className="adresaKC">
                            {" "}
                            {this.state.klinikaNaziv}{" "}
                          </label>
                        </h6>
                      </div>
                      <div className="typo-line">
                        <h6>
                          <p className="category">Ocena:</p>
                          <label className="adresaKC">
                            {this.state.klinikaOcena}{" "}
                          </label>
                        </h6>
                      </div>
                      <div className="typo-line">
                        <h6>
                          <p className="category">Nedeljni prihod:</p>
                          <label className="adresaKC">
                            {this.state.nedeljniPrihod} RSD
                          </label>
                        </h6>
                      </div>
                      <div className="typo-line">
                        <h6>
                          <p className="category">Mesecni prihod:</p>
                          <label className="adresaKC">
                            {this.state.mesecniPrihod} RSD
                          </label>
                        </h6>
                      </div>
                      <div className="typo-line">
                        <h6>
                          <p className="category">godisnjiPrihod:</p>
                          <label className="adresaKC">
                            {this.state.godisnjiPrihod} RSD
                          </label>
                        </h6>
                      </div>

                      <div></div>
                    </div>
                  }
                />
              </Col>
              <Col md={8}>
                <Card
                  ctTableFullWidth
                  ctTableResponsive
                  title="Ocene lekara"
                  content={
                    <div>
                      <Table striped responsive hover>
                        <thead className="thead-dark">
                          <tr>
                            <th id="Lekar">Lekar</th>
                            <th id="Ocena">Ocena</th>
                          </tr>
                        </thead>
                        <tbody>{this.listaOcenaLekara()}</tbody>
                      </Table>
                    </div>
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <Card
                  statsIcon="fa fa-history"
                  id="chartHours"
                  title="Grafik odrzanih pregleda"
                  category="na dnevnom nivou"
                  content={
                    <div className="ct-chart">
                      <ChartistGraph
                        data={dataSalesDnevniNivo}
                        type="Line"
                        options={optionsSales}
                        responsiveOptions={responsiveSales}
                      />
                    </div>
                  }
                  legend={
                    <div className="legend">
                      {this.createLegend(legendSalesDnevniNivo)}
                    </div>
                  }
                />
              </Col>
              <Col md={6}>
                <Card
                  statsIcon="fa fa-history"
                  id="chartHours"
                  title="Grafik odrzanih pregleda"
                  category="na nedeljnom nivou"
                  content={
                    <div className="ct-chart">
                      <ChartistGraph
                        data={dataSalesNedeljniNivo}
                        type="Line"
                        options={optionsSales}
                        responsiveOptions={responsiveSales}
                      />
                    </div>
                  }
                  legend={
                    <div className="legend">
                      {this.createLegend(legendSalesNedeljniNivo)}
                    </div>
                  }
                />
              </Col>
              <Col md={3}>
                <Card
                  statsIcon="fa fa-history"
                  id="chartHours"
                  title="Grafik odrzanih pregleda"
                  category="na mesecnom nivou"
                  content={
                    <div className="ct-chart">
                      <ChartistGraph
                        data={dataSalesMesecniNivo}
                        type="Line"
                        options={optionsSales}
                        responsiveOptions={responsiveSales}
                      />
                    </div>
                  }
                  legend={
                    <div className="legend">
                      {this.createLegend(legendSalesMesecniNivo)}
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
}

export default IzvestajOPoslovanju;
