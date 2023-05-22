# Foolish Seasons Bot
## コマンド紹介
### /setnick
ニックネームを設定するコマンドです。Botの権限よりも高い権限を持っている人(ロールの地位がBotより高い人)の名前は変更できませんが、`/setnick [<user>]`でユーザーの名前を変更することができます。.envで指定した管理者のみ使用することができます。

### /echo
好きなチャンネルにメッセージを送信するコマンドです。サーバー全体のお知らせなどを行いたい場合に活用できます。誰が送信したかは表示されません。.envで指定した管理者のみ使用することができます。`/echo [<message>] [<channel>]`で送信できます。

### /mute
ユーザーをミュートするためのコマンドです。ミュートロールがない場合、自動で作成されます。.envで指定した管理者のみ使用可能です。`/mute [<user>]`でミュート可能です。

### /unmute
ユーザーのミュートを解除するためのコマンドです。.envで指定した管理者のみ使用可能です。`/unmute [<user>]`でミュートを解除することができます。

### /omikuji
おみくじを引くことができます。一日に何回引けるという制限は設けていません。`/omikuji`で実行可能で、一般ユーザーも利用できます。
