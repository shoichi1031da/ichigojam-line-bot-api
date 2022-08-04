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
  .pipe(csv.parse({columns: true},async (err, data) => {
    let sendData = await checkCommand(data,msg);
    
    console.log("**");
  }));
  console.log("sendData",sendData);
  return sendData;
}

const checkCommand = (data,msg) => {
  return new Promise((resolve,reject) => {
    
    for(const i in data){
      // console.log(data[i].command);
        if(msg == data[i].command){
            result = true;
            sendMsg = data[i];           
        }
    }
    resolve({"result":result, "sendMsg":sendMsg});
  })
}

module.exports = main;

