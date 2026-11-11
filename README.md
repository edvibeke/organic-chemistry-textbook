# The Virtual Textbook of Organic Chemistry

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Static Site](https://img.shields.io/badge/site-static%20HTML%2FCSS%2FJS-blue.svg)](#technology)
[![No Build Step](https://img.shields.io/badge/build-none%20required-success.svg)](#getting-started)

A comprehensive, interactive textbook covering the topics normally taught in a
college sophomore-level organic chemistry course — with molecular models,
animations, spectroscopy tools, and hundreds of self-checking practice problems.
The whole thing is plain, self-contained **HTML/CSS/JavaScript** and runs in any
modern browser with no server or build step.

> This repository bundles two companion sites:
> **`virttxtjml/`** — the full interactive textbook, and
> **`OrgPage/`** — a quick-reference collection of organic chemistry data tables.

---

## Table of Contents

- [Overview](#overview)
- [What's Inside](#whats-inside)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Features](#features)
- [Molecular Models & the Viewer](#molecular-models--the-viewer)
- [Practice Problems](#practice-problems)
- [Technology](#technology)
- [Browser Support](#browser-support)
- [Content Map](#content-map)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

---

## Overview

This project began as **William Reusch's _Virtual Textbook of Organic Chemistry_**
(Michigan State University) — one of the earliest and most widely used open
organic chemistry textbooks on the web. It has since been maintained and
refreshed by **The Edvibe Team**, which modernized the markup, added a
responsive layout, a light/dark theme, and a modern visual design while
preserving the original educational content.

It is designed to be:

- **Free and open** — no login, no paywall, no tracking.
- **Interactive** — molecular structures you can rotate, reactions you can step
  through, and problems that check your answers as you work.
- **Self-contained** — every page is static HTML that works from a local folder
  or any static host (GitHub Pages, Netlify, a USB stick, etc.).
- **Durable** — no framework churn and no dependency installs; just open a file.

---

## What's Inside

| Area | Folder | What you'll find |
| --- | --- | --- |
| Interactive textbook | [`virttxtjml/`](virttxtjml) | Full course text, chapter by chapter, with embedded models, animations and problems |
| Data tables & references | [`OrgPage/`](OrgPage) | Acidity/basicity constants, bond energies, solvents, NMR data, amino acids, periodic table, and more |
| Molecular viewer | [`virttxtjml/htmlJ/jsmol/`](virttxtjml/htmlJ/jsmol) | JavaScript (JSmol) molecular model viewer |
| Practice problems | [`virttxtjml/Questions/`](virttxtjml/Questions) | Interactive problem sets, a molecular editor, and multiple-choice collections |
| Spectroscopy | [`virttxtjml/Spectrpy/`](virttxtjml/Spectrpy) | MS, UV-Vis, IR and NMR modules |
| Shared theme | `virttxtjml/Styles/`, `OrgPage/Styles/` | Edvibe design system, bundled fonts, dark-mode script |

**At a glance:** ~370 HTML pages, ~1,700 images and diagrams, plus JavaScript
model viewers and problem tools — roughly 21 MB of self-contained static content.

---

## Repository Structure

```text
.
├── README.md
├── virttxtjml/                 # The interactive virtual textbook
│   ├── index.htm               # Textbook home page (start here)
│   ├── textindx.htm            # Table of contents in "textbook" order
│   ├── intro1b.htm …           # Alphabetical index
│   ├── intro2.htm, intro3.htm  # Structure, bonding, shape, resonance
│   ├── nomen1.htm …            # Nomenclature
│   ├── sterisom.htm …          # Stereochemistry
│   ├── react1.htm …            # Reactivity & mechanisms
│   ├── addene1.htm …           # Alkenes, alkynes, dienes
│   ├── alhalrx1.htm …          # Alkyl halides (SN1/SN2, E1/E2)
│   ├── alcohol1.htm …          # Alcohols, ethers, phenols
│   ├── benzrx1.htm …           # Aromatic chemistry
│   ├── aldket1.htm …           # Aldehydes & ketones
│   ├── crbacid1.htm …          # Carboxylic acids & derivatives
│   ├── biomol.htm …            # Biomolecules (carbohydrates, lipids, proteins, nucleic acids)
│   ├── polymers.htm, pericycl.htm, photchem.htm, orgmetal.htm, …
│   ├── Images/ … Images4/      # Diagrams and figures
│   ├── Questions/              # Practice problems, molecular editor, quizzes
│   ├── Spectrpy/               # Mass spec, UV-Vis, IR, NMR
│   ├── Intro/                  # "For the Novice" gentle introduction
│   ├── htmlJ/jsmol/            # JSmol molecular model viewer
│   ├── Jmol-11/                # Legacy Jmol applet resources
│   ├── Styles/                 # Edvibe theme, fonts, dark-mode script
│   ├── mechism/, symmetry/, ZiegNatta/, virtualdemo/
│   └── …
└── OrgPage/                    # Quick-reference data tables
    ├── tables.htm              # Data tables index
    ├── acidity.htm, acidity2.htm, basicity.htm
    ├── bndenrgy.htm            # Bond energies
    ├── solvent.htm             # Common solvents
    ├── equienr.htm, confengy.htm
    ├── nmr.htm, mass.htm
    ├── aminoacids.htm, carbohyd.htm
    ├── periodic.htm, cnvcalc.htm, tspace.htm
    ├── web_pages.htm           # Curated external links
    ├── Images/                 # Table figures
    └── Styles/                 # Shared theme
```

---

## Getting Started

There is **nothing to install and nothing to compile**. Pick whichever method
suits you.

**Option 1 — Open directly**

```bash
# Open the textbook home page in your default browser
xdg-open virttxtjml/index.htm      # Linux
open virttxtjml/index.htm          # macOS
start virttxtjml\index.htm         # Windows
```

**Option 2 — Serve locally (recommended)**

Some browsers restrict features on `file://` URLs. A tiny local server avoids
that entirely:

```bash
# From the repository root
python3 -m http.server 8000
# then visit http://localhost:8000/virttxtjml/index.htm
```

**Option 3 — Publish it**

Because it is a static site, you can drop the folders onto any static host. To
enable **GitHub Pages**: _Settings → Pages → Build and deployment → Deploy from a
branch_, choose the branch and the `/ (root)` folder. The textbook will then be
served at `https://<user>.github.io/<repo>/virttxtjml/index.htm`.

---

## Features

- **Full course coverage** — bonding, nomenclature, stereochemistry, reaction
  mechanisms, functional-group chemistry, spectroscopy, biomolecules, polymers,
  pericyclic reactions, photochemistry, organometallics and synthesis.
- **Interactive 3-D molecular models** — rotate, zoom and inspect structures
  with the built-in JSmol viewer.
- **Animated reaction mechanisms** — curved-arrow and stepwise mechanistic
  illustrations.
- **Self-checking practice problems** — immediate feedback across every chapter,
  plus a drawing-based **molecular editor**.
- **Spectroscopy modules** — mass spectrometry, UV-Vis, IR and NMR.
- **Alphabetical and textbook-style indexes** — reach any topic from either the
  contents list or the A–Z index.
- **Data tables** — acidity/basicity, bond energies, solvent properties, NMR
  shifts, amino acids and more (`OrgPage/`).
- **Responsive + light/dark theme** — a modern Edvibe design that works on
  phones, tablets and desktops; toggle the theme with the sun/moon button.

---

## Molecular Models & the Viewer

Two generations of structure viewer are present:

- **JSmol (recommended, modern)** — a pure-JavaScript molecular viewer in
  [`virttxtjml/htmlJ/jsmol/`](virttxtjml/htmlJ/jsmol). It needs no plugins and
  works in current browsers.
- **Legacy Jmol applet** — older pages may reference the Java applet in
  [`virttxtjml/Jmol-11/`](virttxtjml/Jmol-11). Java applets are no longer
  supported by modern browsers; if an older page asks for Java, use the
  JavaScript viewer instead (linked from the home page as **Molecular Model
  Viewer**).

---

## Practice Problems

The problem collection is the heart of the "interactive" experience.

- **Browse all problems:** [`virttxtjml/Questions/problems.htm`](virttxtjml/Questions/problems.htm)
- **Multiple-choice collection:** `virttxtjml/Questions/problems/`
- **Molecular editor practice:** `virttxtjml/Questions/MOLEDITOR/practice.htm`
- **Reaction-selection drills:** `virttxtjml/Questions/RxChoose/rxindex.htm`

Problems are organized by topic (acidity, alcohols, nomenclature, stereochemistry,
spectroscopy, synthesis, rearrangements, and more) under
`virttxtjml/Questions/`.

---

## Technology

| Layer | Details |
| --- | --- |
| Markup | Hand-written **HTML** (`.htm`) |
| Styling | **CSS** with a design-token system (`edvibe.css`), plus legacy stylesheets |
| Interactivity | **Vanilla JavaScript** (`edvibe.js`), no framework |
| Fonts | Self-hosted **Inter** and **Space Grotesk** (`.woff2`) |
| 3-D models | **JSmol** (JavaScript) and legacy **Jmol** (Java) |
| Build tooling | **None** — the source is the artifact |

The `Styles/` folders hold the shared Edvibe theme. It defines CSS custom
properties for color, spacing, radius and shadow, ships both a light and dark
palette (`html[data-theme="dark"]`), and is loaded by every modernized page.

---

## Browser Support

- **Best experience:** any current Chrome, Firefox, Edge or Safari, at any screen
  size.
- **Dark mode:** use the sun/moon toggle in the page header.
- **Legacy note:** a handful of original pages rely on the Java-based Jmol applet
  and on old browser-specific markup. Modern browsers have dropped Java plugin
  support, so prefer the JavaScript molecular viewer where offered.

---

## Content Map

The textbook follows this rough progression (each item links into
`virttxtjml/`):

1. **Fundamentals** — structure & bonding; shape, isomers & resonance; physical
   properties and intermolecular forces.
2. **Reactivity & nomenclature** — reaction classification, mechanisms,
   energetics, acid–base behavior, IUPAC naming.
3. **Stereochemistry** — chirality, configuration, conformation, optical
   activity, resolution.
4. **Functional-group chemistry** — alkenes & alkynes, alkyl halides
   (S<sub>N</sub>1/S<sub>N</sub>2, E1/E2), alcohols/ethers/phenols, aromatics,
   amines, aldehydes & ketones, carboxylic acids & derivatives.
5. **Analysis** — mass spectrometry, UV-Vis, IR and NMR.
6. **Special topics** — biomolecules, synthetic polymers, heterocycles,
   organometallics, free radicals, pericyclic reactions, photochemistry,
   rearrangements, and modern synthesis.

A complete list lives in [`virttxtjml/textindx.htm`](virttxtjml/textindx.htm)
and the [alphabetical index](virttxtjml/intro1b.htm).

---

## Contributing

Corrections, typo fixes and improvements are welcome.

1. Fork the repository and create a branch.
2. Make your change — keep it consistent with the existing plain HTML/CSS/JS
   style and the Edvibe theme tokens.
3. Test the affected pages in a browser (preferably via a local server, see
   [Getting Started](#getting-started)).
4. Open a pull request describing what you changed and why.

Please keep the educational content faithful to the original text and preserve
the non-commercial, share-alike licensing of derivative material.

---

## License

This work is licensed under a
**[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
(CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/)**.

You are free to **share** and **adapt** the material for non-commercial purposes,
provided you give appropriate **attribution** and distribute your contributions
under the **same license**. See the license link above for the full terms.

---

## Credits

- **Original author:** William Reusch — *The Virtual Textbook of Organic Chemistry*,
  Michigan State University.
- **Maintained and modernized by:** **The Edvibe Team**.
- **Molecular editor:** based on the editor created by **Peter Ertl**.
- **Molecular viewer:** **Jmol** / **JSmol** (open-source, [jmol.sourceforge.net](https://jmol.sourceforge.net)).
- Provided to the **IOCD** to assist capacity building in chemical education.

Comments, questions and error reports: **contact@edvibe.co.ke**.
