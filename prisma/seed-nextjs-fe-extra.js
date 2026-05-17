const nextjsFrontendExtra2 = [
  {
    "slug": "nextjs-zustand-persistenta",
    "title": "31. Next.js cu Zustand si persistenta",
    "order": 31,
    "theory": [
      {
        "order": 1,
        "title": "Zustand — store global simplu si eficient",
        "content": "**Zustand** e o librarie de state management minimalista pentru React/Next.js — fara Provider, fara boilerplate, fara Redux verbosity.\n\n**Instalare si store de baza:**\n```bash\nnpm install zustand\n```\n\n```typescript\n// store/cartStore.ts\nimport { create } from 'zustand';\n\ninterface CartItem {\n  id: string;\n  name: string;\n  price: number;\n  quantity: number;\n}\n\ninterface CartStore {\n  items: CartItem[];\n  total: number;\n  addItem: (item: CartItem) => void;\n  removeItem: (id: string) => void;\n  clearCart: () => void;\n}\n\nexport const useCartStore = create<CartStore>((set, get) => ({\n  items: [],\n  total: 0,\n  addItem: (item) => set((state) => {\n    const existing = state.items.find(i => i.id === item.id);\n    const items = existing\n      ? state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)\n      : [...state.items, { ...item, quantity: 1 }];\n    return { items, total: items.reduce((s, i) => s + i.price * i.quantity, 0) };\n  }),\n  removeItem: (id) => set((state) => {\n    const items = state.items.filter(i => i.id !== id);\n    return { items, total: items.reduce((s, i) => s + i.price * i.quantity, 0) };\n  }),\n  clearCart: () => set({ items: [], total: 0 }),\n}));\n```\n\n**Utilizare in componenta:**\n```tsx\n'use client';\nimport { useCartStore } from '@/store/cartStore';\n\nexport function CartButton() {\n  const { items, addItem } = useCartStore();\n  // Selector granular — re-render DOAR cand items se schimba:\n  const count = useCartStore(state => state.items.length);\n  return <button>Cart ({count})</button>;\n}\n```\n\n**Interview tip:** Zustand e preferat Redux Toolkit in proiecte mici/medii Next.js. Selectori granulari (useCartStore(state => state.x)) evita re-render-uri inutile — componenta se re-randeaza DOAR cand x se schimba."
      },
      {
        "order": 2,
        "title": "Persistenta cu zustand/middleware si localStorage",
        "content": "Zustand ofera middleware **persist** care salveaza starea in localStorage/sessionStorage/cookies automat.\n\n```typescript\n// store/settingsStore.ts\nimport { create } from 'zustand';\nimport { persist, createJSONStorage } from 'zustand/middleware';\n\ninterface SettingsStore {\n  theme: 'light' | 'dark';\n  language: string;\n  fontSize: number;\n  setTheme: (theme: 'light' | 'dark') => void;\n  setLanguage: (lang: string) => void;\n}\n\nexport const useSettingsStore = create<SettingsStore>()(\n  persist(\n    (set) => ({\n      theme: 'light',\n      language: 'ro',\n      fontSize: 16,\n      setTheme: (theme) => set({ theme }),\n      setLanguage: (language) => set({ language }),\n    }),\n    {\n      name: 'settings-storage',        // cheia in localStorage\n      storage: createJSONStorage(() => localStorage),\n      partialize: (state) => ({        // persista DOAR aceste campuri:\n        theme: state.theme,\n        language: state.language,\n      }),\n    }\n  )\n);\n```\n\n**Persistenta in cookies (pentru SSR):**\n```typescript\nimport Cookies from 'js-cookie';\n\nconst cookieStorage = {\n  getItem: (name: string) => Cookies.get(name) ?? null,\n  setItem: (name: string, value: string) => Cookies.set(name, value, { expires: 365 }),\n  removeItem: (name: string) => Cookies.remove(name),\n};\n\nexport const useUserStore = create<UserStore>()(\n  persist(\n    (set) => ({ userId: null, setUserId: (id) => set({ userId: id }) }),\n    { name: 'user-data', storage: createJSONStorage(() => cookieStorage) }\n  )\n);\n```\n\n**Interview tip:** persist cu localStorage e perfect pentru preferinte UI. Pentru date de autentificare, foloseste cookies HttpOnly (setate server-side) sau session management dedicat — localStorage nu e accesibil SSR si e vulnerabil la XSS."
      },
      {
        "order": 3,
        "title": "Hydration Mismatch — problema si solutii SSR-safe",
        "content": "**Hydration mismatch** apare cand HTML-ul generat pe server difera de cel generat pe client — eroare frecventa cu Zustand persist si localStorage.\n\n**Problema:**\n```tsx\n// PROBLEMA: server randeaza 'light', client citeste 'dark' din localStorage\n// → React: \"Expected 'light' but received 'dark'\"\n\n'use client';\nexport function ThemeButton() {\n  const theme = useSettingsStore(state => state.theme);\n  // Pe server: theme = 'light' (valoare initiala)\n  // Pe client dupa hydration: theme = 'dark' (din localStorage)\n  // MISMATCH!\n  return <div className={theme === 'dark' ? 'dark' : 'light'}>...</div>;\n}\n```\n\n**Solutia 1 — useHydration hook:**\n```tsx\nimport { useEffect, useState } from 'react';\n\nfunction useHydration() {\n  const [hydrated, setHydrated] = useState(false);\n  useEffect(() => setHydrated(true), []);\n  return hydrated;\n}\n\nexport function ThemeButton() {\n  const hydrated = useHydration();\n  const theme = useSettingsStore(state => state.theme);\n  // Pana la hydration, afiseaza valoarea default (matching server):\n  if (!hydrated) return <div className=\"light\">...</div>;\n  return <div className={theme === 'dark' ? 'dark' : 'light'}>...</div>;\n}\n```\n\n**Solutia 2 — onRehydrateStorage callback:**\n```typescript\nexport const useSettingsStore = create<SettingsStore>()(\n  persist(\n    (set) => ({ theme: 'light', _hasHydrated: false, setHasHydrated: (v) => set({ _hasHydrated: v }) }),\n    {\n      name: 'settings',\n      onRehydrateStorage: () => (state) => {\n        state?.setHasHydrated(true);\n      },\n    }\n  )\n);\n\n// In componenta:\nconst hasHydrated = useSettingsStore(state => state._hasHydrated);\nif (!hasHydrated) return <Skeleton />;\n```\n\n**Interview tip:** Hydration mismatch e o eroare clasica cu orice state din browser (localStorage, cookies client-side). Regula: pe server returneaza intotdeauna valoarea initiala (default), pe client asteapta useEffect/hydration."
      },
      {
        "order": 4,
        "title": "Zustand Devtools, Immer si slice pattern",
        "content": "**DevTools** pentru debugging si **Immer** pentru mutabilitate in state complex.\n\n**Redux DevTools cu Zustand:**\n```typescript\nimport { devtools } from 'zustand/middleware';\n\nexport const useStore = create<Store>()(\n  devtools(\n    (set) => ({\n      count: 0,\n      increment: () => set(state => ({ count: state.count + 1 }), false, 'increment'),\n      //                                               ^^^^ replace?  ^^^^ action name in devtools\n    }),\n    { name: 'MyStore' }\n  )\n);\n// Instaleaza Redux DevTools Extension in browser — vizualizezi actiunile\n```\n\n**Immer middleware — state imbricate complex:**\n```typescript\nimport { immer } from 'zustand/middleware/immer';\n\ninterface DeepState {\n  user: { profile: { name: string; avatar: string }; settings: { notifications: boolean } };\n  updateName: (name: string) => void;\n}\n\nexport const useDeepStore = create<DeepState>()(\n  immer((set) => ({\n    user: { profile: { name: 'Cristi', avatar: '' }, settings: { notifications: true } },\n    updateName: (name) => set((state) => {\n      // Cu immer, mutatii directe sunt OK — produce immutable update:\n      state.user.profile.name = name;\n    }),\n  }))\n);\n```\n\n**Slice pattern — store mare impartit in slices:**\n```typescript\n// slices/counterSlice.ts\ntype CounterSlice = { count: number; increment: () => void; };\nexport const createCounterSlice = (set: any): CounterSlice => ({\n  count: 0,\n  increment: () => set((s: any) => ({ count: s.count + 1 })),\n});\n\n// store/useStore.ts\nimport { create } from 'zustand';\nimport { createCounterSlice } from './slices/counterSlice';\nimport { createUserSlice } from './slices/userSlice';\n\nexport const useStore = create<CounterSlice & UserSlice>()((...a) => ({\n  ...createCounterSlice(...a),\n  ...createUserSlice(...a),\n}));\n```\n\n**Interview tip:** Slice pattern e recomandat pentru store-uri mari — fiecare feature are propriul slice, codul e modular si testabil independent."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Zustand vs Redux",
        "question": "Care este avantajul principal al Zustand fata de Redux Toolkit in aplicatii Next.js medii?",
        "options": [
          "Zustand suporta TypeScript, Redux nu",
          "Zustand nu necesita Provider, are mai putin boilerplate, bundle mai mic — aceleasi capabilitati de state management pentru aplicatii medii",
          "Redux nu functioneaza cu Server Components",
          "Zustand are performanta mai buna la orice dimensiune de aplicatie"
        ],
        "answer": "Zustand nu necesita Provider, are mai putin boilerplate, bundle mai mic — aceleasi capabilitati de state management pentru aplicatii medii",
        "explanation": "Redux: configureStore, Provider wrapping, slice cu createSlice, useSelector + useDispatch. Zustand: create() cu state + actions intr-un singur loc, useCartStore() direct. Pentru aplicatii mari cu multe developeri, Redux Toolkit ofera structura mai stricta.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "Selector granular Zustand",
        "question": "De ce este important sa folosesti selectori granulari cu Zustand (ex: useStore(state => state.count)) in loc de useStore()?",
        "options": [
          "Selectori granulari sunt necesari pentru TypeScript",
          "Fara selector, componenta se re-randeaza la ORICE schimbare din store; cu selector granular, se re-randeaza DOAR cand campul selectat se schimba",
          "useStore() fara selector nu functioneaza",
          "Selectori granulari permit persistenta automata"
        ],
        "answer": "Fara selector, componenta se re-randeaza la ORICE schimbare din store; cu selector granular, se re-randeaza DOAR cand campul selectat se schimba",
        "explanation": "useStore() returneaza intreg store-ul — orice actiune care schimba orice camp cauzeaza re-render. useStore(s => s.count) cauzeaza re-render DOAR cand count se schimba. Esential pentru performanta in componente care consuma parti mici din store.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "Hydration mismatch cauza",
        "question": "De ce cauzeaza Zustand persist cu localStorage un hydration mismatch in Next.js?",
        "options": [
          "localStorage nu e compatibil cu Zustand",
          "Serverul randeaza HTML cu valorile initiale ale store-ului; clientul, dupa hydration, citeste valorile din localStorage care pot fi diferite — React detecteaza discrepanta",
          "Next.js blocheaza accesul la localStorage",
          "Persist middleware e incompatibil cu Server Components"
        ],
        "answer": "Serverul randeaza HTML cu valorile initiale ale store-ului; clientul, dupa hydration, citeste valorile din localStorage care pot fi diferite — React detecteaza discrepanta",
        "explanation": "Server: theme='light' (default). Client localStorage: theme='dark' (salvat anterior). React compare DOM-ul server cu cel client — 'light' != 'dark' = hydration mismatch. Solutie: asteapta useEffect (post-hydration) inainte de a folosi valorile din localStorage.",
        "difficulty": "hard"
      },
      {
        "number": 4,
        "name": "persist partialize",
        "question": "Ce face optiunea 'partialize' in middleware-ul persist al Zustand?",
        "options": [
          "Persista doar o parte din actiuni",
          "Selecteaza doar campurile specificate pentru a fi salvate in storage — util pentru a exclude actiuni, cache temporar sau date sensibile din persistenta",
          "Comprima datele inainte de salvare",
          "Limiteaza dimensiunea storage-ului folosit"
        ],
        "answer": "Selecteaza doar campurile specificate pentru a fi salvate in storage — util pentru a exclude actiuni, cache temporar sau date sensibile din persistenta",
        "explanation": "Fara partialize: intregul state (inclusiv functii — care nu se serializeaza corect) e salvat. Cu partialize: (state) => ({ theme: state.theme, language: state.language }) — salvezi doar datele relevante, nu actiunile.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "Creeaza Zustand store cu persist",
        "question": "Creeaza un Zustand store TypeScript pentru tema aplicatiei (dark/light) cu persistenta in localStorage si rezolvarea hydration mismatch cu un hook useHydration.",
        "options": [],
        "answer": "",
        "explanation": "persist((set)=>({theme:'light', toggleTheme:()=>set(s=>({theme:s.theme==='light'?'dark':'light'})), setTheme:(t)=>set({theme:t})}), {name:'theme-storage', storage:createJSONStorage(()=>localStorage)}); useHydration: const [h,setH]=useState(false); useEffect(()=>setH(true),[]); return h;",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "Immer cu Zustand",
        "question": "Cand este recomandat sa folosesti middleware-ul Immer cu Zustand?",
        "options": [
          "Intotdeauna, pentru performanta mai buna",
          "Cand ai state adanc imbricat si actualizarile spread (…state) devin verbose si predispuse la erori — Immer permite mutatii directe producand automat update-uri immutable",
          "Doar cu TypeScript",
          "Cand store-ul are mai mult de 10 campuri"
        ],
        "answer": "Cand ai state adanc imbricat si actualizarile spread (…state) devin verbose si predispuse la erori — Immer permite mutatii directe producand automat update-uri immutable",
        "explanation": "Fara Immer: set(s=>({...s, user:{...s.user, profile:{...s.user.profile, name: newName}}})) — error-prone. Cu Immer: set(s=>{s.user.profile.name=newName}) — clar si simplu. Immer foloseste Proxy intern pentru a detecta mutatiile.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "Slice pattern beneficii",
        "question": "Care este beneficiul principal al Slice Pattern in Zustand pentru aplicatii mari?",
        "options": [
          "Reduce bundle size automat",
          "Permite separarea store-ului mare in module coezive (un slice per feature) care pot fi dezvoltate, testate si mentinute independent",
          "Elimina nevoia de TypeScript",
          "Permite multiple store-uri simultan"
        ],
        "answer": "Permite separarea store-ului mare in module coezive (un slice per feature) care pot fi dezvoltate, testate si mentinute independent",
        "explanation": "Cart slice, User slice, UI slice — fiecare cu propriul state, actiuni si tipuri. Store-ul final le combina. Similar cu Redux Toolkit slices dar fara boilerplate. Testezi fiecare slice izolat cu unit tests.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "Store cart complet",
        "question": "Implementeaza un Zustand store complet pentru un cos de cumparaturi: addItem (cu incrementare cantitate), removeItem, clearCart si calculul automat al totalului.",
        "options": [],
        "answer": "",
        "explanation": "addItem: set(s=>{const ex=s.items.find(i=>i.id===item.id); const items=ex?s.items.map(i=>i.id===item.id?{...i,quantity:i.quantity+1}:i):[...s.items,{...item,quantity:1}]; return {items,total:items.reduce((s,i)=>s+i.price*i.quantity,0)}}); removeItem: filtrezi items, recalculezi total; clearCart: {items:[],total:0}",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "Zustand devtools",
        "question": "Ce permite middleware-ul devtools din Zustand si cum e util in development?",
        "options": [
          "Adauga ESLint rules pentru Zustand",
          "Conecteaza store-ul la Redux DevTools Extension din browser — vizualizezi fiecare actiune, state-ul inainte/dupa, poti face time-travel debugging",
          "Genereaza automat teste pentru store",
          "Afiseaza store-ul in consola la fiecare schimbare"
        ],
        "answer": "Conecteaza store-ul la Redux DevTools Extension din browser — vizualizezi fiecare actiune, state-ul inainte/dupa, poti face time-travel debugging",
        "explanation": "Cu devtools si action names (al treilea parametru al set()): increment → se vede in DevTools ca actiunea 'increment' cu state inainte/dupa. Time-travel: mergi inapoi la orice stare anterioara. Util pentru debugging state complex.",
        "difficulty": "easy"
      },
      {
        "number": 10,
        "name": "Cookies vs localStorage persist",
        "question": "Cand preferi sa persisti state Zustand in cookies in loc de localStorage?",
        "options": [
          "Cookies sunt intotdeauna mai siguri",
          "Cand ai nevoie ca datele sa fie disponibile pe server (SSR/RSC) sau la primul request HTTP — cookies sunt trimise automat cu fiecare request, localStorage e inaccesibil server-side",
          "localStorage nu suporta obiecte JSON",
          "Cookies au capacitate mai mare de stocare"
        ],
        "answer": "Cand ai nevoie ca datele sa fie disponibile pe server (SSR/RSC) sau la primul request HTTP — cookies sunt trimise automat cu fiecare request, localStorage e inaccesibil server-side",
        "explanation": "Exemplu: tema dark/light in cookies = serverul poate randa pagina direct cu tema corecta, fara flash. In localStorage = serverul randeaza light, clientul comuta la dark = flash of unstyled content (FOUC).",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "Zustand subscriptions",
        "question": "Cum poti reactiona la schimbarile unui store Zustand in afara componentelor React (ex: intr-un service sau pentru side effects)?",
        "options": [
          "Nu e posibil in afara componentelor",
          "Folosesti useCartStore.subscribe((state) => { /* reactie la schimbari */ }) — API de subscriptie disponibil direct pe store, independent de React",
          "Trebuie sa folosesti Redux pentru acest caz",
          "Folosesti un useEffect global"
        ],
        "answer": "Folosesti useCartStore.subscribe((state) => { /* reactie la schimbari */ }) — API de subscriptie disponibil direct pe store, independent de React",
        "explanation": "useCartStore.subscribe(state => console.log('Cart changed:', state.items)) poate fi apelat anywhere. Util pentru: sync cu API extern, analytics, logging. Returneaza o functie de unsubscribe pentru cleanup.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Testing Zustand store",
        "question": "Scrie un test Vitest pentru un Zustand store de counter care verifica ca increment() creste count-ul de la 0 la 1.",
        "options": [],
        "answer": "",
        "explanation": "beforeEach: useCounterStore.setState({count:0}). test increment: useCounterStore.getState().increment(); expect(useCounterStore.getState().count).toBe(1). test reset: useCounterStore.setState({count:5}); useCounterStore.getState().reset(); expect(...count).toBe(0).",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Zustand vs Context API",
        "question": "Care este dezavantajul principal al React Context API fata de Zustand pentru state management global?",
        "options": [
          "Context API nu suporta TypeScript",
          "Orice schimbare in Context valoare cauzeaza re-renderizarea TUTUROR consumatorilor — fara selectori granulari; Zustand permite subscriptii selective si re-renderizeaza doar componentele afectate",
          "Context API nu poate fi folosit in Next.js",
          "Context API e deprecat in React 18"
        ],
        "answer": "Orice schimbare in Context valoare cauzeaza re-renderizarea TUTUROR consumatorilor — fara selectori granulari; Zustand permite subscriptii selective si re-renderizeaza doar componentele afectate",
        "explanation": "UserContext cu {user, posts, settings}: daca posts se schimba, TOATE componentele care folosesc orice din context se re-randeaza. Zustand: useStore(s=>s.user) se re-randeaza DOAR cand user se schimba. Pentru state complex, Zustand e semnificativ mai performant.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Middleware combinare",
        "question": "Cum combini middleware-urile persist, devtools si immer intr-un singur store Zustand?",
        "options": [
          "Nu poti combina mai mult de 2 middleware-uri",
          "Le nesti: create(devtools(persist(immer((set) => ({...})))))",
          "Le importi separat si le configurezi in fisiere diferite",
          "Folosesti un array de middleware ca al doilea parametru al create()"
        ],
        "answer": "Le nesti: create(devtools(persist(immer((set) => ({...})))))",
        "explanation": "Ordinea conteaza: devtools(persist(immer())) — devtools vede actiunile dupa ce persist si immer le proceseaza. TypeScript poate necesita tipare explicite pentru combinatii complexe. Exemplu: create<Store>()(devtools(persist(immer((set)=>({...})),{name:'store'}),{name:'MyStore'}))",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "Zustand SSR safe pattern",
        "question": "Implementeaza un custom hook useIsHydrated() si un component wrapper SafeHydrate care randeaza children-ul doar dupa hydration pentru a preveni mismatch-ul cu store Zustand persist.",
        "options": [],
        "answer": "",
        "explanation": "useIsHydrated: const [h,setH]=useState(false); useEffect(()=>setH(true),[]); return h. SafeHydrate: const h=useIsHydrated(); if(!h) return fallback; return children. Folosire: <SafeHydrate fallback={<Skeleton/>}><ThemeToggle/></SafeHydrate>",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "nextjs-i18n-next-intl",
    "title": "32. Internationalizare (i18n) cu next-intl",
    "order": 32,
    "theory": [
      {
        "order": 1,
        "title": "Setup next-intl in Next.js App Router",
        "content": "**next-intl** e libraria de i18n recomandata pentru Next.js App Router — suporta routing, RSC, Server Actions.\n\n**Instalare si configurare initiala:**\n```bash\nnpm install next-intl\n```\n\n**Structura fisiere:**\n```\napp/\n  [locale]/\n    layout.tsx\n    page.tsx\n  globals.css\nmessages/\n  ro.json\n  en.json\n  fr.json\nmiddleware.ts\nnext.config.ts\n```\n\n**next.config.ts:**\n```typescript\nimport createNextIntlPlugin from 'next-intl/plugin';\nconst withNextIntl = createNextIntlPlugin();\nexport default withNextIntl({ /* next config */ });\n```\n\n**i18n/routing.ts:**\n```typescript\nimport { defineRouting } from 'next-intl/routing';\n\nexport const routing = defineRouting({\n  locales: ['ro', 'en', 'fr'],\n  defaultLocale: 'ro',\n  localePrefix: 'as-needed',  // /ro/about → /about (default locale fara prefix)\n});\n```\n\n**middleware.ts:**\n```typescript\nimport createMiddleware from 'next-intl/middleware';\nimport { routing } from './i18n/routing';\n\nexport default createMiddleware(routing);\n\nexport const config = {\n  matcher: ['/((?!api|_next|_vercel|.*\\\\..*).*)']\n};\n```\n\n**messages/ro.json:**\n```json\n{\n  \"Home\": {\n    \"title\": \"Bine ai venit!\",\n    \"description\": \"Aplicatia noastra de invatare\"\n  },\n  \"Navigation\": {\n    \"home\": \"Acasa\",\n    \"about\": \"Despre\",\n    \"courses\": \"Cursuri\"\n  }\n}\n```\n\n**Interview tip:** next-intl integreaza nativ cu App Router — useTranslations() functioneaza in RSC (server-side), Client Components si Server Actions. Nu necesita wrapping in Provider pentru RSC."
      },
      {
        "order": 2,
        "title": "useTranslations, formatteri si pluralizare",
        "content": "**next-intl** ofera API bogat pentru mesaje, formatare date/numere si pluralizare.\n\n**useTranslations in RSC si Client Components:**\n```tsx\n// Server Component (RSC):\nimport { useTranslations } from 'next-intl';\n\nexport default function HomePage() {\n  const t = useTranslations('Home');\n  return (\n    <div>\n      <h1>{t('title')}</h1>\n      <p>{t('description')}</p>\n    </div>\n  );\n}\n\n// Client Component:\n'use client';\nimport { useTranslations } from 'next-intl';\n\nexport function NavBar() {\n  const t = useTranslations('Navigation');\n  return <nav><a href=\"/\">{t('home')}</a></nav>;\n}\n```\n\n**Interpolari si Rich Text:**\n```json\n// messages/ro.json:\n{\n  \"greeting\": \"Buna ziua, {name}!\",\n  \"itemCount\": \"Ai {count, plural, =0 {niciun element} =1 {un element} other {# elemente}}\",\n  \"bold\": \"Text <bold>important</bold> aici\"\n}\n```\n\n```tsx\nt('greeting', { name: 'Cristi' })  // → 'Buna ziua, Cristi!'\nt('itemCount', { count: 5 })       // → 'Ai 5 elemente'\nt.rich('bold', { bold: (chunks) => <strong>{chunks}</strong> })\n```\n\n**Formatare date si numere:**\n```tsx\nimport { useFormatter } from 'next-intl';\n\nexport function PriceTag({ price }: { price: number }) {\n  const format = useFormatter();\n  return (\n    <span>\n      {format.number(price, { style: 'currency', currency: 'RON' })}\n      {/* → 1.500,00 RON in ro; → RON 1,500.00 in en */}\n    </span>\n  );\n}\n\n// Formatare date:\nformat.dateTime(new Date(), { dateStyle: 'full' })\n// → 'luni, 16 mai 2026' in ro; → 'Monday, May 16, 2026' in en\n```\n\n**Interview tip:** ICU Message Format (plural, select, etc.) e standardul industriei. next-intl il suporta complet. Evita interpolari simple prin concatenare string — pierde contextul gramatical al limbii."
      },
      {
        "order": 3,
        "title": "Routing i18n — Link, useRouter, redirect",
        "content": "**next-intl** ofera versiuni localizate ale componentelor si hook-urilor de routing Next.js.\n\n**Navigare localizata:**\n```tsx\n// navigation.ts — creeaza API-ul de navigare localizat:\nimport { createNavigation } from 'next-intl/navigation';\nimport { routing } from './routing';\n\nexport const { Link, redirect, usePathname, useRouter } = createNavigation(routing);\n```\n\n**Utilizare Link si useRouter:**\n```tsx\nimport { Link } from '@/i18n/navigation';\n\n// Link pastreaza locale-ul curent automat:\n<Link href=\"/about\">Despre noi</Link>\n// In locale 'en': randeaza <a href=\"/en/about\">\n// In locale 'ro' (default): randeaza <a href=\"/about\">\n\n// Link catre alt locale explicit:\n<Link href=\"/about\" locale=\"en\">About (EN)</Link>\n\n// useRouter pentru navigare programatica:\n'use client';\nimport { useRouter } from '@/i18n/navigation';\n\nexport function SearchBar() {\n  const router = useRouter();\n  const handleSearch = (query: string) => {\n    router.push(`/results?q=${query}`);\n    // Navigheaza cu locale-ul curent pastrat\n  };\n}\n```\n\n**Language Switcher:**\n```tsx\n'use client';\nimport { usePathname, useRouter } from '@/i18n/navigation';\nimport { useLocale } from 'next-intl';\n\nexport function LanguageSwitcher() {\n  const router = useRouter();\n  const pathname = usePathname();\n  const locale = useLocale();\n\n  const switchLocale = (newLocale: string) => {\n    router.replace(pathname, { locale: newLocale });\n    // Navigheaza la aceeasi pagina in alt locale\n  };\n\n  return (\n    <select value={locale} onChange={(e) => switchLocale(e.target.value)}>\n      <option value=\"ro\">Romana</option>\n      <option value=\"en\">English</option>\n      <option value=\"fr\">Francais</option>\n    </select>\n  );\n}\n```\n\n**Interview tip:** Intotdeauna foloseste Link si useRouter din @/i18n/navigation (nu din next/navigation) — versiunile localizate pastreaza locale-ul curent automat si genereaza URL-uri corecte."
      },
      {
        "order": 4,
        "title": "Locale detection, getRequestConfig si optimizari",
        "content": "**getRequestConfig** configureaza next-intl per request — incarca mesajele si locale-ul corespunzator.\n\n**i18n/request.ts:**\n```typescript\nimport { getRequestConfig } from 'next-intl/server';\nimport { routing } from './routing';\n\nexport default getRequestConfig(async ({ requestLocale }) => {\n  let locale = await requestLocale;\n\n  // Valideaza locale-ul:\n  if (!locale || !routing.locales.includes(locale as any)) {\n    locale = routing.defaultLocale;\n  }\n\n  return {\n    locale,\n    messages: (await import(`../../messages/${locale}.json`)).default,\n    // Timezone per locale:\n    timeZone: locale === 'ro' ? 'Europe/Bucharest' : 'UTC',\n    // Format numere per locale:\n    formats: {\n      number: {\n        currency: {\n          style: 'currency',\n          currency: locale === 'ro' ? 'RON' : 'USD',\n        }\n      }\n    }\n  };\n});\n```\n\n**app/[locale]/layout.tsx:**\n```tsx\nimport { NextIntlClientProvider } from 'next-intl';\nimport { getMessages } from 'next-intl/server';\n\nexport default async function LocaleLayout({\n  children,\n  params\n}: {\n  children: React.ReactNode;\n  params: Promise<{ locale: string }>;\n}) {\n  const { locale } = await params;\n  const messages = await getMessages();\n\n  return (\n    <html lang={locale}>\n      <body>\n        <NextIntlClientProvider messages={messages}>\n          {children}\n        </NextIntlClientProvider>\n      </body>\n    </html>\n  );\n}\n```\n\n**Optimizari bundle:**\n```typescript\n// Incarca doar mesajele namespace-ului necesar:\nimport { getTranslations } from 'next-intl/server';\n\nasync function ProductPage() {\n  // Incarca doar namespace-ul 'Product', nu toate mesajele:\n  const t = await getTranslations('Product');\n  return <h1>{t('title')}</h1>;\n}\n```\n\n**Interview tip:** getMessages() in layout.tsx trimite toate mesajele catre NextIntlClientProvider pentru Client Components. getTranslations() in RSC-uri nu necesita Provider — functioneaza direct server-side fara overhead client."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "next-intl routing localePrefix",
        "question": "Ce face optiunea localePrefix: 'as-needed' in configuratia routing-ului next-intl?",
        "options": [
          "Adauga prefixul locale la toate URL-urile",
          "Omite prefixul locale din URL pentru locale-ul implicit (ex: /about in loc de /ro/about) si il pastreaza pentru celelalte (ex: /en/about)",
          "Detecteaza automat locale-ul din browser",
          "Redirecteaza toate URL-urile fara prefix la 404"
        ],
        "answer": "Omite prefixul locale din URL pentru locale-ul implicit (ex: /about in loc de /ro/about) si il pastreaza pentru celelalte (ex: /en/about)",
        "explanation": "as-needed: URL-uri mai curate pentru locale-ul default. always: /ro/about si /en/about consistent. never: fara prefix, locale detectat din cookie/header (nu recomandat pentru SEO). as-needed e cel mai comun in productie.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "ICU pluralizare",
        "question": "Scrie mesajul ICU corect pentru: '0 produse', '1 produs', 'N produse' (N > 1) in fisierul de mesaje JSON.",
        "options": [
          "{count} produs(e)",
          "{count, plural, =0 {Niciun produs} =1 {Un produs} other {# produse}}",
          "{count === 1 ? 'produs' : 'produse'}",
          "plural(count, 'produs', 'produse')"
        ],
        "answer": "{count, plural, =0 {Niciun produs} =1 {Un produs} other {# produse}}",
        "explanation": "ICU Message Format: {variable, type, options}. Pentru plural: =0, =1, other (N>1). # este inlocuit cu valoarea numerica. next-intl: t('products', {count: 5}) → '5 produse'. Romana are reguli de pluralizare complexe: =1, =0 sau many (11-19), other.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "getRequestConfig scop",
        "question": "Ce rol joaca fisierul i18n/request.ts cu getRequestConfig in arhitectura next-intl?",
        "options": [
          "Configureaza middleware-ul de routing",
          "Ruleaza per request server-side: determina locale-ul valid, incarca mesajele corespunzatoare si configureaza timezone si formate per locale",
          "Creeaza API routes pentru schimbarea limbii",
          "Genereaza fisierele de mesaje automat"
        ],
        "answer": "Ruleaza per request server-side: determina locale-ul valid, incarca mesajele corespunzatoare si configureaza timezone si formate per locale",
        "explanation": "getRequestConfig e apelat de next-intl pentru fiecare request server-side. Returneaza: locale validat, messages incarcate din fisier, timezone, formate custom. Fara el, next-intl nu stie ce locale si mesaje sa foloseasca.",
        "difficulty": "hard"
      },
      {
        "number": 4,
        "name": "Link localizat",
        "question": "De ce trebuie sa importi Link din '@/i18n/navigation' si nu din 'next/link' intr-o aplicatie next-intl?",
        "options": [
          "Link din next/link e deprecat",
          "Link-ul din next-intl adauga automat prefixul locale curent la href — /about devine /en/about sau /about in functie de locale, fara cod manual",
          "next/link nu suporta i18n",
          "Performanta e mai buna cu Link-ul next-intl"
        ],
        "answer": "Link-ul din next-intl adauga automat prefixul locale curent la href — /about devine /en/about sau /about in functie de locale, fara cod manual",
        "explanation": "next/link cu href='/about' mereu = /about indiferent de locale. next-intl Link cu href='/about' in locale 'en' = /en/about automat. Fara aceasta abstractizare, ai logi manual de inserare prefix in fiecare Link.",
        "difficulty": "easy"
      },
      {
        "number": 5,
        "name": "Setup next-intl complet",
        "question": "Scrie fisierul middleware.ts complet pentru next-intl cu locales ['ro', 'en'] si defaultLocale 'ro', excludand API routes si fisiere statice.",
        "options": [],
        "answer": "",
        "explanation": "import createMiddleware from 'next-intl/middleware'; import {defineRouting} from 'next-intl/routing'; const routing=defineRouting({locales:['ro','en'],defaultLocale:'ro',localePrefix:'as-needed'}); export default createMiddleware(routing); export const config={matcher:['/((?!api|_next|_vercel|.*\\..*).*)']};",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "useFormatter date",
        "question": "Cum formatezi o data calendaristica si un numar ca valuta RON in doua locale diferite (ro si en) cu next-intl useFormatter?",
        "options": [],
        "answer": "",
        "explanation": "const formattedPrice = format.number(price, {style:'currency',currency:'RON'}); const formattedDate = format.dateTime(createdAt, {dateStyle:'long'}); return <div><span>{formattedPrice}</span><time>{formattedDate}</time></div>;",
        "difficulty": "easy"
      },
      {
        "number": 7,
        "name": "getTranslations RSC",
        "question": "Care este diferenta intre useTranslations (hook) si getTranslations (functie async) in next-intl?",
        "options": [
          "Fac acelasi lucru, sunt alias-uri",
          "useTranslations: hook pentru Client Components si RSC sincron; getTranslations: functie async pentru RSC async, Server Actions si API routes — necesita await",
          "getTranslations functioneaza doar pe server",
          "useTranslations incarca toate mesajele, getTranslations doar un namespace"
        ],
        "answer": "useTranslations: hook pentru Client Components si RSC sincron; getTranslations: functie async pentru RSC async, Server Actions si API routes — necesita await",
        "explanation": "RSC async: const t = await getTranslations('Home'). Client Component: const t = useTranslations('Home'). Server Action: async function action() { const t = await getTranslations('Errors'); return t('required'); }. Nu poti folosi hook-uri in Server Actions.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "Language switcher",
        "question": "Implementeaza un Language Switcher Client Component care permite comutarea intre locale-urile disponibile fara a pierde pagina curenta.",
        "options": [],
        "answer": "",
        "explanation": "import {useRouter,usePathname} from '@/i18n/navigation'; const router=useRouter(); const pathname=usePathname(); const locale=useLocale(); return <select value={locale} onChange={e=>router.replace(pathname,{locale:e.target.value})}>{locales.map(l=><option key={l.code} value={l.code}>{l.label}</option>)}</select>",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "NextIntlClientProvider scop",
        "question": "De ce este necesar NextIntlClientProvider in layout.tsx si ce date primeste?",
        "options": [
          "E necesar pentru RSC-uri",
          "Furnizeaza mesajele de traducere catre Client Components prin React Context — fara el, useTranslations() in Client Components nu poate accesa mesajele incarcate server-side",
          "Configureaza middleware-ul de routing",
          "Genereaza automat fisierele de mesaje"
        ],
        "answer": "Furnizeaza mesajele de traducere catre Client Components prin React Context — fara el, useTranslations() in Client Components nu poate accesa mesajele incarcate server-side",
        "explanation": "RSC-urile acceseaza mesajele direct prin getMessages() server-side. Client Components nu au acces la server — primesc mesajele prin Provider. Optimizare: poti limita mesajele trimise catre client la namespace-urile necesare client-side.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "SEO si hreflang",
        "question": "Ce tag-uri HTML trebuie adaugate in <head> pentru SEO corect intr-o aplicatie Next.js cu i18n?",
        "options": [
          "Niciun tag special nu e necesar",
          "Tag-uri <link rel='alternate' hreflang='x'> pentru fiecare locale disponibil si hreflang='x-default' pentru locale-ul implicit — ajuta Google sa serveasca versiunea corecta utilizatorilor",
          "Doar meta charset='utf-8'",
          "Meta robots='noindex' pentru locale-urile non-default"
        ],
        "answer": "Tag-uri <link rel='alternate' hreflang='x'> pentru fiecare locale disponibil si hreflang='x-default' pentru locale-ul implicit — ajuta Google sa serveasca versiunea corecta utilizatorilor",
        "explanation": "Fara hreflang: Google poate indexa gresit sau penaliza pentru continut duplicat. Cu next-intl: poti genera aceste tag-uri in generateMetadata() folosind getTranslations si routing.locales pentru a construi URL-urile alternate.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "t.rich interpolare",
        "question": "Cum afisezi un mesaj cu text bold inline folosind next-intl, mentinand securitatea (fara dangerouslySetInnerHTML)?",
        "options": [
          "Folosesti dangerouslySetInnerHTML cu HTML din mesaje",
          "Folosesti t.rich('key', { bold: (chunks) => <strong>{chunks}</strong> }) cu mesajul continand <bold>text</bold> — next-intl randeaza tag-urile ca React components sigur",
          "Importezi un parser HTML separat",
          "Splitezi mesajul manual si adaugi tag-uri React"
        ],
        "answer": "Folosesti t.rich('key', { bold: (chunks) => <strong>{chunks}</strong> }) cu mesajul continand <bold>text</bold> — next-intl randeaza tag-urile ca React components sigur",
        "explanation": "Mesaj: 'Termenii nostri <bold>importanti</bold> trebuie acceptati'. t.rich('terms', {bold: c => <strong>{c}</strong>}). next-intl proceseaza tag-urile custom ca React components — nu HTML — deci nu exista risc XSS.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "generateStaticParams locale",
        "question": "Cum generezi rutele statice pentru toate locale-urile in Next.js cu next-intl (ex: /en/about, /fr/about)?",
        "options": [
          "Next.js le genereaza automat",
          "Exportezi generateStaticParams din pagina care returneaza [{locale:'ro'},{locale:'en'},{locale:'fr'}] folosind routing.locales",
          "Folosesti getStaticPaths() din Pages Router",
          "Adaugi fiecare ruta manual in next.config.ts"
        ],
        "answer": "Exportezi generateStaticParams din pagina care returneaza [{locale:'ro'},{locale:'en'},{locale:'fr'}] folosind routing.locales",
        "explanation": "export async function generateStaticParams() { return routing.locales.map(locale => ({locale})); } — Next.js va pre-genera pagina pentru fiecare locale la build time. Esential pentru SSG cu i18n.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Mesaje missing key",
        "question": "Ce se intampla implicit cand un mesaj nu este gasit (key inexistent) cu next-intl si cum poti personaliza comportamentul?",
        "options": [
          "Aplicatia craseaza",
          "In development: arunca eroare vizibila pentru a detecta mesaje lipsa; in productie: randeaza key-ul ca text sau un fallback configurabil prin onError in getRequestConfig",
          "Returneaza string gol",
          "Foloseste automat mesajul in engleza"
        ],
        "answer": "In development: arunca eroare vizibila pentru a detecta mesaje lipsa; in productie: randeaza key-ul ca text sau un fallback configurabil prin onError in getRequestConfig",
        "explanation": "Configurare custom: getRequestConfig returnand onError: (error) => console.warn('Missing key:', error) si getMessageFallback: ({key}) => key. In productie, afisarea cheii in loc de crash e mai buna pentru UX.",
        "difficulty": "hard"
      },
      {
        "number": 14,
        "name": "Server Actions cu traduceri",
        "question": "Scrie o Server Action in Next.js care valideaza un formular si returneaza mesaje de eroare localizate cu next-intl.",
        "options": [],
        "answer": "",
        "explanation": "const t=await getTranslations('Validation'); const errors:Record<string,string>={}; if(!data.name) errors.name=t('required'); if(!data.email) errors.email=t('required'); else if(!data.email.includes('@')) errors.email=t('invalidEmail'); if(Object.keys(errors).length) return {success:false,errors}; return {success:true};",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "Structura mesaje complexe",
        "question": "Creeaza fisierul messages/ro.json cu namespace-urile: Auth (login, register, logout, emailRequired, passwordMin), Navigation (home, courses, profile) si Errors (notFound, serverError, unauthorized).",
        "options": [],
        "answer": "",
        "explanation": "{\"Auth\":{\"login\":\"Autentificare\",\"register\":\"Inregistrare\",\"logout\":\"Deconectare\",\"emailRequired\":\"Emailul este obligatoriu\",\"passwordMin\":\"Parola trebuie sa aiba minim {min} caractere\",\"loginAttempts\":\"{count, plural, =1 {1 incercare ramasa} other {# incercari ramase}}\"},\"Navigation\":{\"home\":\"Acasa\",\"courses\":\"Cursuri\",\"profile\":\"Profil\"},\"Errors\":{\"notFound\":\"Pagina nu a fost gasita\",\"serverError\":\"Eroare server\",\"unauthorized\":\"Nu esti autorizat\"}}",
        "difficulty": "easy"
      }
    ]
  },
  {
    "slug": "nextjs-storybook",
    "title": "33. Storybook cu Next.js",
    "order": 33,
    "theory": [
      {
        "order": 1,
        "title": "Storybook — setup si prima story",
        "content": "**Storybook** este un tool de dezvoltare UI izolata — construiesti si testezi componente individual, fara a rula intreaga aplicatie.\n\n**Instalare in proiect Next.js:**\n```bash\nnpx storybook@latest init\n# Detecteaza automat Next.js si configureaza corect\n# Creeaza .storybook/main.ts si preview.ts\n\nnpm run storybook  # porneste pe http://localhost:6006\n```\n\n**Prima Story — Button.stories.tsx:**\n```tsx\nimport type { Meta, StoryObj } from '@storybook/react';\nimport { Button } from './Button';\n\n// Meta = configuratia generala a story-urilor pentru aceasta componenta:\nconst meta: Meta<typeof Button> = {\n  title: 'UI/Button',        // Calea in sidebar\n  component: Button,\n  tags: ['autodocs'],        // Genereaza documentatie automata\n  argTypes: {\n    variant: {\n      control: { type: 'select' },\n      options: ['primary', 'secondary', 'danger'],\n    },\n    size: {\n      control: { type: 'radio' },\n      options: ['sm', 'md', 'lg'],\n    },\n  },\n};\n\nexport default meta;\ntype Story = StoryObj<typeof Button>;\n\n// Fiecare export = o story (o varianta):\nexport const Primary: Story = {\n  args: { children: 'Click me', variant: 'primary', size: 'md' },\n};\n\nexport const Danger: Story = {\n  args: { children: 'Delete', variant: 'danger' },\n};\n\nexport const Loading: Story = {\n  args: { children: 'Loading...', disabled: true, loading: true },\n};\n```\n\n**Interview tip:** Storybook e standard in echipe mari de frontend. Permite designeri si developeri sa itereze pe UI fara backend. 'autodocs' genereaza documentatie automata din props + JSDoc comments."
      },
      {
        "order": 2,
        "title": "Controls, Actions si Decorators",
        "content": "**Controls** permit modificarea props-urilor in timp real din UI. **Actions** logheaza event handler-urile. **Decorators** wrapeaza stories in context (tema, providers).\n\n**Controls avansate:**\n```tsx\n// Input.stories.tsx:\nconst meta: Meta<typeof Input> = {\n  component: Input,\n  argTypes: {\n    type: { control: 'select', options: ['text', 'email', 'password', 'number'] },\n    label: { control: 'text' },\n    error: { control: 'text' },\n    disabled: { control: 'boolean' },\n    maxLength: { control: { type: 'range', min: 1, max: 500, step: 1 } },\n  },\n};\n\nexport const WithError: Story = {\n  args: { label: 'Email', error: 'Email invalid', value: 'not-an-email' },\n};\n```\n\n**Actions — logarea evenimentelor:**\n```tsx\nimport { fn } from '@storybook/test';\n\nconst meta: Meta<typeof Button> = {\n  component: Button,\n  args: {\n    // fn() creeaza un spy care logheaza apelurile in Actions panel:\n    onClick: fn(),\n    onChange: fn(),\n  },\n};\n```\n\n**Decorators — context providers:**\n```tsx\n// .storybook/preview.ts — decorator global:\nimport { ThemeProvider } from '../src/components/ThemeProvider';\n\nexport const decorators = [\n  (Story) => (\n    <ThemeProvider defaultTheme=\"light\">\n      <div style={{ padding: '2rem' }}>\n        <Story />\n      </div>\n    </ThemeProvider>\n  ),\n];\n\n// Decorator per story:\nexport const DarkMode: Story = {\n  decorators: [(Story) => <div className=\"dark\"><Story /></div>],\n  args: { children: 'Dark button' },\n};\n```\n\n**Interview tip:** fn() din @storybook/test (nu jest.fn()) e recomandat in Storybook 8+. Permite verificarea apelurilor in interaction tests si logare automata in panel-ul Actions."
      },
      {
        "order": 3,
        "title": "Addons — a11y, viewport, backgrounds",
        "content": "**Addons** extind Storybook cu functionalitati suplimentare — accesibilitate, responsive testing, teme.\n\n**Addons esentiale (incluse by default):**\n```bash\n# Storybook init instaleaza automat:\n# @storybook/addon-essentials (controls, actions, viewport, backgrounds, docs)\n# @storybook/addon-a11y — audit de accesibilitate\nnpm install @storybook/addon-a11y\n```\n\n**.storybook/main.ts:**\n```typescript\nimport type { StorybookConfig } from '@storybook/nextjs';\n\nconst config: StorybookConfig = {\n  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],\n  addons: [\n    '@storybook/addon-essentials',\n    '@storybook/addon-a11y',\n    '@storybook/addon-interactions',\n  ],\n  framework: {\n    name: '@storybook/nextjs',\n    options: {},\n  },\n  // Mock-uieste next/image si next/navigation automat!\n};\nexport default config;\n```\n\n**Accessibility addon:**\n```tsx\n// In story, adauga parametri a11y:\nexport const AccessibleForm: Story = {\n  parameters: {\n    a11y: {\n      config: {\n        rules: [{ id: 'color-contrast', enabled: true }],\n      },\n    },\n  },\n};\n// Panelul Accessibility arata automat violatile axe-core:\n// Missing alt text, insufficient color contrast, missing form labels, etc.\n```\n\n**Viewport pentru responsive testing:**\n```tsx\nexport const Mobile: Story = {\n  parameters: {\n    viewport: { defaultViewport: 'mobile1' },  // 320px\n  },\n};\n\nexport const Tablet: Story = {\n  parameters: {\n    viewport: { defaultViewport: 'tablet' },   // 768px\n  },\n};\n```\n\n**Interview tip:** @storybook/nextjs framework mock-uieste automat next/image, next/navigation, next/font — nu ai nevoie de mock manual. Testarea accesibilitatii cu addon-a11y in Storybook gaseste 30-40% din problemele a11y automat."
      },
      {
        "order": 4,
        "title": "Chromatic — visual regression testing",
        "content": "**Chromatic** (de la creatorul Storybook) ofera visual regression testing automat — detecteaza modificari vizuale neintentionate in componente.\n\n**Setup Chromatic:**\n```bash\nnpm install --save-dev chromatic\n\n# Prima rulare — stabileste baseline:\nnpx chromatic --project-token=<YOUR_TOKEN>\n\n# In CI/CD (GitHub Actions):\n# chromatic --project-token=$CHROMATIC_PROJECT_TOKEN\n```\n\n**GitHub Actions workflow:**\n```yaml\n# .github/workflows/chromatic.yml:\nname: Chromatic\non: push\njobs:\n  chromatic:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n        with:\n          fetch-depth: 0   # Necesar pentru Chromatic TurboSnap\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - run: npm ci\n      - uses: chromaui/action@latest\n        with:\n          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}\n          exitZeroOnChanges: true  # Nu esua CI la schimbari detectate\n```\n\n**Workflow Chromatic:**\n```\n1. Chromatic ruleaza Storybook si face screenshot fiecarei stories\n2. Compara cu baseline (ultima build aprobata)\n3. Daca detecteaza diferente vizuale → creeaza PR review in Chromatic UI\n4. Designerul/developerul aproba sau resinge schimbarile\n5. La aprobare → noua baseline e salvata\n```\n\n**Story-level controls Chromatic:**\n```tsx\nexport const ButtonStory: Story = {\n  parameters: {\n    chromatic: {\n      // Fa screenshot in multiple viewporturi:\n      viewports: [320, 768, 1200],\n      // Dezactiveaza pentru animatii (evita false positives):\n      pauseAnimationAtEnd: true,\n    },\n  },\n};\n```\n\n**Interview tip:** Chromatic TurboSnap (fetch-depth: 0 necesar) testeaza DOAR story-urile ale caror componente s-au schimbat — reduce costul drastically in repo-uri mari. Free tier: 5000 snapshots/luna."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Storybook beneficii",
        "question": "Ce problema principala rezolva Storybook in dezvoltarea de frontend?",
        "options": [
          "Reduce bundle size-ul aplicatiei",
          "Permite dezvoltarea si testarea componentelor in izolare, independent de pagini/backend — fiecare stare posibila a componentei e documentata si testabila individual",
          "Inlocuieste testing framework-urile clasice",
          "Genereaza cod CSS automat"
        ],
        "answer": "Permite dezvoltarea si testarea componentelor in izolare, independent de pagini/backend — fiecare stare posibila a componentei e documentata si testabila individual",
        "explanation": "Fara Storybook: pentru a vedea un button in stare 'loading + error', trebuie sa reproduci manual contextul in aplicatie. Cu Storybook: export const LoadingError: Story = { args: {loading:true, error:'...'} } — instant vizibil.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "Story structure",
        "question": "Intr-o Story, ce reprezinta 'args' si cum interactioneaza cu 'controls'?",
        "options": [
          "Args sunt props hardcodate care nu pot fi schimbate",
          "Args definesc valorile initiale ale props-urilor componentei; Controls genereaza automat un panou UI in Storybook bazat pe argTypes, permitand modificarea args in timp real",
          "Args sunt echivalentul state-ului local",
          "Controls trebuie definite manual pentru fiecare arg"
        ],
        "answer": "Args definesc valorile initiale ale props-urilor componentei; Controls genereaza automat un panou UI in Storybook bazat pe argTypes, permitand modificarea args in timp real",
        "explanation": "args: { variant: 'primary' } = valoarea default a story-ului. argTypes: { variant: { control: 'select', options: ['primary','secondary'] } } = cum arata controlul in UI. Storybook infereeaza controlul din TypeScript types automat.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "Decorators scop",
        "question": "Cand trebuie sa folosesti un Decorator in Storybook?",
        "options": [
          "Intotdeauna, pentru orice componenta",
          "Cand componenta necesita un context extern (Provider de tema, router, i18n, auth) care nu e inclus in componenta insasi — Decorator wrapeaza story-ul in contextul necesar",
          "Doar pentru componente care folosesc hooks",
          "Cand vrei sa adaugi CSS global"
        ],
        "answer": "Cand componenta necesita un context extern (Provider de tema, router, i18n, auth) care nu e inclus in componenta insasi — Decorator wrapeaza story-ul in contextul necesar",
        "explanation": "ThemeProvider, NextIntlClientProvider, AuthContext — toate trebuie prezente pentru ca componenta sa randereze corect. Decorator global in preview.ts aplica wrapping-ul tuturor story-urilor. Decorator per story pentru cazuri speciale.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "Chromatic visual testing",
        "question": "Ce este visual regression testing cu Chromatic si ce problema rezolva?",
        "options": [
          "Testeaza performanta componentelor",
          "Face screenshot-uri ale componentelor si detecteaza automat modificari vizuale neintentionate intre commit-uri — previne bug-uri de UI care nu sunt prinse de teste functionale",
          "Genereaza automat teste de accesibilitate",
          "Verifica ca props-urile au tipurile corecte"
        ],
        "answer": "Face screenshot-uri ale componentelor si detecteaza automat modificari vizuale neintentionate intre commit-uri — previne bug-uri de UI care nu sunt prinse de teste functionale",
        "explanation": "Exemplu: schimbi un CSS global care afecteaza 20 de componente. Unit tests: toate tree. Chromatic: detecteaza vizual ca button-ul s-a miscat 2px sau ca culoarea s-a schimbat usor — problema invizibila in code review.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "Story Card componenta",
        "question": "Scrie un fisier de stories complet pentru un component Card cu props: title (string), description (string), imageUrl (string optional), variant ('default'|'featured'), onClick (functie).",
        "options": [],
        "answer": "",
        "explanation": "const meta: Meta<typeof Card> = {component:Card, tags:['autodocs'], argTypes:{variant:{control:'select',options:['default','featured']}}, args:{onClick:fn()}}; export const Default:Story={args:{title:'Card Title',description:'Desc',variant:'default'}}; export const Featured:Story={args:{...Default.args,variant:'featured'}}",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "addon-a11y utilizare",
        "question": "Ce tip de probleme de accesibilitate detecteaza addon-ul @storybook/addon-a11y automat?",
        "options": [
          "Erori TypeScript in componente",
          "Violatii axe-core: contrast culori insuficient, imagini fara alt text, elemente interactive fara label, structura heading incorecta, ARIA attributes gresite",
          "Probleme de performanta React",
          "CSS invalid"
        ],
        "answer": "Violatii axe-core: contrast culori insuficient, imagini fara alt text, elemente interactive fara label, structura heading incorecta, ARIA attributes gresite",
        "explanation": "axe-core e motorul de accesibilitate de la Deque — acelasi folosit de browserele moderne si de Lighthouse. addon-a11y ruleaza axe-core pe fiecare story si afiseaza violatiile cu severitate (critical, serious, moderate) si link la documentatie.",
        "difficulty": "easy"
      },
      {
        "number": 7,
        "name": "MSW in Storybook",
        "question": "Cum poti mock-ui fetch request-uri in Storybook folosind MSW (Mock Service Worker)?",
        "options": [
          "Nu poti mock-ui requests in Storybook",
          "Instalezi msw-storybook-addon, configurezi MSW handlers in parameters.msw.handlers per story — Storybook ruleaza un Service Worker care intercepteaza request-urile reale",
          "Modifici direct variabilele de mediu",
          "Folosesti jest.mock() in fisierele de stories"
        ],
        "answer": "Instalezi msw-storybook-addon, configurezi MSW handlers in parameters.msw.handlers per story — Storybook ruleaza un Service Worker care intercepteaza request-urile reale",
        "explanation": "parameters: { msw: { handlers: [ http.get('/api/users', () => HttpResponse.json([{id:1, name:'Cristi'}])) ] } } — story-ul face fetch real la /api/users dar MSW il intercepteaza si returneaza datele mock. Fara backend.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "Interaction tests",
        "question": "Scrie o story cu interaction test pentru un FormInput care: randeaza un input, utilizatorul tasteaza 'test@email.com', apasa Enter si verifica ca onChange a fost apelat cu valoarea corecta.",
        "options": [],
        "answer": "",
        "explanation": "play: async({canvasElement,args})=>{const canvas=within(canvasElement); const input=canvas.getByRole('textbox'); await userEvent.type(input,'test@email.com'); await userEvent.keyboard('{Enter}'); await expect(args.onChange).toHaveBeenCalledWith('test@email.com');}",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "@storybook/nextjs framework",
        "question": "Ce avantaj ofera framework-ul @storybook/nextjs fata de configurarea manuala a Storybook cu webpack?",
        "options": [
          "Nu exista avantaje semnificative",
          "Mock-uieste automat next/image, next/navigation, next/font, suporta App Router components si foloseste acelasi webpack/turbopack config ca Next.js — zero configurare manuala",
          "Adauga automat toate addons-urile",
          "Genereaza stories automat din pagini"
        ],
        "answer": "Mock-uieste automat next/image, next/navigation, next/font, suporta App Router components si foloseste acelasi webpack/turbopack config ca Next.js — zero configurare manuala",
        "explanation": "Fara @storybook/nextjs: Image din next/image craseaza in Storybook (nu exista next server), useRouter() din next/navigation nu functioneaza. Cu framework: toate mock-uite automat. Suporta si RSC cu @storybook/experimental-nextjs-vite.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "autodocs generare",
        "question": "Ce genereaza tag-ul 'autodocs' in Meta unei story si cum se acceseza in Storybook?",
        "options": [
          "Genereaza teste automate",
          "Genereaza o pagina de documentatie automata cu: descrierea componentei, tabel de props (din TypeScript types), stories embedded si controls interactive — accesibila pe route-ul 'Docs' in sidebar",
          "Genereaza fisiere .d.ts pentru componenta",
          "Publica automata componentele pe npm"
        ],
        "answer": "Genereaza o pagina de documentatie automata cu: descrierea componentei, tabel de props (din TypeScript types), stories embedded si controls interactive — accesibila pe route-ul 'Docs' in sidebar",
        "explanation": "JSDoc comments pe componenta si props sunt incluse automat in documentatie. argTypes pot adauga descriptii manuale. autodocs e ideal pentru component libraries — elimina nevoia de a scrie MDX manual pentru componente simple.",
        "difficulty": "easy"
      },
      {
        "number": 11,
        "name": "Chromatic TurboSnap",
        "question": "Ce este TurboSnap in Chromatic si cum reduce costul de testare?",
        "options": [
          "Un addon Storybook pentru performanta",
          "Analizeaza ce fisiere s-au schimbat intre commit-uri si testeaza DOAR story-urile ale caror dependente s-au modificat — reduce numarul de snapshots facute si implicit costul",
          "Comprima screenshot-urile automat",
          "Paralelizeaza snapshot-urile pe mai multi agenti"
        ],
        "answer": "Analizeaza ce fisiere s-au schimbat intre commit-uri si testeaza DOAR story-urile ale caror dependente s-au modificat — reduce numarul de snapshots facute si implicit costul",
        "explanation": "100 componente: fara TurboSnap = 100 snapshots per commit. Cu TurboSnap: daca ai modificat 3 componente, Chromatic testeaza DOAR story-urile celor 3 + dependentele. Necesita fetch-depth: 0 in git checkout pentru acces la git history.",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "Global decorators preview",
        "question": "Configureaza .storybook/preview.ts pentru a adauga: un decorator global cu ThemeProvider, viewport-uri custom (mobile: 375px, tablet: 768px, desktop: 1440px) si background-uri custom (alb si gri).",
        "options": [],
        "answer": "",
        "explanation": "decorators:[(Story)=>React.createElement(ThemeProvider,{},React.createElement(Story))]; parameters:{viewport:{viewports:{mobile:{name:'Mobile',styles:{width:'375px',height:'667px'}},tablet:{...768...},desktop:{...1440...}}},backgrounds:{values:[{name:'white',value:'#fff'},{name:'gray',value:'#f5f5f5'}]}}",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Stories pentru formulare",
        "question": "Care este abordarea corecta pentru a testa un formular cu validare in Storybook?",
        "options": [
          "Nu poti testa formulare in Storybook",
          "Folosesti Interaction Tests (play function cu userEvent) pentru a simula completarea formularului si verifici cu expect() ca validarile apar corect si ca onSubmit e apelat cu datele corecte",
          "Testezi formulare doar in Jest/Vitest",
          "Adaugi manual stories pentru fiecare stare de validare"
        ],
        "answer": "Folosesti Interaction Tests (play function cu userEvent) pentru a simula completarea formularului si verifici cu expect() ca validarile apar corect si ca onSubmit e apelat cu datele corecte",
        "explanation": "play function: await userEvent.type(input, 'invalid'); await userEvent.click(submitBtn); await expect(canvas.getByText('Email invalid')).toBeInTheDocument(). Storybook ruleaza aceste interactiuni in browser real — mai realist decat JSDOM.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Storybook build si deploy",
        "question": "Cum publici Storybook ca site static si care este un host potrivit?",
        "options": [
          "Storybook nu poate fi publicat",
          "npm run build-storybook genereaza fisiere statice in /storybook-static; publici pe Chromatic (integrat), Netlify, Vercel sau GitHub Pages — util pentru review cu design team",
          "Trebuie un server Node.js dedicat",
          "Doar Chromatic poate hosta Storybook"
        ],
        "answer": "npm run build-storybook genereaza fisiere statice in /storybook-static; publici pe Chromatic (integrat), Netlify, Vercel sau GitHub Pages — util pentru review cu design team",
        "explanation": "npx chromatic --project-token=X publica automat pe Chromatic cu review UI. Alternativ: npx storybook build → storybook-static/ → deploy ca orice site static. Link sharable cu designeri/PM fara acces la cod.",
        "difficulty": "easy"
      },
      {
        "number": 15,
        "name": "Component-Driven Development",
        "question": "Explica conceptul de Component-Driven Development (CDD) si cum Storybook il faciliteaza.",
        "options": [
          "CDD inseamna sa construiesti mai intai backend-ul",
          "CDD: construiesti UI bottom-up, incepand cu componente atomice (Button, Input) pana la organisme (Form, Card) si pagini — Storybook ofera sandbox izolat pentru fiecare nivel, documentatie vie si testare vizuala/functionala",
          "CDD inseamna sa folosesti React Class Components",
          "CDD este un pattern de state management"
        ],
        "answer": "CDD: construiesti UI bottom-up, incepand cu componente atomice (Button, Input) pana la organisme (Form, Card) si pagini — Storybook ofera sandbox izolat pentru fiecare nivel, documentatie vie si testare vizuala/functionala",
        "explanation": "Atomic Design + CDD: Atoms (Button) → Molecules (SearchBar = Input+Button) → Organisms (Header = Nav+SearchBar+Logo) → Templates → Pages. Storybook ofera vizibilitate la fiecare nivel. Design system-urile mari (Shopify Polaris, GitHub Primer) sunt construite asa.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "nextjs-testing-complet",
    "title": "34. Next.js Testing complet",
    "order": 34,
    "theory": [
      {
        "order": 1,
        "title": "Vitest si React Testing Library — setup si unit tests",
        "content": "**Vitest** e test runner-ul modern pentru proiecte Vite/Next.js — mai rapid decat Jest, compatibil cu API-ul Jest.\n\n**Instalare in Next.js:**\n```bash\nnpm install --save-dev vitest @vitejs/plugin-react jsdom\nnpm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event\n```\n\n**vitest.config.ts:**\n```typescript\nimport { defineConfig } from 'vitest/config';\nimport react from '@vitejs/plugin-react';\nimport { resolve } from 'path';\n\nexport default defineConfig({\n  plugins: [react()],\n  test: {\n    environment: 'jsdom',\n    setupFiles: './vitest.setup.ts',\n    globals: true,\n  },\n  resolve: {\n    alias: { '@': resolve(__dirname, './src') },\n  },\n});\n```\n\n**vitest.setup.ts:**\n```typescript\nimport '@testing-library/jest-dom';\n```\n\n**Primul test — componenta Button:**\n```tsx\n// Button.test.tsx:\nimport { render, screen } from '@testing-library/react';\nimport userEvent from '@testing-library/user-event';\nimport { Button } from './Button';\n\ndescribe('Button', () => {\n  it('randeaza textul corect', () => {\n    render(<Button>Click me</Button>);\n    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();\n  });\n\n  it('apeleaza onClick la click', async () => {\n    const onClick = vi.fn();\n    render(<Button onClick={onClick}>Click</Button>);\n    await userEvent.click(screen.getByRole('button'));\n    expect(onClick).toHaveBeenCalledOnce();\n  });\n\n  it('e dezactivat cand disabled=true', () => {\n    render(<Button disabled>Disabled</Button>);\n    expect(screen.getByRole('button')).toBeDisabled();\n  });\n});\n```\n\n**Interview tip:** Testing Library promoveaza testarea din perspectiva utilizatorului — getByRole, getByLabelText, getByText in loc de getById sau getByClassName. Testele care testeaza comportament (nu implementare) supravietuiesc refactoring-ului."
      },
      {
        "order": 2,
        "title": "Testing Server Components, Actions si API Routes",
        "content": "Testarea componentelor Next.js specifice necesita abordari diferite.\n\n**Testing Server Components cu Vitest:**\n```tsx\n// UserProfile.test.tsx:\nimport { render, screen } from '@testing-library/react';\nimport { UserProfile } from './UserProfile';\n\n// Mock fetch global:\nvi.stubGlobal('fetch', vi.fn());\n\ndescribe('UserProfile (RSC)', () => {\n  it('afiseaza datele utilizatorului', async () => {\n    // Mock fetch response:\n    vi.mocked(fetch).mockResolvedValueOnce({\n      ok: true,\n      json: async () => ({ name: 'Cristi', email: 'cristi@test.com' }),\n    } as Response);\n\n    // RSC e async — await render:\n    render(await UserProfile({ userId: '1' }));\n\n    expect(screen.getByText('Cristi')).toBeInTheDocument();\n    expect(screen.getByText('cristi@test.com')).toBeInTheDocument();\n  });\n});\n```\n\n**Testing Server Actions:**\n```typescript\n// createTask.test.ts:\nimport { createTask } from './actions';\nimport { prisma } from '@/lib/prisma';\n\nvi.mock('@/lib/prisma', () => ({\n  prisma: { task: { create: vi.fn() } },\n}));\n\ndescribe('createTask action', () => {\n  it('creeaza task si returneaza success', async () => {\n    vi.mocked(prisma.task.create).mockResolvedValueOnce({ id: '1', title: 'Test' } as any);\n\n    const result = await createTask({ title: 'Test Task', userId: 'user1' });\n\n    expect(result.success).toBe(true);\n    expect(prisma.task.create).toHaveBeenCalledWith({\n      data: { title: 'Test Task', userId: 'user1' },\n    });\n  });\n\n  it('returneaza eroare la title gol', async () => {\n    const result = await createTask({ title: '', userId: 'user1' });\n    expect(result.success).toBe(false);\n    expect(result.error).toBe('Title este obligatoriu');\n  });\n});\n```\n\n**Interview tip:** Mock-uieste dependentele externe (Prisma, fetch, auth) in unit tests — vrei sa testezi logica actiunii, nu baza de date reala. Integration tests si E2E testeaza stack-ul complet."
      },
      {
        "order": 3,
        "title": "MSW (Mock Service Worker) pentru API mocking",
        "content": "**MSW** intercepteaza request-uri HTTP la nivelul Service Worker — mock-uri realiste care functioneaza in browser si Node.js.\n\n**Instalare si setup:**\n```bash\nnpm install --save-dev msw\nnpx msw init public/ --save  # creeaza public/mockServiceWorker.js\n```\n\n**Definire handlers:**\n```typescript\n// src/mocks/handlers.ts:\nimport { http, HttpResponse } from 'msw';\n\nexport const handlers = [\n  http.get('/api/users', () => {\n    return HttpResponse.json([\n      { id: '1', name: 'Cristi', email: 'cristi@test.com' },\n      { id: '2', name: 'Ana', email: 'ana@test.com' },\n    ]);\n  }),\n\n  http.post('/api/users', async ({ request }) => {\n    const body = await request.json();\n    return HttpResponse.json({ id: '3', ...body as object }, { status: 201 });\n  }),\n\n  http.get('/api/users/:id', ({ params }) => {\n    if (params.id === '999') {\n      return new HttpResponse(null, { status: 404 });\n    }\n    return HttpResponse.json({ id: params.id, name: 'User' });\n  }),\n];\n```\n\n**Setup server pentru Vitest (Node.js):**\n```typescript\n// src/mocks/server.ts:\nimport { setupServer } from 'msw/node';\nimport { handlers } from './handlers';\n\nexport const server = setupServer(...handlers);\n\n// vitest.setup.ts:\nimport { server } from './src/mocks/server';\n\nbeforeAll(() => server.listen({ onUnhandledRequest: 'error' }));\nafterEach(() => server.resetHandlers());  // Reset handler overrides\nafterAll(() => server.close());\n```\n\n**Override per test:**\n```typescript\nit('afiseaza eroare la 500', async () => {\n  server.use(\n    http.get('/api/users', () => {\n      return new HttpResponse(null, { status: 500 });\n    })\n  );\n  render(<UserList />);\n  await screen.findByText('Eroare la incarcarea utilizatorilor');\n});\n```\n\n**Interview tip:** MSW e mai bun decat vi.mock('fetch') — intercepteaza la nivel de retea, nu mock-uieste implementarea. Acelasi handler functioneaza in browser (development), Storybook si Vitest — single source of truth pentru API mocks."
      },
      {
        "order": 4,
        "title": "Playwright E2E Testing — teste de integrare reale",
        "content": "**Playwright** ruleaza teste in browsere reale (Chrome, Firefox, Safari) — valideaza ca intreaga aplicatie functioneaza end-to-end.\n\n**Instalare si setup:**\n```bash\nnpm install --save-dev @playwright/test\nnpx playwright install  # instaleaza browsere\n```\n\n**playwright.config.ts:**\n```typescript\nimport { defineConfig, devices } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './e2e',\n  fullyParallel: true,\n  forbidOnly: !!process.env.CI,\n  retries: process.env.CI ? 2 : 0,\n  workers: process.env.CI ? 1 : undefined,\n  reporter: 'html',\n  use: {\n    baseURL: 'http://localhost:3000',\n    trace: 'on-first-retry',\n  },\n  projects: [\n    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },\n    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },\n    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },\n  ],\n  webServer: {\n    command: 'npm run dev',\n    url: 'http://localhost:3000',\n    reuseExistingServer: !process.env.CI,\n  },\n});\n```\n\n**Test E2E — flow autentificare:**\n```typescript\n// e2e/auth.spec.ts:\nimport { test, expect } from '@playwright/test';\n\ntest.describe('Autentificare', () => {\n  test('login cu credentiale corecte', async ({ page }) => {\n    await page.goto('/login');\n\n    await page.fill('[data-testid=email]', 'test@example.com');\n    await page.fill('[data-testid=password]', 'parola123');\n    await page.click('[data-testid=submit-btn]');\n\n    // Asteapta redirectare dupa login:\n    await expect(page).toHaveURL('/dashboard');\n    await expect(page.locator('h1')).toContainText('Bun venit');\n  });\n\n  test('eroare cu credentiale gresite', async ({ page }) => {\n    await page.goto('/login');\n    await page.fill('[data-testid=email]', 'wrong@test.com');\n    await page.fill('[data-testid=password]', 'gresit');\n    await page.click('[data-testid=submit-btn]');\n\n    await expect(page.getByText('Credentiale invalide')).toBeVisible();\n    await expect(page).toHaveURL('/login');  // Ramanem pe login\n  });\n});\n```\n\n**Interview tip:** Playwright Page Object Model (POM) — encapsuleaza selectori si actiuni per pagina intr-o clasa. DRY, maintainabil. npx playwright codegen http://localhost:3000 genereaza cod de test automat in timp ce navighezi."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Vitest vs Jest",
        "question": "De ce este Vitest preferat Jest in proiecte Next.js moderne?",
        "options": [
          "Jest nu suporta TypeScript",
          "Vitest foloseste esbuild/Vite pentru transformare — semnificativ mai rapid, zero configurare pentru TypeScript/ESM, API compatibil cu Jest, HMR pentru teste",
          "Vitest are mai multe matchers",
          "Jest nu poate testa React components"
        ],
        "answer": "Vitest foloseste esbuild/Vite pentru transformare — semnificativ mai rapid, zero configurare pentru TypeScript/ESM, API compatibil cu Jest, HMR pentru teste",
        "explanation": "Jest necesita babel/ts-jest pentru TypeScript, configuratie separata pentru ESM modules. Vitest: zero config pentru TS+ESM, 10x mai rapid la startup, --watch cu HMR relanseaza doar testele afectate de modificari.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "Testing Library principiu",
        "question": "Care este principiul fundamental al React Testing Library si cum influenteaza modul de scriere a testelor?",
        "options": [
          "Testeaza implementarea interna a componentei",
          "Testeaza comportamentul din perspectiva utilizatorului final — interactii cu DOM-ul prin role, label, text; nu testeaza state intern, class names sau structura componentei",
          "Maximizeaza code coverage prin testare exhaustiva",
          "Testeaza exclusiv hook-uri React"
        ],
        "answer": "Testeaza comportamentul din perspectiva utilizatorului final — interactii cu DOM-ul prin role, label, text; nu testeaza state intern, class names sau structura componentei",
        "explanation": "getByRole('button', {name:'Submit'}) > getById('submit-btn') > wrapper.find(Button). Testul din perspectiva utilizatorului supravietuieste refactoring-ului: poti redenumi ID-uri, schimba structura interna — testul ramane valid daca comportamentul e acelasi.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "MSW avantaje",
        "question": "Care este avantajul principal al MSW fata de vi.mock() pentru mock-area fetch() in teste?",
        "options": [
          "MSW e mai usor de configurat",
          "MSW intercepteaza la nivel de retea (Service Worker/Node http interceptor) — testele nu stiu ca fetch e mock-uit, acelasi handler functioneaza in browser+Storybook+Vitest si testeaza headers/body real",
          "MSW suporta mai multe tipuri de request-uri",
          "vi.mock() nu poate mock-ui fetch"
        ],
        "answer": "MSW intercepteaza la nivel de retea (Service Worker/Node http interceptor) — testele nu stiu ca fetch e mock-uit, acelasi handler functioneaza in browser+Storybook+Vitest si testeaza headers/body real",
        "explanation": "vi.mock('fetch'): inlocuieste implementarea JS — brittle, diferit intre browsere. MSW: intercepteaza request-ul real HTTP inainte de a pleca — componenta face fetch() normal, MSW returneaza raspunsul mock. Real network boundary = teste mai fidele.",
        "difficulty": "hard"
      },
      {
        "number": 4,
        "name": "Playwright vs Cypress",
        "question": "Ce avantaje ofera Playwright fata de Cypress pentru E2E testing?",
        "options": [
          "Cypress are mai multe features",
          "Playwright testeaza nativ Chrome, Firefox si Safari (WebKit); suporta multiple tabs/origins/users in acelasi test; mai rapid; nu necesita Cypress Cloud pentru CI paralel",
          "Playwright e open source, Cypress nu",
          "Playwright are o interfata grafica mai buna"
        ],
        "answer": "Playwright testeaza nativ Chrome, Firefox si Safari (WebKit); suporta multiple tabs/origins/users in acelasi test; mai rapid; nu necesita Cypress Cloud pentru CI paralel",
        "explanation": "Cypress: excelent DX, time-travel debugging, dar limitat la un browser odata, un origin per test (desi imbunatatit). Playwright: cross-browser nativ, multiple contexts (test multi-user), mai rapid in CI, gratuit nelimitat.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "Test componenta cu hook",
        "question": "Scrie un test Vitest + Testing Library pentru un hook custom useCounter care expune count, increment si decrement.",
        "options": [],
        "answer": "",
        "explanation": "renderHook(()=>useCounter()): result.current.count===0. act(()=>result.current.increment()): result.current.count===1. act(()=>result.current.decrement()): 0. renderHook(()=>useCounter(10)): result.current.count===10.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "Mock Prisma in teste",
        "question": "Scrie setup-ul complet pentru a mock-ui Prisma in Vitest, incluzand modulul mock si o utilizare in test.",
        "options": [],
        "answer": "",
        "explanation": "vi.mock('@/lib/prisma',()=>({prisma:{user:{findUnique:vi.fn()}}})); import {prisma} from '@/lib/prisma'; vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({id:'1',name:'Cristi'}); const user=await getUserById('1'); expect(user.name).toBe('Cristi'); expect(prisma.user.findUnique).toHaveBeenCalledWith({where:{id:'1'}});",
        "difficulty": "hard"
      },
      {
        "number": 7,
        "name": "Playwright codegen",
        "question": "Ce face comanda 'npx playwright codegen http://localhost:3000' si cand e utila?",
        "options": [
          "Ruleaza toate testele existente",
          "Deschide browserul si genereaza automat cod de test Playwright in timp ce navighezi manual — rapid pentru a crea teste de baza fara a cunoaste API-ul Playwright",
          "Genereaza rapoarte HTML din rezultatele testelor",
          "Instaleaza browserele necesare Playwright"
        ],
        "answer": "Deschide browserul si genereaza automat cod de test Playwright in timp ce navighezi manual — rapid pentru a crea teste de baza fara a cunoaste API-ul Playwright",
        "explanation": "Codegen: click pe un element → genereaza page.click('[data-testid=btn]'). Fill un input → genereaza page.fill('#email', 'test'). Inspector panel arata selectori alternativi. Cod generat e un punct de start bun, necesita review si imbunatatire.",
        "difficulty": "easy"
      },
      {
        "number": 8,
        "name": "MSW handler override",
        "question": "Scrie un test Vitest cu MSW care testeaza comportamentul componentei UserList cand API-ul returneaza 500 (eroare server) — override handler-ul default.",
        "options": [],
        "answer": "",
        "explanation": "server.use(http.get('/api/users',()=>new HttpResponse(null,{status:500}))); render(<UserList/>); const errorMsg=await screen.findByText(/eroare/i); expect(errorMsg).toBeInTheDocument(); // findByText asteapta async randarile",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "Playwright Page Object Model",
        "question": "Ce este Page Object Model (POM) in Playwright si cum imbunatateste mentinabilitatea testelor E2E?",
        "options": [
          "Un design pattern pentru RSC-uri",
          "Incapsuleaza selectori si actiuni specifice unei pagini intr-o clasa — testele apeleaza metode de business (loginPage.fillCredentials(), loginPage.submit()) in loc de selectori duri — schimbarea unui selector se face intr-un singur loc",
          "Un addon Playwright pentru generare de mock-uri",
          "O metoda de a rula teste in paralel"
        ],
        "answer": "Incapsuleaza selectori si actiuni specifice unei pagini intr-o clasa — testele apeleaza metode de business (loginPage.fillCredentials(), loginPage.submit()) in loc de selectori duri — schimbarea unui selector se face intr-un singur loc",
        "explanation": "class LoginPage { fill(email,pass) { this.page.fill('#email',email) } submit() { this.page.click('[type=submit]') } }. Test: await loginPage.fill('a@b.com','pass'); await loginPage.submit(). Daca schimbi #email in data-testid=email-input, schimbi DOAR in POM, nu in toate testele.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Code coverage Vitest",
        "question": "Cum configurezi code coverage in Vitest si ce praguri ar trebui sa setezi pentru un proiect productie?",
        "options": [
          "Vitest nu suporta code coverage",
          "npm install @vitest/coverage-v8; vitest.config.ts: coverage: { provider: 'v8', reporter: ['text','html'], thresholds: { lines: 80, functions: 80, branches: 70 } }; rulezi cu vitest run --coverage",
          "Folosesti Istanbul separat de Vitest",
          "Code coverage se seteaza in package.json"
        ],
        "answer": "npm install @vitest/coverage-v8; vitest.config.ts: coverage: { provider: 'v8', reporter: ['text','html'], thresholds: { lines: 80, functions: 80, branches: 70 } }; rulezi cu vitest run --coverage",
        "explanation": "Praguri comune: 80% lines/functions, 70% branches. 100% e rar realist si poate incuraja teste superficiale. HTML reporter genereaza raport vizual cu linii acoperite. CI: --coverage --reporter=json pentru integrare cu Codecov/Coveralls.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "Testing forms cu user-event",
        "question": "Scrie un test complet pentru un formular de login (email + password + submit) care verifica: afisarea erorii pentru email gol si apelarea onSubmit cu datele corecte.",
        "options": [],
        "answer": "",
        "explanation": "test eroare: render(<LoginForm onSubmit={vi.fn()}/>); await userEvent.click(screen.getByRole('button',{name:/submit/i})); expect(screen.getByText('Email obligatoriu')).toBeInTheDocument(). test submit: const onSubmit=vi.fn(); render(<LoginForm onSubmit={onSubmit}/>); await userEvent.type(screen.getByLabelText('Email'),'a@b.com'); await userEvent.type(screen.getByLabelText('Parola'),'pass123'); await userEvent.click(screen.getByRole('button')); expect(onSubmit).toHaveBeenCalledWith('a@b.com','pass123');",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "E2E Playwright API mock",
        "question": "Cum mock-ui request-uri API in teste Playwright pentru a evita dependenta de un backend real?",
        "options": [
          "Nu poti mock-ui in Playwright",
          "Folosesti page.route() sau page.routeFromHAR() pentru a intercepta si mock-ui request-uri HTTP in browser — page.route('/api/users', route => route.fulfill({json:[...]}))",
          "Folosesti MSW in Playwright",
          "Configurezi un server separat de mock in playwright.config.ts"
        ],
        "answer": "Folosesti page.route() sau page.routeFromHAR() pentru a intercepta si mock-ui request-uri HTTP in browser — page.route('/api/users', route => route.fulfill({json:[...]}))",
        "explanation": "await page.route('**/api/users', route => route.fulfill({status:200, json:[{id:1,name:'Test'}]})); await page.goto('/users'); await expect(page.getByText('Test')).toBeVisible(). Alternativ: record real traffic cu page.routeFromHAR() pentru replay.",
        "difficulty": "hard"
      },
      {
        "number": 13,
        "name": "Testing async RSC",
        "question": "Ce particularitate au React Server Components (async) in testare cu Vitest si cum le testezi corect?",
        "options": [
          "RSC-urile nu pot fi testate cu Vitest",
          "RSC-urile async trebuie await-ate inainte de render: render(await MyRSC({userId:'1'})) — trebuie mock-uite fetch, prisma sau alte dependente server-side folosite in componenta",
          "Folosesti un test runner special pentru RSC",
          "RSC-urile se testeaza doar cu Playwright"
        ],
        "answer": "RSC-urile async trebuie await-ate inainte de render: render(await MyRSC({userId:'1'})) — trebuie mock-uite fetch, prisma sau alte dependente server-side folosite in componenta",
        "explanation": "async function UserCard({id}) { const user = await fetchUser(id); return <div>{user.name}</div>; }. Test: vi.mock('./fetchUser', ()=>({fetchUser: vi.fn().mockResolvedValue({name:'Cristi'})})); render(await UserCard({id:'1'})); expect(screen.getByText('Cristi')).toBeInTheDocument().",
        "difficulty": "hard"
      },
      {
        "number": 14,
        "name": "Test pyramid Next.js",
        "question": "Care este distributia recomandata a tipurilor de teste intr-un proiect Next.js (test pyramid)?",
        "options": [
          "100% teste E2E — testeaza totul real",
          "Predominant unit tests (60-70%): componente, hooks, utils; teste de integrare (20-30%): fluxuri cu MSW; putine E2E (10%): scenarii critice (login, checkout) — echilibru cost/valoare",
          "50% unit, 50% E2E — fara integrare",
          "Exclusiv TDD cu unit tests pentru orice"
        ],
        "answer": "Predominant unit tests (60-70%): componente, hooks, utils; teste de integrare (20-30%): fluxuri cu MSW; putine E2E (10%): scenarii critice (login, checkout) — echilibru cost/valoare",
        "explanation": "Unit tests: rapide, ieftine, specifice. Integration tests (MSW): verifica interactiunea cu API, costisitoare dar valoroase. E2E: lente, fragile, dar singura validare a intregului sistem. Prea multe E2E = CI lent si fragil.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Playwright fixture cu auth",
        "question": "Implementeaza un Playwright fixture care se autentifica inainte de teste si refoloseste sesiunea pentru a evita login-ul la fiecare test.",
        "options": [],
        "answer": "",
        "explanation": "authenticatedPage: async({page},use)=>{ await page.goto('/login'); await page.fill('[name=email]','admin@test.com'); await page.fill('[name=password]','parola'); await page.click('[type=submit]'); await page.waitForURL('/dashboard'); await use(page); }. Alternativ mai eficient: storageState cu setup project in playwright.config.ts",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "mini-proiect-fe-saas-dashboard",
    "title": "35. Mini Proiect FE — SaaS Dashboard complet",
    "order": 35,
    "theory": [
      {
        "order": 1,
        "title": "Arhitectura SaaS Dashboard — structura proiect",
        "content": "Un **SaaS Dashboard** productie-ready integreaza: autentificare, i18n, dark mode, state global, testing si deployment.\n\n**Structura proiect recomandata:**\n```\nsrc/\n  app/\n    [locale]/\n      (auth)/\n        login/page.tsx\n        register/page.tsx\n      (dashboard)/\n        layout.tsx          # Layout cu sidebar + header\n        page.tsx            # Overview\n        analytics/page.tsx\n        settings/page.tsx\n    api/\n      auth/[...nextauth]/route.ts\n  components/\n    ui/                     # Componente atomice (Button, Input, Card)\n    dashboard/              # Componente specifice dashboard-ului\n    layout/                 # Sidebar, Header, Footer\n  store/\n    uiStore.ts              # Zustand: sidebar collapsed, theme\n    userStore.ts            # Zustand: user preferences\n  i18n/\n    routing.ts\n    request.ts\n  messages/\n    ro.json\n    en.json\n  lib/\n    auth.ts                 # NextAuth config\n    prisma.ts\n  hooks/\n    useMediaQuery.ts\n    useLocalStorage.ts\n  __tests__/\n    components/\n    hooks/\n  e2e/\n    auth.spec.ts\n    dashboard.spec.ts\n```\n\n**Stack complet:**\n```json\n{\n  \"dependencies\": {\n    \"next\": \"^15\",\n    \"next-auth\": \"^5\",\n    \"next-intl\": \"^3\",\n    \"zustand\": \"^5\",\n    \"@prisma/client\": \"^6\",\n    \"tailwindcss\": \"^4\",\n    \"lucide-react\": \"latest\"\n  },\n  \"devDependencies\": {\n    \"vitest\": \"latest\",\n    \"@testing-library/react\": \"latest\",\n    \"@playwright/test\": \"latest\",\n    \"msw\": \"latest\",\n    \"@storybook/nextjs\": \"latest\"\n  }\n}\n```\n\n**Interview tip:** Arhitectura Route Groups din App Router — (auth) si (dashboard) — permite layout-uri diferite fara a afecta URL-ul. /login e in grupul (auth) cu layout minimal; /dashboard e in (dashboard) cu sidebar + header."
      },
      {
        "order": 2,
        "title": "Dark Mode integrat cu Zustand si Tailwind",
        "content": "**Dark Mode** SSR-safe cu Zustand persist in cookies si Tailwind class strategy.\n\n**tailwind.config.ts:**\n```typescript\nimport type { Config } from 'tailwindcss';\n\nexport default {\n  darkMode: 'class',  // Activeaza dark mode prin clasa 'dark' pe <html>\n  content: ['./src/**/*.{ts,tsx}'],\n  theme: {\n    extend: {\n      colors: {\n        background: 'var(--background)',\n        foreground: 'var(--foreground)',\n      }\n    }\n  }\n} satisfies Config;\n```\n\n**Zustand store pentru tema (SSR-safe cu cookies):**\n```typescript\n// store/uiStore.ts:\nimport { create } from 'zustand';\nimport { persist, createJSONStorage } from 'zustand/middleware';\nimport Cookies from 'js-cookie';\n\nconst cookieStorage = {\n  getItem: (name: string) => Cookies.get(name) ?? null,\n  setItem: (name: string, value: string) => Cookies.set(name, value, { expires: 365 }),\n  removeItem: Cookies.remove,\n};\n\nexport const useUIStore = create<UIStore>()(\n  persist(\n    (set) => ({\n      theme: 'light' as 'light' | 'dark',\n      sidebarCollapsed: false,\n      toggleTheme: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),\n      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),\n    }),\n    { name: 'ui-state', storage: createJSONStorage(() => cookieStorage) }\n  )\n);\n```\n\n**ThemeProvider — aplica tema pe html:**\n```tsx\n// components/ThemeProvider.tsx:\n'use client';\nimport { useEffect } from 'react';\nimport { useUIStore } from '@/store/uiStore';\n\nexport function ThemeProvider({ children, initialTheme }: { children: React.ReactNode; initialTheme: 'light' | 'dark' }) {\n  const { theme, toggleTheme } = useUIStore();\n\n  useEffect(() => {\n    const root = document.documentElement;\n    root.classList.toggle('dark', theme === 'dark');\n  }, [theme]);\n\n  return <>{children}</>;\n}\n```\n\n**Layout.tsx — citeste tema din cookie server-side:**\n```tsx\nimport { cookies } from 'next/headers';\n\nexport default async function RootLayout({ children }) {\n  const cookieStore = await cookies();\n  const uiState = JSON.parse(cookieStore.get('ui-state')?.value ?? '{}');\n  const initialTheme = uiState?.state?.theme ?? 'light';\n\n  return (\n    <html lang=\"ro\" className={initialTheme === 'dark' ? 'dark' : ''}>\n      <body>\n        <ThemeProvider initialTheme={initialTheme}>\n          {children}\n        </ThemeProvider>\n      </body>\n    </html>\n  );\n}\n```\n\n**Interview tip:** Citind tema din cookie pe server si aplicand clasa CSS inainte de render, elimini complet flash-ul de tema (FOUC). Aceasta e tehnica folosita de Vercel, Linear, si alte SaaS-uri mari."
      },
      {
        "order": 3,
        "title": "Autentificare si i18n combinate in layout",
        "content": "**Integrarea** NextAuth (autentificare) cu next-intl (i18n) in acelasi middleware necesita atentie la ordinea procesarii.\n\n**Middleware combinat:**\n```typescript\n// middleware.ts:\nimport { NextResponse } from 'next/server';\nimport type { NextRequest } from 'next/server';\nimport createMiddleware from 'next-intl/middleware';\nimport { getToken } from 'next-auth/jwt';\nimport { routing } from './i18n/routing';\n\nconst intlMiddleware = createMiddleware(routing);\n\nconst protectedRoutes = ['/dashboard', '/analytics', '/settings'];\n\nexport default async function middleware(request: NextRequest) {\n  const { pathname } = request.nextUrl;\n\n  // Verificare autentificare pentru rute protejate:\n  const isProtected = protectedRoutes.some(route =>\n    pathname.includes(route)\n  );\n\n  if (isProtected) {\n    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });\n    if (!token) {\n      // Determina locale din URL pentru redirect corect:\n      const locale = pathname.startsWith('/en') ? 'en' : 'ro';\n      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));\n    }\n  }\n\n  // Aplica middleware-ul i18n:\n  return intlMiddleware(request);\n}\n\nexport const config = {\n  matcher: ['/((?!api|_next|_vercel|.*\\\\..*).*)']\n};\n```\n\n**Layout cu toate provider-ele:**\n```tsx\n// app/[locale]/layout.tsx:\nimport { NextIntlClientProvider } from 'next-intl';\nimport { getMessages } from 'next-intl/server';\nimport { SessionProvider } from 'next-auth/react';\nimport { auth } from '@/lib/auth';\n\nexport default async function LocaleLayout({ children, params }) {\n  const { locale } = await params;\n  const messages = await getMessages();\n  const session = await auth();\n\n  return (\n    <SessionProvider session={session}>\n      <NextIntlClientProvider messages={messages}>\n        {children}\n      </NextIntlClientProvider>\n    </SessionProvider>\n  );\n}\n```\n\n**Interview tip:** Middleware-ul Next.js ruleaza pe Edge Runtime (fara Node.js APIs). getToken() din next-auth/jwt functioneaza pe Edge. Prisma si alte DB calls NU functioneaza in middleware — foloseste JWT claims pentru verificarea sesiunii in middleware."
      },
      {
        "order": 4,
        "title": "CI/CD, Testing si Deploy complet",
        "content": "**Pipeline complet** de CI/CD cu GitHub Actions, Vitest si Playwright pentru un SaaS Dashboard.\n\n**GitHub Actions workflow:**\n```yaml\n# .github/workflows/ci.yml:\nname: CI/CD\non:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: 'npm'\n      - run: npm ci\n      - run: npm run type-check         # tsc --noEmit\n      - run: npm run lint               # next lint\n      - run: npm run test               # vitest run\n      - run: npm run test:coverage      # vitest run --coverage\n      - uses: codecov/codecov-action@v4\n\n  e2e:\n    runs-on: ubuntu-latest\n    needs: test  # Ruleaza dupa unit tests\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: 20, cache: 'npm' }\n      - run: npm ci\n      - run: npx playwright install --with-deps\n      - run: npm run build\n      - run: npx playwright test\n      - uses: actions/upload-artifact@v4\n        if: failure()\n        with:\n          name: playwright-report\n          path: playwright-report/\n\n  deploy:\n    runs-on: ubuntu-latest\n    needs: [test, e2e]  # Deploy doar dupa toate testele\n    if: github.ref == 'refs/heads/main'\n    steps:\n      - uses: actions/checkout@v4\n      - uses: amondnet/vercel-action@v25\n        with:\n          vercel-token: ${{ secrets.VERCEL_TOKEN }}\n          vercel-org-id: ${{ secrets.ORG_ID }}\n          vercel-project-id: ${{ secrets.PROJECT_ID }}\n          vercel-args: '--prod'\n```\n\n**package.json scripts:**\n```json\n{\n  \"scripts\": {\n    \"dev\": \"next dev\",\n    \"build\": \"next build\",\n    \"type-check\": \"tsc --noEmit\",\n    \"lint\": \"next lint\",\n    \"test\": \"vitest run\",\n    \"test:watch\": \"vitest\",\n    \"test:coverage\": \"vitest run --coverage\",\n    \"test:e2e\": \"playwright test\",\n    \"storybook\": \"storybook dev -p 6006\",\n    \"build-storybook\": \"storybook build\"\n  }\n}\n```\n\n**Interview tip:** 'needs' in GitHub Actions defineste dependente intre job-uri — deploy ruleaza DOAR daca test si e2e au reusit. Uploading playwright-report la failure permite investigarea e2e failures in CI fara acces local."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Route Groups layout",
        "question": "Cum functioneaza Route Groups in Next.js App Router si cum se folosesc pentru un SaaS Dashboard?",
        "options": [
          "Route Groups adauga segment de URL (ex: /auth/login)",
          "Parantezele in numele folderului — (auth), (dashboard) — grupeaza rute fara a adauga segment in URL; permit layout-uri diferite per grup: layout minimal pentru auth, layout cu sidebar pentru dashboard",
          "Route Groups sunt echivalentul pages/ din Pages Router",
          "Route Groups se folosesc doar pentru API routes"
        ],
        "answer": "Parantezele in numele folderului — (auth), (dashboard) — grupeaza rute fara a adauga segment in URL; permit layout-uri diferite per grup: layout minimal pentru auth, layout cu sidebar pentru dashboard",
        "explanation": "app/(auth)/login/page.tsx → URL: /login (fara 'auth'). app/(dashboard)/settings/page.tsx → URL: /settings. (auth)/layout.tsx = layout cu fundal gradient pentru pagini de login. (dashboard)/layout.tsx = layout cu sidebar + header. Fara Route Groups ai un singur layout pentru toata aplicatia.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "FOUC dark mode",
        "question": "De ce apare Flash of Unstyled Content (FOUC) la dark mode cu localStorage si cum il previi?",
        "options": [
          "FOUC apare din cauza CSS-ului lent",
          "Serverul randeaza HTML fara clasa 'dark'; clientul citeste preferinta din localStorage dupa hydration si adauga clasa — intre render si hydration se vede momentan tema gresita; fix: stocheaza tema in cookie si citeste-o server-side",
          "Tailwind nu suporta dark mode fara FOUC",
          "FOUC apare doar pe Firefox"
        ],
        "answer": "Serverul randeaza HTML fara clasa 'dark'; clientul citeste preferinta din localStorage dupa hydration si adauga clasa — intre render si hydration se vede momentan tema gresita; fix: stocheaza tema in cookie si citeste-o server-side",
        "explanation": "Cookie solution: server citeste cookie 'ui-state', parseaza tema, adauga class='dark' pe <html> inainte de trimiterea HTML catre client. Clientul primeste HTML deja cu tema corecta — zero flash. Alternativ: inline script in <head> care adauga clasa imediat (tehnica folosita de shadcn/ui).",
        "difficulty": "hard"
      },
      {
        "number": 3,
        "name": "Middleware combinat auth+i18n",
        "question": "In ce ordine trebuie procesate autentificarea si i18n in middleware-ul Next.js si de ce?",
        "options": [
          "i18n mai intai, apoi auth — ordinea nu conteaza",
          "Auth mai intai — daca utilizatorul nu e autentificat, redirecteaza inainte ca i18n sa proceseze; redirect-ul trebuie sa includa locale-ul corect in URL",
          "Auth si i18n in middleware-uri separate cu config diferit",
          "Nu poti combina auth si i18n in acelasi middleware"
        ],
        "answer": "Auth mai intai — daca utilizatorul nu e autentificat, redirecteaza inainte ca i18n sa proceseze; redirect-ul trebuie sa includa locale-ul corect in URL",
        "explanation": "Daca redirectezi la /login fara locale, next-intl va adauga /ro/login sau /en/login inconsistent. Corect: determina locale din URL (pathname.startsWith('/en')), construieste redirectul cu locale explicit. Auth check primul — fail fast.",
        "difficulty": "hard"
      },
      {
        "number": 4,
        "name": "GitHub Actions needs",
        "question": "Ce face keyword-ul 'needs' intr-un workflow GitHub Actions si cum il folosesti in pipeline-ul de deploy?",
        "options": [
          "Specifica package-urile npm necesare",
          "Defineste dependente intre job-uri — job-ul cu 'needs: [test, e2e]' se executa DOAR daca job-urile test si e2e au reusit; deploy nu ruleaza daca testele esueaza",
          "Specifica versiunea de Node necesara",
          "Declara secretele necesare job-ului"
        ],
        "answer": "Defineste dependente intre job-uri — job-ul cu 'needs: [test, e2e]' se executa DOAR daca job-urile test si e2e au reusit; deploy nu ruleaza daca testele esueaza",
        "explanation": "Fara 'needs': toate job-urile ruleaza in paralel — deploy poate incepe inainte ca testele sa termine. Cu 'needs': secventa stricta test → e2e → deploy. Combinat cu 'if: github.ref == refs/heads/main': deploy DOAR pe main branch dupa toate testele.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "Sidebar Zustand",
        "question": "Implementeaza un Sidebar component cu stare colapsibila gestionata de Zustand, inclusiv animatie CSS si salvare preferinta in localStorage.",
        "options": [],
        "answer": "",
        "explanation": "const {sidebarCollapsed,toggleSidebar}=useUIStore(); return <aside className={`transition-all duration-300 ${sidebarCollapsed?'w-16':'w-64'}`}><button onClick={toggleSidebar}>{sidebarCollapsed?<ChevronRight/>:<ChevronLeft/>}</button><nav>...</nav></aside>",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "Dashboard metrics RSC",
        "question": "Scrie un RSC async pentru un dashboard care afiseaza 3 metrici (useri, venituri, comenzi) fetchate in paralel din API-uri separate.",
        "options": [],
        "answer": "",
        "explanation": "const [users,revenue,orders]=await Promise.all([fetchMetric('users/count'),fetchMetric('revenue/total'),fetchMetric('orders/count')]); return <div className='grid grid-cols-3 gap-4'><MetricCard title='Utilizatori' value={users.count}/><MetricCard title='Venituri' value={revenue.total}/><MetricCard title='Comenzi' value={orders.count}/></div>",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "E2E test dashboard flow",
        "question": "Scrie un test Playwright pentru fluxul complet: login → navigare la dashboard → verificare metrici afisate → logout.",
        "options": [],
        "answer": "",
        "explanation": "await page.goto('/login'); await page.fill('[name=email]','admin@saas.com'); await page.fill('[name=password]','admin123'); await page.click('[type=submit]'); await expect(page).toHaveURL('/dashboard'); await expect(page.locator('h1')).toContainText('Dashboard'); await expect(page.getByText('Metrici')).toBeVisible(); await page.click('button:has-text(\"Deconectare\")'); await expect(page).toHaveURL('/login');",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "next-intl cu auth combined",
        "question": "Care este cea mai importanta regula cand combini next-intl routing cu redirecturi de autentificare in middleware?",
        "options": [
          "Redirectul de auth trebuie sa fie catre /login fara locale",
          "Redirectul de auth trebuie sa includa locale-ul curent in URL (ex: /en/login) pentru ca next-intl sa nu genereze un al doilea redirect — evita redirect loops si URL-uri incorecte",
          "Auth si i18n nu pot fi combinate",
          "next-intl adauga automat locale-ul la redirecturile de auth"
        ],
        "answer": "Redirectul de auth trebuie sa includa locale-ul curent in URL (ex: /en/login) pentru ca next-intl sa nu genereze un al doilea redirect — evita redirect loops si URL-uri incorecte",
        "explanation": "Fara locale in redirect: /login → next-intl il redirecteaza la /ro/login (un redirect in plus). Cu locale: redirect direct la /en/login sau /ro/login — un singur redirect. Extrage locale din pathname: pathname.startsWith('/en') ? 'en' : routing.defaultLocale.",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "Storybook pentru dashboard",
        "question": "Cum organizezi stories pentru un SaaS Dashboard complex in Storybook si ce nivel de componente prioritizezi?",
        "options": [
          "Scrii stories doar pentru componente atomice",
          "Prioritizezi: 1.Componente UI atomice (Button, Input, Badge) 2.Componente compuse (MetricCard, DataTable, Sidebar) 3.Pagini key (Dashboard, Settings) cu MSW mock — design system-ul e baza, paginile sunt pentru smoke testing",
          "Scrii stories pentru toate paginile aplicatiei",
          "Stories sunt necesare doar pentru componente cu props multiple"
        ],
        "answer": "Prioritizezi: 1.Componente UI atomice (Button, Input, Badge) 2.Componente compuse (MetricCard, DataTable, Sidebar) 3.Pagini key (Dashboard, Settings) cu MSW mock — design system-ul e baza, paginile sunt pentru smoke testing",
        "explanation": "Atomic first: atomic components testate izolat = fundatie stabila. Compuse: MetricCard cu loading/error/data states. Pagini: smoke test ca nu se craseaza cu date reale (MSW). Nu ai nevoie de stories pentru FIECARE pagina — focus pe componente reutilizabile.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Metrics API cu suspense",
        "question": "Cum structurezi un dashboard cu Suspense pentru a afisa metrici independent, fara ca una lenta sa blocheze altele?",
        "options": [
          "Faci fetch la toate metricile intr-un singur RSC",
          "Fiecare MetricCard e un RSC async separat, invelit in propriul Suspense cu Skeleton fallback — o metrica lenta nu blocheaza celelalte; streaming progresiv",
          "Folosesti loading.tsx pentru intreaga pagina",
          "Adaugi un timer de 5 secunde pentru toate metricile"
        ],
        "answer": "Fiecare MetricCard e un RSC async separat, invelit in propriul Suspense cu Skeleton fallback — o metrica lenta nu blocheaza celelalte; streaming progresiv",
        "explanation": "<Suspense fallback={<MetricSkeleton/>}><UsersMetric/></Suspense><Suspense fallback={<MetricSkeleton/>}><RevenueMetric/></Suspense>. UsersMetric si RevenueMetric sunt RSC async individuale. Next.js le ruleaza in paralel si le streameaza independent.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "Type-check in CI",
        "question": "De ce este important sa rulezi 'tsc --noEmit' (type-check) ca pas separat in CI, inafara de build?",
        "options": [
          "TypeScript nu e verificat in next build",
          "next build verifica TypeScript dar se opreste la prima eroare per fisier si e mai lent; tsc --noEmit raporteaza TOATE erorile de tip din intregul proiect rapid — util pentru feedback complet in PR",
          "tsc --noEmit e mai rapid decat next build",
          "next build nu suporta TypeScript strict mode"
        ],
        "answer": "next build verifica TypeScript dar se opreste la prima eroare per fisier si e mai lent; tsc --noEmit raporteaza TOATE erorile de tip din intregul proiect rapid — util pentru feedback complet in PR",
        "explanation": "Workflow CI optim: type-check (tsc) + lint (eslint) + test (vitest) paralel — toate rulate inainte de build. Fail fast pe erori TypeScript fara a astepta build-ul complet (care poate dura minute).",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Settings page cu Server Action",
        "question": "Implementeaza o Settings page RSC cu un formular care salveaza preferintele utilizatorului prin Server Action si revalideaza datele.",
        "options": [],
        "answer": "",
        "explanation": "saveSettings: const session=await auth(); if(!session) redirect('/login'); const lang=formData.get('language'); await prisma.user.update({where:{id:session.user.id},data:{language:lang}}); revalidatePath('/settings'). Page: const session=await auth(); if(!session) redirect('/login'); const user=await prisma.user.findUnique({where:{id:session.user.id}}); return <form action={saveSettings}><select name='language' defaultValue={user.language}>...</select></form>",
        "difficulty": "hard"
      },
      {
        "number": 13,
        "name": "Testing strategy complet",
        "question": "Care este strategia corecta de testare pentru un SaaS Dashboard cu auth, i18n si dark mode?",
        "options": [
          "Testeaza doar UI-ul vizual cu Chromatic",
          "Unit tests (Vitest): componente, hooks, utils; Integration (MSW): page flows fara backend; E2E (Playwright): scenarii critice (login flow, settings save) cu user real; Chromatic: regresia vizuala pe componente cheie",
          "100% E2E Playwright pentru certitudine maxima",
          "Testeaza doar pe un singur tip de browser"
        ],
        "answer": "Unit tests (Vitest): componente, hooks, utils; Integration (MSW): page flows fara backend; E2E (Playwright): scenarii critice (login flow, settings save) cu user real; Chromatic: regresia vizuala pe componente cheie",
        "explanation": "Proportii: 60% unit, 25% integration, 15% E2E. E2E pe: auth flow, dashboard load, settings save. MSW mock-uieste API-ul pentru integration tests. Chromatic: dark mode variants, responsivitate. Nu testa implementarea — testeaza comportamentul observabil.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Performance dashboard",
        "question": "Ce tehnici de performanta aplici unui SaaS Dashboard Next.js pentru a obtine un Time to First Byte (TTFB) mic?",
        "options": [
          "Dezactiveaza toate cache-urile",
          "Streaming cu Suspense per sectiune, cache fetch-uri cu revalidate, static generation pentru pagini fara date personalizate, CDN pentru assets, Partial Prerendering (PPR) pentru shell static + continut dinamic",
          "Pune totul in Client Components pentru hidratare rapida",
          "Evita RSC-urile pentru dashboard-uri"
        ],
        "answer": "Streaming cu Suspense per sectiune, cache fetch-uri cu revalidate, static generation pentru pagini fara date personalizate, CDN pentru assets, Partial Prerendering (PPR) pentru shell static + continut dinamic",
        "explanation": "Dashboard shell (sidebar, header) = static, se serveste instant din CDN. Metrici = dynamic, streameaza cu Suspense. fetch revalidate:300 = metrici se recalculeaza la 5 minute, nu per request. PPR (experimental): shell static + widgets dinamice in acelasi request.",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "Deploy checklist",
        "question": "Care sunt pasii esentiali inainte de a deploya un SaaS Dashboard Next.js in productie pe Vercel?",
        "options": [
          "Doar rulezi npm run build local",
          "1.Toate variabilele de mediu setate in Vercel (DB_URL, AUTH_SECRET, etc.) 2.next build fara erori + type errors 0 3.Teste unit si E2E tree 4.Headers de securitate in next.config (CSP, HSTS) 5.Error tracking configurat (Sentry) 6.Domain si SSL configurate 7.Preview deployment testat",
          "Pusezi direct pe main branch fara alte verificari",
          "Doar configurezi CI/CD si lasi GitHub sa faca totul"
        ],
        "answer": "1.Toate variabilele de mediu setate in Vercel (DB_URL, AUTH_SECRET, etc.) 2.next build fara erori + type errors 0 3.Teste unit si E2E tree 4.Headers de securitate in next.config (CSP, HSTS) 5.Error tracking configurat (Sentry) 6.Domain si SSL configurate 7.Preview deployment testat",
        "explanation": "Erori frecvente la deploy: env vars lipsa (app craseaza), AUTH_SECRET diferit intre enviroamente (sesiunile nu functioneaza), Prisma connection limit depasit (foloseste Prisma Accelerate), imagini de domenii externe neadaugate in next.config (eroare la next/image).",
        "difficulty": "easy"
      }
    ]
  }
];

module.exports = { nextjsFrontendExtra2 };
