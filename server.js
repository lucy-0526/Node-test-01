var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var cache = {};

function send404(response) {
    response.writeHead(404, {'content-type': 'text/plain'});
    response.write('Error 404: resource not found!');
    response.end();
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(200, {'content-type': mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    if (cache(absPath)) {
        sendFile(response, absPath, cache(absPath));
    } else {
        // let exists = fs.existsSync(absPath);
        fs.existsSync(absPath, function(exists) {
            if (exists) {
                fs.readFile(absPath, function(err, data) {
                    
                });
            }
        });
    }
}