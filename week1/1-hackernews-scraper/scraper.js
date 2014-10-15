var https = require('https');
var prevMaxArticle = null;

function getArticles(){
    https.get("https://hacker-news.firebaseio.com/v0/maxitem.json", function (res){

        res.on('data', function(data){
            var currentMaxArticle = Number(data.toString());
            console.log(currentMaxArticle, prevMaxArticle);
            if(prevMaxArticle){
                getNewArticles(prevMaxArticle, currentMaxArticle);
            }
            prevMaxArticle = currentMaxArticle;
        });
    });
}

function getNewArticles(prevMax, currentMax){
    console.log(prevMax, currentMax);
    if(prevMax === currentMax){
        return;
    }
    https.get("https://hacker-news.firebaseio.com/v0/item/" + prevMax + ".json", function(res){
        res.on('data', function(data){
            console.log(data.toString());
            getNewArticles(prevMax + 1, currentMax);
        });
    });
}

setInterval(getArticles, 5000);