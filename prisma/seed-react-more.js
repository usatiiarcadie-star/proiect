// React extra lessons (11-30)

const reactMore = [
  {
    slug: "react-usereducer",
    title: "11. useReducer — state complex",
    order: 11,
    theory: [
      { order: 1, title: "Când useReducer", content: "Pentru state cu multiple sub-câmpuri sau logică complexă, useReducer e mai clar decât useState multiplu:\n\n```jsx\nimport { useReducer } from 'react';\n\nfunction reducer(state, action) {\n  switch (action.type) {\n    case 'INC': return { ...state, count: state.count + 1 };\n    case 'DEC': return { ...state, count: state.count - 1 };\n    case 'RESET': return { count: 0 };\n    default: throw new Error('Unknown action');\n  }\n}\n\nfunction Counter() {\n  const [state, dispatch] = useReducer(reducer, { count: 0 });\n  return (\n    <>\n      <p>{state.count}</p>\n      <button onClick={() => dispatch({ type: 'INC' })}>+</button>\n      <button onClick={() => dispatch({ type: 'DEC' })}>-</button>\n    </>\n  );\n}\n```" },
      { order: 2, title: "Cu payload și initializer", content: "```jsx\nfunction reducer(state, action) {\n  switch (action.type) {\n    case 'ADD_TODO':\n      return { ...state, todos: [...state.todos, action.payload] };\n    case 'TOGGLE':\n      return { ...state, todos: state.todos.map(t =>\n        t.id === action.payload ? { ...t, done: !t.done } : t\n      ) };\n  }\n}\n\nconst init = (initial) => ({ todos: initial, filter: 'all' });\nconst [state, dispatch] = useReducer(reducer, [], init);\n\ndispatch({ type: 'ADD_TODO', payload: { id: 1, text: 'X' } });\n```" },
    ],
    tasks: [
      { number: 1, name: "useReducer signature", question: "useReducer întoarce?", options: ["state", "[state, dispatch]", "[state, setState]", "dispatch"], answer: "[state, dispatch]", explanation: "Similar useState, dar dispatch ia un action obiect și e procesat de reducer.", difficulty: "easy" },
      { number: 2, name: "purity reducer", question: "Reducer-ul trebuie să fie?", options: ["Async", "Pure (fără side effects, returnează NEW state)", "Mutate state", "Class"], answer: "Pure (fără side effects, returnează NEW state)", explanation: "Mutate-ul state-ului direct nu trigger-ează re-render. Întoarce întotdeauna obiect nou.", difficulty: "medium" },
      { number: 3, name: "useState vs useReducer", question: "Când preferi useReducer?", options: ["Mereu", "State complex cu multiple câmpuri sau logică ramificată", "Niciodată", "Pentru bool-uri"], answer: "State complex cu multiple câmpuri sau logică ramificată", explanation: "Pentru un counter simplu, useState. Pentru forme cu 10 câmpuri, useReducer e mai curat.", difficulty: "medium" },
      { number: 4, name: "action type", question: "Convenție pentru action.type?", options: ["String camelCase", "String UPPER_CASE descriptiv", "Număr", "Function"], answer: "String UPPER_CASE descriptiv", explanation: "Convenție Redux: 'ADD_TODO', 'SET_USER'. Nume clar = debug ușor.", difficulty: "easy" },
    ],
  },
  {
    slug: "react-useref",
    title: "12. useRef — referințe și DOM",
    order: 12,
    theory: [
      { order: 1, title: "Acces direct la DOM", content: "```jsx\nimport { useRef, useEffect } from 'react';\n\nfunction Input() {\n  const inputRef = useRef(null);\n\n  useEffect(() => {\n    inputRef.current?.focus();\n  }, []);\n\n  return <input ref={inputRef} />;\n}\n```\n\n**`useRef`** întoarce un obiect `{ current: ... }` care persistă între render-uri. Modificarea `.current` NU declanșează re-render." },
      { order: 2, title: "Stocare valori mutabile", content: "```jsx\nfunction Stopwatch() {\n  const intervalId = useRef(null);\n  const [time, setTime] = useState(0);\n\n  const start = () => {\n    intervalId.current = setInterval(() => setTime(t => t + 1), 1000);\n  };\n  const stop = () => clearInterval(intervalId.current);\n\n  return <>{time}<button onClick={start}>Start</button><button onClick={stop}>Stop</button></>;\n}\n```\n\nUtil pentru: timers, intervals, valori previous (`prevValueRef`), instance variables în componente." },
    ],
    tasks: [
      { number: 1, name: "useRef return", question: "useRef întoarce?", options: ["Valoarea direct", "Obiect { current: ... }", "Tuple", "Promise"], answer: "Obiect { current: ... }", explanation: "Acces prin .current. Persistă între render-uri fără re-render.", difficulty: "easy" },
      { number: 2, name: "ref re-render", question: "Modificarea ref.current trigger-ează re-render?", options: ["Da", "NU — refs nu sunt reactive", "Doar la null", "Random"], answer: "NU — refs nu sunt reactive", explanation: "Pentru re-render folosești useState. Refs sunt pentru valori care nu trebuie să declanșeze update.", difficulty: "medium" },
      { number: 3, name: "DOM access", question: "Cum focus-ezi un input la mount?", options: ["autofocus prop", "useRef + useEffect cu .current.focus()", "JS direct", "Imposibil"], answer: "useRef + useEffect cu .current.focus()", explanation: "autofocus nu funcționează mereu (re-render). useEffect cu ref e robust.", difficulty: "medium" },
      { number: 4, name: "useState vs useRef", question: "Când useRef peste useState?", options: ["Mereu", "Valori care nu afectează UI direct (timers, instance vars, DOM)", "Niciodată", "Doar primitives"], answer: "Valori care nu afectează UI direct (timers, instance vars, DOM)", explanation: "Re-render = useState. Persistare silențioasă = useRef.", difficulty: "medium" },
    ],
  },
  {
    slug: "react-router-intro",
    title: "13. React Router — navigare",
    order: 13,
    theory: [
      { order: 1, title: "Setup și rute", content: "```bash\nnpm install react-router-dom\n```\n\n```jsx\nimport { BrowserRouter, Routes, Route, Link } from 'react-router-dom';\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <nav>\n        <Link to=\"/\">Home</Link>\n        <Link to=\"/about\">About</Link>\n      </nav>\n      <Routes>\n        <Route path=\"/\" element={<Home />} />\n        <Route path=\"/about\" element={<About />} />\n        <Route path=\"*\" element={<NotFound />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}\n```" },
      { order: 2, title: "Params și navigate", content: "```jsx\nimport { useParams, useNavigate } from 'react-router-dom';\n\n// Rută: /post/:id\n<Route path=\"/post/:id\" element={<Post />} />\n\nfunction Post() {\n  const { id } = useParams();\n  const navigate = useNavigate();\n  return (\n    <>\n      <h1>Post {id}</h1>\n      <button onClick={() => navigate('/')}>Acasă</button>\n      <button onClick={() => navigate(-1)}>Înapoi</button>\n    </>\n  );\n}\n```" },
    ],
    tasks: [
      { number: 1, name: "Link", question: "Diferența <a href> vs <Link to> în React Router?", options: ["Identice", "<a> reload pagina; <Link> SPA navigation (fast)", "<Link> mai vechi", "<a> imposibil"], answer: "<a> reload pagina; <Link> SPA navigation (fast)", explanation: "Link face client-side navigation fără reload. Folosește <a> doar pentru linkuri externe.", difficulty: "medium" },
      { number: 2, name: "useParams", question: "Pentru ce e useParams?", options: ["Form params", "Citește parametrii URL (din :param)", "Query string", "Body"], answer: "Citește parametrii URL (din :param)", explanation: "Pentru ?query=... folosești useSearchParams.", difficulty: "easy" },
      { number: 3, name: "navigate(-1)", question: "Ce face navigate(-1)?", options: ["Eroare", "Înapoi în istoric (echivalent Back button)", "Home", "Refresh"], answer: "Înapoi în istoric (echivalent Back button)", explanation: "Numere = pași în history. navigate('/x') = path absolut.", difficulty: "medium" },
      { number: 4, name: "*", question: "Ce face <Route path=\"*\">?", options: ["Rând", "Catch-all — match dacă nimic altceva nu prinde (404)", "All routes", "Eroare"], answer: "Catch-all — match dacă nimic altceva nu prinde (404)", explanation: "Plasat ULTIMUL în Routes. Util pentru NotFound page.", difficulty: "easy" },
    ],
  },
  {
    slug: "react-router-avansat",
    title: "14. React Router avansat — nested și outlet",
    order: 14,
    theory: [
      { order: 1, title: "Nested routes cu Outlet", content: "```jsx\nimport { Outlet } from 'react-router-dom';\n\nfunction Layout() {\n  return (\n    <>\n      <Header />\n      <main><Outlet /></main>\n      <Footer />\n    </>\n  );\n}\n\n<Routes>\n  <Route path=\"/\" element={<Layout />}>\n    <Route index element={<Home />} />\n    <Route path=\"about\" element={<About />} />\n    <Route path=\"posts\" element={<Posts />}>\n      <Route path=\":id\" element={<PostDetail />} />\n    </Route>\n  </Route>\n</Routes>\n```\n\n**`<Outlet />`** = locul unde se randează ruta copil." },
      { order: 2, title: "Loaders, actions și data router", content: "Modern (v6.4+) cu createBrowserRouter:\n\n```jsx\nimport { createBrowserRouter, RouterProvider, useLoaderData } from 'react-router-dom';\n\nconst router = createBrowserRouter([\n  {\n    path: '/posts/:id',\n    loader: async ({ params }) => {\n      const r = await fetch(`/api/posts/${params.id}`);\n      return r.json();\n    },\n    element: <Post />,\n    errorElement: <ErrorPage />,\n  },\n]);\n\nfunction Post() {\n  const post = useLoaderData();\n  return <h1>{post.title}</h1>;\n}\n```" },
    ],
    tasks: [
      { number: 1, name: "Outlet", question: "Ce face <Outlet />?", options: ["Iese", "Locul unde se randează ruta copil în layout-ul părinte", "Sidebar", "Nav"], answer: "Locul unde se randează ruta copil în layout-ul părinte", explanation: "Pentru layout shared (header/footer) cu rute multiple care reutilizează shell-ul.", difficulty: "medium" },
      { number: 2, name: "index route", question: "Ce face <Route index>?", options: ["Primul", "Default child route — match când URL-ul e exact al părintelui", "Random", "Eroare"], answer: "Default child route — match când URL-ul e exact al părintelui", explanation: "Pentru / sub layout-ul / — afișează Home în Outlet.", difficulty: "medium" },
      { number: 3, name: "useLoaderData", question: "Pentru ce e useLoaderData?", options: ["State", "Citește datele returnate de loader-ul rutei (data router)", "Refresh", "Cache"], answer: "Citește datele returnate de loader-ul rutei (data router)", explanation: "Loader rulează ÎNAINTE de render — datele sunt gata. Mai bun decât useEffect + fetch.", difficulty: "hard" },
      { number: 4, name: "errorElement", question: "Pentru ce e errorElement?", options: ["Decorativ", "Componentul afișat dacă loader/render aruncă erori", "Logger", "Default"], answer: "Componentul afișat dacă loader/render aruncă erori", explanation: "Înlocuiește try/catch boilerplate. Util pentru pagină 500/404 elegantă.", difficulty: "medium" },
    ],
  },
  {
    slug: "react-suspense-lazy",
    title: "15. Lazy loading și Suspense",
    order: 15,
    theory: [
      { order: 1, title: "Code splitting cu lazy", content: "```jsx\nimport { lazy, Suspense } from 'react';\n\nconst Heavy = lazy(() => import('./HeavyComponent'));\n\nfunction App() {\n  return (\n    <Suspense fallback={<div>Se încarcă...</div>}>\n      <Heavy />\n    </Suspense>\n  );\n}\n```\n\n**`lazy()`** = bundle-ul componentei e încărcat doar la nevoie. **`Suspense`** afișează fallback până e gata.\n\nUtil pentru: rute mari, modale, componente pe pagini diferite." },
      { order: 2, title: "Suspense pentru data fetching", content: "```jsx\nimport { use } from 'react';\n\nfunction Posts({ promise }) {\n  const posts = use(promise);  // suspendă până rezolvă\n  return posts.map(p => <li key={p.id}>{p.title}</li>);\n}\n\nfunction App() {\n  const promise = fetchPosts();\n  return (\n    <Suspense fallback={<Spinner />}>\n      <Posts promise={promise} />\n    </Suspense>\n  );\n}\n```\n\n**`use()`** (React 19) consumă promise sau context. Suspense gestionează loading state automat." },
    ],
    tasks: [
      { number: 1, name: "lazy", question: "Ce face React.lazy?", options: ["Lent", "Code splitting — încarcă bundle doar la nevoie", "Cache", "Memo"], answer: "Code splitting — încarcă bundle doar la nevoie", explanation: "Reduce bundle inițial. Browser descarcă chunk separat când componenta e folosită prima dată.", difficulty: "medium" },
      { number: 2, name: "Suspense fallback", question: "Pentru ce e fallback?", options: ["Eroare", "UI afișat în timp ce componenta lazy/promise se încarcă", "Default", "Cache"], answer: "UI afișat în timp ce componenta lazy/promise se încarcă", explanation: "Spinner, skeleton, mesaj — orice componentă React validă.", difficulty: "easy" },
      { number: 3, name: "use hook", question: "Ce face hook-ul use() (React 19)?", options: ["Eroare", "Citește valoarea unui promise/context, suspendă dacă nu e gata", "useEffect", "useState"], answer: "Citește valoarea unui promise/context, suspendă dacă nu e gata", explanation: "Înlocuiește useContext + integrează cu Suspense pentru promise. Apelabil în if-uri (spre deosebire de alte hooks).", difficulty: "hard" },
      { number: 4, name: "splitting benefit", question: "Beneficiul code splitting?", options: ["Random", "Bundle inițial mai mic = first load mai rapid", "Color", "Bug"], answer: "Bundle inițial mai mic = first load mai rapid", explanation: "Util pentru rute. Heavy lib (chart.js etc.) încărcat doar pe pagina care îl folosește.", difficulty: "easy" },
    ],
  },
  {
    slug: "react-error-boundary",
    title: "16. Error Boundaries",
    order: 16,
    theory: [
      { order: 1, title: "Class-based Error Boundary", content: "```jsx\nclass ErrorBoundary extends React.Component {\n  state = { hasError: false, error: null };\n\n  static getDerivedStateFromError(error) {\n    return { hasError: true, error };\n  }\n\n  componentDidCatch(error, info) {\n    console.error(error, info);\n    // log la Sentry etc.\n  }\n\n  render() {\n    if (this.state.hasError) {\n      return <h1>A apărut o eroare. Reîncarcă pagina.</h1>;\n    }\n    return this.props.children;\n  }\n}\n\n<ErrorBoundary>\n  <App />\n</ErrorBoundary>\n```" },
      { order: 2, title: "Limitări și hook-uri", content: "**Error Boundaries NU prind:**\n• Errori în event handlers (folosește try/catch)\n• Errori async (setTimeout, fetch)\n• Errori în componenta însăși\n• Errori în SSR\n\n**Pentru funcționale:** folosește librăria `react-error-boundary`:\n```jsx\nimport { ErrorBoundary } from 'react-error-boundary';\n\n<ErrorBoundary fallbackRender={({ error }) => <p>Eroare: {error.message}</p>}>\n  <App />\n</ErrorBoundary>\n```" },
    ],
    tasks: [
      { number: 1, name: "EB scop", question: "Ce face un Error Boundary?", options: ["Stop", "Prinde erori în render-ul copiilor și afișează fallback UI", "Logger", "Cache"], answer: "Prinde erori în render-ul copiilor și afișează fallback UI", explanation: "Fără EB, o eroare în arbore unmount-ează tot. Cu EB, doar branchu afectat e afectat.", difficulty: "medium" },
      { number: 2, name: "componentDidCatch", question: "În ce metodă faci logging?", options: ["render", "componentDidCatch (cu info despre stack)", "constructor", "useEffect"], answer: "componentDidCatch (cu info despre stack)", explanation: "Apelat după ce React decide să afișeze fallback. Util pentru Sentry/LogRocket.", difficulty: "medium" },
      { number: 3, name: "EB limits", question: "EB prinde erori în event handlers?", options: ["Da", "NU — folosești try/catch în handler", "Doar onClick", "Random"], answer: "NU — folosești try/catch în handler", explanation: "Event handlers rulează în afara render. EB prinde doar erori de render/lifecycle.", difficulty: "hard" },
      { number: 4, name: "func vs class", question: "Pot face EB ca componentă funcțională?", options: ["Da, nativ", "NU direct — folosești librăria react-error-boundary", "Cu hook", "Imposibil total"], answer: "NU direct — folosești librăria react-error-boundary", explanation: "React nu are hook pentru EB. Librăria oferă wrapper convenabil.", difficulty: "hard" },
    ],
  },
  {
    slug: "react-portals",
    title: "17. Portals — randare în alt loc",
    order: 17,
    theory: [
      { order: 1, title: "createPortal", content: "Permite randarea unui copil în afara ierarhiei DOM părinte:\n\n```jsx\nimport { createPortal } from 'react-dom';\n\nfunction Modal({ children, onClose }) {\n  return createPortal(\n    <div className=\"modal-backdrop\" onClick={onClose}>\n      <div className=\"modal-content\" onClick={e => e.stopPropagation()}>\n        {children}\n      </div>\n    </div>,\n    document.body\n  );\n}\n```\n\n**Beneficii:** scapă de probleme cu `overflow: hidden`, `z-index`, `transform` pe părinte. React events încă bubble normal." },
      { order: 2, title: "Cazuri tipice", content: "**Modal** — în top-level pentru centrate corectă peste tot:\n```jsx\n<Modal>Confirmă?</Modal>\n```\n\n**Tooltip** — pe lângă cursor, scapă de overflow:\n```jsx\nfunction Tooltip({ x, y, text }) {\n  return createPortal(\n    <div style={{ position: 'fixed', top: y, left: x }}>{text}</div>,\n    document.getElementById('tooltips')\n  );\n}\n```\n\n**Toast notifications** — ținta e un container global." },
    ],
    tasks: [
      { number: 1, name: "createPortal", question: "Ce face createPortal?", options: ["Animă", "Randare DOM într-un alt nod (ex: document.body), păstrând context React", "Cache", "Refresh"], answer: "Randare DOM într-un alt nod (ex: document.body), păstrând context React", explanation: "DOM merge altundeva, dar React tree rămâne logic în același loc.", difficulty: "medium" },
      { number: 2, name: "events portal", question: "Eventurile bubble prin portal?", options: ["Nu", "Da — urmează React tree (părintele logic)", "Doar click", "Random"], answer: "Da — urmează React tree (părintele logic)", explanation: "Diferă de DOM bubbling. Onclick pe portal poate fi prins de părintele React, chiar dacă DOM e altundeva.", difficulty: "hard" },
      { number: 3, name: "use case", question: "Când folosești portal?", options: ["Mereu", "Modale, tooltips, dropdowns — pentru a evita probleme cu overflow/z-index", "Pentru list", "State"], answer: "Modale, tooltips, dropdowns — pentru a evita probleme cu overflow/z-index", explanation: "Container părinte cu overflow:hidden ar tăia modal. Portal scapă de problemă.", difficulty: "medium" },
      { number: 4, name: "z-index portal", question: "Portal rezolvă problema z-index?", options: ["Niciodată", "Da — fiind în top-level body, nu mai e \"prizonier\" în stacking context al părinte", "Doar uneori", "Bug"], answer: "Da — fiind în top-level body, nu mai e \"prizonier\" în stacking context al părinte", explanation: "Stacking context e creat de transform, opacity etc. Portal scapă din ele.", difficulty: "hard" },
    ],
  },
  {
    slug: "react-forwardref",
    title: "18. Refs avansate și forwardRef",
    order: 18,
    theory: [
      { order: 1, title: "forwardRef", content: "Permite componentei părinte să acceseze ref-ul unui DOM element din copil:\n\n```jsx\nimport { forwardRef, useRef } from 'react';\n\nconst Input = forwardRef((props, ref) => (\n  <input ref={ref} {...props} className=\"my-input\" />\n));\n\nfunction Form() {\n  const inputRef = useRef(null);\n  return (\n    <>\n      <Input ref={inputRef} placeholder=\"Nume\" />\n      <button onClick={() => inputRef.current?.focus()}>Focus</button>\n    </>\n  );\n}\n```\n\n**React 19:** `ref` poate fi prop normală (fără forwardRef)." },
      { order: 2, title: "useImperativeHandle", content: "Expune o interfață custom (nu DOM raw):\n\n```jsx\nconst Counter = forwardRef((props, ref) => {\n  const [count, setCount] = useState(0);\n\n  useImperativeHandle(ref, () => ({\n    increment: () => setCount(c => c + 1),\n    reset: () => setCount(0),\n  }));\n\n  return <p>{count}</p>;\n});\n\nfunction App() {\n  const counterRef = useRef(null);\n  return (\n    <>\n      <Counter ref={counterRef} />\n      <button onClick={() => counterRef.current.increment()}>+</button>\n    </>\n  );\n}\n```\n\nUtil pentru: forms (focus, validate), media (play/pause), animații (start)." },
    ],
    tasks: [
      { number: 1, name: "forwardRef scop", question: "Pentru ce e forwardRef?", options: ["Stil", "Pasează ref-ul printr-o componentă funcțională la DOM intern", "Cache", "Hook"], answer: "Pasează ref-ul printr-o componentă funcțională la DOM intern", explanation: "Fără el, componentă funcțională nu poate primi ref. (React 19 elimină nevoia).", difficulty: "medium" },
      { number: 2, name: "useImperativeHandle", question: "Ce face useImperativeHandle?", options: ["State", "Definește ce metode/valori expune ref-ul către părinte", "Effect", "Memo"], answer: "Definește ce metode/valori expune ref-ul către părinte", explanation: "În loc să expui DOM-ul, expui o interfață custom (focus(), reset() etc).", difficulty: "hard" },
      { number: 3, name: "ref children", question: "ref e o prop normală?", options: ["Da, în orice React", "În React 19 da; în vechi forwardRef necesar", "Niciodată", "Doar în class"], answer: "În React 19 da; în vechi forwardRef necesar", explanation: "React 19 simplifică API-ul. Pre-19 ai nevoie de forwardRef.", difficulty: "medium" },
      { number: 4, name: "abuse ref", question: "Antipattern cu refs?", options: ["Forward", "Folosirea refs ca state — preferă useState pentru reactivitate", "useRef", "use(...)"], answer: "Folosirea refs ca state — preferă useState pentru reactivitate", explanation: "Refs nu trigger re-render. Pentru date care afectează UI = useState.", difficulty: "medium" },
    ],
  },
  {
    slug: "react-compound-components",
    title: "19. Compound components",
    order: 19,
    theory: [
      { order: 1, title: "Pattern și avantaje", content: "Componentă cu sub-componente conectate prin context — API expressiv:\n\n```jsx\n<Tabs defaultIndex={0}>\n  <Tabs.List>\n    <Tabs.Tab>Profil</Tabs.Tab>\n    <Tabs.Tab>Setări</Tabs.Tab>\n  </Tabs.List>\n  <Tabs.Panels>\n    <Tabs.Panel>Conținut profil</Tabs.Panel>\n    <Tabs.Panel>Conținut setări</Tabs.Panel>\n  </Tabs.Panels>\n</Tabs>\n```\n\nUtilizator-ul controlează structura — flexibil pentru variații. Vs. `<Tabs items={[...]} />` care e rigid." },
      { order: 2, title: "Implementare", content: "```jsx\nconst TabsContext = createContext();\n\nfunction Tabs({ defaultIndex = 0, children }) {\n  const [active, setActive] = useState(defaultIndex);\n  return (\n    <TabsContext.Provider value={{ active, setActive }}>\n      <div>{children}</div>\n    </TabsContext.Provider>\n  );\n}\n\nfunction Tab({ index, children }) {\n  const { active, setActive } = useContext(TabsContext);\n  return (\n    <button onClick={() => setActive(index)} aria-selected={active === index}>\n      {children}\n    </button>\n  );\n}\n\nTabs.Tab = Tab;\nexport default Tabs;\n```" },
    ],
    tasks: [
      { number: 1, name: "Compound def", question: "Ce e compound components?", options: ["Class", "Componentă părinte + sub-componente conectate prin context", "Hook", "HOC"], answer: "Componentă părinte + sub-componente conectate prin context", explanation: "API-ul rezultat e mai natural și flexibil decât prop drilling.", difficulty: "medium" },
      { number: 2, name: "Tabs.Tab", question: "Cum atașezi Tab ca sub-componentă a Tabs?", options: ["Tabs.Tab = Tab; export Tabs", "Auto", "Imposibil", "Class extends"], answer: "Tabs.Tab = Tab; export Tabs", explanation: "Adaugi proprietate la funcția Tabs. Apoi <Tabs.Tab /> funcționează.", difficulty: "easy" },
      { number: 3, name: "context comm", question: "Cum comunică Tab cu Tabs?", options: ["Props", "Prin Context (Provider în părinte, useContext în copii)", "Refs", "Global vars"], answer: "Prin Context (Provider în părinte, useContext în copii)", explanation: "Pattern standard. Evită prop drilling, copilul își ia singur ce-i trebuie.", difficulty: "medium" },
      { number: 4, name: "compound vs config", question: "Avantaj față de Tabs items prop?", options: ["Niciunul", "User controlează DOM/order/wrap-uri custom — flexibilitate", "Mai rapid", "SEO"], answer: "User controlează DOM/order/wrap-uri custom — flexibilitate", explanation: "Cu items=[...] structura e impusă. Compound permite variații (icon, badge etc).", difficulty: "hard" },
    ],
  },
  {
    slug: "react-render-props-hoc",
    title: "20. Render props și HOC",
    order: 20,
    theory: [
      { order: 1, title: "Render props pattern", content: "Componentă care primește o funcție ca prop pentru a randa custom UI:\n\n```jsx\nfunction MouseTracker({ children }) {\n  const [pos, setPos] = useState({ x: 0, y: 0 });\n  return (\n    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>\n      {children(pos)}\n    </div>\n  );\n}\n\n<MouseTracker>\n  {({ x, y }) => <p>Mouse: {x}, {y}</p>}\n</MouseTracker>\n```\n\nÎn era hooks, custom hooks au înlocuit majoritatea cazurilor: `useMouse()`." },
      { order: 2, title: "HOC — Higher Order Components", content: "Funcție care primește o componentă și întoarce alta:\n\n```jsx\nfunction withAuth(Component) {\n  return function Wrapped(props) {\n    const user = useUser();\n    if (!user) return <Login />;\n    return <Component {...props} user={user} />;\n  };\n}\n\nconst Dashboard = withAuth(DashboardRaw);\n```\n\nProbleme: nume confuze în DevTools, ref-uri (forwardRef necesar), prop conflicts. **Modern: custom hooks > HOC.**" },
    ],
    tasks: [
      { number: 1, name: "render prop", question: "Ce e render props?", options: ["Componentă", "Componentă care primește o funcție ca prop pentru render custom", "Hook", "HOC"], answer: "Componentă care primește o funcție ca prop pentru render custom", explanation: "Înainte de hooks, era pattern-ul standard pentru sharing logic. Acum: custom hooks.", difficulty: "medium" },
      { number: 2, name: "HOC", question: "Ce e un HOC?", options: ["Hook", "Funcție care ia o componentă și întoarce alta cu funcționalitate adăugată", "Class", "Helper"], answer: "Funcție care ia o componentă și întoarce alta cu funcționalitate adăugată", explanation: "Convenție: prefix with*: withAuth, withRouter, connect (Redux).", difficulty: "medium" },
      { number: 3, name: "modern alternative", question: "În era hooks, ce înlocuiește HOC-uri/render props?", options: ["Class", "Custom hooks (useAuth, useMouse)", "Context", "Refs"], answer: "Custom hooks (useAuth, useMouse)", explanation: "Hooks oferă același share-ing logic, fără overhead-ul HOC/render props.", difficulty: "easy" },
      { number: 4, name: "hoc problems", question: "Problemă comună cu HOC-uri?", options: ["Niciuna", "Prop conflicts, ref forwarding, displayName în DevTools, wrapper hell", "Performance", "Bug"], answer: "Prop conflicts, ref forwarding, displayName în DevTools, wrapper hell", explanation: "Multe HOCs înlănțuite = arbore de wrapper-e adânc, debug greu.", difficulty: "hard" },
    ],
  },
  {
    slug: "react-state-libs",
    title: "21. State management — Context, Redux, Zustand",
    order: 21,
    theory: [
      { order: 1, title: "Context — built-in", content: "```jsx\nconst ThemeContext = createContext('light');\n\nfunction App() {\n  const [theme, setTheme] = useState('light');\n  return (\n    <ThemeContext.Provider value={{ theme, setTheme }}>\n      <Toolbar />\n    </ThemeContext.Provider>\n  );\n}\n\nfunction Button() {\n  const { theme } = useContext(ThemeContext);\n  return <button className={theme}>Click</button>;\n}\n```\n\n**Limitări:** orice update re-randează TOȚI consumatorii (chiar dacă citesc doar un fragment). Pentru state care se schimbă des, considerați Zustand/Redux." },
      { order: 2, title: "Zustand — minimal și modern", content: "```jsx\nimport { create } from 'zustand';\n\nconst useStore = create((set) => ({\n  count: 0,\n  increment: () => set(state => ({ count: state.count + 1 })),\n  reset: () => set({ count: 0 }),\n}));\n\nfunction Counter() {\n  const { count, increment } = useStore();\n  return <button onClick={increment}>{count}</button>;\n}\n\n// Selector pentru re-render minim:\nconst count = useStore(s => s.count);\n```\n\nMai simplu ca Redux, fără provider, fără action creators. **Recomandat** pentru proiecte mici-medii." },
    ],
    tasks: [
      { number: 1, name: "Context limit", question: "Limită Context?", options: ["Niciuna", "Orice update re-randează toți consumatorii", "Performance bun", "Imposibil"], answer: "Orice update re-randează toți consumatorii", explanation: "Pentru state des-modificat, Zustand/Redux cu selectori e mai performant.", difficulty: "medium" },
      { number: 2, name: "Zustand", question: "De ce e Zustand popular?", options: ["Mai vechi", "Minimal API, fără provider, hook-based, suport selectori", "Doar pe Mac", "Imposibil"], answer: "Minimal API, fără provider, hook-based, suport selectori", explanation: "Pentru majoritatea proiectelor noi, Zustand > Redux. Bundle mai mic, boilerplate redus.", difficulty: "easy" },
      { number: 3, name: "Redux toolkit", question: "Redux modern?", options: ["Plain", "Redux Toolkit (RTK) — reduce boilerplate", "Doar plain", "Imposibil"], answer: "Redux Toolkit (RTK) — reduce boilerplate", explanation: "RTK introduce createSlice, configureStore, RTK Query — Redux \"vechi\" e considerat dated.", difficulty: "medium" },
      { number: 4, name: "alegere", question: "Când Context > Zustand?", options: ["Mereu", "Pentru date statice rare modificate (theme, locale, user)", "Niciodată", "Pentru animații"], answer: "Pentru date statice rare modificate (theme, locale, user)", explanation: "Context perfect pentru DI. Zustand pentru state cu update-uri frecvente.", difficulty: "medium" },
    ],
  },
  {
    slug: "react-query-swr",
    title: "22. React Query / SWR — server state",
    order: 22,
    theory: [
      { order: 1, title: "De ce React Query", content: "Server state ≠ client state. Cu fetch + useEffect:\n• Loading/error/success manual\n• Cache manual\n• Re-fetch on focus/network\n• Pagination, infinite scroll, mutations — multă boilerplate\n\nReact Query (TanStack Query) gestionează tot:\n```jsx\nimport { useQuery } from '@tanstack/react-query';\n\nfunction Posts() {\n  const { data, isLoading, error } = useQuery({\n    queryKey: ['posts'],\n    queryFn: () => fetch('/api/posts').then(r => r.json()),\n  });\n\n  if (isLoading) return <Spinner />;\n  if (error) return <Error msg={error.message} />;\n  return data.map(p => <li key={p.id}>{p.title}</li>);\n}\n```" },
      { order: 2, title: "Mutations și invalidare", content: "```jsx\nimport { useMutation, useQueryClient } from '@tanstack/react-query';\n\nfunction AddPost() {\n  const qc = useQueryClient();\n  const mutation = useMutation({\n    mutationFn: (post) => fetch('/api/posts', { method: 'POST', body: JSON.stringify(post) }),\n    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),\n  });\n  return (\n    <button onClick={() => mutation.mutate({ title: 'Nou' })}>\n      {mutation.isPending ? 'Se salvează...' : 'Adaugă'}\n    </button>\n  );\n}\n```\n\n**SWR** (de la Vercel) e alternativă similară, sintaxă mai simplă." },
    ],
    tasks: [
      { number: 1, name: "scop", question: "Pentru ce e React Query?", options: ["Animații", "Gestionare server state (cache, loading, refetch automat)", "Routing", "Forms"], answer: "Gestionare server state (cache, loading, refetch automat)", explanation: "Înlocuiește useEffect + fetch + useState manual. Standard în proiectele moderne.", difficulty: "easy" },
      { number: 2, name: "queryKey", question: "Pentru ce e queryKey?", options: ["Doar nume", "ID unic pentru cache și invalidare", "Random", "Optional"], answer: "ID unic pentru cache și invalidare", explanation: "['posts'] sau ['post', id]. La invalidate, cache-ul cu acest key e marcat stale.", difficulty: "medium" },
      { number: 3, name: "invalidate", question: "Ce face invalidateQueries?", options: ["Șterge", "Marchează cache-ul ca \"stale\" — refetch la următorul mount/focus", "Reload pagina", "Crash"], answer: "Marchează cache-ul ca \"stale\" — refetch la următorul mount/focus", explanation: "După mutation (POST/PUT/DELETE), invalidezi lista pentru a vedea schimbarea.", difficulty: "medium" },
      { number: 4, name: "alternative", question: "Alternativă populară?", options: ["Redux", "SWR (Vercel) — sintaxă mai simplă", "Niciuna", "Class"], answer: "SWR (Vercel) — sintaxă mai simplă", explanation: "Ambele sunt excelente. Pentru proiecte mai complexe, RQ are mai multe features.", difficulty: "easy" },
    ],
  },
  {
    slug: "react-hook-form",
    title: "23. Forms cu React Hook Form",
    order: 23,
    theory: [
      { order: 1, title: "Setup și exemplu", content: "```bash\nnpm install react-hook-form\n```\n\n```jsx\nimport { useForm } from 'react-hook-form';\n\nfunction LoginForm() {\n  const { register, handleSubmit, formState: { errors } } = useForm();\n\n  const onSubmit = (data) => console.log(data);\n\n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n      <input {...register('email', { required: 'Email obligatoriu' })} />\n      {errors.email && <span>{errors.email.message}</span>}\n\n      <input type=\"password\" {...register('password', { minLength: 8 })} />\n\n      <button>Login</button>\n    </form>\n  );\n}\n```\n\n**Avantaje:** uncontrolled (rapid), validare built-in, mai puține re-render-uri." },
      { order: 2, title: "Validare cu Zod", content: "```jsx\nimport { useForm } from 'react-hook-form';\nimport { zodResolver } from '@hookform/resolvers/zod';\nimport { z } from 'zod';\n\nconst schema = z.object({\n  email: z.string().email('Email invalid'),\n  age: z.coerce.number().min(18, 'Trebuie 18+'),\n});\n\nfunction Form() {\n  const { register, handleSubmit, formState: { errors } } = useForm({\n    resolver: zodResolver(schema),\n  });\n  // ...\n}\n```\n\nZod = type safety + validare runtime. Same schema folosit pe server pentru validare end-to-end." },
    ],
    tasks: [
      { number: 1, name: "register", question: "Ce face register('name')?", options: ["State", "Conectează input-ul la formul (uncontrolled)", "Validează", "Disable"], answer: "Conectează input-ul la formul (uncontrolled)", explanation: "Spread atribute (name, onChange, ref). Form face track fără re-render-uri inutile.", difficulty: "easy" },
      { number: 2, name: "handleSubmit", question: "Ce face handleSubmit?", options: ["Submit auto", "Wrapper care validează apoi apelează callback-ul tău cu datele", "Reset", "Disable"], answer: "Wrapper care validează apoi apelează callback-ul tău cu datele", explanation: "Dacă validare eșuează, errors sunt populați și callback-ul nu e apelat.", difficulty: "medium" },
      { number: 3, name: "Zod", question: "Pentru ce e Zod în RHF?", options: ["State", "Schema validation (type + reguli) cu rezolvabil în RHF", "Cache", "Color"], answer: "Schema validation (type + reguli) cu rezolvabil în RHF", explanation: "Reguli reutilizabile între client și server. Type inference automat.", difficulty: "medium" },
      { number: 4, name: "vs controlled", question: "RHF vs useState pe câmp?", options: ["Identice", "RHF e uncontrolled — mult mai puține re-render-uri pe forme mari", "useState mai rapid", "Niciuna"], answer: "RHF e uncontrolled — mult mai puține re-render-uri pe forme mari", explanation: "useState pe fiecare input → 50 inputs → 50 re-render-uri/keystroke. RHF: zero.", difficulty: "hard" },
    ],
  },
  {
    slug: "react-zod-validation",
    title: "24. Zod — validare și tipuri",
    order: 24,
    theory: [
      { order: 1, title: "Schema basics", content: "```ts\nimport { z } from 'zod';\n\nconst userSchema = z.object({\n  name: z.string().min(2, 'Min 2 caractere'),\n  age: z.number().int().positive(),\n  email: z.string().email(),\n  role: z.enum(['admin', 'user']),\n  bio: z.string().optional(),\n  tags: z.array(z.string()),\n  createdAt: z.coerce.date(),\n});\n\ntype User = z.infer<typeof userSchema>;  // type generat automat\n\n// Parse — aruncă dacă invalid\nconst user = userSchema.parse(data);\n\n// safeParse — întoarce { success, data | error }\nconst result = userSchema.safeParse(data);\nif (!result.success) console.log(result.error.issues);\n```" },
      { order: 2, title: "Validări avansate", content: "```ts\n// Refine — validare custom\nconst pwd = z.object({\n  password: z.string().min(8),\n  confirm: z.string(),\n}).refine(d => d.password === d.confirm, {\n  message: 'Parolele nu se potrivesc',\n  path: ['confirm'],\n});\n\n// Transform — modifică datele după validare\nconst nameSchema = z.string().transform(s => s.trim().toLowerCase());\n\n// Discriminated union\nconst event = z.discriminatedUnion('type', [\n  z.object({ type: z.literal('click'), x: z.number(), y: z.number() }),\n  z.object({ type: z.literal('keypress'), key: z.string() }),\n]);\n\n// Async validation\nconst unique = z.string().refine(async (n) => !(await checkExists(n)), 'Există');\n```" },
    ],
    tasks: [
      { number: 1, name: "Zod scop", question: "Ce face Zod?", options: ["UI lib", "Schema validation TypeScript-first cu type inference", "Routing", "State"], answer: "Schema validation TypeScript-first cu type inference", explanation: "Definești o singură dată — type și runtime check. Standard în Next.js modern.", difficulty: "easy" },
      { number: 2, name: "z.infer", question: "Ce face z.infer<typeof schema>?", options: ["Validează", "Generează type TypeScript din schema (DRY)", "Convert", "Transform"], answer: "Generează type TypeScript din schema (DRY)", explanation: "Un singur sursă de adevăr — schema. TS preia tipul automat.", difficulty: "medium" },
      { number: 3, name: "safeParse", question: "Diferența parse vs safeParse?", options: ["Identice", "parse aruncă; safeParse returnează { success, data|error }", "safeParse async", "parse mai rapid"], answer: "parse aruncă; safeParse returnează { success, data|error }", explanation: "safeParse e mai \"safe\" pentru flow-uri unde vrei să tratezi eroare gracios.", difficulty: "medium" },
      { number: 4, name: "refine", question: "Pentru ce e .refine()?", options: ["Stil", "Validare custom (cross-field, async, business rules)", "Format", "Type"], answer: "Validare custom (cross-field, async, business rules)", explanation: "Ex: parolele trebuie să se potrivească, username unic în DB etc.", difficulty: "hard" },
    ],
  },
  {
    slug: "react-testing",
    title: "25. Testing — Vitest și Testing Library",
    order: 25,
    theory: [
      { order: 1, title: "Setup și prim test", content: "```bash\nnpm install -D vitest @testing-library/react @testing-library/user-event jsdom\n```\n\nÎn `vite.config.ts`: `test: { environment: 'jsdom', globals: true }`\n\n```jsx\n// Counter.test.jsx\nimport { render, screen } from '@testing-library/react';\nimport userEvent from '@testing-library/user-event';\nimport Counter from './Counter';\n\ntest('increments on click', async () => {\n  const user = userEvent.setup();\n  render(<Counter />);\n  \n  expect(screen.getByText('0')).toBeInTheDocument();\n  await user.click(screen.getByRole('button', { name: /increment/i }));\n  expect(screen.getByText('1')).toBeInTheDocument();\n});\n```" },
      { order: 2, title: "Filozofie Testing Library", content: "**Testează ce vede utilizatorul**, nu detalii de implementare:\n\n✅ `getByRole('button', { name: 'Login' })` — semantic\n✅ `getByLabelText('Email')` — accesibil\n✅ `getByText('Welcome')` — vizibil\n\n❌ `container.querySelector('.btn-primary')` — depinde de CSS\n❌ `wrapper.find(MyComponent).prop('value')` — internals\n\n**Queries:**\n• `getBy*` — aruncă dacă nu găsește\n• `queryBy*` — null dacă nu găsește (pentru \"NU există\")\n• `findBy*` — async (așteaptă apariția)" },
    ],
    tasks: [
      { number: 1, name: "Vitest", question: "Ce e Vitest?", options: ["UI lib", "Framework de testing pentru Vite (compatibil Jest API)", "Bundler", "ORM"], answer: "Framework de testing pentru Vite (compatibil Jest API)", explanation: "Folosește același pipeline Vite — fast, hot reload, ESM nativ.", difficulty: "easy" },
      { number: 2, name: "getByRole", question: "De ce getByRole > getByClassName?", options: ["Mai rapid", "Reflectă cum percep utilizatorii (a11y) — semantic, robust la refactor CSS", "Niciuna", "Bug"], answer: "Reflectă cum percep utilizatorii (a11y) — semantic, robust la refactor CSS", explanation: "Class CSS se schimbă des. Rolul unui buton e stabil.", difficulty: "medium" },
      { number: 3, name: "queryBy vs getBy", question: "Diferența?", options: ["Identice", "queryBy returnează null dacă nu există; getBy aruncă", "queryBy mai rapid", "Reverse"], answer: "queryBy returnează null dacă nu există; getBy aruncă", explanation: "queryBy util pentru a verifica că ceva NU există. expect(...).toBeNull().", difficulty: "medium" },
      { number: 4, name: "userEvent vs fireEvent", question: "Care preferi?", options: ["fireEvent", "userEvent — simulează interacțiuni reale (focus, ratele)", "Niciun", "Random"], answer: "userEvent — simulează interacțiuni reale (focus, ratele)", explanation: "fireEvent e low-level (un eveniment). userEvent.click face mai multe steps similar cu user real.", difficulty: "hard" },
    ],
  },
  {
    slug: "react-storybook",
    title: "26. Storybook — UI development",
    order: 26,
    theory: [
      { order: 1, title: "Ce e Storybook", content: "Mediu izolat pentru a dezvolta și documenta componente UI separat de aplicație. Fiecare \"story\" = o stare/variantă a componentei.\n\n```bash\nnpx storybook@latest init\n```\n\n**Beneficii:**\n• Dezvoltare componente fără context aplicație\n• Documentație vie\n• Showcase pentru designer/PM\n• Test vizual (Chromatic)\n• Catalog accesibil pentru întreaga echipă" },
      { order: 2, title: "Exemplu story", content: "```jsx\n// Button.stories.jsx\nimport Button from './Button';\n\nexport default {\n  title: 'UI/Button',\n  component: Button,\n  argTypes: {\n    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] },\n    size: { control: 'radio', options: ['sm', 'md', 'lg'] },\n  },\n};\n\nexport const Primary = {\n  args: { variant: 'primary', children: 'Click me' },\n};\n\nexport const Danger = {\n  args: { variant: 'danger', children: 'Delete' },\n};\n\nexport const Loading = {\n  args: { variant: 'primary', loading: true, children: 'Saving...' },\n};\n```\n\nStorybook generează UI cu controale interactive pentru fiecare prop." },
    ],
    tasks: [
      { number: 1, name: "scop", question: "Ce face Storybook?", options: ["Routing", "Mediu izolat pentru dezvoltare/documentație componente", "State", "Cache"], answer: "Mediu izolat pentru dezvoltare/documentație componente", explanation: "Vezi/testezi componenta în toate stările fără să atingi aplicația.", difficulty: "easy" },
      { number: 2, name: "story", question: "Ce e o story?", options: ["Document", "O stare/variantă a unei componente (ex: Loading, Empty, Error)", "Hook", "Test"], answer: "O stare/variantă a unei componente (ex: Loading, Empty, Error)", explanation: "Defines visual states. Click prin toate fără să recrei contextul aplicației.", difficulty: "easy" },
      { number: 3, name: "argTypes", question: "Pentru ce e argTypes?", options: ["State", "Configurare controale UI pentru props (selector, slider, color)", "Validare", "Cache"], answer: "Configurare controale UI pentru props (selector, slider, color)", explanation: "Storybook generează controlsmpentru a modifica props live.", difficulty: "medium" },
      { number: 4, name: "Chromatic", question: "Ce e Chromatic?", options: ["UI lib", "Visual regression testing pentru Storybook (snapshot UI)", "Cache", "Theme"], answer: "Visual regression testing pentru Storybook (snapshot UI)", explanation: "Detectează modificări vizuale neintenționate între PR-uri.", difficulty: "hard" },
    ],
  },
  {
    slug: "react-perf-memo",
    title: "27. Performance — memo, useMemo, useCallback",
    order: 27,
    theory: [
      { order: 1, title: "memo — re-render skip", content: "Componentă re-render-ează doar dacă props-urile s-au schimbat (shallow compare):\n\n```jsx\nimport { memo } from 'react';\n\nconst List = memo(function List({ items }) {\n  return items.map(i => <Item key={i.id} {...i} />);\n});\n```\n\n**Atenție:** funcții și obiecte create în părinte sunt referințe noi la fiecare render → memo nu ajută. Folosește useCallback / useMemo pentru a stabiliza." },
      { order: 2, title: "useMemo și useCallback", content: "```jsx\nfunction Parent({ items }) {\n  // Recalculat doar dacă items se schimbă\n  const sorted = useMemo(\n    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),\n    [items]\n  );\n\n  // Funcție stabilă (referință)\n  const handleClick = useCallback((id) => {\n    setSelected(id);\n  }, []);\n\n  return <List items={sorted} onItemClick={handleClick} />;\n}\n```\n\n**Regula:** nu memoiza prematur. Profilează cu React DevTools Profiler **înainte**." },
    ],
    tasks: [
      { number: 1, name: "memo scop", question: "Ce face React.memo?", options: ["Cache state", "Skip re-render dacă props nu s-au schimbat (shallow)", "Lazy load", "State"], answer: "Skip re-render dacă props nu s-au schimbat (shallow)", explanation: "Util pentru liste mari sau componente cu multe sub-noduri.", difficulty: "medium" },
      { number: 2, name: "useCallback", question: "Pentru ce e useCallback?", options: ["State", "Stabilizează referința unei funcții între render-uri", "Cache value", "Effect"], answer: "Stabilizează referința unei funcții între render-uri", explanation: "Util când o pasezi unei componente memo-ate, pentru a evita re-render inutil.", difficulty: "medium" },
      { number: 3, name: "premature opt", question: "Antipattern cu memo?", options: ["Niciodată", "Memoizare peste tot fără măsurare — adaugă overhead și complexitate", "Pe componente vechi", "În SSR"], answer: "Memoizare peste tot fără măsurare — adaugă overhead și complexitate", explanation: "Profilează întâi (Profiler). Optimizează doar bottleneck-uri reale.", difficulty: "hard" },
      { number: 4, name: "useMemo", question: "Când folosești useMemo?", options: ["Mereu", "Calcule scumpe sau referințe stabile pentru dependențe", "Niciodată", "Doar UI"], answer: "Calcule scumpe sau referințe stabile pentru dependențe", explanation: "Sort lung, filter, expensive transform. Sau pentru obj/array pasate la memo-uri.", difficulty: "medium" },
    ],
  },
  {
    slug: "react-virtualization",
    title: "28. Virtualization — liste mari",
    order: 28,
    theory: [
      { order: 1, title: "Problema listelor mari", content: "Render 10,000 elemente = DOM cu 10,000 noduri = lag. Soluție: **virtualization** — randează doar elementele vizibile + buffer.\n\n```bash\nnpm install @tanstack/react-virtual\n```\n\n```jsx\nimport { useVirtualizer } from '@tanstack/react-virtual';\n\nfunction List({ items }) {\n  const parentRef = useRef(null);\n  const virtualizer = useVirtualizer({\n    count: items.length,\n    getScrollElement: () => parentRef.current,\n    estimateSize: () => 50,\n  });\n\n  return (\n    <div ref={parentRef} style={{ height: 500, overflow: 'auto' }}>\n      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>\n        {virtualizer.getVirtualItems().map(v => (\n          <div key={v.key} style={{ position: 'absolute', top: v.start, height: v.size }}>\n            {items[v.index].name}\n          </div>\n        ))}\n      </div>\n    </div>\n  );\n}\n```" },
      { order: 2, title: "Alte soluții", content: "**react-window** (Brian Vaughn) — minimal, simplu, doar fixed-size.\n**react-virtuoso** — auto-size, table support, sticky headers, infinite scroll.\n**TanStack Virtual** — modern, framework-agnostic, hook-based.\n\n**Când să virtualizezi:**\n• 100+ elemente cu interacțiuni complexe (cards, tabel, mesaje)\n• Listă infinită (scroll feed, log)\n• Tabele cu sute de rânduri\n\n**Când NU:**\n• Liste sub ~50 elemente — nu merită complexitatea\n• Conținut cu înălțime variabilă imprevizibilă (mai greu)" },
    ],
    tasks: [
      { number: 1, name: "scop", question: "Ce e virtualization?", options: ["Server", "Render doar elementele vizibile + buffer (nu tot DOM-ul)", "Cache", "SSR"], answer: "Render doar elementele vizibile + buffer (nu tot DOM-ul)", explanation: "10,000 items → ~20 randate la moment. Restul calculate când scroll-ezi.", difficulty: "easy" },
      { number: 2, name: "useVirtualizer", question: "Ce face useVirtualizer (TanStack)?", options: ["State", "Calculează ce items să randezi pe baza scroll position", "Animation", "Cache"], answer: "Calculează ce items să randezi pe baza scroll position", explanation: "Hook care expune virtualItems (vizibile) și total size (pentru scrollbar).", difficulty: "medium" },
      { number: 3, name: "cand", question: "Când virtualizezi?", options: ["Mereu", "Liste 100+ cu interactivitate (mesaje, tabele, feed-uri)", "Niciodată", "Pentru imagini"], answer: "Liste 100+ cu interactivitate (mesaje, tabele, feed-uri)", explanation: "Sub 100 nu merită overhead. Peste — diferență dramatică în performance.", difficulty: "medium" },
      { number: 4, name: "limitare", question: "Limită virtualization?", options: ["Niciuna", "Înălțime variabilă imprevizibilă, search-on-page (Ctrl+F nu vede tot)", "Lent", "Bug"], answer: "Înălțime variabilă imprevizibilă, search-on-page (Ctrl+F nu vede tot)", explanation: "Browser nu poate căuta în DOM-ul nerandat. Și height variabil necesită measurement.", difficulty: "hard" },
    ],
  },
  {
    slug: "react-framer-motion",
    title: "29. Animații — Framer Motion",
    order: 29,
    theory: [
      { order: 1, title: "Animații declarative", content: "```bash\nnpm install framer-motion\n```\n\n```jsx\nimport { motion } from 'framer-motion';\n\nfunction Card() {\n  return (\n    <motion.div\n      initial={{ opacity: 0, y: 20 }}\n      animate={{ opacity: 1, y: 0 }}\n      exit={{ opacity: 0, y: -20 }}\n      transition={{ duration: 0.3, ease: 'easeOut' }}\n      whileHover={{ scale: 1.05 }}\n      whileTap={{ scale: 0.95 }}\n    >\n      Conținut\n    </motion.div>\n  );\n}\n```" },
      { order: 2, title: "AnimatePresence și layout", content: "```jsx\nimport { AnimatePresence, motion } from 'framer-motion';\n\nfunction Modal({ open, children }) {\n  return (\n    <AnimatePresence>\n      {open && (\n        <motion.div\n          initial={{ opacity: 0 }}\n          animate={{ opacity: 1 }}\n          exit={{ opacity: 0 }}\n        >\n          {children}\n        </motion.div>\n      )}\n    </AnimatePresence>\n  );\n}\n\n// Layout animations — animă schimbări de poziție/mărime\n<motion.div layout>...</motion.div>\n\n// Variants — keyframes nominate\nconst v = { hidden: { opacity: 0 }, show: { opacity: 1 } };\n<motion.div initial=\"hidden\" animate=\"show\" variants={v} />\n```" },
    ],
    tasks: [
      { number: 1, name: "motion", question: "Ce face motion.div?", options: ["Decorativ", "Wrapper care expune props animation (initial, animate, exit etc.)", "State", "Hook"], answer: "Wrapper care expune props animation (initial, animate, exit etc.)", explanation: "Componentă HTML normală, plus props pentru animații declarative.", difficulty: "easy" },
      { number: 2, name: "AnimatePresence", question: "Pentru ce e AnimatePresence?", options: ["Cache", "Permite animații EXIT când componenta e demontată", "State", "Modal"], answer: "Permite animații EXIT când componenta e demontată", explanation: "Fără AnimatePresence, exit nu funcționează (componenta dispare instant).", difficulty: "medium" },
      { number: 3, name: "layout prop", question: "Ce face layout pe motion?", options: ["Stil", "Animă automat schimbările de poziție/mărime (FLIP)", "Cache", "Disable"], answer: "Animă automat schimbările de poziție/mărime (FLIP)", explanation: "Reorder list cu animation smoooth fără cod custom. Magic.", difficulty: "hard" },
      { number: 4, name: "spring", question: "Ce e o tranziție spring?", options: ["Sezonieră", "Tranziție bazată pe fizică (mass, stiffness, damping)", "Linear", "CSS"], answer: "Tranziție bazată pe fizică (mass, stiffness, damping)", explanation: "Mai natural decât easing fix. transition: { type: 'spring', stiffness: 300 }.", difficulty: "medium" },
    ],
  },
  {
    slug: "react-proiect-todo",
    title: "30. Mini proiect — Todo App complet",
    order: 30,
    theory: [
      { order: 1, title: "Structura proiectului", content: "```\nsrc/\n  components/\n    TodoList.jsx\n    TodoItem.jsx\n    TodoForm.jsx\n    Filter.jsx\n  hooks/\n    useTodos.js\n  App.jsx\n```\n\n**Features:**\n• Add / edit / delete / toggle done\n• Filter: all, active, completed\n• Persistență în localStorage\n• Animații Framer Motion la add/remove\n• Validare Zod\n• Test coverage cu Vitest" },
      { order: 2, title: "Hook custom + componente", content: "```jsx\n// hooks/useTodos.js\nimport { useState, useEffect } from 'react';\n\nexport function useTodos() {\n  const [todos, setTodos] = useState(() => {\n    const stored = localStorage.getItem('todos');\n    return stored ? JSON.parse(stored) : [];\n  });\n\n  useEffect(() => {\n    localStorage.setItem('todos', JSON.stringify(todos));\n  }, [todos]);\n\n  const add = (text) => setTodos(t => [...t, { id: crypto.randomUUID(), text, done: false }]);\n  const toggle = (id) => setTodos(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));\n  const remove = (id) => setTodos(t => t.filter(x => x.id !== id));\n\n  return { todos, add, toggle, remove };\n}\n```\n\n```jsx\n// App.jsx\nfunction App() {\n  const { todos, add, toggle, remove } = useTodos();\n  const [filter, setFilter] = useState('all');\n\n  const filtered = todos.filter(t =>\n    filter === 'all' || (filter === 'active' ? !t.done : t.done)\n  );\n\n  return (\n    <main>\n      <TodoForm onAdd={add} />\n      <Filter value={filter} onChange={setFilter} />\n      <TodoList todos={filtered} onToggle={toggle} onRemove={remove} />\n    </main>\n  );\n}\n```" },
    ],
    tasks: [
      { number: 1, name: "custom hook", question: "De ce extragi useTodos custom hook?", options: ["Decorativ", "Reutilizabil + separare logică de UI + ușor de testat", "Lent", "Niciun motiv"], answer: "Reutilizabil + separare logică de UI + ușor de testat", explanation: "Hook = logic. Componenta = UI. Reuse ușor și mocking simplu în teste.", difficulty: "medium" },
      { number: 2, name: "lazy initial state", question: "De ce useState(() => JSON.parse(...))?", options: ["Decorativ", "Lazy initial — citit din localStorage doar la mount, nu la fiecare render", "Performance", "Random"], answer: "Lazy initial — citit din localStorage doar la mount, nu la fiecare render", explanation: "Cu valoare directă, JSON.parse rulează la fiecare render (chiar dacă state e calcula deja).", difficulty: "hard" },
      { number: 3, name: "crypto.randomUUID", question: "Ce face crypto.randomUUID()?", options: ["Hash", "Generează ID unic v4 (browser nativ)", "Random număr", "Encrypt"], answer: "Generează ID unic v4 (browser nativ)", explanation: "Înlocuiește librării ca uuid. Built-in modern browsers.", difficulty: "medium" },
      { number: 4, name: "useEffect localStorage", question: "De ce salvezi în useEffect, nu direct în setTodos?", options: ["E ilegal", "Side effects în setter pot dubla executarea (StrictMode)", "Mai lent", "Nu contează"], answer: "Side effects în setter pot dubla executarea (StrictMode)", explanation: "useEffect e locul oficial pentru side effects (sync cu external state).", difficulty: "hard" },
    ],
  },
];

module.exports = { reactMore };
