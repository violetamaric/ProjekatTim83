import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import "klinickiCentar.css";
import { Button } from "react-bootstrap";
import axios from "axios";
import Dialog from 'react-bootstrap-dialog';
import { ButtonToolbar } from "react-bootstrap";
import "klinickiCentar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import events from "events.js"; //ovo nece trebati  kasnije
import moment from 'moment';
import ListaZahtevaPregled from "views/ListaZahtevaPregled.jsx"
import ListaZahtevaOper from "views/ListaZahtevaOper.jsx"
const localizer = momentLocalizer(moment);

class ListaSala extends Component {
  constructor(props) {
    super(props);
    console.log("LISTA SALAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaa -----------------------------")
    console.log(this.props);
    this.state = {
      uloga: props.uloga,
      email: props.email,
      token: props.token,
      pretraziPoljeKlinika: "",
      datumS: new Date(),
      nazivIzabraneSale: "",
      izabranaSala: 1,
      idAdmina: "",
      idKlinike: "",
      listaSalaKlinike: [],
      hiddenKalendar: false,
      pretragaTabela:  false,
      listaTermina: [],

      disabled: [false, false, false, false],
      
      listaSlobodnihSala: [],
      listaZauzetihTerminaSale: [],
      rezervisanaSala: false,
      rezervisanaSalaOp: false,
      izabraniLekar: null,
      listaSalaZaBrisanjeIzmjenu: [],

      listaLekara: [],
      velikiNiz: [],
      aktivaniDugmici: false,
      izabranDatum: false,
      prikaziDatumaTermina: false,
      prikazPretraga: false,
      odabranFilter: "",
      terminPregleda: props.termrinPregleda,
      idPregleda: props.idPregleda,
      // idLekar: props.idLekar,
      idLekar: "",
      imeLekar: "",
      prezimeLekar: "",
      idPacijent: props.idPacijent,
      datumPregleda: props.datumPregleda,
      //redirekcija od lista sala, mijenjam izgled i setujem datum
      // redirectFromListaSala: false,

      listaLekaraZaOperaciju: [],
      terminOper: props.terminOper,
      datumOper: props.datumOper,
      idPacijentOp: props.idPacijentOp,
      prikaz1: false,
      datum666: "",
      selectValue:"",
      selectTipSale: "",
      klinikaLekara: 0,
      idSale: "",
      brojSale: "",
      nazivSale: "",
      reirectToIzmeniLekar: false,
      listaLekaraSlobodnihOPERR:[]
    };
     
      console.log(this.state)
      console.log(this.props.datumOper);
      console.log(this.props);
      // console.log(this.state.datumPregleda);
     this.listaSalaK = this.listaSalaK.bind(this);
     this.ucitajSlobodneLekare = this.ucitajSlobodneLekare.bind(this);
     this.promenjenOdabirSale = this.promenjenOdabirSale.bind(this);
     this.handleChangeDate = this.handleChangeDate.bind(this);
     this.posaljiDatum = this.posaljiDatum.bind(this);
     this.handleDropdownChange = this.handleDropdownChange.bind(this);
     this.handleDropdownChangeTipSale = this.handleDropdownChangeTipSale.bind(this);
     this.dodeliLekara = this.dodeliLekara.bind(this);
     this.dodeliLekaraOper = this.dodeliLekaraOper.bind(this);
  //   this.rezervisiSalu = this.rezervisiSalu.bind(this);

  }

  getKlinikaValue(){

    return this.state.idKlinike;
  }
  handleChange = e => {
    e.preventDefault();
    
    this.setState({ [e.target.name]: e.target.value });

  };
  handleChangeDate = date => {

    //provjeri mi zauzeti  termin
    let lista = this.state.listaSalaKlinike;
    let listaT = this.state.listaTermina;                

    this.setState(
      {
        datumS: date,
        datum666: date,
        izabranDatum: true,
        
      },
      () => {
        this.pretraziPoDatumu();
        
      }
        );


  };
  pretraziPoDatumu(){
  } 
  proslediKliniku(klinika) {
    

  
    this.setState({
      klinikaLekara : klinika.target.value
      
    });
   


  };
  listaSalaIspisi() {


    
     
        var config = {
          headers: {
            Authorization: "Bearer " + this.state.token,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        };
       
        const urlKlinike = 'http://localhost:8025/api/sale/preuzmiSaleKlinike/' + this.state.idKlinike;    
         axios.get(urlKlinike, config)
            .then(klinika => {
               
                this.setState({
                    // idKlinike: klinika.data.id,
                    listaSalaKlinike: klinika.data,
                
                });
 
         })
 
      

  }
  componentWillMount(){
    


    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const url = 'http://localhost:8025/api/adminKlinike/getAdminKlinikeByEmail';
    axios.get(url, config)
      .then(Response => {


        this.setState({
          email: Response.data.email,
        //   ime: Response.data.ime,
        //   prezime: Response.data.prezime,
        //   telefon: Response.data.telefon,
        idKlinike: Response.data.idKlinike,
        });

        axios.get('http://localhost:8025/api/sale/allIB/' +  this.state.idKlinike, config)
        .then(resp=>{
          console.log(resp);
          this.setState({
            listaSalaZaBrisanjeIzmjenu: resp.data
          })
      
        })


        const urlKlinike = 'http://localhost:8025/api/klinike/listaLekaraKlinika/' + this.state.idKlinike;    
        axios.get(urlKlinike, config)
          .then(klinika => {

   
            this.setState({
                // idKlinike: klinika.data.id,
                listaSalaKlinike: klinika.data,
             
            });
              
                const urlKlinike = 'http://localhost:8025/api/sale/preuzmiSaleKlinike/' + this.state.idKlinike;    
                 axios.get(urlKlinike, config)
                    .then(klinika => {
                       
            
                        this.setState({
                            // idKlinike: klinika.data.id,
                            listaSalaKlinike: klinika.data
                            
                        
                        }, ()=>{
                         
                         
                       
                          const urlKlinike = 'http://localhost:8025/api/sale/allTermini';    
                            axios.get(urlKlinike, config)
                               .then(termini => {
                            
                                // console.log(termini.data);
                                  this.setState({
                                      listaTermina: termini.data
                                  }, ()=>{
                                        for(var j = 0; j < this.state.listaTermina.length; j++){
                                            var dis = [];
                                            var pocetakTerminaZauzetog = this.state.listaTermina[j].termin;
                                          
                                         
                                                if(pocetakTerminaZauzetog==9){
                                                
                                                    dis = [true, false, false, false];
                                                   
                                                  
                                                } else  if(pocetakTerminaZauzetog==11){
                                                  this.setState({
                                                    disabled: [false, true, false, false]
                                                  })
                                                }else  if(pocetakTerminaZauzetog==13){
                                                  this.setState({
                                                    disabled: [false, false, true, false]
                                                  })
                                                } else  if(pocetakTerminaZauzetog==15){
                                                  this.setState({
                                                    disabled: [false, false, false, true]
                                                  })
                                                }
                                         }
                                         
                                  });
                                 
                               })
                                .catch(error => {
                                  console.log("sale termini nisu preuzeti")
                                })
                             });
                            
         
                 })
         
            })
      
      })
      
      .catch(error => {
        console.log("Administrator klinike  nije preuzet")
      })


   
   

  if(this.props.redirectToListaSala==true){
        const urlPRegled = 'http://localhost:8025/api/pregledi/pronadjiSaleZaTajTermin/' + this.props.idPregleda;    
        console.log(urlPRegled);
    
        axios.get(urlPRegled,  config)
          .then(pregled => {
            console.log(pregled.data);
            this.setState({
              listaSlobodnihSala: pregled.data,
            }, ()=>{
              this.state.listaSlobodnihSala.map(sala=>{
                sala.zauzetiTermini.map(zauzetiTermin=>{
                  var zabranjeniTermini = [false, false, false, false];
                  // for(var j = 0; j < zauzetiTermini.length; j++){
                    var preuzmiPocTermina = [];
                    preuzmiPocTermina = zauzetiTermin.termin; 
      
                    
                      var datumP = zauzetiTermin.datumPocetka;
                      // console.log("Prikaz 1 : " + prikaz1);
                      console.log(this.props.terminPregleda);
                      console.log(this.props.datumPregleda);
                      console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
                      if(datumP.valueOf()===this.props.datumPregleda.valueOf()){
                        if(preuzmiPocTermina===this.props.terminPregleda){
                          
                          this.setState({
                            prikaz1: true
                          })
                          // console.log("Prikaz 1 - 1 : " + prikaz1);
      
                        }
      
                      }
               
                })
              })
            });
           
          });
   }

  if(this.props.redirectZahOper==true){
    const urlPRegled = 'http://localhost:8025/api/operacije/pronadjiSaleZaTajTermin/' + this.props.idOper;    
    console.log(urlPRegled);

    axios.get(urlPRegled,  config)
      .then(pregled => {
        console.log(pregled.data);
        this.setState({
          listaSlobodnihSala: pregled.data,
        }, ()=>{

         
          this.state.listaSlobodnihSala.map(sala=>{
            sala.zauzetiTermini.map(zauzetiTermin=>{
              var zabranjeniTermini = [false, false, false, false];
              // for(var j = 0; j < zauzetiTermini.length; j++){
                var preuzmiPocTermina = [];
                preuzmiPocTermina = zauzetiTermin.termin; 
  
                
                  var datumP = zauzetiTermin.datumPocetka;
                  // console.log("Prikaz 1 : " + prikaz1);
                  console.log(this.props.terminOper);
                  console.log(this.props.datumOper);
                  
                  console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
                  if(datumP.valueOf()===this.props.datumOper.valueOf()){
                    if(preuzmiPocTermina===this.props.terminOper){
                      
                      this.setState({
                        prikaz1: true
                      })
                   
                
                    }
  
                  }
           
            })
          })


        });
       
      } );
       
     


     
  }



  console.log("PROPPSSSSS !!!!!!!!!!!!!!!!!!!!!!!!!1 ")
  console.log(this.props.terminPregleda);
  console.log(this.props.datumPregleda);
  console.log(this.props.datumOper);
  console.log(this.props.terminOper);
  console.log("1111111111111111111111111111111111111111111111111111111111")

  }

  biranjeLekara(lekar){

    const idL = lekar.target.value;

    this.setState({
      izabraniLekar: lekar.target.value
    });

    console.log("Value id:" + lekar.target.value);
    
    let lista = this.state.listaLekara;

    for (var i = 0; i < lista.length; i++) {
      var naziv = lista[i].naziv;
      var id = lista[i].id;
      var sifra = lista[i].prezime;

      if (id == lekar.target.value) {
        this.setState({
          imeLekar: naziv,
          prezimeLekar: sifra,
          idLekar: id, 
         
       
        }, ()=> {
          this.dialog.hide();
            var config = {
              headers: {
                Authorization: "Bearer " + this.state.token,
                Accept: "application/json",
                "Content-Type": "application/json"
              }
            };
            
            console.log("111111111111111111111111111111111111111111111111")
            const url3 = "http://localhost:8025/api/pregledi/rezervisanjeSale";
            var datumm = moment(this.props.datumPregleda).format("DD.MM.YYYY");
            console.log(this.state.idSale);
            console.log( this.state.idKlinike);
            console.log(datumm);
            console.log(this.state.selectValue);
            console.log(this.props.idPregleda);
            console.log(this.props.idLekar);
            
            console.log(this.props);
            // console.log(this.props.idPacijewnt)
            axios
              .post(url3, {
                salaID: this.state.idSale,
                klinikaID: this.state.idKlinike,
                datum: this.props.datumPregleda,
                termin: this.state.selectValue,
                id: this.props.idPregleda,
                lekarID: this.state.idLekar,
                pacijentID: this.props.idPacijent
                
              }, config)
              .then(response => {
                
                console.log("USPJEEEEEH< REZ SALAAAA");
              
                this.setState({
                  rezervisanaSala: true
                }, ()=> {console.log(this.state.rezervisanaSala)
                  
                  
                  // this.props.handleClick("USPESNA REZERVACIJA");
                })
        
              })
              .catch(error => {
              });
            
           });
    
        
      }
      
    }
    
  }

  ponovoPreuzmiSale(){
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const urlKlinike = 'http://localhost:8025/api/sale/preuzmiSaleKlinike/' + this.state.idKlinike;    
    axios.get(urlKlinike, config)
       .then(klinika => {
          
           this.setState({
               // idKlinike: klinika.data.id,
               listaSalaKlinike: klinika.data,
           
           });

    })

    axios.get('http://localhost:8025/api/sale/allIB/' +  this.state.idKlinike, config)
    .then(resp=>{
      console.log(resp);
      this.setState({
        listaSalaZaBrisanjeIzmjenu: resp.data
      })
  
    })

    this. listaSalaK();

  }

  ispisiSlobodneLekare() {
    if(this.props.redirectToListaSala==true){
      let res = [];
      let lista = this.state.listaLekara;
  
      for (var i = 0; i < lista.length; i++) {
        
        res.push(
  
          <tr key={i}>
            <td>
                <input
                  name="odabranaSala"
                  type="radio"
                  value={lista[i].id}
                  checked={this.state.izabranaDijagnoza == lista[i].id}
                  onChange={e => {
                    this.biranjeLekara(e);
                  }}
                ></input>
              </td>
           
            <td>{lista[i].ime}</td>
            <td>{lista[i].prezime}</td>
            <td>{lista[i].email}</td>
         
            <td>{lista[i].telefon}</td>   
         
   
          </tr>
        );
      }
      return res;
      
    }else if(this.props.redirectZahOper==true){
      let res = [];
      let lista = this.state.listaLekaraZaOperaciju;
  
      for (var i = 0; i < lista.length; i++) {
        
        res.push(
                <option value={lista[i].id}>{lista[i].ime} {lista[i].prezime}</option>
        );
      }
      return res;
    }
    
  }

  dodajSalu = e => {
    e.preventDefault();


    this.dialog.show({
      title: 'Dodaj salu',
      body: [
      <form className="formaZaDodavanjeNovogLekara">
         
          <div className="imeLekara" >
            <label className="lekarImeLabel" htmlFor="imeLekara">Naziv: </label>
            <input className="lekarImeLabel"
              type="text"
              name="nazivSale"
              defaultValue = "" 
              onChange={this.handleChange}
            />
          </div>
          <div className="telefonLekara" >
            <label className="lekarTelefonLabel" htmlFor="telefonLekara">Oznaka: </label>
            <input className="lekarTelefonLabel"
              type="text"
              name="brojSale"
              defaultValue=""
              onChange={this.handleChange}
            />
          </div>
          <div className="telefonLekara">
            <label className="lekarTelefonLabel" htmlFor="telefonLekara">
              Tip sale:{" "}
            </label>
            <select
              className="lekarTelefonLabel"
              name="salaID"
              onChange={this.handleDropdownChangeTipSale}
            >
              <option value={0}> 
                    Sala za operaciju
              </option>
              <option value={1}>
                    Sala za pregled
              </option>
              {/* {this.izaberiSalu()} */}
            </select>
          </div>
    
      </form> 
      ],
      actions: [
        // Dialog.CancelAction(),
        Dialog.OKAction(() => {
          
          var config = {
            headers: {
              Authorization: "Bearer " + this.state.token,
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          };
          const url3 = "http://localhost:8025/api/sale/dodajSalu";
          axios
            .post(url3, {
              naziv: this.state.nazivSale,
              broj: this.state.brojSale,
              klinikaID: this.state.idKlinike,
              tipSale: this.state.selectTipSale
              
            }, config)
            .then(response => {
              
              this.ponovoPreuzmiSale();
              

            })
            .catch(error => {
            });
           
        })
      ],
      bsSize: 'medium',
      onHide: (dialog) => {
        dialog.hide()
      }
    })
    
  }


handleIzmeni = e => {
    e.preventDefault();

    this.setState({
        idSale: e.target.id
    });
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const url = 'http://localhost:8025/api/sale/' + e.target.id;
    axios.get(url, config)
      .then(Response => {


        this.setState({
          brojSale: Response.data.broj,
          nazivSale: Response.data.naziv,
          idKlinike: Response.data.klinikaID,
          tipSale: Response.data.tipSale
         });

        this.dialog.show({
          title: 'Izmeni salu',
          body: [
          <form className="formaZaDodavanjeNovogLekara">
            
              <div className="imeLekara" >
                <label className="lekarImeLabel" htmlFor="imeLekara">Naziv: </label>
                <input className="lekarImeLabel"
                  type="text"
                  name="nazivSale"
                  defaultValue = {this.state.nazivSale} 
                  onChange={this.handleChange}
                />
              </div>
              <div className="telefonLekara" >
                <label className="lekarTelefonLabel" htmlFor="telefonLekara">Oznaka: </label>
                <input className="lekarTelefonLabel"
                  type="text"
                  name="brojSale"
                  defaultValue= {this.state.brojSale}
                  onChange={this.handleChange}
                />
              </div>
            
        
          </form> 
          ],
          actions: [
            Dialog.CancelAction(),
            Dialog.OKAction(() => {

              var config = {
                headers: {
                  Authorization: "Bearer " + this.state.token,
                  Accept: "application/json",
                  "Content-Type": "application/json"
                }
              };
              const url3 = "http://localhost:8025/api/sale/izmenaSale";
              axios
                .put(url3, {
                  id: Response.data.id,
                  naziv: this.state.nazivSale,
                  broj: this.state.brojSale,
                  klinikaID: this.state.idKlinike,
                  tipSale: this.state.selectTipSale
                  
                }, config)
                .then(response => {
                  
          
                  this.ponovoPreuzmiSale();
                  // this.listaSalaIspisi();
    
                })
                .catch(error => {
                });
              
            })
          ],
          bsSize: 'medium',
          onHide: (dialog) => {
            dialog.hide()
          }
        })
  
    }) 

    .catch(error => {
    });
    

  };

obrisiLekara = e => {
    e.preventDefault();
    
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const url6 = "http://localhost:8025/api/sale/brisanjeSale";
          axios
            .post(url6, {
              id : e.target.id, 
              // naziv: this.state.nazivSale,
              // broj: this.state.brojSale,
              klinikaID: this.state.idKlinike
            
            }, config)
            .then(response => {

              this.listaSalaIspisi();
              
            })
            .catch(error => {
            });
  
  }
  sacuvajLekre = e=>{
    let lekari = this.state.listaLekaraZaOperaciju;
    console.log(lekari.length);
    console.log('^^^^^^^^^^^&&&&&&&&&&&&&&')
  }

  dodeliLekaraOper= e => {
    console.log("Dijalog sa slobodnim lekarima za taj datum i termin");
    console.log(e.target.id + " " + e.target.value);
    var idS = e.target.id;
    var termin = e.target.value;
     this.setState({
       idSale: idS,
       terminOper : termin

     }, ()=> {
       console.log("================================")
       console.log(this.state.idSale);
       var config = {
         headers: {
           Authorization: "Bearer " + this.state.token,
           Accept: "application/json",
           "Content-Type": "application/json"
         }
       };
      for(var k=0; k<this.state.listaSlobodnihSala.length; k++){

       console.log(this.state.listaSlobodnihSala[k]);
       console.log("for ...... ")
         
         const url = 'http://localhost:8025/api/operacije/pronadjiLekaraZaOperaciju/';    
         console.log(url);
         console.log("3333333333333333333333333333333333333333")
         console.log(this.props.terminOper);
         console.log(this.props.datumOper);
         axios
         .post(url, {
           termin: this.props.terminOper,
           klinikaID: this.props.idKlinike,
           salaID: this.state.listaSlobodnihSala[k].id,
           datum: this.props.datumOper, //treba datum onaj koji je poslat iz tabele //TODO
         
         
         //  lekarID: this.props.idLekar,
         }, config)
         .then(response => {
           console.log("LLLLLLLAAAA")
           console.log(response.data);
             this.setState({
               listaLekaraSlobodnihOPERR: response.data
             })
       
            
       this.dialog.show({
         title: 'Lista slobodnih lekara',
         body: [
         <form className="formaZaDodavanjeNovogLekara">
            
           
                       <div className="telefonLekara">
            <label className="lekarTelefonLabel" htmlFor="biranjeLekara">
              Lekar:{" "}
            </label>
            <select   multiple
              className="lekarTelefonLabel"
              // name="lekadID"
              // onChange={e => this.biranjeLekara(e)}
              
            >
              {this.ucitajSlobodneLekare()}
              {/* {this.ispisiSlobodneLekare()} */}
            </select>
            {/* <div>
              <Button onClick={this.rezervisiSaluOper()}> OK</Button>
            </div> */}

          </div>
                       
         </form> 
         ],
         
         actions: [
          Dialog.OKAction(() => {
            if(this.state.prikaz1==false){
              this.setState({
                datumS: this.props.datumOper
              }, ()=> {
                this.dialog.hide();
              });
        
            }
  
        
          var config = {
            headers: {
              Authorization: "Bearer " + this.state.token,
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          };
          const url = 'http://localhost:8025/api/sale/' + this.state.idSale;
          axios.get(url, config)
            .then(Response => {
              console.log("SALA PREUZEO JE");
              console.log(Response.data);
        
              this.setState({
                brojSale: Response.data.broj,
                nazivSale: Response.data.naziv,
                idKlinike: Response.data.klinikaID,
                idSale: Response.data.id
               }, ()=> {
                               
                //  console.log(this.state.idLekar);
                console.log("111111111111111111111111111111111111111111111111")
                const url3 = "http://localhost:8025/api/operacije/rezervisanjeSale";
                axios
                  .post(url3, {
                    salaID: this.state.idSale,
                    klinikaID: this.state.idKlinike,
                    datum: this.state.datumS,
                    termin: this.state.terminOper,
                    id: this.props.idOper,
                    listaLekara: this.state.listaLekaraZaOperaciju,
                    pacijentID: this.props.idPacijentOp
                    
                  }, config)
                  .then(response => {
                    console.log("USPJEEEEEH< REZ SALAAAA");
                    console.log(this.props)
                    // this.props.handleClick("USPESNA REZERVACIJA");
                    this.setState({
                      rezervisanaSalaOp: true
                    }, ()=> {console.log(this.state.rezervisanaSalaOp)
                      
                      
        
                    })
            
                  })
                  .catch(error => {
                  });
                
               });
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
        }
     })
    
    
     
 }


  dodeliLekara= e => {
     console.log("Dijalog sa slobodnim lekarima za taj datum i termin");
     console.log(e.target.id + " " + e.target.value);
     var idS = e.target.id;
      this.setState({
        idSale: idS
      }, ()=> {
        console.log("================================")
        console.log(this.state.idSale);
        var config = {
          headers: {
            Authorization: "Bearer " + this.state.token,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        };
        const url3 = "http://localhost:8025/api/pregledi/pronadjiLekaraZaPregled";
        axios
          .post(url3, {
            termin: this.state.selectValue,
            klinikaID: this.state.idKlinike,
            salaID: this.state.idSale,
            datum: this.props.datumPregleda, //treba datum onaj koji je poslat iz tabele //TODO
            termin: this.state.selectValue,
           
          //  lekarID: this.props.idLekar,
          }, config)
          .then(response => {
            
            console.log("||||||||||||||||||| lista dostupnih lekaraaaaa" );
            console.log(response.data);
            this.setState({
              listaLekara: response.data,
            })
          // this.listaLekaraPonovo();
        this.dialog.show({
          title: 'Lista slobodnih lekara',
          body: [
          <form className="formaZaDodavanjeNovogLekara">
             
             <Table striped hover>
                          <thead>
                            <tr>
                              <th></th>
                             
                              <th id="ImePacijenta"> Ime</th>
                              <th id="PrezimePacijenta">Prezime</th>
                              <th id="EmailPacijenta">Email</th>
                             
                              <th id="TelefonPacijenta">Telefon</th>
                      
                            </tr>
                          </thead>
                          <tbody>{this.ispisiSlobodneLekare()}</tbody>
                        </Table>
          </form> 
          ],
  
          bsSize: 'medium',
          onHide: (dialog) => {
            dialog.hide()
            console.log('closed by clicking background.')
          }
        })
          })
      })
     
      
    
  }

  // odabranaSala = e => {
  //   //treba redirektovati na pretragu i filtriranje lekara
  //   console.log(e.target.value);
  //   var config = {
  //     headers: {
  //       Authorization: "Bearer " + this.state.token,
  //       Accept: "application/json",
  //       "Content-Type": "application/json"
  //     }
  //   };
  //   axios
  //     .get(
  //       "http://localhost:8025/api/sale/" +
  //         this.state.izabranaSala,
  //         config
  //     )
  //     .then(Response => {
    
  //       this.setState({
  //         nazivSale: Response.data.naziv,
  //         brojSale: Response.data.broj,
  //         idSale: Response.data.id,
  //         idKlinike: Response.data.klinikaID
  //       }, () => {
  //         const url =  "http://localhost:8025/api/pregledi/rezervisanje" ;
  //           axios
  //             .post(url, {
  //               id: this.props.idPregleda,
  //               salaN : this.state.nazivSale,
  //               salaBR: this.state.brojSale,
  //               salaID: this.state.idSale,
  //               datum: this.props.datumPregleda, //postavi datum state trenutni 
  //               klinikaID: this.state.idKlinike
                
  //             }, config)
  //             .then(response => {
             
  //             })
  //             .catch(error => {
          
  //             });
  //         })
        

  //     })

  //     .catch(error => {
  //     });



  // };

  promenjenOdabirSale = e => {
    console.log ("SALAAA : *********************** "   + e.target.value );
    this.setState(
      {
        izabranaSala: e.target.value
      }




      );


    // if (e.currentTarget.value != 0 && e.currentTarget.value != undefined) {
    //   const lista = this.state.listaSalaKlinike;
    //   for (var i = 0; i < lista.length; i++) {
    //     if (lista[i].id == e.currentTarget.value) {
    //       this.setState(
    //         {
    //           nazivIzabraneSale: lista[i].nazivSale
    //         });
    //       break;
    //     }
    //   }
    // }
    this.listaSalaK();
  };

  handleDropdownChangeTipSale(e) {
    this.setState({ selectTipSale: e.target.value });
  }
  handleDropdownChange(e) {
    this.setState({ selectValue: e.target.value });
  }

  dodajLekareUListu = e=>{
    console.log(e.target.value);
    let listaa = this.state.listaLekaraZaOperaciju;
    listaa.push(e.target.value);
    this.setState({
      listaLekaraZaOperaciju: listaa
    })
  }

  ucitajSlobodneLekare(){
  
    let res = [];
    let lista = this.state.listaLekaraSlobodnihOPERR;
    for (var i = 0; i < lista.length; i++) {
    res.push(<option onClick={e=>this.dodajLekareUListu(e)}  value={lista[i].id}>{lista[i].ime} {lista[i].prezime}</option>);
    }
    return res;
  }
  
  listaSalaK() {
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    let res = [];

    const pretraga = this.state.pretraziPoljeKlinika;
 
    let lista = this.state.listaSalaKlinike;
    let listaT = this.state.listaTermina;
    
    let listaSlobodnihSala = this.state.listaSlobodnihSala;
    let lis = this.state.listaSalaZaBrisanjeIzmjenu;

    
    if( this.props.redirectToListaSala==true){
      if((pretraga == "" || pretraga == undefined)){
            //  var prikaz1 =  false;
        var prikaz1 = this.state.prikaz1;
        for (var i = 0; i < this.state.listaSlobodnihSala.length; i++) {
          var zauzetiTermin = [];
          zauzetiTermin = listaSlobodnihSala[i].zauzetiTermini;
         
          var zabranjeniTermini = [false, false, false, false];
          for(var j = 0; j < zauzetiTermin.length; j++){
            var preuzmiPocTermina = [];
            preuzmiPocTermina = zauzetiTermin[j].termin; 

            
              var datumP = zauzetiTermin[j].datumPocetka;
              // console.log("Prikaz 1 : " + prikaz1);
              if(datumP.valueOf()===this.props.datumPregleda.valueOf()){
                if(preuzmiPocTermina===this.props.terminPregleda){
                  
                  prikaz1 = true;
                  // console.log("Prikaz 1 - 1 : " + prikaz1);

                }

              }
              
              if(preuzmiPocTermina==9){
                     
               zabranjeniTermini[0] = true;
             
           } else  if(preuzmiPocTermina==11){
            
               zabranjeniTermini[1] = true;
            
           }else  if(preuzmiPocTermina==13){
             
               zabranjeniTermini[2] = true;
            
           } else  if(preuzmiPocTermina==15){
             
               zabranjeniTermini[3] = true;
            
           }

          }
          
          var naziv = this.state.listaSlobodnihSala[i].naziv;
          var broj = this.state.listaSlobodnihSala[i].broj;

      
    
            
         if(prikaz1==false){

          var krajT = this.props.terminPregleda + 2;
          res.push(
            <tr key={i}>
              
              <td>{naziv}</td>
              <td>{broj}</td>
              <td> {moment(this.props.datumPregleda).format("DD.MM.YYYY.")}
               {this.props.terminPregleda} : 00 - {krajT} : 00
               </td>
               <td><Button id={listaSlobodnihSala[i].id}  value= {this.state.selectValue}  onClick={e => this.rezervisiSalu(e) }>  Rezervisi</Button>  </td> 
             
            </tr>
          );
         }else{
          
          res.push(
            <tr key={i}>
                   {/* <td>
                    <input
                      name="odabranaSala"
                      type="radio"
                      value={listaSlobodnihSala[i].id}
                      checked={this.state.izabranaSala == listaSlobodnihSala[i].id}
                      onChange={e => {
                        this.promenjenOdabirSale(e);
                      }}
                    ></input>
                  </td> */}
              <td>{naziv}</td>
              <td>{broj}</td>
              <td> {moment(this.state.datumS).format("DD.MM.YYYY.")}
               <select id="selectTermin" onChange={this.handleDropdownChange}>
                        <option value={9} disabled={zabranjeniTermini[0]}>
                          09:00-11:00
                        </option>
                        <option value={11} disabled={zabranjeniTermini[1]}> 
                          11:00-13:00
                        </option>
                        <option value={13} disabled={zabranjeniTermini[2]}>
                          13:00-15:00
                        </option>
                        <option value={15} disabled={zabranjeniTermini[3]}>
                          15:00-17:00
                        </option>
                 </select>
               </td>
               <td><Button id={listaSlobodnihSala[i].id}  value= {this.state.selectValue}  onClick={e => this.dodeliLekara(e) }>Dodeli lekara</Button>  </td> 
             
            </tr>
          );
         }

          
        }
      }else{
          //  var prikaz1 =  false;
          var prikaz1 = this.state.prikaz1;
          for (var i = 0; i < this.state.listaSlobodnihSala.length; i++) {
            var naziv = this.state.listaSlobodnihSala[i].naziv;
            var broj = this.state.listaSlobodnihSala[i].broj.toString();

  
            if(naziv.toLowerCase().includes(pretraga.toLowerCase())
            || broj.toLowerCase().includes(pretraga.toLocaleLowerCase())){
              var zauzetiTermin = [];
              zauzetiTermin = listaSlobodnihSala[i].zauzetiTermini;
             
              var zabranjeniTermini = [false, false, false, false];
              for(var j = 0; j < zauzetiTermin.length; j++){
                var preuzmiPocTermina = [];
                preuzmiPocTermina = zauzetiTermin[j].termin; 
  
                
                  var datumP = zauzetiTermin[j].datumPocetka;
                  // console.log("Prikaz 1 : " + prikaz1);
                  if(datumP.valueOf()===this.props.datumPregleda.valueOf()){
                    if(preuzmiPocTermina===this.props.terminPregleda){
                      
                      prikaz1 = true;
                      // console.log("Prikaz 1 - 1 : " + prikaz1);
  
                    }
  
                  }
                  
                  if(preuzmiPocTermina==9){
                         
                   zabranjeniTermini[0] = true;
                 
               } else  if(preuzmiPocTermina==11){
                
                   zabranjeniTermini[1] = true;
                
               }else  if(preuzmiPocTermina==13){
                 
                   zabranjeniTermini[2] = true;
                
               } else  if(preuzmiPocTermina==15){
                 
                   zabranjeniTermini[3] = true;
                
               }
  
              }
              
             
          
        
                
             if(prikaz1==false){
  
              var krajT = this.props.terminPregleda + 2;
              res.push(
                <tr key={i}>
                  
                  <td>{naziv}</td>
                  <td>{broj}</td>
                  <td> {moment(this.props.datumPregleda).format("DD.MM.YYYY.")}
                  {this.props.terminPregleda} : 00 - {krajT} : 00
                   </td>
                   <td><Button id={listaSlobodnihSala[i].id}  value= {this.state.selectValue}  onClick={e => this.rezervisiSalu(e) }>  Rezervisi</Button>  </td> 
                 
                </tr>
              );
             }else{
              
              res.push(
                <tr key={i}>
                       {/* <td>
                        <input
                          name="odabranaSala"
                          type="radio"
                          value={listaSlobodnihSala[i].id}
                          checked={this.state.izabranaSala == listaSlobodnihSala[i].id}
                          onChange={e => {
                            this.promenjenOdabirSale(e);
                          }}
                        ></input>
                      </td> */}
                  <td>{naziv}</td>
                  <td>{broj}</td>
                  <td> {moment(this.state.datumS).format("DD.MM.YYYY.")}
                   <select id="selectTermin" onChange={this.handleDropdownChange}>
                            <option value={9} disabled={zabranjeniTermini[0]}>
                              09:00-11:00
                            </option>
                            <option value={11} disabled={zabranjeniTermini[1]}> 
                              11:00-13:00
                            </option>
                            <option value={13} disabled={zabranjeniTermini[2]}>
                              13:00-15:00
                            </option>
                            <option value={15} disabled={zabranjeniTermini[3]}>
                              15:00-17:00
                            </option>
                     </select>
                   </td>
                   <td><Button id={listaSlobodnihSala[i].id}  value= {this.state.selectValue}  onClick={e => this.dodeliLekara(e) }>Dodeli lekara</Button>  </td> 
                 
                </tr>
              );
            }
           
           }

            
          }
      }
      
       

    } else if( this.props.redirectZahOper==true){
      if((pretraga == "" || pretraga == undefined)){
            //  var prikaz1 =  false;
        var prikaz1 = this.state.prikaz1;
        for (var i = 0; i < this.state.listaSlobodnihSala.length; i++) {
          var zauzetiTermin = [];
          zauzetiTermin = listaSlobodnihSala[i].zauzetiTermini;
         
          var zabranjeniTermini = [false, false, false, false];
          for(var j = 0; j < zauzetiTermin.length; j++){
            var preuzmiPocTermina = [];
            preuzmiPocTermina = zauzetiTermin[j].termin; 

            
              var datumP = zauzetiTermin[j].datumPocetka;
              // console.log("Prikaz 1 : " + prikaz1);
              if(datumP.valueOf()===this.props.datumOper.valueOf()){
                if(preuzmiPocTermina===this.props.terminOper){
                  
                  prikaz1 = true;
                  // console.log("Prikaz 1 - 1 : " + prikaz1);

                }

              }
              
              if(preuzmiPocTermina==9){
                     
               zabranjeniTermini[0] = true;
             
           } else  if(preuzmiPocTermina==11){
            
               zabranjeniTermini[1] = true;
            
           }else  if(preuzmiPocTermina==13){
             
               zabranjeniTermini[2] = true;
            
           } else  if(preuzmiPocTermina==15){
             
               zabranjeniTermini[3] = true;
            
           }

          }
          
          var naziv = this.state.listaSlobodnihSala[i].naziv;
          var broj = this.state.listaSlobodnihSala[i].broj;

      
    
            
         if(prikaz1==false){

          var krajT = this.props.terminOper + 2;
          res.push(
            <tr key={i}>
              
              <td>{naziv}</td>
              <td>{broj}</td>
              <td> {moment(this.props.datumOper).format("DD.MM.YYYY.")}
               {this.props.terminOper} : 00 - {krajT} : 00
               {/* </td>
               <td>
               <select class="mdb-select md-form colorful-select dropdown-danger" multiple
                  // className="lekarTelefonLabel"
                  // name="lekari"
                 // onChange={e => this.biranjeTipaPregleda(e)}
                >
                  {this.ucitajSlobodneLekare()}
                </select>
                {/* <button class="btn-save btn btn-sm">Save</button> */}
               </td> 
               <td><Button id={listaSlobodnihSala[i].id}  value={this.props.terminOper}  onClick={e => this.dodeliLekaraOper(e) }>  Dodeli lekara</Button>  </td> 
             
            </tr>
          );
         }else{
          
          res.push(
            <tr key={i}>
                
              <td>{naziv}</td>
              <td>{broj}</td>
              <td> {moment(this.state.datumS).format("DD.MM.YYYY.")}
               <select id="selectTermin" onChange={this.handleDropdownChange}>
                        <option value={9} disabled={zabranjeniTermini[0]}>
                          09:00-11:00
                        </option>
                        <option value={11} disabled={zabranjeniTermini[1]}> 
                          11:00-13:00
                        </option>
                        <option value={13} disabled={zabranjeniTermini[2]}>
                          13:00-15:00
                        </option>
                        <option value={15} disabled={zabranjeniTermini[3]}>
                          15:00-17:00
                        </option>
                 </select>
               </td>
               {/* <td> */}
                  {/* <select
                  // className="lekarTelefonLabel"
                  // name="lekari"
                  class="mdb-select md-form colorful-select dropdown-danger" multiple
                 // onChange={e => this.biranjeTipaPregleda(e)}
                >
                  {this.ucitajSlobodneLekare()}
                </select> */}
                {/* <button class="btn-save btn btn-sm" onClick={e=>this.sacuvajLekre(e)}> Sacuvaj</button> */}
               {/* </td> */}
               <td><Button id={listaSlobodnihSala[i].id}  value= {this.state.selectValue}  onClick={e => this.dodeliLekaraOper(e) }>Dodeli lekara</Button>  </td> 
             
            </tr>
          );
         }

          
        }
      }else{
          //  var prikaz1 =  false;
          var prikaz1 = this.state.prikaz1;
          for (var i = 0; i < this.state.listaSlobodnihSala.length; i++) {
            var naziv = this.state.listaSlobodnihSala[i].naziv;
            var broj = this.state.listaSlobodnihSala[i].broj.toString();

  
            if(naziv.toLowerCase().includes(pretraga.toLowerCase())
            || broj.toLowerCase().includes(pretraga.toLocaleLowerCase())){
              var zauzetiTermin = [];
              zauzetiTermin = listaSlobodnihSala[i].zauzetiTermini;
             
              var zabranjeniTermini = [false, false, false, false];
              for(var j = 0; j < zauzetiTermin.length; j++){
                var preuzmiPocTermina = [];
                preuzmiPocTermina = zauzetiTermin[j].termin; 
  
                
                  var datumP = zauzetiTermin[j].datumPocetka;
                  // console.log("Prikaz 1 : " + prikaz1);
                  if(datumP.valueOf()===this.props.datumPregleda.valueOf()){
                    if(preuzmiPocTermina===this.props.terminPregleda){
                      
                      prikaz1 = true;
                      // console.log("Prikaz 1 - 1 : " + prikaz1);
  
                    }
  
                  }
                  
                  if(preuzmiPocTermina==9){
                         
                   zabranjeniTermini[0] = true;
                 
               } else  if(preuzmiPocTermina==11){
                
                   zabranjeniTermini[1] = true;
                
               }else  if(preuzmiPocTermina==13){
                 
                   zabranjeniTermini[2] = true;
                
               } else  if(preuzmiPocTermina==15){
                 
                   zabranjeniTermini[3] = true;
                
               }
  
              }
              
             
          
        
                
             if(prikaz1==false){
  
              var krajT = this.props.terminPregleda + 2;
              res.push(
                <tr key={i}>
                  
                  <td>{naziv}</td>
                  <td>{broj}</td>
                  <td> {moment(this.props.datumPregleda).format("DD.MM.YYYY.")}
                  {this.props.terminPregleda} : 00 - {krajT} : 00
                   </td>
                   <td><Button id={listaSlobodnihSala[i].id}  value= {this.state.selectValue} onClick={e => this.rezeriviSalluOp(e) }>  Rezervisi</Button>  </td> 
                 
                </tr>
              );
             }else{
              
              res.push(
                <tr key={i}>
                       {/* <td>
                        <input
                          name="odabranaSala"
                          type="radio"
                          value={listaSlobodnihSala[i].id}
                          checked={this.state.izabranaSala == listaSlobodnihSala[i].id}
                          onChange={e => {
                            this.promenjenOdabirSale(e);
                          }}
                        ></input>
                      </td> */}
                  <td>{naziv}</td>
                  <td>{broj}</td>
                  <td> {moment(this.state.datumS).format("DD.MM.YYYY.")}
                   <select id="selectTermin" onChange={this.handleDropdownChange}>
                            <option value={9} disabled={zabranjeniTermini[0]}>
                              09:00-11:00
                            </option>
                            <option value={11} disabled={zabranjeniTermini[1]}> 
                              11:00-13:00
                            </option>
                            <option value={13} disabled={zabranjeniTermini[2]}>
                              13:00-15:00
                            </option>
                            <option value={15} disabled={zabranjeniTermini[3]}>
                              15:00-17:00
                            </option>
                     </select>
                   </td>
                   <td><Button id={listaSlobodnihSala[i].id}  value= {this.state.selectValue}  onClick={e => this.dodeliLekara(e) }>Dodeli lekara</Button>  </td> 
                 
                </tr>
              );
            }
           
           }

            
          }
      }
      
       

    }else if ((pretraga == "" || pretraga == undefined) && this.state.izabranDatum == false ) {
      var nova = [];
     
      for(var j =  0; j<lista.length;j++){
        // for (var i = 0; i < lis.length; i++) {
          if(lis.some(item => lista[j].id === item.id)){
            console.log("EEEEEEEEEEEEEEEEEEEEEEE")
          res.push(
            <tr key={i}>
             
  
                  <td>{lista[j].naziv}</td>
                  <td>{lista[j].broj}</td>
             
                <td >
                      <Button  id={lista[j].id} onClick={e => this.obrisiLekara(e)}>Obrisi</Button>
                      <Dialog ref={(el) => { this.dialog = el }} ></Dialog>     
                </td>
                <td>
                    <Button className="OdobrenZahtev" id={lista[j].id} onClick={e => this.handleIzmeni(e)}>
                      Izmeni
                    </Button>
                </td>
                
            </tr>
          );
          }else{
              
                res.push(
                  <tr key={j}>
                   
        
                        <td>{lista[j].naziv}</td>
                        <td>{lista[j].broj}</td>
                        <td></td>
                        <td></td>
                      
                  </tr>
                );
        
          }
        // }
      }
      console.log(nova)
       
    
      //   }
        
      // }
      // // else{
      // /
      // // }
    } else if((pretraga == "" || pretraga == undefined) && this.state.izabranDatum == true ){
     
      let lista = this.state.listaSalaKlinike;
     
 
      for (var i = 0; i < lista.length; i++) {
      
            console.log(lista[i]);
        
            var naziv = lista[i].naziv;
            var broj = lista[i].broj.toString();



           
         


              var zabranjeniTermini = [false, false, false, false];
              for(var j = 0; j < listaT.length; j++){
                if(lista[i].id == listaT[j].salaID){
                

                var dT = moment(listaT[j].datumPocetka).format("DD.MM.YYYY");
                var dDP = moment(this.state.datumS).format("DD.MM.YYYY");
           
               
                  if(dT.valueOf()===dDP.valueOf()){
                   

                    var pocetakTerminaZauzetog = this.state.listaTermina[j].termin;
                  
                 
                        if(pocetakTerminaZauzetog==9){
                        
                            zabranjeniTermini[0] = true;
                          
                        } else  if(pocetakTerminaZauzetog==11){
                         
                            zabranjeniTermini[1] = true;
                         
                        }else  if(pocetakTerminaZauzetog==13){
                          
                            zabranjeniTermini[2] = true;
                         
                        } else  if(pocetakTerminaZauzetog==15){
                          
                            zabranjeniTermini[3] = true;
                         
                        }


                  }
                  
                }else{
                  continue;
                }


            }
           
                  
                    res.push(
                      <tr key={i}>
                        {/* <td>
                          <input
                            name="odabranaSala"
                            type="radio"
                            value={lista[i].id}
                            checked={this.state.izabranaSala == lista[i].id}
                            onChange={e => {
                              this.promenjenOdabirSale(e);
                            }}
                          ></input>
                        </td> */}
                        <td>{lista[i].naziv}</td>
                        <td>{lista[i].broj}</td>

                          {/* za datum */}
 
                       <td> {moment(this.state.datumS).format("DD.MM.YYYY")} <select>
                          <option value="1" disabled={zabranjeniTermini[0]}>
                            09:00-11:00
                          </option>
                          <option value="2" disabled={zabranjeniTermini[1]}> 
                            11:00-13:00
                          </option>
                          <option value="3" disabled={zabranjeniTermini[2]}>
                            13:00-15:00
                          </option>
                          <option value="4" disabled={zabranjeniTermini[3]}>
                            15:00-17:00
                          </option>
                          </select>
                          </td>
                  {/* <td> </td> */}
                  {/* <td><Button>  Rezervisi</Button>  </td>  */}
                      </tr>
                    );
         
        
            
        
      }
    } else if((pretraga != "" || pretraga != undefined) && this.state.izabranDatum == true){
    
      let lista = this.state.listaSalaKlinike;
   
 
      for (var i = 0; i < lista.length; i++) {
      
        
            var naziv = lista[i].naziv;
            var broj = lista[i].broj.toString();
  
            if(naziv.toLowerCase().includes(pretraga.toLowerCase())
            || broj.toLowerCase().includes(pretraga.toLocaleLowerCase())){
         

              var zabranjeniTermini = [false, false, false, false];
              for(var j = 0; j < listaT.length; j++){
                if(lista[i].id == listaT[j].salaID){
                 

                var dT = moment(listaT[j].datumPocetka).format("DD.MM.YYYY");
                var dDP = moment(this.state.datumS).format("DD.MM.YYYY");
           
                
                  if(dT.valueOf()===dDP.valueOf()){

                    var pocetakTerminaZauzetog = this.state.listaTermina[j].termin;
                 
                        if(pocetakTerminaZauzetog==9){
                        
                            zabranjeniTermini[0] = true;
                          
                        } else  if(pocetakTerminaZauzetog==11){
                         
                            zabranjeniTermini[1] = true;
                         
                        }else  if(pocetakTerminaZauzetog==13){
                          
                            zabranjeniTermini[2] = true;
                         
                        } else  if(pocetakTerminaZauzetog==15){
                          
                            zabranjeniTermini[3] = true;
                         
                        }


                  }
                  
                }else{
                  continue;
                }


            }
           
                    
                    res.push(
                      <tr key={i}>
                        
                        <td>{lista[i].naziv}</td>
                        <td>{lista[i].broj}</td>

                          {/* za datum */}

                          <td> {moment(this.state.datumS).format("DD.MM.YYYY")} <select>
                          <option value="1" disabled={zabranjeniTermini[0]}>
                            09:00-11:00
                          </option>
                          <option value="2" disabled={zabranjeniTermini[1]}> 
                            11:00-13:00
                          </option>
                          <option value="3" disabled={zabranjeniTermini[2]}>
                            13:00-15:00
                          </option>
                          <option value="4" disabled={zabranjeniTermini[3]}>
                            15:00-17:00
                          </option>
                          </select>
                          </td>
                      </tr>
                    );
         
        
            }
        
      }
    } else if((pretraga != "" || pretraga != undefined) && this.state.izabranDatum == false){
     
      for (var i = 0; i < lista.length; i++) {
        var naziv = lista[i].naziv;
            var broj = lista[i].broj.toString();

        if(naziv.toLowerCase().includes(pretraga.toLowerCase())
        || broj.toLowerCase().includes(pretraga.toLocaleLowerCase())){
          if(lis.some(item => lista[i].id === item.id)){
            res.push(
              <tr key={i}>
              
                    <td>{lista[i].naziv}</td>
                    <td>{lista[i].broj}</td>
               
                  <td >
                        <Button  id={lista[i].id} onClick={e => this.obrisiLekara(e)}>Obrisi</Button>
                        <Dialog ref={(el) => { this.dialog = el }} ></Dialog>     
                  </td>
                  <td>
                      <Button className="OdobrenZahtev" id={lista[i].id} onClick={e => this.handleIzmeni(e)}>
                        Izmeni
                      </Button>
                  </td>
                  
              </tr>
            );
          }else{
            res.push(
              <tr key={i}>
              
                    <td>{lista[i].naziv}</td>
                    <td>{lista[i].broj}</td>
               
                  <td >
                     
                  </td>
                  <td>
                    
                  </td>
                  
              </tr>
            );
          }
          
        }
        
      }
    } 
    return res;
  }
  // rezeriviSalluOp = e =>{
  //   console.log("SALU REEZERVISEE : " + e.target.id + " " + e.target.value);

    
  // }

  rezervisiSalu = e =>{
    console.log("SALU REEZERVISEE : " + e.target.id + " " + e.target.value);
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const url = 'http://localhost:8025/api/sale/' + e.target.id;
    axios.get(url, config)
      .then(Response => {
        console.log("SALA PREUZEO JE");
        console.log(Response.data);

        this.setState({
          brojSale: Response.data.broj,
          nazivSale: Response.data.naziv,
          idKlinike: Response.data.klinikaID,
          idSale: Response.data.id
         }, ()=> {
                         
           console.log(this.state.idLekar);
          console.log("111111111111111111111111111111111111111111111111")
          const url3 = "http://localhost:8025/api/pregledi/rezervisanjeSale";
          axios
            .post(url3, {
              salaID: this.state.idSale,
              klinikaID: this.state.idKlinike,
              datum: this.state.datumS,
              termin: this.state.selectValue,
              id: this.props.idPregleda,
              lekarID: this.props.idLekar,
              pacijentID: this.props.idPacijent
              
            }, config)
            .then(response => {
              console.log("USPJEEEEEH< REZ SALAAAA");
              console.log(this.props)
              // this.props.handleClick("USPESNA REZERVACIJA");
              this.setState({
                rezervisanaSala: true
              }, ()=> {console.log(this.state.rezervisanaSala)
                
                

              })
      
            })
            .catch(error => {
            });
          
         });
    });
    
  }
  rezervisiSaluOper() {
    if(this.state.prikaz1==false){
      this.setState({
        datumS: this.props.datumOper
      }, ()=> {
        this.dialog.hide();
      });

    }
  console.log('Rezervacija sale za operaciju ................');
  console.log("Id sale: " + this.state.idSale);
  console.log("Id oper:" + this.props.idOper);
  console.log("Termin: " + this.state.terminOper);
  console.log("Datum: " + this.state.datumS);
  console.log("Lista doktora: " + this.state.listaLekaraZaOperaciju);

  var config = {
    headers: {
      Authorization: "Bearer " + this.state.token,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };
  const url = 'http://localhost:8025/api/sale/' + this.state.idSale;
  axios.get(url, config)
    .then(Response => {
      console.log("SALA PREUZEO JE");
      console.log(Response.data);

      this.setState({
        brojSale: Response.data.broj,
        nazivSale: Response.data.naziv,
        idKlinike: Response.data.klinikaID,
        idSale: Response.data.id
       }, ()=> {
                       
        //  console.log(this.state.idLekar);
        console.log("111111111111111111111111111111111111111111111111")
        const url3 = "http://localhost:8025/api/operacije/rezervisanjeSale";
        axios
          .post(url3, {
            salaID: this.state.idSale,
            klinikaID: this.state.idKlinike,
            datum: this.state.datumS,
            termin: this.state.terminOper,
            id: this.props.idOper,
            listaLekara: this.state.listaLekaraZaOperaciju,
            // pacijentID: this.props.idPacijent
            
          }, config)
          .then(response => {
            console.log("USPJEEEEEH< REZ SALAAAA");
            console.log(this.props)
            // this.props.handleClick("USPESNA REZERVACIJA");
            this.setState({
              rezervisanaSalaOp: true
            }, ()=> {console.log(this.state.rezervisanaSalaOp)
              
              

            })
    
          })
          .catch(error => {
          });
        
       });
  });
  }

  posaljiDatum(){
   
    console.log(this.state.datumS);
  }

  prikazFiltera() {
    let res = [];
    if (this.state.odabranFilter == "pretraga") {
      res.push(
        <h5>
          <input
            placeholder="Pretrazi"
            type="text"
            aria-label="Search"
            name="pretraziPoljeKlinika"
            onChange={this.handleChange}
            value={this.state.pretraziPoljeKlinika}
          />
        </h5>
      );
    } else if (this.state.odabranFilter == "datum") {
      if(this.props.redirectToListaSala==true || this.props.redirectZahOper){
      
          res.push(
            <h5>
              <DatePicker
                placeholderText="Izaberi datum"
                selected={this.state.datumS}
                onChange={date => this.handleChangeDate(date)}
                // showTimeSelect
                minDate={new Date()}
                // timeCaption="Vreme"
                withPortal
                // excludeTimes={[
                //   setHours(setMinutes(new Date(), 0), 17)
                // ]}
                // minTime={setHours(setMinutes(new Date(), 0), 7)}
                // maxTime={setHours(setMinutes(new Date(), 0), 20)}
                dateFormat="dd.MM.yyyy"
    
                // onChange={date => setStartDate(date)}
              />
              <br></br>
              {/* <Button onClick={this.slobodniTermini}>Pronadji termine</Button> */}
            </h5>
          );
      
      }else{
        res.push(
          <h5>
            <DatePicker
              placeholderText="Izaberi datum"
              selected={this.state.datumS}
              onChange={date => this.handleChangeDate(date)}
              // showTimeSelect
              minDate={new Date()}
              // timeCaption="Vreme"
              withPortal
              // excludeTimes={[
              //   setHours(setMinutes(new Date(), 0), 17)
              // ]}
              // minTime={setHours(setMinutes(new Date(), 0), 7)}
              // maxTime={setHours(setMinutes(new Date(), 0), 20)}
              dateFormat="dd.MM.yyyy"
  
              // onChange={date => setStartDate(date)}
            />
            <br></br>
            {/* <Button onClick={this.slobodniTermini}>Pronadji termine</Button> */}
          </h5>
        );
      }
      
    } else if(this.state.odabranFilter == "dodajSalu"){
      res.push(
        <Dialog ref={(el) => { this.dialog = el }} ></Dialog>
      );
    }
      
    
    return res;
  }
  clickPretraga() {
    if(this.state.odabranFilter == "pretraga"){
      this.setState({
        odabranFilter:""
      })
    }else{
      this.setState({
        odabranFilter: "pretraga"
      });
    }
    
  }
  clickDatum() {
    if(this.state.odabranFilter == "datum"){
      this.setState({
        odabranFilter:""
      })
    }else{
    this.setState({
      odabranFilter: "datum"
    });
  }
  }
  ponistiFiltere(){
    this.setState({
      listaSalaKlinike:this.state.listaSalaKlinike,
      odabranFilter:"",
      izabranDatum: false,
      pretraziPoljeKlinika:""
    })
  }

  render() {
    // console.log(this.props);
    const pretraga = this.state.pretraziPoljeKlinika;
    const redirectFromListaSala = this.props.redirectToListaSala;
    const redirectZahOper = this.props.redirectZahOper;
    const datumPregleda = this.state.datumPregleda;
    const salaN = this.props.salaN;
    const salaBR = this.props.salaBR;
    // const datumPRegleda = this.props.datumPregleda;
    const reditectListaZah = this.state.rezervisanaSala
    // console.log("ispisi  mi redirect: " + reditectListaZah);
    if(this.state.rezervisanaSala==true){
      console.log("if");
      return (
        <BrowserRouter>
          <Switch>
            <Route
              path="/listaZahtevaPregled"
              render={props => <ListaZahtevaPregled  token={this.state.token} />}
            />
            <Redirect from="/" to="/listaZahtevaPregled" />
          </Switch>
        </BrowserRouter>
      );
    }
    if(this.state.rezervisanaSalaOp==true){
      console.log("if");
      return (
        <BrowserRouter>
          <Switch>
            <Route
              path="/listaZahtevaOper"
              render={props => <ListaZahtevaOper  token={this.state.token} />}
            />
            <Redirect from="/" to="/listaZahtevaOper" />
          </Switch>
        </BrowserRouter>
      );
    }
    if(redirectFromListaSala==true){
      var krajT = this.props.terminPregleda + 2;
      return (
        
        <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                content={
                  <div>
                    <ButtonToolbar>
                      <Button
                        fill
                        // bsStyle="info"
                        value="1"
                       onClick={e => this.clickPretraga()}
                      >
                        Pretrazi
                      </Button>
                     
                      {this.state.prikaz1 == true && (<Button
                        fill
                        // bsStyle="success"
                        value="3"

                        onClick={e => this.clickDatum()}
                      >
                        Izaberi datum
                      </Button>)}
                     
                      {/* <Button fill value="4"  onClick={e => this.dodajSalu(e)}>
                        
                        Dodaj salu
                      
                      </Button> */}
                      <Button
                        fill
                        value="5"
                        onClick={e => this.ponistiFiltere()}><i className="pe-7s-close"/> Prikazi sve sale </Button>
                    </ButtonToolbar>
                <p> Zahtevani pregled sale za datum: {moment(this.props.datumPregleda).format("DD.MM.YYYY.")} i termin {this.props.terminPregleda} : 00 - {krajT} : 00</p> 
                    <br></br>
                    <div>{this.prikazFiltera()}</div>
                   
                  </div>
                }
              />
    
             </Col>
            </Row>
 
            <Row>
              <Col md={12}>
                <Row>
                  <Card
                    // title="Lista sala klinike"
                   
                    // ctTableFullWidth
                    // ctTableResponsive
                    content={
                      <div>
  
                      <form>
                        
                    </form>
                    
                    <div>
                    
                    </div>
                      <ButtonToolbar>
                      
                      </ButtonToolbar>
                       <Dialog ref={(el) => { this.dialog = el }} ></Dialog>
                      
                     
                      <Table striped hover>
                        <thead>
                          <tr>
                          {/* <th></th> */}
                            <th id="IdPacijenta">Naziv</th>
                            <th id="ImePacijenta"> Broj</th>
                          
                            <th>Prvi slobodan termin</th>
                    
                          </tr>
                          
                        </thead>
                       
                        <tbody>{this.listaSalaK()}</tbody>
                      </Table>
                       
                      </div>
                    }
                  />
                </Row>
              </Col>
            </Row>
  
      
          </Grid>
        </div>
      );
      
    }

    if(redirectZahOper==true){
      var krajT = this.props.terminOper + 2;
      return (
        
        <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                content={
                  <div>
                    <ButtonToolbar>
                      <Button
                        fill
                        // bsStyle="info"
                        value="1"
                       onClick={e => this.clickPretraga()}
                      >
                        Pretrazi
                      </Button>
                     
                      {this.state.prikaz1 == true && (<Button
                        fill
                        // bsStyle="success"
                        value="3"

                        onClick={e => this.clickDatum()}
                      >
                        Izaberi datum
                      </Button>)}
                     
                      {/* <Button fill value="4"  onClick={e => this.dodajSalu(e)}>
                        
                        Dodaj salu
                      
                      </Button> */}
                      <Button
                        fill
                        value="5"
                        onClick={e => this.ponistiFiltere()}><i className="pe-7s-close"/> Prikazi sve sale </Button>
                    </ButtonToolbar>
                <p> Zahtevani pregled sale za datum: {moment(this.props.datumOper).format("DD.MM.YYYY.")} i termin {this.props.terminOper} : 00 - {krajT} : 00</p> 
                    <br></br>
                    <div>{this.prikazFiltera()}</div>
                   
                  </div>
                }
              />
    
             </Col>
            </Row>
 
            <Row>
              <Col md={12}>
                <Row>
                  <Card
                    // title="Lista sala klinike"
                   
                    // ctTableFullWidth
                    // ctTableResponsive
                    content={
                      <div>
  
                      <form>
                        
                    </form>
                    
                    <div>
                    
                    </div>
                      <ButtonToolbar>
                      
                      </ButtonToolbar>
                       <Dialog ref={(el) => { this.dialog = el }} ></Dialog>
                      
                     
                      <Table striped hover>
                        <thead>
                          <tr>
                          {/* <th></th> */}
                            <th id="IdPacijenta">Naziv</th>
                            <th id="ImePacijenta"> Broj</th>
                          
                            <th>Prvi slobodan termin</th>
                            <th> Lekar</th>
                          </tr>
                          
                        </thead>
                       
                        <tbody>{this.listaSalaK()}</tbody>
                      </Table>
                       
                      </div>
                    }
                  />
                </Row>
              </Col>
            </Row>
  
      
          </Grid>
        </div>
      );
      
    }
   
    if (this.state.izabranDatum==true) {
      return (
        <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                content={
                  <div>
                    <ButtonToolbar>
                      <Button
                        fill
                        // bsStyle="info"
                        value="1"
                       onClick={e => this.clickPretraga()}
                      >
                        Pretrazi
                      </Button>
                     
                      <Button
                        fill
                        // bsStyle="success"
                        value="3"
                        onClick={e => this.clickDatum()}
                      >
                        Izaberi datum
                      </Button>
                      <Button fill value="4"  onClick={e => this.dodajSalu(e)}>
                        
                        Dodaj salu
                      
                      </Button>
                      <Button
                        fill
                        value="5"
                        onClick={e => this.ponistiFiltere()}><i className="pe-7s-close"/></Button>
                    </ButtonToolbar>
                    <br></br>
                    <div>{this.prikazFiltera()}</div>
                   
                  </div>
                }
              />
    
             </Col>
            </Row>
 
            <Row>
              <Col md={12}>
                <Row>
                  <Card
                    // title="Lista sala klinike"
                   
                    // ctTableFullWidth
                    // ctTableResponsive
                    content={
                      <div>
  
                      <form>
                          {/* <input
                            placeholder="Pretrazi"
                            type="text"
                            aria-label="Search"
                            name="pretraziPoljeKlinika"
                            onChange={this.handleChange}
                          /> */}
                        {/* <Button onClick={e => this.pretraziSale()}>
                          Pretrazi
                        </Button> */}
                    </form>
                    
                    <div>
             
                    </div>
                      
                       <Dialog ref={(el) => { this.dialog = el }} ></Dialog>
                      
                     
                      <Table striped hover>
                        <thead>
                          <tr>
                          {/* <th></th> */}
                            <th id="IdPacijenta">Naziv</th>
                            <th id="ImePacijenta"> Broj</th>
                            {/* <th>Termini</th> */}
                            <th>Prvi slobodan termin</th>
                    
                          </tr>
                        </thead>
                        <tbody>{this.listaSalaK()}</tbody>
                      </Table>
                      </div>
                    }
                  />
                </Row>
              </Col>
            </Row>
  
            <Row>
              <Col>
                  <Row>
                  { this.state.hiddenKalendar ?
                  <Card
                    title="Kalendar zauzeca sale"
                   
                    ctTableFullWidth
                    ctTableResponsive
                    content={
                      <div style={{ height: 400 }}  className="ct-chart">
                        
                      <Calendar
                          // style={{ maxHeight: "100%" }}
                          // localizer={localizer}
                          // showMultiDayTimes={true}
                          // // views={["month"]}  
                          // defaultDate={new Date()}
                         // events={this.state.odmor}
                          // eventPropGetter={event => ({
                          //   style:{
                          //     backgroundColor: "#ebd234"
                          //   }
                          // })}
  
                          localizer={localizer}
                          events={events }
                        //  views={["month"]}
                          defaultDate={new Date()}

                        />
                    </div>
  
                    
                    }
                  />
                  : null
                  }
                  </Row>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    }else{
      return (
        <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                content={
                  <div>
                    <ButtonToolbar>
                      <Button
                        fill
                        // bsStyle="info"
                        value="1"
                       onClick={e => this.clickPretraga()}
                      >
                        Pretrazi
                      </Button>
                     
                      <Button
                        fill
                        // bsStyle="success"
                        value="3"
                        onClick={e => this.clickDatum()}
                      >
                        Izaberi datum
                      </Button>
                      <Button fill value="4"   onClick={e => this.dodajSalu(e)}>
                        
                        Dodaj salu
                      
                      </Button>
                      {/* <Button fill value="4"   onClick={e => this.prikaz(e)}>
                        
                        Sale za pregled
                      
                      </Button>
                      <Button fill value="4"   onClick={e => this.prikazSaleZaOperaciju(e)}>
                        
                        Sale za operaciju
                      
                      </Button> */}
                      <Button
                        fill
                        value="5"
                        onClick={e => this.ponistiFiltere()}><i className="pe-7s-close"/></Button>
                    </ButtonToolbar>
                    <br></br>
                    <div>{this.prikazFiltera()}</div>
                   
                  </div>
                }
              />
    
             </Col>
            </Row>
           
            <Row>
              <Col md={12}>
                <Row>
                  <Card
                    // title="Lista sala klinike"
                   
                    // ctTableFullWidth
                    // ctTableResponsive
                    content={
                      <div>
                        {/* stari naziv */}
                      <form>
                          {/* <input
                            placeholder="Pretrazi"
                            type="text"
                            aria-label="Search"
                            name="pretraziPoljeKlinika"
                            onChange={this.handleChange}
                          /> */}
                        {/* <Button onClick={e => this.pretraziSale()}>
                          Pretrazi
                        </Button> */}
                    </form>
                    
  
                      
                      <Dialog ref={(el) => { this.dialog = el }} ></Dialog>
                      
                     
                      <Table striped hover>
                        <thead>
                          <tr>
                          {/* <th></th> */}
                            <th id="IdPacijenta">Naziv</th>
                            <th id="ImePacijenta"> Broj</th>
                         
                          </tr>
                        </thead>
                        <tbody>{this.listaSalaK()}</tbody>
                      </Table>
                      </div>
                    }
                  />
                </Row>
              </Col>
            </Row>
  
            <Row>
              <Col>
                  <Row>
                  { this.state.hiddenKalendar ?
                  <Card
                    title="Kalendar zauzeca sale"
                   
                    ctTableFullWidth
                    ctTableResponsive
                    content={
                      <div style={{ height: 400 }}  className="ct-chart">
                        
                      <Calendar
                          // style={{ maxHeight: "100%" }}
                          // localizer={localizer}
                          // showMultiDayTimes={true}
                          // // views={["month"]}  
                        // // views={["month"]}  
                          // // views={["month"]}  
                          // defaultDate={new Date()}
                         // events={this.state.odmor}
                          // eventPropGetter={event => ({
                          //   style:{
                          //     backgroundColor: "#ebd234"
                          //   }
                          // })}
  
                          localizer={localizer}
                          events={events }
                        //  views={["month"]}
                          defaultDate={new Date()}
               
                        />
                    </div>
  
                    
                    }
                  />
                  : null
                  }
                  </Row>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    }
    
  }
}

export default ListaSala;
