// Java extra lessons 26-30

const javaExtra2 = [
  {
    slug: "java-streams-advanced",
    title: "26. Java Streams API Avansat",
    order: 26,
    theory: [
      {
        order: 1,
        title: "flatMap, collect si Collectors avansati",
        content: "**flatMap** transforma fiecare element intr-un stream si \"aplatizeaza\" rezultatele intr-un singur stream.\n\n```java\nimport java.util.*;\nimport java.util.stream.*;\n\n// flatMap — transforma List<List<T>> in Stream<T>\nList<List<String>> nested = List.of(\n    List.of(\"Ana\", \"Bob\"),\n    List.of(\"Carol\", \"Dan\"),\n    List.of(\"Eve\")\n);\nList<String> flat = nested.stream()\n    .flatMap(Collection::stream)\n    .collect(Collectors.toList());\n// [Ana, Bob, Carol, Dan, Eve]\n\n// flatMap cu Optional:\nList<Optional<String>> opts = List.of(\n    Optional.of(\"hello\"),\n    Optional.empty(),\n    Optional.of(\"world\")\n);\nList<String> present = opts.stream()\n    .flatMap(Optional::stream)\n    .collect(Collectors.toList());\n// [hello, world]\n\n// Collectors avansati:\nList<String> names = List.of(\"Ana\", \"Bob\", \"Ana\", \"Carol\", \"Bob\", \"Ana\");\n\n// joining:\nString joined = names.stream().distinct()\n    .collect(Collectors.joining(\", \", \"[\", \"]\"));\n// [Ana, Bob, Carol]\n\n// counting:\nlong count = names.stream().filter(n -> n.startsWith(\"A\")).count();\n\n// partitioningBy:\nMap<Boolean, List<String>> partitioned = names.stream()\n    .collect(Collectors.partitioningBy(n -> n.length() > 2));\n// {false=[Ana, Bob], true=[Carol]}\n```\n\n**Interview tip:** flatMap e esential pentru streams nested si pentru lucrul cu Optional — stie sa explici diferenta fata de map."
      },
      {
        order: 2,
        title: "groupingBy, reduce si operatii terminale avansate",
        content: "**groupingBy** este unul dintre cei mai puternici Collectors — grupeaza elementele dupa un criteriu.\n\n```java\nimport java.util.stream.*;\nimport java.util.*;\n\nrecord Angajat(String nume, String departament, double salariu) {}\n\nList<Angajat> angajati = List.of(\n    new Angajat(\"Ana\", \"IT\", 5000),\n    new Angajat(\"Bob\", \"IT\", 4500),\n    new Angajat(\"Carol\", \"HR\", 3500),\n    new Angajat(\"Dan\", \"HR\", 4000),\n    new Angajat(\"Eve\", \"IT\", 6000)\n);\n\n// groupingBy simplu:\nMap<String, List<Angajat>> peDept = angajati.stream()\n    .collect(Collectors.groupingBy(Angajat::departament));\n\n// groupingBy + downstream collector:\nMap<String, Double> salarMediu = angajati.stream()\n    .collect(Collectors.groupingBy(\n        Angajat::departament,\n        Collectors.averagingDouble(Angajat::salariu)\n    ));\n// {IT=5166.67, HR=3750.0}\n\nMap<String, Long> nrPerDept = angajati.stream()\n    .collect(Collectors.groupingBy(\n        Angajat::departament, Collectors.counting()\n    ));\n\n// reduce — operatie terminala generala:\nOptional<Double> totalSalariu = angajati.stream()\n    .map(Angajat::salariu)\n    .reduce(Double::sum);\n\n// reduce cu identitate:\ndouble total = angajati.stream()\n    .mapToDouble(Angajat::salariu)\n    .reduce(0.0, Double::sum);\n\n// toMap:\nMap<String, Double> numeSalariu = angajati.stream()\n    .collect(Collectors.toMap(\n        Angajat::nume,\n        Angajat::salariu,\n        (v1, v2) -> v1  // merge function pt duplicate\n    ));\n```\n\n**Interview tip:** groupingBy + downstream collector e un pattern frecvent in interviuri. Stie toate variantele: counting, summingInt, averagingDouble, mapping."
      },
      {
        order: 3,
        title: "Parallel Streams — utilizare si capcane",
        content: "**Parallel streams** impart procesarea pe mai multe thread-uri (ForkJoinPool).\n\n```java\nimport java.util.stream.*;\nimport java.util.List;\n\nList<Integer> numere = IntStream.rangeClosed(1, 1_000_000)\n    .boxed().collect(Collectors.toList());\n\n// Stream secvential:\nlong sumSeq = numere.stream()\n    .mapToLong(Integer::longValue)\n    .sum();\n\n// Stream paralel:\nlong sumPar = numere.parallelStream()\n    .mapToLong(Integer::longValue)\n    .sum();\n\n// sau: .stream().parallel()\n\n// Cand SA folosesti parallel:\n// ✅ Seturi mari de date (> 10.000 elemente)\n// ✅ Operatii CPU-intensive independente\n// ✅ Fara shared mutable state\n\n// Cand SA NU folosesti:\n// ❌ Seturi mici de date (overhead thread management)\n// ❌ Operatii I/O bound\n// ❌ Ordinea conteaza si nu folosesti forEachOrdered\n\n// ATENTIE — race condition cu parallel:\nList<Integer> lista = new ArrayList<>();\n// ❌ Gresit:\nnumere.parallelStream().forEach(lista::add); // UNSAFE!\n// ✅ Corect:\nList<Integer> safe = numere.parallelStream()\n    .collect(Collectors.toList()); // thread-safe collector\n\n// Benchmark simplu:\nlong start = System.nanoTime();\nnumere.parallelStream()\n    .filter(n -> n % 2 == 0)\n    .mapToLong(Integer::longValue)\n    .sum();\nlong end = System.nanoTime();\nSystem.out.printf(\"Paralel: %.2f ms%n\", (end - start) / 1e6);\n```\n\n**Interview tip:** Parallel streams nu sunt mereu mai rapide. Mentioneaza ForkJoinPool, overhead, si ca trebuie masurat cu JMH (Java Microbenchmark Harness)."
      },
      {
        order: 4,
        title: "Stream pipelines — intermediate vs terminal, lazy evaluation",
        content: "Streamurile sunt **lazy** — operatiile intermediare nu se executa pana nu e apelata o operatie terminala.\n\n```java\nimport java.util.stream.*;\nimport java.util.List;\n\n// Demonstratie lazy evaluation:\nList<String> rezultat = List.of(\"Ana\", \"Bob\", \"Carol\", \"Dan\", \"Eve\")\n    .stream()\n    .filter(s -> {\n        System.out.println(\"filter: \" + s);\n        return s.length() > 2;\n    })\n    .map(s -> {\n        System.out.println(\"map: \" + s);\n        return s.toUpperCase();\n    })\n    .limit(2)  // scurt-circuiteaza — nu proceseaza tot!\n    .collect(Collectors.toList());\n// filter: Ana, filter: Bob, filter: Carol, map: Carol,\n// filter: Dan, filter: Eve... STOP la 2 elemente\n\n// Operatii intermediare (lazy, returneaza Stream):\n// filter, map, flatMap, distinct, sorted, peek,\n// limit, skip, mapToInt, mapToLong, mapToDouble\n\n// Operatii terminale (trigger evaluarea):\n// collect, count, findFirst, findAny, anyMatch,\n// allMatch, noneMatch, reduce, forEach, min, max, toArray\n\n// Stream de la diverse surse:\nStream<String> fromArray = Arrays.stream(new String[]{\"a\", \"b\", \"c\"});\nStream<String> generated = Stream.generate(() -> \"x\").limit(5);\nStream<Integer> iterated = Stream.iterate(0, n -> n + 2).limit(10);\nIntStream range = IntStream.range(0, 10);       // [0, 9]\nIntStream rangeClosed = IntStream.rangeClosed(1, 5); // [1, 5]\n\n// Exemplu pipeline complex:\nMap<String, IntSummaryStatistics> stats =\n    Stream.of(\"Java\", \"Python\", \"Go\", \"JavaScript\", \"Rust\")\n        .collect(Collectors.groupingBy(\n            s -> s.length() <= 4 ? \"scurt\" : \"lung\",\n            Collectors.summarizingInt(String::length)\n        ));\n```\n\n**Interview tip:** Lazy evaluation + short-circuit (limit, findFirst, anyMatch) poate fi mai eficient decat iterarea manuala. Mentioneaza ca Stream nu poate fi reutilizat dupa operatia terminala."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "flatMap vs map",
        question: "Ce diferenta exista intre map si flatMap in Java Streams?",
        options: [
          "Nu exista diferenta",
          "map transforma fiecare element 1:1, flatMap transforma fiecare element intr-un Stream si aplatizeaza rezultatele",
          "flatMap e mai lent",
          "map poate returna Stream, flatMap nu"
        ],
        answer: "map transforma fiecare element 1:1, flatMap transforma fiecare element intr-un Stream si aplatizeaza rezultatele",
        explanation: "map: T -> R. flatMap: T -> Stream<R>, apoi toate stream-urile sunt concatenate intr-unul singur. Util pentru List<List<T>> sau Optional<T>.",
        difficulty: "medium"
      },
      {
        number: 2,
        name: "groupingBy downstream",
        question: "Ce returneaza Collectors.groupingBy(Angajat::departament, Collectors.counting())?",
        options: [
          "List<Angajat>",
          "Map<String, Long> — numarul de angajati per departament",
          "Map<String, List<Angajat>>",
          "Long — total angajati"
        ],
        answer: "Map<String, Long> — numarul de angajati per departament",
        explanation: "groupingBy grupeaza dupa cheie (departament), downstream collector counting() numara elementele din fiecare grup.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "parallel stream safety",
        question: "De ce adaugarea elementelor intr-un ArrayList din parallelStream().forEach() este nesigura?",
        options: [
          "ArrayList nu suporta parallelStream",
          "ArrayList nu este thread-safe — mai multe thread-uri scriu simultan, cauzand race conditions si coruptie de date",
          "forEach nu merge cu parallel",
          "E prea lenta"
        ],
        answer: "ArrayList nu este thread-safe — mai multe thread-uri scriu simultan, cauzand race conditions si coruptie de date",
        explanation: "Solutia: foloseste collect(Collectors.toList()) care foloseste un mecanism thread-safe intern, sau CopyOnWriteArrayList.",
        difficulty: "hard"
      },
      {
        number: 4,
        name: "lazy evaluation",
        question: "Ce inseamna ca operatiile intermediare ale unui Stream sunt lazy?",
        options: [
          "Se executa imediat",
          "Nu se executa deloc pana nu este apelata o operatie terminala",
          "Se executa in background",
          "Se executa in ordine inversa"
        ],
        answer: "Nu se executa deloc pana nu este apelata o operatie terminala",
        explanation: "Lazy evaluation permite optimizari: limit() + lazy filter poate procesa mai putine elemente decat dimensiunea colectiei.",
        difficulty: "medium"
      },
      {
        number: 5,
        name: "reduce identity",
        question: "Ce rol are elementul de identitate in stream.reduce(identitate, operator)?",
        options: [
          "E primul element procesat",
          "Valoarea initiala a acumulatorului — daca stream-ul e gol, acesta e returnat",
          "E elementul de tip String",
          "Nu are rol functional"
        ],
        answer: "Valoarea initiala a acumulatorului — daca stream-ul e gol, acesta e returnat",
        explanation: "reduce(0, Integer::sum) pe stream gol returneaza 0. Fara identitate, reduce returneaza Optional.empty() pe stream gol.",
        difficulty: "medium"
      },
      {
        number: 6,
        name: "collectors joining",
        question: "Ce produce stream.collect(Collectors.joining(\", \", \"[\", \"]\")) pe [\"Ana\", \"Bob\", \"Carol\"]?",
        options: [
          "Ana Bob Carol",
          "[Ana, Bob, Carol]",
          "Ana,Bob,Carol",
          "[\"Ana\", \"Bob\", \"Carol\"]"
        ],
        answer: "[Ana, Bob, Carol]",
        explanation: "joining(delimitator, prefix, suffix) concateneaza elementele cu delimitatorul dat, intre prefix si suffix.",
        difficulty: "easy"
      },
      {
        number: 7,
        name: "terminal operations",
        question: "Care dintre urmatoarele este o operatie terminala a unui Stream?",
        options: ["filter()", "map()", "sorted()", "collect()"],
        answer: "collect()",
        explanation: "collect() declanseaza evaluarea stream-ului si produce un rezultat. filter, map, sorted sunt intermediare (lazy).",
        difficulty: "easy"
      },
      {
        number: 8,
        name: "flatMap coding",
        question: "Scrie o expresie Java Streams care transforma o lista de propozitii intr-o lista de cuvinte unice, sortate alfabetic.",
        type: "coding",
        language: "java",
        starterCode: "import java.util.*;\nimport java.util.stream.*;\n\nList<String> propozitii = List.of(\n    \"java este rapid\",\n    \"java este popular\",\n    \"streams sunt utile\"\n);\n\n// Rezultat asteptat: [este, java, popular, rapid, streams, sunt, utile]\nList<String> cuvinteUnice = propozitii.stream()\n    // completeaza cu flatMap, distinct, sorted",
        options: [],
        answer: "",
        explanation: ".flatMap(s -> Arrays.stream(s.split(\" \"))).distinct().sorted().collect(Collectors.toList())",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 9,
        name: "groupingBy salary",
        question: "Scrie un collector care calculeaza salariul total per departament dintr-un stream de angajati.",
        type: "coding",
        language: "java",
        starterCode: "import java.util.*;\nimport java.util.stream.*;\n\nrecord Angajat(String departament, double salariu) {}\n\nList<Angajat> angajati = List.of(\n    new Angajat(\"IT\", 5000), new Angajat(\"IT\", 4500),\n    new Angajat(\"HR\", 3500), new Angajat(\"HR\", 4000)\n);\n\n// Map<String, Double> totalPerDept — {IT=9500.0, HR=7500.0}\nMap<String, Double> totalPerDept = angajati.stream()\n    .collect(/* completeaza */);",
        options: [],
        answer: "",
        explanation: "Collectors.groupingBy(Angajat::departament, Collectors.summingDouble(Angajat::salariu))",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 10,
        name: "parallel when",
        question: "In ce situatie parallel streams ofera un avantaj real de performanta?",
        options: [
          "Intotdeauna — mai multe thread-uri = mai rapid",
          "Colectii mari, operatii CPU-intensive independente, fara shared mutable state",
          "Operatii I/O (citit fisiere, baze de date)",
          "Colectii mici (< 100 elemente)"
        ],
        answer: "Colectii mari, operatii CPU-intensive independente, fara shared mutable state",
        explanation: "Parallel streams au overhead de creare thread-uri si merge. Pentru colectii mici sau I/O, sequential e mai rapid.",
        difficulty: "medium"
      },
      {
        number: 11,
        name: "stream reuse",
        question: "Ce se intampla daca incerci sa folosesti un Stream dupa ce a fost consumat (operatia terminala a fost apelata)?",
        options: [
          "Stream-ul se reseteaza automat",
          "Returneaza rezultate vechi",
          "Arunca IllegalStateException: stream has already been operated upon or closed",
          "Returneaza un stream gol"
        ],
        answer: "Arunca IllegalStateException: stream has already been operated upon or closed",
        explanation: "Un Stream poate fi consumat o singura data. Creeaza un stream nou din sursa originala pentru a reutiliza.",
        difficulty: "medium"
      },
      {
        number: 12,
        name: "IntStream range",
        question: "Ce diferenta exista intre IntStream.range(0, 5) si IntStream.rangeClosed(0, 5)?",
        options: [
          "Nu exista diferenta",
          "range(0,5) produce [0,1,2,3,4]; rangeClosed(0,5) produce [0,1,2,3,4,5]",
          "range include ambele capete, rangeClosed nu include ultimul",
          "range(0,5) produce [1,2,3,4,5]"
        ],
        answer: "range(0,5) produce [0,1,2,3,4]; rangeClosed(0,5) produce [0,1,2,3,4,5]",
        explanation: "range este exclusiv la capatul drept (ca Python range). rangeClosed include si ultimul element.",
        difficulty: "easy"
      },
      {
        number: 13,
        name: "partitioningBy",
        question: "Ce returneaza Collectors.partitioningBy()?",
        options: [
          "List<T> filtrata",
          "Map<Boolean, List<T>> — grupul true si grupul false dupa predicat",
          "Map<String, List<T>>",
          "Stream<T> impartit in doua"
        ],
        answer: "Map<Boolean, List<T>> — grupul true si grupul false dupa predicat",
        explanation: "partitioningBy e un caz special de groupingBy cu cheie Boolean — produce mereu exact doua grupuri.",
        difficulty: "medium"
      },
      {
        number: 14,
        name: "reduce sum coding",
        question: "Scrie un stream care calculeaza suma patratelor numerelor pare dintr-o lista, folosind reduce.",
        type: "coding",
        language: "java",
        starterCode: "import java.util.*;\nimport java.util.stream.*;\n\nList<Integer> numere = List.of(1, 2, 3, 4, 5, 6, 7, 8);\n\n// Suma patratelor numerelor pare: 4 + 16 + 36 + 64 = 120\nint suma = numere.stream()\n    // filter pare, map la patrat, reduce cu suma",
        options: [],
        answer: "",
        explanation: ".filter(n -> n % 2 == 0).map(n -> n * n).reduce(0, Integer::sum) sau mapToInt + sum()",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 15,
        name: "statistics",
        question: "Ce informatii ofera IntSummaryStatistics colectat dintr-un IntStream?",
        options: [
          "Doar media",
          "Count, sum, min, max, average — toate intr-un singur pass",
          "Doar min si max",
          "Distributia statistica completa"
        ],
        answer: "Count, sum, min, max, average — toate intr-un singur pass",
        explanation: "IntSummaryStatistics = statistici complete intr-o singura iteratie. Colectat cu Collectors.summarizingInt() sau IntStream.summaryStatistics().",
        difficulty: "medium"
      }
    ]
  },
  {
    slug: "spring-boot-rest",
    title: "27. Spring Boot — REST API",
    order: 27,
    theory: [
      {
        order: 1,
        title: "RestController, GetMapping, PostMapping — fundamente",
        content: "**Spring Boot** simplifica crearea aplicatiilor Java cu configuratie minima (convention over configuration).\n\n```java\n// pom.xml — dependente esentiale:\n// spring-boot-starter-web\n// spring-boot-starter-data-jpa\n// spring-boot-starter-validation\n\n// Clasa principala:\n@SpringBootApplication\npublic class App {\n    public static void main(String[] args) {\n        SpringApplication.run(App.class, args);\n    }\n}\n\n// Controller simplu:\n@RestController\n@RequestMapping(\"/api/produse\")\npublic class ProduseController {\n\n    // GET /api/produse\n    @GetMapping\n    public List<Produs> getAll() {\n        return List.of(new Produs(1L, \"Laptop\", 3500.0));\n    }\n\n    // GET /api/produse/{id}\n    @GetMapping(\"/{id}\")\n    public Produs getById(@PathVariable Long id) {\n        return new Produs(id, \"Laptop\", 3500.0);\n    }\n\n    // POST /api/produse\n    @PostMapping\n    @ResponseStatus(HttpStatus.CREATED)\n    public Produs create(@RequestBody @Valid ProdusCerere cerere) {\n        return new Produs(1L, cerere.nume(), cerere.pret());\n    }\n\n    // DELETE /api/produse/{id}\n    @DeleteMapping(\"/{id}\")\n    @ResponseStatus(HttpStatus.NO_CONTENT)\n    public void delete(@PathVariable Long id) {\n        // sterge din baza de date\n    }\n}\n```\n\n**@RestController** = @Controller + @ResponseBody (serializeaza automat in JSON).\n\n**Interview tip:** Stie diferenta: @Controller returneaza view names (Thymeleaf), @RestController returneaza date serializate (JSON/XML)."
      },
      {
        order: 2,
        title: "ResponseEntity — control complet al raspunsului HTTP",
        content: "**ResponseEntity** permite controlul complet al statusului HTTP, header-elor si body-ului.\n\n```java\nimport org.springframework.http.*;\nimport org.springframework.web.bind.annotation.*;\n\n@RestController\n@RequestMapping(\"/api/useri\")\npublic class UserController {\n\n    private final UserService userService;\n\n    public UserController(UserService userService) {\n        this.userService = userService;\n    }\n\n    @GetMapping(\"/{id}\")\n    public ResponseEntity<User> getUser(@PathVariable Long id) {\n        return userService.findById(id)\n            .map(ResponseEntity::ok)              // 200 OK\n            .orElse(ResponseEntity.notFound().build()); // 404\n    }\n\n    @PostMapping\n    public ResponseEntity<User> createUser(\n            @RequestBody @Valid UserDto dto,\n            UriComponentsBuilder ucb) {\n        User saved = userService.save(dto);\n        URI location = ucb\n            .path(\"/api/useri/{id}\")\n            .buildAndExpand(saved.getId())\n            .toUri();\n        return ResponseEntity.created(location).body(saved); // 201\n    }\n\n    @PutMapping(\"/{id}\")\n    public ResponseEntity<User> update(\n            @PathVariable Long id,\n            @RequestBody @Valid UserDto dto) {\n        try {\n            User updated = userService.update(id, dto);\n            return ResponseEntity.ok(updated);    // 200\n        } catch (NotFoundException e) {\n            return ResponseEntity.notFound().build(); // 404\n        }\n    }\n\n    // Custom headers:\n    @GetMapping(\"/export\")\n    public ResponseEntity<byte[]> export() {\n        byte[] csv = userService.exportCsv();\n        HttpHeaders headers = new HttpHeaders();\n        headers.setContentType(MediaType.TEXT_PLAIN);\n        headers.setContentDispositionFormData(\"attachment\", \"useri.csv\");\n        return ResponseEntity.ok().headers(headers).body(csv);\n    }\n}\n```\n\n**Interview tip:** Respecta semantica HTTP: 201 la creare cu header Location, 204 la stergere fara body, 404 cand resursa nu exista."
      },
      {
        order: 3,
        title: "Validare si Exception Handling global",
        content: "**Bean Validation** (@Valid) valideaza automat input-ul. **@ControllerAdvice** centralizeaza tratarea erorilor.\n\n```java\n// DTO cu validari:\nrecord UserDto(\n    @NotBlank(message = \"Numele este obligatoriu\")\n    String nume,\n\n    @Email(message = \"Email invalid\")\n    String email,\n\n    @Min(value = 18, message = \"Varsta minima 18 ani\")\n    int varsta,\n\n    @Size(min = 8, message = \"Parola: minim 8 caractere\")\n    String parola\n) {}\n\n// Global exception handler:\n@RestControllerAdvice\npublic class GlobalExceptionHandler {\n\n    @ExceptionHandler(MethodArgumentNotValidException.class)\n    @ResponseStatus(HttpStatus.BAD_REQUEST)\n    public Map<String, String> handleValidation(\n            MethodArgumentNotValidException ex) {\n        Map<String, String> errors = new HashMap<>();\n        ex.getBindingResult().getFieldErrors().forEach(err ->\n            errors.put(err.getField(), err.getDefaultMessage())\n        );\n        return errors;\n    }\n\n    @ExceptionHandler(NotFoundException.class)\n    @ResponseStatus(HttpStatus.NOT_FOUND)\n    public Map<String, String> handleNotFound(NotFoundException ex) {\n        return Map.of(\"error\", ex.getMessage());\n    }\n\n    @ExceptionHandler(Exception.class)\n    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)\n    public Map<String, String> handleGeneric(Exception ex) {\n        return Map.of(\"error\", \"Eroare interna\");\n    }\n}\n\n// Exceptie custom:\npublic class NotFoundException extends RuntimeException {\n    public NotFoundException(String message) { super(message); }\n}\n```\n\n**Interview tip:** @ControllerAdvice e pattern-ul standard. Evita try/catch in fiecare controller."
      },
      {
        order: 4,
        title: "Service Layer, Dependency Injection si testare",
        content: "Spring foloseste **Dependency Injection** (IoC) — Spring creeaza si injecteaza dependentele.\n\n```java\n// Service:\n@Service\npublic class UserService {\n\n    private final UserRepository userRepository;\n    private final PasswordEncoder passwordEncoder;\n\n    // Constructor injection — recomandat (testabil, immutable):\n    public UserService(UserRepository repo, PasswordEncoder encoder) {\n        this.userRepository = repo;\n        this.passwordEncoder = encoder;\n    }\n\n    public User save(UserDto dto) {\n        String hashParola = passwordEncoder.encode(dto.parola());\n        User user = new User(dto.nume(), dto.email(), hashParola);\n        return userRepository.save(user);\n    }\n\n    public Optional<User> findById(Long id) {\n        return userRepository.findById(id);\n    }\n}\n\n// Test cu Mockito:\n@ExtendWith(MockitoExtension.class)\nclass UserServiceTest {\n\n    @Mock\n    private UserRepository userRepository;\n\n    @Mock\n    private PasswordEncoder passwordEncoder;\n\n    @InjectMocks\n    private UserService userService;\n\n    @Test\n    void saveUser_encryptsPassword() {\n        UserDto dto = new UserDto(\"Ana\", \"ana@ex.com\", 25, \"parola123\");\n        when(passwordEncoder.encode(\"parola123\")).thenReturn(\"$2b$...\");\n        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));\n\n        User result = userService.save(dto);\n\n        assertEquals(\"$2b$...\", result.getParola());\n        verify(passwordEncoder).encode(\"parola123\");\n        verify(userRepository).save(any(User.class));\n    }\n}\n```\n\n**Interview tip:** Constructor injection > @Autowired field injection pentru testabilitate. @Service, @Repository, @Component = stereotype annotations."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "RestController vs Controller",
        question: "Ce diferenta esentiala exista intre @Controller si @RestController in Spring?",
        options: [
          "Nu exista diferenta",
          "@RestController adauga automat @ResponseBody — metodele returneaza date (JSON) nu view names",
          "@Controller e mai nou",
          "@RestController suporta doar GET"
        ],
        answer: "@RestController adauga automat @ResponseBody — metodele returneaza date (JSON) nu view names",
        explanation: "@RestController = @Controller + @ResponseBody. Potrivit pentru REST APIs. @Controller e pentru aplicatii MVC cu template engines.",
        difficulty: "easy"
      },
      {
        number: 2,
        name: "HTTP status CRUD",
        question: "Care este statusul HTTP corect pentru crearea cu succes a unei resurse noi (POST)?",
        options: ["200 OK", "201 Created", "204 No Content", "202 Accepted"],
        answer: "201 Created",
        explanation: "201 Created + header Location cu URL-ul resursei nou create este semantica HTTP corecta pentru POST.",
        difficulty: "easy"
      },
      {
        number: 3,
        name: "PathVariable vs RequestParam",
        question: "Care e diferenta intre @PathVariable si @RequestParam in Spring?",
        options: [
          "Nu exista diferenta",
          "@PathVariable extrage din URL (/api/useri/{id}), @RequestParam extrage din query string (?page=1)",
          "@RequestParam e pentru POST, @PathVariable pentru GET",
          "@PathVariable e optional"
        ],
        answer: "@PathVariable extrage din URL (/api/useri/{id}), @RequestParam extrage din query string (?page=1)",
        explanation: "@PathVariable: /api/useri/42 → id=42. @RequestParam: /api/useri?page=1&size=10 → page=1, size=10.",
        difficulty: "medium"
      },
      {
        number: 4,
        name: "ControllerAdvice",
        question: "La ce serveste @ControllerAdvice in Spring Boot?",
        options: [
          "Configureaza routing-ul",
          "Centralizeaza tratarea exceptiilor pentru toti controllerii — elimina try/catch duplicate",
          "Adauga logging automat",
          "Configureaza CORS"
        ],
        answer: "Centralizeaza tratarea exceptiilor pentru toti controllerii — elimina try/catch duplicate",
        explanation: "@ControllerAdvice + @ExceptionHandler definesc raspunsuri de eroare centralizate, reutilizabile pentru orice controller.",
        difficulty: "medium"
      },
      {
        number: 5,
        name: "constructor injection",
        question: "De ce constructor injection e preferata fata de @Autowired pe field in Spring?",
        options: [
          "E mai rapida",
          "Face dependentele explicite, immutable si testabile fara Spring context",
          "E singurul tip suportat",
          "E mai scurta"
        ],
        answer: "Face dependentele explicite, immutable si testabile fara Spring context",
        explanation: "Cu constructor injection poti crea obiectul in teste cu new MyService(mockRepo) fara container Spring. Field injection necesita reflection.",
        difficulty: "medium"
      },
      {
        number: 6,
        name: "ResponseEntity creation",
        question: "Scrie un endpoint GET care returneaza un utilizator sau 404 daca nu exista, folosind ResponseEntity.",
        type: "coding",
        language: "java",
        starterCode: "@RestController\n@RequestMapping(\"/api/useri\")\npublic class UserController {\n\n    private final UserRepository repo;\n\n    public UserController(UserRepository repo) { this.repo = repo; }\n\n    @GetMapping(\"/{id}\")\n    public ResponseEntity<User> getById(@PathVariable Long id) {\n        // returneaza 200 cu userul sau 404 daca nu exista\n    }\n}",
        options: [],
        answer: "",
        explanation: "return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 7,
        name: "Bean Validation annotations",
        question: "Care adnotare Bean Validation verifica ca un string nu e null si nu e gol (blank)?",
        options: ["@NotNull", "@NotEmpty", "@NotBlank", "@NonEmpty"],
        answer: "@NotBlank",
        explanation: "@NotNull: nu null. @NotEmpty: nu null si nu string gol (\"\"). @NotBlank: nu null, nu \"\", nu doar spatii (\" \").",
        difficulty: "easy"
      },
      {
        number: 8,
        name: "POST with validation",
        question: "Scrie un endpoint POST care primeste un UserDto validat si returneaza 201 Created.",
        type: "coding",
        language: "java",
        starterCode: "record UserDto(@NotBlank String nume, @Email String email) {}\n\n@RestController\n@RequestMapping(\"/api/useri\")\npublic class UserController {\n\n    @PostMapping\n    public ResponseEntity<User> create(\n        // adauga parametrii corecti\n    ) {\n        // salveaza si returneaza 201\n    }\n}",
        options: [],
        answer: "",
        explanation: "public ResponseEntity<User> create(@RequestBody @Valid UserDto dto) { User saved = service.save(dto); return ResponseEntity.status(HttpStatus.CREATED).body(saved); }",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 9,
        name: "RequestMapping",
        question: "Ce face @RequestMapping(\"/api/produse\") la nivel de clasa?",
        options: [
          "Nimic — trebuie pus pe metode",
          "Defineste prefixul URL pentru toate metodele din controller",
          "Mapeaza doar GET requests",
          "Seteaza content type"
        ],
        answer: "Defineste prefixul URL pentru toate metodele din controller",
        explanation: "@RequestMapping(\"/api/produse\") pe clasa + @GetMapping(\"/{id}\") pe metoda = GET /api/produse/{id}.",
        difficulty: "easy"
      },
      {
        number: 10,
        name: "Service annotation",
        question: "Ce rol are @Service in Spring dincolo de @Component?",
        options: [
          "Adauga tranzactii automat",
          "E un alias semantic pentru @Component — marcheaza clasa ca serviciu de business logic, pentru claritate",
          "Permite injectarea automata",
          "Creeaza un singleton"
        ],
        answer: "E un alias semantic pentru @Component — marcheaza clasa ca serviciu de business logic, pentru claritate",
        explanation: "@Service, @Repository, @Controller sunt specializari ale @Component — functioneaza la fel tehnic, dar comunica rolul.",
        difficulty: "medium"
      },
      {
        number: 11,
        name: "DELETE status",
        question: "Care este statusul HTTP corect pentru stergerea cu succes a unei resurse (DELETE)?",
        options: ["200 OK cu body", "201 Created", "204 No Content", "200 OK fara body"],
        answer: "204 No Content",
        explanation: "204 No Content = operatie reusita fara corp de raspuns. 200 OK se foloseste daca returnezi un mesaj de confirmare.",
        difficulty: "easy"
      },
      {
        number: 12,
        name: "global error handler",
        question: "Scrie un @RestControllerAdvice care prinde NotFoundException si returneaza 404 cu mesaj JSON.",
        type: "coding",
        language: "java",
        starterCode: "// NotFoundException.java\npublic class NotFoundException extends RuntimeException {\n    public NotFoundException(String msg) { super(msg); }\n}\n\n// Scrie GlobalExceptionHandler:\n@RestControllerAdvice\npublic class GlobalExceptionHandler {\n    // handleaza NotFoundException cu 404\n}",
        options: [],
        answer: "",
        explanation: "@ExceptionHandler(NotFoundException.class) @ResponseStatus(HttpStatus.NOT_FOUND) public Map<String,String> handle(NotFoundException ex) { return Map.of(\"error\", ex.getMessage()); }",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 13,
        name: "Spring Boot autoconfiguration",
        question: "Ce face @SpringBootApplication?",
        options: [
          "Doar porneste aplicatia",
          "Combina @Configuration + @EnableAutoConfiguration + @ComponentScan — configureaza automat Spring",
          "Configureaza baza de date",
          "Adauga Spring Security"
        ],
        answer: "Combina @Configuration + @EnableAutoConfiguration + @ComponentScan — configureaza automat Spring",
        explanation: "@EnableAutoConfiguration detecteaza dependentele din classpath si configureaza automat (ex: gaseste H2 → configureaza DataSource).",
        difficulty: "medium"
      },
      {
        number: 14,
        name: "RequestBody",
        question: "Ce face @RequestBody in Spring MVC?",
        options: [
          "Trimite date in body",
          "Deserializeaza JSON/XML din body-ul cererii HTTP in obiectul Java specificat",
          "Valideaza body-ul",
          "Seteaza Content-Type"
        ],
        answer: "Deserializeaza JSON/XML din body-ul cererii HTTP in obiectul Java specificat",
        explanation: "@RequestBody foloseste Jackson (implicit) pentru a converti JSON primit in POST/PUT in obiectul Java corespunzator.",
        difficulty: "easy"
      },
      {
        number: 15,
        name: "Mockito test service",
        question: "Scrie un test JUnit 5 cu Mockito pentru un UserService.save() care verifica ca parola e criptata.",
        type: "coding",
        language: "java",
        starterCode: "@ExtendWith(MockitoExtension.class)\nclass UserServiceTest {\n\n    @Mock UserRepository repo;\n    @Mock PasswordEncoder encoder;\n    @InjectMocks UserService service;\n\n    @Test\n    void save_encryptsPassword() {\n        // creeaza UserDto, setup mocks, apeleaza service.save(),\n        // verifica ca encoder.encode() a fost apelat\n    }\n}",
        options: [],
        answer: "",
        explanation: "when(encoder.encode(any())).thenReturn(\"hashed\"); service.save(dto); verify(encoder).encode(dto.parola());",
        difficulty: "hard",
        expectedOutput: ""
      }
    ]
  },
  {
    slug: "jpa-hibernate",
    title: "28. JPA si Hibernate",
    order: 28,
    theory: [
      {
        order: 1,
        title: "Entity, Repository si configurare JPA",
        content: "**JPA** (Jakarta Persistence API) e specificatia, **Hibernate** e implementarea cea mai populara.\n\n```java\n// Entity:\n@Entity\n@Table(name = \"produse\")\npublic class Produs {\n\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n    @Column(nullable = false, length = 200)\n    private String nume;\n\n    @Column(name = \"pret_ron\", nullable = false)\n    private double pret;\n\n    @Column(updatable = false)\n    @CreationTimestamp\n    private LocalDateTime creatLa;\n\n    @UpdateTimestamp\n    private LocalDateTime actualizatLa;\n\n    // Constructori, getteri, setteri...\n    protected Produs() {}  // necesar pentru JPA\n\n    public Produs(String nume, double pret) {\n        this.nume = nume;\n        this.pret = pret;\n    }\n}\n\n// Repository Spring Data JPA:\npublic interface ProduseRepository extends JpaRepository<Produs, Long> {\n    // metode CRUD gratuite: save, findById, findAll, deleteById, count...\n\n    // Derived queries — Spring genereaza SQL automat:\n    List<Produs> findByNumeContainingIgnoreCase(String termen);\n    List<Produs> findByPretBetweenOrderByPretAsc(double min, double max);\n    Optional<Produs> findFirstByNumeOrderByPretDesc(String nume);\n    boolean existsByNume(String nume);\n    long countByPretGreaterThan(double pret);\n}\n\n// application.properties:\n// spring.datasource.url=jdbc:postgresql://localhost:5432/mydb\n// spring.jpa.hibernate.ddl-auto=validate\n// spring.jpa.show-sql=true\n```\n\n**Interview tip:** ddl-auto: create (recreaza la pornire), update (migrare automata), validate (doar verifica), none. In productie: validate sau none cu Flyway/Liquibase."
      },
      {
        order: 2,
        title: "Relatii JPA — @OneToMany si @ManyToOne",
        content: "Relatiile sunt esenta JPA. Conteaza: ownership, cascading, fetch type.\n\n```java\n// Relatie bidirectionala @OneToMany / @ManyToOne:\n@Entity\npublic class Comanda {\n\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n    private String status;\n\n    // Un utilizator are mai multe comenzi:\n    @ManyToOne(fetch = FetchType.LAZY)\n    @JoinColumn(name = \"user_id\", nullable = false)\n    private User user;\n\n    // O comanda are mai multe linii:\n    @OneToMany(\n        mappedBy = \"comanda\",\n        cascade = CascadeType.ALL,\n        orphanRemoval = true\n    )\n    private List<LinieComanda> linii = new ArrayList<>();\n\n    // Metode helper pentru bidirectionala:\n    public void addLinie(LinieComanda linie) {\n        linii.add(linie);\n        linie.setComanda(this); // esential!\n    }\n    public void removeLinie(LinieComanda linie) {\n        linii.remove(linie);\n        linie.setComanda(null);\n    }\n}\n\n@Entity\npublic class LinieComanda {\n\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n    @ManyToOne(fetch = FetchType.LAZY)\n    @JoinColumn(name = \"comanda_id\")\n    private Comanda comanda;\n\n    private int cantitate;\n    private double pret;\n}\n\n// @ManyToMany:\n@ManyToMany\n@JoinTable(\n    name = \"studenti_cursuri\",\n    joinColumns = @JoinColumn(name = \"student_id\"),\n    inverseJoinColumns = @JoinColumn(name = \"curs_id\")\n)\nprivate Set<Curs> cursuri = new HashSet<>();\n```\n\n**Interview tip:** mappedBy e pe partea non-owner (nu are coloana FK). CascadeType.ALL + orphanRemoval = gestionezi copiii prin parinte."
      },
      {
        order: 3,
        title: "JPQL si query-uri custom",
        content: "**JPQL** (Jakarta Persistence Query Language) lucreaza cu entitati si campuri Java, nu cu tabele SQL.\n\n```java\npublic interface ProduseRepository extends JpaRepository<Produs, Long> {\n\n    // JPQL simplu:\n    @Query(\"SELECT p FROM Produs p WHERE p.pret > :pretMin ORDER BY p.pret DESC\")\n    List<Produs> findScumpe(@Param(\"pretMin\") double pretMin);\n\n    // JPQL cu JOIN:\n    @Query(\"\"\"\n        SELECT p FROM Produs p\n        JOIN p.categorie c\n        WHERE c.nume = :numeCat\n        AND p.pret BETWEEN :min AND :max\n    \"\"\")\n    List<Produs> findByCategorieAndPret(\n        @Param(\"numeCat\") String cat,\n        @Param(\"min\") double min,\n        @Param(\"max\") double max\n    );\n\n    // SQL nativ (cand JPQL nu e suficient):\n    @Query(\n        value = \"SELECT * FROM produse WHERE SIMILARITY(nume, :termen) > 0.3\",\n        nativeQuery = true\n    )\n    List<Produs> fullTextSearch(@Param(\"termen\") String termen);\n\n    // Projection — returneaza doar unele campuri:\n    @Query(\"SELECT p.id as id, p.nume as nume FROM Produs p\")\n    List<ProdusSimplu> findAllSimplified();\n\n    // Modificare:\n    @Modifying\n    @Transactional\n    @Query(\"UPDATE Produs p SET p.pret = p.pret * :factor WHERE p.categorie.id = :catId\")\n    int updatePretCategorie(@Param(\"factor\") double factor, @Param(\"catId\") Long catId);\n}\n\n// Projection interface:\npublic interface ProdusSimplu {\n    Long getId();\n    String getNumele();\n}\n```\n\n**Interview tip:** JPQL e case-sensitive la numele claselor si campurilor. Evita N+1: foloseste JOIN FETCH sau @EntityGraph."
      },
      {
        order: 4,
        title: "N+1 Problem, Transactions si Lazy Loading",
        content: "**N+1 problema** este cel mai frecvent bug de performanta JPA.\n\n```java\n// Problema N+1:\n// Ai 100 comenzi, fiecare cu lazy-loaded user\nList<Comanda> comenzi = repo.findAll(); // 1 query\nfor (Comanda c : comenzi) {\n    System.out.println(c.getUser().getNume()); // +1 query per comanda = 100!\n}\n// Total: 101 queries in loc de 1-2!\n\n// Fix 1 — JOIN FETCH in JPQL:\n@Query(\"SELECT c FROM Comanda c JOIN FETCH c.user\")\nList<Comanda> findAllWithUser();\n// 1 singur query cu JOIN\n\n// Fix 2 — @EntityGraph:\n@EntityGraph(attributePaths = {\"user\", \"linii\"})\nList<Comanda> findAll();\n\n// Fix 3 — EAGER fetch (nu recomandat general):\n@ManyToOne(fetch = FetchType.EAGER) // incarca mereu, chiar si daca nu ai nevoie\n\n// Tranzactii:\n@Service\n@Transactional(readOnly = true)  // default readonly pentru performanta\npublic class ComandaService {\n\n    public List<Comanda> getAll() { return repo.findAll(); }\n\n    @Transactional  // override — write transaction\n    public Comanda save(ComandaDto dto) {\n        Comanda c = new Comanda();\n        c.setStatus(\"NOU\");\n        return repo.save(c); // save in tranzactie\n    }\n\n    @Transactional\n    public void transfer(Long de, Long la, double suma) {\n        Cont contDe = conturi.findById(de).orElseThrow();\n        Cont contLa = conturi.findById(la).orElseThrow();\n        contDe.setSold(contDe.getSold() - suma);\n        contLa.setSold(contLa.getSold() + suma);\n        // commit automat la sfarsitul tranzactiei\n        // rollback automat la RuntimeException\n    }\n}\n```\n\n**Interview tip:** Diagnosticul N+1: spring.jpa.show-sql=true sau Hibernate statistics. @Transactional pe metoda service, nu pe repository."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "JPA vs Hibernate",
        question: "Care este relatia dintre JPA si Hibernate?",
        options: [
          "Sunt acelasi lucru",
          "JPA este specificatia (interfata), Hibernate este implementarea cea mai populara",
          "Hibernate e mai vechi si deprecat",
          "JPA e pentru SQL, Hibernate pentru NoSQL"
        ],
        answer: "JPA este specificatia (interfata), Hibernate este implementarea cea mai populara",
        explanation: "JPA = standard (Jakarta EE). Hibernate, EclipseLink, OpenJPA = implementari. Spring Boot foloseste Hibernate implicit.",
        difficulty: "easy"
      },
      {
        number: 2,
        name: "GenerationType.IDENTITY",
        question: "Ce face @GeneratedValue(strategy = GenerationType.IDENTITY)?",
        options: [
          "Genereaza UUID",
          "Baza de date genereaza automat ID-ul (auto-increment, SERIAL)",
          "Hibernate calculeaza ID-ul",
          "ID-ul e generat din timestamp"
        ],
        answer: "Baza de date genereaza automat ID-ul (auto-increment, SERIAL)",
        explanation: "IDENTITY delega generarea ID-ului bazei de date (AUTO_INCREMENT MySQL, SERIAL PostgreSQL). SEQUENCE foloseste un sequence DB.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "mappedBy",
        question: "Ce rol are mappedBy in @OneToMany(mappedBy = \"comanda\")?",
        options: [
          "Specifica numele coloanei FK",
          "Indica ca aceasta parte nu e owner-ul relatiei — FK-ul e pe cealalta entitate",
          "Specifica cascading",
          "Defineste fetch type"
        ],
        answer: "Indica ca aceasta parte nu e owner-ul relatiei — FK-ul e pe cealalta entitate",
        explanation: "mappedBy = \"comanda\" inseamna ca LinieComanda.comanda e owner-ul (are coloana FK). Comanda nu are coloana extra.",
        difficulty: "hard"
      },
      {
        number: 4,
        name: "N+1 problem",
        question: "Ce este problema N+1 in JPA?",
        options: [
          "O eroare de compilare",
          "1 query initial + N query-uri suplimentare pentru a incarca relatii lazy — extrem de ineficient",
          "O limitare a Hibernate la 1000 entitati",
          "Un bug in Spring Data"
        ],
        answer: "1 query initial + N query-uri suplimentare pentru a incarca relatii lazy — extrem de ineficient",
        explanation: "Exemplu: findAll() = 1 query, dar accesarea user.getNume() pentru fiecare comanda = N query-uri. Fix: JOIN FETCH.",
        difficulty: "medium"
      },
      {
        number: 5,
        name: "CascadeType.ALL",
        question: "Ce face CascadeType.ALL pe o relatie @OneToMany?",
        options: [
          "Sterge automat toate relatiile",
          "Toate operatiile (persist, merge, remove, refresh, detach) se propaga de la parinte la copii",
          "Face fetch EAGER",
          "Adauga constrangere FK"
        ],
        answer: "Toate operatiile (persist, merge, remove, refresh, detach) se propaga de la parinte la copii",
        explanation: "CascadeType.ALL: daca salvezi/stergi parinte, se salveaza/sterg si copiii automat. orphanRemoval=true sterge copiii detasati.",
        difficulty: "medium"
      },
      {
        number: 6,
        name: "derived query",
        question: "Scrie o metoda Repository Spring Data JPA care gaseste produse cu pretul intre doua valori, sortate crescator.",
        type: "coding",
        language: "java",
        starterCode: "public interface ProduseRepository extends JpaRepository<Produs, Long> {\n    // metoda derivata: pret intre min si max, sortata crescator\n    // Spring genereaza SQL automat din numele metodei\n}",
        options: [],
        answer: "",
        explanation: "List<Produs> findByPretBetweenOrderByPretAsc(double pretMin, double pretMax);",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 7,
        name: "JPQL vs SQL",
        question: "Ce diferenta importanta exista intre JPQL si SQL nativ?",
        options: [
          "JPQL e mai rapid",
          "JPQL lucreaza cu clase si campuri Java (portabil), SQL nativ cu tabele si coloane DB (specific DB)",
          "Nu exista diferenta",
          "JPQL nu suporta JOIN"
        ],
        answer: "JPQL lucreaza cu clase si campuri Java (portabil), SQL nativ cu tabele si coloane DB (specific DB)",
        explanation: "JPQL: SELECT p FROM Produs p (Produs = clasa Java). SQL nativ: SELECT * FROM produse (produse = tabela DB).",
        difficulty: "medium"
      },
      {
        number: 8,
        name: "Transactional",
        question: "Ce se intampla daca o RuntimeException e aruncata intr-o metoda @Transactional?",
        options: [
          "Tranzactia se comite partial",
          "Tranzactia se face rollback automat",
          "Exceptia e ignorata",
          "Metoda se re-executa"
        ],
        answer: "Tranzactia se face rollback automat",
        explanation: "Spring face rollback automat pentru RuntimeException (unchecked). Pentru checked exceptions trebuie rollbackFor = Exception.class.",
        difficulty: "medium"
      },
      {
        number: 9,
        name: "Entity annotation",
        question: "Scrie o entitate JPA simpla Categorie cu id, nume (unic, nenul) si o lista de produse.",
        type: "coding",
        language: "java",
        starterCode: "import jakarta.persistence.*;\nimport java.util.*;\n\n// Entitate Categorie: id (auto), nume (unic, nenul), produse (oneToMany)\n@Entity\npublic class Categorie {\n    // completeaza campurile cu adnotatii corecte\n}",
        options: [],
        answer: "",
        explanation: "@Id @GeneratedValue Long id; @Column(unique=true, nullable=false) String nume; @OneToMany(mappedBy=\"categorie\", cascade=CascadeType.ALL) List<Produs> produse = new ArrayList<>();",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 10,
        name: "FetchType LAZY vs EAGER",
        question: "Care este fetch type recomandat pentru relatii @ManyToOne si de ce?",
        options: [
          "EAGER — incarca tot",
          "LAZY — incarca relatia doar cand e accesata explicit, evitand query-uri inutile",
          "Nu conteaza",
          "EAGER pentru @ManyToOne, LAZY pentru @OneToMany"
        ],
        answer: "LAZY — incarca relatia doar cand e accesata explicit, evitand query-uri inutile",
        explanation: "LAZY = default pentru @OneToMany/@ManyToMany. Pentru @ManyToOne default e EAGER dar se recomanda LAZY pentru performanta.",
        difficulty: "medium"
      },
      {
        number: 11,
        name: "ddl-auto production",
        question: "Ce valoare pentru spring.jpa.hibernate.ddl-auto e recomandata in productie?",
        options: [
          "create — recreaza schema la fiecare pornire",
          "update — migreaza automat",
          "validate sau none, cu Flyway/Liquibase pentru migratii controlate",
          "create-drop"
        ],
        answer: "validate sau none, cu Flyway/Liquibase pentru migratii controlate",
        explanation: "create si update sunt periculoase in productie: create sterge datele, update poate esua pe migratii complexe. Flyway ofera migratii versionate.",
        difficulty: "hard"
      },
      {
        number: 12,
        name: "JOIN FETCH coding",
        question: "Scrie o query JPQL cu JOIN FETCH pentru a incarca comenzile impreuna cu userul (rezolva N+1).",
        type: "coding",
        language: "java",
        starterCode: "public interface ComandaRepository extends JpaRepository<Comanda, Long> {\n\n    @Query(/* JPQL cu JOIN FETCH */)\n    List<Comanda> findAllWithUser();\n}",
        options: [],
        answer: "",
        explanation: "@Query(\"SELECT c FROM Comanda c JOIN FETCH c.user\") - incarca comenzile si userii intr-un singur SQL cu JOIN.",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 13,
        name: "orphanRemoval",
        question: "Ce face orphanRemoval = true pe o relatie @OneToMany?",
        options: [
          "Sterge parintele daca nu are copii",
          "Sterge automat din DB copiii care sunt eliminati din colectia parintelui",
          "Previne stergerea copiilor",
          "Face cascading la save"
        ],
        answer: "Sterge automat din DB copiii care sunt eliminati din colectia parintelui",
        explanation: "comanda.getLinii().remove(linie) + save(comanda) = DELETE FROM linii_comanda WHERE id = ... automat.",
        difficulty: "medium"
      },
      {
        number: 14,
        name: "Modifying query",
        question: "De ce ai nevoie de @Modifying si @Transactional pe un @Query de UPDATE in Spring Data JPA?",
        options: [
          "Nu ai nevoie",
          "@Modifying indica ca e un DML (UPDATE/DELETE), @Transactional asigura ca se executa intr-o tranzactie",
          "@Modifying face flush automat",
          "@Transactional e doar pentru performanta"
        ],
        answer: "@Modifying indica ca e un DML (UPDATE/DELETE), @Transactional asigura ca se executa intr-o tranzactie",
        explanation: "Fara @Modifying, Spring Data asteapta un SELECT. Fara @Transactional, modificarile pot fi pierdute (nu se face commit).",
        difficulty: "hard"
      },
      {
        number: 15,
        name: "Projection usage",
        question: "Cand folosesti Projections (interface-based) in Spring Data JPA?",
        options: [
          "Intotdeauna",
          "Cand vrei sa returnezi doar o parte din campurile entitatii — evita SELECT * si reduce transferul de date",
          "Cand entitatea are relatii",
          "Cand faci DELETE"
        ],
        answer: "Cand vrei sa returnezi doar o parte din campurile entitatii — evita SELECT * si reduce transferul de date",
        explanation: "Projection interface cu getteri → Spring Data genereaza SELECT doar pentru campurile respective. Util pentru API-uri care nu au nevoie de toata entitatea.",
        difficulty: "medium"
      }
    ]
  },
  {
    slug: "design-patterns-java",
    title: "29. Design Patterns in Java Modern",
    order: 29,
    theory: [
      {
        order: 1,
        title: "Builder Pattern — constructia obiectelor complexe",
        content: "**Builder** rezolva problema constructorilor cu prea multi parametri (telescoping constructor anti-pattern).\n\n```java\n// Anti-pattern: constructor telescopat\npublic User(String nume, String email, int varsta, String telefon,\n           String adresa, boolean activ, Role rol) { ... }\n// Cum stii care parametru e care? User(\"Ana\", \"ana@x.com\", 25, null, null, true, Role.USER)\n\n// ✅ Builder pattern — modern cu inner static class:\npublic class User {\n    private final String nume;\n    private final String email;\n    private final int varsta;\n    private final String telefon;  // optional\n    private final boolean activ;\n\n    private User(Builder b) {\n        this.nume = b.nume;\n        this.email = b.email;\n        this.varsta = b.varsta;\n        this.telefon = b.telefon;\n        this.activ = b.activ;\n    }\n\n    public static Builder builder(String nume, String email) {\n        return new Builder(nume, email);\n    }\n\n    public static class Builder {\n        private final String nume;\n        private final String email;\n        private int varsta;\n        private String telefon;\n        private boolean activ = true;\n\n        private Builder(String nume, String email) {\n            this.nume = Objects.requireNonNull(nume);\n            this.email = Objects.requireNonNull(email);\n        }\n\n        public Builder varsta(int varsta) { this.varsta = varsta; return this; }\n        public Builder telefon(String t) { this.telefon = t; return this; }\n        public Builder inactiv() { this.activ = false; return this; }\n        public User build() { return new User(this); }\n    }\n}\n\n// Utilizare:\nUser user = User.builder(\"Ana\", \"ana@email.com\")\n    .varsta(25)\n    .telefon(\"+40700000000\")\n    .build();\n\n// ✅ Alternativa moderna — Lombok @Builder:\n@Builder\n@Getter\npublic class Produs {\n    private final Long id;\n    private final String nume;\n    @Builder.Default private final boolean activ = true;\n}\nProdus p = Produs.builder().id(1L).nume(\"Laptop\").build();\n```\n\n**Interview tip:** Builder e ideal pentru obiecte imutabile cu multi parametri optionali. Mentionand Lombok @Builder arata cunostinte practice."
      },
      {
        order: 2,
        title: "Factory Pattern si Strategy Pattern",
        content: "**Factory Method** delega crearea obiectelor subclaselor.\n**Strategy** encapsuleaza algoritmi interschimbabili.\n\n```java\n// Factory Pattern:\npublic interface Notificator {\n    void trimite(String destinatar, String mesaj);\n}\n\npublic class EmailNotificator implements Notificator {\n    public void trimite(String dest, String mesaj) {\n        System.out.println(\"Email catre \" + dest + \": \" + mesaj);\n    }\n}\npublic class SMSNotificator implements Notificator {\n    public void trimite(String dest, String mesaj) {\n        System.out.println(\"SMS catre \" + dest + \": \" + mesaj);\n    }\n}\n\n// Factory:\npublic class NotificatorFactory {\n    public static Notificator create(String tip) {\n        return switch (tip) {\n            case \"email\" -> new EmailNotificator();\n            case \"sms\" -> new SMSNotificator();\n            case \"push\" -> new PushNotificator();\n            default -> throw new IllegalArgumentException(\"Tip necunoscut: \" + tip);\n        };\n    }\n}\n\n// Strategy Pattern — modern cu functii:\n@FunctionalInterface\npublic interface StrategyDiscount {\n    double aplica(double pretOriginal);\n}\n\n// Strategii ca lambda:\nStrategyDiscount fara = pret -> pret;\nStrategyDiscount zeceProcente = pret -> pret * 0.9;\nStrategyDiscount fixDouazeci = pret -> pret - 20;\nStrategyDiscount clientVIP = pret -> pret * 0.7;\n\n// Context:\npublic class Cos {\n    private StrategyDiscount discount = pret -> pret; // default: fara\n\n    public void setDiscount(StrategyDiscount d) { this.discount = d; }\n\n    public double total(double pretBrut) {\n        return discount.aplica(pretBrut);\n    }\n}\n\n// Utilizare:\nCos cos = new Cos();\ncos.setDiscount(zeceProcente);\nSystem.out.println(cos.total(100)); // 90.0\n\ncos.setDiscount(clientVIP);\nSystem.out.println(cos.total(100)); // 70.0\n```\n\n**Interview tip:** Strategy cu interfete functionale + lambdas = cod elegant, fara clase anonime. Mentoneza ca inlocuieste if/switch chains."
      },
      {
        order: 3,
        title: "Observer Pattern si Event-Driven cu Spring",
        content: "**Observer** notifica abonati cand un obiect isi schimba starea. Spring il implementeaza elegant.\n\n```java\n// Observer clasic:\npublic interface Observer<T> {\n    void onEvent(T event);\n}\n\npublic class EventBus<T> {\n    private final List<Observer<T>> observers = new ArrayList<>();\n\n    public void subscribe(Observer<T> obs) { observers.add(obs); }\n    public void unsubscribe(Observer<T> obs) { observers.remove(obs); }\n    public void publish(T event) {\n        observers.forEach(obs -> obs.onEvent(event));\n    }\n}\n\n// Spring Application Events (mai robust):\n// Event:\npublic record UserCriatEvent(User user, LocalDateTime la) {}\n\n// Publisher:\n@Service\npublic class UserService {\n    private final ApplicationEventPublisher eventPublisher;\n\n    public UserService(ApplicationEventPublisher publisher) {\n        this.eventPublisher = publisher;\n    }\n\n    public User save(UserDto dto) {\n        User user = repo.save(new User(dto));\n        eventPublisher.publishEvent(\n            new UserCriatEvent(user, LocalDateTime.now())\n        );\n        return user;\n    }\n}\n\n// Listener:\n@Component\npublic class WelcomeEmailListener {\n\n    @EventListener\n    public void onUserCreat(UserCriatEvent event) {\n        emailService.trimiteWelcome(event.user().getEmail());\n    }\n\n    // Async (nu blocheaza thread-ul principal):\n    @Async\n    @EventListener\n    public void onUserCreatAsync(UserCriatEvent event) {\n        // executat pe alt thread\n    }\n\n    // Dupa commit tranzactie:\n    @TransactionalEventListener(phase = AFTER_COMMIT)\n    public void afterCommit(UserCriatEvent event) {\n        // garantat ca userul e in DB\n    }\n}\n```\n\n**Interview tip:** @TransactionalEventListener e esential — daca trimit email inainte de commit si tranzactia fail-uieste, userul primeste email dar nu e creat."
      },
      {
        order: 4,
        title: "Singleton, Decorator si Patterns in Java modern",
        content: "**Singleton** — o singura instanta. **Decorator** — adauga comportament dinamic.\n\n```java\n// Singleton thread-safe — Bill Pugh idiom (cel mai bun in Java):\npublic class Config {\n    private Config() {}\n\n    private static class Holder {\n        private static final Config INSTANCE = new Config();\n    }\n\n    public static Config getInstance() { return Holder.INSTANCE; }\n}\n\n// Enum Singleton — serialization-safe, reflection-safe:\npublic enum DatabasePool {\n    INSTANCE;\n    private final ConnectionPool pool = new ConnectionPool();\n    public ConnectionPool getPool() { return pool; }\n}\n\n// NOTA: In Spring, bean-urile sunt singleton by default — nu ai nevoie de Singleton manual!\n\n// Decorator Pattern:\npublic interface Logger {\n    void log(String mesaj);\n}\n\npublic class ConsoleLogger implements Logger {\n    public void log(String mesaj) { System.out.println(mesaj); }\n}\n\n// Decorator — adauga timestamp:\npublic class TimestampLogger implements Logger {\n    private final Logger delegat;\n    public TimestampLogger(Logger delegat) { this.delegat = delegat; }\n\n    public void log(String mesaj) {\n        delegat.log(LocalDateTime.now() + \" — \" + mesaj);\n    }\n}\n\n// Decorator — adauga prefix severitate:\npublic class SeverityLogger implements Logger {\n    private final Logger delegat;\n    private final String nivel;\n    public SeverityLogger(Logger delegat, String nivel) {\n        this.delegat = delegat; this.nivel = nivel;\n    }\n    public void log(String mesaj) { delegat.log(\"[\" + nivel + \"] \" + mesaj); }\n}\n\n// Compunere decoratori:\nLogger logger = new SeverityLogger(\n    new TimestampLogger(new ConsoleLogger()), \"ERROR\"\n);\nlogger.log(\"Baza de date indisponibila\");\n// [ERROR] 2025-05-16T10:30:00 — Baza de date indisponibila\n\n// Record Pattern (Java 21) — pattern matching:\nObject obj = new User(\"Ana\", \"ana@x.com\");\nif (obj instanceof User(var nume, var email)) {\n    System.out.println(\"User: \" + nume);\n}\n```\n\n**Interview tip:** In Spring, toate @Component sunt singleton by default. Decorator e la baza java.io (InputStream, BufferedReader etc.)."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "Builder scop",
        question: "Ce problema rezolva Builder Pattern?",
        options: [
          "Viteza de executie",
          "Constructori cu multi parametri optionali — ofera lizibilitate si validare la build()",
          "Thread safety",
          "Mostenire multipla"
        ],
        answer: "Constructori cu multi parametri optionali — ofera lizibilitate si validare la build()",
        explanation: "new User(\"Ana\", null, 0, null, null, true, null) vs User.builder(\"Ana\").activ(true).build() — Builder e clar si extensibil.",
        difficulty: "easy"
      },
      {
        number: 2,
        name: "Factory vs new",
        question: "Care este avantajul Factory Pattern fata de new direct?",
        options: [
          "E mai rapid",
          "Centralizeaza crearea — schimbi implementarea fara sa modifici codul client; suporta polimorfism",
          "Evita garbage collection",
          "Permite singleton"
        ],
        answer: "Centralizeaza crearea — schimbi implementarea fara sa modifici codul client; suporta polimorfism",
        explanation: "Factory Method: clientul cere un Notificator('email') fara sa stie clasa concreta. Adaugi tip nou fara sa schimbi clientii.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "Strategy cu lambda",
        question: "De ce Strategy Pattern e natural in Java modern cu lambdas?",
        options: [
          "Nu e posibil cu lambda",
          "Interfetele functionale permit injectarea algoritmilor ca lambda — fara clase anonime verbose",
          "Lambdas sunt mai rapide",
          "E un pattern diferit"
        ],
        answer: "Interfetele functionale permit injectarea algoritmilor ca lambda — fara clase anonime verbose",
        explanation: "StrategyDiscount discount = pret -> pret * 0.9; e Strategy Pattern cu lambda. @FunctionalInterface = contract Strategy.",
        difficulty: "medium"
      },
      {
        number: 4,
        name: "Observer Spring",
        question: "De ce @TransactionalEventListener(phase = AFTER_COMMIT) e preferat fata de @EventListener pentru trimiterea email-ului dupa crearea unui user?",
        options: [
          "E mai rapid",
          "Garanteaza ca userul exista in DB — daca tranzactia fail-uieste, evenimentul nu e procesat",
          "Suporta mai multi listeneri",
          "Nu exista diferenta"
        ],
        answer: "Garanteaza ca userul exista in DB — daca tranzactia fail-uieste, evenimentul nu se procesat",
        explanation: "@EventListener poate rula inainte de commit — userul primeste email dar daca rollback, nu exista in DB. AFTER_COMMIT evita inconsistenta.",
        difficulty: "hard"
      },
      {
        number: 5,
        name: "Singleton Spring",
        question: "In Spring, ce scope au bean-urile (@Component, @Service, @Repository) by default?",
        options: [
          "Prototype — instanta noua per injectare",
          "Singleton — o singura instanta per ApplicationContext",
          "Request — per request HTTP",
          "Session — per sesiune HTTP"
        ],
        answer: "Singleton — o singura instanta per ApplicationContext",
        explanation: "Spring beans sunt singleton by default — nu ai nevoie de Singleton manual. @Scope(\"prototype\") pentru instante noi.",
        difficulty: "easy"
      },
      {
        number: 6,
        name: "Builder implementation",
        question: "Implementeaza Builder Pattern pentru o clasa Cerere cu campurile: url (obligatoriu), method (obligatoriu), headers (optional Map), timeout (optional, default 30s).",
        type: "coding",
        language: "java",
        starterCode: "public class Cerere {\n    private final String url;\n    private final String method;\n    private final Map<String, String> headers;\n    private final int timeout;\n\n    private Cerere(Builder b) { /* TODO */ }\n\n    public static Builder builder(String url, String method) {\n        return new Builder(url, method);\n    }\n\n    public static class Builder {\n        // TODO: campuri, constructori, metode fluent, build()\n    }\n}",
        options: [],
        answer: "",
        explanation: "Builder cu final String url, method; Map<String,String> headers = new HashMap<>(); int timeout = 30; metode: headers(Map), timeout(int), build().",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 7,
        name: "Decorator pattern",
        question: "Ce caracteristica defineste Decorator Pattern?",
        options: [
          "Mostenire clasica",
          "Impacheteaza un obiect existent adaugand comportament nou fara a modifica clasa originala",
          "Creeaza obiecte noi",
          "Gestioneaza singleton-uri"
        ],
        answer: "Impacheteaza un obiect existent adaugand comportament nou fara a modifica clasa originala",
        explanation: "Decorator implementeaza aceeasi interfata si delega la obiectul original + adauga logica. Exemplu clasic: java.io streams.",
        difficulty: "medium"
      },
      {
        number: 8,
        name: "Strategy implementation",
        question: "Implementeaza Strategy Pattern pentru calculul comisionului de plata: card (2%), transfer bancar (0.5%), crypto (1.5%).",
        type: "coding",
        language: "java",
        starterCode: "// Foloseste interfata functionala (Strategy)\n@FunctionalInterface\npublic interface StrategieComision {\n    double calculeaza(double suma);\n}\n\n// Defineste 3 strategii si o clasa Plata care le foloseste\npublic class Plata {\n    private StrategieComision strategie;\n    private double suma;\n    // constructor, setStrategie, totalCuComision()\n}",
        options: [],
        answer: "",
        explanation: "StrategieComision card = s -> s * 0.02; transfer = s -> s * 0.005; crypto = s -> s * 0.015; Plata p = new Plata(1000, card); p.totalCuComision() = 1020.",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 9,
        name: "Open/Closed Principle",
        question: "Ce principiu SOLID e respectat de Factory si Strategy Patterns?",
        options: [
          "Single Responsibility",
          "Open/Closed — deschis pentru extensie, inchis pentru modificare",
          "Liskov Substitution",
          "Dependency Inversion"
        ],
        answer: "Open/Closed — deschis pentru extensie, inchis pentru modificare",
        explanation: "Factory: adaugi un tip nou fara sa modifici factory-ul client. Strategy: adaugi o strategie noua fara sa modifici contextul.",
        difficulty: "medium"
      },
      {
        number: 10,
        name: "Enum singleton",
        question: "De ce Enum Singleton e considerat cel mai sigur in Java?",
        options: [
          "E mai rapid",
          "Serializarea si reflection nu pot crea instante suplimentare — garantie JVM",
          "E mai simplu de scris",
          "Suporta mostenire"
        ],
        answer: "Serializarea si reflection nu pot crea instante suplimentare — garantie JVM",
        explanation: "Double-checked locking poate fi spart prin serialization sau reflection. Enum evita ambele probleme prin design-ul JVM.",
        difficulty: "hard"
      },
      {
        number: 11,
        name: "ApplicationEventPublisher",
        question: "Ce avantaj ofera Spring Application Events fata de Observer clasic?",
        options: [
          "Sunt mai rapide",
          "Integreaza cu tranzactii, suporta async (@Async), si decupleaza componentele prin IoC container",
          "Nu necesita interfete",
          "Sunt bazate pe threads"
        ],
        answer: "Integreaza cu tranzactii, suporta async (@Async), si decupleaza componentele prin IoC container",
        explanation: "@TransactionalEventListener, @Async, si faptul ca publisherul nu stie nimic despre listeneri — toate sunt avantaje Spring Events.",
        difficulty: "medium"
      },
      {
        number: 12,
        name: "Factory with switch",
        question: "Implementeaza o Factory pentru crearea de Shape-uri (Cerc, Dreptunghi, Triunghi) folosind switch expression modern (Java 14+).",
        type: "coding",
        language: "java",
        starterCode: "public interface Shape {\n    double arie();\n}\n\nrecord Cerc(double raza) implements Shape {\n    public double arie() { return Math.PI * raza * raza; }\n}\nrecord Dreptunghi(double l, double h) implements Shape {\n    public double arie() { return l * h; }\n}\n\npublic class ShapeFactory {\n    public static Shape create(String tip, double... dims) {\n        // switch expression modern\n    }\n}",
        options: [],
        answer: "",
        explanation: "return switch(tip) { case \"cerc\" -> new Cerc(dims[0]); case \"dreptunghi\" -> new Dreptunghi(dims[0], dims[1]); default -> throw new IllegalArgumentException(tip); };",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 13,
        name: "Lombok Builder",
        question: "Ce face adnotarea Lombok @Builder pe o clasa?",
        options: [
          "Genereaza getteri si setteri",
          "Genereaza automat Builder Pattern complet — builder(), metode fluent per camp, build()",
          "Face clasa imutabila",
          "Genereaza constructori"
        ],
        answer: "Genereaza automat Builder Pattern complet — builder(), metode fluent per camp, build()",
        explanation: "@Builder genereaza MyClass.builder().camp1(val).camp2(val).build() fara cod boilerplate manual.",
        difficulty: "easy"
      },
      {
        number: 14,
        name: "DI vs Factory",
        question: "Cand alegi Dependency Injection (Spring) fata de Factory Pattern manual?",
        options: [
          "DI intotdeauna",
          "DI pentru dependente gestionate de Spring (servicii, repos); Factory pentru obiecte create dinamic la runtime cu parametri variabili",
          "Factory intotdeauna",
          "Sunt echivalente"
        ],
        answer: "DI pentru dependente gestionate de Spring (servicii, repos); Factory pentru obiecte create dinamic la runtime cu parametri variabili",
        explanation: "UserService e injected de Spring. Shape-urile create dinamic cu parametri utilizator => Factory. DI e un IoC container, nu Factory.",
        difficulty: "hard"
      },
      {
        number: 15,
        name: "Chain of Responsibility",
        question: "Scrie un Chain of Responsibility simplu pentru validarea unui request: verificare autentificare, verificare permisiuni, verificare rate limit.",
        type: "coding",
        language: "java",
        starterCode: "public abstract class Handler {\n    private Handler urmator;\n\n    public Handler setUrmator(Handler h) { urmator = h; return h; }\n\n    public abstract boolean handleaza(Request req);\n\n    protected boolean continua(Request req) {\n        return urmator == null || urmator.handleaza(req);\n    }\n}\n\n// Implementeaza: AuthHandler, PermissionHandler, RateLimitHandler\nrecord Request(String token, String rol, int cereriPerMinut) {}",
        options: [],
        answer: "",
        explanation: "AuthHandler: if(!req.token().startsWith(\"Bearer\")) return false; return continua(req). PermissionHandler: if(!req.rol().equals(\"ADMIN\")) return false; return continua(req). RateLimitHandler: return req.cereriPerMinut() <= 100 && continua(req);",
        difficulty: "hard",
        expectedOutput: ""
      }
    ]
  },
  {
    slug: "java-spring-mini-project",
    title: "30. Mini Proiect Java — Aplicatie Spring Boot CRUD",
    order: 30,
    theory: [
      {
        order: 1,
        title: "Arhitectura aplicatiei — Layered Architecture",
        content: "O aplicatie Spring Boot profesionista urmareaza **Layered Architecture** (arhitectura pe straturi):\n\n```\n┌─────────────────────────────────┐\n│   Controller Layer (@RestController) │ ← HTTP requests/responses\n├─────────────────────────────────┤\n│   Service Layer (@Service)       │ ← Business logic\n├─────────────────────────────────┤\n│   Repository Layer (@Repository) │ ← Data access\n├─────────────────────────────────┤\n│   Database (PostgreSQL/H2)       │\n└─────────────────────────────────┘\n```\n\n**Structura proiect recomandata:**\n```\nsrc/main/java/com/example/app/\n├── AppApplication.java\n├── controller/\n│   ├── ProduseController.java\n│   └── UserController.java\n├── service/\n│   ├── ProduseService.java\n│   └── UserService.java\n├── repository/\n│   ├── ProduseRepository.java\n│   └── UserRepository.java\n├── entity/\n│   ├── Produs.java\n│   └── User.java\n├── dto/\n│   ├── ProdusCerere.java   ← input DTO\n│   └── ProdusRaspuns.java  ← output DTO\n├── exception/\n│   ├── NotFoundException.java\n│   └── GlobalExceptionHandler.java\n└── config/\n    └── SecurityConfig.java\n```\n\n**Regula de aur:** Controller nu stie de Repository, Service nu stie de HTTP. Fiecare strat are o singura responsabilitate.\n\n**Interview tip:** Mentioneaza separarea DTO-urilor: nu expui entitatea direct din controller — expui un DTO controlat (eviti over-fetching si probleme de securitate)."
      },
      {
        order: 2,
        title: "Implementarea completa CRUD — Entity, Repository, Service, Controller",
        content: "```java\n// Entity:\n@Entity @Table(name = \"produse\")\n@Getter @Setter @NoArgsConstructor\npublic class Produs {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n    @Column(nullable = false) private String nume;\n    @Column(nullable = false) private double pret;\n    private String descriere;\n\n    @CreationTimestamp private LocalDateTime creatLa;\n}\n\n// DTOs:\npublic record ProdusCerere(\n    @NotBlank String nume,\n    @Positive double pret,\n    String descriere\n) {}\n\npublic record ProdusRaspuns(Long id, String nume, double pret, String descriere) {\n    public static ProdusRaspuns din(Produs p) {\n        return new ProdusRaspuns(p.getId(), p.getNumele(), p.getPret(), p.getDescriere());\n    }\n}\n\n// Repository:\npublic interface ProduseRepository extends JpaRepository<Produs, Long> {\n    List<Produs> findByNumeContainingIgnoreCase(String termen);\n    List<Produs> findByPretLessThanEqual(double pretMax);\n}\n\n// Service:\n@Service @Transactional(readOnly = true)\npublic class ProduseService {\n    private final ProduseRepository repo;\n    public ProduseService(ProduseRepository repo) { this.repo = repo; }\n\n    public List<ProdusRaspuns> getAll() {\n        return repo.findAll().stream().map(ProdusRaspuns::din).toList();\n    }\n\n    public ProdusRaspuns getById(Long id) {\n        return repo.findById(id).map(ProdusRaspuns::din)\n            .orElseThrow(() -> new NotFoundException(\"Produs \" + id + \" negasit\"));\n    }\n\n    @Transactional\n    public ProdusRaspuns create(ProdusCerere cerere) {\n        Produs p = new Produs();\n        p.setNume(cerere.nume());\n        p.setPret(cerere.pret());\n        p.setDescriere(cerere.descriere());\n        return ProdusRaspuns.din(repo.save(p));\n    }\n\n    @Transactional\n    public ProdusRaspuns update(Long id, ProdusCerere cerere) {\n        Produs p = repo.findById(id)\n            .orElseThrow(() -> new NotFoundException(\"Produs \" + id + \" negasit\"));\n        p.setNume(cerere.nume());\n        p.setPret(cerere.pret());\n        p.setDescriere(cerere.descriere());\n        return ProdusRaspuns.din(repo.save(p));\n    }\n\n    @Transactional\n    public void delete(Long id) {\n        if (!repo.existsById(id))\n            throw new NotFoundException(\"Produs \" + id + \" negasit\");\n        repo.deleteById(id);\n    }\n}\n```"
      },
      {
        order: 3,
        title: "Controller, Exception Handler si Testare Integrare",
        content: "```java\n// Controller:\n@RestController @RequestMapping(\"/api/produse\")\npublic class ProduseController {\n    private final ProduseService service;\n    public ProduseController(ProduseService service) { this.service = service; }\n\n    @GetMapping\n    public List<ProdusRaspuns> getAll() { return service.getAll(); }\n\n    @GetMapping(\"/{id}\")\n    public ProdusRaspuns getById(@PathVariable Long id) { return service.getById(id); }\n\n    @PostMapping\n    public ResponseEntity<ProdusRaspuns> create(\n            @RequestBody @Valid ProdusCerere cerere,\n            UriComponentsBuilder ucb) {\n        ProdusRaspuns creat = service.create(cerere);\n        URI location = ucb.path(\"/api/produse/{id}\").buildAndExpand(creat.id()).toUri();\n        return ResponseEntity.created(location).body(creat);\n    }\n\n    @PutMapping(\"/{id}\")\n    public ProdusRaspuns update(\n            @PathVariable Long id,\n            @RequestBody @Valid ProdusCerere cerere) {\n        return service.update(id, cerere);\n    }\n\n    @DeleteMapping(\"/{id}\")\n    @ResponseStatus(HttpStatus.NO_CONTENT)\n    public void delete(@PathVariable Long id) { service.delete(id); }\n}\n\n// Test de integrare:\n@SpringBootTest @AutoConfigureMockMvc\nclass ProduseControllerTest {\n    @Autowired MockMvc mvc;\n    @Autowired ProduseRepository repo;\n\n    @Test\n    void createProdus_returns201() throws Exception {\n        mvc.perform(post(\"/api/produse\")\n                .contentType(MediaType.APPLICATION_JSON)\n                .content(\"{\\\"nume\\\":\\\"Laptop\\\",\\\"pret\\\":3500}\"))\n            .andExpect(status().isCreated())\n            .andExpect(jsonPath(\"$.id\").exists())\n            .andExpect(jsonPath(\"$.nume\").value(\"Laptop\"));\n    }\n\n    @Test\n    void getProdus_notFound_returns404() throws Exception {\n        mvc.perform(get(\"/api/produse/9999\"))\n            .andExpect(status().isNotFound());\n    }\n}\n```\n\n**Interview tip:** MockMvc e esential pentru testarea REST API-urilor. @SpringBootTest porneste tot contextul. Alternativa mai rapida: @WebMvcTest (doar controller layer)."
      },
      {
        order: 4,
        title: "Securitate, Paginare, CORS si Deployment",
        content: "**Paginare cu Spring Data:**\n```java\n// Repository:\nPage<Produs> findByPretLessThanEqual(double max, Pageable pageable);\n\n// Controller:\n@GetMapping\npublic Page<ProdusRaspuns> getAll(\n        @RequestParam(defaultValue = \"0\") int page,\n        @RequestParam(defaultValue = \"10\") int size,\n        @RequestParam(defaultValue = \"id\") String sortBy) {\n    Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));\n    return service.getAll(pageable);\n}\n// GET /api/produse?page=0&size=5&sortBy=pret\n\n// CORS:\n@Configuration\npublic class CorsConfig {\n    @Bean\n    public CorsConfigurationSource corsConfig() {\n        CorsConfiguration config = new CorsConfiguration();\n        config.setAllowedOrigins(List.of(\"https://frontend.com\"));\n        config.setAllowedMethods(List.of(\"GET\", \"POST\", \"PUT\", \"DELETE\"));\n        config.setAllowedHeaders(List.of(\"*\"));\n        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();\n        source.registerCorsConfiguration(\"/api/**\", config);\n        return source;\n    }\n}\n\n// Spring Security basic:\n@Bean\nSecurityFilterChain securityFilter(HttpSecurity http) throws Exception {\n    return http\n        .csrf(csrf -> csrf.disable())  // REST API nu are nevoie de CSRF\n        .authorizeHttpRequests(auth -> auth\n            .requestMatchers(HttpMethod.GET, \"/api/**\").permitAll()\n            .requestMatchers(\"/api/admin/**\").hasRole(\"ADMIN\")\n            .anyRequest().authenticated()\n        )\n        .httpBasic(Customizer.withDefaults())\n        .build();\n}\n\n// application.properties pentru deployment:\n// server.port=${PORT:8080}\n// spring.datasource.url=${DATABASE_URL}\n```\n\n**Interview tip:** In productie, foloseste JWT in loc de HTTP Basic. CORS trebuie configurat explicit — fara configurare, frontend-ul nu poate apela API-ul. Paginare e obligatorie pentru colectii mari."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "Layered Architecture",
        question: "De ce separarea in Controller, Service, Repository este importanta intr-o aplicatie Spring Boot?",
        options: [
          "E obligatorie tehnic",
          "Single Responsibility: fiecare strat are un singur rol — testabilitate, mentenabilitate, reusabilitate",
          "E mai rapida",
          "Reduce numarul de fisiere"
        ],
        answer: "Single Responsibility: fiecare strat are un singur rol — testabilitate, mentenabilitate, reusabilitate",
        explanation: "Controller: HTTP. Service: business logic (testabil fara HTTP). Repository: DB. Schimbi baza de date fara sa modifici Controller.",
        difficulty: "easy"
      },
      {
        number: 2,
        name: "DTO pattern",
        question: "De ce este recomandat sa folosesti DTO-uri (record-uri) in loc sa expui entitatea JPA direct din controller?",
        options: [
          "E mai rapid",
          "Controlezi ce date expui (eviti over-fetching), decuplezi API de schema DB, previi probleme de serializare circulara",
          "E obligatoriu in Spring",
          "Reduce numarul de query-uri"
        ],
        answer: "Controlezi ce date expui (eviti over-fetching), decuplezi API de schema DB, previi probleme de serializare circulara",
        explanation: "Entitatea poate contine parole, date interne. DTO = contract API explicit. Relatii @OneToMany pot cauza recursie infinita la serializare JSON.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "Paginare",
        question: "Ce problema rezolva paginarea (Pageable) in Spring Data JPA?",
        options: [
          "Viteza query-urilor",
          "Evita incarcarea tuturor datelor in memorie — returneaza subseturi controlate cu metadata (total, pagina curenta)",
          "Sortarea datelor",
          "Filtarea datelor"
        ],
        answer: "Evita incarcarea tuturor datelor in memorie — returneaza subseturi controlate cu metadata (total, pagina curenta)",
        explanation: "findAll() pe 10 milioane de randuri = OutOfMemoryError. PageRequest.of(0, 10) = primele 10 + metadata. Esential pentru orice API de productie.",
        difficulty: "medium"
      },
      {
        number: 4,
        name: "CORS",
        question: "Ce este CORS si de ce trebuie configurat in Spring Boot?",
        options: [
          "Un sistem de autentificare",
          "Mecanismul browserului care blocheaza request-uri cross-origin — Spring trebuie sa permita explicit originile frontend",
          "O vulnerabilitate de securitate",
          "Un tip de caching"
        ],
        answer: "Mecanismul browserului care blocheaza request-uri cross-origin — Spring trebuie sa permita explicit originile frontend",
        explanation: "frontend.com (port 3000) nu poate apela api.backend.com (port 8080) fara configurare CORS explicita. Browserul blocheaza, nu serverul.",
        difficulty: "medium"
      },
      {
        number: 5,
        name: "CRUD endpoints",
        question: "Completeaza tabelul CRUD: ce metoda HTTP si status code returnezi pentru fiecare operatiune?",
        options: [
          "GET/200, POST/200, PUT/200, DELETE/200",
          "GET/200, POST/201, PUT/200, DELETE/204",
          "GET/200, POST/202, PUT/201, DELETE/200",
          "GET/201, POST/200, PUT/200, DELETE/204"
        ],
        answer: "GET/200, POST/201, PUT/200, DELETE/204",
        explanation: "GET = 200 OK. POST = 201 Created (+ Location header). PUT = 200 OK (cu body) sau 204. DELETE = 204 No Content (fara body).",
        difficulty: "easy"
      },
      {
        number: 6,
        name: "Full CRUD Service",
        question: "Scrie metoda update() dintr-un ProductService care actualizeaza un produs existent sau arunca NotFoundException.",
        type: "coding",
        language: "java",
        starterCode: "@Service\npublic class ProduseService {\n    private final ProduseRepository repo;\n    public ProduseService(ProduseRepository repo) { this.repo = repo; }\n\n    @Transactional\n    public ProdusRaspuns update(Long id, ProdusCerere cerere) {\n        // gaseste produsul sau arunca NotFoundException\n        // actualizeaza campurile\n        // salveaza si returneaza DTO\n    }\n}",
        options: [],
        answer: "",
        explanation: "Produs p = repo.findById(id).orElseThrow(() -> new NotFoundException(\"..\")); p.setNume(cerere.nume()); p.setPret(cerere.pret()); return ProdusRaspuns.din(repo.save(p));",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 7,
        name: "MockMvc test",
        question: "Ce librarie/clasa folosesti in Spring Boot pentru testarea REST endpoint-urilor fara a porni serverul HTTP real?",
        options: [
          "RestTemplate",
          "MockMvc cu @WebMvcTest sau @SpringBootTest + @AutoConfigureMockMvc",
          "JUnit Assert",
          "Postman"
        ],
        answer: "MockMvc cu @WebMvcTest sau @SpringBootTest + @AutoConfigureMockMvc",
        explanation: "MockMvc simuleaza request-uri HTTP in memory. @WebMvcTest = test rapid doar controller layer. @SpringBootTest = test integrare completa.",
        difficulty: "medium"
      },
      {
        number: 8,
        name: "Integration test",
        question: "Scrie un test MockMvc care verifica ca GET /api/produse/{id} returneaza 404 pentru un ID inexistent.",
        type: "coding",
        language: "java",
        starterCode: "@SpringBootTest\n@AutoConfigureMockMvc\nclass ProduseControllerTest {\n\n    @Autowired\n    private MockMvc mvc;\n\n    @Test\n    void getById_notFound_returns404() throws Exception {\n        // GET /api/produse/9999, asteapta 404\n    }\n}",
        options: [],
        answer: "",
        explanation: "mvc.perform(get(\"/api/produse/9999\")).andExpect(status().isNotFound());",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 9,
        name: "readOnly transaction",
        question: "Ce optimizare ofera @Transactional(readOnly = true)?",
        options: [
          "Previne citirile",
          "Hibernate poate optimiza: nu face flush, nu urmareste dirty checking — mai rapid pentru query-uri read-only",
          "Adauga cache automat",
          "Nu exista diferenta fata de @Transactional"
        ],
        answer: "Hibernate poate optimiza: nu face flush, nu urmareste dirty checking — mai rapid pentru query-uri read-only",
        explanation: "readOnly=true: Hibernate nu face dirty checking la sfarsit (nu verifica ce s-a schimbat), flush mode NEVER. Potrivit pentru get/search.",
        difficulty: "hard"
      },
      {
        number: 10,
        name: "Page response",
        question: "Ce informatii contine un raspuns Page<T> din Spring Data?",
        options: [
          "Doar lista de elemente",
          "Lista de elemente + totalElements, totalPages, currentPage, hasNext, hasPrevious",
          "Doar totalul",
          "Lista + cursorul pentru urmatoarea pagina"
        ],
        answer: "Lista de elemente + totalElements, totalPages, currentPage, hasNext, hasPrevious",
        explanation: "Page<T> contine: content (elementele), pageable, total, metadata. Clientul stie cate pagini sunt si poate naviga.",
        difficulty: "easy"
      },
      {
        number: 11,
        name: "Spring Security CSRF",
        question: "De ce se dezactiveaza CSRF protection pentru REST API-uri Spring Boot?",
        options: [
          "E un bug in Spring",
          "REST API-urile folosesc JWT/token in header — nu cookies de sesiune — deci CSRF nu e aplicabil",
          "E mai rapid fara",
          "CSRF e pentru aplicatii mobile"
        ],
        answer: "REST API-urile folosesc JWT/token in header — nu cookies de sesiune — deci CSRF nu e aplicabil",
        explanation: "CSRF protejeaza impotriva request-urilor din alte domenii care reutilizeaza cookie-ul de sesiune. JWT in Authorization header nu e trimis automat de browser.",
        difficulty: "hard"
      },
      {
        number: 12,
        name: "Full controller coding",
        question: "Scrie un endpoint PUT /api/produse/{id} complet cu validare si gestionare 404.",
        type: "coding",
        language: "java",
        starterCode: "@RestController\n@RequestMapping(\"/api/produse\")\npublic class ProduseController {\n    private final ProduseService service;\n    public ProduseController(ProduseService service) { this.service = service; }\n\n    // PUT /{id} — actualizeaza produs, returneaza 200 sau 404\n    // ProdusCerere e validat cu @Valid\n}",
        options: [],
        answer: "",
        explanation: "@PutMapping(\"/{id}\") public ResponseEntity<ProdusRaspuns> update(@PathVariable Long id, @RequestBody @Valid ProdusCerere c) { return ResponseEntity.ok(service.update(id, c)); }",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 13,
        name: "Profile Spring",
        question: "Ce sunt Spring Profiles si cand le folosesti?",
        options: [
          "Profiluri de utilizator",
          "Configuratii diferite per mediu (dev/test/prod) — baza de date, logging, feature flags",
          "Cache profiles",
          "Thread profiles"
        ],
        answer: "Configuratii diferite per mediu (dev/test/prod) — baza de date, logging, feature flags",
        explanation: "application-dev.properties (H2 in-memory), application-prod.properties (PostgreSQL). Activat cu SPRING_PROFILES_ACTIVE=prod.",
        difficulty: "medium"
      },
      {
        number: 14,
        name: "existsById",
        question: "De ce repo.existsById(id) e preferat fata de repo.findById(id).isPresent() inainte de stergere?",
        options: [
          "Nu exista diferenta",
          "existsById genereaza SELECT COUNT(*) sau EXISTS — nu incarca toata entitatea in memorie",
          "existsById e mai nou",
          "findById nu merge pentru stergere"
        ],
        answer: "existsById genereaza SELECT COUNT(*) sau EXISTS — nu incarca toata entitatea in memorie",
        explanation: "findById incarca entitatea completa (toate campurile) doar pentru a verifica existenta. existsById e mai eficient.",
        difficulty: "medium"
      },
      {
        number: 15,
        name: "Full CRUD mini project",
        question: "Scrie o clasa completa Repository pentru entitatea Produs, cu metode: gasire dupa nume (case-insensitive), gasire dupa pret maxim si stergere logica (setare deletedAt).",
        type: "coding",
        language: "java",
        starterCode: "import org.springframework.data.jpa.repository.JpaRepository;\nimport org.springframework.data.jpa.repository.Modifying;\nimport org.springframework.data.jpa.repository.Query;\n\n// Entitate Produs are: id, nume, pret, deletedAt (LocalDateTime)\npublic interface ProduseRepository extends JpaRepository<Produs, Long> {\n    // 1. findByNumeContainingIgnoreCase\n    // 2. findByPretLessThanEqual\n    // 3. Soft delete — UPDATE produse SET deleted_at = NOW() WHERE id = :id\n}",
        options: [],
        answer: "",
        explanation: "List<Produs> findByNumeContainingIgnoreCase(String n); List<Produs> findByPretLessThanEqual(double max); @Modifying @Transactional @Query(\"UPDATE Produs p SET p.deletedAt = CURRENT_TIMESTAMP WHERE p.id = :id\") void softDelete(@Param(\"id\") Long id);",
        difficulty: "hard",
        expectedOutput: ""
      }
    ]
  }
];

module.exports = { javaExtra2 };
