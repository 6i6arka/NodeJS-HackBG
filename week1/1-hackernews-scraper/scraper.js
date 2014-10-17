var https = require('https'),
    fs = require('fs'),
    prevMaxArticle = null;



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
    var newArticles = [];
    if(prevMax && prevMax <= currentMax){
        https.get("https://hacker-news.firebaseio.com/v0/item/" + prevMax + ".json", function(res){
            res.on('data', function(data){
                if (newArticles.indexOf(JSON.parse(data.toString())) > -1) {
                    newArticles.push(JSON.parse(data.toString()));
                    console.log(data.toString());
                }
                getNewArticles(prevMax + 1, currentMax);
            });
        });
    }
}

setInterval(getArticles, 20000);