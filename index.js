let express = require("express");
let session = require("express-session");
let bodyParser = require("body-parser");
let mysql = require("mysql");
let fs = require("fs");
let auth = require("./auth.js");
let app = express();

app.use(express.static(__dirname + "/static"));
app.use(bodyParser.json("limit: 50mb"));
app.use(bodyParser.urlencoded( "limit 50mb"));
// app.use(session({
//     secret: auth.session,
//     resave: false,
//     saveUninitialized: true
// }));

app.get("/test", function(req, res){
    res.send("TEST!");
});

app.listen("8080", function(){
    console.log("MajorIssue service has started at " + new Date);
});

