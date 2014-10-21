var https = require('https'),
    fs = require('fs'),
    http = require('http'),
    prevMaxArticle = null,
    newArticles = [];



function getArticles(){

    fs.readFile('./new-articles.json', function(err, data){
        if (err) throw err;
        var maxItem = JSON.parse(data.toString())['max-item'];

        https.get("https://hacker-news.firebaseio.com/v0/maxitem.json", function (res){

            res.on('data', function(data){
                var currentMaxArticle = +data.toString();
                getNewArticles(prevMaxArticle, currentMaxArticle);
                console.log(prevMaxArticle, currentMaxArticle);
                prevMaxArticle = maxItem || currentMaxArticle;
            });
        });
    });
}

function getNewArticles(prevMax, currentMax){
    if(prevMax && prevMax <= currentMax){
        https.get("https://hacker-news.firebaseio.com/v0/item/" + prevMax + ".json", function(res){
            res.on('data', function(data){
                if (prevMax === currentMax) {
                    if (newArticles.length && newArticles[newArticles.length - 1]["id"] !== currentMax) {
                        newArticles.push(JSON.parse(data.toString()));
                        console.log(data.toString());
                    }
                } else {
                    newArticles.push(JSON.parse(data.toString()));
                    console.log(data.toString());
                }
            getNewArticles(prevMax + 1, currentMax);
            });
        });
    } else {
        fs.writeFile("./new-articles.json", JSON.stringify(newArticles, null, '\t'), function(err){
            if (err) throw err;
            var postOptions = {
                hostname: "localhost",
                path: '/new-articles',
                port: 8081,
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                }
            };
            console.log('waking notifier');
            var request = http.request(postOptions, function(res){
                console.log(res.toString());
            });
            request.end();
        });
    }
}
setInterval(getArticles, 5000);