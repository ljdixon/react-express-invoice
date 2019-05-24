import React from 'react';

class IncorporationForm extends React.Component {
    constructor() {
      super();
      this.state = {
        invoiceNumber: "",
        billingDate: "",
        dockets: [],
        invoiceTotal: 0
      };
    }
  
    // ...

    componentDidMount() {
      console.log("API CALL");
      fetch('/api/invoices')
        .then(res => res.json())
        .then(invoices => this.setState({invoices}));
    }
  
    handleChange = idx => evt => {
      const mileageRate = .555;
      let newDockets = this.state.dockets.map((docket, sidx) => {
        if (idx !== sidx) return docket;
        let fee = 0;
        let mileageTotal = 0;
        let total = 0;
        if(evt.target.name == "fee") {
          if(evt.target.value != "" && !isNaN(evt.target.value)) {
            fee = evt.target.value * 100;
          }

          if(docket.mileage != "" && !isNaN(docket.mileage)) {
            mileageTotal = Math.round((docket.mileage * mileageRate) * 100, 2) / 100;
          }
          total = ((fee / 100) + mileageTotal);
          console.log({ ...docket, [evt.target.name]: evt.target.value, docketTotal: total });
          return { ...docket, [evt.target.name]: evt.target.value, docketTotal: total };
        } else if (evt.target.name == "mileage") {
          if(evt.target.value != "" && !isNaN(evt.target.value)) {
            mileageTotal = Math.round((evt.target.value * mileageRate) * 100, 2) / 100;
          }

          if(docket.fee != "" && !isNaN(docket.fee)) {
            fee = docket.fee * 100;
          }
          total = ((fee / 100) + mileageTotal);
          return { ...docket, [evt.target.name]: evt.target.value, docketTotal: total };
        } else {
          return { ...docket, [evt.target.name]: evt.target.value };
        }
      });
      this.setState({ dockets: newDockets });
    };

    calcInvoiceTotal = () => {
      
      return this.state.dockets.reduce((prev, cur) => (Math.round((prev + cur.docketTotal) * 100, 2) / 100), 0);
    }

    handleSubmit = evt => {
      evt.preventDefault();
    };
  
    handleAddShareholder = () => {
      this.setState({
        dockets: this.state.dockets.concat([{ docketNumber: "", nameOfDefendant: "", addressWhereServed: "", servicePerformed: "", date: "", fee: 0.00, mileage: 0, docketTotal: 0.00 }])
      });
    };
  
    handleRemoveShareholder = idx => () => {
      this.setState({
        dockets: this.state.dockets.filter((s, sidx) => idx !== sidx)
      });
    };
  
    render() {
      return (
        <div>
        <form onSubmit={this.handleSubmit}>
          {/* ... */}
          <h4>Billing</h4>
          <button
            type="button"
            onClick={this.handleAddShareholder}
            classnameOfDefendant="small"
          >
            Add Docket
          </button>
          <button>Save</button>
  
          {this.state.dockets.map((docket, idx) => (
            <div classnameOfDefendant="shareholder">
              <input
                type="text"
                placeholder="Docket Number"
                name="docketNumber"
                value={docket.docketNumber}
                onChange={this.handleChange(idx)}
              />
              <input
                type="text"
                placeholder="Name of Defendant(s)"
                name="nameOfDefendant"
                value={docket.nameOfDefendant}
                onChange={this.handleChange(idx)}
              />
               <input
                type="text"
                placeholder="Address Where Served"
                name="addressWhereServed"
                value={docket.addressWhereServed}
                onChange={this.handleChange(idx)}
              />
              <input
                type="text"
                placeholder="Service Performed"
                name="servicePerformed"
                value={docket.servicePerformed}
                onChange={this.handleChange(idx)}
              />
              <input
                type="text"
                placeholder="Date"
                name="date"
                value={docket.date}
                onChange={this.handleChange(idx)}
              />
              <input
                type="text"
                name="fee"
                value={docket.fee}
                onChange={this.handleChange(idx)}
              />
              <input
                type="text"
                name="mileage"
                value={docket.mileage}
                onChange={this.handleChange(idx)}
              />
              <input
                type="text"
                name="docketTotal"
                value={docket.docketTotal}
                readOnly
              />
              <button
                type="button"
                onClick={this.handleRemoveShareholder(idx)}
                classnameOfDefendant="small"
              >
                -
              </button>
            </div>
          ))}
        </form>
        <div>{this.calcInvoiceTotal().toFixed(2)}</div>
        </div>
      );
    }
  }

  export default IncorporationForm;