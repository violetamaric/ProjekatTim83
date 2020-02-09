
import React, { Component } from "react";
import Button from "components/CustomButton/CustomButton.jsx";
import { Grid, Row, Col, Table, NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import Dialog from 'react-bootstrap-dialog';
import axios from "axios";
import slikaPacijent from "assets/img/pacijentImage.jpg";
import Pregled from "views/Pregled.jsx";
import ListaPacijenataLekar from "views/ListaPacijenataLekar.jsx";
import "klinickiCentar.css";
import moment from "moment";

class PregledProfilaPacijenta extends Component {
  constructor(props) {
   
    super(props);
    console.log(this.props);
    console.log(props.emailPacijenta);
    this.state = {
      uloga: props.uloga,
      token: props.token,
      email: props.email,
      emailPacijenta: props.emailPacijenta,
      pacijent : [],
      zdravstveniKarton: [],
      listaIzvestaja: [],
      idPregleda: 0,
      ime: "",
      prezime: "",
      adresa: "",
      grad: "",
      drzava: "",
      telefon: "",
      lbo: "",
      jmbg: "",
      lozinka: "",
      listaPregleda: [],
      ZKpacijenta: [],
      zkOpen: false,
      redirectToPregled: false,
      redirectToListaPac: false,
      prikaziZK: false,
      visina: 0, 
      tezina: 0,
      krvnaGrupa: ""
    };
    this.config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
    
    this.ucitavanjePacijenta = this.ucitavanjePacijenta.bind(this);
    this.ucitavanjeZKPacijenta = this.ucitavanjeZKPacijenta.bind(this);
    this.ucitavanjeZakazanihPregleda = this.ucitavanjeZakazanihPregleda.bind(this);

    this.handleZapocniPregled = this.handleZapocniPregled.bind(this);
    this.listaPregledaPacijenta = this.listaPregledaPacijenta.bind(this);
    this.handleNazad = this.handleNazad.bind(this);
    this.izmenaZK = this.izmenaZK.bind(this);
  }

  ucitavanjePacijenta(){
    console.log("OVO JE PACIJENT " + this.state.emailPacijenta)
    axios
    .get('http://localhost:8025/api/pacijenti/findPacijentLekar/' + this.state.emailPacijenta ,
     this.config)
      .then(Response => {
        console.log("Ucitavanje pacijenta");
        console.log(Response);
        this.setState({
          pacijent: Response.data,
          emailPacijenta: Response.data.id,
          ime: Response.data.ime,
          prezime: Response.data.prezime,
          telefon: Response.data.telefon,
          adresa: Response.data.adresa,
          grad: Response.data.grad,
          drzava: Response.data.drzava,
          lbo: Response.data.lbo,
          jmbg: Response.data.jmbg
        }, ()=> {
          console.log("usaooo u proveru ");
          console.log(this.state.token);
          axios
          .post('http://localhost:8025/api/lekari/mogucPrikazZKPacijenta' ,
          { id: Response.data.id}, this.config)
            .then(Response => {
              console.log("Da li je odobren ili ne uvid u zk ");
              console.log(Response.data);
             if(Response.data == "MOZE"){
               console.log("MOZE DA PRISTUPI");
               this.setState({
                prikaziZK: true
               })
             }else{
               console.log("NE MOZE DA PRISTUPI")
               this.setState({
                prikaziZK: false
               })
             }
            })
            .catch(error => {
              console.log("nije uspeo url1");
              console.log(error);
            });
            
        });

        
        console.log(this.state);
      })
      .catch(error => {
        console.log("nije uspeo url1");
        console.log(error);
      });
  }

  ucitavanjeZakazanihPregleda(){
    axios
        .get('http://localhost:8025/api/pregledi/pregledPacijenta/' + this.state.emailPacijenta ,
        this.config)
        .then(Response => {
            console.log("Ucitavanje pregleda");
            console.log(Response.data);
            this.setState({
              listaPregleda : Response.data
            })
           
        })
        .catch(error => {
            console.log("nije uspelo ucitavanje pregleda pacijenta");
            console.log(error);
        });
  }
  ucitavanjeZKPacijenta(){
    axios
    .get("http://localhost:8025/api/pacijenti/findZKMS/" + this.state.emailPacijenta, this.config)

    .then(Response => {
      console.log("URL 111");
      console.log(Response);
      this.setState({
        zdravstveniKarton : Response.data,
        listaIzvestaja: Response.data.listaIzvestaja
      });
      console.log(this.state);
    })
    .catch(error => {
      console.log("nije uspeo url1");
      console.log(error);
    });
  }

  componentWillMount() {
    console.log("treba get zahtev da se iskuca");
    
    console.log(this.state.emailPacijenta);
    this.ucitavanjePacijenta();
    this.ucitavanjeZKPacijenta();
    this.ucitavanjeZakazanihPregleda();
  }

  handleZapocniPregled = e =>{
    // e.preventDefault();
    console.log(e.currentTarget.id);
    // this.setState({
    //   emailPacijenta: e.currentTarget.id
    // })
    this.props.handleClick("PREGLED JE ZAPOCET")
    this.setState({
      idPregleda : e.currentTarget.id
    }, ()=> {
      this.setState({
        redirectToPregled: true,
    })
    })
    

  }
  handleNazad (){
    this.setState({
      redirectToListaPac: true,
      
    })
  }

  listaPregledaPacijenta(){
    let res = [];
    let lista = this.state.listaPregleda;
    for (var i = 0; i < lista.length; i++) {
      let datum = new Date(lista[i].datum);
      datum.setHours(lista[i].termin);

      res.push(
        <tr key = {i}>

          <td >{moment(datum).format("DD.MM.YYYY HH:mm")}</td>
          <td >{lista[i].nazivTP}</td>
          <td>{lista[i].salaBR + " "+ lista[i].salaN}</td>
          
         
          
          <td >
              
              <Button className="OdobrenZahtev"
                id={lista[i].id}
                onClick={e => this.handleZapocniPregled(e)}
              > Zapocni pregled</Button>
             
          </td>

          
            

          
        </tr>
      );
    }
    return res;
  }

  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
    console.log("On change !!!");
  };

  izmenaZK(){
    console.log("IZMENA ZK");
    axios
    .put("http://localhost:8025/api/pacijenti/izmenaZK",{
        id: this.state.zdravstveniKarton.id,
        pacijentID: this.state.emailPacijenta,
        visina: this.state.visina,
        tezina: this.state.tezina,
        krvnaGrupa: this.state.krvnaGrupa
        
    }, this.config)
    .then(Response => {
      console.log("IZMENJEN ZDRAVSTVENI KARTON");
      console.log(Response.data);
      this.props.handleClick("ZDRAVSTVENI KARTON JE IZMENJEN")
      this.setState({
        zkOpen: false
      }, ()=> {
        
        this.ucitavanjeZKPacijenta()
      })

      
    })
    .catch(error => {
      console.log("NIJE USPELA IZMENA ZK");
      console.log(error);
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
                email={this.state.email} 
                uloga={this.state.uloga}
                idPregleda ={this.state.idPregleda}
                handleClick={this.props.handleClick}
               //nije emailPacijenta vec je id al dobro
                emailPacijenta={this.state.emailPacijenta}   />}
              />
              <Redirect from="/" to="/pregled" />
            </Switch>
          </BrowserRouter>
        );
    }
    if(this.state.redirectToListaPac === true){
        return (
          <BrowserRouter>
            <Switch>
              <Route
                path="/listaPacijenataLekar"
                render={props => <ListaPacijenataLekar {...props}
                    token={this.state.token}
                    email={this.state.email} 
                    uloga={this.state.uloga}
                    handleClick={this.props.handleClick}
                  //nije emailPacijenta vec je id al dobro
                    emailPacijenta={this.state.emailPacijenta}   />}
              />
              <Redirect from="/" to="/listaPacijenataLekar" />
            </Switch>
          </BrowserRouter>
        );
    }
    
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            
         
            
            {
              this.state.prikaziZK && this.state.zkOpen == false ?
              
                <Button className="izadjiDugme" onClick={()=> this.setState({
                  zkOpen: true
                })}>Zdravstveni karton</Button>
              
              : null
            }
            {
              this.state.zkOpen ?
              <Button className="izadjiDugme" 
                onClick={this.izmenaZK}
              >Izmeni</Button>
              : null
            }
            {
              this.state.zkOpen ?
              <Button className="izadjiDugme" onClick={()=> this.setState({
                zkOpen: false
              })}>Izadji</Button>
              : null
            }

            
            {
              this.state.zkOpen == false ? 
              <Button className="izadjiDugme" onClick={this.handleNazad}>Izadji iz profila</Button>
            :null
            }
            
            
          </Row>
          <Row>
            
            {
              this.state.zkOpen ?
              <Row>
                <Col md={8}>
                  <Card
                    title="Zdravstveni karton"
                    
                    content={
                      <div className="ct-chart">
                
                        <Table striped hover>
                        <tbody>
                          <tr>
                            <td>
                              <label>Ime: </label>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="ime"
                                defaultValue={this.state.pacijent.ime}
                                disabled="disabled"
                                // placeholder={this.state.ime}
                                // noValidate
                                onChange={this.handleChange}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <label>Prezime: </label>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="prezime"
                                defaultValue={this.state.pacijent.prezime}
                                disabled="disabled"
                                // placeholder={this.state.prezime}
                                // noValidate
                                onChange={this.handleChange}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <label>Jedinstveni broj osiguranika: </label>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="lbo"
                                defaultValue={this.state.pacijent.lbo}
                                disabled="disabled"
                                // placeholder={this.state.lbo}
                                // noValidate
                                onChange={this.handleChange}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <label>Visina: </label>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="visina"
                                defaultValue={this.state.zdravstveniKarton.visina}
                                // disabled="disabled"
                                // placeholder={this.state.visina}
                                // noValidate
                                onChange={this.handleChange}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <label>Tezina: </label>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="tezina"
                                defaultValue={this.state.zdravstveniKarton.tezina}
                                // disabled="disabled"
                                // placeholder={this.state.tezina}
                                // noValidate
                                onChange={this.handleChange}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <label>Krvna grupa: </label>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="krvnaGrupa"
                                defaultValue={this.state.zdravstveniKarton.krvnaGrupa}
                                // disabled="disabled"
                                // placeholder={this.state.krvnaGrupa}
                                // noValidate
                                onChange={this.handleChange}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </Table>

                      </div>
                    }
                  
                  />
                </Col> 
                <Col md={4}>
              <Card
                // statsIcon="fa fa-clock-o"
                title="O pacijentu"
                // category="Ime"
                content={
                  <div id="a">
                    <div className="slikaKCdiv">
                      <h2>
                        <img
                          className="slikaPacijent"
                          src={slikaPacijent}
                        ></img>
                      </h2>
                    </div>
                    <Table striped hover>
                      <thead className="thead-dark">
                        
                        <tr>
                          <td>E-mail:</td>
                          <td>{this.state.pacijent.email}</td>
                        </tr>
                        <tr>
                          <td>LBO:</td>
                          <td>{this.state.lbo}</td>
                        </tr>
                        <tr>
                          <td>JMBG:</td>
                          <td>{this.state.jmbg}</td>
                        </tr>
                        <tr>
                          <td>Telefon:</td>
                          <td>{this.state.telefon}</td>
                        </tr>
                      </thead>
                    </Table>

                  </div>
                }

            
                
              />
            </Col>
                <Col md={8}>
              <Card
                title="Posete lekarima"
                content={
                  <div>
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>Datum</th>
                          <th>Lekar</th>
                          <th>Izvestaj</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.listaIzvestaja.map(izvestaj => {
                          return (
                            <tr>
                              <td>
                                {moment(izvestaj.datum).format("DD.MM.YYYY.")}
                              </td>
                              <td>
                                {izvestaj.imeL} {izvestaj.prezimeL}
                              </td>
                              <td>{izvestaj.sadrzaj}</td>
                              {/* <td>
                                <Button>izmeni</Button>
                              </td> */}
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                }
              />
            </Col>
                <Col md={4}>
              <Card
                // statsIcon="fa fa-clock-o"
                title="Istorija bolesti"
                // category="Ime"
                content={
                  <div id="a">
                    <Table striped hover>
                      <thead className="thead-dark">
                        <tr>
                          <th>Datum</th>
                          <th>Bolest</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.listaIzvestaja.map(izvestaj => {
                          return (
                            <tr>
                              <td>
                                {moment(izvestaj.datum).format("DD.MM.YYYY.")}
                              </td>
                              <td>{izvestaj.dijagnozaN}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                }
              />
            </Col>

              </Row>
            : 
            <Row>
            <Col md={8}>
            
            <Card
              title="Lista pregleda"
              // category="Here is a subtitle for this table"
              ctTableFullWidth
              ctTableResponsive
              content={
                <div>
                
               
                <Table striped hover>
                  <thead>
                    <tr>
                      <th id="IdPacijenta">Datum</th>
                      <th id="ImePacijenta">Tip pregleda</th>
                      <th>Sala</th>
                            
                    </tr>
                  </thead>
                  <tbody>
                  {this.listaPregledaPacijenta()}
                  </tbody>
                </Table>
                </div>
              }
            />
          
          
        </Col>
            <Col md={4}>
              <Card
                // statsIcon="fa fa-clock-o"
                title="O pacijentu"
                // category="Ime"
                content={
                  <div id="a">
                    <div className="slikaKCdiv">
                      <h2>
                        <img
                          className="slikaPacijent"
                          src={slikaPacijent}
                        ></img>
                      </h2>
                    </div>
                    <Table striped hover>
                      <thead className="thead-dark">
                        
                        <tr>
                          <td>E-mail:</td>
                          <td>{this.state.pacijent.email}</td>
                        </tr>
                        <tr>
                          <td>LBO:</td>
                          <td>{this.state.lbo}</td>
                        </tr>
                        <tr>
                          <td>JMBG:</td>
                          <td>{this.state.jmbg}</td>
                        </tr>
                        <tr>
                          <td>Telefon:</td>
                          <td>{this.state.telefon}</td>
                        </tr>
                      </thead>
                    </Table>

                  </div>
                }

            
                
              />
            </Col>
            </Row>
           
            }
            
          </Row>
        </Grid>
      </div>
    );
  }
}

export default PregledProfilaPacijenta;
