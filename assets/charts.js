/* Chart enhancements: hover/focus tooltips and a gentle entry animation.
   The charts are complete inline SVG without this file; it only adds polish.
   Animation is skipped when the reader prefers reduced motion (see style.css). */
(function () {
  var boxes = document.querySelectorAll(".chartbox");
  if (!boxes.length) return;
  boxes.forEach(function (box) {
    var tip = document.createElement("div");
    tip.className = "chart-tip"; tip.hidden = true; tip.setAttribute("aria-hidden", "true");
    box.appendChild(tip);
    function show(pt) {
      var r = pt.getBoundingClientRect(), b = box.getBoundingClientRect();
      tip.textContent = pt.getAttribute("data-tip");
      var x = r.left + r.width / 2 - b.left;
      tip.style.left = "0px"; tip.hidden = false;
      var half = Math.min(tip.offsetWidth, b.width) / 2; /* keep the whole tip inside the chart box */
      x = Math.max(half, Math.min(b.width - half, x));
      tip.style.left = x + "px"; tip.style.top = (r.top - b.top) + "px";
    }
    function hide() { tip.hidden = true; }
    box.querySelectorAll(".pt").forEach(function (pt) {
      var t = pt.querySelector("title");
      if (t) { pt.setAttribute("data-native-title", t.textContent); t.remove(); } /* avoid double tooltips */
      pt.addEventListener("mouseenter", function () { show(pt); });
      pt.addEventListener("mouseleave", hide);
      pt.addEventListener("focus", function () { show(pt); });
      pt.addEventListener("blur", hide);
      pt.addEventListener("click", function () { show(pt); });
    });
    box.addEventListener("keydown", function (e) { if (e.key === "Escape") hide(); });
  });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in-view"); io.unobserve(en.target); } });
    }, { threshold: 0.25 });
    boxes.forEach(function (b) { io.observe(b); });
    setTimeout(function () { boxes.forEach(function (b) { b.classList.add("in-view"); }); }, 1200); /* safety net */
  } else {
    boxes.forEach(function (b) { b.classList.add("in-view"); });
  }
  /* print: open the data tables */
  window.addEventListener("beforeprint", function () {
    document.querySelectorAll("details.chart-data, .faq details").forEach(function (d) { d.dataset.wasOpen = d.open ? "1" : ""; d.open = true; });
  });
  window.addEventListener("afterprint", function () {
    document.querySelectorAll("details.chart-data, .faq details").forEach(function (d) { d.open = d.dataset.wasOpen === "1"; });
  });
})();
