var express = require('express'),
    app = express(),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    rand = require('generate-key'),
    storage = require('node-persist');

app.set('port', process.env.PORT || 8080);

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));

app.post("/subscribe", function(req, res){

    var subDetails = req.body;

    console.log(req.body);

    subDetails.key = rand.generateKey(8);

    fs.readFile("./subscribers.json", function(err, data){
        if (err) throw err;
        var subs = JSON.parse(data.toString());
        subs.push(subDetails);
        fs.writeFile("./subscribers.json", JSON.stringify(subs, null, '\t'), function(err){
            if (err) throw err;
            console.log("Save successful");
        });
    });

    res.json({
        "email": subDetails.email,
        "subscriberId": subDetails.key
    });
});

app.post("/unsubscribe", function () {

});

app.get('/listSubscribers', function() {

});

var server = app.listen(8080, function() {
    console.log("Listening on port %d", server.address().port)
});