(() => {
  'use strict';

  const iframe = document.getElementById('site-preview');
  const shell = document.getElementById('preview-shell');
  const status = document.getElementById('status');
  const selectionEmpty = document.getElementById('selection-empty');
  const linkEditor = document.getElementById('link-editor');
  const imageEditor = document.getElementById('image-editor');
  let selectedElement = null;
  let originalHtml = '';

  const setStatus = (message, isError = false) => {
    status.textContent = message;
    status.style.color = isError ? '#ffb35c' : '#2ee6c0';
  };

  function getDoc() {
    return iframe.contentDocument || iframe.contentWindow.document;
  }

  function cleanDocument(doc) {
    const clone = doc.documentElement.cloneNode(true);
    clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
    clone.querySelectorAll('[data-admin-selected]').forEach(el => el.removeAttribute('data-admin-selected'));
    clone.querySelectorAll('style[data-admin-style]').forEach(el => el.remove());
    return '<!doctype html>\n' + clone.outerHTML;
  }

  function enableEditing() {
    const doc = getDoc();
    originalHtml = '<!doctype html>\n' + doc.documentElement.outerHTML;

    const editStyle = doc.createElement('style');
    editStyle.dataset.adminStyle = 'true';
    editStyle.textContent = `
      [contenteditable="true"]:hover{outline:2px dashed #2ee6c0!important;outline-offset:3px;cursor:text!important}
      [data-admin-selected="true"]{outline:3px solid #ffb35c!important;outline-offset:3px!important}
      a,img{cursor:pointer!important}
    `;
    doc.head.appendChild(editStyle);

    const blocked = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH']);
    doc.body.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,td,th,dt,dd,small,b,strong,em,span').forEach(el => {
      if (!blocked.has(el.tagName) && !el.closest('a,button')) el.contentEditable = 'true';
    });

    doc.addEventListener('click', event => {
      const target = event.target;
      const link = target.closest && target.closest('a');
      const image = target.closest && target.closest('img');
      if (link || image) {
        event.preventDefault();
        event.stopPropagation();
        selectElement(link || image);
      }
    }, true);

    doc.addEventListener('submit', event => event.preventDefault(), true);
    setStatus('編集できます。文字をクリックしてください。');
  }

  function selectElement(element) {
    const doc = getDoc();
    doc.querySelectorAll('[data-admin-selected]').forEach(el => el.removeAttribute('data-admin-selected'));
    selectedElement = element;
    selectedElement.dataset.adminSelected = 'true';
    selectionEmpty.hidden = true;

    if (element.tagName === 'A') {
      linkEditor.hidden = false;
      imageEditor.hidden = true;
      document.getElementById('link-url').value = element.getAttribute('href') || '';
      document.getElementById('link-text').value = element.textContent.trim();
      document.getElementById('link-new-tab').checked = element.getAttribute('target') === '_blank';
    } else {
      linkEditor.hidden = true;
      imageEditor.hidden = false;
      document.getElementById('image-src').value = element.getAttribute('src') || '';
      document.getElementById('image-alt').value = element.getAttribute('alt') || '';
    }
  }

  document.getElementById('apply-link').addEventListener('click', () => {
    if (!selectedElement || selectedElement.tagName !== 'A') return;
    selectedElement.setAttribute('href', document.getElementById('link-url').value.trim() || '#');
    selectedElement.textContent = document.getElementById('link-text').value;
    if (document.getElementById('link-new-tab').checked) {
      selectedElement.setAttribute('target', '_blank');
      selectedElement.setAttribute('rel', 'noopener noreferrer');
    } else {
      selectedElement.removeAttribute('target');
      selectedElement.removeAttribute('rel');
    }
    setStatus('リンクを反映しました。');
  });

  document.getElementById('apply-image').addEventListener('click', () => {
    if (!selectedElement || selectedElement.tagName !== 'IMG') return;
    selectedElement.setAttribute('src', document.getElementById('image-src').value.trim());
    selectedElement.setAttribute('alt', document.getElementById('image-alt').value);
    setStatus('画像を反映しました。');
  });

  document.getElementById('desktop-view').addEventListener('click', () => changeViewport('desktop'));
  document.getElementById('mobile-view').addEventListener('click', () => changeViewport('mobile'));

  function changeViewport(mode) {
    shell.className = `preview-shell ${mode}`;
    document.getElementById('desktop-view').classList.toggle('active', mode === 'desktop');
    document.getElementById('mobile-view').classList.toggle('active', mode === 'mobile');
    document.getElementById('viewport-label').textContent = mode === 'desktop' ? 'PC表示' : 'スマホ表示（390px）';
  }

  document.getElementById('save-draft').addEventListener('click', () => {
    try {
      localStorage.setItem('odrp-admin-draft', cleanDocument(getDoc()));
      setStatus('下書きをこの端末に保存しました。');
    } catch (error) {
      setStatus('下書きを保存できませんでした。', true);
    }
  });

  document.getElementById('restore-draft').addEventListener('click', () => {
    const draft = localStorage.getItem('odrp-admin-draft');
    if (!draft) return setStatus('保存済みの下書きがありません。', true);
    iframe.srcdoc = draft;
    iframe.onload = enableEditing;
    setStatus('下書きを復元しました。');
  });

  document.getElementById('reset-preview').addEventListener('click', () => {
    iframe.removeAttribute('srcdoc');
    iframe.src = `index.html?reload=${Date.now()}`;
    iframe.onload = enableEditing;
    setStatus('元のindex.htmlを読み直しました。');
  });

  document.getElementById('export-html').addEventListener('click', () => {
    try {
      const html = cleanDocument(getDoc());
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'index.html';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setStatus('更新済みindex.htmlを書き出しました。');
    } catch (error) {
      setStatus('HTMLを書き出せませんでした。', true);
    }
  });

  iframe.addEventListener('load', enableEditing, { once: true });
})();
