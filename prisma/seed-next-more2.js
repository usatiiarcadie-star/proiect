// seed-next-more2.js
// Next.js Frontend lessons 26-30 + Next.js Backend lessons 26-30

const nextjsFrontendMore2 = [
  {
    slug: "nextjs-react-server-components-avansate",
    title: "React Server Components Avansate",
    order: 26,
    theory: [
      {
        order: 1,
        title: "Streaming cu Suspense in RSC",
        content: "React Server Components permit redarea progresiva a paginii prin streaming. In loc sa astepti ca toata pagina sa fie gata, Next.js trimite HTML-ul partial catre browser imediat, iar partile lente sunt inlocuite cu un fallback Suspense.\n\nExemplu:\n```jsx\nimport { Suspense } from 'react';\nimport SlowComponent from './SlowComponent';\n\nexport default function Page() {\n  return (\n    <div>\n      <h1>Pagina mea</h1>\n      <Suspense fallback={<p>Se incarca...</p>}>\n        <SlowComponent />\n      </Suspense>\n    </div>\n  );\n}\n```\nSlowComponent poate fi un RSC care face fetch la date. Browserul primeste imediat titlul, iar componenta lenta apare cand datele sunt gata. Aceasta tehnica reduce Time to First Byte (TTFB) si imbunatateste Largest Contentful Paint (LCP).\n\nInterviu tip: 'Ce este streaming in context RSC?' — raspuns: trimite HTML progresiv catre client folosind Suspense boundaries ca puncte de taietura."
      },
      {
        order: 2,
        title: "Nested RSC Patterns si Compozitie",
        content: "RSC-urile pot fi imbricate la orice adancime. Regula de aur: datele se fetchez cat mai aproape de componenta care le foloseste.\n\nPattern recomandat:\n```jsx\n// ParentServer.tsx (RSC)\nasync function ParentServer() {\n  const user = await getUser();\n  return (\n    <div>\n      <UserHeader user={user} />\n      <Suspense fallback={<PostsSkeleton />}>\n        <PostsServer userId={user.id} />\n      </Suspense>\n    </div>\n  );\n}\n\n// PostsServer.tsx (RSC separat)\nasync function PostsServer({ userId }) {\n  const posts = await getPosts(userId);\n  return <PostsList posts={posts} />;\n}\n```\nFiecare RSC imbricat poate fi separat de ceilalti prin Suspense. Asta inseamna ca waterfall-urile de date pot fi eliminate — fetch-urile paralele ruleaza simultan.\n\nAnti-pattern: a pune toata logica de fetch in componenta parinte si a pasa props in jos. Aceasta creeaza prop drilling si impiedica streaming granular."
      },
      {
        order: 3,
        title: "Limitarile RSC si Granita Client/Server",
        content: "RSC-urile nu pot folosi hooks (useState, useEffect), event handlers sau API-uri de browser. Cand ai nevoie de interactivitate, folosesti directiva 'use client'.\n\nRegula importanta: un Client Component nu poate importa un Server Component direct. In schimb, poti pasa un RSC ca prop/children:\n```jsx\n// ClientWrapper.tsx\n'use client';\nfunction ClientWrapper({ children }) {\n  const [open, setOpen] = useState(false);\n  return (\n    <div>\n      <button onClick={() => setOpen(!open)}>Toggle</button>\n      {open && children}\n    </div>\n  );\n}\n\n// Page.tsx (RSC)\nasync function Page() {\n  const data = await fetchData();\n  return (\n    <ClientWrapper>\n      <ServerContent data={data} />\n    </ClientWrapper>\n  );\n}\n```\nAceasta tehnica se numeste 'lifting RSC as children' si permite mentinerea RSC-urilor adanci in arbore, chiar daca sunt inconjurate de componente client.\n\nInterviu: diferenta intre 'use client' si 'use server' — primul marcheaza granita client, al doilea marcheaza Server Actions apelabile din client."
      },
      {
        order: 4,
        title: "Cache si Revalidare in RSC",
        content: "Fiecare fetch dintr-un RSC este memorat automat (request memoization) pe durata unui request. Doua fetch-uri identice in acelasi render tree vor face o singura cerere reala.\n\nPentru cache persistent folosesti optiunile fetch:\n```js\n// Cache permanent (SSG)\nfetch(url, { cache: 'force-cache' });\n\n// Revalidare la un interval\nfetch(url, { next: { revalidate: 3600 } }); // 1 ora\n\n// Fara cache (SSR la fiecare request)\nfetch(url, { cache: 'no-store' });\n```\nPentru invalidare manuala folosesti revalidateTag sau revalidatePath din Server Actions:\n```js\nimport { revalidateTag } from 'next/cache';\n\nasync function createPost(data) {\n  'use server';\n  await db.post.create({ data });\n  revalidateTag('posts');\n}\n```\nFetch-urile pot fi taguite: `fetch(url, { next: { tags: ['posts'] } })` si invalidate selectiv.\n\nInterviu: 'Cum eviti datele stale in RSC?' — raspuns: revalidateTag/revalidatePath in Server Actions sau on-demand revalidation prin API routes."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "Streaming cu Suspense",
        question: "Ce face directiva Suspense intr-o pagina Next.js cu RSC?",
        options: [
          "Blocheaza randararea paginii pana cand toate datele sunt incarcate",
          "Permite trimiterea progresiva a HTML-ului catre browser, afisand un fallback pana cand RSC-ul copil este gata",
          "Converteste automat RSC-urile in Client Components",
          "Activeaza code splitting pentru JavaScript"
        ],
        answer: "Permite trimiterea progresiva a HTML-ului catre browser, afisand un fallback pana cand RSC-ul copil este gata",
        explanation: "Suspense defineste o granita de streaming. Next.js trimite HTML-ul disponibil imediat si inlocuieste fallback-ul cu continutul real cand RSC-ul copil termina fetch-ul.",
        difficulty: "medium"
      },
      {
        number: 2,
        name: "Limitari RSC",
        question: "Care dintre urmatoarele NU este permisa intr-un React Server Component?",
        options: [
          "await fetch() pentru date externe",
          "useState() pentru stare locala",
          "Accesarea variabilelor de mediu server-side",
          "Randarea altor Server Components"
        ],
        answer: "useState() pentru stare locala",
        explanation: "RSC-urile ruleaza exclusiv pe server si nu au acces la API-urile React bazate pe stare sau la browser. useState, useEffect si event handlers sunt disponibile doar in Client Components ('use client').",
        difficulty: "easy"
      },
      {
        number: 3,
        name: "Granita client/server",
        question: "Cum poti folosi un Server Component in interiorul unui Client Component?",
        options: [
          "Il importi direct in Client Component",
          "Il pasezi ca prop children din pagina (RSC parinte)",
          "Adaugi 'use server' la inceputul Client Component-ului",
          "Nu este posibil sa combini RSC si Client Components"
        ],
        answer: "Il pasezi ca prop children din pagina (RSC parinte)",
        explanation: "Un Client Component nu poate importa direct un RSC, dar poate primi RSC-uri ca children sau props. Pagina parinte (RSC) compune ambele tipuri si paseza RSC-ul ca prop catre Client Component.",
        difficulty: "hard"
      },
      {
        number: 4,
        name: "Request Memoization",
        question: "Ce se intampla daca doua RSC-uri diferite din acelasi render tree fac fetch la acelasi URL in acelasi request?",
        options: [
          "Se fac doua cereri HTTP separate",
          "Apare o eroare de duplicat",
          "Next.js deduplicateaza automat si face o singura cerere HTTP",
          "Al doilea fetch returneaza undefined"
        ],
        answer: "Next.js deduplicateaza automat si face o singura cerere HTTP",
        explanation: "React aplica request memoization: fetch-urile identice (acelasi URL si optiuni) din acelasi render sunt deduplicatate automat, rezultand o singura cerere reala catre server.",
        difficulty: "medium"
      },
      {
        number: 5,
        name: "revalidateTag",
        question: "La ce foloseste revalidateTag('posts') intr-un Server Action?",
        options: [
          "Sterge toate paginile din cache",
          "Invalideaza toate fetch-urile taguite cu 'posts', fortand re-fetch la urmatoarea vizita",
          "Adauga tag-ul 'posts' la toate fetch-urile viitoare",
          "Creaza un nou tag de cache pentru posts"
        ],
        answer: "Invalideaza toate fetch-urile taguite cu 'posts', fortand re-fetch la urmatoarea vizita",
        explanation: "revalidateTag purgeaza din cache datele asociate unui tag specific. Fetch-urile marcate cu { next: { tags: ['posts'] } } vor fi re-executate la urmatoarea cerere dupa invalidare.",
        difficulty: "medium"
      },
      {
        number: 6,
        name: "Nested Suspense",
        question: "De ce este recomandat sa folosesti Suspense boundaries la nivelul fiecarui RSC care face fetch, nu doar la nivel de pagina?",
        options: [
          "Deoarece este obligatoriu in Next.js",
          "Permite streaming granular — fiecare sectiune a paginii apare independent, imbunatatind UX",
          "Reduce numarul de re-randari",
          "Elimina nevoia de loading.tsx"
        ],
        answer: "Permite streaming granular — fiecare sectiune a paginii apare independent, imbunatatind UX",
        explanation: "Boundaries Suspense granulare permit utilizatorilor sa vada si sa interactioneze cu partile incarcate ale paginii, in timp ce alte parti inca se incarca. Un singur Suspense la nivel de pagina blocheaza toata pagina.",
        difficulty: "medium"
      },
      {
        number: 7,
        name: "cache: no-store",
        question: "Cand folosesti `fetch(url, { cache: 'no-store' })` intr-un RSC?",
        options: [
          "Cand vrei ca datele sa fie memorate permanent",
          "Cand vrei date proaspete la fiecare request (echivalent SSR)",
          "Cand vrei sa dezactivezi complet fetch-ul",
          "Cand faci fetch la resurse statice"
        ],
        answer: "Cand vrei date proaspete la fiecare request (echivalent SSR)",
        explanation: "cache: 'no-store' opteaza pentru comportament SSR — datele sunt re-fetched la fiecare request, similar cu getServerSideProps din versiunile anterioare Next.js.",
        difficulty: "easy"
      },
      {
        number: 8,
        name: "Cod: RSC cu Suspense",
        question: "Scrie un RSC de pagina care afiseaza un titlu static si inconjoara componenta 'UserProfile' (care face fetch lent) intr-un Suspense cu fallback 'Se incarca profilul...'.",
        options: [],
        answer: "",
        explanation: "Suspense permite streaming — titlul apare imediat, profilul apare cand datele sunt gata.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "import { Suspense } from 'react';\nimport UserProfile from './UserProfile';\n\nexport default function Page() {\n  // TODO: returneaza un div cu h1 'Pagina Utilizator'\n  // si UserProfile inconjurat de Suspense cu fallback adecvat\n}"
      },
      {
        number: 9,
        name: "Cod: Fetch cu tag",
        question: "Scrie un fetch catre '/api/products' care foloseste cache 1 ora si tagul 'products', astfel incat sa poata fi invalidat cu revalidateTag.",
        options: [],
        answer: "",
        explanation: "Tagurile permit invalidare selectiva fara a afecta alte resurse din cache.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "async function getProducts() {\n  // TODO: fa fetch la '/api/products' cu revalidate de 3600 secunde\n  // si tag 'products'\n  // returneaza data.products\n}"
      },
      {
        number: 10,
        name: "Cod: Server Action cu revalidare",
        question: "Scrie un Server Action 'deletePost' care primeste un postId, apeleaza db.post.delete si invalideaza tag-ul 'posts'.",
        options: [],
        answer: "",
        explanation: "Dupa mutatii, revalidam cache-ul pentru a asigura date proaspete in UI.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import { revalidateTag } from 'next/cache';\nimport { db } from '@/lib/db';\n\n// TODO: defineste Server Action deletePost(postId)\n// - marcheaza cu 'use server'\n// - sterge postul din baza de date\n// - invalideaza tag-ul 'posts'"
      },
      {
        number: 11,
        name: "Paralel fetch in RSC",
        question: "Care este cea mai buna metoda de a face doua fetch-uri independente in paralel intr-un RSC pentru a evita waterfall-ul?",
        options: [
          "Sa faci fetch-urile secvential cu await unul dupa altul",
          "Sa folosesti Promise.all() pentru a lansa ambele fetch-uri simultan",
          "Sa muti fetch-urile in useEffect",
          "Sa folosesti SWR sau React Query"
        ],
        answer: "Sa folosesti Promise.all() pentru a lansa ambele fetch-uri simultan",
        explanation: "Promise.all permite executia paralela a ambelor fetch-uri, reducand timpul total la max(t1, t2) in loc de t1 + t2. Exemplu: const [user, posts] = await Promise.all([getUser(), getPosts()]).",
        difficulty: "medium"
      },
      {
        number: 12,
        name: "loading.tsx",
        question: "Ce rol joaca fisierul loading.tsx intr-un route Next.js App Router?",
        options: [
          "Este folosit ca layout pentru pagina de eroare",
          "Inlocuieste automat continutul paginii cu un skeleton/spinner pe durata navigarii",
          "Incarca date inainte de randarea paginii",
          "Defineste metadatele de incarcare ale paginii"
        ],
        answer: "Inlocuieste automat continutul paginii cu un skeleton/spinner pe durata navigarii",
        explanation: "loading.tsx este un Suspense boundary implicit. Next.js il inconjoara automat in jurul paginii curente, afisand continutul sau pe durata navigarilor si fetch-urilor de date.",
        difficulty: "easy"
      },
      {
        number: 13,
        name: "Cod: Paralel fetch",
        question: "Rescrie urmatoarea functie RSC pentru a face fetch-urile in paralel, nu secvential.",
        options: [],
        answer: "",
        explanation: "Promise.all elimina waterfall-ul de date, reducand latenta totala.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "// VERSIUNEA LENTA (secventiala) - rescrie cu Promise.all\nasync function Dashboard() {\n  const user = await getUser();       // 500ms\n  const orders = await getOrders();  // 300ms\n  const stats = await getStats();    // 400ms\n  // Total: ~1200ms\n\n  // TODO: rescrie pentru total ~500ms\n  return <DashboardUI user={user} orders={orders} stats={stats} />;\n}"
      },
      {
        number: 14,
        name: "error.tsx",
        question: "Ce trebuie sa fie error.tsx intr-un route Next.js App Router?",
        options: [
          "Un Server Component care capteaza erorile RSC",
          "Un Client Component ('use client') care captureaza erorile din route-ul curent",
          "Un fisier JSON cu mesaje de eroare",
          "Un middleware care redirectioneaza la /error"
        ],
        answer: "Un Client Component ('use client') care captureaza erorile din route-ul curent",
        explanation: "error.tsx trebuie sa fie un Client Component deoarece React Error Boundaries functioneaza doar pe client. Primeste props error si reset pentru a permite utilizatorilor sa reincerce.",
        difficulty: "medium"
      },
      {
        number: 15,
        name: "Cod: Error Boundary",
        question: "Scrie un error.tsx minim pentru un route Next.js care afiseaza mesajul de eroare si un buton 'Incearca din nou' care apeleaza reset().",
        options: [],
        answer: "",
        explanation: "error.tsx trebuie sa fie Client Component si primeste { error, reset } ca props.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "'use client';\n\n// TODO: defineste componenta Error({ error, reset })\n// - afiseaza error.message\n// - buton 'Incearca din nou' care apeleaza reset()\nexport default function Error({ error, reset }) {\n\n}"
      }
    ]
  },

  {
    slug: "nextjs-image-optimization-avansata",
    title: "Next.js Image Optimization Avansata",
    order: 27,
    theory: [
      {
        order: 1,
        title: "Componenta next/image si avantajele sale",
        content: "Componenta Image din Next.js ofera optimizare automata: conversie WebP/AVIF, lazy loading, preventia layout shift prin rezervarea spatiului, si servirea imaginilor de dimensiunea potrivita pentru fiecare ecran.\n\nExemplu de baza:\n```jsx\nimport Image from 'next/image';\n\nexport default function Avatar() {\n  return (\n    <Image\n      src=\"/avatar.jpg\"\n      alt=\"Avatar utilizator\"\n      width={100}\n      height={100}\n      priority={false}  // true doar pentru imaginile above-the-fold\n    />\n  );\n}\n```\nParametrul `priority` elimina lazy loading si adauga `<link rel=\"preload\">` in HTML. Foloseste-l doar pentru imaginea LCP (Largest Contentful Paint) — de obicei hero image sau imaginea principala de deasupra fold-ului.\n\nInterviu: 'De ce next/image in loc de img tag?' — previne CLS (Cumulative Layout Shift), optimizeaza automat formatele si dimensiunile, lazy load implicit."
      },
      {
        order: 2,
        title: "Imagini Responsive cu sizes",
        content: "Prop-ul `sizes` instruieste browserul cat de mare va fi imaginea la diferite breakpoints, permitandu-i sa descarce varianta optima.\n\nExemplu real pentru un card intr-un grid:\n```jsx\n<Image\n  src=\"/produs.jpg\"\n  alt=\"Produs\"\n  fill  // ocupa tot spatiul parintelui position: relative\n  sizes=\"(max-width: 640px) 100vw,\n         (max-width: 1024px) 50vw,\n         33vw\"\n/>\n```\nFara `sizes`, browserul presupune ca imaginea ocupa 100vw si descarca varianta cea mai mare. Cu `sizes` corect, un utilizator mobil descarca o imagine de 640px in loc de 1920px — diferenta uriasa in performanta.\n\nPentru `fill`, parintele trebuie sa aiba `position: relative` si dimensiuni explicite. Aceasta este solutia ideala pentru imagini de fundal sau carduri cu aspect ratio fix.\n\nTip: foloseste `object-fit: cover` via className pentru a mentine aspect ratio-ul la imagini fill."
      },
      {
        order: 3,
        title: "Art Direction cu multiple surse",
        content: "Art direction inseamna servirea unor imagini complet diferite (nu doar redimensionate) la diferite breakpoints. In Next.js, aceasta se realizeaza cu HTML nativ `<picture>` sau conditional rendering.\n\n```jsx\nexport default function HeroImage() {\n  return (\n    <picture>\n      <source\n        media=\"(max-width: 768px)\"\n        srcSet=\"/hero-mobile.webp\"\n      />\n      <source\n        media=\"(min-width: 769px)\"\n        srcSet=\"/hero-desktop.webp\"\n      />\n      <Image\n        src=\"/hero-desktop.webp\"\n        alt=\"Hero\"\n        width={1920}\n        height={600}\n        priority\n      />\n    </picture>\n  );\n}\n```\nAlternativ cu JavaScript:\n```jsx\nimport { useWindowSize } from '@/hooks/useWindowSize';\n\nfunction AdaptiveHero() {\n  const { width } = useWindowSize();\n  const src = width < 768 ? '/hero-mobile.jpg' : '/hero-desktop.jpg';\n  return <Image src={src} alt=\"Hero\" fill />;\n}\n```\nArt direction este diferit de responsive images: nu modificam dimensiunea aceleiasi imagini, ci servim imagini conceptual diferite (crop diferit, subiect diferit, orientare diferita)."
      },
      {
        order: 4,
        title: "Blur Placeholder si Imagini Externe",
        content: "Next.js suporta placeholder blur pentru a preveni saritura de layout in timp ce imaginea se incarca:\n\n```jsx\nimport Image from 'next/image';\nimport profileImg from '../public/profile.jpg';\n\n// Pentru imagini locale: blurDataURL generat automat\n<Image\n  src={profileImg}\n  alt=\"Profil\"\n  placeholder=\"blur\"\n/>\n\n// Pentru imagini externe: trebuie sa furnizezi blurDataURL\n<Image\n  src=\"https://example.com/photo.jpg\"\n  alt=\"Foto\"\n  width={800}\n  height={600}\n  placeholder=\"blur\"\n  blurDataURL=\"data:image/jpeg;base64,/9j/4AAQ...\"\n/>\n```\nPentru imagini externe ai nevoie de configuratie in next.config.js:\n```js\nmodule.exports = {\n  images: {\n    remotePatterns: [\n      {\n        protocol: 'https',\n        hostname: 'example.com',\n        pathname: '/images/**',\n      },\n    ],\n  },\n};\n```\nTool util: `plaiceholder` — genereaza automat blurDataURL la build time din imagini externe. La interviu: 'Cum previi layout shift pentru imagini?' — width/height explicit sau fill cu container sized, plus placeholder blur."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "Avantajele next/image",
        question: "Care este unul dintre avantajele principale ale componentei next/image fata de tag-ul HTML <img>?",
        options: [
          "Suporta animatii GIF mai bine",
          "Previne Cumulative Layout Shift si optimizeaza automat formatul si dimensiunea imaginii",
          "Permite upload de imagini direct din browser",
          "Incarca toate imaginile inainte ca pagina sa fie vizibila"
        ],
        answer: "Previne Cumulative Layout Shift si optimizeaza automat formatul si dimensiunea imaginii",
        explanation: "next/image rezerva spatiu pentru imagine (previne CLS), converteste automat la WebP/AVIF, aplica lazy loading implicit si serveste dimensiunea optima pentru fiecare dispozitiv.",
        difficulty: "easy"
      },
      {
        number: 2,
        name: "Prop priority",
        question: "Cand ar trebui sa folosesti `priority={true}` pe o componenta Image?",
        options: [
          "Pentru toate imaginile din pagina",
          "Doar pentru imaginea principala above-the-fold (hero image / LCP element)",
          "Pentru imaginile din footer",
          "Cand imaginea este mai mare de 1MB"
        ],
        answer: "Doar pentru imaginea principala above-the-fold (hero image / LCP element)",
        explanation: "priority dezactiveaza lazy loading si adauga preload. Folosit excesiv, degradeaza performanta incarcand toate imaginile simultan. Ideal doar pentru imaginea LCP care influenteaza Core Web Vitals.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "Prop sizes",
        question: "De ce este important prop-ul `sizes` pe componenta Image?",
        options: [
          "Seteaza dimensiunile finale ale imaginii in pixeli",
          "Informeaza browserul despre latimea relativa a imaginii la diferite breakpoints pentru a descarca varianta optima",
          "Comprima imaginea la dimensiunea specificata",
          "Activeaza lazy loading"
        ],
        answer: "Informeaza browserul despre latimea relativa a imaginii la diferite breakpoints pentru a descarca varianta optima",
        explanation: "Fara sizes, browserul presupune 100vw si descarca imaginea cea mai mare. Cu sizes corecte, un utilizator mobil primeste imaginea de 375px in loc de 1920px, economisind bandwidth.",
        difficulty: "medium"
      },
      {
        number: 4,
        name: "fill prop",
        question: "Ce conditie trebuie sa indeplineasca elementul parinte al unei componente Image cu `fill`?",
        options: [
          "Sa aiba display: flex",
          "Sa aiba position: relative si dimensiuni definite",
          "Sa fie un element semantic HTML5",
          "Sa aiba overflow: hidden"
        ],
        answer: "Sa aiba position: relative si dimensiuni definite",
        explanation: "Cand folosesti fill, imaginea se pozitioneaza absolut si umple complet parintele. Parintele trebuie sa aiba position: relative (sau absolute/fixed) si dimensiuni clare (width/height sau aspect-ratio).",
        difficulty: "medium"
      },
      {
        number: 5,
        name: "remotePatterns",
        question: "Ce trebuie sa configurezi in next.config.js pentru a folosi imagini de pe domenii externe?",
        options: [
          "allowExternalImages: true",
          "images.remotePatterns cu hostname-ul permis",
          "images.domains (deprecated) sau images.remotePatterns",
          "Nu este nevoie de configuratie pentru imagini externe"
        ],
        answer: "images.domains (deprecated) sau images.remotePatterns",
        explanation: "Next.js blocheaza implicit imaginile externe pentru securitate. remotePatterns (recomandat) sau domains (deprecated) listeaza hostname-urile de incredere de la care Next.js va optimiza imaginile.",
        difficulty: "medium"
      },
      {
        number: 6,
        name: "Blur placeholder",
        question: "Ce avantaj ofera `placeholder=\"blur\"` pe o componenta Image?",
        options: [
          "Comprima imaginea automat",
          "Afiseaza o versiune blurata low-res in timp ce imaginea reala se incarca, imbunatatind perceptia de viteza",
          "Aplica un filtru CSS blur permanent imaginii",
          "Incarca imaginea in fundal fara sa o afiseze"
        ],
        answer: "Afiseaza o versiune blurata low-res in timp ce imaginea reala se incarca, imbunatatind perceptia de viteza",
        explanation: "placeholder=\"blur\" afiseaza un placeholder mic (generat automat pentru imagini locale sau furnizat ca blurDataURL pentru externe) pana cand imaginea completa este incarcata, prevenind saritura de la spatiu gol la imagine.",
        difficulty: "easy"
      },
      {
        number: 7,
        name: "Art Direction",
        question: "Ce inseamna \"art direction\" in contextul imaginilor responsive?",
        options: [
          "Redimensionarea aceleiasi imagini pentru diferite ecrane",
          "Servirea unor imagini complet diferite (alt crop, alt subiect) la diferite breakpoints",
          "Adaugarea de efecte artistice imaginilor",
          "Compresia automata a imaginilor"
        ],
        answer: "Servirea unor imagini complet diferite (alt crop, alt subiect) la diferite breakpoints",
        explanation: "Art direction merge dincolo de responsive images: pe mobil poti afisa un portret (vertical, subiect centrat), iar pe desktop un peisaj (orizontal, context mai larg). Se implementeaza cu tag-ul HTML picture cu multiple surse.",
        difficulty: "hard"
      },
      {
        number: 8,
        name: "Cod: Image cu fill",
        question: "Scrie o componenta ProductCard care afiseaza o imagine produs folosind fill si sizes corecte pentru un grid de 3 coloane pe desktop si 1 coloana pe mobil.",
        options: [],
        answer: "",
        explanation: "fill cu sizes corecte asigura ca browserul descarca exact dimensiunea necesara pentru fiecare dispozitiv.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "import Image from 'next/image';\n\nexport default function ProductCard({ product }) {\n  return (\n    <div style={{ position: 'relative', height: '200px' }}>\n      {/* TODO: Image cu fill, sizes pentru grid 3 coloane desktop / 1 coloana mobil,\n          src={product.imageUrl}, alt={product.name} */}\n    </div>\n  );\n}"
      },
      {
        number: 9,
        name: "Cod: Hero cu priority",
        question: "Scrie un Hero component cu o imagine full-width care are priority activat, placeholder blur si dimensiunile 1920x600.",
        options: [],
        answer: "",
        explanation: "priority este esential pentru imaginea LCP. Impreuna cu blur placeholder, ofera o experienta vizuala fluida.",
        difficulty: "easy",
        type: "coding",
        language: "javascript",
        starterCode: "import Image from 'next/image';\n\nexport default function Hero() {\n  return (\n    <section style={{ position: 'relative' }}>\n      {/* TODO: Image hero cu priority, placeholder blur,\n          src='/hero.jpg', width=1920, height=600, alt='Hero' */}\n    </section>\n  );\n}"
      },
      {
        number: 10,
        name: "Cod: remotePatterns config",
        question: "Scrie configuratia next.config.js care permite imagini de pe 'images.unsplash.com' (protocol https, orice path).",
        options: [],
        answer: "",
        explanation: "remotePatterns este mai sigur decat domains deoarece permite filtrare granulara pe protocol, hostname si pathname.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  images: {\n    // TODO: adauga remotePatterns pentru images.unsplash.com\n  },\n};\n\nmodule.exports = nextConfig;"
      },
      {
        number: 11,
        name: "WebP/AVIF",
        question: "In ce format serveste Next.js imaginile daca browserul le suporta?",
        options: [
          "PNG comprimat",
          "WebP sau AVIF (format ales automat pe baza header-ului Accept)",
          "JPEG progresiv",
          "SVG optimizat"
        ],
        answer: "WebP sau AVIF (format ales automat pe baza header-ului Accept)",
        explanation: "Next.js citeste header-ul Accept din request si serveste AVIF (daca e suportat, mai mic decat WebP) sau WebP (suport larg) in loc de JPEG/PNG original. Compresia este semnificativ mai buna.",
        difficulty: "medium"
      },
      {
        number: 12,
        name: "Lazy loading",
        question: "Care este comportamentul implicit pentru lazy loading in next/image?",
        options: [
          "Toate imaginile sunt incarcate imediat la incarcarea paginii",
          "Imaginile sunt incarcate lazy (la intrarea in viewport) implicit, cu exceptia celor cu priority=true",
          "Lazy loading trebuie activat manual cu loading=\"lazy\"",
          "Lazy loading nu este suportat in next/image"
        ],
        answer: "Imaginile sunt incarcate lazy (la intrarea in viewport) implicit, cu exceptia celor cu priority=true",
        explanation: "next/image aplica loading=\"lazy\" implicit pe toate imaginile. Singura exceptie este priority={true} care dezactiveaza lazy loading pentru imaginile critice LCP.",
        difficulty: "easy"
      },
      {
        number: 13,
        name: "Cod: blurDataURL extern",
        question: "Scrie o componenta care afiseaza o imagine externa de pe 'cdn.example.com/photo.jpg' cu placeholder blur si un blurDataURL custom.",
        options: [],
        answer: "",
        explanation: "Pentru imagini externe, blurDataURL trebuie furnizat manual. Poate fi generat cu librarii ca plaiceholder sau sharp.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import Image from 'next/image';\n\nconst BLUR_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';\n\nexport default function ExternalPhoto() {\n  // TODO: Image cu src extern, width=800, height=600,\n  // placeholder=\"blur\", blurDataURL=BLUR_DATA, alt=\"Foto extern\"\n}"
      },
      {
        number: 14,
        name: "Optimizare pe demand",
        question: "Cum optimizeaza Next.js imaginile in productie?",
        options: [
          "La build time, toate imaginile sunt procesate",
          "La prima cerere pentru o dimensiune/format, imaginea este optimizata si memorata in cache",
          "Imaginile sunt optimizate in browser cu WebAssembly",
          "Optimizarea se face doar pentru imagini sub 1MB"
        ],
        answer: "La prima cerere pentru o dimensiune/format, imaginea este optimizata si memorata in cache",
        explanation: "Next.js optimizeaza imaginile on-demand: prima cerere pentru o imagine la o anumita dimensiune/format declanseaza procesarea si cache-uirea. Cererile ulterioare identice servesc din cache.",
        difficulty: "hard"
      },
      {
        number: 15,
        name: "Cod: Art Direction cu picture",
        question: "Scrie un component HeroArt care foloseste tag-ul HTML picture pentru a afisa hero-mobile.jpg pe ecrane sub 768px si hero-desktop.jpg pe ecrane mai mari.",
        options: [],
        answer: "",
        explanation: "Tag-ul picture cu source elements permite art direction completa — imagini diferite pentru contexte diferite.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import Image from 'next/image';\n\nexport default function HeroArt() {\n  return (\n    // TODO: element picture cu:\n    // - source media max-width 767px -> hero-mobile.jpg\n    // - source media min-width 768px -> hero-desktop.jpg\n    // - Image fallback hero-desktop.jpg, width=1920, height=600, priority, alt='Hero'\n    <></>\n  );\n}"
      }
    ]
  },

  {
    slug: "nextjs-animatii-framer-motion",
    title: "Animatii cu Framer Motion in Next.js",
    order: 28,
    theory: [
      {
        order: 1,
        title: "Introducere in Framer Motion — motion components si variants",
        content: "Framer Motion este libraria de animatii standard pentru React/Next.js. Conceptul central: orice element HTML are un echivalent `motion.*` care accepta props de animatie.\n\nExemplu de baza:\n```jsx\n'use client';\nimport { motion } from 'framer-motion';\n\nexport default function Card() {\n  return (\n    <motion.div\n      initial={{ opacity: 0, y: 20 }}\n      animate={{ opacity: 1, y: 0 }}\n      transition={{ duration: 0.3 }}\n    >\n      Continut card\n    </motion.div>\n  );\n}\n```\nVariants permit definirea starilor de animatie ca obiecte reutilizabile:\n```jsx\nconst cardVariants = {\n  hidden: { opacity: 0, scale: 0.8 },\n  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },\n};\n\n<motion.div variants={cardVariants} initial=\"hidden\" animate=\"visible\">\n  Card animat\n</motion.div>\n```\nVariants pot fi propagate automat la copii — parintele orchestreaza animatiile copiilor prin `staggerChildren`.\n\nImportant: Framer Motion trebuie folosit in Client Components ('use client')."
      },
      {
        order: 2,
        title: "useAnimation si animatii programatice",
        content: "Hook-ul `useAnimation` permite controlul imperativ al animatiilor — pornire, oprire, secventierea lor din cod:\n\n```jsx\n'use client';\nimport { motion, useAnimation } from 'framer-motion';\nimport { useEffect } from 'react';\n\nexport default function PulsingButton() {\n  const controls = useAnimation();\n\n  async function handleClick() {\n    await controls.start({ scale: 1.2, transition: { duration: 0.1 } });\n    await controls.start({ scale: 1, transition: { duration: 0.1 } });\n  }\n\n  return (\n    <motion.button animate={controls} onClick={handleClick}>\n      Click me\n    </motion.button>\n  );\n}\n```\nSecventierea cu `async/await` permite animatii complexe in lant. `controls.start()` returneaza o Promise care se rezolva cand animatia se termina.\n\nPattern avansat — sincronizarea animatiilor multiple:\n```jsx\nasync function sequence() {\n  await controls1.start('show');\n  await controls2.start('show');\n  controls3.start('show');  // fara await = paralel cu urmatoarele\n}\n```\nInterviu: 'Cand folosesti useAnimation vs declarativ?' — useAnimation pentru animatii conditionate de logica business (succes/eroare, step wizards), declarativ pentru animatii simple de mount/hover."
      },
      {
        order: 3,
        title: "Exit Animations cu AnimatePresence",
        content: "React demonteza componentele imediat, fara a permite animatii de exit. `AnimatePresence` rezolva aceasta problema:\n\n```jsx\n'use client';\nimport { motion, AnimatePresence } from 'framer-motion';\nimport { useState } from 'react';\n\nexport default function Modal({ isOpen, onClose }) {\n  return (\n    <AnimatePresence>\n      {isOpen && (\n        <motion.div\n          key=\"modal\"\n          initial={{ opacity: 0, scale: 0.9 }}\n          animate={{ opacity: 1, scale: 1 }}\n          exit={{ opacity: 0, scale: 0.9 }}\n          transition={{ duration: 0.2 }}\n        >\n          <button onClick={onClose}>Inchide</button>\n        </motion.div>\n      )}\n    </AnimatePresence>\n  );\n}\n```\nReguli AnimatePresence:\n1. Copiii directi trebuie sa aiba prop `key` unic\n2. Componenta cu `exit` prop trebuie sa fie copil direct sau descendent al unui `motion.*`\n3. `mode=\"wait\"` asteapta animatia de exit inainte de a randa urmatorul copil (util pentru page transitions)\n\nPage transitions in Next.js App Router:\n```jsx\n// layout.tsx\n<AnimatePresence mode=\"wait\">\n  <motion.main key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>\n    {children}\n  </motion.main>\n</AnimatePresence>\n```"
      },
      {
        order: 4,
        title: "Animatii Scroll cu useScroll si useTransform",
        content: "Framer Motion ofera hooks puternice pentru animatii bazate pe scroll:\n\n```jsx\n'use client';\nimport { motion, useScroll, useTransform } from 'framer-motion';\n\nexport default function ParallaxHero() {\n  const { scrollY } = useScroll();\n  // Mapeaza scroll 0-500px la translateY 0 -> -150px\n  const y = useTransform(scrollY, [0, 500], [0, -150]);\n  const opacity = useTransform(scrollY, [0, 300], [1, 0]);\n\n  return (\n    <motion.div style={{ y, opacity }}>\n      Continut parallax\n    </motion.div>\n  );\n}\n```\n`useScroll` poate fi legat si de un element specific (nu doar window):\n```jsx\nconst containerRef = useRef(null);\nconst { scrollYProgress } = useScroll({\n  target: containerRef,\n  offset: [\"start end\", \"end start\"]\n});\n```\nPentru animatii declansate cand un element intra in viewport, combini `useInView` cu `useAnimation`:\n```jsx\nconst controls = useAnimation();\nconst ref = useRef(null);\nconst inView = useInView(ref, { once: true });\n\nuseEffect(() => {\n  if (inView) controls.start('visible');\n}, [inView]);\n```\nPerfomanta: Framer Motion animeaza prin CSS transforms si opacity (GPU-accelerated), evitand reflow/repaint costisitor. Evita animarea width, height, top, left direct."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "motion components",
        question: "Cum se creeaza un element div animabil in Framer Motion?",
        options: [
          "import { AnimatedDiv } from 'framer-motion'",
          "Folosind motion.div din libraria framer-motion",
          "Adaugand clasa CSS 'motion' pe div",
          "Folosind useMotion() hook"
        ],
        answer: "Folosind motion.div din libraria framer-motion",
        explanation: "Framer Motion expune versiuni animate pentru toate elementele HTML: motion.div, motion.span, motion.button etc. Acestea accepta props animate, initial, exit, transition si altele.",
        difficulty: "easy"
      },
      {
        number: 2,
        name: "AnimatePresence",
        question: "De ce este necesar AnimatePresence pentru animatii de exit (unmount)?",
        options: [
          "Deoarece React elimina DOM-ul imediat la unmount, fara a permite animatii de iesire",
          "Deoarece Framer Motion nu suporta animatii fara AnimatePresence",
          "Deoarece AnimatePresence imbunatateste performanta",
          "Deoarece este necesar pentru SSR"
        ],
        answer: "Deoarece React elimina DOM-ul imediat la unmount, fara a permite animatii de iesire",
        explanation: "AnimatePresence intarzie unmount-ul componentei pana cand animatia exit s-a terminat. Fara el, componenta dispare instant si animatia exit nu se vede niciodata.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "Variants",
        question: "Ce avantaj principal ofera variants in Framer Motion?",
        options: [
          "Permit animatii 3D",
          "Permit definirea starilor de animatie ca obiecte numite, reutilizabile, cu propagare automata la copii",
          "Reduc dimensiunea bundle-ului",
          "Permit animatii CSS native"
        ],
        answer: "Permit definirea starilor de animatie ca obiecte numite, reutilizabile, cu propagare automata la copii",
        explanation: "Variants organizeaza starile de animatie si permit orchestrarea — parintele poate staggera animatiile copiilor. Propagarea automata inseamna ca setezi initial/animate doar pe parinte, copiii primesc starile prin context.",
        difficulty: "medium"
      },
      {
        number: 4,
        name: "useAnimation",
        question: "Cand este recomandat sa folosesti `useAnimation` in loc de animatii declarative?",
        options: [
          "Intotdeauna, deoarece este mai performant",
          "Cand animatia trebuie controlata programatic (ex: pornita dupa un API call sau bazata pe logica complexa)",
          "Doar pentru animatii de hover",
          "Cand componentele sunt Server Components"
        ],
        answer: "Cand animatia trebuie controlata programatic (ex: pornita dupa un API call sau bazata pe logica complexa)",
        explanation: "useAnimation ofera control imperativ: start, stop, secventiere. Ideal pentru: animatii dupa submit form (success/error), wizards multi-step, animatii sincronizate cu evenimente externe.",
        difficulty: "medium"
      },
      {
        number: 5,
        name: "useScroll",
        question: "Ce returneaza hook-ul `useScroll()` din Framer Motion?",
        options: [
          "Pozitia exacta in pixeli a scroll-ului",
          "scrollY, scrollX (valori in pixeli) si scrollYProgress, scrollXProgress (valori 0-1)",
          "Un boolean care indica daca userul scrolleaza",
          "Viteza de scroll"
        ],
        answer: "scrollY, scrollX (valori in pixeli) si scrollYProgress, scrollXProgress (valori 0-1)",
        explanation: "useScroll returneaza MotionValues: scrollY/scrollX in pixeli si scrollYProgress/scrollXProgress ca procent (0 = sus, 1 = jos). Poti folosi useTransform pentru a mapa aceste valori la proprietati CSS.",
        difficulty: "medium"
      },
      {
        number: 6,
        name: "staggerChildren",
        question: "Ce face `staggerChildren: 0.1` in transition-ul unui parent variant?",
        options: [
          "Intarzie animatia parintelui cu 0.1 secunde",
          "Adauga o intarziere de 0.1 secunde intre animatiile fiecarui copil, creand un efect cascada",
          "Limiteaza animatia la 10% din durata totala",
          "Repeta animatia de 10 ori"
        ],
        answer: "Adauga o intarziere de 0.1 secunde intre animatiile fiecarui copil, creand un efect cascada",
        explanation: "staggerChildren orchestreaza copiii: primul copil animeaza la t=0, al doilea la t=0.1, al treilea la t=0.2 etc. Creaza un efect vizual de 'cascada' elegant, fara a scrie logica de delay manuala.",
        difficulty: "hard"
      },
      {
        number: 7,
        name: "Performance",
        question: "Ce proprietati CSS ar trebui sa animezi cu Framer Motion pentru cea mai buna performanta?",
        options: [
          "width, height, top, left",
          "transform (translateX, translateY, scale, rotate) si opacity",
          "background-color si border",
          "font-size si padding"
        ],
        answer: "transform (translateX, translateY, scale, rotate) si opacity",
        explanation: "Transforms si opacity sunt accelerate GPU si nu declaseaza reflow sau repaint. Animarea width/height/top/left forteaza browser-ul sa recalculeze layout-ul, ceea ce este costisitor si produce janky animations.",
        difficulty: "medium"
      },
      {
        number: 8,
        name: "Cod: Fade-in la mount",
        question: "Scrie un Client Component 'FadeIn' care face fade-in (opacity 0 -> 1, translateY 20px -> 0) in 0.4 secunde la mount.",
        options: [],
        answer: "",
        explanation: "initial defineste starea de start, animate defineste starea finala. transition controleaza durata si easing.",
        difficulty: "easy",
        type: "coding",
        language: "javascript",
        starterCode: "'use client';\nimport { motion } from 'framer-motion';\n\nexport default function FadeIn({ children }) {\n  // TODO: motion.div cu initial opacity 0 y 20,\n  // animate opacity 1 y 0, transition duration 0.4\n  return <>{children}</>;\n}"
      },
      {
        number: 9,
        name: "Cod: Modal cu AnimatePresence",
        question: "Scrie un Modal component care animeaza intrarea (scale 0.9 -> 1, opacity 0 -> 1) si iesirea (scale 1 -> 0.9, opacity 1 -> 0) cu AnimatePresence.",
        options: [],
        answer: "",
        explanation: "exit prop defineste starea de animatie la unmount. Fara AnimatePresence, exit este ignorat.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "'use client';\nimport { motion, AnimatePresence } from 'framer-motion';\n\nexport default function Modal({ isOpen, children, onClose }) {\n  // TODO: AnimatePresence cu motion.div conditionat de isOpen\n  // initial: opacity 0, scale 0.9\n  // animate: opacity 1, scale 1\n  // exit: opacity 0, scale 0.9\n  // transition duration 0.2\n  return null;\n}"
      },
      {
        number: 10,
        name: "Cod: Stagger list",
        question: "Scrie un component ListAnimata care randeaza o lista de iteme cu animatie stagger — fiecare item apare cu 0.08 secunde intarziere fata de cel anterior.",
        options: [],
        answer: "",
        explanation: "staggerChildren pe parent variant orchestreaza automat intarzierile fara cod manual pentru fiecare item.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "'use client';\nimport { motion } from 'framer-motion';\n\nconst containerVariants = {\n  hidden: {},\n  visible: {\n    transition: {\n      // TODO: adauga staggerChildren: 0.08\n    }\n  }\n};\n\nconst itemVariants = {\n  // TODO: defineste hidden (opacity 0, x -20) si visible (opacity 1, x 0)\n};\n\nexport default function ListAnimata({ items }) {\n  return (\n    <motion.ul variants={containerVariants} initial=\"hidden\" animate=\"visible\">\n      {items.map((item) => (\n        <motion.li key={item.id} variants={itemVariants}>\n          {item.text}\n        </motion.li>\n      ))}\n    </motion.ul>\n  );\n}"
      },
      {
        number: 11,
        name: "Cod: Parallax scroll",
        question: "Scrie un component ParallaxSection care translata un element cu -150px pe axa Y cand userul scrolleaza 500px (efect parallax).",
        options: [],
        answer: "",
        explanation: "useTransform mapeaza o MotionValue la alta — scroll 0-500px devine translateY 0 la -150px.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "'use client';\nimport { motion, useScroll, useTransform } from 'framer-motion';\n\nexport default function ParallaxSection({ children }) {\n  const { scrollY } = useScroll();\n  // TODO: useTransform scrollY [0, 500] -> y [0, -150]\n  // motion.div cu style={{ y }}\n  return <>{children}</>;\n}"
      },
      {
        number: 12,
        name: "Cod: useAnimation cu secventiere",
        question: "Scrie un buton care la click animeaza scale 1 -> 1.2, apoi inapoi la 1, in secventa cu useAnimation.",
        options: [],
        answer: "",
        explanation: "useAnimation cu async/await permite secventierea animatiilor — prima se termina inainte de a incepe urmatoarea.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "'use client';\nimport { motion, useAnimation } from 'framer-motion';\n\nexport default function PulseButton({ children }) {\n  const controls = useAnimation();\n\n  async function handleClick() {\n    // TODO: await controls.start scale 1.2 duration 0.15\n    // TODO: await controls.start scale 1 duration 0.15\n  }\n\n  return (\n    <motion.button animate={controls} onClick={handleClick}>\n      {children}\n    </motion.button>\n  );\n}"
      },
      {
        number: 13,
        name: "AnimatePresence mode",
        question: "Ce face `mode=\"wait\"` pe componenta AnimatePresence?",
        options: [
          "Asteapta 1 secunda inainte de fiecare animatie",
          "Asteapta ca animatia exit sa se termine complet inainte de a randa noul copil (util pentru page transitions)",
          "Dezactiveaza animatia de enter",
          "Ruleaza animatiile secvential in ordine"
        ],
        answer: "Asteapta ca animatia exit sa se termine complet inainte de a randa noul copil (util pentru page transitions)",
        explanation: "mode=\"wait\" este esential pentru page transitions: pagina veche isi termina animatia de exit, apoi pagina noua incepe animatia de enter. Fara mode=\"wait\", ambele ruleaza simultan.",
        difficulty: "hard"
      },
      {
        number: 14,
        name: "whileHover si whileTap",
        question: "Care este modul declarativ de a adauga animatii de hover si tap (click) pe un element in Framer Motion?",
        options: [
          "onMouseEnter si onMouseLeave cu useState",
          "whileHover si whileTap props pe motion components",
          "CSS :hover cu transform",
          "useHover() hook"
        ],
        answer: "whileHover si whileTap props pe motion components",
        explanation: "whileHover si whileTap definesc starea de animatie pe durata hover-ului/tap-ului. Framer Motion se ocupa automat de tranzitie si resetare. Exemplu: whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}.",
        difficulty: "easy"
      },
      {
        number: 15,
        name: "Framer Motion in Next.js App Router",
        question: "De ce trebuie Framer Motion folosit in Client Components in Next.js App Router?",
        options: [
          "Deoarece Framer Motion nu este compatibil cu React",
          "Deoarece animatiile necesita JavaScript pe client, hooks (useState, useEffect) si API-uri de browser (requestAnimationFrame)",
          "Deoarece este prea mare pentru Server Components",
          "Deoarece nu poate fi importat in Server Components"
        ],
        answer: "Deoarece animatiile necesita JavaScript pe client, hooks (useState, useEffect) si API-uri de browser (requestAnimationFrame)",
        explanation: "Server Components ruleaza pe server si nu au acces la browser sau la React hooks. Framer Motion depinde de hooks si requestAnimationFrame. Adauga 'use client' la inceputul oricarui fisier care importa framer-motion.",
        difficulty: "medium"
      }
    ]
  },

  {
    slug: "nextjs-seo-complet",
    title: "Next.js SEO Complet",
    order: 29,
    theory: [
      {
        order: 1,
        title: "Metadata API in Next.js App Router",
        content: "Next.js App Router ofera Metadata API pentru definirea metadatelor SEO direct din fisierele de ruta:\n\n```tsx\n// app/page.tsx — metadata statica\nexport const metadata = {\n  title: 'Pagina principala | Site meu',\n  description: 'Descriere pagina pentru motoare de cautare',\n  keywords: ['next.js', 'react', 'web development'],\n};\n\n// app/blog/[slug]/page.tsx — metadata dinamica\nexport async function generateMetadata({ params }) {\n  const post = await getPost(params.slug);\n  return {\n    title: `${post.title} | Blog`,\n    description: post.excerpt,\n    openGraph: {\n      title: post.title,\n      description: post.excerpt,\n      images: [{ url: post.coverImage }],\n    },\n  };\n}\n```\nHierarhia metadata: metadatele din layout-uri sunt mostenite si suprascrise de metadatele paginilor copii. `title.template` permite un pattern global: `{ template: '%s | Site meu', default: 'Site meu' }`.\n\nInterviu: 'Cum diferentiezi metadata statica de dinamica in App Router?' — statica: obiect exportat const, dinamica: functie async generateMetadata care primeste params si searchParams."
      },
      {
        order: 2,
        title: "OpenGraph si Twitter Cards",
        content: "OpenGraph controleaza cum apar link-urile la distribuire pe retele sociale. Twitter/X foloseste propriul sistem Twitter Cards, desi multi provideri citesc si OG tags:\n\n```tsx\nexport const metadata = {\n  openGraph: {\n    title: 'Titlul articolului',\n    description: 'Descriere scurta pentru social media',\n    url: 'https://site.com/articol',\n    siteName: 'Site meu',\n    images: [\n      {\n        url: 'https://site.com/og-image.jpg',\n        width: 1200,\n        height: 630,\n        alt: 'Descriere imagine',\n      },\n    ],\n    locale: 'ro_RO',\n    type: 'article',\n  },\n  twitter: {\n    card: 'summary_large_image',\n    title: 'Titlul articolului',\n    description: 'Descriere pentru Twitter',\n    images: ['https://site.com/og-image.jpg'],\n  },\n};\n```\nDimensiunea recomandata pentru OG image: 1200x630 pixels. Next.js 13+ permite generarea dinamica de OG images cu ImageResponse din next/og:\n```tsx\n// app/og/route.tsx\nimport { ImageResponse } from 'next/og';\n\nexport function GET(request) {\n  return new ImageResponse(\n    <div style={{ display: 'flex', fontSize: 60 }}>\n      Titlu dinamic\n    </div>,\n    { width: 1200, height: 630 }\n  );\n}\n```"
      },
      {
        order: 3,
        title: "Sitemap.xml, Robots.txt si Structured Data",
        content: "Next.js App Router suporta generarea de sitemap si robots.txt prin fisiere speciale:\n\n```tsx\n// app/sitemap.ts\nimport { MetadataRoute } from 'next';\n\nexport default async function sitemap(): Promise<MetadataRoute.Sitemap> {\n  const posts = await getPosts();\n  const postUrls = posts.map((post) => ({\n    url: `https://site.com/blog/${post.slug}`,\n    lastModified: post.updatedAt,\n    changeFrequency: 'weekly' as const,\n    priority: 0.8,\n  }));\n\n  return [\n    { url: 'https://site.com', lastModified: new Date(), priority: 1 },\n    { url: 'https://site.com/blog', lastModified: new Date(), priority: 0.9 },\n    ...postUrls,\n  ];\n}\n\n// app/robots.ts\nexport default function robots() {\n  return {\n    rules: { userAgent: '*', allow: '/', disallow: '/api/' },\n    sitemap: 'https://site.com/sitemap.xml',\n  };\n}\n```\nStructured Data (Schema.org) se adauga ca JSON-LD:\n```tsx\nexport default function BlogPost({ post }) {\n  const jsonLd = {\n    '@context': 'https://schema.org',\n    '@type': 'Article',\n    headline: post.title,\n    author: { '@type': 'Person', name: post.author },\n    datePublished: post.publishedAt,\n  };\n  return (\n    <>\n      <script type=\"application/ld+json\">\n        {JSON.stringify(jsonLd)}\n      </script>\n    </>\n  );\n}\n```"
      },
      {
        order: 4,
        title: "Core Web Vitals si SEO Tehnic",
        content: "Google foloseste Core Web Vitals ca factor de ranking. Cele trei metrici principale:\n\n1. LCP (Largest Contentful Paint) < 2.5s — cat de repede apare continutul principal. Optimizari: priority pe hero image, preconnect pentru fonturi, eliminarea render-blocking resources.\n\n2. INP (Interaction to Next Paint) < 200ms — cat de repede raspunde pagina la interactiuni. Optimizari: code splitting, evitarea Long Tasks, debouncing event handlers.\n\n3. CLS (Cumulative Layout Shift) < 0.1 — cat de stabil este layout-ul. Optimizari: dimensiuni explicite pentru imagini/video, rezervarea spatiului pentru ads/embeds.\n\nOptimizari Next.js specifice:\n```jsx\n// Preconnect la domenii externe critice\nimport { Metadata } from 'next';\nexport const metadata: Metadata = {\n  other: { 'link': '<https://fonts.gstatic.com>; rel=preconnect' }\n};\n\n// Fonturi optimizate (automat self-hosted)\nimport { Inter } from 'next/font/google';\nconst inter = Inter({ subsets: ['latin'], display: 'swap' });\n```\nNext.js optimizeaza automat fonturile Google prin self-hosting la build time, eliminand round-trip-ul la Google Fonts.\n\nInterviu: 'Ce este CLS si cum il previi in Next.js?' — layout shift cauzat de imagini fara dimensiuni, continut incarcat dinamic. Previi cu: width/height pe Image, skeleton screens, rezervarea spatiului."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "Metadata API",
        question: "Cum definesti metadata dinamica (bazata pe parametrii rutei) in Next.js App Router?",
        options: [
          "Exportand un obiect const metadata",
          "Exportand o functie async generateMetadata({ params })",
          "Folosind hook-ul useMetadata()",
          "Adaugand meta tags manual in JSX"
        ],
        answer: "Exportand o functie async generateMetadata({ params })",
        explanation: "generateMetadata primeste { params, searchParams } si returneaza un obiect Metadata. Poate face fetch asincron pentru a obtine datele necesare (ex: titlul unui post din baza de date).",
        difficulty: "medium"
      },
      {
        number: 2,
        name: "title.template",
        question: "Ce face `title: { template: '%s | Site meu', default: 'Site meu' }` in layout.tsx?",
        options: [
          "Seteaza un titlu fix pentru toate paginile",
          "Defineste un template de titlu: paginile copii pot seta %s, iar default este titlul cand nu exista titlu specific",
          "Adauga site name la toate URL-urile",
          "Genereaza titluri automat din URL"
        ],
        answer: "Defineste un template de titlu: paginile copii pot seta %s, iar default este titlul cand nu exista titlu specific",
        explanation: "template permite un pattern consistent: daca o pagina exporta title: 'Blog', titlul final va fi 'Blog | Site meu'. default este folosit cand pagina nu defineste titlu propriu.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "OG Image dimensions",
        question: "Care sunt dimensiunile recomandate pentru o imagine OpenGraph?",
        options: [
          "800x600 pixels",
          "1200x630 pixels",
          "1920x1080 pixels",
          "512x512 pixels"
        ],
        answer: "1200x630 pixels",
        explanation: "1200x630 (aspect ratio ~1.91:1) este standardul pentru OpenGraph. Aceasta dimensiune asigura afisarea corecta pe Facebook, LinkedIn, Twitter si alti provideri fara taiere sau distorsionare.",
        difficulty: "easy"
      },
      {
        number: 4,
        name: "sitemap.ts",
        question: "Unde se plaseaza fisierul sitemap.ts in Next.js App Router pentru a genera automat /sitemap.xml?",
        options: [
          "In radacina proiectului",
          "In directorul app/ (app/sitemap.ts)",
          "In directorul public/",
          "In directorul pages/"
        ],
        answer: "In directorul app/ (app/sitemap.ts)",
        explanation: "app/sitemap.ts este un fisier special Next.js care genereaza automat ruta /sitemap.xml. Returneaza un array de obiecte cu url, lastModified, changeFrequency si priority.",
        difficulty: "easy"
      },
      {
        number: 5,
        name: "JSON-LD",
        question: "Cum se adauga Structured Data (Schema.org) intr-o pagina Next.js?",
        options: [
          "Prin prop-ul structuredData pe componenta Head",
          "Printr-un tag script cu type=\"application/ld+json\" continand JSON-ul Schema.org",
          "Prin metadatele Metadata API",
          "Nu este posibil in Next.js"
        ],
        answer: "Printr-un tag script cu type=\"application/ld+json\" continand JSON-ul Schema.org",
        explanation: "JSON-LD este formatul preferat Google pentru structured data. Se include ca script cu type application/ld+json in JSX-ul componentei, de obicei inline in pagina care contine datele respective.",
        difficulty: "medium"
      },
      {
        number: 6,
        name: "LCP optimization",
        question: "Care dintre urmatoarele NU imbunatateste LCP (Largest Contentful Paint)?",
        options: [
          "Adaugand priority pe hero image",
          "Preconnect la serverul de fonturi",
          "Adaugand animatii Framer Motion pe hero",
          "Self-hosting fonturilor Google"
        ],
        answer: "Adaugand animatii Framer Motion pe hero",
        explanation: "Animatiile pot intarzia afisarea elementului LCP daca il randeaza cu opacity 0 initial. Celelalte optiuni reduc latenta de incarcare: priority incarca imaginea mai devreme, preconnect elimina DNS lookup, self-hosting elimina round-trip la Google Fonts.",
        difficulty: "hard"
      },
      {
        number: 7,
        name: "CLS",
        question: "Ce cauzeaza Cumulative Layout Shift (CLS) si cum il previi?",
        options: [
          "JavaScript lent — prevenit prin code splitting",
          "Imagini/video fara dimensiuni definite, continut incarcat dinamic — prevenit prin width/height explicit si rezervarea spatiului",
          "Fonturi mari — prevenit prin compresie",
          "Prea multi utilizatori — prevenit prin CDN"
        ],
        answer: "Imagini/video fara dimensiuni definite, continut incarcat dinamic — prevenit prin width/height explicit si rezervarea spatiului",
        explanation: "CLS masoara cat se misca layout-ul pe durata incarcarii. Cauze principale: imagini fara dimensiuni (browserul nu stie cat spatiu sa rezerve), ads care se insereaza, fonturi care cauzeaza FOIT. next/image previne CLS automat.",
        difficulty: "medium"
      },
      {
        number: 8,
        name: "Cod: Metadata statica",
        question: "Scrie metadatele pentru pagina /about cu title 'Despre noi', description de 150 caractere si openGraph cu imaginea '/og-about.jpg'.",
        options: [],
        answer: "",
        explanation: "Metadata API permite definirea completa a metadatelor SEO si social media direct din fisierul paginii.",
        difficulty: "easy",
        type: "coding",
        language: "javascript",
        starterCode: "// app/about/page.tsx\n// TODO: exporta metadata cu:\n// - title: 'Despre noi | Site meu'\n// - description: text de ~150 caractere\n// - openGraph: { title, description, images cu /og-about.jpg 1200x630 }\n\nexport default function AboutPage() {\n  return <main><h1>Despre noi</h1></main>;\n}"
      },
      {
        number: 9,
        name: "Cod: generateMetadata dinamic",
        question: "Scrie generateMetadata pentru ruta /blog/[slug] care face fetch la un post si returneaza title, description si openGraph cu imaginea postului.",
        options: [],
        answer: "",
        explanation: "generateMetadata poate face fetch asincron, la fel ca componenta paginii. Next.js deduplicateaza fetch-urile identice.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "// app/blog/[slug]/page.tsx\nimport { getPostBySlug } from '@/lib/blog';\n\n// TODO: exporta async generateMetadata({ params })\n// - obtine postul cu getPostBySlug(params.slug)\n// - returneaza title, description, openGraph cu imaginea postului\n\nexport default async function BlogPost({ params }) {\n  const post = await getPostBySlug(params.slug);\n  return <article>{post.content}</article>;\n}"
      },
      {
        number: 10,
        name: "Cod: sitemap.ts",
        question: "Scrie fisierul app/sitemap.ts care include pagina principala (priority 1) si toate blogurile obtinute din getAllPosts() (priority 0.8, changeFrequency weekly).",
        options: [],
        answer: "",
        explanation: "sitemap.ts genereaza automat /sitemap.xml. Includem toate paginile publice cu prioritati relevante.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "import { getAllPosts } from '@/lib/blog';\n\nconst BASE_URL = 'https://site.com';\n\nexport default async function sitemap() {\n  // TODO: obtine toate posturile\n  // TODO: returneaza array cu pagina principala + toate posturile\n  // fiecare post: url, lastModified: post.updatedAt, changeFrequency, priority\n}"
      },
      {
        number: 11,
        name: "Cod: JSON-LD Article",
        question: "Adauga Structured Data de tip Article Schema.org intr-o pagina de blog cu headline, author name si datePublished.",
        options: [],
        answer: "",
        explanation: "JSON-LD in script tag este formatul preferat Google. Nu necesita librarii externe — JSON pur inline.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "export default function BlogArticle({ post }) {\n  // TODO: creeaza obiect jsonLd cu:\n  // @context: https://schema.org\n  // @type: Article\n  // headline: post.title\n  // author: { @type: Person, name: post.authorName }\n  // datePublished: post.publishedAt\n\n  return (\n    <article>\n      {/* TODO: script tag type application/ld+json cu JSON.stringify(jsonLd) */}\n      <h1>{post.title}</h1>\n    </article>\n  );\n}"
      },
      {
        number: 12,
        name: "robots.ts",
        question: "Ce este fisierul app/robots.ts in Next.js?",
        options: [
          "Un fisier de configurare pentru boti de testare automata",
          "Un fisier special care genereaza automat /robots.txt pentru controlul indexarii de catre crawlere",
          "Un middleware care blocheaza botii spam",
          "Un script pentru automatizarea task-urilor"
        ],
        answer: "Un fisier special care genereaza automat /robots.txt pentru controlul indexarii de catre crawlere",
        explanation: "app/robots.ts exporta o functie default care returneaza un obiect cu rules (allow/disallow per userAgent) si sitemap URL. Next.js il serveste la /robots.txt automat.",
        difficulty: "easy"
      },
      {
        number: 13,
        name: "next/font optimizare",
        question: "Cum optimizeaza Next.js fonturile Google din next/font/google?",
        options: [
          "Le incarca de pe CDN-ul Google la runtime",
          "Le descarca si self-hosteaza la build time, eliminand round-trip-ul extern si protejand privacy",
          "Le converteste in SVG pentru rendering mai rapid",
          "Le comprima cu GZIP"
        ],
        answer: "Le descarca si self-hosteaza la build time, eliminand round-trip-ul extern si protejand privacy",
        explanation: "next/font descarca fonturile la build time si le serveste de pe acelasi domeniu. Avantaje: elimina DNS lookup extern, elimina FOIT (Flash of Invisible Text) cu font-display: swap, protejare GDPR (nu trimite date la Google).",
        difficulty: "medium"
      },
      {
        number: 14,
        name: "Cod: ImageResponse OG",
        question: "Scrie un route handler app/og/route.tsx care genereaza o imagine OG 1200x630 cu un titlu dinamic din query parameter 'title'.",
        options: [],
        answer: "",
        explanation: "ImageResponse genereaza imagini PNG din JSX folosind edge runtime. Ideal pentru OG images dinamice fara dependenta de Sharp.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import { ImageResponse } from 'next/og';\n\nexport const runtime = 'edge';\n\nexport function GET(request) {\n  const { searchParams } = new URL(request.url);\n  const title = searchParams.get('title') ?? 'Default Title';\n\n  // TODO: returneaza ImageResponse 1200x630\n  // cu un div care afiseaza titlul in font mare, fundal negru, text alb\n}"
      },
      {
        number: 15,
        name: "Twitter Card type",
        question: "Ce tip de Twitter Card afiseaza o imagine mare deasupra textului, recomandat pentru articole cu imagini de cover?",
        options: [
          "summary",
          "summary_large_image",
          "app",
          "player"
        ],
        answer: "summary_large_image",
        explanation: "summary_large_image afiseaza o imagine 2:1 deasupra titlului si descrierii — ideal pentru bloguri si articole. summary afiseaza o imagine mica (1:1) in stanga. app si player sunt pentru aplicatii mobile si media.",
        difficulty: "easy"
      }
    ]
  },

  {
    slug: "nextjs-mini-proiect-blog",
    title: "Mini Proiect FE — Blog cu Next.js",
    order: 30,
    theory: [
      {
        order: 1,
        title: "MDX in Next.js — continut bogat pentru blog",
        content: "MDX (Markdown + JSX) permite scrierea de continut cu componente React incluse. In Next.js poti folosi `@next/mdx` sau libraria `contentlayer`/`next-mdx-remote` pentru procesarea MDX.\n\nSetup cu @next/mdx:\n```js\n// next.config.js\nconst withMDX = require('@next/mdx')({\n  extension: /\\.mdx?$/,\n  options: { remarkPlugins: [], rehypePlugins: [] },\n});\n\nmodule.exports = withMDX({\n  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],\n});\n```\nPentru continut MDX extern (din CMS sau fisiere separate de pagini):\n```tsx\nimport { MDXRemote } from 'next-mdx-remote/rsc';\nimport { components } from '@/components/mdx-components';\n\nexport default async function BlogPost({ params }) {\n  const source = await getPostContent(params.slug);\n  return <MDXRemote source={source} components={components} />;\n}\n```\ncustomComponents permite suprascrierea elementelor markdown cu componente React custom (ex: Code cu syntax highlighting, Image cu next/image).\n\nInterviu: 'MDX vs CMS headless?' — MDX: continut in repository, type-safe, ideal pentru documentatie si bloguri tehnice. CMS: continut gestionat de non-dev, editare vizuala, ideal pentru marketing sites."
      },
      {
        order: 2,
        title: "ISR (Incremental Static Regeneration) pentru blog",
        content: "ISR combina avantajele SSG (performanta) cu actualitatea SSR. Paginile se genereaza static, dar se regenereaza in background:\n\n```tsx\n// app/blog/[slug]/page.tsx\nexport const revalidate = 3600; // regenereaza la fiecare ora\n\n// SAU revalidare on-demand\nexport const revalidate = false; // niciodata automat\n\n// generateStaticParams pre-genereaza cele mai populare pagini la build\nexport async function generateStaticParams() {\n  const posts = await getAllPosts();\n  return posts.map((post) => ({ slug: post.slug }));\n}\n```\nCu `dynamicParams = true` (default), paginile care nu au fost pre-generate sunt randate SSR la prima cerere si cache-uite ca pagini statice:\n```tsx\nexport const dynamicParams = true; // default: SSR + cache la prima cerere\nexport const dynamicParams = false; // 404 pentru sluguri necunoscute\n```\nStrategia recomandata pentru blog:\n1. `generateStaticParams` pentru ultimele 50 de posturi (cele mai accesate)\n2. `revalidate = 3600` pentru regenerare periodica\n3. `revalidatePath('/blog/[slug]')` in CMS webhook pentru invalidare imediata la publicare\n\nInterviu: 'Diferenta ISR vs SSR?' — ISR serveste din cache (rapid) si regenereaza in background, SSR genereaza la fiecare request (lent, dar mereu proaspat)."
      },
      {
        order: 3,
        title: "Dark Mode in Next.js cu next-themes",
        content: "Implementarea dark mode fara flash of incorrect theme (FOIT) necesita atentie:\n\n```bash\nnpm install next-themes\n```\n\n```tsx\n// app/providers.tsx\n'use client';\nimport { ThemeProvider } from 'next-themes';\n\nexport function Providers({ children }) {\n  return (\n    <ThemeProvider attribute=\"class\" defaultTheme=\"system\" enableSystem>\n      {children}\n    </ThemeProvider>\n  );\n}\n\n// app/layout.tsx\n<html lang=\"ro\" suppressHydrationWarning>\n  <body>\n    <Providers>{children}</Providers>\n  </body>\n</html>\n```\n`suppressHydrationWarning` pe `<html>` previne erori de hidratare — tema este determinata client-side, deci atributul class difera intre SSR si client.\n\nButon toggle:\n```tsx\n'use client';\nimport { useTheme } from 'next-themes';\n\nexport function ThemeToggle() {\n  const { theme, setTheme } = useTheme();\n  return (\n    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>\n      {theme === 'dark' ? 'Luminos' : 'Intunecat'}\n    </button>\n  );\n}\n```\nIn Tailwind CSS: adauga `darkMode: 'class'` in tailwind.config.js si foloseste prefixul `dark:` pentru stiluri dark mode."
      },
      {
        order: 4,
        title: "Cautare Full-Text in Blog cu Fuse.js",
        content: "Pentru bloguri statice, cautarea client-side cu Fuse.js este simpla si eficienta:\n\n```tsx\n'use client';\nimport Fuse from 'fuse.js';\nimport { useState, useMemo } from 'react';\n\nconst fuseOptions = {\n  keys: ['title', 'excerpt', 'tags'],\n  threshold: 0.3,  // 0 = exact match, 1 = match orice\n  includeScore: true,\n};\n\nexport function BlogSearch({ posts }) {\n  const [query, setQuery] = useState('');\n  const fuse = useMemo(() => new Fuse(posts, fuseOptions), [posts]);\n\n  const results = query\n    ? fuse.search(query).map((r) => r.item)\n    : posts;\n\n  return (\n    <div>\n      <input\n        type=\"search\"\n        value={query}\n        onChange={(e) => setQuery(e.target.value)}\n        placeholder=\"Cauta articole...\"\n      />\n      <PostsList posts={results} />\n    </div>\n  );\n}\n```\nPentru bloguri mari, alternativa server-side: search params in URL + filtrare in RSC:\n```tsx\n// app/blog/page.tsx\nexport default async function BlogPage({ searchParams }) {\n  const query = searchParams.q ?? '';\n  const posts = await searchPosts(query); // filtrare in DB\n  return <BlogList posts={posts} />;\n}\n```\nAceasta abordare este indexabila de motoarele de cautare si permite partajarea URL-urilor cu rezultate de cautare."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "MDX vs Markdown",
        question: "Ce poate face MDX in plus fata de Markdown standard?",
        options: [
          "Formateaza textul cu bold si italic",
          "Permite includerea componentelor React direct in continut",
          "Suporta tabele si liste",
          "Permite linkuri si imagini"
        ],
        answer: "Permite includerea componentelor React direct in continut",
        explanation: "MDX = Markdown + JSX. Poti importa si folosi componente React in fisierele .mdx. Ideal pentru documentatie tehnica cu exemple interactive, grafice, formulare etc. direct in continut.",
        difficulty: "easy"
      },
      {
        number: 2,
        name: "ISR revalidate",
        question: "Ce face `export const revalidate = 3600` intr-o pagina Next.js?",
        options: [
          "Regenereaza pagina la fiecare 3600 de request-uri",
          "Pagina este re-generata in background la cel mult o data la 3600 de secunde",
          "Pagina expira dupa 3600 de secunde si returneaza 404",
          "Setul de date se actualizeaza la fiecare 3600 de secunde in timp real"
        ],
        answer: "Pagina este re-generata in background la cel mult o data la 3600 de secunde",
        explanation: "ISR (Incremental Static Regeneration): pagina este servita din cache (rapid) si regenerata in background dupa expirarea intervalului de revalidare. Utilizatorul care declanseaza regenerarea primeste pagina veche, urmatorul primeste cea noua.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "generateStaticParams",
        question: "La ce serveste `generateStaticParams` intr-un route dinamic?",
        options: [
          "Valideaza parametrii rutei",
          "Pre-genereaza la build time paginile pentru parametrii returnati, creand pagini statice",
          "Genereaza URL-uri random pentru testare",
          "Seteaza parametrii default pentru ruta"
        ],
        answer: "Pre-genereaza la build time paginile pentru parametrii returnati, creand pagini statice",
        explanation: "generateStaticParams returneaza array de obiecte cu valorile parametrilor. Next.js genereaza static o pagina pentru fiecare combinatie la build time — similar cu getStaticPaths din Pages Router.",
        difficulty: "medium"
      },
      {
        number: 4,
        name: "next-themes si FOIT",
        question: "De ce adaugi `suppressHydrationWarning` pe tag-ul `<html>` cand folosesti next-themes?",
        options: [
          "Pentru a dezactiva hydration complet",
          "Deoarece tema este determinata client-side, atributul 'class' de pe html difera intre SSR si client, cauzand avertismente de hidratare",
          "Pentru a imbunatati performanta",
          "Este obligatoriu pentru toate layout-urile Next.js"
        ],
        answer: "Deoarece tema este determinata client-side, atributul 'class' de pe html difera intre SSR si client, cauzand avertismente de hidratare",
        explanation: "Server-ul nu stie ce tema prefera utilizatorul. Tema este setata client-side dupa citirea localStorage/preferintelor sistem. Diferenta de class intre SSR si client declanseaza avertisment React — suppressHydrationWarning il suprima.",
        difficulty: "hard"
      },
      {
        number: 5,
        name: "Fuse.js threshold",
        question: "Ce inseamna `threshold: 0.3` in configuratia Fuse.js?",
        options: [
          "Returneaza maxim 3 rezultate",
          "Matching-ul este permis cu pana la 30% erori/diferente fata de query (0 = exact, 1 = orice)",
          "Cautarea dureaza maxim 300ms",
          "Minim 3 caractere pentru a declansa cautarea"
        ],
        answer: "Matching-ul este permis cu pana la 30% erori/diferente fata de query (0 = exact, 1 = orice)",
        explanation: "threshold in Fuse.js controleaza toleranta la erori de scriere (fuzzy matching). 0 = doar match exact, 0.3 = permite diferente mici (typos), 1 = matcheaza aproape orice. 0.3 este un echilibru bun intre precizie si flexibilitate.",
        difficulty: "medium"
      },
      {
        number: 6,
        name: "dynamicParams",
        question: "Ce se intampla cu un slug necunoscut (negasit in generateStaticParams) cand `dynamicParams = false`?",
        options: [
          "Pagina se genereaza SSR la prima cerere",
          "Se returneaza o eroare 500",
          "Se returneaza un raspuns 404",
          "Se redirectioneaza la /blog"
        ],
        answer: "Se returneaza un raspuns 404",
        explanation: "Cu dynamicParams = false, orice parametru care nu a fost pre-generat in generateStaticParams va returna 404. Valoarea default este true (pagina se genereaza SSR si se cache-uieste).",
        difficulty: "medium"
      },
      {
        number: 7,
        name: "MDXRemote RSC",
        question: "De ce se foloseste `next-mdx-remote/rsc` in loc de `next-mdx-remote` in Next.js App Router?",
        options: [
          "Versiunea /rsc este mai noua si mai rapida",
          "Versiunea /rsc suporta Server Components — MDX este procesat pe server fara JavaScript client suplimentar",
          "Versiunea /rsc suporta mai multe formate",
          "Nu exista diferenta functionala"
        ],
        answer: "Versiunea /rsc suporta Server Components — MDX este procesat pe server fara JavaScript client suplimentar",
        explanation: "next-mdx-remote/rsc permite procesarea MDX in RSC-uri, reducand JavaScript-ul trimis catre client. Versiunea clasica necesita hidratare client-side. In App Router, preferati intotdeauna varianta /rsc.",
        difficulty: "hard"
      },
      {
        number: 8,
        name: "Cod: Blog page cu ISR",
        question: "Scrie o pagina RSC pentru /blog/[slug] cu ISR (revalidare la 1 ora), generateStaticParams care pre-genereaza primele 20 de posturi si randarea postului.",
        options: [],
        answer: "",
        explanation: "ISR cu generateStaticParams combina performanta paginilor statice cu actualitatea datelor prin regenerare periodica.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import { getAllPosts, getPostBySlug } from '@/lib/blog';\n\n// TODO: export revalidate = 3600\n// TODO: export async generateStaticParams() - primele 20 posturi\n// TODO: export const dynamicParams = true\n\nexport default async function BlogPost({ params }) {\n  const post = await getPostBySlug(params.slug);\n  // TODO: randeaza postul\n  return null;\n}"
      },
      {
        number: 9,
        name: "Cod: ThemeProvider setup",
        question: "Scrie fisierul app/providers.tsx cu ThemeProvider din next-themes configurat pentru class-based dark mode cu tema sistem ca default.",
        options: [],
        answer: "",
        explanation: "attribute=\"class\" permite stilizarea cu Tailwind dark: prefix. enableSystem respecta preferinta OS a utilizatorului.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "'use client';\nimport { ThemeProvider } from 'next-themes';\n\n// TODO: export Providers({ children }) care inconjoara children\n// cu ThemeProvider: attribute=\"class\", defaultTheme=\"system\", enableSystem=true\nexport function Providers({ children }) {\n  return <>{children}</>;\n}"
      },
      {
        number: 10,
        name: "Cod: MDX cu custom components",
        question: "Scrie un fisier mdx-components.tsx care suprascrie elementul img din MDX cu componenta Image din next/image.",
        options: [],
        answer: "",
        explanation: "Custom MDX components permit inlocuirea elementelor markdown cu componente React optimizate — img cu next/image, a cu next/link etc.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import Image from 'next/image';\n\n// TODO: exporta obiect 'components' cu cheia 'img'\n// componenta img primeste src, alt si alte props\n// randeaza next/image cu width=800, height=400, style objectFit cover\nexport const components = {\n  // img: ...\n};"
      },
      {
        number: 11,
        name: "Cod: Blog search cu Fuse.js",
        question: "Scrie un Client Component BlogSearch care primeste o lista de posturi si filtreaza in timp real dupa title si excerpt cu Fuse.js (threshold 0.3).",
        options: [],
        answer: "",
        explanation: "Fuse.js cu useMemo previne recrearea indexului la fiecare render. Cautarea se aplica doar cand query nu e gol.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "'use client';\nimport { useState, useMemo } from 'react';\nimport Fuse from 'fuse.js';\n\nexport default function BlogSearch({ posts }) {\n  const [query, setQuery] = useState('');\n\n  // TODO: creeaza Fuse index cu useMemo, keys: ['title', 'excerpt'], threshold: 0.3\n  // TODO: calculeaza results: daca query gol -> toate posts, altfel fuse.search\n  // TODO: randeaza input si lista de results\n}"
      },
      {
        number: 12,
        name: "revalidatePath vs revalidateTag",
        question: "Cand preferi `revalidatePath` in locul `revalidateTag`?",
        options: [
          "Cand vrei sa invalidezi o pagina specifica, nu toate datele cu un anumit tag",
          "Cand vrei sa invalidezi toate datele",
          "Cand nu folosesti tag-uri pe fetch-uri",
          "Ambele variante sunt echivalente"
        ],
        answer: "Cand vrei sa invalidezi o pagina specifica, nu toate datele cu un anumit tag",
        explanation: "revalidatePath('/blog/articol-meu') invalideaza toate datele cache-uite pentru acea cale specifica. revalidateTag('posts') invalideaza toate fetch-urile taguite cu 'posts' indiferent de pagina. revalidatePath este mai precis pentru invalidari per-resurs.",
        difficulty: "medium"
      },
      {
        number: 13,
        name: "Tailwind dark mode",
        question: "Ce trebuie configurat in tailwind.config.js pentru a folosi prefixul `dark:` bazat pe clasa HTML?",
        options: [
          "darkMode: 'media' (default)",
          "darkMode: 'class'",
          "darkMode: true",
          "Nu necesita configurare"
        ],
        answer: "darkMode: 'class'",
        explanation: "darkMode: 'class' in tailwind.config.js activeaza stilurile dark: numai cand elementul html (sau un parinte) are clasa 'dark'. next-themes aplica aceasta clasa. Alternativa 'media' foloseste media query prefers-color-scheme.",
        difficulty: "easy"
      },
      {
        number: 14,
        name: "Cod: ThemeToggle button",
        question: "Scrie un Client Component ThemeToggle care comuta intre tema 'light' si 'dark' folosind next-themes si afiseaza iconita corespunzatoare.",
        options: [],
        answer: "",
        explanation: "useTheme din next-themes ofera theme curent si setTheme pentru schimbare. mounted previne mismatch SSR/client.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "'use client';\nimport { useTheme } from 'next-themes';\nimport { useEffect, useState } from 'react';\n\nexport default function ThemeToggle() {\n  const { theme, setTheme } = useTheme();\n  const [mounted, setMounted] = useState(false);\n\n  useEffect(() => setMounted(true), []);\n  if (!mounted) return null;\n\n  // TODO: buton care comuta intre dark si light\n  // afiseaza 'Luna' cand e light, 'Soare' cand e dark\n}"
      },
      {
        number: 15,
        name: "Blog arhitectura completa",
        question: "Care este structura de directoare recomandata pentru un blog Next.js App Router cu MDX?",
        options: [
          "Toate fisierele MDX in /public/posts/",
          "Fisierele MDX in /content/posts/, pagina dinamica in /app/blog/[slug]/page.tsx care le citeste",
          "Fisierele MDX direct in /app/blog/ ca pagini",
          "Fisierele MDX in /src/pages/"
        ],
        answer: "Fisierele MDX in /content/posts/, pagina dinamica in /app/blog/[slug]/page.tsx care le citeste",
        explanation: "Separarea contentului (content/) de cod (app/) permite editarea articolelor fara a modifica codul. Pagina dinamica [slug]/page.tsx citeste fisierul MDX corespunzator, il proceseaza si il randeaza. Alternativ: continut in baza de date si citit cu Prisma.",
        difficulty: "hard"
      }
    ]
  }
];

const nextjsBackendMore2 = [
  {
    slug: "nextjs-prisma-mongodb-avansat",
    title: "Next.js cu Prisma si MongoDB Avansat",
    order: 26,
    theory: [
      {
        order: 1,
        title: "Relatii in Prisma cu MongoDB",
        content: "Prisma suporta relatii one-to-many si many-to-many in MongoDB prin embedded documents sau referenced documents:\n\n```prisma\n// schema.prisma\nmodel User {\n  id    String @id @default(auto()) @map(\"_id\") @db.ObjectId\n  name  String\n  posts Post[]\n}\n\nmodel Post {\n  id       String @id @default(auto()) @map(\"_id\") @db.ObjectId\n  title    String\n  author   User   @relation(fields: [authorId], references: [id])\n  authorId String @db.ObjectId\n  tags     Tag[]  @relation(\"PostTags\")\n}\n\nmodel Tag {\n  id    String @id @default(auto()) @map(\"_id\") @db.ObjectId\n  name  String @unique\n  posts Post[] @relation(\"PostTags\")\n}\n```\nPentru many-to-many in MongoDB, Prisma creeaza automat o colectie de join (implicit join table).\n\nIncluderea relatiilor la query:\n```js\nconst userWithPosts = await prisma.user.findUnique({\n  where: { id: userId },\n  include: {\n    posts: {\n      include: { tags: true },\n      orderBy: { createdAt: 'desc' },\n      take: 10,\n    },\n  },\n});\n```\nInterviu: 'Embedded vs referenced in MongoDB cu Prisma?' — embedded (date in acelasi document) pentru date citite impreuna, referenced pentru date reutilizate sau volume mari."
      },
      {
        order: 2,
        title: "Tranzactii interactive in Prisma",
        content: "Tranzactiile asigura atomicitatea — ori toate operatiile reusesc, ori niciuna:\n\n```js\n// Tranzactie interactiva (recomandata)\nconst result = await prisma.$transaction(async (tx) => {\n  // Scade balanta sender\n  const sender = await tx.account.update({\n    where: { id: senderId },\n    data: { balance: { decrement: amount } },\n  });\n\n  if (sender.balance < 0) {\n    throw new Error('Fonduri insuficiente');\n  }\n\n  // Creste balanta receiver\n  const receiver = await tx.account.update({\n    where: { id: receiverId },\n    data: { balance: { increment: amount } },\n  });\n\n  return { sender, receiver };\n});\n```\nDaca throw-ul se executa, Prisma rollback-uieste automat ambele update-uri.\n\nPentru tranzactii MongoDB native, Prisma suporta si `$runCommandRaw` pentru operatii complexe. Limitare importanta: MongoDB necesita replica set pentru tranzactii — Atlas o suporta, development local necesita replica set configurat.\n\nInterviu: 'Cand folosesti tranzactii?' — operatii care modifica multiple documente care trebuie sa fie atomice: plati, transfer de stoc, creare user + profil simultan."
      },
      {
        order: 3,
        title: "Aggregations si Queries Avansate",
        content: "Prisma suporta aggregations prin metode dedicate si raw queries pentru operatii complexe:\n\n```js\n// Aggregate — suma, medie, min, max\nconst stats = await prisma.order.aggregate({\n  _avg: { amount: true },\n  _sum: { amount: true },\n  _count: { _all: true },\n  where: { status: 'COMPLETED' },\n});\n\n// GroupBy — statistici per categorie\nconst perCategory = await prisma.product.groupBy({\n  by: ['category'],\n  _count: { _all: true },\n  _avg: { price: true },\n  orderBy: { _count: { _all: 'desc' } },\n});\n\n// Raw query pentru aggregation pipeline MongoDB\nconst pipeline = await prisma.$runCommandRaw({\n  aggregate: 'Order',\n  pipeline: [\n    { $match: { status: 'COMPLETED' } },\n    { $group: { _id: '$userId', total: { $sum: '$amount' } } },\n    { $sort: { total: -1 } },\n    { $limit: 10 },\n  ],\n  cursor: {},\n});\n```\nPentru date complexe, combina Prisma cu MongoDB aggregation pipeline nativ prin `$runCommandRaw` sau `$aggregateRaw`."
      },
      {
        order: 4,
        title: "Indexuri si Optimizare Performanta",
        content: "Indexurile sunt esentiale pentru performanta la volume mari. In schema Prisma:\n\n```prisma\nmodel Post {\n  id        String   @id @default(auto()) @map(\"_id\") @db.ObjectId\n  slug      String   @unique  // index unic automat\n  title     String\n  authorId  String   @db.ObjectId\n  status    String\n  createdAt DateTime @default(now())\n\n  @@index([authorId, createdAt])  // index compus\n  @@index([status, createdAt])    // index pentru filtrare + sortare\n}\n```\nReguli de indexare:\n1. Indexeaza campurile folosite frecvent in WHERE, ORDER BY, JOIN\n2. Indexuri compuse: ordinea conteaza — (authorId, createdAt) ajuta query-uri WHERE authorId=x ORDER BY createdAt, dar nu si WHERE createdAt=x\n3. Evita over-indexing — fiecare index incetineste write-urile\n\nPrisma Studio si logging pentru debugging:\n```js\nconst prisma = new PrismaClient({\n  log: ['query', 'info', 'warn', 'error'],\n});\n```\nPentru a identifica N+1 queries (problema comuna):\n```js\n// GRESIT: N+1 — 1 query pentru posturi + N queries pentru autori\nconst posts = await prisma.post.findMany();\nfor (const post of posts) {\n  const author = await prisma.user.findUnique({ where: { id: post.authorId } });\n}\n\n// CORECT: 1 query cu include\nconst posts = await prisma.post.findMany({\n  include: { author: true },\n});\n```\nInterviu: 'Cum depistezi N+1 in Prisma?' — activezi logging de query si numeri query-urile per request."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "Relatii Prisma",
        question: "In Prisma cu MongoDB, ce face `include: { posts: true }` intr-un query findUnique?",
        options: [
          "Creeaza noi posturi pentru utilizator",
          "Incarca relatia posts si o include in rezultatul returnat",
          "Verifica daca utilizatorul are posturi",
          "Filtreaza utilizatorii care au posturi"
        ],
        answer: "Incarca relatia posts si o include in rezultatul returnat",
        explanation: "include executa o query separata (sau JOIN) pentru a incarca datele relatiei si le ataseaza la rezultat. Fara include, campul posts nu ar fi prezent in rezultat (lazy loading nu exista in Prisma).",
        difficulty: "easy"
      },
      {
        number: 2,
        name: "Tranzactii atomice",
        question: "Ce se intampla in Prisma daca o eroare este throw-uita in interiorul `prisma.$transaction(async (tx) => {...})`?",
        options: [
          "Tranzactia continua si ignora eroarea",
          "Doar operatia care a cauzat eroarea este anulata",
          "Toate operatiile din tranzactie sunt rollback-uite automat",
          "Eroarea este logata si tranzactia se finalizeaza partial"
        ],
        answer: "Toate operatiile din tranzactie sunt rollback-uite automat",
        explanation: "Aceasta este garantia de atomicitate a tranzactiilor. Un throw in orice punct al functiei transaction cauzeaza rollback complet — nicio modificare nu este salvata partial.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "N+1 Problem",
        question: "Ce este problema N+1 in context Prisma si cum o rezolvi?",
        options: [
          "Prea multe campuri intr-un model — rezolvata prin selectie partiala",
          "1 query pentru lista + N queries separate pentru relatia fiecarui element — rezolvata cu include sau select nested",
          "O query care returneaza N+1 rezultate in loc de N",
          "Un bug in Prisma care se rezolva prin upgrade"
        ],
        answer: "1 query pentru lista + N queries separate pentru relatia fiecarui element — rezolvata cu include sau select nested",
        explanation: "N+1 apare cand intr-o bucla faci query pentru fiecare element. Solutia: include la primul query incarca relatia pentru toti itemii in (de obicei) 2 query-uri totale in loc de N+1.",
        difficulty: "medium"
      },
      {
        number: 4,
        name: "groupBy Prisma",
        question: "Ce face `prisma.order.groupBy({ by: ['status'], _count: { _all: true } })`?",
        options: [
          "Grupeaza comenzile alphabetic dupa status",
          "Returneaza numarul de comenzi pentru fiecare valoare unica a campului status",
          "Creeaza index pe campul status",
          "Filtreaza comenzile dupa status"
        ],
        answer: "Returneaza numarul de comenzi pentru fiecare valoare unica a campului status",
        explanation: "groupBy cu _count returneaza un array de obiecte: [{ status: 'PENDING', _count: { _all: 5 } }, { status: 'COMPLETED', _count: { _all: 42 } }]. Echivalent SQL: SELECT status, COUNT(*) FROM Order GROUP BY status.",
        difficulty: "medium"
      },
      {
        number: 5,
        name: "@@index in Prisma",
        question: "Ce face `@@index([authorId, createdAt])` in schema Prisma?",
        options: [
          "Creeaza o constrangere de unicitate",
          "Creeaza un index compus pe campurile authorId si createdAt, accelerand query-urile care filtreaza/sorteaza dupa aceste campuri",
          "Face campurile obligatorii",
          "Leaga modelul de alta colectie"
        ],
        answer: "Creeaza un index compus pe campurile authorId si createdAt, accelerand query-urile care filtreaza/sorteaza dupa aceste campuri",
        explanation: "Indexurile compuse accelereaza query-uri precum WHERE authorId = x ORDER BY createdAt DESC. Ordinea campurilor in index conteaza: indexul este eficient pentru query-uri care folosesc prefixul (authorId singur sau authorId + createdAt).",
        difficulty: "hard"
      },
      {
        number: 6,
        name: "select vs include",
        question: "Care este diferenta dintre `select` si `include` in Prisma?",
        options: [
          "Nu exista diferenta",
          "select specifica exact ce campuri (scalare si relatii) sa fie returnate; include adauga relatii la toate campurile scalare implicite",
          "select este pentru citire, include pentru scriere",
          "include este mai rapid decat select"
        ],
        answer: "select specifica exact ce campuri (scalare si relatii) sa fie returnate; include adauga relatii la toate campurile scalare implicite",
        explanation: "Cu include returnezi toate campurile + relatia specificata. Cu select controlezi exact ce returnezi (util pentru reducerea datelor transferate). Nu poti folosi include si select simultan pe acelasi nivel.",
        difficulty: "medium"
      },
      {
        number: 7,
        name: "Prisma $transaction limitare MongoDB",
        question: "Ce conditie necesita MongoDB pentru a suporta tranzactii multi-document?",
        options: [
          "MongoDB 4.0+",
          "Replica set sau sharded cluster (nu standalone)",
          "Prisma v5+",
          "Index pe toate campurile folosite"
        ],
        answer: "Replica set sau sharded cluster (nu standalone)",
        explanation: "Tranzactiile MongoDB sunt disponibile doar pe replica sets. MongoDB Atlas este mereu configurat ca replica set. In development local, trebuie sa pornesti mongod cu --replSet sau sa folosesti Docker cu replica set.",
        difficulty: "hard"
      },
      {
        number: 8,
        name: "Cod: Query cu relatii",
        question: "Scrie un query Prisma care obtine un utilizator cu ultimele 5 posturi ale sale (ordonate descrescator dupa createdAt), fiecare post incluzand tag-urile.",
        options: [],
        answer: "",
        explanation: "include nested cu orderBy si take permite controlul precis al datelor relationate returnate.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "import { prisma } from '@/lib/prisma';\n\nasync function getUserWithRecentPosts(userId) {\n  // TODO: prisma.user.findUnique\n  // where: { id: userId }\n  // include: posts (orderBy createdAt desc, take 5, include tags)\n}"
      },
      {
        number: 9,
        name: "Cod: Tranzactie transfer",
        question: "Scrie o tranzactie Prisma care transfera puncte de la un utilizator la altul, aruncand eroare daca sender-ul nu are suficiente puncte.",
        options: [],
        answer: "",
        explanation: "Tranzactiile Prisma garanteaza atomicitate: daca arunci eroare, ambele update-uri sunt rollback-uite.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import { prisma } from '@/lib/prisma';\n\nasync function transferPoints(senderId, receiverId, points) {\n  return await prisma.$transaction(async (tx) => {\n    // TODO: decrement points de la sender\n    // TODO: verifica daca sender.points < 0, arunca eroare\n    // TODO: increment points la receiver\n    // TODO: returneaza ambii utilizatori actualizati\n  });\n}"
      },
      {
        number: 10,
        name: "Cod: GroupBy statistics",
        question: "Scrie un query Prisma care returneaza numarul de utilizatori grupati dupa rolul lor (role), ordonat descrescator.",
        options: [],
        answer: "",
        explanation: "groupBy cu _count permite statistici aggregate fara a incarca toate inregistrarile in memorie.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "import { prisma } from '@/lib/prisma';\n\nasync function getUserCountByRole() {\n  // TODO: prisma.user.groupBy\n  // by: ['role']\n  // _count: { _all: true }\n  // orderBy: { _count: { _all: 'desc' } }\n}"
      },
      {
        number: 11,
        name: "Cod: Aggregate stats",
        question: "Scrie un query Prisma care calculeaza suma totala si media comenzilor cu status 'COMPLETED'.",
        options: [],
        answer: "",
        explanation: "aggregate cu _sum si _avg permite calcule statistice direct in baza de date, fara a incarca toate datele in Node.js.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "import { prisma } from '@/lib/prisma';\n\nasync function getOrderStats() {\n  // TODO: prisma.order.aggregate\n  // _sum: { amount: true }\n  // _avg: { amount: true }\n  // _count: { _all: true }\n  // where: status COMPLETED\n}"
      },
      {
        number: 12,
        name: "Prisma logging",
        question: "Cum activezi logging-ul de query-uri in Prisma pentru a debugga performanta?",
        options: [
          "DEBUG=true in .env",
          "Initializand PrismaClient cu `log: ['query']` sau `log: ['query', 'info', 'warn', 'error']`",
          "Adaugand --verbose la prisma generate",
          "Folosind prisma.log()"
        ],
        answer: "Initializand PrismaClient cu `log: ['query']` sau `log: ['query', 'info', 'warn', 'error']`",
        explanation: "PrismaClient({ log: ['query'] }) afiseaza in consola fiecare query executat cu SQL/MongoDB-ul generat si durata. Util pentru identificarea query-urilor lente si a N+1 problems.",
        difficulty: "easy"
      },
      {
        number: 13,
        name: "upsert",
        question: "Ce face operatia `prisma.user.upsert({ where, create, update })`?",
        options: [
          "Sterge si recreeaza utilizatorul",
          "Actualizeaza daca exista, creeaza daca nu exista (update + insert = upsert)",
          "Creeaza utilizatorul fara a verifica duplicatele",
          "Verifica existenta fara a modifica"
        ],
        answer: "Actualizeaza daca exista, creeaza daca nu exista (update + insert = upsert)",
        explanation: "upsert este atomic: cauta inregistrarea dupa where, daca o gaseste executa update, daca nu o gaseste executa create. Ideal pentru sincronizare date sau operatii idempotente (ex: upsert profil la login OAuth).",
        difficulty: "medium"
      },
      {
        number: 14,
        name: "Cod: upsert profil",
        question: "Scrie o functie care upserteste profilul unui utilizator — creeaza daca nu exista, actualizeaza bio si avatarUrl daca exista.",
        options: [],
        answer: "",
        explanation: "upsert este ideal pentru sincronizarea profilelor la login sau actualizari idempotente.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "import { prisma } from '@/lib/prisma';\n\nasync function upsertProfile(userId, { bio, avatarUrl }) {\n  // TODO: prisma.profile.upsert\n  // where: { userId }\n  // create: { userId, bio, avatarUrl }\n  // update: { bio, avatarUrl }\n}"
      },
      {
        number: 15,
        name: "Cod: Pagination cu cursor",
        question: "Scrie o functie care returneaza 10 posturi dupa un cursor (id), implementand cursor-based pagination.",
        options: [],
        answer: "",
        explanation: "Cursor-based pagination este mai eficienta decat offset pentru seturi mari de date — nu necesita numararea tuturor randurilor anterioare.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import { prisma } from '@/lib/prisma';\n\nasync function getPostsAfterCursor(cursor) {\n  return await prisma.post.findMany({\n    take: 10,\n    // TODO: daca cursor exista, adauga skip: 1 si cursor: { id: cursor }\n    orderBy: { createdAt: 'desc' },\n    // cursor necesar: ...(cursor ? { skip: 1, cursor: { id: cursor } } : {})\n  });\n}"
      }
    ]
  },

  {
    slug: "nextjs-nextauth-avansat",
    title: "Autentificare cu NextAuth.js Avansata",
    order: 27,
    theory: [
      {
        order: 1,
        title: "Configurarea NextAuth.js v5 (Auth.js)",
        content: "NextAuth.js v5 (rebranded Auth.js) aduce API unificat pentru App Router:\n\n```js\n// auth.ts (radacina proiectului)\nimport NextAuth from 'next-auth';\nimport GitHub from 'next-auth/providers/github';\nimport Credentials from 'next-auth/providers/credentials';\nimport { PrismaAdapter } from '@auth/prisma-adapter';\nimport { prisma } from '@/lib/prisma';\nimport bcrypt from 'bcryptjs';\n\nexport const { handlers, auth, signIn, signOut } = NextAuth({\n  adapter: PrismaAdapter(prisma),\n  providers: [\n    GitHub,\n    Credentials({\n      credentials: {\n        email: { label: 'Email', type: 'email' },\n        password: { label: 'Password', type: 'password' },\n      },\n      async authorize(credentials) {\n        const user = await prisma.user.findUnique({\n          where: { email: credentials.email },\n        });\n        if (!user) return null;\n        const valid = await bcrypt.compare(credentials.password, user.password);\n        return valid ? user : null;\n      },\n    }),\n  ],\n  session: { strategy: 'jwt' },\n});\n\n// app/api/auth/[...nextauth]/route.ts\nexport { handlers as GET, handlers as POST } from '@/auth';\n```\nInterviu: 'JWT vs Database sessions in NextAuth?' — JWT: stateless, scalabil, fara DB per request, dar nu poti invalida imediat; Database: poti invalida oricand, necesita DB la fiecare request."
      },
      {
        order: 2,
        title: "JWT Callbacks si Extinderea Sesiunii",
        content: "Implicit, sesiunea contine doar id, name, email, image. Pentru a adauga date custom (rol, abonament etc.) folosesti callbacks:\n\n```js\nexport const { auth } = NextAuth({\n  // ...\n  callbacks: {\n    // jwt callback — ruleaza la crearea/actualizarea token-ului\n    async jwt({ token, user, trigger, session }) {\n      if (user) {\n        // La primul login: adauga date din user object\n        token.role = user.role;\n        token.subscriptionTier = user.subscriptionTier;\n      }\n      if (trigger === 'update' && session?.subscriptionTier) {\n        // La update() din client: actualizeaza token\n        token.subscriptionTier = session.subscriptionTier;\n      }\n      return token;\n    },\n    // session callback — ruleaza la fiecare getSession/useSession\n    async session({ session, token }) {\n      session.user.role = token.role;\n      session.user.subscriptionTier = token.subscriptionTier;\n      return session;\n    },\n  },\n});\n```\nPentru TypeScript, extinde tipurile NextAuth:\n```ts\ndeclare module 'next-auth' {\n  interface Session {\n    user: { role: string; subscriptionTier: string; } & DefaultSession['user'];\n  }\n}\n```\nInterviu: 'Cum adaugi rol in sesiunea NextAuth?' — jwt callback adauga la token, session callback expune din token in sesiune."
      },
      {
        order: 3,
        title: "Middleware pentru Protectia Rutelor",
        content: "Middleware-ul Next.js ruleaza la Edge inainte de orice request, ideal pentru auth:\n\n```js\n// middleware.ts\nimport { auth } from '@/auth';\nimport { NextResponse } from 'next/server';\n\nexport default auth(function middleware(req) {\n  const session = req.auth;\n  const isAuth = !!session;\n  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');\n  const isProtected = req.nextUrl.pathname.startsWith('/dashboard') ||\n                      req.nextUrl.pathname.startsWith('/api/private');\n\n  if (!isAuth && isProtected) {\n    return NextResponse.redirect(new URL('/auth/login', req.url));\n  }\n\n  if (isAuth && isAuthPage) {\n    return NextResponse.redirect(new URL('/dashboard', req.url));\n  }\n\n  return NextResponse.next();\n});\n\nexport const config = {\n  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],\n};\n```\nPentru role-based access in middleware:\n```js\nif (session?.user?.role !== 'ADMIN' && req.nextUrl.pathname.startsWith('/admin')) {\n  return NextResponse.redirect(new URL('/unauthorized', req.url));\n}\n```\nInterviu: 'De ce middleware in loc de verificare in fiecare pagina?' — middleware ruleaza inaintea randarii, redirectioneaza inainte ca codul paginii sa fie executat, mai eficient si mai consistent."
      },
      {
        order: 4,
        title: "Role-Based Access Control (RBAC)",
        content: "RBAC permite controlul granular al accesului bazat pe rolul utilizatorului:\n\n```js\n// lib/auth-utils.ts\nimport { auth } from '@/auth';\n\nexport async function requireRole(role) {\n  const session = await auth();\n  if (!session) throw new Error('Neautentificat');\n  if (session.user.role !== role) throw new Error('Acces interzis');\n  return session;\n}\n\n// Utilizare in Server Action\nasync function deleteUser(userId) {\n  'use server';\n  await requireRole('ADMIN');\n  await prisma.user.delete({ where: { id: userId } });\n}\n\n// Utilizare in RSC\nexport default async function AdminPage() {\n  const session = await auth();\n  if (!session || session.user.role !== 'ADMIN') {\n    redirect('/unauthorized');\n  }\n  // ...\n}\n```\nPattern recomandat cu helper withAuth:\n```js\nexport async function withAuth(handler, requiredRole) {\n  return async function(req) {\n    const session = await auth();\n    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });\n    if (requiredRole && session.user.role !== requiredRole) {\n      return Response.json({ error: 'Forbidden' }, { status: 403 });\n    }\n    return handler(req, session);\n  };\n}\n```\nInterviu: 'Diferenta 401 vs 403?' — 401 Unauthorized: utilizatorul nu este autentificat; 403 Forbidden: utilizatorul este autentificat dar nu are permisiunea."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "JWT vs Database sessions",
        question: "Care este avantajul principal al sesiunilor JWT fata de sesiunile din baza de date in NextAuth?",
        options: [
          "JWT este mai sigur",
          "JWT este stateless — nu necesita query la baza de date la fiecare request pentru a verifica sesiunea",
          "JWT suporta mai multi utilizatori",
          "JWT este mai usor de implementat"
        ],
        answer: "JWT este stateless — nu necesita query la baza de date la fiecare request pentru a verifica sesiunea",
        explanation: "Cu JWT, sesiunea este codificata in token si verificata criptografic, fara DB. Dezavantaj: nu poti invalida un JWT inainte de expirare fara o lista de revocare (blacklist). Database sessions permit invalidare imediata dar necesita DB per request.",
        difficulty: "medium"
      },
      {
        number: 2,
        name: "jwt callback",
        question: "Cand ruleaza callback-ul `jwt` in NextAuth?",
        options: [
          "La fiecare request HTTP",
          "La crearea token-ului (login) si actualizare (trigger: 'update'), nu la fiecare request",
          "Numai la logout",
          "O data pe zi"
        ],
        answer: "La crearea token-ului (login) si actualizare (trigger: 'update'), nu la fiecare request",
        explanation: "jwt callback ruleaza la login (unde poti adauga date din user in token) si cand apelezi update() din client. Session callback ruleaza mai des (la orice getSession/useSession) si citeste din token.",
        difficulty: "hard"
      },
      {
        number: 3,
        name: "Middleware auth",
        question: "De ce este recomandat sa protejezi rutele in middleware, nu doar in paginile individuale?",
        options: [
          "Middleware este mai usor de scris",
          "Middleware ruleaza inainte ca codul paginii sa fie executat, prevenind orice acces neautorizat chiar si la nivel de runtime",
          "Paginile individuale nu pot verifica autentificarea",
          "Middleware este obligatoriu in Next.js"
        ],
        answer: "Middleware ruleaza inainte ca codul paginii sa fie executat, prevenind orice acces neautorizat chiar si la nivel de runtime",
        explanation: "Verificarile in pagini pot fi ocolite daca exista bug-uri sau cai de cod neacoperite. Middleware este prima linie de aparare, rulata la Edge inainte de orice alt cod, asigurand protectie consistenta.",
        difficulty: "medium"
      },
      {
        number: 4,
        name: "Credentials provider",
        question: "Ce returneaza functia `authorize` din Credentials provider cand credentialele sunt invalide?",
        options: [
          "throw new Error('Invalid credentials')",
          "null (sau false), care indica autentificare esuata",
          "Un obiect cu error: true",
          "Un redirect catre pagina de eroare"
        ],
        answer: "null (sau false), care indica autentificare esuata",
        explanation: "authorize returneaza obiectul user daca credentialele sunt valide, sau null/false daca sunt invalide. NextAuth converteste null in eroare de autentificare afisata utilizatorului.",
        difficulty: "medium"
      },
      {
        number: 5,
        name: "401 vs 403",
        question: "Care este diferenta dintre statusurile HTTP 401 si 403 in context de autentificare?",
        options: [
          "401 = server error, 403 = client error",
          "401 = neautentificat (nu stim cine esti), 403 = neautorizat (stim cine esti dar nu ai permisiunea)",
          "401 = parola gresita, 403 = user inexistent",
          "Nu exista diferenta practica"
        ],
        answer: "401 = neautentificat (nu stim cine esti), 403 = neautorizat (stim cine esti dar nu ai permisiunea)",
        explanation: "401 Unauthorized: utilizatorul nu este logat sau token-ul este invalid/expirat. 403 Forbidden: utilizatorul este autentificat dar rolul sau nu permite accesul la resursa.",
        difficulty: "easy"
      },
      {
        number: 6,
        name: "session callback",
        question: "De ce trebuie sa adaugi date custom atat in jwt callback cat si in session callback?",
        options: [
          "Nu trebuie, e suficient sa adaugi doar in jwt",
          "jwt stocheaza datele in token, session expune ce vrei din token in obiectul session accesibil in client",
          "Sunt doua sisteme diferite care nu comunica",
          "session callback ruleaza primul, jwt callback il suprascrie"
        ],
        answer: "jwt stocheaza datele in token, session expune ce vrei din token in obiectul session accesibil in client",
        explanation: "Fluxul: jwt callback primeste user si adauga date in token -> session callback primeste token si le expune in session -> useSession()/auth() returneaza session. Fara session callback, datele custom din token nu apar in session.",
        difficulty: "hard"
      },
      {
        number: 7,
        name: "PrismaAdapter",
        question: "La ce serveste `PrismaAdapter` in configurarea NextAuth?",
        options: [
          "Conecteaza Prisma la baza de date",
          "Permite NextAuth sa stocheze si sa citeasca sesiuni, utilizatori si conturi OAuth din baza de date Prisma",
          "Cripteaza parolele automat",
          "Genereaza schema Prisma pentru auth"
        ],
        answer: "Permite NextAuth sa stocheze si sa citeasca sesiuni, utilizatori si conturi OAuth din baza de date Prisma",
        explanation: "Adaptatorul implementeaza interfata de storage a NextAuth folosind Prisma. Stocheaza: utilizatori, conturi OAuth conectate, sesiuni (pentru database sessions) si verification tokens pentru magic links.",
        difficulty: "medium"
      },
      {
        number: 8,
        name: "Cod: Middleware protectie",
        question: "Scrie middleware.ts care redirectioneaza utilizatorii neautentificati de pe /dashboard si /profile catre /auth/login.",
        options: [],
        answer: "",
        explanation: "Middleware auth ruleaza la Edge si este prima linie de protectie pentru rutele private.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import { auth } from '@/auth';\nimport { NextResponse } from 'next/server';\n\nexport default auth(function middleware(req) {\n  const session = req.auth;\n  const pathname = req.nextUrl.pathname;\n\n  // TODO: verifica daca pathname incepe cu /dashboard sau /profile\n  // daca nu e autentificat, redirectioneaza la /auth/login\n\n  return NextResponse.next();\n});\n\nexport const config = {\n  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],\n};"
      },
      {
        number: 9,
        name: "Cod: JWT callback cu rol",
        question: "Scrie callbacks-urile jwt si session pentru NextAuth care adauga campul 'role' din user in token si il expun in sesiune.",
        options: [],
        answer: "",
        explanation: "jwt adauga la token la login, session citeste din token si expune in sesiune accesibila in client.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "// Adauga la configuratia NextAuth\ncallbacks: {\n  async jwt({ token, user }) {\n    // TODO: daca user exista (primul login), adauga token.role = user.role\n    return token;\n  },\n  async session({ session, token }) {\n    // TODO: adauga session.user.role = token.role\n    return session;\n  },\n}"
      },
      {
        number: 10,
        name: "Cod: requireRole helper",
        question: "Scrie o functie async requireAuth(role?) care verifica sesiunea curenta si arunca eroare daca utilizatorul nu este autentificat sau nu are rolul cerut.",
        options: [],
        answer: "",
        explanation: "Helper-ul centralizat previne duplicarea logicii de autorizare in Server Actions si RSC-uri.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "import { auth } from '@/auth';\n\nexport async function requireAuth(role) {\n  const session = await auth();\n\n  // TODO: daca nu exista session, throw Error 'Neautentificat'\n  // TODO: daca role e specificat si session.user.role !== role, throw Error 'Acces interzis'\n\n  return session;\n}"
      },
      {
        number: 11,
        name: "Cod: Server Action cu auth",
        question: "Scrie un Server Action 'publishPost' care verifica ca utilizatorul este autentificat, actualizeaza statusul postului la 'PUBLISHED' si invalideaza cache-ul.",
        options: [],
        answer: "",
        explanation: "Server Actions sunt expuse public — autentificarea in actiune este esentiala, nu optionala.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import { auth } from '@/auth';\nimport { prisma } from '@/lib/prisma';\nimport { revalidatePath } from 'next/cache';\n\nexport async function publishPost(postId) {\n  'use server';\n  // TODO: obtine sesiunea, verifica autentificarea\n  // TODO: verifica ca postul apartine utilizatorului curent\n  // TODO: actualizeaza status la PUBLISHED\n  // TODO: revalidatePath pentru pagina postului\n}"
      },
      {
        number: 12,
        name: "signIn vs redirect",
        question: "Cum declansezi login-ul programatic intr-un Server Action in NextAuth v5?",
        options: [
          "window.location.href = '/api/auth/signin'",
          "Folosind functia signIn importata din '@/auth'",
          "Folosind redirect('/login') din next/navigation",
          "Prin fetch la /api/auth/signin"
        ],
        answer: "Folosind functia signIn importata din '@/auth'",
        explanation: "NextAuth v5 exporta signIn si signOut direct din configuratia auth. Acestea pot fi apelate in Server Actions: await signIn('github') sau await signIn('credentials', { email, password }). Functia gestioneaza redirectionarile automat.",
        difficulty: "medium"
      },
      {
        number: 13,
        name: "useSession",
        question: "Ce returneaza `useSession()` intr-un Client Component in NextAuth v5?",
        options: [
          "Obiectul user direct",
          "Un obiect cu { data: session, status: 'loading' | 'authenticated' | 'unauthenticated' }",
          "Un Promise cu sesiunea",
          "null daca nu este autentificat"
        ],
        answer: "Un obiect cu { data: session, status: 'loading' | 'authenticated' | 'unauthenticated' }",
        explanation: "useSession() este hook-ul client-side. data contine obiectul session (sau null), status indica starea: loading (verificare in curs), authenticated (logat), unauthenticated (nelogat). Util pentru UI conditionat de starea auth.",
        difficulty: "easy"
      },
      {
        number: 14,
        name: "Cod: RBAC in RSC",
        question: "Scrie o pagina RSC AdminDashboard care redirectioneaza la /unauthorized daca utilizatorul nu are rolul 'ADMIN'.",
        options: [],
        answer: "",
        explanation: "Verificarea rolului in RSC asigura ca codul paginii nu se executa deloc pentru utilizatorii fara permisiune.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "import { auth } from '@/auth';\nimport { redirect } from 'next/navigation';\n\nexport default async function AdminDashboard() {\n  const session = await auth();\n\n  // TODO: daca nu exista session -> redirect la /auth/login\n  // TODO: daca session.user.role !== 'ADMIN' -> redirect la /unauthorized\n\n  return <div><h1>Admin Dashboard</h1></div>;\n}"
      },
      {
        number: 15,
        name: "Cod: API route protejata",
        question: "Scrie un route handler GET /api/admin/stats care returneaza 401 daca neautentificat, 403 daca nu este admin, si date statistice daca e admin.",
        options: [],
        answer: "",
        explanation: "API routes necesita verificare explicita de autorizare — nu beneficiaza de middleware auth automat daca nu este configurat.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import { auth } from '@/auth';\nimport { prisma } from '@/lib/prisma';\n\nexport async function GET() {\n  const session = await auth();\n\n  // TODO: daca !session -> Response.json({ error: 'Unauthorized' }, { status: 401 })\n  // TODO: daca session.user.role !== 'ADMIN' -> Response.json({ error: 'Forbidden' }, { status: 403 })\n\n  // TODO: obtine statistici (numar useri, posturi) cu Prisma\n  // TODO: returneaza Response.json cu datele\n}"
      }
    ]
  },

  {
    slug: "nextjs-email-notificari",
    title: "Email si Notificari",
    order: 28,
    theory: [
      {
        order: 1,
        title: "Trimiterea Email-urilor cu Resend",
        content: "Resend este cel mai modern provider de email pentru aplicatii Next.js, cu React Email pentru template-uri:\n\n```bash\nnpm install resend @react-email/components\n```\n\n```js\n// lib/email.ts\nimport { Resend } from 'resend';\n\nconst resend = new Resend(process.env.RESEND_API_KEY);\n\nexport async function sendWelcomeEmail(userEmail, userName) {\n  const { data, error } = await resend.emails.send({\n    from: 'noreply@situlmeu.com',\n    to: userEmail,\n    subject: `Bun venit, ${userName}!`,\n    react: WelcomeEmailTemplate({ name: userName }),\n  });\n\n  if (error) {\n    console.error('Email error:', error);\n    throw new Error('Nu s-a putut trimite emailul');\n  }\n\n  return data;\n}\n```\nTemplate React Email:\n```tsx\nimport { Html, Body, Heading, Text, Button } from '@react-email/components';\n\nexport function WelcomeEmailTemplate({ name }) {\n  return (\n    <Html>\n      <Body>\n        <Heading>Bun venit, {name}!</Heading>\n        <Text>Contul tau a fost creat cu succes.</Text>\n        <Button href=\"https://situlmeu.com/dashboard\">Mergi la Dashboard</Button>\n      </Body>\n    </Html>\n  );\n}\n```\nInterviu: 'Resend vs Nodemailer?' — Resend: API modern, React templates, deliverability buna, managed. Nodemailer: open source, SMTP direct, mai mult control, necesita configurare server SMTP."
      },
      {
        order: 2,
        title: "Template-uri Email cu React Email",
        content: "React Email permite crearea de template-uri email cross-client cu componente React:\n\nComponente principale:\n- `<Html>` — wrapper root, seteaza lang\n- `<Head>` — meta tags si stiluri globale\n- `<Body>` — containerul principal\n- `<Container>` — layout centrat cu width maxim\n- `<Section>`, `<Row>`, `<Column>` — layout grid\n- `<Heading>`, `<Text>`, `<Link>`, `<Button>` — tipografie si interactive\n- `<Img>` — imagini optimizate pentru email\n- `<Hr>` — separator\n\n```tsx\nimport {\n  Html, Head, Body, Container, Section,\n  Heading, Text, Button, Img, Hr\n} from '@react-email/components';\n\nexport function OrderConfirmationEmail({ order }) {\n  return (\n    <Html lang=\"ro\">\n      <Head />\n      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5' }}>\n        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff' }}>\n          <Section style={{ padding: '20px' }}>\n            <Heading>Comanda #{order.id} confirmata</Heading>\n            <Text>Total: {order.total} RON</Text>\n            <Button\n              href={`https://site.com/orders/${order.id}`}\n              style={{ backgroundColor: '#007bff', color: '#fff', padding: '12px 24px' }}\n            >\n              Urmareste comanda\n            </Button>\n          </Section>\n        </Container>\n      </Body>\n    </Html>\n  );\n}\n```\nDezvoltare: `npx react-email dev` porneste un preview server cu hot reload."
      },
      {
        order: 3,
        title: "Webhooks — Primirea Notificarilor Externe",
        content: "Webhook-urile permit serviciilor externe sa notifice aplicatia ta cand se intampla ceva (plata procesata, email livrat etc.):\n\n```js\n// app/api/webhooks/stripe/route.ts\nimport Stripe from 'stripe';\nimport { headers } from 'next/headers';\n\nconst stripe = new Stripe(process.env.STRIPE_SECRET_KEY);\n\nexport async function POST(req) {\n  const body = await req.text();\n  const signature = headers().get('stripe-signature');\n\n  let event;\n  try {\n    event = stripe.webhooks.constructEvent(\n      body,\n      signature,\n      process.env.STRIPE_WEBHOOK_SECRET\n    );\n  } catch (err) {\n    return Response.json({ error: 'Invalid signature' }, { status: 400 });\n  }\n\n  switch (event.type) {\n    case 'checkout.session.completed':\n      await handlePaymentSuccess(event.data.object);\n      break;\n    case 'customer.subscription.deleted':\n      await handleSubscriptionCanceled(event.data.object);\n      break;\n  }\n\n  return Response.json({ received: true });\n}\n```\nRegula critica: **verifica intotdeauna semnatura webhook-ului** inainte de a procesa. Fara verificare, oricine poate trimite request-uri false la endpoint-ul tau.\n\nInterviu: 'De ce nu parsezi body-ul cu json() pentru webhooks Stripe?' — constructEvent necesita body raw (string/Buffer). req.json() parseaza si modifica corpul, invalidand semnatura."
      },
      {
        order: 4,
        title: "Queue-uri pentru Email-uri si Notificari Asincrone",
        content: "Trimiterea de email-uri direct in request este fragila — daca emailul esueaza, request-ul esueaza. Solutia: queue-uri asincrone.\n\nCu Upstash QStash (recomandat pentru Vercel):\n```js\n// lib/queue.ts\nimport { Client } from '@upstash/qstash';\n\nconst qstash = new Client({ token: process.env.QSTASH_TOKEN });\n\nexport async function queueWelcomeEmail(userId) {\n  await qstash.publishJSON({\n    url: `${process.env.APP_URL}/api/jobs/send-welcome-email`,\n    body: { userId },\n    delay: 5, // delay 5 secunde\n    retries: 3, // reincearca de 3 ori la esec\n  });\n}\n\n// app/api/jobs/send-welcome-email/route.ts\nexport async function POST(req) {\n  const { userId } = await req.json();\n  const user = await prisma.user.findUnique({ where: { id: userId } });\n  await sendWelcomeEmail(user.email, user.name);\n  return Response.json({ success: true });\n}\n```\nAlternativa simpla pentru proiecte mici: `waitUntil` din Vercel:\n```js\nimport { waitUntil } from '@vercel/functions';\n\nexport async function POST(req) {\n  const data = await req.json();\n  // Raspunde imediat utilizatorului\n  waitUntil(sendWelcomeEmail(data.email, data.name)); // ruleaza in background\n  return Response.json({ message: 'Inregistrare reusita' });\n}\n```\n`waitUntil` permite finalizarea functiei dupa trimiterea raspunsului, fara a bloca utilizatorul."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "Resend vs Nodemailer",
        question: "Care este avantajul principal al Resend fata de Nodemailer pentru aplicatii Next.js moderne?",
        options: [
          "Resend este gratuit, Nodemailer este platit",
          "Resend ofera API modern, React Email templates si deliverability gestionata; Nodemailer necesita configurare SMTP manuala",
          "Resend trimite mai repede email-urile",
          "Nodemailer nu mai este mentinut"
        ],
        answer: "Resend ofera API modern, React Email templates si deliverability gestionata; Nodemailer necesita configurare SMTP manuala",
        explanation: "Resend abstractizeaza complexitatea trimiterii de email: deliverability (SPF, DKIM, DMARC), bounces, unsubscribes. Nodemailer necesita server SMTP propriu sau serviciu tert, configurare manuala DNS.",
        difficulty: "medium"
      },
      {
        number: 2,
        name: "Verificarea semnaturii webhook",
        question: "De ce trebuie sa verifici semnatura unui webhook Stripe inainte de a procesa datele?",
        options: [
          "Deoarece Stripe solicita aceasta in termenii de utilizare",
          "Pentru a te asigura ca request-ul vine de la Stripe, nu de la un atacator care simuleaza plati",
          "Deoarece semnatura contine informatii despre plata",
          "Pentru a evita duplicate"
        ],
        answer: "Pentru a te asigura ca request-ul vine de la Stripe, nu de la un atacator care simuleaza plati",
        explanation: "Fara verificarea semnaturii, oricine cunoaste URL-ul endpoint-ului poate trimite request-uri false care simuleaza plati reusite, activand abonamente fara plata reala. Semnatura HMAC garanteaza autenticitatea.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "React Email",
        question: "De ce se foloseste React Email in loc de HTML static pentru template-urile de email?",
        options: [
          "Email-urile React sunt mai mici ca dimensiune",
          "Permite scrierea template-urilor ca componente React reutilizabile, cu tipuri, props si preview in browser",
          "Gmail suporta nativ React",
          "HTML static nu functioneaza in email"
        ],
        answer: "Permite scrierea template-urilor ca componente React reutilizabile, cu tipuri, props si preview in browser",
        explanation: "React Email transforma JSX in HTML compatibil cu clientii de email (Gmail, Outlook etc.). Avantaje: DX bun (component model, TypeScript), server de preview cu hot reload, componente prebuilt cross-client.",
        difficulty: "easy"
      },
      {
        number: 4,
        name: "waitUntil",
        question: "Ce face `waitUntil(promise)` din @vercel/functions intr-un route handler?",
        options: [
          "Blocheaza raspunsul pana promise se termina",
          "Permite continuarea executiei promise dupa trimiterea raspunsului HTTP, fara a bloca utilizatorul",
          "Adauga promise la o coada de asteptare",
          "Anuleaza promise dupa trimiterea raspunsului"
        ],
        answer: "Permite continuarea executiei promise dupa trimiterea raspunsului HTTP, fara a bloca utilizatorul",
        explanation: "Fara waitUntil, functia Vercel se termina imediat dupa return, anulând orice operatii in curs. waitUntil extinde durata de viata a functiei pana promise se termina, dar raspunsul HTTP este trimis imediat utilizatorului.",
        difficulty: "hard"
      },
      {
        number: 5,
        name: "req.text() pentru webhooks",
        question: "De ce folosesti `req.text()` in loc de `req.json()` la parsarea webhook-ului Stripe?",
        options: [
          "Deoarece req.json() este mai lent",
          "Deoarece constructEvent necesita body raw (string nemodificat) pentru a verifica semnatura HMAC",
          "Deoarece Stripe trimite text, nu JSON",
          "Deoarece req.json() cauzeaza erori cu Stripe SDK"
        ],
        answer: "Deoarece constructEvent necesita body raw (string nemodificat) pentru a verifica semnatura HMAC",
        explanation: "Semnatura HMAC este calculata pe body-ul brut, byte cu byte. req.json() parseaza si poate modifica spatiile albe sau ordinea campurilor, invalidand semnatura. Trebuie sa pasezi exact aceeasi secventa de bytes primita.",
        difficulty: "hard"
      },
      {
        number: 6,
        name: "Queue-uri pentru email",
        question: "Care este principalul avantaj al trimiterii email-urilor printr-un queue asincron (ex: QStash)?",
        options: [
          "Email-urile ajung mai repede",
          "Decupleaza trimiterea email-urilor de request-ul HTTP — erori de email nu afecteaza experienta utilizatorului si reincercarile sunt automate",
          "Reduce costul email-urilor",
          "Permite trimiterea de email-uri HTML"
        ],
        answer: "Decupleaza trimiterea email-urilor de request-ul HTTP — erori de email nu afecteaza experienta utilizatorului si reincercarile sunt automate",
        explanation: "Cu queue: request HTTP se termina rapid, utilizatorul primeste confirmare imediata. Emailul se trimite asincron cu retry automat. Fara queue: o eroare SMTP face request-ul sa dureze/esueze, afectand UX.",
        difficulty: "medium"
      },
      {
        number: 7,
        name: "RESEND_API_KEY",
        question: "Cum trebuie stocata cheia API Resend in Next.js?",
        options: [
          "Direct in cod, in fisierul lib/email.ts",
          "In variabila de mediu RESEND_API_KEY in .env.local (server-side, fara prefix NEXT_PUBLIC_)",
          "In localStorage al browserului",
          "In fisierul next.config.js"
        ],
        answer: "In variabila de mediu RESEND_API_KEY in .env.local (server-side, fara prefix NEXT_PUBLIC_)",
        explanation: "Cheile API nu trebuie expuse clientului niciodata. Variabilele fara prefix NEXT_PUBLIC_ sunt disponibile doar pe server. .env.local nu se commiteaza in git (adauga-l in .gitignore).",
        difficulty: "easy"
      },
      {
        number: 8,
        name: "Cod: sendWelcomeEmail cu Resend",
        question: "Scrie o functie sendWelcomeEmail(email, name) care trimite un email de bun venit folosind Resend cu subject 'Bun venit!' si un body HTML simplu.",
        options: [],
        answer: "",
        explanation: "Resend ofera API simplu: resend.emails.send() cu from, to, subject si html/react.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "import { Resend } from 'resend';\n\nconst resend = new Resend(process.env.RESEND_API_KEY);\n\nexport async function sendWelcomeEmail(email, name) {\n  // TODO: resend.emails.send cu:\n  // from: 'noreply@situlmeu.com'\n  // to: email\n  // subject: 'Bun venit!'\n  // html: `<h1>Bun venit, ${name}!</h1><p>Contul tau a fost creat.</p>`\n  // returneaza { data, error }, arunca eroare daca error exista\n}"
      },
      {
        number: 9,
        name: "Cod: Webhook Stripe",
        question: "Scrie un route handler POST pentru webhook Stripe care verifica semnatura si trateaza evenimentul 'checkout.session.completed'.",
        options: [],
        answer: "",
        explanation: "Verificarea semnaturii este critica. Body-ul trebuie citit ca text (raw) pentru a nu invalida semnatura HMAC.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import Stripe from 'stripe';\nimport { headers } from 'next/headers';\n\nconst stripe = new Stripe(process.env.STRIPE_SECRET_KEY);\n\nexport async function POST(req) {\n  // TODO: citeste body ca text raw\n  // TODO: obtine stripe-signature din headers\n  // TODO: verifica cu stripe.webhooks.constructEvent, returneaza 400 la eroare\n  // TODO: switch pe event.type, trateaza checkout.session.completed\n  // TODO: returneaza { received: true }\n}"
      },
      {
        number: 10,
        name: "Cod: Email template React",
        question: "Scrie un template React Email minimal pentru confirmarea comenzii cu numarul comenzii si suma totala.",
        options: [],
        answer: "",
        explanation: "React Email foloseste componente speciale cross-client in loc de HTML direct. Stilurile inline sunt recomandate pentru compatibilitate maxima.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "import { Html, Body, Container, Heading, Text, Button } from '@react-email/components';\n\nexport function OrderConfirmationEmail({ orderId, total }) {\n  // TODO: template cu:\n  // - Html, Body, Container\n  // - Heading: 'Comanda #{orderId} confirmata'\n  // - Text: 'Total: {total} RON'\n  // - Button link la /orders/{orderId}: 'Urmareste comanda'\n  return null;\n}"
      },
      {
        number: 11,
        name: "Cod: waitUntil email",
        question: "Scrie un route handler POST pentru inregistrare care raspunde imediat cu success si trimite emailul de bun venit in background cu waitUntil.",
        options: [],
        answer: "",
        explanation: "waitUntil permite UX rapid (raspuns instant) cu email trimis asincron fara a bloca utilizatorul.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import { waitUntil } from '@vercel/functions';\nimport { sendWelcomeEmail } from '@/lib/email';\nimport { prisma } from '@/lib/prisma';\n\nexport async function POST(req) {\n  const { email, name, password } = await req.json();\n\n  // TODO: creeaza utilizatorul in DB\n  // TODO: foloseste waitUntil pentru a trimite emailul in background\n  // TODO: returneaza imediat Response.json cu mesaj de succes\n}"
      },
      {
        number: 12,
        name: "Idempotenta webhooks",
        question: "De ce trebuie sa implementezi idempotenta la procesarea webhook-urilor?",
        options: [
          "Pentru a procesa mai repede webhook-urile",
          "Deoarece serviciile externe pot trimite acelasi webhook de mai multe ori — idempotenta previne actiuni duplicate (ex: activare abonament de doua ori)",
          "Pentru a reduce consumul de memorie",
          "Nu este necesara idempotenta"
        ],
        answer: "Deoarece serviciile externe pot trimite acelasi webhook de mai multe ori — idempotenta previne actiuni duplicate (ex: activare abonament de doua ori)",
        explanation: "Stripe garanteaza livrarea 'at least once', nu 'exactly once'. Implementezi idempotenta stocand event.id si verificand daca a fost procesat: if (await isProcessed(event.id)) return Response.json({ received: true }).",
        difficulty: "hard"
      },
      {
        number: 13,
        name: "Testare email-uri",
        question: "Ce instrument poti folosi pentru a testa trimiterea de email-uri in development fara a trimite email-uri reale?",
        options: [
          "Gmail in modul dev",
          "Mailtrap, Resend Test Mode sau react-email dev server pentru preview vizual",
          "Un server SMTP local configurat manual",
          "Email-urile nu pot fi testate fara a le trimite real"
        ],
        answer: "Mailtrap, Resend Test Mode sau react-email dev server pentru preview vizual",
        explanation: "Mailtrap intercepteaza email-urile in development. Resend are Test Mode (email-uri procesate dar nu trimise). react-email dev server ofera preview vizual al template-urilor in browser. Toate previn spam-ul accidental.",
        difficulty: "easy"
      },
      {
        number: 14,
        name: "Cod: Notificare in DB",
        question: "Scrie o functie createNotification care salveaza o notificare in baza de date si o trimite prin email daca userul are emailNotifications activat.",
        options: [],
        answer: "",
        explanation: "Preferintele utilizatorului trebuie respectate. Notificarea in DB este permanenta, emailul este optional bazat pe setari.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import { prisma } from '@/lib/prisma';\nimport { sendNotificationEmail } from '@/lib/email';\n\nexport async function createNotification(userId, { title, message }) {\n  // TODO: creeaza notificarea in DB cu prisma.notification.create\n  // TODO: obtine userul cu setarile de notificare\n  // TODO: daca user.emailNotifications === true, trimite email\n  // TODO: returneaza notificarea creata\n}"
      },
      {
        number: 15,
        name: "Cod: Bulk email cu Resend batch",
        question: "Scrie o functie sendNewsletterBatch(users, subject, htmlContent) care trimite newsletter la o lista de utilizatori folosind Resend batch API.",
        options: [],
        answer: "",
        explanation: "Resend batch API permite trimiterea eficienta a email-urilor in masa, cu rate limiting gestionat automat.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import { Resend } from 'resend';\n\nconst resend = new Resend(process.env.RESEND_API_KEY);\n\nexport async function sendNewsletterBatch(users, subject, htmlContent) {\n  // TODO: construieste array de email-uri pentru batch\n  // fiecare: { from: 'newsletter@situlmeu.com', to: user.email, subject, html: htmlContent }\n  // TODO: apeleaza resend.batch.send(emails)\n  // TODO: returneaza rezultatul\n}"
      }
    ]
  },

  {
    slug: "nextjs-optimizare-backend",
    title: "Optimizare Backend",
    order: 29,
    theory: [
      {
        order: 1,
        title: "Strategii de Caching in Next.js Backend",
        content: "Caching-ul este cea mai eficienta optimizare — elimina munca repetitiva. Next.js ofera mai multe straturi:\n\n1. **Request Memoization** — fetch-uri identice in acelasi render sunt deduplicatate\n2. **Data Cache** — persistent, configurat cu `next: { revalidate, tags }`\n3. **Full Route Cache** — paginile statice sunt cache-uite pe CDN\n4. **Router Cache** — cache client-side pentru navigari recente\n\nPentru date care nu se schimba des, cache-ul agresiv este recomandat:\n```js\n// Cache pentru 1 zi, invalidare on-demand\nasync function getConfig() {\n  return fetch('/api/config', {\n    next: { revalidate: 86400, tags: ['config'] },\n  }).then((r) => r.json());\n}\n\n// Functie de cache cu unstable_cache (alternativa la fetch)\nimport { unstable_cache } from 'next/cache';\n\nconst getCachedPosts = unstable_cache(\n  async (category) => {\n    return prisma.post.findMany({ where: { category } });\n  },\n  ['posts-by-category'],\n  { revalidate: 3600, tags: ['posts'] }\n);\n```\n`unstable_cache` (sau `cache` in versiunile noi) permite caching pentru orice functie asincronă, nu doar fetch.\n\nInterviu: 'Diferenta intre Data Cache si request memoization?' — Data Cache este persistent si surviveaza mai multe request-uri, memoization este per-request si se sterge la finalul render-ului."
      },
      {
        order: 2,
        title: "Edge Runtime si Node.js Runtime",
        content: "Next.js suporta doua runtime-uri pentru routes si middleware:\n\n**Node.js Runtime** (default):\n- Acces complet la API-urile Node.js\n- Suporta librarii npm native (bcrypt, sharp, Prisma)\n- Cold start mai mare (~500ms)\n- Limita de timeout generoasa\n\n**Edge Runtime**:\n- Subset limitat de Web APIs (no Node.js builtins)\n- Cold start foarte mic (<10ms)\n- Distribuit geografic (rulează lângă utilizator)\n- Limitat la librarii compatibile Web\n\n```ts\n// Route Handler cu Edge Runtime\nexport const runtime = 'edge';\n\nexport async function GET(request) {\n  // Nu poti folosi Prisma, bcrypt, fs etc. cu edge!\n  const data = await fetch('https://api.extern.com/data').then(r => r.json());\n  return Response.json(data);\n}\n\n// Middleware — ruleaza mereu pe Edge\n// Potrivit pentru: geolocation, A/B testing, auth (JWT verificare), rate limiting\n```\nStrategia hibrida recomandata:\n- Middleware: Edge (auth, redirecturi, geolocation)\n- API Routes cu Prisma/DB: Node.js\n- Static/lightweight routes: Edge\n\nInterviu: 'Cand alegi Edge vs Node.js?' — Edge pentru operatii lightweight, latenta mica, geografic distribuit. Node.js cand ai nevoie de DB, crypto, sau librarii npm complexe."
      },
      {
        order: 3,
        title: "Connection Pooling pentru MongoDB in Serverless",
        content: "Functiile serverless creeaza noi conexiuni la baza de date la fiecare cold start — periculos la trafic mare:\n\n```js\n// lib/prisma.ts — Singleton pattern pentru dev si serverless\nimport { PrismaClient } from '@prisma/client';\n\nconst globalForPrisma = globalThis;\n\nexport const prisma =\n  globalForPrisma.prisma ??\n  new PrismaClient({\n    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],\n  });\n\nif (process.env.NODE_ENV !== 'production') {\n  globalForPrisma.prisma = prisma;\n}\n```\nAceasta previne crearea de noi instante PrismaClient la fiecare hot reload in development.\n\nPentru productie pe Vercel (multi-instance), folosesti Prisma Accelerate sau MongoDB Atlas connection pooling:\n```\nDATABASE_URL=\"prisma://accelerate.prisma-data.net/?api_key=KEY\"\n```\nPrisma Accelerate ofera:\n- Connection pooling global\n- Cache la nivel de query\n- Reducerea cold start-urilor\n\nAlternativ pentru MongoDB: `maxPoolSize` in connection string:\n```\nmongodb+srv://user:pass@cluster.mongodb.net/db?maxPoolSize=10\n```\nInterviu: 'Problema N conexiuni in serverless?' — fiecare functie poate crea propria conexiune, Atlas are limita maxima. Connection pooler rezolva prin multiplexarea mai multor functii pe mai putine conexiuni."
      },
      {
        order: 4,
        title: "Rate Limiting si Security Headers",
        content: "Rate limiting protejeaza API-urile de abuz si atacuri DDoS. Cu Upstash Redis si @upstash/ratelimit:\n\n```ts\nimport { Ratelimit } from '@upstash/ratelimit';\nimport { Redis } from '@upstash/redis';\n\nconst ratelimit = new Ratelimit({\n  redis: Redis.fromEnv(),\n  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 req per 10 secunde\n  analytics: true,\n});\n\nexport async function GET(request) {\n  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';\n  const { success, limit, remaining, reset } = await ratelimit.limit(ip);\n\n  if (!success) {\n    return Response.json(\n      { error: 'Too Many Requests' },\n      {\n        status: 429,\n        headers: {\n           'X-RateLimit-Limit': String(limit),\n          'X-RateLimit-Remaining': String(remaining),\n          'X-RateLimit-Reset': String(reset),\n        },\n      }\n    );\n  }\n\n  // ... logica normala\n}\n```\nSecurity headers in next.config.js:\n```js\nconst headers = async () => [{\n  source: '/(.*)',\n  headers: [\n    { key: 'X-Frame-Options', value: 'DENY' },\n    { key: 'X-Content-Type-Options', value: 'nosniff' },\n    { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },\n    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },\n  ],\n}];\n```\nInterviu: 'Ce este sliding window vs fixed window rate limiting?' — fixed window: 10 req per 10s, resetat la t=10, t=20 etc. Sliding window: 10 req in orice fereastra mobila de 10s, mai protectiv la burst-uri la granita ferestrei."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "Straturi cache Next.js",
        question: "Care strat de cache Next.js persista intre multiple request-uri si poate fi invalidat cu revalidateTag?",
        options: [
          "Request Memoization",
          "Router Cache (client-side)",
          "Data Cache",
          "Browser Cache"
        ],
        answer: "Data Cache",
        explanation: "Data Cache este persistent pe server si surviveaza mai multe request-uri. Request Memoization se sterge la finalul unui singur render. Router Cache este client-side. revalidateTag/revalidatePath invalideaza Data Cache.",
        difficulty: "medium"
      },
      {
        number: 2,
        name: "Edge Runtime limitari",
        question: "Care dintre urmatoarele librarii NU poate fi folosita intr-un Edge Runtime?",
        options: [
          "jose (JWT verification)",
          "Prisma ORM",
          "Zod (validation)",
          "Web Crypto API"
        ],
        answer: "Prisma ORM",
        explanation: "Prisma foloseste Node.js APIs native care nu sunt disponibile in Edge Runtime. Edge suporta doar Web APIs standard. Pentru DB din Edge, folosesti Prisma Accelerate (edge-compatible) sau Turso (libSQL edge).",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "Prisma Singleton",
        question: "De ce se stocheaza instanta PrismaClient pe `globalThis` in development?",
        options: [
          "Pentru a face instanta disponibila global in aplicatie",
          "Pentru a preveni crearea de noi conexiuni la fiecare hot reload — Next.js reinitializeaza modulele dar globalThis persista",
          "Pentru a imbunatati performanta query-urilor",
          "Este o cerinta a Prisma pentru MongoDB"
        ],
        answer: "Pentru a preveni crearea de noi conexiuni la fiecare hot reload — Next.js reinitializeaza modulele dar globalThis persista",
        explanation: "La hot reload in development, modulele Node.js sunt reinitializate, deci new PrismaClient() ar fi apelat de noi ori, creand zeci de conexiuni. globalThis persista intre reload-uri, permitand reutilizarea instantei existente.",
        difficulty: "hard"
      },
      {
        number: 4,
        name: "Rate limiting 429",
        question: "Ce status HTTP trebuie returnat cand un client depaseste limita de rate?",
        options: [
          "400 Bad Request",
          "401 Unauthorized",
          "429 Too Many Requests",
          "503 Service Unavailable"
        ],
        answer: "429 Too Many Requests",
        explanation: "429 este statusul standard RFC 6585 pentru rate limiting. Ar trebui insotit de header-ul Retry-After care indica cand clientul poate reincerca.",
        difficulty: "easy"
      },
      {
        number: 5,
        name: "unstable_cache",
        question: "Cand folosesti `unstable_cache` in loc de fetch cu next options?",
        options: [
          "Cand vrei cache pentru orice functie asincronă, nu doar fetch (ex: Prisma queries)",
          "Cand fetch-ul este prea lent",
          "Cand lucrezi cu fisiere locale",
          "Cand vrei sa dezactivezi cache-ul"
        ],
        answer: "Cand vrei cache pentru orice functie asincronă, nu doar fetch (ex: Prisma queries)",
        explanation: "fetch() are cache built-in doar pentru HTTP requests. unstable_cache (redenumit in versiuni noi) permite caching pentru orice functie async, inclusiv queries Prisma, calcule costisitoare sau date din fisiere.",
        difficulty: "medium"
      },
      {
        number: 6,
        name: "Connection pooling",
        question: "Ce problema rezolva Prisma Accelerate in context serverless?",
        options: [
          "Cripteaza conexiunile la baza de date",
          "Ofera connection pooling si caching — multiplexeaza mai multe functii serverless pe mai putine conexiuni la MongoDB",
          "Genereaza automat schema Prisma",
          "Permite folosirea Prisma cu Edge Runtime"
        ],
        answer: "Ofera connection pooling si caching — multiplexeaza mai multe functii serverless pe mai putine conexiuni la MongoDB",
        explanation: "Fara pooling, fiecare functie serverless deschide propria conexiune. La 100 functii simultane = 100 conexiuni, depasind limitele MongoDB Atlas (default max 500). Accelerate multiplexeaza prin putine conexiuni reutilizate.",
        difficulty: "hard"
      },
      {
        number: 7,
        name: "X-Frame-Options",
        question: "Ce atac previne header-ul HTTP `X-Frame-Options: DENY`?",
        options: [
          "SQL Injection",
          "Cross-Site Request Forgery (CSRF)",
          "Clickjacking — incarcarea site-ului in iframe malitios pentru a pacali utilizatori sa faca click pe elemente ascunse",
          "Cross-Site Scripting (XSS)"
        ],
        answer: "Clickjacking — incarcarea site-ului in iframe malitios pentru a pacali utilizatori sa faca click pe elemente ascunse",
        explanation: "DENY impiedica incarcarea paginii in orice iframe. SAMEORIGIN permite doar iframe-uri de pe acelasi origin. Clickjacking incarca un site legitim intr-un iframe transparent deasupra unui site fals pentru a intercepta click-uri.",
        difficulty: "medium"
      },
      {
        number: 8,
        name: "Cod: unstable_cache pentru Prisma",
        question: "Scrie o functie getCachedUserById(id) care foloseste unstable_cache pentru a cache-ui un query Prisma pentru 1 ora cu tag-ul 'users'.",
        options: [],
        answer: "",
        explanation: "unstable_cache accepta functia de cache, array de key-uri si optiunile revalidate si tags.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "import { unstable_cache } from 'next/cache';\nimport { prisma } from '@/lib/prisma';\n\nexport const getCachedUserById = unstable_cache(\n  async (id) => {\n    // TODO: returneaza prisma.user.findUnique({ where: { id } })\n  },\n  // TODO: array de key-uri pentru cache key\n  // TODO: optiuni: revalidate 3600, tags ['users']\n);"
      },
      {
        number: 9,
        name: "Cod: Prisma Singleton",
        question: "Scrie fisierul lib/prisma.ts cu pattern singleton pentru a preveni multiple instante PrismaClient in development.",
        options: [],
        answer: "",
        explanation: "Singleton pattern pe globalThis previne 'PrismaClient has already been initialized' la hot reload.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "import { PrismaClient } from '@prisma/client';\n\n// TODO: declara globalForPrisma ca globalThis cu tip extins\n// TODO: creeaza prisma: reutilizeaza globalForPrisma.prisma sau new PrismaClient()\n// TODO: in non-production, stocheaza pe globalForPrisma.prisma\n\nexport const prisma = null; // inlocuieste cu implementarea"
      },
      {
        number: 10,
        name: "Cod: Rate limiting middleware",
        question: "Scrie un route handler GET cu rate limiting de 5 requesturi per 60 secunde per IP folosind @upstash/ratelimit.",
        options: [],
        answer: "",
        explanation: "Rate limiting la nivel de route protejeaza endpoint-ul de abuz fara a afecta utilizatorii legitimi.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import { Ratelimit } from '@upstash/ratelimit';\nimport { Redis } from '@upstash/redis';\n\nconst ratelimit = new Ratelimit({\n  redis: Redis.fromEnv(),\n  // TODO: limiter: Ratelimit.slidingWindow(5, '60 s')\n});\n\nexport async function GET(request) {\n  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';\n  // TODO: verifica rate limit pentru ip\n  // TODO: daca !success, returneaza 429 cu headers X-RateLimit-*\n  // TODO: altfel, logica normala\n  return Response.json({ data: 'ok' });\n}"
      },
      {
        number: 11,
        name: "Cod: Edge route cu geolocation",
        question: "Scrie un Edge route handler GET care returneaza tara utilizatorului din headerul geo al Vercel.",
        options: [],
        answer: "",
        explanation: "Edge Runtime ruleaza langa utilizator. Vercel injecteaza x-vercel-ip-country in headers pe Edge.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "export const runtime = 'edge';\n\nexport async function GET(request) {\n  // TODO: obtine tara din header 'x-vercel-ip-country'\n  // TODO: returneaza Response.json cu { country } sau 'Unknown' daca absent\n}"
      },
      {
        number: 12,
        name: "Sliding vs Fixed window",
        question: "Care este avantajul sliding window fata de fixed window rate limiting?",
        options: [
          "Sliding window este mai rapid",
          "Sliding window previne burst-urile la granita ferestrei (ex: 10 req la 0:59 + 10 req la 1:01 in fixed window)",
          "Sliding window consuma mai putina memorie",
          "Sliding window este mai usor de implementat"
        ],
        answer: "Sliding window previne burst-urile la granita ferestrei (ex: 10 req la 0:59 + 10 req la 1:01 in fixed window)",
        explanation: "Cu fixed window, un client poate trimite 10 req la sfarsitul ferestrei si 10 la inceputul urmatoarei — 20 request-uri in 2 secunde. Sliding window mentine fereastra mobila, garantand maximum N req in orice interval de timp definit.",
        difficulty: "hard"
      },
      {
        number: 13,
        name: "Cod: Security headers config",
        question: "Scrie configuratia de headers in next.config.js care adauga X-Frame-Options: DENY si X-Content-Type-Options: nosniff pentru toate rutele.",
        options: [],
        answer: "",
        explanation: "Security headers sunt o prima linie de aparare importanta si se configureaza centralizat in next.config.js.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  async headers() {\n    return [\n      {\n        source: '/(.*)',\n        headers: [\n          // TODO: X-Frame-Options: DENY\n          // TODO: X-Content-Type-Options: nosniff\n          // TODO: Referrer-Policy: strict-origin-when-cross-origin\n        ],\n      },\n    ];\n  },\n};\n\nmodule.exports = nextConfig;"
      },
      {
        number: 14,
        name: "Revalidare on-demand",
        question: "Cum implementezi revalidare on-demand a cache-ului cand un CMS extern publica continut nou?",
        options: [
          "Setezi revalidate: 0 pentru a dezactiva cache-ul complet",
          "Creezi un API route secret care apeleaza revalidatePath sau revalidateTag, si il apelezi din webhook-ul CMS",
          "Restartezi serverul Next.js",
          "Folosesti SSR fara cache"
        ],
        answer: "Creezi un API route secret care apeleaza revalidatePath sau revalidateTag, si il apelezi din webhook-ul CMS",
        explanation: "Fluxul: CMS publica articol -> trimite webhook la /api/revalidate?secret=TOKEN&path=/blog/slug -> route handler verifica secret-ul si apeleaza revalidatePath('/blog/slug') -> pagina se regenereaza la urmatoarea vizita.",
        difficulty: "hard"
      },
      {
        number: 15,
        name: "Cod: Revalidate route",
        question: "Scrie un route handler GET /api/revalidate care verifica un secret din query params si revalideaza o cale data in parametrul 'path'.",
        options: [],
        answer: "",
        explanation: "Endpoint-ul de revalidare trebuie protejat cu un secret pentru a preveni invalidare cache non-autorizata.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import { revalidatePath } from 'next/cache';\nimport { NextRequest } from 'next/server';\n\nexport async function GET(request) {\n  const { searchParams } = new URL(request.url);\n  const secret = searchParams.get('secret');\n  const path = searchParams.get('path');\n\n  // TODO: verifica secret === process.env.REVALIDATE_SECRET, returneaza 401 daca invalid\n  // TODO: verifica ca path exista, returneaza 400 daca nu\n  // TODO: apeleaza revalidatePath(path)\n  // TODO: returneaza { revalidated: true, path }\n}"
      }
    ]
  },

  {
    slug: "nextjs-mini-proiect-api-complet",
    title: "Mini Proiect BE — API Complet cu Auth",
    order: 30,
    theory: [
      {
        order: 1,
        title: "Arhitectura API RESTful in Next.js App Router",
        content: "Un API backend complet in Next.js App Router foloseste Route Handlers pentru endpoint-uri RESTful, Server Actions pentru mutatii din UI si middleware pentru autentificare globala.\n\nStructura recomandata pentru un proiect real:\n```\napp/\n  api/\n    auth/[...nextauth]/route.ts  -- NextAuth handler\n    users/\n      route.ts                   -- GET /api/users, POST /api/users\n      [id]/\n        route.ts                 -- GET, PUT, DELETE /api/users/:id\n    posts/\n      route.ts\n      [id]/route.ts\n    webhooks/\n      stripe/route.ts\nlib/\n  prisma.ts     -- PrismaClient singleton\n  auth.ts       -- NextAuth config\n  email.ts      -- Email helpers\n  validations.ts -- Zod schemas\nmiddleware.ts   -- Auth + rate limiting\n```\nPattern pentru Route Handlers:\n```ts\nimport { z } from 'zod';\nimport { auth } from '@/auth';\nimport { prisma } from '@/lib/prisma';\n\n// Zod schema pentru validare input\nconst createPostSchema = z.object({\n  title: z.string().min(3).max(200),\n  content: z.string().min(10),\n  tags: z.array(z.string()).optional(),\n});\n\nexport async function POST(req) {\n  // 1. Auth\n  const session = await auth();\n  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });\n\n  // 2. Validate\n  const body = await req.json();\n  const result = createPostSchema.safeParse(body);\n  if (!result.success) {\n    return Response.json({ error: result.error.flatten() }, { status: 422 });\n  }\n\n  // 3. Business logic\n  const post = await prisma.post.create({\n    data: { ...result.data, authorId: session.user.id },\n  });\n\n  return Response.json(post, { status: 201 });\n}\n```"
      },
      {
        order: 2,
        title: "Validare Input cu Zod",
        content: "Zod este libraria standard pentru validarea schemelor TypeScript-first. Fiecare endpoint care primeste date trebuie sa valideze inputul:\n\n```ts\nimport { z } from 'zod';\n\n// Schema definita o singura data, reutilizata\nexport const registerSchema = z.object({\n  email: z.string().email('Email invalid'),\n  password: z.string()\n    .min(8, 'Minim 8 caractere')\n    .regex(/[A-Z]/, 'Necesita cel putin o litera mare')\n    .regex(/[0-9]/, 'Necesita cel putin un cifra'),\n  name: z.string().min(2).max(50),\n});\n\n// TypeScript type inferit automat\ntype RegisterInput = z.infer<typeof registerSchema>;\n\n// safeParse nu arunca erori\nconst result = registerSchema.safeParse(userInput);\n\nif (!result.success) {\n  // result.error.flatten() ofera erori per-camp\n  console.log(result.error.flatten().fieldErrors);\n  // { email: ['Email invalid'], password: ['Minim 8 caractere'] }\n} else {\n  // result.data este type-safe: RegisterInput\n  await createUser(result.data);\n}\n```\nPartial si extend pentru actualizari:\n```ts\n// Schema pentru PATCH — toate campurile optionale\nexport const updatePostSchema = createPostSchema.partial();\n\n// Extindere schema existenta\nexport const adminCreatePostSchema = createPostSchema.extend({\n  featured: z.boolean().default(false),\n  scheduledAt: z.string().datetime().optional(),\n});\n```\nInterviu: 'De ce Zod in loc de validare manuala?' — type inference automata, mesaje de eroare clare, composable, reutilizabil intre client si server."
      },
      {
        order: 3,
        title: "Error Handling Global si Response Standards",
        content: "Un API consistent returneaza erori in format standardizat. Creeaza un helper centralizat:\n\n```ts\n// lib/api-response.ts\nexport function apiSuccess(data, status = 200) {\n  return Response.json({ success: true, data }, { status });\n}\n\nexport function apiError(message, status = 400, details = null) {\n  return Response.json(\n    { success: false, error: message, ...(details && { details }) },\n    { status }\n  );\n}\n\n// Coduri status standard:\n// 200 OK — cerere reusita\n// 201 Created — resursa creata\n// 400 Bad Request — input invalid\n// 401 Unauthorized — neautentificat\n// 403 Forbidden — neautorizat\n// 404 Not Found — resursa inexistenta\n// 409 Conflict — duplicat (ex: email existent)\n// 422 Unprocessable Entity — validare Zod esuata\n// 429 Too Many Requests — rate limit\n// 500 Internal Server Error — eroare neasteptata\n```\nWrapper pentru error handling global:\n```ts\nexport function withErrorHandling(handler) {\n  return async function(req, context) {\n    try {\n      return await handler(req, context);\n    } catch (error) {\n      console.error('API Error:', error);\n      if (error.code === 'P2025') { // Prisma: record not found\n        return apiError('Resursa nu a fost gasita', 404);\n      }\n      if (error.code === 'P2002') { // Prisma: unique constraint\n        return apiError('Inregistrarea exista deja', 409);\n      }\n      return apiError('Eroare interna', 500);\n    }\n  };\n}\n```"
      },
      {
        order: 4,
        title: "Testing API Routes cu Vitest",
        content: "Testarea route handlers in Next.js necesita mock-uri pentru Request si Response:\n\n```ts\n// __tests__/api/posts.test.ts\nimport { describe, it, expect, vi, beforeEach } from 'vitest';\nimport { POST } from '@/app/api/posts/route';\n\n// Mock Prisma\nvi.mock('@/lib/prisma', () => ({\n  prisma: {\n    post: {\n      create: vi.fn(),\n      findMany: vi.fn(),\n    },\n  },\n}));\n\n// Mock Auth\nvi.mock('@/auth', () => ({\n  auth: vi.fn(),\n}));\n\nimport { prisma } from '@/lib/prisma';\nimport { auth } from '@/auth';\n\ndescribe('POST /api/posts', () => {\n  beforeEach(() => {\n    vi.clearAllMocks();\n  });\n\n  it('returneaza 401 daca neautentificat', async () => {\n    auth.mockResolvedValue(null);\n    const req = new Request('http://localhost/api/posts', {\n      method: 'POST',\n      body: JSON.stringify({ title: 'Test', content: 'Content de test' }),\n    });\n    const res = await POST(req);\n    expect(res.status).toBe(401);\n  });\n\n  it('creeaza postul daca autentificat si date valide', async () => {\n    auth.mockResolvedValue({ user: { id: 'user1', role: 'USER' } });\n    prisma.post.create.mockResolvedValue({ id: 'post1', title: 'Test' });\n    // ...\n  });\n});\n```\nInterviu: 'Cum testezi Server Actions?' — apelezi functia direct (este o functie async), mock-uiesti dependentele (prisma, auth, revalidatePath)."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "Status 422 vs 400",
        question: "Cand returnezi status HTTP 422 in loc de 400 pentru erori de validare?",
        options: [
          "Sunt echivalente, folosesti oricare",
          "422 Unprocessable Entity — request well-formed (JSON valid) dar datele nu trec validarea semantica (ex: email invalid, parola prea scurta)",
          "422 este pentru erori server, 400 pentru erori client",
          "400 este pentru validare, 422 pentru autentificare"
        ],
        answer: "422 Unprocessable Entity — request well-formed (JSON valid) dar datele nu trec validarea semantica (ex: email invalid, parola prea scurta)",
        explanation: "400 Bad Request: request malformat (JSON invalid, parametri lipsa). 422 Unprocessable Entity: request valid sintactic dar invalid semantic (campuri cu valori gresite). Distinctia ajuta clientii API sa trateze erorile diferit.",
        difficulty: "medium"
      },
      {
        number: 2,
        name: "Zod safeParse",
        question: "Care este diferenta dintre `schema.parse()` si `schema.safeParse()` in Zod?",
        options: [
          "parse() este mai rapid",
          "parse() arunca ZodError la validare esuata; safeParse() returneaza { success, data } sau { success: false, error } fara a arunca",
          "safeParse() este sincron, parse() este asincron",
          "Nu exista diferenta"
        ],
        answer: "parse() arunca ZodError la validare esuata; safeParse() returneaza { success, data } sau { success: false, error } fara a arunca",
        explanation: "In Route Handlers, preferati safeParse() pentru a evita try/catch suplimentare si a controla explicit raspunsul de eroare. parse() este util in contexte unde vrei sa propagi eroarea mai sus.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "Prisma error codes",
        question: "Ce inseamna codul de eroare Prisma P2002?",
        options: [
          "Record not found",
          "Unique constraint violation — o inregistrare cu aceleasi valori unice exista deja",
          "Foreign key constraint violation",
          "Connection timeout"
        ],
        answer: "Unique constraint violation — o inregistrare cu aceleasi valori unice exista deja",
        explanation: "P2002 apare cand incerci sa creezi/actualizezi o inregistrare care ar viola o constrangere de unicitate (ex: email duplicat). Captezi aceasta eroare si returnezi 409 Conflict in loc de 500 Internal Server Error.",
        difficulty: "medium"
      },
      {
        number: 4,
        name: "withErrorHandling pattern",
        question: "Ce avantaj ofera pattern-ul `withErrorHandling(handler)` pentru Route Handlers?",
        options: [
          "Imbunatateste performanta",
          "Centralizeaza logica de error handling — toate erorile neasteptate sunt captate si convertite in raspunsuri API consistente",
          "Adauga logging automat",
          "Reduce codul boilerplate la declarare route"
        ],
        answer: "Centralizeaza logica de error handling — toate erorile neasteptate sunt captate si convertite in raspunsuri API consistente",
        explanation: "Fara wrapper, fiecare handler trebuie sa aiba try/catch cu logica identica. Wrapper-ul extrage logica comuna: captare erori Prisma cunoscute (P2025, P2002), logging, format standard al raspunsului de eroare.",
        difficulty: "medium"
      },
      {
        number: 5,
        name: "API route structure",
        question: "In Next.js App Router, cum implementezi toate metodele CRUD (GET list, POST create, GET by id, PUT update, DELETE) pentru resursa 'posts'?",
        options: [
          "Intr-un singur fisier app/api/posts.ts",
          "GET/POST in app/api/posts/route.ts si GET/PUT/DELETE in app/api/posts/[id]/route.ts",
          "Intr-un singur handler cu switch pe method",
          "In pages/api/posts/index.js si pages/api/posts/[id].js"
        ],
        answer: "GET/POST in app/api/posts/route.ts si GET/PUT/DELETE in app/api/posts/[id]/route.ts",
        explanation: "Conventie RESTful in App Router: resurse colectie (fara ID) in route.ts, resurse individuale (cu ID) in [id]/route.ts. Exporti GET, POST, PUT, PATCH, DELETE ca functii numite din aceleasi fisiere.",
        difficulty: "easy"
      },
      {
        number: 6,
        name: "Vitest mock",
        question: "De ce trebuie sa mock-uiesti Prisma in teste unitare pentru Route Handlers?",
        options: [
          "Deoarece Prisma nu functioneaza in Vitest",
          "Pentru a izola testul de baza de date — teste rapide, deterministe, fara efecte secundare in DB",
          "Deoarece conexiunea la MongoDB este lenta",
          "Deoarece Vitest nu suporta async"
        ],
        answer: "Pentru a izola testul de baza de date — teste rapide, deterministe, fara efecte secundare in DB",
        explanation: "Testele unitare trebuie sa fie independente de infrastructura externa. Mock-ul Prisma permite testarea logicii din handler fara BD reala, ruleaza in milisecunde si nu polueaza datele de test.",
        difficulty: "medium"
      },
      {
        number: 7,
        name: "P2025 Prisma",
        question: "Ce status HTTP trebuie returnat cand primesti eroarea Prisma P2025 (record not found)?",
        options: [
          "400 Bad Request",
          "404 Not Found",
          "500 Internal Server Error",
          "204 No Content"
        ],
        answer: "404 Not Found",
        explanation: "P2025 inseamna ca nu a existat nicio inregistrare cu ID-ul specificat. Clientul API trebuie sa stie ca resursa nu exista (404), nu ca a existat o eroare server (500).",
        difficulty: "easy"
      },
      {
        number: 8,
        name: "Cod: Route GET cu auth si validare",
        question: "Scrie un route handler GET /api/posts/[id] care returneaza 401 daca neautentificat, 404 daca postul nu exista si postul cu autorul inclus daca totul e OK.",
        options: [],
        answer: "",
        explanation: "Ordinea verificarilor: 1. Auth 2. Fetch date 3. Not found check 4. Return data.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import { auth } from '@/auth';\nimport { prisma } from '@/lib/prisma';\n\nexport async function GET(req, { params }) {\n  // TODO: verifica autentificarea -> 401\n  // TODO: cauta postul cu prisma (include author)\n  // TODO: daca nu exista -> 404\n  // TODO: returneaza postul cu 200\n}"
      },
      {
        number: 9,
        name: "Cod: Zod schema pentru create",
        question: "Scrie schema Zod pentru crearea unui post cu: title (3-200 chars), content (min 10 chars), tags (array optional de string-uri) si published (boolean, default false).",
        options: [],
        answer: "",
        explanation: "Zod permite validare complexa cu mesaje custom, default values si combinatii de tipuri.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "import { z } from 'zod';\n\nexport const createPostSchema = z.object({\n  // TODO: title: string, min 3, max 200\n  // TODO: content: string, min 10\n  // TODO: tags: array de string-uri, optional\n  // TODO: published: boolean, default false\n});\n\nexport type CreatePostInput = z.infer<typeof createPostSchema>;"
      },
      {
        number: 10,
        name: "Cod: POST handler complet",
        question: "Scrie un route handler POST /api/posts cu auth, validare Zod si creare in DB, returnand 422 pentru validare esuata si 201 la succes.",
        options: [],
        answer: "",
        explanation: "Pattern complet: auth -> safeParse -> create -> return. Fiecare pas poate returna eroare specifica.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import { auth } from '@/auth';\nimport { prisma } from '@/lib/prisma';\nimport { createPostSchema } from '@/lib/validations';\n\nexport async function POST(req) {\n  // TODO: 1. verifica auth -> 401\n  // TODO: 2. parseaza body, safeParse cu schema\n  // TODO: 3. daca invalid -> 422 cu result.error.flatten()\n  // TODO: 4. creeaza postul cu authorId din session\n  // TODO: 5. returneaza postul creat cu status 201\n}"
      },
      {
        number: 11,
        name: "Cod: withErrorHandling wrapper",
        question: "Scrie functia withErrorHandling(handler) care inconjoara un route handler in try/catch si trateaza erorile Prisma P2025 (404) si P2002 (409).",
        options: [],
        answer: "",
        explanation: "Wrapper-ul centralizat previne duplicarea codului de error handling in fiecare route.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "export function withErrorHandling(handler) {\n  return async function(req, context) {\n    try {\n      return await handler(req, context);\n    } catch (error) {\n      console.error('API Error:', error);\n      // TODO: daca error.code === 'P2025' -> 404\n      // TODO: daca error.code === 'P2002' -> 409\n      // TODO: altfel -> 500\n    }\n  };\n}"
      },
      {
        number: 12,
        name: "Cod: DELETE cu ownership check",
        question: "Scrie un handler DELETE /api/posts/[id] care sterge postul DOAR daca autorul este utilizatorul curent sau userul are rol ADMIN.",
        options: [],
        answer: "",
        explanation: "Ownership check previne ca un utilizator sa stearga posturile altora — eroare de securitate comuna.",
        difficulty: "hard",
        type: "coding",
        language: "javascript",
        starterCode: "import { auth } from '@/auth';\nimport { prisma } from '@/lib/prisma';\n\nexport async function DELETE(req, { params }) {\n  const session = await auth();\n  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });\n\n  // TODO: gaseste postul\n  // TODO: verifica: session.user.id === post.authorId SAU session.user.role === 'ADMIN'\n  // TODO: daca nu are permisiunea -> 403\n  // TODO: sterge postul\n  // TODO: returneaza 204 No Content\n}"
      },
      {
        number: 13,
        name: "Cod: Pagination in GET list",
        question: "Scrie handler-ul GET /api/posts cu paginatie bazata pe query params 'page' (default 1) si 'limit' (default 10, max 50).",
        options: [],
        answer: "",
        explanation: "Paginatia este esentiala pentru API-uri cu date voluminoase. Limitarea maxima previne abuse.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "import { prisma } from '@/lib/prisma';\n\nexport async function GET(req) {\n  const { searchParams } = new URL(req.url);\n  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));\n  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '10')));\n  const skip = (page - 1) * limit;\n\n  // TODO: prisma.post.findMany cu skip, take: limit\n  // TODO: prisma.post.count pentru total\n  // TODO: returneaza { data: posts, pagination: { page, limit, total, totalPages } }\n}"
      },
      {
        number: 14,
        name: "Cod: Test pentru POST route",
        question: "Scrie un test Vitest care verifica ca POST /api/posts returneaza 401 cand utilizatorul nu este autentificat.",
        options: [],
        answer: "",
        explanation: "Testul unitare pentru auth trebuie sa fie primul — daca auth esueaza, celelalte teste nu au sens.",
        difficulty: "medium",
        type: "coding",
        language: "javascript",
        starterCode: "import { describe, it, expect, vi } from 'vitest';\nimport { POST } from '@/app/api/posts/route';\n\nvi.mock('@/auth', () => ({ auth: vi.fn() }));\nvi.mock('@/lib/prisma', () => ({ prisma: { post: { create: vi.fn() } } }));\n\nimport { auth } from '@/auth';\n\ndescribe('POST /api/posts', () => {\n  it('returneaza 401 daca neautentificat', async () => {\n    // TODO: auth.mockResolvedValue(null)\n    // TODO: creeaza Request mock cu POST si body JSON\n    // TODO: apeleaza POST(req)\n    // TODO: expect(res.status).toBe(401)\n  });\n});"
      },
      {
        number: 15,
        name: "API versioning",
        question: "Care este cea mai simpla metoda de a versiona un API Next.js (ex: v1, v2)?",
        options: [
          "Prin header-ul API-Version",
          "Prin prefixul URL: /api/v1/posts, /api/v2/posts — fiecare versiune in propriul director",
          "Prin query parameter: /api/posts?version=1",
          "Next.js nu suporta API versioning"
        ],
        answer: "Prin prefixul URL: /api/v1/posts, /api/v2/posts — fiecare versiune in propriul director",
        explanation: "Versionarea prin URL este cea mai simpla si explicita: app/api/v1/posts/route.ts si app/api/v2/posts/route.ts. Clientii pot migra la ritmul lor. Alternativa cu headers este mai 'pura' RESTful dar mai greu de folosit din browser.",
        difficulty: "medium"
      }
    ]
  }
];

module.exports = { nextjsFrontendMore2, nextjsBackendMore2 };
