// Dependencies
const eta = require('eta');
const express = require('express');
const dir = require('./Config/directory');

// Port yg diinginkan
const port = process.env.PORT || 2600;

// Buat server
var server = express();

// setup templating engine
server.engine("eta", eta.renderFile);
server.set("view engine", "eta");
server.set("views", "./" + dir.templates);

// API dijalankan dalam script brkt
server.use("/api", require("./Controllers/API"))

// Akses file-file static
server.use("/assets", express.static(dir.assets));

// Front-end berada dalam script brkt
server.use("/", require("./Controllers/GUI"))

// Jalankan server
server.listen(port, function(){
  console.log(`Server is running! (port ${port})`);
});
