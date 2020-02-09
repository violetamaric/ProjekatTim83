import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import "klinickiCentar.css";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from "axios";
import moment from 'moment';


class OveravanjeRecepata extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      uloga: props.uloga,
      token: props.token,
      email: props.email,
      selected: null,
      recepti: []
    };
    this.config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
    this.listaRecepata = this.listaRecepata.bind(this);
    this.overaRecepta = this.overaRecepta.bind(this);
    this.ucitavanjeListeRecepata =this.ucitavanjeListeRecepata.bind(this);
  };

  ucitavanjeListeRecepata(){
    const url1 = 'http://localhost:8025/api/medicinskaSestra/listaRecepata'; 
    axios
      .get(url1, this.config)
      .then(response => {
        console.log("PREUZETA LISTA RECEPATA");
        console.log(response.data);
        this.setState({
          recepti: response.data
        });
      })
      .catch(error => {
        console.log("nije preuzeta lista recepata");
        console.log(error);
      });
  }

  componentWillMount() {
    console.log("--------pocetak");
    this.ucitavanjeListeRecepata();
    
    };

  handleChange = e => {
      e.preventDefault();
      //this.setState({ [e.target.name]: e.target.value });
      console.log(this.state);
      console.log("On click !!!");
    };



  listaRecepata(){
    let res = [];
    let lista = this.state.recepti;
    
    for (var i = 0; i < lista.length; i++) {
     
      res.push(
        <tr key = {i} >
          <td >{lista[i].nazivLeka}</td>
          <td >{moment(lista[i].datumIzvestaja).format("DD.MM.YYYY.")}</td>
          <td >{lista[i].imeL + " " + lista[i].prezimeL}</td>
          <td >{lista[i].imeP + " " + lista[i].prezimeP + " " + lista[i].jmbgP}</td>

          <td ><Button className="OdobrenZahtev"  
          id={lista[i].id}
          onClick={e=> this.overaRecepta(e)}
          >Overi</Button></td>
          
        </tr>
      );
    }
    return res;
  };

  overaRecepta= e => {
    
    console.log("OVERA RECEPTA; " + e.target.id)
   
    const url1 = 'http://localhost:8025/api/medicinskaSestra/overa'; 
    axios
      .put(url1, e.target.id ,this.config)
      .then(response => {
        console.log("PREUZETA LISTA RECEPATA");
        console.log(response.data);
        this.props.handleClick("RECEPT JE OVEREN");
        this.ucitavanjeListeRecepata();
      })
      .catch(error => {
        console.log("nije preuzeta lista recepata");
        console.log(error);
      });
  }

  render() {
    return (
      <div className="content">
        <Grid fluid>
          
              <Row >
                <Card
                  title="Lista pristiglih recepata od pacijenata"
                  // category="Here is a subtitle for this table"
                  ctTableFullWidth
                  ctTableResponsive
                  content={
                    <Table striped hover >
                      <thead>
                        <tr>
                        
                          <th >Naziv leka</th>
                          <th >Datum</th> 
                          <th >Lekara</th>
                          <th >Pacijent(JMBG)</th>
                          
                         
                        </tr>
                      </thead>
                      <tbody>
                        {this.listaRecepata()}
                        
                      </tbody>
                      
                    </Table>
                   }
                />
                
              
              </Row>
             

         
        </Grid>
      </div>
    );
  }

}

export default OveravanjeRecepata;