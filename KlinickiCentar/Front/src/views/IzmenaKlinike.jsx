import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import "izmenaProfila.css";

//dodam link za sliku  mozda od doktora!!
// import avatar from "assets/img/faces/face-3.jpg";
import "login.js";
import { log } from "util";
import Login from "login";
import slikaLekar from "assets/img/images.jpg"
import axios from "axios";
import { copyFile } from "fs";

class IzmenaKlinike extends Component {
  constructor(props){
    super(props);
    console.log("IZMENA KLINIKE");
    this.state = {
      email: props.email,
      token: props.token,
      idKlinike: "",
      naziv: "",
      adresa: "",
      opis: "",
      ocena: "",
      id: "",
    }

  }


  componentWillMount(){
    console.log("wmount")
    console.log("Preuzimanje admina klinike.....")
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const url1 = 'http://localhost:8025/api/adminKlinike/getAdminKlinikeByEmail';
    axios.get(url1, config)
      .then(Response => {
        console.log("Preuzet admin klinike: ");
        console.log(Response.data);

        this.setState({
          email: Response.data.email,
          ime: Response.data.ime,
          prezime: Response.data.prezime,
          telefon: Response.data.telefon,
          idKlinike: Response.data.idKlinike,
        });
        console.log("wmount!!!!");
        const url = 'http://localhost:8025/api/klinike/' + this.state.idKlinike;
        axios.get(url, config)
          .then(Response => {
            console.log("Preuzeta klinike: ");
            console.log(Response.data);
          
            this.setState({
              id: Response.data.id,
              naziv: Response.data.naziv,
              adresa: Response.data.adresa,
              ocena: Response.data.ocena,
              opis: Response.data.opis,
            });
    
          })
          
          .catch(error => {
            console.log("klinika nije preuzeta")
          })
    })
      
    .catch(error => {
        console.log("Administrator klinike  nije preuzet")
    })

   
  }
  handleChange = e => {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value});
    console.log(this.state)
    console.log("On change !!!")

  };
  
  handleSumbit = e => {
    e.preventDefault();
    console.log("KLIK SUBMITTT")
    // let formErrors = { ...this.state.formErrors };
      console.log("Izmjena klinike: ---------------")  
      console.log(this.state.naziv);
      console.log(this.state.idKlinike);
      console.log(this.state.id);
      var config = {
        headers: {
          Authorization: "Bearer " + this.state.token,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      };
    axios
      .put("http://localhost:8025/api/klinike/update", {
        id: this.state.id,
        naziv: this.state.naziv,
        adresa: this.state.adresa,
        ocena: this.state.ocena,
        opis: this.state.opis
      }, config)
      .then(response => {
        console.log(response.data);
        this.setState({
          id: response.data.id,
          naziv: response.data.naziv,
          adresa: response.data.adresa,
          ocena: response.data.ocena,
          opis: response.data.opis
        });
      })
      .catch(error => {
        console.log("Izmena nije uspela! ")
      });
  };

  render() {
    const idKlinike = this.state.idKlinike;
    const id = this.state.id;
    const naziv = this.state.naziv;
    const adresa = this.state.adresa;
    const opis = this.state.opis;
    const ocena = this.state.ocena;
 


    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={8}>
              <Card
                title="Izmena podataka"
                content={
                  <form onSubmit={this.handleSumbit} className="formaIzmenaProfilaLekara">
                     <div className="ime">
                        <label htmlFor="naziv">Naziv: </label>
                        <input
                          type="text"
                          name="naziv"
                          
                          defaultValue={naziv}
                          // placeholder={this.state.ime}
                          // noValidate
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="ime">
                        <label htmlFor="adresa">Adresa: </label>
                        <input
                          type="text"
                          name="adresa"
                          defaultValue={adresa}
                          // placeholder="prezime"
                          // noValidate
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="ime">
                        <label htmlFor="opis">Opis: </label>
                        <input
                          type="text"
                          name="opis"
                          defaultValue={opis}
                          // placeholder="prezime"
                          // noValidate
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="ime">
                        <label htmlFor="ocena">Ocena: </label>
                        <input
                          type="text"
                          name="ocena"
                          defaultValue={ocena}
                          disabled="disabled"
                          // placeholder="prezime"
                          // noValidate
                          onChange={this.handleChange}
                        />
                      </div>
                     
                      {/* <div className="klinikaK">
                        <label htmlFor="klinikaK">klinika: </label>
                        <input
                          type="text"
                          name="klinikaK"
                          placeholder="klinikaK"
                          // noValidate
                          // onChange={this.handleChange}
                        />
                      </div> */}
                      {/* <div className="klinika">
                        <label htmlFor="klinika">Klinika: </label>
                        <input
                          type="text"
                          name="klinika"
                          placeholder="klinika"
                          // noValidate
                          // onChange={this.handleChange}
                        />
                      </div> */}
                     
                      <div className="izmeniPodatkePacijent">
                         <Button type="submit">Izmeni podatke</Button>
                      </div>
                  </form>
           
                }
              />
            </Col>
            <Col md={4}>
            <Card
                // statsIcon="fa fa-clock-o"
                title="O klinici"
                // category="Ime"
                content={
                  <div id="a">
                 
                    
                    <div className="typo-line">
                      <h2>
                        <p className="category">Naziv:</p>
                <label className="adresaKC">{this.state.naziv}</label>
                      </h2>
                    </div>
                    <div className="typo-line">
                      <h2>
                        <p className="category">Adresa:</p>
                        <label className="opisKC">{this.state.adresa}</label>
                      </h2>
                    </div>
                    
                    <div className="typo-line">
                      <h2>
                        <p className="category">Opis:</p>
                        <label className="opisKC">{this.state.opis}</label>
                      </h2>
                    </div>
                    
                    <div className="typo-line">
                      <h2>
                        <p className="category">Ocena::</p>
                        <label className="opisKC">{this.state.ocena}</label>
                      </h2>
                    </div>
                    
                  </div>
                }
                
                // category="opis ... naziv adresa i opis  "
                // stats="Campaign sent 2 days ago"
                // content={
                //   <div
                //     id="chartPreferences"
                //     className="ct-chart ct-perfect-fourth"
                //   >
                //     <ChartistGraph data={dataPie} type="Pie" />
                //   </div>
                // }
                // legend={
                //   <div className="legend">{this.createLegend(legendPie)}</div>
                // }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default IzmenaKlinike;
