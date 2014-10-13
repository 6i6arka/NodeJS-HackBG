var http = require('http'),
    querystring = require('querystring'),
    ArgumentParser = require("argparse").ArgumentParser,
    parser = new ArgumentParser(),
    actions = {
        "getall": getAllChirps,
        "register": registerUser,
        "create": createChirp
    }, post_options, post_req;

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

function postRequest(opt){
    var post_options = {
        host: "localhost",
        port: "8080",
        path: opt.path,
        method: "POST"
    };

    var post_req = http.request(post_options, function(res){
        res.setEncoding('utf8');
        res.on('data', function(data){
            console.log(data);
        });
    });

    post_req.write(JSON.stringify(opt.postData));

    post_req.end();
}

function createChirp(chirp/*string*/) {
    postRequest({
        path: "/chirp",
        postData: {
            chirp: chirp,
            user: currentUser
        }
    });
}