/**
 * GUI endpoints
 */

const server = require('express').Router();

// laman utama
server.use("/", require("./Main"));

// laman postingan
server.use("/post", require("./Post"));

module.exports = server;
