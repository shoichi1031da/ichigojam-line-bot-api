const fs = require('fs');
const csv = require("csv");
const {parse} = require('csv-parse/sync');
let sendData = {};
let result = false;
let sendMsg = [];
let count = 0;

const main = (MSG) => {
  let msg = MSG;
  console.log(msg);
  fs.createReadStream(__dirname + '/ichigojam_reference.csv')
  .pipe(csv.parse({columns: true},(err, data) => {
    let sendData = checkCommand(data,msg);
    
    console.log("checkCommand(data,msg)",sendData);
  }));
  console.log("sendData",sendData);
  return sendData;
}

const checkCommand = (data,msg) => {
  
    for(const i in data){
      // console.log(data[i].command);
        if(msg == data[i].command){
            result = true;
            sendMsg = data[i];           
        }
    }
    return {"result":result, "sendMsg":sendMsg};
}

module.exports = main;

