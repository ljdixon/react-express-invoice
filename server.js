// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")
var path = require('path');
var md5 = require("md5")
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static file declaration
app.use(express.static(path.join(__dirname, 'client/build')));

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

// Root endpoint
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
});

app.get("/api/invoices/", (req, res, next) => {
    var sql = "SELECT id, invoice_number, invoice_to, invoice_from, billing_date FROM invoices"
    var params = []
    db.all(sql, params, (err, rows) => {
        console.log(rows)
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json(rows)
      });
});

app.get("/api/invoices/:id", (req, res, next) => {
    var sql = "SELECT dockets.id, docket_number, name, address, service_performed, date, fee, mileage FROM invoices INNER JOIN dockets ON invoice_id = invoices.id WHERE invoices.id = ?"
    var params = [req.params.id]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json(rows)
      });
});

app.post("/api/invoices/", (req, res, next) => {
    /*var errors=[]
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }*/
    var data = {
        invoice_number: req.body.invoice_number,
        billing_date: req.body.billing_date
    }
    var sql ='INSERT INTO invoices (invoice_number, billing_date) VALUES (?,?)'
    var params =[data.invoice_number, data.billing_date]
    db.run(sql, params, function (err) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.delete("/api/invoices/:invoice_id", (req, res, next) => {
    var data = {
        invoice_id: req.params.invoice_id
    }
    var sql ='DELETE FROM invoices WHERE id = ?'
    var params =[data.invoice_id]
    db.all(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.post("/api/invoices/dockets/:invoice_id", (req, res, next) => {
    /*var errors=[]
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }*/
    var data = {
        docket_number: "",
        name: "",
        address: "",
        service_performed: "",
        date: "",
        fee: 0,
        mileage: 0,
        invoice_id: req.params.invoice_id
    }
    var sql ='INSERT INTO dockets (docket_number, name, address, service_performed, date, fee, mileage, invoice_id) VALUES (?,?,?,?,?,?,?,?)'
    var params =[data.docket_number, data.name, data.address, data.service_performed, data.date, data.fee, data.mileage, data.invoice_id]
    db.all(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.delete("/api/invoices/dockets/:id", (req, res, next) => {
    var data = {
        id: req.params.id
    }
    var sql ='DELETE FROM dockets WHERE id = ?'
    var params =[data.id]
    db.all(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.put("/api/invoices/dockets/:id", (req, res, next) => {
    /*var errors=[]
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }*/

    //var data = JSON.parse(req.body)
    var id = req.params.id
    var data = {
        docket_number: req.body.docket_number,
        name: req.body.name,
        address: req.body.address,
        service_performed: req.body.service_performed,
        date: req.body.date,
        fee: req.body.fee,
        mileage: req.body.mileage,
        invoice_id: req.body.invoice_id
    }
   // if (!req.body.id) {
    //    var sql = 'INSERT INTO dockets (docket_number, name, address, service_performed, date, fee, mileage, invoice_id) VALUES (?,?,?,?,?,?,?,?)'
   // } else {
    var params = [data.docket_number, data.name, data.address, data.service_performed, data.date, data.fee, data.mileage, data.invoice_id, id]
    var sql = 'UPDATE dockets SET docket_number = ?, name = ?, address = ?, service_performed = ?, date = ?, fee = ?, mileage = ?, invoice_id = ? WHERE (id = ?)'
    //
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

// Insert here other API endpoints

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});