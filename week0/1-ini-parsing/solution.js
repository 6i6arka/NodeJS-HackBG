var fs = require('fs'),
    http = require('https'),
    filename = process.argv[2],
    newObj = {};

function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
}

function createJson(fileName, obj){
    fs.writeFile(fileName.split('.')[0] + '.json', JSON.stringify(obj, null, '   '), function (err) {
        if (err) { console.log(err); }
        else { console.log('Success'); }
    });
}

function getFileName(fileName){
    var splitFileName = fileName.split('.');
    return splitFileName[splitFileName.length-1];
}

function toIniString(json){
    var str = '';
    Object.keys(json).forEach(function(key){
        str += '[' + key + ']\n';
        Object.keys(json[key]).forEach(function(subKey){
            str += subKey + '=' + json[key][subKey] + '\n';
        });
        str += '\n';
    });
    return str;
}

function createIni(fileName, iniString){
    fs.writeFile(fileName, iniString, function (err){
        if (err) { console.log(err); }
        else { console.log('Success'); }
    });
}

function toObject(string){
    var obj = {},
        mainProp = '',
        lines = string.split('\n');

    lines.forEach(function (line) {
        if (!line[0] || line[0] === ';') { return false; }
        else if (line[0] === '[') {
            mainProp = line.replace(/[\])}[{(]/g, '');
            obj[mainProp] = {};
        } else {
            var temp = line.replace(/\s+/g,'').split('=');
            obj[mainProp][temp[0]] = temp[1];
        }
    });
    return obj;
}


if (!isUrl(filename)) {
    fs.readFile(filename, 'utf8', function (err, data) {
            if (err) {
                console.log(err)
            } else {
                if(getFileName(filename) === 'ini'){
                    createJson(filename, toObject(data.toString()));
                } else {
                    createIni(filename.split('.')[0] + '.ini', toIniString(JSON.parse(data.toString())));
                }
            }
        }
    );
} else {
    http.get(filename, function(response){
        response.on('data', function(data){
            var splitUrl = process.argv[2].split('/'),
                fileName = splitUrl[splitUrl.length-1];
            createJson(fileName, toObject(data.toString()));
        });
    });
}


