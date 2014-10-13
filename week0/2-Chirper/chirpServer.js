var http = require('http'),
    fs = require('fs'),
    chirpsFile = require('./chirps.json');
//    usersFile = require('./config.json');

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

    function createChirp(){
        console.log(JSON.parse(payload));
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
        if(routes[req.url]){
            routes[req.url].call(null, req, res);
        }
        res.end();
    })
}).listen(8080);