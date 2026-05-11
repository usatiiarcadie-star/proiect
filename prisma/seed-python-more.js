// Python extra lessons (19-40) — 22 lecții

const pythonMore = [
  {
    slug: "python-dictionaries",
    title: "19. Dicționare (dict)",
    order: 19,
    theory: [
      { order: 1, title: "Creare și acces", content: "Dicționarul stochează perechi cheie-valoare:\n\n```python\nprofil = {\n    'nume': 'Cristi',\n    'varsta': 25,\n    'orase': ['Cluj', 'București']\n}\n\nprint(profil['nume'])          # 'Cristi'\nprint(profil.get('email', 'N/A'))  # 'N/A' dacă nu există\n\n# Adăugare/modificare\nprofil['email'] = 'cristi@x.ro'\nprofil['varsta'] = 26\n\n# Ștergere\ndel profil['email']\nval = profil.pop('varsta')  # returnează și șterge\n```" },
      { order: 2, title: "Metode și iterare", content: "```python\nd = {'a': 1, 'b': 2, 'c': 3}\n\nprint(d.keys())    # dict_keys(['a', 'b', 'c'])\nprint(d.values())  # dict_values([1, 2, 3])\nprint(d.items())   # dict_items([('a',1), ('b',2), ...])\n\n# Iterare\nfor cheie, val in d.items():\n    print(f'{cheie}: {val}')\n\n# Dict comprehension\npatrate = {x: x**2 for x in range(1, 6)}\n# {1:1, 2:4, 3:9, 4:16, 5:25}\n\n# Merge (Python 3.9+)\nd1 = {'a': 1}\nd2 = {'b': 2}\nmerge = d1 | d2  # {'a':1, 'b':2}\n```" },
    ],
    tasks: [
      { number: 1, name: "dict access", question: "Cum accesezi cheia 'varsta' din dict profil?", options: ["profil.varsta", "profil['varsta']", "profil->varsta", "profil(varsta)"], answer: "profil['varsta']", explanation: "Dicționarele se accesează cu bracket notation. Sau .get() pentru valoare default.", difficulty: "easy" },
      { number: 2, name: ".get()", question: "Ce face profil.get('email', 'N/A')?", options: ["Eroare dacă lipsește", "Returnează 'N/A' dacă 'email' nu există", "None", "Exception"], answer: "Returnează 'N/A' dacă 'email' nu există", explanation: ".get(cheie, default) evită KeyError. Util când nu ești sigur că cheia există.", difficulty: "easy" },
      { number: 3, name: "dict comprehension", question: "Ce face {x: x**2 for x in range(1,4)}?", options: ["Lista", "{1:1, 2:4, 3:9}", "{1,4,9}", "[1,4,9]"], answer: "{1:1, 2:4, 3:9}", explanation: "Dict comprehension = cheie: valoare pentru fiecare element din iterable.", difficulty: "medium" },
      { number: 4, name: ".items()", question: "Ce returnează dict.items()?", options: ["Cheile", "Perechi (cheie, valoare) iterabile", "Valorile", "Un dict nou"], answer: "Perechi (cheie, valoare) iterabile", explanation: "Util pentru for cheie, val in d.items(): ... Destructurare automată.", difficulty: "easy" },
    ],
  },
  {
    slug: "python-sets-tuples",
    title: "20. Set-uri și tuple-uri",
    order: 20,
    theory: [
      { order: 1, title: "Set — colecție unică", content: "```python\n# Set — elemente unice, neordonate\ncifre = {1, 2, 3, 3, 2}  # {1, 2, 3} — duplicatele dispar\nvide = set()  # set gol (nu {}!)\n\ncifre.add(4)\ncifre.discard(1)  # nu aruncă eroare dacă lipsește\ncifre.remove(2)   # aruncă KeyError dacă lipsește\n\n# Operații de mulțimi\na = {1, 2, 3}\nb = {2, 3, 4}\nprint(a | b)   # union: {1,2,3,4}\nprint(a & b)   # intersecție: {2,3}\nprint(a - b)   # diferență: {1}\nprint(a ^ b)   # diferență simetrică: {1,4}\n\nprint(1 in a)  # True\n```" },
      { order: 2, title: "Tuple — imutabil", content: "```python\n# Tuple — lista imutabilă\ncoord = (10, 20)\npunct = (3.14, 2.71, 0.0)\nsingle = (42,)  # virgulă obligatorie pentru tuple de un element!\n\nx, y = coord    # unpacking\nprint(coord[0]) # 10\n\n# Named tuple\nfrom collections import namedtuple\nPunct = namedtuple('Punct', ['x', 'y'])\np = Punct(10, 20)\nprint(p.x, p.y)  # 10 20\n\n# Swap rapid cu tuple\na, b = 1, 2\na, b = b, a  # a=2, b=1\n```" },
    ],
    tasks: [
      { number: 1, name: "set dedup", question: "Ce se întâmplă cu duplicatele într-un set?", options: ["Eroare", "Sunt eliminate automat", "Sunt duplicate", "None"], answer: "Sunt eliminate automat", explanation: "Set = colecție de elemente unice. {1,2,2,3} devine {1,2,3}.", difficulty: "easy" },
      { number: 2, name: "set vs dict", question: "Cum creezi un set gol (nu un dict)?", options: ["{}", "set()", "[]", "()"], answer: "set()", explanation: "{} creează un dict gol! Set gol = set(). set({1,2,3}) sau {1,2,3} cu elemente.", difficulty: "medium" },
      { number: 3, name: "set intersection", question: "Ce face a & b pe seturi?", options: ["Diferență", "Intersecție (elementele comune)", "Union", "Produs"], answer: "Intersecție (elementele comune)", explanation: "| = union, & = intersecție, - = diferență, ^ = diferență simetrică.", difficulty: "medium" },
      { number: 4, name: "single tuple", question: "Cum creezi tuple cu un singur element?", options: ["(42)", "(42,)", "[42]", "tuple(42)"], answer: "(42,)", explanation: "(42) = paranteze fără virgulă = int. (42,) = tuple cu virgulă.", difficulty: "hard" },
    ],
  },
  {
    slug: "python-comprehensions",
    title: "21. List/Dict/Set comprehensions",
    order: 21,
    theory: [
      { order: 1, title: "List comprehension", content: "```python\n# Sintaxă: [expresie for item in iterable if conditie]\n\npatrate = [x**2 for x in range(10)]\n# [0,1,4,9,16,25,36,49,64,81]\n\npare = [x for x in range(20) if x % 2 == 0]\n# [0,2,4,...,18]\n\n# Nested\nmatrice = [[i*j for j in range(1,4)] for i in range(1,4)]\n# [[1,2,3],[2,4,6],[3,6,9]]\n\n# Flatten\nflat = [x for row in matrice for x in row]\n# [1,2,3,2,4,6,3,6,9]\n\n# Cu transformare\nnume = ['   alice   ', '  bob  ']\ncurat = [n.strip().capitalize() for n in nume]\n# ['Alice', 'Bob']\n```" },
      { order: 2, title: "Dict și set comprehensions", content: "```python\n# Dict comprehension\ncuvinte = ['mere', 'pere', 'cireșe']\nlungimi = {c: len(c) for c in cuvinte}\n# {'mere': 4, 'pere': 4, 'cireșe': 6}\n\n# Inversare dict\noriginal = {'a': 1, 'b': 2, 'c': 3}\ninversed = {v: k for k, v in original.items()}\n# {1: 'a', 2: 'b', 3: 'c'}\n\n# Set comprehension\nvocale = {c for c in 'Hello World' if c.lower() in 'aeiou'}\n# {'o', 'e'}\n\n# Generator expression (lazy)\ngen = (x**2 for x in range(1000000))  # nu consumă memorie\nnext(gen)  # 0 — calculat la cerere\n```" },
    ],
    tasks: [
      { number: 1, name: "list comp", question: "Ce e [x*2 for x in range(5)]?", options: ["[1,2,3,4,5]", "[0,2,4,6,8]", "[2,4,6,8,10]", "Eroare"], answer: "[0,2,4,6,8]", explanation: "range(5) = 0,1,2,3,4. Fiecare x*2 = 0,2,4,6,8.", difficulty: "easy" },
      { number: 2, name: "filter comp", question: "Cum filtrezi pătratele PARE din range(10)?", options: ["[x**2 if x%2==0]", "[x**2 for x in range(10) if x%2==0]", "[x**2 | x%2==0]", "filter()"], answer: "[x**2 for x in range(10) if x**2%2==0 or True]", explanation: "[x**2 for x in range(10) if x%2==0] = [0,4,16,36,64]", difficulty: "medium" },
      { number: 3, name: "generator", question: "Diferența list comp vs generator expression?", options: ["Identice", "List comp = tot în memorie; generator = lazy (la cerere)", "Generator mai rapid", "Nu există"], answer: "List comp = tot în memorie; generator = lazy (la cerere)", explanation: "(x for x ...) = generator, nu consumă memorie. Util pentru seturi mari de date.", difficulty: "medium" },
      { number: 4, name: "nested comp", question: "Ce face [[i*j for j in [1,2]] for i in [1,2]]?", options: ["Eroare", "[[1,2],[2,4]] — matrice 2x2", "[1,2,2,4]", "Flatten"], answer: "[[1,2],[2,4]] — matrice 2x2", explanation: "Nested comprehension = list de list-uri. Outer for i, inner for j.", difficulty: "hard" },
    ],
  },
  {
    slug: "python-functions-advanced",
    title: "22. Funcții avansate — *args, **kwargs, decoratori",
    order: 22,
    theory: [
      { order: 1, title: "*args și **kwargs", content: "```python\n# *args — argumente poziționale variabile (tuple)\ndef suma(*numere):\n    return sum(numere)\n\nsuma(1, 2, 3)     # 6\nsuma(1, 2, 3, 4)  # 10\n\n# **kwargs — argumente keyword variabile (dict)\ndef profil(**info):\n    for k, v in info.items():\n        print(f'{k}: {v}')\n\nprofil(nume='Cristi', varsta=25)\n\n# Combinat\ndef func(a, b, *args, **kwargs):\n    print(a, b, args, kwargs)\n\nfunc(1, 2, 3, 4, x=5, y=6)\n# 1 2 (3,4) {'x':5,'y':6}\n```" },
      { order: 2, title: "Decoratori", content: "```python\nimport time\n\n# Decorator = funcție care învelește altă funcție\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        print(f'{func.__name__}: {time.time()-start:.3f}s')\n        return result\n    return wrapper\n\n@timer  # echivalent cu: slow = timer(slow)\ndef slow():\n    time.sleep(1)\n    return 'gata'\n\nslow()  # slow: 1.001s\n\n# Decorator built-in\n@property\ndef varsta(self): return self._varsta\n\n@staticmethod\ndef metoda_statica(): ...\n\n@classmethod\ndef metoda_clasa(cls): ...\n```" },
    ],
    tasks: [
      { number: 1, name: "*args type", question: "Ce tip are *args în funcție?", options: ["List", "Tuple", "Set", "Dict"], answer: "Tuple", explanation: "*args colectează toți parametrii extra într-un tuple imutabil.", difficulty: "medium" },
      { number: 2, name: "**kwargs type", question: "Ce tip are **kwargs?", options: ["Tuple", "List", "Dict", "Set"], answer: "Dict", explanation: "**kwargs = keyword arguments, dict cu cheile ca string-uri.", difficulty: "easy" },
      { number: 3, name: "@decorator", question: "Ce face @timer pe o funcție?", options: ["Styling", "Wrapper: funcția e apelată prin timer înainte/după", "Disable", "Cache"], answer: "Wrapper: funcția e apelată prin timer înainte/după", explanation: "@dec e syntactic sugar pentru func = dec(func). Permite adăugare comportament fără modificare.", difficulty: "medium" },
      { number: 4, name: "spread dict", question: "Cum pasezi un dict ca **kwargs?", options: ["f(d)", "f(**d)", "f(*d)", "f(d=d)"], answer: "f(**d)", explanation: "**dict unpacks chei-valori ca keyword arguments: f(**{'a':1,'b':2}) = f(a=1, b=2).", difficulty: "medium" },
    ],
  },
  {
    slug: "python-lambda-map-filter",
    title: "23. Lambda, map, filter, sorted",
    order: 23,
    theory: [
      { order: 1, title: "Lambda — funcții anonime", content: "```python\n# Funcție normală\ndef dublu(x): return x * 2\n\n# Echivalent lambda\ndublu = lambda x: x * 2\nprint(dublu(5))  # 10\n\n# Lambda multilple argumente\nf = lambda x, y, z: x + y + z\nf(1, 2, 3)  # 6\n\n# Lambda cu condiție\nmax_val = lambda a, b: a if a > b else b\nmax_val(3, 7)  # 7\n\n# Uzual: inline în funcții de ordin superior\nnumere = [3, 1, 4, 1, 5, 9]\nnumere.sort(key=lambda x: -x)  # descrescător\n```" },
      { order: 2, title: "map, filter, sorted", content: "```python\nnumere = [1, 2, 3, 4, 5]\n\n# map — aplică funcție pe fiecare element (lazy)\npatrate = list(map(lambda x: x**2, numere))\n# [1, 4, 9, 16, 25]\n\n# filter — păstrează dacă condiție e True (lazy)\npare = list(filter(lambda x: x % 2 == 0, numere))\n# [2, 4]\n\n# sorted — sortare cu cheie\noameni = [{'n': 'Ana', 'v': 25}, {'n': 'Bob', 'v': 20}]\nsortat = sorted(oameni, key=lambda p: p['v'])\nsortat_desc = sorted(oameni, key=lambda p: p['v'], reverse=True)\n\n# functools.reduce — reducere la o valoare\nfrom functools import reduce\nproduce = reduce(lambda acc, x: acc * x, numere)\n# 120 (1*2*3*4*5)\n```" },
    ],
    tasks: [
      { number: 1, name: "lambda", question: "lambda x: x*2 e echivalentul funcției?", options: ["def f(x): pass", "def f(x): return x*2", "class F", "map(2, x)"], answer: "def f(x): return x*2", explanation: "Lambda e funcție anonimă. Un singur return implicit. Fără def/return explicit.", difficulty: "easy" },
      { number: 2, name: "map", question: "Ce face map(lambda x: x**2, [1,2,3])?", options: ["List imediat", "Iterator cu [1,4,9] (lazy — nevoie de list())", "[1,2,3]", "Eroare"], answer: "Iterator cu [1,4,9] (lazy — nevoie de list())", explanation: "map e lazy — calculează la cerere. Învelești în list() pentru a materializa.", difficulty: "medium" },
      { number: 3, name: "filter", question: "Ce face filter(None, [0,1,2,False,3])?", options: ["Elimină None", "Elimină valorile falsy (0, False)", "[0,1,2,False,3]", "Eroare"], answer: "Elimină valorile falsy (0, False)", explanation: "filter(None, ...) = filtru implicit cu bool(). Păstrează doar valorile truthy.", difficulty: "hard" },
      { number: 4, name: "sorted key", question: "Cum sortezi o listă de dict-uri după cheia 'varsta'?", options: ["list.sort('varsta')", "sorted(l, key=lambda x: x['varsta'])", "l.sort('varsta')", "sort(l, 'varsta')"], answer: "sorted(l, key=lambda x: x['varsta'])", explanation: "key= primește funcție care extrage valoarea de sortare. sorted() returnează list nouă.", difficulty: "medium" },
    ],
  },
  {
    slug: "python-oop-avansat",
    title: "24. OOP avansat — moștenire, MRO, magic methods",
    order: 24,
    theory: [
      { order: 1, title: "Moștenire și super()", content: "```python\nclass Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        raise NotImplementedError\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)  # apelează Animal.__init__\n        self.breed = breed\n\n    def speak(self):\n        return f'{self.name}: Ham!'\n\nclass Cat(Animal):\n    def speak(self):\n        return f'{self.name}: Miau!'\n\n# Polimorfism\nanimals = [Dog('Rex', 'Lab'), Cat('Whiskers')]\nfor a in animals:\n    print(a.speak())\n```" },
      { order: 2, title: "Magic methods (dunder)", content: "```python\nclass Vector:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n\n    def __repr__(self):\n        return f'Vector({self.x}, {self.y})'\n\n    def __add__(self, other):\n        return Vector(self.x + other.x, self.y + other.y)\n\n    def __len__(self):\n        return int((self.x**2 + self.y**2)**0.5)\n\n    def __eq__(self, other):\n        return self.x == other.x and self.y == other.y\n\n    def __iter__(self):\n        yield self.x\n        yield self.y\n\nv1 = Vector(1, 2)\nv2 = Vector(3, 4)\nprint(v1 + v2)    # Vector(4, 6)\nprint(len(v1))    # 2\nx, y = v1         # unpacking prin __iter__\n```" },
    ],
    tasks: [
      { number: 1, name: "super()", question: "Ce face super().__init__() în copil?", options: ["Eroare", "Apelează __init__-ul clasei părinte", "Override", "Ascunde"], answer: "Apelează __init__-ul clasei părinte", explanation: "Esențial când adaugi atribute extra în copil dar trebuie și inițializarea părintelui.", difficulty: "medium" },
      { number: 2, name: "__repr__", question: "Pentru ce e __repr__?", options: ["Debug print", "Reprezentare oficial string (văzută în REPL și debug)", "User output", "File"], answer: "Reprezentare oficial string (văzută în REPL și debug)", explanation: "__repr__ = dev repr. __str__ = user-friendly. repr(obj) sau debug output.", difficulty: "medium" },
      { number: 3, name: "__add__", question: "Ce activează __add__ pe o clasă?", options: ["Adunare numerică", "Operatorul + (a + b = a.__add__(b))", "Append", "Union"], answer: "Operatorul + (a + b = a.__add__(b))", explanation: "Magic methods permit operatori custom: __add__=+, __mul__=*, __eq__===, etc.", difficulty: "medium" },
      { number: 4, name: "polimorfism", question: "Ce e polimorfismul în OOP?", options: ["Moștenire multiplă", "Obiecte diferite cu aceeași metodă se comportă diferit", "Typedef", "Interface"], answer: "Obiecte diferite cu aceeași metodă se comportă diferit", explanation: "Dog.speak() și Cat.speak() — aceeași interfață, implementare diferită.", difficulty: "easy" },
    ],
  },
  {
    slug: "python-exceptions",
    title: "25. Excepții și error handling",
    order: 25,
    theory: [
      { order: 1, title: "try/except/else/finally", content: "```python\ntry:\n    n = int(input('Număr: '))\n    result = 100 / n\nexcept ValueError:\n    print('Nu e număr valid!')\nexcept ZeroDivisionError as e:\n    print(f'Eroare: {e}')\nexcept (TypeError, AttributeError):\n    print('Tip greșit')\nexcept Exception as e:\n    print(f'Eroare neașteptată: {e}')\nelse:\n    print(f'Rezultat: {result}')  # rulează dacă NU e excepție\nfinally:\n    print('Mereu rulează (cleanup)')  # chiar dacă e excepție\n```" },
      { order: 2, title: "Excepții custom și raise", content: "```python\nclass VarstaInvalida(ValueError):\n    def __init__(self, varsta):\n        super().__init__(f'Vârsta {varsta} e negativă!')\n        self.varsta = varsta\n\ndef seteaza_varsta(varsta):\n    if varsta < 0:\n        raise VarstaInvalida(varsta)\n    if varsta > 150:\n        raise ValueError('Prea mare')\n    return varsta\n\ntry:\n    seteaza_varsta(-5)\nexcept VarstaInvalida as e:\n    print(e)  # Vârsta -5 e negativă!\n    print(e.varsta)  # -5\n\n# Context manager excepții\nfrom contextlib import suppress\nwith suppress(FileNotFoundError):\n    open('lipseste.txt')\n# Ignoră excepția în mod elegant\n```" },
    ],
    tasks: [
      { number: 1, name: "else try", question: "Când rulează blocul else din try/except/else?", options: ["Mereu", "Doar dacă NU s-a ridicat nicio excepție", "Mereu la final", "La eroare"], answer: "Doar dacă NU s-a ridicat nicio excepție", explanation: "else = succes. finally = mereu (chiar și la excepție).", difficulty: "medium" },
      { number: 2, name: "except multiple", question: "Cum prinzi mai multe tipuri de excepții?", options: ["except ValueError | TypeError", "except (ValueError, TypeError):", "except ValueError except TypeError", "Separat"], answer: "except (ValueError, TypeError):", explanation: "Tuple de tipuri în except. Sau excepție de bază: except Exception (prinde toate).", difficulty: "medium" },
      { number: 3, name: "custom exception", question: "Cum creezi o excepție custom?", options: ["class X:", "class X(Exception):", "def exception():", "raise class"], answer: "class X(Exception):", explanation: "Moștenești din Exception sau o subclasă. Poți adăuga atribute/mesaje custom.", difficulty: "medium" },
      { number: 4, name: "finally", question: "Finally rulează dacă există excepție neprinsă?", options: ["Nu", "Da — mereu, chiar și la excepție neprecizată", "Opțional", "Random"], answer: "Da — mereu, chiar și la excepție neprecizată", explanation: "Util pentru cleanup (close file, release lock). Rulează chiar și dacă return în try.", difficulty: "hard" },
    ],
  },
  {
    slug: "python-file-io",
    title: "26. Fișiere (I/O)",
    order: 26,
    theory: [
      { order: 1, title: "Citire și scriere fișiere", content: "```python\n# Deschidere cu context manager (auto-close)\nwith open('fisier.txt', 'r', encoding='utf-8') as f:\n    continut = f.read()        # tot textul\n\nwith open('fisier.txt', 'r') as f:\n    linii = f.readlines()      # list de linii\n    for linie in f:            # sau iterează direct\n        print(linie.strip())\n\n# Scriere\nwith open('out.txt', 'w', encoding='utf-8') as f:\n    f.write('Linia 1\\n')\n    f.writelines(['L2\\n', 'L3\\n'])\n\n# Append\nwith open('log.txt', 'a') as f:\n    f.write('Eveniment nou\\n')\n```\n\n**Moduri:** 'r' (read), 'w' (write), 'a' (append), 'rb'/'wb' (binary)" },
      { order: 2, title: "JSON și CSV", content: "```python\nimport json\nimport csv\n\n# JSON\ndata = {'name': 'Cristi', 'age': 25}\nwith open('data.json', 'w') as f:\n    json.dump(data, f, indent=2)\n\nwith open('data.json') as f:\n    loaded = json.load(f)\n\n# String JSON\ns = json.dumps(data)       # dict → string\nd = json.loads('{\"a\":1}')  # string → dict\n\n# CSV\nwith open('data.csv', 'w', newline='') as f:\n    writer = csv.DictWriter(f, fieldnames=['name','age'])\n    writer.writeheader()\n    writer.writerow({'name': 'Ana', 'age': 20})\n\nwith open('data.csv') as f:\n    reader = csv.DictReader(f)\n    for row in reader:\n        print(row)  # {'name': 'Ana', 'age': '20'}\n```" },
    ],
    tasks: [
      { number: 1, name: "with open", question: "De ce folosești with open() în loc de open()?", options: ["Stil", "Context manager — închide automat fișierul chiar dacă apare eroare", "Mai rapid", "Obligatoriu"], answer: "Context manager — închide automat fișierul chiar dacă apare eroare", explanation: "Fără with, dacă apare excepție, fișierul rămâne deschis (memory leak, file lock).", difficulty: "medium" },
      { number: 2, name: "write mode", question: "Ce face modul 'w' la scriere?", options: ["Append", "Suprascrie fișierul existent (sau creează dacă lipsește)", "Read-write", "Binary"], answer: "Suprascrie fișierul existent (sau creează dacă lipsește)", explanation: "'a' = append (adaugă la final). 'w' = șterge conținutul și rescrie.", difficulty: "easy" },
      { number: 3, name: "json.dumps", question: "Diferența json.dump vs json.dumps?", options: ["Identice", "dump = în fișier; dumps = în string (s = string)", "dumps mai vechi", "Random"], answer: "dump = în fișier; dumps = în string (s = string)", explanation: "load/dump = fișier. loads/dumps = string. Convenție din librăria standard.", difficulty: "medium" },
      { number: 4, name: "readline", question: "f.readlines() vs iterare directă pe f?", options: ["Identice", "readlines() = tot în memorie; iterare = linie cu linie (eficient)", "readlines mai rapid", "Eroare"], answer: "readlines() = tot în memorie; iterare = linie cu linie (eficient)", explanation: "Pentru fișiere mari (GB): iterare directă pe obiect file e mai eficientă.", difficulty: "hard" },
    ],
  },
  {
    slug: "python-modules-packages",
    title: "27. Module și pachete",
    order: 27,
    theory: [
      { order: 1, title: "Import-uri", content: "```python\n# Import complet\nimport math\nprint(math.sqrt(16))  # 4.0\n\n# Import specific\nfrom math import sqrt, pi\nprint(sqrt(16))  # 4.0\n\n# Alias\nimport numpy as np  # convenție standard\nfrom datetime import datetime as dt\n\n# Import tot (evită în producție)\nfrom math import *  # poluează namespace\n\n# Import condiționat\ntry:\n    import ujson as json  # mai rapid\nexcept ImportError:\n    import json  # fallback\n\n# Relative import (în pachete)\nfrom . import utils\nfrom ..models import User\n```" },
      { order: 2, title: "Crearea unui pachet", content: "```\nproject/\n  mypackage/\n    __init__.py      # marchetă pachetul\n    utils.py\n    models.py\n    helpers/\n      __init__.py\n      string_utils.py\n  main.py\n```\n\n```python\n# __init__.py poate expune API public\nfrom .utils import helper_func\nfrom .models import User\n\n# main.py\nfrom mypackage import helper_func, User\nfrom mypackage.helpers.string_utils import slug_ify\n```\n\n**`__name__ == '__main__'`:**\n```python\n# utils.py — cod de test\nif __name__ == '__main__':\n    # rulează doar dacă scriptul e executat direct, nu importat\n    print('Testing...')\n```" },
    ],
    tasks: [
      { number: 1, name: "from import", question: "from math import sqrt face ce?", options: ["Importă math", "Importă DOAR sqrt din math, fără prefixul math.", "Eroare", "Override sqrt"], answer: "Importă DOAR sqrt din math, fără prefixul math.", explanation: "Poți apela sqrt(4) direct. math.sqrt() rămâne inaccesibil (unless 'import math' separat).", difficulty: "easy" },
      { number: 2, name: "__init__.py", question: "Ce rol are __init__.py?", options: ["Inițializare DB", "Marchează directorul ca pachet Python + controlează API public", "Config", "Cache"], answer: "Marchează directorul ca pachet Python + controlează API public", explanation: "Poate fi gol sau poate expune simboluri: from .module import func.", difficulty: "medium" },
      { number: 3, name: "__name__", question: "Când e __name__ == '__main__' True?", options: ["Mereu", "Doar când scriptul e rulat direct (nu importat)", "La import", "Niciodată"], answer: "Doar când scriptul e rulat direct (nu importat)", explanation: "Pattern clasic pentru cod de test la finalul fișierului.", difficulty: "medium" },
      { number: 4, name: "import *", question: "De ce eviți from module import *?", options: ["E lent", "Poluează namespace — nu știi de unde vine fiecare funcție", "E ilegal", "Bug"], answer: "Poluează namespace — nu știi de unde vine fiecare funcție", explanation: "Poate suprascrie funcții cu același nume. În cod de producție = antipattern.", difficulty: "medium" },
    ],
  },
  {
    slug: "python-virtual-env",
    title: "28. Virtual environments și pip",
    order: 28,
    theory: [
      { order: 1, title: "Venv și pip", content: "```bash\n# Creare virtual environment\npython -m venv venv\n\n# Activare\nsource venv/bin/activate   # Linux/Mac\nvenv\\Scripts\\activate      # Windows\n\n# Dezactivare\ndeactivate\n\n# Instalare pachete\npip install requests\npip install requests==2.28.0  # versiune specifică\npip install -r requirements.txt\n\n# Salvare dependențe\npip freeze > requirements.txt\n\n# Lista pachete instalate\npip list\npip show requests\n\n# Upgrade\npip install --upgrade requests\n```\n\n**De ce venv?** Fiecare proiect are versiunile lui de pachete — fără conflicte." },
      { order: 2, title: "pyproject.toml și modern tools", content: "```toml\n# pyproject.toml (modern — PEP 517/518)\n[project]\nname = \"my-app\"\nversion = \"0.1.0\"\ndependencies = [\n    \"requests>=2.28\",\n    \"fastapi>=0.100\",\n]\n\n[project.optional-dependencies]\ndev = [\"pytest\", \"black\", \"ruff\"]\n```\n\n**Instrumente moderne:**\n• **pipx** — instalare tools global fără a polua venv\n• **uv** — alternativă ultra-rapidă la pip\n• **Poetry** — management complet (dep, build, publish)\n• **hatch** — alternativă la Poetry\n\n```bash\nuv pip install requests  # mult mai rapid\npipx install black\n```" },
    ],
    tasks: [
      { number: 1, name: "venv scop", question: "De ce folosești virtual environment?", options: ["Decorativ", "Izolează dependențele per proiect — fără conflicte versiuni", "Obligatoriu", "Cache"], answer: "Izolează dependențele per proiect — fără conflicte între versiuni", explanation: "Proiect A: requests 2.28, Proiect B: requests 2.30 — venv separat rezolvă.", difficulty: "easy" },
      { number: 2, name: "pip freeze", question: "La ce e bun pip freeze?", options: ["Înghață procesul", "Salvează lista exactă a pachetelor instalate (requirements.txt)", "Backup", "Cache"], answer: "Salvează lista exactă a pachetelor instalate (requirements.txt)", explanation: "pip freeze > requirements.txt. Alt dev face pip install -r requirements.txt.", difficulty: "easy" },
      { number: 3, name: "activate Windows", question: "Cum activezi venv pe Windows?", options: ["source venv/activate", "venv\\Scripts\\activate", "./venv activate", "venv on"], answer: "venv\\Scripts\\activate", explanation: "Linux/Mac: source venv/bin/activate. Windows: venv\\Scripts\\activate.", difficulty: "medium" },
      { number: 4, name: "uv", question: "Ce e uv?", options: ["UV light", "Alternativă ultra-rapidă la pip scrisă în Rust", "Virtual env tool", "Python version manager"], answer: "Alternativă ultra-rapidă la pip scrisă în Rust", explanation: "uv e noul standard — 10-100x mai rapid ca pip. Creat de Astral (autorii Ruff).", difficulty: "hard" },
    ],
  },
  {
    slug: "python-generators-iterators",
    title: "29. Generatoare și iteratoare",
    order: 29,
    theory: [
      { order: 1, title: "Generatoare cu yield", content: "```python\n# Funcție generator — lazy\ndef numara(n):\n    i = 0\n    while i < n:\n        yield i  # suspendă și returnează\n        i += 1\n\ngen = numara(5)\nprint(next(gen))  # 0\nprint(next(gen))  # 1\nfor x in gen:     # continuă de unde a rămas\n    print(x)  # 2, 3, 4\n\n# Fibonacci infinit\ndef fib():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\nfrom itertools import islice\nprint(list(islice(fib(), 10)))  # [0,1,1,2,3,5,8,13,21,34]\n```" },
      { order: 2, title: "Iteratoare custom", content: "```python\n# Protocol iterator: __iter__ și __next__\nclass Interval:\n    def __init__(self, start, stop, step=1):\n        self.current = start\n        self.stop = stop\n        self.step = step\n\n    def __iter__(self):\n        return self  # obiectul e propriul iterator\n\n    def __next__(self):\n        if self.current >= self.stop:\n            raise StopIteration\n        val = self.current\n        self.current += self.step\n        return val\n\nfor x in Interval(0, 10, 2):\n    print(x)  # 0, 2, 4, 6, 8\n```" },
    ],
    tasks: [
      { number: 1, name: "yield", question: "Ce face yield în funcție?", options: ["Return permanent", "Suspendă funcția și returnează valoarea, continuând la next()", "Aruncă excepție", "Break"], answer: "Suspendă funcția și returnează valoarea, continuând la next()", explanation: "yield creează un generator. Starea funcției e salvată între apeluri.", difficulty: "medium" },
      { number: 2, name: "lazy", question: "De ce generatoarele sunt mai eficiente decât listele?", options: ["Nu sunt", "Calculează un element la un moment dat — nu consumă memorie", "Mai rapide", "Thread-safe"], answer: "Calculează un element la un moment dat — nu consumă memorie", explanation: "range(1_000_000) nu ocupă memorie. list(range(1_000_000)) = 8MB+.", difficulty: "medium" },
      { number: 3, name: "StopIteration", question: "Ce excepție semnalizează sfârșit de iterator?", options: ["EndOfIterator", "StopIteration", "IndexError", "ValueError"], answer: "StopIteration", explanation: "for loop prinde automat StopIteration și se oprește. next() aruncă explicit.", difficulty: "medium" },
      { number: 4, name: "generator vs iterator", question: "Diferența?", options: ["Identice", "Generatorul e o funcție cu yield; iteratorul = orice obiect cu __iter__/__next__", "Iterator mai vechi", "Bug"], answer: "Generatorul e o funcție cu yield; iteratorul = orice obiect cu __iter__/__next__", explanation: "Generatoarele produc iteratoare automat. Alternativa e să implementezi protocolul manual.", difficulty: "hard" },
    ],
  },
  {
    slug: "python-context-managers",
    title: "30. Context managers (with)",
    order: 30,
    theory: [
      { order: 1, title: "Protocol __enter__/__exit__", content: "```python\nclass DatabaseConnection:\n    def __init__(self, host):\n        self.host = host\n        self.conn = None\n\n    def __enter__(self):\n        self.conn = connect(self.host)\n        return self.conn\n\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        self.conn.close()\n        # Returnează False (default) = propagă excepția\n        # Returnează True = suprimă excepția\n        return False\n\nwith DatabaseConnection('localhost') as conn:\n    conn.query('SELECT ...')\n# conn.close() apelat automat\n```" },
      { order: 2, title: "contextlib", content: "```python\nfrom contextlib import contextmanager, suppress\n\n# Context manager din generator\n@contextmanager\ndef timer():\n    import time\n    start = time.time()\n    try:\n        yield  # corpul with rulează aici\n    finally:\n        print(f'{time.time()-start:.3f}s')\n\nwith timer():\n    time.sleep(1)  # '1.001s'\n\n# Suppress excepții\nwith suppress(FileNotFoundError):\n    open('missing.txt')\n\n# Multiple context managers\nwith open('in.txt') as fin, open('out.txt', 'w') as fout:\n    fout.write(fin.read())\n```" },
    ],
    tasks: [
      { number: 1, name: "__enter__ return", question: "Ce returnează __enter__?", options: ["None mereu", "Valoarea care primește 'as' din with statement", "Bool", "Self"], answer: "Valoarea care primește 'as' din with statement", explanation: "with open('f') as f: — f = ce returnează open().__enter__().", difficulty: "medium" },
      { number: 2, name: "cleanup guarantee", question: "E garantat că __exit__ se apelează?", options: ["Nu, la excepție nu", "Da — chiar dacă bloc aruncă excepție", "Doar la succes", "Opțional"], answer: "Da — chiar dacă bloc aruncă excepție", explanation: "Asta e valoarea principală: cleanup garantat. Asemănător try/finally.", difficulty: "medium" },
      { number: 3, name: "@contextmanager", question: "Ce face @contextmanager pe o funcție cu yield?", options: ["Loop", "Transformă funcția într-un context manager (yield = with body)", "Decorator clasic", "Eroare"], answer: "Transformă funcția într-un context manager (yield = with body)", explanation: "Simplifică crearea fără clasă. yield delimitează locul unde rulează blocul with.", difficulty: "hard" },
      { number: 4, name: "suppress", question: "Ce face suppress(FileNotFoundError)?", options: ["Raise", "Ignoră elegant excepția specificată fără try/except", "Log", "Print"], answer: "Ignoră elegant excepția specificată fără try/except", explanation: "Alternativă curată la try: ... except FileNotFoundError: pass.", difficulty: "medium" },
    ],
  },
  {
    slug: "python-dataclasses",
    title: "31. Dataclasses și typing",
    order: 31,
    theory: [
      { order: 1, title: "@dataclass", content: "```python\nfrom dataclasses import dataclass, field\nfrom typing import Optional\n\n@dataclass\nclass Produs:\n    nume: str\n    pret: float\n    cantitate: int = 0\n    tags: list[str] = field(default_factory=list)\n    _id: int = field(default=0, repr=False)\n\n    @property\n    def total(self):\n        return self.pret * self.cantitate\n\np = Produs('Laptop', 3000.0, 2)\nprint(p)       # Produs(nume='Laptop', pret=3000.0, cantitate=2, tags=[])\nprint(p.total) # 6000.0\n```\n\n**Generează automat:** `__init__`, `__repr__`, `__eq__`." },
      { order: 2, title: "Type hints (typing)", content: "```python\nfrom typing import Optional, Union, Any\n\ndef salut(name: str, times: int = 1) -> str:\n    return ('Salut, ' + name + '! ') * times\n\n# Python 3.10+ — mai simplu\ndef procesa(val: int | float | None) -> list[str]:\n    pass\n\n# TypeAlias\ntype Matrix = list[list[int]]\n\n# TypedDict\nfrom typing import TypedDict\nclass Config(TypedDict):\n    host: str\n    port: int\n    debug: bool\n\n# Protocol (structural typing)\nfrom typing import Protocol\nclass Closeable(Protocol):\n    def close(self) -> None: ...\n```\n\n**Note:** type hints = informaționale, nu executate runtime (fără mypy/pyright)." },
    ],
    tasks: [
      { number: 1, name: "@dataclass", question: "Ce generează @dataclass automat?", options: ["Nimic", "__init__, __repr__, __eq__ din fields definite", "Baza de date", "JSON"], answer: "__init__, __repr__, __eq__ din fields definite", explanation: "Elimină boilerplate. Ai și opțiuni: @dataclass(frozen=True) pentru imutabile.", difficulty: "medium" },
      { number: 2, name: "field default_factory", question: "De ce field(default_factory=list) și nu default=[]?", options: ["Sintaxă", "[] e mutable shared — default_factory creează instanță nouă per obiect", "Eroare", "Performanță"], answer: "[] e mutable shared — default_factory creează instanță nouă per obiect", explanation: "Bug clasic Python: parametru default mutable e shared între toate instanțele.", difficulty: "hard" },
      { number: 3, name: "type hints runtime", question: "Type hints opresc erori runtime?", options: ["Da, automat", "Nu — sunt doar informaționale (nevoie de mypy/pyright)", "Doar în debug", "La import"], answer: "Nu — doar informaționale (nevoie de mypy/pyright)", explanation: "Python nu execută type checks. Static checkers (mypy) le verifică la dev time.", difficulty: "medium" },
      { number: 4, name: "TypedDict", question: "Ce e TypedDict?", options: ["Dict mai rapid", "Dict cu tipuri definite pe chei (type checking)", "Dict nou", "Class"], answer: "Dict cu tipuri definite pe chei (type checking)", explanation: "TypedDict permite type checking pe dicționare cu structură fixă. Util pentru JSON API responses.", difficulty: "hard" },
    ],
  },
  {
    slug: "python-async-await",
    title: "32. Async/await — programare asincronă",
    order: 32,
    theory: [
      { order: 1, title: "Bazele async", content: "```python\nimport asyncio\n\nasync def fetch(url):\n    await asyncio.sleep(1)  # simulează I/O\n    return f'Data from {url}'\n\nasync def main():\n    # Secvențial: 3 secunde\n    r1 = await fetch('url1')\n    r2 = await fetch('url2')\n    r3 = await fetch('url3')\n\n    # Paralel: 1 secundă!\n    r1, r2, r3 = await asyncio.gather(\n        fetch('url1'),\n        fetch('url2'),\n        fetch('url3')\n    )\n    print(r1, r2, r3)\n\nasyncio.run(main())\n```" },
      { order: 2, title: "aiohttp și patterns", content: "```python\nimport aiohttp\nimport asyncio\n\nasync def fetch_json(session, url):\n    async with session.get(url) as response:\n        return await response.json()\n\nasync def main():\n    async with aiohttp.ClientSession() as session:\n        urls = ['https://api.x.com/1', 'https://api.x.com/2']\n        tasks = [fetch_json(session, url) for url in urls]\n        results = await asyncio.gather(*tasks)\n        for r in results:\n            print(r)\n\nasyncio.run(main())\n```\n\n**Când async?** I/O bound: rețea, disk. CPU bound → multiprocessing mai bun." },
    ],
    tasks: [
      { number: 1, name: "async def", question: "Ce returnează o funcție async?", options: ["Valoarea direct", "Un coroutine object (nevoie de await sau asyncio.run)", "Thread", "Future"], answer: "Un coroutine object (nevoie de await sau asyncio.run)", explanation: "Apelarea funcției async nu o rulează — creează coroutine. Rulezi cu await sau asyncio.run.", difficulty: "medium" },
      { number: 2, name: "asyncio.gather", question: "Ce face asyncio.gather?", options: ["Collect", "Rulează mai multe coroutine SIMULTAN și așteaptă toate", "Sequential", "Thread pool"], answer: "Rulează mai multe coroutine SIMULTAN și așteaptă toate", explanation: "Dacă fiecare durează 1s, gather cu 3 = 1s total (nu 3s).", difficulty: "medium" },
      { number: 3, name: "await", question: "Poți await în funcție normală (non-async)?", options: ["Da", "Nu — await merge doar în funcții async def", "Cu import", "Cu @decorator"], answer: "Nu — await merge doar în funcții async def", explanation: "SyntaxError dacă încerci. Trebuie să 'infectezi' caller-ul cu async tot lanțul.", difficulty: "easy" },
      { number: 4, name: "io vs cpu", question: "Async e mai rapid decât sync mereu?", options: ["Da", "Doar pentru I/O bound (rețea, disk). CPU bound → multiprocessing", "Nu", "Random"], answer: "Doar pentru I/O bound (rețea, disk). CPU bound → multiprocessing", explanation: "asyncio = single thread cu event loop. CPU intensiv blochează tot. GIL problem.", difficulty: "hard" },
    ],
  },
  {
    slug: "python-regex",
    title: "33. Regular Expressions (regex)",
    order: 33,
    theory: [
      { order: 1, title: "Bazele re", content: "```python\nimport re\n\ntext = 'Email: user@example.com, Tel: 0712 345 678'\n\n# search — primul match\nm = re.search(r'\\d{4}\\s\\d{3}\\s\\d{3}', text)\nif m:\n    print(m.group())  # '0712 345 678'\n    print(m.start(), m.end())  # pozițiile\n\n# findall — toate match-urile\nemails = re.findall(r'[\\w.-]+@[\\w.-]+\\.\\w+', text)\nprint(emails)  # ['user@example.com']\n\n# sub — înlocuire\nrezultat = re.sub(r'\\d', '*', text)\n# 'Email: user@example.com, Tel: **** *** ***'\n\n# split\nre.split(r'[,;\\s]+', 'a, b; c  d')\n# ['a', 'b', 'c', 'd']\n```" },
      { order: 2, title: "Grupuri și flags", content: "```python\n# Grupuri cu ()\npattern = r'(\\d{4})-(\\d{2})-(\\d{2})'\nm = re.search(pattern, 'Data: 2026-05-11')\nif m:\n    print(m.group(0))   # '2026-05-11' (full)\n    print(m.group(1))   # '2026' (an)\n    print(m.groups())   # ('2026', '05', '11')\n\n# Named groups\npattern = r'(?P<an>\\d{4})-(?P<luna>\\d{2})'\nm = re.search(pattern, '2026-05')\nprint(m.group('an'))    # '2026'\n\n# Compile (eficient la refolosire)\npattern = re.compile(r'\\d+', re.IGNORECASE | re.MULTILINE)\n\n# Lookahead/lookbehind\nre.findall(r'(?<=@)\\w+(?=\\.)', 'user@example.com')\n# ['example']\n```" },
    ],
    tasks: [
      { number: 1, name: "findall", question: "Ce returnează re.findall?", options: ["Primul match", "Lista de toate string-urile care se potrivesc", "Bool", "Iterator"], answer: "Lista de toate string-urile care se potrivesc", explanation: "findall = toți. search = primul (ca obiect Match). match = doar la început.", difficulty: "easy" },
      { number: 2, name: "raw string", question: "De ce r'\\d+' în loc de '\\d+'?", options: ["Identice", "Raw string: backslash e literal, nu escape character", "Obligatoriu", "Performanță"], answer: "Raw string: backslash e literal, nu escape character", explanation: "'\\n' = newline. r'\\n' = doi caractere: backslash și n. Regex folosesc \\ des.", difficulty: "medium" },
      { number: 3, name: "group(1)", question: "Ce face m.group(1)?", options: ["Primul caracter", "Conținutul primului grup de paranteze din pattern", "Al doilea match", "Index"], answer: "Conținutul primului grup de paranteze din pattern", explanation: "Grupuri = () în pattern. group(0) = full match, group(1) = primul grup.", difficulty: "medium" },
      { number: 4, name: "re.sub", question: "Ce face re.sub(r'\\d', '*', text)?", options: ["Search", "Înlocuiește toate cifrele cu *", "Delete", "Split"], answer: "Înlocuiește toate cifrele cu *", explanation: "sub(pattern, replacement, string). Al 3-lea arg = count (opțional, default=0 = tot).", difficulty: "easy" },
    ],
  },
  {
    slug: "python-testing",
    title: "34. Testing cu pytest",
    order: 34,
    theory: [
      { order: 1, title: "pytest basics", content: "```bash\npip install pytest\npytest  # autodescoperire fișiere test_*.py\n```\n\n```python\n# test_calculator.py\ndef add(a, b): return a + b\ndef divide(a, b):\n    if b == 0: raise ValueError('Împărțire la 0')\n    return a / b\n\ndef test_add():\n    assert add(2, 3) == 5\n    assert add(-1, 1) == 0\n\ndef test_divide():\n    assert divide(10, 2) == 5.0\n\ndef test_divide_zero():\n    import pytest\n    with pytest.raises(ValueError, match='Împărțire la 0'):\n        divide(5, 0)\n\n# Parametrizare\nimport pytest\n@pytest.mark.parametrize('a,b,expected', [\n    (2, 3, 5), (-1, 1, 0), (0, 0, 0)\n])\ndef test_add_parametrize(a, b, expected):\n    assert add(a, b) == expected\n```" },
      { order: 2, title: "Fixtures și mocking", content: "```python\nimport pytest\n\n@pytest.fixture\ndef db():\n    conn = create_test_db()\n    yield conn          # setup\n    conn.cleanup()      # teardown (după test)\n\ndef test_insert(db):\n    db.insert({'name': 'Ana'})\n    assert db.count() == 1\n\n# Mock cu pytest-mock\ndef test_api(mocker):\n    mock = mocker.patch('requests.get')\n    mock.return_value.json.return_value = {'data': 'test'}\n    result = fetch_data()\n    assert result == {'data': 'test'}\n```" },
    ],
    tasks: [
      { number: 1, name: "assert", question: "pytest verifică cu?", options: ["self.assertEqual", "assert nativ Python", "verify()", "check()"], answer: "assert nativ Python", explanation: "pytest rescrie assert la introspection — mesaje de eroare mai clare decât unittest.", difficulty: "easy" },
      { number: 2, name: "pytest.raises", question: "Cum testezi că funcția aruncă excepție?", options: ["try/except", "with pytest.raises(ExceptionType):", "assert raises", "check(exception)"], answer: "with pytest.raises(ExceptionType):", explanation: "Context manager care verifică că excepția e aruncată. Fail dacă nu e aruncată.", difficulty: "easy" },
      { number: 3, name: "@fixture", question: "Ce e un pytest fixture?", options: ["Mock", "Funcție care pregătește date/resurse pentru teste (setup/teardown)", "Decorator fix", "Skip"], answer: "Funcție care pregătește date/resurse pentru teste (setup/teardown)", explanation: "yield = setup înainte, cleanup după. Injectat automat în parametrii testelor.", difficulty: "medium" },
      { number: 4, name: "@parametrize", question: "Avantajul @pytest.mark.parametrize?", options: ["Skip test", "Rulezi același test cu input-uri diferite fără duplicare cod", "Speed", "Mark"], answer: "Rulezi același test cu input-uri diferite fără duplicare cod", explanation: "Un test, N cazuri. Fiecare e raportat separat în output.", difficulty: "medium" },
    ],
  },
  {
    slug: "python-stdlib-useful",
    title: "35. Librăria standard — unelte utile",
    order: 35,
    theory: [
      { order: 1, title: "collections, itertools", content: "```python\nfrom collections import Counter, defaultdict, deque, OrderedDict\n\n# Counter — frecvențe\nc = Counter('abracadabra')\nprint(c.most_common(3))  # [('a',5),('b',2),('r',2)]\n\n# defaultdict — valoare default pt cheie lipsă\nwords = defaultdict(list)\nfor i, w in enumerate(['a','b','a']):\n    words[w].append(i)\n# {'a': [0,2], 'b': [1]}\n\n# deque — coadă eficientă\nq = deque(maxlen=3)\nfor i in range(5):\n    q.append(i)  # [2,3,4] — autorotire\n\n# itertools\nfrom itertools import chain, product, combinations\nlist(chain([1,2],[3,4]))     # [1,2,3,4]\nlist(product([1,2],[3,4]))   # [(1,3),(1,4),(2,3),(2,4)]\nlist(combinations([1,2,3],2))# [(1,2),(1,3),(2,3)]\n```" },
      { order: 2, title: "datetime, pathlib, os", content: "```python\nfrom datetime import datetime, timedelta, date\nfrom pathlib import Path\nimport os\n\n# datetime\nnow = datetime.now()\nprint(now.strftime('%d %B %Y'))  # '11 May 2026'\nd = datetime.strptime('2026-05-11', '%Y-%m-%d')\nmaine = now + timedelta(days=1)\n\n# pathlib — modern os.path\np = Path('fisier.txt')\nprint(p.name, p.suffix, p.parent)\np.write_text('salut')\np.read_text()\nfor f in Path('.').glob('*.py'):\n    print(f)\n\n# os\nos.environ.get('PATH')\nos.getcwd()\nos.makedirs('dir/sub', exist_ok=True)\n```" },
    ],
    tasks: [
      { number: 1, name: "Counter", question: "Ce face Counter('hello')?", options: ["Lungime", "Dict cu frecvențele fiecărui caracter", "Set", "Sort"], answer: "Dict cu frecvențele fiecărui caracter", explanation: "Counter({'l':2,'h':1,'e':1,'o':1}). Funcționează cu orice iterable.", difficulty: "easy" },
      { number: 2, name: "defaultdict", question: "Avantajul defaultdict față de dict?", options: ["Mai rapid", "Nu ridică KeyError — crează valoare default automat", "Thread-safe", "Sort"], answer: "Nu ridică KeyError — crează valoare default automat", explanation: "defaultdict(list) la acces cheie inexistentă returnează [] și o adaugă.", difficulty: "medium" },
      { number: 3, name: "pathlib", question: "De ce pathlib > os.path?", options: ["Nu e mai bun", "OOP, cross-platform, mai lizibil: p / 'subdir' / 'file.txt'", "Mai rapid", "Obligatoriu"], answer: "OOP, cross-platform, mai lizibil: p / 'subdir' / 'file.txt'", explanation: "Operatorul / funcționează pe Windows și Linux. p.stem, p.suffix, p.parent etc.", difficulty: "medium" },
      { number: 4, name: "strftime", question: "Ce face datetime.now().strftime('%Y-%m-%d')?", options: ["Parse", "Formatează datetime ca string '2026-05-11'", "Create", "Timezone"], answer: "Formatează datetime ca string '2026-05-11'", explanation: "strftime = string format time. strptime = string parse time (invers).", difficulty: "medium" },
    ],
  },
  {
    slug: "python-web-requests",
    title: "36. Web scraping și requests",
    order: 36,
    theory: [
      { order: 1, title: "requests", content: "```python\nimport requests\n\n# GET request\nr = requests.get('https://jsonplaceholder.typicode.com/posts/1')\nprint(r.status_code)  # 200\nprint(r.json())        # dict\nprint(r.text)          # string brut\n\n# Cu parametri\nr = requests.get('https://api.x.com/search', params={'q': 'python', 'n': 5})\n# URL: .../search?q=python&n=5\n\n# POST\nr = requests.post('https://api.x.com/users',\n    json={'name': 'Cristi', 'email': 'c@x.ro'},\n    headers={'Authorization': 'Bearer TOKEN'}\n)\n\n# Session (reutilizare connection)\nwith requests.Session() as s:\n    s.headers.update({'Authorization': 'Bearer TOKEN'})\n    r1 = s.get('/api/data1')\n    r2 = s.get('/api/data2')\n```" },
      { order: 2, title: "BeautifulSoup scraping", content: "```python\nfrom bs4 import BeautifulSoup\nimport requests\n\nr = requests.get('https://example.com')\nsoup = BeautifulSoup(r.text, 'html.parser')\n\n# Selectori CSS\ntitre = soup.select_one('h1').text\nlinks = soup.select('a[href]')\nfor link in links:\n    print(link['href'], link.text)\n\n# Navigare\nbody = soup.find('body')\ndivs = soup.find_all('div', class_='card')\nfor div in divs:\n    h3 = div.find('h3')\n    if h3: print(h3.text)\n```" },
    ],
    tasks: [
      { number: 1, name: "r.json()", question: "Ce face r.json() pe un response requests?", options: ["Str", "Parsează body JSON ca dict/list Python", "File", "Bytes"], answer: "Parsează body JSON ca dict/list Python", explanation: "Echivalent cu json.loads(r.text). Aruncă eroare dacă body nu e JSON valid.", difficulty: "easy" },
      { number: 2, name: "params", question: "Cum adaugi query params la requests.get()?", options: ["URL manual", "params={'key': 'value'} argument", "query=", "?key=value URL"], answer: "params={'key': 'value'} argument", explanation: "requests construiește URL-ul automat. Tratează encoding special chars.", difficulty: "easy" },
      { number: 3, name: "Session", question: "Când folosești requests.Session?", options: ["Mereu", "Când faci multiple request-uri cu aceleași headers/cookies", "Una singură", "Auth"], answer: "Când faci multiple request-uri cu aceleași headers/cookies", explanation: "Session reutilizează conexiunile TCP (performanță) și menține cookies.", difficulty: "medium" },
      { number: 4, name: "beautiful soup", question: "soup.select_one('h1') returnează?", options: ["String", "Primul element h1 (Tag object) sau None", "List", "Bool"], answer: "Primul element h1 (Tag object) sau None", explanation: "select_one = primul. select = toate (list). find() = echivalent select_one.", difficulty: "medium" },
    ],
  },
  {
    slug: "python-type-annotations-modern",
    title: "37. Python modern (3.10-3.13)",
    order: 37,
    theory: [
      { order: 1, title: "Match statement (3.10)", content: "```python\n# Pattern matching — mai puternic decât if/elif\ncomand = {'action': 'move', 'x': 5, 'y': 3}\n\nmatch comand:\n    case {'action': 'move', 'x': x, 'y': y}:\n        print(f'Move to {x},{y}')\n    case {'action': 'fire', 'direction': d}:\n        print(f'Fire {d}')\n    case {'action': action}:\n        print(f'Unknown: {action}')\n    case _:\n        print('Invalid command')\n\n# Match pe tipuri\ndef describe(val):\n    match val:\n        case int() | float(): return 'number'\n        case str(): return 'string'\n        case list(): return 'list'\n        case _: return 'other'\n```" },
      { order: 2, title: "Noi features 3.11-3.13", content: "```python\n# 3.11: ExceptionGroup\ntry:\n    raise ExceptionGroup('errors', [\n        ValueError('bad value'),\n        TypeError('wrong type')\n    ])\nexcept* ValueError as eg:\n    print(eg.exceptions)  # [ValueError(...)]\n\n# 3.11: tomllib\nimport tomllib\nwith open('pyproject.toml', 'rb') as f:\n    config = tomllib.load(f)\n\n# 3.12: type alias\ntype Vector = list[float]\n\n# 3.13: uv este default pip mai rapid\n# 3.13: Improved error messages\n# 3.12+: @override decorator\nfrom typing import override\nclass Child(Parent):\n    @override\n    def method(self): ...\n```" },
    ],
    tasks: [
      { number: 1, name: "match statement", question: "Match statement e echivalentul mai puternic al?", options: ["Ternary", "if/elif lanțuit cu pattern matching", "for loop", "try/except"], answer: "if/elif lanțuit cu pattern matching", explanation: "Destructurare în case, pattern matching pe structuri. Mult mai expresiv.", difficulty: "medium" },
      { number: 2, name: "case _", question: "Ce e case _ în match?", options: ["Eroare", "Wildcard — prinde orice (default/else)", "Variable _", "Skip"], answer: "Wildcard — prinde orice (default/else)", explanation: "case _ = default. Convenție să fie ultimul.", difficulty: "easy" },
      { number: 3, name: "type alias", question: "Ce face type Vector = list[float]?", options: ["Creeaza clasă", "Alias de tip (Python 3.12) — Vector e sinonim cu list[float]", "Variabilă", "Class"], answer: "Alias de tip (Python 3.12) — Vector e sinonim cu list[float]", explanation: "Mai clar decât Vector = list[float] (v3.9). Noul keyword type creează TypeAlias.", difficulty: "hard" },
      { number: 4, name: "@override", question: "Ce face @override (3.12)?", options: ["Cache", "Marchează că metoda suprascrie una din clasă-părintele (static check)", "Async", "Lock"], answer: "Marchează că metoda suprascrie una din clasă-părintele (static check)", explanation: "Mypy/pyright avertizează dacă metoda nu există în clasa de bază.", difficulty: "hard" },
    ],
  },
  {
    slug: "python-debugging",
    title: "38. Debugging și profiling",
    order: 38,
    theory: [
      { order: 1, title: "pdb și breakpoint()", content: "```python\n# Python 3.7+ — breakpoint() built-in\ndef functie(x):\n    y = x * 2\n    breakpoint()  # oprire în debugger\n    return y + 1\n\n# Comenzi pdb:\n# n = next (pasul următor)\n# s = step into (intră în funcție)\n# c = continue\n# l = list (cod curent)\n# p variabila = print variabila\n# pp = pretty-print\n# b 5 = breakpoint la linia 5\n# q = quit\n\n# Variabile de mediu:\n# PYTHONBREAKPOINT=0  → dezactivează\n# PYTHONBREAKPOINT=IPython.embed → IPython\n```" },
      { order: 2, title: "cProfile și timeit", content: "```python\nimport cProfile\nimport pstats\n\n# Profil performanță\ncProfile.run('functie_lenta()', 'profile_output')\nstats = pstats.Stats('profile_output')\nstats.sort_stats('cumulative')\nstats.print_stats(10)  # top 10 funcții lente\n\n# timeit — măsoară timp execuție\nimport timeit\n\nt1 = timeit.timeit('[x**2 for x in range(1000)]', number=1000)\nt2 = timeit.timeit('list(map(lambda x: x**2, range(1000)))', number=1000)\nprint(f'List comp: {t1:.3f}s, map: {t2:.3f}s')\n\n# logging\nimport logging\nlogging.basicConfig(level=logging.DEBUG)\nlogging.debug('Debug info')\nlogging.info('Started')\nlogging.warning('Warning!')\nlogging.error('Error!')\n```" },
    ],
    tasks: [
      { number: 1, name: "breakpoint()", question: "Ce face breakpoint()?", options: ["Stop program", "Deschide debugger interactiv pdb la acea linie", "Print all vars", "Crash"], answer: "Deschide debugger interactiv pdb la acea linie", explanation: "Echivalent cu import pdb; pdb.set_trace(). Mai scurt și controlabil via env vars.", difficulty: "easy" },
      { number: 2, name: "pdb n vs s", question: "Diferența n vs s în pdb?", options: ["Identice", "n = next (nu intră în funcții); s = step (intră în funcție)", "n = next, s = stop", "Bug"], answer: "n = next (nu intră în funcții); s = step (intră în funcție)", explanation: "n sare peste apeluri de funcție. s urmărește execuția înăuntru.", difficulty: "medium" },
      { number: 3, name: "cProfile", question: "cProfile arată ce?", options: ["Memory", "Număr apeluri și timp per funcție", "Errori", "Threads"], answer: "Număr apeluri și timp per funcție", explanation: "Identifici bottleneck-urile. Sort by 'cumulative' arată funcțiile care iau cel mai mult timp.", difficulty: "medium" },
      { number: 4, name: "logging vs print", question: "De ce logging > print pentru debug?", options: ["Identice", "Nivele (DEBUG/INFO/ERROR), output configurabil, dezactivabil fără ștergere cod", "Culori", "Speed"], answer: "Nivele (DEBUG/INFO/ERROR), output configurabil, dezactivabil fără ștergere cod", explanation: "print-urile trebuie șterse manual. logging.debug poate fi dezactivat cu basicConfig.", difficulty: "medium" },
    ],
  },
  {
    slug: "python-design-patterns",
    title: "39. Design patterns în Python",
    order: 39,
    theory: [
      { order: 1, title: "Singleton, Factory, Observer", content: "```python\n# Singleton\nclass Config:\n    _instance = None\n    def __new__(cls):\n        if not cls._instance:\n            cls._instance = super().__new__(cls)\n        return cls._instance\n\n# Factory\nclass AnimalFactory:\n    @staticmethod\n    def create(tip):\n        match tip:\n            case 'dog': return Dog()\n            case 'cat': return Cat()\n            case _: raise ValueError(f'Unknown: {tip}')\n\nanimal = AnimalFactory.create('dog')\n\n# Observer\nclass EventBus:\n    def __init__(self):\n        self._handlers = defaultdict(list)\n    def on(self, event, handler):\n        self._handlers[event].append(handler)\n    def emit(self, event, *args):\n        for h in self._handlers[event]: h(*args)\n\nbus = EventBus()\nbus.on('login', lambda user: print(f'{user} logged in'))\nbus.emit('login', 'Cristi')\n```" },
      { order: 2, title: "Strategy, Decorator Pattern", content: "```python\n# Strategy — algoritm intercambiabil\nclass Sorter:\n    def __init__(self, strategy):\n        self.sort = strategy\n\nbubble = Sorter(sorted)\nquick = Sorter(lambda l: sorted(l, reverse=True))\n\n# Decorator Pattern (nu decoratori Python!)\nclass CacheableRequest:\n    def __init__(self, request):\n        self._req = request\n        self._cache = {}\n    def get(self, url):\n        if url not in self._cache:\n            self._cache[url] = self._req.get(url)\n        return self._cache[url]\n\n# Pythonic: funcwrap decorator\nfrom functools import lru_cache\n@lru_cache(maxsize=128)\ndef expensive(n):\n    return sum(range(n))\n```" },
    ],
    tasks: [
      { number: 1, name: "Singleton", question: "Ce garantează Singleton?", options: ["Thread safety", "O singură instanță a clasei în toată aplicația", "Moștenire", "Clone"], answer: "O singură instanță a clasei în toată aplicația", explanation: "Config, Database connections. __new__ returnează mereu aceeași instanță.", difficulty: "medium" },
      { number: 2, name: "Factory", question: "Avantajul Factory pattern?", options: ["Performanță", "Decuplare: clientul nu știe ce clasă concretă primește", "Moștenire", "Memory"], answer: "Decuplare: clientul nu știe ce clasă concretă primește", explanation: "Adaugi noi tipuri fără să modifici codul client. Open/Closed Principle.", difficulty: "medium" },
      { number: 3, name: "lru_cache", question: "Ce face @lru_cache?", options: ["Cache manual", "Memorize — cache automat al rezultatelor funcției", "Thread-safe", "Async"], answer: "Memorize — cache automat al rezultatelor funcției", explanation: "LRU = Least Recently Used. maxsize = câte rezultate ține. Util pentru recursive, API calls.", difficulty: "medium" },
      { number: 4, name: "Strategy", question: "Strategy pattern ce schimba?", options: ["Datele", "Algoritmul/comportamentul din exterior (intercambiabil)", "Clasa", "Output"], answer: "Algoritmul/comportamentul din exterior (intercambiabil)", explanation: "Sortare: bubble sort vs quick sort vs tim sort — aceeași interfață, algoritm diferit.", difficulty: "medium" },
    ],
  },
  {
    slug: "python-proiect-final",
    title: "40. Mini proiect Python — CLI Todo App",
    order: 40,
    theory: [
      { order: 1, title: "Structura proiectului", content: "```\ntodo/\n  __init__.py\n  models.py    # dataclass Todo\n  storage.py   # JSON persistence\n  cli.py       # argparse interface\nmain.py\n```\n\n```python\n# models.py\nfrom dataclasses import dataclass, field\nfrom datetime import datetime\n\n@dataclass\nclass Todo:\n    title: str\n    done: bool = False\n    created: str = field(default_factory=lambda: datetime.now().isoformat())\n    id: int = field(default=0)\n```" },
      { order: 2, title: "Storage și CLI", content: "```python\n# storage.py\nimport json\nfrom pathlib import Path\nfrom .models import Todo\n\nDB = Path('todos.json')\n\ndef load() -> list[Todo]:\n    if not DB.exists(): return []\n    data = json.loads(DB.read_text())\n    return [Todo(**d) for d in data]\n\ndef save(todos: list[Todo]):\n    DB.write_text(json.dumps([vars(t) for t in todos], indent=2))\n\n# cli.py\nimport argparse\nfrom . import storage\n\nparser = argparse.ArgumentParser(description='Todo App')\nsub = parser.add_subparsers(dest='cmd')\n\nadd_p = sub.add_parser('add')\nadd_p.add_argument('title', nargs='+')\n\ndone_p = sub.add_parser('done')\ndone_p.add_argument('id', type=int)\n\nlist_p = sub.add_parser('list')\nlist_p.add_argument('--all', action='store_true')\n\ndef main():\n    args = parser.parse_args()\n    todos = storage.load()\n    match args.cmd:\n        case 'add':\n            new = Todo(title=' '.join(args.title), id=len(todos)+1)\n            todos.append(new)\n            storage.save(todos)\n            print(f'✓ Adăugat: {new.title}')\n        case 'done':\n            for t in todos:\n                if t.id == args.id: t.done = True\n            storage.save(todos)\n        case 'list':\n            for t in todos:\n                if args.all or not t.done:\n                    status = '✓' if t.done else '○'\n                    print(f'{t.id}. [{status}] {t.title}')\n```" },
    ],
    tasks: [
      { number: 1, name: "argparse", question: "Ce face argparse?", options: ["Argument JS", "Parser CLI arguments cu help automat", "GUI", "Config"], answer: "Parser CLI arguments cu help automat", explanation: "python main.py add 'Task nou' — argparse parsează sys.argv.", difficulty: "easy" },
      { number: 2, name: "subparsers", question: "Subparsers sunt folosiți pentru?", options: ["Nesting args", "Sub-comenzi (add, done, list) ca git/npm", "Optional", "Debug"], answer: "Sub-comenzi (add, done, list) ca git/npm", explanation: "python app.py add 'x' vs python app.py list. Fiecare subparser are propriii args.", difficulty: "medium" },
      { number: 3, name: "vars()", question: "Ce face vars(dataclass_obj)?", options: ["Tipuri", "Dict cu toate atributele obiectului", "Str", "None"], answer: "Dict cu toate atributele obiectului", explanation: "Util pentru JSON serialization: json.dumps([vars(t) for t in todos]).", difficulty: "medium" },
      { number: 4, name: "pathlib write_text", question: "Ce face Path('f.json').write_text(data)?", options: ["Read", "Scrie string în fișier (creează dacă lipsește)", "Append", "Binary"], answer: "Scrie string în fișier (creează dacă lipsește)", explanation: "Echivalent modern cu open()+write(). Combini cu .read_text() pentru JSON.", difficulty: "easy" },
    ],
  },
];

module.exports = { pythonMore };
