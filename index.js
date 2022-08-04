require('dotenv').config();
const line = require("@line/bot-sdk");
const client = new line.Client({
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
})

const https = require("https");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.LINE_ACCESS_TOKEN;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const cors = require("cors");
app.use(cors({
    origin: "https://fukuno.jig.jp",
}));

app.use(express.static('public'));

const IchigoJamDecoder = require("./public/IchigoJamDecoder.js");
const parseCsv = require("./public/reference.js");

app.get("/", (req,res) => {

    let userId = req.query.id;
    let msg = req.query.msg;
    if(!msg) msg = "msgが未記入です";

    let msgCharaCode = [];
    for(let i = 0; i < msg.length; i++){
        msgCharaCode.push(msg.charCodeAt(i));
    }

    let sendMsg = IchigoJamDecoder(msgCharaCode);

    const message = {
        type: "text",
        text: sendMsg
    }

    client.pushMessage(userId,message)
        .then(() => {
            console.log("プッシュメッセージを送信しました");
            console.log(sendMsg);
        })
        .catch((err) => {
            res.send("'wrong userID...\n");
        })
    res.send("");

});

app.post("/webhook", (req,res) => {
    res.send("HTTP POST request sent to the webhook URL!");
    // ユーザーがボットにメッセージを送った場合、返信メッセージを送る
    // console.log(req.body.events[0].message);
    // console.log(JSON.stringify(req.body.events[0].message.text));
    if (req.body.events[0].type === "message") {
        // 文字列化したメッセージデータ
        let recMsg = req.body.events[0].message.text;
        let userId = req.body.events[0].source.userId;
        let ledParam = 0;
        let led = false;
        if(recMsg.substr(0,3) == "LED" || recMsg.substr(0,3) == "led"){
            led = true;
            ledParam = parseInt(recMsg.split(recMsg.substr(0,3))[1]);
        }
        let dataString = "";
        let options = {};
        let replyToken = req.body.events[0].replyToken;
        let messages = [
            {
                "type":"text",
            }
        ]
       
        options.replyToken = replyToken;
        options.messages = messages;    


        const getReference = () => {
            return new Promise((resolve,reject) => {
                let reference = parseCsv(recMsg);
                console.log("***");
                console.log("reference",reference);
                resolve(reference);
            })
        }

        const sendMsgFnc = async () => {
            console.log("*");
            let reference = await getReference();
            console.log("****");
            if(recMsg == "userid"){
                options.messages[0].text = userId;
            }else if(reference.result){
                referenceObject = Object.values(reference);
                console.log("referenceObject",referenceObject);
                for(const command of referenceObject){
                    options.messages[0].text = command + "\n";
                }
            }else if(recMsg == "リファレンス" || recMsg == "コマンド一覧" || recMsg == "コマンド"){
                options.messages[0].text = "https://fukuno.jig.jp/app/csv/ichigojam-cmd.html";
            }else if(led){
                if(ledParam == 0){
                    options.messages[0].text = "⚫️";
                }else if(ledParam < 0 || ledParam > 0){
                    options.messages[0].text = "🔴";
                }else{
                    options.messages[0].text = "Syntax error";
                }
                
            }else{
                options.messages[0].text = "Syntax error";
            }
            
            dataString = JSON.stringify(options);
            return dataString;
        }


        // リクエストヘッダー
        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + TOKEN

        }

        // リクエストに渡すオプション
        const webhookOptions = {
            "hostname": "api.line.me",
            "path": "/v2/bot/message/reply",
            "method": "POST",
            "headers": headers,
            "body": sendMsgFnc()
        }   

        // リクエストの定義
        const request = https.request(webhookOptions, (res) => {
            res.on("data", (d) => {
            process.stdout.write(d)
            })
        })
    
        // エラーをハンドル
        request.on("error", (err) => {
            console.error(err)
        })
    
        // データを送信
        request.write(dataString)
        request.end()
    }
})

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
