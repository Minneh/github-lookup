var apiKey = "8a08e7209e775ff2fbf490ec8424be5f0676298b";
$(document).ready(function(){
  $("#login").click(function(){
    var user = $("#username").val();
    $("#username").val("");
    $("ol#list").innerHTML = "";
     $(".showUser").text(user);
     $.get('https://api.github.com/users/' + user + '/repos?access_token='+ apiKey, function(response){
        response.forEach(function (repo) {
          $("ol#list").append("<li>" + repo.name + "</li>");
          console.log(repo.name);
        });
  });
     });
   });
