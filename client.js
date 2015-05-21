var http = require("http");
var option = {
	hostname : '127.0.0.1', 
	port : '8007',
	path : '/resourceList',
	method : 'get'
}
var req = http.request(option, function (res) {
	res.setEncoding('utf-8');
	res.on('data', function (chunk) {
		console.log(chunk);
	});
});

try {
	req.end();
}
catch (err){
	console.log("request error!");
}