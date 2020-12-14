var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var cache = {};

// 请求文件不存在时发送404错误
function send404(response) {
    console.log('send404(response)');
    response.writeHead(404, {'content-type': 'text/plain'});
    response.write('Error 404: resource not found!');
    response.end();
}

// 提供文件数据。设置文件http头并发送文件内容
function sendFile(response, filePath, fileContents) {
    response.writeHead(200, {'content-type': mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}

// 辅助函数，提供静态文件服务
// 检查文件是否缓存了，缓存了就返回缓冲的文件；文件没有被缓存则从硬盘中读取并返回；若文件不存在则返回http 404错误的相应
function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]); // return file from memory
    } else {
        const exists = fs.existsSync(absPath);
        if (exists) {
            fs.readFile(absPath, function(err, data) { // read file from hard disk
                if (err) {
                    send404(response);
                } else {
                    cache[absPath] = data;
                    sendFile(response, absPath, data); // read File from hard disk and return
                }
            });
        } else {
            send404(response);
        }
    }
}

// 创建HTTP服务器
var server = http.createServer(function(request, response) {
    var filePath = false;

    if (request.url == '/') {
        filePath = 'public/index.html'; // 确定返回的默认路径
    } else {
        filePath = 'public' + request.url; // 将URL路径转为文件的相对路径
    }
    console.log('filePath: ', filePath);

    var absPath = './' + filePath;
    serveStatic(response, cache, absPath); // 返回静态文件
});

// 启动HTTP服务器
var port = '3000';
server.listen(port, function() {
    console.log("server listening on port ", port);
});
