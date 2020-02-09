/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import Login from "login";
import axios from "axios";
import Pacijent from "views/Pacijent.jsx";
import ListaPregleda from "views/ListaPregleda";
import Button from "components/CustomButton/CustomButton.jsx";

class PacijentNavbarLinks extends Component {
  constructor(props) {
    super(props);

    console.log(this.props);
    this.state = {
      uloga: this.props.uloga,
      email: this.props.email,
      token: this.props.token,
      pregledi: [],
      brObavestenja: 0,
      obavestenja: [],
      redirectToPotvrdaPregleda: false,
      redirectToIstorijaPO: false,
      menuIsOpened: false,
      notOcena: false,
      notPotvrda: false
    };
    this.listaPregledaPO = this.listaPregledaPO.bind(this);
    this.listaPregledaOC = this.listaPregledaOC.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handlePonistiObavestenja = this.handlePonistiObavestenja.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    console.log(this.state);
  }
  handleClick = e => {
    e.preventDefault();
    console.log(e.currentTarget.value);
    if (e.currentTarget.value == "Potvrdite zahtev za pregled") {
      //   this.setState({people: this.state.people.filter(function(person) {
      //     return person !== e.target.value
      // })});

      this.setState(
        {
          redirectToPotvrdaPregleda: true,
          menuIsOpened: false,
          obavestenja: this.state.obavestenja.filter(function(ob) {
            return ob != e.currentTarget.value;
          })
        },
        () => this.handlePonistiObavestenja()
      );
    } else if (
      e.currentTarget.value == "Ocenite kliniku i lekara" ||
      e.currentTarget.value == "Ocenite kliniku" ||
      e.currentTarget.value == "Ocenite lekara"
    ) {
      this.setState(
        {
          redirectToIstorijaPO: true,
          menuIsOpened: false,
          obavestenja: this.state.obavestenja.filter(function(ob) {
            return ob != e.currentTarget.value;
          })
        },
        () => this.handlePonistiObavestenja()
      );
    }
  };
  handleToggle(toggle) {
    //you code here, change state of menuIsOpened if you want to open or close
    if (this.state.menuIsOpened == false) {
      this.setState({
        menuIsOpened: true
      });
    } else {
      this.setState({
        menuIsOpened: false
      });
    }
  }
  handlePonistiObavestenja() {
    console.log("handle ponisti o");
    this.setState({
      brObavestenja: this.state.brObavestenja - 1
    });
  }
  componentWillMount() {
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
        this.setState(
          {
            pregledi: res.data
          },
          () => {
            this.listaPregledaPO();
          }
        );
      })
      .catch(error => {
        console.log("Pacijent  nije preuzet");
      });
  }
  listaPregledaPO() {
    let res = [];
    let lista = this.state.pregledi;
    var temp = 0;
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].status == 0) {
        if (lista[i].salaID != undefined || lista[i].salaID != null) {
          console.log("lista PO temp = 1");
          temp = 1;
          break;
        }
      }
    }
    if (temp == 1) {
      this.setState(
        {
          brObavestenja: this.state.brObavestenja + 1,
          obavestenja: this.state.obavestenja.concat(
            "Potvrdite zahtev za pregled"
          )
        },
        () => {
          console.log(this.state);
          console.log("stateeeeeeeeeeeeeeee");
          this.listaPregledaOC();
        }
      );
    }
  }
  listaPregledaOC() {
    let res = [];
    let lista = this.state.pregledi;
    var temp = 0;

    for (var i = 0; i < lista.length; i++) {
      if (lista[i].status == 3) {
        console.log("lista OC temp = 1");
        temp = 1;
        break;
      }
    }
    if (temp != 1) {
      for (var i = 0; i < lista.length; i++) {
        if (lista[i].status == 4) {
          if (temp == 3) {
            temp = 1;
            break;
          } else {
            temp = 2;
          }
        } else if (lista[i].status == 5) {
          if (temp == 2) {
            temp = 1;
            break;
          } else {
            temp = 3;
          }
        }
      }
    }

    if (temp == 1) {
      this.setState(
        {
          brObavestenja: this.state.brObavestenja + 1,
          obavestenja: this.state.obavestenja.concat("Ocenite kliniku i lekara")
        },
        () => {
          console.log(this.state);
        }
      );
    } else if (temp == 2) {
      this.setState(
        {
          brObavestenja: this.state.brObavestenja + 1,
          obavestenja: this.state.obavestenja.concat("Ocenite lekara"),
          notOcena: true
        },
        () => {
          console.log(this.state);
        }
      );
    } else if (temp == 3) {
      this.setState(
        {
          brObavestenja: this.state.brObavestenja + 1,
          obavestenja: this.state.obavestenja.concat("Ocenite kliniku"),
          notOcena: true
        },
        () => console.log(this.state)
      );
    }
  }
  renderRedirect() {
    console.log("renderredirect");
    if (this.state.redirectToPotvrdaPregleda == true) {
      console.log("the same");
      return <Redirect from="/" to="/pacijent/potvrdaPregleda" />;
    } else if (this.state.redirectToIstorijaPO == true) {
      return <Redirect from="/" to="/pacijent/istorija" />;
    }
  }
  handleC() {
    console.log("handle c");
    if (this.state.redirectToPotvrdaPregleda == true) {
      this.setState({
        redirectToPotvrdaPregleda: false
      });
    } else if (this.state.redirectToIstorijaPO == true) {
      this.setState({
        redirectToIstorijaPO: false
      });
    }
  }
  render() {
    this.handleC();
    var notification;

    if (this.state.brObavestenja == 0) {
      console.log("br obavestenja 0");
      notification = (
        <div>
          <i className="fa fa-globe" />
          <b className="caret" />
          {/* <span className="notification"></span> */}
          <p className="hidden-lg hidden-md">Notification</p>
        </div>
      );
      return (
        <div>
          <Nav>
            {/* <NavItem eventKey={1} href="#">
                  <i className="fa fa-dashboard" />
                  <p className="hidden-lg hidden-md">Dashboard</p>
                </NavItem> */}
            <NavDropdown
              eventKey={2}
              title={notification}
              noCaret
              id="basic-nav-dropdown"
              open={this.state.menuIsOpened}
              onToggle={this.handleToggle}
            >
              <MenuItem>Nema novih obavestenja</MenuItem>

              {/* <Alert
                    bsStyle="info"
                    value={poruka}
                    onClick={e => this.handleClick(e)}
                  >
                    <span>{poruka}</span>
                  </Alert>  */}

              {/* <MenuItem eventKey={2.1}>Notification 1</MenuItem>
                  <MenuItem eventKey={2.2}>Notification 2</MenuItem>
                  <MenuItem eventKey={2.3}>Notification 3</MenuItem>
                  <MenuItem eventKey={2.4}>Notification 4</MenuItem>
                  <MenuItem eventKey={2.5}>Another notifications</MenuItem> */}
            </NavDropdown>
            {/* <NavItem eventKey={3} href="#">
                  <i className="fa fa-search" />
                  <p className="hidden-lg hidden-md">Search</p>
                </NavItem> */}
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={3} href="http://localhost:3000/login">
              Odjava
            </NavItem>
          </Nav>
        </div>
      );
    } else {
      notification = (
        <div>
          <i className="fa fa-globe" />
          <b className="caret" />
          <span className="notification">{this.state.brObavestenja}</span>
          <p className="hidden-lg hidden-md">Notification</p>
        </div>
      );
      return (
        <div>
          {this.renderRedirect()}
          <Nav>
            {/* <NavItem eventKey={1} href="#">
                  <i className="fa fa-dashboard" />
                  <p className="hidden-lg hidden-md">Dashboard</p>
                </NavItem> */}
            <NavDropdown
              eventKey={2}
              title={notification}
              noCaret
              id="basic-nav-dropdown"
              open={this.state.menuIsOpened}
              onToggle={this.handleToggle}
            >
              {this.state.obavestenja.map(poruka => {
                return (
                  /* <MenuItem
                    key={poruka}
                    onClick={() => this.handleClick(poruka)}
                  >
                    {poruka}
                  </MenuItem> */
                  <Button
                    fill
                    bsStyle="info"
                    bsSize="lg"
                    value={poruka}
                    onClick={e => this.handleClick(e)}
                  >
                    <span>{poruka}</span>
                  </Button>
                  /* <Alert
                    bsStyle="info"
                    value={poruka}
                    onClick={e => this.handleClick(e)}
                  >
                    <span>{poruka}</span>
                  </Alert> */
                );
              })}
              {/* <MenuItem eventKey={2.1}>Notification 1</MenuItem>
                  <MenuItem eventKey={2.2}>Notification 2</MenuItem>
                  <MenuItem eventKey={2.3}>Notification 3</MenuItem>
                  <MenuItem eventKey={2.4}>Notification 4</MenuItem>
                  <MenuItem eventKey={2.5}>Another notifications</MenuItem> */}
            </NavDropdown>
            {/* <NavItem eventKey={3} href="#">
                  <i className="fa fa-search" />
                  <p className="hidden-lg hidden-md">Search</p>
                </NavItem> */}
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={3} href="http://localhost:3000/login">
              Odjava
            </NavItem>
          </Nav>
        </div>
      );
    }
  }
}

export default PacijentNavbarLinks;
