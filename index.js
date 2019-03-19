let express = require("express");
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let session = require("express-session");
let bodyParser = require("body-parser");
let mysql = require("mysql");
let fs = require("fs");
let auth = require("./auth.js");
let app = express();

var con = mysql.createConnection({
    host:"localhost",
    user: "majorissue",
    password: "123123123123",
    database: "majorissue"
})

const githubClientID = "40166f1658b98bdfbbe9"
const githubSecret = "db1a7e35d1acae61efd7bf535b23b9d501c7f096"

app.use(express.static(__dirname + "/static"));
app.use(bodyParser.json("limit: 50mb"));
app.use(bodyParser.urlencoded( "limit 50mb"));
app.use(session({
    secret: 'nice meme',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 86400000
    }
}));

app.get("/login/logout", function(req, res){
    req.session.destroy();
    res.send();
});

// Checks if user is currently logged in. Returns user's name if true
app.get("/login/islogged", function(req, res){
    if(req.session.githubToken != undefined){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.github.com/user?access_token=" + req.session.githubToken);
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4 && xhr.status === 200){
                let userDetails = JSON.parse(xhr.responseText);
                let userJSON = {
                    username: userDetails.login,
                    userImage: userDetails.avatar_url
                }
                res.send(JSON.stringify(userJSON));
            }
        }
        xhr.send();
    } else {
        res.send("NO_VALID_TOKEN");
    }
});

// Get's list of repos from currently logged in user
app.get("/login/repos", function(req, res){
    if(req.session.githubToken != undefined){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.github.com/user/repos?access_token=" + req.session.githubToken);
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4 & xhr.status === 200){
                res.send(xhr.responseText);
            }
        }
        xhr.send();
    } else {
        res.send("NO_VALID_TOKEN");
    }
});

app.get("/login/callback", function(req, res){
    let code = req.query.code;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://github.com/login/oauth/access_token?client_id="+ githubClientID +"&client_secret="+ githubSecret +"&code=" + code)
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 & xhr.status === 200){
            let accessToken = xhr.responseText.split("=")[1];
            accessToken = accessToken.split("&")[0];
            req.session.githubToken = accessToken;
            res.redirect("localhost:8080");
            res.send();
        }
    }
    xhr.send();
});

app.get("/issue", function(req, res){
    let repoID = req.query.repoID;
    con.query("SELECT * FROM issue WHERE repo_id = ?", [repoID], function(err, results, fields){
        if(err) throw err;

        if(results == undefined || results.length == 0){
            return res.send("NO_DATA");
        } 
        res.send(results);
    })
});

// Returns template URL depending on selected tags
app.get("/issue/template", function(req, res){
    let primaryTag = req.query.primary;
    let secondaryTag = req.query.secondary;

    console.log(primaryTag);

    con.query("SELECT markup_url, script_url FROM templates WHERE tag = ? AND combo_tag = ?", [primaryTag, secondaryTag], function(err, results, fields){
        if(err) throw err;
        
        if(results.length == 0){
            res.send("NO_COMBO");
            return;
        }

        if(results[0].markup_url == ""){
            res.send("NO_DATA");
            return;
        }

        let templateURLs = {
            html: results[0].markup_url,
            js: results[0].script_url
        }
        //let jsContent;
        // Get HTML
        fs.readFile("templates/markup/" + templateURLs.html, "utf8", function(err, data){
            if (err) throw (err);
            var htmlData = data;
            //TODO: GET JS FILES
            
            fs.readFile("templates/script/" + templateURLs.js, "utf8", function(err, data){
                let templatedata = {
                    html: htmlData,
                    js: data,
                    js_file: templateURLs.js
                }
                res.send(JSON.stringify(templatedata));
            });
        });
    })
})

app.get("/issue/template/script", function(req, res){
    con.query("SELECT script_url FROM templates", function(err, results){
        if(err) throw err;

        for(let i = 0; i < results.length; i++){
            if(results[i].script_url == ""){
                results.splice(i, 1);
                i--;
            }
        }
        res.send(results);
    });
});

app.get("/issue/bug/fix", function(req, res){
    let id = req.query.id;
    con.query("SELECT * FROM issue_bug_fix WHERE id = ?", [id], function(err, results){
        if(err) throw err;

        res.send(results);
    });
    
});

app.get("/issue/entry", function(req, res){
    let issueData = req.query;
    console.log(issueData);
    con.query("SELECT name, markup_url FROM templates WHERE name = ?",[issueData.type], function(err, results){
        if(err) throw err;
        if(results.length == 0){
            res.send("NO_TYPE");
            return
        }
        let templateResult = results[0];
        console.log(templateResult)
        let issueTable = "issue_" + templateResult.name;
        console.log("Issuetable: " + issueTable);
        let queryString = 
        con.query("SELECT * FROM  " + issueTable + "  WHERE id = ?", [issueData.id], function(err, results){
            if(err) throw err;
            fs.readFile("templates/markup/" + templateResult.markup_url, "utf8", function(err, data){
                let entryData = {
                    entry: results[0],
                    markup: data
                }

                res.send(entryData);
            });
        });
    });

});

app.post("/issue/bug/fix", function(req, res){
    let bugfixData = req.body;
    console.log(bugfixData)
    let issueDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    con.query("INSERT INTO issue_bug_fix SET ?", 
    {work_mal_int: bugfixData.workaround, sol_workaround: bugfixData.bugfix_Solution, note: bugfixData.note}, 
    function(err, result){
        if(err) throw err;
        con.query("INSERT INTO issue SET ? ",
        {title:bugfixData.title, issue_type:"bug_fix", issue_id:result.insertId, repo_id:bugfixData.repoID, date:issueDate},
         function(err, result){
            if(err) throw err;
            res.send();
        });
    });
});

app.listen("8080", function(){
    console.log("MajorIssue service has started at " + new Date);
});

