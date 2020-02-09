import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import "klinickiCentar.css";
import Dialog from 'react-bootstrap-dialog';

import axios from "axios";

class Sifrarnik extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      uloga: props.uloga,
      email: props.email,
      token: props.token,
      listaLekova:[],
      listaDijagnoza:[],
      lekNaziv: "",
      lekSifra: "",
      dijagnozaOznaka: "",
      dijagnozaOpis: "",
      dijagnozaNaziv: "",
      hiddenLekovi: true,
      hiddenDijagnoza: false
      
    };
    this.config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
    this.listaLekovaUKC = this.listaLekovaUKC.bind(this);
    this.listaDijagnozaUKC = this.listaDijagnozaUKC.bind(this);
    this.dodajLek = this.dodajLek.bind(this);
    this.dodajDijagnozu = this.dodajDijagnozu.bind(this);
    this.izmeniLek = this.izmeniLek.bind(this);
    this.obrisiLek = this.obrisiLek.bind(this);
    this.izmeniDijagnozu = this.izmeniDijagnozu.bind(this);
    this.obrisiDijagnozu = this.obrisiDijagnozu.bind(this);

    this.prikazLekova = this.prikazLekova.bind(this);
    this.prikazDijagnoza = this.prikazDijagnoza.bind(this);
    this.listaLekovaUKC = this.listaLekovaUKC.bind(this);
    this.listaLekova = this.listaLekova.bind(this);

    
  }

  listaLekovaUKC(){
    let res=[];
    let lista = this.state.listaLekova;
    for(var i=0; i< lista.length;i++){
      res.push(
        <tr key = {i}>
          <td >{i+1}</td>
          <td >{lista[i].sifra}</td>
          <td >{lista[i].naziv}</td>
          <td >
          <Button id={lista[i].id} onClick={e => this.izmeniLek(e)} >Izmeni</Button>
          <Dialog ref={(el) => { this.dialog = el }} ></Dialog>
          </td>
          <td >
          <Button id={lista[i].id} onClick={e => this.obrisiLek(e)}>Obrisi</Button>
          <Dialog ref={(el) => { this.dialog = el }} ></Dialog>
          </td>
         
        </tr>
      )
    }
    return res;
  }
  listaDijagnozaUKC(){
    let res=[];
    let lista = this.state.listaDijagnoza;
    for(var i=0; i< lista.length;i++){
      res.push(
        <tr key = {i}>
          <td>{i+1}</td>
          <td >{lista[i].oznaka}</td>
          <td >{lista[i].naziv}</td>
          <td >{lista[i].opis}</td>
          <td >
          <Button id={lista[i].id} onClick={e => this.izmeniDijagnozu(e)}>Izmeni</Button>
          <Dialog ref={(el) => { this.dialog = el }} ></Dialog>
          </td>
          <td >
          <Button id={lista[i].id} onClick={e => this.obrisiDijagnozu(e)}>Obrisi</Button>
          <Dialog ref={(el) => { this.dialog = el }} ></Dialog>
          </td>
        </tr>
      )
    }
    return res;
  }
  listaLekova(){
    console.log("--------lista lekova");
    const url1 = 'http://localhost:8025/api/lekovi/listaLekova/'; 
    console.log(url1);
    axios.get(url1, this.config)
      .then(response => {
        console.log("URL Lek");
        console.log(response);
        this.setState({
          listaLekova: response.data
        });
      })
      .catch(error => {
          console.log("nije uspeo url lekova");
          console.log(error);
      })
  }

  listaDijagnoza(){
    console.log("--------lista dijagnoza");
  const url2 = 'http://localhost:8025/api/dijagnoze/listaDijagnoza/'; 
  console.log(url2);
  axios.get(url2, this.config)
      .then(response => {
        console.log("URL Dijagnoza");
        console.log(response);
        this.setState({
          listaDijagnoza: response.data
        });
      })
      .catch(error => {
          console.log("nije uspeo url dijagnoza");
          console.log(error);
      })
  }

  componentWillMount(){
    this.listaLekova();
    this.listaDijagnoza();
  }

  handleChange = e => {
    e.preventDefault();
    
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
    console.log("On change !!!");
  };
  dodajLek = e => {
    e.preventDefault();

    console.log("--------------------------------");
    this.dialog.show({
      title: 'Dodavanje novog leka',
      body: [
      <form className="formaZaDodavanjeNovogLeka">
         
          <div className="lekNaziv" >
            <label className="lekNazivLabel" htmlFor="lekNaziv">Naziv: </label>
            <input className="lekNazivLabel"
              type="text"
              name="lekNaziv"
              defaultValue = "" 
              // defaultValue= {za}
              // placeholder={this.state.ime}
              // noValidate
              onChange={this.handleChange}
            />
          </div>
          <div className="lekSifra" >
            <label className="lekSifraLabel" htmlFor="lekSifra">Sifra: </label>
            <input
              className="lekSifraLabel"
              type="text"
              name="lekSifra"
              defaultValue=""
              onChange={this.handleChange}
            />
          </div>

      </form> 
      ],
      actions: [
        Dialog.CancelAction(),
        Dialog.OKAction(() => {
         
          console.log('OK je kliknuto!');
          
          const url3 = "http://localhost:8025/api/lekovi/dodavanjeLeka";
          axios
            .post(url3, { 
              naziv: this.state.lekNaziv, 
              sifra : this.state.lekSifra 
            }, this.config)
            .then(response => {
              console.log("Dodavanje leka uspelo! ");
              console.log(response.data);
              this.listaLekova();

            })
            .catch(error => {
              console.log("Dodavanje novog leka nije uspelo! ");
            });
        })
      ],
      bsSize: 'medium',
      onHide: (dialog) => {
        dialog.hide()
        console.log('closed by clicking background.')
      }
    })
    
  }
  dodajDijagnozu = e => {
    e.preventDefault();
    console.log("--------------------------------");
    this.dialog.show({
      title: 'Dodavanje nove dijagnoze',
      body: [
      <form className="formaZaDodavanjeNoveDijagnoze">
         
          <div className="dijagnozaNaziv" >
            <label className="dijagnozaNazivLabel" htmlFor="dijagnozaNaziv">Naziv: </label>
            <input className="dijagnozaNazivLabel"
              type="text"
              name="dijagnozaNaziv"
              defaultValue = "" 
              // defaultValue= {za}
              // placeholder={this.state.ime}
              // noValidate
              onChange={this.handleChange}
            />
          </div>
          <div className="dijagnozaOznaka" >
            <label className="dijagnozaOznakaLabel" htmlFor="dijagnozaOznaka">Oznaka: </label>
            <input
              className="dijagnozaOznakaLabel"
              type="text"
              name="dijagnozaOznaka"
              defaultValue=""
              onChange={this.handleChange}
            />
          </div>
          <div className="dijagnozaOpis" >
            <label className="dijagnozaOpisLabel" htmlFor="dijagnozaOpis">Opis (latinski naziv): </label>
            <input
              className="dijagnozaOpisLabel"
              type="text"
              name="dijagnozaOpis"
              defaultValue=""
              onChange={this.handleChange}
            />
          </div>

      </form> 
      ],
      actions: [
        Dialog.CancelAction(),
        Dialog.OKAction(() => {
          
          console.log('OK je kliknuto!');
          const url3 = "http://localhost:8025/api/dijagnoze/dodavanjeDijagnoze";
          axios
            .post(url3, {
              naziv : this.state.dijagnozaNaziv,
              oznaka : this.state.dijagnozaOznaka,
              opis : this.state.dijagnozaOpis       
            }, this.config)
            .then(response => {
              console.log("Dodavanje dijagnoze uspelo! ");
              console.log(response.data);
              this.listaDijagnoza();

            })
            .catch(error => {
              console.log("Dodavanje nove dijagnoze nije uspelo! ");
            });
        })
      ],
      bsSize: 'medium',
      onHide: (dialog) => {
        dialog.hide()
        console.log('closed by clicking background.')
      }
    })
  }
  izmeniLek = e => {
    e.preventDefault();
    console.log("izmena leka");
    console.log(e.target.id);
    console.log("--------------------------------");
    
    const url7 = "http://localhost:8025/api/lekovi/getLek/" + e.target.id;
    axios
      .get(url7, this.config)
      .then(response => {
              console.log("Preuzimanje leka uspelo! ");
              console.log(response.data);
              // this.listaLekova();
              this.setState({
                lekNaziv : response.data.naziv,
                lekSifra : response.data.sifra
              })
              this.dialog.show({
              title: 'Izmena leka',
              body: [
              <form className="formaZaIzmenuNovogLeka">
                
                  <div className="lekNaziv" >
                    <label className="lekNazivLabel" htmlFor="lekNaziv">Naziv: </label>
                    <input className="lekNazivLabel"
                      type="text"
                      name="lekNaziv"
                      defaultValue = {response.data.naziv} 
                      // defaultValue= {za}
                      // placeholder={this.state.ime}
                      // noValidate
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="lekSifra" >
                    <label className="lekSifraLabel" htmlFor="lekSifra">Sifra: </label>
                    <input
                      className="lekSifraLabel"
                      type="text"
                      name="lekSifra"
                      defaultValue={response.data.sifra}
                      onChange={this.handleChange}
                    />
                  </div>

              </form> 
              ],
              actions: [
                Dialog.CancelAction(),
                Dialog.OKAction(() => {
                  
                  console.log('OK je kliknuto!');
                  const url3 = "http://localhost:8025/api/lekovi/izmenaLeka";
                  axios
                    .put(url3, {
                      id : response.data.id,
                      naziv : this.state.lekNaziv,
                      sifra : this.state.lekSifra
                      
                    }, this.config)
                    .then(response2 => {
                      console.log("Izmena leka uspela! ");
                      console.log(response2.data);
                      this.listaLekova();

                    })
                    .catch(error => {
                      console.log("Izmena leka nije uspela! ");
                    });
                })
              ],
              bsSize: 'medium',
              onHide: (dialog) => {
                dialog.hide()
                console.log('closed by clicking background.')
              }
            })

      })
      .catch(error => {
          console.log("Preuzimanje leka nije uspelo! ");
       });

    
  }
  obrisiLek = e => {
    e.preventDefault();
    console.log("brisanje leka");
    console.log(e.target.id);
    

    console.log("--------------------------------");
    const url6 = "http://localhost:8025/api/lekovi/brisanjeLeka";
          axios
            .post(url6, {
              id : e.target.id
              
            }, this.config)
            .then(response => {
              console.log("Brisanje leka uspelo! ");
              console.log(response.data);
              this.listaLekova();

            })
            .catch(error => {
              console.log("Brisanje leka nije uspelo! ");
            });

  }
  izmeniDijagnozu = e => {
    e.preventDefault();
    console.log("izmena dijagnoze");
    console.log(e.target.id);
    console.log("--------------------------------");
    const url7 = "http://localhost:8025/api/dijagnoze/getDijagnoza/" + e.target.id;
    axios
      .get(url7, this.config)
      .then(response => {
              console.log("Preuzimanje dijagnoze uspelo! ");
              console.log(response.data);
              // this.listaLekova();
              this.setState({
                dijagnozaNaziv : response.data.naziv,
                dijagnozaOznaka : response.data.oznaka,
                dijagnozaOpis : response.data.opis
              })
              this.dialog.show({
              title: 'Izmena dijagnoze',
              body: [
              <form className="formaZaIzmenuDijagnoze">
                
                <div className="dijagnozaNaziv" >
                  <label className="dijagnozaNazivLabel" htmlFor="dijagnozaNaziv">Naziv: </label>
                  <input className="dijagnozaNazivLabel"
                    type="text"
                    name="dijagnozaNaziv"
                    defaultValue= {response.data.naziv}
                    // placeholder={this.state.ime}
                    // noValidate
                    onChange={this.handleChange}
                  />
                </div>
                <div className="dijagnozaOznaka" >
                  <label className="dijagnozaOznakaLabel" htmlFor="dijagnozaOznaka">Oznaka: </label>
                  <input
                    className="dijagnozaOznakaLabel"
                    type="text"
                    name="dijagnozaOznaka"
                    defaultValue={response.data.oznaka}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="dijagnozaOpis" >
                  <label className="dijagnozaOpisLabel" htmlFor="dijagnozaOpis">Opis (latinski naziv): </label>
                  <input
                    className="dijagnozaOpisLabel"
                    type="text"
                    name="dijagnozaOpis"
                    defaultValue={response.data.opis}
                    onChange={this.handleChange}
                  />
                </div>

                 

              </form> 
              ],
              actions: [
                Dialog.CancelAction(),
                Dialog.OKAction(() => {
                  
                  console.log('OK je kliknuto!');
                  const url3 = "http://localhost:8025/api/dijagnoze/izmenaDijagnoze";
                  axios
                    .put(url3, {
                      id : response.data.id,
                      naziv : this.state.dijagnozaNaziv,
                      oznaka : this.state.dijagnozaOznaka,
                      opis : this.state.dijagnozaOpis
                      
                    }, this.config)
                    .then(response2 => {
                      console.log("Izmena dijagnoze uspela! ");
                      console.log(response2.data);
                      this.listaDijagnoza();

                    })
                    .catch(error => {
                      console.log("Izmena dijagnoze nije uspela! ");
                    });
                })
              ],
              bsSize: 'medium',
              onHide: (dialog) => {
                dialog.hide()
                console.log('closed by clicking background.')
              }
            })

      })
      .catch(error => {
          console.log("Preuzimanje dijagnoze nije uspelo! ");
       });

    
  }
  obrisiDijagnozu = e => {
    e.preventDefault();
    console.log("brisanje dijagnoze");
    console.log(e.target.id);
    console.log("--------------------------------");
    const url5 = "http://localhost:8025/api/dijagnoze/brisanjeDijagnoze";
          axios
            .post(url5, {
              id : e.target.id
              
            }, this.config)
            .then(response => {
              console.log("Brisanje dijagnoze uspelo! ");
              console.log(response.data);
              this.listaDijagnoza();

            })
            .catch(error => {
              console.log("Brisanje dijagnoze nije uspelo! ");
            });

  }

  prikazLekova(){
    this.setState({
      hiddenLekovi: true,
      hiddenDijagnoza: false
    });
  }
  prikazDijagnoza(){
    this.setState({
      hiddenLekovi: false,
      hiddenDijagnoza: true
    });
  }

  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
              <Button className="DodajKlinikuDugme"  onClick={this.prikazLekova}>LEKOVI</Button> 
              <Button className="DodajKlinikuDugme"  onClick={this.prikazDijagnoza}>DIJAGNOZE</Button>  
          </Row>
          <Row>
          { this.state.hiddenLekovi ?
            <Card
                  title="Lista lekova"
                  // category="Here is a subtitle for this table"
                  ctTableFullWidth
                  ctTableResponsive
                  content={
                    <div>
                    <Button className="DodajKlinikuDugme"  onClick={e => this.dodajLek(e)}>Dodaj lek</Button>
                    <Dialog ref={(el) => { this.dialog = el }} ></Dialog>
                    
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th id="IdLeka">Rbr</th>
                          <th id="SifraLeka">Sifra</th>
                          <th id="NazivLeka">Naziv</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.listaLekovaUKC()}
                        
                      </tbody>
                    </Table>
                    </div>
                  }
            />
            : null
          }
          </Row>
          <Row>
            { this.state.hiddenDijagnoza ?
              <Card
                  title="Lista dijagnoza"
                  // category="Here is a subtitle for this table"
                  ctTableFullWidth
                  ctTableResponsive
                  content={
                    <div>
                    <Button className="DodajKlinikuDugme"  onClick={e => this.dodajDijagnozu(e)}>Dodaj dijagnozu</Button>
                    <Dialog ref={(el) => { this.dialog = el }} ></Dialog>
                    
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th id="Idijagnoze">Rbr</th>
                          <th id="OznakaDijagnoze">Oznaka</th>
                          <th id="NazivDijagnoze">Naziv</th>
                          <th id="OpisDijagnoze">Opis</th>
                          
                        </tr>
                      </thead>
                      <tbody>
                       {this.listaDijagnozaUKC()}
                        
                      </tbody>
                    </Table>
                    </div>
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

export default Sifrarnik;