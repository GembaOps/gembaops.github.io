/* =================================================================
   GembaOps — ROI calculator
   Encodes Frank's heuristic:
     hourly = (mode === 'salary') ? salary / 2000 : hourlyCost
     annualCost = people * hours/week * 52 * hourly
     4x rule: if you can automate it for <= annualCost / 4, it's a
     clear win (a 4x return). Compare an estimated build cost to that.
   Reusable: drives any element with [data-roi].
   ================================================================= */
(function () {
  "use strict";

  function money(n) {
    if (!isFinite(n)) n = 0;
    return "$" + Math.round(n).toLocaleString("en-US");
  }
  function num(elm) {
    if (!elm) return 0;
    var v = parseFloat(elm.value);
    return isFinite(v) && v >= 0 ? v : 0;
  }

  function initRoi(root) {
    var mode = "salary"; // default to salary (Frank's salary/2000 rule)
    var get = function (name) { return root.querySelector('[name="roi-' + name + '"]'); };
    var out = function (key) { return root.querySelector('[data-roi-out="' + key + '"]'); };

    var inPeople = get("people");
    var inHours = get("hours");
    var inRate = get("rate");
    var inCost = get("cost");
    var rateLabel = root.querySelector("[data-roi-rate-label]");
    var rateHint = root.querySelector("[data-roi-rate-hint]");
    var ratePrefix = root.querySelector("[data-roi-rate-prefix]");
    var modeBtns = root.querySelectorAll("[data-roi-mode]");
    var verdict = root.querySelector("[data-roi-verdict]");
    var verdictText = root.querySelector("[data-roi-verdict-text]");

    function applyMode() {
      modeBtns.forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-roi-mode") === mode ? "true" : "false");
      });
      if (mode === "salary") {
        if (rateLabel) rateLabel.textContent = "Average annual salary (per person)";
        if (rateHint) rateHint.textContent = "We convert to an hourly cost using salary ÷ 2,000 hours.";
        if (ratePrefix) ratePrefix.textContent = "$";
        if (inRate && (!inRate.value || inRate.value === "75")) inRate.value = "60000";
      } else {
        if (rateLabel) rateLabel.textContent = "Loaded hourly cost (per person)";
        if (rateHint) rateHint.textContent = "Wages + benefits + overhead per hour.";
        if (ratePrefix) ratePrefix.textContent = "$";
        if (inRate && (!inRate.value || inRate.value === "60000")) inRate.value = "75";
      }
    }

    function calc() {
      var people = num(inPeople);
      var hoursWk = num(inHours);
      var rate = num(inRate);
      var buildCost = num(inCost);

      var hourly = mode === "salary" ? (rate / 2000) : rate;
      var annualHours = people * hoursWk * 52;
      var annualCost = annualHours * hourly;
      var fourxLine = annualCost / 4;
      var multiple = buildCost > 0 ? annualCost / buildCost : 0;
      var paybackMonths = annualCost > 0 ? (buildCost / (annualCost / 12)) : 0;

      if (out("annual")) out("annual").textContent = money(annualCost);
      if (out("hours-year")) out("hours-year").textContent = Math.round(annualHours).toLocaleString("en-US") + " hrs";
      if (out("hourly")) out("hourly").textContent = money(hourly) + "/hr";
      if (out("fourx")) out("fourx").textContent = money(fourxLine);
      if (out("buyback")) out("buyback").textContent = Math.round(annualHours).toLocaleString("en-US") + " hrs";
      if (out("multiple")) out("multiple").textContent = multiple > 0 ? multiple.toFixed(1) + "×" : "—";
      if (out("payback")) out("payback").textContent = paybackMonths > 0 ? paybackMonths.toFixed(1) + " mo" : "—";

      if (verdict && verdictText) {
        verdict.classList.remove("warn");
        if (annualCost <= 0) {
          verdictText.innerHTML = "Enter your numbers above to see the return.";
        } else if (buildCost <= 0) {
          verdictText.innerHTML = "By the <strong>4× rule</strong>, anything you can automate this for under <strong>" +
            money(fourxLine) + "</strong> is a clear win.";
        } else if (multiple >= 4) {
          verdictText.innerHTML = "<strong>Strong case to automate.</strong> At " + money(buildCost) +
            ", that's a <strong>" + multiple.toFixed(1) + "× first-year return</strong> — past the 4× line — and it pays for itself in about " +
            paybackMonths.toFixed(1) + " months.";
        } else if (multiple >= 1) {
          verdict.classList.add("warn");
          verdictText.innerHTML = "<strong>Still positive</strong> (" + multiple.toFixed(1) +
            "× first-year), but under the 4× line. Worth doing — let's make sure the scope is tight. Payback ≈ " +
            paybackMonths.toFixed(1) + " months.";
        } else {
          verdict.classList.add("warn");
          verdictText.innerHTML = "At " + money(buildCost) + " this one doesn't clear a one-year payback yet. " +
            "Either the task is smaller than it feels, or there's a cheaper way to scope it.";
        }
      }
    }

    modeBtns.forEach(function (b) {
      b.addEventListener("click", function () { mode = b.getAttribute("data-roi-mode"); applyMode(); calc(); });
    });
    [inPeople, inHours, inRate, inCost].forEach(function (i) {
      if (i) i.addEventListener("input", calc);
    });

    applyMode();
    calc();
  }

  function boot() {
    document.querySelectorAll("[data-roi]").forEach(initRoi);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
