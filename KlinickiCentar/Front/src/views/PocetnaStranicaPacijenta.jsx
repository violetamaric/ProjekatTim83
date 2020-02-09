import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import slikaPacijent from "assets/img/pacijentImage.jpg";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import slikazk from "assets/img/zakaziPregled.jpg";
import slikaZK from "assets/img/zk.jpg";
import slikaIP from "assets/img/istorijaPregleda.jpg";
import slikaBZ from "assets/img/brzoZakazivanje.jpg";
import { Table } from "react-bootstrap";

class PocetnaStranicaPacijenta extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    console.log(props.email);
    this.state = {
      email: props.email,
      uloga: props.uloga,
      token: props.token,
      ime: "",
      prezime: "",
      adresa: "",
      grad: "",
      drzava: "",
      telefon: "",
      brojOsiguranika: "",
      lozinka: "",
      redirectToZahtevZaPregled: false,
      redirectZdravstveniKarton: false,
      redirectBrzoZakazivanje: false,
      redirectIstorijaPO: false
    };
    this.pronadjiPacijenta = this.pronadjiPacijenta.bind(this);
    this.handleZahtevZaPregled = this.handleZahtevZaPregled.bind(this);
    this.handleZdravstveniKarton = this.handleZdravstveniKarton.bind(this);
    this.handleIstorijaPO = this.handleIstorijaPO.bind(this);
    this.handleBrzoZakazivanje = this.handleBrzoZakazivanje.bind(this);
    console.log(this.state.email);
    console.log(this.state.token);
  }

  pronadjiPacijenta() {
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    axios
      .get(
        "http://localhost:8025/api/pacijenti/findPacijentEmail",
        // this.state.email,
        config
      )

      .then(Response => {
        console.log("URL 111");
        console.log(Response);
        this.setState({
          email: Response.data.email,
          ime: Response.data.ime,
          prezime: Response.data.prezime,
          telefon: Response.data.telefon,
          adresa: Response.data.adresa,
          grad: Response.data.grad,
          drzava: Response.data.drzava,
          lbo: Response.data.lbo
        });
        console.log(this.state);
      })
      .catch(error => {
        console.log("nije uspeo url1");
        console.log(error);
      });
  }
  componentWillMount() {
    this.pronadjiPacijenta();
  }
  handleZahtevZaPregled = e => {
    e.preventDefault();
    this.setState({
      redirectToZahtevZaPregled: true
    });
  };
  handleZdravstveniKarton = e => {
    e.preventDefault();
    this.setState({
      redirectZdravstveniKarton: true
    });
  };
  handleIstorijaPO = e => {
    e.preventDefault();
    this.setState({
      redirectIstorijaPO: true
    });
  };
  handleBrzoZakazivanje = e => {
    e.preventDefault();
    this.setState({
      redirectBrzoZakazivanje: true
    });
  };

  renderRedirect = () => {
    if (this.state.redirectBrzoZakazivanje == true) {
      return <Redirect from="/" to="/pacijent/brzoZakazivanje" />;
    } else if (this.state.redirectToZahtevZaPregled == true) {
      return <Redirect from="/" to="/pacijent/klinikePacijenta" />;
    } else if (this.state.redirectIstorijaPO == true) {
      return <Redirect from="/" to="/pacijent/istorija" />;
    } else if (this.state.redirectZdravstveniKarton == true) {
      return <Redirect from="/" to="/pacijent/zdravstveniKarton" />;
    }
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
            <Col lg={6} sm={6}>
              {this.renderRedirect()}
              <div onClick={e => this.handleZahtevZaPregled(e)}>
                <StatsCard
                  bigIcon={
                    <img
                      className="slikaPacijent"
                      src={slikazk}
                      width="30"
                      height="30"
                    ></img>
                  }
                  statsIconText="Zahtev za pregled"
                />
              </div>
            </Col>

            <Col lg={6} sm={6}>
              {this.renderRedirect()}
              <div onClick={e => this.handleZdravstveniKarton(e)}>
                <StatsCard
                  bigIcon={
                    <img
                      className="slikaZK"
                      src={slikaZK}
                      width="30"
                      height="30"
                    ></img>
                  }
                  // statsText="Pocetak pregleda"
                  // statsValue="$1,345"
                  // statsIcon={<i className="fa fa-calendar-o" />}
                  statsIconText="Pregled kartona"
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={6} sm={6}>
              {this.renderRedirect()}
              <div onClick={e => this.handleIstorijaPO(e)}>
                <StatsCard
                  bigIcon={
                    <img
                      className="slikaIP"
                      src={slikaIP}
                      width="30"
                      height="30"
                    ></img>
                  }
                  // statsText="Profil korisnika"
                  // statsValue="23"
                  // statsIcon={<i className="fa fa-clock-o" />}
                  statsIconText="Istorija pregleda/operacija"
                />
              </div>
            </Col>
            <Col lg={6} sm={6}>
              {this.renderRedirect()}
              <div
                id="brzoZakazivanje"
                onClick={e => this.handleBrzoZakazivanje(e)}
              >
                <StatsCard
                  bigIcon={
                    <img
                      className="slikaBZ"
                      src={slikaBZ}
                      width="30"
                      height="30"
                    ></img>
                  }
                  // statsText="Profil korisnika"
                  // statsValue="23"
                  // statsIcon={<i className="fa fa-clock-o" />}
                  statsIconText="Brzo zakazivanje"
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Card
                // statsIcon="fa fa-clock-o"
                title="O pacijentu"
                // category="Ime"
                content={
                  <div id="a">
                    {/* <div className="slikaKCdiv">
                      <h2>
                        <img
                          className="slikaPacijent"
                          src={slikaPacijent}
                          width="50"
                          height="50"
                        ></img>
                      </h2>
                    </div> */}
                    {/* <div className="typo-line">
                      <h2>
                        <p className="category">Ime:</p>
                        <label className="adresaKC">{ime}</label>
                      </h2>
                    </div>
                    <div className="typo-line">
                      <h2>
                        <p className="category">Prezime:</p>
                        <label className="adresaKC">{prezime}</label>
                      </h2>
                    </div>

                    <div className="typo-line">
                      <h2>
                        <p className="category">Telefon:</p>
                        <label className="telefon">{telefon}</label>
                      </h2>
                    </div> */}
                    <Card
                      // category="Here is a subtitle for this table"
                      ctTableFullWidth
                      ctTableResponsive
                      content={
                        <Table striped hover style={{ width: 800 }}>
                          <thead className="thead-dark">
                            <tr>
                              <td>Ime:</td>
                              <td>{ime}</td>
                            </tr>
                            <tr>
                              <td>Prezime:</td>
                              <td>{prezime}</td>
                            </tr>
                            <tr>
                              <td>E-mail:</td>
                              <td>{email}</td>
                            </tr>
                            <tr>
                              <td>Telefon:</td>
                              <td>{telefon}</td>
                            </tr>
                            <tr>
                              <td>Adresa:</td>
                              <td>{adresa}</td>
                            </tr>
                            <tr>
                              <td>Grad:</td>
                              <td>{grad}</td>
                            </tr>
                            <tr>
                              <td>Drzava:</td>
                              <td>{drzava}</td>
                            </tr>
                            <tr>
                              <td>Jedinstveni broj osiguranika:</td>
                              <td>{lbo}</td>
                            </tr>
                          </thead>
                        </Table>
                      }
                    />
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

export default PocetnaStranicaPacijenta;
