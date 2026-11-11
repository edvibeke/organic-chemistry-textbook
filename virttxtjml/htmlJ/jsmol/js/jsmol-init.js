/* jsmol-init.js - shared bootstrap: replaces legacy Jmol/CHIME Java applets
   with HTML5 JSmol canvases. Requires JSmol.min.js to be loaded first.

   Handles three cases:
     1. .jsmol divs (data-name/data-script/data-load) -> dynamic viewers
     2. <button class="jctl" data-target/...>          -> control buttons
     3. live <applet> elements (JmolApplet / JmolAppletControl) created by
        document.write or innerHTML in page scripts -> swapped at runtime */
(function () {
  "use strict";

  function jmolReady() {
    return typeof window.Jmol !== "undefined" && window.Jmol.getApplet;
  }

  function escapeAttr(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;")
      .replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function j2sDir() {
    if (window.JSMOL_J2S) return window.JSMOL_J2S;
    try {
      var src = document.currentScript && document.currentScript.src;
      if (src && /htmlJ\/jsmol\/js\/jsmol-init\.js$/i.test(src)) {
        return src.replace(/htmlJ\/jsmol\/js\/jsmol-init\.js$/i, "htmlJ/jsmol/j2s");
      }
    } catch (e) {}
    return "htmlJ/jsmol/j2s";
  }

  /* ---- control buttons (formerly JmolAppletControl applets) ---- */
  function appletByName(name) {
    if (window.Jmol) {
      if (Jmol._applets && Jmol._applets[name]) return Jmol._applets[name];
      if (Jmol._syncedApplets) {
        for (var i = 0; i < Jmol._syncedApplets.length; i++) {
          var a = Jmol._syncedApplets[i];
          if (a && (a._id === name || (a._applet && a._applet._id === name))) return a;
        }
      }
    }
    return null;
  }

  function scriptApplet(name, cmd) {
    var a = appletByName(name);
    if (!a || !cmd) return;
    if (typeof a._script === "function") a._script(cmd);
    else if (a._applet && typeof a._applet.script === "function") a._applet.script(cmd);
  }

  document.addEventListener("click", function (ev) {
    var btn = ev.target && ev.target.closest ? ev.target.closest(".jctl[data-target]") : null;
    if (!btn || !jmolReady()) return;
    var target = btn.getAttribute("data-target");
    var script = btn.getAttribute("data-script") || "";
    var alt = btn.getAttribute("data-altscript");
    if (alt) {
      var on = btn.getAttribute("data-on") === "1";
      scriptApplet(target, on ? alt : script);
      btn.setAttribute("data-on", on ? "0" : "1");
    } else if (script) {
      scriptApplet(target, script);
    }
  });

  /* ---- viewer containers (data-name divs) ---- */
  function placeApplet(name, info) {
    if (Jmol.setXHTML) {
      try { Jmol.setXHTML(true); } catch (e) {}
    }
    try {
      var stm = document.getElementsByTagName("script");
      var lastS = stm[stm.length - 1];
      window._jmol = { XhtmlElement: lastS };
    } catch (e) {}
    window[name] = Jmol.getApplet(name, info);
    return document.getElementById(name + "_appletinfotablediv") ||
           document.getElementById(name + "_appletdiv");
  }

  function fallback(div, msg) {
    if (!div) return;
    div.__jsmol = true;
    if (div.querySelector && div.querySelector(".jsmol-fallback")) return;
    var d = document.createElement("div");
    d.className = "jsmol-fallback";
    d.style.cssText = "border:1px solid #bbb;background:#f7f7f7;color:#666;font:12px/1.4 " +
      "sans-serif;padding:8px;text-align:center;box-sizing:border-box";
    d.textContent = msg;
    div.appendChild(d);
  }

  function renderViewer(holder, name, info) {
    removeJsmolById(name, holder);
    try {
      var wrap = placeApplet(name, info);
      if (wrap && wrap !== holder) holder.appendChild(wrap);
    } catch (e) {
      if (window.console) console.error("jsmol init failed for " + name + ": " + (e && e.message));
      fallback(holder, "3D viewer failed to load.");
    }
  }

  function makeApplet(div) {
    if (!div || div.__jsmol) return;
    if (div.querySelector && div.querySelector("canvas")) return;
    if (!jmolReady()) {
      fallback(div, "3D model viewer requires JavaScript and a modern browser.");
      return;
    }
    var name = div.getAttribute("data-name") || "";
    if (!name || !document.getElementById(name)) {
      name = div.id || ("jsmol-" + Math.floor(Math.random() * 1e9));
    }
    if (!div.id) div.id = name;
    var info = {
      width: parseInt(div.getAttribute("data-w") || "300", 10) || 300,
      height: parseInt(div.getAttribute("data-h") || "300", 10) || 300,
      color: "#FFFFFF",
      use: "HTML5",
      j2sPath: j2sDir(),
      addSelectionOptions: false
    };
    var sc = div.getAttribute("data-script");
    if (sc) info.script = sc;
    var ld = div.getAttribute("data-load");
    if (ld) info.load = ld;
    div.__jsmol = true;
    renderViewer(div, name, info);
  }

  /* ---- legacy <applet> element swapping ---- */
  function readParams(el) {
    var p = {};
    var pr = el.getElementsByTagName("param");
    for (var i = 0; i < pr.length; i++) {
      var nm = (pr[i].getAttribute("name") || "").toLowerCase();
      if (nm) p[nm] = pr[i].getAttribute("value") || "";
    }
    return p;
  }

  function cleanName(s) {
    return String(s || "").replace(/[^A-Za-z0-9_.-]/g, "") || "jsmol";
  }

  function removeJsmolById(name, except) {
    var suff = ["_appletinfotablediv", "_appletdiv", "_infotablediv", "_infodiv"];
    var ids = [name].concat(suff.map(function (s) { return name + s; }));
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el && el !== except && el.parentNode) el.parentNode.removeChild(el);
    }
  }

  function swapApplet(el) {
    if (!el || el.getAttribute("data-jmol-swapped")) return false;
    var code = (el.getAttribute("code") || "").toLowerCase();
    var isCtrl = code.indexOf("jmolappletcontrol") >= 0;
    var isView = !isCtrl && code.indexOf("jmolapplet") >= 0;
    if (!isCtrl && !isView) return false;
    try {
      if (isView) {
        var p = readParams(el);
        var name = cleanName(el.getAttribute("name") || p.name);
        var info = {
          width: parseInt(el.getAttribute("width") || p.width || "300", 10) || 300,
          height: parseInt(el.getAttribute("height") || p.height || "300", 10) || 300,
          color: "#FFFFFF",
          use: "HTML5",
          j2sPath: j2sDir(),
          addSelectionOptions: false
        };
        if (p.load) info.load = p.load;
        if (p.script) info.script = p.script;
        var holder = document.createElement("div");
        holder.className = "jsmol";
        holder.setAttribute("data-name", name);
        el.parentNode.insertBefore(holder, el);
        el.parentNode.removeChild(el);
        if (!jmolReady()) {
          fallback(holder, "3D model viewer requires JavaScript and a modern browser.");
        } else {
          renderViewer(holder, name, info);
        }
      } else {
        var q = readParams(el);
        var b = document.createElement("button");
        b.type = "button";
        b.className = "jctl";
        b.setAttribute("data-target", q.target || "");
        if (q.script) b.setAttribute("data-script", q.script);
        if (q.altscript) b.setAttribute("data-altscript", q.altscript);
        b.textContent = q.label || "X";
        b.setAttribute("data-jmol-swapped", "1");
        el.parentNode.replaceChild(b, el);
      }
      return true;
    } catch (err) {
      if (window.console) console.error("jsmol swap failed: " + (err && err.message));
      return false;
    }
  }

  function scanApplets(root) {
    var list = (root || document).querySelectorAll("applet");
    for (var i = 0; i < list.length; i++) swapApplet(list[i]);
  }

  function scan(root) {
    var divs = (root || document).querySelectorAll(".jsmol");
    for (var i = 0; i < divs.length; i++) {
      if (!divs[i].querySelector("canvas")) makeApplet(divs[i]);
    }
    scanApplets(root);
  }

  if (window.MutationObserver) {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var n = added[j];
          if (n.nodeType !== 1) continue;
          if (n.tagName === "APPLET") swapApplet(n);
          else if (n.querySelectorAll) {
            var d = n.querySelectorAll(".jsmol");
            for (var k = 0; k < d.length; k++) makeApplet(d[k]);
            var a = n.querySelectorAll("applet");
            for (var s = 0; s < a.length; s++) swapApplet(a[s]);
          }
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  if (jmolReady()) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () { scan(); });
    } else {
      scan();
    }
  } else {
    document.addEventListener("load", function () { scan(); });
  }

  window.JsmolInit = function (root) { scan(root); };
  window.JsmolSwapApplet = swapApplet;
  window.JsmolEscape = escapeAttr;
})();