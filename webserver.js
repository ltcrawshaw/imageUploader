var http = require('http');
var url = require('url');
var fs = require('fs');
var mime = require('mime');
var imageDB = require('imageDB');
var bl = require('bl');
var multiparty = require('multiparty');

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

function uploadFile(request, response) {
    var form = new multiparty.Form();

    form.on('error', function(err) {
        console.log(err);
        fileNotFound(response);
    })

    form.on('part', function(part) {
        part.pipe(bl(function(err, data) {
            if(err) {
                console.log(err);
                fileNotFound(response);
        } else {
            imageDB.uploadFile({
                name: part.filename,
                type: part.headers["content-type"],
                size: part.byteCount,
                data: data
            }, function(resp) {
                    response.writeHead(200, {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
                    });
                    response.end(JSON.stringify(resp));
            });
        }
    }));
});
    
    form.parse(request);
}

function servePage(path, response) {
    var stream = fs.createReadStream(path);
    
    response.writeHead(200, {"Content-Type": mime.getType(path) });
    
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
    
    if(urlReq.pathname === '/images/listImages') {
        imageDB.listImages(function(data) {
            response.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            });
            response.end(JSON.stringify(data));
        });
     } else if(urlReq.pathname === '/images/fetchImage') {
            imageDB.fetchImage(urlReq.query.id, function(image) {
                response.writeHead(200, {
                    'Content-Type': image.type,
                    'Content-Length': image.size
                });
                response.end(image.data);
            });
    } else if(urlReq.pathname === '/images/uploader') {
        uploadFile(request, response);
    
    } else if(urlReq.pathname.substring(0, 8) === '/images/') {
        servePage('assets/'+ urlReq.pathname.substring(8) , response);
    } else { 
        fileNotFound(response); 
    }
}).listen(process.argv[2]);

