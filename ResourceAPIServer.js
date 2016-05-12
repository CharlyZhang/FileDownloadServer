/**
 * Created by CharlyZhang-Local on 15-5-11.
 */
var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var utils = require("./utils");
var downloadServer = require("./config").DownloadServer;
var port = require("./config").ResourceApiServer.Port;
var uuid = require('node-uuid');

require("./json2.js");
var DEBUG = require("./config").debug;

var server = http.createServer(function(request, response) {
 	if(request.url!=="/favicon.ico"){
		var APIName = url.parse(request.url).pathname;
		APIName = decodeURI(APIName);
		var nowTime = new Date();
		console.log("["+nowTime+"] Request api:"+APIName+"\n");
		
		response.writeHead(200, {"Content-Type": "text/plain;charset=UTF-8","Server": "Node/V5"});
		
		var prefix = "http://" + downloadServer.Address + "/";
		var path = "./resources";
		var path_pc = "./resources_pc";
		var result = {"status":"success","data":"","msg":""};
		var data = [];
		
		if(APIName == "/resourceList") {
			fs.readdir(path, function(err, files) {  
				if (err) {  
					console.log('Read dir error\n');  
					result["status"] = "fail";
					result["msg"] = "Read dir error";
					response.writeHead(404, {'Content-Type': 'text/plain'});
					response.write(JSON.stringify(result));
					response.end();
				} 
				else {
					var ind = 0;
					result["data"] = data;
					files.forEach(function(filename) { 
						var item = {};
						var ext = filename.split(".")[1];
						if(ext == "dpub") {
							var name = filename.split(".")[0];
							item["id"] = name;
							item["name"] = name;
							item["fileUrl"] = prefix + "resources/" + filename;
							item["coverUrl"] = utils.checkCover(prefix,name);				
							data.push(item);
							if(DEBUG) console.log(item);
							ind++;
						}
					}); 
					response.write(JSON.stringify(result));
					response.end();
				}  
			});  
		}
		else if(APIName == "/pcResourceList") {
			fs.readdir(path_pc, function(err, files) {  
				if (err) {  
					console.log('Read dir error\n');  
					result["status"] = "fail";
					result["msg"] = "Read dir error";
					response.writeHead(404, {'Content-Type': 'text/plain'});
					response.write(JSON.stringify(result));
					response.end();
				} 
				else {
					var ind = 0;
					result["data"] = data;
					files.forEach(function(filename) { 
						var item = {};
						var ext = filename.split(".")[1];
						if(ext == "dpub") {
							var name = filename.split(".")[0];
							item["id"] = name;
							item["name"] = name;
							item["fileUrl"] = prefix + "resources_pc/" + filename;
							item["coverUrl"] = utils.checkCover(prefix,name);				
							data.push(item);
							if(DEBUG) console.log(item);
							ind++;
						}
					}); 
					response.write(JSON.stringify(result));
					response.end();
				}  
			});  
		}
		else {
			console.log("Error: no responding api\n");
			result["status"] = "fail";
			result["msg"] = "No conresponding api";
			response.write(JSON.stringify(result));
			response.end();
		}
	}
});

server.listen(port, function() {
	var nowTime = new Date();
    console.log("["+nowTime+"]Resource api server listening on port " + port + "\n");
});