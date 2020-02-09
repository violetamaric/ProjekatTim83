
import React, { Component } from "react";
import { Grid, Row, Col, Table , NavItem, Nav, NavDropdown, MenuItem} from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import ProfilPacijenta from "views/ProfilPacijenta.jsx"
import Button from "components/CustomButton/CustomButton.jsx";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";
import events from "events.js";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css"; 
import Slikalekari from "assets/img/lekari.jpg";
import slikaPregledi from "assets/img/pregled.jpg"
import kalendarSlika from "assets/img/calendar.png"
import moment from 'moment';
import Pregled from "views/Pregled.jsx";
 

const localizer = momentLocalizer(moment);


class PocetnaStranicaLekara extends React.Component {
  constructor(props){
    super(props);
    console.log("POCETNA STRANICA LEKARA");
    console.log(props);
    this.state = {
      email: props.email,
      uloga: props.uloga, 
      token: props.token,
      ime: "",
      telefon: "",
      prezime: "",
      lbo: "",
      klinikaID: "", 
      listaPacijenata:[],
      redirectToProfilPacijenta: false,
      emailPacijenta: "",
      pretraziPolje: "",
      redirectToListaPacijenata: false,
      redirectToProfilLekara: false,
      redirectToZahtevZaGodOdmor: false,
      redirectToZakazivanjePregleda: false,
      listaPregleda: [],
      preglediUKalendaru: [],
      listaOdmorOdsustvo: [],
      odmorodsustvoUKalendaru: [],
      dogadjajiKalendar: [],
      isOdmorOdsustvo: false,
      isPregled: false,
      isOperacija: false,
      objekat: null,
      redirectToPregled: false, 
      listaOperacija: []
    };
    this.config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
    this.listaPacijenataLekara = this.listaPacijenataLekara.bind(this);

    this.handleListaPacijenata = this.handleListaPacijenata.bind(this);
    this.handleProfilLekara = this.handleProfilLekara.bind(this);
    this.handleZahtevZaGodOdmor = this.handleZahtevZaGodOdmor.bind(this);
    this.handleZakazivanjePregleda = this.handleZakazivanjePregleda.bind(this);
    this.preuzimanjeLekara = this.preuzimanjeLekara.bind(this);

    // this.dodavanjeListePregledaUKalendar = this.dodavanjeListePregledaUKalendar.bind(this);
    this.ucitavanjeListeOdmorOdsustvo = this.ucitavanjeListeOdmorOdsustvo.bind(this);
    // this.ucitavanjeListePregleda = this.ucitavanjeListePregleda.bind(this);
    // this.dodavanjeListeOdmorOdsustvoUKalendar = this.dodavanjeListeOdmorOdsustvoUKalendar.bind(this);
    this.dodavanjeListaUKalendar = this.dodavanjeListaUKalendar.bind(this);
    // this.ucitavanjeListeOperacija = this.ucitavanjeListeOperacija.bind(this);

  }

  handleClick = e => {
    e.preventDefault();
    console.log("CLICK *** ");  
    console.log("PPPPPPPPPPPP: " + e.target.id);
    // this.props.onClick(this.props.value);
    // console.log(e.lista.email);
    console.log("prikaz profila pacijenta");
    this.setState({
      redirectToProfilPacijenta: true,
      emailPacijenta: e.target.id,
  
    });
    console.log("----------------------------------------------------");
    console.log(this.state.emailPacijenta);
  };

  preuzimanjeLekara(){
    const url = 'http://localhost:8025/api/lekari/getLekarByEmail';
    axios.get(url, this.config)
      .then(Response => {
        console.log("Preuzet lekar: //////////////////////////////////////////");
        console.log(Response.data);
        this.setState({
          email: Response.data.email,
          klinikaID: Response.data.klinikaID,
          ime: Response.data.ime,
          prezime: Response.data.prezime,
          telefon: Response.data.telefon
        });
        // //PREUZIMANJE PACIJENATA KLINIKE
        // console.log("Klinika id: " + this.state.klinikaID);
        // const url1 = 'http://localhost:8025/api/klinike/pacijentiKlinike/' + this.state.klinikaID; 
        // console.log(url1);
        // axios.get(url1, this.config)
        //   .then(response => {
        //     console.log("URL 111");
        //     console.log(response);
        //     this.setState({
        //       listaPacijenata: response.data
        //     });
        //   })
        //   .catch(error => {
        //       console.log("nisu preuzeti pacijenti klinike");
        //       console.log(error);
        //   })

       
      })
      
      .catch(error => {
        console.log("Lekar  nije preuzet")
      })
  }
  ucitavanjeListeOdmorOdsustvo(){
    const url1 = 'http://localhost:8025/api/lekari/listaOdmorOdsustvo';
    console.log(url1);
    axios
      .get(url1, this.config)
      .then(response => {
        console.log("ucitana lista odmor odsustvo");
        console.log(response);
        this.setState({
          listaOdmorOdsustvo: response.data
        },()=>{
          axios.get("http://localhost:8025/api/pregledi/getPreglediLekara", this.config)
          .then(response => {
            console.log("PREUZETI PREGLEDI");
            
            console.log(response.data)
            this.setState({
              listaPregleda: response.data
            },()=> {
              axios.get("http://localhost:8025/api/operacije/operacijeLekara", this.config)
              .then(response => {
                console.log("PREUZETE OPERACIJE");
              
                console.log(response.data)
                this.setState({
                  listaOperacija: response.data
                }
                , ()=> this.dodavanjeListaUKalendar()
                );
                
              })
              .catch(error => {
                  console.log("nisu preuzete operacije");
                  console.log(error);
              })

            } );
            
          })
          .catch(error => {
              console.log("nisu preuzeti pregledi");
              console.log(error);
          })

        });
      })
      .catch(error => {
        console.log("nije ucitana lista odmor odsustvo");
        console.log(error);
      });
    
  
  };
//   
 
  dodavanjeListaUKalendar(){
    //treba dodati i jednu i drugu listu hahahha 
    this.state.dogadjajiKalendar = [];

    let lista = this.state.listaPregleda;
    if(lista.length != 0){
      for(var i = 0; i < lista.length; i++){
        // console.log("datum!!!")
        // console.log(i);
        let start = new Date(lista[i].datum);
        let end = new Date(lista[i].datum);
      
        start.setHours(lista[i].termin);
        end.setHours(lista[i].termin + 2);
        // let kraj = new Date(lista[i].datum);
        // console.log(kraj.getFullYear());
        // console.log(kraj.getMonth())   
        // console.log(kraj.getDate());
        // console.log(kraj.getHours());
        // console.log(lista[i].termin);
        
        this.state.dogadjajiKalendar.push(
          {
            // id: i,
            title: lista[i].nazivTP ,
            start: start ,
            end: end,
            desc: lista[i],
            up_down_ind: "Y",
            
          }
        )
        
         
      }
    }

    let lista3 = this.state.listaOperacija;
    if(lista3.length != 0){
      for(var i = 0; i < lista3.length; i++){
        // console.log("datum!!!")
        // console.log(i);
        
        let start = new Date(lista3[i].datum) ; 
        let end = new Date(lista3[i].datum);
        // console.log(start);
        // console.log(end);
        start.setHours(lista3[i].termin);
        end.setHours(lista3[i].termin + 2);

        this.state.dogadjajiKalendar.push(
          {
            // id: i,
            title: "OPERACIJA" ,
            start: start ,
            end: end,
            desc: lista3[i],
            up_down_ind: "Y",
            
          }
        )
        
         
      }
    }
    let lista2 = this.state.listaOdmorOdsustvo;
    if(lista2.length != 0){
      for(var i = 0; i < lista2.length; i++){
        // console.log(i);
        let start2 = new Date(lista2[i].datumOd);
        let end2 = new Date(lista2[i].datumDo);
        this.state.dogadjajiKalendar.push(
          {
            // id: i,
            title: lista2[i].tip,
            start: start2,
            end: end2,
            desc: lista2[i],
            up_down_ind: "Y",
          }
        )
      }
    }
   
  }

  componentWillMount(){
    this.preuzimanjeLekara();
    // this.ucitavanjeListePregleda();
    this.ucitavanjeListeOdmorOdsustvo();
    this.dodavanjeListaUKalendar();
    // this.ucitavanjeListeOperacija();
  }


  

  handleChange = e => {
      e.preventDefault();
      this.setState({ [e.target.name]: e.target.value });
      console.log(this.state);
      console.log("On click !!!");
  };

  listaPacijenataLekara(){
    let res=[];
    let lista = this.state.listaPacijenata;
    const pretraga = this.state.pretraziPolje;
    if (pretraga == "" || pretraga == undefined){
      for(var i=0; i< lista.length;i++){
        console.log( "Pacijent : "  + lista[i].email);

        res.push(
        
          <tr key = {i}>
            {/* <td key={lista[i].id}>{lista[i].id}</td>
            <td key={lista[i].naziv}>{lista[i].ime}</td>
            <td key={lista[i].adresa}>{lista[i].prezime}</td>
            <td key={lista[i].opis}>{lista[i].email}</td> */}
            <td key={lista[i].id}>{lista[i].id}</td>
            <td>{lista[i].ime}</td>
            <td>{lista[i].prezime}</td>
            <td>{lista[i].lbo}</td>
            <td key={lista[i].email}>{lista[i].email}</td>
            <td ><Button className="OdobrenZahtev"
                id={lista[i].email}
                onClick={e => this.handleClick(e)}> Prikazi profil </Button></td>
            {/* <td><link to="/admin/login">Prikazi profil</link></td> */}
          {/* <td key={lista[i].ocena}>{lista[i].ocena}</td> */}
      
          </tr>
        );
      }
  }else{
    console.log(pretraga);
    let lista = this.state.listaPacijenata;
    for (var i = 0; i < lista.length; i++) {
      var lbo = lista[i].lbo;
      var ime = lista[i].ime;
      var prezime = lista[i].prezime;

      if(lbo.toLowerCase().includes(pretraga.toLowerCase()) || 
      ime.toLowerCase().includes(pretraga.toLowerCase()) ||
      prezime.toLowerCase().includes(pretraga.toLowerCase()) ){
        res.push(
          <tr key = {i} >
      <td>{lista[i].ime}</td>
            <td>{lista[i].prezime}</td>
            <td>{lista[i].lbo}</td>
            <td >{lista[i].email}</td>
            
            <td ><Button className="OdobrenZahtev"
                id={lista[i].email}
                onClick={e => this.handleClick(e)}> Prikazi profil </Button></td>
          
          </tr>
        );
      }
    }
  }
    return res;
  }
  


  renderRedirect = () => {
  
    if(this.state.redirectToListaPacijenata){    
      return <Redirect from="/" to="/lekar/listaPacijenataLekar"></Redirect>
    }else if(this.state.redirectToProfilLekara){
      return <Redirect from="/" to="/lekar/izmenaProfilaLekara"></Redirect>
    }else if(this.state.redirectToZahtevZaGodOdmor){
      return <Redirect from="/" to="/lekar/zahtevLekar"></Redirect>
    }
    //nije napravljeno
    // else if(this.state.redirectToZakazivanjePregleda){
    //   return <Redirect from="/" to="/admin/zakazivanjePregleda"></Redirect>
    // }
  };

  handleListaPacijenata() {
    this.setState({
      redirectToListaPacijenata: true,
    });
  };
  handleProfilLekara() {
    this.setState({
      redirectToProfilLekara: true,
    });
  };
  handleZahtevZaGodOdmor(){
    this.setState({
      redirectToZahtevZaGodOdmor: true,
    });
  };
  handleZakazivanjePregleda(){
    this.setState({
      redirectToZakazivanjePregleda: true,
    });
  }
  

  render() {
  
 
    if (this.state.redirectToPregled === true) {
      return (
        <BrowserRouter>
          <Switch>
            <Route
              path="/pregled"
              render={props => <Pregled {...props}
              token={this.state.token}
              handleClick={this.props.handleClick}
              email={this.state.email} 
              uloga={this.state.uloga}
              idPregleda ={this.state.objekat.desc.id}
              emailPacijenta={this.state.objekat.desc.pacijentID}   />}
            />
            <Redirect from="/" to="/pregled" />
          </Switch>
        </BrowserRouter>
      );
    }
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={3} sm={6}>
            {this.renderRedirect()}
              <div onClick={this.handleListaPacijenata}>
                <StatsCard
                  //bigIcon={<div> <img src = { kalendarSlika} width="30" height="20" /></div>}
                  // statsText="Lista pacijenata"
                  // statsValue="105GB"
                  // statsIcon={<i className="fa fa-refresh" />}
                  statsIconText="Lista pacijenata"
                />
              </div>
              
            </Col>
            <Col lg={3} sm={6}>
            {this.renderRedirect()}
              <div onClick={this.handleProfilLekara}>
                <StatsCard
                 //  bigIcon={<div> <img src = { slikaPregledi} width="30" height="20" /></div>}
                  // statsText="Lista pacijenata"
                  // statsValue="105GB"
                  // statsIcon={<i className="fa fa-refresh" />}
                  statsIconText="Izmena profila"
                />
              </div>
             
            </Col>
            <Col lg={3} sm={6} >
              {this.renderRedirect()}
              <div onClick={this.handleZahtevZaGodOdmor}>
                <StatsCard
                  // bigIcon={<div> <img src = { Slikalekari} width="30" height="20" /></div>}
                  // statsText="Lista pacijenata"
                  // statsValue="105GB"
                  // statsIcon={<i className="fa fa-refresh" />}
                  statsIconText="Zahtev za odmor/odsustvo"
                />
              </div>

              
            </Col>
            {/* <Col lg={3} sm={6}>
              {this.renderRedirect()}
              <div onClick={this.handleZakazivanjePregleda}>
                <StatsCard
                  bigIcon={<div> <img src = { slikaPregledi} width="30" height="20" /></div>}
                  // statsText=""
                  // statsValue="+45"
                  // statsIcon={<i className="fa fa-refresh" />}
                  statsIconText="Zakazivanje pregleda i operacija"
                />
              </div>
             
            </Col> */}
          </Row>
          <Row>
          <Col >
              <Card
                title="Kalendar"
                // category="24 Hours performance"
                // stats="Updated 3 minutes ago"
                content={
                  <Grid fluid>
                    <Row>
                    {
                      this.state.isOdmorOdsustvo ?
                      
                          <Card
                            // category="Dogadjaj"
                            ctTableFullWidth
                            ctTableResponsive
                            content={
                              <div>
                                
                                <div className="dogadjaj" >
                                  <label className="dogadjaj1">Dogadjaj: </label>
                                  <label className="dogadjaj2">{this.state.objekat.title}</label>  
                                </div>
                                <div className="dogadjaj" >
                                  <label className="dogadjaj1">Opis: </label>
                                  <label className="dogadjaj2">{this.state.objekat.desc.opis}</label>
                                </div>
                                <div className="dogadjaj" >
                                  <label className="dogadjaj1">Pocetak: </label>
                                  <label className="dogadjaj2">{moment(this.state.objekat.start).format("DD.MM.YYYY.")}</label>
                                </div>
                                <div className="dogadjaj" >
                                  <label className="dogadjaj1">Kraj: </label>
                                  <label className="dogadjaj2">{moment(this.state.objekat.end).format("DD.MM.YYYY.")}</label>
                                  
                                </div>
                                <Button className="izlaz" 
                                 onClick={()=>  this.setState({
                                    isPregled: false, 
                                   isOperacija: false,
                                   isOdmorOdsustvo: false 
                                  })}
                                >X</Button>
                                

                              </div>
                              
                            }
                          />
                        : null
                      }
                    </Row>
                    <Row>
                    {
                      this.state.isOperacija ?
                      
                          <Card
                            // category="Dogadjaj"
                            ctTableFullWidth
                            ctTableResponsive
                            content={
                              <div>
                                
                                <div className="dogadjaj" >
                                  <label className="dogadjaj1">Dogadjaj: </label>
                                  <label className="dogadjaj2">{this.state.objekat.title}</label>  
                                </div>
                                <div className="dogadjaj" >
                                  <label className="dogadjaj1">Opis: </label>
                                  <label className="dogadjaj2">{this.state.objekat.desc.tipOperacije}</label>
                                </div>
                                <div className="dogadjaj" >
                                  <label className="dogadjaj1">Pacijent: </label>
                                  <label className="dogadjaj2">{this.state.objekat.desc.imeP + " " + this.state.objekat.desc.prezimeP}</label>
                                </div>
                                <div className="dogadjaj" >
                                  <label className="dogadjaj1">Pocetak: </label>
                                  <label className="dogadjaj2">{moment(this.state.objekat.start).format("DD.MM.YYYY. HH:mm")}</label>
                                </div>
                                <div className="dogadjaj" >
                                  <label className="dogadjaj1">Kraj: </label>
                                  <label className="dogadjaj2">{moment(this.state.objekat.end).format("DD.MM.YYYY. HH:mm")}</label>
                                  
                                </div>
                                <Button className="izlaz" 
                                 onClick={()=>  this.setState({
                                    isPregled: false, 
                                   isOperacija: false,
                                   isOdmorOdsustvo: false
                                  })}
                                >X</Button>
                                

                              </div>
                              
                            }
                          />
                        : null
                      }
                    </Row>
                    <Row>
                    {
                      this.state.isPregled ?
                      
                          <Card
                            // category="Dogadjaj"
                            ctTableFullWidth
                            ctTableResponsive
                            content={
                              <div>
                                
                                <div className="dogadjaj" >
                                  <label className="dogadjaj1">Dogadjaj: </label>
                                  <label className="dogadjaj2">{this.state.objekat.title}</label>  
                                </div>
                                <div className="dogadjaj" >
                                  <label className="dogadjaj1">Pacijent: </label>
                                  <label className="dogadjaj2">{this.state.objekat.desc.imeP + " " + this.state.objekat.desc.prezimeP}</label>
                                </div>
                                <div className="dogadjaj" >
                                  <label className="dogadjaj1">Pocetak: </label>
                                  <label className="dogadjaj2">{moment(this.state.objekat.start).format("DD.MM.YYYY. HH:mm")}</label>
                                </div>
                                <div className="dogadjaj" >
                                  <label className="dogadjaj1">Kraj: </label>
                                  <label className="dogadjaj2">{moment(this.state.objekat.end).format("DD.MM.YYYY. HH:mm")}</label>
                                  
                                </div>
                                <Button className="izlaz" 
                                 onClick={()=>  this.setState({
                                   isPregled: false, 
                                   isOperacija: false,
                                   isOdmorOdsustvo: false
                                  })}
                                >X</Button>
                                <Button className="izlaz" 
                                  onClick={()=>  this.setState({
                                    redirectToPregled: true
                                  })}
                                >Zapocni pregled</Button>
                                

                              </div>
                              
                            }
                          />
                        : null
                      }
                    </Row>
                    <Row>
                    <div style={{ height: 500 }}  className="ct-chart">
                       <Calendar
                        localizer={localizer}
                        // culture="en"
                        events={this.state.dogadjajiKalendar }
                        // views={["month"]}
                        // defaultDate={new Date()}
                        // style={{ maxHeight: "100%" }}
                        showMultiDayTimes={true}
                          
                        eventPropGetter={event => ({
                          style:{
                            backgroundColor: "rgb(92, 185, 240)"
                          }
                        })}

                
                        // startAccessor={e=> e.start}
                        // endAccessor={e=> e.end}
                        // titleAccessor="tip"
                        onSelectEvent={obj => {
                            this.state.objekat = obj;
                            console.log(obj.desc);
                            if(obj.title === "ODMOR"){
                              console.log("odmor");
                              this.setState({
                                isOdmorOdsustvo: true
                              })
                            }else if(obj.title === "ODSUSTVO"){
                              console.log("odsustvo")
                              this.setState({
                                isOdmorOdsustvo: true,
                                isPregled: false, 
                                isOperacija: false
                                
                              })
                            }else if(obj.title === "OPERACIJA"){
                              console.log("operacija")
                              this.setState({
                                isOperacija: true,
                                isPregled: false, 
                                isOdmorOdsustvo: false
                              })
                            }else{
                              // if(obj.)
                              console.log("pregled")
                              this.setState({
                                isPregled: true,
                                isOperacija: false,
                                isOdmorOdsustvo: false
                              })
                            }
                            
                            
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

export default PocetnaStranicaLekara;
