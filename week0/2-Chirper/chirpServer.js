var http = require('http'),
    fs = require('fs'),
    chirps = require('./chirps.json'),
    users = require('./users.json');

http.createServer(function(req, res){
    var payload = "",
        routes = {
            "/all_chirps": sendAllChirps,
            "/chirp": createChirp,
            "/all_users": sendUsers,
            "/register": createUser,
            "/my_chirps": returnUserChirps,
            "/chirps": sendChirps
        };

    function sendAllChirps(){
        res.writeHead(200, "OK", {'Content-Type':'application/json'});
        res.end(JSON.stringify(chirps, null, '\t'));
    }

    function createChirp(){
        var chirpsLen = chirps.length,
            chirpingUser = JSON.parse(payload);
        users.forEach(function(item){
            if(item.user === chirpingUser.userName){
                chirps.push({
                    userId: item.userId,
                    chirpId: chirps.length,
                    chirpText: chirpingUser.chirp,
                    chirpTime: getFormattedDate()
                });
                item.chirps += 1;
                fs.writeFile('./chirps.json', JSON.stringify(chirps, null, "\t"));
                fs.writeFile('./users.json', JSON.stringify(users, null, "\t"));
            }
        });
        res.end(chirpsLen !== chirps.length ? "Success" : "No such user");
    }

    function sendUsers() {
        res.writeHead(200, "OK", {'Content-Type': 'application/json'});
        res.end(JSON.stringify(users, null, '  '));
    }

    function getFormattedDate() {
        var d = new Date();
        return d.getDay() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear() + ' ' + d.getHours() + ":" + d.getMinutes();
    }

    function createUser() {
        console.log(typeof payload);
        var newUser = JSON.parse(payload),
            response = {
                "user": newUser.userName,
                "userId": users.length,
                "chirps": [],
                "key": require('randomstring').generate(8)
            };
        users.filter(function(item){
            return item.user === newUser.userName;
        }).length === 0 ? users.push(response) : (response = "User name taken!");

        fs.writeFile("./users.json", JSON.stringify(users, null, "\t"), null, function(err){
            console.log(err);
        });

        res.writeHead(200, 'OK', {'Content-Type': 'application/json'});
        res.end(JSON.stringify(response));
    }

    function returnUserChirps(opt) {

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
    });
}).listen(8080);