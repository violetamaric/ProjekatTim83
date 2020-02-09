import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import "klinickiCentar.css";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from "axios";
import Dialog from "react-bootstrap-dialog";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import moment from "moment";
import ListaSala from "./ListaSala.jsx";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
class ListaZahtevaPregled extends Component {
  constructor(props) {
    super(props);
    console.log("LISTA ZAHTJEVA ZA PREGLED");
    console.log(this.props);
    this.state = {
      uloga: props.uloga,
      email: props.email,
      token: props.token,
      idKlinike: "",
      redirectToListaSala: false,
      listaZahtevaZaOregled: [],

      salaN: "",
      salaBR: "",
      datumPregleda: "",
      idPregleda: "",
      terminPregleda: "",
      idLekar: "",
      idPacijent: ""
    };
    this.listaZahtevaZaPregled = this.listaZahtevaZaPregled.bind(this);
  }

  ucitajPonovo() {
    const url1 =
      "http://localhost:8025/api/pregledi/listaZahtevaZaRegistraciju/" +
      this.state.email;

    axios
      .get(url1)
      .then(response => {
        this.setState({
          listaZahtevaZaRegistraciju: response.data
        });
      })
      .catch(error => {
        console.log("nije uspeo url1");
      });
  }
  handleClickDodeliSalu = e => {
    // e.preventDefault();
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const urlPRegled = "http://localhost:8025/api/pregledi/" + e.target.id;
    axios.get(urlPRegled, config).then(pregled => {
      console.log("###################################################");
      console.log(pregled.data);

      this.setState(
        {
          // idKlinike: klinika.data.id,
          datumPregleda: pregled.data.datum,
          salaN: pregled.data.salaN,
          salaBR: pregled.data.salaBR,
          terminPregleda: pregled.data.termin,
          idPregleda: pregled.data.id,
          idLekar: pregled.data.lekarID,
          idPacijent: pregled.data.pacijentID
        },
        () => {
          console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1");
          console.log(this.state.idPregleda);
          console.log(this.state.idLekar);
          console.log(this.state.datumPregleda);
          console.log(this.state.idPacijent);
        }
      );
    });

    this.setState({
      redirectToListaSala: true,
      idPregleda: e.target.id
    });
  };
  componentWillMount() {
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const url = "http://localhost:8025/api/adminKlinike/getAdminKlinikeByEmail";
    axios
      .get(url, config)
      .then(Response => {
        this.setState(
          {
            email: Response.data.email,
            //   ime: Response.data.ime,
            //   prezime: Response.data.prezime,
            //   telefon: Response.data.telefon,
            idKlinike: Response.data.idKlinike
          },
          () => {
            const urlKlinike =
              "http://localhost:8025/api/pregledi/preuzmiZahtevePregledaKlinike/" +
              this.state.idKlinike;
            axios.get(urlKlinike, config).then(k => {
              this.setState({
                listaZahtevaZaOregled: k.data
              });
            });
          }
        );
      })

      .catch(error => {
        console.log("Administrator klinike  nije preuzet");
      });
  }
  handleChange = e => {
    e.preventDefault();

    this.setState({ [e.target.name]: e.target.value });
  };

  handleOdobren = e => {
    e.preventDefault();
    const url2 =
      "http://localhost:8025/api/administratoriKC/potvrda/" + e.target.id;
    axios
      .post(url2, {})
      .then(response => {
        this.ucitajPonovo();
      })
      .catch(error => {});
  };
  handleOdbijen = e => {
    e.preventDefault();
    let zaKoga = e.target.id;
    let raz = "Bez razloga";
    this.setState({
      za: zaKoga
    });
    this.setState({
      razlogOdbijanja: raz
    });

    this.dialog.show({
      title: "Odbijanje zahteva za registraciju",
      body: [
        <form className="formaZaSlanjeRazlogaOdbijanja">
          <div className="za">
            <label className="zaLabel" htmlFor="za">
              Za:{" "}
            </label>
            <input
              className="zaLabel"
              type="text"
              name="za"
              value={zaKoga}
              disabled="disabled"
              // defaultValue= {za}
              // placeholder={this.state.ime}
              // noValidate
              // onChange={this.handleChange}
            />
          </div>
          <div className="razlogOdbijanja">
            <label className="razlogOdbijanjaLabel" htmlFor="razlogOdbijanja">
              Razlog odbijanja:{" "}
            </label>
            <input
              className="razlogOdbijanjaLabel"
              type="text"
              name="razlogOdbijanja"
              defaultValue=""
              onChange={this.handleChange}
            />
          </div>
        </form>
      ],
      actions: [
        Dialog.CancelAction(),
        Dialog.OKAction(() => {
          const url3 =
            "http://localhost:8025/api/administratoriKC/odbijanje/" +
            this.state.za +
            "/" +
            this.state.razlogOdbijanja;
          axios
            .post(url3, {})
            .then(response => {
              this.ucitajPonovo();
            })
            .catch(error => {
              console.log("Odbijanje nije uspelo! ");
            });
        })
      ],
      bsSize: "medium",
      onHide: dialog => {
        dialog.hide();
      }
    });
  };

  listaZahtevaZaPregled() {
    let res = [];
    const odbij = <Tooltip id="remove_tooltip">Odbij</Tooltip>;
    const potvrdi = <Tooltip id="remove_tooltip">Potvrdi</Tooltip>;

    let lista = this.state.listaZahtevaZaOregled;

    for (var i = 0; i < lista.length; i++) {
      if (lista[i].salaN == "" || lista[i].salaN == undefined) {
        const value2 = "dodeliSalu" + i;
        res.push(
          <tr key={i}>
            <td key={lista[i].lekarID}>
              {lista[i].imeL} {lista[i].prezimeL}
            </td>
            <td key={lista[i].nazivTP}>{lista[i].nazivTP}</td>
            <td> {moment(lista[i].datum).format("DD.MM.YYYY")}</td>
            <td key={lista[i].cena}>{lista[i].cena} RSD</td>
            <td>
              {lista[i].imeP} {lista[i].prezimeP}
            </td>
            <td>
              <Button
                value={value2}
                id={lista[i].id}
                onClick={e => this.handleClickDodeliSalu(e)}
              >
                Dodeli salu
              </Button>
            </td>
          </tr>
        );
      } else {
        if (lista[i].status == 1) {
          res.push(
            <tr key={i}>
              <td key={lista[i].nazivKl}>{lista[i].nazivKl}</td>
              <td key={lista[i].lekarID}>
                {lista[i].imeL} {lista[i].prezimeL}
              </td>
              <td key={lista[i].nazivTP}>{lista[i].nazivTP}</td>
              <td> {moment(lista[i].datum).format("DD.MM.YYYY")}</td>
              <td key={lista[i].cena}>{lista[i].cena} RSD</td>

              <td align={"center"} key={lista[i].status}>
                {" "}
                <i className="pe-7s-check text-success" />
              </td>

              <td></td>
              <td></td>
            </tr>
          );
        } else if (lista[i].status == 0) {
          const value2 = "dodeliSalu" + i;
          res.push(
            <tr key={i}>
              <td key={lista[i].lekarID}>
                {lista[i].imeL} {lista[i].prezimeL}
              </td>
              <td key={lista[i].nazivTP}>{lista[i].nazivTP}</td>
              <td> {moment(lista[i].datum).format("DD.MM.YYYY")}</td>
              <td key={lista[i].cena}>{lista[i].cena} RD</td>
              <td>
                {lista[i].imeP} {lista[i].prezimeP}
              </td>

              <td>
                <Button
                  value={value2}
                  id={lista[i].id}
                  onClick={e => this.handleClickDodeliSalu(e)}
                >
                  Dodeli salu
                </Button>
              </td>
            </tr>
          );
        } else if (lista[i].status == 2) {
          res.push(
            <tr key={i}>
              <td key={lista[i].nazivKl}>{lista[i].nazivKl}</td>
              <td key={lista[i].lekarID}>
                {lista[i].imeL} {lista[i].prezimeL}
              </td>
              <td key={lista[i].nazivTP}>{lista[i].nazivTP}</td>
              <td> {moment(lista[i].datum).format("DD.MM.YYYY")}</td>
              <td key={lista[i].cena}>{lista[i].cena} RSD</td>

              <td align={"center"} key={lista[i].status}>
                {" "}
                <i className="pe-7s-close-circle text-danger" />
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

  render() {
    const redirectToListaSala = this.state.redirectToListaSala;

    if (redirectToListaSala == true) {
      console.log("|||||||||||||||||||||||||||||||||||||");
      console.log(this.state.datumPregleda);
      console.log(this.state.terminPregleda);

      return (
        <BrowserRouter>
          <Switch>
            <Route
              path="/listaSala"
              render={props => (
                <ListaSala
                  {...props}
                  handleClick={this.handleNotificationClick}
                  idLekar={this.state.idLekar}
                  idPacijent={this.state.idPacijent}
                  idPregleda={this.state.idPregleda}
                  idKlinike={this.state.idKlinike}
                  terminPregleda={this.state.terminPregleda}
                  datumPregleda={this.state.datumPregleda}
                  redirectToListaSala={this.state.redirectToListaSala}
                  token={this.state.token}
                />
              )}
            />
            <Redirect from="/" to="/listaSala" />
          </Switch>
        </BrowserRouter>
      );
    }

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col>
              <Row>
                <Card
                  title="Lista zahteva za pregled"
                  // category="Here is a subtitle for this table"
                  ctTableFullWidth
                  ctTableResponsive
                  content={
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th id="lekar">Lekar</th>
                          <th id="tipP">tip pregleda</th>
                          <th>datum</th>
                          <th id="cijena"> cijena</th>
                          <th id="PrezimePacijenta">pacijent</th>

                          {/* <th id="LozinkaPacijenta">Lozinka</th> */}
                          {/* <th id="sala">sala</th> */}
                          {/* <th id="prihvatiZ">odobri</th>
                          <th id="odbijZ">odbij</th> */}
                          {/* <th id="TelefonPacijenta">Telefon</th> */}
                          {/* {thArray.map((prop, key) => {
                            return <th key={key}>{prop}</th>;
                          })} */}
                        </tr>
                      </thead>
                      <tbody>{this.listaZahtevaZaPregled()}</tbody>
                    </Table>
                  }
                />
              </Row>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default ListaZahtevaPregled;
