var http = require('http'),
    ArgumentParser = require('argparse').ArgumentParser,
    parser = new ArgumentParser(),
    actions = {
        subscribe: subscribe,
        unsubscribe: unsubscribe
};

parser.addArgument(["--subscribe"], {action: "storeTrue"});
parser.addArgument(["--words"]);
parser.addArgument(["--unsubscribe"], {action: "storeTrue"});
parser.addArgument(["--subId"]);

var args = parser.parseArgs();

Object.keys(args).forEach(function(arg){
    if(args[arg] && actions[arg]){ actions[arg](); }
});

function request(opt){

    var postOptions = {
        hostname: "localhost",
        path: opt.path,
        port: 8080,
        method: "POST",
        headers: {
            'content-type': 'application/json'
        }
    };

    var req = http.request(postOptions, function(res){
        var payload = '';
        res.setEncoding('utf8');
        res.on('data', function(data) {
            payload += data;
        });

        res.on('end', function(){
            opt.action(payload);
        });
    });

    req.on('error', function(e){
        console.log('problem with request: ' + e.message);
    });

    req.write(JSON.stringify(opt.postData));

    req.end();
}

function unsubscribe() {

    request({
        path: "/unsubscribe",
        postData: {
            subscriberId: args.subId
        },
        action: function(data){
            console.log(data);
        }
    });
}

function subscribe(){

    request({
        path: "/subscribe",
        postData:{
            email : "nodejs.testing.rado@gmail.com",
            words: args.words.split(',')
        },
        action: function (data){
            console.log(data);
        }
    });
}


