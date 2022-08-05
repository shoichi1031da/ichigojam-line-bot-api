# ichigojam-line-bot

<img src="https://github.com/shoichi1031da/ichigojam-line-bot/blob/main/document/main.png" alt="メイン" title="main"> 

こどもパソコンIchigoJamに関する情報入手や、IoTを作成するのに便利なBotです。

### Bot basic ID : @813pjedr
https://liff.line.me/1645278921-kWRPP32q/?accountId=813pjedr
<img src="https://github.com/shoichi1031da/ichigojam-line-bot/blob/main/document/qrcode.png" alt="QRコード" title="qrcode"> 

このアカウントは【ユーザーモード】と【開発者モード】の2つの使い方があります。

## 【ユーザーモード】
IchigoJam BASICのコマンドや特定の言葉（隠しコマンド）を送信すると自動で返答します。
### ■例1：「リファレンス」または「コマンド一覧」
→ https://fukuno.jig.jp/app/csv/ichigojam-cmd.html を返します。
###　■例2：「WAIT」または「wait」
→ WAITコマンドの意味を返します（WAIT以外の全てコマンドにも対応）。
### ■例3：隠しコマンド（下記隠しコマンドを送信してみてください）
「jig.jp2022」「LED1」「LED0」「かわくだりゲーム」「IchigoJam」「IchigoJamweb」「MixJuice」

## 【開発者モード】
MixJuiceを使うと、このBotを通じてあなたにLINEメッセージを送ることができます。

IoT制作などにお役立てください。

### 手順1 LINEのユーザーIDを取得する
BotからあなたのLINEにメッセージを送るには、あなたのユーザーIDが必要です。

Botに「userid」と送信すると、あなたのユーザーIDを返信します。

ユーザーIDは第3者に流失しないよう、厳重に保管してください。

### 手順2 IchigoJam（+MixJuice）のプログラム作成
サンプルコードの行番号10にあなたのIDを入力し、MixJuiceのGETコマンドを実行してください。
https://fukuno.jig.jp/app/IchigoJam/#10%20I%3D%22%22%0A20%20M%3D%22IchigoJamweb%22%0A30%20%3F%22MJ%20GETS%20ichigojam-line-bot.herokuapp.com%2F%3Fid%3D%22%3BSTR%24(I)%3B%22%26msg%3D%22%3BSTR%24(M)%0A

※IchigoJamwebの場合は、「I/O」タブをクリックし、「MixJuice」にチェックを入れてプログラムを実行してください。


## その他

・開発者モードで使用するユーザーIDはこのLINE Bot内での使用に限ります（他の用途で使用することはありません）。

・Botのアイコン画像は「IchigoJam」が提供する画像を編集して作成しております。

・Bot内のリファレンス参照先
https://fukuno.jig.jp/app/csv/ichigojam-cmd.html

https://github.com/ichigojam/doc/

・その他質問などはTwitterのDMからお願いします。

https://twitter.com/shoichi1031da
