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

    function attach() {
      var body = document.body;
      if (!body) return;
      if (body.querySelector(".fs, .fs-frame")) return;
      if (!body.querySelector(".ev-site-header")) body.insertBefore(header, body.firstChild);
      if (!body.querySelector(".ev-site-footer")) body.appendChild(footer);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", attach);
    } else {
      attach();
    }
  } catch (e) {}
})();
