import React from 'react';
import { Route, Link } from 'react-router-dom';

class Invoices extends React.Component {
    constructor() {
      super();
      this.state = {
        invoices: []
      };
    }
  
    // ...

    componentDidMount() {
      console.log("API CALL");
      fetch('/api/invoices')
        .then(res => res.json())
        .then(invoices => this.setState({invoices}));
    }
  
    render() {
      return (
        <div id="billing-invoices">
        {this.state.invoices.map((invoice, index) => {
          return (
            <div key={index}><li><Link to={"/invoice/" + invoice.invoice_number}>{invoice.invoice_number}</Link></li></div>
          )
        })}
      </div>
      );
    }
  }

  export default Invoices;