# Rindge elderly exemption: static site

Plain HTML/CSS with no JavaScript and no build server. All links are relative, so the folder can go on GitHub Pages as is.
Nothing here has been published.

## Edit figures in one place
**`data.json` is the single source of truth.** Every number on every page, every source, and the vote table live there.
Pages are generated from it, so never hand-edit the top-level `*.html` files. Edit `data.json` or the page text in
`_build/templates/*.html`, then rebuild:

    cd /workspace/rindge-elderly/site
    python3 _build/build.py              # regenerates the charts, all 7 pages and data.csv
    python3 _build/build.py --no-charts  # pages + data.csv only

- In templates, `{{f:ID}}` inserts a figure, `{{t:ID}}` inserts it as plain text (used in alt text), and `{{cite:SRC_ID|detail}}` inserts a linked source. `{{block:votes}}`, `{{block:sources}}` and `{{block:figures}}` generate the tables.
- The build stops if a page uses an unknown figure or source id, or if a figure has no source.
- `data.csv` is generated from `data.json` (one row per figure, with its source titles and URLs). Both are linked for download.
- Example: if the assessor confirms the married 2012 limit is $50,000, change `inc_married` in `data.json` (its `value` and `display`). Then also update the derived rows that depend on it (`exact_married`, `married_in_2012_dollars`, `prop_married` if the rounding changes), and rebuild. If the September 2026 CPI-U is 335.895 or higher, update `prop_single` / `prop_married` to $51,500 / $72,000 and `cpi_2026_08` and the derived CPI rows.
- Charts: `_build/charts_web.py` draws them with `../design/charts.py` (the same style as the print graphics), fed from `data.json`.
  Output: `assets/img/chart-income-limits.png` and `assets/img/chart-recipients.png` (792 px wide, shown at up to 660 px).
- `_build/seed_data.py` only created the first `data.json`. Don't rerun it (it refuses to unless you pass `--force`).

## Preview, screenshots, link check

    cd /workspace/rindge-elderly/site && python3 -m http.server 8765 --bind 127.0.0.1   # then open http://127.0.0.1:8765/
    python3 _build/screenshots.py          # mobile (390 px) + desktop (1366 px) screenshots into _preview/
    python3 _build/linkcheck.py --external # local files and #anchors must exist; external links are fetched and reported

## Folder notes
- `sources/`: copies of public source documents (Rindge annual reports 2011, 2012, 2020, 2021, 2022, 2024 and 2025; Select Board minutes of Oct. 8 and Oct. 22, 2025; the New Ipswich 2026 application; the CPI-U series; text snapshots of the RSAs). About 85 MB in total; the largest is the 2012 report at 38 MB, under GitHub's 100 MB per-file limit. Pre-2010 Rindge reports link to Internet Archive scans.
- Folders that start with `_` (`_build`, `_preview`) are skipped by GitHub Pages' default Jekyll build, so they won't be published. Don't add `.nojekyll` unless you want them served.
- Fonts: Newsreader and IBM Plex Sans Condensed, subset WOFF files under the SIL Open Font License (`assets/fonts/FONTS-LICENSE.txt`).
- Placeholders: the "how to sign" contact (visible on proposal.html; commented out on index.html), and the "paid for by" line (an HTML comment in the footer, set in `_build/build.py`, `LAYOUT`).
  The 2025 town tax paragraph on proposal.html#town-tax-2025 follows the approved column wording. It never calls the $437,615 a "surplus" and never says it covers the cost or can be appropriated.
- Not posted: the author's private working documents (the warrant-article v2 PDF, which is marked "Private working document", the history report, the research notes and the column draft). Their figures are cited here to the underlying public sources instead.

## Open items (internal; not shown on the public pages)
Status: **DRAFT - pending fact check** (a banner on every page, set in `_build/build.py`, `LAYOUT`). Fact check: `../factcheck-op-ed.md`.
- **September 2026 CPI-U** (out mid-October): if it is **335.895 or higher**, the rounded limits become **$51,500 / $72,000**. Update `prop_single`, `prop_married`, `cpi_2026_08` and the derived CPI rows (`cpi_factor`, `cpi_rise`, `exact_*`, `lost_income`, `single_in_2012_dollars`, `married_in_2012_dollars`, `lost_2006`) in `data.json`, then rebuild. Also update the warrant text on proposal.html (it uses the same tokens, so it updates automatically) and `../design/charts.py`.
- **Married limit**: $49,000 is VERIFIED (Taylor, Oct. 11, 2026), citing the 2012 Art. 20 vote and the 2025 MS-1. The 2020 MS-1's $50,000 appears as a footnote on limits.html only, behind `SHOW_2020_FOOTNOTE` in `_build/build.py` (one line to drop it).
- **September CPI**: if Sept 2026 CPI-U >= 335.895 the limits become $51,500 / $72,000 (`alt_single`, `alt_married`; public note on proposal.html#sept-cpi). Edit `prop_single`/`prop_married` and the derived rows in `data.json`.
- **Disabled exemption linkage**: Rindge's 2007 Art. 21 gave the disabled exemption the elderly income and asset limits, and the 2012 petition raised both. The town attorney or DRA should confirm that an elderly-only article leaves the disabled limits alone. The site says only that the article "is written to change only the elderly exemption."
- **Overlay**: the 2025 overlay amount was never published. Ask for the DRA 2025 tax-rate calculation, page 2, which would settle it. The site gives only the $400,000 to $500,000 range discussed by the Select Board and says any leftover is uncertain.
- **2021**: the ballot-day count was removed from the site and data after legal review; the site shows only the deliberative-session amendment (18 to 6) and that the limits were unchanged.
- **Intermediate recipient counts** (2021: 92, 2022: 89, 2023: 88, 2024: 44) are in `../surplus-analysis.md` §6 (some from scanned pages). They are not used on the site or in the charts yet. If they are added, put them in `data.json` and in `RECIPIENTS` in `_build/charts_web.py` and `../design/charts.py`.

## Pages, petition, forms, supporter wall

- Pages (templates in `_build/templates/`): index, timeline (every vote 1976-2022 plus 2027 dates), limits, recipients, inflation, votes, proposal (full article + cost calculator `assets/calc.js`, with a no-JS table), tax2025, neighbors, law, faq, sign, support, visit, supporters, sources, evidence.
- Pending figures render with a dotted underline and a "(pending fact check)" screen-reader note, driven by `fact_check` in `data.json`.
- Article text lives once in `_build/templates/_article.html`; it feeds the proposal page and the petition.
- Printable petition: `_build/templates/_petition.html` → `petition/rindge-elderly-exemption-petition.pdf` (2 sheets, letter, full article on every sheet, 12 signature lines each, blank primary-petitioner line). Rebuilt by `build.py`. Still says "DRAFT – NOT FOR SIGNATURE"; remove that line from `_petition.html` only when the article text is final.
- Two forms, both placeholders until connected: **Add your support** (`support.html` / `assets/support.js`: name, town, optional email, required resident-or-voter box, UNCHECKED public-name opt-in) and **Request a home visit** (`visit.html` / `assets/visit.js`, no public-name opt-in). Each has `action="FORM_ENDPOINT"` and `data-endpoint-ready="false"` are placeholders. JS validates and shows a "not yet connected" notice; without JS a `<noscript>` notice shows. No online signing anywhere.
- Supporter wall: `supporters.json`. Only entries with `"approved": true` are listed, and only `name` and `town` (the build fails if an entry has any other field except `approved`/`sample`). The count shown comes from the separate `count` number (all real sign-ups, opt-in or not); while `count_is_sample` is true the page shows "Sample (0)". Never put address, phone or email in this file.

## Domain, SEO and sharing

- Served at https://elderlyexemption.com via GitHub Pages. `CNAME` (exactly `elderlyexemption.com`) is written by the build. Page-to-page links stay relative; only canonical, Open Graph and sitemap URLs are absolute (they must be).
- `build.py` top: `SITE_URL`, `DRAFT`, `SHARE_IMG`. Every page gets a canonical link, Open Graph/Twitter tags and the 1200x630 share image `assets/img/share.png` (made from the income-limits chart by `charts_web.py`).
- `sitemap.xml` and `robots.txt` are generated. robots.txt is `Disallow: /` while `DRAFT = True` (matching the deployed copy) and opens up when DRAFT is off.
- While `DRAFT = True`, every page carries `<meta name="robots" content="noindex, nofollow">`. The petition print page is always noindex.

## Pre-launch checklist

- [ ] **Remove noindex**: set `DRAFT = False` in `_build/build.py` (drops the robots noindex meta), and remove the DRAFT banner from `LAYOUT` once the fact check is closed. Rebuild and confirm no page contains `noindex`.
- [ ] **Remove all sample entries from `supporters.json`** (every entry with `"sample": true`), set `count` to the real number and `count_is_sample` to `false`. Rebuild.
- [ ] Set a real removal contact on `supporters.html` (replace `[REMOVAL CONTACT TO BE ADDED]`).
- [ ] Supporter count: the home page and supporters.html show `count` from `supporters.json` labeled 'Supporters, not petition signatures'. It must count only real, reviewed sign-ups from the Add your support form; it shows 0 until connected, and sample names keep their SAMPLE tags until removed.
- [ ] Connect BOTH forms (support.html and visit.html): set `FORM_ENDPOINT`, map field names, set `data-endpoint-ready="true"`, submit a test, confirm the opt-in box arrives unchecked by default and only opt-ins reach the wall after review.
- [ ] Fill in `sign.html` places and times; add petition return instructions.
- [ ] Clear every `pending` figure in `data.json` (or accept it as pending) before removing the DRAFT banner.
- [ ] In the GitHub repo settings, set the custom domain to elderlyexemption.com, add the DNS records GitHub lists, and turn on Enforce HTTPS. Check the share preview with a link-preview tool.
- [ ] Remove "DRAFT – NOT FOR SIGNATURE" from the petition once the article text is final.
- [ ] Decide on the "paid for by" footer line (commented placeholder in `build.py` LAYOUT).

## Visual design (Oct 2026 redesign)

- Styles: `assets/style.css` (warm palette, WCAG AA; colour is always paired with a pattern, outline, label or text tag). Font: self-hosted Inter (`assets/fonts/inter*.woff2`, SIL OFL), no CDN. The petition PDF and the newspaper files in `../design/` still use Newsreader / IBM Plex and were not touched.
- Charts: hand-built inline SVG made at build time by `_build/svgcharts.py` from `data.json` (no chart library, works without JS). Each chart has a legend, a source line, a "Show the data table" toggle and a CSV in `assets/data/`. `assets/charts.js` only adds hover/focus tooltips and a short entry animation (off under prefers-reduced-motion). Axes start at zero; pending values get a dashed purple outline/ring plus a "pending" label. The PNG charts in `assets/img/` are still built for the share image.
- Presentation-only additions are made in `enhance()` in `build.py`: "In brief" summary box (the page's existing dek, or the page description on the FAQ), Estimate/Pending tags on key-number cards, `{{callouts:id,...}}` cards that show a figure's display value and its data.json label.
- Checks: `python3 _build/textcheck.py compare` (no old page text missing; data.json unchanged; baseline in `_build/_textcheck/`), `NODE_PATH=/tmp/a11y/node_modules node _build/a11y.js` (axe-core; needs `npm i puppeteer-core axe-core` in /tmp/a11y), `python3 _build/linkcheck.py`. Screenshots use reduced motion so the charts are captured fully drawn.

## Round 2 (Oct. 11, 2026): sync, evidence, viewer, data PDFs, nav, forms, gap fill

- **Excerpts**: `_build/excerpts.py` cuts the relevant pages of large town reports into `sources/*-excerpt.pdf` (pages listed in `EXCERPT_PAGES` in `_build/evidence_spec.py`, e.g. the 2012 report = original pdf pp. 19-24) and renders viewer page images to `assets/viewer/`. Each source links to the town's full original.
- **Evidence**: `_build/evidence_spec.py` (crop + highlight per item) -> `_build/evidence_images.py` -> `assets/evidence/*.jpg`; typed text in `_build/evidence_transcripts.py`; quote-check list `_build/evidence-quotes.md` (written by `_build/quotes.py` on every build). No newspaper pages are embedded.
- **Viewer**: `assets/viewer.js` (zoom, pan, pinch, arrows, Esc, focus trap, Download). Without JS the links open the file.
- **Data PDFs**: `assets/data/chart-*.pdf` and `assets/data/all-figures.pdf`, made from `data.json` by `make_data_pdfs()` in `_build/extras.py`.
- **Navigation**: grouped menu (Facts / The Proposal / Get Involved / Sources), `assets/nav.js`, sticky "How to sign" button. Previews `_preview/nav-*.png`.
- **Neighbors**: `python3 _build/load_neighbors.py` loads `../neighbors-verified.json` into `data.json` (figures `nbx_*`, sources, `neighbors.rows`). Only the NH towns bordering Rindge are shown (Fitzwilliam, Jaffrey, New Ipswich, Sharon; checked against Census TIGER/Line 2024 county subdivisions and Wikipedia). Values from the DRA tax-year-2024 summary carry a "DRA 2024" tag; a field missing from the file shows "Data not yet verified"; status "unconfirmed" shows an Unconfirmed tag. Edit `BORDER` in the loader to change the list. Jaffrey and New Ipswich pages open in the viewer; DRA and town web pages are linked only.
- **Attorney list**: `SHOW_ATTORNEY_LIST = False` in `_build/build.py`. When off, law.html says only "The article was drafted to follow RSA 72:27-a and 72:39-b." To show it, set the flag to True and build with `ATTORNEY_LIST=<path to the list>`; the list itself is kept outside this folder.
