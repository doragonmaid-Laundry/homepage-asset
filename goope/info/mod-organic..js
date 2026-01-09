/* ==========================================================================
  【お知らせ(info)】を“フリーページ化”する共通セット（統合版）
  - 日付を消す
  - 記事タイトル(h4)を消して、上の大見出し(h2)へ転写する（JS）
  - 本文の table/CSS は .textfield 起点で安定させる
  - 余白はスリム化（summary:1em / textfield:0 / photo mb:0）
========================================================================== */

/* 管理画面の「タイトル」(h4) → ページ上部の大見出し(h2)へ転写 */
document.addEventListener('DOMContentLoaded', () => {
  const h4 = document.querySelector('#main .contents_box_inner a h4');
  const h2 = document.querySelector('#main .contents_box > h2');
  if (!h4 || !h2) return;

  const t = (h4.textContent || '').trim();
  if (t) h2.textContent = t;
});
