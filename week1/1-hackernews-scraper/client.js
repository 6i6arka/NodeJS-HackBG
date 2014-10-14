var http = require('http'),
    ArgumentParser = require('argparse').ArgumentParser,
    parser = new ArgumentParser(),
    actions = {
        subscribe: subscribe
};

parser.addArgument(["--subscribe"], {action: "storeTrue"});
parser.addArgument(["--words"]);

var args = parser.parseArgs();

Object.keys(args).forEach(function(arg){
    if(args[arg] && actions[arg]){ actions[arg](); }
});

function subscribe(){

    var postData = {
        email : "node.js.mail.testing@gmail.com",
        words: args.words.split(',')
    };

    var postOptions = {
        hostname: "localhost",
        path: '/subscribe',
        port: 8080,
        method: "POST",
        headers: {
            'content-type': 'application/json'
        }
    };

    var subReq = http.request(postOptions, function(res){
        var payload = '';
        res.setEncoding('utf8');
        res.on('data', function(data){
            payload += data;
        });

        res.on('end', function(){
            console.log(payload);
        })
    });

    subReq.on('error', function(e){
        console.log('problem with request: ' + e.message);
    });

    console.log(postData);
    subReq.write(JSON.stringify(postData));

    subReq.end();
}


