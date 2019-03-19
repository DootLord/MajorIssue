function submitBugFix(){
    var title = document.getElementById("bugfix_title").value
    let bugfixIssue = {
        title: title,
        workaround: document.getElementById("bugfix_worka").value,
        bugfix_Solution: document.getElementById("bugfix_sol").value,
        note: document.getElementById("bugfix_note").value,
        username: username,
        repoID: currentRepo
    }
    $.post("/issue/bug/fix", bugfixIssue, function(data){
        console.log(data);
        M.toast({html:"Issue " + title + " created successfully!"})
        document.getElementById("bugfix_title").value = "";
        document.getElementById("bugfix_worka").value = "";
        document.getElementById("bugfix_sol").value = "";
        document.getElementById("bugfix_note").value = "";
    });
}

$("#bugfix_submitButton").click(function(){
    submitBugFix();
});