import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Invoices from './Invoices.js';
import Invoice from './Invoice.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/" component={Invoices} />
        <Route path="/invoice/:invoice_number" component={Invoice} />
      </div>
    );
  }
}

export default App;
