var http = require('http'),
    fs = require('fs'),
    ArgumentParser = require("argparse").ArgumentParser,
    parser = new ArgumentParser(),
    config = require('./config.json'),
    actions = {
        "getall": getAllChirps,
        "getusers": getAllUsers,
        "register": registerUser,
        "create": createChirp
    };

parser.addArgument(["--getall"], {action: 'storeTrue'});
parser.addArgument(["--getusers"], {action: 'storeTrue'});
parser.addArgument(["--create"], {action: 'storeTrue'});
parser.addArgument(["--message"]);
parser.addArgument(["--register"], {action: 'storeTrue'});
parser.addArgument(["--user"]);
var args = parser.parseArgs();

Object.keys(args).forEach(function(arg){
    if(actions[arg] && args[arg]){
        actions[arg].call(null, args[arg]);
    }
});

function getAllChirps() {
    getRequest("/all_chirps", function(data){
        console.log(data);
    });
}

function getAllUsers() {
    getRequest("/all_users", function(data){
        console.log(data);
    });
}

function registerUser(){
    if (args.user) {
        postRequest({
            path: "/register",
            postData: {
                userName: args.user
            },
            action: function(data){
                var parsedData = JSON.parse(data);
                console.log(parsedData);
                config.key = parsedData.key;
                config.user = parsedData.user;
                fs.writeFile("./config.json", JSON.stringify(config, null, "\t"));
            }
        });
    }
}

function createChirp() {
    postRequest({
        path: "/chirp",
        postData: {
            chirp: args.message || "Hello world!",
            userName: config.user
        },
        action: function(data){
            console.log(data);
        }
    });
}

function postRequest(opt){
    var post_options = {
        host: config.apiUrl.split(":")[0],
        port: config.apiUrl.split(":")[1],
        path: opt.path,
        method: "POST"
        },
        payload = '';

    var post_req = http.request(post_options, function(res){
        res.setEncoding('utf8');
        res.on('data', function(data){
            payload += data;
        });

        res.on('end', function(){
            opt.action(payload);
        });
    });

    post_req.write(JSON.stringify(opt.postData));

    post_req.end();
}

function getRequest(path, action) {
    http.get("http://" + config.apiUrl + path, function(res){
        res.setEncoding('utf8');
        res.on('data', function(data){
            action(data);
        });
    });
}

