const fs = require('fs');
const csv = require("csv");
const {parse} = require('csv-parse/sync');
let sendData = {};
let result = false;
let sendMsg = [];
let count = 0;

const checkCommand = (data,msg) => {
  return new Promise((resolve, reject) => {
    
    for(const i in data){
      // console.log(data[i].command);
        if(msg == data[i].command || msg.toUpperCase() == data[i].command){
            result = true;
            sendMsg = data[i];           
        }
    }
    // console.log(sendMsg);
      sendMsg.command =  "■コマンド名：" + sendMsg.command + "\n";
      sendMsg.aname =  "(別名：" + sendMsg.aname + ")\n";
      sendMsg.jpname =  "■読み方：" + sendMsg.jpname + "\n";
      sendMsg.format =  "■書式：" + sendMsg.format + "\n"; 
      sendMsg.example =  "■例：" + sendMsg.example + "\n"; 
      sendMsg.description =  "■説明：" + sendMsg.description; 
    
    // return {"result":result, "sendMsg":sendMsg};

  resolve({"result":result,"commandInfo":sendMsg});

  })
}

const main = (MSG) => {
  return new Promise((resolve, reject) => {

    let msg = MSG;
    // console.log(msg);
    fs.createReadStream(__dirname + '/ichigojam_reference.csv')
    .pipe(csv.parse({columns: true}, (err, data) => {
      checkCommand(data,msg)
      .then((res)=>{
        // console.log("sendData",res);
        resolve(res);
      });
    }));
    // return sendData;
  })

}


module.exports = main;

