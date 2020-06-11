var http = require('http');
var url = require('url');
var fs = require('fs');

function fileNotFound(response) {
    response.writeHead(404, {'Content-Type': 'text/html'});
    response.end(
        "<!DOCTYPE html>" 
        + "<html>" 
        + "<head>" 
        + "      <title>File Not Found!</title>"
        + "</head>"
        + "<body>"
        + "       <h1>File Not Found!</h1>"
        + "       <p>The file you requested was not found. Please check the URL and try again.</p>"
        + "</body>"
        + "</html>"
    );
}
function servePage(path, response) {
    var stream = fs.createReadStream(path);
    
    stream.on('error', function(err) {
        console.log(err);
        fileNotFound(response);
    });

    stream.on('data', function(chunk){
        response.write(chunk);
    });
    stream.on('end', function() {
        response.end();
    });
}

http.createServer(function(request, response) {
    var urlReq = url.parse(request.url, true);

    console.log(request.method + " " + request.url);
 
    if(urlReq.pathname.substring(0, 8) === '/images/') {
        servePage('assets/'+ urlReq.pathname.substring(8) , response);
    } else { 
        fileNotFound(response); 
    }
}).listen(process.argv[2]);

