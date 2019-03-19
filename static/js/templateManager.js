// Loads in all scripts for assosicated templates in database
var templateScriptManager = [];

function loadTemplateScripts(){
    $.get("/issue/template/script", function(data){
        for(let i = 0; i < data.length; i++){
            console.log("APPEND");
            templateScriptManager.push({
                name: data[i].script_url,
                hasLoaded: false
            });
        }
        console.log(templateScriptManager);
    });
}

$(document).ready(function(){
    loadTemplateScripts();
})