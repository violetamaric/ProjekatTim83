import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import "izmenaProfila.css";
import "login.js";
import axios from "axios";

class IzmenaProfilaAdminaKC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
      uloga: props.uloga,
      token: props.token,
      lozinka: this.props.lozinka,
      ime: "",
      prezime: "",

      imeN: "",
      prezimeN: "",
      lozinkaN: "",
      menjanjeLozinke: "password",
      is_checked: false,
      staraLoz: props.lozinka,
      novaLoz: "",
      potvrdaLoz: "",
      promenaLozinke: false,
      formError: ""
    };
    this.config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    this.handleCheckBox = this.handleCheckBox.bind(this);
  }

  componentWillMount() {
    const url =
      "http://localhost:8025/api/administratoriKC/pronadjenAdministratorKC";
    axios
      .get(url, this.config)
      .then(Response => {
        this.setState({
          email: Response.data.email
        });
        this.setState({
          ime: Response.data.ime
        });
        this.setState({
          prezime: Response.data.prezime
        });
        // this.setState({
        //   lozinka: Response.data.lozinka
        // });
      })
      .catch(error => {});
  }
  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSumbit = e => {
    e.preventDefault();
    // let formErrors = { ...this.state.formErrors };
    axios
      .put(
        "http://localhost:8025/api/administratoriKC/izmena",
        {
          ime: this.state.imeN,
          prezime: this.state.prezimeN,
          email: this.state.email,
          adresa: this.state.lozinkaN
        },
        this.config
      )
      .then(response => {
        this.setState({
          ime: response.data.ime
        });

        this.setState({
          prezime: response.data.prezime
        });

        // this.setState({
        //   lozinka: response.data.lozinka
        // });
      })
      .catch(error => {});
  };
  handleCheckBox() {
    if (this.state.is_checked == true) {
      this.setState({ is_checked: false });
      this.setState({ menjanjeLozinke: "password" });
    } else {
      this.setState({ is_checked: true });
      this.setState({ menjanjeLozinke: "text" });
    }
  }

  prikazPromenaLozinke() {
    var res = [];
    if (this.state.promenaLozinke) {
      res.push(
        <table>
          <tr>
            <td>Nova lozinka:</td>
            <td>
              <input
                type="password"
                name="novaLoz"
                // placeholder={this.state.ime}
                // noValidate
                onChange={this.handleChange}
              />
            </td>
          </tr>
          <br></br>
          <tr>
            <td>Potvrdite novu lozinku:</td>
            <td>
              <input
                type="password"
                name="potvrdaLoz"
                // placeholder={this.state.ime}
                // noValidate
                onChange={this.handleChange}
              />
            </td>
          </tr>
          <br></br>
        </table>
      );
    }
    return res;
  }
  promenaLozinkeClick() {
    this.setState({
      promenaLozinke: true
    });
  }
  PotvrdiPromenuLozinkeClick() {
    if (this.state.novaLoz === this.state.potvrdaLoz) {
      axios
        .put(
          "http://localhost:8025/api/administratoriKC/promeniLozinku",
          {
            newPassword: this.state.novaLoz,
            oldPassword: this.props.lozinka
          },
          this.config
        )
        .then(response => {
          this.props.handleClick("LOZINKA JE PROMENJENA");
          this.setState(
            {
              lozinka: this.state.novaLoz
              // lozinka: response.data.lozinka
            },
            () => {
              this.props.promeniLozinku(this.state.novaLoz);
            }
          );
        })
        .catch(error => {});
    } else {
      this.setState({
        formError: "Lozinke se ne poklapaju"
      });
    }
  }

  render() {
    const email = this.state.email;
    const uloga = this.state.uloga;
    const ime = this.state.ime;
    const prezime = this.state.prezime;
    const lozinka = this.state.lozinka;
    const imeN = this.state.imeN;
    const prezimeN = this.state.prezimeN;
    const lozinkaN = this.state.lozinkaN;

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={8}>
              <Card
                title="Izmena podataka"
                content={
                  <form
                    onSubmit={this.handleSumbit}
                    className="formaIzmenaProfilaAdminaKC"
                  >
                    <div className="ime">
                      <label htmlFor="ime">Email: </label>
                      <input
                        type="text"
                        name="ime"
                        defaultValue={email}
                        disabled="disabled"
                        // placeholder={this.state.ime}
                        // noValidate
                        // onChange={this.handleChange}
                      />
                    </div>
                    <div className="ime">
                      <label htmlFor="ime">Ime: </label>
                      <input
                        type="text"
                        name="imeN"
                        defaultValue={ime}
                        // placeholder={this.state.ime}
                        // noValidate
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="prezime">
                      <label htmlFor="prezime">Prezime: </label>
                      <input
                        type="text"
                        name="prezimeN"
                        defaultValue={prezime}
                        // placeholder="prezime"
                        // noValidate
                        onChange={this.handleChange}
                      />
                    </div>

                    {/*                    
                    <div className="lozinka">
                      <label htmlFor="lozinka">Lozinka: </label>
                      <input
                        type={this.state.menjanjeLozinke}
                        name="lozinkaN"
                        defaultValue={lozinka}
                        // placeholder={this.state.adresa}
                        // noValidate
                        onChange={this.handleChange}
                      />
                      <div className="checkbox">
                        <input
                          id="check"
                          type="checkbox"
                          onChange={this.handleCheckBox}
                          checked={this.state.is_checked}
                              
                        />
                        <label htmlFor="check">prikazi lozinku</label>
                      </div> 
                    </div> */}

                    <div className="izmeniPodatkeAdminKC">
                      <Button type="submit">Izmeni podatke</Button>
                    </div>
                  </form>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                // statsIcon="fa fa-clock-o"
                title="O Adminu"
                // category="Ime"
                content={
                  <div id="a">
                    {/* <div className="slikaKCdiv">
                      <h2>
                        <img
                          className="slikaPacijent"
                          src={slikaPacijent}
                        ></img>
                      </h2>
                    </div> */}

                    <div className="typo-line">
                      <h2>
                        <p className="category">Email: </p>
                        <label className="emailAdminaKC">{email}</label>
                      </h2>
                    </div>
                    <div className="typo-line">
                      <h2>
                        <p className="category">Ime: </p>
                        <label className="imeAdminaKC">{ime}</label>
                      </h2>
                    </div>
                    <div className="typo-line">
                      <h2>
                        <p className="category">Prezime: </p>
                        <label className="prezimeAdminaKC">{prezime}</label>
                      </h2>
                    </div>
                    <div>
                      <div>{this.prikazPromenaLozinke()}</div>
                      {this.state.promenaLozinke == false && (
                        <Button
                          variant="outline-primary"
                          onClick={e => this.promenaLozinkeClick()}
                        >
                          Izmeni lozinku
                        </Button>
                      )}
                      {this.state.promenaLozinke && (
                        <Button
                          variant="outline-primary"
                          onClick={e => this.PotvrdiPromenuLozinkeClick()}
                        >
                          Potvrdi lozinku
                        </Button>
                      )}
                      {this.state.formError.length > 0 && (
                        <spam>{this.state.formError}</spam>
                      )}
                    </div>
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default IzmenaProfilaAdminaKC;
