const reactExtra = [
  {
    "slug": "react-19-actions",
    "title": "31. React 19 — Actions si use() hook",
    "order": 31,
    "theory": [
      {
        "order": 1,
        "title": "Form Actions in React 19",
        "content": "React 19 introduce suport nativ pentru form actions, eliminand nevoia de useState + handler manual pentru formulare simple.\n\n```jsx\n// React 18 (clasic):\nfunction OldForm() {\n  const [name, setName] = useState('');\n  const [status, setStatus] = useState(null);\n\n  async function handleSubmit(e) {\n    e.preventDefault();\n    const res = await saveUser({ name });\n    setStatus(res.ok ? 'salvat' : 'eroare');\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={name} onChange={e => setName(e.target.value)} />\n      <button type=\"submit\">Salveaza</button>\n      {status && <p>{status}</p>}\n    </form>\n  );\n}\n\n// React 19 — cu action:\nasync function saveUserAction(formData) {\n  'use server'; // sau client action\n  const name = formData.get('name');\n  await db.users.create({ data: { name } });\n}\n\nfunction NewForm() {\n  return (\n    <form action={saveUserAction}>\n      <input name=\"name\" />\n      <button type=\"submit\">Salveaza</button>\n    </form>\n  );\n}\n```\n\nReact 19 gestioneaza automat starea pending, erorile si resetarea formularului dupa submit reusit.\n\nLA INTERVIU: Ce aduce React 19 pentru formulare? Actions permit colocarea logicii de submit cu componenta, cu suport nativ pentru async si pending state."
      },
      {
        "order": 2,
        "title": "useActionState si useFormStatus",
        "content": "Hook-urile `useActionState` si `useFormStatus` (React 19) ofera control complet asupra starii unui form action.\n\n```jsx\nimport { useActionState } from 'react';\nimport { useFormStatus } from 'react-dom';\n\n// useFormStatus — citeste status-ul formularului parinte\nfunction SubmitButton() {\n  const { pending } = useFormStatus();\n  return (\n    <button type=\"submit\" disabled={pending}>\n      {pending ? 'Se salveaza...' : 'Salveaza'}\n    </button>\n  );\n}\n\n// useActionState — state + action intr-un hook\nasync function createPost(prevState, formData) {\n  const title = formData.get('title');\n  if (!title) return { error: 'Titlul este obligatoriu' };\n  await db.posts.create({ data: { title } });\n  return { success: true };\n}\n\nfunction PostForm() {\n  const [state, action, isPending] = useActionState(createPost, null);\n\n  return (\n    <form action={action}>\n      {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}\n      {state?.success && <p>Post creat cu succes!</p>}\n      <input name=\"title\" placeholder=\"Titlu post\" />\n      <SubmitButton />\n    </form>\n  );\n}\n```\n\nSemnatura: `useActionState(action, initialState, permalink?)` returneaza `[state, dispatchAction, isPending]`."
      },
      {
        "order": 3,
        "title": "useOptimistic — UI optimist",
        "content": "useOptimistic permite actualizarea UI inainte ca raspunsul serverului sa soseasca, revenind automat la starea initiala daca actiunea esueaza.\n\n```jsx\nimport { useOptimistic, useState } from 'react';\n\nasync function sendMessageAction(message) {\n  await fetch('/api/messages', {\n    method: 'POST',\n    body: JSON.stringify({ text: message }),\n  });\n}\n\nfunction Chat({ initialMessages }) {\n  const [messages, setMessages] = useState(initialMessages);\n  const [optimisticMsgs, addOptimistic] = useOptimistic(\n    messages,\n    (state, newMsg) => [\n      ...state,\n      { id: Date.now(), text: newMsg, sending: true },\n    ]\n  );\n\n  async function handleSend(formData) {\n    const text = formData.get('text');\n    addOptimistic(text); // UI update imediat\n    await sendMessageAction(text); // Request async\n    setMessages(prev => [...prev, { id: Date.now(), text }]); // Confirmare\n  }\n\n  return (\n    <>\n      <ul>\n        {optimisticMsgs.map(m => (\n          <li key={m.id} style={{ opacity: m.sending ? 0.5 : 1 }}>\n            {m.text}\n          </li>\n        ))}\n      </ul>\n      <form action={handleSend}>\n        <input name=\"text\" />\n        <button type=\"submit\">Trimite</button>\n      </form>\n    </>\n  );\n}\n```\n\nSemnatura: `useOptimistic(state, updateFn)` returneaza `[optimisticState, addOptimisticUpdate]`."
      },
      {
        "order": 4,
        "title": "use() hook — promise si context",
        "content": "Hook-ul `use()` (React 19) poate citi valoarea unui promise sau a unui Context, putand fi apelat conditionat.\n\n```jsx\nimport { use, Suspense, createContext } from 'react';\n\n// use() cu Promise:\nfunction UserProfile({ userPromise }) {\n  const user = use(userPromise); // Suspenda pana e rezolvat\n  return <h1>Salut, {user.name}!</h1>;\n}\n\nfunction App() {\n  const userPromise = fetch('/api/user').then(r => r.json());\n  return (\n    <Suspense fallback={<p>Se incarca...</p>}>\n      <UserProfile userPromise={userPromise} />\n    </Suspense>\n  );\n}\n\n// use() cu Context (poate fi conditionat!):\nconst ThemeCtx = createContext('light');\n\nfunction ThemedButton({ showTheme }) {\n  if (!showTheme) return <button>Buton simplu</button>;\n  // Spre deosebire de useContext, use() poate fi in if:\n  const theme = use(ThemeCtx);\n  return <button className={theme}>Buton tematic</button>;\n}\n\n// Error Boundary cu use() si promise:\nfunction SafeUser({ userPromise }) {\n  try {\n    const user = use(userPromise);\n    return <span>{user.name}</span>;\n  } catch (err) {\n    return <span>Eroare la incarcare</span>;\n  }\n}\n```\n\nDiferenta fata de `useContext`: `use()` poate fi apelat in conditionale si bucle — nu respecta regula \"hooks la top level\".\n\nLA INTERVIU: Ce face `use()` diferit de alte hooks? Poate fi apelat conditionat si poate consuma atat Promise cat si Context."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Form action React 19",
        "question": "In React 19, cum pasezi o functie async direct la un formular?",
        "options": [
          "<form onSubmit={fn}>",
          "<form action={fn}>",
          "<form handler={fn}>",
          "<form submit={fn}>"
        ],
        "answer": "<form action={fn}>",
        "explanation": "React 19 permite action prop cu functii async. React gestioneaza automat pending state si reset.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "useActionState return",
        "question": "Ce returneaza useActionState(action, initialState)?",
        "options": [
          "[state, action]",
          "[state, action, isPending]",
          "[isPending, action, state]",
          "[action, state]"
        ],
        "answer": "[state, action, isPending]",
        "explanation": "Cel de-al treilea element isPending permite dezactivarea butonului in timpul actiunii.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "useFormStatus",
        "question": "Unde poti apela useFormStatus?",
        "options": [
          "In orice componenta",
          "Doar in componente copil ale formularului",
          "Doar la nivel de pagina",
          "In Server Components"
        ],
        "answer": "Doar in componente copil ale formularului",
        "explanation": "useFormStatus citeste contextul formularului parinte — componenta trebuie sa fie descendent al <form>.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "useOptimistic scop",
        "question": "La ce serveste useOptimistic?",
        "options": [
          "Optimizeaza performanta render-urilor",
          "Actualizeaza UI inainte de confirmare server, revenind la eroare",
          "Cacheaza rezultatele fetch",
          "Reduce re-render-urile"
        ],
        "answer": "Actualizeaza UI inainte de confirmare server, revenind la eroare",
        "explanation": "Optimistic UI = raspuns imediat vizual. Daca serverul esueaza, starea revine automat la original.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "use() cu context",
        "question": "Ce avantaj are use(Context) fata de useContext?",
        "options": [
          "E mai rapid",
          "Poate fi apelat conditionat (in if/for)",
          "E mai sigur",
          "Suporta mai multe contexte"
        ],
        "answer": "Poate fi apelat conditionat (in if/for)",
        "explanation": "use() nu respecta regula hooks-at-top-level. Util cand vrei context conditionat.",
        "difficulty": "hard"
      },
      {
        "number": 6,
        "name": "use() cu Promise",
        "question": "Ce se intampla cand un Promise pasat la use() nu e inca rezolvat?",
        "options": [
          "Returneaza undefined",
          "Componenta Suspenda pana se rezolva",
          "Arunca eroare",
          "Returneaza null"
        ],
        "answer": "Componenta Suspenda pana se rezolva",
        "explanation": "use() integreaza cu Suspense. Trebuie un <Suspense fallback> parinte.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "prevState in action",
        "question": "Primul parametru al action-ului din useActionState este?",
        "options": [
          "formData",
          "event",
          "prevState — starea anterioara returnata de action",
          "dispatch"
        ],
        "answer": "prevState — starea anterioara returnata de action",
        "explanation": "Semnatura: async function action(prevState, formData). prevState e ce a returnat apelul anterior.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "pending state",
        "question": "Cum obtii starea pending intr-un buton de submit fara useFormStatus?",
        "options": [
          "Nu se poate",
          "Al treilea element din useActionState: isPending",
          "useState separat",
          "useRef"
        ],
        "answer": "Al treilea element din useActionState: isPending",
        "explanation": "useActionState returneaza [state, action, isPending]. Poti folosi isPending direct in componenta forma.",
        "difficulty": "easy"
      },
      {
        "number": 9,
        "name": "Coding: useOptimistic",
        "question": "Implementeaza un list de todo-uri cu useOptimistic. La adaugare, itemul apare imediat cu stilul 'opacity: 0.5' pana la confirmare server.",
        "options": [],
        "answer": "",
        "explanation": "useOptimistic permite UI optimist: adaugi imediat in lista cu flag sending:true, confirmi dupa raspuns.",
        "difficulty": "hard"
      },
      {
        "number": 10,
        "name": "Coding: useActionState form",
        "question": "Creeaza un formular de login cu useActionState care valideaza ca email-ul contine '@' si afiseaza eroarea.",
        "options": [],
        "answer": "",
        "explanation": "useActionState combina starea si actiunea. La eroare returneaza { error: '...' }, la succes { success: true }.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "Coding: use() cu Promise",
        "question": "Creeaza o componenta UserCard care primeste un promise ca prop si afiseaza datele utilizatorului folosind use().",
        "options": [],
        "answer": "",
        "explanation": "use(promise) suspenda componenta pana promise e rezolvat. Necesita Suspense parinte.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Error handling action",
        "question": "Cum tratezi o eroare de retea intr-un form action cu useActionState?",
        "options": [
          "try/catch in action + return { error: message }",
          "useErrorBoundary",
          "window.onerror",
          "console.error"
        ],
        "answer": "try/catch in action + return { error: message }",
        "explanation": "Action-ul returneaza stare. La catch, returneaza { error: err.message } — componenta afiseaza eroarea.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Reset form",
        "question": "Cum reseti un formular dupa submit reusit cu React 19 actions?",
        "options": [
          "e.target.reset() manual",
          "React reseteaza automat formularul dupa un action care nu arunca eroare",
          "useState pentru fiecare camp",
          "useRef la form"
        ],
        "answer": "React reseteaza automat formularul dupa un action care nu arunca eroare",
        "explanation": "Comportament nativ React 19: dupa action reusit, form se reseteaza automat. La eroare (throw) nu se reseteaza.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Diferenta actions vs onSubmit",
        "question": "Principalul avantaj al form actions fata de onSubmit clasic?",
        "options": [
          "Sunt mai rapide",
          "Suport nativ async, pending state si resetare automata fara useState extra",
          "Nu necesita JavaScript",
          "Sunt compatibile cu toate browserele"
        ],
        "answer": "Suport nativ async, pending state si resetare automata fara useState extra",
        "explanation": "onSubmit necesita useState pentru pending/error/success. Actions gestioneaza asta automat.",
        "difficulty": "easy"
      },
      {
        "number": 15,
        "name": "Coding: SubmitButton cu useFormStatus",
        "question": "Creeaza un SubmitButton reutilizabil care se dezactiveaza in timpul unui form action, folosind useFormStatus.",
        "options": [],
        "answer": "",
        "explanation": "useFormStatus trebuie apelat intr-o componenta copil a formularului — nu in componenta care contine <form>.",
        "difficulty": "easy"
      }
    ]
  },
  {
    "slug": "react-server-components",
    "title": "32. Server Components in React",
    "order": 32,
    "theory": [
      {
        "order": 1,
        "title": "RSC vs Client Components — diferente fundamentale",
        "content": "React Server Components (RSC) sunt componente care ruleaza exclusiv pe server. Nu au JavaScript in bundle-ul clientului.\n\n```jsx\n// SERVER COMPONENT (implicit in Next.js App Router)\n// Fisier: app/posts/page.jsx\n// NU are 'use client' — e server by default\n\nasync function PostsPage() {\n  // Acces direct la DB — fara fetch, fara useEffect!\n  const posts = await db.post.findMany({ orderBy: { createdAt: 'desc' } });\n\n  return (\n    <ul>\n      {posts.map(p => (\n        <li key={p.id}>{p.title}</li>\n      ))}\n    </ul>\n  );\n}\n\n// CLIENT COMPONENT — are interactivitate\n// Fisier: components/LikeButton.jsx\n'use client';\nimport { useState } from 'react';\n\nfunction LikeButton({ postId, initialLikes }) {\n  const [likes, setLikes] = useState(initialLikes);\n\n  return (\n    <button onClick={() => setLikes(l => l + 1)}>\n      {likes} aprecieri\n    </button>\n  );\n}\n```\n\nREGULI ESENTIALE:\n- Server Components pot importa Client Components\n- Client Components NU pot importa Server Components (dar pot primi ca `children` prop)\n- Server Components nu au: useState, useEffect, onClick, event handlers\n- Client Components nu pot: await in corp, acces direct la DB\n\nLA INTERVIU: Diferenta RSC vs Client Components? RSC: zero JS client, async direct, acces la resurse server. Client: interactivitate, hooks, browser APIs."
      },
      {
        "order": 2,
        "title": "Serializarea props si granita server/client",
        "content": "Datele trimise de la Server la Client Components trebuie sa fie serializabile (JSON-abil).\n\n```jsx\n// Server Component parinte:\nasync function ProductPage({ id }) {\n  const product = await db.product.findUnique({ where: { id } });\n\n  // CORECT — props serializabile (string, number, array, plain object):\n  return (\n    <ProductCard\n      name={product.name}\n      price={product.price}\n      images={product.images}\n    />\n  );\n}\n\n// GRESIT — functii nu sunt serializabile:\nreturn <ProductCard onClick={() => console.log('click')} />;\n// Eroare: Functions cannot be passed directly to Client Components\n// Exceptie: Server Actions (marcare speciala)\n\n// Compositing pattern — Server in Client via children:\n'use client';\nfunction Slider({ children }) {\n  const [index, setIndex] = useState(0);\n  return (\n    <div>\n      <button onClick={() => setIndex(i => i - 1)}>Prev</button>\n      <div>{children}</div>  {/* children vine de la server! */}\n      <button onClick={() => setIndex(i => i + 1)}>Next</button>\n    </div>\n  );\n}\n\n// Server Component:\nasync function Gallery() {\n  const items = await fetchItems();\n  return (\n    <Slider> {/* Client Component */}\n      {items.map(i => <GalleryItem key={i.id} item={i} />)}\n    </Slider>\n  );\n}\n```\n\nTIPURI SERIALIZABILE: string, number, boolean, null, Array, plain object, Date, URL, BigInt, ArrayBuffer, ReactElement\nNESERIALIZABILE: functions, class instances, Symbol, Map, Set, WeakRef"
      },
      {
        "order": 3,
        "title": "Async Server Components si patterns de fetch",
        "content": "Server Components pot fi async direct — cel mai curat mod de a aduce date in Next.js App Router.\n\n```jsx\n// Pattern 1: fetch paralel cu Promise.all\nasync function DashboardPage() {\n  // Paralel — nu sequential!\n  const [user, stats, notifications] = await Promise.all([\n    getUser(),\n    getStats(),\n    getNotifications(),\n  ]);\n\n  return (\n    <Dashboard user={user} stats={stats} notifications={notifications} />\n  );\n}\n\n// Pattern 2: fetch sequential (dependenta)\nasync function ProductPage({ id }) {\n  const product = await getProduct(id); // Mai intai produsul\n  const related = await getRelated(product.categoryId); // Apoi relatate\n  return <Product data={product} related={related} />;\n}\n\n// Pattern 3: Suspense pentru fetch paralel independent\nasync function SlowComponent() {\n  const data = await slowFetch(); // 3 secunde\n  return <div>{data.title}</div>;\n}\n\nasync function FastComponent() {\n  const data = await fastFetch(); // 100ms\n  return <div>{data.count}</div>;\n}\n\nfunction Page() {\n  return (\n    <>\n      <Suspense fallback={<Spinner />}>\n        <SlowComponent />\n      </Suspense>\n      <FastComponent /> {/* Nu asteapta SlowComponent */}\n    </>\n  );\n}\n\n// Pattern 4: cache() pentru deduplicare\nimport { cache } from 'react';\nconst getUser = cache(async (id) => {\n  return db.user.findUnique({ where: { id } });\n});\n// Apelata de 10x cu acelasi id => un singur query DB\n```"
      },
      {
        "order": 4,
        "title": "Server Actions — mutatii din Server Components",
        "content": "Server Actions permit formulare si mutatii care ruleaza pe server, apelate din Client sau Server Components.\n\n```jsx\n// Definire Server Action in fisier separat:\n// actions/post.js\n'use server';\nimport { revalidatePath } from 'next/cache';\nimport { redirect } from 'next/navigation';\n\nexport async function createPost(formData) {\n  const title = formData.get('title');\n  const content = formData.get('content');\n\n  if (!title || title.length < 3) {\n    throw new Error('Titlul trebuie sa aiba minim 3 caractere');\n  }\n\n  const post = await db.post.create({\n    data: { title, content, authorId: getCurrentUser().id },\n  });\n\n  revalidatePath('/posts'); // Invalideaza cache\n  redirect(`/posts/${post.id}`); // Redirectioneaza\n}\n\n// Folosire in Server Component (simplu):\nimport { createPost } from '@/actions/post';\n\nfunction NewPostPage() {\n  return (\n    <form action={createPost}>\n      <input name=\"title\" required />\n      <textarea name=\"content\" />\n      <button type=\"submit\">Creeaza</button>\n    </form>\n  );\n}\n\n// Folosire in Client Component cu useActionState:\n'use client';\nimport { createPost } from '@/actions/post';\nimport { useActionState } from 'react';\n\nfunction PostForm() {\n  const [state, action, isPending] = useActionState(\n    async (prev, formData) => {\n      try {\n        await createPost(formData);\n        return { success: true };\n      } catch (e) {\n        return { error: e.message };\n      }\n    },\n    null\n  );\n  // ...\n}\n```\n\nLA INTERVIU: Ce sunt Server Actions? Functii async marcate cu 'use server' care ruleaza pe server, apelate din client via RPC. Permit mutatii fara API routes explicite."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "RSC definitie",
        "question": "Ce caracteristica defineste un React Server Component?",
        "options": [
          "Are useState",
          "Ruleaza pe server, zero JS in bundle client, poate fi async direct",
          "Foloseste useEffect",
          "Are event handlers"
        ],
        "answer": "Ruleaza pe server, zero JS in bundle client, poate fi async direct",
        "explanation": "RSC = executie server, zero bundle cost, acces direct DB/FS, nu poate folosi hooks de stare.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "use client directiva",
        "question": "Ce face directiva 'use client' in Next.js App Router?",
        "options": [
          "Ruleaza codul pe client",
          "Marcheaza componenta si descendentii ei ca Client Components (cu hooks, events)",
          "Dezactiveaza SSR",
          "Importa codul din CDN"
        ],
        "answer": "Marcheaza componenta si descendentii ei ca Client Components (cu hooks, events)",
        "explanation": "Fara 'use client', componentele sunt Server by default in App Router. Directiva marcheaza granita.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "Props serializabile",
        "question": "Ce tipuri de date POT fi transmise ca props de la Server la Client Components?",
        "options": [
          "Orice tip JavaScript",
          "Functii si class instances",
          "String, number, array, plain object, ReactElement",
          "Map, Set, WeakRef"
        ],
        "answer": "String, number, array, plain object, ReactElement",
        "explanation": "Props trebuie sa fie serializabile (JSON-abile). Functiile nu pot fi pasate direct (exceptie: Server Actions).",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "Children pattern",
        "question": "Cum poti folosi un Server Component in interiorul unui Client Component?",
        "options": [
          "Nu se poate",
          "Prin props.children — Server Component e evaluat pe server si pasat ca ReactElement",
          "Cu use() hook",
          "Cu dynamic import"
        ],
        "answer": "Prin props.children — Server Component e evaluat pe server si pasat ca ReactElement",
        "explanation": "Client Component accepta children (ReactElement serializabil). Parinte Server Component face compozitia.",
        "difficulty": "hard"
      },
      {
        "number": 5,
        "name": "async Server Component",
        "question": "Poti folosi await direct in corpul unui Server Component?",
        "options": [
          "Nu, trebuie useEffect",
          "Da, Server Components pot fi async",
          "Da, dar doar cu Suspense",
          "Nu, trebuie Promise.all"
        ],
        "answer": "Da, Server Components pot fi async",
        "explanation": "async function MyPage() { const data = await fetch(...); return <div>{data}</div>; } — complet valid.",
        "difficulty": "easy"
      },
      {
        "number": 6,
        "name": "cache() React",
        "question": "La ce serveste cache() din React in Server Components?",
        "options": [
          "Cacheaza in localStorage",
          "Deduplicheaza apeluri identice in acelasi request (memoizare per-request)",
          "Stocheaza in Redis",
          "Cache HTTP"
        ],
        "answer": "Deduplicheaza apeluri identice in acelasi request (memoizare per-request)",
        "explanation": "cache() = memoizare server-side. Daca acelasi query e apelat de 5x in aceeasi cerere, se executa o singura data.",
        "difficulty": "hard"
      },
      {
        "number": 7,
        "name": "Server Actions",
        "question": "Ce face directiva 'use server' intr-o functie?",
        "options": [
          "Ruleaza functia pe server",
          "Marcheaza functia ca Server Action — poate fi apelata din client, ruleaza pe server",
          "Dezactiveaza cache",
          "Forteaza SSR"
        ],
        "answer": "Marcheaza functia ca Server Action — poate fi apelata din client, ruleaza pe server",
        "explanation": "Server Actions = RPC automat. Clientul apeleaza functia, Next.js trimite request la server.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "revalidatePath",
        "question": "Ce face revalidatePath('/posts') intr-un Server Action?",
        "options": [
          "Redirectioneaza la /posts",
          "Invalideaza cache-ul Next.js pentru ruta /posts, fortand re-fetch la urmatoarea vizita",
          "Sterge cookies",
          "Reload pagina"
        ],
        "answer": "Invalideaza cache-ul Next.js pentru ruta /posts, fortand re-fetch la urmatoarea vizita",
        "explanation": "Dupa o mutatie (create/update/delete), revalidatePath asigura ca datele sunt actuale.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "Diferenta fetch in RSC vs useEffect",
        "question": "De ce e mai bun fetch in Server Component fata de fetch in useEffect (client)?",
        "options": [
          "E mai rapid",
          "Nu adauga JS la client, nu exista waterfall initial, datele sunt gata la render",
          "Are mai multe optiuni",
          "E mai usor de scris"
        ],
        "answer": "Nu adauga JS la client, nu exista waterfall initial, datele sunt gata la render",
        "explanation": "useEffect fetch: HTML gol, JS download, mount, fetch, re-render. RSC: date gata in HTML initial.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Coding: Server Component async",
        "question": "Scrie un Server Component ProductList care aduce produse din DB si le afiseaza intr-o lista.",
        "options": [],
        "answer": "",
        "explanation": "Server Components pot fi async, accesand DB direct fara useEffect.",
        "difficulty": "easy"
      },
      {
        "number": 11,
        "name": "Coding: Server Action",
        "question": "Creeaza un Server Action addComment care primeste formData, valideaza ca textul are cel putin 5 caractere, si returneaza eroarea sau succesul.",
        "options": [],
        "answer": "",
        "explanation": "Server Actions returneaza stare. Validarea se face pe server — nu poate fi ocolita din client.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Promise.all in RSC",
        "question": "De ce folosesti Promise.all pentru mai multe fetch-uri in Server Components?",
        "options": [
          "E obligatoriu",
          "Fetches ruleaza in paralel, reducand timpul total de asteptare",
          "E singurul mod",
          "Promise.all e mai usor de citit"
        ],
        "answer": "Fetches ruleaza in paralel, reducand timpul total de asteptare",
        "explanation": "await fetch1(); await fetch2() = sequential. Promise.all([fetch1(), fetch2()]) = paralel, mult mai rapid.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "RSC bundle",
        "question": "Cat JavaScript trimite un Server Component la browser?",
        "options": [
          "Tot codul componentei",
          "Zero JavaScript — RSC nu adauga la bundle-ul clientului",
          "Doar functiile",
          "Doar JSX"
        ],
        "answer": "Zero JavaScript — RSC nu adauga la bundle-ul clientului",
        "explanation": "RSC rulează 100% pe server. HTML-ul e trimis la client. Niciun cod de componenta nu ajunge in browser.",
        "difficulty": "easy"
      },
      {
        "number": 14,
        "name": "Eroare RSC",
        "question": "Ce se intampla daca importi useState intr-un Server Component?",
        "options": [
          "Functioneaza normal",
          "Eroare: useState nu poate fi folosit in Server Components — trebuie 'use client'",
          "useState e ignorat",
          "Se foloseste useState de pe server"
        ],
        "answer": "Eroare: useState nu poate fi folosit in Server Components — trebuie 'use client'",
        "explanation": "Hooks de stare (useState, useEffect, useContext) sunt disponibile doar in Client Components.",
        "difficulty": "easy"
      },
      {
        "number": 15,
        "name": "Streaming cu Suspense in RSC",
        "question": "Cum implementezi streaming in App Router pentru componente lente?",
        "options": [
          "loading.js global",
          "Impacheteaza componenta async intr-un <Suspense fallback>",
          "getServerSideProps",
          "useTransition"
        ],
        "answer": "Impacheteaza componenta async intr-un <Suspense fallback>",
        "explanation": "Suspense + async RSC = streaming. Pagina e trimisa imediat cu fallback, componenta lenta e streamed cand e gata.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "zustand-state",
    "title": "33. Zustand — State Management",
    "order": 33,
    "theory": [
      {
        "order": 1,
        "title": "Introducere Zustand — store simplu",
        "content": "Zustand e o librarie minimalista de state management. API mai simplu decat Redux, fara boilerplate.\n\n```bash\nnpm install zustand\n```\n\n```js\n// store/counterStore.js\nimport { create } from 'zustand';\n\nconst useCounterStore = create((set) => ({\n  count: 0,\n  increment: () => set((state) => ({ count: state.count + 1 })),\n  decrement: () => set((state) => ({ count: state.count - 1 })),\n  reset: () => set({ count: 0 }),\n  setCount: (n) => set({ count: n }),\n}));\n\nexport default useCounterStore;\n\n// Componenta:\nfunction Counter() {\n  // Selectori — componenta se re-rendereaza DOAR cand count se schimba\n  const count = useCounterStore((s) => s.count);\n  const increment = useCounterStore((s) => s.increment);\n\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={increment}>+</button>\n    </div>\n  );\n}\n\n// Selectare multipla:\nconst { count, increment, reset } = useCounterStore();\n// Atentie: selectarea intregului store => re-render la orice schimbare!\n```\n\nLA INTERVIU: De ce Zustand in locul Redux? Mai putine linii de cod, API simplu, fara boilerplate (no actions/reducers/dispatch), performanta buna prin selectori."
      },
      {
        "order": 2,
        "title": "Slices — organizarea store-ului mare",
        "content": "Pentru aplicatii mari, organizezi store-ul in slices (felii) si le combini.\n\n```js\n// store/slices/userSlice.js\nexport const createUserSlice = (set) => ({\n  user: null,\n  isLoading: false,\n  error: null,\n  login: async (credentials) => {\n    set({ isLoading: true, error: null });\n    try {\n      const user = await authAPI.login(credentials);\n      set({ user, isLoading: false });\n    } catch (err) {\n      set({ error: err.message, isLoading: false });\n    }\n  },\n  logout: () => set({ user: null }),\n});\n\n// store/slices/cartSlice.js\nexport const createCartSlice = (set, get) => ({\n  items: [],\n  addItem: (product) =>\n    set((state) => ({\n      items: [...state.items, { ...product, qty: 1 }],\n    })),\n  removeItem: (id) =>\n    set((state) => ({\n      items: state.items.filter((i) => i.id !== id),\n    })),\n  totalPrice: () =>\n    get().items.reduce((sum, i) => sum + i.price * i.qty, 0),\n});\n\n// store/index.js — combina slices:\nimport { create } from 'zustand';\nimport { createUserSlice } from './slices/userSlice';\nimport { createCartSlice } from './slices/cartSlice';\n\nconst useStore = create((...args) => ({\n  ...createUserSlice(...args),\n  ...createCartSlice(...args),\n}));\n\nexport default useStore;\n\n// Utilizare:\nconst user = useStore((s) => s.user);\nconst addItem = useStore((s) => s.addItem);\n```"
      },
      {
        "order": 3,
        "title": "persist — salvare in localStorage",
        "content": "Middleware-ul `persist` salveaza automat store-ul in localStorage (sau sessionStorage, AsyncStorage).\n\n```js\nimport { create } from 'zustand';\nimport { persist, createJSONStorage } from 'zustand/middleware';\n\nconst useSettingsStore = create(\n  persist(\n    (set) => ({\n      theme: 'light',\n      language: 'ro',\n      fontSize: 14,\n      setTheme: (theme) => set({ theme }),\n      setLanguage: (language) => set({ language }),\n    }),\n    {\n      name: 'app-settings', // cheia din localStorage\n      storage: createJSONStorage(() => localStorage), // implicit\n      // Persista doar tema (nu tot store-ul):\n      partialize: (state) => ({ theme: state.theme }),\n    }\n  )\n);\n\n// Versioning — migrare la schimbare structura:\nconst useStore = create(\n  persist(\n    (set) => ({ /* ... */ }),\n    {\n      name: 'store-v2',\n      version: 2,\n      migrate: (persistedState, version) => {\n        if (version === 1) {\n          // Migreaza de la v1 la v2\n          return { ...persistedState, newField: 'default' };\n        }\n        return persistedState;\n      },\n    }\n  )\n);\n\n// SessionStorage:\nconst useSessionStore = create(\n  persist(\n    (set) => ({ token: null }),\n    {\n      name: 'session',\n      storage: createJSONStorage(() => sessionStorage),\n    }\n  )\n);\n```"
      },
      {
        "order": 4,
        "title": "devtools, immer si selectori avansati",
        "content": "Zustand suporta Redux DevTools, immer pentru mutatii imutabile si selectori complecsi.\n\n```js\nimport { create } from 'zustand';\nimport { devtools } from 'zustand/middleware';\nimport { immer } from 'zustand/middleware/immer';\n\n// devtools — conectare la Redux DevTools:\nconst useStore = create(\n  devtools(\n    (set) => ({\n      count: 0,\n      increment: () =>\n        set(\n          (state) => ({ count: state.count + 1 }),\n          false, // replace sau merge\n          'counter/increment' // Numele actiunii in DevTools\n        ),\n    }),\n    { name: 'CounterStore' } // Numele store-ului in DevTools\n  )\n);\n\n// immer — mutatii directe (sintaxa mai curata):\nconst useListStore = create(\n  immer((set) => ({\n    items: [],\n    addItem: (item) =>\n      set((state) => {\n        state.items.push(item); // MUTATIE DIRECTA — immer o face imutabila\n      }),\n    updateItem: (id, changes) =>\n      set((state) => {\n        const item = state.items.find((i) => i.id === id);\n        if (item) Object.assign(item, changes);\n      }),\n  }))\n);\n\n// Selector cu shallow pentru obiecte:\nimport { useShallow } from 'zustand/react/shallow';\n\nconst { user, login, logout } = useStore(\n  useShallow((s) => ({ user: s.user, login: s.login, logout: s.logout }))\n);\n// Re-render doar cand user, login sau logout se schimba\n\n// Selector derivat:\nconst itemCount = useCartStore((s) => s.items.length);\nconst totalPrice = useCartStore((s) =>\n  s.items.reduce((sum, i) => sum + i.price * i.qty, 0)\n);\n```\n\nLA INTERVIU: Cum optimizezi re-render-urile cu Zustand? Selectori granulari sau useShallow pentru obiecte multiple — componenta se re-rendereaza doar cand valoarea selectorului se schimba."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Zustand create",
        "question": "Cum creezi un store Zustand?",
        "options": [
          "new Store()",
          "create((set) => ({ ... }))",
          "createStore(reducer)",
          "useStore.init()"
        ],
        "answer": "create((set) => ({ ... }))",
        "explanation": "create primeste un initializer care are acces la set (si get). Returneaza un hook custom.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "set functie",
        "question": "Ce face set((state) => ({ count: state.count + 1 }))?",
        "options": [
          "Seteaza state direct",
          "Merge state-ul nou cu cel vechi (partial update)",
          "Inlocuieste complet state-ul",
          "Returneaza state-ul nou"
        ],
        "answer": "Merge state-ul nou cu cel vechi (partial update)",
        "explanation": "set din Zustand face merge automat. Poti pasa { count: 5 } fara sa pierzi restul state-ului.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "Selector performanta",
        "question": "De ce folosesti selectori (s => s.count) in loc de useStore() complet?",
        "options": [
          "E obligatoriu",
          "Componenta se re-rendereaza DOAR cand valoarea selectorului se schimba",
          "E mai usor de scris",
          "Selectori sunt mai rapizi"
        ],
        "answer": "Componenta se re-rendereaza DOAR cand valoarea selectorului se schimba",
        "explanation": "useStore() complet => re-render la orice schimbare in store. Selector granular = mai putine re-render-uri.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "persist middleware",
        "question": "Ce face middleware-ul persist din Zustand?",
        "options": [
          "Sincronizeaza cu server",
          "Salveaza automat store-ul in localStorage si il restaureaza la reload",
          "Face store read-only",
          "Cacheaza query-urile"
        ],
        "answer": "Salveaza automat store-ul in localStorage si il restaureaza la reload",
        "explanation": "Util pentru settings, cos de cumparaturi, date utilizator persistente.",
        "difficulty": "easy"
      },
      {
        "number": 5,
        "name": "get in actions",
        "question": "La ce e util al doilea argument get in create((set, get) => ...)?",
        "options": [
          "Face GET request",
          "Citeste state-ul curent din actiuni fara a declansa re-render",
          "Returneaza store-ul",
          "Obtine devtools"
        ],
        "answer": "Citeste state-ul curent din actiuni fara a declansa re-render",
        "explanation": "get().items.length — util in actiuni care au nevoie de state curent (totalPrice calculator etc.).",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "immer middleware",
        "question": "Ce avantaj ofera middleware-ul immer?",
        "options": [
          "Face store mai rapid",
          "Permite mutatii directe (state.items.push) in actiuni — immer le face imutabile",
          "Reduce bundle size",
          "Conecteaza la Redux DevTools"
        ],
        "answer": "Permite mutatii directe (state.items.push) in actiuni — immer le face imutabile",
        "explanation": "Fara immer: state => ({ items: [...state.items, item] }). Cu immer: state => { state.items.push(item); }.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "devtools",
        "question": "Ce browser extension e necesara pentru Zustand devtools?",
        "options": [
          "Zustand Inspector",
          "Redux DevTools Extension",
          "React DevTools",
          "Vue DevTools"
        ],
        "answer": "Redux DevTools Extension",
        "explanation": "Zustand devtools middleware se conecteaza la Redux DevTools Extension — compatibil cu aceeasi extensie.",
        "difficulty": "easy"
      },
      {
        "number": 8,
        "name": "useShallow",
        "question": "Cand folosesti useShallow in Zustand?",
        "options": [
          "Mereu",
          "Cand selectezi un obiect cu multiple proprietati — previne re-render la referinta noua",
          "Niciodata",
          "Doar cu arrays"
        ],
        "answer": "Cand selectezi un obiect cu multiple proprietati — previne re-render la referinta noua",
        "explanation": "useStore(s => ({ a: s.a, b: s.b })) => obiect nou la fiecare render. useShallow compara shallow.",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "Zustand vs Redux",
        "question": "Principalul avantaj Zustand fata de Redux Toolkit?",
        "options": [
          "Mai rapid",
          "Zero boilerplate — nu ai actions/reducers/dispatch/slices separate",
          "Mai vechi",
          "Suporta TypeScript"
        ],
        "answer": "Zero boilerplate — nu ai actions/reducers/dispatch/slices separate",
        "explanation": "Redux: actions + reducers + dispatch + provider + connect. Zustand: create() + hook + gata.",
        "difficulty": "easy"
      },
      {
        "number": 10,
        "name": "Coding: store cart",
        "question": "Creeaza un store Zustand pentru cos de cumparaturi cu addItem, removeItem si totalPrice computed.",
        "options": [],
        "answer": "",
        "explanation": "get() permite calculul valorilor derivate in actiuni. set face merge partial.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "Coding: persist settings",
        "question": "Creeaza un store pentru setarile aplicatiei (theme, language) cu persist middleware, salvand doar theme in localStorage.",
        "options": [],
        "answer": "",
        "explanation": "partialize permite salvarea selectiva a campurilor din store.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Coding: slice pattern",
        "question": "Implementeaza un slice de autentificare (user, isLoading, login async, logout) ce poate fi combinat intr-un store mare.",
        "options": [],
        "answer": "",
        "explanation": "Slice pattern: functie care primeste (set, get) si returneaza obiect partial din store.",
        "difficulty": "hard"
      },
      {
        "number": 13,
        "name": "partialize",
        "question": "Ce face optiunea partialize in persist middleware?",
        "options": [
          "Salveaza partial store-ul (doar campurile selectate) in storage",
          "Incarca partial",
          "Migrationeaza schema",
          "Serialization custom"
        ],
        "answer": "Salveaza partial store-ul (doar campurile selectate) in storage",
        "explanation": "partialize: (state) => ({ theme: state.theme }) — salveaza doar theme, nu actiunile sau alte date.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Zustand outside React",
        "question": "Poti folosi Zustand (get/set) in afara componentelor React?",
        "options": [
          "Nu",
          "Da, prin getState() si setState() pe instanta store-ului",
          "Doar in Node.js",
          "Doar in teste"
        ],
        "answer": "Da, prin getState() si setState() pe instanta store-ului",
        "explanation": "const { getState, setState } = useStore; -- util in utilitare, axios interceptors, servicii.",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "Subscriptie manuala",
        "question": "Cum te abonezi la schimbarile unui store Zustand in afara React (ex: pentru sync cu URL)?",
        "options": [
          "Nu se poate",
          "useStore.subscribe(listener)",
          "useStore.on('change', fn)",
          "EventEmitter"
        ],
        "answer": "useStore.subscribe(listener)",
        "explanation": "useStore.subscribe((state) => { /* reactie la schimbari */ }) returneaza o functie de unsubscribe.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "tanstack-query-avansat",
    "title": "34. TanStack Query avansat",
    "order": 34,
    "theory": [
      {
        "order": 1,
        "title": "Prefetching si Hydration SSR",
        "content": "TanStack Query permite prefetching date pe server si hidratarea lor pe client.\n\n```jsx\n// Next.js App Router cu TanStack Query:\n// app/providers.jsx\n'use client';\nimport { QueryClient, QueryClientProvider } from '@tanstack/react-query';\nimport { useState } from 'react';\n\nexport function Providers({ children }) {\n  const [queryClient] = useState(() => new QueryClient());\n  return (\n    <QueryClientProvider client={queryClient}>\n      {children}\n    </QueryClientProvider>\n  );\n}\n\n// app/posts/page.jsx (Server Component cu prefetch):\nimport { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';\n\nasync function PostsPage() {\n  const queryClient = new QueryClient();\n\n  // Prefetch pe server\n  await queryClient.prefetchQuery({\n    queryKey: ['posts'],\n    queryFn: () => fetch('https://jsonplaceholder.typicode.com/posts').then(r => r.json()),\n  });\n\n  return (\n    <HydrationBoundary state={dehydrate(queryClient)}>\n      <PostsList /> {/* Client Component cu useQuery */}\n    </HydrationBoundary>\n  );\n}\n\n// components/PostsList.jsx\n'use client';\nimport { useQuery } from '@tanstack/react-query';\n\nfunction PostsList() {\n  const { data: posts } = useQuery({\n    queryKey: ['posts'],\n    queryFn: () => fetch('/api/posts').then(r => r.json()),\n  });\n  // Datele sunt deja disponibile (hidratate de server)!\n  return <ul>{posts?.map(p => <li key={p.id}>{p.title}</li>)}</ul>;\n}\n```\n\nAvantaj: zero loading state initial — datele vin din SSR."
      },
      {
        "order": 2,
        "title": "Infinite Queries — scroll infinit",
        "content": "useInfiniteQuery permite paginare infinita (scroll infinit).\n\n```jsx\nimport { useInfiniteQuery } from '@tanstack/react-query';\nimport { useInView } from 'react-intersection-observer';\nimport { useEffect } from 'react';\n\nasync function fetchPosts({ pageParam = 1 }) {\n  const res = await fetch(`/api/posts?page=${pageParam}&limit=10`);\n  return res.json();\n  // { data: [...], nextPage: 2, hasMore: true }\n}\n\nfunction InfinitePosts() {\n  const { ref, inView } = useInView();\n\n  const {\n    data,\n    fetchNextPage,\n    hasNextPage,\n    isFetchingNextPage,\n    status,\n  } = useInfiniteQuery({\n    queryKey: ['posts', 'infinite'],\n    queryFn: fetchPosts,\n    initialPageParam: 1,\n    getNextPageParam: (lastPage) =>\n      lastPage.hasMore ? lastPage.nextPage : undefined,\n  });\n\n  // Fetch automat la scroll la final\n  useEffect(() => {\n    if (inView && hasNextPage) fetchNextPage();\n  }, [inView, hasNextPage]);\n\n  if (status === 'pending') return <Spinner />;\n\n  return (\n    <ul>\n      {data.pages.map((page) =>\n        page.data.map((post) => (\n          <li key={post.id}>{post.title}</li>\n        ))\n      )}\n      <li ref={ref}>\n        {isFetchingNextPage ? 'Se incarca...' : hasNextPage ? 'Deruleaza mai jos' : 'Gata!'}\n      </li>\n    </ul>\n  );\n}\n```"
      },
      {
        "order": 3,
        "title": "Optimistic Updates — useMutation",
        "content": "Updates optimiste cu rollback la eroare:\n\n```jsx\nimport { useMutation, useQueryClient } from '@tanstack/react-query';\n\nfunction TodoList() {\n  const queryClient = useQueryClient();\n\n  const toggleMutation = useMutation({\n    mutationFn: ({ id, done }) =>\n      fetch(`/api/todos/${id}`, {\n        method: 'PATCH',\n        body: JSON.stringify({ done }),\n      }).then(r => r.json()),\n\n    // 1. Snapshot inainte de mutatie\n    onMutate: async ({ id, done }) => {\n      await queryClient.cancelQueries({ queryKey: ['todos'] });\n      const prev = queryClient.getQueryData(['todos']);\n\n      // 2. Update optimist\n      queryClient.setQueryData(['todos'], (old) =>\n        old.map((t) => (t.id === id ? { ...t, done } : t))\n      );\n\n      return { prev }; // Contexte pentru rollback\n    },\n\n    // 3. Rollback la eroare\n    onError: (err, variables, context) => {\n      queryClient.setQueryData(['todos'], context.prev);\n    },\n\n    // 4. Revalidare dupa mutatie\n    onSettled: () => {\n      queryClient.invalidateQueries({ queryKey: ['todos'] });\n    },\n  });\n\n  return (\n    <button onClick={() => toggleMutation.mutate({ id: 1, done: true })}>\n      Completeaza\n    </button>\n  );\n}\n```\n\nFlux: onMutate (snapshot + update optimist) => request => onError (rollback) sau onSuccess => onSettled (revalidare)."
      },
      {
        "order": 4,
        "title": "Suspense, background refetch si stale time",
        "content": "TanStack Query integrat cu Suspense si optiuni avansate de cache.\n\n```jsx\nimport { useSuspenseQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';\n\n// useSuspenseQuery — integrat cu Suspense, throws promise\nfunction UserProfile({ id }) {\n  const { data: user } = useSuspenseQuery({\n    queryKey: ['user', id],\n    queryFn: () => fetch(`/api/users/${id}`).then(r => r.json()),\n  });\n  return <h1>{user.name}</h1>;\n}\n\n// Parinte:\n<ErrorBoundary fallback={<ErrorMsg />}>\n  <Suspense fallback={<Spinner />}>\n    <UserProfile id={1} />\n  </Suspense>\n</ErrorBoundary>\n\n// Configurare QueryClient globala:\nconst queryClient = new QueryClient({\n  defaultOptions: {\n    queries: {\n      staleTime: 5 * 60 * 1000,  // Date valide 5 minute (nu re-fetch imediat)\n      gcTime: 10 * 60 * 1000,    // Cache pastrat 10 minute dupa unmount\n      retry: 2,                   // Max 2 retry-uri la eroare\n      refetchOnWindowFocus: true, // Re-fetch cand tab-ul redevine activ\n    },\n  },\n});\n\n// Dependent queries:\nconst { data: user } = useQuery({ queryKey: ['user', id], queryFn: getUser });\nconst { data: posts } = useQuery({\n  queryKey: ['posts', user?.id],\n  queryFn: () => getPosts(user.id),\n  enabled: !!user, // Porneste doar cand avem userul\n});\n\n// select — transformare date fara re-render extra:\nconst names = useQuery({\n  queryKey: ['users'],\n  queryFn: getUsers,\n  select: (data) => data.map((u) => u.name), // Componenta se re-rendereaza doar cand names se schimba\n});\n```\n\nLA INTERVIU: Ce este staleTime? Intervalul in care datele sunt considerate fresh — nu se face refetch. gcTime = cat timp ramane cache dupa unmount (garbage collection time)."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "queryKey importanta",
        "question": "De ce este importanta structura queryKey corecta?",
        "options": [
          "E doar pentru logging",
          "Identifica unic query-ul in cache — key identica = date partajate intre componente",
          "Afecteaza URL-ul",
          "E pentru TypeScript"
        ],
        "answer": "Identifica unic query-ul in cache — key identica = date partajate intre componente",
        "explanation": "['users', id] — fiecare id are cache separat. ['users'] — toate componentele cu users impart cache-ul.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "staleTime",
        "question": "Ce face staleTime: 60000?",
        "options": [
          "Date expire dupa 1 minut",
          "Date sunt considerate fresh 1 minut — nu se face re-fetch automat in acest interval",
          "Cache dureaza 1 minut",
          "Timeout la fetch"
        ],
        "answer": "Date sunt considerate fresh 1 minut — nu se face re-fetch automat in acest interval",
        "explanation": "staleTime = 0 (default) => date stale imediat. staleTime: Infinity => niciodata re-fetch automat.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "invalidateQueries",
        "question": "Ce face queryClient.invalidateQueries({ queryKey: ['posts'] })?",
        "options": [
          "Sterge cache-ul",
          "Marcheaza query-ul ca stale, triggerind re-fetch la urmatoarea utilizare",
          "Oprite retry-urile",
          "Deconecteaza"
        ],
        "answer": "Marcheaza query-ul ca stale, triggerind re-fetch la urmatoarea utilizare",
        "explanation": "Dupa un mutation (create/update/delete) apelezi invalidateQueries pentru date actuale.",
        "difficulty": "easy"
      },
      {
        "number": 4,
        "name": "enabled option",
        "question": "La ce serveste optiunea enabled: false in useQuery?",
        "options": [
          "Dezactiveaza cache",
          "Previne executia query-ului pana conditia devine true (dependent queries)",
          "Face query manual",
          "Dezactiveaza retry"
        ],
        "answer": "Previne executia query-ului pana conditia devine true (dependent queries)",
        "explanation": "enabled: !!userId — query porneste doar dupa ce avem userId. Perfect pentru query-uri dependente.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "onMutate",
        "question": "De ce este importanta cancelQueries in onMutate pentru optimistic updates?",
        "options": [
          "Nu e importanta",
          "Previne race condition — un re-fetch in zbor ar putea suprascrie update-ul optimist",
          "Anuleaza mutatia",
          "Sterge cache"
        ],
        "answer": "Previne race condition — un re-fetch in zbor ar putea suprascrie update-ul optimist",
        "explanation": "Fara cancelQueries, un query care se termina dupa onMutate ar restaura datele vechi.",
        "difficulty": "hard"
      },
      {
        "number": 6,
        "name": "getNextPageParam",
        "question": "In useInfiniteQuery, la ce serveste getNextPageParam?",
        "options": [
          "Determina cate pagini exista",
          "Determina pageParam-ul pentru urmatoarea pagina, undefined daca nu mai sunt pagini",
          "Fetch-uieste pagina urmatoare automat",
          "Concateneaza paginile"
        ],
        "answer": "Determina pageParam-ul pentru urmatoarea pagina, undefined daca nu mai sunt pagini",
        "explanation": "Daca returneaza undefined, hasNextPage = false si fetchNextPage nu face nimic.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "data.pages",
        "question": "Cum accesezi toate datele din useInfiniteQuery?",
        "options": [
          "data.items",
          "data.pages — array de raspunsuri, cate un element per pagina incarcata",
          "data.results",
          "data.flat()"
        ],
        "answer": "data.pages — array de raspunsuri, cate un element per pagina incarcata",
        "explanation": "data.pages.flatMap(p => p.items) — concatenezi datele din toate paginile.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "select option",
        "question": "Avantajul optiunii select in useQuery?",
        "options": [
          "Selecteaza din cache",
          "Transforma datele — componenta se re-rendereaza doar cand datele transformate se schimba",
          "Filtreaza query-urile",
          "Sorteaza results"
        ],
        "answer": "Transforma datele — componenta se re-rendereaza doar cand datele transformate se schimba",
        "explanation": "select: d => d.map(u => u.name) — daca array-ul de names nu se schimba, componenta nu se re-rendereaza.",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "prefetchQuery",
        "question": "Cand este util prefetchQuery?",
        "options": [
          "Mereu",
          "Pe server (SSR) sau la hover pe link — incarca date inainte sa fie necesare",
          "Doar in teste",
          "La erori"
        ],
        "answer": "Pe server (SSR) sau la hover pe link — incarca date inainte sa fie necesare",
        "explanation": "Prefetch pe hover: router.prefetch + queryClient.prefetchQuery = pagina se deschide instant.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Coding: useInfiniteQuery",
        "question": "Implementeaza un feed cu scroll infinit folosind useInfiniteQuery si Intersection Observer.",
        "options": [],
        "answer": "",
        "explanation": "getNextPageParam returneaza undefined cand nu mai sunt pagini. useInView trigger fetch.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "Coding: optimistic toggle",
        "question": "Implementeaza un like button cu update optimist: click actualizeaza imediat UI, cu rollback la eroare.",
        "options": [],
        "answer": "",
        "explanation": "onMutate: snapshot + update optimist. onError: restaurare snapshot. onSettled: invalidate.",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "gcTime vs staleTime",
        "question": "Diferenta dintre staleTime si gcTime?",
        "options": [
          "Sunt identice",
          "staleTime = cat timp sunt fresh (nu se re-fetch); gcTime = cat timp ramane in cache dupa unmount",
          "gcTime = staleTime * 2",
          "staleTime e pentru server, gcTime pentru client"
        ],
        "answer": "staleTime = cat timp sunt fresh (nu se re-fetch); gcTime = cat timp ramane in cache dupa unmount",
        "explanation": "staleTime: 5min, gcTime: 30min — date valide 5 min, cache disponibil 30 min dupa ce componenta se demoneaza.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "useSuspenseQuery",
        "question": "Diferenta useSuspenseQuery vs useQuery?",
        "options": [
          "Nu exista diferenta",
          "useSuspenseQuery throws promise — integrat cu Suspense, elimina isLoading din componenta",
          "useSuspenseQuery e mai lent",
          "useSuspenseQuery nu are cache"
        ],
        "answer": "useSuspenseQuery throws promise — integrat cu Suspense, elimina isLoading din componenta",
        "explanation": "Cu useQuery: if (isLoading) return ... Cu useSuspenseQuery: componenta e suspendata — mai curat.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "retry",
        "question": "Comportamentul default la eroare in TanStack Query?",
        "options": [
          "Nu re-incearca",
          "Re-incearca de 3 ori cu back-off exponential",
          "Re-incearca la infinit",
          "Afiseaza eroare imediat"
        ],
        "answer": "Re-incearca de 3 ori cu back-off exponential",
        "explanation": "Default retry: 3. Poti customiza: retry: 1 sau retry: (count, err) => err.status !== 404.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "dependent query",
        "question": "Ai nevoie de datele user-ului pentru a fetch posts-urile. Cum implementezi corect?",
        "options": [
          "2 useQuery separate fara legatura",
          "Al doilea useQuery cu enabled: !!user?.id",
          "Promise chain in useEffect",
          "Context"
        ],
        "answer": "Al doilea useQuery cu enabled: !!user?.id",
        "explanation": "enabled: false previne query pana userul e disponibil. Cand enabled devine true, query porneste automat.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "react-hook-form-avansat",
    "title": "35. React Hook Form avansat",
    "order": 35,
    "theory": [
      {
        "order": 1,
        "title": "useFieldArray — formulare dinamice",
        "content": "useFieldArray permite adaugarea/stergerea dinamica de campuri repetate.\n\n```jsx\nimport { useForm, useFieldArray } from 'react-hook-form';\n\nfunction InvoiceForm() {\n  const { register, control, handleSubmit, watch } = useForm({\n    defaultValues: {\n      clientName: '',\n      items: [{ description: '', qty: 1, price: 0 }],\n    },\n  });\n\n  const { fields, append, remove, prepend, insert, move } = useFieldArray({\n    control,\n    name: 'items', // Calea in formData\n  });\n\n  const items = watch('items');\n  const total = items.reduce((sum, i) => sum + (i.qty * i.price || 0), 0);\n\n  const onSubmit = (data) => console.log(data);\n\n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n      <input {...register('clientName', { required: true })} placeholder=\"Client\" />\n\n      {fields.map((field, index) => (\n        <div key={field.id}> {/* field.id e generat de RHF */}\n          <input\n            {...register(`items.${index}.description`, { required: true })}\n            placeholder=\"Descriere\"\n          />\n          <input\n            type=\"number\"\n            {...register(`items.${index}.qty`, { min: 1, valueAsNumber: true })}\n          />\n          <input\n            type=\"number\"\n            {...register(`items.${index}.price`, { min: 0, valueAsNumber: true })}\n          />\n          <button type=\"button\" onClick={() => remove(index)}>Sterge</button>\n        </div>\n      ))}\n\n      <button type=\"button\" onClick={() => append({ description: '', qty: 1, price: 0 })}>\n        + Adauga linie\n      </button>\n\n      <p>Total: {total} RON</p>\n      <button type=\"submit\">Trimite</button>\n    </form>\n  );\n}\n```"
      },
      {
        "order": 2,
        "title": "Formulare nested si validate cu Zod",
        "content": "Integrare cu Zod pentru validare puternica cu tipuri TypeScript.\n\n```bash\nnpm install @hookform/resolvers zod\n```\n\n```jsx\nimport { useForm } from 'react-hook-form';\nimport { zodResolver } from '@hookform/resolvers/zod';\nimport { z } from 'zod';\n\nconst schema = z.object({\n  name: z.string().min(2, 'Minim 2 caractere').max(50),\n  email: z.string().email('Email invalid'),\n  password: z.string().min(8, 'Minim 8 caractere'),\n  confirmPassword: z.string(),\n  address: z.object({\n    street: z.string().min(1, 'Strada obligatorie'),\n    city: z.string().min(1, 'Orasul obligatoriu'),\n    zip: z.string().regex(/^\\d{6}$/, 'Cod postal: 6 cifre'),\n  }),\n}).refine(\n  (data) => data.password === data.confirmPassword,\n  { message: 'Parolele nu coincid', path: ['confirmPassword'] }\n);\n\ntype FormData = z.infer<typeof schema>;\n\nfunction RegisterForm() {\n  const {\n    register,\n    handleSubmit,\n    formState: { errors, isSubmitting },\n  } = useForm<FormData>({\n    resolver: zodResolver(schema),\n  });\n\n  return (\n    <form onSubmit={handleSubmit(async (data) => await registerUser(data))}>\n      <input {...register('name')} />\n      {errors.name && <p>{errors.name.message}</p>}\n\n      <input {...register('address.city')} /> {/* Nested! */}\n      {errors.address?.city && <p>{errors.address.city.message}</p>}\n\n      <button disabled={isSubmitting}>\n        {isSubmitting ? 'Se inregistreaza...' : 'Inregistrare'}\n      </button>\n    </form>\n  );\n}\n```"
      },
      {
        "order": 3,
        "title": "watch, setValue si trigger",
        "content": "API-uri avansate pentru reactie la schimbari si validare programatica.\n\n```jsx\nimport { useForm, useWatch } from 'react-hook-form';\n\nfunction PricingForm() {\n  const { register, control, setValue, trigger, getValues, formState: { errors } } = useForm({\n    defaultValues: { discount: 0, price: 100 },\n  });\n\n  // watch — re-render la fiecare schimbare (performant cu selector):\n  const price = useWatch({ control, name: 'price' });\n  const discount = useWatch({ control, name: 'discount' });\n  const finalPrice = price * (1 - discount / 100);\n\n  // setValue — seteaza programatic fara event\n  const applyDiscount20 = () => setValue('discount', 20, {\n    shouldValidate: true, // Ruleaza validare\n    shouldDirty: true,    // Marcheaza ca modificat\n  });\n\n  // trigger — valideaza manual un camp sau tot formularul\n  const validateEmail = async () => {\n    const valid = await trigger('email');\n    if (valid) console.log('Email valid!');\n  };\n\n  // getValues — citeste valori fara subscriptie (nu re-render)\n  const logAll = () => console.log(getValues());\n\n  // reset — reseteaza la valori initiale sau noi:\n  const { reset } = useForm();\n  const loadUser = async (id) => {\n    const user = await fetchUser(id);\n    reset(user); // Populeaza formularul cu datele userului\n  };\n\n  return (\n    <form>\n      <input type=\"number\" {...register('price', { min: 0 })} />\n      <input type=\"number\" {...register('discount', { min: 0, max: 100 })} />\n      <p>Pret final: {finalPrice.toFixed(2)} RON</p>\n      <button type=\"button\" onClick={applyDiscount20}>Aplica 20% discount</button>\n    </form>\n  );\n}\n```"
      },
      {
        "order": 4,
        "title": "Custom validators si Controller pentru componente terte",
        "content": "Validatori custom si integrare cu componente UI (Select, DatePicker etc.) via Controller.\n\n```jsx\nimport { useForm, Controller } from 'react-hook-form';\nimport Select from 'react-select'; // Componenta third-party\n\nconst roleOptions = [\n  { value: 'admin', label: 'Administrator' },\n  { value: 'user', label: 'Utilizator' },\n  { value: 'mod', label: 'Moderator' },\n];\n\nfunction UserForm() {\n  const { register, handleSubmit, control, formState: { errors } } = useForm();\n\n  return (\n    <form onSubmit={handleSubmit(console.log)}>\n      {/* Custom validator async */}\n      <input\n        {...register('username', {\n          validate: {\n            minLength: v => v.length >= 3 || 'Minim 3 caractere',\n            noSpaces: v => !/\\s/.test(v) || 'Fara spatii',\n            available: async v => {\n              const exists = await checkUsername(v);\n              return !exists || 'Username luat';\n            },\n          },\n        })}\n      />\n      {errors.username && <p>{errors.username.message}</p>}\n\n      {/* Controller pentru componente third-party */}\n      <Controller\n        name=\"role\"\n        control={control}\n        rules={{ required: 'Selecteaza un rol' }}\n        render={({ field, fieldState: { error } }) => (\n          <>\n            <Select\n              {...field}  // value, onChange, onBlur\n              options={roleOptions}\n              placeholder=\"Selecteaza rol\"\n            />\n            {error && <p>{error.message}</p>}\n          </>\n        )}\n      />\n\n      {/* Transformer — transform in/out */}\n      <input\n        type=\"number\"\n        {...register('price', {\n          setValueAs: v => parseFloat(v) || 0, // Transforma string in number\n        })}\n      />\n\n      <button type=\"submit\">Salveaza</button>\n    </form>\n  );\n}\n```\n\nLA INTERVIU: Cand folosesti Controller vs register? `register` pentru input-uri HTML native. `Controller` pentru componente third-party care nu expun ref nativ."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "useFieldArray id",
        "question": "De ce folosesti field.id in loc de index ca key in useFieldArray?",
        "options": [
          "Conventie",
          "field.id e stabil la reordonare/stergere — index-ul se schimba si cauzeaza re-render gresit",
          "E mai scurt",
          "TypeScript cere"
        ],
        "answer": "field.id e stabil la reordonare/stergere — index-ul se schimba si cauzeaza re-render gresit",
        "explanation": "La remove(0) din [A,B,C] => [B,C], index 0 e acum B. field.id ramane stabil — React reconciliation corecta.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "append vs prepend",
        "question": "Diferenta dintre append si prepend in useFieldArray?",
        "options": [
          "Identice",
          "append adauga la final, prepend la inceput",
          "append = async, prepend = sync",
          "Nu exista prepend"
        ],
        "answer": "append adauga la final, prepend la inceput",
        "explanation": "append({ name: '' }) — adauga la final. prepend({ name: '' }) — adauga la inceput.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "zodResolver",
        "question": "Ce face zodResolver in React Hook Form?",
        "options": [
          "Importa Zod",
          "Conecteaza schema Zod la validarea formularului",
          "Genereaza formulare",
          "Trimite datele la server"
        ],
        "answer": "Conecteaza schema Zod la validarea formularului",
        "explanation": "resolver: zodResolver(schema) — toate erorile Zod apar in formState.errors.",
        "difficulty": "easy"
      },
      {
        "number": 4,
        "name": "register nested",
        "question": "Cum inregistrezi un camp dintr-un obiect nested (address.city)?",
        "options": [
          "register('address').register('city')",
          "register('address.city') — notatie dot",
          "register({ address: { city: '' } })",
          "Imposibil"
        ],
        "answer": "register('address.city') — notatie dot",
        "explanation": "RHF suporta notatie dot pentru nested objects si array indexing (items.0.name).",
        "difficulty": "easy"
      },
      {
        "number": 5,
        "name": "Controller vs register",
        "question": "Cand folosesti Controller in loc de register?",
        "options": [
          "Mereu",
          "Cand componenta third-party nu suporta ref (Select, DatePicker, custom inputs)",
          "Niciodata",
          "Doar pentru TypeScript"
        ],
        "answer": "Cand componenta third-party nu suporta ref (Select, DatePicker, custom inputs)",
        "explanation": "register necesita ref. Controller foloseste onChange/onBlur/value via render prop.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "isSubmitting",
        "question": "Ce face formState.isSubmitting?",
        "options": [
          "E true daca formularul e valid",
          "E true in timp ce handleSubmit executa functia async de submit",
          "E true daca campuri au erori",
          "E true dupa reset"
        ],
        "answer": "E true in timp ce handleSubmit executa functia async de submit",
        "explanation": "Util pentru disabled={isSubmitting} pe butonul Submit — previne double-submit.",
        "difficulty": "easy"
      },
      {
        "number": 7,
        "name": "setValue options",
        "question": "Ce face setValue('field', value, { shouldValidate: true })?",
        "options": [
          "Seteaza valoarea si ruleaza validarea imediat",
          "Seteaza fara validare",
          "Reseteaza campul",
          "Trimite formularul"
        ],
        "answer": "Seteaza valoarea si ruleaza validarea imediat",
        "explanation": "shouldValidate: true — eroarea apare imediat. shouldDirty: true — campul e marcat ca dirty.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "trigger",
        "question": "La ce serveste trigger('email') in React Hook Form?",
        "options": [
          "Trimite formularul",
          "Valideaza manual campul email si actualizeaza formState.errors",
          "Focus pe camp",
          "Resetare"
        ],
        "answer": "Valideaza manual campul email si actualizeaza formState.errors",
        "explanation": "trigger() fara argumente valideaza intreg formularul. Util la wizards multi-step.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "validate async",
        "question": "Cum adaugi validare async (ex: check username disponibil) cu React Hook Form?",
        "options": [
          "useEffect separat",
          "validate: { check: async (v) => await checkAvail(v) || 'Luat' } in register",
          "Imposibil",
          "onBlur handler extern"
        ],
        "answer": "validate: { check: async (v) => await checkAvail(v) || 'Luat' } in register",
        "explanation": "validate poate fi un obiect cu multiple functii, inclusiv async. RHF asteapta Promise.",
        "difficulty": "hard"
      },
      {
        "number": 10,
        "name": "Coding: field array invoice",
        "question": "Construieste un formular de factura cu useFieldArray: linii dinamice (descriere, cantitate, pret), buton add/remove si total calculat.",
        "options": [],
        "answer": "",
        "explanation": "fields.map cu register pe fiecare index. watch sau useWatch pentru calcul total reactiv.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "Coding: Zod validare",
        "question": "Creeaza un formular de inregistrare cu Zod: name (min 2), email valid, password (min 8), confirmPassword (egal cu password).",
        "options": [],
        "answer": "",
        "explanation": "z.object + .refine pentru cross-field validation. zodResolver conecteaza schema la RHF.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Coding: Controller Select",
        "question": "Integreaza un dropdown react-select cu React Hook Form via Controller pentru selectarea unui rol.",
        "options": [],
        "answer": "",
        "explanation": "Controller expune field.value, field.onChange, field.onBlur — compatibil cu react-select.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "reset cu date",
        "question": "Cum populezi un formular de editare cu datele unui utilizator existent?",
        "options": [
          "useState pentru fiecare camp",
          "reset(userData) — populeaza toate campurile cu obiectul primit",
          "setValue pe fiecare camp",
          "defaultValues dinamic"
        ],
        "answer": "reset(userData) — populeaza toate campurile cu obiectul primit",
        "explanation": "reset(fetchedData) dupa un async fetch populeaza eficient un formular complex.",
        "difficulty": "easy"
      },
      {
        "number": 14,
        "name": "isDirty",
        "question": "La ce folosesti formState.isDirty?",
        "options": [
          "Verifici erori",
          "Detectezi daca utilizatorul a modificat ceva fata de defaultValues",
          "Verifici submit",
          "Verifici focus"
        ],
        "answer": "Detectezi daca utilizatorul a modificat ceva fata de defaultValues",
        "explanation": "isDirty = false initial. Daca user modifica orice camp, isDirty = true. Util pentru 'Aveti modificari nesalvate?'.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "valueAsNumber",
        "question": "La ce serveste valueAsNumber: true in register?",
        "options": [
          "Valideaza ca numarul e valid",
          "Converteste automat string-ul input-ului in number inainte de submitere",
          "Afiseaza numarul formatat",
          "Limiteaza la numere"
        ],
        "answer": "Converteste automat string-ul input-ului in number inainte de submitere",
        "explanation": "input type=number returneaza string. valueAsNumber: true face conversia automata in formData.",
        "difficulty": "easy"
      }
    ]
  },
  {
    "slug": "react-accesibilitate",
    "title": "36. Accesibilitate in React",
    "order": 36,
    "theory": [
      {
        "order": 1,
        "title": "ARIA roles si atribute esentiale",
        "content": "ARIA (Accessible Rich Internet Applications) adauga semantica componentelor interactive.\n\n```jsx\n// Buton cu rol explicit:\n<button\n  role=\"button\"\n  aria-label=\"Inchide dialog\"\n  aria-pressed={isPressed}\n  onClick={handleClose}\n>\n  X\n</button>\n\n// Nav accesibil:\n<nav aria-label=\"Navigare principala\">\n  <ul role=\"list\">\n    <li><a href=\"/\" aria-current=\"page\">Acasa</a></li>\n    <li><a href=\"/about\">Despre</a></li>\n  </ul>\n</nav>\n\n// Form cu asocieri corecte:\n<div>\n  <label htmlFor=\"email\">Email:</label>\n  <input\n    id=\"email\"\n    type=\"email\"\n    aria-required=\"true\"\n    aria-invalid={!!errors.email}\n    aria-describedby=\"email-error\"\n  />\n  {errors.email && (\n    <span id=\"email-error\" role=\"alert\">{errors.email}</span>\n  )}\n</div>\n\n// Dialog modal accesibil:\n<div\n  role=\"dialog\"\n  aria-modal=\"true\"\n  aria-labelledby=\"dialog-title\"\n  aria-describedby=\"dialog-desc\"\n>\n  <h2 id=\"dialog-title\">Confirmare stergere</h2>\n  <p id=\"dialog-desc\">Aceasta actiune este ireversibila.</p>\n  <button onClick={onConfirm}>Confirma</button>\n  <button onClick={onCancel}>Anuleaza</button>\n</div>\n```\n\nLA INTERVIU: Diferenta aria-label vs aria-labelledby? aria-label = string direct. aria-labelledby = refera id-ul unui alt element."
      },
      {
        "order": 2,
        "title": "Focus management — tabindex si focus trap",
        "content": "Gestionarea focus-ului e critica pentru utilizatorii de tastatura.\n\n```jsx\nimport { useRef, useEffect } from 'react';\n\n// Focus trap in modal:\nfunction Modal({ isOpen, onClose, children }) {\n  const modalRef = useRef(null);\n  const firstFocusable = useRef(null);\n\n  useEffect(() => {\n    if (!isOpen) return;\n\n    // Focus pe primul element la deschidere\n    firstFocusable.current?.focus();\n\n    // Trap focus in modal\n    const handleKeyDown = (e) => {\n      if (e.key !== 'Tab') return;\n      const focusables = modalRef.current.querySelectorAll(\n        'button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])'\n      );\n      const first = focusables[0];\n      const last = focusables[focusables.length - 1];\n\n      if (e.shiftKey && document.activeElement === first) {\n        last.focus(); e.preventDefault();\n      } else if (!e.shiftKey && document.activeElement === last) {\n        first.focus(); e.preventDefault();\n      }\n    };\n\n    document.addEventListener('keydown', handleKeyDown);\n    return () => document.removeEventListener('keydown', handleKeyDown);\n  }, [isOpen]);\n\n  if (!isOpen) return null;\n\n  return (\n    <div ref={modalRef} role=\"dialog\" aria-modal=\"true\">\n      <button ref={firstFocusable} onClick={onClose}>Inchide</button>\n      {children}\n    </div>\n  );\n}\n\n// tabIndex:\n<div tabIndex={0} role=\"button\" onKeyDown={(e) => e.key === 'Enter' && handleClick()}>\n  Element custom focusabil\n</div>\n\n// tabIndex={-1} — focusabil programatic, scos din tab order:\n<div tabIndex={-1} ref={skipTargetRef}>\n  Continut principal\n</div>\n```"
      },
      {
        "order": 3,
        "title": "Live regions si anunturi screenreader",
        "content": "ARIA live regions anunta screenreaderele despre schimbari dinamice in UI.\n\n```jsx\n// aria-live pentru notificari:\nfunction Notifications() {\n  const [msg, setMsg] = useState('');\n\n  return (\n    <>\n      {/* polite — anunta la pauza utilizatorului */}\n      <div aria-live=\"polite\" aria-atomic=\"true\" className=\"sr-only\">\n        {msg}\n      </div>\n\n      {/* assertive — intrerupe imediat (doar pentru erori critice!) */}\n      <div aria-live=\"assertive\" className=\"sr-only\">\n        {/* Erori de validare importante */}\n      </div>\n\n      <button onClick={() => setMsg('Datele au fost salvate!')}>\n        Salveaza\n      </button>\n    </>\n  );\n}\n\n// Status de incarcare:\nfunction LoadingIndicator({ isLoading }) {\n  return (\n    <div role=\"status\" aria-label={isLoading ? 'Se incarca' : 'Incarcat'}>\n      {isLoading && <Spinner />}\n    </div>\n  );\n}\n\n// Skip link pentru navigare rapida:\nfunction SkipLink() {\n  return (\n    <a href=\"#main-content\" className=\"skip-link\">\n      Sari la continut principal\n    </a>\n  );\n}\n\n// CSS pentru sr-only (vizibil doar screenreader):\n// .sr-only { position: absolute; width: 1px; height: 1px;\n//   padding: 0; margin: -1px; overflow: hidden;\n//   clip: rect(0,0,0,0); border: 0; }\n\n// Progres accesibil:\n<div\n  role=\"progressbar\"\n  aria-valuenow={progress}\n  aria-valuemin={0}\n  aria-valuemax={100}\n  aria-label={`Incarcare: ${progress}%`}\n/>\n```"
      },
      {
        "order": 4,
        "title": "Testare a11y cu jest-axe si eslint-plugin-jsx-a11y",
        "content": "Unelte pentru detectarea automata a problemelor de accesibilitate.\n\n```bash\nnpm install --save-dev @axe-core/react jest-axe eslint-plugin-jsx-a11y\n```\n\n```js\n// .eslintrc.cjs:\n{\n  \"plugins\": [\"jsx-a11y\"],\n  \"extends\": [\"plugin:jsx-a11y/recommended\"]\n}\n// Detecteaza: img fara alt, label fara for, button fara text etc.\n\n// Testare cu jest-axe:\nimport { render } from '@testing-library/react';\nimport { axe, toHaveNoViolations } from 'jest-axe';\nexpect.extend(toHaveNoViolations);\n\ntest('Form-ul nu are violari de accesibilitate', async () => {\n  const { container } = render(\n    <form>\n      <label htmlFor=\"name\">Nume</label>\n      <input id=\"name\" type=\"text\" />\n      <button type=\"submit\">Trimite</button>\n    </form>\n  );\n  const results = await axe(container);\n  expect(results).toHaveNoViolations();\n});\n\n// axe in development (browser):\nimport React from 'react';\nimport ReactDOM from 'react-dom';\nif (process.env.NODE_ENV !== 'production') {\n  import('@axe-core/react').then(axe => {\n    axe.default(React, ReactDOM, 1000);\n  });\n}\n\n// Testing Library — role-based queries (a11y first):\nimport { render, screen } from '@testing-library/react';\ntest('Butonul e accesibil', () => {\n  render(<button>Salveaza</button>);\n  expect(screen.getByRole('button', { name: 'Salveaza' })).toBeInTheDocument();\n});\n```\n\nLA INTERVIU: Cum testezi accesibilitatea? eslint-plugin-jsx-a11y in dev, jest-axe in teste automate, browsing cu tastatura, NVDA/JAWS screenreader manual."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "aria-label vs aria-labelledby",
        "question": "Diferenta dintre aria-label si aria-labelledby?",
        "options": [
          "Identice",
          "aria-label = text direct; aria-labelledby = refera id-ul unui element din DOM",
          "aria-label e deprecat",
          "aria-labelledby e pentru forms"
        ],
        "answer": "aria-label = text direct; aria-labelledby = refera id-ul unui element din DOM",
        "explanation": "aria-labelledby='header-id' e preferat cand textul vizibil exista deja in DOM.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "alt pe img",
        "question": "Cand folosesti alt= (string gol) pe o imagine?",
        "options": [
          "Niciodata",
          "Cand imaginea e decorativa — screenreader-ul o ignora",
          "La toate imaginile",
          "Cand nu ai alt text"
        ],
        "answer": "Cand imaginea e decorativa — screenreader-ul o ignora",
        "explanation": "alt='' = decor. Fara alt => screenreader citeste filename-ul. alt='descriere' = imagine informationala.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "role=alert",
        "question": "Ce face role='alert' pe un element?",
        "options": [
          "Afiseaza un alert browser",
          "Anunta screenreader-ul imediat despre continut nou (implicit aria-live assertive)",
          "Stilizeaza elementul",
          "Dezactiveaza elementul"
        ],
        "answer": "Anunta screenreader-ul imediat despre continut nou (implicit aria-live assertive)",
        "explanation": "role=alert = aria-live assertive implicit. Folosit pentru erori critice. Nu abuza — intrerupe utilizatorul.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "tabIndex",
        "question": "Ce face tabIndex={-1}?",
        "options": [
          "Dezactiveaza elementul",
          "Scoate elementul din tab order dar il face focusabil programatic (element.focus())",
          "Pune elementul primul in tab order",
          "Face elementul invizibil"
        ],
        "answer": "Scoate elementul din tab order dar il face focusabil programatic (element.focus())",
        "explanation": "Util pentru focus trap in modals — focusezi programatic la deschidere fara sa modifici tab flow-ul.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "aria-expanded",
        "question": "Cand folosesti aria-expanded?",
        "options": [
          "Mereu pe buttons",
          "Pe butoanele care controleaza un element expandabil/colapsabil (accordion, dropdown)",
          "Pe inputs",
          "Pe imagini"
        ],
        "answer": "Pe butoanele care controleaza un element expandabil/colapsabil (accordion, dropdown)",
        "explanation": "aria-expanded={isOpen} comunica screenreader-ului starea meniului/accordion-ului.",
        "difficulty": "easy"
      },
      {
        "number": 6,
        "name": "htmlFor vs for",
        "question": "In JSX, echivalentul atributului HTML 'for' pe <label> este?",
        "options": [
          "for",
          "htmlFor",
          "labelFor",
          "forId"
        ],
        "answer": "htmlFor",
        "explanation": "JSX foloseste htmlFor (camelCase) in loc de for (cuvant rezervat JS). Asociaza label cu input prin id.",
        "difficulty": "easy"
      },
      {
        "number": 7,
        "name": "aria-live polite",
        "question": "Cand folosesti aria-live='polite' in loc de aria-live='assertive'?",
        "options": [
          "Mereu",
          "Pentru actualizari non-critice — asteapta pauza utilizatorului (succes mesaje, statistici)",
          "Niciodata",
          "Doar pentru loading"
        ],
        "answer": "Pentru actualizari non-critice — asteapta pauza utilizatorului (succes mesaje, statistici)",
        "explanation": "polite = anunta la pauza. assertive = intrerupe imediat. Foloseste assertive doar pentru erori urgente.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "skip link",
        "question": "La ce serveste un skip link (Sari la continut)?",
        "options": [
          "SEO",
          "Permite utilizatorilor de tastatura sa sara navigatia repetitiva la fiecare pagina",
          "Accessibility audit",
          "Loading speed"
        ],
        "answer": "Permite utilizatorilor de tastatura sa sara navigatia repetitiva la fiecare pagina",
        "explanation": "Skip link = primul element focus. Fara el, utilizatorul Tab prin tot meniul la fiecare pagina.",
        "difficulty": "easy"
      },
      {
        "number": 9,
        "name": "Color contrast",
        "question": "Ratio minim de contrast WCAG AA pentru text normal?",
        "options": [
          "2:1",
          "3:1",
          "4.5:1",
          "7:1"
        ],
        "answer": "4.5:1",
        "explanation": "WCAG AA: 4.5:1 text normal, 3:1 text mare (18px bold sau 24px). AA enhanced (AAA): 7:1.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Coding: Modal accesibil",
        "question": "Implementeaza un modal cu focus trap: la deschidere focus pe primul element, Tab cicleaza in modal, Escape inchide.",
        "options": [],
        "answer": "",
        "explanation": "Focus trap: querySelectorAll focusables, intercept Tab key pentru ciclu. Escape = onClose.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "Coding: Live region",
        "question": "Creeaza un formular de contact cu live region care anunta 'Mesaj trimis cu succes!' dupa submit.",
        "options": [],
        "answer": "",
        "explanation": "aria-live polite + aria-atomic anunta mesajul complet. aria-live region trebuie sa existe in DOM de la inceput.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "jest-axe",
        "question": "Ce detecteaza jest-axe in teste?",
        "options": [
          "Erori JavaScript",
          "Violari de accesibilitate (WCAG) in componente renderizate",
          "Performance issues",
          "Memory leaks"
        ],
        "answer": "Violari de accesibilitate (WCAG) in componente renderizate",
        "explanation": "axe(container) analizeaza DOM-ul si raporteaza violari WCAG. toHaveNoViolations e assertion-ul.",
        "difficulty": "easy"
      },
      {
        "number": 13,
        "name": "getByRole",
        "question": "De ce Testing Library recomanda getByRole in loc de getByClassName?",
        "options": [
          "E mai rapid",
          "Queriaza ca un utilizator de screenreader — testeaza accesibilitatea si semantica",
          "E mai usor de scris",
          "Nu exista getByClassName"
        ],
        "answer": "Queriaza ca un utilizator de screenreader — testeaza accesibilitatea si semantica",
        "explanation": "getByRole('button', {name: 'Submit'}) — daca nu-l gaseste, butonul nu e accesibil. Testezi si a11y.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "eslint-jsx-a11y",
        "question": "Ce face eslint-plugin-jsx-a11y?",
        "options": [
          "Formatare cod",
          "Detecteaza la compile time probleme de accesibilitate in JSX (img fara alt, etc.)",
          "Teste automate",
          "Optimizare bundle"
        ],
        "answer": "Detecteaza la compile time probleme de accesibilitate in JSX (img fara alt, etc.)",
        "explanation": "Rule recommended: img-redundant-alt, no-autofocus, interactive-supports-focus, label-has-associated-control.",
        "difficulty": "easy"
      },
      {
        "number": 15,
        "name": "aria-describedby",
        "question": "La ce serveste aria-describedby pe un input?",
        "options": [
          "Eticheteaza input-ul",
          "Leaga input-ul de un element cu descriere suplimentara (mesaj eroare, hint)",
          "Ascunde input-ul",
          "Dezactiveaza input-ul"
        ],
        "answer": "Leaga input-ul de un element cu descriere suplimentara (mesaj eroare, hint)",
        "explanation": "aria-describedby='email-hint email-error' — screenreader citeste hint-ul si eroarea dupa label.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "react-microfrontends",
    "title": "37. Micro-frontends cu React",
    "order": 37,
    "theory": [
      {
        "order": 1,
        "title": "Ce sunt micro-frontends si cand le folosesti",
        "content": "Micro-frontends aplica principiile microserviciilor la frontend: fiecare echipa detine si deployeaza independent o portiune din UI.\n\n```\nArhitectura monolita:\n+--------------------------------------------------+\n| Container App (React)                            |\n|  +------------+  +------------+  +----------+   |\n|  | ProductUI  |  | CartUI     |  | CheckoutUI|  |\n|  | (Team A)   |  | (Team B)   |  | (Team C)  |  |\n+--------------------------------------------------+\n     ^ Toti lucreaza in acelasi repo, acelasi deploy ^\n\nArhitectura micro-frontend:\n+--------------------------------------------------+\n| Shell App (Runtime host)                         |\n|  +-----------+  +-----------+  +------------+   |\n|  | products/ |  | cart/     |  | checkout/  |   |\n|  | remote    |  | remote    |  | remote     |   |\n|  | (Team A)  |  | (Team B)  |  | (Team C)   |   |\n+--------------------------------------------------+\n     ^ Fiecare echipa deploy independent ^\n```\n\nCAND FOLOSESTI MICRO-FRONTENDS:\n- Organizatii mari cu echipe independente\n- Migrare graduala monolita -> modern (strangler fig pattern)\n- Echipe cu tech stacks diferite (React + Vue + Angular)\n- Deploy independent, fara dependente intre echipe\n\nCAND NU FOLOSESTI:\n- Aplicatii mici-medii — overhead nejustificat\n- Echipa mica (< 5 oameni frontend)\n- Performance critica (bundle splitting cross-MFE e complex)\n\nSTRATEGII:\n1. Module Federation (Webpack 5) — runtime integration\n2. single-spa — framework-agnostic orchestrator\n3. iframe isolation — cea mai simpla, dar limitata\n4. Web Components — standard, framework-agnostic"
      },
      {
        "order": 2,
        "title": "Module Federation — Webpack 5",
        "content": "Module Federation permite incarcarea dinamica a modulelor din alte aplicatii la runtime.\n\n```js\n// webpack.config.js — HOST (shell):\nconst { ModuleFederationPlugin } = require('webpack').container;\n\nmodule.exports = {\n  plugins: [\n    new ModuleFederationPlugin({\n      name: 'host',\n      remotes: {\n        // products e incarcat de la URL-ul remote\n        products: 'products@http://localhost:3001/remoteEntry.js',\n        cart: 'cart@http://localhost:3002/remoteEntry.js',\n      },\n      shared: {\n        react: { singleton: true, requiredVersion: '^18.0.0' },\n        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },\n      },\n    }),\n  ],\n};\n\n// webpack.config.js — REMOTE (products MFE):\nmodule.exports = {\n  plugins: [\n    new ModuleFederationPlugin({\n      name: 'products',\n      filename: 'remoteEntry.js', // Manifestul modulelor expuse\n      exposes: {\n        './ProductList': './src/ProductList', // Ce exporta\n        './ProductCard': './src/ProductCard',\n      },\n      shared: {\n        react: { singleton: true },\n        'react-dom': { singleton: true },\n      },\n    }),\n  ],\n};\n\n// Utilizare in Host:\nconst ProductList = React.lazy(() => import('products/ProductList'));\n\nfunction App() {\n  return (\n    <Suspense fallback={<Loading />}>\n      <ProductList />\n    </Suspense>\n  );\n}\n```\n\n`singleton: true` previne duplicate react — esential pentru hooks (useState etc.)"
      },
      {
        "order": 3,
        "title": "single-spa — orchestrare framework-agnostic",
        "content": "single-spa permite montarea/demontarea micro-aplicatii cu tech stacks diferite.\n\n```js\n// root-config.js — shell:\nimport { registerApplication, start } from 'single-spa';\n\nregisterApplication({\n  name: '@myorg/products',\n  app: () => import('@myorg/products'),\n  activeWhen: ['/products'], // Activ pe ruta /products\n});\n\nregisterApplication({\n  name: '@myorg/cart',\n  app: () => import('@myorg/cart'),\n  activeWhen: (location) => location.pathname.startsWith('/cart'),\n});\n\nstart({ urlRerouteOnly: true });\n\n// micro-app React cu single-spa:\nimport React from 'react';\nimport ReactDOM from 'react-dom';\nimport singleSpaReact from 'single-spa-react';\nimport App from './App';\n\nconst lifecycles = singleSpaReact({\n  React,\n  ReactDOM,\n  rootComponent: App,\n  errorBoundary: (err) => <div>Eroare in Products MFE</div>,\n});\n\nexport const { bootstrap, mount, unmount } = lifecycles;\n// single-spa apeleaza bootstrap/mount/unmount la rutare\n```\n\nCOMUNICAREA INTRE MFE-uri:\n```js\n// Event bus simplu:\nconst eventBus = new EventTarget();\n\n// MFE Cart emite eveniment:\neventBus.dispatchEvent(\n  new CustomEvent('cart:item-added', { detail: { productId: 42 } })\n);\n\n// MFE Header asculta:\neventBus.addEventListener('cart:item-added', (e) => {\n  updateCartCount(e.detail.productId);\n});\n```"
      },
      {
        "order": 4,
        "title": "iframe isolation si Web Components",
        "content": "Alternativele mai simple la Module Federation: iframes si Web Components.\n\n```jsx\n// Iframe isolation — cea mai simpla izolare:\nfunction ProductsMFE({ url }) {\n  const iframeRef = useRef(null);\n\n  // Comunicare via postMessage:\n  useEffect(() => {\n    const handleMessage = (event) => {\n      if (event.origin !== 'https://products.myapp.com') return;\n      if (event.data.type === 'CART_ADD') {\n        addToCart(event.data.product);\n      }\n    };\n    window.addEventListener('message', handleMessage);\n    return () => window.removeEventListener('message', handleMessage);\n  }, []);\n\n  return (\n    <iframe\n      ref={iframeRef}\n      src={url}\n      title=\"Products Module\"\n      style={{ border: 'none', width: '100%', height: '600px' }}\n      sandbox=\"allow-scripts allow-same-origin allow-forms\"\n    />\n  );\n}\n\n// Web Components — standard browser:\n// Definire (in orice framework sau Vanilla JS):\nclass ProductCard extends HTMLElement {\n  connectedCallback() {\n    this.innerHTML = `\n      <div class=\"card\">\n        <h2>${this.getAttribute('name')}</h2>\n        <p>${this.getAttribute('price')} RON</p>\n      </div>\n    `;\n  }\n}\ncustomElements.define('product-card', ProductCard);\n\n// Utilizare in React:\nfunction App() {\n  return (\n    // React 19 suporta Web Components nativ (cu event props)\n    <product-card name=\"Laptop\" price=\"3500\" />\n  );\n}\n```\n\nCOMPARATIE:\n- iframes: izolare maxima, comunicare limitata, scroll dublu, SEO problematic\n- Web Components: standard, framework-agnostic, stil izolat cu shadow DOM\n- Module Federation: partajare cod, performant, complexitate setup\n- single-spa: orchestrare flexibila, multi-framework, lifecycles definite\n\nLA INTERVIU: Ce sunt micro-frontends? Arhitectura care imparte frontend-ul in aplicatii independente per-echipa, cu deploy si versionare separate."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "MFE definitie",
        "question": "Ce problema principala rezolva arhitectura micro-frontend?",
        "options": [
          "Performance",
          "Permite echipelor independente sa deployeze parti din UI fara coordonare intre echipe",
          "Securitate",
          "SEO"
        ],
        "answer": "Permite echipelor independente sa deployeze parti din UI fara coordonare intre echipe",
        "explanation": "Principala motivatie: autonomia echipei. Fiecare echipa develop, test si deploys independent.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "Module Federation singleton",
        "question": "De ce e important singleton: true pentru React in Module Federation?",
        "options": [
          "Performance",
          "Previne duplicate instante React — hooks functioneaza corect doar cu o singura instanta React",
          "Reducere bundle",
          "E optional"
        ],
        "answer": "Previne duplicate instante React — hooks functioneaza corect doar cu o singura instanta React",
        "explanation": "Doua instante React = useState nu functioneaza, context nu e partajat. singleton forteaza o singura versiune.",
        "difficulty": "hard"
      },
      {
        "number": 3,
        "name": "remoteEntry.js",
        "question": "Ce este remoteEntry.js in Module Federation?",
        "options": [
          "Codul aplicatiei remote",
          "Manifestul care descrie ce module expune aplicatia remote",
          "Bundle-ul CSS",
          "Configuratia webpack"
        ],
        "answer": "Manifestul care descrie ce module expune aplicatia remote",
        "explanation": "Host incarca remoteEntry.js la runtime pentru a afla ce module sunt disponibile.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "single-spa lifecycle",
        "question": "Care sunt cele 3 lifecycle-uri ale unei aplicatii single-spa?",
        "options": [
          "init/render/destroy",
          "bootstrap/mount/unmount",
          "load/render/remove",
          "start/run/stop"
        ],
        "answer": "bootstrap/mount/unmount",
        "explanation": "bootstrap: initializare o singura data. mount: afisare la rutare activa. unmount: curatare la rutare inactiva.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "iframes postMessage",
        "question": "Cum comunica un iframe cu pagina parinte?",
        "options": [
          "Event Bus",
          "window.postMessage / window.addEventListener('message')",
          "Direct access la parent.window",
          "SharedWorker"
        ],
        "answer": "window.postMessage / window.addEventListener('message')",
        "explanation": "postMessage e singurul mecanism sigur cross-origin. Valideaza mereu event.origin!",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "Web Components shadow DOM",
        "question": "Ce avantaj ofera Shadow DOM in Web Components?",
        "options": [
          "Performance mai buna",
          "Izolare CSS — stilurile nu scapa din/in componenta",
          "Rendering mai rapid",
          "TypeScript support"
        ],
        "answer": "Izolare CSS — stilurile nu scapa din/in componenta",
        "explanation": "Shadow DOM encapsuleaza stilurile. CSS din pagina parinte nu afecteaza componenta si viceversa.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "cand NU MFE",
        "question": "Cand este micro-frontend o alegere GRESITA?",
        "options": [
          "Mereu",
          "La aplicatii mici cu o echipa mica — overhead nejustificat",
          "La proiecte noi",
          "La React"
        ],
        "answer": "La aplicatii mici cu o echipa mica — overhead nejustificat",
        "explanation": "MFE adauga complexitate de networking, versionare, comunicare. Beneficiile apar la organizatii cu echipe multiple.",
        "difficulty": "easy"
      },
      {
        "number": 8,
        "name": "strangler fig",
        "question": "Ce este 'strangler fig pattern' in contextul micro-frontends?",
        "options": [
          "Security pattern",
          "Migrare graduala: noi functionalitati in MFE, vechi raman in monolita pana inlocuire completa",
          "Bundle optimization",
          "Logging pattern"
        ],
        "answer": "Migrare graduala: noi functionalitati in MFE, vechi raman in monolita pana inlocuire completa",
        "explanation": "Denumit dupa arborele banyan: incolirti monolita cu MFE-uri noi pana o inlocuiesti complet.",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "event bus MFE",
        "question": "Cum comunica 2 micro-frontends fara dependente directe?",
        "options": [
          "Import direct",
          "Event Bus (CustomEvent sau Pub/Sub) sau state management partajat",
          "HTTP requests",
          "Local storage polling"
        ],
        "answer": "Event Bus (CustomEvent sau Pub/Sub) sau state management partajat",
        "explanation": "Evenimentele decupleaza MFE-urile. Un MFE emite 'cart:updated', altul asculta — fara import intre ele.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Coding: lazy import MFE",
        "question": "In host application, importa dinamic componenta 'ProductList' expusa de remote-ul 'products' si afis-o cu Suspense.",
        "options": [],
        "answer": "",
        "explanation": "React.lazy + dynamic import cu named remote. Webpack Module Federation rezolva URL-ul.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "Coding: postMessage iframe",
        "question": "Creeaza un component React care embeds un iframe si asculta mesaje de tip 'ADD_TO_CART' de la el.",
        "options": [],
        "answer": "",
        "explanation": "window.addEventListener message + validare origin + cleanup removeEventListener la unmount.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "exposes in webpack",
        "question": "Ce face proprietatea 'exposes' in configuratia Module Federation Remote?",
        "options": [
          "Importa module externe",
          "Declara ce module din aplicatia curenta sunt disponibile pentru alte aplicatii",
          "Shareaza dependente",
          "Configureaza URL-ul"
        ],
        "answer": "Declara ce module din aplicatia curenta sunt disponibile pentru alte aplicatii",
        "explanation": "exposes: { './Button': './src/Button' } — host poate face import('remote/Button').",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "customElements.define",
        "question": "Ce face customElements.define('my-component', MyClass)?",
        "options": [
          "Importa componenta",
          "Inregistreaza un custom HTML element care poate fi folosit ca <my-component>",
          "Defineste un React component",
          "Exporta componenta"
        ],
        "answer": "Inregistreaza un custom HTML element care poate fi folosit ca <my-component>",
        "explanation": "Dupa define, <my-component> e valid in orice HTML sau framework. Tagul TREBUIE sa contina '-'.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "activeWhen single-spa",
        "question": "Ce face activeWhen in registerApplication (single-spa)?",
        "options": [
          "Porneste aplicatia la load",
          "Defineste cand micro-aplicatia e activa (mounted) pe baza URL-ului",
          "Seteaza prioritatea",
          "Configureaza eventurile"
        ],
        "answer": "Defineste cand micro-aplicatia e activa (mounted) pe baza URL-ului",
        "explanation": "activeWhen: '/cart' sau activeWhen: (loc) => loc.pathname.startsWith('/cart').",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "shared dependencies",
        "question": "De ce specifici shared: { react: { singleton: true } } in Module Federation?",
        "options": [
          "E obligatoriu",
          "Previne descarcarea a doua copii React — una din host si una din remote",
          "Accelereaza build-ul",
          "E pentru TypeScript"
        ],
        "answer": "Previne descarcarea a doua copii React — una din host si una din remote",
        "explanation": "Fara shared, host si remote au fiecare React propriu. Cu shared singleton, se negociaza o singura versiune.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "react-native-intro",
    "title": "38. React Native — Introducere",
    "order": 38,
    "theory": [
      {
        "order": 1,
        "title": "React Native vs React Web — diferente esentiale",
        "content": "React Native foloseste aceleasi concepte (JSX, hooks, components) dar componente native, nu HTML.\n\n```jsx\n// React Web:\nimport React from 'react';\nfunction Welcome() {\n  return (\n    <div className=\"container\">\n      <h1 style={{ color: 'blue' }}>Bun venit!</h1>\n      <p>Aplicatie web</p>\n    </div>\n  );\n}\n\n// React Native:\nimport React from 'react';\nimport { View, Text, StyleSheet } from 'react-native';\n\nfunction Welcome() {\n  return (\n    <View style={styles.container}>\n      <Text style={styles.title}>Bun venit!</Text>\n      <Text>Aplicatie mobila</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: {\n    flex: 1,\n    alignItems: 'center',\n    justifyContent: 'center',\n    backgroundColor: '#fff',\n  },\n  title: {\n    fontSize: 24,\n    fontWeight: 'bold',\n    color: 'blue',\n    marginBottom: 10,\n  },\n});\n```\n\nDIFERENTE CHEIE:\n| React Web    | React Native          |\n|------------- |-----------------------|\n| div, span    | View, ScrollView      |\n| p, h1        | Text (toate textele!) |\n| img          | Image                 |\n| className    | style={} (JS object)  |\n| CSS files    | StyleSheet.create()   |\n| onClick      | onPress               |\n| input        | TextInput             |\n\nLA INTERVIU: Diferenta React vs React Native? RN foloseste componente native (View/Text) care se mapeaza la UI native iOS/Android, nu DOM HTML."
      },
      {
        "order": 2,
        "title": "Expo — setup rapid si APIs native",
        "content": "Expo e un framework deasupra React Native care simplifica setup-ul si adauga API-uri native.\n\n```bash\n# Creare proiect nou:\nnpx create-expo-app MyApp\ncd MyApp\nnpx expo start\n\n# Acceseaza pe telefon cu Expo Go sau simulator\n```\n\n```jsx\nimport { StatusBar } from 'expo-status-bar';\nimport { StyleSheet, Text, View, Platform } from 'react-native';\nimport * as Camera from 'expo-camera';\nimport * as Location from 'expo-location';\nimport * as Notifications from 'expo-notifications';\n\nexport default function App() {\n  return (\n    <View style={styles.container}>\n      <Text>Ruleaza pe {Platform.OS}!</Text>\n      <StatusBar style=\"auto\" />\n    </View>\n  );\n}\n\n// Platform specific code:\nconst buttonStyle = Platform.select({\n  ios: { shadowColor: '#000', shadowOpacity: 0.3 },\n  android: { elevation: 4 },\n});\n\n// Expo Camera API:\nasync function takePicture() {\n  const { status } = await Camera.requestCameraPermissionsAsync();\n  if (status !== 'granted') return;\n  // ... camera logic\n}\n\n// Expo Location:\nasync function getLocation() {\n  const { status } = await Location.requestForegroundPermissionsAsync();\n  if (status !== 'granted') return;\n  const loc = await Location.getCurrentPositionAsync({});\n  console.log(loc.coords.latitude, loc.coords.longitude);\n}\n```\n\nExpo Managed vs Bare Workflow:\n- Managed: Expo gestioneaza native code (mai simplu)\n- Bare: acces complet la Xcode/Android Studio (mai flexibil)"
      },
      {
        "order": 3,
        "title": "Navigare cu React Navigation",
        "content": "React Navigation e libraria standard pentru navigare in React Native.\n\n```bash\nnpm install @react-navigation/native @react-navigation/stack\nnpx expo install react-native-screens react-native-safe-area-context\n```\n\n```jsx\nimport { NavigationContainer } from '@react-navigation/native';\nimport { createStackNavigator } from '@react-navigation/stack';\nimport { createBottomTabNavigator } from '@react-navigation/bottom-tabs';\n\nconst Stack = createStackNavigator();\nconst Tab = createBottomTabNavigator();\n\n// Stack Navigator (push/pop):\nfunction AppNavigator() {\n  return (\n    <NavigationContainer>\n      <Stack.Navigator initialRouteName=\"Home\">\n        <Stack.Screen name=\"Home\" component={HomeScreen} />\n        <Stack.Screen\n          name=\"Details\"\n          component={DetailsScreen}\n          options={{ title: 'Detalii produs' }}\n        />\n      </Stack.Navigator>\n    </NavigationContainer>\n  );\n}\n\n// Navigare programatica:\nfunction HomeScreen({ navigation }) {\n  return (\n    <View>\n      <Button\n        title=\"Deschide detalii\"\n        onPress={() => navigation.navigate('Details', { id: 42 })}\n      />\n    </View>\n  );\n}\n\n// Citire params:\nfunction DetailsScreen({ route }) {\n  const { id } = route.params;\n  return <Text>Produs ID: {id}</Text>;\n}\n\n// Bottom Tab Navigator:\nfunction TabNavigator() {\n  return (\n    <Tab.Navigator>\n      <Tab.Screen\n        name=\"Home\"\n        component={HomeScreen}\n        options={{ tabBarIcon: ({ color }) => <Icon name=\"home\" color={color} /> }}\n      />\n      <Tab.Screen name=\"Profile\" component={ProfileScreen} />\n    </Tab.Navigator>\n  );\n}\n```"
      },
      {
        "order": 4,
        "title": "FlatList, TouchableOpacity si APIs native",
        "content": "Componente esentiale si acces la APIs native in React Native.\n\n```jsx\nimport {\n  FlatList, TouchableOpacity, TextInput,\n  Image, ScrollView, Alert, Vibration, Linking\n} from 'react-native';\n\n// FlatList — list performanta (virtualizata):\nfunction ProductList({ products }) {\n  const renderItem = ({ item }) => (\n    <TouchableOpacity\n      style={styles.item}\n      onPress={() => Alert.alert('Produs', item.name)}\n      activeOpacity={0.7}\n    >\n      <Image\n        source={{ uri: item.imageUrl }}\n        style={{ width: 80, height: 80, borderRadius: 8 }}\n      />\n      <Text>{item.name} — {item.price} RON</Text>\n    </TouchableOpacity>\n  );\n\n  return (\n    <FlatList\n      data={products}\n      keyExtractor={(item) => item.id.toString()}\n      renderItem={renderItem}\n      numColumns={2}                   // Grid 2 coloane\n      ListHeaderComponent={<Header />}\n      ListEmptyComponent={<Empty />}\n      onEndReached={loadMore}          // Scroll infinit\n      onEndReachedThreshold={0.5}\n      refreshing={isRefreshing}\n      onRefresh={handleRefresh}        // Pull to refresh\n    />\n  );\n}\n\n// TextInput:\n<TextInput\n  style={styles.input}\n  placeholder=\"Cauta...\"\n  value={search}\n  onChangeText={setSearch}\n  keyboardType=\"default\"\n  returnKeyType=\"search\"\n  onSubmitEditing={handleSearch}\n  secureTextEntry={false} // true pentru parole\n/>\n\n// APIs native:\nVibration.vibrate(200); // Vibreaza 200ms\nAlert.alert('Confirma', 'Stergi?', [\n  { text: 'Nu', style: 'cancel' },\n  { text: 'Da', style: 'destructive', onPress: handleDelete },\n]);\nawait Linking.openURL('https://google.com');\nawait Linking.openURL('tel:+40721000000');\n```\n\nLA INTERVIU: De ce FlatList in loc de ScrollView cu map? FlatList virtualizeaza — renderizeaza doar elementele vizibile. ScrollView renderizeaza tot — lent la liste mari."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "View vs div",
        "question": "Echivalentul React Native pentru <div> este?",
        "options": [
          "div",
          "View",
          "Container",
          "Box"
        ],
        "answer": "View",
        "explanation": "View este containeru de baza in RN. Se mapeaza la UIView (iOS) si android.view.View (Android).",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "Text obligatoriu",
        "question": "In React Native, textul trebuie intotdeauna:",
        "options": [
          "In div",
          "In componenta <Text>",
          "In span",
          "In p"
        ],
        "answer": "In componenta <Text>",
        "explanation": "Spre deosebire de web, in RN nu poti pune text direct intr-un View. Orice text trebuie in <Text>.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "StyleSheet.create",
        "question": "Avantajul StyleSheet.create fata de stiluri inline {}?",
        "options": [
          "Identice",
          "Validare stiluri si optimizare (serializare o singura data, nu la fiecare render)",
          "CSS variables",
          "Animatii"
        ],
        "answer": "Validare stiluri si optimizare (serializare o singura data, nu la fiecare render)",
        "explanation": "StyleSheet.create valideaza proprietatile si trimite stilurile la native bridge o singura data.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "onPress vs onClick",
        "question": "In React Native, gesturile touch se gestioneaza cu:",
        "options": [
          "onClick",
          "onPress (pe Touchable sau componente interactive)",
          "onTouch",
          "onTap"
        ],
        "answer": "onPress (pe Touchable sau componente interactive)",
        "explanation": "onClick nu exista in RN. Folosesti TouchableOpacity, Pressable sau Button cu onPress.",
        "difficulty": "easy"
      },
      {
        "number": 5,
        "name": "FlatList vs ScrollView",
        "question": "De ce FlatList e recomandat pentru liste lungi fata de ScrollView + map?",
        "options": [
          "E mai usor de scris",
          "FlatList virtualizeaza — renderizeaza doar elementele vizibile, ScrollView renderizeaza totul",
          "FlatList e mai nou",
          "Identice ca performanta"
        ],
        "answer": "FlatList virtualizeaza — renderizeaza doar elementele vizibile, ScrollView renderizeaza totul",
        "explanation": "1000 de elemente in ScrollView = 1000 de componente in memorie. FlatList: ~10 vizibile + buffer.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "Platform.OS",
        "question": "Cum verifici daca app-ul ruleaza pe iOS sau Android?",
        "options": [
          "process.env.PLATFORM",
          "Platform.OS === 'ios'",
          "navigator.platform",
          "device.isIOS"
        ],
        "answer": "Platform.OS === 'ios'",
        "explanation": "Platform.OS returneaza 'ios', 'android' sau 'web' (Expo web). Platform.select({ios: ..., android: ...}) pentru stiluri specifice.",
        "difficulty": "easy"
      },
      {
        "number": 7,
        "name": "navigation.navigate",
        "question": "Cum navighezi programatic la o alta ecrana si pasezi parametri?",
        "options": [
          "router.push('/details')",
          "navigation.navigate('Details', { id: 42 })",
          "history.push('Details')",
          "Link to='Details'"
        ],
        "answer": "navigation.navigate('Details', { id: 42 })",
        "explanation": "navigation prop e primit automat de screenuri. route.params contine parametrii in componenta destinatie.",
        "difficulty": "easy"
      },
      {
        "number": 8,
        "name": "keyExtractor",
        "question": "La ce serveste keyExtractor in FlatList?",
        "options": [
          "Sorteaza lista",
          "Furnizeaza o cheie unica stabila pentru fiecare item — esential pentru reconciliere React",
          "Filtreaza itemuri",
          "Formateaza cheia"
        ],
        "answer": "Furnizeaza o cheie unica stabila pentru fiecare item — esential pentru reconciliere React",
        "explanation": "keyExtractor: (item) => item.id.toString() — similar cu key prop in map(). Fara el: warning + bug-uri potentiale.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "Expo vs CLI",
        "question": "Principalul avantaj Expo fata de React Native CLI?",
        "options": [
          "Mai rapid",
          "Nu necesita Xcode/Android Studio pentru development — Expo Go pe telefon",
          "TypeScript support",
          "Mai putine dependente"
        ],
        "answer": "Nu necesita Xcode/Android Studio pentru development — Expo Go pe telefon",
        "explanation": "Expo managed: scanezi QR code cu Expo Go, app-ul ruleaza instant. CLI: setup nativ complet necesar.",
        "difficulty": "easy"
      },
      {
        "number": 10,
        "name": "Coding: FlatList simplu",
        "question": "Implementeaza o lista de contacte cu FlatList care afiseaza nume si telefon, cu onPress ce afiseaza un Alert.",
        "options": [],
        "answer": "",
        "explanation": "FlatList necesita data, keyExtractor si renderItem. TouchableOpacity cu onPress pentru interactiune.",
        "difficulty": "easy"
      },
      {
        "number": 11,
        "name": "Coding: TextInput controlled",
        "question": "Creeaza un input de cautare in React Native: TextInput controlled cu useState, afisand rezultatele filtrate dintr-o lista.",
        "options": [],
        "answer": "",
        "explanation": "TextInput cu value+onChangeText = controlled input. Filter pe text cu includes().",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Coding: Stack Navigator",
        "question": "Configureaza un Stack Navigator cu doua ecrane: HomeScreen si DetailScreen (primeste id prin route.params).",
        "options": [],
        "answer": "",
        "explanation": "NavigationContainer + createStackNavigator + navigation.navigate('Detail', {id}) + route.params.id.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Alert.alert",
        "question": "Cum afisezi un dialog de confirmare nativ in React Native?",
        "options": [
          "window.confirm()",
          "Alert.alert('Titlu', 'Mesaj', buttons[])",
          "dialog.show()",
          "Modal + buttons"
        ],
        "answer": "Alert.alert('Titlu', 'Mesaj', buttons[])",
        "explanation": "Alert.alert afiseaza un dialog nativ (ActionSheet pe iOS, Dialog pe Android) cu butoane custom.",
        "difficulty": "easy"
      },
      {
        "number": 14,
        "name": "refresh FlatList",
        "question": "Cum implementezi pull-to-refresh pe FlatList?",
        "options": [
          "Imposibil",
          "Props refreshing + onRefresh pe FlatList",
          "SwipeRefresh component",
          "ScrollView refresh"
        ],
        "answer": "Props refreshing + onRefresh pe FlatList",
        "explanation": "refreshing={isLoading} onRefresh={handleRefresh} — FlatList afiseaza indicator nativ la pull-to-refresh.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "flexbox RN",
        "question": "Diferenta principala in Flexbox intre React Native si CSS web?",
        "options": [
          "Identice",
          "RN: flexDirection default 'column' (nu 'row'), fara unele proprietati CSS",
          "RN nu suporta Flexbox",
          "RN are grid in plus"
        ],
        "answer": "RN: flexDirection default 'column' (nu 'row'), fara unele proprietati CSS",
        "explanation": "Web: flex-direction: row default. RN: flexDirection: 'column' default. Layout-ul se construieste vertical by default.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "react-testing-avansat",
    "title": "39. Testing avansat React",
    "order": 39,
    "theory": [
      {
        "order": 1,
        "title": "MSW — Mock Service Worker",
        "content": "MSW intercepteaza request-urile la nivel de network (Service Worker), nu la nivel de cod.\n\n```bash\nnpm install --save-dev msw@latest\nnpx msw init public/ --save\n```\n\n```js\n// src/mocks/handlers.js\nimport { http, HttpResponse } from 'msw';\n\nexport const handlers = [\n  http.get('/api/users', () => {\n    return HttpResponse.json([\n      { id: 1, name: 'Ana Pop', email: 'ana@test.com' },\n      { id: 2, name: 'Ion Ionescu', email: 'ion@test.com' },\n    ]);\n  }),\n\n  http.post('/api/users', async ({ request }) => {\n    const body = await request.json();\n    return HttpResponse.json({ id: 3, ...body }, { status: 201 });\n  }),\n\n  http.get('/api/users/:id', ({ params }) => {\n    const { id } = params;\n    if (id === '999') {\n      return new HttpResponse(null, { status: 404 });\n    }\n    return HttpResponse.json({ id, name: 'Test User' });\n  }),\n];\n\n// src/mocks/server.js — pentru Node/Jest:\nimport { setupServer } from 'msw/node';\nimport { handlers } from './handlers';\nexport const server = setupServer(...handlers);\n\n// src/setupTests.js:\nimport { server } from './mocks/server';\nbeforeAll(() => server.listen());\nafterEach(() => server.resetHandlers());\nafterAll(() => server.close());\n\n// Override handler intr-un test specific:\ntest('gestioneaza eroarea 500', async () => {\n  server.use(\n    http.get('/api/users', () =>\n      new HttpResponse(null, { status: 500 })\n    )\n  );\n  // Testul cu eroare...\n});\n```"
      },
      {
        "order": 2,
        "title": "Custom render — provideri si context",
        "content": "Custom render wrapper pentru testarea componentelor cu provideri (Router, Query, Theme).\n\n```jsx\n// src/test-utils.jsx\nimport { render } from '@testing-library/react';\nimport { BrowserRouter } from 'react-router-dom';\nimport { QueryClient, QueryClientProvider } from '@tanstack/react-query';\nimport { ThemeProvider } from './ThemeContext';\n\nfunction createTestQueryClient() {\n  return new QueryClient({\n    defaultOptions: {\n      queries: {\n        retry: false,  // Nu re-incearca in teste — test mai rapid si predictibil\n        gcTime: 0,\n      },\n    },\n  });\n}\n\nfunction AllProviders({ children }) {\n  const queryClient = createTestQueryClient();\n  return (\n    <BrowserRouter>\n      <QueryClientProvider client={queryClient}>\n        <ThemeProvider defaultTheme=\"light\">\n          {children}\n        </ThemeProvider>\n      </QueryClientProvider>\n    </BrowserRouter>\n  );\n}\n\nexport function customRender(ui, options = {}) {\n  return render(ui, { wrapper: AllProviders, ...options });\n}\n\n// Re-export tot din testing-library:\nexport * from '@testing-library/react';\n\n// Utilizare in teste:\nimport { customRender, screen, waitFor } from '../test-utils';\n\ntest('UserList afiseaza utilizatorii', async () => {\n  customRender(<UserList />);\n  await waitFor(() => {\n    expect(screen.getByText('Ana Pop')).toBeInTheDocument();\n  });\n});\n```"
      },
      {
        "order": 3,
        "title": "Testare a11y si user-event",
        "content": "Testare comportament utilizator cu @testing-library/user-event si accesibilitate.\n\n```bash\nnpm install --save-dev @testing-library/user-event jest-axe\n```\n\n```jsx\nimport userEvent from '@testing-library/user-event';\nimport { render, screen, waitFor } from '@testing-library/react';\nimport { axe, toHaveNoViolations } from 'jest-axe';\n\nexpect.extend(toHaveNoViolations);\n\n// userEvent simuleaza input uman real (vs fireEvent care e instantaneu):\ntest('Formularul de login functioneaza', async () => {\n  const user = userEvent.setup();\n  const mockLogin = jest.fn();\n\n  render(<LoginForm onLogin={mockLogin} />);\n\n  // Tab prin campuri:\n  await user.tab();\n  expect(screen.getByLabelText('Email')).toHaveFocus();\n\n  // Scrie in input (simuleaza tastatura):\n  await user.type(screen.getByLabelText('Email'), 'test@test.com');\n\n  // Click pe checkbox:\n  await user.click(screen.getByRole('checkbox', { name: 'Tine-ma minte' }));\n\n  // Submit cu Enter:\n  await user.keyboard('{Enter}');\n\n  await waitFor(() => {\n    expect(mockLogin).toHaveBeenCalledWith({\n      email: 'test@test.com',\n      remember: true,\n    });\n  });\n});\n\n// Testare accesibilitate automata:\ntest('LoginForm nu are violari a11y', async () => {\n  const { container } = render(<LoginForm />);\n  const results = await axe(container);\n  expect(results).toHaveNoViolations();\n});\n\n// Testare cu ecran de incarcare:\ntest('Afiseaza loading, apoi date', async () => {\n  render(<UserList />);\n\n  // Verifica starea de loading:\n  expect(screen.getByRole('status')).toBeInTheDocument();\n\n  // Asteapta datele (MSW raspunde):\n  expect(await screen.findByText('Ana Pop')).toBeInTheDocument();\n\n  // Loading disparut:\n  expect(screen.queryByRole('status')).not.toBeInTheDocument();\n});\n```"
      },
      {
        "order": 4,
        "title": "Snapshot testing si testare hooks",
        "content": "Snapshot testing si testarea hook-urilor custom.\n\n```jsx\nimport { renderHook, act } from '@testing-library/react';\nimport { useCounter } from './useCounter';\n\n// Testare hook custom:\ntest('useCounter incrementeaza corect', () => {\n  const { result } = renderHook(() => useCounter(0));\n\n  expect(result.current.count).toBe(0);\n\n  act(() => { result.current.increment(); });\n  expect(result.current.count).toBe(1);\n\n  act(() => { result.current.decrement(); });\n  expect(result.current.count).toBe(0);\n});\n\ntest('useCounter cu async reset', async () => {\n  const { result } = renderHook(() => useCounter(5));\n\n  await act(async () => {\n    await result.current.asyncReset();\n  });\n\n  expect(result.current.count).toBe(0);\n});\n\n// Snapshot testing — detecteaza regresii vizuale accidentale:\nimport { render } from '@testing-library/react';\n\ntest('Button se rendereaza corect', () => {\n  const { container } = render(<Button variant=\"primary\">Salveaza</Button>);\n  expect(container.firstChild).toMatchSnapshot();\n});\n// Prima rulare: genereaza __snapshots__/Button.test.js.snap\n// Urmatoarele: compara cu snapshot salvat\n\n// Inline snapshot:\ntest('Button inline snapshot', () => {\n  const { container } = render(<Button>Test</Button>);\n  expect(container.firstChild).toMatchInlineSnapshot(`\n    <button\n      class=\"btn\"\n      type=\"button\"\n    >\n      Test\n    </button>\n  `);\n});\n\n// Update snapshot cand UI se schimba intentionat:\n// jest --updateSnapshot sau jest -u\n\n// Evita snapshot-uri mari:\n// Snapshot = detector de regresii, NU documentatie\n// Snapshot mic = bun. Snapshot de 500 linii = anti-pattern\n```\n\nLA INTERVIU: Cand folosesti snapshot testing? Pentru componente stable (UI library, design system) unde vrei sa detectezi schimbari accidentale. NU pentru logica de business."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "MSW vs jest.mock",
        "question": "Avantajul MSW fata de jest.mock(fetch) sau jest.mock(axios)?",
        "options": [
          "E mai rapid",
          "Intercepteaza la nivel de network — testeaza fetch, axios, orice librarie, fara a mocka implementarea",
          "E mai simplu",
          "Suporta TypeScript"
        ],
        "answer": "Intercepteaza la nivel de network — testeaza fetch, axios, orice librarie, fara a mocka implementarea",
        "explanation": "jest.mock(fetch) => daca schimbi fetch cu axios, testul se rupe. MSW: intercepteaza orice, independent de implementare.",
        "difficulty": "hard"
      },
      {
        "number": 2,
        "name": "server.resetHandlers",
        "question": "De ce apelezi server.resetHandlers() in afterEach in MSW?",
        "options": [
          "Performance",
          "Reseteaza handler-ele custom adaugate in teste individuale — previne contaminarea intre teste",
          "Sterge cache",
          "Restarteaza serverul"
        ],
        "answer": "Reseteaza handler-ele custom adaugate in teste individuale — previne contaminarea intre teste",
        "explanation": "server.use() intr-un test adauga handler temporar. resetHandlers() revine la handleri default dupa fiecare test.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "custom render wrapper",
        "question": "De ce creezi un custom render in loc de render din @testing-library/react direct?",
        "options": [
          "E obligatoriu",
          "Adauga automat providerii necesari (Router, QueryClient, Theme) — evita duplicare in fiecare test",
          "E mai rapid",
          "Are mai multe optiuni"
        ],
        "answer": "Adauga automat providerii necesari (Router, QueryClient, Theme) — evita duplicare in fiecare test",
        "explanation": "Fara custom render, fiecare test ar trebui sa impacheteze componenta in toti providerii.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "userEvent vs fireEvent",
        "question": "De ce userEvent.type e preferat fata de fireEvent.change pentru input-uri?",
        "options": [
          "E mai rapid",
          "Simuleaza tastare reala (keydown, keyup, change, input) — detecteaza mai multe bug-uri",
          "E mai usor",
          "Suporta mai mult"
        ],
        "answer": "Simuleaza tastare reala (keydown, keyup, change, input) — detecteaza mai multe bug-uri",
        "explanation": "fireEvent.change({target:{value:'x'}}) nu simuleaza tastare reala. userEvent.type simuleaza fiecare tasta.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "findBy vs getBy",
        "question": "Diferenta getByText vs findByText in Testing Library?",
        "options": [
          "Identice",
          "getBy: sincron, arunca eroare imediat. findBy: async, asteapta element sa apara (waitFor inclus)",
          "findBy e mai rapid",
          "getBy e mai nou"
        ],
        "answer": "getBy: sincron, arunca eroare imediat. findBy: async, asteapta element sa apara (waitFor inclus)",
        "explanation": "findByText = queryByText + waitFor. Util pentru elemente asincrone (dupa fetch). getBy = elemente deja in DOM.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "renderHook",
        "question": "La ce serveste renderHook din @testing-library/react?",
        "options": [
          "Renderizeaza componente",
          "Testeaza hook-uri custom in izolare, fara a crea o componenta wrapper",
          "Simuleaza browser",
          "Mock fetch"
        ],
        "answer": "Testeaza hook-uri custom in izolare, fara a crea o componenta wrapper",
        "explanation": "renderHook(() => useMyHook()) returneaza { result } cu result.current = valoarea returnata de hook.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "act wrapper",
        "question": "De ce impachetezi actualizari de state in act() in teste?",
        "options": [
          "E optional",
          "Asigura procesarea tuturor efectelor si re-render-urilor React inainte de assertii",
          "E pentru async",
          "E pentru mock"
        ],
        "answer": "Asigura procesarea tuturor efectelor si re-render-urilor React inainte de assertii",
        "explanation": "Fara act(): avertisment si assertii pe state nefinalizat. act() = flush toate update-urile React.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "snapshot update",
        "question": "Cum actualizezi snapshot-urile Jest dupa o schimbare intentionata a UI?",
        "options": [
          "Stergi manual fisierele .snap",
          "jest --updateSnapshot sau jest -u",
          "Rescrii testele",
          "Imposibil"
        ],
        "answer": "jest --updateSnapshot sau jest -u",
        "explanation": "La schimbare intentionata UI: jest -u regenereaza snapshot-urile. Review diff in git inainte de commit.",
        "difficulty": "easy"
      },
      {
        "number": 9,
        "name": "retry: false TanStack",
        "question": "De ce setezi retry: false in QueryClient pentru teste cu TanStack Query?",
        "options": [
          "Performance",
          "Evita 3 retry-uri la fiecare test cu eroare — teste mai rapide si predictibile",
          "E obligatoriu",
          "Evita mock-uri"
        ],
        "answer": "Evita 3 retry-uri la fiecare test cu eroare — teste mai rapide si predictibile",
        "explanation": "Default TanStack Query: retry 3 ori. In teste: vrei eroare imediat, nu dupa 3 incercari cu delay.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Coding: test cu MSW",
        "question": "Scrie un test pentru componenta UserList care: afiseaza loading, asteapta raspunsul MSW si verifica ca utilizatorii sunt afisati.",
        "options": [],
        "answer": "",
        "explanation": "MSW handler pentru GET /api/users. findByText pentru asteptare async. queryByRole pentru verificare disparutie loading.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "Coding: renderHook custom hook",
        "question": "Testeaza hook-ul custom useLocalStorage(key, initialValue) care sincronizeaza cu localStorage.",
        "options": [],
        "answer": "",
        "explanation": "renderHook + act pentru operatii. Clear localStorage in beforeEach. result.current pentru valori.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Coding: userEvent form",
        "question": "Testeaza un formular de login: completeaza email si parola cu userEvent.type, submit cu Enter, verifica ca onSubmit e apelat.",
        "options": [],
        "answer": "",
        "explanation": "userEvent.setup() + type pe fiecare camp + keyboard Enter + waitFor pentru assertii async.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "queryBy null",
        "question": "Diferenta getBy vs queryBy in Testing Library?",
        "options": [
          "Identice",
          "getBy: arunca eroare daca nu gaseste. queryBy: returneaza null (pentru assertii de absenta)",
          "queryBy e mai rapid",
          "getBy e sync"
        ],
        "answer": "getBy: arunca eroare daca nu gaseste. queryBy: returneaza null (pentru assertii de absenta)",
        "explanation": "expect(screen.queryByText('Loading')).not.toBeInTheDocument() — verifica absenta. getBy: ar arunca eroare.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "axe async",
        "question": "De ce axe(container) returneaza un Promise?",
        "options": [
          "E lent",
          "Axe ruleaza analiza WCAG async pentru a nu bloca thread-ul principal",
          "E necesar pentru browser",
          "E pentru Node"
        ],
        "answer": "Axe ruleaza analiza WCAG async pentru a nu bloca thread-ul principal",
        "explanation": "await axe(container) + expect(results).toHaveNoViolations() — pattern standard pentru a11y testing.",
        "difficulty": "easy"
      },
      {
        "number": 15,
        "name": "cand snapshot",
        "question": "Cand este snapshot testing O BUNA alegere?",
        "options": [
          "Mereu",
          "Componente UI stabile (design system, buttons, icons) unde vrei sa detectezi schimbari accidentale",
          "Logica de business",
          "Componente care se schimba des"
        ],
        "answer": "Componente UI stabile (design system, buttons, icons) unde vrei sa detectezi schimbari accidentale",
        "explanation": "Snapshots pentru 'am schimbat ceva accidental?'. Nu pentru 'codul face ce trebuie?'. Anti-pattern: snapshot de 1000 linii.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "react-ecommerce-final",
    "title": "40. Mini Proiect React Final — E-Commerce complet",
    "order": 40,
    "theory": [
      {
        "order": 1,
        "title": "Arhitectura proiectului E-Commerce",
        "content": "Structura scalabila pentru un E-Commerce React complet cu cart, auth, checkout si animatii.\n\n```\nsrc/\n  features/              # Feature-first organization\n    auth/\n      AuthContext.jsx    # Context + Provider\n      LoginForm.jsx\n      RegisterForm.jsx\n      useAuth.js         # Hook custom\n    cart/\n      cartStore.js       # Zustand store\n      CartDrawer.jsx     # Sliding cart\n      CartItem.jsx\n      useCart.js\n    products/\n      ProductCard.jsx\n      ProductGrid.jsx\n      useProducts.js     # TanStack Query\n    checkout/\n      CheckoutForm.jsx   # React Hook Form + Zod\n      OrderSummary.jsx\n      PaymentStep.jsx\n  components/            # Shared UI components\n    Button/\n    Modal/\n    LoadingSpinner/\n  hooks/\n    useLocalStorage.js\n    useDebounce.js\n  lib/\n    api.js               # Axios instance\n    queryClient.js       # TanStack QueryClient\n  pages/ (sau app/ pentru Next.js)\n    HomePage.jsx\n    ProductsPage.jsx\n    CartPage.jsx\n    CheckoutPage.jsx\n    ProfilePage.jsx\n```\n\nSTACK:\n- UI: React + Tailwind CSS\n- State global: Zustand (cart, UI state)\n- Data fetching: TanStack Query\n- Forms: React Hook Form + Zod\n- Animations: Framer Motion\n- Routing: React Router v6\n- Auth: JWT + HttpOnly cookies\n- Testing: Jest + RTL + MSW"
      },
      {
        "order": 2,
        "title": "Cart cu Zustand si persist",
        "content": "Implementarea completa a cosului de cumparaturi cu persistenta.\n\n```js\n// features/cart/cartStore.js\nimport { create } from 'zustand';\nimport { persist } from 'zustand/middleware';\n\nconst useCartStore = create(\n  persist(\n    (set, get) => ({\n      items: [],\n\n      addItem: (product) => {\n        const existing = get().items.find((i) => i.id === product.id);\n        if (existing) {\n          set((s) => ({\n            items: s.items.map((i) =>\n              i.id === product.id ? { ...i, qty: i.qty + 1 } : i\n            ),\n          }));\n        } else {\n          set((s) => ({\n            items: [...s.items, { ...product, qty: 1 }],\n          }));\n        }\n      },\n\n      removeItem: (id) =>\n        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),\n\n      updateQty: (id, qty) => {\n        if (qty <= 0) { get().removeItem(id); return; }\n        set((s) => ({\n          items: s.items.map((i) => (i.id === id ? { ...i, qty } : i)),\n        }));\n      },\n\n      clearCart: () => set({ items: [] }),\n\n      // Computed (nu se salveaza in persist):\n      get totalItems() { return get().items.reduce((s, i) => s + i.qty, 0); },\n      get totalPrice() {\n        return get().items.reduce((s, i) => s + i.price * i.qty, 0);\n      },\n    }),\n    {\n      name: 'cart-storage',\n      partialize: (s) => ({ items: s.items }), // Nu persista getters\n    }\n  )\n);\n\nexport default useCartStore;\n```"
      },
      {
        "order": 3,
        "title": "Autentificare cu Context si Protected Routes",
        "content": "Sistem de autentificare cu React Context si route guards.\n\n```jsx\n// features/auth/AuthContext.jsx\nimport { createContext, useContext, useState, useEffect } from 'react';\n\nconst AuthCtx = createContext(null);\n\nexport function AuthProvider({ children }) {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    // Verifica sesiune existenta la mount:\n    fetch('/api/auth/me')\n      .then((r) => r.ok ? r.json() : null)\n      .then((u) => { setUser(u); setLoading(false); })\n      .catch(() => setLoading(false));\n  }, []);\n\n  const login = async (email, password) => {\n    const res = await fetch('/api/auth/login', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ email, password }),\n    });\n    if (!res.ok) throw new Error('Credentiale invalide');\n    const u = await res.json();\n    setUser(u);\n    return u;\n  };\n\n  const logout = async () => {\n    await fetch('/api/auth/logout', { method: 'POST' });\n    setUser(null);\n  };\n\n  return (\n    <AuthCtx.Provider value={{ user, loading, login, logout }}>\n      {children}\n    </AuthCtx.Provider>\n  );\n}\n\nexport const useAuth = () => useContext(AuthCtx);\n\n// Protected Route:\nimport { Navigate, Outlet } from 'react-router-dom';\n\nexport function ProtectedRoute() {\n  const { user, loading } = useAuth();\n  if (loading) return <LoadingSpinner />;\n  if (!user) return <Navigate to=\"/login\" replace />;\n  return <Outlet />;\n}\n\n// Utilizare:\n<Route element={<ProtectedRoute />}>\n  <Route path=\"/checkout\" element={<CheckoutPage />} />\n  <Route path=\"/profile\" element={<ProfilePage />} />\n</Route>\n```"
      },
      {
        "order": 4,
        "title": "Animatii cu Framer Motion",
        "content": "Animatii fluente pentru cart drawer, page transitions si hover effects.\n\n```bash\nnpm install framer-motion\n```\n\n```jsx\nimport { motion, AnimatePresence } from 'framer-motion';\n\n// Cart Drawer animat:\nfunction CartDrawer({ isOpen, onClose }) {\n  return (\n    <AnimatePresence>\n      {isOpen && (\n        <>\n          {/* Overlay */}\n          <motion.div\n            initial={{ opacity: 0 }}\n            animate={{ opacity: 0.5 }}\n            exit={{ opacity: 0 }}\n            className=\"fixed inset-0 bg-black\"\n            onClick={onClose}\n          />\n          {/* Drawer */}\n          <motion.div\n            initial={{ x: '100%' }}\n            animate={{ x: 0 }}\n            exit={{ x: '100%' }}\n            transition={{ type: 'spring', damping: 25, stiffness: 300 }}\n            className=\"fixed right-0 top-0 h-full w-96 bg-white shadow-xl\"\n          >\n            <h2>Cosul tau</h2>\n            {/* Cart items */}\n          </motion.div>\n        </>\n      )}\n    </AnimatePresence>\n  );\n}\n\n// Product Card hover:\nfunction ProductCard({ product }) {\n  return (\n    <motion.div\n      whileHover={{ scale: 1.03 }}\n      whileTap={{ scale: 0.97 }}\n      initial={{ opacity: 0, y: 20 }}\n      animate={{ opacity: 1, y: 0 }}\n      transition={{ duration: 0.3 }}\n      className=\"bg-white rounded-xl p-4 cursor-pointer\"\n    >\n      <img src={product.image} alt={product.name} />\n      <h3>{product.name}</h3>\n      <p>{product.price} RON</p>\n    </motion.div>\n  );\n}\n\n// Page transition:\nconst pageVariants = {\n  initial: { opacity: 0, x: -20 },\n  animate: { opacity: 1, x: 0 },\n  exit: { opacity: 0, x: 20 },\n};\n\nfunction PageWrapper({ children }) {\n  return (\n    <motion.div variants={pageVariants} initial=\"initial\" animate=\"animate\" exit=\"exit\">\n      {children}\n    </motion.div>\n  );\n}\n```\n\nLA INTERVIU: Ce stii despre animatii in React? Framer Motion: declarative, AnimatePresence pentru mount/unmount, spring physics, gesture support (drag, hover, tap)."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Feature-first structure",
        "question": "Ce avantaj ofera organizarea feature-first (features/cart/, features/auth/) fata de type-first (components/, hooks/, utils/)?",
        "options": [
          "E mai rapida",
          "Codul unui feature e colocat — usor de gasit, sters sau mutat ca unitate",
          "E mai populara",
          "Are mai putine fisiere"
        ],
        "answer": "Codul unui feature e colocat — usor de gasit, sters sau mutat ca unitate",
        "explanation": "features/cart/ contine tot: store, components, hooks, types. La stergere feature: stergi un folder.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "Cart addItem logic",
        "question": "La addItem, daca produsul exista deja in cos, ce faci?",
        "options": [
          "Adaugi un item nou",
          "Incrementezi qty pentru itemul existent",
          "Afisezi eroare",
          "Inlocuiesti itemul"
        ],
        "answer": "Incrementezi qty pentru itemul existent",
        "explanation": "find() pentru item existent, daca exista: map + qty+1. Altfel: append nou item cu qty:1.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "ProtectedRoute pattern",
        "question": "Cum implementezi o ruta protejata in React Router v6?",
        "options": [
          "Redirect in useEffect",
          "Componenta cu Outlet: daca !user => <Navigate to='/login' />, altfel => <Outlet />",
          "Middleware",
          "Higher-order component"
        ],
        "answer": "Componenta cu Outlet: daca !user => <Navigate to='/login' />, altfel => <Outlet />",
        "explanation": "ProtectedRoute wrapper cu <Outlet> pentru randarea rutelor copil. Navigate cu replace previne history stacking.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "AnimatePresence",
        "question": "La ce serveste AnimatePresence din Framer Motion?",
        "options": [
          "Animeaza toate elementele",
          "Permite animatii de exit (unmount) pentru componente React",
          "E obligatoriu pentru animatii",
          "Sincronizeaza animatii"
        ],
        "answer": "Permite animatii de exit (unmount) pentru componente React",
        "explanation": "React unmounteza imediat. AnimatePresence intarzie unmount pana exit animation se termina.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "whileHover Framer",
        "question": "Ce face whileHover={{ scale: 1.05 }} in Framer Motion?",
        "options": [
          "Afiseaza tooltip",
          "Animeaza elementul la scale 1.05 cand mouse-ul e deasupra",
          "Modifica CSS",
          "Face click"
        ],
        "answer": "Animeaza elementul la scale 1.05 cand mouse-ul e deasupra",
        "explanation": "whileHover, whileTap, whileFocus — gesture-based animations. Revin la normal automat la hover out.",
        "difficulty": "easy"
      },
      {
        "number": 6,
        "name": "Auth loading state",
        "question": "De ce ai un state loading in AuthContext?",
        "options": [
          "Loading global",
          "Previne flash of unauthenticated content (redirect la login inainte de verificare sesiune)",
          "Performance",
          "Debug"
        ],
        "answer": "Previne flash of unauthenticated content (redirect la login inainte de verificare sesiune)",
        "explanation": "La mount: fetch /api/auth/me este async. loading=true pana stim cine e userul — ProtectedRoute asteapta.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "partialize persist",
        "question": "De ce folosesti partialize in Zustand persist pentru cart?",
        "options": [
          "Obligatoriu",
          "Salveaza doar items, nu actiunile sau getters — evita date inutile in localStorage",
          "Performance",
          "Securitate"
        ],
        "answer": "Salveaza doar items, nu actiunile sau getters — evita date inutile in localStorage",
        "explanation": "Actiunile sunt functii (nestorable). Salvand doar items e suficient — actiunile sunt recreate la hydrate.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "TanStack Query products",
        "question": "Care e avantajul TanStack Query pentru lista de produse fata de useEffect + fetch?",
        "options": [
          "E mai simplu",
          "Cache automat, deduplicare, stale-while-revalidate, loading/error state gestionat",
          "E mai rapid",
          "Suporta GraphQL"
        ],
        "answer": "Cache automat, deduplicare, stale-while-revalidate, loading/error state gestionat",
        "explanation": "useEffect + fetch: re-fetch la fiecare mount, no cache, manual loading/error state. TanStack: toate gratis.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "Checkout form Zod",
        "question": "De ce validezi datele de checkout cu Zod pe client SI pe server?",
        "options": [
          "E redundant, ajunge pe server",
          "Client: UX rapid (feedback instant). Server: securitate (client-side e bypassabil)",
          "Performanta",
          "Zod e doar pentru client"
        ],
        "answer": "Client: UX rapid (feedback instant). Server: securitate (client-side e bypassabil)",
        "explanation": "Validarea client = UX. Validarea server = securitate reala. Niciodata nu te baza doar pe validarea client.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Coding: CartDrawer animat",
        "question": "Implementeaza un CartDrawer care aluneca din dreapta cu Framer Motion. Overlay semi-transparent, click pe overlay inchide drawer-ul.",
        "options": [],
        "answer": "",
        "explanation": "AnimatePresence + motion.div cu initial={x:'100%'} animate={x:0} exit={x:'100%'}. Overlay motion cu opacity.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "Coding: ProtectedRoute",
        "question": "Implementeaza ProtectedRoute care redirecționeaza la /login daca userul nu e autentificat, sau la /verify-email daca emailul nu e verificat.",
        "options": [],
        "answer": "",
        "explanation": "Multiple conditii: loading state, !user, !user.emailVerified. Ordinea conditiilor conteaza.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Coding: useProducts hook",
        "question": "Creeaza un hook useProducts(filters) care foloseste TanStack Query pentru fetch + filtrare server-side.",
        "options": [],
        "answer": "",
        "explanation": "queryKey cu filters pentru cache separat per filtre. enabled: true mereu pentru produse.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Framer Motion variants",
        "question": "Ce sunt variants in Framer Motion si care e avantajul lor?",
        "options": [
          "Versiuni de animatii",
          "Obiecte numite de animatii reutilizabile — simplifica si coordoneaza animatii parent-child",
          "CSS classes",
          "Stari componente"
        ],
        "answer": "Obiecte numite de animatii reutilizabile — simplifica si coordoneaza animatii parent-child",
        "explanation": "variants: { hidden: {opacity:0}, visible: {opacity:1} } + animate='visible'. Parent propaga variants la copii automat.",
        "difficulty": "hard"
      },
      {
        "number": 14,
        "name": "HttpOnly cookies auth",
        "question": "De ce stochezi token-ul de autentificare in HttpOnly cookie si nu in localStorage?",
        "options": [
          "Performance",
          "HttpOnly cookie nu e accesibil prin JavaScript — protejeaza contra XSS",
          "E mai usor",
          "Dimensiune mai mica"
        ],
        "answer": "HttpOnly cookie nu e accesibil prin JavaScript — protejeaza contra XSS",
        "explanation": "XSS poate citi localStorage. HttpOnly cookie: doar browser-ul il trimite automat, JS nu-l poate citi.",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "Stale while revalidate",
        "question": "Ce inseamna stale-while-revalidate in TanStack Query?",
        "options": [
          "Date sterse automat",
          "Afiseaza date din cache (stale) imediat, face refetch in background, actualizeaza cand e gata",
          "Re-fetch automat",
          "Cache invalidat"
        ],
        "answer": "Afiseaza date din cache (stale) imediat, face refetch in background, actualizeaza cand e gata",
        "explanation": "UX perfect: utilizatorul vede date instant (chiar stale), apoi UI se actualizeaza silentios cand datele noi sosesc.",
        "difficulty": "medium"
      }
    ]
  }
];

module.exports = { reactExtra };
