var express = require('express'),
    app = express(),
    fs = require('fs'),
    nodemailer = require('nodemailer'),
    bodyParser = require('body-parser'),
    transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'nodejs.testing.rado@gmail.com',
            pass: '1@3A5678'
        }
    });

app.set('port', process.env.PORT || 8081);

app.use(bodyParser.json());

app.post('/new-articles', function(req, res){
     fs.readFile("./subscribers.json", {encoding: 'utf8'}, function(err, data){
        var subscriptions = JSON.parse(data);
        console.log("Subscriptions read");
        fs.readFile("./new-articles.json", {encoding: 'utf8'}, function(err, data){
            var articles = JSON.parse(data);
            subscriptions.forEach(function(sub){
                var relevant = [],
                    words = sub.words;
                articles.forEach(function(article){
                    if(isRelevant(article, words)) {
                        relevant.push(article);
                    }
                    return isRelevant(article, words) ? relevant.push(article) : false;
                });
                console.log(relevant);
            });
        });
         res.json();
     });
});

var server = app.listen(8081, function() {
    console.log("Listening on port %d", server.address().port);
});

function isRelevant(article, words){
    words.forEach(function(word){
        return article.title.split(' ').indexOf(word) > -1;
    });
}