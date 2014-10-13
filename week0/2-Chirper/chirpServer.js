var http = require('http'),
    chirpsFile = require('./chirps.json');

http.createServer(function(req, res){
    var payload = "",
        routes = {
            "/all_chirps": sendAllChirps,
            "/chirp": createChirp,
            "/all_users": sendUsers,
            "/register": createUser,
            "/my_chirps": returnMyChirps,
            "/chirps": sendChirps
        };

    function sendAllChirps(){
        res.writeHead(200, "OK", {'Content-Type':'application/json'});
        res.end(JSON.stringify(chirpsFile));
    }

    function createChirp(opt){

    }

    function sendUsers() {

    }

    function createUser(user) {
        console.log(payload);
    }

    function returnMyChirps(opt) {

    }

    function sendChirps(opt){

    }

    console.log(req.url);
    console.log(req.method);

    req.on('data', function(chunk){
        payload += chunk.toString();
    });

    req.on('end', function() {
        console.log(payload);
        if(routes[req.url]){
            routes[req.url].call(null, req, res);
        }
        res.end();
    })
}).listen(8080);