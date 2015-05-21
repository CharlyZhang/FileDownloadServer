/**
 * Created by CharlyZhang-Local on 15-5-11.
 */
var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var utils = require("./utils");
var downloadServer = require("./config").DownloadServer;

require("./json2.js");
var DEBUG = true;

var server = http.createServer(function(request, response) {
 	if(request.url!=="/favicon.ico"){
		var APIName = url.parse(request.url).pathname;
		APIName = decodeURI(APIName);
		var nowTime = new Date();
		console.log("["+nowTime+"] Request api:"+APIName);
		
		response.writeHead(200, {"Content-Type": "text/plain","Server": "Node/V5"});
		
		var prefix = "http://" + downloadServer.IP + ":" + downloadServer.Port + "/";
		var path = "./resources";
		var result = {"status":"success","data":"","msg":""};
		var data = [];
		
		if(APIName == "/resourceList") {
			fs.readdir(path, function(err, files) {  
				if (err) {  
					console.log('Read dir error');  
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
							var ctime = fs.statSync("./resources/"+filename).ctime;
							var name = filename.split(".")[0];
							item["id"] = ctime;
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
		else {
			console.log("Error: no responding api");
			result["status"] = "fail";
			result["msg"] = "No conresponding api";
			response.write(JSON.stringify(result));
			response.end();
		}
	}
});

server.listen(8007, function() {
	var nowTime = new Date();
    console.log("["+nowTime+"]Resource api server listening on port 8007");
});