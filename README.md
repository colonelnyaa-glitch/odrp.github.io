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

## 管理画面

`admin.html` を開くと、公開ページを見ながら文章・リンク・画像を編集できます。

1. 管理画面内で内容を編集
2. 「更新HTMLを書き出す」をクリック
3. ダウンロードされた `index.html` をリポジトリの `index.html` と交換
4. GitHubで Commit changes

公開後の管理画面URL例:
`https://colonelnyaa-glitch.github.io/odrprule.github.io/admin.html`

注意: GitHub Pagesは静的サイトのため、管理画面からリポジトリへ直接保存する機能はありません。
