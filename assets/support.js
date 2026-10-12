/* Support form: accessible client-side validation, and a clear
   "not yet connected" notice until FORM_ENDPOINT is set (see support.html). */
(function () {
  var form = document.getElementById("support-form");
  if (!form) return;
  var status = document.getElementById("form-status");
  var checks = [
    ["s-name", function (el) { return el.value.trim().length > 0; }],
    ["s-town", function (el) { return el.value.trim().length > 0; }],
    ["s-email", function (el) { var v = el.value.trim(); return v === "" || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v); }],
    ["s-resident", function (el) { return el.checked; }]
  ];
  form.addEventListener("submit", function (e) {
    var firstBad = null;
    checks.forEach(function (c) {
      var el = document.getElementById(c[0]), err = document.getElementById(c[0] + "-err"), ok = c[1](el);
      el.setAttribute("aria-invalid", ok ? "false" : "true");
      err.hidden = ok;
      if (!ok && !firstBad) firstBad = el;
    });
    if (firstBad) { e.preventDefault(); status.hidden = true; firstBad.focus(); return; }
    var ready = form.dataset.endpointReady === "true" && form.getAttribute("action") !== "FORM_ENDPOINT";
    if (!ready) {
      e.preventDefault();
      status.textContent = "This form is not yet connected, so nothing was sent. Please check back soon, or use the Where to sign page.";
      status.hidden = false; status.focus();
    }
  });
})();
