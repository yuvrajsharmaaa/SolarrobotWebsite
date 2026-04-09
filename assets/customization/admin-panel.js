(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    if (!window.SITE_CONFIG || !window.SITE_CONFIG.adminPanel || !window.SITE_CONFIG.adminPanel.enabled) {
      return;
    }
    if (typeof window.__getSiteConfig !== "function" || typeof window.__setSiteConfig !== "function") {
      return;
    }

    var body = document.body;
    var root = document.createElement("div");
    root.className = "site-admin";

    var toggle = document.createElement("button");
    toggle.className = "site-admin-toggle";
    toggle.type = "button";
    toggle.textContent = "Customize";

    var panel = document.createElement("div");
    panel.className = "site-admin-panel";

    var title = document.createElement("h3");
    title.textContent = "Site Config Editor";

    var hint = document.createElement("p");
    hint.textContent = "Edit JSON, then Apply or Save.";

    var textarea = document.createElement("textarea");
    textarea.className = "site-admin-editor";

    var actions = document.createElement("div");
    actions.className = "site-admin-actions";

    var applyBtn = document.createElement("button");
    applyBtn.type = "button";
    applyBtn.textContent = "Apply";

    var saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.textContent = "Save";

    var resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.textContent = "Reset";

    var downloadBtn = document.createElement("button");
    downloadBtn.type = "button";
    downloadBtn.textContent = "Download JSON";

    var status = document.createElement("div");
    status.className = "site-admin-status";

    actions.appendChild(applyBtn);
    actions.appendChild(saveBtn);
    actions.appendChild(resetBtn);
    actions.appendChild(downloadBtn);

    panel.appendChild(title);
    panel.appendChild(hint);
    panel.appendChild(textarea);
    panel.appendChild(actions);
    panel.appendChild(status);

    root.appendChild(toggle);
    root.appendChild(panel);
    body.appendChild(root);

    function syncEditor() {
      textarea.value = JSON.stringify(window.__getSiteConfig(), null, 2);
    }

    function setStatus(message, isError) {
      status.textContent = message;
      status.dataset.state = isError ? "error" : "ok";
    }

    function parseEditor() {
      try {
        return JSON.parse(textarea.value);
      } catch (err) {
        setStatus("Invalid JSON: " + err.message, true);
        return null;
      }
    }

    toggle.addEventListener("click", function () {
      root.classList.toggle("open");
      if (root.classList.contains("open")) {
        syncEditor();
      }
    });

    applyBtn.addEventListener("click", function () {
      var next = parseEditor();
      if (!next) return;
      window.__setSiteConfig(next, { persist: false });
      setStatus("Applied in browser (not saved).", false);
    });

    saveBtn.addEventListener("click", function () {
      var next = parseEditor();
      if (!next) return;
      window.__setSiteConfig(next, { persist: true });
      setStatus("Saved to browser local storage.", false);
    });

    resetBtn.addEventListener("click", function () {
      window.__resetSiteConfig();
      syncEditor();
      setStatus("Reset to file defaults.", false);
    });

    downloadBtn.addEventListener("click", function () {
      var blob = new Blob([textarea.value], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "site-config.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus("Downloaded site-config.json.", false);
    });

    window.addEventListener("site-config-updated", function () {
      if (root.classList.contains("open")) {
        syncEditor();
      }
    });

    if (!window.SITE_CONFIG.adminPanel.startCollapsed) {
      root.classList.add("open");
    }

    syncEditor();
    setStatus("Ready.", false);
  });
})();
