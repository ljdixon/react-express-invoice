import React from 'react'

const InvoiceTable = props => (
  <table>
    <thead>
      <tr>
        <th>Invoice#</th>
        <th>Billing Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
    {props.invoices.length > 0 ? (
        props.invoices.map(invoice => (
          <tr key={invoice.invoice_number}>
            <td>{invoice.invoice_number}</td>
            <td>{invoice.billing_date}</td>
            <td>
            <button
                onClick={() => {
                    props.editRow(invoice)
                }}
                className="button muted-button"
                >
                Edit
            </button>
              <button className="button muted-button">Delete</button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={3}>No users</td>
        </tr>
      )}
    </tbody>
  </table>
)

export default InvoiceTable