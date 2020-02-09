import { Map, GoogleApiWrapper } from "google-maps-react";
import React, { Component } from "react";
import { Geocode } from "react-geocode";
import Geocoder from "react-native-geocoding";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
const mapStyles = {
  width: "90%",
  height: "80%"
};
const WrappedMap = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      defaultZoom={13}
      defaultCenter={{ lat: 45.267136, lng: 19.833549 }}
      defaultOptions={{
        scrollwheel: false,
        zoomControl: true
      }}
    >
      {/* <Marker position={nadjiKoordinate()} /> */}
    </GoogleMap>
  ))
);
Geocoder.init("AIzaSyBO8lOU4v5gC2H64p7I4l9zZrkgq_dJ9rk");
class MapContainer extends Component {
  constructor(props) {
    super(props);
    console.log("MAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaaa");
    console.log(props);
    this.state = {
      adresa: "Hajduk Veljkova 1",
      geocoder: null
      // stores: [{lat: 47.49855629475769, lng: -122.14184416996333},
      //         {latitude: 47.359423, longitude: -122.021071},
      //         {latitude: 47.2052192687988, longitude: -121.988426208496},
      //         {latitude: 47.6307081, longitude: -122.1434325},
      //         {latitude: 47.3084488, longitude: -122.2140121},
      //         {latitude: 47.5524695, longitude: -122.0425407}]
    };
    console.log(this.props.adresa);
  }
  geocodeAddress = address => {
    this.state.geocoder.geocode({ address: address });
    this.handleResults(address);
  };
  handleResults(results) {
    this.setState({
      foundAddress: results[0].formatted_address,
      isGeocodingError: false
    });

    this.map.setCenter(results[0].geometry.location);
    this.marker.setPosition(results[0].geometry.location);

    return;
  }
  componentWillMount() {
    console.log("COMPONENT WILL MOUNT");
    // Geocoder.init("AIzaSyBO8lOU4v5gC2H64p7I4l9zZrkgq_dJ9rk");

    // this.state.geocoder = new Geocoder();
    console.log(this.state);
    var adresa = "temerinska 5";
    this.nadjiKoordinate();
    // this._getLocationAsync();
    // console.log(adresa.geocodeAddress());
    // geoco;
    // Geocode.fromAddress("temerinska 5");
    // Geocode.fromAddress("Temerinska 5").then(
    //   response => {
    //     console.log("DSADSDSADSADADAD MAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    //     const { lat, lng } = response.results[0].geometry.location;
    //     console.log(lat, lng);
    //   },
    //   error => {
    //     console.error(error);
    //   }
    // );
  }
  _getLocationAsync = async () => {
    console.log("GET LOC ASYNC");
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      console.log("NIJEOKNIJEOKNIJEOK");
      // this.setState({
      //   errorMessage: 'Permission to access location was denied',
      // });
    }
    console.log("OKOKOKOKOKOKOK");
    let adresa = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true
    });
    this.setState({ adresa });
    let lat = this.state.adresa.coords.latitude;
    let long = this.state.adresa.coords.longitude;
    // Geocoder.from("Colosseum")
    //   .then(json => {
    //     var location = json.results[0].geometry.location;
    //     console.log(location);
    //   })
    //   .catch(error => console.warn(error));
    // Geocoder.fromAddress("Temerinska 5").then(
    //   response => {
    //     console.log("DSADSDSADSADADAD MAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    //     const { lat, lng } = response.results[0].geometry.location;
    //     console.log(lat, lng);
    //   },
    //   error => {
    //     console.error(error);
    //   }
    // );
  };
  nadjiKoordinate() {
    var lat = 0;
    var lng = 0;
    // Geocoder.fromAddress("Temerinska 5").then(
    //   response => {
    //     console.log("DSADSDSADSADADAD MAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    //     const { lat, lng } = response.results[0].geometry.location;
    //     console.log(lat, lng);
    //   },
    //   error => {
    //     console.error(error);
    //   }
    // );
    Geocoder.from("Colosseum")
      .then(json => {
        var location = json.results[0].geometry.location;
        console.log(location);
        console.log("AAAAAAAAAAAAAAAA");
      })
      .catch(error => console.warn(error));
    return { lat, lng };
  }
  displayMarkers = () => {
    //   return this.state.stores.map((store, index) => {
    //     return <Marker key={index} id={index} position={{
    //      lat: 48.8583701,
    //      // store.latitude,
    //      lng: 2.2922926
    //      //store.longitude
    //    }}
    //    onClick={() => console.log("You clicked me!")} />
    //   })
  };

  // Enable or disable logs. Its optional.

  render() {
    //     Geocode.setApiKey("AIzaSyBO8lOU4v5gC2H64p7I4l9zZrkgq_dJ9rk");
    //     // set response language. Defaults to english.
    //   Geocode.setLanguage("en");

    // set response region. Its optional.
    // A Geocoding request with regyion=es (Spain) will return the Spanish city.
    // Geocode.setRegion("sr");
    // Geocode.enableDebug();
    // Geocode.fromAddress(this.state.adresa).then(
    //   response => {
    //     console.log("DSADSDSADSADADAD MAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    //     const { lat, lng } = response.results[0].geometry.location;
    //     console.log(lat, lng);
    //   },
    //   error => {
    //     console.error(error);
    //   }
    // );
    return (
      <Map
        google={this.props.google}
        zoom={8}
        style={mapStyles}
        initialCenter={{ lat: 47.444, lng: -122.176 }}
      >
        {this.displayMarkers()}
      </Map>
      // <div>
      //   <WrappedMap
      //     googleMapURL="https://maps.googleapis.com/maps/api/js?keys=AIzaSyBO8lOU4v5gC2H64p7I4l9zZrkgq_dJ9rk"
      //     loadingElement={<div style={{ height: `100%` }} />}
      //     containerElement={<div style={{ height: `100vh` }} />}
      //     mapElement={<div style={{ height: `100%` }} />}
      //   />
      //   <Marker position={this.nadjiKoordinate()} />
      // </div>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: "AIzaSyBO8lOU4v5gC2H64p7I4l9zZrkgq_dJ9rk"
})(MapContainer);
