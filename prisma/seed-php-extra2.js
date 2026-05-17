const phpExtra2 = [
  {
    "slug": "php-composer-autoloading",
    "title": "31. Composer si Autoloading (PSR-4)",
    "order": 31,
    "theory": [
      {
        "order": 1,
        "title": "Ce este Composer si de ce il folosim",
        "content": "Composer este dependency manager-ul oficial pentru PHP. Gestioneaza librariile externe, autoloading-ul si scripturile de build.\n\nINSTALARE SI INIT:\n```bash\n# Instalare globala\ncurl -sS https://getcomposer.org/installer | php\nmv composer.phar /usr/local/bin/composer\n\n# Creare proiect nou\ncomposer init\n# Sau din template:\ncomposer create-project laravel/laravel my-app\n\n# Adaugare dependenta\ncomposer require guzzlehttp/guzzle\ncomposer require --dev phpunit/phpunit\n\n# Instalare din composer.json existent\ncomposer install\n\n# Update toate pachetele\ncomposer update\n```\n\nSTRUCTURA composer.json:\n```json\n{\n  \"name\": \"firma/proiect\",\n  \"description\": \"API REST pentru magazine\",\n  \"require\": {\n    \"php\": \">=8.2\",\n    \"guzzlehttp/guzzle\": \"^7.8\",\n    \"vlucas/phpdotenv\": \"^5.6\"\n  },\n  \"require-dev\": {\n    \"phpunit/phpunit\": \"^11.0\",\n    \"fakerphp/faker\": \"^1.23\"\n  },\n  \"autoload\": {\n    \"psr-4\": {\n      \"App\\\\\\\\\": \"src/\"\n    }\n  }\n}\n```\n\nLA INTERVIU: Diferenta require vs require-dev? require = pachete necesare in productie. require-dev = doar in development (teste, debuggere). composer install --no-dev pe server de productie."
      },
      {
        "order": 2,
        "title": "PSR-4 Autoloading — cum functioneaza",
        "content": "PSR-4 este standardul PHP pentru autoloading. Mapeaza namespace-uri la directoare astfel incat nu mai ai nevoie de require manual.\n\nCONFIGURARE PSR-4:\n```json\n{\n  \"autoload\": {\n    \"psr-4\": {\n      \"App\\\\\\\\\": \"src/\",\n      \"App\\\\\\\\Tests\\\\\\\\\": \"tests/\"\n    }\n  }\n}\n```\n\nSTRUCTURA FISIERE:\n```\nsrc/\n  Controllers/\n    UserController.php   -> App\\Controllers\\UserController\n  Models/\n    User.php             -> App\\Models\\User\n  Services/\n    AuthService.php      -> App\\Services\\AuthService\ntests/\n  UserTest.php           -> App\\Tests\\UserTest\n```\n\nEXEMPLU CLASA:\n```php\n<?php\n// src/Models/User.php\nnamespace App\\Models;\n\nclass User {\n    public function __construct(\n        private string $name,\n        private string $email\n    ) {}\n    \n    public function getName(): string {\n        return $this->name;\n    }\n}\n\n// src/Controllers/UserController.php\nnamespace App\\Controllers;\n\nuse App\\Models\\User;         // autoloaded de PSR-4!\nuse App\\Services\\AuthService;\n\nclass UserController {\n    public function show(int $id): User {\n        $user = new User('Ion', 'ion@example.com');\n        return $user;\n    }\n}\n```\n\nDUPA MODIFICARE autoload:\n```bash\ncomposer dump-autoload\n# Regenereaza vendor/autoload.php\n```\n\nIN INDEX.PHP:\n```php\n<?php\nrequire_once 'vendor/autoload.php'; // UN SINGUR require!\n\n$controller = new App\\Controllers\\UserController();\n```\n\nLA INTERVIU: Ce face composer dump-autoload? Regenereaza fisierele de autoloading din vendor/. Necesar dupa adaugare clase noi sau modificare autoload in composer.json."
      },
      {
        "order": 3,
        "title": "composer.lock si vendor — ce NU se comite",
        "content": "composer.lock inregistreaza versiunile EXACTE ale tuturor dependentelor. Garanteaza ca toti developerii au aceleasi versiuni.\n\nREGULI COMPOSER.LOCK:\n```bash\n# composer.json  = versiuni permise (^7.8 = orice 7.x >= 7.8)\n# composer.lock  = versiuni exacte instalate (7.8.3)\n\n# commit composer.lock -> DA! (pentru aplicatii)\n# commit composer.lock -> NU (pentru librarii publice)\n# commit vendor/       -> NICIODATA!\n```\n\n.gitignore:\n```\n/vendor/\n.env\n/node_modules/\n```\n\nSCRIPTS IN COMPOSER.JSON:\n```json\n{\n  \"scripts\": {\n    \"start\": \"php -S localhost:8000 -t public/\",\n    \"test\": \"vendor/bin/phpunit\",\n    \"lint\": \"vendor/bin/phpcs src/\",\n    \"fix\": \"vendor/bin/phpcbf src/\",\n    \"post-install-cmd\": [\n      \"@php artisan key:generate --ansi\"\n    ],\n    \"post-update-cmd\": [\n      \"@php artisan vendor:publish --tag=laravel-assets --ansi --force\"\n    ]\n  }\n}\n```\n\nRULARE SCRIPTURI:\n```bash\ncomposer run start\ncomposer run test\ncomposer test  # shortcut\n```\n\nCLASS MAP AUTOLOAD (pentru fisiere fara namespace):\n```json\n{\n  \"autoload\": {\n    \"classmap\": [\"database/\", \"config/\"],\n    \"files\": [\"src/helpers.php\"]\n  }\n}\n```\n\nfiles = fisiere incarcate mereu (helpers globali, functii)."
      },
      {
        "order": 4,
        "title": "Packagist si managementul versiunilor",
        "content": "Packagist.org este registrul oficial de pachete Composer. Orice pachet public e acolo.\n\nSINTAXA VERSIUNI:\n```bash\n# Versiune exacta:\ncomposer require guzzle/guzzle:7.8.0\n\n# Wildcard:\ncomposer require guzzle/guzzle:7.*  # orice 7.x\n\n# Caret (recomandat):\ncomposer require guzzle/guzzle:^7.8  # >=7.8 <8.0\n\n# Tilda:\ncomposer require guzzle/guzzle:~7.8  # >=7.8 <7.9\n\n# >= sau range:\ncomposer require guzzle/guzzle:>=7.0,<8.0\n```\n\nCOMENZI UTILE:\n```bash\n# Verifica probleme de securitate:\ncomposer audit\n\n# Listeaza pachete instalate:\ncomposer show\n\n# Info despre un pachet:\ncomposer show guzzlehttp/guzzle\n\n# Cauta pe Packagist:\ncomposer search http client\n\n# Sterge un pachet:\ncomposer remove guzzlehttp/guzzle\n\n# Optimizare autoload pentru productie:\ncomposer dump-autoload --optimize --classmap-authoritative\n```\n\nEXEMPLU REAL — proiect cu pachete comune:\n```bash\n# API HTTP\ncomposer require guzzlehttp/guzzle\n\n# Variabile de mediu (.env)\ncomposer require vlucas/phpdotenv\n\n# Validare date\ncomposer require respect/validation\n\n# JWT tokens\ncomposer require firebase/php-jwt\n\n# Logging (PSR-3)\ncomposer require monolog/monolog\n```\n\nLA INTERVIU: Ce faci cand doi colegi au versiuni diferite de pachete? composer.lock rezolva asta. composer install foloseste lock file. composer update ignora lock si ia versiunile noi permise de composer.json."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "composer require",
        "question": "Ce face comanda `composer require guzzlehttp/guzzle`?",
        "options": [
          "Descarca si instaleaza guzzle, adaugandu-l in require din composer.json",
          "Doar adauga in composer.json fara sa instaleze",
          "Instaleaza global pe sistem",
          "Creeaza un nou proiect"
        ],
        "answer": "Descarca si instaleaza guzzle, adaugandu-l in require din composer.json",
        "explanation": "composer require face ambele: descarca pachetul in vendor/ si actualizeaza composer.json + composer.lock.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "psr4 mapare",
        "question": "Daca namespace-ul App\\ mapeaza pe src/, unde se afla fisierul clasei `App\\Models\\User`?",
        "options": [
          "app/Models/User.php",
          "src/Models/User.php",
          "vendor/App/Models/User.php",
          "models/User.php"
        ],
        "answer": "src/Models/User.php",
        "explanation": "PSR-4: App\\\\ = src/. App\\Models\\User = src/ + Models/User.php = src/Models/User.php.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "composer.lock",
        "question": "De ce se comite composer.lock in git pentru aplicatii (nu librarii)?",
        "options": [
          "Nu se comite niciodata",
          "Inregistreaza versiunile exacte — garanteaza ca toti developerii si serverul au exact aceleasi versiuni",
          "E mai mic decat composer.json",
          "Contine credentiale"
        ],
        "answer": "Inregistreaza versiunile exacte — garanteaza ca toti developerii si serverul au exact aceleasi versiuni",
        "explanation": "composer.json: ^7.8 (permis). composer.lock: 7.8.3 (exact). Fara lock, developer A are 7.8.1, serverul 7.8.5 — bug-uri ciudate.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "vendor gitignore",
        "question": "De ce nu se comite directorul vendor/ in git?",
        "options": [
          "E prea mare si se regenereaza cu composer install",
          "Contine chei secrete",
          "Nu e necesar",
          "E generat de PHP"
        ],
        "answer": "E prea mare si se regenereaza cu composer install",
        "explanation": "vendor/ poate fi zeci de MB. composer install + composer.lock il recreaza identic pe orice masina.",
        "difficulty": "easy"
      },
      {
        "number": 5,
        "name": "dump-autoload",
        "question": "Cand rulezi `composer dump-autoload`?",
        "options": [
          "Dupa orice composer require",
          "Dupa adaugare clase noi sau modificare sectiunii autoload din composer.json",
          "Inainte de deploy intotdeauna",
          "La fiecare request HTTP"
        ],
        "answer": "Dupa adaugare clase noi sau modificare sectiunii autoload din composer.json",
        "explanation": "dump-autoload regenereaza vendor/autoload.php. Fara el, clasele noi nu sunt gasite de autoloader.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "caret versiune",
        "question": "Ce inseamna `^7.8` in composer.json?",
        "options": [
          "Exact 7.8.0",
          ">=7.8.0 si <8.0.0 (orice 7.x mai nou sau egal cu 7.8)",
          ">=7.0.0",
          "7.8.*"
        ],
        "answer": ">=7.8.0 si <8.0.0 (orice 7.x mai nou sau egal cu 7.8)",
        "explanation": "Caret ^ permite update-uri minore si patch-uri dar nu major (care pot avea breaking changes).",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "require vs require-dev",
        "question": "Ce diferenta e intre require si require-dev in composer.json?",
        "options": [
          "Identice",
          "require = productie + development; require-dev = numai development (teste, debuggere)",
          "require-dev se instaleaza primul",
          "require e pentru PHP, require-dev pentru JavaScript"
        ],
        "answer": "require = productie + development; require-dev = numai development (teste, debuggere)",
        "explanation": "Pe serverul de productie: composer install --no-dev. Asta exclude phpunit, faker, phpstan etc.",
        "difficulty": "easy"
      },
      {
        "number": 8,
        "name": "composer audit",
        "question": "Ce face `composer audit`?",
        "options": [
          "Analizeaza performanta",
          "Verifica daca pachetele instalate au vulnerabilitati de securitate cunoscute",
          "Listeaza pachetele neutilizate",
          "Optimizeaza autoload-ul"
        ],
        "answer": "Verifica daca pachetele instalate au vulnerabilitati de securitate cunoscute",
        "explanation": "Composer audit compara cu baza de date Packagist Security Advisories. Buna practica: rulat in CI/CD.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "helpers autoload",
        "question": "Cum incarci automat fisierul `src/helpers.php` (functii globale fara clasa) prin Composer?",
        "options": [
          "Nu se poate",
          "\"files\": [\"src/helpers.php\"] in sectiunea autoload",
          "require 'src/helpers.php' manual",
          "classmap: ['src/helpers.php']"
        ],
        "answer": "\"files\": [\"src/helpers.php\"] in sectiunea autoload",
        "explanation": "Sectiunea files din autoload incarca fisierele la fiecare request, indiferent daca sunt folosite. Bun pentru helpers globali.",
        "difficulty": "hard"
      },
      {
        "number": 10,
        "name": "composer scripts",
        "question": "Cum definesti comanda `composer test` care ruleaza phpunit?",
        "options": [
          "command: phpunit",
          "\"scripts\": { \"test\": \"vendor/bin/phpunit\" } in composer.json",
          "alias test phpunit",
          "scripts.php cu phpunit"
        ],
        "answer": "\"scripts\": { \"test\": \"vendor/bin/phpunit\" } in composer.json",
        "explanation": "Sectiunea scripts din composer.json. composer test = composer run test = vendor/bin/phpunit.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "composer install vs update",
        "question": "Diferenta intre `composer install` si `composer update`?",
        "options": [
          "Identice",
          "install: foloseste composer.lock (versiuni exacte); update: ignora lock, ia versiunile permise noi",
          "install: productie; update: development",
          "update e mai rapid"
        ],
        "answer": "install: foloseste composer.lock (versiuni exacte); update: ignora lock, ia versiunile permise noi",
        "explanation": "Pe server nou sau clone: composer install. Vrei versiuni noi: composer update. Niciodata composer update pe productie fara testare.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Autoloading PSR-4",
        "question": "Creaza structura corecta pentru clasa `App\\Services\\EmailService` cu PSR-4 mapping App\\\\ -> src/.",
        "options": [],
        "answer": "",
        "explanation": "Fisier: src/Services/EmailService.php. Namespace: App\\Services. Clasa: EmailService.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Composer.json complet",
        "question": "Scrie un composer.json minimal cu: namespace App\\\\ -> src/, phpunit ca dev dependency, si scriptul 'test'.",
        "options": [],
        "answer": "",
        "explanation": "require-dev phpunit/phpunit ^11, autoload psr-4 App\\\\\\\\ -> src/, scripts test -> vendor/bin/phpunit.",
        "difficulty": "hard"
      },
      {
        "number": 14,
        "name": "packagist search",
        "question": "De unde instalezi pachete Composer si cum cauti pachetul pentru JWT?",
        "options": [
          "npm registry",
          "packagist.org — composer search jwt sau cauta direct pe site",
          "github.com",
          "php.net"
        ],
        "answer": "packagist.org — composer search jwt sau cauta direct pe site",
        "explanation": "Packagist.org e registrul oficial. composer search jwt listeaza firebase/php-jwt, lcobucci/jwt etc.",
        "difficulty": "easy"
      },
      {
        "number": 15,
        "name": "optimizare productie",
        "question": "Ce comanda optimizeaza autoload-ul pentru productie?",
        "options": [
          "composer install",
          "composer dump-autoload --optimize --classmap-authoritative",
          "composer update --prod",
          "composer build"
        ],
        "answer": "composer dump-autoload --optimize --classmap-authoritative",
        "explanation": "--optimize genereaza class map. --classmap-authoritative nu cauta fisiere extra. Reduce lookups la fiecare request.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "php-laravel-intro",
    "title": "32. Laravel Introducere (Routes, Controllers, Blade)",
    "order": 32,
    "theory": [
      {
        "order": 1,
        "title": "Instalare Laravel si structura proiectului",
        "content": "Laravel este cel mai popular framework PHP. Urmeaza arhitectura MVC (Model-View-Controller).\n\nINSTALARE:\n```bash\n# Creare proiect nou\ncomposer create-project laravel/laravel magazin\ncd magazin\n\n# Sau cu Laravel Installer:\ncomposer global require laravel/installer\nlaravel new magazin\n\n# Pornire server development\nphp artisan serve  # http://localhost:8000\n```\n\nSTRUCTURA LARAVEL:\n```\napp/\n  Http/\n    Controllers/    # Controllere\n    Middleware/     # Middleware\n  Models/           # Modele Eloquent\n  Providers/        # Service Providers\nconfig/             # Configurari\ndatabase/\n  migrations/       # Scheme baza de date\n  seeders/          # Date initiale\n  factories/        # Factory pentru teste\nresources/\n  views/            # Template-uri Blade (.blade.php)\n  css/ js/          # Assets\nroutes/\n  web.php           # Route-uri web (cu sesiune, CSRF)\n  api.php           # Route-uri API (fara sesiune)\nstorage/            # Fisiere generate, loguri\nvendor/             # Dependente Composer\n.env                # Variabile de mediu\n```\n\nCOMENZI ARTISAN FRECVENTE:\n```bash\nphp artisan make:controller UserController\nphp artisan make:model Product -m  # + migration\nphp artisan make:middleware AuthMiddleware\nphp artisan migrate\nphp artisan db:seed\nphp artisan route:list\nphp artisan cache:clear\nphp artisan config:cache  # productie\n```\n\nLA INTERVIU: Ce este Artisan? CLI-ul Laravel. Automatizeaza: creare fisiere (controllers, models, migrations), rulare migrari, curatare cache. php artisan list listeaza toate comenzile."
      },
      {
        "order": 2,
        "title": "Routes in Laravel — web.php si api.php",
        "content": "Laravel are un sistem de routing elegant si expresiv.\n\nROUTE-URI SIMPLE (routes/web.php):\n```php\n<?php\nuse Illuminate\\Support\\Facades\\Route;\nuse App\\Http\\Controllers\\ProductController;\nuse App\\Http\\Controllers\\UserController;\n\n// GET simplu cu closure:\nRoute::get('/', function () {\n    return view('welcome');\n});\n\n// GET cu controller:\nRoute::get('/produse', [ProductController::class, 'index']);\nRoute::get('/produse/{id}', [ProductController::class, 'show']);\nRoute::post('/produse', [ProductController::class, 'store']);\nRoute::put('/produse/{id}', [ProductController::class, 'update']);\nRoute::delete('/produse/{id}', [ProductController::class, 'destroy']);\n\n// Resource route (toate cele 7 actiuni CRUD dintr-o linie):\nRoute::resource('produse', ProductController::class);\n// Genereaza: index, create, store, show, edit, update, destroy\n\n// Route cu parametru optional:\nRoute::get('/categorii/{slug?}', [CategoryController::class, 'index']);\n\n// Route cu constrangere:\nRoute::get('/user/{id}', [UserController::class, 'show'])\n    ->where('id', '[0-9]+');\n\n// Route group cu prefix si middleware:\nRoute::prefix('admin')->middleware('auth')->group(function () {\n    Route::get('/dashboard', [AdminController::class, 'dashboard']);\n    Route::resource('utilizatori', UserController::class);\n});\n\n// Named routes (folosite in redirect si url()):\nRoute::get('/profil', [ProfileController::class, 'show'])->name('profile.show');\n// In controller: return redirect()->route('profile.show');\n// In Blade: {{ route('profile.show') }}\n```"
      },
      {
        "order": 3,
        "title": "Controllers — logica aplicatiei",
        "content": "Controller-ele contin logica de business si raspund la request-uri HTTP.\n\nCREARE CONTROLLER:\n```bash\nphp artisan make:controller ProductController --resource\n# --resource genereaza toate metodele CRUD automat\n```\n\nEXEMPLU CONTROLLER COMPLET:\n```php\n<?php\nnamespace App\\Http\\Controllers;\n\nuse App\\Models\\Product;\nuse Illuminate\\Http\\Request;\nuse Illuminate\\Http\\RedirectResponse;\nuse Illuminate\\View\\View;\n\nclass ProductController extends Controller\n{\n    // GET /produse\n    public function index(): View\n    {\n        $products = Product::latest()->paginate(15);\n        return view('products.index', compact('products'));\n    }\n\n    // GET /produse/{id}\n    public function show(Product $product): View\n    {\n        // Route model binding: Laravel gaseste automat produsul!\n        return view('products.show', compact('product'));\n    }\n\n    // POST /produse\n    public function store(Request $request): RedirectResponse\n    {\n        $validated = $request->validate([\n            'name'  => 'required|string|max:255',\n            'price' => 'required|numeric|min:0',\n            'stock' => 'required|integer|min:0',\n        ]);\n\n        Product::create($validated);\n\n        return redirect()->route('products.index')\n            ->with('success', 'Produs adaugat cu succes!');\n    }\n\n    // DELETE /produse/{id}\n    public function destroy(Product $product): RedirectResponse\n    {\n        $product->delete();\n        return redirect()->route('products.index')\n            ->with('success', 'Produs sters!');\n    }\n}\n```\n\nROUTE MODEL BINDING:\n```php\n// Fara binding (manual):\npublic function show(int $id): View {\n    $product = Product::findOrFail($id); // manual\n    return view('products.show', compact('product'));\n}\n\n// Cu binding (automat) — Laravel injecteaza modelul:\npublic function show(Product $product): View {\n    return view('products.show', compact('product')); // magic!\n}\n```\n\nLA INTERVIU: Ce este route model binding? Mecanismul prin care Laravel gaseste automat modelul dupa ID-ul din URL si il injecteaza in controller. Daca nu exista, returneaza automat 404."
      },
      {
        "order": 4,
        "title": "Blade Templates — sintaxa si componente",
        "content": "Blade este template engine-ul Laravel. Fisierele au extensia .blade.php.\n\nSINTAXA BLADE:\n```blade\n{{-- resources/views/products/index.blade.php --}}\n@extends('layouts.app')\n\n@section('title', 'Lista Produse')\n\n@section('content')\n<div class=\"container\">\n    {{-- Variabile: {{ }} encode HTML automat --}}\n    <h1>{{ $titlu }}</h1>\n    \n    {{-- HTML neescapat (doar pentru date de incredere!): --}}\n    {!! $htmlContent !!}\n    \n    {{-- Conditionale: --}}\n    @if($products->isEmpty())\n        <p>Nu exista produse.</p>\n    @elseif($products->count() < 5)\n        <p>Putine produse disponibile.</p>\n    @else\n        {{-- Loop: --}}\n        @foreach($products as $product)\n            <div class=\"card\">\n                <h2>{{ $product->name }}</h2>\n                <p>Pret: {{ number_format($product->price, 2) }} RON</p>\n                \n                {{-- URL-uri cu helper route(): --}}\n                <a href=\"{{ route('products.show', $product->id) }}\">Detalii</a>\n            </div>\n        @endforeach\n    @endif\n    \n    {{-- Paginare: --}}\n    {{ $products->links() }}\n    \n    {{-- Flash messages: --}}\n    @if(session('success'))\n        <div class=\"alert alert-success\">{{ session('success') }}</div>\n    @endif\n</div>\n@endsection\n\n{{-- Layout: resources/views/layouts/app.blade.php --}}\n<!DOCTYPE html>\n<html lang=\"ro\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>@yield('title') | MagazinMeu</title>\n</head>\n<body>\n    @include('layouts.navbar')\n    <main>\n        @yield('content')\n    </main>\n</body>\n</html>\n```\n\nBLADE COMPONENTS (Laravel 7+):\n```bash\nphp artisan make:component Alert\n# Creeaza: app/View/Components/Alert.php + resources/views/components/alert.blade.php\n```\n\n```blade\n{{-- Folosire: --}}\n<x-alert type=\"success\" :message=\"$message\" />\n<x-card title=\"Produs\">\n    Continut card\n</x-card>\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "artisan serve",
        "question": "Ce comanda porneste serverul de development Laravel?",
        "options": [
          "php server start",
          "php artisan serve",
          "composer start",
          "laravel run"
        ],
        "answer": "php artisan serve",
        "explanation": "php artisan serve porneste serverul built-in PHP pe localhost:8000. Pentru productie se foloseste Nginx/Apache.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "resource route",
        "question": "Ce genereaza `Route::resource('produse', ProductController::class)`?",
        "options": [
          "Doar GET /produse",
          "7 route-uri CRUD: index, create, store, show, edit, update, destroy",
          "3 route-uri: get, post, delete",
          "Toate route-urile posibile"
        ],
        "answer": "7 route-uri CRUD: index, create, store, show, edit, update, destroy",
        "explanation": "Resource routing creeaza automat toate route-urile standard REST: GET index, GET create, POST store, GET show, GET edit, PUT update, DELETE destroy.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "blade output",
        "question": "Diferenta intre `{{ $var }}` si `{!! $var !!}` in Blade?",
        "options": [
          "Nu exista diferenta",
          "{{ }} escapeaza HTML (sigur); {!! !!} afiseaza HTML neescapat (periculos cu input user)",
          "{{ }} pentru string, {!! !!} pentru obiecte",
          "{{ }} e mai rapid"
        ],
        "answer": "{{ }} escapeaza HTML (sigur); {!! !!} afiseaza HTML neescapat (periculos cu input user)",
        "explanation": "{{ $user->name }} transforma <script> in &lt;script&gt; — previne XSS. {!! $html !!} pentru continut de incredere (ex: editor WYSIWYG propriu).",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "route model binding",
        "question": "Ce face Route Model Binding cand scrii `show(Product $product)` in loc de `show(int $id)`?",
        "options": [
          "Nu face nimic diferit",
          "Laravel gaseste automat produsul dupa ID-ul din URL si returneaza 404 daca nu exista",
          "Valideaza ID-ul",
          "Cacheaza produsul"
        ],
        "answer": "Laravel gaseste automat produsul dupa ID-ul din URL si returneaza 404 daca nu exista",
        "explanation": "Laravel face Product::findOrFail($id) automat. Elimina cod repetitiv si garanteaza 404 corect.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "blade extends",
        "question": "Ce face `@extends('layouts.app')` intr-un view Blade?",
        "options": [
          "Importa un fisier PHP",
          "Declara ca view-ul mosteneste layout-ul si va umple sectiunile @yield",
          "Creeaza un layout nou",
          "Defineste o sectiune"
        ],
        "answer": "Declara ca view-ul mosteneste layout-ul si va umple sectiunile @yield",
        "explanation": "@extends + @section/@yield = sistem de template inheritance. Layout defineste structura, view-urile umple continutul.",
        "difficulty": "easy"
      },
      {
        "number": 6,
        "name": "route prefix group",
        "question": "Cum grupezi toate route-urile de admin sub /admin cu middleware auth?",
        "options": [
          "Route::admin()->middleware('auth')",
          "Route::prefix('admin')->middleware('auth')->group(function() { ... })",
          "Route::group('admin', 'auth', function() { ... })",
          "middleware('auth')->prefix('admin')"
        ],
        "answer": "Route::prefix('admin')->middleware('auth')->group(function() { ... })",
        "explanation": "Route groups cu prefix si middleware elimina repetitia. Toate route-urile din group primesc /admin prefix si middleware-ul auth.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "named routes",
        "question": "De ce folosesti route-uri cu nume (`->name('products.index')`)?",
        "options": [
          "Sunt mai rapide",
          "Poti genera URL-uri cu route('products.index') fara sa hardcodezi path-ul",
          "Sunt obligatorii",
          "SEO mai bun"
        ],
        "answer": "Poti genera URL-uri cu route('products.index') fara sa hardcodezi path-ul",
        "explanation": "Daca schimbi /produse in /magazine, URL-urile generate cu route() se actualizeaza automat. Hardcodat ar trebui schimbat peste tot.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "make controller",
        "question": "Ce comanda artisan creaza un controller cu toate metodele CRUD predefinite?",
        "options": [
          "php artisan make:controller Product",
          "php artisan make:controller ProductController --resource",
          "php artisan controller:create Product",
          "php artisan generate:controller ProductController"
        ],
        "answer": "php artisan make:controller ProductController --resource",
        "explanation": "--resource genereaza metodele: index, create, store, show, edit, update, destroy. Economiseste timp si asigura conventiile.",
        "difficulty": "easy"
      },
      {
        "number": 9,
        "name": "blade foreach",
        "question": "Cum iterezi o colectie `$products` in Blade?",
        "options": [
          "<?php foreach($products as $p): ?>",
          "@foreach($products as $product) ... @endforeach",
          "@for($products)",
          "@loop($products)"
        ],
        "answer": "@foreach($products as $product) ... @endforeach",
        "explanation": "Directivele Blade @foreach, @if, @while sunt mai curate decat PHP pur. @forelse permite si cazul colectiei goale.",
        "difficulty": "easy"
      },
      {
        "number": 10,
        "name": "view compact",
        "question": "Ce face `return view('products.index', compact('products'))`?",
        "options": [
          "Comprima view-ul",
          "Returneaza view-ul si trimite variabila $products catre el",
          "Cacheaza view-ul",
          "Importa un model"
        ],
        "answer": "Returneaza view-ul si trimite variabila $products catre el",
        "explanation": "compact('products') = ['products' => $products]. Alternativa: view('...')->with('products', $products).",
        "difficulty": "easy"
      },
      {
        "number": 11,
        "name": "flash messages",
        "question": "Cum afisezi un mesaj de succes dupa redirect in Blade?",
        "options": [
          "echo $_SESSION['success']",
          "@if(session('success')) {{ session('success') }} @endif",
          "{{ flash('success') }}",
          "Request::session('success')"
        ],
        "answer": "@if(session('success')) {{ session('success') }} @endif",
        "explanation": "In controller: redirect()->with('success', 'Salvat!'). In view: session('success') preia din flash session.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Routes CRUD",
        "question": "Defineste route-urile pentru un API simplu de produse: listare (GET /api/products) si creare (POST /api/products) in routes/api.php.",
        "options": [],
        "answer": "",
        "explanation": "Route::get('/products', [ProductController::class, 'index']); Route::post('/products', [ProductController::class, 'store']);",
        "difficulty": "easy"
      },
      {
        "number": 13,
        "name": "Blade template",
        "question": "Scrie un fragment Blade care afiseaza o lista de produse sau mesajul 'Nu exista produse' daca e goala.",
        "options": [],
        "answer": "",
        "explanation": "@if($products->isEmpty()) <p>Nu exista produse.</p> @else @foreach($products as $p) <div>{{ $p->name }}</div> @endforeach @endif",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "artisan comenzi",
        "question": "Care comanda artisan listeaza toate route-urile definite in aplicatie?",
        "options": [
          "php artisan routes",
          "php artisan route:list",
          "php artisan list:routes",
          "php artisan show:routes"
        ],
        "answer": "php artisan route:list",
        "explanation": "php artisan route:list afiseaza: verb HTTP, URI, name, action, middleware. Esential pentru debug routing.",
        "difficulty": "easy"
      },
      {
        "number": 15,
        "name": "blade component",
        "question": "Cum creezi si folosesti o componenta Blade reutilizabila `<x-alert type='success'>`?",
        "options": [
          "Numai cu includes",
          "php artisan make:component Alert, apoi <x-alert type='success' />",
          "Route::component('alert')",
          "Componente nu exista in Blade"
        ],
        "answer": "php artisan make:component Alert, apoi <x-alert type='success' />",
        "explanation": "make:component creeaza app/View/Components/Alert.php (logica) + resources/views/components/alert.blade.php (template). Reutilizabila in orice view.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "php-laravel-eloquent",
    "title": "33. Laravel Eloquent ORM",
    "order": 33,
    "theory": [
      {
        "order": 1,
        "title": "Eloquent Models si Migrations",
        "content": "Eloquent este ORM-ul Laravel. Fiecare tabel din baza de date are un Model corespondent.\n\nCREARE MODEL + MIGRATION:\n```bash\nphp artisan make:model Product -m\n# -m creeaza automat si migration\n```\n\nMIGRATION:\n```php\n<?php\n// database/migrations/2025_01_15_create_products_table.php\nuse Illuminate\\Database\\Migrations\\Migration;\nuse Illuminate\\Database\\Schema\\Blueprint;\nuse Illuminate\\Support\\Facades\\Schema;\n\nreturn new class extends Migration {\n    public function up(): void {\n        Schema::create('products', function (Blueprint $table) {\n            $table->id();                          // BIGINT AUTO INCREMENT PK\n            $table->string('name');                // VARCHAR(255)\n            $table->text('description')->nullable(); // TEXT, poate fi NULL\n            $table->decimal('price', 8, 2);        // DECIMAL(8,2)\n            $table->integer('stock')->default(0);  // cu valoare default\n            $table->foreignId('category_id')       // FK spre categories\n                  ->constrained()->onDelete('cascade');\n            $table->timestamps();                  // created_at + updated_at\n        });\n    }\n\n    public function down(): void {\n        Schema::dropIfExists('products');\n    }\n};\n```\n\nMODEL:\n```php\n<?php\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Model;\nuse Illuminate\\Database\\Eloquent\\Factories\\HasFactory;\n\nclass Product extends Model {\n    use HasFactory;\n\n    // Campuri ce pot fi mass-assigned:\n    protected $fillable = ['name', 'description', 'price', 'stock', 'category_id'];\n    // SAU protejezi doar acestea:\n    // protected $guarded = ['id'];\n\n    // Cast-uri automate:\n    protected $casts = [\n        'price' => 'decimal:2',\n        'stock' => 'integer',\n    ];\n}\n```\n\nRULARE MIGRARI:\n```bash\nphp artisan migrate            # ruleaza migrarile noi\nphp artisan migrate:rollback   # anuleaza ultima migrare\nphp artisan migrate:fresh --seed  # sterge totul si reseed (dev)\n```"
      },
      {
        "order": 2,
        "title": "CRUD cu Eloquent si Query Builder",
        "content": "Eloquent ofera metode fluente pentru toate operatiunile pe baza de date.\n\nCREATE:\n```php\n<?php\n// Metoda 1 — create() (mass assignment, necesita $fillable):\n$product = Product::create([\n    'name'  => 'Laptop Dell',\n    'price' => 3499.99,\n    'stock' => 10,\n]);\n\n// Metoda 2 — new + save():\n$product = new Product();\n$product->name  = 'Laptop Dell';\n$product->price = 3499.99;\n$product->save();\n```\n\nREAD:\n```php\n<?php\n// Toate inregistrarile:\n$products = Product::all();\n\n// Cu conditii:\n$products = Product::where('price', '<', 1000)\n                   ->where('stock', '>', 0)\n                   ->orderBy('price', 'asc')\n                   ->get();\n\n// Gaseste dupa ID (sau 404 automat):\n$product = Product::find(5);          // null daca nu exista\n$product = Product::findOrFail(5);    // 404 daca nu exista\n\n// Primul rezultat:\n$cheapest = Product::orderBy('price')->first();\n\n// Count:\n$total = Product::where('stock', '>', 0)->count();\n\n// Paginare:\n$products = Product::paginate(15);   // 15 pe pagina\n```\n\nUPDATE:\n```php\n<?php\n// Metoda 1:\n$product = Product::findOrFail(5);\n$product->update(['price' => 2999.99, 'stock' => 8]);\n\n// Metoda 2 — bulk update:\nProduct::where('category_id', 3)->update(['stock' => 0]);\n```\n\nDELETE:\n```php\n<?php\n$product = Product::findOrFail(5);\n$product->delete();\n\n// Bulk delete:\nProduct::where('stock', 0)->delete();\n\n// Soft delete (nu sterge fizic — necesita SoftDeletes trait):\n// $product->delete() seteaza deleted_at\n// Product::withTrashed()->find(5) include sterse\n```"
      },
      {
        "order": 3,
        "title": "Relatii Eloquent — hasMany, belongsTo, manyToMany",
        "content": "Eloquent suporta toate tipurile de relatii din baza de date.\n\nONE-TO-MANY:\n```php\n<?php\n// Un Category are mai multe Products:\nclass Category extends Model {\n    public function products(): HasMany {\n        return $this->hasMany(Product::class);\n    }\n}\n\n// Un Product apartine unui Category:\nclass Product extends Model {\n    public function category(): BelongsTo {\n        return $this->belongsTo(Category::class);\n    }\n}\n\n// Folosire:\n$category = Category::find(1);\n$products = $category->products; // toate produsele din categoria 1\n\n$product = Product::find(5);\n$categoryName = $product->category->name;\n```\n\nMANY-TO-MANY:\n```php\n<?php\n// Un Product poate fi in mai multe Orders.\n// Un Order poate contine mai multe Products.\n// Tabel pivot: order_product (order_id, product_id, quantity)\n\nclass Product extends Model {\n    public function orders(): BelongsToMany {\n        return $this->belongsToMany(Order::class)\n                    ->withPivot('quantity', 'price')  // coloane extra in pivot\n                    ->withTimestamps();\n    }\n}\n\n// Adauga relatie:\n$order->products()->attach($productId, ['quantity' => 3, 'price' => 99.99]);\n\n// Sterge:\n$order->products()->detach($productId);\n\n// Sincronizeaza (sterge ce nu e in array, adauga ce lipseste):\n$order->products()->sync([1, 2, 3]);\n\n// Acces pivot:\nforeach ($order->products as $product) {\n    echo $product->pivot->quantity . 'x ' . $product->name;\n}\n```\n\nONE-TO-ONE:\n```php\n<?php\nclass User extends Model {\n    public function profile(): HasOne {\n        return $this->hasOne(Profile::class);\n    }\n}\n```"
      },
      {
        "order": 4,
        "title": "Eager Loading si Scopes",
        "content": "N+1 PROBLEM SI EAGER LOADING:\n```php\n<?php\n// GRESIT — N+1 problema:\n$products = Product::all(); // 1 query\nforeach ($products as $product) {\n    echo $product->category->name; // N queries! (1 per produs)\n}\n// 100 produse = 101 queries!\n\n// CORECT — Eager loading cu with():\n$products = Product::with('category')->get(); // 2 queries total\nforeach ($products as $product) {\n    echo $product->category->name; // 0 queries suplimentare\n}\n\n// Multiple relatii:\n$products = Product::with(['category', 'reviews', 'tags'])->get();\n\n// Nested (relatii ale relatiilor):\n$orders = Order::with('products.category')->get();\n\n// Lazy eager loading (dupa ce ai deja colectia):\n$products->load('category');\n```\n\nSCOPES — interogari reutilizabile:\n```php\n<?php\nclass Product extends Model {\n    // Local scope — se apeleaza cu ->active():\n    public function scopeActive(Builder $query): Builder {\n        return $query->where('active', true)->where('stock', '>', 0);\n    }\n\n    // Scope cu parametru:\n    public function scopeMinPrice(Builder $query, float $price): Builder {\n        return $query->where('price', '>=', $price);\n    }\n\n    // Global scope (aplicat automat la toate query-urile):\n    protected static function booted(): void {\n        static::addGlobalScope('active', function (Builder $builder) {\n            $builder->where('active', true);\n        });\n    }\n}\n\n// Folosire scopes:\n$products = Product::active()->minPrice(100)->orderBy('price')->get();\n// SELECT * FROM products WHERE active=1 AND stock>0 AND price>=100 ORDER BY price\n```\n\nACCESSOR SI MUTATOR:\n```php\n<?php\nclass Product extends Model {\n    // Accessor — modifica valoarea la citire:\n    protected function priceFormatted(): Attribute {\n        return Attribute::make(\n            get: fn($value) => number_format($this->price, 2) . ' RON'\n        );\n    }\n    // $product->price_formatted = '3.499,00 RON'\n}\n```\n\nLA INTERVIU: Ce este problema N+1? Faci 1 query pentru lista, apoi N query-uri pentru fiecare item (relatii). Solutia: with() pentru eager loading. Detectare: Laravel Debugbar, Telescope."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "fillable",
        "question": "De ce definesti `$fillable` in modelul Eloquent?",
        "options": [
          "SEO",
          "Protectie la mass assignment — previne ca atacatorul sa seteze campuri nepermise (ex: is_admin=true)",
          "Validare automata",
          "Indexare DB"
        ],
        "answer": "Protectie la mass assignment — previne ca atacatorul sa seteze campuri nepermise (ex: is_admin=true)",
        "explanation": "Fara $fillable, Product::create(request->all()) ar permite setarea oricarui camp, inclusiv is_admin sau role.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "findOrFail",
        "question": "Diferenta intre `Product::find(5)` si `Product::findOrFail(5)`?",
        "options": [
          "Identice",
          "find(): null daca nu exista; findOrFail(): aruncA ModelNotFoundException (404)",
          "findOrFail() e mai lent",
          "find() face eager loading"
        ],
        "answer": "find(): null daca nu exista; findOrFail(): aruncA ModelNotFoundException (404)",
        "explanation": "findOrFail e recomandat in controllere: eviti sa verifici manual if(!$product) return 404.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "hasMany",
        "question": "Cum definesti relatia in modelul Category: o categorie are mai multe produse?",
        "options": [
          "return $this->hasOne(Product::class)",
          "return $this->hasMany(Product::class)",
          "return $this->belongsToMany(Product::class)",
          "return $this->products()"
        ],
        "answer": "return $this->hasMany(Product::class)",
        "explanation": "hasMany = one-to-many. $category->products returneaza colectia. Laravel stie ca foreign key e category_id in products.",
        "difficulty": "easy"
      },
      {
        "number": 4,
        "name": "eager loading",
        "question": "Cum eviti problema N+1 cand afisezi produse cu numele categoriei?",
        "options": [
          "Product::all() si $product->category in foreach",
          "Product::with('category')->get()",
          "Product::join('categories', ...)->get()",
          "Product::load('category')"
        ],
        "answer": "Product::with('category')->get()",
        "explanation": "with('category') face 2 query-uri total. Fara: 1 + N (unul per produs). with() = eager loading.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "scope",
        "question": "Ce face `scopeActive` definit in model?",
        "options": [
          "O functie statica",
          "Adauga o interogare reutilizabila: Product::active() = WHERE active=1 si orice conditii din scope",
          "Filtreaza dupa created_at",
          "Valideaza modelul"
        ],
        "answer": "Adauga o interogare reutilizabila: Product::active() = WHERE active=1 si orice conditii din scope",
        "explanation": "Scopes encapsuleaza logica de filtrare. Reutilizabila in tot proiectul, chainabila: Product::active()->minPrice(100)->get().",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "migration timestamps",
        "question": "Ce face `$table->timestamps()` intr-o migrare?",
        "options": [
          "Adauga un camp timestamp unic",
          "Adauga campurile created_at si updated_at gestionate automat de Eloquent",
          "Adauga deleted_at",
          "Indexeaza tabelul"
        ],
        "answer": "Adauga campurile created_at si updated_at gestionate automat de Eloquent",
        "explanation": "Eloquent actualizeaza automat created_at la INSERT si updated_at la fiecare UPDATE.",
        "difficulty": "easy"
      },
      {
        "number": 7,
        "name": "pivot table",
        "question": "Intr-o relatie many-to-many (produse <-> comenzi), cum accesezi cantitatea stocata in tabelul pivot?",
        "options": [
          "$product->quantity",
          "$product->pivot->quantity (dupa withPivot('quantity') in relatie)",
          "$order->products->quantity",
          "Separat din DB"
        ],
        "answer": "$product->pivot->quantity (dupa withPivot('quantity') in relatie)",
        "explanation": "pivot e obiectul ce reprezinta randul din tabelul intermediar. Trebuie declarat cu withPivot() in definitia relatiei.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "soft delete",
        "question": "Ce face Soft Delete in Laravel?",
        "options": [
          "Sterge definitiv",
          "Seteaza deleted_at in loc sa stearga fizic — inregistrarea e ascunsa dar recuperabila",
          "Arhiveaza in alt tabel",
          "Marcheaza ca inactiv"
        ],
        "answer": "Seteaza deleted_at in loc sa stearga fizic — inregistrarea e ascunsa dar recuperabila",
        "explanation": "use SoftDeletes in model + $table->softDeletes() in migration. Product::withTrashed() include si sterse. Product::restore() recupereaza.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "query paginate",
        "question": "Cum returnezi produsele paginate (15 per pagina) din controller?",
        "options": [
          "Product::all()->slice(0, 15)",
          "Product::paginate(15)",
          "Product::limit(15)->get()",
          "Product::take(15)->all()"
        ],
        "answer": "Product::paginate(15)",
        "explanation": "paginate() face automat COUNT si LIMIT/OFFSET. Returneaza LengthAwarePaginator. In Blade: {{ $products->links() }} genereaza butoanele de paginare.",
        "difficulty": "easy"
      },
      {
        "number": 10,
        "name": "cascade delete",
        "question": "Ce face `->onDelete('cascade')` in migration la foreign key?",
        "options": [
          "Sterge tabelul parinte",
          "La stergerea parintelui, sterge automat si toate inregistrarile copil",
          "Face backup",
          "Aruncaa eroare la stergere"
        ],
        "answer": "La stergerea parintelui, sterge automat si toate inregistrarile copil",
        "explanation": "Se sterge categoria 5 => se sterg automat toate produsele din categoria 5. Alternativa: SET NULL.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "attach detach sync",
        "question": "Cum sincronizezi produsele unui order (ID 1, 2, 3) stergand relatiile inexistente?",
        "options": [
          "$order->products()->add([1,2,3])",
          "$order->products()->sync([1,2,3])",
          "$order->products()->attach([1,2,3])",
          "$order->products()->update([1,2,3])"
        ],
        "answer": "$order->products()->sync([1,2,3])",
        "explanation": "sync() sterge relatiile care nu sunt in array si adauga cele noi. attach() adauga (poate duplica). detach() sterge.",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "Eloquent scope",
        "question": "Scrie un scope `scopeInStock` care filtreaza produsele cu stock > 0.",
        "options": [],
        "answer": "",
        "explanation": "public function scopeInStock(Builder $query): Builder { return $query->where('stock', '>', 0); }",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Migration product",
        "question": "Scrie o migrare pentru tabelul `reviews` cu: id, product_id (FK), user_id (FK), rating (1-5), body (text), timestamps.",
        "options": [],
        "answer": "",
        "explanation": "$table->id(); $table->foreignId('product_id')->constrained()->onDelete('cascade'); $table->foreignId('user_id')->constrained(); $table->tinyInteger('rating'); $table->text('body'); $table->timestamps();",
        "difficulty": "hard"
      },
      {
        "number": 14,
        "name": "eager nested",
        "question": "Cum faci eager loading pentru comenzi, cu produse si categoria fiecarui produs?",
        "options": [
          "Order::with('products')->with('category')->get()",
          "Order::with('products.category')->get()",
          "Order::with(['products', 'categories'])->get()",
          "Order::load('products', 'category')->get()"
        ],
        "answer": "Order::with('products.category')->get()",
        "explanation": "Dot notation pentru relatii nested. 'products.category' = eager load relatia products, iar pentru fiecare produs eager load category.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "n+1 detect",
        "question": "Ce tool Laravel detecteaza automat problema N+1 in development?",
        "options": [
          "php artisan optimize",
          "Laravel Debugbar sau Telescope — afiseaza toate query-urile executate per request",
          "error_log()",
          "php artisan query:check"
        ],
        "answer": "Laravel Debugbar sau Telescope — afiseaza toate query-urile executate per request",
        "explanation": "Debugbar (barryvdh/laravel-debugbar) afiseaza un toolbar cu query-uri, timp, memorie. Telescope e interfata web de monitoring.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "php-laravel-auth",
    "title": "34. Laravel Auth si Middleware (Sanctum, Gates, Policies)",
    "order": 34,
    "theory": [
      {
        "order": 1,
        "title": "Laravel Sanctum — API Token Authentication",
        "content": "Sanctum ofera doua mecanisme de autentificare: SPA authentication (cookie-based) si API tokens.\n\nINSTALARE SANCTUM:\n```bash\ncomposer require laravel/sanctum\nphp artisan vendor:publish --provider=\"Laravel\\Sanctum\\SanctumServiceProvider\"\nphp artisan migrate\n```\n\nCONFIGURARA USER MODEL:\n```php\n<?php\nuse Laravel\\Sanctum\\HasApiTokens;\n\nclass User extends Authenticatable {\n    use HasApiTokens, HasFactory, Notifiable;\n}\n```\n\nCREARE TOKEN (login):\n```php\n<?php\n// AuthController.php\npublic function login(Request $request) {\n    $request->validate([\n        'email'    => 'required|email',\n        'password' => 'required',\n    ]);\n\n    $user = User::where('email', $request->email)->first();\n\n    if (!$user || !Hash::check($request->password, $user->password)) {\n        return response()->json(['message' => 'Credentiale incorecte'], 401);\n    }\n\n    // Creeaza token (poti da un nume si abilitati):\n    $token = $user->createToken('api-token', ['read', 'write'])->plainTextToken;\n\n    return response()->json([\n        'user'  => $user,\n        'token' => $token,\n    ]);\n}\n\npublic function logout(Request $request) {\n    // Sterge token-ul curent:\n    $request->user()->currentAccessToken()->delete();\n    return response()->json(['message' => 'Deconectat']);\n}\n```\n\nPROTEJARE ROUTE-URI:\n```php\n// routes/api.php\nRoute::post('/login', [AuthController::class, 'login']);\nRoute::post('/register', [AuthController::class, 'register']);\n\nRoute::middleware('auth:sanctum')->group(function () {\n    Route::get('/user', fn(Request $r) => $r->user());\n    Route::apiResource('products', ProductController::class);\n    Route::post('/logout', [AuthController::class, 'logout']);\n});\n```\n\nAPEL API CU TOKEN:\n```bash\n# In request header:\nAuthorization: Bearer 1|abc123xyz...\n\n# Sau in PHP cu Guzzle:\n$response = $client->get('/api/products', [\n    'headers' => ['Authorization' => 'Bearer ' . $token]\n]);\n```"
      },
      {
        "order": 2,
        "title": "Middleware custom — cereri si protectie",
        "content": "Middleware intercepteaza request-urile HTTP inainte sa ajunga la controller.\n\nCREARE MIDDLEWARE:\n```bash\nphp artisan make:middleware CheckAdminRole\n```\n\nIMPLEMENTARE:\n```php\n<?php\nnamespace App\\Http\\Middleware;\n\nuse Closure;\nuse Illuminate\\Http\\Request;\n\nclass CheckAdminRole {\n    public function handle(Request $request, Closure $next): mixed {\n        // Verifica autentificare:\n        if (!auth()->check()) {\n            return redirect()->route('login');\n        }\n\n        // Verifica rol admin:\n        if (auth()->user()->role !== 'admin') {\n            abort(403, 'Acces interzis. Necesita rol admin.');\n        }\n\n        // Continua catre controller:\n        return $next($request);\n    }\n}\n```\n\nINREGISTRARE MIDDLEWARE (app/Http/Kernel.php sau bootstrap/app.php in L11+):\n```php\n<?php\n// Laravel 11 — bootstrap/app.php:\nreturn Application::configure(basePath: dirname(__DIR__))\n    ->withRouting(...)\n    ->withMiddleware(function (Middleware $middleware) {\n        $middleware->alias([\n            'admin' => \\App\\Http\\Middleware\\CheckAdminRole::class,\n        ]);\n    })\n    ->create();\n```\n\nFOLOSIRE:\n```php\n// In routes:\nRoute::middleware('admin')->group(function () {\n    Route::resource('users', AdminUserController::class);\n});\n\n// In controller:\n$this->middleware('admin')->only(['store', 'destroy']);\n```\n\nMIDDLEWARE PARAMETRIZAT:\n```php\n<?php\npublic function handle(Request $request, Closure $next, string ...$roles): mixed {\n    if (!in_array(auth()->user()->role, $roles)) {\n        abort(403);\n    }\n    return $next($request);\n}\n// Folosire: Route::middleware('role:admin,manager')\n```"
      },
      {
        "order": 3,
        "title": "Gates si Policies — Autorizare granulara",
        "content": "Gates = closure-uri simple pentru autorizare. Policies = clase organizate per model.\n\nGATES (AuthServiceProvider):\n```php\n<?php\nuse Illuminate\\Support\\Facades\\Gate;\n\nGate::define('edit-product', function (User $user, Product $product) {\n    return $user->id === $product->user_id || $user->role === 'admin';\n});\n\nGate::define('is-admin', function (User $user) {\n    return $user->role === 'admin';\n});\n\n// Folosire in controller:\nif (Gate::denies('edit-product', $product)) {\n    abort(403);\n}\n\n// Sau mai elegant:\nGate::authorize('edit-product', $product); // aruncaa 403 automat\n\n// In Blade:\n@can('edit-product', $product)\n    <a href=\"...\">Editeaza</a>\n@endcan\n\n@cannot('is-admin')\n    <p>Nu esti admin</p>\n@endcannot\n```\n\nPOLICIES — organizate per model:\n```bash\nphp artisan make:policy ProductPolicy --model=Product\n```\n\n```php\n<?php\nclass ProductPolicy {\n    public function view(User $user, Product $product): bool {\n        return true; // toti pot vedea\n    }\n\n    public function update(User $user, Product $product): bool {\n        return $user->id === $product->user_id;\n    }\n\n    public function delete(User $user, Product $product): bool {\n        return $user->id === $product->user_id || $user->isAdmin();\n    }\n    \n    public function create(User $user): bool {\n        return $user->hasVerifiedEmail();\n    }\n}\n\n// In controller — authorize() foloseste Policy automat:\npublic function update(Request $request, Product $product) {\n    $this->authorize('update', $product); // ProductPolicy@update\n    // ...\n}\n```"
      },
      {
        "order": 4,
        "title": "Rate Limiting si Session Security",
        "content": "RATE LIMITING:\n```php\n<?php\n// routes/api.php — limite predefinite:\nRoute::middleware(['auth:sanctum', 'throttle:api'])->group(...);\n\n// config/sanctum.php sau RouteServiceProvider:\nuse Illuminate\\Cache\\RateLimiting\\Limit;\nuse Illuminate\\Support\\Facades\\RateLimiter;\n\nRateLimiter::for('api', function (Request $request) {\n    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());\n});\n\nRateLimiter::for('login', function (Request $request) {\n    return [\n        Limit::perMinute(5)->by($request->ip()),\n        Limit::perMinute(3)->by($request->input('email')),\n    ];\n});\n\n// Custom limit pe route:\nRoute::middleware('throttle:10,1')->post('/contact', ...);\n// 10 requesturi pe minut per IP\n```\n\nSESSION SECURITY:\n```php\n<?php\n// config/session.php:\n'secure' => env('SESSION_SECURE_COOKIE', true),  // HTTPS only\n'same_site' => 'lax',  // CSRF protection\n'lifetime' => 120,     // minute\n\n// Regenerare session ID dupa login (previne session fixation):\nauth()->login($user);\nrequest()->session()->regenerate();\n\n// CSRF protection in forms Blade:\n<form method=\"POST\">\n    @csrf  // <input type=\"hidden\" name=\"_token\" value=\"...\">\n    ...\n</form>\n\n// Invalidare la logout:\npublic function logout(Request $request) {\n    Auth::logout();\n    $request->session()->invalidate();\n    $request->session()->regenerateToken();\n    return redirect('/');\n}\n```\n\nPAROLE HASH:\n```php\n<?php\n// Hash la creare:\n'password' => Hash::make($request->password)\n\n// Verificare:\nHash::check($request->password, $user->password)\n\n// Niciodata store parola plain text!\n// Bcrypt e default. Argon2id disponibil in config/hashing.php\n```\n\nLA INTERVIU: Diferenta Gate vs Policy? Gate e ideal pentru autorizare simpla (o regula, nu legata de model). Policy e organizata per model — toate regulile pentru Product intr-o singura clasa."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "sanctum install",
        "question": "Ce face `php artisan vendor:publish --provider=\"Laravel\\Sanctum\\SanctumServiceProvider\"`?",
        "options": [
          "Instaleaza Sanctum",
          "Publica fisierele de config si migration ale Sanctum in proiectul tau",
          "Creeaza token-uri",
          "Instaleaza middleware"
        ],
        "answer": "Publica fisierele de config si migration ale Sanctum in proiectul tau",
        "explanation": "vendor:publish copiaza fisierele din pachet (config/sanctum.php, migration pentru personal_access_tokens) in proiectul tau.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "auth sanctum middleware",
        "question": "Cum protejezi un group de route-uri API sa necesite autentificare Sanctum?",
        "options": [
          "Route::auth()->group(...)",
          "Route::middleware('auth:sanctum')->group(...)",
          "Route::protected()->group(...)",
          "Sanctum::protect()->group(...)"
        ],
        "answer": "Route::middleware('auth:sanctum')->group(...)",
        "explanation": "middleware('auth:sanctum') verifica Bearer token din header Authorization. Fara token valid = 401 Unauthenticated.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "csrf blade",
        "question": "De ce trebuie `@csrf` in fiecare form POST Blade?",
        "options": [
          "SEO",
          "Previne CSRF attacks — verifica ca form-ul vine din site-ul propriu, nu de pe alt domeniu",
          "Validare date",
          "Sesiune"
        ],
        "answer": "Previne CSRF attacks — verifica ca form-ul vine din site-ul propriu, nu de pe alt domeniu",
        "explanation": "CSRF = Cross-Site Request Forgery. Atacatorul poate face userul sa trimita un form de pe alt site. Token-ul @csrf previne asta.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "gate define",
        "question": "Ce face `Gate::define('edit-post', function(User $user, Post $post) { return $user->id === $post->user_id; })`?",
        "options": [
          "Creeaza un route",
          "Defineste o regula de autorizare: userul poate edita postul doar daca e autorul",
          "Face middleware",
          "Valideaza inputul"
        ],
        "answer": "Defineste o regula de autorizare: userul poate edita postul doar daca e autorul",
        "explanation": "Gate::define creeaza o regula refolosibila. Verificata cu Gate::allows(), Gate::denies(), @can in Blade.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "policy vs gate",
        "question": "Cand alegi Policy in loc de Gate?",
        "options": [
          "Intotdeauna Gate",
          "Policy: cand ai mai multe reguli pentru acelasi model (view, create, update, delete); Gate: reguli izolate simple",
          "Policy e deprecat",
          "Policy e mai rapida"
        ],
        "answer": "Policy: cand ai mai multe reguli pentru acelasi model (view, create, update, delete); Gate: reguli izolate simple",
        "explanation": "ProductPolicy grupeaza toate regulile pentru Product. Mai organizat decat 5 Gate::define separate.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "rate limiting",
        "question": "Cum limitezi endpoint-ul /api/login la 5 requesturi pe minut per IP?",
        "options": [
          "Route::get('/login')->limit(5)",
          "Route::middleware('throttle:5,1')->post('/login', ...)",
          "RateLimit::ip(5)",
          "max_requests=5 in .env"
        ],
        "answer": "Route::middleware('throttle:5,1')->post('/login', ...)",
        "explanation": "throttle:5,1 = 5 requesturi pe 1 minut. Previne brute force. Raspuns 429 Too Many Requests cand depasesti.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "hash make",
        "question": "Cum salvezi parola unui utilizator nou in Laravel?",
        "options": [
          "$user->password = $request->password",
          "$user->password = Hash::make($request->password)",
          "$user->password = md5($request->password)",
          "$user->password = encrypt($request->password)"
        ],
        "answer": "$user->password = Hash::make($request->password)",
        "explanation": "Hash::make foloseste bcrypt implicit. NICIODATA plain text sau MD5/SHA1. Hash::check verifica parola la login.",
        "difficulty": "easy"
      },
      {
        "number": 8,
        "name": "session regenerate",
        "question": "De ce apelezi `$request->session()->regenerate()` dupa login?",
        "options": [
          "Curata sesiunea",
          "Previne Session Fixation Attack — genereaza un nou ID de sesiune",
          "Refresheaza token-ul",
          "Invalidare CSRF"
        ],
        "answer": "Previne Session Fixation Attack — genereaza un nou ID de sesiune",
        "explanation": "Session fixation: atacatorul iti da un session ID cunoscut, tu te loghezi cu el, acum atacatorul are sesiunea ta autentificata.",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "can blade",
        "question": "Cum afisezi butonul 'Sterge' in Blade doar daca userul poate sterge produsul?",
        "options": [
          "@if(auth()->user()->isAdmin())",
          "@can('delete', $product) ... @endcan",
          "@auth ... @endauth",
          "@role('admin') ... @endrole"
        ],
        "answer": "@can('delete', $product) ... @endcan",
        "explanation": "@can verifica Gate sau Policy automat. @can('delete', $product) apeleaza ProductPolicy@delete intern.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "authorize controller",
        "question": "Ce face `$this->authorize('update', $product)` intr-un controller?",
        "options": [
          "Face update",
          "Verifica PolicyPolicy@update si aruncaa 403 automat daca nu e permis",
          "Valideaza requestul",
          "Logs actiunea"
        ],
        "answer": "Verifica PolicyPolicy@update si aruncaa 403 automat daca nu e permis",
        "explanation": "authorize() e shortcut pentru Gate::authorize(). Aruncaa AuthorizationException (403) daca regula returneaza false.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "create token",
        "question": "Cum creezi un API token Sanctum pentru un user cu abilitatea 'read'?",
        "options": [
          "$user->token('read')",
          "$user->createToken('device', ['read'])->plainTextToken",
          "Sanctum::generate($user, 'read')",
          "Token::create($user)"
        ],
        "answer": "$user->createToken('device', ['read'])->plainTextToken",
        "explanation": "createToken('name', ['abilities']). plainTextToken returneaza token-ul in text, afisabil o singura data la creare.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Middleware custom",
        "question": "Scrie un middleware `EnsureEmailVerified` care redirecteaza userul la /verify-email daca nu are emailul verificat.",
        "options": [],
        "answer": "",
        "explanation": "if (!auth()->check() || !auth()->user()->hasVerifiedEmail()) { return redirect('/verify-email'); } return $next($request);",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Policy implementare",
        "question": "Scrie metoda `update` din PostPolicy: un user poate edita postul daca e autorul SAU are rolul 'editor'.",
        "options": [],
        "answer": "",
        "explanation": "return $user->id === $post->user_id || $user->role === 'editor';",
        "difficulty": "easy"
      },
      {
        "number": 14,
        "name": "throttle custom",
        "question": "Cum configurezi RateLimiter named 'uploads': max 10 uploaduri pe ora per user autentificat?",
        "options": [
          "throttle:10,60",
          "RateLimiter::for('uploads', fn($r) => Limit::perHour(10)->by($r->user()->id))",
          "upload_limit=10 in .env",
          "middleware('throttle:uploads')"
        ],
        "answer": "RateLimiter::for('uploads', fn($r) => Limit::perHour(10)->by($r->user()->id))",
        "explanation": "RateLimiter::for() defineste limite named. Limit::perHour(10) = 10 pe ora. by() = cheia de identificare (user ID).",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "logout complet",
        "question": "Care este secventa corecta de logout in Laravel (web, cu sesiune)?",
        "options": [
          "session()->destroy()",
          "Auth::logout(); $request->session()->invalidate(); $request->session()->regenerateToken(); return redirect('/')",
          "Auth::logout(); return redirect('/')",
          "session()->flush()"
        ],
        "answer": "Auth::logout(); $request->session()->invalidate(); $request->session()->regenerateToken(); return redirect('/')",
        "explanation": "invalidate() distruge sesiunea. regenerateToken() genereaza nou CSRF token. Toate 3 sunt necesare pentru logout complet si sigur.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "php-apis-moderne",
    "title": "35. PHP APIs Moderne (REST cu Laravel)",
    "order": 35,
    "theory": [
      {
        "order": 1,
        "title": "API Resources si Response formatting",
        "content": "API Resources transforma modelele Eloquent in JSON structurat si consistent.\n\nCREARE RESOURCE:\n```bash\nphp artisan make:resource ProductResource\nphp artisan make:resource ProductCollection\n```\n\nIMPLEMENTARE:\n```php\n<?php\nnamespace App\\Http\\Resources;\n\nuse Illuminate\\Http\\Resources\\Json\\JsonResource;\n\nclass ProductResource extends JsonResource {\n    public function toArray(Request $request): array {\n        return [\n            'id'          => $this->id,\n            'name'        => $this->name,\n            'price'       => (float) $this->price,\n            'price_label' => number_format($this->price, 2) . ' RON',\n            'in_stock'    => $this->stock > 0,\n            'category'    => new CategoryResource($this->whenLoaded('category')),\n            'reviews_count' => $this->reviews_count,\n            'created_at'  => $this->created_at->toISOString(),\n            // Camp conditional — apare doar pentru admin:\n            'cost'        => $this->when(\n                $request->user()?->isAdmin(),\n                $this->cost\n            ),\n        ];\n    }\n}\n\n// Folosire in controller:\npublic function show(Product $product): ProductResource {\n    $product->load('category');\n    return new ProductResource($product);\n}\n\npublic function index(): AnonymousResourceCollection {\n    $products = Product::with('category')->paginate(15);\n    return ProductResource::collection($products);\n}\n```\n\nRASPUNS JSON AUTOMAT:\n```json\n{\n  \"data\": {\n    \"id\": 1,\n    \"name\": \"Laptop Dell\",\n    \"price\": 3499.99,\n    \"price_label\": \"3,499.99 RON\",\n    \"in_stock\": true,\n    \"category\": { \"id\": 2, \"name\": \"Laptopuri\" },\n    \"created_at\": \"2025-01-15T14:30:00.000Z\"\n  }\n}\n```"
      },
      {
        "order": 2,
        "title": "Request Validation cu Form Requests",
        "content": "Form Requests extrag validarea din controller intr-o clasa separata.\n\nCREARE:\n```bash\nphp artisan make:request StoreProductRequest\nphp artisan make:request UpdateProductRequest\n```\n\nIMPLEMENTARE:\n```php\n<?php\nnamespace App\\Http\\Requests;\n\nuse Illuminate\\Foundation\\Http\\FormRequest;\n\nclass StoreProductRequest extends FormRequest {\n    // Cine are voie sa faca aceasta cerere:\n    public function authorize(): bool {\n        return auth()->user()->can('create', Product::class);\n    }\n\n    // Regulile de validare:\n    public function rules(): array {\n        return [\n            'name'        => 'required|string|min:3|max:255|unique:products,name',\n            'description' => 'nullable|string|max:5000',\n            'price'       => 'required|numeric|min:0|max:999999.99',\n            'stock'       => 'required|integer|min:0',\n            'category_id' => 'required|exists:categories,id',\n            'images'      => 'nullable|array|max:5',\n            'images.*'    => 'image|mimes:jpg,png,webp|max:2048',\n        ];\n    }\n\n    // Mesaje personalizate:\n    public function messages(): array {\n        return [\n            'name.required'     => 'Numele produsului este obligatoriu.',\n            'price.numeric'     => 'Pretul trebuie sa fie un numar.',\n            'category_id.exists'=> 'Categoria selectata nu exista.',\n        ];\n    }\n}\n\n// In controller — injectare automata:\npublic function store(StoreProductRequest $request): JsonResponse {\n    // $request->validated() = doar campurile validate!\n    $product = Product::create($request->validated());\n    return response()->json(new ProductResource($product), 201);\n}\n```\n\nERRORI VALIDARE AUTOMATA:\n```json\n{\n  \"message\": \"The given data was invalid.\",\n  \"errors\": {\n    \"name\": [\"Numele produsului este obligatoriu.\"],\n    \"price\": [\"Pretul trebuie sa fie un numar.\"]\n  }\n}\n```"
      },
      {
        "order": 3,
        "title": "Paginare API si Filtrare avansata",
        "content": "PAGINARE API:\n```php\n<?php\npublic function index(Request $request): AnonymousResourceCollection {\n    $query = Product::with('category');\n\n    // Filtrare din query params:\n    if ($request->filled('search')) {\n        $query->where('name', 'like', '%' . $request->search . '%');\n    }\n    if ($request->filled('category')) {\n        $query->where('category_id', $request->category);\n    }\n    if ($request->filled('min_price')) {\n        $query->where('price', '>=', $request->min_price);\n    }\n    if ($request->filled('max_price')) {\n        $query->where('price', '<=', $request->max_price);\n    }\n    if ($request->filled('sort')) {\n        $allowed = ['price', 'name', 'created_at'];\n        $direction = $request->get('direction', 'asc');\n        if (in_array($request->sort, $allowed)) {\n            $query->orderBy($request->sort, $direction);\n        }\n    }\n\n    $products = $query->paginate($request->get('per_page', 15));\n    return ProductResource::collection($products);\n}\n\n// Raspuns paginat:\n// GET /api/products?search=laptop&min_price=1000&sort=price&per_page=10\n```\n\nRASPUNS PAGINARE:\n```json\n{\n  \"data\": [...],\n  \"links\": {\n    \"first\": \"https://api.example.com/products?page=1\",\n    \"last\": \"https://api.example.com/products?page=10\",\n    \"prev\": null,\n    \"next\": \"https://api.example.com/products?page=2\"\n  },\n  \"meta\": {\n    \"current_page\": 1,\n    \"last_page\": 10,\n    \"per_page\": 15,\n    \"total\": 148\n  }\n}\n```\n\nQUERY SCOPES PENTRU FILTRARE (pattern curat):\n```php\n<?php\n// Trait reutilizabil:\ntrait Filterable {\n    public function scopeFilter(Builder $query, array $filters): Builder {\n        foreach ($filters as $filter => $value) {\n            if (method_exists($this, $scope = 'filter' . ucfirst($filter))) {\n                $this->$scope($query, $value);\n            }\n        }\n        return $query;\n    }\n}\n// Product::filter($request->only(['search', 'category', 'min_price']))->paginate();\n```"
      },
      {
        "order": 4,
        "title": "Error Handling si API Versioning",
        "content": "ERROR HANDLING CONSISTENT:\n```php\n<?php\n// app/Exceptions/Handler.php (sau bootstrap/app.php L11):\nuse Illuminate\\Database\\Eloquent\\ModelNotFoundException;\nuse Illuminate\\Validation\\ValidationException;\n\n$exceptions->render(function (ModelNotFoundException $e, Request $request) {\n    if ($request->expectsJson()) {\n        return response()->json([\n            'message' => 'Resursa nu a fost gasita.',\n            'error'   => 'NOT_FOUND',\n        ], 404);\n    }\n});\n\n$exceptions->render(function (ValidationException $e, Request $request) {\n    if ($request->expectsJson()) {\n        return response()->json([\n            'message' => 'Date invalide.',\n            'errors'  => $e->errors(),\n        ], 422);\n    }\n});\n\n// Helper pentru raspunsuri consistente:\nclass ApiResponse {\n    public static function success(mixed $data, string $message = 'OK', int $code = 200): JsonResponse {\n        return response()->json(['success' => true, 'message' => $message, 'data' => $data], $code);\n    }\n    public static function error(string $message, int $code = 400, array $errors = []): JsonResponse {\n        return response()->json(['success' => false, 'message' => $message, 'errors' => $errors], $code);\n    }\n}\n```\n\nAPI VERSIONING:\n```php\n// routes/api.php:\nRoute::prefix('v1')->name('api.v1.')->group(function () {\n    Route::apiResource('products', V1\\ProductController::class);\n});\n\nRoute::prefix('v2')->name('api.v2.')->group(function () {\n    Route::apiResource('products', V2\\ProductController::class);\n});\n\n// Structura:\n// app/Http/Controllers/Api/V1/ProductController.php\n// app/Http/Controllers/Api/V2/ProductController.php\n\n// URL-uri:\n// GET /api/v1/products\n// GET /api/v2/products  (format nou, campuri noi)\n```\n\nLA INTERVIU: Cum versionezi un API Laravel? Prefix in route (v1/v2), controllere separate per versiune, API Resources cu format diferit. Versiunea curenta la /api/products (redirect la latest), versiune explicita la /api/v1/products."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "api resource",
        "question": "De ce folosesti API Resources in loc sa returnezi direct `$product->toJson()`?",
        "options": [
          "toJson e mai rapid",
          "Resources controleaza exact ce campuri expui, formateaza datele si ascund campuri sensibile (ex: password, cost)",
          "Nu exista diferenta",
          "Resources sunt mai mici"
        ],
        "answer": "Resources controleaza exact ce campuri expui, formateaza datele si ascund campuri sensibile (ex: password, cost)",
        "explanation": "toJson() expune TOATE campurile modelului. Resources = stratul de prezentare: formatezi, ascunzi, adaugi campuri calculate.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "validated()",
        "question": "De ce folosesti `$request->validated()` si nu `$request->all()` in controller?",
        "options": [
          "validated() e mai rapid",
          "validated() returneaza NUMAI campurile care au trecut validarea — previne mass assignment de campuri neasteptate",
          "all() nu functioneaza cu Form Requests",
          "Nu exista diferenta"
        ],
        "answer": "validated() returneaza NUMAI campurile care au trecut validarea — previne mass assignment de campuri neasteptate",
        "explanation": "Daca request are camp extra 'is_admin=1', all() il include. validated() il exclude pentru ca nu e in rules().",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "when loaded",
        "question": "Ce face `$this->whenLoaded('category')` intr-un API Resource?",
        "options": [
          "Incarca relatia",
          "Include relatia in raspuns NUMAI daca a fost eager loaded — evita N+1 in Resource",
          "Valideaza relatia",
          "Face cascade load"
        ],
        "answer": "Include relatia in raspuns NUMAI daca a fost eager loaded — evita N+1 in Resource",
        "explanation": "Fara whenLoaded: Resource face query pentru fiecare produs. Cu whenLoaded: apare in JSON doar daca ai facut ->with('category') in controller.",
        "difficulty": "hard"
      },
      {
        "number": 4,
        "name": "form request authorize",
        "question": "Ce returneaza metoda `authorize()` dintr-un Form Request cand userul NU are permisiunea?",
        "options": [
          "null",
          "false — Laravel returneaza automat 403 Forbidden",
          "0",
          "Redirect la login"
        ],
        "answer": "false — Laravel returneaza automat 403 Forbidden",
        "explanation": "authorize() returneaza bool. false = 403 AuthorizationException automat. Nu mai trebuie cod extra in controller.",
        "difficulty": "easy"
      },
      {
        "number": 5,
        "name": "paginare meta",
        "question": "Cand returnezi `ProductResource::collection($products->paginate(15))`, ce informatii extra include raspunsul JSON?",
        "options": [
          "Nimic extra",
          "Sectiunile links (prev/next/first/last) si meta (total, per_page, current_page, last_page)",
          "Doar total",
          "Headers HTTP"
        ],
        "answer": "Sectiunile links (prev/next/first/last) si meta (total, per_page, current_page, last_page)",
        "explanation": "Laravel paginator + Resource collection = JSON cu data, links si meta automat. Frontend stie cate pagini sunt.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "validation unique",
        "question": "Regula `unique:products,name` ce face la validare?",
        "options": [
          "Verifica ca e unic in request",
          "Verifica ca valoarea nu exista deja in coloana name din tabelul products",
          "Valideaza ca e string unic",
          "Genereaza un ID unic"
        ],
        "answer": "Verifica ca valoarea nu exista deja in coloana name din tabelul products",
        "explanation": "unique:tabel,coloana. La update: unique:products,name,{$this->product->id} pentru a exclude inregistrarea curenta.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "expectsJson",
        "question": "Ce face `$request->expectsJson()` in Exception Handler?",
        "options": [
          "Verifica ca requestul are JSON body",
          "Verifica ca clientul asteapta raspuns JSON (header Accept: application/json)",
          "Parseaza JSON-ul",
          "Valideaza JSON schema"
        ],
        "answer": "Verifica ca clientul asteapta raspuns JSON (header Accept: application/json)",
        "explanation": "API clients trimit Accept: application/json. Cu expectsJson(), returnezi JSON errors pentru API si redirect pentru web.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "api versioning",
        "question": "Cum organizezi controllere pentru v1 si v2 ale unui API Laravel?",
        "options": [
          "Parametru in route",
          "Directoare separate: App/Http/Controllers/Api/V1/ si V2/, prefix route",
          "Fisiere separate in acelasi director",
          "Config in .env"
        ],
        "answer": "Directoare separate: App/Http/Controllers/Api/V1/ si V2/, prefix route",
        "explanation": "Route::prefix('v1') + App\\Http\\Controllers\\Api\\V1\\ProductController. V2 poate extinde V1 si suprascrie metodele modificate.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "filled vs has",
        "question": "Diferenta intre `$request->filled('search')` si `$request->has('search')`?",
        "options": [
          "Identice",
          "filled(): campul exista SI nu e gol/null; has(): campul exista chiar daca e gol",
          "has() e mai nou",
          "filled() e pentru arrays"
        ],
        "answer": "filled(): campul exista SI nu e gol/null; has(): campul exista chiar daca e gol",
        "explanation": "?search= (gol): has() = true, filled() = false. Foloseste filled() pentru filtrare sa nu aplici filtre cu string gol.",
        "difficulty": "hard"
      },
      {
        "number": 10,
        "name": "201 status",
        "question": "Ce status HTTP corect returnezi la crearea unui nou produs cu succes?",
        "options": [
          "200 OK",
          "201 Created",
          "204 No Content",
          "202 Accepted"
        ],
        "answer": "201 Created",
        "explanation": "200 = OK (GET, PUT). 201 = Created (POST cu resursa creata). 204 = success fara corp (DELETE). 201 include si Location header optional.",
        "difficulty": "easy"
      },
      {
        "number": 11,
        "name": "resource when",
        "question": "Cum incluzi campul 'admin_notes' in API Resource numai pentru useri cu rol admin?",
        "options": [
          "if(auth()->user()->isAdmin()) return ...",
          "'admin_notes' => $this->when($request->user()?->isAdmin(), $this->admin_notes)",
          "admin_notes conditionally",
          "separate AdminResource"
        ],
        "answer": "'admin_notes' => $this->when($request->user()?->isAdmin(), $this->admin_notes)",
        "explanation": "when() in Resource: primul param = conditie, al doilea = valoarea. Daca false, campul lipseste din JSON (nu e null).",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "Form Request reguli",
        "question": "Scrie regulile de validare pentru un request de creare user: name (obligatoriu, 2-100 char), email (obligatoriu, unic in users), password (min 8, confirmare).",
        "options": [],
        "answer": "",
        "explanation": "'name' => 'required|string|min:2|max:100', 'email' => 'required|email|unique:users,email', 'password' => 'required|string|min:8|confirmed'",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "API Resource complet",
        "question": "Scrie un UserResource care expune: id, name, email, created_at (ISO format). Ascunde password si remember_token.",
        "options": [],
        "answer": "",
        "explanation": "return ['id' => $this->id, 'name' => $this->name, 'email' => $this->email, 'created_at' => $this->created_at->toISOString()];",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "sort whitelist",
        "question": "De ce faci whitelist pentru coloanele de sortare in API: `if(in_array($request->sort, $allowed))`?",
        "options": [
          "Performanta",
          "Previne SQL injection prin ORDER BY cu valori arbitrare de la user",
          "Paginare corecta",
          "Nu e necesar"
        ],
        "answer": "Previne SQL injection prin ORDER BY cu valori arbitrare de la user",
        "explanation": "ORDER BY user_input e vulnerabil: ?sort=1;DROP TABLE products--. Whitelist accepta doar coloane sigure.",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "apiResource routes",
        "question": "Ce diferenta e intre `Route::resource` si `Route::apiResource`?",
        "options": [
          "Identice",
          "apiResource exclude route-urile create si edit (nu au forme HTML — API-ul returneaza JSON)",
          "apiResource e pentru v2",
          "resource e mai vechi"
        ],
        "answer": "apiResource exclude route-urile create si edit (nu au forme HTML — API-ul returneaza JSON)",
        "explanation": "API-ul nu are pagini HTML. Route::apiResource genereaza: index, store, show, update, destroy (5 in loc de 7).",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "php-testing-phpunit",
    "title": "36. PHP Testing cu PHPUnit",
    "order": 36,
    "theory": [
      {
        "order": 1,
        "title": "Unit Tests — testare izolata a claselor",
        "content": "PHPUnit este framework-ul de testare standard pentru PHP. Laravel il integreaza nativ.\n\nCONFIGURARE:\n```bash\n# Laravel include PHPUnit\ncomposer require --dev phpunit/phpunit\n\n# Creare test\nphp artisan make:test ProductServiceTest --unit\nphp artisan make:test ProductApiTest  # feature test\n\n# Rulare\nphp artisan test\nphp artisan test --filter=ProductServiceTest\nvendor/bin/phpunit --coverage-html coverage/\n```\n\nUNIT TEST SIMPLU:\n```php\n<?php\nnamespace Tests\\Unit;\n\nuse App\\Services\\PriceCalculator;\nuse PHPUnit\\Framework\\TestCase;\n\nclass PriceCalculatorTest extends TestCase {\n    private PriceCalculator $calc;\n\n    protected function setUp(): void {\n        parent::setUp();\n        $this->calc = new PriceCalculator();\n    }\n\n    public function test_applies_discount_correctly(): void {\n        $price = $this->calc->applyDiscount(100.00, 20); // 20%\n        $this->assertEquals(80.00, $price);\n    }\n\n    public function test_throws_exception_for_invalid_discount(): void {\n        $this->expectException(\\InvalidArgumentException::class);\n        $this->calc->applyDiscount(100.00, 110); // 110% invalid\n    }\n\n    public function test_returns_zero_for_hundred_percent_discount(): void {\n        $price = $this->calc->applyDiscount(100.00, 100);\n        $this->assertEquals(0.0, $price);\n    }\n    \n    // Data Provider — acelasi test cu date multiple:\n    #[DataProvider('discountProvider')]\n    public function test_discount_calculations(float $price, int $pct, float $expected): void {\n        $this->assertEquals($expected, $this->calc->applyDiscount($price, $pct));\n    }\n\n    public static function discountProvider(): array {\n        return [\n            'zero discount'    => [100.0, 0,  100.0],\n            '50% discount'     => [200.0, 50, 100.0],\n            '10% on 150'       => [150.0, 10, 135.0],\n        ];\n    }\n}\n```\n\nASSERTIONS COMUNE:\n```php\n$this->assertEquals(expected, actual);\n$this->assertTrue(condition);\n$this->assertFalse(condition);\n$this->assertNull(value);\n$this->assertCount(3, $array);\n$this->assertContains($item, $array);\n$this->assertInstanceOf(User::class, $user);\n$this->assertStringContainsString('text', $string);\n```"
      },
      {
        "order": 2,
        "title": "Feature Tests — testare HTTP in Laravel",
        "content": "Feature tests testeaza intregul flow HTTP: request -> middleware -> controller -> baza de date -> raspuns.\n\n```php\n<?php\nnamespace Tests\\Feature;\n\nuse App\\Models\\Product;\nuse App\\Models\\User;\nuse Illuminate\\Foundation\\Testing\\RefreshDatabase;\nuse Tests\\TestCase;\n\nclass ProductApiTest extends TestCase {\n    use RefreshDatabase; // Reseteaza DB la fiecare test!\n\n    public function test_guest_cannot_create_product(): void {\n        $response = $this->postJson('/api/products', [\n            'name'  => 'Laptop',\n            'price' => 1000,\n        ]);\n        $response->assertStatus(401);\n    }\n\n    public function test_authenticated_user_can_create_product(): void {\n        $user = User::factory()->create();\n\n        $response = $this->actingAs($user, 'sanctum')\n            ->postJson('/api/products', [\n                'name'        => 'Laptop Dell XPS',\n                'price'       => 4999.99,\n                'stock'       => 5,\n                'category_id' => 1,\n            ]);\n\n        $response->assertStatus(201)\n                 ->assertJsonPath('data.name', 'Laptop Dell XPS')\n                 ->assertJsonPath('data.price', 4999.99);\n\n        $this->assertDatabaseHas('products', [\n            'name' => 'Laptop Dell XPS',\n        ]);\n    }\n\n    public function test_validation_requires_name(): void {\n        $user = User::factory()->create();\n\n        $response = $this->actingAs($user)\n            ->postJson('/api/products', ['price' => 100]);\n\n        $response->assertStatus(422)\n                 ->assertJsonValidationErrors(['name']);\n    }\n\n    public function test_product_list_is_paginated(): void {\n        Product::factory(20)->create();\n\n        $this->getJson('/api/products')\n             ->assertStatus(200)\n             ->assertJsonStructure([\n                 'data' => [['id', 'name', 'price']],\n                 'meta' => ['total', 'current_page', 'per_page'],\n             ]);\n    }\n}\n```"
      },
      {
        "order": 3,
        "title": "Factories si Faker — date de test",
        "content": "Factories genereaza date false realiste pentru teste.\n\n```php\n<?php\nnamespace Database\\Factories;\n\nuse Illuminate\\Database\\Eloquent\\Factories\\Factory;\n\nclass ProductFactory extends Factory {\n    public function definition(): array {\n        return [\n            'name'        => fake()->unique()->words(3, true),\n            'description' => fake()->paragraph(3),\n            'price'       => fake()->randomFloat(2, 10, 5000),\n            'stock'       => fake()->numberBetween(0, 200),\n            'category_id' => Category::factory(),  // creeaza si categoria!\n            'active'      => fake()->boolean(80),  // 80% sansa true\n        ];\n    }\n\n    // States — variante ale factory:\n    public function outOfStock(): static {\n        return $this->state(['stock' => 0, 'active' => false]);\n    }\n\n    public function premium(): static {\n        return $this->state([\n            'price' => fake()->randomFloat(2, 3000, 10000),\n        ]);\n    }\n}\n\n// Folosire:\n$product  = Product::factory()->create();            // 1 produs in DB\n$products = Product::factory(10)->create();          // 10 produse\n$product  = Product::factory()->outOfStock()->create();\n$product  = Product::factory()->make();              // fara DB\n\n// State cu date specifice:\n$product = Product::factory()->create(['price' => 999.99, 'name' => 'Exact Name']);\n\n// Cu relatii:\n$order = Order::factory()\n    ->has(Product::factory(3), 'products')\n    ->create();\n```\n\nDATA SEEDING CU FACTORIES:\n```php\n<?php\n// database/seeders/DatabaseSeeder.php\npublic function run(): void {\n    User::factory(10)->create();\n    Category::factory(5)->create();\n    Product::factory(50)->create();\n}\n// php artisan db:seed\n// php artisan migrate:fresh --seed\n```"
      },
      {
        "order": 4,
        "title": "Mocking — izolarea dependentelor",
        "content": "Mocking inlocuieste dependentele reale (email, plati, API extern) cu obiecte simulate.\n\nMOCK CU LARAVEL FACADES:\n```php\n<?php\nuse Illuminate\\Support\\Facades\\Mail;\nuse Illuminate\\Support\\Facades\\Http;\nuse App\\Mail\\OrderConfirmation;\n\nclass OrderTest extends TestCase {\n    use RefreshDatabase;\n\n    public function test_order_sends_confirmation_email(): void {\n        Mail::fake(); // intercepteaza toate email-urile\n\n        $user  = User::factory()->create();\n        $order = Order::factory()->create(['user_id' => $user->id]);\n\n        $this->actingAs($user)\n             ->postJson('/api/orders/' . $order->id . '/confirm');\n\n        // Verifica ca email-ul a fost trimis:\n        Mail::assertSent(OrderConfirmation::class, function ($mail) use ($user) {\n            return $mail->hasTo($user->email);\n        });\n        Mail::assertSentCount(1);\n    }\n\n    public function test_payment_api_call(): void {\n        // Mock HTTP extern:\n        Http::fake([\n            'payment-api.example.com/*' => Http::response([\n                'status'         => 'success',\n                'transaction_id' => 'TXN123456',\n            ], 200),\n        ]);\n\n        $result = app(PaymentService::class)->charge(100.00, 'tok_test');\n\n        $this->assertTrue($result->isSuccessful());\n        $this->assertEquals('TXN123456', $result->transactionId);\n        Http::assertSentCount(1);\n    }\n}\n```\n\nMOCK MANUAL CU MOCKERY:\n```php\n<?php\n$mockRepo = $this->createMock(ProductRepository::class);\n$mockRepo->expects($this->once())\n         ->method('find')\n         ->with(5)\n         ->willReturn(new Product(['name' => 'Test']));\n\n$service = new ProductService($mockRepo);\n$product = $service->getProduct(5);\n$this->assertEquals('Test', $product->name);\n```\n\nLARVAEL FAKES: Mail::fake(), Queue::fake(), Event::fake(), Storage::fake(), Notification::fake().\n\nLA INTERVIU: Ce este un mock? Un obiect care simuleaza comportamentul unuia real. Util cand testul nu trebuie sa depinda de servicii externe (API, email, baza de date live)."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "RefreshDatabase",
        "question": "Ce face trait-ul `RefreshDatabase` in Feature Tests Laravel?",
        "options": [
          "Creeaza o baza de date noua",
          "Ruleaza migrarile si le face rollback dupa fiecare test — izoleaza testele",
          "Reseteaza numai factories",
          "Curata cache-ul"
        ],
        "answer": "Ruleaza migrarile si le face rollback dupa fiecare test — izoleaza testele",
        "explanation": "RefreshDatabase asigura ca fiecare test porneste cu DB curata. Fara ea, datele dintr-un test ar afecta urmatorul.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "actingAs",
        "question": "Ce face `$this->actingAs($user, 'sanctum')` in Feature Test?",
        "options": [
          "Creaza un user nou",
          "Simuleaza un user autentificat cu Sanctum pentru requestul urmator",
          "Valideaza tokenul",
          "Face login real"
        ],
        "answer": "Simuleaza un user autentificat cu Sanctum pentru requestul urmator",
        "explanation": "actingAs injecteaza userul in sesiune/guard fara sa faci un real HTTP login. Testele devin mai rapide si controlate.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "assertDatabaseHas",
        "question": "Ce verifica `$this->assertDatabaseHas('products', ['name' => 'Laptop'])`?",
        "options": [
          "Ca tabelul products exista",
          "Ca exista cel putin un rand in products cu name = 'Laptop'",
          "Ca toate produsele se numesc Laptop",
          "Numarul de produse"
        ],
        "answer": "Ca exista cel putin un rand in products cu name = 'Laptop'",
        "explanation": "assertDatabaseHas face o interogare SELECT si verifica ca cel putin un rand matcheste conditiile date.",
        "difficulty": "easy"
      },
      {
        "number": 4,
        "name": "factory state",
        "question": "Ce sunt 'states' in Eloquent Factories?",
        "options": [
          "Variante ale factory cu date specifice (ex: outOfStock, premium, deleted)",
          "Starea bazei de date",
          "Starea modelului",
          "Config factory"
        ],
        "answer": "Variante ale factory cu date specifice (ex: outOfStock, premium, deleted)",
        "explanation": "State = subset de atribute care modifica factory de baza. Product::factory()->outOfStock()->create() e mai citibil decat create(['stock' => 0]).",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "mail fake",
        "question": "Ce face `Mail::fake()` intr-un test?",
        "options": [
          "Trimite email-uri de test la adresa test@test.com",
          "Intercepteaza toate email-urile — nu le trimite real, le tine in memorie pentru verificat",
          "Simuleaza server SMTP",
          "Valideaza template-ul"
        ],
        "answer": "Intercepteaza toate email-urile — nu le trimite real, le tine in memorie pentru verificat",
        "explanation": "Fara Mail::fake(), testul ar trimite email-uri reale. Fake-ul permite Mail::assertSent() fara efecte externe.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "data provider",
        "question": "Ce avantaj au `DataProvider`-ele in PHPUnit?",
        "options": [
          "Mai rapide",
          "Ruleaza acelasi test cu seturi de date diferite — mai putine metode de test duplicate",
          "Mai sigure",
          "Pot folosi DB"
        ],
        "answer": "Ruleaza acelasi test cu seturi de date diferite — mai putine metode de test duplicate",
        "explanation": "In loc de 5 metode test_discount_0, test_discount_10... etc, un singur test cu DataProvider + array de cazuri.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "unit vs feature",
        "question": "Diferenta intre Unit Test si Feature Test in Laravel?",
        "options": [
          "Identice",
          "Unit: testeaza o clasa izolat (fara DB, HTTP); Feature: testeaza fluxul complet (request -> DB -> raspuns)",
          "Feature e mai rapid",
          "Unit foloseste Factories"
        ],
        "answer": "Unit: testeaza o clasa izolat (fara DB, HTTP); Feature: testeaza fluxul complet (request -> DB -> raspuns)",
        "explanation": "Unit tests: rapide, izolate, pentru logica de business pura. Feature tests: mai lente, testeaza integrarea componentelor.",
        "difficulty": "easy"
      },
      {
        "number": 8,
        "name": "setUp tearDown",
        "question": "Ce face `setUp()` in PHPUnit?",
        "options": [
          "Finalizeaza testul",
          "Ruleaza inainte de fiecare test — initializeaza obiecte comune, curata starea",
          "Ruleaza o singura data",
          "Face assertions"
        ],
        "answer": "Ruleaza inainte de fiecare test — initializeaza obiecte comune, curata starea",
        "explanation": "setUp() = before each test. tearDown() = after each. Evita repetarea codului de initializare in fiecare test.",
        "difficulty": "easy"
      },
      {
        "number": 9,
        "name": "assertJsonPath",
        "question": "Ce verifica `$response->assertJsonPath('data.price', 4999.99)` intr-un Feature Test?",
        "options": [
          "Ca raspunsul e JSON",
          "Ca in JSON-ul raspuns, la calea data.price valoarea este 4999.99",
          "Ca price e numeric",
          "Ca exista campul data"
        ],
        "answer": "Ca in JSON-ul raspuns, la calea data.price valoarea este 4999.99",
        "explanation": "assertJsonPath accepta dot notation pentru campuri nested. Mai precis decat assertJson care verifica subseturi.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "http fake",
        "question": "Cum testezi un serviciu care face un call HTTP extern (API plati) fara sa apelezi API-ul real?",
        "options": [
          "Modifici API-ul extern",
          "Http::fake(['payment.com/*' => Http::response([...], 200)]) — intercepteaza si simuleaza raspunsul",
          "sleep(1) si retry",
          "Nu se poate testa"
        ],
        "answer": "Http::fake(['payment.com/*' => Http::response([...], 200)]) — intercepteaza si simuleaza raspunsul",
        "explanation": "Http::fake() intercepteaza toate requesturile HTTP. Testele nu depind de retea, sunt rapide si deterministice.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "make vs create factory",
        "question": "Diferenta intre `Product::factory()->make()` si `Product::factory()->create()`?",
        "options": [
          "Identice",
          "make(): creeaza instanta in memorie fara DB; create(): salveaza in baza de date",
          "make() e mai lent",
          "create() e pentru unit tests"
        ],
        "answer": "make(): creeaza instanta in memorie fara DB; create(): salveaza in baza de date",
        "explanation": "make() pentru unit tests izolate (fara DB). create() pentru feature tests care necesita date reale in DB.",
        "difficulty": "easy"
      },
      {
        "number": 12,
        "name": "Unit test clasa",
        "question": "Scrie un unit test pentru functia `calculateTax(float $price, float $rate): float` care returneaza pretul cu TVA.",
        "options": [],
        "answer": "",
        "explanation": "$result = $calc->calculateTax(100.0, 19.0); $this->assertEquals(119.0, $result);",
        "difficulty": "easy"
      },
      {
        "number": 13,
        "name": "Feature test CRUD",
        "question": "Scrie un feature test care verifica ca un user autentificat poate sterge propriul produs si primeste 204.",
        "options": [],
        "answer": "",
        "explanation": "$this->actingAs($user)->deleteJson('/api/products/'.$product->id)->assertStatus(204); $this->assertDatabaseMissing('products', ['id' => $product->id]);",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "coverage",
        "question": "Cum generezi un raport de code coverage in PHPUnit?",
        "options": [
          "php artisan test --report",
          "vendor/bin/phpunit --coverage-html coverage/",
          "phpunit coverage",
          "php artisan coverage"
        ],
        "answer": "vendor/bin/phpunit --coverage-html coverage/",
        "explanation": "Genereaza raport HTML in directorul coverage/. Necesita extensia Xdebug sau PCOV. Target minim bun: 80% coverage.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "isolation test",
        "question": "De ce este important ca testele sa fie izolate (sa nu depinda unul de altul)?",
        "options": [
          "Nu e important",
          "Un test esuat nu trebuie sa cauzeze esecul altuia. Ordinea de rulare nu trebuie sa conteze. RefreshDatabase asigura izolarea.",
          "Viteza",
          "Memoria"
        ],
        "answer": "Un test esuat nu trebuie sa cauzeze esecul altuia. Ordinea de rulare nu trebuie sa conteze. RefreshDatabase asigura izolarea.",
        "explanation": "Testele dependente sunt fragile: daca A esueaza, B si C par sa esueze si ele. Izolarea face debugging rapid.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "php-performance",
    "title": "37. PHP Performance (OPcache, Redis, Queue Workers)",
    "order": 37,
    "theory": [
      {
        "order": 1,
        "title": "OPcache — cache pentru bytecode PHP",
        "content": "PHP compileaza codul sursa in bytecode la fiecare request. OPcache stocheaza bytecode-ul in memorie.\n\nCUM FUNCTIONEAZA:\n```\nFARA OPCACHE:\n Browser -> PHP -> parse index.php -> compile -> bytecode -> execute -> raspuns\n                  (la fiecare request!)\n\nCU OPCACHE:\n 1st request: PHP -> parse -> compile -> bytecode -> STOCHEAZA IN MEMORIE -> execute\n 2nd request: PHP -> bytecode DIN MEMORIE -> execute (mult mai rapid!)\n```\n\nCONFIGURARE php.ini:\n```ini\n[opcache]\nopcache.enable=1\nopcache.memory_consumption=256      ; MB pentru stocare bytecode\nopcache.max_accelerated_files=20000 ; fisiere max in cache\nopcache.revalidate_freq=60          ; secunde intre verificari (0 = niciodata)\nopcache.validate_timestamps=0       ; productie: 0 (nu verifica modificari)\nopcache.save_comments=1\nopcache.enable_cli=0\n```\n\nVERIFICARE:\n```php\n<?php\n$info = opcache_get_status();\necho \"Fisiere cache: \" . $info['opcache_statistics']['num_cached_files'];\necho \"Memory folosita: \" . round($info['memory_usage']['used_memory'] / 1024 / 1024) . \" MB\";\n\n// Laravel — reset cache dupa deploy:\nphp artisan opcache:clear  // sau:\nphp -r \"opcache_reset();\"\n```\n\nIMPACT REAL: OPcache poate reduce timpul de raspuns cu 50-70% pentru aplicatii PHP mari.\n\nLARavel PRODUCTION OPTIMIZE:\n```bash\n# La deploy:\nphp artisan config:cache   # cache config files\nphp artisan route:cache    # cache route definitions\nphp artisan view:cache     # pre-compile Blade views\ncomposer dump-autoload --optimize --classmap-authoritative\n```\n\nLA INTERVIU: Ce face opcache.validate_timestamps=0? Dezactiveaza verificarea modificarilor la fisiere. Bytecode-ul nu se regenereaza niciodata. Pe productie e bine (fisierele nu se schimba). Pe development = problemele (nu vede modificarile). Rezolvare: opcache_reset() la deploy."
      },
      {
        "order": 2,
        "title": "Redis Caching in Laravel",
        "content": "Redis este un key-value store in memorie, folosit pentru caching, sesiuni, queue-uri.\n\nINSTALARE:\n```bash\ncomposer require predis/predis\n# SAU extensia PHP: pecl install redis\n\n# .env:\nCACHE_DRIVER=redis\nREDIS_HOST=127.0.0.1\nREDIS_PORT=6379\n```\n\nCACHING CU LARAVEL CACHE FACADE:\n```php\n<?php\nuse Illuminate\\Support\\Facades\\Cache;\n\n// Stocheaza pentru 1 ora:\nCache::put('settings', $settings, 3600);\nCache::put('settings', $settings, now()->addHour());\n\n// Citeste:\n$settings = Cache::get('settings');\n$settings = Cache::get('settings', 'default_value');\n\n// Stocheaza daca nu exista:\nCache::add('counter', 0, 3600);\n\n// Incrementeaza atomic:\nCache::increment('page_views');\nCache::increment('page_views', 5);\n\n// Sterge:\nCache::forget('settings');\n\n// PATTERN REMEMBER — cel mai folosit:\n$products = Cache::remember('products:all', 3600, function () {\n    return Product::with('category')->active()->get();\n});\n// Prima data: executa closure, stocheaza si returneaza\n// Urmatoarele ore: returneaza direct din cache\n\n// Cache cu tags (Redis/Memcached only):\nCache::tags(['products', 'category-5'])->put('cat5', $products, 3600);\nCache::tags('products')->flush(); // sterge tot ce are tag products\n\n// Permanent:\nCache::forever('config:app', $config);\n```\n\nINVALIDARE CACHE:\n```php\n<?php\n// Model Observer — sterge cache la modificare:\nclass ProductObserver {\n    public function updated(Product $product): void {\n        Cache::forget('products:all');\n        Cache::forget('product:' . $product->id);\n        Cache::tags('products')->flush();\n    }\n}\n```"
      },
      {
        "order": 3,
        "title": "Queue Workers si Jobs",
        "content": "Job-urile muta operatiunile lente (email, PDF, resize imagine) in background.\n\nCREARE JOB:\n```bash\nphp artisan make:job ProcessOrderJob\n```\n\nIMPLEMENTARE JOB:\n```php\n<?php\nnamespace App\\Jobs;\n\nuse Illuminate\\Bus\\Queueable;\nuse Illuminate\\Contracts\\Queue\\ShouldQueue;\nuse Illuminate\\Foundation\\Bus\\Dispatchable;\nuse Illuminate\\Queue\\InteractsWithQueue;\nuse Illuminate\\Queue\\SerializesModels;\n\nclass ProcessOrderJob implements ShouldQueue {\n    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;\n\n    public int $tries = 3;          // reincercari la esec\n    public int $timeout = 60;       // secunde max\n    public int $backoff = 30;       // secunde intre reincercari\n\n    public function __construct(\n        private Order $order\n    ) {}\n\n    public function handle(PaymentService $paymentService): void {\n        // Proceseaza plata:\n        $result = $paymentService->charge($this->order->total);\n\n        // Trimite email confirmare:\n        Mail::to($this->order->user->email)\n            ->send(new OrderConfirmation($this->order));\n\n        // Genereaza PDF factura:\n        $pdf = PDF::generate($this->order);\n        Storage::put('invoices/' . $this->order->id . '.pdf', $pdf);\n\n        $this->order->update(['status' => 'completed']);\n    }\n\n    public function failed(\\Exception $e): void {\n        // Notifica adminul la esec total:\n        Log::error('Order processing failed', [\n            'order_id' => $this->order->id,\n            'error'    => $e->getMessage(),\n        ]);\n    }\n}\n\n// DISPATCHARE:\nProcessOrderJob::dispatch($order);\nProcessOrderJob::dispatch($order)->delay(now()->addMinutes(5));\nProcessOrderJob::dispatch($order)->onQueue('high');\n```\n\nRULARE WORKER:\n```bash\nphp artisan queue:work                      # standard\nphp artisan queue:work --queue=high,default # prioritate\nphp artisan queue:work --tries=3            # reincercari\nphp artisan queue:listen                    # re-incarcat (dev)\n```"
      },
      {
        "order": 4,
        "title": "Laravel Horizon si optimizari DB",
        "content": "LARAVEL HORIZON — Dashboard pentru queue management:\n```bash\ncomposer require laravel/horizon\nphp artisan horizon:install\nphp artisan horizon  # porneste horizon (inlocuieste queue:work)\n```\n\nCONFIG HORIZON (config/horizon.php):\n```php\n'environments' => [\n    'production' => [\n        'supervisor-1' => [\n            'maxProcesses' => 10,\n            'balanceMaxShift' => 1,\n            'balanceCooldown' => 3,\n            'queues' => ['high', 'default', 'low'],\n        ],\n    ],\n],\n```\n\nOPTIMIZARI BAZA DE DATE:\n```php\n<?php\n// 1. INDEXURI — cel mai mare impact:\n// In migration:\n$table->index('status');                      // single\n$table->index(['category_id', 'active']);     // compound\n$table->fullText('name');                     // full-text search\n\n// 2. SELECT doar coloane necesare:\n$names = Product::select('id', 'name')->get(); // nu SELECT *\n\n// 3. CHUNK pentru procesare masiva:\nProduct::chunk(100, function ($products) {\n    foreach ($products as $product) {\n        // proceseaza 100 o data, nu toate\n    }\n});\n\n// 4. withCount in loc de N+1:\n$categories = Category::withCount('products')->get();\n// $category->products_count fara query suplimentar\n\n// 5. Evita lazy loading in produse:\nProduct::without('category')->get(); // disable global scope\n\n// 6. Subqueries:\n$orders = Order::addSelect([\n    'last_product_name' => Product::select('name')\n        ->whereColumn('products.order_id', 'orders.id')\n        ->latest()->limit(1)\n])->get();\n```\n\nDEBUG QUERIES:\n```php\n<?php\n// Log toate query-urile:\nDB::listen(function($query) {\n    Log::info($query->sql, $query->bindings);\n});\n\n// Sau:\n$queries = DB::getQueryLog(); // necesita DB::enableQueryLog() inainte\n```\n\nLA INTERVIU: Cum optimizezi o pagina lenta in Laravel? 1. Laravel Debugbar pentru N+1. 2. Eager loading cu with(). 3. Cache::remember() pentru date statice. 4. Indexuri in DB. 5. Queue pentru operatii lente. 6. opcache pe server."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "opcache beneficiu",
        "question": "Ce problema rezolva OPcache in PHP?",
        "options": [
          "Comprima raspunsurile HTTP",
          "Elimina recompilarea PHP la fiecare request — stocheaza bytecode in memorie",
          "Cacheaza query-urile SQL",
          "Comprima imagini"
        ],
        "answer": "Elimina recompilarea PHP la fiecare request — stocheaza bytecode in memorie",
        "explanation": "Fara OPcache: PHP compileaza fiecare fisier la fiecare request. Cu OPcache: compilat o singura data, 50-70% mai rapid.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "cache remember",
        "question": "Ce face `Cache::remember('key', 3600, fn() => Product::all())`?",
        "options": [
          "Stocheaza pentru totdeauna",
          "Returneaza din cache daca exista, altfel ruleaza closure, stocheaza rezultatul 3600 secunde si returneaza",
          "Citeste doar din cache",
          "Face query la fiecare call"
        ],
        "answer": "Returneaza din cache daca exista, altfel ruleaza closure, stocheaza rezultatul 3600 secunde si returneaza",
        "explanation": "remember = get or set pattern. Prima data: DB query. Urmatoarele 3600s: direct din Redis/memcache. Fara extra cod.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "queue job",
        "question": "De ce pui trimiterea email-ului de confirmare comanda intr-un Job (queue)?",
        "options": [
          "Nu e necesar",
          "Email-urile sunt lente (SMTP). Queue-ul returneaza raspuns instant userului, email-ul se trimite in background",
          "Securitate",
          "Validare"
        ],
        "answer": "Email-urile sunt lente (SMTP). Queue-ul returneaza raspuns instant userului, email-ul se trimite in background",
        "explanation": "SMTP poate lua 1-5 secunde. Cu queue: userul vede 'Comanda plasata!' instant, email-ul pleaca fara sa blocheze.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "queue tries",
        "question": "Ce face proprietatea `$tries = 3` in ShouldQueue?",
        "options": [
          "Ruleaza jobbul de 3 ori la start",
          "La esec, reincearca jobbul de maxim 3 ori inainte de a-l considera failed definitiv",
          "Timeout 3 secunde",
          "3 workeri paraleli"
        ],
        "answer": "La esec, reincearca jobbul de maxim 3 ori inainte de a-l considera failed definitiv",
        "explanation": "Retries pentru erori temporare (API indisponibil, lock timeout). Dupa $tries esecuri -> failed_jobs table.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "chunk procesare",
        "question": "De ce folosesti `Product::chunk(100, fn)` in loc de `Product::all()` pentru 100.000 produse?",
        "options": [
          "chunk e mai rapid",
          "all() incarca 100.000 modele in RAM simultan. chunk(100) proceseaza 100 o data — memorie constanta",
          "chunk face tranzactii",
          "Nu exista diferenta"
        ],
        "answer": "all() incarca 100.000 modele in RAM simultan. chunk(100) proceseaza 100 o data — memorie constanta",
        "explanation": "100.000 modele Eloquent pot consuma 500MB+ RAM. chunk() mentine memoria constanta indiferent de total.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "route cache",
        "question": "Ce face `php artisan route:cache` pe serverul de productie?",
        "options": [
          "Sterge toate route-urile",
          "Compileaza toate route-urile intr-un singur fisier PHP — incarcare mai rapida",
          "Reseteaza cache-ul",
          "Verifica route-urile"
        ],
        "answer": "Compileaza toate route-urile intr-un singur fisier PHP — incarcare mai rapida",
        "explanation": "La fiecare request, Laravel incarca toate route-urile. Cached: o singura citire de fisier. Esential pe productie.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "cache tags",
        "question": "Ce avantaj ofera Cache tags (ex: `Cache::tags('products')->flush()`)?",
        "options": [
          "Nu au avantaje",
          "Poti invalida grupuri de chei cache deodata, fara sa stii exact cheile individuale",
          "Sunt mai rapide",
          "Suportate de toate driverele"
        ],
        "answer": "Poti invalida grupuri de chei cache deodata, fara sa stii exact cheile individuale",
        "explanation": "Cache::tags('products')->flush() sterge toate key-urile cu tag-ul products. Util cand un produs se modifica si vrei sa resetezi tot ce il include.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "horizon",
        "question": "Ce avantaj principal ofera Laravel Horizon fata de php artisan queue:work?",
        "options": [
          "Mai rapid",
          "Dashboard vizual pentru monitorizare: job throughput, timp de asteptare, failure rate, scalare automata workeri",
          "Suporta mai multe queues",
          "E gratuit"
        ],
        "answer": "Dashboard vizual pentru monitorizare: job throughput, timp de asteptare, failure rate, scalare automata workeri",
        "explanation": "Horizon la /horizon in browser. Configureaza cate procese per queue. Auto-scaling. Alerte la esec. Esential in productie.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "db index",
        "question": "Cand adaugi un index pe coloana `status` in migration?",
        "options": [
          "Niciodata",
          "Cand faci frecvent WHERE status = 'active' — indexul face cautarea O(log n) in loc de O(n) (full scan)",
          "Doar la chei primare",
          "La toate coloanele"
        ],
        "answer": "Cand faci frecvent WHERE status = 'active' — indexul face cautarea O(log n) in loc de O(n) (full scan)",
        "explanation": "Fara index: DB parcurge toate randurile. Cu index: sare direct la randurile cu status='active'. Impact enorm pe tabele mari.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "withCount",
        "question": "Cum obtii numarul de produse per categorie fara N+1?",
        "options": [
          "foreach categories, $cat->products->count()",
          "Category::withCount('products')->get()",
          "SELECT COUNT separata",
          "Category::with('products')->map(fn($c) => $c->products->count())"
        ],
        "answer": "Category::withCount('products')->get()",
        "explanation": "withCount face un subquery eficient: SELECT categories.*, (SELECT COUNT(*) FROM products WHERE category_id = categories.id) as products_count.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "dispatch delay",
        "question": "Cum trimiti un email de reminder dupa 24 de ore (delayed job)?",
        "options": [
          "sleep(86400); SendReminder::dispatch()",
          "SendReminder::dispatch($user)->delay(now()->addDay())",
          "Queue::delay(24*3600, SendReminder)",
          "cron job"
        ],
        "answer": "SendReminder::dispatch($user)->delay(now()->addDay())",
        "explanation": "->delay() stocheaza job-ul in queue cu un timestamp viitor. Worker-ul il proceseaza abia dupa acel moment.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Job implementare",
        "question": "Scrie structura unui Job `ResizeImageJob` care primeste un `$imagePath` si nu face nimic decat sa logheze 'Resizing: ' + calea.",
        "options": [],
        "answer": "",
        "explanation": "public function __construct(private string $imagePath) {} public function handle(): void { Log::info('Resizing: ' . $this->imagePath); }",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Cache remember pattern",
        "question": "Scrie codul care cacheaza lista de categorii active din DB timp de 30 de minute, cu cheia 'categories:active'.",
        "options": [],
        "answer": "",
        "explanation": "Cache::remember('categories:active', 1800, fn() => Category::where('active', true)->get())",
        "difficulty": "easy"
      },
      {
        "number": 14,
        "name": "opcache productie",
        "question": "Care setare OPcache trebuie dezactivata (0) in productie pentru performanta maxima?",
        "options": [
          "opcache.enable",
          "opcache.validate_timestamps — nu verifica modificari, bytecode e permanent valid",
          "opcache.memory_consumption",
          "opcache.save_comments"
        ],
        "answer": "opcache.validate_timestamps — nu verifica modificari, bytecode e permanent valid",
        "explanation": "validate_timestamps=0 = nu verifica daca fisierele s-au schimbat. Pe productie fisierele nu se schimba. Necesita php -r 'opcache_reset()' la deploy.",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "artisan optimize",
        "question": "Ce comenzi artisan rulezi la deploy pe productie pentru performanta maxima?",
        "options": [
          "php artisan optimize",
          "php artisan config:cache && php artisan route:cache && php artisan view:cache && composer dump-autoload --optimize",
          "php artisan clear:all",
          "php artisan production:start"
        ],
        "answer": "php artisan config:cache && php artisan route:cache && php artisan view:cache && composer dump-autoload --optimize",
        "explanation": "config:cache (config pre-compilat), route:cache (route-uri pre-compilate), view:cache (Blade pre-compilat), dump-autoload --optimize (class map rapid).",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "php-security",
    "title": "38. PHP Security Best Practices",
    "order": 38,
    "theory": [
      {
        "order": 1,
        "title": "OWASP Top 10 pentru PHP — SQL Injection si XSS",
        "content": "OWASP Top 10 sunt cele mai frecvente vulnerabilitati web. PHP e vulnerabil la toate daca nu esti atent.\n\nSQL INJECTION:\n```php\n<?php\n// VULNERABIL:\n$id = $_GET['id']; // '1 OR 1=1'\n$query = \"SELECT * FROM users WHERE id = $id\"; // PERICULOS!\n// Rezultat: SELECT * FROM users WHERE id = 1 OR 1=1 -> returneaza TOTI userii!\n\n// Atac si mai grav:\n// ?id=1; DROP TABLE users; --\n\n// SIGUR — Prepared Statements (PDO):\n$stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');\n$stmt->execute([$_GET['id']]);\n$user = $stmt->fetch();\n\n// SIGUR — Named parameters:\n$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email AND active = :active');\n$stmt->execute([':email' => $email, ':active' => 1]);\n\n// Laravel — Eloquent (safe by default):\n$user = User::where('id', $request->id)->first(); // automat prepared\n$user = User::whereRaw('id = ?', [$request->id])->first(); // manual safe\n// PERICULOS in Laravel:\n$user = User::whereRaw(\"id = $request->id\")->first(); // SQL injection!\n```\n\nXSS (Cross-Site Scripting):\n```php\n<?php\n// VULNERABIL:\necho $_GET['name']; // Atac: ?name=<script>document.cookie</script>\n\n// SIGUR:\necho htmlspecialchars($_GET['name'], ENT_QUOTES, 'UTF-8');\n// Transforma: <script> -> &lt;script&gt;\n\n// Laravel Blade — automat sigur:\n{{ $user->name }}   // escapat automat\n{!! $html !!}       // NEESCAPAT — numai pentru HTML de incredere!\n\n// Content Security Policy header:\nheader(\"Content-Security-Policy: default-src 'self'; script-src 'self'\");\n```\n\nPASSWORD HASHING:\n```php\n<?php\n// NICIODATA MD5 sau SHA1 pentru parole!\n$hash = md5($password);    // GRESITE — crackabile rapid\n$hash = sha1($password);   // GRESITE\n\n// CORECT — bcrypt:\n$hash = password_hash($password, PASSWORD_BCRYPT); // sau PASSWORD_ARGON2ID\n\n// Verificare:\nif (password_verify($inputPassword, $hash)) {\n    // login ok\n}\n\n// Laravel:\n$hash = Hash::make($password);\nHash::check($inputPassword, $hash);\n```"
      },
      {
        "order": 2,
        "title": "Input Sanitization si Validare",
        "content": "Principiul de baza: NICIODATA nu ai incredere in datele venite de la user (GET, POST, cookie, header).\n\nVALIDARE vs SANITIZARE:\n```php\n<?php\n// VALIDARE = verifici ca datele respecta formatul asteptat:\nif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {\n    die('Email invalid');\n}\nif (!ctype_digit($id)) {\n    die('ID invalid');\n}\n\n// SANITIZARE = curati datele:\n$name  = filter_var($input, FILTER_SANITIZE_SPECIAL_CHARS);\n$email = filter_var($input, FILTER_SANITIZE_EMAIL);\n$int   = filter_var($input, FILTER_SANITIZE_NUMBER_INT);\n\n// CAST explicit:\n$id  = (int) $_GET['id'];   // '1 OR 1=1' devine 1\n$age = (int) $_POST['age'];\n```\n\nFILTER_VAR COMUNI:\n```php\n<?php\n// Validare:\nFILTER_VALIDATE_EMAIL   // email valid\nFILTER_VALIDATE_URL     // URL valid\nFILTER_VALIDATE_IP      // IP valid\nFILTER_VALIDATE_INT     // intreg valid\nFILTER_VALIDATE_BOOLEAN // true/false/yes/no/1/0\n\n// Sanitizare:\nFILTER_SANITIZE_SPECIAL_CHARS  // escapeaza HTML\nFILTER_SANITIZE_EMAIL          // sterge caractere ilegale din email\nFILTER_SANITIZE_NUMBER_INT     // pastreaza numai cifre si +-\n```\n\nLARAVEL VALIDATION (cel mai sigur):\n```php\n<?php\n$validated = $request->validate([\n    'name'     => 'required|string|max:255',\n    'email'    => 'required|email|unique:users',\n    'age'      => 'required|integer|min:18|max:120',\n    'website'  => 'nullable|url',\n    'role'     => 'required|in:user,editor,admin', // whitelist\n]);\n// $validated contine NUMAI campurile din rules()\n```\n\nHEADERS DE SECURITATE:\n```php\n<?php\nheader('X-Content-Type-Options: nosniff');\nheader('X-Frame-Options: DENY');        // previne clickjacking\nheader('X-XSS-Protection: 1; mode=block');\nheader('Strict-Transport-Security: max-age=31536000; includeSubDomains');\nheader(\"Content-Security-Policy: default-src 'self'\");\n\n// In Laravel — middleware securitate\n```"
      },
      {
        "order": 3,
        "title": "CSRF, Session Hijacking si Secure Headers",
        "content": "CSRF (Cross-Site Request Forgery):\n```php\n<?php\n// CSRF = site rau forteaza userul autentificat sa faca actiuni nedorite\n// Exemplu: utilizatorul e logat pe banca-ta.ro\n// site-rau.ro are: <img src='https://banca-ta.ro/transfer?to=hacker&amount=5000'>\n\n// PROTECTIE — token CSRF unic per sesiune:\n// Generare token:\n$token = bin2hex(random_bytes(32));\n$_SESSION['csrf_token'] = $token;\n\n// In form:\n?>\n<input type=\"hidden\" name=\"csrf_token\" value=\"<?= $token ?>\">\n\n<?php\n// Validare la POST:\nif ($_POST['csrf_token'] !== $_SESSION['csrf_token']) {\n    die('CSRF attack detected!');\n}\n\n// Laravel — @csrf in fiecare form Blade (automat!)\n// Middleware VerifyCsrfToken protejeaza automat toate route-urile web\n```\n\nSESSION SECURITY:\n```php\n<?php\n// Configurare sigura session:\nini_set('session.cookie_httponly', 1);  // JS nu poate accesa cookie\nini_set('session.cookie_secure', 1);    // HTTPS only\nini_set('session.cookie_samesite', 'Strict');\nini_set('session.use_strict_mode', 1);\n\n// Regenera ID dupa login (previne session fixation):\nsession_regenerate_id(true);\n\n// Timeout sesiune:\n$maxDuration = 3600; // 1 ora\nif (isset($_SESSION['last_activity']) && \n    time() - $_SESSION['last_activity'] > $maxDuration) {\n    session_destroy();\n    header('Location: /login');\n}\n$_SESSION['last_activity'] = time();\n```\n\nFILE UPLOAD SECURITY:\n```php\n<?php\n// 1. Verifica MIME real (nu extensia):\n$finfo = new finfo(FILEINFO_MIME_TYPE);\n$mime  = $finfo->file($_FILES['file']['tmp_name']);\n$allowed = ['image/jpeg', 'image/png', 'image/webp'];\nif (!in_array($mime, $allowed)) {\n    die('Tip nepermis');\n}\n\n// 2. Rename random:\n$ext    = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);\n$newName = bin2hex(random_bytes(16)) . '.' . strtolower($ext);\n\n// 3. Pune fisierele OUTSIDE webroot sau cu PHP dezactivat:\n// /var/www/storage/ (nu /var/www/html/uploads/)\n\n// 4. Serveste prin PHP (nu direct):\nreadfile('/secure-storage/' . $file); // cu verificare prealabila\n```"
      },
      {
        "order": 4,
        "title": "CSP, Prepared Statements avansate si Rate Limiting",
        "content": "CONTENT SECURITY POLICY:\n```php\n<?php\n// CSP previne XSS blocand executia scripturilor neautorizate:\nheader(\"Content-Security-Policy: \"\n    . \"default-src 'self'; \"\n    . \"script-src 'self' https://cdn.jsdelivr.net; \"\n    . \"style-src 'self' 'unsafe-inline'; \"\n    . \"img-src 'self' data: https:; \"\n    . \"font-src 'self' https://fonts.gstatic.com; \"\n    . \"connect-src 'self' https://api.example.com; \"\n    . \"frame-ancestors 'none'\"\n);\n// Daca cineva injecteaza <script src='https://evil.com/x.js'>,\n// browserul REFUZA sa-l execute!\n```\n\nPREPARED STATEMENTS PDO AVANSATE:\n```php\n<?php\n$pdo = new PDO(\n    'mysql:host=localhost;dbname=magazin;charset=utf8mb4',\n    $user,\n    $pass,\n    [\n        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,\n        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,\n        PDO::ATTR_EMULATE_PREPARES   => false, // IMPORTANT: real prepared!\n    ]\n);\n\n// EMULATE_PREPARES = false forteaza MySQL sa faca prepared statements real\n// true (default) = PDO simuleaza, potentiala vulnerabilitate cu charset edge cases\n\n// Tranzactii sigure:\ntry {\n    $pdo->beginTransaction();\n    $pdo->prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?')\n        ->execute([500, $senderId]);\n    $pdo->prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?')\n        ->execute([500, $receiverId]);\n    $pdo->commit();\n} catch (PDOException $e) {\n    $pdo->rollBack();\n    throw $e;\n}\n```\n\nENVIRONMENT VARIABLES (fara credentiale in cod):\n```php\n<?php\n// NICIODATA asa:\n$pdo = new PDO('mysql:...', 'root', 'parola123'); // parola in cod!\n\n// CORECT — .env:\n$pdo = new PDO(\n    getenv('DB_DSN'),\n    getenv('DB_USER'),\n    getenv('DB_PASS')\n);\n\n// .env in .gitignore!\n// .env.example fara valori reale, commitut in git\n```\n\nLA INTERVIU: Care sunt cele mai frecvente vulnerabilitati PHP? 1. SQL Injection (prepared statements fix). 2. XSS (htmlspecialchars/Blade escaping). 3. CSRF (token in form). 4. Insecure file upload (MIME check, rename, outside webroot). 5. Parole plain text (password_hash). 6. Credentiale in cod (env vars)."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "sql injection fix",
        "question": "Cum previi SQL Injection in PHP pur (fara framework)?",
        "options": [
          "mysql_escape_string()",
          "Prepared Statements cu PDO: $stmt = $pdo->prepare('WHERE id = ?'); $stmt->execute([$id])",
          "addslashes($input)",
          "strip_tags($input)"
        ],
        "answer": "Prepared Statements cu PDO: $stmt = $pdo->prepare('WHERE id = ?'); $stmt->execute([$id])",
        "explanation": "Prepared statements separa SQL de date. MySQL stie ca ? e data, nu cod. Chiar si '1 OR 1=1' devine un string literal.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "xss prevention",
        "question": "Cum previi XSS cand afisezi input de la user in HTML?",
        "options": [
          "strip_tags($input)",
          "htmlspecialchars($input, ENT_QUOTES, 'UTF-8')",
          "addslashes($input)",
          "md5($input)"
        ],
        "answer": "htmlspecialchars($input, ENT_QUOTES, 'UTF-8')",
        "explanation": "htmlspecialchars transforma < > & ' \" in entitati HTML. <script> devine &lt;script&gt; — nu se mai executa.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "password hash",
        "question": "De ce nu se foloseste MD5 pentru hash-ul parolelor?",
        "options": [
          "E prea lung",
          "MD5 e rapid — atacatorul poate genera milioane de hash-uri pe secunda (brute force/rainbow tables)",
          "E mai vechi",
          "Nu returneaza string"
        ],
        "answer": "MD5 e rapid — atacatorul poate genera milioane de hash-uri pe secunda (brute force/rainbow tables)",
        "explanation": "Bcrypt e intentionat lent si are salt intern. Un hash MD5 se crack-uieste in secunde cu GPU modern.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "csrf token",
        "question": "Ce este un CSRF token si cum protejeaza?",
        "options": [
          "Token de autentificare",
          "Token unic per sesiune inclus in form. Serverul refuza requesturi fara token valid — un site extern nu poate genera token-ul corect",
          "Token JWT",
          "Token rate limiting"
        ],
        "answer": "Token unic per sesiune inclus in form. Serverul refuza requesturi fara token valid — un site extern nu poate genera token-ul corect",
        "explanation": "site-rau.ro nu stie token-ul CSRF din sesiunea ta. Requestul fortat va fi respins cu 419 in Laravel.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "csp header",
        "question": "Ce face header-ul Content-Security-Policy?",
        "options": [
          "Comprima continutul",
          "Spune browserului de unde are voie sa incarce scripturi/stiluri/imagini — blocheaza XSS chiar daca injectarea a reusit",
          "Autentificare",
          "CORS"
        ],
        "answer": "Spune browserului de unde are voie sa incarce scripturi/stiluri/imagini — blocheaza XSS chiar daca injectarea a reusit",
        "explanation": "CSP = defense in depth. Chiar daca atacatorul injecteaza <script src='evil.com'>, browserul refuza sa-l execute.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "file upload mime",
        "question": "De ce verifici MIME-ul fisierului uploadat din continut, nu din extensie?",
        "options": [
          "Extensia nu e accesibila",
          "Extensia se poate falsifica usor: virus.php redenumit photo.jpg. MIME din continut e detectat real",
          "MIME e mai rapid",
          "Extensia nu exista"
        ],
        "answer": "Extensia se poate falsifica usor: virus.php redenumit photo.jpg. MIME din continut e detectat real",
        "explanation": "finfo->file() citeste magic bytes din fisier. JPEG incepe cu FFD8FF. PHP file poate fi deghizat dar magic bytes vor trada.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "session fixation",
        "question": "Ce este Session Fixation si cum o previi?",
        "options": [
          "Session expira",
          "Atacatorul iti da un session ID cunoscut. Dupa login, apelezi session_regenerate_id(true) pentru ID nou",
          "Prea multe sesiuni",
          "Session se corupe"
        ],
        "answer": "Atacatorul iti da un session ID cunoscut. Dupa login, apelezi session_regenerate_id(true) pentru ID nou",
        "explanation": "Daca ID-ul ramane acelasi dupa login, atacatorul (care a setat ID-ul) are sesiunea autentificata. session_regenerate_id face ID nou.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "env variables",
        "question": "De ce pui credentialele DB in .env si nu direct in cod?",
        "options": [
          "E mai rapid",
          "Codul poate fi public pe GitHub. .env e in .gitignore. Credentialele nu ajung in repository",
          "PHP citeste .env automat",
          "E conventional"
        ],
        "answer": "Codul poate fi public pe GitHub. .env e in .gitignore. Credentialele nu ajung in repository",
        "explanation": "Mii de developeri au compromis credentiale prin commit accidental. .env + .gitignore e obligatoriu.",
        "difficulty": "easy"
      },
      {
        "number": 9,
        "name": "x-frame-options",
        "question": "Ce face header-ul `X-Frame-Options: DENY`?",
        "options": [
          "Opreste iframe-urile de pe site",
          "Previne clickjacking — site-urile externe nu pot incarca pagina ta intr-un iframe ascuns",
          "Blocheaza CORS",
          "Securizeaza cookie-uri"
        ],
        "answer": "Previne clickjacking — site-urile externe nu pot incarca pagina ta intr-un iframe ascuns",
        "explanation": "Clickjacking: atacatorul pune site-ul tau intr-un iframe transparent peste butonul sau. Userul crede ca apasa el dar apasa al tau.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "prepared emulate",
        "question": "De ce setezi `PDO::ATTR_EMULATE_PREPARES => false`?",
        "options": [
          "Performanta",
          "Forteaza MySQL sa faca prepared statements reale in loc de emulare PDO — elimina potentiale vulnerabilitati cu charset-uri speciale",
          "E mai nou",
          "Reduce conexiuni"
        ],
        "answer": "Forteaza MySQL sa faca prepared statements reale in loc de emulare PDO — elimina potentiale vulnerabilitati cu charset-uri speciale",
        "explanation": "Emularea PDO poate fi vulnerabila in edge cases cu charset GBK/multibyte. Real prepared = MySQL separa query de date la nivel de protocol.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "in whitelist",
        "question": "Cum previi un atac cand userul alege un rol din form ('user', 'editor', 'admin')?",
        "options": [
          "htmlspecialchars($role)",
          "'role' => 'in:user,editor,admin' in validare — whitelist explicit",
          "strip_tags($role)",
          "addslashes($role)"
        ],
        "answer": "'role' => 'in:user,editor,admin' in validare — whitelist explicit",
        "explanation": "Fara whitelist: userul poate trimite role=superadmin sau role=; DROP TABLE. Whitelist accepta NUMAI valorile listate.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Prepared statement PDO",
        "question": "Scrie un prepared statement PDO care selecteaza un user dupa email, sigur la SQL injection.",
        "options": [],
        "answer": "",
        "explanation": "$stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?'); $stmt->execute([$email]); $user = $stmt->fetch();",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "XSS prevenie multipla",
        "question": "Intr-un template PHP simplu, afiseaza `$_GET['username']` in mod sigur intr-un tag <h1>.",
        "options": [],
        "answer": "",
        "explanation": "<h1><?= htmlspecialchars($username, ENT_QUOTES, 'UTF-8') ?></h1>",
        "difficulty": "easy"
      },
      {
        "number": 14,
        "name": "httponly cookie",
        "question": "De ce setezi `httponly = true` pe cookie-ul de sesiune?",
        "options": [
          "E mai rapid",
          "JavaScript nu poate citi cookie-ul — chiar daca XSS reuseste, atacatorul nu poate fura sesiunea prin document.cookie",
          "HTTPS only",
          "Sesiune permanenta"
        ],
        "answer": "JavaScript nu poate citi cookie-ul — chiar daca XSS reuseste, atacatorul nu poate fura sesiunea prin document.cookie",
        "explanation": "HttpOnly = defense in depth. XSS nu mai poate face document.cookie si trimite la server atacator. Combinat cu SameSite=Strict.",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "owasp top",
        "question": "Care sunt primele 3 vulnerabilitati OWASP Top 10 aplicabile in PHP?",
        "options": [
          "Buffer overflow, memory leak, segfault",
          "Injection (SQL/XSS), Broken Authentication, Cryptographic Failures (parole MD5, credentiale in cod)",
          "Slow queries, missing indexes, memory",
          "CORS, CSRF, cookies"
        ],
        "answer": "Injection (SQL/XSS), Broken Authentication, Cryptographic Failures (parole MD5, credentiale in cod)",
        "explanation": "OWASP A01: Broken Access Control. A02: Crypto Failures. A03: Injection. In PHP specific: SQL injection si XSS sunt cel mai frecvente.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "php-websockets",
    "title": "39. PHP si WebSockets (Reverb, Broadcasting, Channels)",
    "order": 39,
    "theory": [
      {
        "order": 1,
        "title": "WebSockets vs HTTP — concepte de baza",
        "content": "HTTP e request-response: clientul cere, serverul raspunde si inchide conexiunea. WebSocket e o conexiune persistenta bidirectionala.\n\nCOMPARAREA:\n```\nHTTP (Polling):\n Client -> Server: 'Mesaje noi?' -> 'Nu'\n Client -> Server: 'Mesaje noi?' -> 'Nu'  (la fiecare 2 secunde)\n Client -> Server: 'Mesaje noi?' -> 'Da, iata mesajul'\n (ineficient, intarziere)\n\nWebSocket:\n Client <-> Server: conexiune deschisa\n Server -> Client: 'Mesaj nou de la Ion!' (instant, fara poll)\n Client -> Server: 'Trimitere mesaj: Salut!'  (imediat)\n```\n\nLARAVEL REVERB — WebSocket server nativ:\n```bash\ncomposer require laravel/reverb\nphp artisan reverb:install\n\n# .env:\nBROADCAST_CONNECTION=reverb\nREVERB_APP_ID=my-app-id\nREVERB_APP_KEY=my-app-key\nREVERB_APP_SECRET=my-app-secret\nREVERB_HOST=localhost\nREVERB_PORT=8080\n\n# Pornire:\nphp artisan reverb:start\n\n# Frontend:\nnpm install laravel-echo pusher-js\n```\n\nCONFIGURARE ECHO (resources/js/bootstrap.js):\n```javascript\nimport Echo from 'laravel-echo';\nimport Pusher from 'pusher-js';\nwindow.Pusher = Pusher;\n\nwindow.Echo = new Echo({\n    broadcaster: 'reverb',\n    key: import.meta.env.VITE_REVERB_APP_KEY,\n    wsHost: import.meta.env.VITE_REVERB_HOST,\n    wsPort: import.meta.env.VITE_REVERB_PORT,\n    forceTLS: false,\n    enabledTransports: ['ws', 'wss'],\n});\n```"
      },
      {
        "order": 2,
        "title": "Events si Broadcasting in Laravel",
        "content": "Broadcasting trimite event-uri PHP catre clientii conectati prin WebSocket.\n\nCREARE EVENT BROADCAST:\n```bash\nphp artisan make:event MessageSent\n```\n\nIMPLEMENTARE EVENT:\n```php\n<?php\nnamespace App\\Events;\n\nuse App\\Models\\Message;\nuse Illuminate\\Broadcasting\\Channel;\nuse Illuminate\\Broadcasting\\InteractsWithSockets;\nuse Illuminate\\Broadcasting\\PresenceChannel;\nuse Illuminate\\Broadcasting\\PrivateChannel;\nuse Illuminate\\Contracts\\Broadcasting\\ShouldBroadcast;\nuse Illuminate\\Foundation\\Events\\Dispatchable;\n\nclass MessageSent implements ShouldBroadcast {\n    use Dispatchable, InteractsWithSockets;\n\n    public function __construct(\n        public Message $message,\n        public int $conversationId\n    ) {}\n\n    // Pe ce canal se trimite:\n    public function broadcastOn(): array {\n        return [\n            new PrivateChannel('conversation.' . $this->conversationId),\n        ];\n    }\n\n    // Ce date se trimit (implicit: toate proprietatile publice):\n    public function broadcastWith(): array {\n        return [\n            'id'         => $this->message->id,\n            'body'       => $this->message->body,\n            'user'       => [\n                'id'   => $this->message->user->id,\n                'name' => $this->message->user->name,\n            ],\n            'created_at' => $this->message->created_at->toISOString(),\n        ];\n    }\n\n    // Numele evenimentului in JavaScript:\n    public function broadcastAs(): string {\n        return 'message.sent';\n    }\n}\n\n// DECLANSARE din controller:\npublic function store(Request $request, Conversation $conversation) {\n    $message = $conversation->messages()->create([\n        'user_id' => auth()->id(),\n        'body'    => $request->body,\n    ]);\n    \n    broadcast(new MessageSent($message, $conversation->id))->toOthers();\n    // toOthers() = nu trimite si la cel care a scris\n    \n    return new MessageResource($message);\n}\n```"
      },
      {
        "order": 3,
        "title": "Channels — Public, Private, Presence",
        "content": "Laravel are 3 tipuri de canale WebSocket cu nivele diferite de securitate.\n\nPUBLIC CHANNEL:\n```php\n// Oricine se poate abona, fara autentificare:\nnew Channel('notifications');\n\n// JavaScript:\nEcho.channel('notifications')\n    .listen('.new-notification', (data) => {\n        console.log('Notificare noua:', data.message);\n    });\n```\n\nPRIVATE CHANNEL:\n```php\n// routes/channels.php — defineste cine are acces:\nBroadcast::channel('conversation.{conversationId}', function (User $user, int $conversationId) {\n    // Returneaza true/false pentru acces:\n    return $user->conversations()->where('id', $conversationId)->exists();\n});\n\n// Event:\nnew PrivateChannel('conversation.' . $this->conversationId);\n\n// JavaScript:\nEcho.private('conversation.' . conversationId)\n    .listen('.message.sent', (data) => {\n        addMessageToUI(data);\n    });\n```\n\nPRESENCE CHANNEL (stie cine e conectat):\n```php\n// channels.php:\nBroadcast::channel('room.{roomId}', function (User $user, int $roomId) {\n    if ($user->canJoinRoom($roomId)) {\n        // Datele returnate sunt disponibile altor membri:\n        return ['id' => $user->id, 'name' => $user->name, 'avatar' => $user->avatar_url];\n    }\n    return false;\n});\n\n// Event:\nnew PresenceChannel('room.' . $this->roomId);\n\n// JavaScript:\nEcho.join('room.' + roomId)\n    .here((users) => {\n        // Membrii conectati la intrare\n        setOnlineUsers(users);\n    })\n    .joining((user) => {\n        addOnlineUser(user);\n    })\n    .leaving((user) => {\n        removeOnlineUser(user);\n    })\n    .listen('.message.sent', (data) => {\n        addMessage(data);\n    });\n```"
      },
      {
        "order": 4,
        "title": "Reverb vs Pusher si cazuri de utilizare",
        "content": "REVERB vs PUSHER:\n```\nLaravel Reverb:\n + Self-hosted (pe serverul propriu)\n + Gratuit (fara limite de mesaje)\n + Control total\n + Integrat nativ in Laravel\n - Trebuie gestionat serverul WebSocket\n - Configurare mai complexa\n\nPusher (third-party):\n + Hosted (nu gestionezi nimic)\n + Scalare automata\n + Dashboard si analytics\n - Cost la mesaje multe / connections\n - Date la third-party\n```\n\nCONFIGURARE PUSHER:\n```php\n// .env:\nBROADCAST_CONNECTION=pusher\nPUSHER_APP_ID=your-id\nPUSHER_APP_KEY=your-key\nPUSHER_APP_SECRET=your-secret\nPUSHER_APP_CLUSTER=eu\n\n// config/broadcasting.php:\n'pusher' => [\n    'driver' => 'pusher',\n    'key'    => env('PUSHER_APP_KEY'),\n    'secret' => env('PUSHER_APP_SECRET'),\n    'app_id' => env('PUSHER_APP_ID'),\n    'options' => [\n        'cluster' => env('PUSHER_APP_CLUSTER'),\n        'useTLS'  => true,\n    ],\n],\n```\n\nCAZURI DE UTILIZARE REALE:\n```\nChat in timp real        -> PrivateChannel per conversatie\nNotificari live          -> PrivateChannel per user\nDashboard stats live     -> PublicChannel sau PrivateChannel\nCo-editare documente     -> PresenceChannel (cine editeaza)\nIndicator 'typing...'    -> PresenceChannel\nSisteme de licitatie     -> PublicChannel cu date sensibile remove\nTracking comenzi live    -> PrivateChannel per user\n```\n\nBROADCAST IN BACKGROUND (Queue):\n```php\n<?php\n// ShouldBroadcast: trimite sincron (blocheaza)\n// ShouldBroadcastNow: trimite sincron fortat\n// Recomandat: implementeaza ShouldQueue de asemenea:\nclass MessageSent implements ShouldBroadcast, ShouldQueue {\n    // Trimiterea WebSocket se face in background\n    // Nu blocheaza request-ul HTTP\n}\n```\n\nLA INTERVIU: Diferenta Polling vs WebSocket vs SSE? Polling: clientul intreaba repetat. WebSocket: bidirectional, persistent. SSE (Server-Sent Events): unidirectional server->client, HTTP. WebSocket e mai puternic, SSE e mai simplu pentru one-way."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "websocket vs http",
        "question": "Ce avantaj principal au WebSocket-urile fata de HTTP polling?",
        "options": [
          "WebSocket e mai rapid la primul request",
          "WebSocket mentine conexiunea deschisa bidirectional — serverul poate trimite date instant fara polling repetat",
          "WebSocket e mai sigur",
          "WebSocket nu foloseste TCP"
        ],
        "answer": "WebSocket mentine conexiunea deschisa bidirectional — serverul poate trimite date instant fara polling repetat",
        "explanation": "Polling: 1 request / 2 secunde = 30 requesturi/minut. WebSocket: 0 requesturi, serverul trimite instant. Ideal pentru chat, notificari live.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "reverb start",
        "question": "Ce comanda porneste serverul WebSocket Laravel Reverb?",
        "options": [
          "php artisan websocket:start",
          "php artisan reverb:start",
          "node reverb-server.js",
          "php artisan queue:work --ws"
        ],
        "answer": "php artisan reverb:start",
        "explanation": "Reverb e serverul WebSocket nativ Laravel. Ruleaza separat de php artisan serve. In productie: supervisor pentru auto-restart.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "ShouldBroadcast",
        "question": "Ce face interfata `ShouldBroadcast` pe un Event Laravel?",
        "options": [
          "Face event-ul async",
          "Marcheaza event-ul sa fie trimis prin WebSocket la clientii abonati pe canal",
          "Valideaza event-ul",
          "Face log event-ului"
        ],
        "answer": "Marcheaza event-ul sa fie trimis prin WebSocket la clientii abonati pe canal",
        "explanation": "Fara ShouldBroadcast: event-ul e doar PHP intern. Cu ea: se trimite si prin WebSocket. broadcastOn() defineste canalul.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "private channel auth",
        "question": "Unde definesti cine are acces la un Private Channel?",
        "options": [
          "In Event, metoda broadcastOn()",
          "In routes/channels.php cu Broadcast::channel('canal.{id}', function(User $user, int $id) { ... })",
          "In middleware",
          "In .env"
        ],
        "answer": "In routes/channels.php cu Broadcast::channel('canal.{id}', function(User $user, int $id) { ... })",
        "explanation": "channels.php defineste callback-urile de autorizare. Returneaza true = acces permis, false = 403.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "presence channel",
        "question": "Ce face un Presence Channel in plus fata de Private Channel?",
        "options": [
          "Mai rapid",
          "Stie toti membrii conectati — joining/leaving events. Util pentru 'user X is online' si 'typing...'",
          "E public",
          "Are mai multe mesaje"
        ],
        "answer": "Stie toti membrii conectati — joining/leaving events. Util pentru 'user X is online' si 'typing...'",
        "explanation": "Private = secure broadcast. Presence = secure + lista membri. .here() (initial), .joining() (intrare), .leaving() (iesire).",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "toOthers",
        "question": "Ce face `broadcast(...)->toOthers()` in controller?",
        "options": [
          "Trimite la toti",
          "Trimite la toti EXCEPT userul care a declansat evenimentul",
          "Trimite la adminii",
          "Trimite dupa 1 secunda"
        ],
        "answer": "Trimite la toti EXCEPT userul care a declansat evenimentul",
        "explanation": "La chat: cand trimiti un mesaj, tu il afisezi instant in UI. Nu vrei sa-l primesti inca o data prin WebSocket. toOthers() previne duplicarea.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "broadcastWith",
        "question": "De ce definesti `broadcastWith()` in Event?",
        "options": [
          "E obligatorie",
          "Controlezi exact ce date se trimit prin WebSocket — eviti sa expui date sensibile din model",
          "Creste viteza",
          "Adauga header-uri"
        ],
        "answer": "Controlezi exact ce date se trimit prin WebSocket — eviti sa expui date sensibile din model",
        "explanation": "Fara broadcastWith(): toate proprietatile publice se serializeaza. Cu ea: selectezi exact campurile, transformi si formatezi.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "reverb vs pusher",
        "question": "Cand alegi Laravel Reverb in loc de Pusher?",
        "options": [
          "Intotdeauna Pusher",
          "Cand vrei self-hosted, cost zero la mesaje multe, sau datele nu pot parasi serverul propriu (GDPR)",
          "Cand ai putini useri",
          "Cand nu ai Redis"
        ],
        "answer": "Cand vrei self-hosted, cost zero la mesaje multe, sau datele nu pot parasi serverul propriu (GDPR)",
        "explanation": "Pusher e excelent pentru start rapid. Reverb pentru control total, volume mare de mesaje, sau cerinte GDPR/conformitate.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "echo listen",
        "question": "Cum asculti evenimentul 'message.sent' pe un canal privat cu Laravel Echo in JavaScript?",
        "options": [
          "Echo.on('conversation.1', 'message.sent', callback)",
          "Echo.private('conversation.1').listen('.message.sent', callback)",
          "WebSocket.listen('message.sent', callback)",
          "Echo.listen('private-conversation.1', callback)"
        ],
        "answer": "Echo.private('conversation.1').listen('.message.sent', callback)",
        "explanation": "Echo.private() pentru canale autentificate. .listen() cu . prefix pentru custom events (broadcastAs()). Fara punct = Laravel event class name.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "sse vs websocket",
        "question": "Cand folosesti SSE (Server-Sent Events) in loc de WebSocket?",
        "options": [
          "Intotdeauna WebSocket",
          "SSE e mai simplu pentru comunicare unidirectionala server->client (notificari, feed live). WebSocket pentru bidirectional (chat)",
          "SSE e mai rapid",
          "SSE suporta binar"
        ],
        "answer": "SSE e mai simplu pentru comunicare unidirectionala server->client (notificari, feed live). WebSocket pentru bidirectional (chat)",
        "explanation": "SSE: HTTP standard, auto-reconnect, simplu. Dezavantaj: un singur sens. WebSocket: bidirectional, dar mai complex, necesita server special.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "broadcast queue",
        "question": "De ce este bine ca event-urile de broadcasting sa implementeze si `ShouldQueue`?",
        "options": [
          "Nu e necesar",
          "Trimiterea WebSocket se face in background si nu blocheaza request-ul HTTP al utilizatorului",
          "Micsoreaza mesajul",
          "Adauga retry"
        ],
        "answer": "Trimiterea WebSocket se face in background si nu blocheaza request-ul HTTP al utilizatorului",
        "explanation": "Fara queue: request-ul asteapta pana se trimite prin WebSocket. Cu queue: request-ul se termina imediat, broadcasting e async.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Event broadcast definit",
        "question": "Scrie un Event `ProductUpdated` care se trimite pe canalul public 'products' cu datele id, name, price ale produsului.",
        "options": [],
        "answer": "",
        "explanation": "public function broadcastOn(): array { return [new Channel('products')]; } public function broadcastWith(): array { return ['id' => $this->product->id, 'name' => $this->product->name, 'price' => $this->product->price]; }",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Channel authorization",
        "question": "Defineste autorizarea pentru canalul privat 'orders.{orderId}': userul poate accesa numai propriile comenzi.",
        "options": [],
        "answer": "",
        "explanation": "Broadcast::channel('orders.{orderId}', function (User $user, int $orderId) { return Order::where('id', $orderId)->where('user_id', $user->id)->exists(); });",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Echo join presence",
        "question": "Cum afisezi lista utilizatorilor online dintr-un Presence Channel cu Laravel Echo?",
        "options": [
          "Echo.private().here()",
          "Echo.join('room.1').here((users) => setOnlineUsers(users)).joining((u) => addUser(u)).leaving((u) => removeUser(u))",
          "Echo.presence('room.1').users()",
          "Echo.channel().members()"
        ],
        "answer": "Echo.join('room.1').here((users) => setOnlineUsers(users)).joining((u) => addUser(u)).leaving((u) => removeUser(u))",
        "explanation": ".join() pentru presence channels. .here() = membrii la conectare. .joining()/.leaving() pentru update live.",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "broadcast trigger",
        "question": "Din ce loc in aplicatie se declanseaza cel mai des broadcasting?",
        "options": [
          "Numai din migrations",
          "Din Controllers sau Observers (dupa save/update), si din Jobs pentru evenimente async",
          "Numai din routes",
          "Numai din Blade"
        ],
        "answer": "Din Controllers sau Observers (dupa save/update), si din Jobs pentru evenimente async",
        "explanation": "broadcast(new MessageSent($msg)) in controller. Sau Model Observer: updated() { broadcast(new ProductUpdated($product)); }",
        "difficulty": "easy"
      }
    ]
  },
  {
    "slug": "php-mini-proiect-final",
    "title": "40. Mini Proiect PHP Final — Blog complet cu Laravel",
    "order": 40,
    "theory": [
      {
        "order": 1,
        "title": "Arhitectura blogului — planificare si structura",
        "content": "Vom construi un blog complet cu: autentificare, CRUD posturi, comentarii, API REST.\n\nFEATURES:\n```\n[x] Autentificare (register/login/logout cu Sanctum)\n[x] CRUD posturi (create, read, update, delete)\n[x] Comentarii la posturi\n[x] Categorii cu filtrare\n[x] API REST cu resurse si paginare\n[x] Autorizare (numai autorul poate edita/sterge)\n[x] Paginare\n[x] Sluguri SEO-friendly\n```\n\nBASA DE DATE:\n```sql\nusers:          id, name, email, password, role\ncategories:     id, name, slug, description\nposts:          id, user_id, category_id, title, slug, body, published_at\ncomments:       id, post_id, user_id, body, approved_at\n```\n\nMIGRATIONS:\n```bash\nphp artisan make:model Category -m\nphp artisan make:model Post -m\nphp artisan make:model Comment -m\n```\n\nPOSTS MIGRATION:\n```php\nSchema::create('posts', function (Blueprint $table) {\n    $table->id();\n    $table->foreignId('user_id')->constrained()->onDelete('cascade');\n    $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();\n    $table->string('title');\n    $table->string('slug')->unique();\n    $table->longText('body');\n    $table->string('excerpt', 500)->nullable();\n    $table->timestamp('published_at')->nullable();\n    $table->timestamps();\n    $table->index(['published_at', 'created_at']);\n    $table->fullText('title');\n});\n```\n\nCOMMAND SETUP:\n```bash\ncomposer create-project laravel/laravel blog\ncomposer require laravel/sanctum\nphp artisan install:api  # L11+\nphp artisan make:controller Api/PostController --api\nphp artisan make:controller Api/CommentController --api\nphp artisan make:controller Api/AuthController\nphp artisan make:resource PostResource\nphp artisan make:resource CommentResource\n```"
      },
      {
        "order": 2,
        "title": "Models cu relatii si scopes",
        "content": "MODELUL POST COMPLET:\n```php\n<?php\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Model;\nuse Illuminate\\Database\\Eloquent\\Builder;\nuse Illuminate\\Support\\Str;\n\nclass Post extends Model {\n    protected $fillable = ['title', 'slug', 'body', 'excerpt', 'category_id', 'published_at'];\n\n    protected $casts = [\n        'published_at' => 'datetime',\n    ];\n\n    // Auto-generate slug:\n    protected static function booted(): void {\n        static::creating(function (Post $post) {\n            $post->slug ??= Str::slug($post->title);\n        });\n    }\n\n    // Relatii:\n    public function user(): BelongsTo {\n        return $this->belongsTo(User::class);\n    }\n\n    public function category(): BelongsTo {\n        return $this->belongsTo(Category::class);\n    }\n\n    public function comments(): HasMany {\n        return $this->hasMany(Comment::class);\n    }\n\n    public function approvedComments(): HasMany {\n        return $this->hasMany(Comment::class)->whereNotNull('approved_at');\n    }\n\n    // Scopes:\n    public function scopePublished(Builder $query): Builder {\n        return $query->whereNotNull('published_at')\n                     ->where('published_at', '<=', now());\n    }\n\n    public function scopeForCategory(Builder $query, string $slug): Builder {\n        return $query->whereHas('category', fn($q) => $q->where('slug', $slug));\n    }\n\n    // Accessor:\n    public function getReadingTimeAttribute(): int {\n        return (int) ceil(str_word_count($this->body) / 200);\n    }\n}\n```"
      },
      {
        "order": 3,
        "title": "API Controllers si Resources",
        "content": "POST CONTROLLER COMPLET:\n```php\n<?php\nnamespace App\\Http\\Controllers\\Api;\n\nuse App\\Http\\Controllers\\Controller;\nuse App\\Http\\Requests\\StorePostRequest;\nuse App\\Http\\Resources\\PostResource;\nuse App\\Models\\Post;\nuse Illuminate\\Http\\Request;\nuse Illuminate\\Support\\Facades\\Cache;\n\nclass PostController extends Controller {\n    public function index(Request $request) {\n        $posts = Cache::remember(\n            'posts:page:' . $request->get('page', 1),\n            300,\n            fn() => Post::with(['user', 'category'])\n                ->withCount('approvedComments')\n                ->published()\n                ->when($request->filled('category'), fn($q) =>\n                    $q->forCategory($request->category)\n                )\n                ->latest('published_at')\n                ->paginate(10)\n        );\n\n        return PostResource::collection($posts);\n    }\n\n    public function show(Post $post) {\n        abort_if(!$post->published_at, 404);\n        $post->load(['user', 'category', 'approvedComments.user']);\n        return new PostResource($post);\n    }\n\n    public function store(StorePostRequest $request) {\n        $post = $request->user()->posts()->create($request->validated());\n        Cache::tags('posts')->flush();\n        return (new PostResource($post))->response()->setStatusCode(201);\n    }\n\n    public function update(StorePostRequest $request, Post $post) {\n        $this->authorize('update', $post);\n        $post->update($request->validated());\n        Cache::tags('posts')->flush();\n        return new PostResource($post);\n    }\n\n    public function destroy(Post $post) {\n        $this->authorize('delete', $post);\n        $post->delete();\n        Cache::tags('posts')->flush();\n        return response()->noContent();\n    }\n}\n```\n\nPOST RESOURCE:\n```php\n<?php\nclass PostResource extends JsonResource {\n    public function toArray(Request $request): array {\n        return [\n            'id'               => $this->id,\n            'title'            => $this->title,\n            'slug'             => $this->slug,\n            'excerpt'          => $this->excerpt ?? Str::limit($this->body, 200),\n            'reading_time'     => $this->reading_time . ' min',\n            'published_at'     => $this->published_at?->toISOString(),\n            'author'           => ['id' => $this->user->id, 'name' => $this->user->name],\n            'category'         => new CategoryResource($this->whenLoaded('category')),\n            'comments_count'   => $this->approved_comments_count ?? 0,\n            'comments'         => CommentResource::collection($this->whenLoaded('approvedComments')),\n        ];\n    }\n}\n```"
      },
      {
        "order": 4,
        "title": "Autentificare API, PostPolicy si teste",
        "content": "AUTH CONTROLLER:\n```php\n<?php\nclass AuthController extends Controller {\n    public function register(Request $request) {\n        $data = $request->validate([\n            'name'     => 'required|string|max:255',\n            'email'    => 'required|email|unique:users',\n            'password' => 'required|string|min:8|confirmed',\n        ]);\n\n        $user  = User::create([\n            ...$data,\n            'password' => Hash::make($data['password']),\n        ]);\n        $token = $user->createToken('api')->plainTextToken;\n\n        return response()->json(['user' => $user, 'token' => $token], 201);\n    }\n\n    public function login(Request $request) {\n        $request->validate([\n            'email'    => 'required|email',\n            'password' => 'required',\n        ]);\n\n        if (!auth()->attempt($request->only('email', 'password'))) {\n            return response()->json(['message' => 'Credentiale incorecte'], 401);\n        }\n\n        $token = auth()->user()->createToken('api')->plainTextToken;\n        return response()->json(['token' => $token]);\n    }\n}\n```\n\nPOST POLICY:\n```php\n<?php\nclass PostPolicy {\n    public function update(User $user, Post $post): bool {\n        return $user->id === $post->user_id || $user->role === 'admin';\n    }\n    public function delete(User $user, Post $post): bool {\n        return $user->id === $post->user_id || $user->role === 'admin';\n    }\n}\n```\n\nFEATURE TEST:\n```php\n<?php\nclass PostApiTest extends TestCase {\n    use RefreshDatabase;\n\n    public function test_published_posts_are_paginated(): void {\n        Post::factory(15)->create(['published_at' => now()]);\n        $this->getJson('/api/posts')\n             ->assertOk()\n             ->assertJsonCount(10, 'data')  // 10 pe pagina\n             ->assertJsonPath('meta.total', 15);\n    }\n\n    public function test_author_can_delete_post(): void {\n        $user = User::factory()->create();\n        $post = Post::factory()->create(['user_id' => $user->id]);\n\n        $this->actingAs($user, 'sanctum')\n             ->deleteJson('/api/posts/' . $post->id)\n             ->assertNoContent();\n\n        $this->assertSoftDeleted('posts', ['id' => $post->id]);\n    }\n\n    public function test_other_user_cannot_delete_post(): void {\n        $owner = User::factory()->create();\n        $other = User::factory()->create();\n        $post  = Post::factory()->create(['user_id' => $owner->id]);\n\n        $this->actingAs($other, 'sanctum')\n             ->deleteJson('/api/posts/' . $post->id)\n             ->assertForbidden();\n    }\n}\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "slug auto-generate",
        "question": "Cum generezi automat slug-ul unui post din titlu la creare?",
        "options": [
          "Observer separat",
          "static::creating() in booted(): $post->slug ??= Str::slug($post->title)",
          "In controller manual",
          "Migration trigger"
        ],
        "answer": "static::creating() in booted(): $post->slug ??= Str::slug($post->title)",
        "explanation": "Model lifecycle hooks in booted(). creating() ruleaza inainte de INSERT. ??= = seteaza numai daca e null (permite si slug manual).",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "scope published",
        "question": "Cum ar arata scope-ul `scopePublished` pentru posturi care au `published_at` in trecut?",
        "options": [
          "where('published', true)",
          "whereNotNull('published_at')->where('published_at', '<=', now())",
          "where('status', 'published')",
          "whereDate('published_at', today())"
        ],
        "answer": "whereNotNull('published_at')->where('published_at', '<=', now())",
        "explanation": "Un post poate fi programat (published_at in viitor). Double condition: exista SI e in trecut/prezent.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "cache invalidare",
        "question": "De ce invalidezi cache-ul dupa store/update/destroy in PostController?",
        "options": [
          "Nu e necesar",
          "Dupa modificare, lista din cache e stale (veche). Cache::tags('posts')->flush() forteaza re-fetch proaspat",
          "Securitate",
          "Logs"
        ],
        "answer": "Dupa modificare, lista din cache e stale (veche). Cache::tags('posts')->flush() forteaza re-fetch proaspat",
        "explanation": "Fara invalidare: userul vede lista veche din cache ore dupa stergere. Cache tags permit invalidare selectiva.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "withCount approved",
        "question": "Cum obtii numarul de comentarii aprobate per post fara N+1?",
        "options": [
          "Post::all() si count($post->approvedComments)",
          "Post::withCount('approvedComments')->get()",
          "Post::with('comments')->get()",
          "Subquery manual"
        ],
        "answer": "Post::withCount('approvedComments')->get()",
        "explanation": "withCount('approvedComments') face COUNT cu WHERE in subquery. $post->approved_comments_count fara query extra.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "policy authorize",
        "question": "Cum verifici in controller ca userul curent poate edita postul, folosind PostPolicy?",
        "options": [
          "if($user->id == $post->user_id)",
          "$this->authorize('update', $post) — aruncaa 403 automat daca policy returneaza false",
          "Gate::check('update', Post::class)",
          "abort_if(!$user->isAdmin(), 403)"
        ],
        "answer": "$this->authorize('update', $post) — aruncaa 403 automat daca policy returneaza false",
        "explanation": "authorize() in controller detecteaza automat PostPolicy@update. Simplu, reutilizabil, testabil.",
        "difficulty": "easy"
      },
      {
        "number": 6,
        "name": "response noContent",
        "question": "Ce status HTTP returneaza `return response()->noContent()` si cand e potrivit?",
        "options": [
          "200 OK",
          "204 No Content — la DELETE cu succes (nimic de returnat)",
          "201 Created",
          "202 Accepted"
        ],
        "answer": "204 No Content — la DELETE cu succes (nimic de returnat)",
        "explanation": "REST convention: DELETE success = 204. Clientul stie ca s-a sters. Nu e nevoie de body.",
        "difficulty": "easy"
      },
      {
        "number": 7,
        "name": "RefreshDatabase blog",
        "question": "De ce e important RefreshDatabase in testele blogului si ce alternativa exista?",
        "options": [
          "Nu e important",
          "Izoleaza testele — fiecare test porneste cu DB curata. Alternativa: DatabaseTransactions (rollback dupa test, mai rapid)",
          "Creeaza date",
          "Face seed"
        ],
        "answer": "Izoleaza testele — fiecare test porneste cu DB curata. Alternativa: DatabaseTransactions (rollback dupa test, mai rapid)",
        "explanation": "RefreshDatabase: truncate + migrate. DatabaseTransactions: rollback (mai rapid dar incompatibil cu multi-db, events).",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "whenLoaded resource",
        "question": "In PostResource, de ce folosesti `CommentResource::collection($this->whenLoaded('approvedComments'))`?",
        "options": [
          "E mai rapid",
          "Include comentariile in JSON numai daca au fost eager loaded — altfel lipsesc fara N+1",
          "E obligatoriu",
          "Reduce dimensiunea"
        ],
        "answer": "Include comentariile in JSON numai daca au fost eager loaded — altfel lipsesc fara N+1",
        "explanation": "La /api/posts (lista): nu vrei comentariile (prea multe date). La /api/posts/{id}: faci ->load('approvedComments') si apar.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "abort_if",
        "question": "Ce face `abort_if(!$post->published_at, 404)` in metoda show?",
        "options": [
          "Verifica autentificarea",
          "Daca postul nu e publicat, returneaza 404 — vizitatorii nu vad draft-urile",
          "Face redirect",
          "Logs eroarea"
        ],
        "answer": "Daca postul nu e publicat, returneaza 404 — vizitatorii nu vad draft-urile",
        "explanation": "abort_if(conditie, status) = helper elegant pentru abortat cu status HTTP. Echivalent cu: if(!$post->published_at) abort(404);",
        "difficulty": "easy"
      },
      {
        "number": 10,
        "name": "auth attempt",
        "question": "Ce returneaza `auth()->attempt(['email' => $email, 'password' => $password])`?",
        "options": [
          "Userul logat",
          "true daca credentialele sunt corecte si userul e setat in sesiune, false altfel",
          "Token-ul",
          "Un redirect"
        ],
        "answer": "true daca credentialele sunt corecte si userul e setat in sesiune, false altfel",
        "explanation": "attempt() verifica email + parola (cu Hash::check intern) si seteaza userul in guard. Returneaza bool.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "reading time accessor",
        "question": "Ce face `getReadingTimeAttribute()` definit in modelul Post?",
        "options": [
          "Modifica campul din DB",
          "Creeaza campul virtual $post->reading_time calculat dinamic din numarul de cuvinte / 200",
          "Face cache",
          "Calculeaza la fiecare save"
        ],
        "answer": "Creeaza campul virtual $post->reading_time calculat dinamic din numarul de cuvinte / 200",
        "explanation": "Accessor = camp calculat on-the-fly. Nu e in DB. Disponibil ca $post->reading_time. Standard 200 cuvinte/minut.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Blog Post model",
        "question": "Scrie relatia `approvedComments()` in modelul Post: comentariile cu `approved_at` nenul.",
        "options": [],
        "answer": "",
        "explanation": "return $this->hasMany(Comment::class)->whereNotNull('approved_at');",
        "difficulty": "easy"
      },
      {
        "number": 13,
        "name": "Comment store API",
        "question": "Scrie un endpoint POST /api/posts/{post}/comments care creeaza un comentariu la un post publicat, asociat userului autentificat.",
        "options": [],
        "answer": "",
        "explanation": "$validated = $request->validate(['body' => 'required|string|max:1000']); $comment = $post->comments()->create([...$validated, 'user_id' => $request->user()->id]); return (new CommentResource($comment))->response()->setStatusCode(201);",
        "difficulty": "hard"
      },
      {
        "number": 14,
        "name": "Factory blog",
        "question": "Scrie o Factory pentru Post cu: titlu fake, slug auto-din-titlu, body paragraf, published_at = now().",
        "options": [],
        "answer": "",
        "explanation": "return ['title' => $title, 'slug' => Str::slug($title), 'body' => fake()->paragraphs(3, true), 'user_id' => User::factory(), 'published_at' => now()];",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Test complet blog",
        "question": "Un Feature Test verifica ca un guest (neautentificat) NU poate crea un post si primeste 401. Cum arata testul?",
        "options": [
          "getJson('/api/posts')->assertUnauthorized()",
          "$this->postJson('/api/posts', ['title' => 'Test', 'body' => 'Text'])->assertUnauthorized()",
          "Guest::deny()->assertFails()",
          "assertDatabaseMissing('posts')"
        ],
        "answer": "$this->postJson('/api/posts', ['title' => 'Test', 'body' => 'Text'])->assertUnauthorized()",
        "explanation": "assertUnauthorized() = assertStatus(401). Fara actingAs(), requestul e ca guest. Middleware auth:sanctum returneaza 401.",
        "difficulty": "easy"
      }
    ]
  }
];

module.exports = { phpExtra2 };
