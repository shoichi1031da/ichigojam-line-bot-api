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

app.use(express.static('public'));

const IchigoJamDecoder = require("./public/IchigoJamDecoder.js");
const callReference = require("./public/reference.js");

app.get("/", (req,res) => {

    const userId = req.query.id;
    let msg = req.query.msg;
    if(!msg) msg = "msgが未記入です";
    
    let msgCharaCode = [];
    for(let i = 0; i < msg.length; i++){
        msgCharaCode.push(msg.charCodeAt(i));
    }

    const sendMsg = IchigoJamDecoder(msgCharaCode);
    
    const message = {
        type: "text",
        text: sendMsg
    }
    console.log("sendMsg:",sendMsg);

    client.pushMessage(userId,message)
    .then(() => {
        console.log("プッシュメッセージを送信しました");
        console.log(sendMsg);
    })
    .catch((err) => {
        console.log(err);
        res.send("'wrong userID...\n");
    })
    setTimeout(()=>{res.send("")},5000);
});

app.post("/webhook", (req,res) => {
    res.send("HTTP POST request sent to the webhook URL!");
    // ユーザーがボットにメッセージを送った場合、返信メッセージを送る
    if (req.body.events[0].type === "message") {
        
        let recMsg = req.body.events[0].message.text;
            console.log("recMsg",recMsg);
        let userId = req.body.events[0].source.userId;

        //送られたメッセージをIchigoJamのリファレンス参照
        callReference(recMsg)
        .then((ref)=>{
            // LEDコマンドの処理
            let ledParam = 0;
            let led = false;
            if(recMsg.substr(0,3) == "LED" || recMsg.substr(0,3) == "led"){
                led = true;
                ledParam = parseInt(recMsg.split(recMsg.substr(0,3))[1]);
            }
            // LINEに送るデータ管理
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
    
            // リクエストヘッダー
            const headers = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN
    
            }
            
            //リファレンス（reference.js）から返ってきた結果を配列に格納（後日修正予定）
            const checkCommand = (reference) => {
                return new Promise((resolve,reject) => {
                    let referenceObject = [];
                    if(reference.result){
                        referenceObject = Object.values(reference.commandInfo).slice(1);
                        console.log("referenceObject",referenceObject);
                    }
                    resolve(referenceObject);
                })
            }

            let reference = ref;
            

            checkCommand(reference)
            .then((response) => {
                //送られてきたメッセージがリファレンスのコマンドと合致した時
                if(ref.result){
                    let text = "";
                    for(const i in response){
                        text += response[i];
                    }
                    options.messages[0].text = text;
                }else if(recMsg == "userid"){
                    options.messages[0].text = userId;
                }else if(recMsg == "jig.jp2022"){
                    options.messages[0].text = "新社屋おめでとう🎉\nhttps://fukuno.jig.jp/3648";
                }else if(recMsg == "隠しコマンド"){
                    options.messages[0].text = "jig.jp2022\nリファレンス\nLED1\nLED0\nかわくだりゲーム\nIchigoJam\nIchigoJamweb\nMixJuice";
                }else if(recMsg == "IchigoJam" || recMsg == "ichigojam" || recMsg == "イチゴジャム" || recMsg == "いちごじゃむ" || recMsg == "いちごジャム"){
                    options.messages[0].text = "https://ichigojam.net/";
                }else if(recMsg == "IchigoJamweb" || recMsg == "ichigojamweb" || recMsg == "IchigoJamWeb" || recMsg == "ichigojamWeb" || recMsg == "IchigoJam web" || recMsg == "IchigoJam Web"){
                    options.messages[0].text = "https://fukuno.jig.jp/app/IchigoJam/";
                }else if(recMsg == "MixJuice" || recMsg == "mixjuice" || recMsg == "ミックスジュース" || recMsg == "みっくすじゅーす" || recMsg == "みっくすジュース"){
                    options.messages[0].text = "http://mixjuice.shizentai.jp/";
                }else if(recMsg == "川下りゲーム" || recMsg == "川下り" || recMsg == "かわくだりゲーム" || recMsg == "かわくだり"){
                    options.messages[0].text = '10 CLS:\n20 LC X,5:?"0"\n30 LC RND(32),23:?"*"\n35 WAIT 3\n36 X=X-BTN(28)+BTN(29)\n40 IF SCR(X,5)=0 GOTO20';
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
            
                console.log("dataString",dataString);
                
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
            })
        })
    }
})

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
