const fs = require('fs');
const csv = require("csv");
const {parse} = require('csv-parse/sync');
const { send } = require('process');

const checkCommand = (data,msg) => {
  return new Promise((resolve, reject) => {
    let result = false;
    let sendMsg = [];
    
    for(const i in data){
        if(msg == data[i].command || msg.toUpperCase() == data[i].command){
            result = true;
            sendMsg = data[i];           
        }
    }
    
    if(sendMsg.command == "'"){
      sendMsg.example = "'" + sendMsg.example;
    }
    sendMsg.command = "■コマンド名：" + sendMsg.command + "\n";
    if(sendMsg.aname){
      sendMsg.jpname = "(読み方：" + sendMsg.jpname + "、";
      sendMsg.aname = "別名：" + sendMsg.aname + ")\n";
    }else{
      sendMsg.jpname = "(読み方：" + sendMsg.jpname + ")\n";
      sendMsg.aname = "";
    }
    sendMsg.format = "■書式：" + sendMsg.format + "\n"; 
    sendMsg.example = "■例　：" + sendMsg.example + "\n"; 
    sendMsg.description = "■説明：" + sendMsg.description + "\n"; 
    sendMsg.document = "■資料：" + sendMsg.document; 
   
    const sendData = {"result":result,"commandInfo":sendMsg};
    
  resolve(sendData);
  })
}

const main = (MSG) => {
  return new Promise((resolve, reject) => {

    fs.createReadStream(__dirname + '/ichigojam_reference.csv')
    .pipe(csv.parse({columns: true}, (err, data) => {
      checkCommand(data,MSG)
      .then((sendData)=>{
        resolve(sendData);
      });
    }));
    
  })

}


module.exports = main;

