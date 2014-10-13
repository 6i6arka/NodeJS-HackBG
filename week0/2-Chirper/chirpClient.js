var http = require('http'),
    querystring = require('querystring'),
    ArgumentParser = require("argparse").ArgumentParser,
    parser = new ArgumentParser(),
    actions = {
        "getall": getAllChirps,
        "register": registerUser,
        "create": createChirp
    }, post_data, post_options, post_req;

parser.addArgument(["--getall"], {action: 'storeTrue'});
parser.addArgument(["--create"]);
var args = parser.parseArgs();

Object.keys(args).forEach(function(arg){
    if(args[arg]){
        actions[arg].call(null, args[arg]);
    }
});

function getAllChirps() {
    http.get("http://localhost:8080/all_chirps", function(res){
        res.setEncoding('utf8');
        res.on('data', function(data){
            console.log(data.toString());
        });
    });
}

function registerUser(){

}

function createChirp(chirp/*string*/) {
    post_options = {
        host: "localhost",
        port: "8080",
        path: "",
        method: "POST"
    };

    post_req = http.request(post_options, function(res){
        res.setEncoding('utf8');
        res.on('data', function(data){
            console.log(data);
        });
    });

    post_req.write(JSON.stringify({
        hello: "world"
    }));

    post_req.end();
}

//http.get("localhost:8080", function(res){
//    res.on('data', function(){
//
//    });
//});