import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import NotificationSystem from "react-notification-system";
import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import { style } from "variables/Variables.jsx";
import routes from "routesAdminK";
import "klinickiCentar.css";

class AdministatorKlinike extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uloga: props.uloga,
      email: props.email,
      token: props.token,
      lozinka: props.lozinka,
      _notificationSystem: null,
      image: "https://wallpaperaccess.com/full/20601.jpg",
      color: "black",
      hasImage: true,
      fixedClasses: "dropdown show-dropdown open"
    };
  }

  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admink") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={props => (
              <prop.component
                {...props}
                handleClick={this.handleNotificationClick}
                id={this.state.id}
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
      } else {
        return null;
      }
    });
  };
  // handleNotificationClick = position => {
  //   var color = Math.floor(Math.random() * 4 + 1);
  //   var level;
  //   switch (color) {
  //     case 1:
  //       level = "success";
  //       break;
  //     case 2:
  //       level = "warning";
  //       break;
  //     case 3:
  //       level = "error";
  //       break;
  //     case 4:
  //       level = "info";
  //       break;
  //     default:
  //       break;
  //   }
  //   this.state._notificationSystem.addNotification({
  //     title: <span data-notify="icon" className="pe-7s-gift" />,
  //     message: (
  //       <div>
  //         Welcome to <b>Light Bootstrap Dashboard</b> - a beautiful freebie for
  //         every web developer.
  //       </div>
  //     ),
  //     level: level,
  //     position: position,
  //     autoDismiss: 15
  //   });
  // };
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
  handleNotificationClick = poruka => {
    var color = 1;
    var level;
    var klasa = "pe-7s-gift";
    if (
      poruka == "USPESNA IZMENA" ||
      poruka == "ZAHTEV JE POTVRDJEN" ||
      poruka == "OCENJEN LEKAR" ||
      poruka == "OCENJENA KLINIKA" ||
      poruka == "ZAHTEV JE POSLAT" ||
      poruka == "USPESNA REZERVACIJA"
    ) {
      level = "success";
      klasa = "pe-7s-check";
    } else if (poruka == "ZAHTEV JE ODBIJEN") {
      level = "error";
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
    if (this.state.email == "" || this.state.email == undefined) {
      this.setState({
        email: JSON.parse(localStorage.getItem("email") || "{}"),
        token: JSON.parse(localStorage.getItem("token") || "{}")
      });
    }
  }
  componentDidMount() {
    localStorage.setItem("email", JSON.stringify(this.state.email));
    localStorage.setItem("token", JSON.stringify(this.state.token));
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
  promeniLozinku = lozinka => {
    this.setState({
      lozinka: lozinka
    });
  };

  // getData(){
  //   Geocode.setApiKey("AIzaSyBO8lOU4v5gC2H64p7I4l9zZrkgq_dJ9rk");
  //   // Get address from latidude & longitude.
  // Geocode.fromLatLng("48.8583701", "2.2922926").then(
  //   response => {
  //     const address = response.results[0].formatted_address;
  //
  //   },
  //   error => {
  //     console.error(error);
  //   }
  // );

  // // Get latidude & longitude from address.
  // Geocode.fromAddress("Bulevar Oslobodjenja 67").then(
  //   response => {
  //
  //
  //     const { lat, lng } = response.results[0].geometry.location;
  //
  //   },
  //   error => {
  //     console.error(error);
  //   }
  // );
  // }

  render() {
    const email = this.state.email;
    const uloga = this.state.uloga;
    return (
      <div className="wrapper">
        <NotificationSystem ref="notificationSystem" style={style} />
        <Sidebar
          {...this.props}
          // getData={this.getData()}
          routes={routes}
          email={this.state.email}
          uloga={this.state.uloga}
          image={this.state.image}
          color={this.state.color}
          hasImage={this.state.hasImage}
        />
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />

          {/* <PocetnaStranicaLekara  email={email} uloga={uloga} /> */}
          <Switch>{this.getRoutes(routes)}</Switch>
          <Footer />
        </div>
      </div>
    );
  }
}

export default AdministatorKlinike;
