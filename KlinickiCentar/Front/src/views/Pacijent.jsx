import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Route, Switch } from "react-router-dom";
import { Grid, Row, Col, Table } from "react-bootstrap";
import NotificationSystem from "react-notification-system";

import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.jsx";

import { style } from "variables/Variables.jsx";

import routes from "routesPacijent.js";
import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import {
  dataPie,
  legendPie,
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "variables/Variables.jsx";
import "klinickiCentar.css";
import UserCard from "components/UserCard/UserCard";
import slikaKC from "assets/img/klinickiCentar.jpg";
class Pacijent extends Component {
  constructor(props) {
    super(props);

    console.log(this.props);
    this.state = {
      uloga: props.uloga,
      email: props.email,
      // email: JSON.parse(localStorage.getItem("email") || props.email),
      token: props.token,
      lozinka: props.lozinka,
      _notificationSystem: null,
      // image: image,
      image: "https://wallpaperaccess.com/full/20601.jpg",
      color: "black",
      hasImage: true,
      fixedClasses: "dropdown show-dropdown open"
    };
    console.log(this.state.uloga);
  }

  getRoutes = routes => {
    return routes.map((prop, key) => {
      console.log("RUTEEEEEEEEEEEEE");
      if (prop.layout === "/pacijent") {
        // if (prop.path === "/pocetnaStranica") {
        //   <Route
        //     path={prop.layout + prop.path}
        //     render={props => (
        //       <prop.component
        //         {...props}
        //         handleClick={this.handleNotificationClick}
        //         uloga={this.state.uloga}
        //         email={this.state.email}
        //         token={this.state.token}
        //       />
        //     )}
        //     key={key}
        //   />;
        // } else {
        return (
          <Route
            path={prop.layout + prop.path}
            render={props => (
              <prop.component
                {...props}
                handleClick={this.handleNotificationClick}
                uloga={this.state.uloga}
                email={this.state.email}
                token={this.state.token}
                lozinka={this.state.lozinka}
                promeniLozinku={this.promeniLozinku}
              />
            )}
            key={key}
          />
        );
        // }
      } else {
        return null;
      }
    });
  };

  handleNotificationClick = poruka => {
    var color = 1;
    var level;
    console.log("handle not click");
    console.log("PORUKA: ", poruka);
    var klasa = "pe-7s-gift";
    if (
      poruka == "USPESNA IZMENA" ||
      poruka == "ZAHTEV JE POTVRDJEN" ||
      poruka == "OCENJEN LEKAR" ||
      poruka == "OCENJENA KLINIKA" ||
      poruka == "ZAHTEV JE POSLAT" ||
      poruka == "LOZINKA JE PROMENJENA"
    ) {
      level = "success";
      klasa = "pe-7s-check";
    } else if (poruka == "ZAHTEV SE NE MOZE OTKAZATI") {
      level = "error";
      klasa = "pe-7s-close";
    } else if (poruka == "ZAHTEV JE ODBIJEN" || poruka == "ZAHTEV JE OTKAZAN") {
      level = "warning";
      klasa = "pe-7s-close";
    }
    // switch (poruka) {
    //   case "USPESNA IZMENA":
    //     level = "success";
    //     break;
    //   case 2:
    //     level = "warning";
    //     break;
    //   case 3:
    //     level = "error";
    //     break;
    //   case 4:
    //     level = "info";
    //     break;
    //   default:
    //     break;
    // }
    this.state._notificationSystem.addNotification({
      title: <span data-notify="icon" className={klasa} />,
      message: <div>{poruka}</div>,
      level: level,
      position: "tr",
      autoDismiss: 15
    });
  };
  promeniLozinku = lozinka => {
    this.setState({
      lozinka: lozinka
    });
  };
  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  handleImageClick = image => {
    this.setState({ image: image });
  };
  handleColorClick = color => {
    this.setState({ color: color });
  };
  handleHasImage = hasImage => {
    this.setState({ hasImage: hasImage });
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setState({ fixedClasses: "dropdown show-dropdown open" });
    } else {
      this.setState({ fixedClasses: "dropdown" });
    }
  };
  componentWillMount() {
    console.log("WILL MOUNT");
    if (this.state.email == "" || this.state.email == undefined) {
      this.setState({
        email: JSON.parse(localStorage.getItem("email") || "{}"),
        token: JSON.parse(localStorage.getItem("token") || "{}")
      });
    }
  }
  componentDidMount() {
    console.log("-----------------------");
    console.log("DID MOUNT");
    localStorage.setItem("email", JSON.stringify(this.state.email));
    localStorage.setItem("token", JSON.stringify(this.state.token));
    console.log(this.refs);
    this.setState({ _notificationSystem: this.refs.notificationSystem });
    var _notificationSystem = this.refs.notificationSystem;
    var color = 4;
    var level;
    switch (color) {
      case 1:
        level = "success";
        break;
      case 2:
        level = "warning";
        break;
      case 3:
        level = "error";
        break;
      case 4:
        level = "info";
        break;
      default:
        break;
    }
    _notificationSystem.addNotification({
      title: <span data-notify="icon" className="pe-7s-gift" />,
      message: <div>Dobrodosli, {this.state.email}</div>,
      level: level,
      position: "tr",
      autoDismiss: 15
    });
  }
  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
    }
    if (e.history.action === "PUSH") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
  }
  render() {
    const email = this.state.email;
    const uloga = this.state.uloga;
    return (
      <div className="wrapper">
        <NotificationSystem ref="notificationSystem" style={style} />
        <Sidebar
          {...this.props}
          routes={routes}
          image={this.state.image}
          color={this.state.color}
          hasImage={this.state.hasImage}
          // email={email}
          // uloga={uloga}
        />
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
            // brandText="JU JU JUJU"
          />

          <Switch>{this.getRoutes(routes)}</Switch>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Pacijent;
