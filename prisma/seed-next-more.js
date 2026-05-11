// Next.js Frontend lessons 16-25 and Backend lessons 16-25
const nextjsFrontendMore = [
  {
    slug: "nextjs-frontend",
    title: "Advanced Data Fetching Patterns",
    order: 16,
    theory: [
      {
        order: 1,
        title: "Server Components and Data Fetching",
        content: `In Next.js App Router, Server Components fetch data directly without useEffect.

\`\`\`tsx
// app/products/page.tsx - Server Component
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 } // ISR: revalidate every hour
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <ul>
      {products.map((p: Product) => (
        <li key={p.id}>{p.name} — \${p.price}</li>
      ))}
    </ul>
  );
}
\`\`\``,
      },
      {
        order: 2,
        title: "Parallel and Sequential Data Fetching",
        content: `Fetch data in parallel to avoid waterfalls.

\`\`\`tsx
// Waterfall (slow) - sequential
async function Page({ params }) {
  const user = await getUser(params.id);        // waits
  const posts = await getUserPosts(params.id);   // waits for user first
  return <Profile user={user} posts={posts} />;
}

// Parallel (fast) - concurrent
async function Page({ params }) {
  const [user, posts] = await Promise.all([
    getUser(params.id),
    getUserPosts(params.id),
  ]);
  return <Profile user={user} posts={posts} />;
}

// Preloading for even more parallelism
function preloadUser(id: string) {
  void getUser(id); // start fetching, don't await
}

export default async function Page({ params }) {
  preloadUser(params.id); // kick off early
  const posts = await getUserPosts(params.id);
  const user = await getUser(params.id); // likely already cached
  return <Profile user={user} posts={posts} />;
}
\`\`\``,
      },
      {
        order: 3,
        title: "Streaming with Suspense",
        content: `Stream content progressively to users instead of waiting for all data.

\`\`\`tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* This renders immediately */}
      <StaticSummary />

      {/* These stream in as data arrives */}
      <Suspense fallback={<Skeleton className="h-32" />}>
        <RevenueChart />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-48" />}>
        <LatestInvoices />
      </Suspense>
    </div>
  );
}

// Each component fetches its own data
async function RevenueChart() {
  const revenue = await fetchRevenue(); // independent fetch
  return <Chart data={revenue} />;
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Server Component fetch",
        question: "In Next.js App Router, where do Server Components fetch data?",
        options: ["In useEffect hooks", "Directly in the async component function body", "In a separate API route", "In getServerSideProps"],
        answer: "Directly in the async component function body",
        explanation: "Server Components can be async functions and await data directly — no useEffect or client-side fetching needed.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "Promise.all benefit",
        question: "Why use `Promise.all([getUser(), getPosts()])` instead of awaiting sequentially?",
        options: ["It reduces code", "It runs both fetches concurrently, halving wait time", "It's required by Next.js", "Sequential is actually faster"],
        answer: "It runs both fetches concurrently, halving wait time",
        explanation: "Sequential awaits create a waterfall. Promise.all fires all requests simultaneously.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "Suspense streaming",
        question: "What does wrapping a component in `<Suspense>` enable in Next.js?",
        options: ["Lazy loading of JS bundles", "Progressive streaming — the page renders while data loads", "Client-side caching", "Authentication guards"],
        answer: "Progressive streaming — the page renders while data loads",
        explanation: "Suspense lets Next.js stream HTML progressively: the shell renders immediately, bounded components stream in when ready.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "nextjs-frontend",
    title: "Client Components and State Management",
    order: 17,
    theory: [
      {
        order: 1,
        title: "When to use Client Components",
        content: `Client Components are needed for interactivity, browser APIs, and React hooks.

\`\`\`tsx
// 'use client' marks the component as client-side
'use client';

import { useState, useEffect } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}

// Use client components only where needed
// app/page.tsx (Server Component)
import { Counter } from './counter'; // Client Component

export default function Page() {
  return (
    <main>
      <h1>My Page</h1>  {/* Server-rendered */}
      <Counter />        {/* Client island */}
    </main>
  );
}
\`\`\``,
      },
      {
        order: 2,
        title: "Zustand for Global State",
        content: `Zustand provides lightweight global state for Client Components.

\`\`\`tsx
// npm install zustand
import { create } from 'zustand';

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,

  addItem: (item) => set((state) => {
    const items = [...state.items, item];
    return { items, total: items.reduce((s, i) => s + i.price, 0) };
  }),

  removeItem: (id) => set((state) => {
    const items = state.items.filter(i => i.id !== id);
    return { items, total: items.reduce((s, i) => s + i.price, 0) };
  }),

  clearCart: () => set({ items: [], total: 0 }),
}));

// Usage in any Client Component
'use client';
function CartButton() {
  const { items, addItem } = useCartStore();
  return <button>{items.length} items in cart</button>;
}
\`\`\``,
      },
      {
        order: 3,
        title: "URL State with useSearchParams",
        content: `Store UI state in URL params for shareable, bookmarkable views.

\`\`\`tsx
'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(\`\${pathname}?\${params.toString()}\`);
  }

  return (
    <input
      defaultValue={searchParams.get('query') ?? ''}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}

// Server Component reads the param
export default function Page({
  searchParams,
}: {
  searchParams: { query?: string }
}) {
  const query = searchParams.query ?? '';
  // fetch filtered data with query
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "use client directive",
        question: "When is `'use client'` directive required in a Next.js component?",
        options: ["Always", "When using React hooks, event handlers, or browser APIs", "When fetching data", "Only for forms"],
        answer: "When using React hooks, event handlers, or browser APIs",
        explanation: "'use client' marks the component boundary for client-side JS — needed for useState, onClick, useEffect, etc.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "Zustand vs useState",
        question: "When should you choose Zustand over useState for state management?",
        options: ["Always — Zustand is better", "When state needs to be shared across multiple unrelated components", "For form state", "When state is local to one component"],
        answer: "When state needs to be shared across multiple unrelated components",
        explanation: "useState is for local component state. Zustand manages global state accessible from anywhere without prop drilling.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "URL state benefit",
        question: "What advantage does storing search/filter state in URL params have?",
        options: ["Faster rendering", "State is shareable and preserved on browser back/forward", "Avoids JavaScript", "Less re-renders"],
        answer: "State is shareable and preserved on browser back/forward",
        explanation: "URL params make state bookmarkable, shareable via link, and naturally persistent across navigation.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "nextjs-frontend",
    title: "Forms and Server Actions",
    order: 18,
    theory: [
      {
        order: 1,
        title: "Server Actions",
        content: `Server Actions run server-side code from form submissions — no API route needed.

\`\`\`tsx
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createTodo(formData: FormData) {
  const title = formData.get('title') as string;

  if (!title?.trim()) {
    return { error: 'Title is required' };
  }

  await db.todo.create({ data: { title } });
  revalidatePath('/todos'); // revalidate cached page
}

// app/todos/page.tsx
import { createTodo } from '../actions';

export default function TodosPage() {
  return (
    <form action={createTodo}>
      <input name="title" placeholder="New todo..." required />
      <button type="submit">Add</button>
    </form>
  );
}
\`\`\``,
      },
      {
        order: 2,
        title: "useFormState and useFormStatus",
        content: `React hooks for progressive form enhancements.

\`\`\`tsx
'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { createTodo } from '../actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Adding...' : 'Add Todo'}
    </button>
  );
}

export function TodoForm() {
  const [state, formAction] = useFormState(createTodo, null);

  return (
    <form action={formAction}>
      {state?.error && (
        <p className="text-red-500">{state.error}</p>
      )}
      <input name="title" placeholder="New todo..." />
      <SubmitButton />
    </form>
  );
}
\`\`\``,
      },
      {
        order: 3,
        title: "Form Validation with Zod",
        content: `Use Zod for schema validation in Server Actions.

\`\`\`tsx
// npm install zod
import { z } from 'zod';

const CreateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().optional(),
});

'use server';
export async function createTodo(prevState: any, formData: FormData) {
  const raw = {
    title: formData.get('title'),
    priority: formData.get('priority'),
    dueDate: formData.get('dueDate'),
  };

  const result = CreateTodoSchema.safeParse(raw);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  await db.todo.create({ data: result.data });
  revalidatePath('/todos');
  return { success: true };
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Server Action directive",
        question: "What directive marks a function as a Server Action?",
        options: ["'use server'", "'use action'", "@ServerAction", "'use async'"],
        answer: "'use server'",
        explanation: "'use server' at the top of a file or function marks it as a Server Action that runs on the server.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "revalidatePath purpose",
        question: "What does `revalidatePath('/todos')` do after a Server Action?",
        options: ["Redirects to /todos", "Clears the cache for /todos, triggering a fresh fetch on next visit", "Creates a new page", "Validates the /todos route"],
        answer: "Clears the cache for /todos, triggering a fresh fetch on next visit",
        explanation: "revalidatePath purges the Next.js cache for the given path so the updated data is fetched on the next request.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "useFormStatus usage",
        question: "What does `useFormStatus()` provide and where must it be used?",
        options: [
          "Form values — can be used anywhere",
          "Pending state of the parent form — must be used in a child component of the form",
          "Form validation errors",
          "The form's action URL",
        ],
        answer: "Pending state of the parent form — must be used in a child component of the form",
        explanation: "useFormStatus reads the pending state of the nearest parent form submission and must be in a child component.",
        difficulty: "hard",
      },
    ],
  },
  {
    slug: "nextjs-frontend",
    title: "Authentication with NextAuth.js",
    order: 19,
    theory: [
      {
        order: 1,
        title: "Setting up NextAuth.js v5",
        content: `NextAuth.js (Auth.js) handles authentication with multiple providers.

\`\`\`tsx
// npm install next-auth@beta
// auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        const user = await getUserByEmail(credentials.email as string);
        if (!user) return null;
        const valid = await verifyPassword(credentials.password as string, user.passwordHash);
        return valid ? user : null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
});

// app/api/auth/[...nextauth]/route.ts
export { handlers as GET, handlers as POST } from '@/auth';
\`\`\``,
      },
      {
        order: 2,
        title: "Protecting Routes with Middleware",
        content: `Use Next.js Middleware to protect routes before rendering.

\`\`\`tsx
// middleware.ts (root)
import { auth } from './auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard');

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

// Access session in Server Components
import { auth } from '@/auth';

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/auth/login');

  return <div>Welcome, {session.user?.name}!</div>;
}
\`\`\``,
      },
      {
        order: 3,
        title: "Sign In and Sign Out",
        content: `Build login/logout UI with Server Actions.

\`\`\`tsx
// Sign In form
import { signIn } from '@/auth';

export default function LoginPage() {
  return (
    <form action={async (formData) => {
      'use server';
      await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirectTo: '/dashboard',
      });
    }}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Sign In</button>
    </form>
  );
}

// OAuth Sign In button
import { signIn } from '@/auth';

export function GitHubSignIn() {
  return (
    <form action={async () => {
      'use server';
      await signIn('github', { redirectTo: '/dashboard' });
    }}>
      <button type="submit">Sign in with GitHub</button>
    </form>
  );
}

// Sign Out
import { signOut } from '@/auth';
export function SignOutButton() {
  return (
    <form action={async () => { 'use server'; await signOut(); }}>
      <button type="submit">Sign Out</button>
    </form>
  );
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Middleware protection",
        question: "Why handle authentication in Next.js Middleware rather than in each page?",
        options: ["Middleware is faster", "Centralized protection runs before any page renders, preventing unauthorized access", "Pages can't check auth", "Middleware is required by NextAuth"],
        answer: "Centralized protection runs before any page renders, preventing unauthorized access",
        explanation: "Middleware intercepts requests before they hit pages, enabling one place to protect multiple routes.",
        difficulty: "medium",
      },
      {
        number: 2,
        name: "Credentials provider",
        question: "What does the `authorize` function in Credentials provider do?",
        options: ["Generates a JWT token", "Validates user credentials and returns the user object or null", "Creates a new user", "Sends a verification email"],
        answer: "Validates user credentials and returns the user object or null",
        explanation: "authorize receives the submitted credentials, verifies them (e.g., checks the database), and returns the user or null.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "Session in Server Component",
        question: "How do you access the current session in a Server Component with NextAuth v5?",
        options: ["useSession() hook", "getServerSession()", "await auth()", "cookies().get('session')"],
        answer: "await auth()",
        explanation: "NextAuth v5 exports an `auth()` function that returns the session in Server Components, Actions, and Route Handlers.",
        difficulty: "easy",
      },
    ],
  },
  {
    slug: "nextjs-frontend",
    title: "Performance Optimization",
    order: 20,
    theory: [
      {
        order: 1,
        title: "Image and Font Optimization",
        content: `Next.js provides built-in components for optimized images and fonts.

\`\`\`tsx
// next/image - automatic WebP, lazy loading, layout shift prevention
import Image from 'next/image';

// Local image
import hero from '@/public/hero.jpg';

<Image
  src={hero}
  alt="Hero image"
  priority // above-the-fold images
  className="rounded-lg"
/>

// Remote image (add to next.config.ts)
<Image
  src="https://cdn.example.com/photo.jpg"
  alt="Remote"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// next/font - zero layout shift, GDPR compliant (no external request)
import { Inter, Geist_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default function Layout({ children }) {
  return (
    <html className={inter.className}>
      <body className={mono.variable}>{children}</body>
    </html>
  );
}
\`\`\``,
      },
      {
        order: 2,
        title: "Code Splitting and Dynamic Imports",
        content: `Split your bundle to load only what's needed.

\`\`\`tsx
import dynamic from 'next/dynamic';

// Lazy load heavy component (not SSR)
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false, // client-only (uses browser APIs)
});

// Lazy load library
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Conditional loading
export default function Page({ isAdmin }) {
  const AdminPanel = isAdmin
    ? dynamic(() => import('@/components/AdminPanel'))
    : null;

  return (
    <div>
      <MainContent />
      {AdminPanel && <AdminPanel />}
    </div>
  );
}

// React.lazy equivalent in Client Components
import { lazy, Suspense } from 'react';
const LazyModal = lazy(() => import('./Modal'));
\`\`\``,
      },
      {
        order: 3,
        title: "Caching Strategies",
        content: `Next.js provides multiple caching layers.

\`\`\`tsx
// fetch cache options
fetch(url, { cache: 'force-cache' });     // default, cache indefinitely
fetch(url, { cache: 'no-store' });        // never cache (dynamic)
fetch(url, { next: { revalidate: 60 } }); // ISR: revalidate every 60s
fetch(url, { next: { tags: ['products'] } }); // tag-based

// On-demand revalidation
import { revalidatePath, revalidateTag } from 'next/cache';

// Revalidate a tag
revalidateTag('products');

// unstable_cache for non-fetch operations (DB, etc.)
import { unstable_cache } from 'next/cache';

const getProducts = unstable_cache(
  async () => db.product.findMany(),
  ['products-list'],
  { revalidate: 3600, tags: ['products'] }
);

// Route segment config
export const dynamic = 'force-dynamic'; // opt out of caching
export const revalidate = 3600;         // ISR for whole page
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "next/image benefit",
        question: "What does `next/image` automatically provide compared to an `<img>` tag?",
        options: ["Larger images", "Automatic WebP conversion, lazy loading, and layout shift prevention", "Only lazy loading", "Hosting on CDN"],
        answer: "Automatic WebP conversion, lazy loading, and layout shift prevention",
        explanation: "next/image optimizes size/format, lazy-loads off-screen images, and reserves space to prevent layout shifts.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "dynamic import with ssr:false",
        question: "When would you use `dynamic(import('./Component'), { ssr: false })`?",
        options: ["For all components", "When the component uses browser-only APIs (window, document, localStorage)", "For server-side rendering", "To improve SEO"],
        answer: "When the component uses browser-only APIs (window, document, localStorage)",
        explanation: "ssr:false prevents the component from rendering on the server where browser APIs aren't available.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "revalidateTag",
        question: "What does `revalidateTag('products')` do?",
        options: ["Deletes product data", "Invalidates all cached fetch calls tagged with 'products'", "Reloads the products page", "Creates a new cache entry"],
        answer: "Invalidates all cached fetch calls tagged with 'products'",
        explanation: "Tag-based revalidation clears all cache entries with that tag, triggering fresh fetches on next access.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "nextjs-frontend",
    title: "Internationalization (i18n)",
    order: 21,
    theory: [
      {
        order: 1,
        title: "i18n with next-intl",
        content: `Add multilingual support using next-intl.

\`\`\`tsx
// npm install next-intl

// messages/en.json
{
  "homepage": {
    "title": "Welcome to our store",
    "subtitle": "Discover amazing products"
  },
  "cart": {
    "items": "{count, plural, =0 {No items} one {# item} other {# items}}"
  }
}

// messages/ro.json
{
  "homepage": {
    "title": "Bun venit în magazinul nostru",
    "subtitle": "Descoperă produse uimitoare"
  }
}

// i18n.ts
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'ro'];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();
  return {
    messages: (await import(\`../messages/\${locale}.json\`)).default
  };
});
\`\`\``,
      },
      {
        order: 2,
        title: "Locale Routing and Translation Usage",
        content: `Set up locale-based routing with [locale] segment.

\`\`\`tsx
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function LocaleLayout({ children, params: { locale } }) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// app/[locale]/page.tsx
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('homepage');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </div>
  );
}

// Locale switcher
import { useRouter, usePathname } from 'next-intl/client';

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <select onChange={(e) => router.replace(pathname, { locale: e.target.value })}>
      <option value="en">English</option>
      <option value="ro">Română</option>
    </select>
  );
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "i18n locale routing",
        question: "How does next-intl organize locale-specific pages?",
        options: ["Separate domains per locale", "A [locale] dynamic segment in the app directory", "Query params (?lang=ro)", "Separate Next.js projects"],
        answer: "A [locale] dynamic segment in the app directory",
        explanation: "next-intl uses app/[locale]/ as the root, so /en/products and /ro/products automatically serve the correct locale.",
        difficulty: "medium",
      },
      {
        number: 2,
        name: "useTranslations",
        question: "What does `useTranslations('homepage')` return?",
        options: ["The full messages object", "A function t() that resolves message keys within the 'homepage' namespace", "A React state", "The current locale"],
        answer: "A function t() that resolves message keys within the 'homepage' namespace",
        explanation: "useTranslations returns a typed function that looks up messages by key within the specified namespace.",
        difficulty: "easy",
      },
    ],
  },
  {
    slug: "nextjs-frontend",
    title: "Testing Next.js Applications",
    order: 22,
    theory: [
      {
        order: 1,
        title: "Unit Testing with Jest and Testing Library",
        content: `Test React components in isolation.

\`\`\`tsx
// npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom

// jest.config.ts
import type { Config } from 'jest';
const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
};
export default config;

// __tests__/Counter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from '@/components/Counter';

describe('Counter', () => {
  it('renders initial count', () => {
    render(<Counter />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  it('increments on button click', () => {
    render(<Counter />);
    fireEvent.click(screen.getByRole('button', { name: '+1' }));
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
\`\`\``,
      },
      {
        order: 2,
        title: "E2E Testing with Playwright",
        content: `Playwright tests the full application in real browsers.

\`\`\`tsx
// npm install -D @playwright/test

// playwright.config.ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});

// tests/todo.spec.ts
import { test, expect } from '@playwright/test';

test('user can create a todo', async ({ page }) => {
  await page.goto('/todos');

  await page.fill('input[name="title"]', 'Buy groceries');
  await page.click('button[type="submit"]');

  await expect(page.getByText('Buy groceries')).toBeVisible();
});

test('user can complete a todo', async ({ page }) => {
  await page.goto('/todos');

  const todo = page.getByTestId('todo-item').first();
  await todo.getByRole('checkbox').click();
  await expect(todo).toHaveClass(/completed/);
});

// Run: npx playwright test
// npx playwright test --ui  (visual mode)
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Testing Library query",
        question: "Why prefer `getByRole` over `getByTestId` in React Testing Library?",
        options: ["getByRole is faster", "It tests actual accessibility — what users and screen readers see", "getByTestId doesn't work in Next.js", "getByRole has more options"],
        answer: "It tests actual accessibility — what users and screen readers see",
        explanation: "Role-based queries mirror how users navigate and how assistive technologies work, making tests more meaningful.",
        difficulty: "medium",
      },
      {
        number: 2,
        name: "Playwright vs Jest",
        question: "What is the key difference between Jest + RTL tests and Playwright tests?",
        options: [
          "Jest tests run in a real browser",
          "Jest tests unit-test components in a simulated DOM; Playwright tests the full app in a real browser",
          "Playwright only works on Chrome",
          "They are identical",
        ],
        answer: "Jest tests unit-test components in a simulated DOM; Playwright tests the full app in a real browser",
        explanation: "Jest+RTL uses jsdom for fast, isolated component tests. Playwright drives real browsers for end-to-end user flow testing.",
        difficulty: "easy",
      },
    ],
  },
  {
    slug: "nextjs-frontend",
    title: "Deployment and CI/CD",
    order: 23,
    theory: [
      {
        order: 1,
        title: "Deploying to Vercel",
        content: `Vercel is the native deployment platform for Next.js.

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Deploy to production
vercel --prod

# Pull environment variables
vercel env pull .env.local
\`\`\`

\`\`\`tsx
// next.config.ts — production settings
import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.example.com' }
    ],
  },
  // Output modes
  // output: 'standalone'  // Docker deployment
  // output: 'export'      // Static HTML export (no server features)
};

export default config;
\`\`\``,
      },
      {
        order: 2,
        title: "Environment Variables",
        content: `Manage environment variables safely across environments.

\`\`\`bash
# .env.local (git-ignored — local only)
DATABASE_URL=postgresql://localhost/dev
NEXTAUTH_SECRET=your-secret-here

# .env (git-committed — default values)
NEXT_PUBLIC_APP_NAME=MyApp
\`\`\`

\`\`\`tsx
// Server-only (never sent to client)
const dbUrl = process.env.DATABASE_URL;

// Client-accessible (NEXT_PUBLIC_ prefix)
const appName = process.env.NEXT_PUBLIC_APP_NAME;

// Type-safe env with @t3-oss/env-nextjs
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(32),
  },
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
});
\`\`\``,
      },
      {
        order: 3,
        title: "GitHub Actions CI/CD",
        content: `Automate testing and deployment with GitHub Actions.

\`\`\`yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run type-check
      - run: npm test
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.ORG_ID }}
          vercel-project-id: \${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "NEXT_PUBLIC_ prefix",
        question: "What does the `NEXT_PUBLIC_` prefix on an environment variable do?",
        options: ["Encrypts the variable", "Makes it accessible in client-side JavaScript code", "Marks it as required", "Stores it in cookies"],
        answer: "Makes it accessible in client-side JavaScript code",
        explanation: "Next.js inlines NEXT_PUBLIC_ variables into the client bundle at build time — never use it for secrets.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "CI/CD pipeline purpose",
        question: "What is the main benefit of a CI/CD pipeline for a Next.js project?",
        options: ["Makes the app faster", "Automatically runs tests and deploys on every push, catching regressions early", "Provides free hosting", "Removes the need for environment variables"],
        answer: "Automatically runs tests and deploys on every push, catching regressions early",
        explanation: "CI runs tests before merging and CD deploys automatically after passing, reducing manual steps and human error.",
        difficulty: "easy",
      },
    ],
  },
  {
    slug: "nextjs-frontend",
    title: "Next.js Frontend Project: E-Commerce Store",
    order: 24,
    theory: [
      {
        order: 1,
        title: "Project Overview",
        content: `Build a complete e-commerce store front-end combining all learned concepts.

\`\`\`
ecommerce-store/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx     (locale layout + providers)
│   │   ├── page.tsx       (homepage)
│   │   ├── products/
│   │   │   ├── page.tsx   (product listing with search/filter)
│   │   │   └── [id]/
│   │   │       └── page.tsx (product detail)
│   │   └── cart/
│   │       └── page.tsx   (cart page)
│   └── api/
│       └── auth/[...nextauth]/route.ts
├── components/
│   ├── ProductCard.tsx    (Server Component)
│   ├── AddToCartButton.tsx (Client Component)
│   ├── CartSidebar.tsx    (Client Component, Zustand)
│   └── SearchBar.tsx      (Client Component, URL state)
├── actions/
│   └── cart.ts            (Server Actions)
└── lib/
    └── store.ts           (Zustand cart store)
\`\`\``,
      },
      {
        order: 2,
        title: "Key Implementation Patterns",
        content: `\`\`\`tsx
// Product listing with Suspense streaming
export default function ProductsPage({ searchParams }) {
  const query = searchParams.query ?? '';
  const category = searchParams.category ?? 'all';

  return (
    <div>
      <SearchBar />
      <CategoryFilter />
      <Suspense key={query + category} fallback={<ProductsSkeleton />}>
        <ProductsList query={query} category={category} />
      </Suspense>
    </div>
  );
}

// Optimistic updates for cart
'use client';
import { useOptimistic } from 'react';
import { addToCart } from '@/actions/cart';

export function AddToCartButton({ product }) {
  const [optimisticCart, addOptimistic] = useOptimistic(
    cart,
    (state, item) => [...state, item]
  );

  async function handleAdd() {
    addOptimistic(product); // instant UI update
    await addToCart(product.id); // then persist
  }

  return <button onClick={handleAdd}>Add to Cart</button>;
}

// Image gallery with next/image
<div className="grid grid-cols-2 gap-2">
  {images.map((img, i) => (
    <Image
      key={img.id}
      src={img.url}
      alt={img.alt}
      width={400}
      height={400}
      priority={i === 0}
      className="rounded-lg object-cover"
    />
  ))}
</div>
\`\`\``,
      },
      {
        order: 3,
        title: "Performance and Deployment",
        content: `Final optimizations and deployment checklist.

\`\`\`tsx
// Metadata for SEO
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      images: [product.image],
    },
  };
}

// generateStaticParams for popular products
export async function generateStaticParams() {
  const products = await getTopProducts(100);
  return products.map(p => ({ id: p.id.toString() }));
}

// Deployment checklist
// ✅ Environment variables set in Vercel dashboard
// ✅ Database connection string configured
// ✅ NextAuth NEXTAUTH_URL and NEXTAUTH_SECRET set
// ✅ Images domains in next.config.ts
// ✅ Analytics with @vercel/analytics
// ✅ Speed Insights with @vercel/speed-insights
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Suspense key prop",
        question: "Why use `<Suspense key={query + category}>` with a changing key?",
        options: ["For unique identification", "Forces a new Suspense boundary (remount) when search changes, re-triggering the loading state", "Improves performance", "Required by Next.js"],
        answer: "Forces a new Suspense boundary (remount) when search changes, re-triggering the loading state",
        explanation: "Changing the key forces React to unmount and remount the Suspense boundary, showing the fallback for each new search.",
        difficulty: "hard",
      },
      {
        number: 2,
        name: "useOptimistic purpose",
        question: "What does `useOptimistic` do in React?",
        options: ["Caches API results", "Shows an optimistic (immediate) UI update before the server confirms the change", "Delays rendering", "Batches state updates"],
        answer: "Shows an optimistic (immediate) UI update before the server confirms the change",
        explanation: "useOptimistic updates the UI immediately for perceived performance, then reconciles when the server responds.",
        difficulty: "hard",
      },
      {
        number: 3,
        name: "generateStaticParams",
        question: "What does `generateStaticParams` do in a dynamic route?",
        options: ["Generates URL parameters at runtime", "Pre-generates static pages for specified params at build time", "Validates URL parameters", "Creates redirect rules"],
        answer: "Pre-generates static pages for specified params at build time",
        explanation: "generateStaticParams tells Next.js which dynamic route values to pre-render as static pages during the build.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "nextjs-frontend",
    title: "Next.js Frontend Mastery Recap",
    order: 25,
    theory: [
      {
        order: 1,
        title: "App Router Mental Model",
        content: `The core mental model for Next.js App Router.

\`\`\`
Server vs Client rendering decision tree:

Does the component need:
  - useState / useReducer / useEffect?    → 'use client'
  - onClick / onChange event handlers?    → 'use client'
  - Browser APIs (window, localStorage)?  → 'use client'
  - Custom React hooks?                   → depends on the hook

Otherwise → Server Component (default)

Server Component benefits:
  - Data fetching with zero bundle size impact
  - Direct database/filesystem access
  - No hydration cost
  - Better initial page load

Push 'use client' as deep in the tree as possible!
\`\`\``,
      },
      {
        order: 2,
        title: "Rendering Strategy Guide",
        content: `Choosing the right rendering strategy per page.

| Strategy | Config | Use case |
|----------|--------|----------|
| Static (SSG) | default | Marketing pages, docs |
| ISR | \`revalidate: N\` | Product listings, blog |
| Dynamic SSR | \`dynamic: 'force-dynamic'\` | Dashboard, real-time data |
| Client-side | \`'use client'\` + SWR/React Query | Highly interactive UI |

\`\`\`tsx
// Per-page ISR
export const revalidate = 3600; // revalidate hourly

// Per-fetch ISR
await fetch(url, { next: { revalidate: 60 } });

// Force dynamic for personalized pages
export const dynamic = 'force-dynamic';

// Static with typed params
export async function generateStaticParams() {
  return [{ slug: 'about' }, { slug: 'pricing' }];
}
\`\`\``,
      },
      {
        order: 3,
        title: "Production Checklist",
        content: `Before deploying to production, verify these items.

\`\`\`
Performance:
  ✅ next/image for all images
  ✅ next/font for web fonts
  ✅ Code split heavy components with dynamic()
  ✅ Suspense boundaries for streaming
  ✅ Appropriate cache/revalidate strategy per fetch

Security:
  ✅ Route protection in middleware
  ✅ Secrets only in server-side env vars (no NEXT_PUBLIC_)
  ✅ CSP headers configured
  ✅ Input validated with Zod in Server Actions

SEO:
  ✅ Metadata exported from pages
  ✅ generateStaticParams for dynamic routes
  ✅ sitemap.ts / robots.ts at app root

Monitoring:
  ✅ @vercel/analytics installed
  ✅ @vercel/speed-insights installed
  ✅ Error boundary components for graceful failures
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Default rendering",
        question: "What rendering behavior does a Next.js App Router page have by default (no config)?",
        options: ["Always dynamic SSR", "Always client-side rendering", "Static — pre-rendered at build time", "Real-time server rendering"],
        answer: "Static — pre-rendered at build time",
        explanation: "Next.js defaults to static rendering and opts into dynamic rendering only when it detects dynamic functions (cookies, headers, searchParams).",
        difficulty: "medium",
      },
      {
        number: 2,
        name: "ISR vs SSR",
        question: "What is the key difference between ISR and dynamic SSR?",
        options: [
          "ISR is client-side; SSR is server-side",
          "ISR serves a cached page and regenerates in the background; SSR renders fresh HTML on every request",
          "SSR is faster than ISR always",
          "There is no difference",
        ],
        answer: "ISR serves a cached page and regenerates in the background; SSR renders fresh HTML on every request",
        explanation: "ISR gives near-static performance while keeping content reasonably fresh. SSR ensures fresh data at the cost of per-request rendering.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "NEXT_PUBLIC_ security",
        question: "Why should API keys never use the `NEXT_PUBLIC_` prefix?",
        options: ["They won't work", "NEXT_PUBLIC_ variables are bundled into client-side JavaScript — visible to anyone", "They cause build errors", "Performance reasons"],
        answer: "NEXT_PUBLIC_ variables are bundled into client-side JavaScript — visible to anyone",
        explanation: "NEXT_PUBLIC_ vars are inlined in the browser bundle and visible in source code. Use server-only env vars for secrets.",
        difficulty: "easy",
      },
    ],
  },
];

const nextjsBackendMore = [
  {
    slug: "nextjs-backend",
    title: "Advanced Route Handlers",
    order: 16,
    theory: [
      {
        order: 1,
        title: "Dynamic Route Handlers",
        content: `Route Handlers support dynamic segments and all HTTP methods.

\`\`\`typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await db.user.findUnique({
    where: { id: parseInt(params.id) }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const updated = await db.user.update({
    where: { id: parseInt(params.id) },
    data: body,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await db.user.delete({ where: { id: parseInt(params.id) } });
  return new NextResponse(null, { status: 204 });
}
\`\`\``,
      },
      {
        order: 2,
        title: "Request Parsing and Response Headers",
        content: `Parse query params, headers, and cookies from requests.

\`\`\`typescript
export async function GET(request: NextRequest) {
  // Query parameters
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '10');

  // Headers
  const authHeader = request.headers.get('Authorization');
  const contentType = request.headers.get('content-type');

  // Cookies
  const sessionId = request.cookies.get('session')?.value;

  const data = await db.item.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  // Custom response headers
  return NextResponse.json(data, {
    headers: {
      'X-Total-Count': '100',
      'Cache-Control': 'public, max-age=60',
    },
  });
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "HTTP 204 No Content",
        question: "What does HTTP 204 No Content indicate and when should you return it?",
        options: ["Resource was created", "The response has no body — used for successful DELETE or PATCH with no response body", "Resource not found", "Bad request"],
        answer: "The response has no body — used for successful DELETE or PATCH with no response body",
        explanation: "204 signals success without returning any content — appropriate when the operation succeeded but there's nothing to return.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "searchParams usage",
        question: "How do you access query parameters from a `NextRequest` in a Route Handler?",
        options: ["request.query", "request.params", "request.nextUrl.searchParams", "request.url.params"],
        answer: "request.nextUrl.searchParams",
        explanation: "NextRequest exposes nextUrl which has the searchParams URLSearchParams object for query string parsing.",
        difficulty: "easy",
      },
    ],
  },
  {
    slug: "nextjs-backend",
    title: "Middleware and Edge Functions",
    order: 17,
    theory: [
      {
        order: 1,
        title: "Middleware Deep Dive",
        content: `Middleware intercepts every request before it reaches pages or API routes.

\`\`\`typescript
// middleware.ts (project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Authentication check
  const token = request.cookies.get('auth-token')?.value;
  if (pathname.startsWith('/api/protected') && !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Rate limiting (by IP)
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';

  // 3. A/B testing
  const variant = request.cookies.get('ab-variant')?.value
    ?? (Math.random() > 0.5 ? 'a' : 'b');

  const response = NextResponse.next();
  response.cookies.set('ab-variant', variant);

  // 4. Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
};
\`\`\``,
      },
      {
        order: 2,
        title: "Geo-routing and Request Rewrites",
        content: `Use Middleware for geolocation-based routing and URL rewrites.

\`\`\`typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const country = request.geo?.country ?? 'US';
  const { pathname } = request.nextUrl;

  // Redirect based on country
  if (pathname === '/' && country === 'RO') {
    return NextResponse.redirect(new URL('/ro', request.url));
  }

  // Rewrite (change URL without redirect)
  if (pathname.startsWith('/old-api')) {
    const newPath = pathname.replace('/old-api', '/api/v2');
    return NextResponse.rewrite(new URL(newPath, request.url));
  }

  // Clone and modify response
  const response = NextResponse.next();
  response.headers.set('X-Country', country);
  return response;
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Middleware vs Route Handler",
        question: "What is the key difference between Middleware and a Route Handler?",
        options: [
          "Middleware handles POST requests; Route Handlers handle GET",
          "Middleware intercepts ALL requests before they reach pages/APIs; Route Handlers handle specific API paths",
          "Route Handlers run at the edge; Middleware runs on Node.js",
          "They are identical",
        ],
        answer: "Middleware intercepts ALL requests before they reach pages/APIs; Route Handlers handle specific API paths",
        explanation: "Middleware is a global interceptor for cross-cutting concerns (auth, logging, redirects). Route Handlers are specific API endpoints.",
        difficulty: "medium",
      },
      {
        number: 2,
        name: "NextResponse.rewrite vs redirect",
        question: "What is the difference between `NextResponse.rewrite()` and `NextResponse.redirect()`?",
        options: [
          "No difference",
          "rewrite changes the URL in browser; redirect keeps it the same",
          "rewrite serves different content at the same URL; redirect sends a new URL to the browser",
          "redirect only works in middleware",
        ],
        answer: "rewrite serves different content at the same URL; redirect sends a new URL to the browser",
        explanation: "Rewrite is a server-side URL mapping (browser URL unchanged). Redirect sends 3xx, browser navigates to the new URL.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "nextjs-backend",
    title: "Database Patterns with Prisma",
    order: 18,
    theory: [
      {
        order: 1,
        title: "Prisma Client Best Practices",
        content: `Use a singleton Prisma client to avoid connection pool exhaustion in development.

\`\`\`typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Usage in Route Handler or Server Component
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  return NextResponse.json(users);
}
\`\`\``,
      },
      {
        order: 2,
        title: "Advanced Queries and Relations",
        content: `Prisma handles complex queries and relational data.

\`\`\`typescript
// Include relations
const postWithAuthor = await prisma.post.findUnique({
  where: { id: 1 },
  include: {
    author: { select: { name: true, email: true } },
    comments: { orderBy: { createdAt: 'desc' }, take: 5 },
    _count: { select: { likes: true } },
  },
});

// Filtering and pagination
const { page = 1, limit = 10, search = '' } = query;
const posts = await prisma.post.findMany({
  where: {
    OR: [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ],
    published: true,
  },
  orderBy: { createdAt: 'desc' },
  skip: (page - 1) * limit,
  take: limit,
});

const total = await prisma.post.count({ where: { published: true } });
return { posts, total, pages: Math.ceil(total / limit) };
\`\`\``,
      },
      {
        order: 3,
        title: "Transactions",
        content: `Use Prisma transactions for atomic multi-step operations.

\`\`\`typescript
// Sequential transactions
const [order, inventory] = await prisma.$transaction([
  prisma.order.create({ data: orderData }),
  prisma.product.update({
    where: { id: productId },
    data: { stock: { decrement: quantity } },
  }),
]);

// Interactive transactions (more flexible)
const result = await prisma.$transaction(async (tx) => {
  const product = await tx.product.findUnique({ where: { id: productId } });
  if (!product || product.stock < quantity) {
    throw new Error('Insufficient stock');
  }

  const order = await tx.order.create({ data: orderData });
  await tx.product.update({
    where: { id: productId },
    data: { stock: { decrement: quantity } },
  });

  return order;
});
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Prisma singleton",
        question: "Why use a global singleton for PrismaClient in Next.js development?",
        options: ["It's required by Prisma", "Hot reload creates new instances each time — the singleton reuses the connection pool", "Singletons are faster", "To avoid TypeScript errors"],
        answer: "Hot reload creates new instances each time — the singleton reuses the connection pool",
        explanation: "Without the singleton pattern, each hot reload creates a new PrismaClient, exhausting the database connection pool.",
        difficulty: "medium",
      },
      {
        number: 2,
        name: "Prisma select vs include",
        question: "What is the difference between `select` and `include` in Prisma?",
        options: [
          "They are identical",
          "select chooses specific scalar fields; include adds related model data",
          "include is only for arrays",
          "select is for filtering rows",
        ],
        answer: "select chooses specific scalar fields; include adds related model data",
        explanation: "select specifies which fields to return (subset of columns). include eager-loads related models (joins).",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "Interactive transaction benefit",
        question: "When should you use an interactive transaction (`$transaction(async tx => ...)`) over a sequential one?",
        options: ["Always", "When you need to read data and make decisions before subsequent writes", "For single queries", "When you have only two operations"],
        answer: "When you need to read data and make decisions before subsequent writes",
        explanation: "Interactive transactions allow running logic between queries — checking stock before decrementing, for example.",
        difficulty: "hard",
      },
    ],
  },
  {
    slug: "nextjs-backend",
    title: "Input Validation and Error Handling",
    order: 19,
    theory: [
      {
        order: 1,
        title: "Zod Validation in Route Handlers",
        content: `Always validate incoming data in API routes.

\`\`\`typescript
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const CreateUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().int().min(0).max(150).optional(),
  role: z.enum(['user', 'admin']).default('user'),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const result = CreateUserSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const user = await prisma.user.create({ data: result.data });
  return NextResponse.json(user, { status: 201 });
}
\`\`\``,
      },
      {
        order: 2,
        title: "Centralized Error Handling",
        content: `Create a consistent error response format across all routes.

\`\`\`typescript
// lib/api-error.ts
export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
  }
}

// lib/api-handler.ts
type RouteHandler = (req: NextRequest, context: any) => Promise<NextResponse>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message, code: error.code },
          { status: error.status }
        );
      }
      console.error('Unhandled error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

// Usage
export const GET = withErrorHandler(async (req, { params }) => {
  const user = await getUserById(params.id);
  if (!user) throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
  return NextResponse.json(user);
});
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "safeParse vs parse",
        question: "What is the difference between `z.schema.safeParse()` and `.parse()` in Zod?",
        options: ["No difference", "parse throws on invalid data; safeParse returns a result object with success/error", "safeParse is async; parse is sync", "safeParse only works with strings"],
        answer: "parse throws on invalid data; safeParse returns a result object with success/error",
        explanation: "safeParse never throws — it returns { success: true, data } or { success: false, error }, enabling graceful error handling.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "HTTP 422 Unprocessable Entity",
        question: "When should you return HTTP 422 instead of 400 for invalid data?",
        options: ["Always for validation errors", "When the request syntax is valid JSON but the data fails business/schema rules", "Only for file uploads", "For authentication errors"],
        answer: "When the request syntax is valid JSON but the data fails business/schema rules",
        explanation: "400 means malformed request (bad JSON syntax). 422 means valid syntax but semantic validation failed.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "nextjs-backend",
    title: "API Authentication Patterns",
    order: 20,
    theory: [
      {
        order: 1,
        title: "JWT Authentication",
        content: `Implement JWT-based API authentication.

\`\`\`typescript
// npm install jose
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function createToken(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

// POST /api/auth/login
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const user = await validateCredentials(email, password);

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createToken({ userId: user.id, role: user.role });

  return NextResponse.json({ token, user: { id: user.id, email: user.email } });
}

// Auth middleware for protected routes
export async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError('Missing token', 401);
  }
  const token = authHeader.slice(7);
  return verifyToken(token);
}
\`\`\``,
      },
      {
        order: 2,
        title: "API Key Authentication",
        content: `Implement API key auth for service-to-service calls.

\`\`\`typescript
import { createHash } from 'crypto';

// Hash the API key before storing
function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

// Middleware-style auth check
async function requireApiKey(request: NextRequest) {
  const key = request.headers.get('X-API-Key');
  if (!key) throw new ApiError('API key required', 401);

  const hashedKey = hashApiKey(key);
  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash: hashedKey },
    include: { user: true },
  });

  if (!apiKey || !apiKey.active) {
    throw new ApiError('Invalid or revoked API key', 401);
  }

  // Update last used
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  return apiKey.user;
}

export const GET = withErrorHandler(async (request) => {
  const user = await requireApiKey(request);
  const data = await getDataForUser(user.id);
  return NextResponse.json(data);
});
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "JWT expiration",
        question: "Why should JWT tokens have an expiration time?",
        options: ["To save database space", "To limit the window of exposure if a token is stolen", "JWTs require expiration", "To improve performance"],
        answer: "To limit the window of exposure if a token is stolen",
        explanation: "Short-lived tokens limit damage from theft — even if intercepted, the token becomes useless after expiry.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "API key hashing",
        question: "Why store a hash of the API key rather than the key itself?",
        options: ["Hashing is faster", "If the database is compromised, attackers can't use the stored hashes as API keys", "API keys must be hashed by law", "It reduces storage size"],
        answer: "If the database is compromised, attackers can't use the stored hashes as API keys",
        explanation: "Storing raw keys means a DB breach exposes all keys. Hashing means only the hash is stored — the original is never recoverable.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "nextjs-backend",
    title: "File Uploads and Storage",
    order: 21,
    theory: [
      {
        order: 1,
        title: "File Upload with Vercel Blob",
        content: `Handle file uploads and store them with Vercel Blob.

\`\`\`typescript
// npm install @vercel/blob
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate file type and size
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 });
  }

  const blob = await put(file.name, file, {
    access: 'public',
    addRandomSuffix: true,
  });

  // Save blob URL to database
  await prisma.file.create({
    data: { url: blob.url, name: file.name, size: file.size },
  });

  return NextResponse.json({ url: blob.url }, { status: 201 });
}
\`\`\``,
      },
      {
        order: 2,
        title: "Client-Side Upload Form",
        content: `Build a drag-and-drop upload form with progress.

\`\`\`tsx
'use client';
import { useState } from 'react';

export function FileUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleFile(file: File) {
    // Show preview
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const { url } = await res.json();
      onUpload(url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed p-8 text-center"
    >
      {preview ? (
        <img src={preview} className="max-h-40 mx-auto" alt="Preview" />
      ) : (
        <p>Drop image here or <label className="cursor-pointer text-blue-500">
          browse
          <input type="file" className="hidden" accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label></p>
      )}
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "File validation importance",
        question: "Why must you validate file type and size on the server, not just the client?",
        options: ["Performance reasons", "Clients can bypass browser-side validation — server is the last line of defense", "JavaScript doesn't support file validation", "Server validation is optional"],
        answer: "Clients can bypass browser-side validation — server is the last line of defense",
        explanation: "Client-side validation improves UX but any attacker can send raw HTTP requests. Always validate on the server.",
        difficulty: "medium",
      },
      {
        number: 2,
        name: "FormData handling",
        question: "How do you read a file from a multipart form request in a Next.js Route Handler?",
        options: ["request.body.file", "request.file()", "await request.formData() then formData.get('file')", "request.files[0]"],
        answer: "await request.formData() then formData.get('file')",
        explanation: "Route Handlers use the Web standard FormData API. await request.formData() parses multipart form submissions.",
        difficulty: "easy",
      },
    ],
  },
  {
    slug: "nextjs-backend",
    title: "WebSockets and Real-time",
    order: 22,
    theory: [
      {
        order: 1,
        title: "Server-Sent Events",
        content: `Server-Sent Events (SSE) stream data from server to client over HTTP.

\`\`\`typescript
// app/api/events/route.ts
export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(
          encoder.encode(\`data: \${JSON.stringify(data)}\\n\\n\`)
        );
      };

      // Send initial data
      send({ type: 'connected', time: Date.now() });

      // Simulate periodic updates
      let count = 0;
      const interval = setInterval(() => {
        send({ type: 'update', count: ++count, time: Date.now() });
        if (count >= 10) {
          clearInterval(interval);
          controller.close();
        }
      }, 1000);

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
\`\`\``,
      },
      {
        order: 2,
        title: "Real-time with Pusher",
        content: `Use Pusher for bi-directional real-time communication.

\`\`\`typescript
// npm install pusher pusher-js

// lib/pusher.ts
import Pusher from 'pusher';
import PusherJs from 'pusher-js';

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
});

export const pusherClient = new PusherJs(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.PUSHER_CLUSTER!,
});

// Trigger event from Route Handler
export async function POST(request: NextRequest) {
  const { message, channelId } = await request.json();

  await pusherServer.trigger(\`channel-\${channelId}\`, 'new-message', {
    message,
    timestamp: Date.now(),
  });

  return NextResponse.json({ ok: true });
}

// Client: subscribe to channel
'use client';
import { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher';

export function Chat({ channelId }: { channelId: string }) {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const channel = pusherClient.subscribe(\`channel-\${channelId}\`);
    channel.bind('new-message', (data: { message: string }) => {
      setMessages(prev => [...prev, data.message]);
    });
    return () => { pusherClient.unsubscribe(\`channel-\${channelId}\`); };
  }, [channelId]);

  return <ul>{messages.map((m, i) => <li key={i}>{m}</li>)}</ul>;
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "SSE vs WebSocket",
        question: "When should you prefer Server-Sent Events over WebSockets?",
        options: ["Always — SSE is better", "When only the server needs to push data to the client (unidirectional)", "When you need high-frequency bidirectional messaging", "SSE is not supported in Next.js"],
        answer: "When only the server needs to push data to the client (unidirectional)",
        explanation: "SSE works over standard HTTP, is simpler, and suits server → client streaming (dashboards, notifications). WebSockets are needed for bidirectional real-time.",
        difficulty: "medium",
      },
      {
        number: 2,
        name: "abort signal cleanup",
        question: "Why listen to `request.signal` in an SSE Route Handler?",
        options: ["To parse the request body", "To detect when the client disconnects and clean up the stream/intervals", "To set response headers", "To validate the request"],
        answer: "To detect when the client disconnects and clean up the stream/intervals",
        explanation: "Without cleanup, intervals/resources leak when clients disconnect. The abort signal fires when the connection closes.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "nextjs-backend",
    title: "Background Jobs and Cron",
    order: 23,
    theory: [
      {
        order: 1,
        title: "Cron Jobs with Vercel",
        content: `Schedule recurring tasks using Vercel Cron.

\`\`\`json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/send-digest",
      "schedule": "0 9 * * 1"
    }
  ]
}
\`\`\`

\`\`\`typescript
// app/api/cron/cleanup/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Verify this is called by Vercel Cron (not publicly accessible)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const result = await prisma.session.deleteMany({
    where: { expiresAt: { lt: thirtyDaysAgo } },
  });

  console.log(\`Cleaned up \${result.count} expired sessions\`);
  return NextResponse.json({ deleted: result.count });
}
\`\`\``,
      },
      {
        order: 2,
        title: "Queue-based Background Processing",
        content: `Use background queues for time-intensive operations.

\`\`\`typescript
// Using QStash (Upstash) for durable queues
// npm install @upstash/qstash

import { Client } from '@upstash/qstash';

const qstash = new Client({ token: process.env.QSTASH_TOKEN! });

// Trigger a background job
export async function POST(request: NextRequest) {
  const { userId, reportType } = await request.json();

  // Immediately respond to the user
  await qstash.publishJSON({
    url: \`\${process.env.NEXT_PUBLIC_URL}/api/jobs/generate-report\`,
    body: { userId, reportType },
    retries: 3,
  });

  return NextResponse.json({ message: 'Report queued', status: 'pending' });
}

// Worker route - called by QStash
// app/api/jobs/generate-report/route.ts
export async function POST(request: NextRequest) {
  const signature = request.headers.get('upstash-signature');
  // Verify QStash signature...

  const { userId, reportType } = await request.json();
  await generateReport(userId, reportType); // long-running task

  return NextResponse.json({ ok: true });
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Cron security",
        question: "Why protect cron endpoints with a `CRON_SECRET`?",
        options: ["Required by Vercel", "Anyone could call the endpoint and trigger cleanup/jobs without authorization", "To improve performance", "Cron jobs don't need protection"],
        answer: "Anyone could call the endpoint and trigger cleanup/jobs without authorization",
        explanation: "Cron endpoints are public HTTP routes — without auth, anyone could trigger expensive or destructive operations.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "Queue benefit",
        question: "Why use a queue (like QStash) for long-running background tasks instead of running them inline?",
        options: ["Queues are required for all async operations", "Long tasks would time out the HTTP request and block the user; queues process them independently", "Queues are cheaper", "Inline processing is not supported"],
        answer: "Long tasks would time out the HTTP request and block the user; queues process them independently",
        explanation: "HTTP requests have timeouts (typically 10-30s). Queues allow immediate user response while processing happens asynchronously with retries.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "nextjs-backend",
    title: "Monitoring and Logging",
    order: 24,
    theory: [
      {
        order: 1,
        title: "Structured Logging",
        content: `Implement structured logging for production observability.

\`\`\`typescript
// lib/logger.ts
// npm install pino pino-pretty

import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  ...(process.env.NODE_ENV === 'development' && {
    transport: { target: 'pino-pretty' },
  }),
  base: {
    env: process.env.NODE_ENV,
    service: 'my-nextjs-app',
  },
});

// Usage in Route Handler
export async function GET(request: NextRequest, { params }) {
  const requestId = crypto.randomUUID();
  const log = logger.child({ requestId, userId: params.userId });

  log.info({ path: request.nextUrl.pathname }, 'Request received');

  try {
    const data = await fetchData(params.userId);
    log.info({ count: data.length }, 'Request completed');
    return NextResponse.json(data);
  } catch (error) {
    log.error({ error }, 'Request failed');
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
\`\`\``,
      },
      {
        order: 2,
        title: "Performance Monitoring with Sentry",
        content: `Track errors and performance with Sentry.

\`\`\`typescript
// npm install @sentry/nextjs
// npx @sentry/wizard@latest -i nextjs

// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
});

// Capture errors manually
import * as Sentry from '@sentry/nextjs';

export const GET = withErrorHandler(async (request, { params }) => {
  try {
    const data = await riskyOperation();
    return NextResponse.json(data);
  } catch (error) {
    Sentry.captureException(error, {
      extra: { params, url: request.url },
    });
    throw error; // rethrow for withErrorHandler
  }
});

// Measure custom performance
const transaction = Sentry.startTransaction({ name: 'generateReport' });
try {
  await generateReport();
} finally {
  transaction.finish();
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Structured logging benefit",
        question: "Why use structured logging (JSON) instead of plain text log messages?",
        options: ["JSON is faster to write", "Structured logs are machine-parseable — easier to search, filter, and alert on", "Plain text is not supported in production", "JSON uses less storage"],
        answer: "Structured logs are machine-parseable — easier to search, filter, and alert on",
        explanation: "JSON logs with consistent fields (timestamp, level, requestId) can be queried by log aggregators like Datadog, CloudWatch, etc.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "tracesSampleRate",
        question: "Why set `tracesSampleRate: 0.1` in production Sentry config?",
        options: ["To reduce accuracy", "To sample only 10% of transactions — reducing cost while maintaining visibility", "0.1 is the required minimum", "To disable tracing"],
        answer: "To sample only 10% of transactions — reducing cost while maintaining visibility",
        explanation: "Sending every transaction to Sentry is expensive at scale. Sampling 10% captures enough data for performance insights.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "nextjs-backend",
    title: "Next.js Backend Mastery Project",
    order: 25,
    theory: [
      {
        order: 1,
        title: "Production API Architecture",
        content: `Complete production-ready API combining all backend concepts.

\`\`\`
api-service/
├── app/api/
│   ├── auth/
│   │   ├── login/route.ts     (JWT auth)
│   │   └── register/route.ts  (user creation + validation)
│   ├── users/
│   │   ├── route.ts           (GET list, POST create)
│   │   └── [id]/
│   │       └── route.ts       (GET, PATCH, DELETE)
│   ├── upload/route.ts        (file upload)
│   ├── events/route.ts        (SSE stream)
│   └── cron/
│       └── cleanup/route.ts   (scheduled job)
├── lib/
│   ├── prisma.ts              (DB client singleton)
│   ├── auth.ts                (JWT helpers)
│   ├── logger.ts              (Pino logger)
│   └── api-handler.ts         (error wrapper)
├── middleware.ts               (rate limiting, auth check)
└── prisma/schema.prisma
\`\`\``,
      },
      {
        order: 2,
        title: "Rate Limiting and Security",
        content: `Add rate limiting and security headers.

\`\`\`typescript
// middleware.ts - rate limiting with Upstash Redis
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 req per 10 seconds
});

export async function middleware(request: NextRequest) {
  // Rate limit API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const ip = request.ip ?? 'anonymous';
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString(),
          },
        }
      );
    }
  }

  const response = NextResponse.next();
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}
\`\`\``,
      },
      {
        order: 3,
        title: "API Documentation with OpenAPI",
        content: `Document your API with OpenAPI/Swagger.

\`\`\`typescript
// npm install @scalar/nextjs-api-reference zod-to-openapi

// app/api/docs/route.ts
import { generateOpenApiDocument } from 'zod-to-openapi';

const document = generateOpenApiDocument(registry, {
  title: 'My API',
  version: '1.0.0',
  servers: [{ url: process.env.NEXT_PUBLIC_URL! }],
});

export async function GET() {
  return NextResponse.json(document);
}

// app/docs/page.tsx
import { ApiReference } from '@scalar/nextjs-api-reference';

export default function DocsPage() {
  return (
    <ApiReference
      configuration={{ spec: { url: '/api/docs' } }}
    />
  );
}
\`\`\`

**Backend Mastery Summary:**
| Concept | Implementation |
|---------|---------------|
| API Routes | Route Handlers with all HTTP methods |
| Auth | JWT + NextAuth.js |
| Database | Prisma + transactions |
| Validation | Zod schemas |
| File storage | Vercel Blob |
| Real-time | SSE + Pusher |
| Background jobs | Vercel Cron + QStash |
| Monitoring | Pino + Sentry |
| Security | Middleware rate limiting + headers |`,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Rate limiting strategy",
        question: "What does a sliding window rate limiter provide that a fixed window does not?",
        options: [
          "Higher limits",
          "Smoother rate limiting without burst spikes at window boundaries",
          "Authentication",
          "Lower latency",
        ],
        answer: "Smoother rate limiting without burst spikes at window boundaries",
        explanation: "Fixed windows allow double the rate at window boundaries (end of old + start of new). Sliding windows prevent this by considering a rolling time period.",
        difficulty: "hard",
      },
      {
        number: 2,
        name: "HTTP 429 Too Many Requests",
        question: "What headers should accompany a 429 response?",
        options: ["Content-Type only", "X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset", "Authorization", "Cache-Control only"],
        answer: "X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset",
        explanation: "Rate limit headers tell clients their quota, how much remains, and when it resets — enabling proper backoff behavior.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "OpenAPI benefit",
        question: "What is the main benefit of maintaining an OpenAPI specification for your API?",
        options: ["It makes the API faster", "Auto-generated documentation, client SDKs, and contract testing", "It's required for deployment", "It improves security"],
        answer: "Auto-generated documentation, client SDKs, and contract testing",
        explanation: "OpenAPI specs enable generating interactive docs (Swagger/Scalar), typed client libraries, and contract tests from one source of truth.",
        difficulty: "medium",
      },
    ],
  },
];

module.exports = { nextjsFrontendMore, nextjsBackendMore };
