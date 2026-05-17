const jsExtra2 = [
  {
    "slug": "web-apis-moderne",
    "title": "36. Web APIs moderne (IntersectionObserver, ResizeObserver, MutationObserver)",
    "order": 36,
    "theory": [
      {
        "order": 1,
        "title": "IntersectionObserver — lazy loading si scroll effects",
        "content": "IntersectionObserver observa cand un element intra/iese din viewport sau dintr-un container — fara scroll events costisitoare.\n\n```javascript\n// Lazy loading imagini\nconst observer = new IntersectionObserver(\n  (entries, obs) => {\n    entries.forEach(entry => {\n      if (entry.isIntersecting) {\n        const img = entry.target;\n        img.src = img.dataset.src; // incarca imaginea\n        img.classList.add('loaded');\n        obs.unobserve(img); // oprim observarea dupa incarcare\n      }\n    });\n  },\n  {\n    root: null,           // viewport\n    rootMargin: '100px',  // incarca cu 100px inainte de vizibil\n    threshold: 0.1        // 10% din element trebuie vizibil\n  }\n);\n\ndocument.querySelectorAll('img[data-src]').forEach(img => {\n  observer.observe(img);\n});\n\n// Animate on scroll\nconst animateObserver = new IntersectionObserver(\n  entries => entries.forEach(e => {\n    e.target.classList.toggle('visible', e.isIntersecting);\n  }),\n  { threshold: 0.3 }\n);\ndocument.querySelectorAll('.animate-on-scroll').forEach(el =>\n  animateObserver.observe(el)\n);\n```\n\n**Interviu:** De ce IntersectionObserver in loc de scroll event? Scroll events se declanseaza de sute de ori pe secunda si ruleaza pe main thread. IntersectionObserver e asincron si optimizat de browser — nu blocheaza."
      },
      {
        "order": 2,
        "title": "ResizeObserver — react la schimbari de dimensiune",
        "content": "```javascript\n// ResizeObserver: notifica cand dimensiunile unui element se schimba\nconst resizeObserver = new ResizeObserver(entries => {\n  entries.forEach(entry => {\n    const { width, height } = entry.contentRect;\n    console.log(`Element: ${width}px x ${height}px`);\n\n    // Adapteaza UI in functie de marimea container-ului\n    // (nu a viewport-ului!) — Container Queries in JS\n    const el = entry.target;\n    if (width < 300) {\n      el.classList.add('compact');\n    } else {\n      el.classList.remove('compact');\n    }\n  });\n});\n\nresizeObserver.observe(document.getElementById('my-widget'));\n\n// Opreste observarea\n// resizeObserver.unobserve(element);\n// resizeObserver.disconnect(); // opreste toate\n\n// Util pentru:\n// - Charts care trebuie sa se redeseneze la resize\n// - Container queries inainte de suport CSS nativ\n// - Virtual scroll lists care recalculeaza inaltimea\nconst chart = document.getElementById('chart');\nconst chartObserver = new ResizeObserver(([entry]) => {\n  const { width } = entry.contentRect;\n  redrawChart(width); // redeseneaza chart-ul\n});\nchartObserver.observe(chart);\n```"
      },
      {
        "order": 3,
        "title": "MutationObserver — observa schimbari DOM",
        "content": "```javascript\n// MutationObserver: urmareste modificari in DOM\nconst mutationObs = new MutationObserver(mutations => {\n  mutations.forEach(mutation => {\n    if (mutation.type === 'childList') {\n      console.log('Noduri adaugate:', mutation.addedNodes);\n      console.log('Noduri sterse:', mutation.removedNodes);\n    }\n    if (mutation.type === 'attributes') {\n      console.log(\n        `Atribut '${mutation.attributeName}' schimbat pe`,\n        mutation.target\n      );\n    }\n  });\n});\n\n// Configuratie\nmutationObs.observe(document.body, {\n  childList: true,    // urmareste adaugare/stergere noduri copil\n  subtree: true,      // si in adancime\n  attributes: true,   // urmareste modificari atribute\n  attributeFilter: ['class', 'data-theme'] // filtrare atribute\n});\n\n// Use case: detectare incarcare continut dinamic\nconst listObserver = new MutationObserver(mutations => {\n  mutations.forEach(({ addedNodes }) => {\n    addedNodes.forEach(node => {\n      if (node.nodeType === 1 && node.matches('.new-item')) {\n        // Initializeaza noul element\n        initializeItem(node);\n      }\n    });\n  });\n});\nlistObserver.observe(document.getElementById('lista'), {\n  childList: true\n});\n\n// IMPORTANT: intotdeauna disconnect() cand nu mai e nevoie!\nmutationObs.disconnect();\n```\n\n**Interviu:** MutationObserver vs polling (setInterval pentru a verifica DOM)? MutationObserver e event-driven, eficient. Polling e risipitor — ruleaza chiar cand nu s-a schimbat nimic."
      },
      {
        "order": 4,
        "title": "PerformanceObserver si alte API-uri moderne",
        "content": "```javascript\n// PerformanceObserver: masurare performanta\nconst perfObs = new PerformanceObserver(list => {\n  list.getEntries().forEach(entry => {\n    console.log(`${entry.name}: ${entry.duration}ms`);\n  });\n});\nperfObs.observe({ entryTypes: ['measure', 'paint', 'longtask'] });\n\n// Masurare manuala\nperformance.mark('start-operatie');\n// ... operatia ...\nperformance.mark('end-operatie');\nperformance.measure('operatie', 'start-operatie', 'end-operatie');\n\n// Broadcast Channel API: comunicare intre tab-uri\nconst channel = new BroadcastChannel('notificari');\nchannel.postMessage({ tip: 'update', data: 'nou' });\nchannel.onmessage = e => console.log('Primit:', e.data);\n\n// Page Visibility API\ndocument.addEventListener('visibilitychange', () => {\n  if (document.hidden) {\n    pauseAnimations(); // economie baterie\n  } else {\n    resumeAnimations();\n  }\n});\n\n// Clipboard API (async)\nasync function copyText(text) {\n  await navigator.clipboard.writeText(text);\n  console.log('Copiat!');\n}\nasync function pasteText() {\n  return navigator.clipboard.readText();\n}\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "IntersectionObserver vs scroll",
        "question": "De ce IntersectionObserver e mai performant decat window.addEventListener('scroll', handler)?",
        "options": [
          "IntersectionObserver e mai nou",
          "Scroll events se declanseaza sute de ori/secunda pe main thread; IntersectionObserver e async, optimizat de browser",
          "Nu e mai performant",
          "Scroll events nu exista in modern browsers"
        ],
        "answer": "Scroll events se declanseaza sute de ori/secunda pe main thread; IntersectionObserver e async, optimizat de browser",
        "explanation": "Scroll events blocheaza main thread-ul daca handler-ul e lent. IntersectionObserver e batched de browser si executat off-main-thread.",
        "difficulty": "hard"
      },
      {
        "number": 2,
        "name": "threshold in IntersectionObserver",
        "question": "Ce face `threshold: 0.5` in optiunile IntersectionObserver?",
        "options": [
          "Observa dupa 500ms",
          "Callback-ul se declanseaza cand 50% din element e vizibil",
          "Observa la fiecare 50px",
          "Dezactiveaza observatorul"
        ],
        "answer": "Callback-ul se declanseaza cand 50% din element e vizibil",
        "explanation": "threshold = fractia din element care trebuie sa fie vizibila. 0 = orice pixel; 1 = tot elementul. Poate fi array: [0, 0.5, 1].",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "unobserve dupa actiune",
        "question": "De ce apelezi `observer.unobserve(img)` dupa ce imaginea a fost incarcata (lazy loading)?",
        "options": [
          "E obligatoriu",
          "Sa nu mai consumi resurse observand un element care nu mai necesita actiune",
          "Sa poti re-observa",
          "unobserve curata si atributele"
        ],
        "answer": "Sa nu mai consumi resurse observand un element care nu mai necesita actiune",
        "explanation": "Dupa ce imaginea e incarcata, nu mai e nevoie sa o observam. unobserve = cleanup = memorie si CPU economisite.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "ResizeObserver vs window.resize",
        "question": "Avantajul ResizeObserver fata de `window.addEventListener('resize')`?",
        "options": [
          "Identice",
          "ResizeObserver observa elemente individuale, nu doar fereastra — util pentru componente independente de viewport",
          "window.resize e deprecated",
          "ResizeObserver e mai rapid"
        ],
        "answer": "ResizeObserver observa elemente individuale, nu doar fereastra — util pentru componente independente de viewport",
        "explanation": "Un chart intr-un panel redimensionabil nu se schimba cand schimbi viewport-ul. ResizeObserver detecteaza schimbarea containerului.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "MutationObserver subtree",
        "question": "Ce face `subtree: true` in config MutationObserver?",
        "options": [
          "Observa doar copiii directi",
          "Observa toata arborele DOM sub elementul target, nu doar copiii directi",
          "Observa shadow DOM",
          "Creeaza arbore de observatori"
        ],
        "answer": "Observa toata arborele DOM sub elementul target, nu doar copiii directi",
        "explanation": "Fara subtree: observa doar copiii directi ai target-ului. Cu subtree: orice schimbare in tot sub-arborele e raportata.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "mutation.type",
        "question": "Ce valori poate avea `mutation.type` intr-un MutationObserver callback?",
        "options": [
          "'change', 'update', 'delete'",
          "'childList', 'attributes', 'characterData'",
          "'add', 'remove', 'modify'",
          "'dom', 'css', 'event'"
        ],
        "answer": "'childList', 'attributes', 'characterData'",
        "explanation": "childList = noduri adaugate/sterse. attributes = atribute modificate. characterData = text modificat in Text node.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "disconnect() importanta",
        "question": "De ce e important sa apelezi `observer.disconnect()` cand componenta se distruge?",
        "options": [
          "Nu e important",
          "Previne memory leaks — observatorul retine referinta la elemente, impiedicand garbage collection",
          "Elibereaza portul",
          "Reseteaza DOM-ul"
        ],
        "answer": "Previne memory leaks — observatorul retine referinta la elemente, impiedicand garbage collection",
        "explanation": "Observer activ = referinta la element = elementul nu poate fi GC-uit chiar daca e sters din DOM. disconnect() = cleanup esential.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "BroadcastChannel scop",
        "question": "Ce problema rezolva BroadcastChannel API?",
        "options": [
          "Comunicare cu server-ul",
          "Comunicare intre tab-uri/ferestre din acelasi origin fara server round-trip",
          "Comunicare cu Web Workers",
          "Broadcasting la toti utilizatorii"
        ],
        "answer": "Comunicare intre tab-uri/ferestre din acelasi origin fara server round-trip",
        "explanation": "Ex: userul se logheaza intr-un tab -> trimiti mesaj pe channel -> toate celelalte tab-uri se actualizeaza fara refresh.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "Page Visibility API",
        "question": "Cand e utila Page Visibility API (`document.hidden`)?",
        "options": [
          "Niciodata — JavaScript ruleaza oricum",
          "Pauzeaza animatii/polling cand tab-ul e inactiv — economie baterie si CPU",
          "Detecteaza screenreader-ul",
          "Verifica vizibilitatea CSS"
        ],
        "answer": "Pauzeaza animatii/polling cand tab-ul e inactiv — economie baterie si CPU",
        "explanation": "Un tab in background nu necesita animatii fluide sau polling frequent. Page Visibility = trigger pentru optimizari.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "rootMargin in IntersectionObserver",
        "question": "Ce face `rootMargin: '200px 0px'` in IntersectionObserver?",
        "options": [
          "Adauga margin CSS elementelor observate",
          "Extinde zona de detectie cu 200px sus/jos — elementul e considerat vizibil mai devreme",
          "Seteaza offset scroll",
          "Ignora primii 200px"
        ],
        "answer": "Extinde zona de detectie cu 200px sus/jos — elementul e considerat vizibil mai devreme",
        "explanation": "rootMargin extinde viewport-ul virtual. '200px' = declanseaza callback cand elementul e la 200px de a intra in viewport — prefetch mai devreme.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "PerformanceObserver entryTypes",
        "question": "Ce masura `entryType: 'longtask'` in PerformanceObserver?",
        "options": [
          "Task-uri programate cu setTimeout",
          "Operatii pe main thread care dureaza > 50ms si pot bloca UI-ul",
          "Request-uri HTTP lungi",
          "Animatii lente"
        ],
        "answer": "Operatii pe main thread care dureaza > 50ms si pot bloca UI-ul",
        "explanation": "Long tasks = JavaScript care dureaza > 50ms = UI jank. PerformanceObserver cu longtask te ajuta sa identifici ce blocheaza main thread-ul.",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "IntersectionObserver coding",
        "question": "Implementeaza lazy loading pentru imagini cu data-src folosind IntersectionObserver. Cand imaginea intra in viewport, seteaza src = data-src si adauga clasa 'loaded'.",
        "options": [],
        "answer": "",
        "explanation": "const obs = new IntersectionObserver(entries => { entries.forEach(e => { if(e.isIntersecting) { e.target.src = e.target.dataset.src; e.target.classList.add('loaded'); obs.unobserve(e.target); } }); }); imgs.forEach(img => obs.observe(img));",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "ResizeObserver coding",
        "question": "Creeaza un ResizeObserver care adauga clasa 'small' unui element daca latimea < 400px si 'large' daca >= 400px.",
        "options": [],
        "answer": "",
        "explanation": "new ResizeObserver(entries => { const {width} = entries[0].contentRect; element.classList.toggle('small', width < 400); element.classList.toggle('large', width >= 400); })",
        "difficulty": "easy"
      },
      {
        "number": 14,
        "name": "MutationObserver coding",
        "question": "Creeaza un MutationObserver care detecteaza cand se adauga noi elemente cu clasa 'item' in #lista si le afiseaza in consola.",
        "options": [],
        "answer": "",
        "explanation": "const obs = new MutationObserver(mutations => { mutations.forEach(({addedNodes}) => { addedNodes.forEach(node => { if(node.matches?.('.item')) console.log(node); }); }); }); obs.observe(listElement, {childList:true});",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Animate on scroll coding",
        "question": "Implementeaza o functie animateOnScroll() care observa toate elementele cu clasa .fade-in si adauga clasa 'visible' cand 30% din element e in viewport.",
        "options": [],
        "answer": "",
        "explanation": "const obs = new IntersectionObserver(entries => { entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }); }, {threshold: 0.3}); elements.forEach(el => obs.observe(el));",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "indexeddb-cache-api",
    "title": "37. IndexedDB si Cache API",
    "order": 37,
    "theory": [
      {
        "order": 1,
        "title": "IndexedDB — baza de date offline in browser",
        "content": "```javascript\n// IndexedDB: baza de date NoSQL client-side, async, pentru volume mari\nconst DB_NAME = 'myApp';\nconst DB_VERSION = 1;\n\nfunction openDB() {\n  return new Promise((resolve, reject) => {\n    const request = indexedDB.open(DB_NAME, DB_VERSION);\n\n    // Se apeleaza la prima deschidere sau la upgrade version\n    request.onupgradeneeded = (event) => {\n      const db = event.target.result;\n      // Creeaza object store (echivalent tabel)\n      if (!db.objectStoreNames.contains('notes')) {\n        const store = db.createObjectStore('notes', {\n          keyPath: 'id',\n          autoIncrement: true\n        });\n        store.createIndex('by_date', 'createdAt'); // index pentru query\n        store.createIndex('by_title', 'title', { unique: false });\n      }\n    };\n    request.onsuccess = e => resolve(e.target.result);\n    request.onerror = e => reject(e.target.error);\n  });\n}\n\n// CRUD\nasync function addNote(note) {\n  const db = await openDB();\n  return new Promise((resolve, reject) => {\n    const tx = db.transaction('notes', 'readwrite');\n    const store = tx.objectStore('notes');\n    const req = store.add({ ...note, createdAt: new Date() });\n    req.onsuccess = () => resolve(req.result); // ID generat\n    req.onerror = () => reject(req.error);\n  });\n}\n```\n\n**Interviu:** localStorage vs IndexedDB? localStorage: sync, 5MB, doar strings. IndexedDB: async, 50MB+, obiecte complexe, tranzactii, indecsi. IndexedDB e recomandat pentru date structurate sau volume mari."
      },
      {
        "order": 2,
        "title": "IndexedDB — citire, actualizare, stergere si cursor",
        "content": "```javascript\nasync function getNote(id) {\n  const db = await openDB();\n  return new Promise((resolve, reject) => {\n    const tx = db.transaction('notes', 'readonly');\n    const store = tx.objectStore('notes');\n    const req = store.get(id);\n    req.onsuccess = () => resolve(req.result);\n    req.onerror = () => reject(req.error);\n  });\n}\n\nasync function getAllNotes() {\n  const db = await openDB();\n  return new Promise((resolve, reject) => {\n    const tx = db.transaction('notes', 'readonly');\n    const store = tx.objectStore('notes');\n    const req = store.getAll();\n    req.onsuccess = () => resolve(req.result);\n    req.onerror = () => reject(req.error);\n  });\n}\n\nasync function deleteNote(id) {\n  const db = await openDB();\n  return new Promise((resolve, reject) => {\n    const tx = db.transaction('notes', 'readwrite');\n    const req = tx.objectStore('notes').delete(id);\n    req.onsuccess = () => resolve();\n    req.onerror = () => reject(req.error);\n  });\n}\n\n// Cursor pentru iterare eficienta\nasync function getNotesByDate(startDate) {\n  const db = await openDB();\n  return new Promise((resolve) => {\n    const results = [];\n    const tx = db.transaction('notes', 'readonly');\n    const index = tx.objectStore('notes').index('by_date');\n    const range = IDBKeyRange.lowerBound(startDate);\n    const cursor = index.openCursor(range);\n    cursor.onsuccess = (e) => {\n      const c = e.target.result;\n      if (c) { results.push(c.value); c.continue(); }\n      else resolve(results);\n    };\n  });\n}\n```"
      },
      {
        "order": 3,
        "title": "Cache API — offline si Service Worker",
        "content": "```javascript\n// Cache API: cache HTTP responses pentru offline access\nconst CACHE_NAME = 'app-v1';\nconst ASSETS = ['/', '/index.html', '/app.js', '/styles.css'];\n\n// In Service Worker: cache la install\nself.addEventListener('install', event => {\n  event.waitUntil(\n    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))\n  );\n});\n\n// Strategie Cache-First (offline first)\nself.addEventListener('fetch', event => {\n  event.respondWith(\n    caches.match(event.request).then(cached => {\n      if (cached) return cached; // serveste din cache\n      // Nu in cache: fetch de la retea + adauga in cache\n      return fetch(event.request).then(response => {\n        const clone = response.clone();\n        caches.open(CACHE_NAME).then(cache =>\n          cache.put(event.request, clone)\n        );\n        return response;\n      });\n    })\n  );\n});\n\n// Stale-While-Revalidate: returneaza din cache + actualizeaza in background\nself.addEventListener('fetch', event => {\n  event.respondWith(\n    caches.open(CACHE_NAME).then(cache =>\n      cache.match(event.request).then(cached => {\n        const fetched = fetch(event.request).then(resp => {\n          cache.put(event.request, resp.clone());\n          return resp;\n        });\n        return cached || fetched; // cache imediat, revalideaza in background\n      })\n    )\n  );\n});\n```\n\n**Interviu:** Strategii Cache API? Cache-First: viteza maxima, poate fi stale. Network-First: mereu fresh, fallback la cache offline. Stale-While-Revalidate: compromis bun pentru date care se schimba rar."
      },
      {
        "order": 4,
        "title": "Versionare IndexedDB si idb library",
        "content": "```javascript\n// Versionare: onupgradeneeded handle multiple versiuni\nconst request = indexedDB.open('myApp', 3);\n\nrequest.onupgradeneeded = (event) => {\n  const db = event.target.result;\n  const oldVersion = event.oldVersion;\n\n  if (oldVersion < 1) {\n    // Migrare de la 0 la 1: creeaza store initial\n    db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });\n  }\n  if (oldVersion < 2) {\n    // Migrare de la 1 la 2: adauga index\n    const tx = event.target.transaction;\n    const notesStore = tx.objectStore('notes');\n    notesStore.createIndex('by_tag', 'tag');\n  }\n  if (oldVersion < 3) {\n    // Migrare de la 2 la 3: nou store\n    db.createObjectStore('settings', { keyPath: 'key' });\n  }\n};\n\n// idb library (wrapper modern cu Promises native)\nimport { openDB } from 'idb';\n\nconst db = await openDB('myApp', 1, {\n  upgrade(db) {\n    db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });\n  }\n});\n\n// API mult mai curata cu idb\nawait db.add('notes', { title: 'Test', content: 'Continut' });\nconst allNotes = await db.getAll('notes');\nawait db.delete('notes', 1);\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "localStorage vs IndexedDB",
        "question": "Cand alegi IndexedDB in loc de localStorage?",
        "options": [
          "Niciodata, localStorage e mai simplu",
          "Date structurate complexe, volume > 5MB, necesitate de tranzactii sau query-uri cu indecsi",
          "IndexedDB e mai rapid intotdeauna",
          "Cand ai nevoie de sync"
        ],
        "answer": "Date structurate complexe, volume > 5MB, necesitate de tranzactii sau query-uri cu indecsi",
        "explanation": "localStorage = simplu, sync, 5MB, strings. IndexedDB = async, 50MB+, obiecte JS native, tranzactii ACID, indecsi pentru query-uri.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "onupgradeneeded",
        "question": "Cand se declanseaza `request.onupgradeneeded`?",
        "options": [
          "La fiecare deschidere a DB",
          "Doar la prima creare sau cand version creste (schimbari schema)",
          "La fiecare tranzactie",
          "La erori"
        ],
        "answer": "Doar la prima creare sau cand version creste (schimbari schema)",
        "explanation": "onupgradeneeded = migration hook. Daca DB exista si versiunea e aceeasi, NU se apeleaza. Cresti version cand trebuie sa modifici schema.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "transaction readonly vs readwrite",
        "question": "De ce specificati `'readonly'` sau `'readwrite'` la tranzactii IndexedDB?",
        "options": [
          "E optional",
          "Optimizare: readonly permite tranzactii concurente; readwrite le serializa — performanta maxima",
          "readwrite e mai rapid",
          "Obligatoriu pentru securitate"
        ],
        "answer": "Optimizare: readonly permite tranzactii concurente; readwrite le serializa — performanta maxima",
        "explanation": "Tranzactii readonly pot rula concurent (nu se modifica date). readwrite e exclusiv — asteapta sa se termine cea anterioara.",
        "difficulty": "hard"
      },
      {
        "number": 4,
        "name": "Cache-First strategie",
        "question": "Ce problema are strategia Cache-First (serveste intotdeauna din cache)?",
        "options": [
          "E mai lenta",
          "Poate servi date stale (vechi) daca cache-ul nu e invalidat",
          "Nu functioneaza offline",
          "Nu suporta imagini"
        ],
        "answer": "Poate servi date stale (vechi) daca cache-ul nu e invalidat",
        "explanation": "Cache-First: viteza maxima, functioneaza offline, dar utilizatorul poate vedea versiuni vechi ale aplicatiei pana la invalidarea cache-ului.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "Stale-While-Revalidate",
        "question": "Ce face strategia Stale-While-Revalidate?",
        "options": [
          "Sterge si re-fetch-uieste",
          "Returneaza imediat versiunea din cache si actualizeaza cache-ul in background din retea",
          "Asteapta retea, fallback cache",
          "Cache permanent"
        ],
        "answer": "Returneaza imediat versiunea cache si actualizeaza cache-ul in background din retea",
        "explanation": "Utilizatorul primeste raspuns instant (din cache). In background, aplicatia fetch-uieste versiunea noua pentru urmatoarea vizita.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "event.waitUntil",
        "question": "De ce folosesti `event.waitUntil(promise)` in Service Worker install event?",
        "options": [
          "Obligatoriu sintaxa",
          "Spune browser-ului sa nu termine event-ul pana ce promise-ul e rezolvat — ensure toate assets sunt cached",
          "Adauga timeout",
          "Inregistreaza Service Worker-ul"
        ],
        "answer": "Spune browser-ului sa nu termine event-ul pana ce promise-ul e rezolvat — ensure toate assets sunt cached",
        "explanation": "Fara waitUntil, Service Worker-ul ar putea fi activat inainte ca toate resursele sa fie cached. waitUntil mentine event-ul activ.",
        "difficulty": "hard"
      },
      {
        "number": 7,
        "name": "response.clone()",
        "question": "De ce apelezi `response.clone()` inainte de a pune raspunsul in cache?",
        "options": [
          "clone e mai rapid",
          "Response body poate fi citit o singura data; clone() creeaza copie care poate fi citita independent",
          "E obligatoriu",
          "clone() comprima raspunsul"
        ],
        "answer": "Response body poate fi citit o singura data; clone() creeaza copie care poate fi citita independent",
        "explanation": "Daca citesti body-ul pentru cache, nu mai poti trimite raspunsul clientului. clone() permite sa pui in cache SI sa returnezi raspunsul.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "IDBKeyRange",
        "question": "Ce face `IDBKeyRange.lowerBound(date)` in IndexedDB?",
        "options": [
          "Seteaza limita maxima",
          "Creeaza un range de chei >= date — pentru query-uri cu conditii pe indecsi",
          "Selecteaza prima cheie",
          "Sorteaza descrescator"
        ],
        "answer": "Creeaza un range de chei >= date — pentru query-uri cu conditii pe indecsi",
        "explanation": "IDBKeyRange permite filtrare pe indecsi: lowerBound(x) = x <= key, upperBound(x) = key <= x, bound(x,y) = x <= key <= y.",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "idb library avantaj",
        "question": "De ce e `idb` (npm) preferata fata de IndexedDB nativ?",
        "options": [
          "idb e mai rapid",
          "idb inlocuieste callbacks cu Promises native — cod mai curat cu async/await",
          "idb suporta mai multe browsere",
          "IndexedDB nu mai exista"
        ],
        "answer": "idb inlocuieste callbacks cu Promises native — cod mai curat cu async/await",
        "explanation": "IndexedDB nativ = callbacks imbricate (callback hell). idb = wrapper cu Promises: await db.get('store', key). Mult mai usor de citit si intretinut.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "keyPath vs autoIncrement",
        "question": "Diferenta `keyPath: 'id'` vs `autoIncrement: true` in createObjectStore?",
        "options": [
          "Identice",
          "keyPath: 'id' = campul 'id' din obiect e cheia; autoIncrement = DB genereaza ID incremental",
          "keyPath e pentru numere, autoIncrement pentru strings",
          "autoIncrement e deprecated"
        ],
        "answer": "keyPath: 'id' = campul 'id' din obiect e cheia; autoIncrement = DB genereaza ID incremental",
        "explanation": "Pot fi combinate: {keyPath: 'id', autoIncrement: true} = DB genereaza id si il pune in obiect. Sau keyPath pe un camp existent (ex. email unic).",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "Cache versioning",
        "question": "Cum invalidiezi cache-ul vechi la un deploy nou cu Cache API?",
        "options": [
          "Se invalideaza automat",
          "Schimbi CACHE_NAME (ex. 'app-v2') si in activate event stergi cache-urile cu alte versiuni",
          "Stergi manual din DevTools",
          "Cache-ul expira dupa 24h automat"
        ],
        "answer": "Schimbi CACHE_NAME (ex. 'app-v2') si in activate event stergi cache-urile cu alte versiuni",
        "explanation": "La deploy: CACHE_NAME='app-v2'. In SW activate: caches.keys() -> sterge cache-urile care nu sunt 'app-v2'. Utilizatorii primesc versiunea noua.",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "IndexedDB CRUD coding",
        "question": "Scrie functiile addItem(item) si getItem(id) pentru un IndexedDB store 'items'. Simuleaza cu un Map in memorie.",
        "options": [],
        "answer": "",
        "explanation": "Implementare cu Map simuleaza IndexedDB. In realitate: db.transaction('items', 'readwrite').objectStore('items').add(item)",
        "difficulty": "easy"
      },
      {
        "number": 13,
        "name": "Cache-First coding",
        "question": "Implementeaza o functie fetchWithCache(url) care incearca cache-ul intai, daca nu gaseste face fetch si salveaza in cache.",
        "options": [],
        "answer": "",
        "explanation": "if(cache.has(url)) return cache.get(url); const resp = await fetch(url); cache.set(url, resp.clone()); return resp;",
        "difficulty": "easy"
      },
      {
        "number": 14,
        "name": "IndexedDB getAllItems coding",
        "question": "Creeaza o functie getAllItems() care returneaza toate item-urile dintr-un store simulat, filtrate dupa o proprietate.",
        "options": [],
        "answer": "",
        "explanation": "function getAllItems(filter) { let items = Array.from(store.values()); if(filter) items = items.filter(i => i[filter.key] === filter.value); return Promise.resolve(items); }",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Service Worker strategie coding",
        "question": "Implementeaza Network-First cu fallback la cache: incearca network, daca esueaza returneaza din cache. Salveaza raspunsul reusit in cache.",
        "options": [],
        "answer": "",
        "explanation": "try { const resp = await networkFetch(url, shouldFail); cache.set(url, resp); return resp; } catch { return cache.get(url) || null; }",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "web-workers",
    "title": "38. Web Workers",
    "order": 38,
    "theory": [
      {
        "order": 1,
        "title": "Web Workers — off-main-thread computation",
        "content": "```javascript\n// main.js — thread principal\nconst worker = new Worker('worker.js');\n\n// Trimite mesaj la worker\nworker.postMessage({ type: 'CALCULATE', data: [1, 2, 3, 4, 5] });\n\n// Primeste mesaj de la worker\nworker.onmessage = (event) => {\n  console.log('Rezultat:', event.data);\n};\n\nworker.onerror = (error) => {\n  console.error('Worker error:', error.message);\n};\n\n// Opreste worker-ul\n// worker.terminate();\n\n// worker.js — ruleaza pe un thread separat\nself.onmessage = (event) => {\n  const { type, data } = event.data;\n\n  if (type === 'CALCULATE') {\n    // Calcul intensiv care ar bloca main thread-ul\n    const result = data.reduce((sum, n) => {\n      let s = 0;\n      for (let i = 0; i < n * 1000000; i++) s++;\n      return sum + s;\n    }, 0);\n    self.postMessage({ type: 'RESULT', result });\n  }\n};\n```\n\n**Interviu:** De ce Web Workers? JavaScript e single-threaded. Calcule CPU-intensive (image processing, crypto, parsing) blocheaza main thread = UI jank. Workers ruleaza pe thread separat — main thread ramane responsive."
      },
      {
        "order": 2,
        "title": "Transferable Objects si SharedArrayBuffer",
        "content": "```javascript\n// Transferable Objects: transfer zero-copy (fara copiere)\n// main.js\nconst buffer = new ArrayBuffer(1024 * 1024); // 1MB\nconst view = new Uint8Array(buffer);\nview.fill(42);\n\n// Transfer (nu copiere) — buffer devine inaccessibil in main thread\nworker.postMessage({ buffer }, [buffer]);\nconsole.log(buffer.byteLength); // 0 — transferat!\n\n// SharedArrayBuffer: memorie impartita intre threads\n// (necesita Cross-Origin-Isolation headers)\nconst sab = new SharedArrayBuffer(1024);\nconst shared = new Int32Array(sab);\n\nworker.postMessage({ sab }); // NU transfera, partajeaza!\nshared[0] = 100;\n// worker-ul vede modificarea instantaneu!\n\n// Atomics: operatii atomice pe SharedArrayBuffer\nAtomics.add(shared, 0, 1);    // atomic increment\nAtomics.wait(shared, 0, 100); // asteapta pana ce shared[0] != 100\nAtomics.notify(shared, 0, 1); // trezeste threadul care asteapta\n```\n\n**Interviu:** Diferenta postMessage (copiere) vs SharedArrayBuffer? postMessage cu transfer = zero-copy dar ownership se muta. SharedArrayBuffer = memorie impartita reala = race conditions posibile. Atomics rezolva sincronizarea."
      },
      {
        "order": 3,
        "title": "Comlink — API modern pentru Web Workers",
        "content": "```javascript\n// Comlink (by Google) abstractizeaza postMessage intr-un API proxy\n\n// worker.js\nimport { expose } from 'comlink';\n\nconst api = {\n  async processImage(imageData) {\n    // Procesare intensiva\n    const result = heavyImageProcessing(imageData);\n    return result;\n  },\n\n  fibonacci(n) {\n    if (n <= 1) return n;\n    return this.fibonacci(n-1) + this.fibonacci(n-2);\n  }\n};\n\nexpose(api);\n\n// main.js\nimport { wrap } from 'comlink';\n\nconst worker = new Worker(new URL('./worker.js', import.meta.url),\n                          { type: 'module' });\nconst api = wrap(worker);\n\n// Apeli metode ca si cum ar fi locale, returneaza Promise!\nconst result = await api.processImage(imageData);\nconsole.log(result);\n\nconst fib = await api.fibonacci(40);\nconsole.log('fib(40) =', fib);\n\n// Comlink elimina boilerplate-ul postMessage/onmessage\n// Apelul de metoda = postMessage + Promise automat\n```"
      },
      {
        "order": 4,
        "title": "Module Workers si OffscreenCanvas",
        "content": "```javascript\n// Module Workers (import/export in worker)\nconst worker = new Worker('./worker.js', { type: 'module' });\n\n// worker.js\nimport { processData } from './utils.js'; // imports in worker!\n\nself.onmessage = async ({ data }) => {\n  const result = await processData(data);\n  self.postMessage(result);\n};\n\n// OffscreenCanvas: canvas rendering pe worker thread\n// main.js\nconst canvas = document.getElementById('myCanvas');\nconst offscreen = canvas.transferControlToOffscreen();\n\nworker.postMessage({ canvas: offscreen }, [offscreen]);\n\n// worker.js\nself.onmessage = ({ data: { canvas } }) => {\n  const ctx = canvas.getContext('2d');\n\n  function animate() {\n    ctx.clearRect(0, 0, canvas.width, canvas.height);\n    // Animatii complexe fara a bloca main thread!\n    ctx.fillRect(\n      Math.random() * canvas.width,\n      Math.random() * canvas.height,\n      50, 50\n    );\n    requestAnimationFrame(animate); // rAF functioneaza in worker!\n  }\n  animate();\n};\n```\n\n**Interviu:** OffscreenCanvas beneficii? Renderizarea canvas (3D, particle systems, data viz complexe) muta pe worker thread. Main thread ramane liber pentru input events, React rendering etc."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "De ce Web Workers",
        "question": "Ce problema principala rezolva Web Workers?",
        "options": [
          "Cod mai organizat",
          "JavaScript e single-threaded — calcule intensive blocheaza UI; Workers ruleaza pe thread separat",
          "Performanta retea",
          "Cod mai sigur"
        ],
        "answer": "JavaScript e single-threaded — calcule intensive blocheaza UI; Workers ruleaza pe thread separat",
        "explanation": "Fara workers: fibonacci(40) sau procesarea unei imagini mari freezeaza browser-ul. Cu worker: calculul e pe alt thread, UI ramane responsive.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "postMessage date",
        "question": "Cum se transmit date intre main thread si Worker?",
        "options": [
          "Prin variabile globale partajate",
          "postMessage() — datele sunt copiate (structured clone algorithm)",
          "Prin localStorage",
          "Prin fisiere temporare"
        ],
        "answer": "postMessage() — datele sunt copiate (structured clone algorithm)",
        "explanation": "Workers nu partajeaza memorie (implicit). postMessage cloneaza profund datele = sigur dar poate fi lent pentru date mari. Alternativa: Transferable Objects.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "Transferable Objects",
        "question": "Ce se intampla cu un ArrayBuffer dupa ce il transferi la worker cu `worker.postMessage({ buffer }, [buffer])`?",
        "options": [
          "E copiat in worker, disponibil si in main",
          "E transferat (zero-copy) — buffer.byteLength devine 0 in main thread",
          "Eroare — nu poti transfera ArrayBuffer",
          "Ramane neschimbat"
        ],
        "answer": "E transferat (zero-copy) — buffer.byteLength devine 0 in main thread",
        "explanation": "Transfer = mutarea ownership-ului, nu copiere. Main thread nu mai poate accesa buffer-ul. Zero-copy = performanta maxima pentru date mari.",
        "difficulty": "hard"
      },
      {
        "number": 4,
        "name": "Worker limitari",
        "question": "La ce NU are acces un Web Worker?",
        "options": [
          "Fetch API",
          "DOM, window, document — Workers nu au acces la DOM",
          "localStorage",
          "IndexedDB"
        ],
        "answer": "DOM, window, document — Workers nu au acces la DOM",
        "explanation": "Workers au: fetch, IndexedDB, setTimeout, WebSockets, crypto. NU au: document, window, DOM APIs. Pentru DOM: trimit rezultate la main thread.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "Comlink avantaj",
        "question": "Ce avantaj principal aduce Comlink fata de postMessage direct?",
        "options": [
          "E mai rapid",
          "Abstractizeaza postMessage/onmessage intr-un API de proxy — apeli metode direct, returnand Promise",
          "Elimina nevoia de worker",
          "Suporta mai multe browsere"
        ],
        "answer": "Abstractizeaza postMessage/onmessage intr-un API de proxy — apeli metode direct, returnand Promise",
        "explanation": "Fara Comlink: trimiti mesaj, asculti mesaj cu if/else pe type. Cu Comlink: const result = await workerApi.processData(data) — exact ca un apel local.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "worker.terminate()",
        "question": "Cand apelezi `worker.terminate()`?",
        "options": [
          "La fiecare trimitere de mesaj",
          "Cand worker-ul nu mai e necesar — elibereaza thread-ul si resursele",
          "Dupa fiecare calcul",
          "E apelat automat"
        ],
        "answer": "Cand worker-ul nu mai e necesar — elibereaza thread-ul si resursele",
        "explanation": "Worker-urile consuma resurse (thread OS). terminate() = cleanup esential. In React: in useEffect cleanup function sau component unmount.",
        "difficulty": "easy"
      },
      {
        "number": 7,
        "name": "SharedArrayBuffer vs postMessage",
        "question": "Cand folosesti SharedArrayBuffer in loc de postMessage pentru transfer date?",
        "options": [
          "Intotdeauna",
          "Cand mai multi workers trebuie sa acceseze si modifice aceleasi date simultan (performanta)",
          "Cand datele sunt strings",
          "Cand postMessage nu functioneaza"
        ],
        "answer": "Cand mai multi workers trebuie sa acceseze si modifice aceleasi date simultan (performanta)",
        "explanation": "SharedArrayBuffer = memorie impartita reala. Ideal pentru algoritmi paraleli care citesc/scriu in aceeasi memorie. Necesita Atomics pentru sincronizare.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "OffscreenCanvas beneficiu",
        "question": "Ce permite OffscreenCanvas?",
        "options": [
          "Deseneaza canvas fara a-l afisa",
          "Muta renderizarea canvas pe worker thread — main thread ramane liber",
          "Canvas transparent",
          "Canvas la dimensiune mai mare"
        ],
        "answer": "Muta renderizarea canvas pe worker thread — main thread ramane liber",
        "explanation": "Animatii complexe (particle systems, 3D) pe worker thread = main thread liber pentru events, React. UI mai fluent.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "Module Workers",
        "question": "Ce adauga `{ type: 'module' }` la `new Worker('./w.js', { type: 'module' })`?",
        "options": [
          "Face worker-ul mai rapid",
          "Permite folosirea import/export ES modules in worker script",
          "E obligatoriu",
          "Creeaza worker izolat"
        ],
        "answer": "Permite folosirea import/export ES modules in worker script",
        "explanation": "Module workers: worker.js poate face import { func } from './utils.js'. Fara tip module, nu poti folosi ES module imports.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Atomics.wait scop",
        "question": "La ce serveste `Atomics.wait(int32Array, index, value)`?",
        "options": [
          "Asteapta N milisecunde",
          "Blocheaza thread-ul curent pana ce valoarea la index difera de value — sincronizare intre workers",
          "Asteapta un Promise",
          "Verifica valoarea"
        ],
        "answer": "Blocheaza thread-ul curent pana ce valoarea la index difera de value — sincronizare intre workers",
        "explanation": "Atomics.wait e mutex primitiv. Alaturi de Atomics.notify (trezeste threaduri care asteapta), permite sincronizare fina intre workers.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "Worker pool pattern",
        "question": "De ce ai crea un pool de Workers in loc de un singur Worker pentru task-uri multiple?",
        "options": [
          "Un singur worker e suficient mereu",
          "Un worker poate procesa un task la un moment dat; pool = mai multi workers = paralelism real pe multi-core",
          "Pool e mai simplu",
          "Nu e recomandat"
        ],
        "answer": "Un worker poate procesa un task la un moment dat; pool = mai multi workers = paralelism real pe multi-core",
        "explanation": "navigator.hardwareConcurrency = numarul de CPU cores. Pool cu 4 workers pe 4 cores = 4x throughput fata de un singur worker.",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "Web Worker simplu coding",
        "question": "Simuleaza un Worker care calculeaza suma numerelor dintr-un array. Implementeaza comunicarea cu postMessage/onmessage.",
        "options": [],
        "answer": "",
        "explanation": "worker.onmessage = e => console.log('Suma:', e.data.sum); worker.postMessage({type: 'SUM', numbers: [1,2,3,4,5]}); // Suma: 15",
        "difficulty": "easy"
      },
      {
        "number": 13,
        "name": "Worker cu Promises coding",
        "question": "Implementeaza un wrapper runInWorker(task) care returneaza un Promise rezolvat cu rezultatul calculului din worker.",
        "options": [],
        "answer": "",
        "explanation": "return new Promise(resolve => { const id = idCounter(); worker.pendingCallbacks.set(id, resolve); worker.postMessage({id, task}); })",
        "difficulty": "hard"
      },
      {
        "number": 14,
        "name": "Transferable buffer coding",
        "question": "Creeaza un Uint8Array cu valorile 1-10, transfera-l la un worker simulat si verifica ca buffer-ul original devine inaccesibil.",
        "options": [],
        "answer": "",
        "explanation": "Dupa worker.postMessage({buffer}, [buffer]): buffer.byteLength === 0. new Uint8Array(buffer) ar da eroare. Transferul muta ownership-ul.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Worker pool simplu coding",
        "question": "Implementeaza un WorkerPool care distribuie task-uri intre N workers simulati si returneaza Promise cu toate rezultatele.",
        "options": [],
        "answer": "",
        "explanation": "WorkerPool limiteaza la max 'size' task-uri concurente. Task-urile extra asteapta in queue. Promise.all colecteaza toate rezultatele.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "websockets-sse",
    "title": "39. WebSockets si SSE",
    "order": 39,
    "theory": [
      {
        "order": 1,
        "title": "WebSockets — comunicare bidirectionala real-time",
        "content": "```javascript\n// WebSocket: conexiune persistenta bidirectionala\nconst ws = new WebSocket('wss://api.example.com/ws');\n\nws.addEventListener('open', () => {\n  console.log('Conectat!');\n  ws.send(JSON.stringify({ type: 'JOIN', room: 'general' }));\n});\n\nws.addEventListener('message', (event) => {\n  const data = JSON.parse(event.data);\n  console.log('Primit:', data);\n});\n\nws.addEventListener('close', (event) => {\n  console.log(`Deconectat: ${event.code} ${event.reason}`);\n});\n\nws.addEventListener('error', (error) => {\n  console.error('WS Error:', error);\n});\n\n// Trimite mesaj\nfunction sendMessage(type, payload) {\n  if (ws.readyState === WebSocket.OPEN) {\n    ws.send(JSON.stringify({ type, payload }));\n  } else {\n    console.warn('WebSocket nu e deschis');\n  }\n}\n\n// Verifica starea: CONNECTING(0), OPEN(1), CLOSING(2), CLOSED(3)\nconsole.log(ws.readyState); // 0 sau 1\n```\n\n**Interviu:** WebSocket vs HTTP polling? Polling: clientul face request la fiecare N secunde — latenta, overhead. WebSocket: conexiune persistenta, mesaje instant, overhead mic dupa handshake initial. Ideal: chat, live cursuri, gaming."
      },
      {
        "order": 2,
        "title": "Reconnect logic si heartbeat",
        "content": "```javascript\nclass ReconnectingWebSocket {\n  constructor(url, options = {}) {\n    this.url = url;\n    this.maxRetries = options.maxRetries || 5;\n    this.retryDelay = options.retryDelay || 1000;\n    this.heartbeatInterval = options.heartbeatInterval || 30000;\n    this.retryCount = 0;\n    this.handlers = {};\n\n    this.connect();\n  }\n\n  connect() {\n    this.ws = new WebSocket(this.url);\n    this.ws.onopen = () => {\n      this.retryCount = 0;\n      this.startHeartbeat();\n      this.emit('open');\n    };\n    this.ws.onmessage = (e) => this.emit('message', JSON.parse(e.data));\n    this.ws.onclose = () => {\n      this.stopHeartbeat();\n      this.emit('close');\n      if (this.retryCount < this.maxRetries) {\n        const delay = this.retryDelay * Math.pow(2, this.retryCount);\n        console.log(`Reconectez in ${delay}ms...`);\n        setTimeout(() => this.connect(), delay);\n        this.retryCount++;\n      }\n    };\n  }\n\n  startHeartbeat() {\n    this.heartbeatTimer = setInterval(() => {\n      if (this.ws.readyState === WebSocket.OPEN) {\n        this.ws.send(JSON.stringify({ type: 'PING' }));\n      }\n    }, this.heartbeatInterval);\n  }\n\n  stopHeartbeat() { clearInterval(this.heartbeatTimer); }\n  emit(event, data) { this.handlers[event]?.forEach(h => h(data)); }\n  on(event, handler) {\n    if (!this.handlers[event]) this.handlers[event] = [];\n    this.handlers[event].push(handler);\n  }\n  send(data) { this.ws.send(JSON.stringify(data)); }\n}\n```"
      },
      {
        "order": 3,
        "title": "Server-Sent Events (SSE) — server push unidirectional",
        "content": "```javascript\n// SSE: server trimite updates, clientul nu poate trimite\n// Perfect pentru: live feed, notificari, stock prices\n\nconst sse = new EventSource('/api/events');\n\nsse.addEventListener('open', () => {\n  console.log('SSE conectat');\n});\n\nsse.addEventListener('message', (event) => {\n  const data = JSON.parse(event.data);\n  console.log('Update:', data);\n});\n\n// Named events\nsse.addEventListener('priceUpdate', (event) => {\n  updateChart(JSON.parse(event.data));\n});\n\nsse.addEventListener('error', () => {\n  if (sse.readyState === EventSource.CLOSED) {\n    console.log('SSE deconectat');\n  }\n});\n\n// Inchide conexiunea\nsse.close();\n\n// Server side (Node.js/Express)\napp.get('/api/events', (req, res) => {\n  res.setHeader('Content-Type', 'text/event-stream');\n  res.setHeader('Cache-Control', 'no-cache');\n  res.setHeader('Connection', 'keep-alive');\n\n  const sendEvent = (eventName, data) => {\n    res.write(`event: ${eventName}\\n`);\n    res.write(`data: ${JSON.stringify(data)}\\n\\n`);\n  };\n\n  const interval = setInterval(() => {\n    sendEvent('priceUpdate', { price: Math.random() * 100 });\n  }, 1000);\n\n  req.on('close', () => clearInterval(interval));\n});\n```\n\n**Interviu:** SSE vs WebSocket? SSE: simplu, HTTP-based, auto-reconnect, unidirectional (server->client). WebSocket: bidirectional, protocol separat, mai complex. Alegere: SSE pentru notifications, WebSocket pentru chat/gaming."
      },
      {
        "order": 4,
        "title": "WebSocket in React cu custom hook",
        "content": "```javascript\nimport { useState, useEffect, useRef, useCallback } from 'react';\n\nfunction useWebSocket(url) {\n  const [status, setStatus] = useState('connecting');\n  const [messages, setMessages] = useState([]);\n  const wsRef = useRef(null);\n\n  useEffect(() => {\n    const ws = new WebSocket(url);\n    wsRef.current = ws;\n\n    ws.onopen = () => setStatus('open');\n    ws.onclose = () => setStatus('closed');\n    ws.onerror = () => setStatus('error');\n    ws.onmessage = (e) => {\n      const data = JSON.parse(e.data);\n      setMessages(prev => [...prev, data]);\n    };\n\n    return () => ws.close(); // cleanup!\n  }, [url]);\n\n  const sendMessage = useCallback((data) => {\n    if (wsRef.current?.readyState === WebSocket.OPEN) {\n      wsRef.current.send(JSON.stringify(data));\n    }\n  }, []);\n\n  return { status, messages, sendMessage };\n}\n\n// Utilizare\nfunction ChatComponent() {\n  const { status, messages, sendMessage } = useWebSocket('wss://chat.app/ws');\n  return (\n    <div>\n      <p>Status: {status}</p>\n      {messages.map((m, i) => <div key={i}>{m.text}</div>)}\n      <button onClick={() => sendMessage({ text: 'Salut!' })}>\n        Trimite\n      </button>\n    </div>\n  );\n}\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "WebSocket vs HTTP Polling",
        "question": "De ce WebSocket e mai eficient decat HTTP polling pentru real-time?",
        "options": [
          "WebSocket e mai nou",
          "Polling face request-uri la fiecare N secunde (overhead HTTP, latenta); WS = conexiune persistenta, mesaje instant",
          "WebSocket e mai simplu",
          "Polling nu e real-time"
        ],
        "answer": "Polling face request-uri la fiecare N secunde (overhead HTTP, latenta); WS = conexiune persistenta, mesaje instant",
        "explanation": "Polling la 1s = 3600 req/ora/client. WS: un singur handshake, apoi mesaje instant. La 1000 clienti: diferenta masiva.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "ws.readyState valori",
        "question": "Ce inseamna `ws.readyState === 1` (WebSocket.OPEN)?",
        "options": [
          "Conexiunea e inchisa",
          "Conexiunea e deschisa si gata pentru trimitere date",
          "Se conecteaza",
          "Eroare"
        ],
        "answer": "Conexiunea e deschisa si gata pentru trimitere date",
        "explanation": "States: 0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED. Verifica readyState inainte de send() pentru a evita erori.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "Reconnect exponential backoff",
        "question": "De ce folosesti exponential backoff (delay * 2^retryCount) la reconnect?",
        "options": [
          "Conventie",
          "Evita bombardarea serverului cu reconnect-uri rapide cand serverul e supraincercat",
          "E mai rapid",
          "Obligatoriu"
        ],
        "answer": "Evita bombardarea serverului cu reconnect-uri rapide cand serverul e supraincercat",
        "explanation": "Daca 1000 clienti se reconnecteaza simultan la 1s interval = DDoS accidental. Backoff: 1s, 2s, 4s, 8s, 16s = esutat distribuit.",
        "difficulty": "hard"
      },
      {
        "number": 4,
        "name": "Heartbeat scop",
        "question": "De ce trimiti mesaje PING periodic pe WebSocket (heartbeat)?",
        "options": [
          "Sa trimiti date mai rapid",
          "Sa previi inchiderea conexiunii de catre proxy-uri/firewall-uri care timeout idle connections",
          "Sa testezi latenta",
          "E obligatoriu"
        ],
        "answer": "Sa previi inchiderea conexiunii de catre proxy-uri/firewall-uri care timeout idle connections",
        "explanation": "Proxy-urile inchid conexiuni TCP inactive dupa 60-90s. PING la 30s mentine conexiunea activa. Server raspunde PONG.",
        "difficulty": "hard"
      },
      {
        "number": 5,
        "name": "SSE vs WebSocket",
        "question": "Cand alegi SSE in loc de WebSocket?",
        "options": [
          "Intotdeauna, SSE e mai simplu",
          "Cand ai nevoie doar de server -> client (notificari, live feed) — SSE e mai simplu, HTTP-based, auto-reconnect",
          "Cand ai nevoie de bidirectional",
          "Cand ai multi utilizatori"
        ],
        "answer": "Cand ai nevoie doar de server -> client (notificari, live feed) — SSE e mai simplu, HTTP-based, auto-reconnect",
        "explanation": "SSE functioneaza prin HTTP standard, trece prin proxies, se reconecteaza automat. WebSocket = protocol separat, bidirectional, mai complex.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "SSE auto-reconnect",
        "question": "Ce face EventSource daca conexiunea se intrerupe?",
        "options": [
          "Arunca eroare si se opreste",
          "Se reconecteaza automat dupa ~3 secunde (comportament built-in)",
          "Trebuie reconectat manual",
          "Asteapta indefinit"
        ],
        "answer": "Se reconecteaza automat dupa ~3 secunde (comportament built-in)",
        "explanation": "SSE auto-reconnect e built-in (spre deosebire de WebSocket). Serverul poate seta retry: 5000 in stream pentru a controla intervalul.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "Content-Type SSE",
        "question": "Ce Content-Type trebuie sa returneze un endpoint SSE?",
        "options": [
          "application/json",
          "text/event-stream",
          "text/plain",
          "application/octet-stream"
        ],
        "answer": "text/event-stream",
        "explanation": "text/event-stream e MIME type-ul pentru SSE. Browser-ul recunoaste formatul si dispatchez events. Cache-Control: no-cache e recomandat.",
        "difficulty": "easy"
      },
      {
        "number": 8,
        "name": "Named events SSE",
        "question": "Cum asculti un event SSE cu un nume specific (ex. 'priceUpdate')?",
        "options": [
          "sse.onmessage si verifici data",
          "sse.addEventListener('priceUpdate', handler)",
          "sse.on('priceUpdate', handler)",
          "Toate mesajele sunt 'message'"
        ],
        "answer": "sse.addEventListener('priceUpdate', handler)",
        "explanation": "Server trimite `event: priceUpdate\\ndata: {...}\\n\\n`. Client: sse.addEventListener('priceUpdate', e => ...). Mesaje fara event: = 'message'.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "WS useEffect cleanup",
        "question": "De ce returnezi `() => ws.close()` din useEffect pentru WebSocket?",
        "options": [
          "E optional",
          "Previne memory leaks si conexiuni zombie cand componenta React se distruge",
          "Inchide conexiunea la fiecare render",
          "E obligatoriu de React"
        ],
        "answer": "Previne memory leaks si conexiuni zombie cand componenta React se distruge",
        "explanation": "Fara cleanup: WebSocket ramane activ dupa unmount. onmessage apeleaza setMessages pe un component desmontat = erori React.",
        "difficulty": "hard"
      },
      {
        "number": 10,
        "name": "ws.send format",
        "question": "Ce trebuie sa faci cu datele inainte de `ws.send(data)` pentru a trimite obiecte JavaScript?",
        "options": [
          "ws.send accepta obiecte direct",
          "JSON.stringify(data) — ws.send trimite string/binary, nu obiecte JS",
          "Buffer.from(data)",
          "Nimic special"
        ],
        "answer": "JSON.stringify(data) — ws.send trimite string/binary, nu obiecte JS",
        "explanation": "WebSocket transmite text (string) sau binary (ArrayBuffer). Obiectele JS trebuie serializate: ws.send(JSON.stringify(obj)). Receptor: JSON.parse(e.data).",
        "difficulty": "easy"
      },
      {
        "number": 11,
        "name": "Inchidere cod status",
        "question": "Ce reprezinta `event.code` in `ws.addEventListener('close', event => ...)`?",
        "options": [
          "ID-ul conexiunii",
          "Codul numeric al motivului inchiderii (1000=normal, 1001=going away, 1006=abnormal)",
          "HTTP status code",
          "Timestamp"
        ],
        "answer": "Codul numeric al motivului inchiderii (1000=normal, 1001=going away, 1006=abnormal)",
        "explanation": "WebSocket close codes: 1000=inchidere normala, 1001=server/client going away, 1006=conexiune anormal inchisa. Util pentru decizia de reconnect.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "WebSocket simplu coding",
        "question": "Implementeaza o clasa SimpleWebSocket cu metodele connect(), send(data) si onmessage. Simuleaza cu EventTarget.",
        "options": [],
        "answer": "",
        "explanation": "ws.on('open', () => ws.send({text: 'Hello'})); ws.on('message', e => console.log(JSON.parse(e.data))); ws.connect();",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Reconnect logic coding",
        "question": "Implementeaza o functie reconnect(url, maxRetries) care incearca reconectarea cu exponential backoff. Simuleaza conexiunile esuate.",
        "options": [],
        "answer": "",
        "explanation": "Pattern: while(retries < max) { try { connect() } catch { await sleep(delay * 2^retries); retries++ } }",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "SSE simulat coding",
        "question": "Simuleaza un SSE stream care trimite 5 events la interval de 100ms si le afiseaza pe client.",
        "options": [],
        "answer": "",
        "explanation": "const sse = new MockSSE('/events'); sse.addEventListener('open', () => console.log('Connected')); sse.addEventListener('message', e => console.log(JSON.parse(e.data)));",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Chat room WebSocket coding",
        "question": "Implementeaza o clasa ChatRoom care gestioneaza mesaje multiple utilizatori folosind WebSocket simulat. Include join, send si history.",
        "options": [],
        "answer": "",
        "explanation": "ChatRoom simuleaza logica server-side de WS. In realitate: server face broadcast la toti membrii camerei.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "canvas-api",
    "title": "40. Canvas API",
    "order": 40,
    "theory": [
      {
        "order": 1,
        "title": "Canvas 2D — primitive si context",
        "content": "```javascript\nconst canvas = document.getElementById('canvas');\nconst ctx = canvas.getContext('2d');\n\n// Dimensiune corecta pentru retina displays\nconst dpr = window.devicePixelRatio || 1;\nconst rect = canvas.getBoundingClientRect();\ncanvas.width = rect.width * dpr;\ncanvas.height = rect.height * dpr;\nctx.scale(dpr, dpr);\n\n// Curatare si culori\nctx.clearRect(0, 0, canvas.width, canvas.height);\nctx.fillStyle = '#3498db';\nctx.strokeStyle = '#2c3e50';\nctx.lineWidth = 2;\n\n// Dreptunghi\nctx.fillRect(50, 50, 200, 100);\nctx.strokeRect(50, 50, 200, 100);\n\n// Cerc\nctx.beginPath();\nctx.arc(200, 200, 50, 0, Math.PI * 2);\nctx.fill();\nctx.stroke();\n\n// Linie si path\nctx.beginPath();\nctx.moveTo(10, 10);\nctx.lineTo(300, 10);\nctx.lineTo(300, 200);\nctx.closePath(); // inchide path-ul\nctx.stroke();\n\n// Text\nctx.font = 'bold 24px Arial';\nctx.fillStyle = 'white';\nctx.textAlign = 'center';\nctx.fillText('Canvas!', 200, 210);\n```\n\n**Interviu:** Canvas vs SVG? Canvas: pixel-based, mai rapid pentru animatii/jocuri/particule. SVG: vector, scalabil, DOM-based (events pe elemente), mai bun pentru diagrame statice/interactive."
      },
      {
        "order": 2,
        "title": "Animation loop cu requestAnimationFrame",
        "content": "```javascript\nconst canvas = document.getElementById('canvas');\nconst ctx = canvas.getContext('2d');\n\nconst ball = { x: 100, y: 100, vx: 3, vy: 2, r: 20 };\n\nfunction update() {\n  // Misca bila\n  ball.x += ball.vx;\n  ball.y += ball.vy;\n\n  // Bounce pe pereti\n  if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width)\n    ball.vx *= -1;\n  if (ball.y - ball.r < 0 || ball.y + ball.r > canvas.height)\n    ball.vy *= -1;\n}\n\nfunction draw() {\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\n\n  // Background\n  ctx.fillStyle = '#1a1a2e';\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n\n  // Bila\n  ctx.beginPath();\n  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);\n  const gradient = ctx.createRadialGradient(\n    ball.x - 5, ball.y - 5, 2, ball.x, ball.y, ball.r\n  );\n  gradient.addColorStop(0, '#74b9ff');\n  gradient.addColorStop(1, '#0984e3');\n  ctx.fillStyle = gradient;\n  ctx.fill();\n}\n\nlet animId = null;\nfunction loop() {\n  update();\n  draw();\n  animId = requestAnimationFrame(loop);\n}\n\nloop(); // porneste animatia\n// cancelAnimationFrame(animId); // opreste\n```"
      },
      {
        "order": 3,
        "title": "Transformari, gradient si imagini",
        "content": "```javascript\nconst ctx = canvas.getContext('2d');\n\n// Transformari\nctx.save(); // salveaza starea curenta\nctx.translate(200, 200); // muta originea\nctx.rotate(Math.PI / 4); // 45 grade\nctx.scale(1.5, 1.5);     // scaling\nctx.fillRect(-50, -50, 100, 100); // in jurul noului origin\nctx.restore(); // restaureaza starea anterioara\n\n// Gradient linear\nconst grad = ctx.createLinearGradient(0, 0, 400, 0);\ngrad.addColorStop(0, '#e74c3c');\ngrad.addColorStop(0.5, '#3498db');\ngrad.addColorStop(1, '#2ecc71');\nctx.fillStyle = grad;\nctx.fillRect(0, 0, 400, 50);\n\n// Gradient radial\nconst radGrad = ctx.createRadialGradient(200, 200, 20, 200, 200, 100);\nradGrad.addColorStop(0, 'rgba(255,255,0,1)');\nradGrad.addColorStop(1, 'rgba(255,255,0,0)');\n\n// Imagini pe canvas\nconst img = new Image();\nimg.onload = () => {\n  ctx.drawImage(img, 0, 0, 200, 150);        // normal\n  ctx.drawImage(img, 50,50,100,100, 0,0,200,200); // crop si scale\n};\nimg.src = 'photo.jpg';\n\n// clip pentru zone de vizibilitate\nctx.save();\nctx.beginPath();\nctx.arc(200, 200, 100, 0, Math.PI * 2);\nctx.clip(); // orice desenezi se vede doar in cerc\nctx.drawImage(img, 100, 100, 200, 200);\nctx.restore();\n```"
      },
      {
        "order": 4,
        "title": "Interactivitate — mouse events si hit testing",
        "content": "```javascript\nconst canvas = document.getElementById('canvas');\nconst ctx = canvas.getContext('2d');\n\n// Converteste coordonate mouse -> canvas\nfunction getCanvasPos(event) {\n  const rect = canvas.getBoundingClientRect();\n  return {\n    x: (event.clientX - rect.left) * (canvas.width / rect.width),\n    y: (event.clientY - rect.top) * (canvas.height / rect.height)\n  };\n}\n\n// Obiecte interactive\nconst circles = [\n  { x: 100, y: 100, r: 40, color: 'red', hovered: false },\n  { x: 250, y: 150, r: 50, color: 'blue', hovered: false },\n];\n\nfunction isInsideCircle(cx, cy, r, px, py) {\n  const dx = px - cx, dy = py - cy;\n  return dx*dx + dy*dy <= r*r;\n}\n\ncanvas.addEventListener('mousemove', (e) => {\n  const { x, y } = getCanvasPos(e);\n  circles.forEach(c => {\n    c.hovered = isInsideCircle(c.x, c.y, c.r, x, y);\n  });\n  canvas.style.cursor = circles.some(c => c.hovered) ? 'pointer' : 'default';\n  render();\n});\n\ncanvas.addEventListener('click', (e) => {\n  const { x, y } = getCanvasPos(e);\n  circles.forEach(c => {\n    if (isInsideCircle(c.x, c.y, c.r, x, y)) {\n      c.color = `hsl(${Math.random()*360}, 70%, 50%)`;\n    }\n  });\n  render();\n});\n\nfunction render() {\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\n  circles.forEach(c => {\n    ctx.beginPath();\n    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);\n    ctx.fillStyle = c.color;\n    ctx.globalAlpha = c.hovered ? 0.7 : 1;\n    ctx.fill();\n  });\n  ctx.globalAlpha = 1;\n}\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Canvas vs SVG",
        "question": "Cand alegi Canvas in loc de SVG?",
        "options": [
          "Intotdeauna Canvas e mai bun",
          "Canvas: jocuri/animatii cu multi obiecte (particule, bullets); SVG: diagrame interactive, scalare infinita",
          "SVG nu mai e recomandat",
          "Depinde de browser"
        ],
        "answer": "Canvas: jocuri/animatii cu multi obiecte (particule, bullets); SVG: diagrame interactive, scalare infinita",
        "explanation": "Canvas = pixel raster, re-draw la fiecare frame. SVG = DOM nodes pentru fiecare element. 1000 particule: Canvas mult mai rapid. 10 elemente interactive: SVG mai simplu.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "clearRect necesitate",
        "question": "De ce apelezi `ctx.clearRect(0, 0, w, h)` la inceput de fiecare frame in animation loop?",
        "options": [
          "E obligatoriu",
          "Sterge frame-ul anterior — fara clear, obiectele lasa urma (ghosting)",
          "Optimizare",
          "Reset transformari"
        ],
        "answer": "Sterge frame-ul anterior — fara clear, obiectele lasa urma (ghosting)",
        "explanation": "Canvas e persistent — daca nu stergi, fiecare frame se suprapune peste cel anterior. clearRect curata tot sau o zona specifica.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "requestAnimationFrame avantaj",
        "question": "De ce `requestAnimationFrame` e preferat `setInterval(draw, 16)` pentru animatii?",
        "options": [
          "rAF e mai rapid",
          "rAF e sincronizat cu refresh-ul display-ului (~60fps), pauzat in tab inactive, mai fluid",
          "setInterval nu functioneaza",
          "rAF are mai multi parametri"
        ],
        "answer": "rAF e sincronizat cu refresh-ul display-ului (~60fps), pauzat in tab inactive, mai fluid",
        "explanation": "setInterval la 16ms e aproximativ, poate produce tearing. rAF e la exact momentul optim pentru browser. Pauzat in tab inactiv = economie baterie.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "ctx.save() si ctx.restore()",
        "question": "Ce salveaza si restaureaza `ctx.save()` / `ctx.restore()`?",
        "options": [
          "Coordonatele obiectelor",
          "Starea context-ului: transformari, culori, font, lineWidth, globalAlpha etc.",
          "Pixelii desenati",
          "Istoria undo"
        ],
        "answer": "Starea context-ului: transformari, culori, font, lineWidth, globalAlpha etc.",
        "explanation": "save/restore e un stack. save() pune starea pe stack. restore() o scoate. Esential pentru a aplica transformari temporare fara a afecta restul.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "beginPath() importanta",
        "question": "Ce se intampla daca uiti `ctx.beginPath()` inainte de arc() sau moveTo()?",
        "options": [
          "Nimic",
          "Path-ul nou se concateneaza cu cel anterior — pot aparea linii sau umpleri neasteptate",
          "Eroare",
          "Arc nu se deseneaza"
        ],
        "answer": "Path-ul nou se concateneaza cu cel anterior — pot aparea linii sau umpleri neasteptate",
        "explanation": "Canvas pastreaza path-ul curent. Fara beginPath(), arc/line noi se adauga la path-ul existent. La fill()/stroke() se proceseaza totul = artefacte vizuale.",
        "difficulty": "hard"
      },
      {
        "number": 6,
        "name": "devicePixelRatio",
        "question": "De ce inmultesti canvas.width cu `window.devicePixelRatio`?",
        "options": [
          "E optional",
          "Pe retina displays (dpr=2), fara scalare imaginea e blurry; * dpr = rezolutie corecta",
          "Sa faci canvas mai mare",
          "Compatibilitate Chrome"
        ],
        "answer": "Pe retina displays (dpr=2), fara scalare imaginea e blurry; * dpr = rezolutie corecta",
        "explanation": "dpr=2 = 4 pixeli hardware per pixel CSS. Canvas la rezolutie CSS = fiecare pixel e interpolat la 4 = blur. La dpr: canvas are rezolutia hardware reala.",
        "difficulty": "hard"
      },
      {
        "number": 7,
        "name": "ctx.clip() scop",
        "question": "Ce face `ctx.clip()` dupa un path definit?",
        "options": [
          "Taie o bucata din canvas",
          "Tot ce se deseneaza ulterior e vizibil DOAR in interiorul path-ului",
          "Sterge path-ul",
          "Creeaza imagine"
        ],
        "answer": "Tot ce se deseneaza ulterior e vizibil DOAR in interiorul path-ului",
        "explanation": "clip() = masca de vizibilitate. Ex: clip cu cerc, drawImage cu poza mare = poza apare numai in cerc. save()/restore() pentru clip temporar.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "getCanvasPos necesitate",
        "question": "De ce convertesti coordonatele mouse la coordonate canvas cu `getBoundingClientRect()`?",
        "options": [
          "clientX/clientY sunt in coordonate canvas deja",
          "Mouse coords sunt relative la viewport; canvas poate fi la o pozitie diferita si cu alt scale CSS",
          "Performanta",
          "Nu e necesar"
        ],
        "answer": "Mouse coords sunt relative la viewport; canvas poate fi la o pozitie diferita si cu alt scale CSS",
        "explanation": "clientX = de la coltul browser-ului. canvas.getBoundingClientRect() = pozitia canvasului in viewport. (clientX - rect.left) * scale = coord canvas reala.",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "createLinearGradient",
        "question": "Ce definesc parametrii `ctx.createLinearGradient(x0, y0, x1, y1)`?",
        "options": [
          "Centrul si raza gradientului",
          "Punctele de start (x0,y0) si sfarsit (x1,y1) ale directiei gradientului",
          "Marginile canvas-ului",
          "Culorile gradientului"
        ],
        "answer": "Punctele de start (x0,y0) si sfarsit (x1,y1) ale directiei gradientului",
        "explanation": "Gradientul se aplica de-a lungul liniei de la (x0,y0) la (x1,y1). Orizontal: y0=y1; vertical: x0=x1; diagonal: valori diferite.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "globalAlpha",
        "question": "Ce face `ctx.globalAlpha = 0.5` inainte de `ctx.fill()`?",
        "options": [
          "Seteaza culoarea la gri 50%",
          "Face tot ce se deseneaza semi-transparent (50% opacitate)",
          "Dezactiveaza antialiasing",
          "Face canvas mai mic"
        ],
        "answer": "Face tot ce se deseneaza semi-transparent (50% opacitate)",
        "explanation": "globalAlpha afecteaza toate operatiile de desenare ulterioare. 0=complet transparent, 1=opac. Reseteaza cu globalAlpha=1 dupa save/restore.",
        "difficulty": "easy"
      },
      {
        "number": 11,
        "name": "hit testing cerc",
        "question": "Formula pentru a testa daca un punct (px, py) e in interiorul unui cerc cu centrul (cx, cy) si raza r?",
        "options": [
          "Math.abs(px-cx) < r && Math.abs(py-cy) < r",
          "(px-cx)^2 + (py-cy)^2 <= r^2",
          "Math.sqrt(px-cx + py-cy) <= r",
          "px >= cx-r && px <= cx+r"
        ],
        "answer": "(px-cx)^2 + (py-cy)^2 <= r^2",
        "explanation": "Teorema lui Pitagora: distanta de la punct la centru = sqrt(dx^2+dy^2). Daca <= r, e in cerc. Evita sqrt comparat cu r^2.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Desen forme coding",
        "question": "Deseneaza pe canvas: un dreptunghi rosu (50,50,100,80), un cerc albastru la (200,100) raza 40, si textul 'Hello Canvas' la (150,200).",
        "options": [],
        "answer": "",
        "explanation": "ctx.fillStyle='red'; ctx.fillRect(50,50,100,80); ctx.fillStyle='blue'; ctx.beginPath(); ctx.arc(200,100,40,0,Math.PI*2); ctx.fill(); ctx.fillText('Hello Canvas',150,200);",
        "difficulty": "easy"
      },
      {
        "number": 13,
        "name": "Animation loop coding",
        "question": "Implementeaza un animation loop simplu cu requestAnimationFrame care misca un cerc de la stanga la dreapta (bounce).",
        "options": [],
        "answer": "",
        "explanation": "function animate() { ball.x += ball.vx; if(ball.x+r>W || ball.x-r<0) ball.vx*=-1; requestAnimationFrame(animate); } requestAnimationFrame(animate);",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Mouse interaction coding",
        "question": "Implementeaza isInsideCircle(cx, cy, r, px, py) si o functie findHovered(circles, mouseX, mouseY) care returneaza cercul hoverat.",
        "options": [],
        "answer": "",
        "explanation": "const dx=px-cx, dy=py-cy; return dx*dx+dy*dy <= r*r. findHovered: return circles.find(c => isInsideCircle(c.x,c.y,c.r,mx,my)) || null;",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Particle system coding",
        "question": "Implementeaza un sistem de particule simplu: creeaza 20 de particule cu pozitii, viteze si culori aleatoare. La fiecare update, misca si respinge de pereti.",
        "options": [],
        "answer": "",
        "explanation": "Array.from({length: count}, () => ({x: rand*W, y: rand*H, vx: (rand-0.5)*6, vy: ..., r: 3+rand*5, color: ...})); update: p.x+=p.vx; bounce logic.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "javascript-performance",
    "title": "41. JavaScript Performance",
    "order": 41,
    "theory": [
      {
        "order": 1,
        "title": "Memory leaks — identificare si prevenire",
        "content": "```javascript\n// 1. Referinte globale accidentale\nfunction leak() {\n  leaked = 'string mare'; // fara var/let/const = global!\n}\n\n// 2. Closures care retin date mari\nfunction createHeavyClosure() {\n  const massiveData = new Array(100000).fill('data');\n  return function() {\n    // massiveData nu e folosita dar e retinuta in closure!\n    return 42;\n  };\n}\nconst fn = createHeavyClosure(); // massiveData niciodata GC\n\n// Fix:\nfunction createOptimized() {\n  const massiveData = new Array(100000).fill('data');\n  const result = processData(massiveData); // extrage ce ai nevoie\n  return function() { return result; };\n  // massiveData poate fi GC acum\n}\n\n// 3. Event listeners neutilizati\nconst btn = document.getElementById('btn');\nfunction handler() { /* ... */ }\nbtn.addEventListener('click', handler);\n// Ren are bun: btn.removeEventListener('click', handler);\n\n// 4. Timers care retin referinte\nlet data = { masiv: new Array(100000) };\nconst timer = setInterval(() => {\n  console.log(data.masiv.length); // retine data in closure!\n}, 1000);\n// Fix: clearInterval(timer) cand nu mai e necesar\n\n// Detectare: Chrome DevTools -> Memory -> Take heap snapshot\n// Compara doua snapshot-uri pentru a gasi ce creste\n```\n\n**Interviu:** Cum identifici memory leaks? Chrome DevTools Memory tab: heap snapshots, allocation timeline. Cauta obiecte care cresc la fiecare actiune si nu sunt GC-uite."
      },
      {
        "order": 2,
        "title": "Profiling si optimization techniques",
        "content": "```javascript\n// Performance API pentru masurare precisa\nperformance.mark('start');\n// ... operatia de masurat ...\nperformance.mark('end');\nperformance.measure('operatia-mea', 'start', 'end');\nconst [measure] = performance.getEntriesByName('operatia-mea');\nconsole.log(`Durata: ${measure.duration}ms`);\n\n// Debounce: limiteaza apeluri frecvente\nfunction debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n\nconst onSearch = debounce((query) => {\n  fetchResults(query); // apelat la 300ms dupa ultima tastatura\n}, 300);\ninput.addEventListener('input', e => onSearch(e.target.value));\n\n// Throttle: cel mult N apeluri pe secunda\nfunction throttle(fn, limit) {\n  let lastCall = 0;\n  return function(...args) {\n    const now = Date.now();\n    if (now - lastCall >= limit) {\n      lastCall = now;\n      return fn.apply(this, args);\n    }\n  };\n}\n\nconst onScroll = throttle(() => updateUI(), 100); // max 10/sec\nwindow.addEventListener('scroll', onScroll);\n\n// Lazy loading cu dynamic import\nconst loadModule = async () => {\n  const { heavyFunc } = await import('./heavy-module.js');\n  return heavyFunc();\n};\n```"
      },
      {
        "order": 3,
        "title": "Virtual DOM si reconciliation concept",
        "content": "```javascript\n// Conceptul Virtual DOM in spatiul JS pur\n\n// 1. Reprezentare virtuala (VDOM)\nconst vdom = {\n  type: 'div',\n  props: { className: 'container', id: 'app' },\n  children: [\n    { type: 'h1', props: {}, children: ['Titlu'], key: 'h1' },\n    { type: 'ul', props: {}, children: [\n      { type: 'li', props: {}, children: ['Item 1'], key: '1' },\n      { type: 'li', props: {}, children: ['Item 2'], key: '2' },\n    ], key: 'ul' }\n  ],\n  key: 'root'\n};\n\n// 2. Diff algoritm (simplificat)\nfunction diff(oldNode, newNode) {\n  if (!oldNode) return { type: 'CREATE', node: newNode };\n  if (!newNode) return { type: 'DELETE' };\n  if (typeof oldNode !== typeof newNode) return { type: 'REPLACE', node: newNode };\n  if (typeof oldNode === 'string') {\n    return oldNode !== newNode ? { type: 'TEXT', content: newNode } : null;\n  }\n  if (oldNode.type !== newNode.type) return { type: 'REPLACE', node: newNode };\n\n  // Aceeasi componenta: diff recursiv props + children\n  return {\n    type: 'UPDATE',\n    props: diffProps(oldNode.props, newNode.props),\n    children: diffChildren(oldNode.children, newNode.children)\n  };\n}\n\n// 3. Cheia beneficiului: batching DOM updates\n// React colecteaza toate setState() intr-un ciclu\n// si aplica MINIM de modificari DOM la final\n// Fara VDOM: fiecare setState = DOM update = reflow/repaint\n```\n\n**Interviu:** De ce Virtual DOM e performant? DOM real e lent de modificat (reflow, repaint). VDOM = manipulare JS pura (rapida). Diff = calculeaza MINIM de modificari DOM necesare. Batch updates = un singur reflow in loc de N."
      },
      {
        "order": 4,
        "title": "Web Vitals, layout thrashing si best practices",
        "content": "```javascript\n// Layout Thrashing: forteaza browser-ul sa recalculeze layout de multe ori\n\n// GRESIT: citire si scriere alternate forteaza reflow la fiecare iteratie\nfor (let i = 0; i < elements.length; i++) {\n  const w = elements[i].offsetWidth; // citire — forteaza layout\n  elements[i].style.width = (w + 10) + 'px'; // scriere — invalideaza\n}\n\n// CORECT: batcheaza toate citirile, apoi scrierile\nconst widths = elements.map(el => el.offsetWidth); // citeste tot\nelements.forEach((el, i) => { el.style.width = (widths[i] + 10) + 'px'; });\n\n// DocumentFragment: adauga multi copii fara reflow per element\nconst fragment = document.createDocumentFragment();\nfor (let i = 0; i < 100; i++) {\n  const li = document.createElement('li');\n  li.textContent = `Item ${i}`;\n  fragment.appendChild(li); // nu modifica DOM-ul real\n}\nul.appendChild(fragment); // UN SINGUR reflow!\n\n// will-change: hint pentru browser sa pregateasca layer GPU\n// CSS: .animated-el { will-change: transform; }\n// Atentie: nu abuza — fiecare will-change = layer GPU separat = VRAM\n\n// Core Web Vitals (monitorizare performanta)\n// LCP (Largest Contentful Paint) < 2.5s\n// FID (First Input Delay) < 100ms\n// CLS (Cumulative Layout Shift) < 0.1\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Memory leak tips",
        "question": "Care este cel mai comun tip de memory leak in JavaScript?",
        "options": [
          "Prea multe variabile locale",
          "Event listeners neindepartati, closures care retin date mari, referinte globale accidentale",
          "Loop-uri infinite",
          "Prea multi parametri"
        ],
        "answer": "Event listeners neindepartati, closures care retin date mari, referinte globale accidentale",
        "explanation": "addEventlistener fara removeEventListener = elementul nu poate fi GC. Closure cu array mare neutilizat. Variabila fara let/const = global = niciodata GC.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "Debounce vs throttle",
        "question": "Diferenta intre debounce si throttle?",
        "options": [
          "Identice",
          "Debounce: asteapta N ms dupa ultima apelare; Throttle: cel mult un apel la N ms indiferent de frecventa",
          "Throttle e mai rapid",
          "Debounce e pentru events de click"
        ],
        "answer": "Debounce: asteapta N ms dupa ultima apelare; Throttle: cel mult un apel la N ms indiferent de frecventa",
        "explanation": "Debounce: search input (trimite doar la final de tastare). Throttle: scroll handler (max 10 apeluri/sec indiferent cat de rapid scrollezi).",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "Layout thrashing",
        "question": "Ce este layout thrashing si cum il previi?",
        "options": [
          "Error de browser",
          "Citire si scriere alternata a proprietatilor DOM (offsetWidth + style.width) forteaza reflow la fiecare iteratie; Fix: batch reads then writes",
          "Prea mult CSS",
          "Event listeners exagerati"
        ],
        "answer": "Citire si scriere alternata a proprietatilor DOM (offsetWidth + style.width) forteaza reflow la fiecare iteratie; Fix: batch reads then writes",
        "explanation": "Citire (offsetWidth) forteaza browser-ul sa recalculeze layout. Daca alternezi citire-scriere in loop: N reflows. Batch: citeste tot, scrie tot = 1 reflow.",
        "difficulty": "hard"
      },
      {
        "number": 4,
        "name": "Virtual DOM scop",
        "question": "De ce React foloseste Virtual DOM?",
        "options": [
          "Sa evite sa scrie HTML",
          "DOM real e lent; VDOM = JS pur rapid; diff calculeaza minim de modificari DOM; batch updates = un singur reflow",
          "Virtual DOM e mai sigur",
          "Sa suporte TypeScript"
        ],
        "answer": "DOM real e lent; VDOM = JS pur rapid; diff calculeaza minim de modificari DOM; batch updates = un singur reflow",
        "explanation": "Fiecare modificare DOM = potential reflow/repaint. React: toate setState = o singura trecere de diff + minim de modificari DOM aplicate o data.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "DocumentFragment avantaj",
        "question": "De ce folosesti DocumentFragment pentru a insera 100 de elemente in DOM?",
        "options": [
          "E singurul mod de a insera multe elemente",
          "Fragment nu e in DOM real; adaugi toate la fragment (fara reflow); ul.appendChild(fragment) = un singur reflow",
          "Fragment e mai rapid decat createElement",
          "Nu exista diferenta"
        ],
        "answer": "Fragment nu e in DOM real; adaugi toate la fragment (fara reflow); ul.appendChild(fragment) = un singur reflow",
        "explanation": "appendChild la DOM real = reflow per element = 100 reflows. Fragment = container temp off-DOM; un singur insert = un reflow.",
        "difficulty": "hard"
      },
      {
        "number": 6,
        "name": "will-change",
        "question": "Ce face `will-change: transform` in CSS si cand trebuie evitat?",
        "options": [
          "Transforma elementul",
          "Creaza un layer GPU separat pentru element (animatii mai fluide); evita excesul — fiecare layer = VRAM",
          "E obligatoriu pentru animatii",
          "Nu are efect"
        ],
        "answer": "Creaza un layer GPU separat pentru element (animatii mai fluide); evita excesul — fiecare layer = VRAM",
        "explanation": "will-change: browser aloca layer GPU anticipand animatii. Animatii pe layer separat = nu afecteaza alte layere. Abuz: 50 elemente cu will-change = 50 layere GPU = memory overflow.",
        "difficulty": "hard"
      },
      {
        "number": 7,
        "name": "dynamic import",
        "question": "Ce avantaj are `import('./heavy-module.js')` (dynamic) fata de `import { fn } from './heavy-module.js'` (static)?",
        "options": [
          "Sintaxa mai scurta",
          "Code splitting: modulul e incarcat DOAR cand e necesar, nu la startup — bundle initial mai mic",
          "Mai rapid la executie",
          "Suporta mai multe browsere"
        ],
        "answer": "Code splitting: modulul e incarcat DOAR cand e necesar, nu la startup — bundle initial mai mic",
        "explanation": "Static import = tot codul in bundle initial. Dynamic import = lazy loading: fisierul se descarca cand apelezi import(). Crucial pentru pagini cu tab-uri/routes.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "LCP metric",
        "question": "Ce masoara LCP (Largest Contentful Paint)?",
        "options": [
          "Cate elemente are pagina",
          "Cand cel mai mare element din viewport devine vizibil (imagine, text bloc) — target < 2.5s",
          "Dimensiunea paginii",
          "Numarul de JS files"
        ],
        "answer": "Cand cel mai mare element din viewport devine vizibil (imagine, text bloc) — target < 2.5s",
        "explanation": "LCP = perceived load speed. Sub 2.5s = bun. Optimizare: preload imagini hero, optimizeaza server response time, elimina render-blocking resources.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "performance.mark",
        "question": "Avantajul `performance.mark()` si `performance.measure()` fata de `Date.now()`?",
        "options": [
          "Identice",
          "performance API ofera rezolutie sub-milisecunda, nu e afectat de ajustari ceas sistem, integrat in DevTools Timeline",
          "performance e mai rapid",
          "Date.now e deprecated"
        ],
        "answer": "performance API ofera rezolutie sub-milisecunda, nu e afectat de ajustari ceas sistem, integrat in DevTools Timeline",
        "explanation": "Date.now() = ms precizie, poate sari la ajustari NTP. performance.now() = microsecunde monotonic. Marks/measures apar in DevTools Performance tab.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Closure memory fix",
        "question": "Cum repari o closure care retine un array mare de 1 milion elemente in mod inutil?",
        "options": [
          "Nu se poate repara",
          "Extrage valoarea necesara din array inainte de a returna closure, array poate fi GC",
          "Seteaza array = null",
          "Foloseste WeakRef"
        ],
        "answer": "Extrage valoarea necesara din array inainte de a returna closure, array poate fi GC",
        "explanation": "const result = processArray(bigArray); return () => result; — closure retine doar result (mic), nu bigArray (1M items).",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "CLS metric",
        "question": "Ce este CLS (Cumulative Layout Shift) si ce il cauzeaza?",
        "options": [
          "Viteza de incarcare CSS",
          "Masura instabilitatii vizuale — elemente care se muta dupa ce pagina s-a incarcat; cauzat de imagini fara dimensiuni, ads inserati dinamic",
          "Numarul de re-renderuri",
          "Scorul SEO"
        ],
        "answer": "Masura instabilitatii vizuale — elemente care se muta dupa ce pagina s-a incarcat; cauzat de imagini fara dimensiuni, ads inserati dinamic",
        "explanation": "CLS > 0.1 = utilizatorul da click pe un buton care se muta in ultima secunda. Fix: specify width/height pe imagini, rezerva spatiu pentru ads.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Debounce coding",
        "question": "Implementeaza functia debounce(fn, delay) care apeleaza fn dupa ce nu a mai fost apelata delay ms.",
        "options": [],
        "answer": "",
        "explanation": "let timer; return function(...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), delay); };",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Throttle coding",
        "question": "Implementeaza throttle(fn, limit) care executa fn cel mult o data la 'limit' ms.",
        "options": [],
        "answer": "",
        "explanation": "let lastCall = 0; return function(...args) { const now = Date.now(); if(now - lastCall >= limit) { lastCall = now; fn.apply(this, args); } };",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "DocumentFragment coding",
        "question": "Adauga 50 de elemente `li` la un `ul` folosind DocumentFragment. Numara de cate ori `appendChild` e apelat pe elementul real ul.",
        "options": [],
        "answer": "",
        "explanation": "const frag = document.createDocumentFragment(); for(let i=0;i<50;i++){const li=document.createElement('li'); li.textContent=`Item ${i}`; frag.appendChild(li);} ul.appendChild(frag);",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Memoize cu WeakMap coding",
        "question": "Implementeaza memoize(fn) pentru functii care primesc obiecte ca argumente, folosind WeakMap pentru a nu preveni garbage collection.",
        "options": [],
        "answer": "",
        "explanation": "if(cache.has(obj)) return cache.get(obj); const result = fn(obj); cache.set(obj, result); return result. WeakMap = cand obj e GC, cache-ul e si el GC.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "design-patterns-js",
    "title": "42. Design Patterns avansate JS",
    "order": 42,
    "theory": [
      {
        "order": 1,
        "title": "Command si Mediator patterns",
        "content": "```javascript\n// Command Pattern: incapsuleaza operatii ca obiecte\n// Permite undo/redo, queue, log\nclass TextEditor {\n  constructor() { this.text = ''; this.history = []; }\n\n  execute(command) {\n    command.execute();\n    this.history.push(command);\n  }\n\n  undo() {\n    if (this.history.length === 0) return;\n    this.history.pop().undo();\n  }\n}\n\nclass InsertCommand {\n  constructor(editor, text) {\n    this.editor = editor;\n    this.text = text;\n  }\n  execute() { this.editor.text += this.text; }\n  undo() { this.editor.text = this.editor.text.slice(0, -this.text.length); }\n}\n\nconst editor = new TextEditor();\neditor.execute(new InsertCommand(editor, 'Hello'));\neditor.execute(new InsertCommand(editor, ' World'));\nconsole.log(editor.text); // 'Hello World'\neditor.undo();\nconsole.log(editor.text); // 'Hello'\n\n// Mediator Pattern: obiect central care coordoneaza comunicarea\nclass EventBus {\n  constructor() { this.handlers = new Map(); }\n  on(event, fn) {\n    if (!this.handlers.has(event)) this.handlers.set(event, []);\n    this.handlers.get(event).push(fn);\n    return () => this.off(event, fn); // returneaza unsubscribe\n  }\n  off(event, fn) {\n    const fns = this.handlers.get(event) || [];\n    this.handlers.set(event, fns.filter(f => f !== fn));\n  }\n  emit(event, data) {\n    (this.handlers.get(event) || []).forEach(fn => fn(data));\n  }\n}\n\nconst bus = new EventBus();\nconst unsub = bus.on('user:login', data => console.log('Login:', data));\nbus.emit('user:login', { userId: 1 });\nunsub(); // unsubscribe\n```"
      },
      {
        "order": 2,
        "title": "Proxy si Decorator patterns",
        "content": "```javascript\n// Proxy Pattern: ES6 Proxy pentru interceptare operatii\nconst createValidatedObject = (target, schema) => {\n  return new Proxy(target, {\n    set(obj, prop, value) {\n      if (schema[prop]) {\n        const { type, min, max } = schema[prop];\n        if (typeof value !== type)\n          throw new TypeError(`${prop} trebuie sa fie ${type}`);\n        if (min !== undefined && value < min)\n          throw new RangeError(`${prop} minim ${min}`);\n      }\n      obj[prop] = value;\n      return true;\n    },\n    get(obj, prop) {\n      if (prop === '_raw') return obj;\n      return prop in obj ? obj[prop] : undefined;\n    }\n  });\n};\n\nconst user = createValidatedObject({}, {\n  age: { type: 'number', min: 0, max: 120 },\n  name: { type: 'string' }\n});\nuser.name = 'Ana';  // OK\nuser.age = 25;      // OK\n// user.age = -5;   // RangeError!\n\n// Decorator Pattern: imbogateste o functie/clasa\nfunction withLogging(fn) {\n  return function(...args) {\n    console.log(`Apel: ${fn.name}(${args.join(', ')})`);\n    const result = fn.apply(this, args);\n    console.log(`Rezultat: ${result}`);\n    return result;\n  };\n}\n\nfunction aduna(a, b) { return a + b; }\nconst adunaCuLog = withLogging(aduna);\nadunaCuLog(3, 4); // Apel: aduna(3, 4) / Rezultat: 7\n```"
      },
      {
        "order": 3,
        "title": "Module si Singleton patterns",
        "content": "```javascript\n// Module Pattern: encapsulare cu IIFE (legacy) si ES modules (modern)\n\n// ES Module (modul real)\n// store.js\nlet _state = {\n  user: null,\n  cart: [],\n  theme: 'light'\n};\n\nexport function getState() { return { ..._state }; } // copie\nexport function setState(newState) {\n  _state = { ..._state, ...newState };\n  notify();\n}\n\nconst listeners = new Set();\nexport function subscribe(fn) {\n  listeners.add(fn);\n  return () => listeners.delete(fn); // unsubscribe\n}\nfunction notify() { listeners.forEach(fn => fn(_state)); }\n\n// Singleton: o singura instanta\nclass Config {\n  static instance = null;\n\n  constructor() {\n    if (Config.instance) return Config.instance;\n    this.settings = {};\n    Config.instance = this;\n  }\n\n  set(key, value) { this.settings[key] = value; }\n  get(key) { return this.settings[key]; }\n}\n\nconst c1 = new Config();\nconst c2 = new Config();\nconsole.log(c1 === c2); // true — aceeasi instanta!\n\n// ES Module Singleton (mai simplu):\n// config.js exporta un obiect literal = Singleton by default\n// (modulul e evaluat o singura data, instanta e shared)\n```\n\n**Interviu:** De ce Singleton e considerat anti-pattern? Global state = greu de testat (mock), coupling implicit, bug-uri ascunse. Alternativa: Dependency Injection."
      },
      {
        "order": 4,
        "title": "Observer, Strategy si Factory patterns",
        "content": "```javascript\n// Strategy Pattern: algoritm interschimbabil\nclass Cart {\n  constructor(discountStrategy = (price) => price) {\n    this.items = [];\n    this.discountStrategy = discountStrategy;\n  }\n\n  setDiscount(strategy) { this.discountStrategy = strategy; }\n\n  total() {\n    const sum = this.items.reduce((s, i) => s + i.price, 0);\n    return this.discountStrategy(sum);\n  }\n}\n\nconst noDiscount = price => price;\nconst tenPercent = price => price * 0.9;\nconst flatDiscount = (amount) => price => Math.max(0, price - amount);\n\nconst cart = new Cart(tenPercent);\ncart.items = [{ price: 100 }, { price: 50 }];\nconsole.log(cart.total()); // 135\n\ncart.setDiscount(flatDiscount(30));\nconsole.log(cart.total()); // 120\n\n// Factory Pattern: creeaza obiecte fara a specifica clasa exacta\nclass NotificationFactory {\n  static create(type, message) {\n    const types = {\n      email: (msg) => ({ send: () => console.log(`Email: ${msg}`) }),\n      sms:   (msg) => ({ send: () => console.log(`SMS: ${msg}`) }),\n      push:  (msg) => ({ send: () => console.log(`Push: ${msg}`) }),\n    };\n    const factory = types[type];\n    if (!factory) throw new Error(`Tip necunoscut: ${type}`);\n    return factory(message);\n  }\n}\n\nconst notif = NotificationFactory.create('email', 'Bun venit!');\nnotif.send();\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Command pattern scop",
        "question": "Ce problema principala rezolva Command Pattern?",
        "options": [
          "Cod mai scurt",
          "Incapsuleaza operatii ca obiecte — permite undo/redo, queue, logging, tranzactii",
          "Cod mai rapid",
          "Reducere dependente"
        ],
        "answer": "Incapsuleaza operatii ca obiecte — permite undo/redo, queue, logging, tranzactii",
        "explanation": "Command = actiune cu execute() si undo(). History stack = ctrl+Z complet. Queue de comenzi = job scheduler. Log de comenzi = audit trail.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "ES6 Proxy interceptare",
        "question": "Ce intercepteaza handler-ul `set` al unui Proxy?",
        "options": [
          "Citirea proprietatilor",
          "Atribuirea valorilor la proprietati (`obj.prop = value`)",
          "Stergerea proprietatilor",
          "Iterarea cheilor"
        ],
        "answer": "Atribuirea valorilor la proprietati (`obj.prop = value`)",
        "explanation": "Proxy handlers: get = citire, set = scriere, deleteProperty = delete obj.prop, has = prop in obj, apply = apel functie. set e ideal pentru validare.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "Mediator vs Observer",
        "question": "Diferenta intre Mediator si Observer pattern?",
        "options": [
          "Identice",
          "Observer: obiecte se aboneaza la altele; Mediator: un obiect central coordoneaza comunicarea (loose coupling maxim)",
          "Mediator e mai rapid",
          "Observer e deprecated"
        ],
        "answer": "Observer: obiecte se aboneaza la altele; Mediator: un obiect central coordoneaza comunicarea (loose coupling maxim)",
        "explanation": "Observer: A observa B direct (cuplaj). Mediator (EventBus): A si B comunica prin bus fara sa se cunoasca. Decuplare totala.",
        "difficulty": "hard"
      },
      {
        "number": 4,
        "name": "Singleton anti-pattern",
        "question": "De ce Singleton e considerat anti-pattern in TDD?",
        "options": [
          "E prea complex",
          "Global state e greu de mock-uit in teste, creeaza coupling implicit, bug-uri greu de reprodus",
          "Nu e anti-pattern",
          "E prea lent"
        ],
        "answer": "Global state e greu de mock-uit in teste, creeaza coupling implicit, bug-uri greu de reprodus",
        "explanation": "Test A modifica Singleton, Test B esueaza datorita starii din Test A. Alternativa: injecteaza dependenta ca parametru (Dependency Injection).",
        "difficulty": "hard"
      },
      {
        "number": 5,
        "name": "Strategy pattern",
        "question": "Ce avantaj aduce Strategy Pattern fata de un `if/else` gigant?",
        "options": [
          "Nu e avantaj",
          "Open/Closed Principle: adaugi algoritmi noi fara a modifica codul existent, testezi fiecare strategie independent",
          "Cod mai scurt",
          "Mai rapid"
        ],
        "answer": "Open/Closed Principle: adaugi algoritmi noi fara a modifica codul existent, testezi fiecare strategie independent",
        "explanation": "Fara Strategy: adaugi reducere noua = modifici metoda total(). Cu Strategy: creezi functie noua, o injectezi. Codul existent neatins.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "Factory pattern utilitate",
        "question": "Cand folosesti Factory Pattern?",
        "options": [
          "Intotdeauna cand creezi obiecte",
          "Cand tipul obiectului depinde de input/config la runtime si vrei sa decuplezi crearea de logica de business",
          "Cand ai prea multe clase",
          "Nu e recomandat in JS modern"
        ],
        "answer": "Cand tipul obiectului depinde de input/config la runtime si vrei sa decuplezi crearea de logica de business",
        "explanation": "createNotification('email') vs new EmailNotification() — Factory decide tipul. Adaugi 'slack' fara a modifica codul care consuma notificarea.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "Decorator pattern",
        "question": "Cum difera Decorator de clasa extinsa (inheritance)?",
        "options": [
          "Identice",
          "Decorator = compozitie (wrap functie/obiect); Inheritance = cuplaj static la compile time. Decorator mai flexibil la runtime",
          "Inheritance e mai rapid",
          "Decorator e deprecated"
        ],
        "answer": "Decorator = compozitie (wrap functie/obiect); Inheritance = cuplaj static la compile time. Decorator mai flexibil la runtime",
        "explanation": "Decorator: withLogging(withCache(fn)) = stachuiesti comportamente. Inheritance: o clasa = o singura ierarhie, greu de schimbat.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "ES Module singleton",
        "question": "De ce un ES module exportat ca obiect literal e implicit Singleton?",
        "options": [
          "Nu e Singleton",
          "Modulele sunt evaluate O SINGURA DATA si cacheate; toti importatorii primesc aceeasi referinta",
          "E o coincidenta",
          "Depinde de bundler"
        ],
        "answer": "Modulele sunt evaluate O SINGURA DATA si cacheate; toti importatorii primesc aceeasi referinta",
        "explanation": "import { state } from './store.js' returneaza mereu acelasi obiect. Ideal pentru store-uri simple. Fara new Class(), fara getInstance().",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "Observer unsubscribe",
        "question": "De ce returnezi o functie de unsubscribe din `bus.on(event, fn)`?",
        "options": [
          "Conventie",
          "Permite inlaturarea listener-ului specific fara a sterge toti handler-ii evenimentului",
          "E obligatoriu",
          "Performanta"
        ],
        "answer": "Permite inlaturarea listener-ului specific fara a sterge toti handler-ii evenimentului",
        "explanation": "const unsub = bus.on('login', handler); // la cleanup: unsub() — inlatura exact acest handler. Pattern similar cu useEffect cleanup in React.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Proxy get handler",
        "question": "Ce face handler-ul `get` al unui Proxy JavaScript?",
        "options": [
          "Intercepteaza atribuiri",
          "Intercepteaza citiri de proprietati — `obj.prop`, `obj['prop']`",
          "Intercepteaza stergeri",
          "Intercepteaza iteratii"
        ],
        "answer": "Intercepteaza citiri de proprietati — `obj.prop`, `obj['prop']`",
        "explanation": "get(target, prop, receiver) — apelat la fiecare citire. Util pentru: valori default, lazy loading, logging accese, computed properties.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "Command cu undo coding",
        "question": "Ce sunt cele 3 componente principale ale unui Command Pattern complet?",
        "options": [
          "Factory, Product, Creator",
          "Command interface (execute/undo), Invoker (executa si retine history), Receiver (obiectul modificat)",
          "Observer, Subject, Handler",
          "Strategy, Context, Algorithm"
        ],
        "answer": "Command interface (execute/undo), Invoker (executa si retine history), Receiver (obiectul modificat)",
        "explanation": "Command = actiunea incapsulata. Invoker = TextEditor care face execute() si tine history[]. Receiver = obiectul pe care Command-ul actioneaza.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Command undo coding",
        "question": "Implementeaza un sistem Command simplu cu execute si undo pentru un counter.",
        "options": [],
        "answer": "",
        "explanation": "c.execute(new IncrementBy(5)); console.log(c.value); // 5. c.execute(new IncrementBy(3)); // 8. c.undo(); // 5. c.undo(); // 0.",
        "difficulty": "easy"
      },
      {
        "number": 13,
        "name": "EventBus coding",
        "question": "Implementeaza un EventBus (Mediator) cu metodele on, off si emit. Verifica ca emit apeleaza toti listener-ii.",
        "options": [],
        "answer": "",
        "explanation": "on: if(!map.has(e)) map.set(e,[]); map.get(e).push(fn); return () => this.off(e,fn). emit: (map.get(e)||[]).forEach(h=>h(data)). off: filter.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Proxy validator coding",
        "question": "Creeaza un Proxy care valideaza ca proprietatea 'age' e un numar intre 0 si 120, si 'name' e un string nevid.",
        "options": [],
        "answer": "",
        "explanation": "if(prop==='age'){if(typeof value!=='number'||value<0||value>120) throw new RangeError('Age invalid')} if(prop==='name'){if(typeof value!=='string'||!value.trim()) throw new TypeError('Name invalid')}",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Strategy pattern coding",
        "question": "Implementeaza o clasa Sorter care accepta o strategie de comparare si sorteaza un array. Testeaza cu sortare numerica si alfabetica.",
        "options": [],
        "answer": "",
        "explanation": "sort() face [...array].sort(this.strategy) — nu modifica originalul. setStrategy schimba algoritmul la runtime. Open/Closed: adaugi strategie noua fara sa modifici Sorter.",
        "difficulty": "easy"
      }
    ]
  },
  {
    "slug": "functional-programming-js",
    "title": "43. Functional Programming in JS",
    "order": 43,
    "theory": [
      {
        "order": 1,
        "title": "Imutabilitate si pure functions",
        "content": "```javascript\n// Pure function: acelasi input = acelasi output, fara side effects\n\n// IMPURA: modifica argumente, acceseaza variabile externe\nlet tax = 0.2;\nfunction addTax(price) {\n  return price + price * tax; // depinde de tax extern!\n}\n\n// PURA: totul in parametri\nconst addTaxPure = (price, taxRate) => price * (1 + taxRate);\n\n// Imutabilitate: nu modifica datele originale\nconst original = { name: 'Ana', age: 25, skills: ['JS'] };\n\n// Impura: modifica original\n// original.age = 26; // GREȘIT\n\n// Pura: returneaza obiect nou\nconst updated = { ...original, age: 26 };\nconst withNewSkill = {\n  ...original,\n  skills: [...original.skills, 'Python']\n};\n\n// Array transformari imutabile\nconst arr = [1, 2, 3, 4, 5];\nconst doubled = arr.map(x => x * 2);       // nou array\nconst evens = arr.filter(x => x % 2 === 0); // nou array\nconst sum = arr.reduce((acc, x) => acc + x, 0); // valoare\n// arr ramane [1,2,3,4,5]\n```\n\n**Interviu:** De ce pure functions sunt importante? Testabilitate: nu ai nevoie de mock/setup. Predictibilitate: stii exact ce face. Memoizare: poti cache dupa argumente. Paralelism: fara race conditions."
      },
      {
        "order": 2,
        "title": "compose, pipe si point-free style",
        "content": "```javascript\n// compose: aplica functii de la dreapta la stanga\nconst compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);\n\n// pipe: aplica functii de la stanga la dreapta (mai lizibil)\nconst pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);\n\n// Functii simple\nconst double = x => x * 2;\nconst addOne = x => x + 1;\nconst square = x => x * x;\n\nconst transform = pipe(double, addOne, square);\nconsole.log(transform(3)); // pipe: (3*2=6, 6+1=7, 7*7=49)\n\nconst transform2 = compose(square, addOne, double);\nconsole.log(transform2(3)); // compose: double(3)=6, addOne(6)=7, square(7)=49\n// Acelasi rezultat, ordine mentala diferita\n\n// Point-free style: nu mentionezi argumentele explicit\nconst numbers = [1, 2, 3, 4, 5];\n\n// Cu argumente (pointed)\nconst doubled = numbers.map(x => double(x));\n\n// Point-free\nconst doubled2 = numbers.map(double);\n\n// Pipeline practic pentru procesare date\nconst processUsers = pipe(\n  users => users.filter(u => u.active),\n  users => users.map(u => ({ ...u, name: u.name.toUpperCase() })),\n  users => users.sort((a, b) => a.name.localeCompare(b.name))\n);\n```"
      },
      {
        "order": 3,
        "title": "Functors, Maybe si Result monads",
        "content": "```javascript\n// Functor: orice container cu map() (Array e un functor)\n// Monad: functor cu flatMap/chain pentru a evita imbricare\n\n// Maybe Monad: gestioneaza null/undefined elegant\nclass Maybe {\n  constructor(value) { this._value = value; }\n  static of(value) { return new Maybe(value); }\n  isNothing() { return this._value === null || this._value === undefined; }\n\n  map(fn) {\n    return this.isNothing() ? this : Maybe.of(fn(this._value));\n  }\n\n  flatMap(fn) {\n    return this.isNothing() ? this : fn(this._value);\n  }\n\n  getOrElse(defaultValue) {\n    return this.isNothing() ? defaultValue : this._value;\n  }\n}\n\n// Fara Maybe: null checks peste tot\n// const city = user && user.address && user.address.city;\n\n// Cu Maybe\nconst getCity = user => Maybe.of(user)\n  .map(u => u.address)\n  .map(a => a.city)\n  .getOrElse('Necunoscut');\n\ngetCity({ address: { city: 'Cluj' } }); // 'Cluj'\ngetCity({ address: null });              // 'Necunoscut'\ngetCity(null);                           // 'Necunoscut'\n\n// Result Monad: succes sau eroare\nconst Ok = value => ({\n  isOk: true,\n  map: fn => Ok(fn(value)),\n  flatMap: fn => fn(value),\n  getOrElse: () => value,\n  getError: () => null\n});\nconst Err = error => ({\n  isOk: false,\n  map: () => Err(error),\n  flatMap: () => Err(error),\n  getOrElse: defaultVal => defaultVal,\n  getError: () => error\n});\n```"
      },
      {
        "order": 4,
        "title": "Transducers si functii de ordin superior",
        "content": "```javascript\n// Higher-Order Functions (HOF): functii care primesc/returneaza functii\nconst multiply = n => x => x * n; // curried\nconst double = multiply(2);\nconst triple = multiply(3);\n\nconst applyAll = (...fns) => value =>\n  fns.map(fn => fn(value));\n\nconsole.log(applyAll(double, triple, Math.sqrt)(9));\n// [18, 27, 3]\n\n// Transducer: compozitie eficienta de transformari\n// Problema: map + filter creeaza array intermediar\nconst result1 = [1,2,3,4,5]\n  .filter(x => x % 2 === 0) // array nou [2,4]\n  .map(x => x * 10);        // array nou [20,40]\n\n// Transducer: o singura trecere prin array\nconst filtering = pred => reducer => (acc, x) =>\n  pred(x) ? reducer(acc, x) : acc;\n\nconst mapping = fn => reducer => (acc, x) =>\n  reducer(acc, fn(x));\n\nconst concat = (acc, x) => [...acc, x];\n\nconst xform = compose(\n  filtering(x => x % 2 === 0),\n  mapping(x => x * 10)\n);\n\nconst result2 = [1,2,3,4,5].reduce(xform(concat), []);\n// [20, 40] — o singura trecere!\n\n// Algebraic Data Types simplu\nconst Either = {\n  right: value => ({ type: 'Right', value }),\n  left: error => ({ type: 'Left', error }),\n};\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Pure function definitie",
        "question": "Ce defineste o functie pura (pure function)?",
        "options": [
          "O functie fara parametri",
          "Acelasi input produce mereu acelasi output si nu are side effects (nu modifica date externe)",
          "O functie rapida",
          "O functie testata"
        ],
        "answer": "Acelasi input produce mereu acelasi output si nu are side effects (nu modifica date externe)",
        "explanation": "Pure: testabila, memoizabila, predictibila, safe in concurenta. Impura: console.log, Date.now(), Math.random(), modificare DOM/state extern.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "compose vs pipe ordine",
        "question": "Diferenta intre `compose(f, g, h)(x)` si `pipe(f, g, h)(x)`?",
        "options": [
          "Identice",
          "compose: h(g(f(x))) — de la dreapta la stanga; pipe: f(g(h(x))) — de la stanga la dreapta",
          "compose e mai rapid",
          "pipe accepta mai multi parametri"
        ],
        "answer": "compose: h(g(f(x))) — de la dreapta la stanga; pipe: f(g(h(x))) — de la stanga la dreapta",
        "explanation": "pipe(double, addOne)(3) = addOne(double(3)) = addOne(6) = 7. Citibil ca pipeline de transformari. compose = notatie matematica traditionala.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "Imutabilitate array",
        "question": "Care metoda Array e imutabila (returneaza array nou)?",
        "options": [
          "push, pop, splice",
          "map, filter, reduce, concat, slice",
          "sort, reverse",
          "fill, copyWithin"
        ],
        "answer": "map, filter, reduce, concat, slice",
        "explanation": "map/filter/reduce returneaza valori noi. push/pop/splice/sort/reverse modifica array-ul in loc (mutable). In FP: prefer map/filter fata de push/for.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "Maybe monad scop",
        "question": "Ce problema rezolva Maybe Monad?",
        "options": [
          "Performanta",
          "Elimina null checks explicite — map() pe Nothing returneaza Nothing, nu aruncaeroare",
          "Async operations",
          "Type checking"
        ],
        "answer": "Elimina null checks explicite — map() pe Nothing returneaza Nothing, nu aruncaeroare",
        "explanation": "user?.address?.city? in loc de if(user && user.address). Maybe incapsuleaza null/undefined — operatii sigure fara TypeError.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "Functor definitie",
        "question": "Ce e un Functor in programare functionala?",
        "options": [
          "O functie",
          "Un container cu metoda map() care aplica o functie valorii sale respectand legile Functor",
          "Un array",
          "O clasa"
        ],
        "answer": "Un container cu metoda map() care aplica o functie valorii sale respectand legile Functor",
        "explanation": "Array.map() face din Array un Functor. Promise.then() e similar. Legile: map(id) = id; map(f o g) = map(f) o map(g).",
        "difficulty": "hard"
      },
      {
        "number": 6,
        "name": "flatMap vs map",
        "question": "De ce ai nevoie de `flatMap` (chain) la monads, nu doar `map`?",
        "options": [
          "flatMap e mai rapid",
          "Cand fn din map returneaza si ea un Monad, map ar produce monad in monad; flatMap 'aplatizeaza' un nivel",
          "Nu e diferenta",
          "flatMap e mai sigur"
        ],
        "answer": "Cand fn din map returneaza si ea un Monad, map ar produce monad in monad; flatMap 'aplatizeaza' un nivel",
        "explanation": "Maybe.of(5).map(x => Maybe.of(x*2)) = Maybe(Maybe(10)). flatMap evita imbicarile: Maybe.of(5).flatMap(x => Maybe.of(x*2)) = Maybe(10).",
        "difficulty": "hard"
      },
      {
        "number": 7,
        "name": "Point-free style",
        "question": "Ce e point-free style in programare functionala?",
        "options": [
          "Cod fara puncte (.) CSS",
          "Definirea functiilor fara a mentiona explicit argumentele: `arr.map(double)` in loc de `arr.map(x => double(x))`",
          "Functii fara parametri",
          "Functii arrow"
        ],
        "answer": "Definirea functiilor fara a mentiona explicit argumentele: `arr.map(double)` in loc de `arr.map(x => double(x))`",
        "explanation": "Point-free = tacit programming. Argument implicit. arr.map(double) e mai concis. Dar poate deveni greu de citit in exces — balance.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "HOF exemplu",
        "question": "Ce este o Higher-Order Function (HOF)?",
        "options": [
          "O functie mai rapida",
          "O functie care primeste functii ca argumente si/sau returneaza functii",
          "O functie cu mai multi parametri",
          "O functie exportata"
        ],
        "answer": "O functie care primeste functii ca argumente si/sau returneaza functii",
        "explanation": "map, filter, reduce = HOF (primesc functii). debounce, memoize, curry = HOF (returneaza functii). Esenta FP.",
        "difficulty": "easy"
      },
      {
        "number": 9,
        "name": "Imutabilitate obiecte",
        "question": "Cel mai corect mod de a updata un camp intr-un obiect imutabil?",
        "options": [
          "obj.field = newValue",
          "const newObj = { ...obj, field: newValue } — spread pentru obiect nou",
          "Object.assign(obj, {field: newValue})",
          "Object.freeze(obj)"
        ],
        "answer": "const newObj = { ...obj, field: newValue } — spread pentru obiect nou",
        "explanation": "Spread creeaza copie superficiala si suprascrie campul. Originalul nemodificat. Object.assign(obj, ...) modifica originalul — mutable!",
        "difficulty": "easy"
      },
      {
        "number": 10,
        "name": "Result monad",
        "question": "Ce avantaj aduce Result/Either monad fata de try/catch?",
        "options": [
          "E mai rapid",
          "Forteaza tratarea erorilor explicit in flux — Err.map() e no-op, Ok.map() transforma. Nu poti 'uita' eroarea",
          "Nu e avantaj",
          "Try/catch e deprecated"
        ],
        "answer": "Forteaza tratarea erorilor explicit in flux — Err.map() e no-op, Ok.map() transforma. Nu poti 'uita' eroarea",
        "explanation": "Cu try/catch poti uita sa pui catch. Cu Result: parsedData.map(transform).getOrElse(default) — eroarea e in tipul sistemului.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "Referential transparency",
        "question": "Ce inseamna referential transparency pentru o functie?",
        "options": [
          "Functia e publica",
          "Orice apel al functiei poate fi inlocuit cu valoarea sa fara a schimba comportamentul programului",
          "Functia e importata",
          "Functia e rapida"
        ],
        "answer": "Orice apel al functiei poate fi inlocuit cu valoarea sa fara a schimba comportamentul programului",
        "explanation": "add(2,3) = 5. Poti inlocui add(2,3) cu 5 oriunde = referential transparent = pure function. Esential pentru memoizare si optimizare compilator.",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "Pipe functii coding",
        "question": "Implementeaza functia `pipe(...fns)` care aplica functiile de la stanga la dreapta.",
        "options": [],
        "answer": "",
        "explanation": "return x => fns.reduce((v, f) => f(v), x);",
        "difficulty": "easy"
      },
      {
        "number": 13,
        "name": "Maybe monad coding",
        "question": "Implementeaza clasa Maybe cu metodele of(), map(), getOrElse(). Foloseste-o pentru a accesa o proprietate nested in siguranta.",
        "options": [],
        "answer": "",
        "explanation": "map: return this.isNothing() ? this : Maybe.of(fn(this._value)). getOrElse: return this.isNothing() ? defaultValue : this._value.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Imutabilitate update coding",
        "question": "Scrie o functie `updateUser(user, updates)` si `addSkill(user, skill)` care actualizeaza imutabil un user object.",
        "options": [],
        "answer": "",
        "explanation": "updateUser: return {...user, ...updates}. addSkill: return {...user, skills: [...user.skills, skill]}. Spread = copie superficiala.",
        "difficulty": "easy"
      },
      {
        "number": 15,
        "name": "Compose cu reduce coding",
        "question": "Implementeaza `compose(...fns)` (dreapta-stanga) si verifica ca compose(f,g)(x) == f(g(x)).",
        "options": [],
        "answer": "",
        "explanation": "return x => fns.reduceRight((v, f) => f(v), x). transform(5): double(5)=10, addTen(10)=20, negate(20)=-20.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "typescript-avansat",
    "title": "44. TypeScript Avansat",
    "order": 44,
    "theory": [
      {
        "order": 1,
        "title": "Generics — tipuri reutilizabile si constrangeri",
        "content": "```typescript\n// Generic de baza\nfunction identity<T>(value: T): T {\n  return value;\n}\n\nidentity<string>('hello'); // string\nidentity(42);              // numarul infer TypeScript\n\n// Generic cu constrangere (constraint)\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\nconst user = { name: 'Ana', age: 25 };\ngetProperty(user, 'name'); // string\ngetProperty(user, 'age');  // number\n// getProperty(user, 'email') — eroare TS! 'email' nu e key\n\n// Generic cu default si multiple\ninterface Repository<TEntity, TId = number> {\n  findById(id: TId): Promise<TEntity | null>;\n  save(entity: TEntity): Promise<TEntity>;\n  delete(id: TId): Promise<void>;\n}\n\n// Generic class\nclass Stack<T> {\n  private items: T[] = [];\n  push(item: T): void { this.items.push(item); }\n  pop(): T | undefined { return this.items.pop(); }\n  peek(): T | undefined { return this.items[this.items.length - 1]; }\n  get size(): number { return this.items.length; }\n}\n\nconst numStack = new Stack<number>();\nnumStack.push(1); numStack.push(2);\nconsole.log(numStack.pop()); // 2\n```\n\n**Interviu:** Cand folosesti generics? Cand scrii cod care functioneaza cu mai multe tipuri dar mentine type safety. Alternative: `any` (pierde type safety), `unknown` (type-safe dar necomod)."
      },
      {
        "order": 2,
        "title": "Conditional Types si Mapped Types",
        "content": "```typescript\n// Conditional Types: tip depinde de o conditie\ntype NonNullable<T> = T extends null | undefined ? never : T;\ntype Flatten<T> = T extends Array<infer Item> ? Item : T;\n\ntype A = Flatten<string[]>;   // string\ntype B = Flatten<number>;     // number (nu e array)\ntype C = Flatten<Promise<number>>; // Promise<number>\n\n// `infer` extrage tipuri din structuri\ntype ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;\ntype FirstArg<T> = T extends (first: infer F, ...rest: any[]) => any ? F : never;\n\ntype FR = ReturnType<(x: string) => number>; // number\ntype FA = FirstArg<(a: string, b: number) => void>; // string\n\n// Mapped Types: transforma fiecare proprietate\ntype Readonly<T> = { readonly [P in keyof T]: T[P] };\ntype Partial<T> = { [P in keyof T]?: T[P] };\ntype Required<T> = { [P in keyof T]-?: T[P] }; // -? elimina optional\ntype Pick<T, K extends keyof T> = { [P in K]: T[P] };\ntype Record<K extends string, T> = { [P in K]: T };\n\n// Custom mapped type cu transformare\ntype Getters<T> = {\n  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P]\n};\n\ntype UserGetters = Getters<{ name: string; age: number }>;\n// { getName: () => string; getAge: () => number }\n```"
      },
      {
        "order": 3,
        "title": "Template Literal Types si Utility Types",
        "content": "```typescript\n// Template Literal Types\ntype EventName = `on${Capitalize<string>}`;\ntype Endpoint = `/${string}`;\ntype HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';\ntype ApiRoute = `${HttpMethod} ${Endpoint}`;\n\ntype RouteEvent = `route:${'start' | 'end' | 'error'}`;\n// 'route:start' | 'route:end' | 'route:error'\n\n// Utility Types built-in\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  password: string;\n  createdAt: Date;\n}\n\ntype UserCreate = Omit<User, 'id' | 'createdAt'>;\ntype UserUpdate = Partial<Pick<User, 'name' | 'email'>>;\ntype UserPublic = Omit<User, 'password'>;\n\n// Extract si Exclude\ntype A = 'cat' | 'dog' | 'fish';\ntype B = 'dog' | 'fish';\ntype OnlyA = Exclude<A, B>; // 'cat'\ntype Common = Extract<A, B>; // 'dog' | 'fish'\n\n// Parameters si ReturnType\nfunction createUser(name: string, age: number): User { return {} as User; }\ntype CreateParams = Parameters<typeof createUser>; // [string, number]\ntype CreateReturn = ReturnType<typeof createUser>;  // User\n\n// Awaited — extrage tipul dintr-un Promise\ntype AsyncUserReturn = Awaited<Promise<User>>; // User\n```"
      },
      {
        "order": 4,
        "title": "Discriminated unions, type guards si as const",
        "content": "```typescript\n// Discriminated Union: union cu camp discriminant\ntype Shape =\n  | { kind: 'circle'; radius: number }\n  | { kind: 'square'; side: number }\n  | { kind: 'rectangle'; width: number; height: number };\n\nfunction area(shape: Shape): number {\n  switch (shape.kind) {\n    case 'circle': return Math.PI * shape.radius ** 2;\n    case 'square': return shape.side ** 2;\n    case 'rectangle': return shape.width * shape.height;\n    // TS stie ca switch e exhaustiv!\n  }\n}\n\n// Type Guards\nfunction isString(value: unknown): value is string {\n  return typeof value === 'string';\n}\n\nfunction isUser(obj: unknown): obj is User {\n  return typeof obj === 'object' && obj !== null &&\n    'id' in obj && 'name' in obj;\n}\n\n// as const: tuplu literal in loc de array\nconst ROLES = ['admin', 'user', 'guest'] as const;\ntype Role = typeof ROLES[number]; // 'admin' | 'user' | 'guest'\n\nconst config = {\n  host: 'localhost',\n  port: 3000,\n  debug: true,\n} as const;\n// Toate proprietatile sunt readonly si tipuri literale (nu string, ci 'localhost')\n\n// satisfies operator (TS 4.9)\nconst palette = {\n  red: [255, 0, 0],\n  green: '#00ff00',\n} satisfies Record<string, string | number[]>;\n// Type checking fara sa pierzi tipul literal\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Generic constraint",
        "question": "Ce face `K extends keyof T` in `function getProperty<T, K extends keyof T>(obj: T, key: K)`?",
        "options": [
          "K trebuie sa extinda T",
          "K trebuie sa fie un camp valid al lui T — TypeScript verifica la compile time",
          "K e optional",
          "K e tipul valorii"
        ],
        "answer": "K trebuie sa fie un camp valid al lui T — TypeScript verifica la compile time",
        "explanation": "keyof T = union de chei ale lui T. K extends keyof T = K trebuie sa fie una din cheile lui T. getProperty(user, 'email') daca 'email' nu exista = eroare TS.",
        "difficulty": "hard"
      },
      {
        "number": 2,
        "name": "infer keyword",
        "question": "Ce face `infer R` in `T extends (...args: any[]) => infer R ? R : never`?",
        "options": [
          "Importa R din alta parte",
          "Extrage si numeste un tip din cadrul structurii — R devine tipul returnat al functiei",
          "Creeaza tip generic R",
          "Valideaza R"
        ],
        "answer": "Extrage si numeste un tip din cadrul structurii — R devine tipul returnat al functiei",
        "explanation": "infer = 'deduce acest tip si da-i un nume'. Poate extrage tipuri din locuri care altfel ar fi inaccesibile: return type, arg types, array item type.",
        "difficulty": "hard"
      },
      {
        "number": 3,
        "name": "Mapped types -?",
        "question": "Ce face `-?` in `type Required<T> = { [P in keyof T]-?: T[P] }`?",
        "options": [
          "Sterge proprietatea",
          "Elimina modificatorul optional (?) — face toate campurile obligatorii",
          "Adauga minus la tip",
          "Face readonly"
        ],
        "answer": "Elimina modificatorul optional (?) — face toate campurile obligatorii",
        "explanation": "Prefix - = negare modificator. -? = elimina optional. +? = adauga optional. -readonly = elimina readonly. +readonly = adauga readonly.",
        "difficulty": "hard"
      },
      {
        "number": 4,
        "name": "as const",
        "question": "De ce folosesti `as const` pentru un array de strings ('admin', 'user', 'guest')?",
        "options": [
          "Sa faci array-ul mai rapid",
          "Creeaza tuple literal readonly — permite extragerea union type: typeof ARR[number] = 'admin' | 'user' | 'guest'",
          "Sa previi modificari",
          "E obligatoriu cu TypeScript"
        ],
        "answer": "Creeaza tuple literal readonly — permite extragerea union type: typeof ARR[number] = 'admin' | 'user' | 'guest'",
        "explanation": "Fara as const: tipul e string[] — pierde valorile exacte. Cu as const: readonly ['admin','user','guest'] — tipuri literale, union posibil.",
        "difficulty": "hard"
      },
      {
        "number": 5,
        "name": "Discriminated union avantaj",
        "question": "De ce discriminated union e mai bun decat `type: string` ca discriminant?",
        "options": [
          "Identice",
          "TypeScript narrowing: in `case 'circle':` TypeScript stie exact ca shape e `{kind:'circle'; radius:number}` — acces sigur la radius",
          "Performanta",
          "Nu e diferenta practica"
        ],
        "answer": "TypeScript narrowing: in `case 'circle':` TypeScript stie exact ca shape e `{kind:'circle'; radius:number}` — acces sigur la radius",
        "explanation": "Discriminant literal (string literal union) permite exhaustiveness checking: compilatorul te avertizeaza daca uiti un case din switch.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "Type guard custom",
        "question": "Ce face `value is string` ca return type al unui type guard?",
        "options": [
          "Valideaza ca value e string la runtime",
          "Spune TypeScript ca dupa aceasta functie (daca returneaza true), value e de tipul string",
          "Creeaza tip nou",
          "E o constrangere generica"
        ],
        "answer": "Spune TypeScript ca dupa aceasta functie (daca returneaza true), value e de tipul string",
        "explanation": "Type predicates: if(isString(val)) { /* TypeScript stie ca val: string */ }. Fara predicate, tipul val ramane unknown/any.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "Utility type Omit",
        "question": "Ce face `Omit<User, 'password' | 'createdAt'>`?",
        "options": [
          "Sterge User din cod",
          "Creeaza tip nou cu toate campurile din User EXCEPTAND 'password' si 'createdAt'",
          "Creeaza user fara acele campuri",
          "Valideaza ca User nu are acele campuri"
        ],
        "answer": "Creeaza tip nou cu toate campurile din User EXCEPTAND 'password' si 'createdAt'",
        "explanation": "Omit = Pick invers. Util pentru response types (omit parola), partial updates (omit ID), etc. Mai explicit si mai safe decat as.",
        "difficulty": "easy"
      },
      {
        "number": 8,
        "name": "Template literal types",
        "question": "Ce tip produce `` type Route = `/${string}` ``?",
        "options": [
          "string",
          "Orice string care incepe cu '/'",
          "Un string de forma '/ceva'",
          "Tipul URL"
        ],
        "answer": "Orice string care incepe cu '/'",
        "explanation": "Template literal types: `/${string}` = strings care match pattern. '/users' OK; '/api/items' OK; 'users' (fara /) NU. Util pentru API paths, event names.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "Awaited utility",
        "question": "Ce face `Awaited<Promise<User[]>>`?",
        "options": [
          "Creeaza un Promise",
          "Extrage tipul din Promise: User[]",
          "Asteapta Promise-ul",
          "Creeaza array de Users"
        ],
        "answer": "Extrage tipul din Promise: User[]",
        "explanation": "Awaited recursiv unwrap Promises: Awaited<Promise<Promise<User>>> = User. Util cu ReturnType: Awaited<ReturnType<typeof asyncFn>>.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "satisfies operator",
        "question": "Ce avantaj aduce `satisfies` (TS 4.9) fata de `: TypeAnnotation`?",
        "options": [
          "Identice",
          "satisfies valideaza contra unui tip dar pastreaza tipul literal inferit — nu largeste tipul",
          "satisfies e mai rapid",
          "satisfies e obligatoriu"
        ],
        "answer": "satisfies valideaza contra unui tip dar pastreaza tipul literal inferit — nu largeste tipul",
        "explanation": "const x: Record<string, string|number[]> = {red: [1,2,3]} -> x.red.map() eroare (tip string|number[]). Cu satisfies: x.red e number[] (pastreaza tipul literal).",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "Conditional type distributive",
        "question": "Ce produce `type ToArray<T> = T extends any ? T[] : never` aplicat la `string | number`?",
        "options": [
          "(string | number)[]",
          "string[] | number[] — conditional types se distribuie pe union members",
          "never",
          "any[]"
        ],
        "answer": "string[] | number[] — conditional types se distribuie pe union members",
        "explanation": "Conditional types pe union sunt distributive: ToArray<string|number> = ToArray<string> | ToArray<number> = string[]|number[]. Nu (string|number)[].",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "Generic Stack coding",
        "question": "Implementeaza o clasa generica `Stack<T>` cu metodele push, pop, peek si size.",
        "options": [],
        "answer": "",
        "explanation": "push: this.items.push(item). pop: return this.items.pop(). peek: return this.items[this.items.length-1].",
        "difficulty": "easy"
      },
      {
        "number": 13,
        "name": "Type guard coding",
        "question": "Implementeaza type guard-uri pentru a valida un obiect User (trebuie sa aiba id: number, name: string, email: string).",
        "options": [],
        "answer": "",
        "explanation": "typeof obj === 'object' && obj !== null && typeof obj.id === 'number' && typeof obj.name === 'string' && typeof obj.email === 'string'",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Mapped type simulat coding",
        "question": "Implementeaza functia `partial(obj)` care returneaza un obiect cu toate campurile optionale (face un deep clone si permite null pe orice camp).",
        "options": [],
        "answer": "",
        "explanation": "Proxy cu get care returneaza undefined pentru chei lipsa. TypeScript Partial<T> = { [P in keyof T]?: T[P] } face acelasi lucru la nivel de tip.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Discriminated union coding",
        "question": "Implementeaza functia `processShape(shape)` care calculeaza aria unui Shape discriminated union: circle, square, triangle.",
        "options": [],
        "answer": "",
        "explanation": "switch(shape.kind) { case 'circle': return Math.PI*shape.radius**2; case 'square': return shape.side**2; case 'triangle': return 0.5*shape.base*shape.height; default: throw new Error(`Unknown: ${shape.kind}`); }",
        "difficulty": "easy"
      }
    ]
  },
  {
    "slug": "js-mini-proiect",
    "title": "45. Mini Proiect JS Final — Real-time Dashboard cu WebSockets + Canvas",
    "order": 45,
    "theory": [
      {
        "order": 1,
        "title": "Arhitectura Dashboard Real-time",
        "content": "```javascript\n// Arhitectura componentelor\n// WebSocket Client -> Data Store -> Canvas Renderer\n//                                -> DOM Updater\n//                                -> Alert System\n\nclass Dashboard {\n  constructor(canvasId, wsUrl) {\n    this.canvas = document.getElementById(canvasId);\n    this.ctx = this.canvas.getContext('2d');\n    this.data = new DataStore();\n    this.ws = null;\n    this.animFrameId = null;\n    this.charts = new Map();\n\n    this.setupCanvas();\n    this.connectWebSocket(wsUrl);\n    this.startRenderLoop();\n  }\n\n  setupCanvas() {\n    const dpr = window.devicePixelRatio || 1;\n    const rect = this.canvas.getBoundingClientRect();\n    this.canvas.width = rect.width * dpr;\n    this.canvas.height = rect.height * dpr;\n    this.ctx.scale(dpr, dpr);\n\n    // Responsiv\n    new ResizeObserver(() => this.setupCanvas()).observe(this.canvas);\n  }\n\n  connectWebSocket(url) {\n    this.ws = new ReconnectingWebSocket(url);\n    this.ws.on('message', data => {\n      this.data.update(data);\n      this.updateDOM(data);\n    });\n  }\n\n  startRenderLoop() {\n    const render = () => {\n      this.drawCharts();\n      this.animFrameId = requestAnimationFrame(render);\n    };\n    this.animFrameId = requestAnimationFrame(render);\n  }\n\n  destroy() {\n    this.ws?.disconnect();\n    cancelAnimationFrame(this.animFrameId);\n  }\n}\n```\n\n**Interviu:** Cum gestionezi cleanup-ul intr-un dashboard complex? destroy() trebuie sa: inchida WebSocket, anuleze rAF, deconecteze observers, curete timers. Fara cleanup = memory leaks garantate."
      },
      {
        "order": 2,
        "title": "DataStore si State Management",
        "content": "```javascript\nclass DataStore {\n  constructor(maxDataPoints = 100) {\n    this.maxPoints = maxDataPoints;\n    this.series = new Map(); // name -> CircularBuffer\n    this.listeners = new Set();\n    this.lastUpdate = null;\n  }\n\n  // Circular buffer pentru date time-series\n  ensureSeries(name) {\n    if (!this.series.has(name)) {\n      this.series.set(name, {\n        values: new Float32Array(this.maxPoints),\n        head: 0,\n        count: 0,\n        min: Infinity,\n        max: -Infinity\n      });\n    }\n    return this.series.get(name);\n  }\n\n  push(seriesName, value) {\n    const series = this.ensureSeries(seriesName);\n    series.values[series.head] = value;\n    series.head = (series.head + 1) % this.maxPoints;\n    series.count = Math.min(series.count + 1, this.maxPoints);\n    series.min = Math.min(series.min, value);\n    series.max = Math.max(series.max, value);\n    this.notify();\n  }\n\n  getOrdered(seriesName) {\n    const s = this.series.get(seriesName);\n    if (!s) return [];\n    const result = new Float32Array(s.count);\n    for (let i = 0; i < s.count; i++) {\n      result[i] = s.values[(s.head - s.count + i + this.maxPoints) % this.maxPoints];\n    }\n    return Array.from(result);\n  }\n\n  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }\n  notify() { this.listeners.forEach(fn => fn(this)); }\n}\n```"
      },
      {
        "order": 3,
        "title": "Canvas Chart Renderer",
        "content": "```javascript\nclass LineChart {\n  constructor(ctx, options = {}) {\n    this.ctx = ctx;\n    this.colors = options.colors || ['#3498db', '#e74c3c', '#2ecc71'];\n    this.padding = options.padding || { top: 20, right: 20, bottom: 30, left: 50 };\n  }\n\n  draw(x, y, width, height, seriesData) {\n    const { ctx, padding: p } = this;\n    const chartX = x + p.left;\n    const chartY = y + p.top;\n    const chartW = width - p.left - p.right;\n    const chartH = height - p.top - p.bottom;\n\n    // Background\n    ctx.fillStyle = '#1a1a2e';\n    ctx.fillRect(x, y, width, height);\n\n    // Grid\n    ctx.strokeStyle = 'rgba(255,255,255,0.1)';\n    ctx.lineWidth = 1;\n    for (let i = 0; i <= 4; i++) {\n      const gridY = chartY + (chartH / 4) * i;\n      ctx.beginPath();\n      ctx.moveTo(chartX, gridY);\n      ctx.lineTo(chartX + chartW, gridY);\n      ctx.stroke();\n    }\n\n    // Deseneaza fiecare serie\n    seriesData.forEach((data, idx) => {\n      if (data.values.length < 2) return;\n      const max = Math.max(...data.values, 1);\n\n      ctx.beginPath();\n      ctx.strokeStyle = this.colors[idx % this.colors.length];\n      ctx.lineWidth = 2;\n\n      data.values.forEach((val, i) => {\n        const px = chartX + (i / (data.values.length - 1)) * chartW;\n        const py = chartY + chartH - (val / max) * chartH;\n        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);\n      });\n      ctx.stroke();\n    });\n  }\n}\n```"
      },
      {
        "order": 4,
        "title": "WebSocket Data Protocol si Optimizari",
        "content": "```javascript\n// Protocol de date binar pentru minimizare overhead\n// Binary: 4 bytes timestamp + N * (1 byte tip + 4 bytes float)\n\nclass DataProtocol {\n  static encode(metrics) {\n    const buffer = new ArrayBuffer(4 + metrics.length * 5);\n    const view = new DataView(buffer);\n    view.setUint32(0, Date.now() / 1000); // timestamp Unix\n    metrics.forEach(({ type, value }, i) => {\n      view.setUint8(4 + i * 5, type);\n      view.setFloat32(4 + i * 5 + 1, value);\n    });\n    return buffer;\n  }\n\n  static decode(buffer) {\n    const view = new DataView(buffer);\n    const timestamp = view.getUint32(0) * 1000;\n    const metrics = [];\n    for (let i = 4; i < buffer.byteLength; i += 5) {\n      metrics.push({\n        type: view.getUint8(i),\n        value: view.getFloat32(i + 1)\n      });\n    }\n    return { timestamp, metrics };\n  }\n}\n\n// Optimizari pentru high-frequency data\nconst THROTTLE_MS = 16; // max 60fps updates\n\nclass DashboardController {\n  constructor(dashboard) {\n    this.dashboard = dashboard;\n    this.pendingUpdate = null;\n  }\n\n  onDataReceived(rawData) {\n    // Throttle DOM updates la 60fps\n    if (!this.pendingUpdate) {\n      this.pendingUpdate = requestAnimationFrame(() => {\n        this.dashboard.render();\n        this.pendingUpdate = null;\n      });\n    }\n    // Acumuleaza date in DataStore (fara render extra)\n    this.dashboard.store.push(rawData);\n  }\n}\n```\n\n**Interviu:** Cum optimizezi un dashboard care primeste 100 de mesaje/secunda? Throttle DOM updates la rAF (60fps). DataStore acumuleaza toate datele. Canvas renderizeaza starea finala. Binary protocol reduce payload size cu 60-70% fata de JSON."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Circular buffer avantaj",
        "question": "De ce folosesti un Circular Buffer (Float32Array cu head/count) pentru time-series data in DataStore?",
        "options": [
          "E mai simplu decat Array",
          "Memorie constanta O(maxPoints) indiferent de time; nu realoca la fiecare push; cache-friendly",
          "Float32Array e mai rapid",
          "E obligatoriu"
        ],
        "answer": "Memorie constanta O(maxPoints) indiferent de time; nu realoca la fiecare push; cache-friendly",
        "explanation": "Array.push infinit = memorie creste continuu. Circular buffer = suprascriere ciclica = memorie fixa. Float32Array = binary data in memorie continua = CPU cache efficient.",
        "difficulty": "hard"
      },
      {
        "number": 2,
        "name": "rAF pentru throttle updates",
        "question": "De ce batchez DOM updates cu `requestAnimationFrame` cand primesti date frecvent (100 msg/sec)?",
        "options": [
          "rAF e mai rapid",
          "Browser randeaza la ~60fps; mai mult de 1 update pe frame e risipitor; rAF garanteaza un singur update vizibil per frame",
          "E obligatoriu",
          "Reduce latenta"
        ],
        "answer": "Browser randeaza la ~60fps; mai mult de 1 update pe frame e risipitor; rAF garanteaza un singur update vizibil per frame",
        "explanation": "100 msg/sec = 100 posibile DOM updates/sec. Browser poate randa 60fps. Cele 40 extra update-uri sunt risipite. rAF batch = exact 60 randari vizibile.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "Binary protocol vs JSON",
        "question": "De ce e un protocol binar mai eficient decat JSON pentru date frecvente in WebSocket?",
        "options": [
          "JSON e gresit",
          "JSON: serializare/deserializare CPU, overhead string. Binary: direct bytes, sizeof float = 4 bytes vs '3.14159...' = 9+ bytes",
          "Binary e mai sigur",
          "Nu e eficient"
        ],
        "answer": "JSON: serializare/deserializare CPU, overhead string. Binary: direct bytes, sizeof float = 4 bytes vs '3.14159...' = 9+ bytes",
        "explanation": "La 100 msgs/sec: JSON 200 bytes/msg = 20KB/sec. Binary 20 bytes/msg = 2KB/sec = 90% reducere. Plus CPU mai putin pentru parsing.",
        "difficulty": "hard"
      },
      {
        "number": 4,
        "name": "ResizeObserver pentru canvas",
        "question": "De ce observi canvas-ul cu ResizeObserver si reconfigurezi la resize?",
        "options": [
          "E obligatoriu",
          "Canvas width/height trebuie actualizate cand containerul se redimensioneaza; altfel se rasterizeaza prost (stretched)",
          "ResizeObserver e mai usor",
          "Sa salvezi resize events"
        ],
        "answer": "Canvas width/height trebuie actualizate cand containerul se redimensioneaza; altfel se rasterizeaza prost (stretched)",
        "explanation": "Canvas pixel dimensions != CSS dimensions. La resize, trebuie: canvas.width = newWidth * dpr; ctx.scale(dpr,dpr). Altfel imaginea e distorsionata.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "Dashboard destroy",
        "question": "Ce trebuie sa faca metoda `destroy()` a unui Dashboard component?",
        "options": [
          "Sterge canvas-ul",
          "Inchide WebSocket, anuleaza requestAnimationFrame, deconecteaza observers, curata event listeners",
          "Opreste toate request-urile",
          "Salveaza starea"
        ],
        "answer": "Inchide WebSocket, anuleaza requestAnimationFrame, deconecteaza observers, curata event listeners",
        "explanation": "Fara destroy(): WS ramane activ, rAF loop continua, observers retin referinte = memory leaks masive. destroy() = cleanup complet.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "Float32Array vs Array",
        "question": "De ce `Float32Array` in loc de `Array` pentru stocarea valorilor numerice in DataStore?",
        "options": [
          "Float32Array e mai simplu",
          "Float32Array = memorie contigua tipizata, 4 bytes/value; Array normal = obiecte JS cu overhead mare",
          "Array nu stocheaza float",
          "Float32Array e readonly"
        ],
        "answer": "Float32Array = memorie contigua tipizata, 4 bytes/value; Array normal = obiecte JS cu overhead mare",
        "explanation": "1000 valori: Float32Array = 4KB. Array<number> = ~48KB (pointeri la obiecte JS). Float32Array = 12x mai eficient, si cache-friendly pentru CPU.",
        "difficulty": "hard"
      },
      {
        "number": 7,
        "name": "Multiple canvas layers",
        "question": "De ce ai folosi doua canvas-uri suprapuse (background + foreground) pentru un chart?",
        "options": [
          "Estetica",
          "Optimizare: background (grid, axe) se redeseneaza rar; foreground (date) la fiecare frame — split reduce munca per frame",
          "Nu e recomandat",
          "Compatibilitate browser"
        ],
        "answer": "Optimizare: background (grid, axe) se redeseneaza rar; foreground (date) la fiecare frame — split reduce munca per frame",
        "explanation": "Grid redesenat la 60fps = risipa. Grid pe canvas separat, redesenat doar la resize. Foreground cu datele = 60fps. Tehnica de layering.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "DataView pentru binary",
        "question": "De ce folosesti `DataView` in loc de acces direct la `TypedArray` pentru protocolul binar?",
        "options": [
          "DataView e mai rapid",
          "DataView permite citire/scriere de tipuri mixte (uint8, float32, int16) la offset-uri arbitrare cu control endianness",
          "Nu e diferenta",
          "TypedArray nu are get/set"
        ],
        "answer": "DataView permite citire/scriere de tipuri mixte (uint8, float32, int16) la offset-uri arbitrare cu control endianness",
        "explanation": "Protocol cu header uint32 + body mix de uint8 si float32: DataView e perfect. TypedArray presupune ca tot e acelasi tip.",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "WebSocket reconnect in React",
        "question": "Cum gestionezi un WebSocket intr-un component React care se poate unmount?",
        "options": [
          "Variabila globala",
          "useEffect cu cleanup: ws = new WebSocket(); return () => ws.close() — WS se inchide la unmount",
          "Context API",
          "Nu e posibil"
        ],
        "answer": "useEffect cu cleanup: ws = new WebSocket(); return () => ws.close() — WS se inchide la unmount",
        "explanation": "Fara cleanup: WebSocket ramane activ dupa unmount, onmessage incearca sa seteze state pe component desmontat = erori + leaks.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Canvas clearRect frecventa",
        "question": "Ce efect are sa NU apelezi `clearRect` in fiecare frame al unui animation loop?",
        "options": [
          "Animatia e mai rapida",
          "Obiectele lasa urma (ghosting) — fiecare frame se suprapune peste cel precedent",
          "Nu are efect",
          "Canvas se reseteaza singur"
        ],
        "answer": "Obiectele lasa urma (ghosting) — fiecare frame se suprapune peste cel precedent",
        "explanation": "Canvas e persistent. Fara clearRect: bila se misca lasand o urma de pixeli. La 60fps = canvas complet acoperit dupa ~1 secunda. Intentionat: trail effects.",
        "difficulty": "easy"
      },
      {
        "number": 11,
        "name": "Separation of concerns Dashboard",
        "question": "De ce imparti Dashboard in DataStore, Renderer si WebSocketClient separat?",
        "options": [
          "E mai mult cod",
          "Single Responsibility: testezi DataStore independent, inlocuiesti Renderer fara sa schimbi logica date, mock-uiesti WS in teste",
          "Conventie",
          "Nu e recomandat"
        ],
        "answer": "Single Responsibility: testezi DataStore independent, inlocuiesti Renderer fara sa schimbi logica date, mock-uiesti WS in teste",
        "explanation": "Fara separare: cod greu de testat, modifici renderizarea si poate strica logica de date. Cu separare: fiecare parte e testabila si inlocuibila independent.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "DataStore cu circular buffer coding",
        "question": "Implementeaza un DataStore simplu care retine ultimele N valori pentru o serie. Include push si getAll (in ordine).",
        "options": [],
        "answer": "",
        "explanation": "push: values[head]=value; head=(head+1)%maxPoints; count=Math.min(count+1,maxPoints). getAll: for i in range(count): values[(head-count+i+maxPoints)%maxPoints]",
        "difficulty": "hard"
      },
      {
        "number": 13,
        "name": "Line chart pe canvas coding",
        "question": "Implementeaza o functie `drawLineChart(ctx, data, x, y, width, height)` care deseneaza un grafic line simplu.",
        "options": [],
        "answer": "",
        "explanation": "ctx.fillRect(x,y,w,h); ctx.beginPath(); data.forEach((v,i)=>{ const px=x+(i/(data.length-1))*width; const py=y+height-((v-minVal)/range)*height; i===0?ctx.moveTo(px,py):ctx.lineTo(px,py); }); ctx.stroke();",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "WebSocket dashboard hook coding",
        "question": "Implementeaza un custom hook `useDashboardData(wsUrl, maxPoints)` care conecteaza WebSocket si retine ultimele N valori primite.",
        "options": [],
        "answer": "",
        "explanation": "useEffect: ws=new WebSocket(url); ws.onmessage=e=>{ const val=JSON.parse(e.data); setData(prev=>[...prev,val].slice(-maxPoints)); }; return ()=>ws.close();",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Dashboard complet coding",
        "question": "Asambleaza un mini Dashboard complet: DataStore (circular buffer 20 points), SimulatedWS (trimite date random la 100ms), si un renderer care afiseaza statistici.",
        "options": [],
        "answer": "",
        "explanation": "Dashboard asambleaza DataStore + SimulatedWS (setInterval). Dupa 500ms: ~5 puncte de date. Stats: count, avg, min, max, last.",
        "difficulty": "medium"
      }
    ]
  }
];

module.exports = { jsExtra2 };
