/**
 * Posts - API endpoint
 */

const server = require('express').Router();
const path = require('path');
const marked = require("marked").marked;	// markdown
const insane = require("insane"); 	// sanitizer

const util = require("../../Lib/util");
const dir = require("../../Config/directory");
const options = require("../../Config/options");

function transformPostContent(req, post){
	// ubah konten ke HTML bila diminta
	switch (req.query.format){
		case 'html':
			post.content = insane(
				marked.parse(post.content),
				options.sanitizer
			);
			post.format = "html";
			break;
		default:
			post.format = "markdown";
			break;
	}
}
/**
 * Ambil semua postingan
 *
 * @urlparam {string} format - Supported: html, markdown.
 * @example http://localhost/api/post/
 * @example http://localhost/api/post/?format=html
 */
server.get("/", function(req, res){
  util.getDirectoryJSONs([dir.data, "posts"].join("/"), function(e){
	for (
		let i = 0,
			i_len = e.length,
			post;
		i < i_len;
		i++
	) {
		post = e[i];
		
	  transformPostContent(req, post);
	}
    res.json(e);
  });
});

/**
 * Ambil satu (1) postingan
 *
 * @urlparam {string} format - Supported: html, markdown.
 * @example http://localhost/api/post/test
 * @example http://localhost/api/post/test?format=html
 */
server.get("/:resource([0-9a-z_-]+)", function(req, res){
  try {
	let post = util.getJSON(path.resolve(dir.data, "posts", req.params.resource + ".json"));
	
	transformPostContent(req, post);
	
    res.json(post);
  } catch (e) {
      console.error(e);

      switch (e.code) {
        case "ENOENT":
          res.status(404);
          res.send("Couldn't find the specified resource");
          break;
        default:
          res.status(500);
          res.send("Something's wrong - something's wrong");
          break;
      }
  }
});

module.exports = server;
