import React, { useState } from 'react'

const AddInvoiceForm = props => {
  const initialFormState = { id: null, invoice_number: '', billing_date: '', dockets: [] }
  const [invoice, setInvoice] = useState(initialFormState)

  const handleInputChange = event => {
    const { name, value } = event.target

    setInvoice({ ...invoice, [name]: value, dockets: [] })
  }

  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        if (!invoice.invoice_number || !invoice.billing_date) return

        props.addInvoice(invoice)
        setInvoice(initialFormState)
      }}
    >
      <label>Invoice Number</label>
      <input type="text" name="invoice_number" value={invoice.invoice_number} onChange={handleInputChange} />
      <label>Billing Date</label>
      <input type="text" name="billing_date" value={invoice.billing_date} onChange={handleInputChange} />
      <button>Add new invoice</button>
    </form>
  )
}

export default AddInvoiceForm