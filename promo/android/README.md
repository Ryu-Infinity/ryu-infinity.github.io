# High Light! Android版リリース告知アセット

「High Light!(ライブ参戦・セトリ記録アプリ)」Android版・近日リリースのSNS告知用素材一式です。
ブランドカラー: マゼンタ `#e91e8c` / Androidアクセント: `#3ddc84`

## 書き出し済みファイル

| ファイル | サイズ | 用途 |
|---|---|---|
| `highlight-android-square-1080.png` | 1080×1080（2倍書き出し=2160²） | Instagram / X フィード投稿 |
| `highlight-android-story-1080x1920.png` | 1080×1920（2倍書き出し） | Instagram / LINE ストーリー |
| `highlight-android-og-1200x630.png` | 1200×630（2倍書き出し） | X・Facebook のリンクカード / OGP |
| `highlight-android-reel-1080x1920.webm` | 1080×1920 / 15秒 / 30fps | Instagram リール・TikTok・YouTube ショート |

> リール動画は VP8/WebM で書き出しています（この環境の ffmpeg が H.264 非対応のため）。
> Instagram アプリから直接アップする場合は MP4/H.264 が推奨なので、必要に応じて
> `ffmpeg -i highlight-android-reel-1080x1920.webm -c:v libx264 -pix_fmt yuv420p -c:a aac out.mp4`
> で変換してください（WebM のまま X / YouTube / Facebook へは投稿できます）。

## 再生成方法

```bash
# 静止画3種
node render-posters.mjs
# リール動画（約90秒）
node render-reel.mjs
```

`poster.html` / `reel.html` がデザインのソース。テキストや数値を編集して再実行すれば差し替えできます。
（Playwright + バンドル ffmpeg を使用。フォントは日本語ゴシックの IPAGothic。）

## 投稿用キャプション案

### フィード / ストーリー
```
📣 High Light! Android版、近日リリース決定！

ライブのセトリ・会場・チケット代・写真を、まるごと記録。
「あの夜」を、一生モノのハイライトに残そう🎤

▶ Google Play で近日リリース
▶ iOS版は App Store で配信中

#HighLight #ライブ好きと繋がりたい #セトリ #参戦記録 #ライブ参戦 #Android
```

### リール / ショート
```
その夜の熱を、そのまま。
セトリも、チケットも、写真も。参戦の記録が、一生モノの資産に。

High Light! Android版、近日リリース🎉
#ライブ #フェス #セトリ #参戦記録 #Androidアプリ
```
