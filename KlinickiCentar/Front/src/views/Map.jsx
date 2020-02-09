import React from "react";
// react components used to create a google map
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import Geocode from "react-geocode";

// function getData(){
//   Geocode.setApiKey("AIzaSyBO8lOU4v5gC2H64p7I4l9zZrkgq_dJ9rk");
//   // Get address from latidude & longitude.
//   Geocode.fromLatLng("48.8583701", "2.2922926").then(
//     response => {
//       const address = response.results[0].formatted_address;
//       console.log(address);
//     },
//     error => {
//       console.error(error);
//     }
//   );

//     // Get latidude & longitude from address.

// }
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

      <Marker
        position={Geocode.fromAddress("Temerinska 5").then(
          response => {
            console.log(
              "DSADSDSADSADADAD MAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
            );
            const { lat, lng } = response.results[0].geometry.location;
            console.log(lat, lng);
          },
          error => {
            console.error(error);
          }
        )}
      />

      <Marker position={{ lat:45.250330 , lng: 19.823720}} /> 

    </GoogleMap>
  ))
);

// //AIzaSyBO8lOU4v5gC2H64p7I4l9zZrkgq_dJ9rk api key

function Maps({ ...prop }) {

 
console.log({...prop});
Geocode.fromAddress("Bulevar Oslobodjenja 67").then(
  response => {
    console.log("dasdsadasdasdsadas nananaa ananananna aana **-* -*- *- ")
    console.log(response);
    const { lat, lng } = response.results[0].geometry.location;
    console.log(lat, lng);
  },
  error => {
    console.error(error);
  }
);

  return (

    <WrappedMap
      googleMapURL="https://maps.googleapis.com/maps/api/js?keys=AIzaSyBO8lOU4v5gC2H64p7I4l9zZrkgq_dJ9rk"
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `100vh` }} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
  );
}

export default Maps;