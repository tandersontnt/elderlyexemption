/* Site navigation. Without JS the menu is a plain <details> list (see .nav-nojs).
   Narrow screens (< 1024px): "Menu" button opens a full-screen, stacked menu (focus trapped, Esc closes, focus returns).
   Wide screens: one dropdown per group (button + aria-expanded; Esc closes; click outside closes). */
(function () {
  "use strict";
  var nav = document.querySelector(".site-nav"); if (!nav) return;
  var btn = nav.querySelector(".menu-btn"), panel = document.getElementById("menu-panel"), closeB = nav.querySelector(".menu-close");
  var wide = window.matchMedia("(min-width: 1024px)");
  var groupBtns = Array.prototype.slice.call(nav.querySelectorAll(".grp-btn"));
  function focusables() { return Array.prototype.filter.call(panel.querySelectorAll("a[href], button"), function (x) { return x.offsetParent !== null; }); }
  function openMenu() {
    btn.setAttribute("aria-expanded", "true"); panel.classList.add("open");
    panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "true"); panel.setAttribute("aria-label", "Site menu");
    document.documentElement.classList.add("menu-open");
    var cur = panel.querySelector('[aria-current="page"]'); (cur || closeB).focus();
  }
  function closeMenu(ret) {
    btn.setAttribute("aria-expanded", "false"); panel.classList.remove("open");
    panel.removeAttribute("role"); panel.removeAttribute("aria-modal"); panel.removeAttribute("aria-label");
    document.documentElement.classList.remove("menu-open");
    if (ret !== false) btn.focus();
  }
  btn.addEventListener("click", function () { if (panel.classList.contains("open")) closeMenu(); else openMenu(); });
  closeB.addEventListener("click", function () { closeMenu(); });
  panel.addEventListener("keydown", function (e) {
    if (!panel.classList.contains("open")) return;
    if (e.key === "Escape") { e.preventDefault(); closeMenu(); return; }
    if (e.key !== "Tab") return;
    var f = focusables(), first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  function closeGroups(except) {
    groupBtns.forEach(function (b) { if (b !== except) { b.setAttribute("aria-expanded", "false"); b.parentNode.classList.remove("open"); } });
  }
  groupBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var open = b.getAttribute("aria-expanded") === "true";
      closeGroups(b); b.setAttribute("aria-expanded", open ? "false" : "true"); b.parentNode.classList.toggle("open", !open);
    });
    b.parentNode.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && b.getAttribute("aria-expanded") === "true") { e.preventDefault(); e.stopPropagation(); closeGroups(); b.focus(); }
      if (e.key === "ArrowDown" && document.activeElement === b) {
        e.preventDefault(); if (b.getAttribute("aria-expanded") !== "true") b.click();
        var a = b.parentNode.querySelector("a"); if (a) a.focus();
      }
    });
    b.parentNode.addEventListener("focusout", function (e) {
      if (wide.matches && !b.parentNode.contains(e.relatedTarget)) { b.setAttribute("aria-expanded", "false"); b.parentNode.classList.remove("open"); }
    });
  });
  document.addEventListener("click", function (e) { if (!nav.contains(e.target)) closeGroups(); });
  function mode() { closeGroups(); if (wide.matches && panel.classList.contains("open")) closeMenu(false); }
  if (wide.addEventListener) wide.addEventListener("change", mode); else wide.addListener(mode);
})();
