/**
 * Posts - Front-end endpoint
 */

const server = require('express').Router();
const path = require('path');
const marked = require("marked").marked;	// markdown
const insane = require("insane"); 	// sanitizer

const util = require("../../Lib/util");
const dir = require("../../Config/directory");
const options = require("../../Config/options");

server.get("/:post([0-9a-z_-]+)", function(req, res){
  let post;
  try {
    // ambil postingan
    post = util.getJSON(path.resolve(dir.data, "posts", req.params.post + ".json"));

    // ambil gambar
    post.image = [dir.public.images, post.image].join("/")
	
	// ubah markdown -> html
	post.content = insane(
		marked.parse(post.content),
		options.sanitizer
	);

    // taro html ke halaman
    res.render("post", post);

  } catch (e) {
      // tampilkan error detil pada console server
      console.error(e);

      // sementara browser menampilkan error sederhana 
      switch (e.code) {
        case "ENOENT":
          res.status(404);
          res.send("Couldn't find the specified resource");
          // res.redirect("/404");
          return;
        default:
          res.status(500);
          res.send("Something's wrong - something's wrong");
          return;
      }
  }
})

module.exports = server;
