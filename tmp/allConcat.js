var apiKey = require('./../.env').apiKey;
$(document).ready(function(){
  $("#login").click(function(){
    var user = $("#username").val();
    $("#username").val("");
    $("ol#list").innerHTML = "";
     $(".showUser").text(user);
     removeAll();
     $.get('https://api.github.com/users/' + user + '/repos?access_token='+ apiKey, function(response){
        response.forEach(function (repo) {
          $("ol#list").append("<li>" + repo.name + "</li>");
          console.log(repo.name);
        });
  });
     });
   });

function removeAll(){
 document.getElementById("list").innerHTML = "";
 $(".showUser").text("");
}
