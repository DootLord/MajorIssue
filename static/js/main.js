// Communicates with Github API to login user via their Github account
function signIn(){
    // Github API call using unique personal ID for OAuth App
    window.location = "https://github.com/login/oauth/authorize?scope=read:user%20repo&client_id=40166f1658b98bdfbbe9";
}
// If server currently has user's access key
var validLogin = false;
var username;
var userRepos;
var userIssues;
var currentRepo;
var globals = {
    selectedPrimaryTag: "1", // bug
    selectedSecondaryTag: "3" // fix
}

$("#signinButton").click(function(){signIn()});

// Check's if user has logged in. Stores username globally
function checkLoginDetails(){
    console.log("CALLED");
    let signinButton = document.getElementById("signinButton");
    let gitImage = document.getElementById("gitImage");

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/login/islogged");
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 & xhr.status === 200){
            if(xhr.responseText === "NO_VALID_TOKEN"){
                console.log("NO TOKEN")
                validLogin = false;
                return;
            } else {
                userDetails = JSON.parse(xhr.responseText);
                validLogin = true;
                console.log("TOKEN VALID")

                M.toast({html: 'Welcome back ' + userDetails.username + ' !', classes: 'rounded'});
                console.log(xhr.responseText);
                signinButton.innerText = userDetails.username;
                gitImage.src = userDetails.userImage;

                // If login is valid, grab currently available repos
                grabUserRepos();
            }
        }
    }
    xhr.send();
}

function grabUserRepos(){
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/login/repos");
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 & xhr.status === 200){
            if(xhr.responseText === "NO_VALID_TOKEN"){
                return;
            } else {
                userRepos = JSON.parse(xhr.responseText);
                buildRepoList();
            }
        }
    }
    xhr.send();
}

function buildRepoList(){
    let repoCollection = document.getElementById("repo-list");
    repoCollection.innerHTML = "";
    for(let i = 0; userRepos.length > i; i++){
        let repo = document.createElement("a");
        repo.onclick = function(){
            selectRepo(repo.getAttribute("repoIndex"));
        }
        repo.setAttribute("repoIndex", i);
        repo.classList.add("collection-item");

        let p = document.createElement("p");
        p.innerText = userRepos[i].name;
        p.style = "margin:0px";

        repo.append(p);

        repoCollection.append(repo);
    }
}

function selectRepo(repoIndex){
    let repo = userRepos[repoIndex];
    let xhr = new XMLHttpRequest;
    currentRepo = repo.id;

    document.getElementById("selected-repo").innerText = repo.name;
    xhr.open("GET", "/issue?repoID=" + repo.id);
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            if(xhr.responseText != "NO_DATA"){
                userIssues = JSON.parse(xhr.responseText);
                buildIssueList(JSON.parse(xhr.responseText));
            } else {
                document.getElementById("issue-list").innerHTML = ""; // Clear out list if no issues exist
                M.toast({html:"No issues exist! Congrats!"});
            }
        }
    }
    xhr.send();
}

function buildIssueList(issues){
    console.log(issues);
    let issueCollection = document.getElementById("issue-list");
    issueCollection.innerHTML = "";

    for(let i = 0; issues.length > i; i++){
        let issue = document.createElement("a");
        issue.onclick = function(){
            let issueID = this.getAttribute("issue");
            let title = this.getAttribute("title");
            let type = this.getAttribute("type");
            selectIssue(issueID, title, type);
        }
        issue.setAttribute("issue", issues[i].issue_id);
        issue.setAttribute("type", issues[i].issue_type);
        issue.setAttribute("title", issues[i].title);
        issue.classList.add("collection-item");

        let title = document.createElement("h5");
        title.innerText = issues[i].title;

        let bugType = document.createElement("span");
        bugType.innerText = "Bugtype: " + issues[i].issue_type;

        let dateCreated = document.createElement("span");
        dateCreated.innerText = "  |    Created: " + issues[i].date;

        issue.append(title);
        issue.append(bugType);
        issue.append(dateCreated);
        issueCollection.append(issue);
        
    }
}

function selectIssue(issueID, title, type){
    type = type.toLowerCase();
    let templateArea = document.getElementById("templateArea");
    console.log(type);
    switch(type.toLowerCase()){
        case "bug_fix":
        $.get("/issue/entry", {id: issueID, type:type}, function(data){
            console.log(data);
            templateArea.innerHTML = data.markup;
            document.getElementById("bugfix_title").value = title;
            document.getElementById("bugfix_worka").value = data.entry.work_mal_int;
            document.getElementById("bugfix_sol").value = data.entry.sol_workaround;
            document.getElementById("bugfix_note").value = data.entry.note;
            //document.getElementById("bugfix_submitButton").style.entry.display = "none"
            $("#issueModal").modal("open");
    
        });
    }
    
}

// function submitBugFix(){
//     var title = document.getElementById("bugfix_title").value
//     let bugfixIssue = {
//         title: title,
//         workaround: document.getElementById("bugfix_worka").value,
//         bugfix_Solution: document.getElementById("bugfix_sol").value,
//         note: document.getElementById("bugfix_note").value,
//         username: username,
//         repoID: currentRepo
//     }
//     $.post("/issue/bug/fix", bugfixIssue, function(data){
//         console.log(data);
//         M.toast({html:"Issue " + title + " created successfully!"})
//         document.getElementById("bugfix_title").value = "";
//         document.getElementById("bugfix_worka").value = "";
//         document.getElementById("bugfix_sol").value = "";
//         document.getElementById("bugfix_note").value = "";
//     });
// }

function addNewIssue(){
    let templateArea = document.getElementById("templateArea");
    //document.getElementById("bugfix_submitButton").style.display = "inline-block";
    $.get("/issue/template", {primary:globals.selectedPrimaryTag, secondary: globals.selectedSecondaryTag },function(data){
        if(data == "NO_DATA"){
            M.toast({html: 'No data currently exists for this combo. Please update the database', classes: 'red'});
            return;
        } else if(data == "NO_COMBO"){
            M.toast({html: 'No such tag combonation exists, please update the database', classes: 'red'});
            return;
        }
        let templateData = JSON.parse(data);
        console.log(templateData)
        templateArea.innerHTML = templateData.html;
        for(let i = 0; i < templateScriptManager.length; i++){
            if(templateScriptManager[i].name == templateData.js_file && templateScriptManager[i].hasLoaded == false){
                eval(templateData.js);
                templateScriptManager[i].hasLoaded = true;
            }
        }
        $("#issueModal").modal("open");
    });
    
}

$(document).ready(function(){
    checkLoginDetails();
    $(".modal").modal();
    var dropdownElems = document.querySelectorAll(".dropdown-trigger");
    M.Dropdown.init(dropdownElems);

    $("#issueModalButton").click(function(){
        addNewIssue();
        
    })
});
