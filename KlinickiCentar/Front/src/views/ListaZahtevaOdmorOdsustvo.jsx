import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import "klinickiCentar.css";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from "axios";
import Dialog from 'react-bootstrap-dialog';
import moment from 'moment';

class ListaZahtevaOdmorOdsustvo extends Component {
  constructor(props) {
    super(props);
    console.log("ADMINISTRATOR KLINIKE");
    
    this.state = {
      uloga: props.uloga,
      email: props.email,
      token: props.token,

      razlogOdbijanja: "",
      za: "",

      listaZahtevaMS: [],
      listaZahtevaLekara: [],
      
      emailMS: "",
      idZahteva: "",
      isOpen: false,
      isOpenL: false,
      trenutniZahtev: [],
      hiddenListaMS: true,
      hiddenListaL: false

    };
    this.config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    this.ucitajZahteveMedSestre = this.ucitajZahteveMedSestre.bind(this);
    this.ucitajZahteveLekara = this.ucitajZahteveLekara.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.listaZahteva = this.listaZahteva.bind(this);
    this.handleOdobren = this.handleOdobren.bind(this);
    this.handleOdbijen = this.handleOdbijen.bind(this);
    this.posalji = this.posalji.bind(this);
    this.prikazListeMS = this.prikazListeMS.bind(this);
    

    this.listaZahtevaLekar = this.listaZahtevaLekar.bind(this);
    this.handleOdobrenLekar = this.handleOdobrenLekar.bind(this);
    this.handleOdbijenLekar = this.handleOdbijenLekar.bind(this);
    this.posaljiLekar = this.posaljiLekar.bind(this);
    this.prikazListeL = this.prikazListeL.bind(this);
    
  }


  ucitajZahteveMedSestre(){
    const url1 ="http://localhost:8025/api/odmorodsustvo/listaZahtevaOdmorOdsustvoMS";
    console.log(url1);

    axios
        .get(url1, this.config)
        .then(response => {
        console.log("URL zahtevi za godisnji odmor odsustvo med sestra");
        console.log(response);

        this.setState({
            listaZahtevaMS: response.data
        });
        })
        .catch(error => {
        console.log("nije uspelo ucitavanje zahteva med sestre");
        console.log(error);
        });
  }

  ucitajZahteveLekara(){
    const url1 ="http://localhost:8025/api/odmorodsustvo/listaZahtevaOdmorOdsustvoLekara";
    console.log(url1);

    axios
        .get(url1, this.config)
        .then(response => {
        console.log("URL zahtevi za godisnji odmor odsustvo lekar");
        console.log(response);

        this.setState({
            listaZahtevaLekara: response.data
        });

        })
        .catch(error => {
        console.log("nije uspelo ucitavanje zahteva lekara");
        console.log(error);
        });
  }

  componentWillMount() {
    console.log("--------pocetak");
    this.ucitajZahteveMedSestre();
    this.ucitajZahteveLekara();
    
  }

  handleChange = e => {
    e.preventDefault();
    
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
    console.log("On change !!!");
  };
 
  //za med sestru
  handleOdobren = e => {

    console.log("----------------------------");
    console.log("HANDLE ODOBREN"+e.currentTarget.id);
    if(e.currentTarget.id != "" && e.currentTarget.id != null){
      const url1 ="http://localhost:8025/api/odmorodsustvo/zahtev/" + e.currentTarget.id;
      console.log(url1);
  
      axios
          .get(url1, this.config)
          .then(response => {
          console.log("URL zahtev neki");
          console.log(response);
  
          this.setState({
            trenutniZahtev: response.data
          }, ()=> {
            console.log(this.state.trenutniZahtev.emailMS);
            const url2 = "http://localhost:8025/api/odmorodsustvo/potvrdaMS/"  ;
            axios
              .post(url2,{
                emailMS: this.state.trenutniZahtev.emailMS,
                idMedSestre: this.state.trenutniZahtev.idMedSestre,
                id: this.state.trenutniZahtev.id
              }, this.config)
              .then(response => {
                console.log("ODOBRENOOOO");
                console.log(response);
                this.ucitajZahteveMedSestre();
              })
              .catch(error => {
                  console.log(error.response);
              });
          });
          })
          .catch(error => {
            console.log("nije uspelo ucitavanje zahteva med sestre");
            console.log(error);
          });  
    }
  
  };
  handleOdobrenLekar = e=> {

    console.log("----------------------------");
    console.log("HANDLE ODOBREN LEKAR"+e.currentTarget.id);
    if(e.currentTarget.id != "" && e.currentTarget.id != null){
      const url1 ="http://localhost:8025/api/odmorodsustvo/zahtevL/" + e.currentTarget.id;
      console.log(url1);
  
      axios
          .get(url1, this.config)
          .then(response => {
          console.log("URL zahtev neki");
          console.log(response);
  
          this.setState({
            trenutniZahtev: response.data
          }, ()=> {
            console.log(this.state.trenutniZahtev.emailL);
            const url2 = "http://localhost:8025/api/odmorodsustvo/potvrdaL/"  ;
            axios
              .post(url2,{
                emailL: this.state.trenutniZahtev.emailL,
                idLekara: this.state.trenutniZahtev.idLekara,
                id: this.state.trenutniZahtev.id
              }, this.config)
              .then(response => {
                console.log("ODOBRENOOOO");
                console.log(response);
                this.ucitajZahteveLekara();
              })
              .catch(error => {
                  console.log(error.response);
              });
          });
          })
          .catch(error => {
            console.log("nije uspelo ucitavanje zahteva med sestre");
            console.log(error);
          });  
    }
  }

  //za med sestru
  handleOdbijen = e => {

    console.log("ODBIJANJE MS-------------");
    console.log(e.currentTarget.id)
    if(e.currentTarget.id != "" && e.currentTarget.id != null){
      //pronadji ceo zahtev na osnovu id-a
      const url1 ="http://localhost:8025/api/odmorodsustvo/zahtev/" + e.currentTarget.id;
      console.log(url1);

      axios
          .get(url1, this.config)
          .then(response => {
            console.log("URL zahtev neki");
            console.log(response);

            this.setState({
              trenutniZahtev: response.data
            }, ()=> {

              console.log(this.state.trenutniZahtev.emailMS)
              this.setState({
                emailMS : this.state.trenutniZahtev.emailMS
              });
              this.setState({           
                isOpen: true,
              })
              this.ucitajZahteveMedSestre();

            });
          })
          .catch(error => {
            console.log("nije uspelo ucitavanje zahteva med sestre");
            console.log(error);
          });
    }
    

  }
  handleOdbijenLekar = e => {

    console.log("ODBIJANJE L-------------");
    console.log(e.currentTarget.id)
    if(e.currentTarget.id  != "" && e.currentTarget.id != null){
      //pronadji ceo zahtev na osnovu id-a
      const url1 ="http://localhost:8025/api/odmorodsustvo/zahtevL/" + e.currentTarget.id;
      console.log(url1);

      axios
          .get(url1, this.config)
          .then(response => {
          console.log("URL zahtev neki");
          console.log(response);

          this.setState({
            trenutniZahtev: response.data
          }, ()=> {

            console.log(this.state.trenutniZahtev.emailL)
            this.setState({
              emailMS : this.state.trenutniZahtev.emailL
            });
            this.setState({           
              isOpenL: true,
            })
            this.ucitajZahteveLekara();

          });
          })
          .catch(error => {
            console.log("nije uspelo ucitavanje zahteva lekara");
            console.log(error);
          });
    }
  
  }
//za med sestru
  listaZahteva() {
    let res = [];
    let lista = this.state.listaZahtevaMS;
    
    
    const odbij = <Tooltip id="remove_tooltip">Odbij</Tooltip>;
    const potvrdi = <Tooltip id="remove_tooltip">Potvrdi</Tooltip>;

    for (var i = 0; i < lista.length; i++) {
        
         
        res.push(
            <tr key={i}>  
              
              <td>{lista[i].imeMS}</td>
              <td>{lista[i].prezimeMS}</td>
              <td>{lista[i].emailMS}</td>
              <td>{moment(lista[i].datumOd).format("DD.MM.YYYY HH:mm")}</td>
              <td>{moment(lista[i].datumDo).format("DD.MM.YYYY HH:mm")}</td>
              <td>{lista[i].opis}</td>
              <td>{lista[i].tip}</td>
    
              
              <td>
                <OverlayTrigger placement="top" overlay={potvrdi}>
                  <Button
                    bsStyle="success"
                    simple
                    type="button"
                    bsSize="lg"
                    id={lista[i].id}
                    onClick={e => this.handleOdobren(e)}
                  >
                    <i className="pe-7s-check text-success" />
                  </Button>
                  
                </OverlayTrigger>
              </td>
              <td>
                <OverlayTrigger placement="top" overlay={odbij}>
                  <Button
                    bsStyle="danger"
                    simple
                    type="button"
                    bsSize="lg"
                    id={lista[i].id} 
                    onClick={e => this.handleOdbijen(e)}
                    
                  >
                    <i className="pe-7s-close-circle text-danger" />
                  </Button>
                  
                </OverlayTrigger>
              </td>

            </tr>
        );     
    }
    

    return res;
  }

  listaZahtevaLekar(){
    let res = [];
    let lista2 = this.state.listaZahtevaLekara;
    console.log("-------------LISTA z LEKARA")
    
    const odbij = <Tooltip id="remove_tooltip">Odbij</Tooltip>;
    const potvrdi = <Tooltip id="remove_tooltip">Potvrdi</Tooltip>;
    for ( var i = 0 ; i < lista2.length; i++) {
         
        res.push(
            <tr key={i}>  
              
              <td>{lista2[i].imeL}</td>
              <td>{lista2[i].prezimeL}</td>
              <td>{lista2[i].emailL}</td>
              <td>{moment(lista2[i].datumOd).format("DD.MM.YYYY HH:mm")}</td>
              <td>{moment(lista2[i].datumDo).format("DD.MM.YYYY HH:mm")}</td>
              <td>{lista2[i].opis}</td>
              <td>{lista2[i].tip}</td>
    
              <td>
                <OverlayTrigger placement="top" overlay={potvrdi}>
                  <Button
                    bsStyle="success"
                    simple
                    type="button"
                    bsSize="lg"
                    id={lista2[i].id}
                    
                    onClick={e => this.handleOdobrenLekar(e)}
                     
                  >
                    <i className="pe-7s-check text-success" />
                  </Button>
                  
                </OverlayTrigger>
              </td>
              <td>
                <OverlayTrigger placement="top" overlay={odbij}>
                  <Button
                    bsStyle="danger"
                    simple
                    type="button"
                    bsSize="lg"
                    id={lista2[i].id}
                    onClick={e => this.handleOdbijenLekar(e)}
                  >
                    <i className="pe-7s-close-circle text-danger" />
                  </Button>
               
                </OverlayTrigger>
              </td>
            </tr>
        );     
    }
    return res;
  }

    
  posalji(){
      console.log(this.state.emailMS);
      console.log(this.state.razlogOdbijanja);
          const url3 = "http://localhost:8025/api/odmorodsustvo/odbijanjeMS/"  + this.state.razlogOdbijanja;
          axios
            .post(url3,{
              emailMS: this.state.emailMS,
              idMedSestre: this.state.trenutniZahtev.idMedSestre,
              id: this.state.trenutniZahtev.id
            }, this.config)
            .then(response => {
              console.log("Odbijanje uspelo! ");
              console.log(response.data);
              this.setState({
                isOpen: false 
              }, ()=> this.ucitajZahteveMedSestre())
              

            })
            .catch(error => {
              console.log("Odbijanje nije uspelo! ");
            });
        
  };
  posaljiLekar(){

    

      console.log(this.state.emailMS);
      console.log(this.state.razlogOdbijanja);
          const url3 = "http://localhost:8025/api/odmorodsustvo/odbijanjeL/"  + this.state.razlogOdbijanja;
          axios
            .post(url3,{
              emailL: this.state.emailMS,
              id: this.state.trenutniZahtev.id,
              idLekara: this.state.trenutniZahtev.idLekara,
            }, this.config)
            .then(response => {
              console.log("Odbijanje uspelo! ");
              console.log(response.data);
              
              this.setState({
                isOpenL: false 
              }, ()=> this.ucitajZahteveLekara())

            })
            .catch(error => {
              console.log("Odbijanje nije uspelo! ");
            });
        
  };

  prikazListeMS(){
    this.setState({
      hiddenListaL: false
    })
    this.setState({
      hiddenListaMS: true,
    });

  }
  prikazListeL(){
    this.setState({
      hiddenListaMS: false,
      hiddenListaL: true
      
    });


  }

  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            
            <Button className="DodajKlinikuDugme"  onClick={this.prikazListeMS}>MEDICINSKE SESTRE</Button> 
            <Button className="DodajKlinikuDugme"  onClick={this.prikazListeL}>LEKARI</Button>  
            
          </Row>
          <Row>
                {
                      this.state.isOpen ?
                      
                          <Card
                            category="Odbijanje zahteva"
                            ctTableFullWidth
                            ctTableResponsive
                            content={
                              <Grid >
                                <Row >
                                  <Col>
                                    <label >Za: </label>
                                  </Col>
                                  <Col>
                                      <input 
                                        type="text"
                                        name = "emailMS"
                                        value = {this.state.emailMS}
                                        disabled="disabled"
                                        onChange= {this.handleChange}
                                      />
                                  </Col>
                                  
                                </Row>
                                <Row>
                                
                                  <Col><label>Razlog odbijanja:</label></Col>
                                  <Col>
                                    <input 
                                      type="text"
                                      name="razlogOdbijanja"
                                      defaultValue=""
                                      onChange={this.handleChange}
                                    />
                                  </Col>
                                    
                                
                                </Row>
                                <Row>
                                  <Button className="izlaz" 
                                    onClick={()=> this.posalji()}
                                  >Posalji</Button>
                                </Row>

                              </Grid>
                            
                            }
                          />
                        : null
                      }
                </Row>
          <Row>
                {
                      this.state.isOpenL ?
                      
                          <Card
                            category="Odbijanje zahteva"
                            ctTableFullWidth
                            ctTableResponsive
                            content={
                              <Grid >
                                <Row >
                                  <Col>
                                    <label >Za: </label>
                                  </Col>
                                  <Col>
                                      <input 
                                        type="text"
                                        name = "emailMS"
                                        value = {this.state.emailMS}
                                        disabled="disabled"
                                        onChange= {this.handleChange}
                                      />
                                  </Col>
                                  
                                </Row>
                                <Row>
                                
                                  <Col><label>Razlog odbijanja:</label></Col>
                                  <Col>
                                    <input 
                                      type="text"
                                      name="razlogOdbijanja"
                                      defaultValue=""
                                      onChange={this.handleChange}
                                    />
                                  </Col>
                                    
                                
                                </Row>
                                <Row>
                                  <Button className="izlaz" 
                                    onClick={()=> this.posaljiLekar()}
                                  >Posalji</Button>
                                </Row>

                              </Grid>
                            
                            }
                          />
                        : null
                      }
                </Row>        
          <Row>
          {this.state.hiddenListaMS ?
            <Card
              title="Lista zahteva za godisnji odmor/odsustvo"
              category="Od strane medicinskih sestara"
              ctTableFullWidth
              ctTableResponsive
              content={
                <Table striped hover>
                        <thead>
                          <tr>
                            
                            <th id="ime">Ime</th>
                            <th id="prezime">Prezime</th>
                            <th id="Email">Email</th>
                            <th id="datumOd">Od</th>
                            <th id="datumDo">Do</th>
                            <th id="opis">Razlog</th>
                            <th id="tip">Tip</th>
                            
                          </tr>
                        </thead>
                        <tbody>
                        {this.listaZahteva()}
                        </tbody>
                  </Table>
              }
            />
          : null
          }
            
          </Row>
          <Row>
          {this.state.hiddenListaL ?
            <Card
              title="Lista zahteva za godisnji odmor/odsustvo"
              category="Od strane lekara"
              ctTableFullWidth
              ctTableResponsive
              content={
                <Table striped hover>
                      <thead>
                        <tr>
                          
                          <th id="ime">Ime</th>
                          <th id="prezime">Prezime</th>
                          <th id="Email">Email</th>
                          <th id="datumOd">Od</th>
                          <th id="datumDo">Do</th>
                          <th id="opis">Razlog</th>
                          <th id="tip">Tip</th>
                          
                        </tr>
                      </thead>
                      <tbody>
                      {this.listaZahtevaLekar()}
                      </tbody>
                </Table>
              }
            />
          : null
          }
           
          
          </Row>

        </Grid>
        
        
              
      </div>
    );
  }
}

export default ListaZahtevaOdmorOdsustvo;
