
import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col, Table } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";


import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
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
import Slikalekari from "assets/img/lekari.jpg";
import slikaPregledi from "assets/img/pregled.jpg"
import slikaSala from "assets/img/sala.jpg"
import slikaST from "assets/img/lekari.jpg"
import Login from "login.js";
import axios from "axios";
import Geocode from "react-geocode";

import { YMaps, Map, Placemark, GeoObject } from 'react-yandex-maps';


class PocetnaStranicaAdminaKlinike extends React.Component {
  constructor(props){
    super(props);
    console.log("POCETNA STRANICA ADMINA KLINIKE");
    console.log(this.props);
    console.log("TOKEN"  + this.props.token);
    this.state = {
      email: props.email,
      uloga: props.uloga, 
      token: props.token,
      ime: "",
      telefon: "",
      prezime: "",
      idKlinike: "",
      naziv: "",
      adresa: "",
      opis: "",
      ocena: "",
      lozinka: "",
      listaPacijenata:[],
      redirectToListaLekara: false,
      redirectToListaSala: false,
      redirectToSlobodniTermini: false,
      redirectToListaPregleda: false,
      
    };
   // this.listaPacijenataLekara = this.listaPacijenataLekara.bind(this);
   this.handleListaLekara = this.handleListaLekara.bind(this);
   this.handleListaSala = this.handleListaSala.bind(this);
  this.handleSlobodniTermini = this.handleSlobodniTermini.bind(this);
  this.handleLisaPregleda = this.handleLisaPregleda.bind(this);
  console.log(this.state.token);
}



  componentWillMount(){
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
   
    
    console.log("wmount")
    console.log("Preuzimanje admina klinike.....")
    // console.log("TOKEN: "  + this.state.token)
   
    const url = 'http://localhost:8025/api/adminKlinike/getAdminKlinikeByEmail';

    axios.get(url, config)
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
        axios.get('http://localhost:8025/api/pregledi', config)
        .then(res => 
          {console.log(res)});
        console.log(this.state);
        console.log("Id klinike: " + this.state.idKlinike);
        console.log("******Id klinike: " + this.state.idKlinike);
        console.log("ucitaj mi kliniku");
        const urlKlinike = 'http://localhost:8025/api/klinike/' + this.state.idKlinike;    
        console.log(urlKlinike);
        axios.get(urlKlinike, config)
          .then(klinika => {
            console.log("Preuzeta klinika");
            console.log(klinika.data);
   
            this.setState({
              naziv: klinika.data.naziv,
              adresa: klinika.data.adresa,
              opis: klinika.data.opis,
              ocena: klinika .data.ocena,
             
            }, ()=>{
              // Geocode.setLanguage("sr");
 
              // // set response region. Its optional.
              // // A Geocoding request with region=es (Spain) will return the Spanish city.
              // Geocode.setRegion("RS");
               
              // // Enable or disable logs. Its optional.
              // Geocode.enableDebug();
              // console.log("********* LOKACIJA *****************");
              // Geocode.fromAddress(this.state.adresa).then(
              //   response => {
              //     console.log(response)
              //     // const { lat, lng } = response.results[0].geometry.location;
              //     // console.log(lat, lng);
              //   },
              //   error => {
              //     console.error("LOKACIJA GRESKAAAAAAAAAAAAA");
              //   }
              // );

              
            });
       
          })
          
      .catch(error => {
        console.log("Klinika nije preuzeta!!!!")
      })
      
      })
      
      .catch(error => {
        console.log("Administrator klinike  nije preuzet")
      })

      //za kliniku ovdje
    
  }

  handleListaLekara() {

    console.log("REDIREKCIJA NA LISTU LEKARA");
    this.setState({
      redirectToListaLekara: true
    });

  }
  
  handleLisaPregleda() {

    console.log("REDIREKCIJA NA LISTU Pregleda");
    this.setState({
      redirectToListaPregleda: true
    });

  }

  handleListaSala() {
    console.log("REDIREKCIJA NA LISTU SALAAA");
    this.setState({
      redirectToListaSala: true
    }, () => console.log(this.state.redirectToListaSala)
    
    );

  }
  handleSlobodniTermini() {
    
    console.log("REDIREKCIJA NA Slobodne termine");
    this.setState({
      redirectToSlobodniTermini: true
    });

 
    
  }
  renderRedirect = () => {
    // console.log("aaaaaaa")
    if(this.state.redirectToListaLekara){
      return <Redirect from="/" to="/admink/lekari"/>;
    }else  if(this.state.redirectToListaSala){
      console.log("redirect SALA//////////////")
      return <Redirect from="/" to="/admink/Sale"> </Redirect>
    }else if(this.state.redirectToSlobodniTermini){
      return <Redirect from="/" to="/admink/slobodniTermini"></Redirect>
    }else if(this.state.redirectToListaPregleda){
      return <Redirect from="/" to="/admink/Pregledi"></Redirect>
    }
  };

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


//   listaPacijenataLekara(){
//     let res=[];
//     let lista = this.state.listaPacijenata;
//     for(var i=0; i< lista.length;i++){
//       console.log( "Pacijent : "  + lista[i].email);
//       this.state.emailPacijenta = lista[i].email;
//       console.log(this.state.emailPacijenta);
//       res.push(
       
//         <tr key = {i}>
//           {/* <td key={lista[i].id}>{lista[i].id}</td>
//           <td key={lista[i].naziv}>{lista[i].ime}</td>
//           <td key={lista[i].adresa}>{lista[i].prezime}</td>
//           <td key={lista[i].opis}>{lista[i].email}</td> */}
//           <td key={lista[i].id}>{lista[i].id}</td>
//           <td>{lista[i].ime}</td>
//           <td>{lista[i].prezime}</td>
//           <td key={lista[i].email}>{lista[i].email}</td>
//           <td onClick={this.handleClick} ><button> Prikazi profil </button></td>
//           {/* <td><link to="/admin/login">Prikazi profil</link></td> */}
//          {/* <td key={lista[i].ocena}>{lista[i].ocena}</td> */}
     
//          </tr>
//       )
//     }
//     return res;
//   }


  render() {
    // console.log("Ispisi  props u pocetna stranica lekara: "); 
    // console.log(this.props);

    const redirectToListaLekara = this.state.redirectToListaLekara;
 
    const redirectToProfilPacijenta = this.state.redirectToProfilPacijenta;

    const email = this.state.email;
    const uloga = this.state.uloga;
    const ime = this.state.ime;
    const prezime = this.state.prezime;
    const telefon = this.state.telefon;
    const idKlinike = this.state.idKlinike;
    const naziv = this.state.naziv;
    const adresa = this.state.adresa;
    const opis = this.state.opis;
    const ocena = this.state.ocena;
    console.log(this.state.adresa);
    console.log("////////////////////////////////////////////////////")

 
    // console.log(nazivKlinike);
    // console.log(telefon);
    // console.log("Render ps email: " + email);
    // console.log("Render ps uloga: " + uloga);
    // console.log("Render ps ime: " + ime);
    // console.log("Render ps prezime: " + prezime);
    // console.log("Render ps telefon: " + telefon)

    // if (redirectToProfilPacijenta === true) {
    //   return (
    //     <BrowserRouter>
    //       <Switch>
    //         <Route
    //           path="/profilPacijenta"
    //           render={props => <ProfilPacijenta {...props} emailPacijenta={emailPacijenta} />}
    //         />
    //         <Redirect from="/" to="/profilPacijenta" />
    //       </Switch>
    //     </BrowserRouter>
    //   );
    // }

    
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
                      <h2> 
                        <img className="slikaLekar" src={slikaLekar}></img>
                      </h2>
                    </div> */}
                    <div className="typo-line">
                      <h2>
                        <p className="category">Ime:</p>
                        <label className="adresaKC"> {this.state.ime} </label>
                      </h2>
                    </div>
                    <div className="typo-line">
                      <h2>
                        <p className="category">Prezime:</p>
                        <label className="adresaKC">{this.state.prezime} </label>
                      </h2>
                    </div>
                    <div className="typo-line">
                      <h2>
                        <p className="category">Telefon:</p>
                <label className="adresaKC">{this.state.telefon}</label>
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
            <Col md={5}>
              <Card
              
                title="Klinika"
                // category="24 Hours performance"
                // stats="Updated 3 minutes ago"
             //   ctTableFullWidth
               // ctTableResponsive
                content={
                  <div id="a">
                    <div className="typo-line">
                      <h2>
                        <p className="category">Naziv klinike:</p>
                        <label className="adresaKC"> {this.state.naziv} </label>
                      </h2>
                    </div>
                    <div className="typo-line">
                      <h2>
                        <p className="category">Adresa:</p>
                        <label className="adresaKC"> {this.state.adresa} </label>
                      </h2>
                    </div>
                    <div className="typo-line">
                      <h2>
                        <p className="category">Opis:</p>
                        <label className="adresaKC">{this.state.opis} </label>
                      </h2>
                    </div>
                    <div className="typo-line">
                      <h2>
                        <p className="category">Ocena:</p>
                        <label className="adresaKC">{this.state.ocena}</label>
                      </h2>
                    </div>
                    
                    
                    
                  </div>
                }
                // legend={
                //   <div className="legend">{this.createLegend(legendSales)}</div>
                // }
              />
            </Col>
            <Row>
            <Col md={3}>
            {this.renderRedirect()}
              <div onClick={this.handleLisaPregleda}>
              <StatsCard
                bigIcon={<div> <img src = { slikaPregledi} width="30" height="20" /></div>}
                // statsText="Lista pacijenata"
                // statsValue="105GB"
                // statsIcon={<i className="fa fa-refresh" />}
                 statsIconText="Pregledi"
              />
              </div>
          </Col>
            {/* <h1>{this.state}</h1> */}
          <Col md={3}>
              {this.renderRedirect()}
              <div onClick={this.handleListaLekara}>
              <StatsCard
                bigIcon={<div> <img src = { Slikalekari} width="30" height="20" /></div>}
                // statsText="Pocetak pregleda"
                // statsValue="$1,345"
                // statsIcon={<i className="fa fa-calendar-o" />}
                 statsIconText="Lekari"
              />
              </div>
            </Col>
            {/* <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                // statsText="Profil korisnika"
                // statsValue="23"
                // statsIcon={<i className="fa fa-clock-o" />}
                 statsIconText="Profil korisnika"
              />
            </Col> */}
            <Col md={3}>
            {this.renderRedirect()}
              <div onClick={this.handleListaSala}>
              <StatsCard
                bigIcon={<div> <img src = { slikaSala} width="30" height="20" /></div>}
                // statsText="Profil korisnika"
                // statsValue="23"
                // statsIcon={<i className="fa fa-clock-o" />}
                 statsIconText="Sale"
              />
             </div>
            </Col>
            <Col md={3}>

              {this.renderRedirect()}
              <div onClick={this.handleSlobodniTermini}>

              <StatsCard
                bigIcon={<div> <img src = { slikaST} width="30" height="20" /></div>}
                // statsText="Profil korisnika"
                // statsValue="23"
                // statsIcon={<i className="fa fa-clock-o" />}
                 statsIconText="Slobodni termini"
              />
            </div>
            </Col>
            {/* <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-twitter text-info" />}
                statsText=""
                // statsValue="+45"
                // statsIcon={<i className="fa fa-refresh" />}
                 statsIconText="Zakazivanje pregleda i operacija"
              />
            </Col> */}
          </Row>
          </Row>

          <Row>
       
          <YMaps>
              <div>

                  <Map state={{ center: [44.786568, 20.448921], zoom: 5 }}  query={{ lang: 'en_US' }}>
                      <GeoObject

                          geometry={{
                              type: 'Point',
                              coordinates: ["Beograd", "Beograd"],
                          }}

                          properties={{
                              iconContent: 'Lokacija',
                              hintContent: 'Lokacija',
                          }}

                      />
                  </Map>

              </div>
          </YMaps>    
          </Row>
        </Grid>
      </div>
    );
  }
}

export default PocetnaStranicaAdminaKlinike;
