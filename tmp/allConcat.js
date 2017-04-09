var apiKey = require('./../.env').apiKey; //obtain API key from .env file
$(document).ready(function(){
  $("#submit").click(function(){
    var user = $("#username").val();//asign user-input name to var user
    $("#username").val("");//clear input textbox
     $("#showUser").text(user);//display input username
     removeAll();//clear repository list

    //  Obtain user repository list from github, searching by username
     $.get('https://api.github.com/users/' + user + '/repos?access_token='+ apiKey, function(response){
      // loop through repos and add to list section
        response.forEach(function (repo) {
          $("ol#list").append("<li>" + repo.name + "</li>");
          console.log(repo.name);
        });
  });
     });
   });

// function to clear repository list
function removeAll(){
 document.getElementById("list").innerHTML = "";
}
