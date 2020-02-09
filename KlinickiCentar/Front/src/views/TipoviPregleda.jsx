import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import "klinickiCentar.css";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from "axios";
import Dialog from 'react-bootstrap-dialog';
import IzmenaLekara from 'views/IzmenaProfila.jsx';
import "klinickiCentar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

class TipoviPregleda extends Component {
  constructor(props) {
    super(props);
    console.log("LISTA TIPOVA PREGLEDA");
    console.log(this.props);
    this.state = {
      uloga: props.uloga,
      email: props.email,
      token: props.token,
      idAdmina: "",
      idKlinike: "",
      listaTP: [],
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
       tipoviPregleda: [],
       lekari: [],
      oznaceniTipPregleda: 1,
      oznaceniLekar: 0,
      nazivOznacenogPregleda: "",
      nazivOznacenogLekara: "",
      datumZaPregled: new Date(),
      izabranLekar: 0,
      izabranaKlinika: 1,
      cena: 0,
      popust: 0,
      naziTP: "",
      idTP: "",
      idKlinike: "",
      listaTPIzmjenaBr : []
    
    };
     this.listaTP = this.listaTP.bind(this);
     this.izaberiVrstuPregleda = this.izaberiVrstuPregleda.bind(this);
    //  this.handleChangeDate = this.handleChangeDate.bind(this);
    // this.dodajLekara = this.dodajLekara.bind(this);
    // this.obrisiLekara = this.obrisiLekara.bind(this);
    // this.proslediKliniku = this.proslediKliniku.bind(this);

    // this.getKlinikaValue = this.getKlinikaValue.bind(this);

  }

  getKlinikaValue(){
    console.log('get klinika value');
    return this.state.idKlinike;
  }
  handleChange = e => {
    e.preventDefault();
    
    this.setState({ [e.target.name]: e.target.value });
    // console.log(this.state);
    console.log("On change !!!");
    
  };

  proslediKliniku(klinika) {
    
    console.log("prosledjena klinika");

    console.log("I==================D" + klinika.target.value);
    console.log("-------------------------" + this.state.idKlinike);
    this.setState({
      klinikaLekara : klinika.target.value
      
    },() => console.log(this.state));
   


  };
  listaTP() {
    console.log("Ponovo ispisi listu");
    // console.log("!!!!!!!!!!!!!!!11111 ID KL " + this.state.idKlinike);
    
        // console.log("ID KLINIKE OD KOJE TRAZIM LEKARE: " + this.state.idKlinike);
        console.log("ucitaj mi kliniku");
        const urlKlinike = 'http://localhost:8025/api/tipPregleda/all' ;    
        axios.get(urlKlinike)
          .then(klinika => {
            console.log("Preuzetit  tp");
            console.log(klinika.data);
   
            this.setState({
        
                listaTP: klinika.data,
             
            });
       
          })
      

  }

obrisiTP = e => {
  e.preventDefault();
  console.log("CLick brisanje TP");
  console.log("TP: " + e.target.id);
  var config = {
    headers: {
      Authorization: "Bearer " + this.state.token,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };
         var a = e.target.id;
        const url6 = "http://localhost:8025/api/tipPregleda/brisanjeTP/" + a + "/" + this.state.idKlinike;
        
        console.log(url6);
            axios
                .get(url6, config)
                .then(response => {
                console.log("Brisanje tp uspelo! ");
                console.log(response.data);
                  this.listaTPPonovo();
               
    
                })
                .catch(error => {
                console.log("Brisanje tp nije uspelo! ");
                });
  

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
        }, ()=>{

          var idk = this.state.idKlinike;
          console.log("ID K: " + idk);
          const url = 'http://localhost:8025/api/tipPregleda/allKlinike/' + idk;
          console.log(url);
          axios.get(url ,config)
            .then(Response => {
                  console.log("Preuzeti tipovi pregleda");
                  console.log(Response.data);
      
                  this.setState({
                      listaTP: Response.data
                  });
              }) 
              .catch(error => {
                      console.log("Nisu preuzeti tipovi pregleda")
              })


              const url22 = 'http://localhost:8025/api/tipPregleda/allTerminiIB/'  + idk;
              console.log(url);
              axios.get(url22 ,config)
                .then(Response => {
                      console.log("Preuzeti tipovi pregledaza brisanje i izmjenu u");
                      console.log(Response.data);
          
                      this.setState({
                          listaTPIzmjenaBr: Response.data
                      });
                  }) 
                  .catch(error => {
                          console.log("Nisu preuzeti tipovi pregleda za brisanje i izmjenu ")
                  })

        });
      }) 
  
     

  }
 
  onDropdownSelected(e) {
    console.log("THE VAL", e.target.value);
    //here you will see the current selected value of the select input
}
  dodajNoviST = e => {
    e.preventDefault();

    console.log("--------------------------------");
    this.dialog.show({
      title: 'Dodavanje novog tipa pregleda',
      body: [
      <form className="formaZaDodavanjeNovogTermina">
         
     
   
          <div className="telefonLekara" >
            <label className="lekarTelefonLabel" htmlFor="telefonLekara">Naziv tipa pregleda: </label>
            <input className="lekarTelefonLabel"
              type="text"
              name="naziTP"
              defaultValue=""
              onChange={this.handleChange}
              
            />
          </div>
          <div className="telefonLekara">
            <label className="lekarTelefonLabel" htmlFor="telefonLekara">
              Cena(RSD):{" "}
            </label>
            <input
              className="lekarTelefonLabel"
              type="number"
              name="cena"
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
        //   console.log(this.state.oznaceniLekar);
        //   console.log(this.state.idKlinike);
        //   console.log(this.state.oznaceniTipPregleda);
        //   console.log(this.state.datumZaPregled);
        var config = {
            headers: {
              Authorization: "Bearer " + this.state.token,
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          };
          axios
          .post("http://localhost:8025/api/tipPregleda/dodajNoviTP", {
                naziv: this.state.naziTP,
                cena: this.state.cena, 
          }, config)
          .then(response => {
            console.log("Dodat novi tp");
            console.log(response);
            this.listaTPPonovo();
         
          })
          .catch(error => {
            console.log("greska TP");
            console.log(error.response);
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
handleIzmeni = e => {
    e.preventDefault();
    console.log(e.target.id);
    console.log("handle IZMENIIII LEKARA")
    this.setState({
      reirectToIzmeniLekar: true,
      emailLekara: e.target.id,
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

  biranjeTipaPregleda(tip) {
    console.log("BIRANJE TP P")
    console.log("prosledjen pregled");
    console.log(tip.target.value);
    this.setState({
      oznaceniTipPregleda: tip.target.value
    });
    let lista = this.state.tipoviPregleda;

    for (var i = 0; i < lista.length; i++) {
      var naziv = lista[i].naziv;
      var id = lista[i].id;
      if (id == tip.target.value) {
        this.setState({
          nazivOznacenogPregleda: naziv
        });
      }
    }
  }

  biranjeLekara(lekar){
    console.log("BIRANJE TP P")
    console.log("prosledjen lekar");
    console.log("Stari id: "  + this.state.oznaceniLekar);
    const idL = lekar.target.value;
    this.setState({
      oznaceniLekar: idL,
    });
    console.log("Value id:" + lekar.target.value);
    console.log("Novi id: +  " + this.state.oznaceniLekar);
    let lista = this.state.lekari;

    for (var i = 0; i < lista.length; i++) {
      var naziv = lista[i].ime;
      var id = lista[i].id;
      if (id == lekar.target.value) {
        this.setState({
          nazivOznacenogLekara: naziv
        });
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
      res.push(<option value={lista[i].id}>{lista[i].ime} {lista[i].prezime} </option>);
    }
    return res;
  }
  listaTP() {
    let res = [];
    let lista = this.state.listaTP;
    let lis = this.state.listaTPIzmjenaBr;
    console.log("Ispisi tp: ");
    
    for (var i = 0; i < lista.length; i++) {
      if(lis.some(item => lista[i].id === item.id)){
      res.push(

        <tr key={i}>
            <td>{lista[i].naziv}</td>
              <td>{lista[i].cena}</td>
            <td >
                <Button  id={lista[i].id} onClick={e => this.obrisiTP(e)}>Obrisi</Button>
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
                <td>{lista[i].cena}</td>
              <td >
                
              </td>
              <td>
               
              </td>
   
          </tr>
        );
      }
    }
    return res;
  }

  listaTPPonovo(){
    console.log("Ponovo ispisi listu");
    console.log("++++++++++++++++++++++++++++++++++++")

        var config = {
          headers: {
            Authorization: "Bearer " + this.state.token,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        };
        const url = 'http://localhost:8025/api/tipPregleda/all';
        
        axios.get(url, config)
          .then(rr => {
            console.log("Preuzeta klinika");
            console.log(rr.data);
   
            this.setState({
                // idKlinika: klinika.data.id,
                listaTP: rr.data,
             
            });
       
          })
      
  }

  render() {

    return (
      <div className="content">
        <Grid fluid>
         
              <Row>
                <Card
                  title="Lista tipova  pregleda"
                  // category="Here is a subtitle for this table"
                  ctTableFullWidth
                  ctTableResponsive
                  content={
                    <div>
                    <Button className="DodajKlinikuDugme"  onClick={e => this.dodajNoviST(e)}>Dodaj novi termin za pregled</Button>
                    <Dialog ref={(el) => { this.dialog = el }} ></Dialog>
                    
                   
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th id="nazivTP">Naziv tipa pregleda</th>
                          <th id="cena"> Cena</th>

                        </tr>
                      </thead>
                      <tbody>{this.listaTP()}</tbody>
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

export default TipoviPregleda;
