# ODRP Support Plans

スクリーンショットの支援プラン情報を整理した、GitHub Pages向けの静的サイトです。

## ファイル

- `index.html` — ページ本文とメタ情報
- `style.css` — レスポンシブデザイン
- `script.js` — メニュー、プラン絞り込み、表示アニメーション
- `assets/og.png` — SNS共有用画像

## 公開前の設定

`index.html` 内の「Discordで問い合わせる」の `href="#"` を、利用するDiscord招待URLに変更してください。

## GitHub Pagesで公開

1. `support-plans` フォルダ内のファイルを、公開用GitHubリポジトリのルートへ追加します。
2. GitHubの `Settings` → `Pages` を開きます。
3. `Deploy from a branch` を選び、公開ブランチ（通常は `main`）と `/ (root)` を指定します。
4. 保存後、表示された公開URLへアクセスします。

ビルド処理や外部ライブラリは不要です。
