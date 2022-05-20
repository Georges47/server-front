import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import actionCable from 'actioncable';

const CableApp = {};
CableApp.cable = actionCable.createConsumer('ws://192.168.0.7:8080/cable');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App cableApp={CableApp}/>
  // </React.StrictMode>
);
