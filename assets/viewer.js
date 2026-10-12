/* In-page viewer for evidence images and PDF page images.
   Links carry data-viewer, data-pages ("img|w|h|label;;..."), data-start, data-title, data-download.
   Without JS the link simply opens the file. Keys: Esc closes, Left/Right change page, + / - zoom, 0 fits.
   Touch: drag to pan, pinch to zoom, double-tap to zoom in/out. Focus stays inside while open. */
(function () {
  "use strict";
  var dlg, stage, img, counter, label, titleEl, dl, prevB, nextB, opener, pages = [], idx = 0;
  var s = 1, tx = 0, ty = 0, pts = {}, pinch0 = null, lastTap = 0;
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }
  function icon(d) { return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
  function btn(cls, text, d) { var b = el("button", "vw-btn " + cls); b.type = "button"; b.innerHTML = icon(d) + '<span class="vw-txt">' + text + "</span>"; return b; }
  function build() {
    dlg = el("div", "vw"); dlg.setAttribute("role", "dialog"); dlg.setAttribute("aria-modal", "true"); dlg.hidden = true;
    dlg.setAttribute("aria-labelledby", "vw-title");
    var bar = el("div", "vw-bar");
    titleEl = el("p", "vw-title"); titleEl.id = "vw-title";
    var tools = el("div", "vw-tools");
    prevB = btn("vw-prev", "Previous page", "M15 5l-7 7 7 7");
    nextB = btn("vw-next", "Next page", "M9 5l7 7-7 7");
    counter = el("span", "vw-count"); counter.setAttribute("aria-live", "polite");
    var zo = btn("vw-zo", "Zoom out", "M5 12h14"), zi = btn("vw-zi", "Zoom in", "M12 5v14M5 12h14"), fit = btn("vw-fit", "Fit", "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5");
    dl = el("a", "vw-btn vw-dl", icon("M12 3v12m0 0-5-5m5 5 5-5M4 19h16") + '<span class="vw-txt">Download</span>');
    var close = btn("vw-close", "Close", "M6 6l12 12M18 6 6 18");
    [prevB, counter, nextB, zo, zi, fit, dl, close].forEach(function (x) { tools.appendChild(x); });
    bar.appendChild(titleEl); bar.appendChild(tools);
    stage = el("div", "vw-stage"); stage.setAttribute("tabindex", "0"); stage.setAttribute("role", "region");
    stage.setAttribute("aria-label", "Page image. Drag to move; pinch or use the zoom buttons to zoom.");
    img = el("img", "vw-img"); img.alt = ""; img.draggable = false; stage.appendChild(img);
    label = el("p", "vw-label");
    dlg.appendChild(bar); dlg.appendChild(stage); dlg.appendChild(label);
    document.body.appendChild(dlg);
    prevB.onclick = function () { go(idx - 1); }; nextB.onclick = function () { go(idx + 1); };
    zi.onclick = function () { zoom(1.4); }; zo.onclick = function () { zoom(1 / 1.4); }; fit.onclick = reset;
    close.onclick = hide;
    dlg.addEventListener("keydown", keys);
    stage.addEventListener("pointerdown", pdown); stage.addEventListener("pointermove", pmove);
    stage.addEventListener("pointerup", pup); stage.addEventListener("pointercancel", pup);
    stage.addEventListener("wheel", function (e) { e.preventDefault(); zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15); }, { passive: false });
  }
  function apply() { img.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + s + ")"; }
  function reset() { s = 1; tx = 0; ty = 0; apply(); }
  function zoom(f) { s = Math.min(8, Math.max(1, s * f)); if (s === 1) { tx = 0; ty = 0; } apply(); }
  function go(i) {
    if (i < 0 || i >= pages.length) return;
    idx = i; var p = pages[i];
    img.src = p.img; img.width = p.w; img.height = p.h;
    img.alt = p.label || ("Page " + (i + 1));
    counter.textContent = (i + 1) + " / " + pages.length;
    label.textContent = p.label || "";
    prevB.disabled = i === 0; nextB.disabled = i === pages.length - 1;
    reset();
  }
  function focusables() { return Array.prototype.filter.call(dlg.querySelectorAll("button, a[href], [tabindex='0']"), function (x) { return !x.disabled && !x.hidden && x.offsetParent !== null; }); }
  function keys(e) {
    if (e.key === "Escape") { e.preventDefault(); hide(); }
    else if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); go(idx + 1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(idx - 1); }
    else if (e.key === "+" || e.key === "=") { zoom(1.4); }
    else if (e.key === "-") { zoom(1 / 1.4); }
    else if (e.key === "0") { reset(); }
    else if (e.key === "Tab") {
      var f = focusables(); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  function pdown(e) {
    stage.setPointerCapture(e.pointerId); pts[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ids = Object.keys(pts);
    if (ids.length === 2) { var a = pts[ids[0]], b = pts[ids[1]]; pinch0 = { d: Math.hypot(a.x - b.x, a.y - b.y), s: s }; }
    if (e.pointerType !== "mouse" && ids.length === 1) {
      var now = Date.now(); if (now - lastTap < 300) { if (s > 1) reset(); else zoom(2.5); } lastTap = now;
    }
  }
  function pmove(e) {
    if (!pts[e.pointerId]) return;
    var prev = pts[e.pointerId]; pts[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ids = Object.keys(pts);
    if (ids.length === 2 && pinch0) {
      var a = pts[ids[0]], b = pts[ids[1]];
      s = Math.min(8, Math.max(1, pinch0.s * Math.hypot(a.x - b.x, a.y - b.y) / pinch0.d)); apply();
    } else if (ids.length === 1 && s > 1) { tx += e.clientX - prev.x; ty += e.clientY - prev.y; apply(); }
  }
  function pup(e) { delete pts[e.pointerId]; if (Object.keys(pts).length < 2) pinch0 = null; }
  function show(a) {
    if (!dlg) build();
    opener = a;
    pages = a.getAttribute("data-pages").split(";;").map(function (x) { var p = x.split("|"); return { img: p[0], w: +p[1], h: +p[2], label: p.slice(3).join("|") }; });
    titleEl.textContent = a.getAttribute("data-title") || "";
    var d = a.getAttribute("data-download") || a.getAttribute("href");
    dl.href = d; dl.setAttribute("download", ""); dl.setAttribute("aria-label", "Download " + d.split("/").pop());
    var multi = pages.length > 1; prevB.hidden = nextB.hidden = counter.hidden = !multi;
    dlg.hidden = false; document.documentElement.classList.add("vw-open");
    go(Math.min(+a.getAttribute("data-start") || 0, pages.length - 1));
    dlg.querySelector(".vw-close").focus();
  }
  function hide() { dlg.hidden = true; document.documentElement.classList.remove("vw-open"); img.removeAttribute("src"); if (opener) opener.focus(); }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-viewer]");
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault(); show(a);
  });
})();
