(function () {
  "use strict";
  try {
    if (window.top !== window.self) return;
    if (window.opener) return;
    if (document.documentElement.getAttribute("data-ev-chrome")) return;
    document.documentElement.setAttribute("data-ev-chrome", "1");

    var EXTERNAL = "https://edvibe.co.ke";
    var script = document.currentScript || (function () {
      var all = document.getElementsByTagName("script");
      return all[all.length - 1];
    })();
    var src = (script && script.src) || "";
    var stylesDir = src.replace(/edvibe\.js[^/]*$/, "");
    var prefix = stylesDir.replace(/Styles\/$/, "");

    var isOrg = /\/OrgPage\//i.test(location.pathname);
    var home = prefix + (isOrg ? "menu.htm" : "index.htm");
    var here = (location.pathname.split("/").pop() || "").toLowerCase();

    /* ---------- theme (dark mode) ---------- */
    var THEME_KEY = "ev-theme";
    function storedTheme() {
      try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
    }
    function systemTheme() {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function applyTheme(t) {
      if (t === "dark") document.documentElement.setAttribute("data-theme", "dark");
      else document.documentElement.removeAttribute("data-theme");
      var lbl = document.querySelector(".ev-theme-toggle");
      if (lbl) lbl.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
    applyTheme(storedTheme() || systemTheme());
    if (window.matchMedia) {
      try {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
          if (!storedTheme()) applyTheme(e.matches ? "dark" : "light");
        });
      } catch (e) {}
    }

    var NAV = [
      { label: "Home", href: home },
      { label: "Contents", href: prefix + "textindx.htm" },
      { label: "Index", href: prefix + "intro1b.htm" },
      { label: "Problems", href: prefix + "Questions/problems.htm" },
      { label: "EdVibe", href: EXTERNAL }
    ];

    function base(href) {
      return href.split("/").pop().toLowerCase();
    }

    /* ---------- header ---------- */
    var header = document.createElement("header");
    header.className = "ev-site-header";

    var brand = document.createElement("a");
    brand.className = "ev-brand";
    brand.href = home;
    var logo = document.createElement("img");
    logo.src = stylesDir + "edvibe/logo.png";
    logo.alt = "EdVibe";
    var word = document.createElement("span");
    word.textContent = "EdVibe";
    brand.appendChild(logo);
    brand.appendChild(word);

    var nav = document.createElement("nav");
    nav.className = "ev-nav";
    for (var i = 0; i < NAV.length; i++) {
      var a = document.createElement("a");
      a.href = NAV[i].href;
      a.textContent = NAV[i].label;
      if (base(NAV[i].href) === here) a.className = "active";
      if (/edvibe\.co\.ke/i.test(NAV[i].href)) {
        a.target = "_blank";
        a.rel = "noopener";
      } else {
        a.target = "_self";
      }
      nav.appendChild(a);
    }

    var themeBtn = document.createElement("button");
    themeBtn.className = "ev-theme-toggle";
    themeBtn.type = "button";
    themeBtn.setAttribute("aria-label", "Toggle dark mode");
    themeBtn.innerHTML =
      '<svg class="ev-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
      '<svg class="ev-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"/></svg>';
    themeBtn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      applyTheme(next);
    });

    var toggle = document.createElement("button");
    toggle.className = "ev-nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Toggle menu");
    toggle.textContent = "Menu";
    toggle.addEventListener("click", function () {
      header.classList.toggle("ev-open");
    });

    header.appendChild(brand);
    header.appendChild(toggle);
    header.appendChild(nav);
    header.appendChild(themeBtn);

    /* ---------- footer ---------- */
    var footer = document.createElement("footer");
    footer.className = "ev-site-footer";
    var year = new Date().getFullYear();
    var fBrand = document.createElement("div");
    fBrand.className = "ev-footer-brand";
    fBrand.textContent = "EdVibe";
    var fTag = document.createElement("p");
    fTag.className = "ev-footer-tag";
    fTag.textContent = "Free Science Notes, Quizzes & Flashcards";
    var fLinks = document.createElement("p");
    fLinks.className = "ev-footer-links";
    var fA = document.createElement("a");
    fA.href = EXTERNAL;
    fA.target = "_blank";
    fA.rel = "noopener";
    fA.textContent = "edvibe.co.ke";
    var fMail = document.createElement("a");
    fMail.href = "mailto:contact@edvibe.co.ke";
    fMail.textContent = "contact@edvibe.co.ke";
    fLinks.appendChild(fA);
    fLinks.appendChild(document.createTextNode(" · "));
    fLinks.appendChild(fMail);
    var fCopy = document.createElement("p");
    fCopy.className = "ev-footer-copy";
    fCopy.textContent = "© " + year + " The Edvibe Team";
    footer.appendChild(fBrand);
    footer.appendChild(fTag);
    footer.appendChild(fLinks);
    footer.appendChild(fCopy);

    /* ---------- reading progress bar ---------- */
    var progress = document.createElement("div");
    progress.className = "ev-progress";
    progress.setAttribute("aria-hidden", "true");
    var progressBar = document.createElement("div");
    progressBar.className = "ev-progress-bar";
    progress.appendChild(progressBar);

    /* ---------- back to top ---------- */
    var toTop = document.createElement("button");
    toTop.className = "ev-to-top";
    toTop.type = "button";
    toTop.setAttribute("aria-label", "Back to top");
    toTop.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5m0 0-6 6m6-6 6 6"/></svg>';
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    function onScroll() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var y = window.scrollY || doc.scrollTop || 0;
      progressBar.style.width = max > 0 ? ((y / max) * 100).toFixed(2) + "%" : "0%";
      if (y > 480) toTop.classList.add("is-visible");
      else toTop.classList.remove("is-visible");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    function attach() {
      var body = document.body;
      if (!body) return;
      if (body.querySelector(".fs, .fs-frame")) return;

      if (!body.querySelector(".ev-site-header")) body.insertBefore(header, body.firstChild);

      // footer: skip injection when the page already has a static legacy #footer
      // (which edvibe.css styles identically) to avoid stacked footers
      var hasLegacyFooter = body.querySelector("#footer");
      if (!body.querySelector(".ev-site-footer") && !hasLegacyFooter) body.appendChild(footer);

      if (!body.querySelector(".ev-progress")) body.insertBefore(progress, body.firstChild);
      if (!body.querySelector(".ev-to-top")) body.appendChild(toTop);
      onScroll();
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", attach);
    } else {
      attach();
    }
  } catch (e) {}
})();
