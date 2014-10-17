var fs = require('fs'),
    http = require('https'),
    ArgumentParser = require("argparse").ArgumentParser,
    parser = new ArgumentParser(),
    args,
    actions = {
        "ini": toObjectString,
        "json": toIniString
    };

(function () {
    parser.addArgument(["fileName"]);
    parser.addArgument(["-t", "--type"]);
    args = parser.parseArgs();

    console.log(args);
    convert(args);
})();

function convert(options){
    if (!isUrl(options.fileName)) {

        fs.readFile(options.fileName + '.' + options.type, 'utf8', function (err, data) {

            if (err) { console.log(err) } else {
                try{
                    createFile(options.fileName, options.type === 'ini' ? 'json' : 'ini', actions[options.type](data.toString()));
                } catch(e){
                    throw new Error("Unsupported file format!");
                }
            }
        });
    } else {
        http.get(options.fileName, function(response){
            response.on('data', function(data){
                var splitUrl = options.fileName.split('/');
                try{
                    createFile(options.fileName, options.type === 'ini' ? 'json' : 'ini', actions[options.type](data.toString()));
                } catch(e){
                    throw new Error("Unsupported file format!");
                }
            });
        });
    }
}

function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
}

function toIniString(jsonString){
    var str = '',
        json = JSON.parse(jsonString);
    Object.keys(json).forEach(function(key){
        str += '[' + key + ']\n';
        Object.keys(json[key]).forEach(function(subKey){
            str += subKey + '=' + json[key][subKey] + '\n';
        });
        str += '\n';
    });
    return str;
}

function createFile(fileName, type, string){
    fs.writeFile(fileName + '.' + type, string, function (err){
        if (err) { throw err; }
        else { console.log('Success'); }
    });
}

function toObjectString(iniString){
    var obj = {},
        mainProp = '',
        lines = iniString.split('\n');

    lines.forEach(function (line) {
        if (!line[0] || line[0] === ';') { return false; }
        else if (line[0] === '[') {
            mainProp = line.replace(/[\])}[{(]/g, '').trim();
            obj[mainProp] = {};
        } else {
            var temp = line.trim().split('=');
            obj[mainProp][temp[0]] = temp[1];
        }
    });
    return JSON.stringify(obj, null, "\t");
}

