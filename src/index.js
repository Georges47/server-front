import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import actionCable from 'actioncable';

const CableApp = {};
CableApp.cable = actionCable.createConsumer(`wss://server-back-1.herokuapp.com/cable`);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App cableApp={CableApp}/>
  // </React.StrictMode>
);
