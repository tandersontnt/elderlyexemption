/* Home-visit form: accessible client-side validation, and a clear
   "not yet connected" notice until FORM_ENDPOINT is set (see visit.html). */
(function () {
  var form = document.getElementById("visit-form");
  if (!form) return;
  var status = document.getElementById("form-status");
  var checks = [
    ["v-name", function (el) { return el.value.trim().length > 0; }],
    ["v-addr", function (el) { return el.value.trim().length > 0; }],
    ["v-contact", function (el) { var v = el.value.trim(); return /@/.test(v) ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) : v.replace(/\D/g, "").length >= 7; }],
    ["v-voter", function (el) { return el.checked; }]
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
