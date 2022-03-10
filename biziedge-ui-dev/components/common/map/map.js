import { GoogleApiWrapper, Map, Polygon, Marker } from "google-maps-react";
import React, { Component } from "react";

const mapStyles = {
  width: "100%",
  height: "100%",
};

const MapContainer = (props) => {
  return (
    <Map
      google={props.google}
      zoom={14}
      style={mapStyles}
      initialCenter={props.clickedPoint}
    >
      <Marker onClick={props.onMarkerClick} name={"Current location"} />

      <Polygon
        paths={props.coordinates}
        strokeColor="#0000FF"
        strokeOpacity={0.8}
        strokeWeight={2}
        fillColor="#0000FF"
        fillOpacity={0.35}
        editable={true}
      />
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDGC8UHtBFgKGVltW2JC5Ome5FJ1eV-rYA",
})(MapContainer);

// import React, { Component } from "react";
// import {
//   withScriptjs,
//   withGoogleMap,
//   GoogleMap,
//   Polygon,
// } from "react-google-maps";
// import { DrawingManager } from "react-google-maps/lib/components/drawing/DrawingManager";

// const triangleCoords = [
//   { lat: 25.774, lng: -80.19 },
//   { lat: 18.466, lng: -66.118 },
//   { lat: 32.321, lng: -64.757 },
//   { lat: 25.774, lng: -80.19 },
// ];

// const Map = (props) => {
//   const { zoom, center } = props;
//   return (
//     <GoogleMap defaultZoom={zoom} defaultCenter={center}>
//       <Polygon
//         path={triangleCoords}
//         key={1}
//         editable={true}
//         options={{
//           strokeColor: "#FF0000",
//           strokeOpacity: 0.8,
//           strokeWeight: 2,
//           fillColor: "#FF0000",
//           fillOpacity: 0.35,
//         }}
//       />

//       <DrawingManager
//         defaultDrawingMode={google.maps.drawing.OverlayType.POLYGON}
//         defaultOptions={{
//           drawingControl: true,
//           drawingControlOptions: {
//             position: google.maps.ControlPosition.TOP_CENTER,
//             drawingModes: [google.maps.drawing.OverlayType.POLYGON],
//           },
//           polygonOptions: { editable: true },
//         }}
//       />
//     </GoogleMap>
//   );
// };

// export default withScriptjs(withGoogleMap(Map));
