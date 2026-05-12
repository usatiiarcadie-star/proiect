// Lecții suplimentare JavaScript — lecțiile 24-35

const jsExtra = [
  {
    slug: "timers-js",
    title: "24. Timers — setTimeout și setInterval",
    order: 24,
    theory: [
      { order: 1, title: "setTimeout — execută după un delay", content: "```javascript\n// Execută o funcție O SINGURĂ DATĂ după X milisecunde:\nsetTimeout(() => {\n  console.log('S-au scurs 2 secunde!');\n}, 2000);\n\n// Anulare:\nconst id = setTimeout(() => console.log('Nu va apărea'), 5000);\nclearTimeout(id); // anulat!\n\n// Cu parametri:\nfunction salut(nume, varsta) {\n  console.log(`Salut ${nume}, ai ${varsta} ani!`);\n}\nsetTimeout(salut, 1000, 'Ana', 25); // argumentele vin după delay\n```\n\n**Important:** setTimeout returnează un ID numeric — util pentru a anula cu clearTimeout." },
      { order: 2, title: "setInterval — execută repetat", content: "```javascript\n// Execută la fiecare X milisecunde:\nlet count = 0;\nconst id = setInterval(() => {\n  count++;\n  console.log(`Tick #${count}`);\n  if (count === 5) clearInterval(id); // oprire după 5 tick-uri\n}, 1000);\n\n// Pattern: ceas live\nconst clock = setInterval(() => {\n  document.getElementById('time').textContent =\n    new Date().toLocaleTimeString();\n}, 1000);\n\n// Curățare când componenta se demontează:\n// clearInterval(clock);\n```" },
      { order: 3, title: "setTimeout(fn, 0) — macrotask queue", content: "```javascript\nconsole.log('1 - sincron');\n\nsetTimeout(() => {\n  console.log('3 - setTimeout 0ms');\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log('2 - microtask (Promise)');\n});\n\nconsole.log('4 - tot sincron');\n\n// Output:\n// 1 - sincron\n// 4 - tot sincron\n// 2 - microtask (Promise)\n// 3 - setTimeout 0ms\n```\n\n**Event Loop:** Synchronous → Microtasks (Promises) → Macrotasks (setTimeout/setInterval)." },
      { order: 4, title: "requestAnimationFrame — animații fluide", content: "```javascript\n// Mai bun decât setInterval pentru animații:\nfunction animate(timestamp) {\n  const elapsed = timestamp - startTime;\n  element.style.left = (elapsed / 10) + 'px';\n\n  if (elapsed < 2000) {\n    requestAnimationFrame(animate); // continuă\n  }\n}\n\nconst startTime = performance.now();\nrequestAnimationFrame(animate);\n\n// rAF rulează la ~60fps (sincronizat cu refresh-ul display-ului)\n// Nu rulează în tab-uri inactive → economie baterie\n// Anulare: cancelAnimationFrame(id);\n```" },
    ],
    tasks: [
      { number: 1, name: "Delay setTimeout", question: "Ce face setTimeout(fn, 3000)?", options: ["Rulează fn de 3000 ori", "Rulează fn după 3 secunde", "Rulează fn la fiecare 3 secunde", "Oprește executarea 3s"], answer: "Rulează fn după 3 secunde", explanation: "setTimeout execută funcția O SINGURĂ DATĂ după delay-ul specificat (3000ms = 3s).", difficulty: "easy" },
      { number: 2, name: "clearTimeout", question: "Cum anulezi un setTimeout înainte să se execute?", options: ["stopTimeout(id)", "cancelTimeout(id)", "clearTimeout(id)", "removeTimeout(id)"], answer: "clearTimeout(id)", explanation: "clearTimeout(id) anulează un setTimeout folosind ID-ul returnat la creare.", difficulty: "easy" },
      { number: 3, name: "setInterval vs setTimeout", question: "Care e diferența principală dintre setInterval și setTimeout?", options: ["Nu există diferență", "setInterval execută repetat, setTimeout o singură dată", "setTimeout e mai rapid", "setInterval are mai multe argumente"], answer: "setInterval execută repetat, setTimeout o singură dată", explanation: "setTimeout = o singură execuție după delay. setInterval = execuție repetată la fiecare interval.", difficulty: "easy" },
      { number: 4, name: "clearInterval", question: "Cum oprești un setInterval?", options: ["stopInterval(id)", "clearInterval(id)", "pauseInterval(id)", "deleteInterval(id)"], answer: "clearInterval(id)", explanation: "clearInterval(id) oprește execuția repetată a unui setInterval.", difficulty: "easy" },
      { number: 5, name: "Event loop order", question: "Ce se afișează PRIMUL: setTimeout(fn,0) sau Promise.resolve().then(fn)?", options: ["setTimeout", "Promise.then", "Simultan", "Depinde de browser"], answer: "Promise.then", explanation: "Promises sunt microtasks și au prioritate față de macrotasks (setTimeout). Microtasks se execută înainte de macrotasks.", difficulty: "hard" },
      { number: 6, name: "rAF avantaj", question: "De ce e requestAnimationFrame mai bun decât setInterval pentru animații?", options: ["E mai rapid", "Sincronizat cu refresh display (~60fps) și pausat în tab-uri inactive", "Nu are nevoie de clearInterval", "E mai simplu"], answer: "Sincronizat cu refresh display (~60fps) și pausat în tab-uri inactive", explanation: "rAF rulează sincronizat cu display-ul (prevenind tearing) și se oprește automat în tab-uri inactive.", difficulty: "medium" },
      { number: 7, name: "ID returnat", question: "Ce returnează setTimeout?", options: ["undefined", "Promise", "ID numeric pentru clearTimeout", "Funcția pasată"], answer: "ID numeric pentru clearTimeout", explanation: "setTimeout returnează un număr (ID) care poate fi folosit cu clearTimeout pentru anulare.", difficulty: "medium" },
      { number: 8, name: "Delay minim", question: "setTimeout(fn, 0) înseamnă că fn rulează instant?", options: ["Da, imediat", "Nu, rulează după toate task-urile sincrone curente", "Nu, minim 1ms", "Da, înainte de orice altceva"], answer: "Nu, rulează după toate task-urile sincrone curente", explanation: "Chiar și cu delay 0, setTimeout pune funcția în macrotask queue — se execută după codul sincron și microtasks.", difficulty: "hard" },
      { number: 9, name: "Argumente setTimeout", question: "Cum pasezi argumente funcției din setTimeout fără arrow function?", options: ["setTimeout(fn(arg), 1000)", "setTimeout(fn, 1000, arg)", "setTimeout(fn, 1000).with(arg)", "Nu se poate"], answer: "setTimeout(fn, 1000, arg)", explanation: "Argumentele suplimentare după delay sunt pasate funcției: setTimeout(fn, delay, arg1, arg2).", difficulty: "medium" },
      {
        number: 10, name: "Sleep function", question: "Scrie o funcție sleep(ms) care returnează o Promise ce se rezolvă după ms milisecunde. Testează cu: sleep(100).then(() => console.log('gata'));",
        type: "coding", language: "javascript",
        starterCode: "function sleep(ms) {\n  // returnează o Promise\n}\n\nsleep(100).then(() => console.log('gata'));",
        options: [], answer: "", explanation: "Folosește new Promise(resolve => setTimeout(resolve, ms)).", difficulty: "medium", expectedOutput: ""
      },
      {
        number: 11, name: "Contor cu setInterval", question: "Scrie o funcție startCounter(n) care afișează numere de la 1 la n (câte unul pe secundă simulat). Folosește setInterval și oprește-l când ajungi la n. Testează sincron: simulează cu o funcție tick().",
        type: "coding", language: "javascript",
        starterCode: "function startCounter(n) {\n  let i = 0;\n  const id = setInterval(() => {\n    i++;\n    console.log(i);\n    if (i === n) clearInterval(id);\n  }, 1000);\n  return id;\n}\n\n// Test sincron — simulăm că setInterval a rulat de 3 ori:\nlet count = 0;\nconst testId = { cleared: false };\nfunction mockInterval(fn, n) {\n  for(let i = 0; i < n; i++) fn();\n}\nmockInterval(() => { count++; console.log(count); }, 3);",
        options: [], answer: "", explanation: "setInterval cu clearInterval când condiția e îndeplinită.", difficulty: "medium", expectedOutput: "1"
      },
      {
        number: 12, name: "clearTimeout test", question: "Scrie cod care creează un setTimeout de 5000ms, salvează ID-ul, și îl anulează imediat. Afișează 'anulat' după anulare.",
        type: "coding", language: "javascript",
        starterCode: "// Creează și anulează un timeout\nconst id = setTimeout(() => {\n  console.log('nu ar trebui să apară');\n}, 5000);\n\n// anulează-l\n// afișează 'anulat'\n",
        options: [], answer: "", explanation: "clearTimeout(id) anulează timeout-ul. console.log('anulat') confirmă.", difficulty: "easy", expectedOutput: "anulat"
      },
      {
        number: 13, name: "Execuție după timeout", question: "Scrie o funcție executeAfter(fn, delay) care execută fn după delay milisecunde și returnează o funcție de anulare.",
        type: "coding", language: "javascript",
        starterCode: "function executeAfter(fn, delay) {\n  // returnează o funcție cancel\n}\n\nconst cancel = executeAfter(() => console.log('executat'), 2000);\nconsole.log(typeof cancel); // 'function'",
        options: [], answer: "", explanation: "const id = setTimeout(fn, delay); return () => clearTimeout(id);", difficulty: "medium", expectedOutput: "function"
      },
      {
        number: 14, name: "Microtask vs macrotask", question: "Ce ordine de afișare produce codul următor?\nconsole.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');",
        options: ["A, B, C, D", "A, D, C, B", "A, D, B, C", "A, C, D, B"],
        answer: "A, D, C, B",
        explanation: "Sincron (A, D) → microtasks (C - Promise) → macrotasks (B - setTimeout). Ordinea este A, D, C, B.", difficulty: "hard"
      },
      {
        number: 15, name: "Repeat cu timeout", question: "Implementează o funcție repeat(fn, times, delay) care apelează fn de 'times' ori, cu 'delay' ms între apeluri. Afișează rezultatele în ordine.",
        type: "coding", language: "javascript",
        starterCode: "function repeat(fn, times, delay) {\n  // apelează fn de 'times' ori cu delay ms între ele\n}\n\nrepeat((i) => console.log('apel', i), 3, 500);",
        options: [], answer: "", explanation: "Folosește setTimeout recursiv sau setInterval cu un contor.", difficulty: "hard", expectedOutput: ""
      },
    ],
  },
  {
    slug: "closures-currying",
    title: "25. Closures și Currying aprofundat",
    order: 25,
    theory: [
      { order: 1, title: "Ce este un closure?", content: "Un **closure** e o funcție care 'ține minte' variabilele din scope-ul exterior, chiar și după ce funcția exterioară s-a terminat:\n\n```javascript\nfunction creeazaContor() {\n  let count = 0; // această variabilă e 'capturată'\n\n  return {\n    incrementeaza: () => { count++; console.log(count); },\n    decrementeaza: () => { count--; console.log(count); },\n    valoare: () => count,\n  };\n}\n\nconst contor = creeazaContor();\ncontor.incrementeaza(); // 1\ncontor.incrementeaza(); // 2\ncontor.decrementeaza(); // 1\nconsole.log(contor.valoare()); // 1\n\n// count nu e accesibil direct — e 'privat'!\n```" },
      { order: 2, title: "Closure pentru date private + factory pattern", content: "```javascript\nfunction creeazaUser(nume, email) {\n  // Variabile private:\n  let _email = email;\n  let _loginCount = 0;\n\n  return {\n    getNume: () => nume,\n    getEmail: () => _email,\n    login: () => {\n      _loginCount++;\n      console.log(`${nume} s-a logat (data ${_loginCount})`);\n    },\n    setEmail: (newEmail) => {\n      if (newEmail.includes('@')) _email = newEmail;\n      else throw new Error('Email invalid');\n    },\n  };\n}\n\nconst user = creeazaUser('Ana', 'ana@test.com');\nuser.login(); // Ana s-a logat (data 1)\nconsole.log(user.getNume()); // 'Ana'\n// user._email — undefined (privat!)\n```" },
      { order: 3, title: "Currying — transformarea funcțiilor", content: "**Currying** = transformarea unei funcții `f(a,b,c)` în `f(a)(b)(c)`:\n\n```javascript\n// Funcție normală:\nfunction aduna(a, b, c) { return a + b + c; }\n\n// Varianta curry:\nconst adunaCurry = (a) => (b) => (c) => a + b + c;\n\nconsole.log(adunaCurry(1)(2)(3)); // 6\n\n// Utilitate — partial application:\nconst aduna5 = adunaCurry(5); // fixăm primul argument\nconsole.log(aduna5(3)(2)); // 10\nconsole.log(aduna5(10)(1)); // 16\n\n// Pattern practic:\nconst multiply = (factor) => (number) => number * factor;\nconst double = multiply(2);\nconst triple = multiply(3);\n\n[1, 2, 3, 4].map(double); // [2, 4, 6, 8]\n[1, 2, 3, 4].map(triple); // [3, 6, 9, 12]\n```" },
      { order: 4, title: "Memoization cu closures", content: "```javascript\n// Cache rezultate scumpe:\nfunction memoize(fn) {\n  const cache = new Map();\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) {\n      console.log('Din cache!');\n      return cache.get(key);\n    }\n    const result = fn.apply(this, args);\n    cache.set(key, result);\n    return result;\n  };\n}\n\nconst fibonacci = memoize(function fib(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n});\n\nconsole.log(fibonacci(40)); // calculat\nconsole.log(fibonacci(40)); // Din cache!\n```" },
    ],
    tasks: [
      { number: 1, name: "Closure definit", question: "Ce este un closure în JavaScript?", options: ["O funcție fără parametri", "O funcție care accesează variabile din scope-ul exterior după ce acela s-a terminat", "O funcție recursivă", "O funcție anonimă"], answer: "O funcție care accesează variabile din scope-ul exterior după ce acela s-a terminat", explanation: "Closure-ul 'capturează' variabilele din scope-ul lexical exterior — ele rămân disponibile.", difficulty: "medium" },
      { number: 2, name: "Date private", question: "Cum poți simula date private în JS cu closures?", options: ["Cu keyword private", "Variabilele locale din funcția exterioară nu sunt accesibile din afară", "Cu underscore prefix", "Nu poți"], answer: "Variabilele locale din funcția exterioară nu sunt accesibile din afară", explanation: "Variabilele locale sunt closure-ate — accesibile doar prin metodele returnate, nu direct din afară.", difficulty: "medium" },
      { number: 3, name: "Currying", question: "Ce este currying?", options: ["O metodă de sortare", "Transformarea f(a,b) în f(a)(b) — funcție care returnează funcție", "O bibliotecă JS", "Un tip de loop"], answer: "Transformarea f(a,b) în f(a)(b) — funcție care returnează funcție", explanation: "Currying transformează o funcție cu mai multe argumente într-un lanț de funcții cu câte un argument.", difficulty: "medium" },
      { number: 4, name: "Partial application", question: "const double = multiply(2). Ce face double(5)?", options: ["Eroare", "10 — 2 e fixat, aplici 5", "2", "multiply(2)(5)"], answer: "10 — 2 e fixat, aplici 5", explanation: "Partial application fixează un argument. multiply(2) returnează o funcție care înmulțește cu 2.", difficulty: "medium", expectedOutput: "15" },
      { number: 5, name: "Memoization scop", question: "De ce folosești memoization?", options: ["Pentru cod mai scurt", "Cache-uiești rezultatele pentru a evita recalculul funcțiilor scumpe", "Pentru debugging", "Pentru async"], answer: "Cache-uiești rezultatele pentru a evita recalculul funcțiilor scumpe", explanation: "Memoization stochează rezultatele apelurilor anterioare — evită re-execuția pentru aceiași parametri.", difficulty: "medium" },
      { number: 6, name: "Bug closure loop", question: "Care e problema clasică cu closures în for loop cu var?", options: ["Nicio problemă", "Toate funcțiile captează aceeași variabilă (ultima valoare)", "Loop-ul nu se execută", "TypeError"], answer: "Toate funcțiile captează aceeași variabilă (ultima valoare)", explanation: "var e function-scoped, nu block-scoped. Toate closures captează aceeași referință. Fix: let sau IIFE.", difficulty: "hard" },
      { number: 7, name: "Closure scoping", question: "Câte closures independente creează apelarea de două ori a aceleiași factory function?", options: ["0 — se împart", "1 — aceeași referință", "2 — fiecare apel are propriul scope", "Depinde de funcție"], answer: "2 — fiecare apel are propriul scope", explanation: "Fiecare apel al funcției factory creează un nou execution context cu variabile proprii.", difficulty: "medium" },
      {
        number: 8, name: "Contor cu closure", question: "Implementează o funcție makeCounter() care returnează un obiect cu metodele increment(), decrement() și value(). Starea trebuie să fie privată (în closure).",
        type: "coding", language: "javascript",
        starterCode: "function makeCounter() {\n  // starea privată\n  \n  return {\n    increment() {},\n    decrement() {},\n    value() {},\n  };\n}\n\nconst c = makeCounter();\nc.increment();\nc.increment();\nc.decrement();\nconsole.log(c.value()); // 1",
        options: [], answer: "", explanation: "let count = 0 în funcție, metodele îl accesează prin closure.", difficulty: "easy", expectedOutput: "1"
      },
      {
        number: 9, name: "Curry add", question: "Implementează funcția curry add: add(a)(b) returnează a + b. Testează: console.log(add(3)(4)) // 7",
        type: "coding", language: "javascript",
        starterCode: "function add(a) {\n  // returnează o funcție\n}\n\nconsole.log(add(3)(4));  // 7\nconsole.log(add(10)(5)); // 15",
        options: [], answer: "", explanation: "return (b) => a + b; — primul argument e capturat în closure.", difficulty: "easy", expectedOutput: "7"
      },
      {
        number: 10, name: "Memoize simplu", question: "Implementează memoize(fn) care cacheaza rezultatele după primul argument. Testează cu o funcție lentă simulată.",
        type: "coding", language: "javascript",
        starterCode: "function memoize(fn) {\n  // cache\n  return function(x) {\n    // returnează din cache sau calculează\n  };\n}\n\nlet callCount = 0;\nconst slow = memoize((n) => { callCount++; return n * n; });\nconsole.log(slow(5)); // 25\nconsole.log(slow(5)); // 25 (din cache)\nconsole.log(callCount); // 1 (apelat o singură dată)",
        options: [], answer: "", explanation: "Folosește un Map/obiect ca cache. Verifică dacă key-ul există înainte de a apela fn.", difficulty: "medium", expectedOutput: "1"
      },
      {
        number: 11, name: "Partial application", question: "Scrie funcția partial(fn, ...fixedArgs) care returnează o nouă funcție cu primele argumente fixate.",
        type: "coding", language: "javascript",
        starterCode: "function partial(fn, ...fixedArgs) {\n  return function(...restArgs) {\n    // combină fixedArgs cu restArgs\n  };\n}\n\nfunction aduna(a, b, c) { return a + b + c; }\nconst aduna10 = partial(aduna, 10);\nconsole.log(aduna10(3, 2)); // 15\nconsole.log(aduna10(0, 0)); // 10",
        options: [], answer: "", explanation: "return fn(...fixedArgs, ...restArgs) — spread ambele seturi de argumente.", difficulty: "medium", expectedOutput: "15"
      },
      {
        number: 12, name: "Factory de validatori", question: "Scrie o funcție makeValidator(min, max) care returnează o funcție ce verifică dacă un număr e în intervalul [min, max].",
        type: "coding", language: "javascript",
        starterCode: "function makeValidator(min, max) {\n  return function(value) {\n    // returnează true/false\n  };\n}\n\nconst validVarsta = makeValidator(0, 120);\nconst validScor = makeValidator(1, 10);\nconsole.log(validVarsta(25));  // true\nconsole.log(validVarsta(150)); // false\nconsole.log(validScor(7));     // true",
        options: [], answer: "", explanation: "min și max sunt capturați în closure. return value >= min && value <= max.", difficulty: "easy", expectedOutput: "true"
      },
      {
        number: 13, name: "Closure loop fix", question: "Fix-uiește codul astfel încât fiecare funcție din array să afișeze indexul corect (0, 1, 2).",
        type: "coding", language: "javascript",
        starterCode: "// Codul cu bug:\n// const fns = [];\n// for (var i = 0; i < 3; i++) {\n//   fns.push(() => console.log(i)); // toți afișează 3!\n// }\n\n// Fix-uiește folosind let sau IIFE:\nconst fns = [];\nfor (let i = 0; i < 3; i++) {\n  fns.push(() => console.log(i));\n}\n\nfns[0](); // 0\nfns[1](); // 1\nfns[2](); // 2",
        options: [], answer: "", explanation: "let e block-scoped — fiecare iterație are propriul i în closure. Cu var, toți capturează același i.", difficulty: "medium", expectedOutput: "0"
      },
      {
        number: 14, name: "Once function", question: "Implementează once(fn) care returnează o funcție ce apelează fn MAXIM O DATĂ. Apelurile ulterioare returnează prima valoare.",
        type: "coding", language: "javascript",
        starterCode: "function once(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn(...args);\n    }\n    return result;\n  };\n}\n\nlet n = 0;\nconst init = once(() => ++n);\nconsole.log(init()); // 1\nconsole.log(init()); // 1 (nu incrementează din nou)\nconsole.log(n);      // 1",
        options: [], answer: "", explanation: "Variabilele called și result sunt capturate în closure și persistă între apeluri.", difficulty: "medium", expectedOutput: "1"
      },
      {
        number: 15, name: "Curry multiply", question: "Implementează multiply(a)(b)(c) care returnează a * b * c. Trebuie să funcționeze și ca multiply(2)(3)(4) → 24.",
        type: "coding", language: "javascript",
        starterCode: "const multiply = (a) => (b) => (c) => a * b * c;\n\nconsole.log(multiply(2)(3)(4)); // 24\nconsole.log(multiply(5)(2)(1)); // 10\n\nconst double = multiply(2);\nconst doubleThenTriple = double(3);\nconsole.log(doubleThenTriple(5)); // 30",
        options: [], answer: "", explanation: "Fiecare arrow function captureaza argumentul anterior în closure.", difficulty: "easy", expectedOutput: "24"
      },
    ],
  },
  {
    slug: "prototype-chain",
    title: "26. Prototipuri și Prototype Chain",
    order: 26,
    theory: [
      { order: 1, title: "Ce este prototype chain?", content: "JavaScript e un limbaj bazat pe **prototipuri** — obiectele moștenesc de la alte obiecte:\n\n```javascript\nconst animal = {\n  mananca() { return `${this.nume} mănâncă`; },\n  doarme() { return `${this.nume} doarme`; },\n};\n\nconst caine = Object.create(animal);\ncaine.nume = 'Rex';\ncaine.latra = function() { return 'Ham!'; };\n\nconsole.log(caine.latra());  // 'Ham!' — propriu\nconsole.log(caine.mananca()); // 'Rex mănâncă' — din prototype\nconsole.log(caine.doarme());  // 'Rex doarme' — din prototype\n\n// Lanțul: caine → animal → Object.prototype → null\n```" },
      { order: 2, title: "__proto__, prototype, Object.getPrototypeOf", content: "```javascript\nfunction Masina(marca, an) {\n  this.marca = marca;\n  this.an = an;\n}\n\nMasina.prototype.descrie = function() {\n  return `${this.marca} (${this.an})`;\n};\n\nconst bmw = new Masina('BMW', 2023);\nconsole.log(bmw.descrie()); // 'BMW (2023)'\n\n// Verificare:\nconsole.log(Object.getPrototypeOf(bmw) === Masina.prototype); // true\nconsole.log(bmw instanceof Masina); // true\n\n// hasOwnProperty — doar proprietăți proprii:\nconsole.log(bmw.hasOwnProperty('marca'));  // true\nconsole.log(bmw.hasOwnProperty('descrie')); // false (e pe prototype)\n```" },
      { order: 3, title: "Clase ES6 vs prototype", content: "```javascript\n// ES6 class — syntactic sugar peste prototype:\nclass Animal {\n  constructor(nume) {\n    this.nume = nume;\n  }\n  vorbeste() {\n    return `${this.nume} face zgomot`;\n  }\n}\n\nclass Caine extends Animal {\n  vorbeste() {\n    return `${this.nume} latră!`;\n  }\n}\n\n// Echivalent cu prototype:\nfunction Animal2(nume) { this.nume = nume; }\nAnimal2.prototype.vorbeste = function() {\n  return `${this.nume} face zgomot`;\n};\n\n// Class e ACELAȘI mecanism, sintaxă mai clară.\n```" },
      { order: 4, title: "Object methods — create, assign, keys, entries", content: "```javascript\n// Object.create — control explicit asupra prototipului:\nconst baza = { salut() { return 'Hi!'; } };\nconst obj = Object.create(baza);\nobj.salut(); // 'Hi!'\n\n// Object.assign — merge obiecte (shallow):\nconst a = { x: 1 };\nconst b = { y: 2 };\nconst merged = Object.assign({}, a, b); // { x:1, y:2 }\n\n// Object.keys/values/entries:\nconst user = { name: 'Ana', age: 25 };\nObject.keys(user);   // ['name', 'age']\nObject.values(user); // ['Ana', 25]\nObject.entries(user); // [['name','Ana'], ['age',25]]\n\n// Object.freeze — imutabil:\nconst frozen = Object.freeze({ x: 1 });\nfrozen.x = 99; // silențios ignorat!\nconsole.log(frozen.x); // 1\n```" },
    ],
    tasks: [
      { number: 1, name: "Prototype chain", question: "Dacă o proprietate nu e găsită pe obiect, unde caută JS?", options: ["Aruncă eroare imediat", "Pe prototype-ul obiectului, apoi mai sus în lanț", "Returnează undefined direct", "Caută în variabilele globale"], answer: "Pe prototype-ul obiectului, apoi mai sus în lanț", explanation: "JS traversează lanțul de prototipuri (prototype chain) până găsește proprietatea sau ajunge la null.", difficulty: "medium" },
      { number: 2, name: "hasOwnProperty", question: "Ce verifică hasOwnProperty?", options: ["Dacă obiectul există", "Dacă proprietatea e pe obiectul însuși (nu pe prototype)", "Dacă proprietatea e read-only", "Dacă valoarea e null"], answer: "Dacă proprietatea e pe obiectul însuși (nu pe prototype)", explanation: "hasOwnProperty returnează true doar pentru proprietăți direct pe obiect, nu moștenite.", difficulty: "medium" },
      { number: 3, name: "Object.create", question: "Ce face Object.create(proto)?", options: ["Clonează proto", "Creează obiect cu proto ca prototype", "Îngheață proto", "Copiază toate metodele"], answer: "Creează obiect cu proto ca prototype", explanation: "Object.create(proto) creează un obiect nou cu proto setat ca prototip — control explicit al moștenirii.", difficulty: "medium" },
      { number: 4, name: "Class vs prototype", question: "Clasele ES6 sunt diferite fundamental față de prototipuri?", options: ["Da, sunt un alt sistem", "Nu, sunt syntactic sugar peste prototipuri", "Da, sunt mai rapide", "Nu știm sigur"], answer: "Nu, sunt syntactic sugar peste prototipuri", explanation: "Clasele ES6 sunt sintaxă mai clară peste același mecanism de prototipuri.", difficulty: "medium" },
      { number: 5, name: "Object.freeze", question: "Ce face Object.freeze?", options: ["Șterge proprietățile", "Face obiectul imutabil (nu mai poți adăuga/modifica/șterge)", "Converteste la string", "Creează o copie frozen"], answer: "Face obiectul imutabil (nu mai poți adăuga/modifica/șterge)", explanation: "Object.freeze previne orice modificare a obiectului. Schimbările sunt ignorate (sau aruncă TypeError în strict mode).", difficulty: "medium" },
      { number: 6, name: "instanceof", question: "Ce verifică instanceof?", options: ["Tipul primitiv", "Dacă un obiect are o clasă/constructor în lanțul prototype", "Dacă e un array", "Dacă e null"], answer: "Dacă un obiect are o clasă/constructor în lanțul prototype", explanation: "instanceof verifică dacă Constructor.prototype e în lanțul prototype al obiectului.", difficulty: "medium" },
      { number: 7, name: "Object.entries iterare", question: "Object.entries({a:1, b:2}) returnează?", options: ["['a','b']", "[1,2]", "[['a',1],['b',2]]", "{a:1,b:2}"], answer: "[['a',1],['b',2]]", explanation: "Object.entries() returnează un array de perechi [key, value] — util pentru for...of.", difficulty: "easy" },
      {
        number: 8, name: "Object.create moștenire", question: "Creează un obiect 'vehicul' cu metoda describe() care returnează tipul. Apoi creează 'masina' care moștenește din 'vehicul' și adaugă proprietatea marca.",
        type: "coding", language: "javascript",
        starterCode: "const vehicul = {\n  tip: 'vehicul',\n  describe() {\n    return `Sunt un ${this.tip}`;\n  }\n};\n\nconst masina = Object.create(vehicul);\nmasina.tip = 'masina';\nmasina.marca = 'BMW';\n\nconsole.log(masina.describe()); // 'Sunt un masina'\nconsole.log(masina.marca);      // 'BMW'\nconsole.log(masina.hasOwnProperty('marca')); // true\nconsole.log(masina.hasOwnProperty('describe')); // false",
        options: [], answer: "", explanation: "Object.create setează prototipul. Proprietățile proprii sunt pe obiect, metodele moștenite pe prototype.", difficulty: "easy", expectedOutput: "Sunt un masina"
      },
      {
        number: 9, name: "Prototype method", question: "Adaugă metoda saluta() pe prototype-ul funcției constructor Persoana. Metoda să returneze 'Salut, sunt [nume]'.",
        type: "coding", language: "javascript",
        starterCode: "function Persoana(nume, varsta) {\n  this.nume = nume;\n  this.varsta = varsta;\n}\n\n// adaugă saluta() pe prototype\n\nconst p = new Persoana('Ana', 25);\nconsole.log(p.saluta()); // 'Salut, sunt Ana'\nconsole.log(p.hasOwnProperty('saluta')); // false (e pe prototype)",
        options: [], answer: "", explanation: "Persoana.prototype.saluta = function() { return `Salut, sunt ${this.nume}`; };", difficulty: "easy", expectedOutput: "Salut, sunt Ana"
      },
      {
        number: 10, name: "Clasa cu extends", question: "Scrie o clasă Animal cu proprietatea nume și metoda sunet(). Extinde-o cu clasa Pisica care suprascrie sunet() să returneze 'Miau'.",
        type: "coding", language: "javascript",
        starterCode: "class Animal {\n  constructor(nume) {\n    this.nume = nume;\n  }\n  sunet() {\n    return `${this.nume} face zgomot`;\n  }\n}\n\nclass Pisica extends Animal {\n  // suprascrie sunet()\n}\n\nconst p = new Pisica('Whiskers');\nconsole.log(p.sunet());  // 'Miau'\nconsole.log(p.nume);     // 'Whiskers'\nconsole.log(p instanceof Animal); // true",
        options: [], answer: "", explanation: "class Pisica extends Animal { sunet() { return 'Miau'; } } — super() în constructor dacă ai proprietăți extra.", difficulty: "easy", expectedOutput: "Miau"
      },
      {
        number: 11, name: "Object.assign merge", question: "Folosind Object.assign, combină cele 3 obiecte într-unul singur fără a modifica originalele.",
        type: "coding", language: "javascript",
        starterCode: "const a = { x: 1 };\nconst b = { y: 2 };\nconst c = { z: 3 };\n\nconst merged = Object.assign({}, a, b, c);\n\nconsole.log(merged); // { x: 1, y: 2, z: 3 }\nconsole.log(a);      // { x: 1 } — neschimbat",
        options: [], answer: "", explanation: "Object.assign({}, ...) copiază în obiect gol — originalele rămân intacte.", difficulty: "easy", expectedOutput: '{"x":1,"y":2,"z":3}'
      },
      {
        number: 12, name: "Iterare cu Object.entries", question: "Folosind Object.entries, calculează suma valorilor unui obiect { a: 10, b: 20, c: 30 }.",
        type: "coding", language: "javascript",
        starterCode: "const scoruri = { a: 10, b: 20, c: 30 };\n\nlet suma = 0;\nfor (const [key, value] of Object.entries(scoruri)) {\n  suma += value;\n}\n\nconsole.log(suma); // 60",
        options: [], answer: "", explanation: "Object.entries returnează [key, value] pairs. Destructurezi în for...of și acumulezi valorile.", difficulty: "easy", expectedOutput: "60"
      },
      { number: 13, name: "Lanț prototype end", question: "Care e capătul oricărui lanț prototype în JS?", options: ["undefined", "Object.prototype, apoi null", "null direct", "Function.prototype"], answer: "Object.prototype, apoi null", explanation: "Toate obiectele moștenesc din Object.prototype. Object.getPrototypeOf(Object.prototype) === null.", difficulty: "medium" },
      {
        number: 14, name: "Object.freeze verificare", question: "Creează un obiect config, freeze-uiește-l, încearcă să modifici o proprietate și verifică că modificarea nu a avut efect.",
        type: "coding", language: "javascript",
        starterCode: "const config = Object.freeze({ apiUrl: 'https://api.example.com', timeout: 5000 });\n\nconfig.apiUrl = 'https://hacker.com'; // ignorat!\nconfig.newProp = 'test';              // ignorat!\n\nconsole.log(config.apiUrl);  // 'https://api.example.com'\nconsole.log(config.newProp); // undefined",
        options: [], answer: "", explanation: "Object.freeze previne modificări. În non-strict mode sunt silențioase, în strict mode aruncă TypeError.", difficulty: "easy", expectedOutput: "https://api.example.com"
      },
      {
        number: 15, name: "Clasa cu metode statice", question: "Scrie o clasă MathUtils cu metoda statică sum(arr) care returnează suma elementelor unui array.",
        type: "coding", language: "javascript",
        starterCode: "class MathUtils {\n  static sum(arr) {\n    // calculează suma\n  }\n  \n  static average(arr) {\n    // calculează media\n  }\n}\n\nconsole.log(MathUtils.sum([1, 2, 3, 4]));     // 10\nconsole.log(MathUtils.average([1, 2, 3, 4])); // 2.5",
        options: [], answer: "", explanation: "Metodele statice se apelează pe clasă, nu pe instanțe. static sum(arr) { return arr.reduce((a,b) => a+b, 0); }", difficulty: "medium", expectedOutput: "10"
      },
    ],
  },
  {
    slug: "symbols-weakmap",
    title: "27. Symbol, WeakMap, WeakSet și Map/Set",
    order: 27,
    theory: [
      { order: 1, title: "Map și Set — colecții moderne", content: "```javascript\n// Map — cheie-valoare, orice tip de cheie:\nconst map = new Map();\nmap.set('nume', 'Ana');\nmap.set(42, 'număr ca cheie!');\nmap.set({ id: 1 }, 'obiect ca cheie!');\n\nmap.get('nume'); // 'Ana'\nmap.has(42);     // true\nmap.size;        // 3\nmap.delete('nume');\n\n// Iterare:\nfor (const [key, value] of map) {\n  console.log(key, '→', value);\n}\n\n// Set — valori unice:\nconst set = new Set([1, 2, 3, 2, 1]);\nconsole.log([...set]); // [1, 2, 3]\nset.add(4);\nset.has(3); // true\nset.size;   // 4\n```" },
      { order: 2, title: "Symbol — valori unice garantate", content: "```javascript\n// Symbol — identificator unic:\nconst sym1 = Symbol('descriere');\nconst sym2 = Symbol('descriere');\nconsole.log(sym1 === sym2); // false — mereu unic!\n\n// Folosire ca cheie pe obiect (nu apare în for...in):\nconst ID = Symbol('id');\nconst user = {\n  [ID]: 123,\n  name: 'Ana',\n};\nconsole.log(user[ID]); // 123\nconsole.log(user.ID);  // undefined — nu e string!\n\n// Well-known symbols:\nclass MyArray {\n  [Symbol.iterator]() {\n    let i = 0;\n    const data = [1, 2, 3];\n    return { next: () => ({ value: data[i++], done: i > data.length }) };\n  }\n}\nfor (const val of new MyArray()) console.log(val); // 1, 2, 3\n```" },
      { order: 3, title: "WeakMap și WeakSet — referințe slabe", content: "```javascript\n// WeakMap — cheile TREBUIE să fie obiecte, referință slabă:\nconst cache = new WeakMap();\n\nfunction proceseaza(obj) {\n  if (cache.has(obj)) return cache.get(obj);\n  const result = /* calcul scump */ obj.value * 2;\n  cache.set(obj, result);\n  return result;\n}\n\n// Avantaj: când obiectul e colectat de GC, intrarea din WeakMap dispare!\n// Spre deosebire de Map, nu previne garbage collection.\n\n// WeakSet — seturi de obiecte unice, referință slabă:\nconst procesate = new WeakSet();\nfunction proceseazaOnce(obj) {\n  if (procesate.has(obj)) return;\n  procesate.add(obj);\n  // ...\n}\n```" },
      { order: 4, title: "Diferențe cheie Map vs Object", content: "```javascript\n// CÂND să folosești Map vs Object:\n\n// Map:\n// ✅ Chei de orice tip (nu doar string/symbol)\n// ✅ Menține ordinea inserării garantat\n// ✅ .size direct\n// ✅ Iterabil direct (for...of)\n// ✅ Performance mai bun la inserții/ștergeri frecvente\n\n// Object:\n// ✅ Sintaxă literală { } mai convenabilă\n// ✅ JSON.stringify funcționează direct\n// ✅ Prototypal inheritance\n// ✅ Destructurare mai ușoară\n\n// Set vs Array:\n// Set: lookup O(1), valori unice garantat, mai rapid la .has()\n// Array: indexOf O(n), .find(), .map()/.filter() (mai versatil)\n\n// Deduplicare cu Set:\nconst unique = [...new Set([1, 2, 2, 3, 3, 3])];\n// [1, 2, 3]\n```" },
    ],
    tasks: [
      { number: 1, name: "Map vs Object cheie", question: "Ce poate fi cheie într-un Map dar NU într-un Object?", options: ["Stringuri", "Numere", "Orice valoare (obiecte, funcții, numere)", "Boolean"], answer: "Orice valoare (obiecte, funcții, numere)", explanation: "Map acceptă orice tip ca cheie. Object converteste cheile la string (sau Symbol).", difficulty: "medium" },
      { number: 2, name: "Set unicitate", question: "new Set([1, 2, 2, 3]).size returnează?", options: ["4", "3", "2", "Eroare"], answer: "3", explanation: "Set elimină duplicatele — 1, 2, 3 sunt valori unice. Size = 3.", difficulty: "easy" },
      { number: 3, name: "Symbol unicitate", question: "Symbol('x') === Symbol('x') returnează?", options: ["true", "false", "Depinde de context", "TypeError"], answer: "false", explanation: "Fiecare Symbol() creează o valoare unică garantată, chiar dacă descrierea e aceeași.", difficulty: "medium" },
      { number: 4, name: "WeakMap avantaj", question: "Ce avantaj are WeakMap față de Map?", options: ["E mai rapid mereu", "Nu previne garbage collection al cheilor (referință slabă)", "Suportă primitive ca chei", "Are .size disponibil"], answer: "Nu previne garbage collection al cheilor (referință slabă)", explanation: "WeakMap ține referințe slabe — când un obiect-cheie nu mai e referit altundeva, e garbage collected automat.", difficulty: "hard" },
      { number: 5, name: "Deduplicare array", question: "Cum elimini duplicatele dintr-un array cu Set?", options: ["array.unique()", "new Set(array)", "[...new Set(array)]", "Array.dedup(array)"], answer: "[...new Set(array)]", explanation: "new Set(array) creează un Set fără duplicate. Spread (...) îl converteste înapoi la array.", difficulty: "easy" },
      { number: 6, name: "Symbol ca cheie", question: "Apare un simbol-cheie în for...in pe un obiect?", options: ["Da", "Nu — Symbol-keys sunt non-enumerable în for...in", "Depinde", "Da, dar cu prefix"], answer: "Nu — Symbol-keys sunt non-enumerable în for...in", explanation: "Symbol-keys sunt ascunse de for...in și Object.keys(). Accesibile doar direct: obj[sym].", difficulty: "hard" },
      { number: 7, name: "Map.size", question: "Cum obții numărul de elemente dintr-un Map?", options: ["map.length", "map.count", "map.size", "map.getSize()"], answer: "map.size", explanation: "Map (și Set) folosesc proprietatea .size, nu .length ca array-urile.", difficulty: "easy" },
      {
        number: 8, name: "Frecvența cuvintelor cu Map", question: "Folosind un Map, numără de câte ori apare fiecare cuvânt în array-ul words.",
        type: "coding", language: "javascript",
        starterCode: "const words = ['ana', 'ion', 'ana', 'maria', 'ion', 'ana'];\n\nconst freq = new Map();\nfor (const w of words) {\n  freq.set(w, (freq.get(w) || 0) + 1);\n}\n\nfor (const [word, count] of freq) {\n  console.log(`${word}: ${count}`);\n}\n// ana: 3, ion: 2, maria: 1",
        options: [], answer: "", explanation: "freq.get(w) || 0 returnează 0 dacă key-ul nu există. Adăugăm 1 și actualizăm.", difficulty: "medium", expectedOutput: "ana: 3"
      },
      {
        number: 9, name: "Deduplicare cu Set", question: "Elimină duplicatele din array-ul nums și sortează rezultatul crescător.",
        type: "coding", language: "javascript",
        starterCode: "const nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];\n\nconst unice = [...new Set(nums)].sort((a, b) => a - b);\nconsole.log(unice); // [1, 2, 3, 4, 5, 6, 9]",
        options: [], answer: "", explanation: "new Set elimină duplicatele, spread converteste la array, sort() sortează numeric.", difficulty: "easy", expectedOutput: "[1,2,3,4,5,6,9]"
      },
      {
        number: 10, name: "Set operații", question: "Implementează funcțiile intersect(a, b) și difference(a, b) pentru Set-uri.",
        type: "coding", language: "javascript",
        starterCode: "function intersect(setA, setB) {\n  return new Set([...setA].filter(x => setB.has(x)));\n}\n\nfunction difference(setA, setB) {\n  return new Set([...setA].filter(x => !setB.has(x)));\n}\n\nconst a = new Set([1, 2, 3, 4]);\nconst b = new Set([3, 4, 5, 6]);\n\nconsole.log([...intersect(a, b)]); // [3, 4]\nconsole.log([...difference(a, b)]); // [1, 2]",
        options: [], answer: "", explanation: "Set.has() e O(1) — filtrăm un array spread din setA, verificând apartenența în setB.", difficulty: "medium", expectedOutput: "[3,4]"
      },
      {
        number: 11, name: "Map ca cache", question: "Implementează un cache simplu folosind Map. Funcția get(key) returnează valoarea sau null. Funcția set(key, value) adaugă/actualizează.",
        type: "coding", language: "javascript",
        starterCode: "function createCache() {\n  const store = new Map();\n  return {\n    get(key) { return store.get(key) ?? null; },\n    set(key, value) { store.set(key, value); },\n    has(key) { return store.has(key); },\n    clear() { store.clear(); },\n    size() { return store.size; },\n  };\n}\n\nconst cache = createCache();\ncache.set('user:1', { name: 'Ana' });\nconsole.log(cache.get('user:1')); // { name: 'Ana' }\nconsole.log(cache.get('user:2')); // null\nconsole.log(cache.size());        // 1",
        options: [], answer: "", explanation: "Map e ideal pentru cache-uri — chei de orice tip, .has() O(1), ușor de iterat.", difficulty: "easy", expectedOutput: '{"name":"Ana"}'
      },
      { number: 12, name: "WeakMap chei", question: "Ce tip de chei acceptă WeakMap?", options: ["Stringuri", "Numere", "Numai obiecte (și simboluri în unele env)", "Orice tip"], answer: "Numai obiecte (și simboluri în unele env)", explanation: "WeakMap cere chei obiect — primitives (string, number) aruncă TypeError.", difficulty: "medium" },
      {
        number: 13, name: "Map din Object", question: "Convertește obiectul config într-un Map și iterează-l afișând fiecare pereche cheie-valoare.",
        type: "coding", language: "javascript",
        starterCode: "const config = { host: 'localhost', port: 3000, debug: true };\n\nconst configMap = new Map(Object.entries(config));\n\nfor (const [key, value] of configMap) {\n  console.log(`${key} = ${value}`);\n}\n// host = localhost\n// port = 3000\n// debug = true",
        options: [], answer: "", explanation: "Object.entries() returnează [key, value] pairs — pasate direct în constructorul Map.", difficulty: "easy", expectedOutput: "host = localhost"
      },
      {
        number: 14, name: "Symbol ca ID privat", question: "Folosește un Symbol ca cheie privată pentru a stoca un ID intern pe un obiect, astfel încât să nu apară în Object.keys().",
        type: "coding", language: "javascript",
        starterCode: "const _id = Symbol('id');\n\nfunction createUser(name) {\n  const user = { name };\n  user[_id] = Math.floor(Math.random() * 1000);\n  return user;\n}\n\nconst u = createUser('Ana');\nconsole.log(u.name);          // 'Ana'\nconsole.log(u[_id]);          // un număr\nconsole.log(Object.keys(u));  // ['name'] — ID-ul e ascuns",
        options: [], answer: "", explanation: "Symbol-keys nu apar în Object.keys(), JSON.stringify(), for...in — sunt efectiv private.", difficulty: "medium", expectedOutput: "Ana"
      },
      { number: 15, name: "Set.has complexitate", question: "Set.has() și Array.includes() — care e mai rapid pentru colecții mari?", options: ["Array.includes() — e optimizat", "Set.has() — O(1) față de O(n) al array-ului", "Identic — același algoritm", "Depinde de tipul valorilor"], answer: "Set.has() — O(1) față de O(n) al array-ului", explanation: "Set folosește hash-table intern. has() e O(1). Array.includes() parcurge liniar — O(n).", difficulty: "medium" },
    ],
  },
  {
    slug: "proxy-reflect",
    title: "28. Proxy și Reflect",
    order: 28,
    theory: [
      { order: 1, title: "Proxy — interceptează operațiuni pe obiecte", content: "```javascript\n// Proxy interceptează get, set, delete, apply etc:\nconst handler = {\n  get(target, prop) {\n    console.log(`Citit: ${prop}`);\n    return prop in target ? target[prop] : `${prop} nu există!`;\n  },\n  set(target, prop, value) {\n    if (typeof value !== 'number') throw new TypeError('Doar numere!');\n    console.log(`Setat: ${prop} = ${value}`);\n    target[prop] = value;\n    return true; // success!\n  },\n};\n\nconst obj = new Proxy({}, handler);\nobj.x = 42;      // Setat: x = 42\nconsole.log(obj.x); // Citit: x → 42\nobj.y = 'text';  // TypeError: Doar numere!\nconsole.log(obj.z); // Citit: z → 'z nu există!'\n```" },
      { order: 2, title: "Traps disponibile în Proxy", content: "```javascript\nconst handler = {\n  // get — citire proprietate\n  get(target, prop, receiver) {},\n\n  // set — scriere proprietate\n  set(target, prop, value, receiver) {},\n\n  // has — operatorul in\n  has(target, prop) {},\n\n  // deleteProperty — operatorul delete\n  deleteProperty(target, prop) {},\n\n  // apply — apel funcție (pentru proxy pe funcții)\n  apply(target, thisArg, args) {},\n\n  // construct — operatorul new\n  construct(target, args) {},\n\n  // ownKeys — Object.keys(), for...in\n  ownKeys(target) {},\n};\n\n// Proxy revocabil:\nconst { proxy, revoke } = Proxy.revocable(obj, handler);\nproxy.x; // funcționează\nrevoke(); // dezactivat\nproxy.x; // TypeError!\n```" },
      { order: 3, title: "Reflect — oglinda operațiunilor JS", content: "```javascript\n// Reflect face aceleași operațiuni ca operatorii JS:\nReflect.get(obj, 'prop');           // ca obj.prop\nReflect.set(obj, 'prop', value);    // ca obj.prop = value\nReflect.has(obj, 'prop');           // ca 'prop' in obj\nReflect.deleteProperty(obj, 'p');   // ca delete obj.p\nReflect.ownKeys(obj);               // toate cheile proprii\n\n// Pattern recomandat în Proxy handler:\nconst safeProxy = new Proxy(obj, {\n  get(target, prop, receiver) {\n    const value = Reflect.get(target, prop, receiver);\n    return typeof value === 'function' ? value.bind(target) : value;\n  },\n  set(target, prop, value, receiver) {\n    console.log(`Setting ${prop}`);\n    return Reflect.set(target, prop, value, receiver);\n  },\n});\n```" },
      { order: 4, title: "Use cases practice", content: "```javascript\n// 1. Validare schema automată:\nfunction creeazaValidat(schema) {\n  return new Proxy({}, {\n    set(target, prop, value) {\n      if (schema[prop] && typeof value !== schema[prop]) {\n        throw new TypeError(`${prop} trebuie să fie ${schema[prop]}`);\n      }\n      target[prop] = value;\n      return true;\n    },\n  });\n}\n\nconst user = creeazaValidat({ name: 'string', age: 'number' });\nuser.name = 'Ana';   // OK\nuser.age = 25;       // OK\nuser.age = 'vechi';  // TypeError: age trebuie să fie number\n\n// 2. Reactive data (Vue 3 e bazat pe Proxy!)\n// 3. Logging automat\n// 4. API mocking\n// 5. Lazy loading de proprietăți\n```" },
    ],
    tasks: [
      { number: 1, name: "Proxy scop", question: "Ce face new Proxy(target, handler)?", options: ["Copiază target", "Interceptează și controlează operațiunile pe obiect", "Îngheață obiectul", "Creează o promisiune"], answer: "Interceptează și controlează operațiunile pe obiect", explanation: "Proxy permite interceptarea get, set, delete etc. — adaugi logică customizată la orice operațiune.", difficulty: "medium" },
      { number: 2, name: "get trap return", question: "În trap-ul get, ce TREBUIE să returnezi?", options: ["Nimic", "Valoarea care va fi returnată celui ce citește", "true/false", "Obiectul target"], answer: "Valoarea care va fi returnată celui ce citește", explanation: "Ceea ce returnezi din get trap e ceea ce primește codul care citește proprietatea.", difficulty: "medium" },
      { number: 3, name: "set trap return", question: "Ce trebuie să returneze trap-ul set pentru succes?", options: ["undefined", "true", "false", "Valoarea setată"], answer: "true", explanation: "Trap-ul set trebuie să returneze true pentru a indica succesul. false (sau fără return) aruncă TypeError în strict mode.", difficulty: "hard" },
      { number: 4, name: "Reflect vs operator", question: "Reflect.get(obj, 'x') e echivalent cu?", options: ["obj.get('x')", "obj['x'] sau obj.x", "Object.get(obj, 'x')", "obj.getProperty('x')"], answer: "obj['x'] sau obj.x", explanation: "Reflect.get(obj, prop) face exact același lucru ca obj.prop sau obj[prop].", difficulty: "easy" },
      { number: 5, name: "Vue si Proxy", question: "Proxy e folosit în Vue 3 pentru ce?", options: ["Routing", "Reactivity system — detectarea schimbărilor de date", "Styling", "Testing"], answer: "Reactivity system — detectarea schimbărilor de date", explanation: "Vue 3 folosește Proxy pentru a intercepta get/set pe date reactive și a declanșa re-randare automată.", difficulty: "medium" },
      {
        number: 6, name: "Proxy validare tip", question: "Creează un Proxy care validează că proprietatea 'age' poate fi setată doar cu valori numerice. Alte proprietăți se setează normal.",
        type: "coding", language: "javascript",
        starterCode: "function createValidatedObj() {\n  return new Proxy({}, {\n    set(target, prop, value) {\n      if (prop === 'age' && typeof value !== 'number') {\n        throw new TypeError('age trebuie să fie number');\n      }\n      target[prop] = value;\n      return true;\n    },\n  });\n}\n\nconst obj = createValidatedObj();\nobj.name = 'Ana'; // ok\nobj.age = 25;     // ok\nconsole.log(obj.name, obj.age); // 'Ana' 25\n\ntry {\n  obj.age = 'vechi';\n} catch(e) {\n  console.log(e.message); // 'age trebuie să fie number'\n}",
        options: [], answer: "", explanation: "În set trap: verifici prop și tipul valorii. Returnezi true pentru succes.", difficulty: "medium", expectedOutput: "Ana 25"
      },
      {
        number: 7, name: "Proxy logging", question: "Implementează un proxy 'logger' care afișează 'GET: [prop]' la fiecare citire și 'SET: [prop] = [value]' la fiecare scriere.",
        type: "coding", language: "javascript",
        starterCode: "function createLogger(obj) {\n  return new Proxy(obj, {\n    get(target, prop) {\n      console.log(`GET: ${prop}`);\n      return Reflect.get(target, prop);\n    },\n    set(target, prop, value) {\n      console.log(`SET: ${prop} = ${value}`);\n      return Reflect.set(target, prop, value);\n    },\n  });\n}\n\nconst user = createLogger({ name: 'Ana' });\nuser.name;      // GET: name\nuser.age = 25;  // SET: age = 25\nconsole.log(user.age); // GET: age → 25",
        options: [], answer: "", explanation: "Reflect.get/set execută operațiunea normală. Tu adaugi logging înainte.", difficulty: "easy", expectedOutput: "GET: name"
      },
      {
        number: 8, name: "Proxy readonly", question: "Creează un proxy care face un obiect read-only: orice tentativă de set aruncă TypeError.",
        type: "coding", language: "javascript",
        starterCode: "function readOnly(obj) {\n  return new Proxy(obj, {\n    set(target, prop, value) {\n      throw new TypeError(`Obiect read-only: nu poți seta '${prop}'`);\n    },\n    deleteProperty(target, prop) {\n      throw new TypeError(`Obiect read-only: nu poți șterge '${prop}'`);\n    },\n  });\n}\n\nconst config = readOnly({ apiUrl: 'https://api.test.com', timeout: 3000 });\nconsole.log(config.apiUrl); // citire ok\n\ntry {\n  config.apiUrl = 'changed';\n} catch(e) {\n  console.log(e.message); // 'Obiect read-only: nu poți seta apiUrl'\n}",
        options: [], answer: "", explanation: "Trap-ul set aruncă TypeError. deleteProperty de asemenea. get e nemodificat (implicit).", difficulty: "medium", expectedOutput: "https://api.test.com"
      },
      { number: 9, name: "Proxy revocabil", question: "Ce face Proxy.revocable(target, handler)?", options: ["Creează proxy temporar de 1 oră", "Returnează { proxy, revoke } — revoke() dezactivează proxy-ul", "Îngheață proxy-ul", "Creează un proxy clona"], answer: "Returnează { proxy, revoke } — revoke() dezactivează proxy-ul", explanation: "Proxy.revocable permite dezactivarea explicită a proxy-ului. After revoke(), orice acces aruncă TypeError.", difficulty: "medium" },
      {
        number: 10, name: "Proxy valoare default", question: "Creează un proxy care returnează 0 pentru orice proprietate care nu există pe obiect (în loc de undefined).",
        type: "coding", language: "javascript",
        starterCode: "function withDefaults(obj, defaultValue = 0) {\n  return new Proxy(obj, {\n    get(target, prop) {\n      return prop in target ? target[prop] : defaultValue;\n    },\n  });\n}\n\nconst scoruri = withDefaults({ ana: 95, ion: 87 });\nconsole.log(scoruri.ana);   // 95\nconsole.log(scoruri.ion);   // 87\nconsole.log(scoruri.maria); // 0 (default)",
        options: [], answer: "", explanation: "Verifici 'prop in target'. Dacă există, returnezi valoarea normală, altfel defaultValue.", difficulty: "easy", expectedOutput: "95"
      },
      { number: 11, name: "has trap", question: "Ce operator JS activează trap-ul 'has' din Proxy?", options: ["typeof", "in", "instanceof", "delete"], answer: "in", explanation: "Operatorul 'in' (ex: 'prop' in obj) activează trap-ul has. Îl poți folosi să ascunzi/expui proprietăți.", difficulty: "hard" },
      {
        number: 12, name: "Reflect.ownKeys", question: "Ce returnează Reflect.ownKeys(obj) față de Object.keys(obj)?",
        options: ["Identic", "ownKeys include și Symbol-keys și non-enumerable, Object.keys nu", "Object.keys include mai mult", "Nu există diferență practică"],
        answer: "ownKeys include și Symbol-keys și non-enumerable, Object.keys nu",
        explanation: "Reflect.ownKeys = String keys + Symbol keys (toate). Object.keys = doar string enumerable keys.", difficulty: "hard"
      },
      {
        number: 13, name: "Proxy schema validare", question: "Extinde proxy-ul de validare să verifice tipul pentru orice proprietate dintr-un schema object.",
        type: "coding", language: "javascript",
        starterCode: "function createSchemaProxy(schema) {\n  return new Proxy({}, {\n    set(target, prop, value) {\n      if (prop in schema && typeof value !== schema[prop]) {\n        throw new TypeError(`${prop} trebuie ${schema[prop]}, primit ${typeof value}`);\n      }\n      target[prop] = value;\n      return true;\n    },\n  });\n}\n\nconst user = createSchemaProxy({ name: 'string', age: 'number', active: 'boolean' });\nuser.name = 'Ana';  // ok\nuser.age = 25;      // ok\nuser.active = true; // ok\nconsole.log(user.name, user.age);\n\ntry {\n  user.age = '25'; // TypeError\n} catch(e) {\n  console.log(e.message);\n}",
        options: [], answer: "", explanation: "Verifici 'prop in schema' și typeof value !== schema[prop]. Flexibil pentru orice schemă.", difficulty: "medium", expectedOutput: "Ana 25"
      },
      {
        number: 14, name: "apply trap pe funcție", question: "Ce trap activezi pentru a intercepta apelul unei funcții prin Proxy?",
        options: ["get", "set", "apply", "call"],
        answer: "apply",
        explanation: "Trap-ul 'apply' interceptează fn() și new fn() (cu 'construct'). apply(target, thisArg, args).", difficulty: "hard"
      },
      {
        number: 15, name: "Proxy counter accese", question: "Creează un proxy care numără de câte ori e accesată fiecare proprietate a unui obiect.",
        type: "coding", language: "javascript",
        starterCode: "function createAccessCounter(obj) {\n  const counts = {};\n  const proxy = new Proxy(obj, {\n    get(target, prop) {\n      if (typeof prop === 'string') {\n        counts[prop] = (counts[prop] || 0) + 1;\n      }\n      return Reflect.get(target, prop);\n    },\n  });\n  return { proxy, counts };\n}\n\nconst { proxy: user, counts } = createAccessCounter({ name: 'Ana', age: 25 });\nuser.name; user.name; user.age;\nconsole.log(counts); // { name: 2, age: 1 }",
        options: [], answer: "", explanation: "Menții un obiect counts separat. La fiecare get, incrementezi counts[prop] și returnezi valoarea normală.", difficulty: "medium", expectedOutput: '{"name":2,"age":1}'
      },
    ],
  },
  {
    slug: "regex-js",
    title: "29. Regular Expressions (RegEx)",
    order: 29,
    theory: [
      { order: 1, title: "Sintaxă de bază — creare și testare", content: "```javascript\n// Creare:\nconst re1 = /hello/;          // literal\nconst re2 = new RegExp('hello'); // constructor\n\n// Metode:\nre1.test('hello world');  // true — există?\nre1.exec('hello world');  // ['hello', index:0, ...]\n\n// String methods cu regex:\n'hello world'.match(/hello/);  // ['hello', ...]\n'a1b2c3'.replace(/[0-9]/g, '-'); // 'a-b-c-'\n'a,b,,c'.split(/,+/);           // ['a', 'b', 'c']\n'hello world'.search(/world/);  // 6 (index)\n\n// Flags:\n// i — case insensitive\n// g — global (toate match-urile)\n// m — multiline\n// s — dotAll (. include \\n)\n```" },
      { order: 2, title: "Caractere speciale și clase", content: "```javascript\n// Clase de caractere:\n/[abc]/    // a sau b sau c\n/[a-z]/    // orice literă mică\n/[A-Za-z0-9]/ // alfanumeric\n/[^abc]/   // orice EXCEPTÂND a, b, c\n\n// Shorthand-uri:\n/\\d/  // cifră [0-9]\n/\\w/  // word char [a-zA-Z0-9_]\n/\\s/  // whitespace (spațiu, tab, \\n)\n/\\D/  // NON-cifră\n/\\W/  // NON-word\n/\\S/  // NON-whitespace\n\n// Ancore:\n/^abc/   // la ÎNCEPUT\n/abc$/   // la SFÂRȘIT\n/^abc$/  // exact 'abc' (nimic altceva)\n\n// Punct:\n/./   // orice caracter (mai puțin \\n)\n```" },
      { order: 3, title: "Quantifiers și grupuri", content: "```javascript\n// Cantitate:\n/a*/    // 0 sau mai multe\n/a+/    // 1 sau mai multe\n/a?/    // 0 sau 1\n/a{3}/  // exact 3\n/a{2,5}/  // între 2 și 5\n/a{2,}/   // minim 2\n\n// Grupuri:\n/(ab)+/    // grupul 'ab' repetat\n/(a|b)/    // 'a' sau 'b'\n\n// Capturing groups:\nconst match = '2025-01-15'.match(/(\\d{4})-(\\d{2})-(\\d{2})/);\nconsole.log(match[1]); // '2025' — primul grup\nconsole.log(match[2]); // '01'\nconsole.log(match[3]); // '15'\n\n// Named groups:\nconst m = '2025-01-15'.match(/(?<an>\\d{4})-(?<luna>\\d{2})-(?<zi>\\d{2})/);\nconsole.log(m.groups.an); // '2025'\n```" },
      { order: 4, title: "Pattern-uri practice comune", content: "```javascript\n// Validare email (simplificată):\nconst emailRe = /^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$/i;\nemailRe.test('ana@test.com'); // true\nemailRe.test('invalid');      // false\n\n// Extrage URL-uri din text:\nconst urlRe = /https?:\\/\\/[^\\s]+/g;\n'Visit https://google.com and https://github.com'\n  .match(urlRe); // ['https://google.com', 'https://github.com']\n\n// Replace cu funcție:\n'hello world'.replace(/\\b\\w/g, c => c.toUpperCase());\n// 'Hello World'\n\n// matchAll pentru toate match-urile cu grupuri:\nfor (const m of 'a1 b2 c3'.matchAll(/(\\w)(\\d)/g)) {\n  console.log(m[1], m[2]); // a 1, b 2, c 3\n}\n```" },
    ],
    tasks: [
      { number: 1, name: "test method", question: "Ce returnează /abc/.test('abcdef')?", options: ["'abc'", "true", "false", "0"], answer: "true", explanation: ".test() returnează true/false în funcție de dacă pattern-ul e găsit în string.", difficulty: "easy" },
      { number: 2, name: "Flag g", question: "Ce face flag-ul g în /pattern/g?", options: ["Case insensitive", "Caută toate match-urile, nu doar primul", "Multiline", "Greedy"], answer: "Caută toate match-urile, nu doar primul", explanation: "Flag-ul g (global) face ca replace/match să proceseze toate aparițiile, nu doar prima.", difficulty: "easy" },
      { number: 3, name: "\\d shorthand", question: "Ce match-uiește \\d?", options: ["Orice caracter", "Orice cifră [0-9]", "Orice literă", "Spații"], answer: "Orice cifră [0-9]", explanation: "\\d e shorthand pentru [0-9] — match-uiește orice cifră.", difficulty: "easy" },
      { number: 4, name: "Anchor start", question: "Ce face ^ în regex?", options: ["Negație", "Marcează începutul string-ului", "Marcează sfârșitul", "Orice caracter"], answer: "Marcează începutul string-ului", explanation: "^ e ancora de început — /^abc/ match-uiește doar dacă string-ul ÎNCEPE cu 'abc'.", difficulty: "medium" },
      { number: 5, name: "Quantifier +", question: "a+ înseamnă?", options: ["Exact 1 'a'", "0 sau mai multe 'a'", "1 sau mai multe 'a'", "0 sau 1 'a'"], answer: "1 sau mai multe 'a'", explanation: "+ înseamnă 'one or more'. * = zero or more. ? = zero or one.", difficulty: "easy" },
      { number: 6, name: "Capturing group", question: "Cum accesezi primul grup capturat dintr-un match?", options: ["match.group(1)", "match[0]", "match[1]", "match.groups[1]"], answer: "match[1]", explanation: "match[0] e match-ul complet. match[1] e primul grup capturat (), match[2] al doilea etc.", difficulty: "medium" },
      { number: 7, name: "Named groups", question: "Cum declari un named group 'an' în regex?", options: ["/(?an>\\d{4})/", "/(?<an>\\d{4})/", "/(an:\\d{4})/", "/(<an>\\d{4})/"], answer: "/(?<an>\\d{4})/", explanation: "Named groups folosesc sintaxa (?<name>pattern). Accesibile prin match.groups.name.", difficulty: "hard" },
      {
        number: 8, name: "Extrage numere", question: "Extrage toate numerele dintr-un string și returnează-le ca array de numere.",
        type: "coding", language: "javascript",
        starterCode: "function extractNumbers(str) {\n  const matches = str.match(/\\d+/g);\n  return matches ? matches.map(Number) : [];\n}\n\nconsole.log(extractNumbers('am 3 mere și 12 pere')); // [3, 12]\nconsole.log(extractNumbers('nimic'));                 // []\nconsole.log(extractNumbers('x1y22z333'));             // [1, 22, 333]",
        options: [], answer: "", explanation: "\\d+ match-uiește secvențe de cifre. Flag g pentru toate. matches.map(Number) converteste string→number.", difficulty: "easy", expectedOutput: "[3,12]"
      },
      {
        number: 9, name: "Validare email simplu", question: "Scrie o funcție isValidEmail(email) care returnează true dacă string-ul pare un email valid (format simplu: ceva@ceva.domeniu).",
        type: "coding", language: "javascript",
        starterCode: "function isValidEmail(email) {\n  return /^[\\w.+-]+@[\\w-]+\\.[a-z]{2,}$/i.test(email);\n}\n\nconsole.log(isValidEmail('ana@test.com'));    // true\nconsole.log(isValidEmail('ion@firma.ro'));    // true\nconsole.log(isValidEmail('invalid'));         // false\nconsole.log(isValidEmail('lipseste@'));       // false",
        options: [], answer: "", explanation: "Regex: ^[\\w.+-]+ = username, @, [\\w-]+ = domeniu, \\. = punct, [a-z]{2,}$ = TLD.", difficulty: "medium", expectedOutput: "true"
      },
      {
        number: 10, name: "Replace cu funcție", question: "Capitalizează primul caracter al fiecărui cuvânt din string (Title Case).",
        type: "coding", language: "javascript",
        starterCode: "function toTitleCase(str) {\n  return str.replace(/\\b\\w/g, c => c.toUpperCase());\n}\n\nconsole.log(toTitleCase('hello world'));     // 'Hello World'\nconsole.log(toTitleCase('ana are mere'));    // 'Ana Are Mere'\nconsole.log(toTitleCase('javascript is fun')); // 'Javascript Is Fun'",
        options: [], answer: "", explanation: "\\b = word boundary, \\w = primul caracter al cuvântului. Replace cu funcție care face toUpperCase.", difficulty: "easy", expectedOutput: "Hello World"
      },
      {
        number: 11, name: "Extrage data", question: "Extrage ziua, luna și anul dintr-un string de tipul 'dd/mm/yyyy' folosind named groups.",
        type: "coding", language: "javascript",
        starterCode: "function parseDate(str) {\n  const m = str.match(/(?<zi>\\d{2})\\/(?<luna>\\d{2})\\/(?<an>\\d{4})/);\n  if (!m) return null;\n  return { zi: m.groups.zi, luna: m.groups.luna, an: m.groups.an };\n}\n\nconsole.log(parseDate('15/01/2025')); // { zi: '15', luna: '01', an: '2025' }\nconsole.log(parseDate('invalid'));    // null",
        options: [], answer: "", explanation: "Named groups (?<name>pattern) stocate în match.groups. Verifici că match există înainte de .groups.", difficulty: "medium", expectedOutput: '{"zi":"15","luna":"01","an":"2025"}'
      },
      { number: 12, name: "Flag i", question: "Ce face /hello/i.test('HELLO')?", options: ["false — case sensitive", "true — flag i = case insensitive", "Eroare", "undefined"], answer: "true — flag i = case insensitive", explanation: "Flag-ul i face regex case insensitive. /hello/i match-uiește 'hello', 'HELLO', 'Hello' etc.", difficulty: "easy" },
      {
        number: 13, name: "Înlocuiește spații", question: "Înlocuiește toate spațiile multiple (2 sau mai multe) dintr-un string cu un singur spațiu.",
        type: "coding", language: "javascript",
        starterCode: "function normalizeSpaces(str) {\n  return str.replace(/\\s{2,}/g, ' ').trim();\n}\n\nconsole.log(normalizeSpaces('ana   are   mere'));    // 'ana are mere'\nconsole.log(normalizeSpaces('  hello   world  '));  // 'hello world'",
        options: [], answer: "", explanation: "\\s{2,} match-uiește 2+ whitespace-uri. g pentru toate aparițiile. trim() elimină spații de la capete.", difficulty: "easy", expectedOutput: "ana are mere"
      },
      { number: 14, name: "Non-greedy", question: "Care e diferența dintre /a.+b/ și /a.+?b/ aplicat pe 'aXXbYYb'?", options: ["Identice", "/a.+b/ match 'aXXbYYb' (greedy), /a.+?b/ match 'aXXb' (non-greedy)", "/a.+?b/ e mai rapid", "/a.+b/ aruncă eroare"], answer: "/a.+b/ match 'aXXbYYb' (greedy), /a.+?b/ match 'aXXb' (non-greedy)", explanation: "+ e greedy (ia cât mai mult). +? e lazy/non-greedy (ia cât mai puțin). Important la parsare HTML/JSON.", difficulty: "hard" },
      {
        number: 15, name: "Validare parolă", question: "Scrie isStrongPassword(pwd): returnează true dacă parola are minim 8 caractere, cel puțin o literă mare, o literă mică și o cifră.",
        type: "coding", language: "javascript",
        starterCode: "function isStrongPassword(pwd) {\n  return pwd.length >= 8 &&\n    /[A-Z]/.test(pwd) &&\n    /[a-z]/.test(pwd) &&\n    /[0-9]/.test(pwd);\n}\n\nconsole.log(isStrongPassword('Parola1!'));  // true\nconsole.log(isStrongPassword('parola1!'));  // false (fără majusculă)\nconsole.log(isStrongPassword('PAROLA1!'));  // false (fără minusculă)\nconsole.log(isStrongPassword('Parola!'));   // false (fără cifră)\nconsole.log(isStrongPassword('Pa1'));       // false (prea scurtă)",
        options: [], answer: "", explanation: "Verifici separat fiecare condiție cu test(). Alternativ un singur regex complicat cu lookaheads.", difficulty: "medium", expectedOutput: "true"
      },
    ],
  },
  {
    slug: "generators-iterators",
    title: "30. Generators și Iterators",
    order: 30,
    theory: [
      { order: 1, title: "Iterator protocol", content: "Un **iterator** e un obiect cu metoda `next()` care returnează `{ value, done }`:\n\n```javascript\nfunction creeazaRange(start, end) {\n  let current = start;\n  return {\n    next() {\n      if (current <= end) {\n        return { value: current++, done: false };\n      }\n      return { value: undefined, done: true };\n    },\n    [Symbol.iterator]() { return this; },\n  };\n}\n\nconst range = creeazaRange(1, 5);\nfor (const n of range) {\n  console.log(n); // 1, 2, 3, 4, 5\n}\nconsole.log([...range]); // [1, 2, 3, 4, 5]\n```" },
      { order: 2, title: "Generator functions — function*", content: "```javascript\n// Generator = funcție care poate fi pausată:\nfunction* numere() {\n  console.log('start');\n  yield 1;           // pauză, returnează 1\n  console.log('după 1');\n  yield 2;           // pauză, returnează 2\n  yield 3;\n  console.log('terminat');\n}\n\nconst gen = numere();\nconsole.log(gen.next()); // 'start' → { value: 1, done: false }\nconsole.log(gen.next()); // 'după 1' → { value: 2, done: false }\nconsole.log(gen.next()); // { value: 3, done: false }\nconsole.log(gen.next()); // 'terminat' → { value: undefined, done: true }\n\n// Sau mai simplu:\nfor (const n of numere()) console.log(n);\n// [...numere()] → [1, 2, 3]\n```" },
      { order: 3, title: "yield* și generatori recursivi", content: "```javascript\n// yield* deleagă la alt iterable:\nfunction* abc() {\n  yield 'a';\n  yield* ['b', 'c']; // delega la array\n  yield 'd';\n}\nconsole.log([...abc()]); // ['a', 'b', 'c', 'd']\n\n// Generator infinit:\nfunction* idGenerator() {\n  let id = 1;\n  while (true) {\n    yield id++; // infinit, dar lazy!\n  }\n}\n\nconst ids = idGenerator();\nconsole.log(ids.next().value); // 1\nconsole.log(ids.next().value); // 2\n\n// Ia primele 5:\nfunction take(gen, n) {\n  const result = [];\n  for (const val of gen) {\n    result.push(val);\n    if (result.length === n) break;\n  }\n  return result;\n}\ntake(idGenerator(), 5); // [1, 2, 3, 4, 5]\n```" },
      { order: 4, title: "Async generators — yield + await", content: "```javascript\n// Async generator — combină async cu yield:\nasync function* paginateAPI(url) {\n  let page = 1;\n  while (true) {\n    const res = await fetch(`${url}?page=${page}`);\n    const data = await res.json();\n    if (!data.items.length) return;\n    yield data.items;\n    page++;\n  }\n}\n\n// Consumare cu for await...of:\nasync function main() {\n  for await (const items of paginateAPI('/api/posts')) {\n    console.log('Pagina:', items);\n    // procesezi fiecare pagină pe rând, lazy!\n  }\n}\n```" },
    ],
    tasks: [
      { number: 1, name: "Generator syntax", question: "Cum declari o generator function?", options: ["function gen(){}", "function* gen(){}", "async function gen(){}", "function gen*(){}"], answer: "function* gen(){}", explanation: "Generator functions folosesc sintaxa function* (asterisc după function). Pot folosi yield.", difficulty: "easy" },
      { number: 2, name: "yield", question: "Ce face yield într-un generator?", options: ["Termină generatorul", "Pauzeaza execuția și returnează o valoare", "Aruncă o eroare", "Sare la următori yield"], answer: "Pauzeaza execuția și returnează o valoare", explanation: "yield pauzeaza generatorul și returnează valoarea ca { value, done: false }. Execuția continuă la next().", difficulty: "easy" },
      { number: 3, name: "next() return", question: "Ce returnează gen.next() când generatorul nu a terminat?", options: ["Valoarea direct", "{ value: ..., done: false }", "{ value: ..., done: true }", "Promise"], answer: "{ value: ..., done: false }", explanation: "next() returnează { value, done }. done e false cât generatorul mai are yield-uri.", difficulty: "easy" },
      { number: 4, name: "Iterator protocol", question: "Ce metodă trebuie să aibă un iterator?", options: [".get()", ".next()", ".value()", ".iterate()"], answer: ".next()", explanation: "Iterator protocol cere metoda next() care returnează { value, done }.", difficulty: "medium" },
      { number: 5, name: "Generator infinit", question: "Un generator cu while(true) și yield e periculos?", options: ["Da, blochează browserul", "Nu — e lazy, execuți câte un yield la un moment", "Da, consumă toată memoria", "Depinde de browser"], answer: "Nu — e lazy, execuți câte un yield la un moment", explanation: "Generatoarele sunt lazy — codul rulează doar când apelezi next(). Un while(true) e sigur.", difficulty: "medium" },
      { number: 6, name: "yield*", question: "Ce face yield* în generator?", options: ["Yield de două ori", "Deleagă la alt iterable (yield fiecare element)", "Yield async", "Return forțat"], answer: "Deleagă la alt iterable (yield fiecare element)", explanation: "yield* iterează prin alt iterable și yield-uiește fiecare element al lui.", difficulty: "medium" },
      { number: 7, name: "Symbol.iterator", question: "Ce face [Symbol.iterator]() { return this; } pe un obiect?", options: ["Îl distruge", "Îl face iterabil cu for...of și spread", "Îl transformă în array", "E un bug"], answer: "Îl face iterabil cu for...of și spread", explanation: "Symbol.iterator definește protocolul iterabil. Dacă returnezi this (și ai next()), obiectul e iterabil.", difficulty: "hard" },
      {
        number: 8, name: "Range generator", question: "Scrie un generator range(start, end, step=1) care produce numere de la start la end cu pasul step.",
        type: "coding", language: "javascript",
        starterCode: "function* range(start, end, step = 1) {\n  for (let i = start; i <= end; i += step) {\n    yield i;\n  }\n}\n\nconsole.log([...range(1, 5)]);      // [1, 2, 3, 4, 5]\nconsole.log([...range(0, 10, 2)]);  // [0, 2, 4, 6, 8, 10]\nconsole.log([...range(5, 5)]);      // [5]",
        options: [], answer: "", explanation: "Bucla for cu yield — generatorul e pausat la fiecare yield și reia de unde a rămas.", difficulty: "easy", expectedOutput: "[1,2,3,4,5]"
      },
      {
        number: 9, name: "Fibonacci generator", question: "Implementează un generator infinit fibonacci() care produce șirul Fibonacci: 0, 1, 1, 2, 3, 5, 8, ...",
        type: "coding", language: "javascript",
        starterCode: "function* fibonacci() {\n  let [a, b] = [0, 1];\n  while (true) {\n    yield a;\n    [a, b] = [b, a + b];\n  }\n}\n\nconst fib = fibonacci();\nconst primele10 = [];\nfor (let i = 0; i < 10; i++) primele10.push(fib.next().value);\nconsole.log(primele10); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]",
        options: [], answer: "", explanation: "Destructurare simultană [a, b] = [b, a+b] actualizează amândouă variabile fără temp.", difficulty: "medium", expectedOutput: "[0,1,1,2,3,5,8,13,21,34]"
      },
      {
        number: 10, name: "Take helper", question: "Scrie funcția take(iterable, n) care returnează un array cu primele n valori din orice iterable (array, generator, etc.).",
        type: "coding", language: "javascript",
        starterCode: "function take(iterable, n) {\n  const result = [];\n  for (const val of iterable) {\n    result.push(val);\n    if (result.length === n) break;\n  }\n  return result;\n}\n\nfunction* naturals() { let n = 1; while(true) yield n++; }\n\nconsole.log(take(naturals(), 5));   // [1, 2, 3, 4, 5]\nconsole.log(take([10,20,30], 2));   // [10, 20]",
        options: [], answer: "", explanation: "for...of funcționează cu orice iterable. break oprește iterarea fără a consuma tot generator-ul infinit.", difficulty: "medium", expectedOutput: "[1,2,3,4,5]"
      },
      {
        number: 11, name: "Generator map", question: "Implementează un generator map*(iterable, fn) care aplică fn pe fiecare element, lazy.",
        type: "coding", language: "javascript",
        starterCode: "function* mapGen(iterable, fn) {\n  for (const val of iterable) {\n    yield fn(val);\n  }\n}\n\nconst doubled = mapGen([1, 2, 3, 4, 5], x => x * 2);\nconsole.log([...doubled]); // [2, 4, 6, 8, 10]\n\n// Funcționează și cu generator infinit + take:\nfunction* naturals() { let n = 1; while(true) yield n++; }\nconst squares = mapGen(naturals(), x => x * x);\nconst first5 = [];\nfor (let i = 0; i < 5; i++) first5.push(squares.next().value);\nconsole.log(first5); // [1, 4, 9, 16, 25]",
        options: [], answer: "", explanation: "Generator lazy: produce valori doar când e consumat. Compozabil cu alți generatori.", difficulty: "medium", expectedOutput: "[2,4,6,8,10]"
      },
      { number: 12, name: "Generator return", question: "Ce returnează gen.next() după ce generatorul a terminat (nu mai sunt yield-uri)?", options: ["Eroare", "{ value: undefined, done: true }", "null", "{ value: null, done: true }"], answer: "{ value: undefined, done: true }", explanation: "Când generatorul termină, next() returnează { value: undefined, done: true } pentru orice apel ulterior.", difficulty: "easy" },
      {
        number: 13, name: "Flatten cu generator", question: "Implementează un generator flatten(arr) care 'aplatizează' un array nested de adâncime 1.",
        type: "coding", language: "javascript",
        starterCode: "function* flatten(arr) {\n  for (const item of arr) {\n    if (Array.isArray(item)) {\n      yield* item;\n    } else {\n      yield item;\n    }\n  }\n}\n\nconsole.log([...flatten([1, [2, 3], 4, [5, 6]])]); // [1, 2, 3, 4, 5, 6]\nconsole.log([...flatten([1, 2, 3])]);               // [1, 2, 3]",
        options: [], answer: "", explanation: "yield* item deleagă la sub-array. yield item pentru valori simple.", difficulty: "medium", expectedOutput: "[1,2,3,4,5,6]"
      },
      { number: 14, name: "for...of pe generator", question: "Poți folosi for...of direct pe un generator?", options: ["Nu, trebuie să apelezi next() manual", "Da — generatoarele implementează Symbol.iterator", "Doar cu [...gen]", "Nu, generatoarele nu sunt iterabile"], answer: "Da — generatoarele implementează Symbol.iterator", explanation: "Generatoarele sunt atât iterator cât și iterable. for...of, spread [...gen], și destructurare funcționează direct.", difficulty: "medium" },
      {
        number: 15, name: "ID generator unic", question: "Implementează un generator makeId(prefix) care produce ID-uri unice: 'prefix-1', 'prefix-2', etc.",
        type: "coding", language: "javascript",
        starterCode: "function* makeId(prefix = 'id') {\n  let n = 1;\n  while (true) {\n    yield `${prefix}-${n++}`;\n  }\n}\n\nconst userId = makeId('user');\nconsole.log(userId.next().value); // 'user-1'\nconsole.log(userId.next().value); // 'user-2'\nconsole.log(userId.next().value); // 'user-3'\n\nconst postId = makeId('post');\nconsole.log(postId.next().value); // 'post-1'",
        options: [], answer: "", explanation: "Generator infinit cu prefix capturat. Fiecare apel al makeId() are propriul contor n.", difficulty: "easy", expectedOutput: "user-1"
      },
    ],
  },
  {
    slug: "error-handling-avansat",
    title: "31. Error Handling avansat",
    order: 31,
    theory: [
      { order: 1, title: "Tipuri de erori și custom errors", content: "```javascript\n// Tipuri de erori built-in:\n// Error, TypeError, ReferenceError, SyntaxError,\n// RangeError, URIError, EvalError\n\n// Error custom:\nclass ValidationError extends Error {\n  constructor(field, message) {\n    super(message);\n    this.name = 'ValidationError';\n    this.field = field;\n  }\n}\n\nclass NotFoundError extends Error {\n  constructor(resource) {\n    super(`${resource} nu a fost găsit`);\n    this.name = 'NotFoundError';\n    this.statusCode = 404;\n  }\n}\n\ntry {\n  throw new ValidationError('email', 'Email invalid');\n} catch (e) {\n  if (e instanceof ValidationError) {\n    console.log(`Câmpul ${e.field}: ${e.message}`);\n  } else {\n    throw e; // re-throw alte erori\n  }\n}\n```" },
      { order: 2, title: "Error handling în Promises", content: "```javascript\n// .catch() pentru promises:\nfetch('/api/data')\n  .then(res => {\n    if (!res.ok) throw new Error(`HTTP ${res.status}`);\n    return res.json();\n  })\n  .then(data => console.log(data))\n  .catch(err => console.error('Eroare:', err))\n  .finally(() => console.log('Întotdeauna rulează'));\n\n// async/await cu try/catch:\nasync function getData() {\n  try {\n    const res = await fetch('/api/data');\n    if (!res.ok) throw new Error(`HTTP ${res.status}`);\n    return await res.json();\n  } catch (err) {\n    console.error(err);\n    return null; // fallback\n  } finally {\n    console.log('Cleanup');\n  }\n}\n\n// Promise.allSettled — nu se oprește la eroare:\nconst results = await Promise.allSettled([p1, p2, p3]);\nresults.forEach(r => {\n  if (r.status === 'fulfilled') console.log(r.value);\n  else console.error(r.reason);\n});\n```" },
      { order: 3, title: "Global error handlers", content: "```javascript\n// Browser — capturare erori negestionate:\nwindow.addEventListener('error', (event) => {\n  console.error('Uncaught error:', event.error);\n  // Trimite la serviciu de monitoring (Sentry etc.)\n});\n\nwindow.addEventListener('unhandledrejection', (event) => {\n  console.error('Unhandled promise rejection:', event.reason);\n  event.preventDefault(); // previne log-ul default\n});\n\n// Node.js:\nprocess.on('uncaughtException', (err) => {\n  console.error('Uncaught:', err);\n  process.exit(1); // obligatoriu după uncaughtException!\n});\n\nprocess.on('unhandledRejection', (reason, promise) => {\n  console.error('Unhandled Rejection:', reason);\n});\n```" },
      { order: 4, title: "Error boundary pattern și retry", content: "```javascript\n// Retry cu exponential backoff:\nasync function withRetry(fn, maxRetries = 3, delay = 1000) {\n  for (let attempt = 0; attempt <= maxRetries; attempt++) {\n    try {\n      return await fn();\n    } catch (err) {\n      if (attempt === maxRetries) throw err;\n      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms`);\n      await new Promise(r => setTimeout(r, delay * Math.pow(2, attempt)));\n    }\n  }\n}\n\n// Result type pattern (fără exceptions):\nfunction safeDiv(a, b) {\n  if (b === 0) return { ok: false, error: 'Division by zero' };\n  return { ok: true, value: a / b };\n}\nconst { ok, value, error } = safeDiv(10, 0);\n```" },
    ],
    tasks: [
      { number: 1, name: "Custom error", question: "Cum creezi un custom error class?", options: ["new Error({name: 'Custom'})", "class Custom extends Error {}", "function CustomError(){}", "Error.create('Custom')"], answer: "class Custom extends Error {}", explanation: "Extinzi clasa Error și setezi this.name în constructor pentru un error personalizat.", difficulty: "medium" },
      { number: 2, name: "instanceof check", question: "De ce folosești instanceof în catch?", options: ["E mai rapid", "Să poți gestiona diferit tipuri diferite de erori", "E obligatoriu", "Performanță"], answer: "Să poți gestiona diferit tipuri diferite de erori", explanation: "instanceof permite branch-ing pe tipul erorii — ValidationError se gestionează diferit față de NetworkError.", difficulty: "medium" },
      { number: 3, name: "finally", question: "Când rulează blocul finally?", options: ["Doar dacă nu e eroare", "Doar dacă e eroare", "Întotdeauna, indiferent de erori", "Niciodată în async"], answer: "Întotdeauna, indiferent de erori", explanation: "finally rulează mereu — fie că try a reușit, fie că catch a prins o eroare. Ideal pentru cleanup.", difficulty: "easy" },
      { number: 4, name: "Promise.allSettled", question: "Diferența dintre Promise.all și Promise.allSettled?", options: ["Nicio diferență", "allSettled nu se oprește dacă o promisiune eșuează", "all e mai nou", "allSettled e mai rapid"], answer: "allSettled nu se oprește dacă o promisiune eșuează", explanation: "Promise.all se oprește la primul reject. allSettled așteaptă toate și returnează status+value/reason pentru fiecare.", difficulty: "medium" },
      { number: 5, name: "Re-throw", question: "De ce faci re-throw după un catch selectiv?", options: ["E un bug", "Ca alte erori (negestionate) să se propageze normal", "E mai performant", "Pentru logging"], answer: "Ca alte erori (negestionate) să se propageze normal", explanation: "Dacă gestionezi doar ValidationError, alte erori (TypeError, NetworkError) trebuie re-thrown pentru a nu fi înghițite.", difficulty: "medium" },
      {
        number: 6, name: "Custom error class", question: "Scrie o clasă AppError care extinde Error și adaugă câmpurile code (string) și statusCode (number). Testează cu un throw.",
        type: "coding", language: "javascript",
        starterCode: "class AppError extends Error {\n  constructor(message, code, statusCode = 500) {\n    super(message);\n    this.name = 'AppError';\n    this.code = code;\n    this.statusCode = statusCode;\n  }\n}\n\ntry {\n  throw new AppError('User not found', 'NOT_FOUND', 404);\n} catch (e) {\n  console.log(e.message);    // 'User not found'\n  console.log(e.code);       // 'NOT_FOUND'\n  console.log(e.statusCode); // 404\n  console.log(e instanceof AppError); // true\n  console.log(e instanceof Error);    // true\n}",
        options: [], answer: "", explanation: "super(message) inițializează Error-ul. Câmpurile extra sunt pe this. instanceof funcționează pe lanțul de prototipuri.", difficulty: "medium", expectedOutput: "User not found"
      },
      { number: 7, name: "error.message", question: "Cum accesezi mesajul unei erori în catch?", options: ["e.text", "e.description", "e.message", "e.toString()"], answer: "e.message", explanation: "Error.prototype.message stochează string-ul pasat la constructor. e.name = tipul, e.stack = stack trace.", difficulty: "easy" },
      {
        number: 8, name: "Try-catch async", question: "Scrie o funcție fetchUser(id) care face fetch simulat (poate eșua) cu try/catch și returnează user-ul sau null la eroare.",
        type: "coding", language: "javascript",
        starterCode: "async function fetchUser(id) {\n  try {\n    // simulăm fetch - aruncă eroare dacă id < 0\n    if (id < 0) throw new Error('Invalid ID');\n    return { id, name: `User ${id}` };\n  } catch (err) {\n    console.error('fetchUser error:', err.message);\n    return null;\n  }\n}\n\nasync function main() {\n  const u1 = await fetchUser(1);\n  console.log(u1); // { id: 1, name: 'User 1' }\n  \n  const u2 = await fetchUser(-1);\n  console.log(u2); // null\n}\n\nmain();",
        options: [], answer: "", explanation: "try/catch în funcții async prinde și erorile din await. Returnezi null ca fallback sigur.", difficulty: "easy", expectedOutput: ""
      },
      {
        number: 9, name: "Result type", question: "Implementează safeParseJSON(str) care returnează { ok: true, value } sau { ok: false, error } fără a arunca excepții.",
        type: "coding", language: "javascript",
        starterCode: "function safeParseJSON(str) {\n  try {\n    return { ok: true, value: JSON.parse(str) };\n  } catch (e) {\n    return { ok: false, error: e.message };\n  }\n}\n\nconst r1 = safeParseJSON('{\"name\":\"Ana\"}');\nconsole.log(r1.ok, r1.value); // true { name: 'Ana' }\n\nconst r2 = safeParseJSON('invalid json');\nconsole.log(r2.ok, r2.error); // false 'Unexpected token...'",
        options: [], answer: "", explanation: "Result type pattern evită exceptions propagate. Callerul verifică .ok înainte de a folosi .value.", difficulty: "medium", expectedOutput: "true"
      },
      {
        number: 10, name: "Error în chain", question: "Ce se întâmplă dacă arunci o eroare în .then() și există un .catch() la final?",
        options: ["Eroarea e ignorată", ".catch() o prinde", "Promise devine undefined", "Eroarea omoară procesul"],
        answer: ".catch() o prinde",
        explanation: ".catch() la final prinde erorile din orice .then() anterior din lanț — inclusiv throw-uri.", difficulty: "medium"
      },
      {
        number: 11, name: "Retry logic", question: "Implementează retry(fn, times) care apelează fn de maxim 'times' ori și returnează primul succes. Aruncă ultima eroare dacă toate eșuează.",
        type: "coding", language: "javascript",
        starterCode: "function retry(fn, times) {\n  let lastError;\n  for (let i = 0; i < times; i++) {\n    try {\n      return fn();\n    } catch (e) {\n      lastError = e;\n    }\n  }\n  throw lastError;\n}\n\nlet attempts = 0;\nconst result = retry(() => {\n  attempts++;\n  if (attempts < 3) throw new Error(`Fail ${attempts}`);\n  return 'succes';\n}, 5);\nconsole.log(result);   // 'succes'\nconsole.log(attempts); // 3",
        options: [], answer: "", explanation: "Loop de times ori. La succes returnezi imediat. La final throw lastError pentru ultimul eșec.", difficulty: "medium", expectedOutput: "succes"
      },
      { number: 12, name: "RangeError", question: "new Array(-1) aruncă ce tip de eroare?", options: ["TypeError", "RangeError", "ValueError", "SyntaxError"], answer: "RangeError", explanation: "RangeError apare când o valoare e în afara intervalului permis — ca dimensiuni negative pentru Array.", difficulty: "medium" },
      {
        number: 13, name: "Multiple error types", question: "Scrie un handler care diferențiază ValidationError de NetworkError și le gestionează diferit.",
        type: "coding", language: "javascript",
        starterCode: "class ValidationError extends Error {\n  constructor(msg) { super(msg); this.name = 'ValidationError'; }\n}\nclass NetworkError extends Error {\n  constructor(msg) { super(msg); this.name = 'NetworkError'; }\n}\n\nfunction handle(err) {\n  if (err instanceof ValidationError) {\n    console.log('Validare:', err.message);\n  } else if (err instanceof NetworkError) {\n    console.log('Rețea:', err.message);\n  } else {\n    throw err; // re-throw necunoscute\n  }\n}\n\nhandle(new ValidationError('Email invalid')); // Validare: Email invalid\nhandle(new NetworkError('Timeout'));          // Rețea: Timeout",
        options: [], answer: "", explanation: "instanceof verifică tipul. Re-throw pentru erori necunoscute — nu le 'înghiți'.", difficulty: "medium", expectedOutput: "Validare: Email invalid"
      },
      { number: 14, name: "Error.prototype.stack", question: "Ce conține error.stack?", options: ["Lista de apeluri care au dus la eroare", "Memoria ocupată", "Numărul de erori anterioare", "Cod HTML"], answer: "Lista de apeluri care au dus la eroare", explanation: "error.stack e un string cu stack trace-ul — numele funcțiilor și liniile de cod care au dus la eroare.", difficulty: "easy" },
      {
        number: 15, name: "Finally cleanup", question: "Scrie o funcție withResource(fn) care 'deschide' o resursă, apelează fn cu ea și garantează că resursele sunt eliberate chiar dacă fn aruncă eroare.",
        type: "coding", language: "javascript",
        starterCode: "function withResource(fn) {\n  const resource = { open: true, data: 'date importante' };\n  console.log('Resursă deschisă');\n  try {\n    return fn(resource);\n  } finally {\n    resource.open = false;\n    console.log('Resursă eliberată');\n  }\n}\n\n// Funcționează normal:\nconst result = withResource(r => r.data);\nconsole.log(result); // 'date importante'\n\n// Funcționează și la eroare:\ntry {\n  withResource(r => { throw new Error('ceva'); });\n} catch(e) {\n  console.log('Eroare prinsă:', e.message);\n}\n// 'Resursă eliberată' se afișează în ambele cazuri!",
        options: [], answer: "", explanation: "finally garantează cleanup indiferent de succes/eroare — pattern esențial pentru resurse (DB, fișiere, locks).", difficulty: "medium", expectedOutput: "Resurs"
      },
    ],
  },
  {
    slug: "typescript-basics",
    title: "32. TypeScript — Introducere și Basics",
    order: 32,
    theory: [
      { order: 1, title: "Ce este TypeScript și de ce?", content: "**TypeScript** = JavaScript + sistem de tipuri static, compilat la JS pur.\n\n```typescript\n// TypeScript — erori detectate LA COMPILARE:\nfunction aduna(a: number, b: number): number {\n  return a + b;\n}\n\naduna(1, 2);     // OK\naduna('1', 2);   // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'\naduna(1, 2, 3); // ❌ Error: Expected 2 arguments, but got 3\n\n// JavaScript — erori la RUNTIME sau behavior ciudat:\nfunction aduna(a, b) { return a + b; }\naduna('1', 2); // '12' — bug silențios!\n```\n\n**Beneficii:** autocomplete mai bun în IDE, refactoring sigur, documentație prin tipuri, mai puține bug-uri la runtime." },
      { order: 2, title: "Tipuri de bază și type inference", content: "```typescript\n// Tipuri primitive:\nlet name: string = 'Ana';\nlet age: number = 25;\nlet active: boolean = true;\n\n// Type inference — TS deduce automat:\nlet x = 42;      // TS știe că e number\nlet y = 'hello'; // string\n\n// Array-uri:\nlet nums: number[] = [1, 2, 3];\nlet strs: Array<string> = ['a', 'b'];\n\n// Tuple — array cu tipuri fixe per poziție:\nlet pair: [string, number] = ['Ana', 25];\n\n// Union types:\nlet id: string | number;\nid = 123;    // OK\nid = 'abc';  // OK\nid = true;   // ❌ Error\n\n// Literal types:\nlet direction: 'left' | 'right' | 'up' | 'down';\ndirection = 'left';  // OK\ndirection = 'diag';  // ❌ Error\n```" },
      { order: 3, title: "Interfaces și Types", content: "```typescript\n// Interface — definește forma unui obiect:\ninterface User {\n  id: number;\n  name: string;\n  email?: string;      // opțional cu ?\n  readonly role: string; // immutable\n}\n\n// Type alias — mai flexibil:\ntype Point = { x: number; y: number };\ntype ID = string | number;\ntype Status = 'active' | 'inactive' | 'banned';\n\n// Interface vs type:\n// Interface: extensibilă (merge declaration), extend cu extends\n// Type: poate fi union/intersection, nu merge declaration\n\ninterface Admin extends User {\n  adminLevel: number;\n}\n\n// Funcții tipizate:\nfunction getUser(id: number): User | null {\n  return null;\n}\n```" },
      { order: 4, title: "Generics și utility types", content: "```typescript\n// Generics — cod reutilizabil pentru orice tip:\nfunction primul<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\nprimul([1, 2, 3]);     // type: number\nprimul(['a', 'b']);    // type: string\n\n// Generic constrained:\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\n// Utility Types built-in:\ntype PartialUser = Partial<User>;         // toți opționali\ntype RequiredUser = Required<User>;       // toți obligatorii\ntype ReadonlyUser = Readonly<User>;       // toți readonly\ntype UserName = Pick<User, 'name'>;       // doar 'name'\ntype NoEmail = Omit<User, 'email'>;       // fără 'email'\ntype UserRecord = Record<string, User>;   // { [key: string]: User }\n```" },
    ],
    tasks: [
      { number: 1, name: "TS vs JS erori", question: "Când detectează TypeScript erorile de tip?", options: ["La runtime (ca JS)", "La compilare (înainte de rulare)", "Niciodată automat", "Doar în browser"], answer: "La compilare (înainte de rulare)", explanation: "TypeScript verifică tipurile la compilare — bug-urile sunt detectate în IDE, nu la rulare.", difficulty: "easy" },
      { number: 2, name: "Type inference", question: "Trebuie să specifici întotdeauna tipul în TS?", options: ["Da, mereu", "Nu, TS deduce tipul din valoare (type inference)", "Doar pentru funcții", "Doar pentru obiecte"], answer: "Nu, TS deduce tipul din valoare (type inference)", explanation: "let x = 42 — TS știe că x e number fără anotare. Inference funcționează pentru variabile inițializate.", difficulty: "easy" },
      { number: 3, name: "Optional property", question: "Cum marchezi o proprietate ca opțională în interface?", options: ["prop: optional string", "prop?: string", "prop: string?", "?prop: string"], answer: "prop?: string", explanation: "Semnul ? după numele proprietății o face opțională — poate fi string sau undefined.", difficulty: "easy" },
      { number: 4, name: "Union type", question: "Ce tip permite `let id: string | number`?", options: ["Doar string", "Doar number", "String sau number", "Orice valoare"], answer: "String sau number", explanation: "Union type (|) permite valori de oricare din tipurile specificate.", difficulty: "easy" },
      { number: 5, name: "Partial utility", question: "Ce face Partial<User>?", options: ["Șterge User", "Face toate proprietățile lui User opționale", "Face User readonly", "Copiază User"], answer: "Face toate proprietățile lui User opționale", explanation: "Partial<T> creează un tip nou cu toate proprietățile lui T marcate ca opționale (?)", difficulty: "medium" },
      { number: 6, name: "Generic syntax", question: "Cum declari o funcție generic în TS?", options: ["function f(T x){}", "function f<T>(x: T){}", "function<T> f(x){}", "generic function f(x){}"], answer: "function f<T>(x: T){}", explanation: "Generic-urile folosesc <T> (sau alt nume) după numele funcției, înainte de paranteze.", difficulty: "medium" },
      { number: 7, name: "readonly vs const", question: "Diferența dintre readonly pe o proprietate și const pentru o variabilă?", options: ["Sunt identice", "readonly e pentru proprietăți obiect, const pentru variabile", "const e mai strict", "Nu există diferență practică"], answer: "readonly e pentru proprietăți obiect, const pentru variabile", explanation: "const previne re-asignarea variabilei. readonly previne modificarea proprietății pe un obiect/interface.", difficulty: "medium" },
      { number: 8, name: "never type", question: "Când folosești tipul 'never' în TypeScript?", options: ["Pentru valori opționale", "Pentru funcții care niciodată nu returnează (throw mereu sau infinite loop)", "Pentru any value", "Pentru null"], answer: "Pentru funcții care niciodată nu returnează (throw mereu sau infinite loop)", explanation: "never = tipul valorii care nu poate exista. Funcții care întotdeauna aruncă erori sau infinite loops returnează never.", difficulty: "hard" },
      { number: 9, name: "keyof operator", question: "Ce face keyof User dacă User = { name: string; age: number }?", options: ["Returnează tipul valorilor", "Returnează union-ul cheilor: 'name' | 'age'", "Returnează numărul de chei", "Returnează arrayul de chei"], answer: "Returnează union-ul cheilor: 'name' | 'age'", explanation: "keyof T creează un union type cu toate cheile lui T — util pentru funcții generic safe.", difficulty: "hard" },
      { number: 10, name: "interface extends", question: "Cum extinzi un interface în TypeScript?", options: ["interface B implements A", "interface B extends A", "interface B : A", "interface B inherits A"], answer: "interface B extends A", explanation: "extends adaugă proprietățile lui A la B. B trebuie să includă toate câmpurile lui A plus cele noi.", difficulty: "easy" },
      { number: 11, name: "Pick utility", question: "Pick<User, 'name' | 'email'> creează ce tip?", options: ["User fără name și email", "Un tip cu DOAR name și email din User", "O copie a User", "Un array"], answer: "Un tip cu DOAR name și email din User", explanation: "Pick<T, K> selectează doar câmpurile K din T. Opus Omit<T, K> care le exclude.", difficulty: "medium" },
      { number: 12, name: "as operator", question: "Ce face 'value as string' în TypeScript?", options: ["Converteste la runtime", "Spune compilatorului să trateze valoarea ca string (type assertion)", "Aruncă eroare dacă nu e string", "Creeaza copie ca string"], answer: "Spune compilatorului să trateze valoarea ca string (type assertion)", explanation: "as este type assertion — îi spui TS-ului ce tip crezi că e. NU face conversie la runtime, poate fi periculos.", difficulty: "medium" },
      { number: 13, name: "Record utility", question: "Record<string, number> înseamnă?", options: ["Array de numere", "Obiect cu chei string și valori number", "Map<string, number>", "Tuple"], answer: "Obiect cu chei string și valori number", explanation: "Record<K, V> = { [key: K]: V }. Util pentru dicționare tipizate.", difficulty: "medium" },
      { number: 14, name: "Intersection type", question: "TypeA & TypeB în TypeScript înseamnă?", options: ["Tipul care e și TypeA și TypeB (toate proprietățile)", "Tipul care e fie TypeA fie TypeB", "Eroare de tip", "TypeA extins cu TypeB"], answer: "Tipul care e și TypeA și TypeB (toate proprietățile)", explanation: "Intersection (&) combină tipurile — obiectul trebuie să aibă TOATE proprietățile din ambele tipuri.", difficulty: "medium" },
      { number: 15, name: "Omit utility", question: "Omit<User, 'password'> e util când?", options: ["Vrei să faci password obligatoriu", "Creezi un tip User fără câmpul password (ex: pentru răspuns API)", "Ștergi câmpul din baza de date", "Criptezi password"], answer: "Creezi un tip User fără câmpul password (ex: pentru răspuns API)", explanation: "Omit<T, K> e perfect pentru tipuri derivate — ex: PublicUser = Omit<User, 'password' | 'token'>.", difficulty: "medium" },
    ],
  },
  {
    slug: "testing-jest",
    title: "33. Testing cu Jest — Basics",
    order: 33,
    theory: [
      { order: 1, title: "De ce testăm și ce este Jest?", content: "**Jest** e cel mai popular testing framework JavaScript (Facebook, React).\n\n```bash\nnpm install --save-dev jest\n```\n\n```javascript\n// math.js:\nexport function aduna(a, b) { return a + b; }\nexport function impart(a, b) {\n  if (b === 0) throw new Error('Division by zero');\n  return a / b;\n}\n\n// math.test.js:\nimport { aduna, impart } from './math';\n\ndescribe('Funcții matematice', () => {\n  test('aduna 2 + 2 = 4', () => {\n    expect(aduna(2, 2)).toBe(4);\n  });\n\n  test('impart la zero aruncă eroare', () => {\n    expect(() => impart(10, 0)).toThrow('Division by zero');\n  });\n});\n```" },
      { order: 2, title: "Matchers — toBe, toEqual, toMatch etc.", content: "```javascript\n// Egalitate:\nexpect(5).toBe(5);               // strict === (primitive)\nexpect({ a: 1 }).toEqual({ a: 1 }); // deep equality (obiecte)\nexpect(arr).not.toEqual([]);     // negare cu .not\n\n// Truthiness:\nexpect(null).toBeNull();\nexpect(undefined).toBeUndefined();\nexpect(0).toBeFalsy();\nexpect('x').toBeTruthy();\n\n// Numere:\nexpect(2 + 2).toBeGreaterThan(3);\nexpect(0.1 + 0.2).toBeCloseTo(0.3); // floating point!\n\n// Stringuri:\nexpect('hello world').toContain('world');\nexpect('hello').toMatch(/^hell/);\n\n// Array/Object:\nexpect([1, 2, 3]).toContain(2);\nexpect({ a: 1, b: 2 }).toMatchObject({ a: 1 }); // subset\n\n// Erori:\nexpect(() => fn()).toThrow();\nexpect(() => fn()).toThrow('mesaj');\n```" },
      { order: 3, title: "Async testing și mocks", content: "```javascript\n// Test async cu async/await:\ntest('fetch data', async () => {\n  const data = await fetchUser(1);\n  expect(data.name).toBe('Ana');\n});\n\n// Mock funcții:\nconst mockFn = jest.fn();\nmockFn('arg1');\nexpect(mockFn).toHaveBeenCalledWith('arg1');\nexpect(mockFn).toHaveBeenCalledTimes(1);\n\n// Mock return value:\nconst mockGet = jest.fn().mockResolvedValue({ name: 'Ana' });\n\n// Mock modul:\njest.mock('./api', () => ({\n  fetchUser: jest.fn().mockResolvedValue({ name: 'Ana' }),\n}));\n\n// spy — wrapper peste funcție reală:\nconst spy = jest.spyOn(console, 'log');\nconsole.log('test');\nexpect(spy).toHaveBeenCalledWith('test');\nspy.mockRestore();\n```" },
      { order: 4, title: "Setup, teardown și coverage", content: "```javascript\ndescribe('UserService', () => {\n  let db;\n\n  beforeAll(async () => {\n    db = await connectDB(); // ODATĂ înainte de toate testele\n  });\n\n  afterAll(async () => {\n    await db.close(); // ODATĂ după toate testele\n  });\n\n  beforeEach(() => {\n    db.clear(); // înainte de FIECARE test\n  });\n\n  afterEach(() => {\n    jest.clearAllMocks(); // după FIECARE test\n  });\n\n  test('creează user', async () => {\n    // ...\n  });\n});\n\n// Coverage:\n// npx jest --coverage\n// Raportează: Statements, Branches, Functions, Lines\n// Target bun: > 80% coverage\n```" },
    ],
    tasks: [
      { number: 1, name: "toBe vs toEqual", question: "Care matcher folosești pentru comparare deep de obiecte?", options: ["toBe", "toEqual", "toMatch", "toBeSame"], answer: "toEqual", explanation: "toBe folosește === (reference equality). toEqual face comparare deep (structurală), bun pentru obiecte/array-uri.", difficulty: "easy" },
      { number: 2, name: "not matcher", question: "Cum verifici că ceva NU e egal cu 5?", options: ["expect(x).isNot(5)", "expect(x).not.toBe(5)", "expect(x).notBe(5)", "!expect(x).toBe(5)"], answer: "expect(x).not.toBe(5)", explanation: ".not inversează orice matcher. expect(x).not.toBe(5) verifică că x !== 5.", difficulty: "easy" },
      { number: 3, name: "Async test", question: "Cum testezi o funcție async?", options: ["test('name', () => { ... })", "test('name', async () => { await ...; })", "asyncTest('name', () => {})", "test.async('name', () => {})"], answer: "test('name', async () => { await ...; })", explanation: "Funcția de test trebuie să fie async și să folosească await. Sau returnezi un Promise.", difficulty: "easy" },
      { number: 4, name: "jest.fn()", question: "Ce face jest.fn()?", options: ["Rulează toate testele", "Creează o funcție mock care trackează apelurile", "Importă un modul", "Face snapshot"], answer: "Creează o funcție mock care trackează apelurile", explanation: "jest.fn() creează un mock function — poți verifica dacă a fost apelat, cu ce argumente, de câte ori.", difficulty: "medium" },
      { number: 5, name: "beforeEach scop", question: "beforeEach rulează?", options: ["O singură dată înainte de toate testele", "Înainte de FIECARE test din describe", "Odată pe fișier", "La import"], answer: "Înainte de FIECARE test din describe", explanation: "beforeEach e pentru setup per-test — rulează înainte de fiecare it/test din blocul curent.", difficulty: "easy" },
      { number: 6, name: "toThrow", question: "Cum verifici că o funcție aruncă o eroare?", options: ["expect(fn()).toThrow()", "expect(() => fn()).toThrow()", "expect(fn).throws()", "try { fn() } catch { expect(true) }"], answer: "expect(() => fn()).toThrow()", explanation: "OBLIGATORIU: învelești funcția într-un arrow function. Altfel eroarea se propagă înainte ca expect să o prindă.", difficulty: "medium" },
      {
        number: 7, name: "Funcție pură testabilă", question: "Scrie funcția pură filterEven(arr) care returnează doar numerele pare. Testează-o manual cu assert simplu (fără Jest).",
        type: "coding", language: "javascript",
        starterCode: "function filterEven(arr) {\n  return arr.filter(n => n % 2 === 0);\n}\n\n// 'Teste' manuale:\nconst r1 = filterEven([1, 2, 3, 4, 5, 6]);\nconsole.log(JSON.stringify(r1) === '[2,4,6]' ? 'PASS' : 'FAIL'); // PASS\n\nconst r2 = filterEven([1, 3, 5]);\nconsole.log(r2.length === 0 ? 'PASS' : 'FAIL'); // PASS\n\nconst r3 = filterEven([]);\nconsole.log(r3.length === 0 ? 'PASS' : 'FAIL'); // PASS",
        options: [], answer: "", explanation: "Funcțiile pure (fără side effects, output determinat de input) sunt ușor de testat.", difficulty: "easy", expectedOutput: "PASS"
      },
      { number: 8, name: "toBeCloseTo", question: "De ce 0.1 + 0.2 necesită toBeCloseTo în loc de toBe(0.3)?", options: ["E un bug în Jest", "Floating point imprecision: 0.1+0.2 = 0.30000000000000004", "toBeCloseTo e mai rapid", "toBe nu funcționează cu numere"], answer: "Floating point imprecision: 0.1+0.2 = 0.30000000000000004", explanation: "IEEE 754 floating point are imprecizii. toBeCloseTo compară cu toleranță, evitând false failures.", difficulty: "medium" },
      {
        number: 9, name: "TDD ciclu", question: "Implementează suma(a, b) urmând TDD: mai întâi verifici că 2+2=4, apoi că 0+0=0, apoi că -1+1=0.",
        type: "coding", language: "javascript",
        starterCode: "// TDD: Scrie codul minim ca 'testele' să treacă\nfunction suma(a, b) {\n  return a + b;\n}\n\n// 'Teste' inline:\nconsole.log(suma(2, 2) === 4 ? 'PASS: 2+2' : 'FAIL: 2+2');\nconsole.log(suma(0, 0) === 0 ? 'PASS: 0+0' : 'FAIL: 0+0');\nconsole.log(suma(-1, 1) === 0 ? 'PASS: -1+1' : 'FAIL: -1+1');\nconsole.log(suma(-5, -3) === -8 ? 'PASS: -5+-3' : 'FAIL: -5+-3');",
        options: [], answer: "", explanation: "TDD: Red (test fail) → Green (cod minim) → Refactor. Funcțiile simple sunt ușor testate inline.", difficulty: "easy", expectedOutput: "PASS: 2+2"
      },
      { number: 10, name: "Spy vs Mock", question: "Diferența dintre jest.spyOn și jest.fn?", options: ["Identice", "spyOn wrappează o funcție EXISTENTĂ, fn creează una nouă", "fn e mai precis", "spyOn e deprecated"], answer: "spyOn wrappează o funcție EXISTENTĂ, fn creează una nouă", explanation: "jest.spyOn(obj, 'method') interceptează metoda reală, permitând și restaurarea ei. jest.fn() creează mock de la zero.", difficulty: "medium" },
      {
        number: 11, name: "Testare edge cases", question: "Scrie funcția divide(a, b) care returnează a/b sau aruncă Error('Cannot divide by zero'). Testează edge cases manual.",
        type: "coding", language: "javascript",
        starterCode: "function divide(a, b) {\n  if (b === 0) throw new Error('Cannot divide by zero');\n  return a / b;\n}\n\n// Edge cases:\nconsole.log(divide(10, 2) === 5 ? 'PASS' : 'FAIL');  // normal\nconsole.log(divide(0, 5) === 0 ? 'PASS' : 'FAIL');   // zero dividend\n\ntry {\n  divide(1, 0);\n  console.log('FAIL: ar trebui eroare');\n} catch(e) {\n  console.log(e.message === 'Cannot divide by zero' ? 'PASS: throws' : 'FAIL');\n}",
        options: [], answer: "", explanation: "Edge cases: zero dividend (ok), zero divisor (throw), numere normale. Testezi și calea de eroare.", difficulty: "medium", expectedOutput: "PASS"
      },
      { number: 12, name: "describe bloc", question: "La ce servește describe() în Jest?", options: ["Importă modulul de testat", "Grupează teste înrudite și izolează beforeEach/afterEach", "Rulează testele în paralel", "Definește mock-uri globale"], answer: "Grupează teste înrudite și izolează beforeEach/afterEach", explanation: "describe() creează un bloc de organizare. beforeEach/afterEach din interior afectează doar testele din acel describe.", difficulty: "easy" },
      {
        number: 13, name: "Funcție cu side effects testabilă", question: "Refactorizează logger-ul astfel încât să fie testabil (injectezi funcția de output).",
        type: "coding", language: "javascript",
        starterCode: "// Versiunea originală — greu testabilă:\n// function log(msg) { console.log(`[LOG] ${msg}`); }\n\n// Versiunea testabilă — injectezi output function:\nfunction createLogger(output = console.log) {\n  return function log(msg) {\n    output(`[LOG] ${msg}`);\n  };\n}\n\n// Test manual:\nconst messages = [];\nconst testLog = createLogger(msg => messages.push(msg));\ntestLog('hello');\ntestLog('world');\nconsole.log(messages); // ['[LOG] hello', '[LOG] world']",
        options: [], answer: "", explanation: "Dependency injection face funcțiile testabile — injectezi un colector în loc de console.log real.", difficulty: "medium", expectedOutput: '["[LOG] hello","[LOG] world"]'
      },
      { number: 14, name: "Code coverage", question: "Ce înseamnă 100% branch coverage?", options: ["Toate liniile sunt executate", "Toate ramurile if/else/ternary sunt testate (both true și false)", "Toate funcțiile sunt apelate", "Niciun bug"], answer: "Toate ramurile if/else/ternary sunt testate (both true și false)", explanation: "Branch coverage verifică că fiecare decizie (if/else, ternary, switch) e testată pe ambele căi.", difficulty: "medium" },
      {
        number: 15, name: "Mock simplu", question: "Implementează un mini sistem de mock: o funcție mockFn() care trackează apelurile și poate verifica dacă a fost apelată.",
        type: "coding", language: "javascript",
        starterCode: "function createMock() {\n  const calls = [];\n  function mock(...args) {\n    calls.push(args);\n    return mock._returnValue;\n  }\n  mock.calls = calls;\n  mock.callCount = () => calls.length;\n  mock.calledWith = (...args) => calls.some(\n    c => JSON.stringify(c) === JSON.stringify(args)\n  );\n  mock.returns = (val) => { mock._returnValue = val; return mock; };\n  return mock;\n}\n\nconst fn = createMock().returns(42);\nfn('a', 1);\nfn('b', 2);\nconsole.log(fn.callCount());       // 2\nconsole.log(fn.calledWith('a', 1)); // true\nconsole.log(fn.calledWith('c', 3)); // false",
        options: [], answer: "", explanation: "Un mock tracking: array de apeluri, metodă callCount(), calledWith() cu comparare JSON.", difficulty: "hard", expectedOutput: "2"
      },
    ],
  },
  {
    slug: "performance-patterns-js",
    title: "34. Performance și Patterns JS",
    order: 34,
    theory: [
      { order: 1, title: "Debounce și Throttle", content: "```javascript\n// Debounce — amână execuția până când evenimentul\n// se oprește pentru X milisecunde:\nfunction debounce(fn, delay) {\n  let timeout;\n  return function(...args) {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n\n// Util: search bar — trimite request doar după ce\n// userul a oprit de tastat\nconst debouncedSearch = debounce(searchAPI, 500);\ninput.addEventListener('input', debouncedSearch);\n\n// Throttle — execută cel mult O DATĂ per X milisecunde:\nfunction throttle(fn, interval) {\n  let lastTime = 0;\n  return function(...args) {\n    const now = Date.now();\n    if (now - lastTime >= interval) {\n      lastTime = now;\n      return fn.apply(this, args);\n    }\n  };\n}\n\n// Util: scroll handler, resize, mouse move\nconst throttledScroll = throttle(handleScroll, 100);\nwindow.addEventListener('scroll', throttledScroll);\n```" },
      { order: 2, title: "Design Patterns — Observer și Module", content: "```javascript\n// Observer Pattern — pub/sub:\nclass EventEmitter {\n  #listeners = new Map();\n\n  on(event, listener) {\n    if (!this.#listeners.has(event)) this.#listeners.set(event, []);\n    this.#listeners.get(event).push(listener);\n    return () => this.off(event, listener); // return unsubscribe\n  }\n\n  off(event, listener) {\n    const ls = this.#listeners.get(event) ?? [];\n    this.#listeners.set(event, ls.filter(l => l !== listener));\n  }\n\n  emit(event, ...args) {\n    (this.#listeners.get(event) ?? []).forEach(l => l(...args));\n  }\n}\n\nconst bus = new EventEmitter();\nconst unsub = bus.on('login', (user) => console.log(`${user} s-a logat`));\nbus.emit('login', 'Ana'); // 'Ana s-a logat'\nunsub(); // dezabonare\n```" },
      { order: 3, title: "Lazy loading și Code splitting", content: "```javascript\n// Dynamic import — lazy loading:\nasync function loadChart() {\n  // Chartjs e descărcat NUMAI când e nevoie:\n  const { Chart } = await import('chart.js');\n  return new Chart(...);\n}\n\n// În React (Suspense + lazy):\nimport { lazy, Suspense } from 'react';\nconst HeavyComponent = lazy(() => import('./HeavyComponent'));\n\nfunction App() {\n  return (\n    <Suspense fallback={<div>Loading...</div>}>\n      <HeavyComponent />\n    </Suspense>\n  );\n}\n\n// Intersection Observer — lazy load imagini:\nconst observer = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      const img = entry.target;\n      img.src = img.dataset.src; // încarcă imaginea\n      observer.unobserve(img);\n    }\n  });\n});\n\ndocument.querySelectorAll('img[data-src]')\n  .forEach(img => observer.observe(img));\n```" },
      { order: 4, title: "Web Workers — multithreading", content: "```javascript\n// Web Worker rulează pe thread separat:\n// worker.js:\nself.onmessage = function(e) {\n  const result = heavyCalculation(e.data);\n  self.postMessage(result);\n};\n\nfunction heavyCalculation(n) {\n  let sum = 0;\n  for (let i = 0; i < n; i++) sum += i;\n  return sum;\n}\n\n// main.js:\nconst worker = new Worker('./worker.js');\n\nworker.postMessage(1_000_000_000);\n\nworker.onmessage = (e) => {\n  console.log('Rezultat:', e.data);\n  worker.terminate();\n};\n\n// UI rămâne responsiv în timp ce workerul calculează!\n// Workers nu au acces la DOM.\n```" },
    ],
    tasks: [
      { number: 1, name: "Debounce vs throttle", question: "Când folosești debounce în loc de throttle?", options: ["Când vrei execuție la fiecare X ms", "Când vrei să aștepți ca evenimentul să se oprească (ex: typing)", "Niciodată", "Sunt identice"], answer: "Când vrei să aștepți ca evenimentul să se oprească (ex: typing)", explanation: "Debounce: execută DUPĂ ce evenimentele se opresc. Throttle: execută CEL MULT o dată la X ms (independent de oprire).", difficulty: "medium" },
      { number: 2, name: "Dynamic import", question: "Ce returnează import('./module.js')?", options: ["Modulul direct", "Promise<module>", "undefined", "string"], answer: "Promise<module>", explanation: "Dynamic import() returnează o Promise care resolve cu obiectul module. Folosești await sau .then().", difficulty: "medium" },
      { number: 3, name: "Observer pattern", question: "Ce problemă rezolvă Observer pattern?", options: ["Performanță", "Comunicare decuplată între componente — producători/consumatori independenți", "Caching", "Type safety"], answer: "Comunicare decuplată între componente — producători/consumatori independenți", explanation: "Observer/Pub-Sub decuplează emițătorul de eveniment de cel care le procesează. Schimbări fără dependențe directe.", difficulty: "medium" },
      { number: 4, name: "Web Worker acces DOM", question: "Un Web Worker poate accesa DOM-ul?", options: ["Da", "Nu — Workers nu au acces la DOM", "Doar citire", "Doar prin postMessage"], answer: "Nu — Workers nu au acces la DOM", explanation: "Web Workers rulează pe thread separat fără acces la window, document, sau DOM. Comunică doar prin postMessage.", difficulty: "medium" },
      { number: 5, name: "IntersectionObserver scop", question: "Pentru ce e util IntersectionObserver?", options: ["Evenimente click", "Detectarea când un element intră în viewport (lazy loading)", "CSS animații", "Event delegation"], answer: "Detectarea când un element intră în viewport (lazy loading)", explanation: "IntersectionObserver notifică când un element devine vizibil — perfect pentru lazy loading imagini sau infinite scroll.", difficulty: "medium" },
      {
        number: 6, name: "Implementare debounce", question: "Implementează funcția debounce(fn, delay). Apeluri repetate în interval < delay trebuie să reseteze timer-ul.",
        type: "coding", language: "javascript",
        starterCode: "function debounce(fn, delay) {\n  let timeoutId;\n  return function(...args) {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n\n// Test:\nlet callCount = 0;\nconst debounced = debounce(() => callCount++, 100);\n\n// Simulăm 3 apeluri rapide — doar ultimul ar trebui să execute:\ndebounced(); debounced(); debounced();\n\nsetTimeout(() => {\n  console.log(callCount); // 1 (nu 3)\n}, 200);",
        options: [], answer: "", explanation: "clearTimeout resetează. setTimeout re-setează. fn se execută doar după ce trece delay-ul fără noi apeluri.", difficulty: "medium", expectedOutput: ""
      },
      {
        number: 7, name: "Implementare throttle", question: "Implementează throttle(fn, interval). Fn trebuie executat cel mult o dată per interval, indiferent de câte apeluri vin.",
        type: "coding", language: "javascript",
        starterCode: "function throttle(fn, interval) {\n  let lastTime = 0;\n  return function(...args) {\n    const now = Date.now();\n    if (now - lastTime >= interval) {\n      lastTime = now;\n      return fn.apply(this, args);\n    }\n  };\n}\n\nlet count = 0;\nconst throttled = throttle(() => count++, 100);\n\nthrottled(); // executat (t=0)\nthrottled(); // ignorat (prea devreme)\nthrottled(); // ignorat\nconsole.log(count); // 1",
        options: [], answer: "", explanation: "Compar Date.now() cu lastTime. Dacă a trecut intervalul, execut și actualizez lastTime.", difficulty: "medium", expectedOutput: "1"
      },
      {
        number: 8, name: "Memoize cu Map", question: "Implementează memoize(fn) care funcționează pentru funcții cu orice număr de argumente.",
        type: "coding", language: "javascript",
        starterCode: "function memoize(fn) {\n  const cache = new Map();\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn.apply(this, args);\n    cache.set(key, result);\n    return result;\n  };\n}\n\nlet calls = 0;\nconst expensiveAdd = memoize((a, b) => { calls++; return a + b; });\n\nconsole.log(expensiveAdd(1, 2)); // 3\nconsole.log(expensiveAdd(1, 2)); // 3 (cache)\nconsole.log(expensiveAdd(3, 4)); // 7\nconsole.log(calls); // 2 (nu 3)",
        options: [], answer: "", explanation: "JSON.stringify(args) creează o cheie unică pentru orice combinație de argumente.", difficulty: "medium", expectedOutput: "3"
      },
      { number: 9, name: "Event Emitter off", question: "De ce e important să dezabonezi (off) listenerii la distrugerea componentei?", options: ["Performance marginală", "Prevenirea memory leaks — listeners rețin referințe la componente distruse", "E opțional estetic", "Sunt șterse automat"], answer: "Prevenirea memory leaks — listeners rețin referințe la componente distruse", explanation: "Listeners active = referințe = obiectele nu sunt garbage collected. În SPA-uri acesta duce la memory leaks.", difficulty: "medium" },
      {
        number: 10, name: "EventEmitter simplu", question: "Implementează un EventEmitter cu metodele on(event, fn), off(event, fn) și emit(event, ...args).",
        type: "coding", language: "javascript",
        starterCode: "class EventEmitter {\n  constructor() {\n    this.listeners = {};\n  }\n  \n  on(event, fn) {\n    if (!this.listeners[event]) this.listeners[event] = [];\n    this.listeners[event].push(fn);\n  }\n  \n  off(event, fn) {\n    if (!this.listeners[event]) return;\n    this.listeners[event] = this.listeners[event].filter(l => l !== fn);\n  }\n  \n  emit(event, ...args) {\n    (this.listeners[event] || []).forEach(fn => fn(...args));\n  }\n}\n\nconst emitter = new EventEmitter();\nconst handler = (msg) => console.log('Received:', msg);\nemitter.on('message', handler);\nemitter.emit('message', 'hello'); // Received: hello\nemitter.off('message', handler);\nemitter.emit('message', 'bye');   // nimic",
        options: [], answer: "", explanation: "listeners e un Map de arrays. emit iterează listeners[event]. off filtrează handler-ul.", difficulty: "medium", expectedOutput: "Received: hello"
      },
      {
        number: 11, name: "Singleton pattern", question: "Implementează pattern-ul Singleton: o clasă Database care permite doar O SINGURĂ instanță.",
        type: "coding", language: "javascript",
        starterCode: "class Database {\n  static #instance = null;\n  \n  constructor(url) {\n    if (Database.#instance) return Database.#instance;\n    this.url = url;\n    this.connected = false;\n    Database.#instance = this;\n  }\n  \n  connect() {\n    this.connected = true;\n    console.log(`Connected to ${this.url}`);\n  }\n}\n\nconst db1 = new Database('mongodb://localhost');\nconst db2 = new Database('mongodb://other');\n\nconsole.log(db1 === db2); // true — aceeași instanță\nconsole.log(db2.url);     // 'mongodb://localhost' (prima URL)",
        options: [], answer: "", explanation: "Static #instance reține singura instanță. Constructor returnează instanța existentă dacă există.", difficulty: "hard", expectedOutput: "true"
      },
      { number: 12, name: "LRU cache concept", question: "Ce face un LRU (Least Recently Used) cache când e plin?", options: ["Aruncă eroare", "Șterge cel mai vechi item indiferent de utilizare", "Șterge item-ul cel mai puțin recent accesat", "Dublează capacitatea"], answer: "Șterge item-ul cel mai puțin recent accesat", explanation: "LRU evicts item-ul care nu a fost folosit cel mai mult timp — items populare rămân în cache.", difficulty: "medium" },
      {
        number: 13, name: "Pipeline de funcții", question: "Implementează pipe(...fns) care compune funcții: pipe(f, g, h)(x) = h(g(f(x))).",
        type: "coding", language: "javascript",
        starterCode: "function pipe(...fns) {\n  return function(x) {\n    return fns.reduce((acc, fn) => fn(acc), x);\n  };\n}\n\nconst process = pipe(\n  x => x * 2,\n  x => x + 10,\n  x => x.toString(),\n  x => `Result: ${x}`\n);\n\nconsole.log(process(5)); // 'Result: 20' (5*2=10, 10+10=20, '20', 'Result: 20')",
        options: [], answer: "", explanation: "reduce aplică funcțiile în ordine, fiecare primind output-ul precedentei. Compoziție funcțională.", difficulty: "medium", expectedOutput: "Result: 20"
      },
      { number: 14, name: "Module pattern", question: "Ce avantaj oferă Module pattern (IIFE care returnează obiect) față de variabile globale?", options: ["E mai rapid", "Încapsulare — evită poluarea namespace-ului global, date private", "Funcționează fără browser", "E mai scurt"], answer: "Încapsulare — evită poluarea namespace-ului global, date private", explanation: "Module pattern creează un scope privat. Doar ce returnezi e public. Previne conflicte de nume globale.", difficulty: "medium" },
      {
        number: 15, name: "Compose funcții", question: "Implementează compose(...fns) = opusul lui pipe: compose(f, g, h)(x) = f(g(h(x))) — aplică de la dreapta la stânga.",
        type: "coding", language: "javascript",
        starterCode: "function compose(...fns) {\n  return function(x) {\n    return fns.reduceRight((acc, fn) => fn(acc), x);\n  };\n}\n\nconst transform = compose(\n  x => `[${x}]`,\n  x => x.toUpperCase(),\n  x => x.trim()\n);\n\nconsole.log(transform('  hello  ')); // '[HELLO]'",
        options: [], answer: "", explanation: "reduceRight aplică funcțiile de la dreapta la stânga — opusul lui reduce (pipe). Convenit în programare funcțională.", difficulty: "medium", expectedOutput: "[HELLO]"
      },
    ],
  },
  {
    slug: "mini-proiect-todo-js",
    title: "35. Mini-proiect: Todo App complet în JavaScript",
    order: 35,
    theory: [
      { order: 1, title: "Arhitectura aplicației", content: "Construim un **Todo App** complet cu:\n• CRUD (create, read, update, delete)\n• Filtrare (all/active/completed)\n• LocalStorage (persistență)\n• Keyboard shortcuts\n• Classes + modules\n\n```javascript\n// todo-model.js — State management\nexport class TodoStore {\n  #todos = [];\n  #listeners = [];\n\n  constructor() {\n    this.#todos = JSON.parse(localStorage.getItem('todos') ?? '[]');\n  }\n\n  get todos() { return [...this.#todos]; }\n\n  add(text) {\n    const todo = {\n      id: crypto.randomUUID(),\n      text: text.trim(),\n      done: false,\n      createdAt: Date.now(),\n    };\n    this.#todos.push(todo);\n    this.#save();\n    this.#notify();\n    return todo;\n  }\n\n  toggle(id) {\n    const t = this.#todos.find(t => t.id === id);\n    if (t) { t.done = !t.done; this.#save(); this.#notify(); }\n  }\n\n  delete(id) {\n    this.#todos = this.#todos.filter(t => t.id !== id);\n    this.#save();\n    this.#notify();\n  }\n}\n```" },
      { order: 2, title: "UI Layer — Renderer", content: "```javascript\n// todo-view.js\nexport function renderTodo(todo, onToggle, onDelete, onEdit) {\n  const li = document.createElement('li');\n  li.dataset.id = todo.id;\n  li.className = todo.done ? 'done' : '';\n\n  const check = document.createElement('input');\n  check.type = 'checkbox';\n  check.checked = todo.done;\n  check.addEventListener('change', () => onToggle(todo.id));\n\n  const span = document.createElement('span');\n  span.textContent = todo.text;\n  span.addEventListener('dblclick', () => {\n    const input = document.createElement('input');\n    input.type = 'text';\n    input.value = todo.text;\n    input.addEventListener('blur', () => onEdit(todo.id, input.value));\n    input.addEventListener('keydown', e => {\n      if (e.key === 'Enter') input.blur();\n      if (e.key === 'Escape') li.replaceChild(span, input);\n    });\n    li.replaceChild(input, span);\n    input.focus();\n  });\n\n  const del = document.createElement('button');\n  del.textContent = '×';\n  del.addEventListener('click', () => onDelete(todo.id));\n\n  li.append(check, span, del);\n  return li;\n}\n\nexport function renderStats(todos) {\n  const total = todos.length;\n  const done = todos.filter(t => t.done).length;\n  const active = total - done;\n  return `${active} rămase din ${total} (${done} completate)`;\n}\n```" },
      { order: 3, title: "Controller — App.js", content: "```javascript\n// app.js\nimport { TodoStore } from './todo-model.js';\nimport { renderTodo, renderStats } from './todo-view.js';\n\nconst store = new TodoStore();\nlet filter = 'all'; // 'all' | 'active' | 'done'\n\nconst form = document.querySelector('#add-form');\nconst input = document.querySelector('#new-todo');\nconst list = document.querySelector('#todo-list');\nconst stats = document.querySelector('#stats');\nconst filterBtns = document.querySelectorAll('[data-filter]');\n\nfunction getFiltered(todos) {\n  if (filter === 'active') return todos.filter(t => !t.done);\n  if (filter === 'done') return todos.filter(t => t.done);\n  return todos;\n}\n\nfunction render(todos) {\n  list.innerHTML = '';\n  getFiltered(todos).forEach(todo => {\n    list.appendChild(renderTodo(\n      todo,\n      id => store.toggle(id),\n      id => store.delete(id),\n      (id, text) => store.edit(id, text),\n    ));\n  });\n  stats.textContent = renderStats(todos);\n}\n\nform.addEventListener('submit', e => {\n  e.preventDefault();\n  const text = input.value.trim();\n  if (text) { store.add(text); input.value = ''; }\n});\n\nconst unsubscribe = store.subscribe(render);\nrender(store.todos);\n```" },
      { order: 4, title: "Ce am învățat + next steps", content: "Prin acest proiect am aplicat:\n\n**JavaScript fundamentals:**\n• Classes cu câmpuri private (#)\n• Closures și Observer pattern\n• localStorage persistence\n• Event handling + delegation\n• Dynamic DOM manipulation\n• ES Modules (import/export)\n\n**Patterns:**\n• **MVC light** — Model (TodoStore), View (renderTodo), Controller (app.js)\n• **Observer** — store.subscribe() notifică UI\n• **Immutability** — get todos() returnează copie\n\n**Next steps pentru a îmbunătăți:**\n• Adaugă TypeScript\n• Adaugă teste Jest\n• Migrează la React\n• Adaugă un backend (Next.js API)\n• Deploy pe Vercel\n\nFelicitări! Ai terminat modulul JavaScript cu 35 lecții." },
    ],
    tasks: [
      { number: 1, name: "crypto.randomUUID", question: "De ce e crypto.randomUUID() mai bun decât Date.now() pentru ID-uri?", options: ["E mai rapid", "Garantează unicitate globală (UUID), nu coliziuni în batch", "E mai scurt", "Funcționează offline"], answer: "Garantează unicitate globală (UUID), nu coliziuni în batch", explanation: "Date.now() poate colida dacă două iteme sunt create rapid. UUID e unic statistic garantat.", difficulty: "medium" },
      { number: 2, name: "localStorage.setItem", question: "localStorage.setItem('key', value) — ce trebuie să fie value?", options: ["Orice tip", "String", "Object", "Array"], answer: "String", explanation: "localStorage stochează doar string-uri. Obiectele trebuie serializate cu JSON.stringify() înainte.", difficulty: "easy" },
      { number: 3, name: "Observer unsubscribe", question: "De ce returnezi funcția de unsubscribe din store.subscribe()?", options: ["E opțional", "Pentru a evita memory leaks la unmount/distrugere", "E pattern estetic", "Pentru debugging"], answer: "Pentru a evita memory leaks la unmount/distrugere", explanation: "Dacă nu dezabonezi listenerii, rămân în memorie chiar și după distrugerea componentei.", difficulty: "medium" },
      { number: 4, name: "MVC pattern", question: "Ce reprezintă M, V, C în MVC?", options: ["Method, Value, Class", "Model, View, Controller", "Module, Visual, Component", "Main, Void, Context"], answer: "Model, View, Controller", explanation: "Model = date/logică, View = UI/randare, Controller = leagă modelul de view și gestionează inputul.", difficulty: "easy" },
      { number: 5, name: "Immutable copy", question: "De ce returnăm [...todos] în get todos() în loc de this.#todos direct?", options: ["E mai eficient", "Previne modificarea array-ului intern din exterior", "E syntactic sugar", "Depanatoare"], answer: "Previne modificarea array-ului intern din exterior", explanation: "Returnând o copie, codul din afară nu poate muta array-ul intern. Imutabilitate garantată.", difficulty: "medium" },
      { number: 6, name: "dblclick edit", question: "Ce eveniment declanșează editarea inline a unui todo?", options: ["click", "dblclick", "contextmenu", "focus"], answer: "dblclick", explanation: "dblclick (dublu click) e conventia standard pentru editare inline în liste/tabele.", difficulty: "easy" },
      { number: 7, name: "ES Modules", question: "Ce keyword folosești pentru a face o funcție disponibilă în alt fișier?", options: ["public", "export", "module.exports", "share"], answer: "export", explanation: "ES Modules: export face funcția/clasa disponibilă, import o importă în alt fișier.", difficulty: "easy" },
      {
        number: 8, name: "TodoStore simplu", question: "Implementează un mini TodoStore cu metodele add(text), remove(id) și getAll(). Stochează todos în array privat.",
        type: "coding", language: "javascript",
        starterCode: "class TodoStore {\n  #todos = [];\n  #nextId = 1;\n  \n  add(text) {\n    const todo = { id: this.#nextId++, text, done: false };\n    this.#todos.push(todo);\n    return todo;\n  }\n  \n  remove(id) {\n    this.#todos = this.#todos.filter(t => t.id !== id);\n  }\n  \n  toggle(id) {\n    const t = this.#todos.find(t => t.id === id);\n    if (t) t.done = !t.done;\n  }\n  \n  getAll() { return [...this.#todos]; }\n}\n\nconst store = new TodoStore();\nstore.add('Învață JS');\nstore.add('Fă exerciții');\nstore.toggle(1);\nconsole.log(store.getAll());\n// [{ id:1, text:'Învață JS', done:true }, { id:2, ... done:false }]",
        options: [], answer: "", explanation: "Array privat #todos. add() push, remove() filter, toggle() find+flip, getAll() returnează copie.", difficulty: "medium", expectedOutput: '"done":true'
      },
      {
        number: 9, name: "Filtrare todos", question: "Scrie funcția filterTodos(todos, filter) care returnează todos filtrate: 'all', 'active', 'done'.",
        type: "coding", language: "javascript",
        starterCode: "function filterTodos(todos, filter) {\n  if (filter === 'active') return todos.filter(t => !t.done);\n  if (filter === 'done') return todos.filter(t => t.done);\n  return todos; // 'all'\n}\n\nconst todos = [\n  { id: 1, text: 'A', done: true },\n  { id: 2, text: 'B', done: false },\n  { id: 3, text: 'C', done: true },\n];\n\nconsole.log(filterTodos(todos, 'all').length);    // 3\nconsole.log(filterTodos(todos, 'active').length); // 1\nconsole.log(filterTodos(todos, 'done').length);   // 2",
        options: [], answer: "", explanation: "Switch pe filter — filter() cu condiția corespunzătoare sau returnezi direct array-ul.", difficulty: "easy", expectedOutput: "3"
      },
      {
        number: 10, name: "LocalStorage persistence", question: "Implementează saveTodos(todos) și loadTodos() pentru persistare în localStorage.",
        type: "coding", language: "javascript",
        starterCode: "function saveTodos(todos) {\n  localStorage.setItem('todos', JSON.stringify(todos));\n}\n\nfunction loadTodos() {\n  try {\n    return JSON.parse(localStorage.getItem('todos') || '[]');\n  } catch {\n    return [];\n  }\n}\n\n// Test:\nconst todos = [{ id: 1, text: 'Test', done: false }];\nsaveTodos(todos);\nconst loaded = loadTodos();\nconsole.log(loaded[0].text); // 'Test'\nconsole.log(loaded.length);  // 1",
        options: [], answer: "", explanation: "JSON.stringify la save, JSON.parse la load. try/catch pentru JSON invalid sau localStorage indisponibil.", difficulty: "easy", expectedOutput: "Test"
      },
      {
        number: 11, name: "Stats calculator", question: "Scrie getTodoStats(todos) care returnează { total, done, active, percent }.",
        type: "coding", language: "javascript",
        starterCode: "function getTodoStats(todos) {\n  const total = todos.length;\n  const done = todos.filter(t => t.done).length;\n  const active = total - done;\n  const percent = total === 0 ? 0 : Math.round((done / total) * 100);\n  return { total, done, active, percent };\n}\n\nconst todos = [\n  { done: true }, { done: true }, { done: false }, { done: false }, { done: false }\n];\nconst stats = getTodoStats(todos);\nconsole.log(stats.total);   // 5\nconsole.log(stats.done);    // 2\nconsole.log(stats.active);  // 3\nconsole.log(stats.percent); // 40",
        options: [], answer: "", explanation: "Calcule simple: filter().length, aritmetică. Math.round pentru procente întregi.", difficulty: "easy", expectedOutput: "5"
      },
      { number: 12, name: "e.preventDefault scop", question: "De ce apelezi e.preventDefault() pe form submit?", options: ["E obligatoriu în JS", "Previne reîncărcarea paginii (comportament default al formularelor)", "Previne propagarea evenimentului", "Oprește validarea"], answer: "Previne reîncărcarea paginii (comportament default al formularelor)", explanation: "Form-urile HTML reîncarcă pagina la submit by default. preventDefault() permite handlerea custom în JS.", difficulty: "easy" },
      {
        number: 13, name: "Observer pattern subscribe", question: "Implementează un sistem simple subscribe/notify: subscribe(fn) → returnează unsubscribe; notify(data) → apelează toți subscribers.",
        type: "coding", language: "javascript",
        starterCode: "function createStore(initialState) {\n  let state = initialState;\n  const subscribers = [];\n  \n  return {\n    getState() { return state; },\n    setState(newState) {\n      state = newState;\n      subscribers.forEach(fn => fn(state));\n    },\n    subscribe(fn) {\n      subscribers.push(fn);\n      return () => {\n        const idx = subscribers.indexOf(fn);\n        if (idx > -1) subscribers.splice(idx, 1);\n      };\n    },\n  };\n}\n\nconst store = createStore({ count: 0 });\nconst unsub = store.subscribe(s => console.log('State:', s.count));\nstore.setState({ count: 1 }); // State: 1\nstore.setState({ count: 2 }); // State: 2\nunsub();\nstore.setState({ count: 3 }); // nimic (dezabonat)",
        options: [], answer: "", explanation: "subscribers array. subscribe push + returnează cleanup. setState actualizează și notifică toți subscribers.", difficulty: "medium", expectedOutput: "State: 1"
      },
      {
        number: 14, name: "Sort todos", question: "Sortează todos: mai întâi cele neterminate (active), apoi terminate (done), fiecare grup în ordinea creării.",
        type: "coding", language: "javascript",
        starterCode: "function sortTodos(todos) {\n  return [...todos].sort((a, b) => {\n    if (a.done !== b.done) return a.done ? 1 : -1;\n    return a.createdAt - b.createdAt;\n  });\n}\n\nconst todos = [\n  { id: 1, done: true,  createdAt: 100, text: 'A' },\n  { id: 2, done: false, createdAt: 200, text: 'B' },\n  { id: 3, done: true,  createdAt: 50,  text: 'C' },\n  { id: 4, done: false, createdAt: 150, text: 'D' },\n];\n\nconst sorted = sortTodos(todos);\nconsole.log(sorted.map(t => t.text)); // ['B', 'D', 'C', 'A']",
        options: [], answer: "", explanation: "Sort: done false < done true (active first). La egalitate, sort by createdAt ascending.", difficulty: "medium", expectedOutput: '["B","D","C","A"]'
      },
      {
        number: 15, name: "Todo app complet", question: "Implementează o funcție createTodoApp() care gestionează o lista de todos cu add, toggle, remove și returnează starea curentă.",
        type: "coding", language: "javascript",
        starterCode: "function createTodoApp() {\n  let todos = [];\n  let nextId = 1;\n  \n  return {\n    add(text) {\n      todos = [...todos, { id: nextId++, text, done: false }];\n      return this;\n    },\n    toggle(id) {\n      todos = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);\n      return this;\n    },\n    remove(id) {\n      todos = todos.filter(t => t.id !== id);\n      return this;\n    },\n    getStats() {\n      return { total: todos.length, done: todos.filter(t => t.done).length };\n    },\n    toArray() { return [...todos]; },\n  };\n}\n\nconst app = createTodoApp();\napp.add('Lecția 1').add('Lecția 2').add('Lecția 3');\napp.toggle(1).toggle(2);\napp.remove(3);\nconsole.log(app.getStats()); // { total: 2, done: 2 }\nconsole.log(app.toArray().map(t => t.text)); // ['Lecția 1', 'Lecția 2']",
        options: [], answer: "", explanation: "Closure pentru state privat. Imutabilitate: spread pentru add/toggle. Fluent API (return this) permite chaining.", difficulty: "hard", expectedOutput: '{"total":2,"done":2}'
      },
    ],
  },
];

module.exports = { jsExtra };

