import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import "klinickiCentar.css";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from "axios";
import Dialog from "react-bootstrap-dialog";
import IzmenaLekara from "views/IzmenaProfila.jsx";
import "klinickiCentar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
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
      selectValue: 9
    };
    this.listaSalaK = this.listaSalaK.bind(this);
    this.izaberiVrstuPregleda = this.izaberiVrstuPregleda.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);

  }



   handleDropdownChange = e =>{
    this.setState({ selectValue: e.target.value });
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

  // listaKlinikaIzbor(){
  //   let res = [k];

  //   let lista = this.state.listaKlinika;

  //   for (var i = 0; i < lista.length; i++) {
  //     res.push(
  //       <option value={lista[i].id} >{lista[i].naziv}</option>
  //        //<MenuItem eventKey={lista[i].id}>{lista[i].naziv}</MenuItem>
  //     );
  //   }
  //   return res;
  // }
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
  listaLekara() {
   
    const urlKlinike =
      "http://localhost:8025/api/klinike/listaLekaraKlinika/" +
      this.state.idKlinike;
    axios.get(urlKlinike).then(klinika => {
     

      this.setState({
        idKlinika: klinika.data.id,
        // listaLekara: klinika.data
      });
    });
  }

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
        
        const urlKlinike =
          "http://localhost:8025/api/klinike/listaLekaraKlinika/" +
          this.state.idKlinike;
        axios.get(urlKlinike, config).then(klinika => {
         

          this.setState({
            
            // listaLekara: klinika.data
          });
     
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
          const url2 =
            "http://localhost:8025/api/klinike/listaLekaraKlinika/" +
            this.state.idKlinike;
          axios.get(url2, config).then(resp => {
            console.log("Preuzeta lista klinika");
            console.log(resp.data);

            this.setState({
              // idKlinike: klinika.data.id,
              lekari: resp.data,
              oznaceniLekar: resp.data[0].id,
              nazivOznacenogLekara: resp.data[0].ime
              // pregledLekarID: klinika.data.lekarID,
              // pregledPacijentID: klinika.data.pacijentID,
              // pregledTipPregledaID: klinika.data[0].tipPregledaID,
              // pregledCijena: klinika.data.cena,
            });
          });
          const url3 =
            "http://localhost:8025/api/ST/preuzmiSaleKlinikeZaPregled/" +
            this.state.idKlinike;
          axios.get(url3, config).then(resp => {
            console.log("Preuzeta lista termina");
            console.log(resp.data);

            this.setState(
              {
                // idKlinike: klinika.data.id,
                sale: resp.data,
                oznacenaSala: resp.data[0].id,
                nazivOznaceneSale: resp.data[0].naziv,
                brojOznaceneSale: resp.data[0].broj
                // pregledLekarID: klinika.data.lekarID,
                // pregledPacijentID: klinika.data.pacijentID,
                // pregledTipPregledaID: klinika.data[0].tipPregledaID,
                // pregledCijena: klinika.data.cena,
              },
              () => {
                console.log("salaa---- " + this.state.oznacenaSala);
                this.ucitajUnapredDefTermine();
              }
            );
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
  dodajNoviST = e => {
    e.preventDefault();

    this.dialog.show({
      title: "Dodavanje novog termina",
      body: [
        <form className="formaZaDodavanjeNovogTermina">
          <div className="telefonLekara">
            <label className="lekarTelefonLabel" htmlFor="datumPregleda">
              Datum:{" "}
            </label>
            <DatePicker
              className="lekarTelefonLabel"
              name="datumPregleda"
              defaultValue=""
              placeholderText="Izaberi datum"
              selected={this.state.datumZaPregled}
              onSelect={this.handleChangeDate}
            />
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
          <div className="telefonLekara">
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
          </div>
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
          {/* <div className="telefonLekara">
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
          </div> */}
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
          axios

            .post(
              "http://localhost:8025/api/ST/dodajNoviST",
              {
                lekarID: this.state.oznaceniLekar,
                klinikaID: this.state.idKlinike,
                tipPregledaID: this.state.oznaceniTipPregleda,
                cena: this.state.cena,
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
              this.ucitajUnapredDefTermine();
            })
            .catch(error => {
              console.log("greska ST");
              console.log(error.response);
            });
        })
      ],
      bsSize: "medium",
      onHide: dialog => {
        dialog.hide();
        console.log("closed by clicking background.");
      }
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
          nazivOznacenogPregleda: naziv
        });
      }
    }
  }

  biranjeLekara(lekar) {
    
    const idL = lekar.target.value;
    this.setState({
      oznaceniLekar: idL
    });
    
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
  biranjeSala(sala) {
   
    const idL = sala.target.value;
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

          <td>{lista[i].cena} RSD</td>
          <td>{lista[i].popust} %</td>

      
        </tr>
      );
    }
    return res;
  }

  render() {
   
    return (
      <div className="content">
        <Grid fluid>
          
              <Row>
                <Card
                  title="Lista slobodnih termina"
               
                  ctTableFullWidth
                  ctTableResponsive
                  content={
                    <div>
                      <Button
                        className="DodajKlinikuDugme"
                        onClick={e => this.dodajNoviST(e)}
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
