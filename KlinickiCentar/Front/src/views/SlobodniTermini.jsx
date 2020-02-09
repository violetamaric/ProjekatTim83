import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import "klinickiCentar.css";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from "axios";
import Dialog from "react-bootstrap-dialog";
import "klinickiCentar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

class SlobodniTermini extends Component {
  constructor(props) {
    super(props);
    console.log("LISTA PREGLEDA");
    console.log(this.props);
    this.state = {
      uloga: props.uloga,
      email: props.email,
      token: props.token,
      idAdmina: "",
      idKlinike: "",
      listaLekara: [],
      listaKlinika: [],
      emailLekara: "",
      imeLekara: "",
      prezimeLekara: "",
      lozinkaLekara: "",
      telefonLekara: "",
      klinikaLekara: 0,
      reirectToIzmeniLekar: false,
      pregledPacijentID: "",
      pregledLekarID: "",
      pregledTipPregledaID: "",
      pregledCijena: "",
      nazivTipPregled: "",
      nazivOznaceneSale: "",
      brojOznaceneSale: "",
      tipoviPregleda: [],
      cijenaTipaPregleda: "",
      lekari: [],
      sale: [],
      oznaceniTipPregleda: 1,
      oznaceniLekar: 0,
      oznacenaSala: 0,
      nazivOznacenogPregleda: "",
      nazivOznacenogLekara: "",
      datumZaPregled: new Date(),
      izabranLekar: 0,
      izabranaKlinika: 1,
      cena: 0,
      popust: 0,
      selectValue: 9, 
      dodavanjeST: false,
      izabraniLekar: null,
      idLekar: ""

    };
    this.listaSalaK = this.listaSalaK.bind(this);
    this.izaberiVrstuPregleda = this.izaberiVrstuPregleda.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.dodajNoviST = this.dodajNoviST.bind(this);
    this.handleDodajST = this.handleDodajST.bind(this);
    this.dodeliLekara = this.dodeliLekara.bind(this);
  }



   handleDropdownChange = e =>{
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    this.setState({
       selectValue: e.target.value 
     // });
    }, ()=>{
      console.log("SALE ******")
        const urlPRegled = 'http://localhost:8025/api/ST/preuzmiSaleKlinikeZaPregled/' + this.state.idKlinike ;    
        console.log(urlPRegled);
    
        axios.get(urlPRegled, config)
          .then(pregled => {
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA ")
            console.log(pregled.data);
            this.setState({
              sale: pregled.data,
            })
           
          })
     });
   
  
 
  }

  getKlinikaValue() {
    console.log("get klinika value");
    return this.state.idKlinike;
  }
  handleChange = e => {
    e.preventDefault();

    this.setState({ [e.target.name]: e.target.value });
    // console.log(this.state);
    console.log("On change !!!");
    console.log({ [e.target.name]: e.target.value });
  };

  proslediKliniku(klinika) {
    console.log("prosledjena klinika");

    console.log("I==================D" + klinika.target.value);
    console.log("-------------------------" + this.state.idKlinike);
    this.setState(
      {
        klinikaLekara: klinika.target.value
      },
      () => console.log(this.state)
    );
  }
  // listaLekara() {
   
  //   const urlKlinike =
  //     "http://localhost:8025/api/klinike/listaLekaraKlinika/" +
  //     this.state.idKlinike;
  //   axios.get(urlKlinike).then(klinika => {
     

  //     this.setState({
  //       idKlinika: klinika.data.id,
  //       // listaLekara: klinika.data
  //     });
  //   });
  // }

  obrisiLekara = e => {
    e.preventDefault();
   
    const url6 = "http://localhost:8025/api/klinike/brisanjeLekara";
    axios
      .post(url6, {
        email: e.target.id
      })
      .then(response => {
    
        //his.listaLekara();
      })
      .catch(error => {
        console.log("Brisanje leka nije uspelo! ");
      });
  };
  ucitajUnapredDefTermine() {
    
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };

    const urlslobodni =
      "http://localhost:8025/api/ST/preuzmiSTKlinike/" + this.state.idKlinike;
    axios.get(urlslobodni, config).then(klinika => {
      
      this.setState(
        {
         
          listaLekara: klinika.data

          
        },
        () => {
          console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
          console.log(this.state.listaLekara);
          // for(var j=0; j<this.state.listaLekara.length;j++){
          //   axios.get( "http://localhost:8025/api/tipPregleda/finByIdTP/" + this.state.listaLekara[j].tipPregledaID, config )
          //         .then(respon => {
          //           console.log(respon.data);
          //           this.setState({
          //             cena: respon.data.cena
          //           })
          //         })
          // }
          this.listaSalaK();
        }
      );
    });
  }
  componentWillMount() {
  
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const url = "http://localhost:8025/api/adminKlinike/getAdminKlinikeByEmail";
    axios
      .get(url, config)
      .then(Response => {
       

        this.setState({
          email: Response.data.email,
          //   ime: Response.data.ime,
          //   prezime: Response.data.prezime,
          //   telefon: Response.data.telefon,
          idKlinike: Response.data.idKlinike
        });
        
        // const urlKlinike =
        //   "http://localhost:8025/api/klinike/listaLekaraKlinika/" +
        //   this.state.idKlinike;
        // axios.get(urlKlinike, config).then(klinika => {
         

          const urlslobodni =
          "http://localhost:8025/api/ST/preuzmiSTKlinike/" + this.state.idKlinike;
        axios.get(urlslobodni, config).then(klinika => {
          
          this.setState(
            {
             
              listaLekara: klinika.data
    
              
            },
            () => {
              console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
              console.log(this.state.listaLekara);
              // for(var j=0; j<this.state.listaLekara.length;j++){
              //   axios.get( "http://localhost:8025/api/tipPregleda/finByIdTP/" + this.state.listaLekara[j].tipPregledaID, config )
              //         .then(respon => {
              //           console.log(respon.data);
              //           this.setState({
              //             cena: respon.data.cena
              //           })
              //         })
              // }
              this.listaSalaK();
            }
          );
       
     
          const urlKlinike =
            "http://localhost:8025/api/tipPregleda/tipPregledaKlinike/" +
            this.state.idKlinike;
          axios.get(urlKlinike, config).then(resp => {
            console.log("Preuzeta lista klinika");
            console.log(resp.data);

            this.setState({
              // idKlinike: klinika.data.id,
              tipoviPregleda: resp.data,
              nazivOznacenogPregleda: resp.data[0].naziv
              // pregledLekarID: klinika.data.lekarID,
              // pregledPacijentID: klinika.data.pacijentID,
              // pregledTipPregledaID: klinika.data[0].tipPregledaID,
              // pregledCijena: klinika.data.cena,
            });
          });
        
        });
      })

      .catch(error => {
        console.log("Administrator klinike  nije preuzet");
      });
    
  }

  onDropdownSelected(e) {
    console.log("THE VAL", e.target.value);
    //here you will see the current selected value of the select input
  }
  dodajNoviST(){

    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
 
    axios

      .post(
        "http://localhost:8025/api/ST/dodajNoviST",
        {
          lekarID: this.state.oznaceniLekar,
          klinikaID: this.state.idKlinike,
          tipPregledaID: this.state.oznaceniTipPregleda,
         // cena: this.state.cena,
          popust: this.state.popust,
          datum: this.state.datumZaPregled,
          salaID: this.state.oznacenaSala,
          termin: this.state.selectValue
        },
        config
      )
      .then(response => {
        console.log("Dodat novi termin");
        console.log(response);
        this.setState({
          dodavanjeST: false
        })
        this.ucitajUnapredDefTermine() 
        
      })
      .catch(error => {
        console.log("greska ST");
        console.log(error.response);
      });


   
  };
  handleIzmeni = e => {
    e.preventDefault();
    console.log(e.target.id);
    console.log("handle IZMENIIII LEKARA");
    this.setState({
      reirectToIzmeniLekar: true,
      emailLekara: e.target.id
    });
    // const url2 = "http://localhost:8025/api/lekari/update/" + e.target.id;
    // axios
    // .post(url2, {})
    // .then(response => {
    //   console.log("ODOBRENOOOO");
    //   console.log(response);
    //   this.ucitajPonovo();
    // })
    // .catch(error => {
    //     console.log(error.response);
    // });
  };
  handleChangeDate = date => {
    console.log("-*-*-*-*-*-*-*-*-*" + date);
    this.setState(
      {
        datumZaPregled: date
      },
      () => {
        console.log(this.state);
        console.log("Datummmmmm  izabran: " + this.state.datumZaPregled)
        // ucitajSlobodneLeka
      }
    );
  };
  biranjeTipaPregleda(tip) {

    this.setState({
      oznaceniTipPregleda: tip.target.value
    });
    let lista = this.state.tipoviPregleda;

    for (var i = 0; i < lista.length; i++) {
      var naziv = lista[i].naziv;
      var id = lista[i].id;
      if (id == tip.target.value) {
        this.setState({
          nazivOznacenogPregleda: naziv,
          cena: lista[i].cena
        });
      }
    }
  }

//   biranjeLekara(lekar) {
    
//     const idL = lekar.target.value;
//     this.setState({
//       oznaceniLekar: idL
//     });
    
//  //   let lista = this.state.lekari;

//     for (var i = 0; i < lista.length; i++) {
//       var naziv = lista[i].ime;
//       var id = lista[i].id;
//       if (id == lekar.target.value) {
//         this.setState({
//           nazivOznacenogLekara: naziv
//         });
//       }
//     }
//   }
  biranjeSala(sala) {
   
    const idL = sala.target.value;
    console.log(" .... Target value: " + sala.target.value)
    this.setState({
      oznacenaSala: idL
    });
 
    let lista = this.state.sale;

    for (var i = 0; i < lista.length; i++) {
      var naziv = lista[i].naziv;
      var id = lista[i].id;
      var broj = lista[i].broj;
      if (id == sala.target.value) {
        this.setState({
          oznacenaSala: id,
          nazivOznaceneSale: naziv,
          brojOznaceneSale: broj
        }, () => console.log(this.state.oznacenaSala));
      }
    }
  }
  izaberiVrstuPregleda() {
    let res = [];
    let lista = this.state.tipoviPregleda;
    for (var i = 0; i < lista.length; i++) {
      res.push(<option value={lista[i].id}>{lista[i].naziv}</option>);
    }
    return res;
  }

  izaberiLekara() {
    let res = [];
    let lista = this.state.lekari;
    for (var i = 0; i < lista.length; i++) {
      res.push(
        <option value={lista[i].id}>
          {lista[i].ime} {lista[i].prezime}{" "}
        </option>
      );
    }
    return res;
  }
  izaberiSalu() {
    let res = [];
    let lista = this.state.sale;
    for (var i = 0; i < lista.length; i++) {
      res.push(
        <option value={lista[i].id}>
          {lista[i].naziv} {lista[i].broj}{" "}
        </option>
      );
    }
    return res;
  }
  listaSalaK() {
    let res = [];
    let lista = this.state.listaLekara;

    for (var i = 0; i < lista.length; i++) {
      const dat = lista[i].datum;
      res.push(
        <tr key={i}>
          <td>
            {moment(dat).format("DD.MM.YYYY.")}  {lista[i].termin} : 00 - {lista[i].termin + 2} : 00 h
          </td>
          <td>{lista[i].tipPregledaN}</td>
          <td>
            {lista[i].lekarIme} {lista[i].lekarPrezime}
          </td>

          <td>{lista[i].cenaTP} RSD</td>
          <td>{lista[i].popust} %</td>

      
        </tr>
      );
    }
    return res;
  }
  handleDodajST(){
    this.setState({ dodavanjeST: true})
  }

  biranjeLekara(lekar){

    const idL = lekar.target.value;

    this.setState({
      izabraniLekar: lekar.target.value
    });

    console.log("Value id:" + lekar.target.value);
    
    let lista = this.state.lekari;

    for (var i = 0; i < lista.length; i++) {
      var naziv = lista[i].naziv;
      var id = lista[i].id;
      var sifra = lista[i].prezime;

      if (id == lekar.target.value) {
        this.setState({

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

            .post(
              "http://localhost:8025/api/ST/dodajNoviST",
              {
                lekarID: this.state.idLekar,
                klinikaID: this.state.idKlinike,
                tipPregledaID: this.state.oznaceniTipPregleda,
               // cena: this.state.cena,
                popust: this.state.popust,
                datum: this.state.datumZaPregled,
                salaID: this.state.oznacenaSala,
                termin: this.state.selectValue
              },
              config
            )
            .then(response => {
              console.log("Dodat novi termin");
              console.log(response);
              this.setState({
                dodavanjeST: false
              })
              this.ucitajUnapredDefTermine() 
              
            })
            .catch(error => {
              console.log("greska ST");
              console.log(error.response);
            });
      
      
            
           });
    
        
      }
      
    }
    
  }

  ispisiSlobodneLekare() {
   
      let res = [];
      let lista = this.state.lekari;
  
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
           datum: this.state.datumZaPregled, //treba datum onaj koji je poslat iz tabele //TODO
           termin: this.state.selectValue,
          
         //  lekarID: this.props.idLekar,
         }, config)
         .then(response => {
           
           console.log("||||||||||||||||||| lista dostupnih lekaraaaaa" );
           console.log(response.data);
           this.setState({
             lekari: response.data,
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

  render() {
   
    return (
      <div className="content">
        <Grid fluid>
              { this.state.dodavanjeST ?
               
               <Row>
               
                 <form className="formaZaDodavanjeNovogTermina">
                      <div className="telefonLekara">
                        <label className="lekarTelefonLabel" htmlFor="datumPregleda">
                          Datum:{" "}
                        </label>
                        <DatePicker
                          className="lekarTelefonLabel"
                          name="datumPregleda"
                          defaultValue=""
                          minDate={new Date()}
                          placeholderText="Izaberi datum"
                          selected={this.state.datumZaPregled}
                          onSelect={this.handleChangeDate}
                        />
                      </div>
                      <div className="telefonLekara">
                        <label className="lekarTelefonLabel" htmlFor="telefonLekara">
                          Termin:{" "}
                        </label>
                        <select id="selectTermin"  onChange={e => this.handleDropdownChange(e)}>
                                    <option value={9} >
                                      09:00-11:00
                                    </option>
                                    <option value={11} > 
                                      11:00-13:00
                                    </option>
                                    <option value={13} >
                                      13:00-15:00
                                    </option>
                                    <option value={15}>
                                      15:00-17:00
                                    </option>
                            </select>
                      </div>
                      <div className="telefonLekara">
                        <label className="lekarTelefonLabel" htmlFor="prezimeLekara">
                          Tip Pregleda:{" "}
                        </label>
                        <select
                          className="lekarTelefonLabel"
                          name="tipPregleda"
                          onChange={e => this.biranjeTipaPregleda(e)}
                        >
                          {this.izaberiVrstuPregleda()}
                        </select>
                      </div>
                      {/* <div className="telefonLekara">
                        <label className="lekarTelefonLabel" htmlFor="biranjeLekara">
                          Lekar:{" "}
                        </label>
                        <select
                          className="lekarTelefonLabel"
                          name="lekadID"
                          onChange={e => this.biranjeLekara(e)}
                        >
                          {this.izaberiLekara()}
                        </select>
                      </div> */}
                      <div className="telefonLekara">
                        <label className="lekarTelefonLabel" htmlFor="telefonLekara">
                          Sala:{" "}
                        </label>
                        <select
                          className="lekarTelefonLabel"
                          name="salaID"
                          onChange={e => this.biranjeSala(e)}
                        >
                          {this.izaberiSalu()}
                        </select>
                      </div>
                      <div className="telefonLekara">
                        <label className="lekarTelefonLabel" htmlFor="telefonLekara">
                          Popust(%):{" "}
                        </label>
                        <input
                          className="lekarTelefonLabel"
                          type="number"
                          name="popust"
                          defaultValue=""
                          onChange={this.handleChange}
                        />
                      </div>
                      {/* <div>
                        <Button onClick={()=> this.dodajNoviST()}>Dodaj </Button>
                      </div> */}

                      <div>
                        <Button id={this.state.oznacenaSala}  value= {this.state.selectValue}  onClick={e => this.dodeliLekara(e)}>Dodaj lekara </Button>
                      </div>
                    </form>
            
               
                   
                </Row>
          
                : null
              }
              <Row>
                {

                }
                <Card
                  title="Lista slobodnih termina"
               
                  ctTableFullWidth
                  ctTableResponsive
                  content={
                    <div>
                      <Button
                        className="DodajKlinikuDugme"
                        onClick={()=> this.handleDodajST()}
                        // onClick={e => this.dodajNoviST(e)}
                      >
                        Dodaj novi termin za pregled
                      </Button>
                      <Dialog
                        ref={el => {
                          this.dialog = el;
                        }}
                      ></Dialog>

                      <Table striped hover>
                        <thead>
                          <tr>
                            <th id="IdPacijenta">Datum i vreme</th>
                            <th id="ImePacijenta">Tip pregleda</th>

                            <th id="lekar">Lekar</th>

                            <th id="cena">Cena</th>
                            <th id="popust">Popust</th>
                          </tr>
                        </thead>
                        <tbody>{this.listaSalaK()}</tbody>
                      </Table>
                    </div>
                  }
                />
              </Row>
         
        </Grid>
      </div>
    );
  }
}

export default SlobodniTermini;
