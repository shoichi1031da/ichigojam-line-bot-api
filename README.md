# ichigojam-line-bot

<img src="https://github.com/shoichi1031da/ichigojam-line-bot/blob/main/document/main.jpg" alt="メイン" title="main"> 

こどもパソコンIchigoJamに関する情報入手や、IoTを作成するのに便利なBotです。

### LINE API
https://ichigojam.top/line

### Bot basic ID : @813pjedr

### https://liff.line.me/1645278921-kWRPP32q/?accountId=813pjedr

<img src="https://github.com/shoichi1031da/ichigojam-line-bot/blob/main/document/qrcode.png" alt="QRコード" title="qrcode"> 


### ■デモ動画

https://twitter.com/shoichi1031da/status/1556036378802425856


## 【使い方】
MixJuiceを使うと、このBotを通じてあなたにLINEメッセージを送ることができます。

IoT制作などにお役立てください。

### 手順1） LINEのユーザーIDを取得する
BotからあなたのLINEにメッセージを送るには、あなたのユーザーIDが必要です。

下記のBotをフォローし、「userid」と送信すると、あなたのユーザーIDを返信します。

https://lin.ee/l3VTXzM

ユーザーIDは第3者に流失しないよう、厳重に保管してください。

### 手順2） IchigoJam（+MixJuice）のプログラム作成
サンプルコードの行番号10にあなたのIDを入力し、MixJuiceのGETコマンドを実行してください。

10 I="あなたのLINEのユーザーID"

20 M="あなたのLINEに送るメッセージ"

30 ?"MJ GETS ichigojam-line-bot.herokuapp.com/?id=";STR$(I);"&msg=";STR$(M)

https://github.com/shoichi1031da/ichigojam-line-bot-api/blob/main/ichigojam_sample-code.txt

＜IchigoJam Webでのテスト＞

https://fukuno.jig.jp/app/IchigoJam/#10%20I%3D%22%22%0A20%20M%3D%22IchigoJamweb%22%0A30%20%3F%22MJ%20GETS%20ichigojam.top/line%2F%3Fid%3D%22%3BSTR%24(I)%3B%22%26msg%3D%22%3BSTR%24(M)%0A

※「I/O」タブをクリックし、「MixJuice」にチェックを入れてプログラムを実行してください。


## ※その他

・開発者モードで使用するユーザーIDはこのLINE Bot内での使用に限ります（他の用途で使用することはありません）。

・開発者モードでIchigoJamからメッセージを送る場合、繰り返し処理で大量のメッセージを送ることはしないでください。

（誤って大量に送信してしまった場合を考慮して、1件メッセージを送り終わった際に約5秒間の待機時間を設けています。）

・Botのアイコン画像は「IchigoJam」が提供する画像を編集して作成しております。CC BY IchigoJam / https://ichigojam.net/

＜Bot内のリファレンス、サイト参照先リスト＞

https://fukuno.jig.jp/app/csv/ichigojam-cmd.html

https://github.com/ichigojam/doc/

https://ichigojam.github.io/print/ja/

https://ichigojam.net/

http://mixjuice.shizentai.jp/


・その他質問などはTwitterのDMからお願いします。

https://twitter.com/shoichi1031da
