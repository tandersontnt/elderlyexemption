/* Cost calculator for proposal.html. Without JS the table below the form shows
   the same math for common home values. Rates come from data attributes that
   the build fills from data.json (per100k_low / per100k_high). */
(function () {
  var form = document.getElementById("calc");
  if (!form) return;
  var num = function (s) { return parseFloat(String(s).replace(/[^0-9.]/g, "")); };
  var lo = num(form.dataset.low), hi = num(form.dataset.high);
  var input = document.getElementById("homevalue"), out = document.getElementById("calc-out");
  var money = function (v) { return "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  form.hidden = false;
  function run(e) {
    if (e) e.preventDefault();
    var v = num(input.value);
    if (!v || v <= 0) { out.textContent = "Enter your home's assessed value in dollars, for example 300,000."; input.setAttribute("aria-invalid", "true"); return; }
    input.removeAttribute("aria-invalid");
    out.textContent = "About " + money(lo * v / 100000) + " to " + money(hi * v / 100000) +
      " a year in added tax on a home assessed at $" + Math.round(v).toLocaleString("en-US") + ". This is an estimate.";
  }
  form.addEventListener("submit", run);
  input.addEventListener("change", run);
})();
