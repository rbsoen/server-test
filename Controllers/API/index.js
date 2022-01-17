/**
 * API endpoints
 */

const server = require('express').Router();

server.use("/post", require("./Post"))

module.exports = server;
