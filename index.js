// require('dotenv').config();
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

const IchigoJamDecoder = require("./IchigoJamDecoder.js");

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
    console.log(req.body.events[0].message);
    // console.log(JSON.stringify(req.body.events[0].message.text));
    if (req.body.events[0].type === "message") {
        // 文字列化したメッセージデータ
        let receiveMessage = req.body.events[0].message.text;
        let userId = req.body.events[0].source.userId;
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

        console.log(options);

        if(receiveMessage == "userid"){
            options.messages[0].text = userId;
            dataString = JSON.stringify(options);
        }else {
            options.messages[0].text = "失敗";
            dataString = JSON.stringify(options);
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
            "body": dataString
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
