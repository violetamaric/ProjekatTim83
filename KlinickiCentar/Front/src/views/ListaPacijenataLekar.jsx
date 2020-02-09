import React, { Component } from "react";
import { Grid, Row, Col, Table, NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Card } from "components/Card/Card.jsx";
import "klinickiCentar.css";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from "axios";
import Dialog from 'react-bootstrap-dialog';

import PregledProfilaPacijenta from "views/PregledProfilaPacijenta.jsx"


class ListaPacijenataLekar extends Component {
  constructor(props) {
    super(props);
    console.log("MEDICINSKA SESTRA");
    console.log(this.props);
    this.state = {
      uloga: props.uloga,
      email: props.email,
      token: props.token,
      selected: null,
      listaPacijenata: [],
      adresaP: "",
      drzavaP: "",
      emailP: "",
      gradP: "",
      idP: "",
      imeP: "",
      lboP: "",
      lozinkaP: "",
      prezimeP: "",
      telefonP:"",
      pretraziPolje: "",
      tezina: "",
      visina: "",
      krvnaGrupa: "",
      ime: "",
      prezime: "",
      lbo: "",
      
      redirectToProfilPacijenta: false,
      emailPacijenta: ""

    };
    this.config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
    this.listaPacijenata = this.listaPacijenata.bind(this);
    this.handlePrikazZK = this.handlePrikazZK.bind(this);
    this.handlePrikazPacijenta = this.handlePrikazPacijenta.bind(this);
    this.sortMyArray = this.sortMyArray.bind(this);
  };
  componentWillMount() {
    console.log("--------pocetak");

    const url1 = 'http://localhost:8025/api/lekari/listaPacijenataLekara' ; 

    // console.log(url1, this.config);
    axios
      .get(url1, this.config)
      .then(response => {
        console.log("URL lista pacijenata");
        console.log(response);
        this.setState({
          listaPacijenata: response.data
        });
      })
      .catch(error => {
        console.log("nije uspelo ucitavanje liste pacijenata");
        console.log(error);
      });
  };

  handleChange = e => {
      e.preventDefault();
      this.setState({ [e.target.name]: e.target.value });
      console.log(this.state);
      console.log("On click !!!");
  };

 
//unutar pregleda treba
  handlePrikazZK = e => {
    e.preventDefault();
    console.log( e.target.id);
    axios
      .get("http://localhost:8025/api/pacijenti/findPacijentEmailMS",
      {email: e.target.id}, this.config)
      .then(response => {
        console.log("Preuzet pacijent");
        console.log(response);
        this.setState({
          ime: response.data.ime,
          prezime: response.data.prezime,
          lbo: response.data.lbo
        }, ()=> axios
                  .get("http://localhost:8025/api/pacijenti/findZKMS", 
                  {email: e.target.id}, this.config)
                  .then(Response => {
                    console.log("Preuzet ZK  pacijenta: ");
                    console.log(Response.data);
            
                    this.setState({
                      tezina: Response.data.tezina,
                      visina: Response.data.visina,
                      krvnaGrupa: Response.data.krvnaGrupa
                    }, ()=> this.dialog.show({
                      title: 'Zdravstveni karton',
                      body: [
                        <Table  striped hover>
                                  <tbody>
                                    <tr>
                                      <td>
                                        <label>Ime: </label>
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          name="ime"
                                          defaultValue={this.state.ime}
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
                                          defaultValue={this.state.prezime}
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
                                          defaultValue={this.state.lbo}
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
                                          defaultValue={this.state.visina}
                                          disabled="disabled"
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
                                          defaultValue={this.state.tezina}
                                          disabled="disabled"
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
                                          defaultValue={this.state.krvnaGrupa}
                                          disabled="disabled"
                                          // placeholder={this.state.krvnaGrupa}
                                          // noValidate
                                          onChange={this.handleChange}
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
            
                      ],
                      // actions: [
                      //   Dialog.CancelAction(),
                      //   Dialog.OKAction()
                      // ],
                      bsSize: 'medium',
                      onHide: (dialog) => {
                        dialog.hide()
                        console.log('closed by clicking background.')
                      }
                    }));
                  })
                  .catch(error => {
                    console.log("ZK pacijenta nije preuzet");
                  })); 
      })
      .catch(error => {
        console.log("Pacijent nije preuzet");
        console.log(error);
      });
    
    


    
    
    
  };

  handlePrikazPacijenta = e=>{
    // e.preventDefault();
    console.log(e.currentTarget.id);
    this.setState({
      emailPacijenta: e.currentTarget.id
    })
    this.setState({
        
        redirectToProfilPacijenta: true
    })

  }

  listaPacijenata() {
    let res = [];
    
    const pretraga = this.state.pretraziPolje;
    console.log(pretraga);
    if (pretraga == "" || pretraga == undefined){
      let lista = this.state.listaPacijenata;
      for (var i = 0; i < lista.length; i++) {
        res.push(
          <tr key = {i} >
            {/* <td >{i+1}</td> */}
            <td >{lista[i].lbo}</td>
            <td >{lista[i].ime}</td>
            <td >{lista[i].prezime}</td>
            <td >{lista[i].email}</td>
            <td >{lista[i].adresa}</td>
            <td >{lista[i].grad}</td>
            <td >{lista[i].drzava}</td>
            <td >{lista[i].telefon}</td>
            
            <td >
                
                <Button className="OdobrenZahtev"
                id={lista[i].id}
                 onClick={e => this.handlePrikazPacijenta(e)}
                > Prikaz</Button>
                <Dialog ref={(el) => { this.dialog = el }} ></Dialog>
            </td>

            
              

            
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
              {/* <td >{i+1}</td> */}
              <td >{lista[i].lbo}</td>
              <td >{lista[i].ime}</td>
              <td >{lista[i].prezime}</td>
              <td >{lista[i].email}</td>
              <td >{lista[i].adresa}</td>
              <td >{lista[i].grad}</td>
              <td >{lista[i].drzava}</td>
              <td >{lista[i].telefon}</td>
              
              <td >
              <Button className="OdobrenZahtev"
                  id={lista[i].id}
                    onClick={e => this.handlePrikazPacijenta(e)}
                 > Prikaz </Button>
                  <Dialog ref={(el) => { this.dialog = el }} ></Dialog>
              </td>
            
            </tr>
          );
        }
      }
    }
    
    return res;
  };

  sortMyArray(sortBy) {
    console.log("sort funkcija");
    
    console.log(sortBy.target.value);
    const lista = this.state.listaPacijenata;
    if (sortBy.target.value === "lbo") {
      console.log("lbo");
      this.setState({
        listaPacijenata: lista.sort((a, b) => a.lbo - b.lbo)
      });
    } else if (sortBy.target.value === "ime") {
      console.log("ime");
      this.setState({
        listaPacijenata: lista.sort((a, b) => a.ime.localeCompare(b.ime))
      });
    } else if (sortBy.target.value === "prezime") {
      console.log("prezime");
      this.setState({
        listaPacijenata: lista.sort((a, b) => a.prezime.localeCompare(b.prezime))
      });
    } else if (sortBy.target.value === "email") {
      console.log("email");

      this.setState({
        listaPacijenata: lista.sort((a, b) => a.email.localeCompare(b.email))
      });
    } else if (sortBy.target.value === "adresa") {
      console.log("adresa");
      this.setState({
        listaPacijenata: lista.sort((a, b) => a.adresa.localeCompare(b.adresa))
      });
    } else if (sortBy.target.value === "grad") {
      console.log("grad");
      this.setState({
        listaPacijenata: lista.sort((a, b) =>  a.grad.localeCompare(b.grad))
      });
    } else if (sortBy.target.value === "drzava") {
      console.log("drzava");
      this.setState({
        listaPacijenata: lista.sort((a, b) => a.drzava.localeCompare(b.drzava))
      });
    } else if (sortBy.target.value === "telefon") {
      console.log("telefon");

      this.setState({
        listaPacijenata: lista.sort((a, b) => a.telefon - b.telefon)
      });
    } 
    // else if (sortBy.target.value === "idOpadajuce") {
    //   console.log("idOpadajuce");

    //   this.setState({
    //     listaPacijenata: lista.sort((a, b) => b.id - a.id)
    //   });
    // } else if (sortBy.target.value === "idRastuce") {
    //   console.log("idRastuce");

    //   this.setState({
    //     listaPacijenata: lista.sort((a, b) => a.id - b.id)
    //   });
    // }
    
  }


  render() {

   

      if (this.state.redirectToProfilPacijenta === true) {
        return (
          <BrowserRouter>
            <Switch>
              <Route
                path="/profilPacijenta"
                render={props => <PregledProfilaPacijenta {...props} 
                token={this.state.token}
                email={this.state.email} 
                uloga={this.state.uloga}
                handleClick={this.props.handleClick}
               //nije emailPacijenta vec je id al dobro
                emailPacijenta={this.state.emailPacijenta} />}
              />
              <Redirect from="/" to="/profilPacijenta" />
            </Switch>
          </BrowserRouter>
        );
      }
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              {/* <Button className="pregledDugme">Svi pacijenti</Button>
              <Button className="pregledDugme">Zakazani pacijenti</Button> */}

              <Card 
                  title="Lista pacijenata"
                  // category="Here is a subtitle for this table"
                  // ctFullWidth
                  // ctResponsive
                 
                  content={
                    
                    <form
                    onSubmit={this.handleSumbit}
                    className="formaIzmenaProfilaPacijent"
                    >
                    
                    <div className="pretraga">
                      <select onChange={e => {this.sortMyArray(e) }}>
                        {/* <option value={"idRastuce"} >Rbr (rastuce)</option>
                        <option value={"idOpadajuce"} >Rbr (opadajuce)</option> */}
                        <option value={"lbo"}>LBO</option>
                        <option value={"ime"}>Ime</option>
                        <option value={"prezime"}>Prezime</option>
                        <option value={"email"}>Email</option>
                        <option value={"adresa"}>Adresa</option>
                        <option value={"grad"}>Grad</option>
                        <option value={"drzava"}>Drzava</option>
                        <option value={"telefon"}>Telefon</option>
                      </select>
                    </div>
                    
                    <div className="pretraga">
                      <input
                        className="pretraga"
                        placeholder="Pretrazi"
                        type="text"
                        aria-label="Search"
                        name="pretraziPolje"
                        margin= "2px"
                        onChange={this.handleChange}
                      />
                      
                    </div>
                    
                    

                    <Card 
                      // category="Here is a subtitle for this table"
                      // ctTableFullWidth
                      // ctTableResponsive
                      className="pretraga"
                      content={
                        <Table style={{width:950}} className="TabelaListePacijenata" striped hover >
                          <thead  className="thead-dark" >
                            <tr>
                              {/* <th id="IdPacijenta">Rbr</th> */}
                              <th id="LBOPacijenta">LBO</th>
                              <th id="ImePacijenta"> Ime</th>
                              <th id="PrezimePacijenta">Prezime</th>
                              <th id="EmailPacijenta">Email</th>
                              <th id="AdresaPacijenta">Adresa</th>
                              <th id="GradPacijenta">Grad</th>
                              <th id="DrzavaPacijenta">Drzava</th>
                              <th id="TelefonPacijenta">Telefon</th>
                              
                            </tr>
                          </thead>
                          <tbody>
                            {this.listaPacijenata()}  
                          </tbody>   
                    </Table>
                        
                        
                      }
                    />
                    
                    </form>
                }
              /> 
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

}

export default ListaPacijenataLekar;