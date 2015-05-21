/**
 * Created by CharlyZhang-Local on 15-5-11.
 */
var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var mime = require("./mime").types;
var config = require("./config");
var utils = require("./utils");
var zlib = require("zlib");
var DEBUG = true;

var server = http.createServer(function(request, response) {

    var pathname = url.parse(request.url).pathname;
    pathname = decodeURI(pathname);
    var realPath = "." + pathname;

	var nowTime = new Date();
	console.log("["+nowTime+"]Request file:"+realPath+" From:"+request.connection.remoteAddress); 

    fs.exists(realPath, function (exists) {
        if (!exists) {
			console.log("File not exists!");
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        }
        else {
            var ext = path.extname(realPath);
            ext = ext ? ext.slice(1) : 'unknown';
            var contentType = mime[ext] || "text/plain";
            response.setHeader("Content-Type", contentType);

            fs.stat(realPath, function (err, stat) {
                response.setHeader("Content-Length", stat.size);
				response.setHeader("Accept-Ranges", "bytes");
                var lastModified = stat.mtime.toUTCString();
                if(DEBUG)   console.log("file last modified at: " + lastModified);
                var ifModifiedSince = "If-Modified-Since".toLowerCase();
                response.setHeader("Last-Modified", lastModified);
                response.setHeader("Server", "Node/V5");

                if (ext.match(config.Expires.fileMatch)) {
                    var expires = new Date();
                    expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
                    if(DEBUG)   console.log("file expires at: " + expires.toUTCString());
                    response.setHeader("Expires", expires.toUTCString());
                    response.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
                }

                if (request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]) {
                    if(DEBUG)   console.log("Not Modified");
                    response.writeHead(304, "Not Modified");
                    response.end();
                }
                else {
                    var compressHandle = function (raw, statusCode, reasonPhrase) {
                        var stream = raw;
                        var acceptEncoding = request.headers['accept-encoding'] || "";
                        var matched = ext.match(config.Compress.match);

                        if (matched && acceptEncoding.match(/\bgzip\b/)) {
                            if(DEBUG) console.log("Content-Encoding: gzip");
                            response.setHeader("Content-Encoding", "gzip");
                            stream = raw.pipe(zlib.createGzip());
                        }
                        else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
                            if(DEBUG) console.log("Content-Encoding: deflate");
                            response.setHeader("Content-Encoding", "deflate");
                            stream = raw.pipe(zlib.createDeflate());
                        }
                        else {
                            if(DEBUG) console.log("no Content-Encoding");
                        }

                        response.writeHead(statusCode, reasonPhrase);
                        stream.pipe(response);
                    };

                    if (request.headers["range"]) {
						if(DEBUG) console.log(request.headers["range"] + " - " + stat.size);
                        var range = utils.parseRange(request.headers["range"].split("=")[1], stat.size);
                        if (range) {
                            if(DEBUG) console.log("Content-Range", "bytes " + range.start + "-" + range.end + "/" + stat.size);
                            response.setHeader("Content-Range", "bytes " + range.start + "-" + range.end + "/" + stat.size);
                            response.setHeader("Content-Length", (range.end - range.start + 1));
                            var raw = fs.createReadStream(realPath, {"start": range.start, "end": range.end});
                            compressHandle(raw, 206, "Partial Content");
                        }
                        else {
                            if(DEBUG) console.log("Request Range Not Satisfiable");
                            response.removeHeader("Content-Length");
                            response.writeHead(416, "Request Range Not Satisfiable");
                            response.end();
                        }
                    }
                    else {
                        var raw = fs.createReadStream(realPath);
                        console.log("File is sent back!");
                        compressHandle(raw, 200, "Ok");
                    }
                }
            });
        }
    });
});

server.listen(8008, function() {
	var nowTime = new Date();
	console.log("["+nowTime+"] resource download server listening on port 8008");
});