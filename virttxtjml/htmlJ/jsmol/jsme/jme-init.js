/*
 * jme-init.js - runtime replacement for the retired Java JME (Java Molecular
 * Editor) applets, using JSME (JavaScript Molecular Editor) when available.
 *
 * This file is deliberately self-contained and offline-friendly:
 *   - pure format helpers (JME text <-> molfile) are exported for node tests;
 *   - the DOM part swaps <applet code="JME.class"> for a container and installs
 *     a shim on document[<applet name>] exposing the legacy JME API:
 *         readMolecule(str), smiles(), reset(), jmeFile()
 *   - if the JSME kit is not present, a graceful placeholder editor is used so
 *     legacy page scripts keep running (they never throw).
 *
 * The complete JSME distribution (jsme.nocache.js + compiled payload) is NOT
 * bundled here; drop it in this directory and it is picked up automatically.
 */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   *  Pure JME format helpers (no DOM) -- also used by offline tests.
   * ------------------------------------------------------------------ */

  var ELEMENT = /^([A-Z][a-z]?)([+-]\d*|[+-])?$/;

  function atomToken(tok) {
    // JME atom token: element, possibly with charge (N+) or a ":n" marker
    // used by some exercise answer strings. Non-element tokens are text labels.
    if (tok == null || tok === "") return { sym: "*", charge: 0, text: true, raw: "" };
    var base = tok, charge = 0, text = false;
    var colon = base.indexOf(":");
    if (colon >= 0) base = base.slice(0, colon);
    var m = ELEMENT.exec(base);
    if (m) {
      if (m[2]) {
        var s = m[2];
        if (s === "+") charge = 1;
        else if (s === "-") charge = -1;
        else charge = parseInt(s, 10) || 0;
      }
      return { sym: m[1], charge: charge, text: false, raw: tok };
    }
    return { sym: tok, charge: 0, text: true, raw: tok };
  }

  // Split a multipart JME string on top-level '|' separators.
  function splitParts(text) {
    return String(text).split("|");
  }

  function parsePart(part) {
    var t = part.trim().split(/\s+/);
    var na = parseInt(t[0], 10), nb = parseInt(t[1], 10);
    if (isNaN(na) || isNaN(nb)) return null;
    if (t.length < 2 + na * 3 + nb * 3) return null; // truncated/not JME data
    var i = 2, atoms = [], bonds = [], k;
    for (k = 0; k < na; k++) {
      var sym = t[i++], x = parseFloat(t[i++]), y = parseFloat(t[i++]);
      var a = atomToken(sym);
      a.x = isNaN(x) ? 0 : x;
      a.y = isNaN(y) ? 0 : y;
      atoms.push(a);
    }
    for (k = 0; k < nb; k++) {
      bonds.push([parseInt(t[i++], 10), parseInt(t[i++], 10), parseInt(t[i++], 10)]);
    }
    return { atoms: atoms, bonds: bonds };
  }

  function parseJme(text) {
    var parts = [], raw = splitParts(text), k;
    for (k = 0; k < raw.length; k++) {
      var p = parsePart(raw[k]);
      if (p) parts.push(p);
    }
    return { parts: parts };
  }

  function fmt(n) {
    var s = Number(n).toFixed(4);
    return ("         " + s).slice(-10);
  }

  function jmeToMolfile(part, title) {
    var p = parsePart(part);
    if (!p) return "";
    var lines = [];
    lines.push(title || "");
    lines.push("  jme-init");
    lines.push("");
    lines.push(pad(p.atoms.length, 3) + pad(p.bonds.length, 3) + "  0  0  0  0  0  0  0  0999 V2000");
    var i, charged = [];
    for (i = 0; i < p.atoms.length; i++) {
      var a = p.atoms[i];
      var sym = a.text ? "*" : a.sym;
      var chargedFlag = (!a.text && a.charge) ? 3 : 0;
      lines.push(fmt(a.x) + fmt(a.y) + "    0.0000 " + (sym + "   ").slice(0, 3) +
        " 0" + pad(chargedFlag, 3) + "  0  0  0  0  0  0  0  0  0  0");
      if (!a.text && a.charge) charged.push([i + 1, a.charge]);
    }
    for (i = 0; i < p.bonds.length; i++) {
      var b = p.bonds[i], v = b[2], ord = Math.abs(v) || 1, stereo = 0;
      if (v < 0) { // negative = wedge/hash single bond (-1 up, -2 down)
        if (ord < 3) ord = 1;
        stereo = (v === -1) ? 1 : 6;
      }
      lines.push(pad(b[0], 3) + pad(b[1], 3) + pad(ord, 3) + pad(stereo, 3) + "  0  0  0");
    }
    for (i = 0; i < charged.length; i += 8) {
      var chunk = charged.slice(i, i + 8);
      var ln = "M  CHG" + pad(chunk.length, 3);
      for (var c = 0; c < chunk.length; c++) ln += pad(chunk[c][0], 4) + pad(chunk[c][1], 4);
      lines.push(ln);
    }
    lines.push("M  END");
    return lines.join("\n") + "\n";
  }

  function pad(n, w) {
    var s = String(n);
    while (s.length < w) s = " " + s;
    return s;
  }

  function molfileToJme(mol) {
    var lines = String(mol).replace(/\r/g, "").split("\n");
    var counts = -1, k;
    for (k = 0; k < lines.length && k < 6; k++) {
      if (/V2000|V3000/.test(lines[k])) { counts = k; break; }
    }
    if (counts < 0) return "";
    var m = /(\d+)\s+(\d+)/.exec(lines[counts]);
    if (!m) return "";
    var na = parseInt(m[1], 10), nb = parseInt(m[2], 10), out = [];
    var atoms = [], charge = {}, ci;
    for (ci = counts + 1 + na + nb; ci < lines.length; ci++) {
      var cm = /^M\s+CHG\s+(\d+)((?:\s+-?\d+\s+-?\d+)*)/.exec(lines[ci]);
      if (cm) {
        var toks = cm[2].trim().split(/\s+/);
        for (var t = 0; t + 1 < toks.length; t += 2) charge[parseInt(toks[t], 10)] = parseInt(toks[t + 1], 10);
      }
    }
    out.push(na + " " + nb);
    for (k = 0; k < na; k++) {
      var al = lines[counts + 1 + k] || "";
      var x = parseFloat(al.slice(0, 10)), y = parseFloat(al.slice(10, 20));
      var sym = (al.slice(31, 34) || "C").trim() || "C";
      if (sym === "*") sym = "C";
      var cq = charge[k + 1] || 0;
      if (cq) {
        if (Math.abs(cq) === 1) sym += (cq > 0 ? "+" : "-");
        else sym += (cq > 0 ? "+" : "") + cq;
      }
      atoms.push(sym);
      out.push(sym + " " + (isNaN(x) ? "0.00" : x.toFixed(2)) + " " + (isNaN(y) ? "0.00" : y.toFixed(2)));
    }
    for (k = 0; k < nb; k++) {
      var bl = lines[counts + 1 + na + k] || "";
      var a1 = parseInt(bl.slice(0, 3), 10), a2 = parseInt(bl.slice(3, 6), 10), ord = parseInt(bl.slice(6, 9), 10);
      var st = parseInt(bl.slice(9, 12), 10) || 0;
      var jord = (st === 1) ? -1 : (st === 6 ? -2 : (ord || 1));
      out.push(a1 + " " + a2 + " " + jord);
    }
    return out.join(" ");
  }

  function looksLikeJme(s) {
    return /^\s*\d+\s+\d+\s+[A-Za-z=]/.test(String(s));
  }
  function looksLikeMolfile(s) {
    return /V2000|V3000|\$MOL/.test(String(s));
  }
  function toMolfile(s) {
    // Return a JSME-readable molecule string for value s (jme/mdl/smiles).
    if (looksLikeMolfile(s)) return s;
    if (looksLikeJme(s)) return jmeToMolfile(splitParts(s)[0]);
    return s; // assume SMILES
  }

  var API = {
    parseJme: parseJme, jmeToMolfile: jmeToMolfile,
    molfileToJme: molfileToJme, toMolfile: toMolfile,
    looksLikeJme: looksLikeJme, looksLikeMolfile: looksLikeMolfile
  };
  if (typeof module !== "undefined" && module.exports) { module.exports = API; }
  if (typeof window !== "undefined") { window.JmeFormat = API; }

  if (typeof document === "undefined") return; // node: pure helpers only

  /* ------------------------------------------------------------------ *
   *  DOM: swap <applet code="JME.class"> -> JSME editor + API shim.
   * ------------------------------------------------------------------ */

  var DEFAULT_W = 360, DEFAULT_H = 360;
  var editors = {}; // name -> editor

  function jsmeDir() {
    if (window.JSME_DIR) return window.JSME_DIR;
    var ss = document.getElementsByTagName("script");
    for (var i = ss.length - 1; i >= 0; i--) {
      var src = ss[i].src || "";
      if (/jme-init\.js(\?|$)/.test(src)) return src.replace(/jme-init\.js.*$/, "");
    }
    return "htmlJ/jsmol/jsme/";
  }

  function numAttr(v, dflt) {
    var m = String(v == null ? "" : v).match(/\d+/);
    return m ? parseInt(m[0], 10) : dflt;
  }

  function jsmeOptions(jmeOpts) {
    var o = String(jmeOpts || "").toLowerCase();
    var parts = [];
    if (/hydrogen/.test(o)) parts.push("hydrogens");
    if (/reaction/.test(o)) parts.push("reaction");
    return parts.join(",");
  }

  function StubEditor(host, cfg) {
    this.host = host; this.cfg = cfg; this._input = ""; this.available = false;
    host.innerHTML = '<div class="jme-unavailable" style="border:1px solid #bbb;background:#f7f7f7;' +
      'padding:8px;font:12px/1.4 sans-serif;color:#555;text-align:center;width:' + cfg.w +
      'px;height:' + cfg.h + 'px;box-sizing:border-box">' +
      'JME editor unavailable &mdash; the HTML5 editor (JSME) is not installed.</div>';
  }
  StubEditor.prototype.readMolecule = function (s) { this._input = s || ""; };
  StubEditor.prototype.getSmiles = function () {
    return (this._input && !looksLikeJme(this._input) && !looksLikeMolfile(this._input)) ? this._input : "";
  };
  StubEditor.prototype.reset = function () { this._input = ""; };
  StubEditor.prototype.getJmeFile = function () {
    return looksLikeJme(this._input) ? this._input : "";
  };

  function JsmeEditor(host, cfg) {
    this.available = true;
    this.jsme = new JSApplet.JSME(cfg.id, cfg.w + "px", cfg.h + "px",
      { options: jsmeOptions(cfg.options) });
  }
  JsmeEditor.prototype.readMolecule = function (s) { this.jsme.readMolecule(toMolfile(s)); };
  JsmeEditor.prototype.getSmiles = function () { return this.jsme.getSmiles ? this.jsme.getSmiles() : ""; };
  JsmeEditor.prototype.reset = function () { this.jsme.reset(); };
  JsmeEditor.prototype.getJmeFile = function () {
    return this.jsme.getMolfile ? molfileToJme(this.jsme.getMolfile()) : "";
  };

  function makeEditor(cfg) {
    var host = document.getElementById(cfg.id);
    if (!host) return null;
    if (window.JSApplet && window.JSApplet.JSME) return new JsmeEditor(host, cfg);
    return new StubEditor(host, cfg);
  }

  function installShim(cfg) {
    function ed() { return editors[cfg.name]; }
    var shim = {
      readMolecule: function (s) { var e = ed(); if (e) e.readMolecule(s); },
      smiles: function () { var e = ed(); return e ? e.getSmiles() : ""; },
      reset: function () { var e = ed(); if (e) e.reset(); },
      jmeFile: function () { var e = ed(); return e ? e.getJmeFile() : ""; }
    };
    try { window[cfg.name] = shim; } catch (e) {}
    try { document[cfg.name] = shim; } catch (e) {}
  }

  var queue = [];
  var kitRequested = false;

  function loadKit() {
    if (kitRequested || (window.JSApplet && window.JSApplet.JSME)) return;
    kitRequested = true;
    // Opt-in: only fetch the JSME bundle once it is actually installed, to
    // avoid failed script requests while the kit is absent (set window.JSME_AUTOLOAD).
    if (!window.JSME_AUTOLOAD) { buildQueued(); return; }
    window.jsmeOnLoad = function () { buildQueued(); };
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = jsmeDir() + "jsme.nocache.js";
    s.onerror = function () { buildQueued(); };
    document.head.appendChild(s);
  }

  function buildQueued() {
    var k;
    for (k = 0; k < queue.length; k++) {
      var cfg = queue[k];
      if (editors[cfg.name]) continue;
      var e = makeEditor(cfg);
      if (e) { editors[cfg.name] = e; }
    }
  }

  function swapApplet(el) {
    if (el.__jmeSwapped) return;
    var code = (el.getAttribute("code") || "");
    if (!/JME\.class$/i.test(code)) return;
    el.__jmeSwapped = true;
    var name = el.getAttribute("name") || ("JME" + (queue.length + 1));
    var w = numAttr(el.getAttribute("width"), DEFAULT_W);
    var h = numAttr(el.getAttribute("height"), DEFAULT_H);
    var options = "";
    var ps = el.getElementsByTagName("param");
    for (var i = 0; i < ps.length; i++) {
      if ((ps[i].getAttribute("name") || "").toLowerCase() === "options") options = ps[i].getAttribute("value") || "";
    }
    var div = document.createElement("div");
    var id = "jsme_" + name;
    div.id = id;
    div.className = "jme-editor";
    if (el.parentNode) el.parentNode.replaceChild(div, el);
    var cfg = { name: name, id: id, w: w, h: h, options: options };
    queue.push(cfg);
    installShim(cfg);
    loadKit();
  }

  function scan(root) {
    var all = (root || document).getElementsByTagName("applet");
    for (var i = all.length - 1; i >= 0; i--) swapApplet(all[i]);
    if (queue.length) buildQueued();
  }

  function ready() {
    scan(document);
    if (document.body) {
      new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          for (var j = 0; j < muts[i].addedNodes.length; j++) {
            var n = muts[i].addedNodes[j];
            if (n.nodeType === 1) scan(n.parentNode || document);
          }
        }
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
  window.JmeInit = function (root) { scan(root); };
})();
