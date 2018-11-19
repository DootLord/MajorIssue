 $('.modal').modal();
 $('.dropdown-trigger').dropdown();


$("#btn-newissue").click(function(){
    $("#newissue-modal").modal("open");
});

/**
 * Adds the 2nd row of issue tags to be selected
 */
function add2ndIssueRow()