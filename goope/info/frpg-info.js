/*
<!-- =========================================================
  [JS] フリーページ化ロジック
  - 一覧：マーカー入り記事(.article)をDOMから削除（直後の .border も削除）
  - 詳細：マーカーがあるページだけ .frpg を付与し、見出しへタイトル転写
========================================================= -->
*/

(function(){
  try{
    // 多重実行ガード（同じコードが複数記事に入っていてもOK）
    if (window.__COPO_FRPG_INIT__) return;
    window.__COPO_FRPG_INIT__ = true;

    function addClass(el, cls){
      if (el && el.classList && !el.classList.contains(cls)) el.classList.add(cls);
    }

    // 末尾の / を削る（正規表現を使わない）
    function trimTrailingSlashes(path){
      var p = path || '';
      while (p.length > 1 && p.charAt(p.length - 1) === '/') p = p.slice(0, -1);
      return p;
    }

    // /.../info -> 一覧
    // /.../info/6595889 -> 詳細（最後が数字だけ）
    function isInfoDetailPath(){
      var p = trimTrailingSlashes(location.pathname || '');
      var seg = p.split('/').filter(Boolean);

      var idx = seg.lastIndexOf('info');
      if (idx === -1) return false;              // info がない
      if (idx === seg.length - 1) return false;  // .../info で終わる = 一覧

      var last = seg[seg.length - 1];
      var isNumberOnly = /^[0-9]+$/.test(last);
      return (idx === seg.length - 2 && isNumberOnly);
    }

    var isDetail = isInfoDetailPath();

    // CSS発火用クラス（html/body 両方）
    addClass(document.documentElement, isDetail ? 'frpg-detail' : 'frpg-list');
    addClass(document.body,            isDetail ? 'frpg-detail' : 'frpg-list');

    // 一覧：マーカー入り記事をDOM削除（borderも一緒に）
    function hideFrpgArticles(){
      if (isDetail) return;

      var markers = document.querySelectorAll('.frpg-marker');
      markers.forEach(function(m){
        var art = m.closest && m.closest('.article');
        if (!art) return;

        // 直後の区切り線も消す（<div class="border">）
        var next = art.nextElementSibling;
        if (next && next.classList && next.classList.contains('border')) next.remove();

        art.remove();
      });
    }

    // 詳細：マーカーがあるページだけ freepage として整形
    function applyFrpgDetailIfMarkerExists(){
      if (!isDetail) return;

      var marker = document.querySelector('.frpg-marker');
      if (!marker) return;

      // 「このページは frpg 対象」としてCSSを発火させる
      addClass(document.documentElement, 'frpg');
      addClass(document.body,            'frpg');

      // タイトル：data-title が空なら記事タイトルから拾う（加工しない）
      var t = (marker.getAttribute('data-title') || '').trim();
      if (!t){
        var at = document.querySelector('.article_title');
        t = (at && at.textContent ? at.textContent : '').trim();
        marker.setAttribute('data-title', t);
      }

      // 上部見出しへ転写（テンプレ側の .page_title を想定）
      var h2 = document.querySelector('.page_title');
      if (h2 && t) h2.textContent = t;
    }

    hideFrpgArticles();
    applyFrpgDetailIfMarkerExists();

    // autopagerize 等でDOMが増えても消す（一覧のみ）
    if (!isDetail && window.MutationObserver){
      var mo = new MutationObserver(function(){ hideFrpgArticles(); });
      mo.observe(document.body, { childList:true, subtree:true });
    }
  }catch(e){
    console.error('COPO_FRPG error:', e);
  }
})();


/*
<!-- =========================
  FRPG Marker (paste until here)
========================= -->

*/
