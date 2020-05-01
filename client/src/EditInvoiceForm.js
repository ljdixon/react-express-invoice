import React, { useState, useEffect } from 'react'

const EditInvoiceForm = props => {
  const [invoice, setInvoice] = useState(props.currentInvoice)

  const handleInputChange = event => {
    const { name, value } = event.target
    setInvoice({ ...invoice, [name]: value })
  }

  useEffect(() => {
    const mileageRate = .555;
    let newDockets = props.currentInvoice.dockets.map((docket) => {
      let fee = 0.0;
      let mileageTotal = 0;
      let total = 0;

      fee = docket.fee * 10;
      mileageTotal = docket.mileage * (mileageRate * 1000);
      total = parseFloat(((fee + mileageTotal) / 1000).toFixed(2));
      console.log(total)
      return { ...docket, fee: (fee / 1000).toFixed(2), docketTotal: total };
    });
    setInvoice({ ...props.currentInvoice, dockets: newDockets })
  }, [props])

  const handleChange = idx => evt => {
    const mileageRate = .555;
    let newDockets = invoice.dockets.map((docket, sidx) => {
      if (idx !== sidx) return docket;
      let fee = 0;
      let mileageTotal = 0;
      let total = 0;
      if (evt.target.name === "fee") {
        if (evt.target.value !== "" && !isNaN(evt.target.value)) {
          fee = evt.target.value * 1000;
        }

        if (docket.mileage !== "" && !isNaN(docket.mileage)) {
          mileageTotal = docket.mileage * (mileageRate * 1000);
        }
        total = parseFloat(((fee + mileageTotal) / 1000).toFixed(2));
        console.log({ ...docket, [evt.target.name]: evt.target.value, docketTotal: total });
        return { ...docket, [evt.target.name]: evt.target.value, docketTotal: total };
      } else if (evt.target.name === "mileage") {
        if (evt.target.value !== "" && !isNaN(evt.target.value)) {
          mileageTotal = evt.target.value * (mileageRate * 1000);
        }

        if (docket.fee !== "" && !isNaN(docket.fee)) {
          fee = docket.fee * 1000;
        }
        console.log(fee)
        total = parseFloat(((fee + mileageTotal) / 1000).toFixed(2));
        return { ...docket, [evt.target.name]: evt.target.value, docketTotal: total };
      } else {
        console.log(evt.target.name)
        return { ...docket, [evt.target.name]: evt.target.value };
      }
    });
    setInvoice({ ...invoice, dockets: newDockets })
  };

  const calcInvoiceTotal = () => {
    return invoice.dockets.reduce((prev, cur) => (Math.round((prev + cur.docketTotal) * 100, 2) / 100), 0);
  }

  const handleAddShareholder = () => {
    fetch('/api/invoices/dockets/' + invoice.id, {
      method: 'POST'
    }).then(res => res.json())
      .then(setInvoice({ ...invoice, dockets: invoice.dockets.concat([{ docket_number: "", nameOfDefendant: "", addressWhereServed: "", servicePerformed: "", date: "", fee: 0.00, mileage: 0, docketTotal: 0.00 }]) }));

  };

  const handleRemoveShareholder = (id, idx) => () => {
    fetch('/api/invoices/dockets/' + id, {
      method: 'DELETE'
    }).then(res => res.json())
      .then(setInvoice({ ...invoice, dockets: invoice.dockets.filter((s, sidx) => idx !== sidx) }));
  };

  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        if (!invoice.invoice_number || !invoice.billing_date) return
        props.updateInvoice(invoice.id, invoice)
      }}
    >
      <table className="invoice-info">
        <tbody>
          <tr><td colSpan="18"><h1>CONSTABLE REQUEST FOR PAYMENT</h1></td></tr>
          <tr>
            <td>To:</td>
            <td><textarea name="invoice_to" value={invoice.invoice_to} onChange={handleInputChange}></textarea></td>
            <td rowSpan="5" colSpan="12" id="logo"><img alt="Pennsylvania Crest" src={"./logo.png"} /></td>
            <td>Invoice Number </td><td><input type="text" name="invoice_number" value={invoice.invoice_number} onChange={handleInputChange} /></td>
          </tr>
          <tr>
            <td>From:</td>
            <td><textarea name="invoice_from" value={invoice.invoice_from} onChange={handleInputChange}></textarea></td>
            <td>Billing Date</td><td><input type="text" name="billing_date" value={invoice.billing_date} onChange={handleInputChange} /></td>
          </tr>
        </tbody>
      </table>
      <p>
      </p>
      <table className="invoice-data">
        <tbody>
          <tr>
            <th rowSpan="2">DOCKET <br /> NUMBER</th>
            <th rowSpan="2">Name of Defendant(s) <br /> Address Where Served</th>
            <th rowSpan="2">Service <br /> Performed</th>
            <th rowSpan="2">Date</th>
            <th colSpan="3">Amounts</th>
          </tr>
          <tr>
            <th>Fee</th><th>Mileage</th><th>Total</th>
          </tr>

          {invoice.dockets.map((docket, idx) => (
            <tr key={idx} rowSpan="4">
              <td className="docketNumber">
                <textarea name="docket_number" value={docket.docket_number} onChange={handleChange(idx)}></textarea>
              </td>
              <td>
                <tr>
                  <td className="name">
                    <textarea name="nameOfDefendant" value={docket.nameOfDefendant} onChange={handleChange(idx)}></textarea>
                  </td>
                </tr>
                <tr>
                  <td className="address">
                    <textarea name="addressWhereServed" value={docket.addressWhereServed} onChange={handleChange(idx)}></textarea>
                  </td>
                </tr>

              </td>

              <td className="servicePerformed">
                <textarea name="servicePerformed" value={docket.servicePerformed} onChange={handleChange(idx)}></textarea>
              </td>
              <td className="date">
                <input
                  type="text"
                  name="date"
                  value={docket.date}
                  onChange={handleChange(idx)}
                />
              </td>
              <td className="fees">
                <span className="fee">
                  <input
                    type="text"
                    name="fee"
                    value={docket.fee}
                    onChange={handleChange(idx)}
                  />
                </span>
              </td>
              <td className="mileage">
                <input
                  type="text"
                  name="mileage"
                  value={docket.mileage}
                  onChange={handleChange(idx)}
                />
              </td>
              <td>
                <span className="docketTotal"> ${docket.docketTotal} </span>
              </td>
              <td className="noBorder alignLeft">
                <button
                  type="button"
                  onClick={handleRemoveShareholder(docket.id, idx)}
                >
                  -
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="5" className="noBorder"></td>
            <td className="noBorder">Grand Total:</td>
            <td className="noBorder">${calcInvoiceTotal().toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <div>
        <button type="button" onClick={handleAddShareholder} className="">Add Docket</button>
        <button>Update user</button>
        <button onClick={() => props.setEditing(false)} className="button muted-button">Cancel</button>
      </div>
    </form>
  )
}

export default EditInvoiceForm