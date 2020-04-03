import React, { useState, useEffect } from 'react'
import InvoiceTable from './InvoiceTable'
import AddInvoiceForm from './AddInvoiceForm'
import EditInvoiceForm from './EditInvoiceForm'

const App = () => {
    const initialFormState = { id: null, invoice_number: '', billing_date: '', dockets: [] }

    const [invoices, setInvoices] = useState(initialFormState)
    const [currentInvoice, setCurrentInvoice] = useState(initialFormState)
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        fetch('/api/invoices')
            .then(res => res.json())
            .then(invoices => setInvoices(invoices));
    }, [])

    const addInvoice = invoice => {
        fetch('/api/invoices', {
            method: 'POST',
            headers : {"Content-Type": "application/json"},
                    body:JSON.stringify({invoice_number: invoice.invoice_number, billing_date: invoice.billing_date})
        }).then(res => res.json())
        .then(data => invoice.id = data.id)
        .then(setInvoices([...invoices, invoice]));
    }

    const updateInvoice = (id, updatedInvoice) => {
        setEditing(false)
        //setInvoices(invoices.map(invoice => (invoice.id === id ? updatedInvoice : invoice)))
        updatedInvoice.dockets.map((docket) => {
            fetch('/api/invoices/dockets/' + docket.id, {
                    method: 'PUT',
                    headers : {"Content-Type": "application/json"},
                    body:JSON.stringify({docket_number: docket.docket_number, name: docket.name, address: docket.address, service_performed: docket.service_performed, date: docket.date, fee: parseInt(docket.fee * 100), mileage: parseInt(docket.mileage), invoice_id: parseInt(id)})
                }).then((res) => res.json())
                .then((data) => console.log(data))
                .catch((err) => console.log(err))
        })
        setEditing(true)
    }

    const editRow = invoice => {
        setEditing(true)
        //fetch dockets from database
        fetch('/api/invoices/' + invoice.id)
            .then(res => res.json())
            .then(dockets => setCurrentInvoice({ id: invoice.id, invoice_to: invoice.invoice_to, invoice_from: invoice.invoice_from, invoice_number: invoice.invoice_number, billing_date: invoice.billing_date, dockets: dockets }));  
    }

    const deleteInvoice = (id) => {
        setEditing(false)
        fetch('/api/invoices/' + id, {
            method: 'DELETE'
          }).then(res => res.json())
          .then(setInvoices(invoices.filter(invoice => invoice.id !== id)));          
    }

    return (
        <div className="container">
            <div className="flex-row">
                <div className="invoice">
                    {editing ? (
                        <div className="edit-invoice">
                        <EditInvoiceForm
                            editing={editing}
                            setEditing={setEditing}
                            currentInvoice={currentInvoice}
                            updateInvoice={updateInvoice}
                        />
                        </div>
                    ) : (
                        <div>
                        <h2>Add invoice</h2>
                        <AddInvoiceForm addInvoice={addInvoice} />
                        </div>
                    )}
                </div>
                <div className="invoice-list">
                    <h2>Invoices</h2>
                    <InvoiceTable invoices={invoices} editRow={editRow} deleteInvoice={deleteInvoice}/>
                </div>
            </div>
        </div>
    )
}

export default App