import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import "klinickiCentar.css";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from "axios";
import Dialog from 'react-bootstrap-dialog';

class ListaZahtevaAdminKC extends Component {
  constructor(props) {
    super(props);
    console.log("ADMINISTRATOR KLINICKOG CENTRA");
    console.log(this.props);
    this.state = {
      uloga: props.uloga,
      email: props.email,
      token: props.token,
      razlogOdbijanja: "",
      za: "",
      listaZahtevaZaRegistraciju: []
    };
    this.config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    this.listaZahtevaZaRegistraciju = this.listaZahtevaZaRegistraciju.bind(this);
    this.handleOdobren = this.handleOdobren.bind(this);
    this.handleOdbijen = this.handleOdbijen.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  ucitajPonovo(){
    
    const url1 =
      "http://localhost:8025/api/administratoriKC/listaZahtevaZaRegistraciju/";

    console.log(url1);
    axios
      .get(url1, this.config)
      .then(response => {
        console.log("URL zahtevi za reg");
        console.log(response);
        this.setState({
          listaZahtevaZaRegistraciju: response.data
        });
      })
      .catch(error => {
        console.log("nije uspeo url1");
        console.log(error);
      });
  }
  componentWillMount() {
    console.log("--------pocetak");
    this.ucitajPonovo();
    
  }
  handleChange = e => {
    e.preventDefault();
    
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
    console.log("On change !!!");
  };
 
  handleOdobren = e => {
    e.preventDefault();
    console.log(e.target.id);
    const url2 = "http://localhost:8025/api/administratoriKC/potvrda"  ;
    axios
    .post(url2,{email: e.target.id}, this.config)
    .then(response => {
      console.log("ODOBRENOOOO");
      console.log(response);
      this.ucitajPonovo();
    })
    .catch(error => {
        console.log(error.response);
    });

  };
  handleOdbijen = e => {
    
    e.preventDefault();
    let zaKoga = e.target.id;
    let raz = "Bez razloga";
    this.setState({
      za : zaKoga
    })
    this.setState({
      razlogOdbijanja : raz
    })
    console.log("--------------------------------");

    this.dialog.show({
      title: 'Odbijanje zahteva za registraciju',
      body: [
        <form className="formaZaSlanjeRazlogaOdbijanja">
          <div className="razlogOdbijanja">
            <label className="razlogOdbijanjaLabel" htmlFor="razlogOdbijanja">Za: </label>
            <input className="razlogOdbijanjaLabel"
              type="text"
              name="za"
              value = {zaKoga}
              disabled="disabled"
              // defaultValue= {za}
              // placeholder={this.state.ime}
              // noValidate
              // onChange={this.handleChange}
            />
          </div>
          <div className="razlogOdbijanja" >
            <label className="razlogOdbijanjaLabel" htmlFor="razlogOdbijanja">Razlog odbijanja: </label>
            <input className="razlogOdbijanjaLabel"
              type="text"
              name="razlogOdbijanja"
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
          console.log("Poslat razlog : ---------------");
          console.log(this.state.za);
          console.log(this.state.razlogOdbijanja);
          const url3 = "http://localhost:8025/api/administratoriKC/odbijanje/"  + this.state.razlogOdbijanja;
          axios
            .post(url3,{email: this.state.za}, this.config)
            .then(response => {
              console.log("Odbijanje uspelo! ");
              console.log(response.data);
              this.ucitajPonovo();
            })
            .catch(error => {
              console.log("Odbijanje nije uspelo! ");
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

  listaZahtevaZaRegistraciju() {
    let res = [];
    let lista = this.state.listaZahtevaZaRegistraciju;

    for (var i = 0; i < lista.length; i++) {
      
      res.push(
        <tr key={i}>
          
          <td>{lista[i].lbo}</td>
          <td>{lista[i].ime}</td>
          <td>{lista[i].prezime}</td>
          <td>{lista[i].email}</td>
          <td>{lista[i].adresa}</td>
          <td>{lista[i].grad}</td>
          <td>{lista[i].drzava}</td>
          <td>{lista[i].telefon}</td>

          <td>
            <Button className="OdobrenZahtev" id={lista[i].email} onClick={e => this.handleOdobren(e)}>
              Odobri
            </Button>
          </td>
          <td>
            <Button  id={lista[i].email} className="OdbijenZahtev" onClick={e => this.handleOdbijen(e)}>
            Odbij
            </Button>
            <Dialog ref={(el) => { this.dialog = el }} ></Dialog>
          </td>
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
                  title="Lista zahteva za registraciju od korisnika"
                  // category="Here is a subtitle for this table"
                  ctTableFullWidth
                  ctTableResponsive
                  content={
                    <Table striped hover>
                      <thead>
                        <tr>
                          
                          <th id="LBOPacijenta">LBO</th>
                          <th id="ImePacijenta"> Ime</th>
                          <th id="PrezimePacijenta">Prezime</th>
                          <th id="EmailPacijenta">Email</th>
                          {/* <th id="LozinkaPacijenta">Lozinka</th> */}
                          <th id="AdresaPacijenta">Adresa</th>
                          <th id="GradPacijenta">Grad</th>
                          <th id="DrzavaPacijenta">Drzava</th>
                          <th id="TelefonPacijenta">Telefon</th>
                          {/* {thArray.map((prop, key) => {
                            return <th key={key}>{prop}</th>;
                          })} */}
                        </tr>
                      </thead>
                      <tbody>{this.listaZahtevaZaRegistraciju()}</tbody>
                    </Table>
                  }
                />
              </Row>
           
        </Grid>
      </div>
    );
  }
}

export default ListaZahtevaAdminKC;
