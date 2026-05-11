// Tailwind extra lessons (10-20) — 11 lecții

const tailwindMore = [
  {
    slug: "tailwind-grid-avansat",
    title: "10. Grid avansat (placement, span)",
    order: 10,
    theory: [
      { order: 1, title: "Grid placement", content: "```html\n<div class=\"grid grid-cols-3 grid-rows-3 gap-4\">\n  <!-- Span pe coloane -->\n  <div class=\"col-span-2\">2 coloane</div>\n  <div class=\"col-span-1\">1 coloană</div>\n\n  <!-- Span pe rânduri -->\n  <div class=\"row-span-2\">2 rânduri</div>\n  <div>Normal</div>\n\n  <!-- Start explicit -->\n  <div class=\"col-start-2 col-end-4\">col 2-3</div>\n</div>\n```\n\n• `col-span-{n}` — extinde pe n coloane\n• `row-span-{n}` — extinde pe n rânduri\n• `col-start-{n}` / `col-end-{n}` — plasare exactă" },
      { order: 2, title: "Auto placement și dense", content: "```html\n<!-- Items cu dimensiuni variate (masonry-like) -->\n<div class=\"grid grid-cols-4 gap-4 auto-rows-[200px]\">\n  <div class=\"col-span-2 row-span-2\">Mare</div>\n  <div>Mic</div>\n  <div>Mic</div>\n  <div class=\"col-span-2\">Wide</div>\n</div>\n\n<!-- Umplere densă (grid-auto-flow: dense) -->\n<div class=\"grid grid-cols-3 gap-2 grid-flow-dense\">\n  <div class=\"col-span-2\">Wide</div>\n  <div>1</div>  <!-- umple spațiu liber -->\n  <div>2</div>\n</div>\n```" },
    ],
    tasks: [
      { number: 1, name: "col-span-2", question: "Ce face col-span-2 pe un grid item?", options: ["2 grids", "Se extinde pe 2 coloane", "Margin", "Disabled"], answer: "Se extinde pe 2 coloane", explanation: "col-span-{n} = colspan CSS grid. row-span-{n} pentru rânduri.", difficulty: "easy" },
      { number: 2, name: "col-start", question: "Ce face col-start-2?", options: ["Al doilea grid", "Elementul începe de pe coloana 2", "Skip", "Class"], answer: "Elementul începe de pe coloana 2", explanation: "col-start + col-end permite plasare exactă. Combinat cu span sau end.", difficulty: "medium" },
      { number: 3, name: "auto-rows", question: "Ce face auto-rows-[200px]?", options: ["Max height", "Fiecare rând creat automat are 200px înălțime", "Fixed total", "Error"], answer: "Fiecare rând creat automat are 200px înălțime", explanation: "Arbitrary value în bracket []. Util pentru galerii cu înălțime fixă.", difficulty: "medium" },
      { number: 4, name: "grid-flow-dense", question: "Ce face grid-flow-dense?", options: ["Dens compact", "Algoritmul umple spații libere cu items mici", "Animație", "Overflow"], answer: "Algoritmul umple spații libere cu items mici", explanation: "Fără dense, items sunt plasate în ordine. Cu dense, grid umple spații lăsate de items mari.", difficulty: "hard" },
    ],
  },
  {
    slug: "tailwind-borders-radius",
    title: "11. Borders și Border Radius",
    order: 11,
    theory: [
      { order: 1, title: "Border utility classes", content: "```html\n<!-- Border pe toate laturile -->\n<div class=\"border border-gray-300\">Default 1px</div>\n<div class=\"border-2 border-blue-500\">2px albastru</div>\n<div class=\"border-4 border-dashed border-red-400\">4px dashed</div>\n\n<!-- Direcționale -->\n<div class=\"border-t-2 border-b border-gray-300\">Sus 2px, jos 1px</div>\n<div class=\"border-l-4 border-blue-600\">Stânga 4px</div>\n\n<!-- Fără border -->\n<div class=\"border-0\">Fără border</div>\n<div class=\"border border-t-0\">Fără sus</div>\n```" },
      { order: 2, title: "Border radius", content: "```html\n<div class=\"rounded\">4px (default)</div>\n<div class=\"rounded-md\">6px</div>\n<div class=\"rounded-lg\">8px</div>\n<div class=\"rounded-xl\">12px</div>\n<div class=\"rounded-2xl\">16px</div>\n<div class=\"rounded-full\">9999px (cerc/pill)</div>\n<div class=\"rounded-none\">0px</div>\n\n<!-- Parțial -->\n<div class=\"rounded-t-lg\">Sus rotunjit</div>\n<div class=\"rounded-br-xl\">Dreapta-jos 12px</div>\n<div class=\"rounded-tl-full rounded-br-full\">Diagonale</div>\n```" },
    ],
    tasks: [
      { number: 1, name: "border-2", question: "Ce face border-2?", options: ["2 border-uri", "Grosime border 2px pe toate laturile", "Opacity", "Shadow"], answer: "Grosime border 2px pe toate laturile", explanation: "Gradație: border (1px), border-2 (2px), border-4 (4px), border-8 (8px).", difficulty: "easy" },
      { number: 2, name: "rounded-full", question: "Pe un element pătrat, ce face rounded-full?", options: ["Elipsă", "Cerc (border-radius: 9999px)", "Ascunde", "Rotire"], answer: "Cerc (border-radius: 9999px)", explanation: "Pe rectangle face pill shape. Pe pătrat face cerc. 9999px > orice dimensiune posibilă.", difficulty: "easy" },
      { number: 3, name: "border-dashed", question: "Ce face border-dashed?", options: ["Border rupt", "Schimbă stilul liniei la dashed (liniuțe)", "Delete border", "Animație"], answer: "Schimbă stilul liniei la dashed (liniuțe)", explanation: "Border styles: solid (default), dashed, dotted, double. Combini cu border și border-color.", difficulty: "easy" },
      { number: 4, name: "rounded-tl", question: "Ce face rounded-tl-xl?", options: ["Rotunjit total", "Rotunjit doar colțul top-left cu 12px", "Nu există", "Animație"], answer: "Rotunjit doar colțul top-left cu 12px", explanation: "Corners: tl (top-left), tr, br, bl. Util pentru design-uri asimetrice.", difficulty: "medium" },
    ],
  },
  {
    slug: "tailwind-spacing-sizing",
    title: "12. Spacing și sizing avansat",
    order: 12,
    theory: [
      { order: 1, title: "Valori responsive și arbitrare", content: "```html\n<!-- Margin și padding cu scale normală -->\n<div class=\"p-4 px-6 py-2 m-auto mt-8\">...</div>\n\n<!-- Valori arbitrare (orice) -->\n<div class=\"p-[13px] m-[2.5rem] w-[342px]\">...</div>\n\n<!-- Negativ -->\n<div class=\"-mt-4\">Margin negativ sus</div>\n<div class=\"-ml-2\">Margin negativ stânga</div>\n\n<!-- Sizing -->\n<div class=\"w-full h-screen\">Full width, viewport height</div>\n<div class=\"w-1/2 h-1/3\">50% și 33%</div>\n<div class=\"w-fit\">Fit content</div>\n<div class=\"w-max\">Max content</div>\n<div class=\"w-min\">Min content</div>\n<div class=\"size-10\">w-10 și h-10 împreună</div>\n```" },
      { order: 2, title: "Min/max și logical properties", content: "```html\n<div class=\"min-w-0 max-w-prose\">Text maxim 65ch</div>\n<div class=\"min-h-screen\">Min viewport height</div>\n<div class=\"max-h-64 overflow-y-auto\">Scroll la 256px</div>\n\n<!-- Logical (LTR/RTL safe) -->\n<div class=\"ms-4\">Margin inline-start (LTR=left, RTL=right)</div>\n<div class=\"me-4\">Margin inline-end</div>\n<div class=\"ps-6 pe-4\">Padding inline-start/end</div>\n\n<!-- Size shorthand (Tailwind v3.3+) -->\n<div class=\"size-full\">width și height: 100%</div>\n<div class=\"size-[300px]\">300×300</div>\n```" },
    ],
    tasks: [
      { number: 1, name: "p-[13px]", question: "Ce face p-[13px]?", options: ["Bug", "Padding 13px pe toate laturile (valoare arbitrară)", "p mod 13", "CSS var"], answer: "Padding 13px pe toate laturile (valoare arbitrară)", explanation: "Bracket = arbitrary value. Util pentru valori non-standard.", difficulty: "easy" },
      { number: 2, name: "-mt-4", question: "Ce face -mt-4?", options: ["Eroare", "Margin-top negativ (-1rem)", "Shadow", "Z-index"], answer: "Margin-top negativ (-1rem)", explanation: "Prefix - adaugă semn negativ. Util pentru overlaps și offset-uri.", difficulty: "medium" },
      { number: 3, name: "size-10", question: "Ce face size-10?", options: ["Font size 10", "width: 2.5rem și height: 2.5rem simultan", "10px total", "Screen size"], answer: "width: 2.5rem și height: 2.5rem simultan", explanation: "Shorthand nou — evită scrierea w-10 h-10 separat.", difficulty: "medium" },
      { number: 4, name: "max-w-prose", question: "Ce face max-w-prose?", options: ["Italic", "Lățime maximă 65ch (ideal pt citire)", "No max", "65px"], answer: "Lățime maximă 65ch (ideal pt citire)", explanation: "Optimum reading line-length. max-w-sm/md/lg/xl pentru breakpoint-uri specifice.", difficulty: "hard" },
    ],
  },
  {
    slug: "tailwind-typography-plugin",
    title: "13. Typography plugin (@tailwindcss/typography)",
    order: 13,
    theory: [
      { order: 1, title: "Instalare și utilizare", content: "```bash\nnpm install @tailwindcss/typography\n```\n\nÎn `globals.css` (Tailwind v4):\n```css\n@plugin \"@tailwindcss/typography\";\n```\n\n```html\n<!-- Stilizare automată a HTML-ului de la Markdown/CMS -->\n<article class=\"prose lg:prose-xl\">\n  <h1>Titlu</h1>\n  <p>Text formatat frumos...</p>\n  <ul><li>Item</li></ul>\n  <pre><code>cod</code></pre>\n</article>\n```\n\n**`prose`** aplică stiluri tipografice pentru tot conținutul HTML interior." },
      { order: 2, title: "Variante și personalizare", content: "```html\n<!-- Sizing -->\n<div class=\"prose prose-sm\">mic</div>\n<div class=\"prose prose-base\">default</div>\n<div class=\"prose prose-lg\">mare</div>\n<div class=\"prose prose-xl\">extra mare</div>\n<div class=\"prose prose-2xl\">extra-extra</div>\n\n<!-- Dark mode -->\n<div class=\"prose dark:prose-invert\">auto dark</div>\n\n<!-- Colorare link-uri -->\n<div class=\"prose prose-blue\">link-uri albastre</div>\n<div class=\"prose prose-pink prose-headings:text-purple-600\">\n  titluri violet\n</div>\n\n<!-- Specific modifiers -->\n<div class=\"prose prose-img:rounded-lg prose-a:no-underline\">\n  imagini rotunjite, linkuri fără underline\n</div>\n```" },
    ],
    tasks: [
      { number: 1, name: "prose scop", question: "Ce face clasa prose?", options: ["Proza romanului", "Stilizare tipografică automată pentru conținut HTML/Markdown", "Font serifat", "Animație"], answer: "Stilizare tipografică automată pentru conținut HTML/Markdown", explanation: "Util pentru blog posts, documente — resetează stilizarea h1-h6, p, ul, code etc.", difficulty: "easy" },
      { number: 2, name: "prose-invert", question: "Ce face dark:prose-invert?", options: ["Dark bg", "Inversează culorile typography pentru dark mode", "White text", "Disable"], answer: "Inversează culorile typography pentru dark mode", explanation: "Înlocuiește negru cu alb pentru text, adjustează contrastele.", difficulty: "easy" },
      { number: 3, name: "prose-blue", question: "Ce face prose-blue?", options: ["Blue bg", "Link-urile din prose sunt albastre", "H1 blue", "Toate albastru"], answer: "Link-urile din prose sunt albastre", explanation: "Modifică culoarea link-urilor implicite. Funcționează cu orice culoare din paleta Tailwind.", difficulty: "medium" },
      { number: 4, name: "prose-img:rounded", question: "Ce face prose-img:rounded-lg?", options: ["Imagini mici", "Imaginile din prose au border-radius large", "Comprimare", "Disable"], answer: "Imaginile din prose au border-radius large", explanation: "prose-{element}:class permite styling custom per element. Elemente: a, p, h1-h6, img, code etc.", difficulty: "hard" },
    ],
  },
  {
    slug: "tailwind-forms-plugin",
    title: "14. Forms plugin și design formulare",
    order: 14,
    theory: [
      { order: 1, title: "@tailwindcss/forms", content: "```bash\nnpm install @tailwindcss/forms\n```\n\n```css\n/* globals.css */\n@plugin \"@tailwindcss/forms\";\n```\n\nReset-ează stilul default al input-urilor (cross-browser uniform), pregătindu-le pentru stilizare cu Tailwind.\n\n```html\n<!-- Acum stilizezi normal cu Tailwind -->\n<input class=\"border border-gray-300 rounded-md px-3 py-2 w-full\n               focus:outline-none focus:ring-2 focus:ring-blue-500\n               focus:border-transparent\"\n  placeholder=\"Scrie ceva\" />\n\n<select class=\"border border-gray-300 rounded-md px-3 py-2 w-full\">\n  <option>Opțiune</option>\n</select>\n```" },
      { order: 2, title: "Pattern formular complet", content: "```html\n<form class=\"space-y-4 max-w-md mx-auto p-6 bg-white rounded-xl shadow\">\n  <div>\n    <label class=\"block text-sm font-medium text-gray-700 mb-1\">Email</label>\n    <input type=\"email\"\n      class=\"w-full border border-gray-300 rounded-lg px-4 py-2.5\n             focus:ring-2 focus:ring-blue-500 focus:border-blue-500\n             invalid:border-red-400 invalid:focus:ring-red-500\"\n    />\n  </div>\n\n  <button type=\"submit\"\n    class=\"w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium\n           hover:bg-blue-700 active:bg-blue-800\n           focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600\n           disabled:opacity-50 disabled:cursor-not-allowed\n           transition-colors\">\n    Trimite\n  </button>\n</form>\n```" },
    ],
    tasks: [
      { number: 1, name: "forms plugin", question: "Ce face @tailwindcss/forms?", options: ["Animații", "Reset cross-browser al input-urilor pentru stilizare uniformă", "Validare", "Layout"], answer: "Reset cross-browser al input-urilor pentru stilizare uniformă", explanation: "Fără plugin, input-urile arată diferit pe Chrome/Firefox/Safari. Plugin le normalizează.", difficulty: "easy" },
      { number: 2, name: "focus:ring", question: "Ce face focus:ring-2 focus:ring-blue-500?", options: ["Border", "Ring (outline) de 2px albastru la focus", "Shadow", "Transform"], answer: "Ring (outline) de 2px albastru la focus", explanation: "Ring e diferit de border — e outline. Mai vizibil și nu afectează layout-ul.", difficulty: "medium" },
      { number: 3, name: "invalid:", question: "Ce face invalid:border-red-400?", options: ["Eroare", "Aplică border roșu când input-ul NU trece validarea HTML5", "Disabled", "Focus"], answer: "Aplică border roșu când input-ul NU trece validarea HTML5", explanation: "Mapat pe pseudo-clasa CSS :invalid. Funcționează cu required, pattern, type=email etc.", difficulty: "medium" },
      { number: 4, name: "disabled:opacity", question: "Ce face disabled:opacity-50 pe button?", options: ["Disable", "Aplică opacity 50% când button-ul are atributul disabled", "Animație", "Ascunde"], answer: "Aplică opacity 50% când button-ul are atributul disabled", explanation: "Combini cu disabled:cursor-not-allowed pentru UX complet.", difficulty: "easy" },
    ],
  },
  {
    slug: "tailwind-animations",
    title: "15. Animații Tailwind",
    order: 15,
    theory: [
      { order: 1, title: "Animații built-in", content: "```html\n<!-- Loading states -->\n<div class=\"animate-spin\">⟳</div>\n<div class=\"animate-pulse bg-gray-200 h-4 rounded\">skeleton</div>\n<div class=\"animate-bounce\">↓</div>\n<div class=\"animate-ping relative\">\n  <div class=\"animate-ping absolute bg-blue-400 rounded-full h-4 w-4\"></div>\n  <div class=\"relative bg-blue-600 rounded-full h-4 w-4\"></div>\n</div>\n\n<!-- Fading -->\n<div class=\"animate-fade-in\">Fade in (v4)</div>\n```\n\n• `animate-spin` — spinner loader\n• `animate-pulse` — pulsare ușoară (skeleton screens)\n• `animate-bounce` — bouncing\n• `animate-ping` — radar/notification badge" },
      { order: 2, title: "Animații custom", content: "```css\n/* globals.css */\n@theme {\n  --animate-slide-up: slide-up 0.3s ease-out;\n  --animate-slide-down: slide-down 0.3s ease-in;\n}\n\n@keyframes slide-up {\n  from { transform: translateY(100%); opacity: 0; }\n  to { transform: translateY(0); opacity: 1; }\n}\n@keyframes slide-down {\n  from { transform: translateY(0); opacity: 1; }\n  to { transform: translateY(100%); opacity: 0; }\n}\n```\n\n```html\n<div class=\"animate-slide-up\">Intră de jos</div>\n```\n\nÎn Tailwind v4, animațiile custom se definesc în `@theme` cu prefix `--animate-`." },
    ],
    tasks: [
      { number: 1, name: "animate-pulse", question: "Când folosești animate-pulse?", options: ["Mereu", "Skeleton screens și loading placeholders", "Mereu la hover", "Error"], answer: "Skeleton screens și loading placeholders", explanation: "Simulează că conținut se încarcă. Pulsare ușoară care arată că 'ceva va veni'.", difficulty: "easy" },
      { number: 2, name: "animate-ping", question: "Clasic, animate-ping cum se folosește?", options: ["Singur", "Suprapus cu un element fix (relative+absolute) pentru badge de notificare", "Full screen", "Ascunde"], answer: "Suprapus cu un element fix (relative+absolute) pentru badge de notificare", explanation: "Un cerc pinge spre exterior (ca radar). Elementul vizibil rămâne static sub el.", difficulty: "hard" },
      { number: 3, name: "custom animation v4", question: "Cum definești animație custom în Tailwind v4?", options: ["@keyframes direct", "--animate-name în @theme + @keyframes", "plugin config", "JS"], answer: "--animate-name în @theme + @keyframes", explanation: "Pattern v4: --animate-slide-up: slide-up 0.3s; în @theme și @keyframes slide-up {...} separat.", difficulty: "hard" },
      { number: 4, name: "reduced-motion", question: "Cum respecți prefers-reduced-motion?", options: ["Nu se poate", "motion-reduce:animate-none sau @media în CSS custom", "Disable", "Random"], answer: "motion-reduce:animate-none sau @media în CSS custom", explanation: "motion-reduce: prefix aplică la OS prefer reduced motion. Important pentru a11y.", difficulty: "medium" },
    ],
  },
  {
    slug: "tailwind-dark-mode",
    title: "16. Dark Mode",
    order: 16,
    theory: [
      { order: 1, title: "Dark mode cu Tailwind", content: "Tailwind v4 folosește `dark:` variant automat cu `prefers-color-scheme`:\n\n```html\n<div class=\"bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100\">\n  <h1 class=\"text-gray-800 dark:text-white\">Titlu</h1>\n  <p class=\"text-gray-600 dark:text-gray-400\">Text mai gri</p>\n  <button class=\"bg-blue-600 dark:bg-blue-500 text-white\">Buton</button>\n</div>\n```\n\nAutomat urmărește setările OS. Fiecare element poate specifica ambele variante." },
      { order: 2, title: "Toggle manual (clasa)", content: "```html\n<!-- Tailwind v4: selector .dark pe html/body -->\n<html class=\"dark\">\n  <body class=\"bg-white dark:bg-gray-900\">\n    <!-- dark: aplică când html.dark există -->\n  </body>\n</html>\n```\n\n```jsx\n// Toggle cu JS\nfunction toggleDark() {\n  document.documentElement.classList.toggle('dark');\n  const isDark = document.documentElement.classList.contains('dark');\n  localStorage.setItem('theme', isDark ? 'dark' : 'light');\n}\n\n// La mount — citește preferința salvată\nconst saved = localStorage.getItem('theme');\nconst preferred = window.matchMedia('(prefers-color-scheme: dark)').matches;\nif (saved === 'dark' || (!saved && preferred)) {\n  document.documentElement.classList.add('dark');\n}\n```" },
    ],
    tasks: [
      { number: 1, name: "dark: prefix", question: "Ce face dark:bg-gray-900?", options: ["Mereu gri", "Background gri-900 când dark mode e activ", "Animație", "Shadow"], answer: "Background gri-900 când dark mode e activ", explanation: "dark: prefix aplică stilul în dark mode. Combinat cu varianta light: bg-white.", difficulty: "easy" },
      { number: 2, name: "prefers-color-scheme", question: "Cum detectezi preferința OS?", options: ["localStorage", "window.matchMedia('(prefers-color-scheme: dark)').matches", "dark() func", "Auto"], answer: "window.matchMedia('(prefers-color-scheme: dark)').matches", explanation: "API browser pentru preferința OS. Combinat cu localStorage pentru override manual.", difficulty: "medium" },
      { number: 3, name: "toggle class", question: "Cum activezi dark mode manual?", options: ["Imposibil", "Adaugi clasa dark pe <html>", "CSS var", "JS only"], answer: "Adaugi clasa dark pe <html>", explanation: "In Tailwind v4 cu selector mode, dark: se activează când elementul ancestor are clasa dark.", difficulty: "medium" },
      { number: 4, name: "persist", question: "Unde salvezi preferința dark/light?", options: ["Cookie", "localStorage (persist over sessions)", "Sesiune", "URL"], answer: "localStorage (persist over sessions)", explanation: "La reload citești localStorage și aplici clasa înainte de render pentru a evita flash.", difficulty: "medium" },
    ],
  },
  {
    slug: "tailwind-flexbox-avansat",
    title: "17. Flexbox avansat",
    order: 17,
    theory: [
      { order: 1, title: "Flex grow, shrink, basis", content: "```html\n<!-- Flex child sizing -->\n<div class=\"flex gap-4\">\n  <div class=\"flex-1\">Crește să umple (flex: 1 1 0)</div>\n  <div class=\"flex-none w-48\">Fix 192px, nu crește</div>\n  <div class=\"flex-auto\">Crește din dimensiunea content</div>\n</div>\n\n<!-- Ordine -->\n<div class=\"flex\">\n  <div class=\"order-3\">Primul în HTML, al 3-lea vizual</div>\n  <div class=\"order-1\">Al doilea în HTML, primul vizual</div>\n  <div class=\"order-2\">Al treilea → al doilea</div>\n</div>\n\n<!-- Self align -->\n<div class=\"flex items-start h-40\">\n  <div class=\"self-start\">Sus</div>\n  <div class=\"self-center\">Centru</div>\n  <div class=\"self-end\">Jos</div>\n  <div class=\"self-stretch\">Stretch</div>\n</div>\n```" },
      { order: 2, title: "Flex wrap și gap", content: "```html\n<!-- Wrapping -->\n<div class=\"flex flex-wrap gap-4\">\n  <div class=\"w-48\">Item (wraps)</div>\n  <div class=\"w-48\">Item</div>\n  <!-- La linie nouă -->\n</div>\n\n<!-- No wrap cu overflow scroll -->\n<div class=\"flex overflow-x-auto gap-4 no-scrollbar\">\n  <div class=\"flex-none w-48\">Card</div>\n  <!-- ... scroll horizontal -->\n</div>\n\n<!-- Gap responsive -->\n<div class=\"flex flex-wrap gap-2 md:gap-4 lg:gap-6\">\n  ...\n</div>\n```" },
    ],
    tasks: [
      { number: 1, name: "flex-1", question: "Ce face flex-1?", options: ["Un flex item", "flex: 1 1 0% — crește și se micșorează egal cu frații", "Width 1px", "Margin 1"], answer: "flex: 1 1 0% — crește și se micșorează egal cu frații", explanation: "flex-1 distribuie spațiu egal. flex-auto pornește de la dimensiunea conținutului.", difficulty: "medium" },
      { number: 2, name: "flex-none", question: "Ce face flex-none?", options: ["Invizibil", "flex: none — element nu crește și nu se micșorează", "Static", "Hidden"], answer: "flex: none — element nu crește și nu se micșorează", explanation: "Util pentru sidebar-uri sau elemente cu dimensiune fixă lângă conținut fluid.", difficulty: "easy" },
      { number: 3, name: "self-center", question: "Diferența items-center vs self-center?", options: ["Identice", "items-center aliniază toți copiii; self-center aliniază un singur item", "self mai vechi", "Bug"], answer: "items-center aliniază toți copiii; self-center aliniază un singur item", explanation: "self-* override-uiește alinierea pentru acel specific item.", difficulty: "medium" },
      { number: 4, name: "order-3", question: "Ce face order-3?", options: ["Al 3-lea div", "Schimbă vizual ordinea elementului (nu cel din DOM)", "Z-index", "Group"], answer: "Schimbă vizual ordinea elementului (nu cel din DOM)", explanation: "DOM rămâne la fel (pt a11y). Vizual se mută. Default order = 0.", difficulty: "medium" },
    ],
  },
  {
    slug: "tailwind-states-variants",
    title: "18. Stări avansate (hover, focus, group, peer)",
    order: 18,
    theory: [
      { order: 1, title: "Group și group-hover", content: "Stilizează copii pe baza hover-ului pe părinte:\n\n```html\n<div class=\"group cursor-pointer p-4 rounded-xl border\n            hover:bg-blue-50 hover:border-blue-200 transition\">\n  <h3 class=\"text-gray-800 group-hover:text-blue-600\">Titlu card</h3>\n  <p class=\"text-gray-500 group-hover:text-gray-700\">Descriere</p>\n  <span class=\"opacity-0 group-hover:opacity-100 transition\">Citește →</span>\n</div>\n```\n\n**Named groups** (multiple niveluri):\n```html\n<div class=\"group/outer\">\n  <div class=\"group/inner\">\n    <p class=\"group-hover/outer:text-blue-600\">Hover outer</p>\n    <p class=\"group-hover/inner:text-red-600\">Hover inner</p>\n  </div>\n</div>\n```" },
      { order: 2, title: "Peer — sibling state", content: "Stilizează un element pe baza stării unui frate precedent:\n\n```html\n<!-- Input + label responsiv la stare input -->\n<input type=\"checkbox\" id=\"ch\" class=\"peer sr-only\">\n<label for=\"ch\"\n  class=\"bg-gray-200 peer-checked:bg-blue-600\n         w-12 h-6 rounded-full cursor-pointer transition\">\n</label>\n\n<!-- Validare vizuală -->\n<input type=\"email\" class=\"peer border rounded-lg px-3 py-2\n                           invalid:border-red-500\">\n<p class=\"hidden peer-[&:not(:placeholder-shown):invalid]:block\n          text-red-500 text-sm\">\n  Email invalid\n</p>\n```\n\n**peer** trebuie să apară ÎNAINTE (ca frate precedent) în DOM." },
    ],
    tasks: [
      { number: 1, name: "group", question: "Ce face clasa group pe un element?", options: ["Grupare CSS", "Marchează elementul ca \"grup\" pentru group-hover: pe copii", "Select", "Wrapper"], answer: "Marchează elementul ca \"grup\" pentru group-hover: pe copii", explanation: "Apoi copiii folosesc group-hover: group-focus: etc. pentru a reactiona la starea grupului.", difficulty: "medium" },
      { number: 2, name: "group-hover", question: "Cum activezi group-hover pe copil?", options: ["Automat", "Adaugi group pe părinte + group-hover:class pe copil", "CSS var", "JS"], answer: "Adaugi group pe părinte + group-hover:class pe copil", explanation: "Prefix group-hover: pe copil = se aplică când PARINTELE cu clasa group e în hover.", difficulty: "medium" },
      { number: 3, name: "peer", question: "Ce face peer pe input + peer-checked: pe label?", options: ["Perechi", "Label reacționează la starea checked a input-ului frate", "Disabled", "Color"], answer: "Label reacționează la starea checked a input-ului frate", explanation: "Util pentru toggle-uri custom, checkbox-uri stylate, show/hide bazat pe input.", difficulty: "hard" },
      { number: 4, name: "peer position", question: "Peer element trebuie să fie unde față de cel stilizat?", options: ["Oriunde", "ÎNAINTE (ca frate precedent în DOM)", "Nested", "Identic"], answer: "ÎNAINTE (ca frate precedent în DOM)", explanation: "CSS sibling selectors (+ sau ~) merg doar forward. peer trebuie să fie înainte.", difficulty: "hard" },
    ],
  },
  {
    slug: "tailwind-proiect-card",
    title: "19. Mini proiect — Componente reale",
    order: 19,
    theory: [
      { order: 1, title: "Card produs", content: "```html\n<div class=\"group relative bg-white rounded-2xl shadow-sm overflow-hidden\n            hover:shadow-lg transition-shadow duration-300 cursor-pointer\">\n  <div class=\"aspect-square bg-gray-100 overflow-hidden\">\n    <img src=\"/produs.jpg\" alt=\"Produs\"\n      class=\"w-full h-full object-cover group-hover:scale-105 transition-transform duration-300\">\n    <span class=\"absolute top-3 left-3 bg-red-500 text-white text-xs font-bold\n                 px-2 py-1 rounded-full\">-20%</span>\n  </div>\n  <div class=\"p-4\">\n    <h3 class=\"font-semibold text-gray-900 truncate\">Nume Produs</h3>\n    <p class=\"text-sm text-gray-500 mt-1 line-clamp-2\">Descriere produs mai lungă...</p>\n    <div class=\"flex items-center justify-between mt-3\">\n      <div>\n        <span class=\"text-lg font-bold text-gray-900\">80 lei</span>\n        <span class=\"text-sm text-gray-400 line-through ml-1\">100 lei</span>\n      </div>\n      <button class=\"bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg\n                     hover:bg-blue-700 active:scale-95 transition\">\n        Adaugă\n      </button>\n    </div>\n  </div>\n</div>\n```" },
      { order: 2, title: "Navbar responsiv", content: "```html\n<header class=\"sticky top-0 z-50 bg-white border-b border-gray-200\">\n  <nav class=\"max-w-6xl mx-auto px-4 h-16 flex items-center justify-between\">\n    <a href=\"/\" class=\"text-xl font-bold text-blue-600\">Brand</a>\n\n    <!-- Desktop nav -->\n    <ul class=\"hidden md:flex items-center gap-6\">\n      <li><a href=\"#\" class=\"text-gray-600 hover:text-gray-900 text-sm font-medium\">Produse</a></li>\n      <li><a href=\"#\" class=\"text-gray-600 hover:text-gray-900 text-sm font-medium\">Prețuri</a></li>\n      <li>\n        <a href=\"#\" class=\"bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg\n                            hover:bg-blue-700 transition\">Login</a>\n      </li>\n    </ul>\n\n    <!-- Mobile button -->\n    <button class=\"md:hidden p-2 rounded-lg hover:bg-gray-100\">☰</button>\n  </nav>\n</header>\n```" },
    ],
    tasks: [
      { number: 1, name: "line-clamp-2", question: "Ce face line-clamp-2?", options: ["2 linii mai mare", "Trunchiază text la 2 linii cu ellipsis (...)", "2 coloane", "Bold"], answer: "Trunchiază text la 2 linii cu ellipsis (...)", explanation: "Util pentru carduri cu descrieri — afișezi constant 2 linii, indiferent de lungime.", difficulty: "easy" },
      { number: 2, name: "truncate", question: "Ce face truncate pe h3?", options: ["Ștergere", "Overflow hidden + text-overflow: ellipsis (o singură linie)", "Scurtat", "Shadow"], answer: "Overflow hidden + text-overflow: ellipsis (o singură linie)", explanation: "truncate = whitespace-nowrap + overflow-hidden + text-overflow: ellipsis.", difficulty: "easy" },
      { number: 3, name: "md:hidden vs hidden", question: "Ce face hidden md:flex?", options: ["Ascuns mereu", "Ascuns pe mobile, flex pe md+ (>=768px)", "Invers", "Bug"], answer: "Ascuns pe mobile, flex pe md+ (>=768px)", explanation: "Mobile first: hidden = display:none. md:flex override-uiește la 768px+.", difficulty: "medium" },
      { number: 4, name: "aspect-square", question: "Ce face aspect-square?", options: ["CSS square", "Forțează aspect ratio 1:1 (pătrat)", "width=height fix", "Group"], answer: "Forțează aspect ratio 1:1 (pătrat)", explanation: "Util pentru thumbnails produse, avatar-uri. Combini cu object-fit cover.", difficulty: "easy" },
    ],
  },
  {
    slug: "tailwind-config-custom",
    title: "20. Customizare și design system",
    order: 20,
    theory: [
      { order: 1, title: "Customizare cu @theme", content: "Tailwind v4 — customizarea se face în CSS cu `@theme`:\n\n```css\n@import \"tailwindcss\";\n\n@theme {\n  /* Culori custom */\n  --color-brand: #6366f1;\n  --color-brand-dark: #4f46e5;\n\n  /* Font custom */\n  --font-display: 'Inter', sans-serif;\n\n  /* Spacing custom */\n  --spacing-18: 4.5rem;\n\n  /* Border radius custom */\n  --radius-card: 1.25rem;\n\n  /* Shadow custom */\n  --shadow-card: 0 4px 20px rgba(0,0,0,0.08);\n}\n```\n\n```html\n<!-- Folosit ca clase Tailwind normale -->\n<div class=\"bg-brand text-white rounded-card shadow-card p-18\">\n  Design system custom!\n</div>\n```" },
      { order: 2, title: "CSS variables + dark mode", content: "```css\n@theme {\n  --color-primary: oklch(60% 0.2 250);\n  --color-surface: #ffffff;\n  --color-on-surface: #111111;\n}\n\n/* Dark mode override */\n@media (prefers-color-scheme: dark) {\n  @theme {\n    --color-surface: #0f172a;\n    --color-on-surface: #f1f5f9;\n  }\n}\n```\n\n```html\n<div class=\"bg-surface text-on-surface\">\n  Automat light/dark!\n</div>\n```\n\nPatternul modern: definești culori semantice (surface, on-surface, primary etc.) nu literale (gray-900)." },
    ],
    tasks: [
      { number: 1, name: "@theme", question: "Cum definești o culoare custom în Tailwind v4?", options: ["tailwind.config.js", "--color-name: value în @theme CSS", "safelist", "plugin"], answer: "--color-name: value în @theme CSS", explanation: "Tailwind v4 folosește CSS-first config. --color-brand devine bg-brand, text-brand etc.", difficulty: "medium" },
      { number: 2, name: "semantic colors", question: "De ce culori semantice (surface, primary) > literale (gray-900)?", options: ["Identice", "Schimbi dark/light fără a modifica HTML-ul — doar variabilele CSS", "Literale mai rapide", "Nu contează"], answer: "Schimbi dark/light fără a modifica HTML-ul — doar variabilele CSS", explanation: "surface = white în light, dark-900 în dark. Definești o dată, se aplică peste tot.", difficulty: "hard" },
      { number: 3, name: "spacing custom", question: "Cum adaugi spacing-18 custom?", options: ["Imposibil", "--spacing-18: 4.5rem în @theme", "Plugin", "Arbitrary [18px]"], answer: "--spacing-18: 4.5rem în @theme", explanation: "Devine p-18, m-18, gap-18 etc. automat.", difficulty: "medium" },
      { number: 4, name: "v4 vs v3 config", question: "Tailwind v4 vs v3 customizare?", options: ["Identice", "v4: CSS @theme; v3: tailwind.config.js cu theme.extend", "v4 nu suportă", "Invers"], answer: "v4: CSS @theme; v3: tailwind.config.js cu theme.extend", explanation: "v4 CSS-first = fără JS config. Mai simplu, mai aproape de standardele web.", difficulty: "hard" },
    ],
  },
];

module.exports = { tailwindMore };
