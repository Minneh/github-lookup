(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.apiKey = "8a08e7209e775ff2fbf490ec8424be5f0676298b"

},{}],2:[function(require,module,exports){
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

},{"./../.env":1}]},{},[2]);
