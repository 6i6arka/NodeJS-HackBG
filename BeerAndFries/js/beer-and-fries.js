function beerAndFries (items) {

    var compare = function(a, b){
            return a.score > b.score ?  1 : a.score < b.score ? -1 : 0
        },
        beers = items.filter(function(item){
            return item.type === 'beer';
        }).sort(compare),
        fries = items.filter(function(item){
            return item.type === 'fries';
        }).sort(compare),
        maxScore = 0;

    for (var j = 0; j < beers.length; j++){
        maxScore += beers[j].score*fries[j].score;
    }
    return maxScore;
}