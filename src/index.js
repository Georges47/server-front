import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import actionCable from 'actioncable';

const baseUrl = "https://server-back-1.herokuapp.com";

const CableApp = {};
CableApp.cable = actionCable.createConsumer(`ws://${baseUrl}/cable`);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App cableApp={CableApp}/>
  // </React.StrictMode>
);
