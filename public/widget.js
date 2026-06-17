/* Crushing Doubt Support — embeddable widget.
 * Paste this on any site:
 *   <script src="https://YOUR-DOMAIN/cd/widget.js" defer></script>
 * It injects a floating "Support" button in the bottom-right that opens a
 * small ticket form. Submissions POST to /cd/api/tickets on the same origin
 * this script was served from — no config needed.
 */
(function () {
  "use strict";

  // Derive the API base from this script's own URL, so the snippet is
  // copy-paste with zero configuration regardless of where it's hosted.
  var self =
    document.currentScript ||
    (function () {
      var s = document.getElementsByTagName("script");
      return s[s.length - 1];
    })();
  var base = new URL(self.src); // e.g. https://host/cd/widget.js
  var apiUrl = base.origin + base.pathname.replace(/\/widget\.js.*$/, "") + "/api/tickets";

  var BRAND = "#dc2626"; // red-600
  var BRAND_DARK = "#111111"; // near-black header

  // Guard against double-injection.
  if (window.__cdSupportWidget) return;
  window.__cdSupportWidget = true;

  var style = document.createElement("style");
  style.textContent =
    "" +
    ".cd-fab{position:fixed;bottom:20px;right:20px;z-index:2147483000;background:" +
    BRAND +
    ";color:#fff;border:none;border-radius:9999px;padding:12px 18px;font:600 14px/1 system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.25);cursor:pointer}" +
    ".cd-fab:hover{filter:brightness(1.08)}" +
    ".cd-panel{position:fixed;bottom:78px;right:20px;z-index:2147483000;width:320px;max-width:calc(100vw - 40px);background:#fff;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.25);overflow:hidden;font:14px/1.4 system-ui,sans-serif;display:none}" +
    ".cd-panel.open{display:block}" +
    ".cd-head{background:" +
    BRAND_DARK +
    ";color:#fff;padding:14px 16px;font-weight:600;border-bottom:3px solid " +
    BRAND +
    "}" +
    ".cd-head small{display:block;font-weight:400;opacity:.85;font-size:12px;margin-top:2px}" +
    ".cd-body{padding:14px 16px}" +
    ".cd-body label{display:block;font-size:12px;font-weight:600;color:#3f3f46;margin:8px 0 4px}" +
    ".cd-body input,.cd-body textarea{width:100%;box-sizing:border-box;border:1px solid #d4d4d8;border-radius:8px;padding:8px 10px;font:14px system-ui,sans-serif;outline:none}" +
    ".cd-body input:focus,.cd-body textarea:focus{border-color:" +
    BRAND +
    ";box-shadow:0 0 0 3px rgba(220,38,38,.18)}" +
    ".cd-send{margin-top:12px;width:100%;background:" +
    BRAND +
    ";color:#fff;border:none;border-radius:8px;padding:10px;font:600 14px system-ui,sans-serif;cursor:pointer}" +
    ".cd-send:disabled{opacity:.5;cursor:default}" +
    ".cd-ok{padding:24px 16px;text-align:center;color:#15803d;font-weight:600}";
  document.head.appendChild(style);

  var fab = document.createElement("button");
  fab.className = "cd-fab";
  fab.type = "button";
  fab.textContent = "💬 Support";

  var panel = document.createElement("div");
  panel.className = "cd-panel";
  panel.innerHTML =
    '<div class="cd-head">Need help?<small>Send us a message and we\'ll get back to you.</small></div>' +
    '<div class="cd-body">' +
    '<form class="cd-form">' +
    '<label>Name</label><input name="name" required>' +
    '<label>Email</label><input name="email" type="email" required>' +
    '<label>Support type</label><select name="support_type" required><option value="">Select a type…</option><option value="Technical">Technical</option><option value="Billing">Billing</option></select>' +
    '<label>How can we help?</label><textarea name="message" rows="3" required></textarea>' +
    '<button class="cd-send" type="submit">Send</button>' +
    "</form></div>";

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  fab.addEventListener("click", function () {
    panel.classList.toggle("open");
  });

  var form = panel.querySelector(".cd-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = form.querySelector(".cd-send");
    btn.disabled = true;
    btn.textContent = "Sending…";

    var payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };

    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (r) {
        if (!r.ok) throw new Error("Request failed");
        panel.querySelector(".cd-body").innerHTML =
          '<div class="cd-ok">✅ Thanks! Your message was sent.</div>';
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = "Send";
        alert("Sorry, something went wrong. Please try again.");
      });
  });
})();
