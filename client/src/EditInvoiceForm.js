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
      let fee = 0;
      let mileageTotal = 0;
      let total = 0;
      
      fee = docket.fee * 100;
      mileageTotal = Math.round((docket.mileage * mileageRate) * 100, 2) / 100;
      total = ((fee / 100) + mileageTotal);
      return { ...docket, docketTotal: total };
    });
    setInvoice({...props.currentInvoice, dockets: newDockets })
  }, [props])

  const handleChange = idx => evt => {
    const mileageRate = .555;
    let newDockets = invoice.dockets.map((docket, sidx) => {
      if (idx !== sidx) return docket;
      let fee = 0;
      let mileageTotal = 0;
      let total = 0;
      if(evt.target.name === "fee") {
        if(evt.target.value !== "" && !isNaN(evt.target.value)) {
          fee = evt.target.value * 100;
        }

        if(docket.mileage !== "" && !isNaN(docket.mileage)) {
          mileageTotal = Math.round((docket.mileage * mileageRate) * 100, 2) / 100;
        }
        total = ((fee / 100) + mileageTotal);
        console.log({ ...docket, [evt.target.name]: evt.target.value, docketTotal: total });
        return { ...docket, [evt.target.name]: evt.target.value, docketTotal: total };
      } else if (evt.target.name === "mileage") {
        if(evt.target.value !== "" && !isNaN(evt.target.value)) {
          mileageTotal = Math.round((evt.target.value * mileageRate) * 100, 2) / 100;
        }

        if(docket.fee !== "" && !isNaN(docket.fee)) {
          fee = docket.fee * 100;
        }
        total = ((fee / 100) + mileageTotal);
        return { ...docket, [evt.target.name]: evt.target.value, docketTotal: total };
      } else {
        return { ...docket, [evt.target.name]: evt.target.value };
      }
    });
    setInvoice({...invoice, dockets: newDockets })
  };

  const calcInvoiceTotal = () => {
      
    return invoice.dockets.reduce((prev, cur) => (Math.round((prev + cur.docketTotal) * 100, 2) / 100), 0);
  }

  const handleAddShareholder = () => {
    setInvoice({...invoice, dockets: invoice.dockets.concat([{ docketNumber: "", nameOfDefendant: "", addressWhereServed: "", servicePerformed: "", date: "", fee: 0.00, mileage: 0, docketTotal: 0.00 }])})
  };

  const handleRemoveShareholder = idx => () => {
    setInvoice({...invoice, dockets: invoice.dockets.filter((s, sidx) => idx !== sidx)})
  };

  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        if (!invoice.invoice_number || !invoice.billing_date) return
        console.log(invoice)

        props.updateInvoice(invoice.id, invoice)
      }}
    >
      <label>Invoice Number</label>
      <input type="text" name="invoice_number" value={invoice.invoice_number} onChange={handleInputChange} />
      <label>Billing Date</label>
      <input type="text" name="billing_date" value={invoice.billing_date} onChange={handleInputChange} />

      <button
            type="button"
            onClick={handleAddShareholder}
            classnameOfDefendant="small"
          >
            Add Docket
          </button>
  
          {invoice.dockets.map((docket, idx) => (
            <div classnameOfDefendant="shareholder">
              <input
                type="text"
                placeholder="Docket Number"
                name="docketNumber"
                value={docket.docket_number}
                onChange={handleChange(idx)}
              />
              <input
                type="text"
                placeholder="Name of Defendant(s)"
                name="nameOfDefendant"
                value={docket.nameOfDefendant}
                onChange={handleChange(idx)}
              />
               <input
                type="text"
                placeholder="Address Where Served"
                name="addressWhereServed"
                value={docket.addressWhereServed}
                onChange={handleChange(idx)}
              />
              <input
                type="text"
                placeholder="Service Performed"
                name="servicePerformed"
                value={docket.servicePerformed}
                onChange={handleChange(idx)}
              />
              <input
                type="text"
                placeholder="Date"
                name="date"
                value={docket.date}
                onChange={handleChange(idx)}
              />
              <input
                type="text"
                name="fee"
                value={docket.fee}
                onChange={handleChange(idx)}
              />
              <input
                type="text"
                name="mileage"
                value={docket.mileage}
                onChange={handleChange(idx)}
              />
              <input
                type="text"
                name="docketTotal"
                value={docket.docketTotal}
                readOnly
              />
              <button
                type="button"
                onClick={handleRemoveShareholder(idx)}
                classnameOfDefendant="small"
              >
                -
              </button>
            </div>
          ))}
          <button>Update user</button>
      <button onClick={() => props.setEditing(false)} className="button muted-button">
        Cancel
      </button>
      <div>{calcInvoiceTotal().toFixed(2)}</div>
    </form>
  )
}

export default EditInvoiceForm