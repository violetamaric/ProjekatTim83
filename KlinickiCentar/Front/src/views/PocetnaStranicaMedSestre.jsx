import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "klinickiCentar.css";

import moment from "moment";

import Button from "components/CustomButton/CustomButton.jsx";
import Dialog from "react-bootstrap-dialog";

const localizer = momentLocalizer(moment);

class PocetnaStranicaMedSestre extends React.Component {
  constructor(props) {
    super(props);

    console.log("ADMINISTRATOR KLINICKOG CENTRA");
    console.log(this.props);
    this.state = {
      uloga: props.uloga,
      email: props.email,
      token: props.token,
      redirectToListaPacijenata: false,
      redirectToProfilMedSestre: false,
      redirectToZahtevZaGodOdmor: false,
      redirectToOveraRecepata: false,
      redirectToPocetnaStranica: false,
      listaOdmor: [],
      listaOdsustvo: [],
      //vezano za kalendar
      odmor: [],
      odsustvo: [],
      events: [],
      objekat: null,
      isOpen: false
    };
    this.config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };

    this.handleListaPacijenata = this.handleListaPacijenata.bind(this);
    this.handleProfilMedSestre = this.handleProfilMedSestre.bind(this);
    this.handleZahtevZaGodOdmor = this.handleZahtevZaGodOdmor.bind(this);
    this.handleOveraRecepata = this.handleOveraRecepata.bind(this);

    this.ucitavanjeListeOdmorOdsustvo = this.ucitavanjeListeOdmorOdsustvo.bind(
      this
    );
    this.dodavanjeListeOdmorOdsustvoUKalendar = this.dodavanjeListeOdmorOdsustvoUKalendar.bind(
      this
    );
    // this.ucitavanjeListeOdmorOdsustvo();
  }

  handleListaPacijenata() {
    this.setState({
      redirectToListaPacijenata: true
    });
  }
  handleProfilMedSestre() {
    this.setState({
      redirectToProfilMedSestre: true
    });
  }
  handleZahtevZaGodOdmor() {
    this.setState({
      redirectToZahtevZaGodOdmor: true
    });
  }
  handleOveraRecepata() {
    this.setState({
      redirectToOveraRecepata: true
    });
  }

  ucitavanjeListeOdmorOdsustvo() {
    const url1 = "http://localhost:8025/api/medicinskaSestra/listaOdmor";
    console.log(url1);
    axios
      .get(url1, this.config)
      .then(response => {
        console.log("ucitana lista odmor odsustvo");
        console.log(response);
        this.setState(
          {
            listaOdmor: response.data
          },
          () => this.dodavanjeListeOdmorOdsustvoUKalendar()
        );
      })
      .catch(error => {
        console.log("nije ucitana lista odmor odsustvo");
        console.log(error);
      });
  }
  dodavanjeListeOdmorOdsustvoUKalendar() {
    let lista = this.state.listaOdmor;
    for (var i = 0; i < lista.length; i++) {
      let start = new Date(lista[i].datumOd);
      let end = new Date(lista[i].datumDo);
      this.state.odmor.push({
        id: i,
        title: lista[i].tip,
        start: start,
        end: end,
        desc: lista[i].opis,
        up_down_ind: "Y"
      });
    }
  }

  componentWillMount() {
    this.ucitavanjeListeOdmorOdsustvo();
  }

  renderRedirect = () => {
    if (this.state.redirectToListaPacijenata) {
      return <Redirect from="/" to="/medses/listaPacijenata"></Redirect>;
    } else if (this.state.redirectToProfilMedSestre) {
      return <Redirect from="/" to="/medses/izmenaProfila"></Redirect>;
    } else if (this.state.redirectToZahtevZaGodOdmor) {
      return <Redirect from="/" to="/medses/zahtevZaGodOdmor"></Redirect>;
    } else if (this.state.redirectToOveraRecepata) {
      return <Redirect from="/" to="/medses/overavanjeRecepata"></Redirect>;
    }
  };

  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={3} sm={6}>
              {this.renderRedirect()}
              <div onClick={this.handleListaPacijenata}>
                <StatsCard
                  // bigIcon={<i className="pe-7s-server text-warning" />}
                  // statsText="Lista pacijenata"
                  // statsValue="105GB"
                  // statsIcon={<i className="fa fa-refresh" />}
                  statsIconText="Lista pacijenata"
                />
              </div>
            </Col>
            <Col lg={3} sm={6}>
              {this.renderRedirect()}
              <div onClick={this.handleOveraRecepata}>
                <StatsCard
                  // bigIcon={<i className="fa fa-twitter text-info" />}
                  // statsText=""
                  // statsValue="+45"
                  // statsIcon={<i className="fa fa-refresh" />}
                  statsIconText="Overa recepata"
                />
              </div>
            </Col>
            <Col lg={3} sm={6}>
              {this.renderRedirect()}
              <div onClick={this.handleProfilMedSestre}>
                <StatsCard
                  // bigIcon={<i className="pe-7s-graph1 text-danger" />}
                  // statsText="Profil korisnika"
                  // statsValue="23"
                  // statsIcon={<i className="fa fa-clock-o" />}
                  statsIconText="Profil korisnika"
                />
              </div>
            </Col>
            <Col lg={3} sm={6}>
              {this.renderRedirect()}
              <div onClick={this.handleZahtevZaGodOdmor}>
                <StatsCard
                  // bigIcon={<i className="pe-7s-graph1 text-danger" />}
                  // statsText="Profil korisnika"
                  // statsValue="23"
                  // statsIcon={<i className="fa fa-clock-o" />}
                  statsIconText="Zahtev za odmor/odsustvo"
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card
                title="Kalendar"
                // category="24 Hours performance"
                // stats="Updated 3 minutes ago"
                content={
                  <Grid fluid>
                    <Row>
                      {this.state.isOpen ? (
                        <Card
                          // category="Dogadjaj"
                          ctTableFullWidth
                          ctTableResponsive
                          content={
                            <div>
                              <div className="dogadjaj">
                                <label className="dogadjaj1">Dogadjaj: </label>
                                <label className="dogadjaj2">
                                  {this.state.objekat.title}
                                </label>
                              </div>
                              <div className="dogadjaj">
                                <label className="dogadjaj1">Opis: </label>
                                <label className="dogadjaj2">
                                  {this.state.objekat.desc}
                                </label>
                              </div>
                              <div className="dogadjaj">
                                <label className="dogadjaj1">Pocetak: </label>
                                <label className="dogadjaj2">
                                  {this.state.objekat.start.toLocaleDateString()}
                                </label>
                              </div>
                              <div className="dogadjaj">
                                <label className="dogadjaj1">Kraj: </label>
                                <label className="dogadjaj2">
                                  {this.state.objekat.end.toLocaleDateString()}
                                </label>
                              </div>
                              <Button
                                className="izlaz"
                                onClick={() => this.setState({ isOpen: false })}
                              >
                                X
                              </Button>
                            </div>
                          }
                        />
                      ) : null}
                    </Row>
                    <Row>
                      <div style={{ height: 400 }} className="ct-chart">
                        <Calendar
                          style={{ maxHeight: "100%" }}
                          localizer={localizer}
                          showMultiDayTimes={true}
                          // views={["month"]}
                          defaultDate={new Date()}
                          events={this.state.odmor}
                          eventPropGetter={event => ({
                            style: {
                              backgroundColor: "#ebd234"
                            }
                          })}
                          // startAccessor={event.start}
                          // endAccessor={event.end}
                          // titleAccessor="tip"
                          onSelectEvent={obj => {
                            this.state.objekat = obj;
                            console.log(this.state.objekat);
                            this.setState({
                              isOpen: true
                            });
                          }}
                        />
                      </div>
                    </Row>
                  </Grid>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default PocetnaStranicaMedSestre;
