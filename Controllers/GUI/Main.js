/**
 * Main Page
 */

const server = require('express').Router();

server.get("/", function(req, res){
  res.render("index", {
    lol: 5
  });
})

module.exports = server;
