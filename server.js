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
app.use(express.static(path.join(__dirname, 'client/public')));

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
// app.get("/", (req, res, next) => {
//     res.json({"message":"Ok"})
// });

app.get("/api/invoices", (req, res, next) => {
    var sql = "SELECT id, invoice_number, billing_date FROM invoices"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        rows.map(row => row.dockets = [])
        res.json(rows)
      });
});

app.get("/api/invoices/:id", (req, res, next) => {
    var sql = "SELECT docket_number, name, address, service_performed, date, fee/100 AS fee, mileage FROM invoices LEFT JOIN dockets ON invoice_id = invoices.id WHERE invoices.id = ?"
    var params = [req.params.id]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json(rows)
      });
});

app.post("/api/user/", (req, res, next) => {
    var errors=[]
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        name: req.body.name,
        email: req.body.email,
        password : md5(req.body.password)
    }
    var sql ='INSERT INTO user (name, email, password) VALUES (?,?,?)'
    var params =[data.name, data.email, data.password]
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