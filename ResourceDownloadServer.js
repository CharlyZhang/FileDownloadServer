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
var port = require("./config").DownloadServer.ListenningPort;
var DEBUG = require("./config").debug;

var server = http.createServer(function(request, response) {

    var pathname = url.parse(request.url).pathname;
    pathname = decodeURI(pathname);
    var realPath = "." + pathname;

	var nowTime = new Date();
	console.log("["+nowTime+"]Request file:"+realPath+" From:"+request.connection.remoteAddress+"\n"); 

    fs.exists(realPath, function (exists) {
        if (!exists) {
			console.log("    File not exists!\n");
            response.writeHead(404, {'Content-Type': 'text/plain;charset=UTF-8'});
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
			return;
        }
		
		fs.stat(realPath, function (err, stat) {
			if(!stat.isFile()) {
				console.log("    request path is not File!\n");
				response.writeHead(400, {'Content-Type': 'text/plain;charset=UTF-8'});
				response.write("This request URL " + pathname + " is illegal.");
				response.end();
				return;
			}
			
			var ext = path.extname(realPath);
			ext = ext ? ext.slice(1) : 'unknown';
			var contentType = mime[ext] || "text/plain";
			response.setHeader("Content-Type", contentType + ";charset=UTF-8");
			
            response.setHeader("Content-Length", stat.size);
			response.setHeader("Accept-Ranges", "bytes");
            var lastModified = stat.mtime.toUTCString();
            if(DEBUG)   console.log("file last modified at: " + lastModified + "\n");
            var ifModifiedSince = "If-Modified-Since".toLowerCase();
            response.setHeader("Last-Modified", lastModified);
            response.setHeader("Server", "Node/V5");

            if (ext.match(config.Expires.fileMatch)) {
                var expires = new Date();
                expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
                if(DEBUG)   console.log("file expires at: " + expires.toUTCString() + "\n");
                response.setHeader("Expires", expires.toUTCString());
                response.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
            }

            if (request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]) {
                if(DEBUG)   console.log("Not Modified\n");
                response.writeHead(304, "Not Modified");
                response.end();
            }
            else {
                var compressHandle = function (raw, statusCode, reasonPhrase) {
                var stream = raw;
                var acceptEncoding = request.headers['accept-encoding'] || "";
                var matched = ext.match(config.Compress.match);

                if (matched && acceptEncoding.match(/\bgzip\b/)) {
                    if(DEBUG) console.log("Content-Encoding: gzip\n");
                    response.setHeader("Content-Encoding", "gzip");
                    stream = raw.pipe(zlib.createGzip());
                }
                else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
                     if(DEBUG) console.log("Content-Encoding: deflate\n");
                     response.setHeader("Content-Encoding", "deflate");
                        stream = raw.pipe(zlib.createDeflate());
                     }
                     else {
                        if(DEBUG) console.log("no Content-Encoding\n");
                     }

                     response.writeHead(statusCode, reasonPhrase);
                     stream.pipe(response);
                };

                if (request.headers["range"]) {
					if(DEBUG) console.log(request.headers["range"] + " - " + stat.size + "\n");
                    var range = utils.parseRange(request.headers["range"].split("=")[1], stat.size);
                    if (range) {
                        if(DEBUG) console.log("Content-Range", "bytes " + range.start + "-" + range.end + "/" + stat.size + "\n");
                        response.setHeader("Content-Range", "bytes " + range.start + "-" + range.end + "/" + stat.size);
                        response.setHeader("Content-Length", (range.end - range.start + 1));
                        var raw = fs.createReadStream(realPath, {"start": range.start, "end": range.end});
                        compressHandle(raw, 206, "Partial Content");
                    }
                    else {
                        if(DEBUG) console.log("Request Range Not Satisfiable\n");
                        response.removeHeader("Content-Length");
                        response.writeHead(416, "Request Range Not Satisfiable");
                        response.end();
                    }
                }
                else {
                    var raw = fs.createReadStream(realPath);
                    if(DEBUG) console.log("File is sent back!\n");
                    compressHandle(raw, 200, "Ok");
                }
            }
        });
    });
});

server.listen(port, function() {
	var nowTime = new Date();
	console.log("["+nowTime+"] resource download server listening on port " + port + "\n");
});