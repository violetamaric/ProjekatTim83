import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import "klinickiCentar.css";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from "axios";
import Dialog from "react-bootstrap-dialog";
import "klinickiCentar.css";
import IzmenaProfila from "./IzmenaProfila";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

class ListaLekara extends Component {
  constructor(props) {
    super(props);
    console.log("LISTA LEKARA");
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
      pretraziPoljeKlinika: "",
      listaSalaZaBrisanjeIzmjenu: []
    };
    this.listaLekaraUK = this.listaLekaraUK.bind(this);
    this.dodajLekara = this.dodajLekara.bind(this);
    this.obrisiLekara = this.obrisiLekara.bind(this);
    this.proslediKliniku = this.proslediKliniku.bind(this);
    // this.listaKlinikaIzbor = this.listaKlinikaIzbor.bind(this);
    this.getKlinikaValue = this.getKlinikaValue.bind(this);
    // this.handleOdobren = this.handleOdobren.bind(this);
    // this.handleOdbijen = this.handleOdbijen.bind(this);
    // this.handleChange = this.handleChange.bind(this);
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
  };

  // listaKlinikaIzbor(){
  //   let res = [];

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
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const urlKlinike =
      "http://localhost:8025/api/klinike/listaLekaraKlinika/" +
      this.state.idKlinike;
    axios.get(urlKlinike, config).then(klinika => {
      console.log("Preuzeta klinika");
      console.log(klinika.data);

      this.setState({
        idKlinika: klinika.data.id,
        listaLekara: klinika.data
      });
    });
  }
  listaLekaraPonovo() {
    console.log("ID KLINIKE OD KOJE TRAZIM LEKARE: " + this.state.idKlinike);
    console.log("ucitaj mi kliniku");
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const urlKlinike =
      "http://localhost:8025/api/klinike/listaLekaraKlinika/" +
      this.state.idKlinike;
    axios.get(urlKlinike, config).then(klinika => {
      console.log("Preuzeta klinika");
      console.log(klinika.data);

      this.setState({
        idKlinika: klinika.data.id,
        listaLekara: klinika.data
      });
    });
  }
  obrisiLekara = e => {
    e.preventDefault();

    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const url6 = "http://localhost:8025/api/klinike/brisanjeLekara";
    console.log(url6);
    axios
      .post(
        url6,
        {
          email: e.target.id
        },
        config
      )
      .then(response => {
        console.log("Brisanje lekara uspelo! ");
        console.log(response.data);
        this.listaLekaraPonovo();
      })
      .catch(error => {
        console.log("Brisanje leka nije uspelo! " + e.target.id);
      });
  };

  componentWillMount() {
    console.log("wmount");
    console.log("Preuzimanje admina klinike.....");
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
        console.log("Preuzet admin klinike: ");
        console.log(Response.data);

        this.setState({
          // email: Response.data.email,
          //   ime: Response.data.ime,
          //   prezime: Response.data.prezime,
          //   telefon: Response.data.telefon,
          idKlinike: Response.data.idKlinike
        });
        console.log("Ucitaj mi kliniku sa id " + this.state.idKlinike);

        axios
          .get(
            "http://localhost:8025/api/lekari/allIBlekari/" +
              this.state.idKlinike,
            config
          )
          .then(resp => {
            console.log(resp);
            this.setState({
              listaSalaZaBrisanjeIzmjenu: resp.data
            });
          });

        console.log("ucitaj mi kliniku");
        const urlKlinike =
          "http://localhost:8025/api/klinike/listaLekaraKlinika/" +
          this.state.idKlinike;
        axios.get(urlKlinike, config).then(klinika => {
          console.log("Preuzeta klinika");
          console.log(klinika.data);

          this.setState({
            // idKlinike: klinika.data.id,
            listaLekara: klinika.data
          });
          console.log("++++++++++++++++++ Id k: " + this.state.idKlinike);
        });
      })

      .catch(error => {
        console.log("Administrator klinike  nije preuzet");
      });
    console.log("************* ID KLINIKE JE:" + this.state.idKlinike);

    //za klinike ovdje
    var config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const url1 = "http://localhost:8025/api/klinike/all";
    axios
      .get(url1, config)
      .then(Response => {
        console.log("Preuzeta lista klinika: ");
        console.log(Response.data);
        this.setState({
          listaKlinika: Response.data
        });
        console.log(this.state.listaKlinika);
      })

      .catch(error => {
        console.log("klinike nisu preuzete");
      });
  }

  onDropdownSelected(e) {
    console.log("THE VAL", e.target.value);
    //here you will see the current selected value of the select input
  }
  dodajLekara = e => {
    e.preventDefault();

    console.log("--------------------------------");
    this.dialog.show({
      title: "Dodavanje novog lekara",
      body: [
        <form className="formaZaDodavanjeNovogLekara">
          <div className="imeLekara">
            <label className="lekarImeLabel" htmlFor="imeLekara">
              Ime:{" "}
            </label>
            <input
              className="lekarImeLabel"
              type="text"
              name="imeLekara"
              defaultValue=""
              onChange={this.handleChange}
            />
          </div>
          <div className="prezimeLekara">
            <label className="lekarPrezimeLabel" htmlFor="prezimeLekara">
              Prezime:{" "}
            </label>
            <input
              className="lekarPrezimeLabel"
              type="text"
              name="prezimeLekara"
              defaultValue=""
              onChange={this.handleChange}
            />
          </div>
          <div className="telefonLekara">
            <label className="lekarTelefonLabel" htmlFor="telefonLekara">
              Telefon:{" "}
            </label>
            <input
              className="lekarTelefonLabel"
              type="text"
              name="telefonLekara"
              defaultValue=""
              onChange={this.handleChange}
            />
          </div>
          <div className="emailLekara">
            <label className="lekarMailLabel" htmlFor="emailLekara">
              Email:{" "}
            </label>
            <input
              className="lekarMailLabel"
              type="text"
              name="emailLekara"
              defaultValue=""
              onChange={this.handleChange}
            />
          </div>
          <div className="lozinkaLekara">
            <label className="lekarLozinkaLabel" htmlFor="lozinkaLekara">
              Lozinka:{" "}
            </label>
            <input
              className="lekarLozinkaLabel"
              type="password"
              name="lozinkaLekara"
              defaultValue=""
              onChange={this.handleChange}
            />
          </div>
          <div className="emailLekara">
            <label className="lekarMailLabel" htmlFor="emailLekara">
              Radno vreme:{" "}
            </label>
            <input
              className="lekarMailLabel"
              type="text"
              name="emailLekara"
              defaultValue="09:00 -  17:00 h"
              disabled="disabled"
              // onChange={this.handleChange}
            />
          </div>
          {/* <div className="klinikaLekara" >
            <label className="lekarKlinikaLabel" htmlFor="lekarKlinika">Klinika: </label>
            <div>
            <select name="odabirKlinike"  onChange={e => {this.proslediKliniku(e)}}>
            {this.listaKlinikaIzbor()} 
            
            </select>
          </div>
          </div> */}
        </form>
      ],
      actions: [
        Dialog.CancelAction(),
        Dialog.OKAction(() => {
          console.log("OK je kliknuto!");
          var config = {
            headers: {
              Authorization: "Bearer " + this.state.token,
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          };
          const url3 = "http://localhost:8025/api/adminKlinike/dodavanjeLekara";
          axios
            .post(
              url3,
              {
                ime: this.state.imeLekara,
                prezime: this.state.prezimeLekara,
                telefon: this.state.telefonLekara,
                lozinka: this.state.lozinkaLekara,
                email: this.state.emailLekara,
                klinikaID: this.state.idKlinike
              },
              config
            )
            .then(response => {
              console.log("Dodavanje lekra je uspjelo! ");
              console.log(response.data);
              this.listaLekaraPonovo();
            })
            .catch(error => {
              console.log("Dodavanje novog lekaara nije uspjelo! ");
              console.log("+++++++++++" + this.state.idKlinike);
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

  listaLekaraUK() {
    let res = [];
    let lista = this.state.listaLekara;
    let lis = this.state.listaSalaZaBrisanjeIzmjenu;
    const pretraga = this.state.pretraziPoljeKlinika;
    if (pretraga == "" || pretraga == undefined) {
      for (var i = 0; i < lista.length; i++) {
        if (lis.some(item => lista[i].id === item.id)) {
          res.push(
            <tr key={i}>
          

              <td>{lista[i].ime}</td>
              <td>{lista[i].prezime}</td>
              <td>{lista[i].email}</td>

              <td>{lista[i].telefon}</td>
              <td>
                <Button id={lista[i].email} onClick={e => this.obrisiLekara(e)}>
                  Obrisi
                </Button>
                <Dialog
                  ref={el => {
                    this.dialog = el;
                  }}
                ></Dialog>
              </td>
              <td>
                <Button
                  className="OdobrenZahtev"
                  id={lista[i].email}
                  onClick={e => this.handleIzmeni(e)}
                >
                  Izmeni
                </Button>
              </td>
            </tr>
          );

      }else{
        res.push(
          <tr key={i}>
            

            <td>{lista[i].ime}</td>
            <td>{lista[i].prezime}</td>
            <td>{lista[i].email}</td>

            <td>{lista[i].telefon}</td>
            <td>
            
            </td>
            <td>
        
            </td>
          </tr>
        );
      }
    }
  }else{
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].ime.toLowerCase().includes(pretraga.toLowerCase()) || lista[i].prezime.toLowerCase().includes(pretraga.toLowerCase()) )  {
        if(lis.some(item => lista[i].id === item.id)){
          res.push(
            <tr key={i}>
            
    
              <td>{lista[i].ime}</td>
              <td>{lista[i].prezime}</td>
              <td>{lista[i].email}</td>
    
              <td>{lista[i].telefon}</td>
              <td>
                <Button id={lista[i].email} onClick={e => this.obrisiLekara(e)}>
                  Obrisi
                </Button>
                <Dialog
                  ref={el => {
                    this.dialog = el;
                  }}
                ></Dialog>
              </td>
              <td>
                <Button
                  className="OdobrenZahtev"
                  id={lista[i].email}
                  onClick={e => this.handleIzmeni(e)}
                >
                  Izmeni
                </Button>
              </td>
            </tr>
          );
        } else{
          res.push(
            <tr key={i}>
              
    
              <td>{lista[i].ime}</td>
              <td>{lista[i].prezime}</td>
              <td>{lista[i].email}</td>

              <td>{lista[i].telefon}</td>
              <td></td>
              <td></td>
            </tr>
          );
        }
      }
    } else {
      for (var i = 0; i < lista.length; i++) {
        if (
          lista[i].ime.toLowerCase().includes(pretraga.toLowerCase()) ||
          lista[i].prezime.toLowerCase().includes(pretraga.toLowerCase())
        ) {
          if (lis.some(item => lista[i].id === item.id)) {
            res.push(
              <tr key={i}>
                <td>{lista[i].id}</td>

                <td>{lista[i].ime}</td>
                <td>{lista[i].prezime}</td>
                <td>{lista[i].email}</td>

                <td>{lista[i].telefon}</td>
                <td>
                  <Button
                    id={lista[i].email}
                    onClick={e => this.obrisiLekara(e)}
                  >
                    Obrisi
                  </Button>
                  <Dialog
                    ref={el => {
                      this.dialog = el;
                    }}
                  ></Dialog>
                </td>
                <td>
                  <Button
                    className="OdobrenZahtev"
                    id={lista[i].email}
                    onClick={e => this.handleIzmeni(e)}
                  >
                    Izmeni
                  </Button>
                </td>
              </tr>
            );
          } else {
            res.push(
              <tr key={i}>
                <td>{lista[i].id}</td>

                <td>{lista[i].ime}</td>
                <td>{lista[i].prezime}</td>
                <td>{lista[i].email}</td>

                <td>{lista[i].telefon}</td>
                <td></td>
                <td></td>
              </tr>
            );
          }
        }
      }
    }
    return res;
  }
}
  handleChangePretraga = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });

    console.log("On change !!!");
  };

  render() {
    const lista = this.state.listaKlinika;
    const reirectToIzmeniLekar = this.state.reirectToIzmeniLekar;
    // console.log("LEKARRRRRRR : "  + this.state.emailLekara);
    const emailLekara = this.state.emailLekara;
    const token = this.state.token;
    if (reirectToIzmeniLekar === true) {
      return (
        <BrowserRouter>
          <Switch>
            <Route
              path="/izmenaProfilaLekara"
              render={props => (
                <IzmenaProfila {...props} email={emailLekara} token={token} />
              )}
            />
            <Redirect from="/" to="/izmenaProfilaLekara" />
          </Switch>
        </BrowserRouter>
      );
    }
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <div>
              <h5>
                <input
                  placeholder="Pretrazi lekare"
                  type="text"
                  aria-label="Search"
                  name="pretraziPoljeKlinika"
                  onChange={this.handleChangePretraga}
                  value={this.state.pretraziPoljeKlinika}
                />
            </h5>
              </div>
            
                <Card
                  title="Lista lekara"
                  // category="Here is a subtitle for this table"
                  ctTableFullWidth
                  ctTableResponsive
                  content={
                    <div>
                      <Button
                        className="DodajKlinikuDugme"
                        onClick={e => this.dodajLekara(e)}
                      >
                        Dodaj lekara
                      </Button>
                      <Dialog
                        ref={el => {
                          this.dialog = el;
                        }}
                      ></Dialog>

                      <Table striped hover>
                        <thead>
                          <tr>
                           

                            <th id="ImePacijenta"> Ime</th>
                            <th id="PrezimePacijenta">Prezime</th>
                            <th id="EmailPacijenta">Email</th>

                            <th id="TelefonPacijenta">Telefon</th>
                          </tr>
                        </thead>
                        <tbody>{this.listaLekaraUK()}</tbody>
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

export default ListaLekara;
