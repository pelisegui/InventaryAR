const path = require('path');
const fs = require('fs');


function mainLogger (args) {
    let logFilePath = path.join(__dirname, './mainLogger.log');
    //console.log(htmlPath, ' does not exist', '\n');
    fs.writeFile(logFilePath, args, { encoding: "utf8", flag: "a+",  mode: 0o666 }, (err) => {
      if(err) { return console.trace (err) }
    });
  
}

module.exports = {mainLogger};