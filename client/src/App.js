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
        invoice.id = invoice.length + 1
        setInvoices([...invoices, invoice])
    }

    const updateInvoice = (id, updatedInvoice) => {
        setEditing(false)
        
        setInvoices(invoices.map(invoice => (invoice.id === id ? updatedInvoice : invoice)))
    }

    const editRow = invoice => {
        setEditing(true)
        //fetch dockets from database
        fetch('/api/invoices/' + invoice.id)
            .then(res => res.json())
            .then(dockets => setCurrentInvoice({ id: invoice.id, invoice_number: invoice.invoice_number, billing_date: invoice.billing_date, dockets: dockets }));  
    }

    return (
        <div className="container">
            <div className="flex-row">
                <div className="edit-invoice" align="center" style={{float: "left", padding: "20px"}}>
                    {editing ? (
                        <div>
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
                <div className="invoice-list" style={{float: "right", padding: "20px"}}>
                    <h2>Invoices</h2>
                    <InvoiceTable invoices={invoices} editRow={editRow} />
                </div>
            </div>
        </div>
    )
}

export default App