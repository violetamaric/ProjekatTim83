import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./registracija.css";
import AdminLayout from "layouts/Admin.jsx";
import axios from "axios";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Registracija from "registracija.js";
import Login from "login";
import Lekar from "views/Lekar.jsx";
import Pacijent from "views/Pacijent.jsx";
import KlinickiCentar from "views/KlinickiCentar.jsx";
import MedicinskaSestra from "views/MedicinskaSestra.jsx";
import AdministatorKlinike from "views/AdministatorKlinike.jsx";

class prvoLogovanje extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
      lozinka: props.lozinka,
      promenaLozinke: false,
      potvrdaLozinke: "",
      uloga: props.uloga,
      token: props.token,
      korisnik: props.korisnik,
      greskaLozinke: false, //za gresku 
      poklapanjeLozinke: true,
      mozemoDalje: false,
      
      

    };
    this.config = {
        headers: {
          Authorization: "Bearer " + this.state.token,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
    }
    this.logovanje = this.logovanje.bind(this);
    this.promeniLozinku = this.promeniLozinku.bind(this);
  }

  logovanje = e =>{
    // e.preventDefault();
    if (this.state.promenaLozinke === this.state.potvrdaLozinke) {
        
        console.log("lozinke se poklapaju");
        console.log("promena lozinke stare");
        this.promeniLozinku();
        
       
        

    } else {
        console.log("lozinke se ne poklapaju");
      
    }

   
  }


  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
    console.log("On change !!!");
  };



  componentWillMount() {
    console.log("PUTANJA");
    // console.log(this.props.location.pathname);
    // var path = this.props.location.pathname;
    // var paths = [];
    // paths = path.split("/");
    // console.log(paths[paths.length - 1]);
    // var config = {
    //   headers: {
    //     Authorization: "Bearer " + this.state.token,
    //     Accept: "application/json",
    //     "Content-Type": "application/json"
    //   }
    // };
    // axios
    //   .put(
    //     "http://localhost:8025/api/korisnici/potvrdaRegistracije/" +
    //       paths[paths.length - 1],
    //     config
    //   )
    //   .then(Response => {})
    //   .catch(error => {
    //     console.log("klinika nije preuzeta");
    //   });
  }

  promeniLozinku(){
    const uloga = this.state.uloga;
    if (uloga === "ADMIN_KC") {
      //izmena lozinke 
      console.log("admin kc")
      axios
      .put(
        "http://localhost:8025/api/administratoriKC/promeniLozinku",
        {
          newPassword: this.state.promenaLozinke,
          oldPassword: this.state.lozinka
        },
        this.config
      )
      .then(response => {

        console.log(response.data);
        console.log("ispisssssss lozinke")
        this.setState({
          mozemoDalje: true,
          lozinka: this.state.promenaLozinke
        }, ()=> {
          console.log(this.state.lozinka)
          console.log(this.state.uloga);
          console.log(this.state.mozemoDalje);
        })
        
      })
      .catch(error => {
        console.log("Izmena nije uspela! ");
      });

    
    }
    if (uloga === "ADMIN_KLINIKE") {
        //izmena lozinke
        console.log("admin klinike")
        
      axios
      .put(
        "http://localhost:8025/api/adminKlinike/promeniLozinku",
        {
          newPassword: this.state.promenaLozinke,
          oldPassword: this.state.lozinka
        },
        this.config
      )
      .then(response => {

        console.log(response.data);
        console.log("ispisssssss lozinke")
        this.setState({
          mozemoDalje: true,
          lozinka: this.state.promenaLozinke
        }, ()=> {
          console.log(this.state.lozinka)
          console.log(this.state.uloga);
          console.log(this.state.mozemoDalje);
        })

      })
      .catch(error => {
        console.log("Izmena nije uspela! ");
      });
      
    }
    if (uloga === "LEKAR" ) {
      console.log("lekar")
      axios
      .put(
        "http://localhost:8025/api/lekari/promeniLozinku",
        {
          newPassword: this.state.promenaLozinke,
          oldPassword: this.state.lozinka
        },
        this.config
      )
      .then(response => {
        console.log(response.data);
        console.log("ispisssssss lozinke")
        this.setState({
          mozemoDalje: true,
          lozinka: this.state.promenaLozinke
        }, ()=> {
          console.log(this.state.lozinka)
          console.log(this.state.uloga);
          console.log(this.state.mozemoDalje);
        })
        
      })
      .catch(error => {
        console.log("Izmena nije uspela! ");
      });
      
    }
    if (uloga === "MED_SESTRA" ) {
      console.log("med sestra")
      axios
      .put(
        "http://localhost:8025/api/medicinskaSestra/promeniLozinku",
        {
          newPassword: this.state.promenaLozinke,
          oldPassword: this.state.lozinka
        },
        this.config
      )
      .then(response => {
        console.log(response.data);
        console.log("ispisssssss lozinke")
        this.setState({
          mozemoDalje: true,
          lozinka: this.state.promenaLozinke
        }, ()=> {
          console.log(this.state.lozinka)
          console.log(this.state.uloga);
          console.log(this.state.mozemoDalje);
        })
       
       
      })
      .catch(error => {
        console.log("Izmena nije uspela! ");
      });
      
    }


    
    
  };

  render() {
   
    const email = this.state.email;
    const uloga = this.state.uloga;
    const token = this.state.token;
    const lozinka = this.state.lozinka;
    const mozemoDalje = this.state.mozemoDalje;

      if (uloga === "ADMIN_KC" && mozemoDalje === true) {
        return (
          <BrowserRouter>
            <Switch>
              <Route
                path="/kc"
                render={props => (
                  <KlinickiCentar
                    {...props}
                    email={email}
                    uloga={uloga}
                    token={token}
                    lozinka={lozinka}
                  />
                )}
              />
              <Redirect from="/" to="/kc/klinickiCentar" />
            </Switch>
          </BrowserRouter>
        ); 

      }
      if (uloga === "ADMIN_KLINIKE" && mozemoDalje === true) {
        return (
          <BrowserRouter>
          <Switch>
            <Route
              path="/admink"
              render={props => (
                <AdministatorKlinike
                  {...props}
                  email={email}
                  uloga={uloga}
                  token={token}
                  lozinka={lozinka}
                />
              )}
            />
            <Redirect from="/" to="/admink/pocetnaStranica" />
          </Switch>
        </BrowserRouter>
      );  
                
              
              

        
      }
      if (uloga === "LEKAR" && mozemoDalje === true) {
        
        return (
          <BrowserRouter>
            <Switch>
              <Route
                path="/lekar"
                render={props => (
                  <Lekar {...props} email={email} uloga={uloga} token={token} lozinka={lozinka} />
                )}
              />
              <Redirect from="/" to="/lekar/pocetnaStranica" />
            </Switch>
          </BrowserRouter>
        );
              
              
        
      }
      if (uloga === "MED_SESTRA" && mozemoDalje === true) {
        return (
          <BrowserRouter>
            <Switch>
              <Route
                path="/medses"
                render={props => (
                  <MedicinskaSestra
                    {...props}
                    email={email}
                    uloga={uloga}
                    token={token}
                    lozinka={lozinka}
                  />
                )}
              />
              <Redirect from="/" to="/medses/pocetnaStranica" />
            </Switch>
          </BrowserRouter>
        );
              
              
          
      }
      
    

    return (
      <div>
        <div className="logForm">
          <div className="form-logForm">

            <h1>Promenite lozinku</h1>
            <div>
           
                <div className="lozinka">
                <label htmlFor="lozinka">Lozinka:* </label>
                <input
                  type="password"
                  name="promenaLozinke"
                  placeholder="Lozinka"
                  noValidate
                  onChange={this.handleChange}
                />
                
              </div>

                <div className="potvrdaLozinke">
                <label htmlFor="potvrdaLozinke">Potvrdi lozinku:* </label>
                <input
                  type="password"
                  name="potvrdaLozinke"
                
                  placeholder="Potvrdi lozinku"
                  noValidate
                  onChange={this.handleChange}
                />
                
                {/* {this.state.poklapanjeLozinke === false && (
                  <span className="errorMessage">Lozinke se ne poklapaju</span>
                )} */}
              </div>
               
                <div className="signIn">
                
                <button onClick={(e) => this.logovanje(e)}>Uloguj se</button>

                </div>
           
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default prvoLogovanje;
