var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_number text,
            invoice_to text,
            invoice_from text,
            billing_date text
            )`,
        (err) => {
            if (err) {
                // Table already created
                console.log(err.message)
            } else {
                // Table just created, creating some rows
                var insert = `INSERT INTO invoices (
                    invoice_number, 
                    invoice_to, 
                    invoice_from, 
                    billing_date) 
                    VALUES (?,?,?,?)`
                db.run(insert, ["8152319","LYCOMING COUNTY SHERIFF MARK LUSK \n48 WEST THIRD STREET \nWILLIAMSPORT, PA 17701","Stanley (Ed) Crum \n2381 Riverside Drive \nSouth Williamsport, PA 17702 \nCell: 570-971-2425","1/23/2019"])
                db.run(insert, ["8152320","LYCOMING COUNTY SHERIFF MARK LUSK \n48 WEST THIRD STREET \nWILLIAMSPORT, PA 17701","Stanley (Ed) Crum \n2381 Riverside Drive \nSouth Williamsport, PA 17702 \nCell: 570-971-2425","2/6/2019"])
            }
        });  

        db.run(`CREATE TABLE dockets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            docket_number text,
            name text,
            address text,
            service_performed text,
            date text,
            fee integer,
            mileage integer,
            invoice_id integer,
            FOREIGN KEY(invoice_id) REFERENCES invoices(id)
            )`,
        (err) => {
            if (err) {
                // Table already created
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO dockets (docket_number, name, address, service_performed, date, fee, mileage, invoice_id) VALUES (?,?,?,?,?,?,?,?)'
                db.run(insert, ["CR350-18 LCP - Whiteman - LCP","Andrew Evans","","Transport and Hold","1/14/2019","5100","10", 1])
                db.run(insert, ["CR350-19 LCP - Whiteman - LCP","Andrew Evans","","Transport and Hold","1/15/2019","2100","30", 1])
                db.run(insert, ["CR350-20 LCP - Whiteman - LCP","Andrew Evans","","Transport and Hold","1/16/2019","4500","20", 2])
                db.run(insert, ["CR350-21 LCP - Whiteman - LCP","Andrew Evans","","Transport and Hold","1/17/2019","3800","15", 2])
                db.run(insert, ["CR350-22 LCP - Whiteman - LCP","Andrew Evans","","Transport and Hold","1/17/2019","11000","15", 3])
            }
        });
    }
});


module.exports = db