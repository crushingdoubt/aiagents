/* Crushing Doubt Support — embeddable widget.
 * Paste this on any site:
 *   <script src="https://support.crushingdoubt.com/widget.js" defer></script>
 */
(function () {
  "use strict";

  var self =
    document.currentScript ||
    (function () {
      var s = document.getElementsByTagName("script");
      return s[s.length - 1];
    })();
  var base = new URL(self.src);
  var apiUrl = base.origin + "/api/tickets";

  var BRAND = "#dc2626";

  if (window.__cdSupportWidget) return;
  window.__cdSupportWidget = true;

  var style = document.createElement("style");
  style.textContent =
    "@keyframes cd-slide-up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}" +
    ".cd-fab{position:fixed;bottom:24px;right:24px;z-index:2147483000;background:" + BRAND + ";color:#fff;border:none;border-radius:9999px;padding:13px 20px;font:600 14px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;box-shadow:0 4px 24px rgba(220,38,38,.4);cursor:pointer;display:flex;align-items:center;gap:8px;transition:transform .15s,box-shadow .15s}" +
    ".cd-fab:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(220,38,38,.45)}" +
    ".cd-fab svg{width:16px;height:16px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}" +
    ".cd-panel{position:fixed;bottom:80px;right:24px;z-index:2147483000;width:340px;max-width:calc(100vw - 48px);background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.06);overflow:hidden;font:14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:none}" +
    ".cd-panel.open{display:block;animation:cd-slide-up .2s ease}" +
    ".cd-head{padding:18px 20px 16px;border-bottom:1px solid #f4f4f5}" +
    ".cd-head-title{font-size:15px;font-weight:700;color:#09090b;margin:0 0 2px}" +
    ".cd-head-sub{font-size:12px;color:#71717a;margin:0}" +
    ".cd-close{position:absolute;top:14px;right:14px;background:none;border:none;cursor:pointer;color:#a1a1aa;padding:4px;line-height:1;font-size:18px}" +
    ".cd-close:hover{color:#09090b}" +
    ".cd-body{padding:16px 20px 20px}" +
    ".cd-field{margin-bottom:12px}" +
    ".cd-label{display:block;font-size:11px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px}" +
    ".cd-input{width:100%;box-sizing:border-box;border:1.5px solid #e4e4e7;border-radius:8px;padding:9px 12px;font:14px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#09090b;outline:none;transition:border-color .15s,box-shadow .15s;background:#fafafa}" +
    ".cd-input:focus{border-color:" + BRAND + ";box-shadow:0 0 0 3px rgba(220,38,38,.1);background:#fff}" +
    ".cd-input::placeholder{color:#a1a1aa}" +
    ".cd-tabs{display:flex;gap:6px;margin-bottom:4px}" +
    ".cd-tab{flex:1;padding:8px;border:1.5px solid #e4e4e7;border-radius:8px;background:#fafafa;font:600 13px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#71717a;cursor:pointer;transition:all .15s;text-align:center}" +
    ".cd-tab:hover{border-color:#d4d4d8;color:#3f3f46}" +
    ".cd-tab.active{border-color:" + BRAND + ";background:rgba(220,38,38,.06);color:" + BRAND + "}" +
    ".cd-send{margin-top:14px;width:100%;background:" + BRAND + ";color:#fff;border:none;border-radius:8px;padding:11px;font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;cursor:pointer;transition:opacity .15s,transform .1s}" +
    ".cd-send:hover{opacity:.9}" +
    ".cd-send:active{transform:scale(.98)}" +
    ".cd-send:disabled{opacity:.45;cursor:default;transform:none}" +
    ".cd-ok{padding:32px 20px;text-align:center}" +
    ".cd-ok-icon{font-size:32px;margin-bottom:10px}" +
    ".cd-ok-title{font-size:15px;font-weight:700;color:#09090b;margin:0 0 4px}" +
    ".cd-ok-sub{font-size:13px;color:#71717a;margin:0}";
  document.head.appendChild(style);

  var fab = document.createElement("button");
  fab.className = "cd-fab";
  fab.type = "button";
  fab.innerHTML =
    '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
    "Support";

  var panel = document.createElement("div");
  panel.className = "cd-panel";
  panel.innerHTML =
    '<div class="cd-head" style="position:relative">' +
    '<p class="cd-head-title">How can we help?</p>' +
    '<p class="cd-head-sub">Our team typically replies within a few hours.</p>' +
    '<button class="cd-close" type="button" aria-label="Close">&#x2715;</button>' +
    "</div>" +
    '<div class="cd-body">' +
    '<form class="cd-form">' +
    '<div class="cd-field"><label class="cd-label">Your name</label><input class="cd-input" name="name" placeholder="Jane Smith" required></div>' +
    '<div class="cd-field"><label class="cd-label">Email</label><input class="cd-input" name="email" type="email" placeholder="jane@example.com" required></div>' +
    '<div class="cd-field"><label class="cd-label">Support type</label><div class="cd-tabs"><button type="button" class="cd-tab active" data-type="Technical">Technical</button><button type="button" class="cd-tab" data-type="Billing">Billing</button></div><input type="hidden" name="support_type" value="Technical"></div>' +
    '<div class="cd-field"><label class="cd-label">Message</label><textarea class="cd-input" name="message" rows="3" placeholder="Describe your issue…" required></textarea></div>' +
    '<button class="cd-send" type="submit">Send message</button>' +
    "</form></div>";

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  fab.addEventListener("click", function () {
    panel.classList.toggle("open");
  });

  panel.querySelector(".cd-close").addEventListener("click", function () {
    panel.classList.remove("open");
  });

  var tabs = panel.querySelectorAll(".cd-tab");
  var hiddenType = panel.querySelector('input[name="support_type"]');
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      hiddenType.value = tab.getAttribute("data-type");
    });
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
      support_type: hiddenType.value,
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
          '<div class="cd-ok"><div class="cd-ok-icon">✅</div><p class="cd-ok-title">Message sent!</p><p class="cd-ok-sub">We\'ll get back to you shortly.</p></div>';
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = "Send message";
        alert("Sorry, something went wrong. Please try again.");
      });
  });
})();
