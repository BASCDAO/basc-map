import logo from './logo.svg';
import React, {useState} from 'react';
import ReactMapGL from "react-map-gl"
import './App.css';

function App() {
 const [viewport, setViewport] = useState({
   latitude: 45.4211,
   longitude: -75.6903,
  
   width: "100vw",
   height: "100vh",
   zoom: 5
 });
 return (
<div className="App">
  <ReactMapGL {...viewport}
  mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
  onViewportChange={(viewport) => {
    setViewport(viewport);
  }}
  >markers here</ReactMapGL>
</div>
 );

}

export default App;
