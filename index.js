require('dotenv').config();
const line = require("@line/bot-sdk");
const client = new line.Client({
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
})

const https = require("https");
const express = require("express");
const app = express();

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

app.get("/", (req,res) => {
    let userId = req.query.id;
    let msg = req.query.msg;

    const message = {
        type: "text",
        text: msg
    }

    client.pushMessage(userId,message)
        .then(() => {
            console.log("プッシュメッセージを送信しました");
        })
        .catch((err) => {
            console.log(err);
        })

});

app.post("/webhook", (req,res) => {
    res.send("HTTP POST request sent to the webhook URL!");
    // ユーザーがボットにメッセージを送った場合、返信メッセージを送る
    console.log(req.body.events[0]);
    if (req.body.events[0].type === "message") {
        // 文字列化したメッセージデータ
        let receiveMessage = req.body.events[0].message.text;
        let userId = req.body.events[0].source.userId;
        
        if(recieveMessage === "userid"){
            const dataString = JSON.stringify({
                replyToken: req.body.events[0].replyToken,
                messages: [
                {
                    "type": "text",
                    "text": userId
                }
                ]
            })
        }else {
            const dataString = JSON.stringify({
                replyToken: req.body.events[0].replyToken,
                messages: [
                    {
                    "type": "text",
                    "text": receiveMessage
                    }
                ]
            })
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

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
