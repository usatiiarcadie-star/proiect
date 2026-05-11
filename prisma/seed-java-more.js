// Java lessons 11-25
const javaMore = [
  {
    slug: "java",
    title: "Collections Framework",
    order: 11,
    theory: [
      {
        order: 1,
        title: "List, Set, and Map",
        content: `Java's Collections Framework provides rich data structures via interfaces and implementations.

\`\`\`java
import java.util.*;

// List - ordered, allows duplicates
List<String> list = new ArrayList<>();
list.add("Apple"); list.add("Banana"); list.add("Apple");
System.out.println(list.size()); // 3
list.remove("Apple"); // removes first occurrence

// LinkedList - efficient for insertions
LinkedList<Integer> linked = new LinkedList<>();
linked.addFirst(1); linked.addLast(2);

// Set - no duplicates
Set<String> set = new HashSet<>(Arrays.asList("a", "b", "a"));
System.out.println(set.size()); // 2

// LinkedHashSet - preserves insertion order
Set<String> ordered = new LinkedHashSet<>();
ordered.add("c"); ordered.add("a"); ordered.add("b");

// TreeSet - sorted
Set<Integer> sorted = new TreeSet<>(Arrays.asList(5, 1, 3));
System.out.println(sorted); // [1, 3, 5]
\`\`\``,
      },
      {
        order: 2,
        title: "Map Interface",
        content: `Maps store key-value pairs with unique keys.

\`\`\`java
// HashMap - no order guarantee
Map<String, Integer> scores = new HashMap<>();
scores.put("Alice", 90);
scores.put("Bob", 85);
scores.getOrDefault("Carol", 0); // 0

// Iterate
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

// LinkedHashMap - insertion order
Map<String, Integer> orderedMap = new LinkedHashMap<>();

// TreeMap - sorted by key
Map<String, Integer> sortedMap = new TreeMap<>(scores);

// Merge and compute
scores.merge("Alice", 5, Integer::sum); // Alice = 95
scores.compute("Bob", (k, v) -> v == null ? 1 : v + 10); // Bob = 95
\`\`\``,
      },
      {
        order: 3,
        title: "Queue, Deque, and Stack",
        content: `Specialized collections for ordered processing.

\`\`\`java
// Queue - FIFO
Queue<String> queue = new LinkedList<>();
queue.offer("first"); queue.offer("second");
System.out.println(queue.poll()); // "first"
System.out.println(queue.peek()); // "second" (doesn't remove)

// Deque - double-ended queue (stack and queue)
Deque<Integer> deque = new ArrayDeque<>();
deque.push(1); deque.push(2); // stack push (front)
deque.offer(3); // queue add (back)
System.out.println(deque.pop()); // 2 (LIFO from front)

// PriorityQueue - sorted by priority
PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.offer(5); pq.offer(1); pq.offer(3);
while (!pq.isEmpty()) System.out.print(pq.poll() + " "); // 1 3 5
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "ArrayList vs LinkedList",
        question: "When should you prefer `LinkedList` over `ArrayList`?",
        options: ["When you need fast random access", "When you frequently insert/remove at the beginning or middle", "When you need sorting", "LinkedList is always faster"],
        answer: "When you frequently insert/remove at the beginning or middle",
        explanation: "LinkedList has O(1) insertion/removal but O(n) access; ArrayList has O(1) access but O(n) insertion at middle.",
        difficulty: "medium",
      },
      {
        number: 2,
        name: "HashSet guarantee",
        question: "What does a `HashSet` guarantee about its elements?",
        options: ["Elements are sorted", "Elements are in insertion order", "No duplicate elements", "Elements are always non-null"],
        answer: "No duplicate elements",
        explanation: "HashSet uses hashing to enforce uniqueness — adding a duplicate is silently ignored.",
        difficulty: "easy",
      },
      {
        number: 3,
        name: "Map.getOrDefault",
        question: "What does `map.getOrDefault(\"key\", 0)` return when \"key\" doesn't exist?",
        options: ["null", "Throws exception", "0", "Empty string"],
        answer: "0",
        explanation: "getOrDefault returns the provided default value when the key is absent, avoiding null checks.",
        difficulty: "easy",
      },
      {
        number: 4,
        name: "PriorityQueue order",
        question: "In what order does a default `PriorityQueue` in Java poll elements?",
        options: ["FIFO (insertion order)", "LIFO (stack order)", "Natural ascending order (min-heap)", "Random order"],
        answer: "Natural ascending order (min-heap)",
        explanation: "Java's PriorityQueue is a min-heap by default — poll() always returns the smallest element.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "java",
    title: "Generics in Java",
    order: 12,
    theory: [
      {
        order: 1,
        title: "Generic Classes and Methods",
        content: `Generics provide compile-time type safety and eliminate casts.

\`\`\`java
// Generic class
public class Pair<A, B> {
    private A first;
    private B second;

    public Pair(A first, B second) {
        this.first = first;
        this.second = second;
    }

    public A getFirst() { return first; }
    public B getSecond() { return second; }

    @Override
    public String toString() {
        return "(" + first + ", " + second + ")";
    }
}

// Generic method
public static <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}

// Usage
Pair<String, Integer> p = new Pair<>("Alice", 30);
System.out.println(p);               // (Alice, 30)
System.out.println(max(5, 3));       // 5
System.out.println(max("apple", "banana")); // banana
\`\`\``,
      },
      {
        order: 2,
        title: "Bounded Type Parameters and Wildcards",
        content: `Bounds and wildcards control what types generics accept.

\`\`\`java
// Upper bound - T must extend Number
public static <T extends Number> double sum(List<T> list) {
    return list.stream().mapToDouble(Number::doubleValue).sum();
}

sum(List.of(1, 2, 3));         // works (Integer extends Number)
sum(List.of(1.5, 2.5, 3.0));   // works (Double extends Number)

// Wildcards
// ? extends T — read-only, accepts T and subtypes
public static double sumWild(List<? extends Number> list) {
    double total = 0;
    for (Number n : list) total += n.doubleValue();
    return total;
}

// ? super T — write, accepts T and supertypes
public static void addNumbers(List<? super Integer> list) {
    list.add(1); list.add(2);
}

// Unbounded wildcard
public static void printList(List<?> list) {
    list.forEach(System.out::println);
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Generic benefit",
        question: "What problem do Java generics primarily solve?",
        options: ["Memory management", "Type safety at compile time, eliminating runtime ClassCastExceptions", "Thread safety", "Faster execution"],
        answer: "Type safety at compile time, eliminating runtime ClassCastExceptions",
        explanation: "Generics allow the compiler to detect type mismatches early, eliminating the need for runtime casts.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "Upper bounded wildcard",
        question: "What does `List<? extends Number>` mean?",
        options: ["A list of exactly Number", "A list of Number or any supertype", "A list of Number or any subtype (Integer, Double, etc.)", "A list of any type"],
        answer: "A list of Number or any subtype (Integer, Double, etc.)",
        explanation: "`? extends Number` means the list contains Number or a subclass — use for reading.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "Type erasure",
        question: "What happens to generic type information at runtime in Java?",
        options: ["It is preserved as metadata", "It is erased — generics become raw types at bytecode level", "It is converted to Object[]", "It causes a compile error"],
        answer: "It is erased — generics become raw types at bytecode level",
        explanation: "Java uses type erasure — generic types are removed at runtime (replaced with Object or bounds), which is why instanceof on generic types doesn't work.",
        difficulty: "hard",
      },
    ],
  },
  {
    slug: "java",
    title: "Functional Programming and Streams",
    order: 13,
    theory: [
      {
        order: 1,
        title: "Lambda Expressions",
        content: `Java 8 introduced lambdas for concise functional-style code.

\`\`\`java
import java.util.function.*;

// Lambda syntax: (params) -> expression
Runnable run = () -> System.out.println("Hello");
run.run();

// With parameters
Comparator<String> byLength = (a, b) -> a.length() - b.length();

// Functional interfaces
Function<String, Integer> len = String::length;   // method reference
Function<Integer, Integer> double_ = x -> x * 2;

// Compose functions
Function<String, Integer> lenDoubled = len.andThen(double_);
System.out.println(lenDoubled.apply("Hello")); // 10

Predicate<String> isLong = s -> s.length() > 5;
Predicate<String> isLongAndUpper = isLong.and(s -> s.equals(s.toUpperCase()));

Consumer<String> print = System.out::println;
Supplier<List<String>> listFactory = ArrayList::new;
\`\`\``,
      },
      {
        order: 2,
        title: "Stream API",
        content: `Streams provide a functional pipeline for processing collections.

\`\`\`java
import java.util.stream.*;

List<String> names = List.of("Alice", "Bob", "Charlie", "Anna", "Brian");

// Filter + map + collect
List<String> result = names.stream()
    .filter(n -> n.startsWith("A"))
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toList());
// ["ALICE", "ANNA"]

// Reduction
int[] nums = {1, 2, 3, 4, 5};
int sum = IntStream.of(nums).sum(); // 15
OptionalInt max = IntStream.of(nums).max(); // 5

// Collectors
Map<Integer, List<String>> byLength = names.stream()
    .collect(Collectors.groupingBy(String::length));

String joined = names.stream()
    .collect(Collectors.joining(", ")); // "Alice, Bob, Charlie..."

long count = names.stream().filter(n -> n.length() > 4).count(); // 3
\`\`\``,
      },
      {
        order: 3,
        title: "Optional",
        content: `Optional<T> handles potentially absent values without null checks.

\`\`\`java
import java.util.Optional;

Optional<String> name = Optional.of("Alice");
Optional<String> empty = Optional.empty();
Optional<String> nullable = Optional.ofNullable(null); // empty

// Safe access
name.ifPresent(n -> System.out.println("Name: " + n));

String value = empty.orElse("Unknown");         // "Unknown"
String value2 = empty.orElseGet(() -> compute()); // lazy default
String value3 = empty.orElseThrow();             // throws NoSuchElementException

// Map and flatMap
Optional<Integer> length = name.map(String::length); // Optional[5]

// Stream integration
List<Optional<String>> optionals = List.of(name, empty);
List<String> present = optionals.stream()
    .filter(Optional::isPresent)
    .map(Optional::get)
    .collect(Collectors.toList());
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Lambda target type",
        question: "What Java feature do lambdas implement?",
        options: ["Abstract classes", "Functional interfaces (interfaces with a single abstract method)", "Generic interfaces", "Enum types"],
        answer: "Functional interfaces (interfaces with a single abstract method)",
        explanation: "A lambda is a concise implementation of a functional interface — any interface with exactly one abstract method.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "Stream terminal operation",
        question: "Which Stream operation actually triggers processing?",
        options: ["filter()", "map()", "collect()", "sorted()"],
        answer: "collect()",
        explanation: "Streams are lazy — filter/map/sorted are intermediate operations. Terminal operations like collect(), count(), forEach() trigger evaluation.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "Optional.orElse",
        question: "What does `Optional.empty().orElse(\"default\")` return?",
        options: ["null", "Throws exception", "\"default\"", "Optional[default]"],
        answer: "\"default\"",
        explanation: "orElse returns the provided value when the Optional is empty.",
        difficulty: "easy",
      },
      {
        number: 4,
        name: "Collectors.groupingBy",
        question: "What does `stream.collect(Collectors.groupingBy(String::length))` return?",
        options: ["A sorted list", "A map from string length to list of strings", "A set of unique lengths", "An IntStream"],
        answer: "A map from string length to list of strings",
        explanation: "groupingBy classifies elements into a Map<K, List<T>> based on the classifier function.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "java",
    title: "Exception Handling Advanced",
    order: 14,
    theory: [
      {
        order: 1,
        title: "Checked vs Unchecked Exceptions",
        content: `Java distinguishes between checked exceptions (must handle) and unchecked (runtime) exceptions.

\`\`\`java
// Checked exception - must declare or catch
public String readFile(String path) throws IOException {
    return Files.readString(Path.of(path));
}

// Unchecked (RuntimeException) - optional to handle
public int divide(int a, int b) {
    if (b == 0) throw new ArithmeticException("Division by zero");
    return a / b;
}

// Exception hierarchy
// Throwable
//   Error (JVM errors - don't catch)
//   Exception
//     IOException (checked)
//     RuntimeException (unchecked)
//       NullPointerException
//       IllegalArgumentException
//       ArrayIndexOutOfBoundsException

try {
    String content = readFile("data.txt");
} catch (IOException e) {
    System.err.println("File error: " + e.getMessage());
} finally {
    System.out.println("Always runs");
}
\`\`\``,
      },
      {
        order: 2,
        title: "Custom Exceptions and Multi-catch",
        content: `Create custom exceptions for domain-specific errors.

\`\`\`java
// Custom checked exception
public class InsufficientFundsException extends Exception {
    private final double amount;

    public InsufficientFundsException(double amount) {
        super("Insufficient funds: needed " + amount);
        this.amount = amount;
    }

    public double getAmount() { return amount; }
}

// Custom unchecked exception
public class ValidationException extends RuntimeException {
    public ValidationException(String field, String reason) {
        super("Validation failed for " + field + ": " + reason);
    }
}

// Multi-catch
try {
    riskyOperation();
} catch (IOException | SQLException e) {
    log.error("I/O or DB error", e);
} catch (InsufficientFundsException e) {
    notify("Not enough funds: " + e.getAmount());
}

// Try-with-resources (auto-close)
try (var reader = new BufferedReader(new FileReader("file.txt"))) {
    String line = reader.readLine();
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Checked vs unchecked",
        question: "What distinguishes a checked exception from an unchecked exception in Java?",
        options: [
          "Checked exceptions extend RuntimeException",
          "Checked exceptions must be declared with throws or caught; unchecked do not",
          "Unchecked exceptions can't be caught",
          "There is no practical difference",
        ],
        answer: "Checked exceptions must be declared with throws or caught; unchecked do not",
        explanation: "Checked exceptions (extending Exception but not RuntimeException) require explicit handling; unchecked (RuntimeException) do not.",
        difficulty: "medium",
      },
      {
        number: 2,
        name: "finally block",
        question: "When does the `finally` block execute?",
        options: ["Only when no exception is thrown", "Only when an exception is thrown", "Always, whether or not an exception occurs", "Only when catch block runs"],
        answer: "Always, whether or not an exception occurs",
        explanation: "finally always runs — it's used for cleanup (closing resources), though try-with-resources is now preferred.",
        difficulty: "easy",
      },
      {
        number: 3,
        name: "Try-with-resources",
        question: "What does try-with-resources automatically do when the block exits?",
        options: ["Catches all exceptions", "Calls close() on declared resources", "Logs the error", "Retries the operation"],
        answer: "Calls close() on declared resources",
        explanation: "Resources declared in try(...) are automatically closed at the end of the block, even if an exception occurs.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "java",
    title: "Multithreading Basics",
    order: 15,
    theory: [
      {
        order: 1,
        title: "Threads in Java",
        content: `Java supports multithreading natively via Thread and Runnable.

\`\`\`java
// Extending Thread
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Thread: " + getName());
    }
}

// Implementing Runnable (preferred)
Runnable task = () -> {
    for (int i = 0; i < 5; i++) {
        System.out.println(Thread.currentThread().getName() + ": " + i);
        try { Thread.sleep(100); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
};

Thread t1 = new Thread(task, "Worker-1");
Thread t2 = new Thread(task, "Worker-2");
t1.start();
t2.start();

// Wait for completion
t1.join();
t2.join();
System.out.println("Both done");
\`\`\``,
      },
      {
        order: 2,
        title: "Synchronization and Concurrency",
        content: `Use synchronization to protect shared state from race conditions.

\`\`\`java
// Race condition - bad
class Counter {
    private int count = 0;
    public void increment() { count++; } // NOT thread-safe
}

// Synchronized method - thread-safe
class SafeCounter {
    private int count = 0;
    public synchronized void increment() { count++; }
    public synchronized int get() { return count; }
}

// AtomicInteger - lock-free thread safety
import java.util.concurrent.atomic.AtomicInteger;
AtomicInteger atomic = new AtomicInteger(0);
atomic.incrementAndGet(); // thread-safe

// ExecutorService - thread pool
import java.util.concurrent.*;
ExecutorService pool = Executors.newFixedThreadPool(4);

for (int i = 0; i < 10; i++) {
    final int task = i;
    pool.submit(() -> System.out.println("Task " + task));
}
pool.shutdown();
pool.awaitTermination(5, TimeUnit.SECONDS);
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Thread start",
        question: "What method starts a new thread's execution?",
        options: ["run()", "execute()", "start()", "begin()"],
        answer: "start()",
        explanation: "start() creates a new thread and calls run() on it. Calling run() directly executes it on the current thread.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "synchronized keyword",
        question: "What does `synchronized` on a method guarantee?",
        options: ["The method runs faster", "Only one thread can execute the method at a time per object", "The method runs on a separate thread", "The method is final"],
        answer: "Only one thread can execute the method at a time per object",
        explanation: "synchronized acquires the object's intrinsic lock, preventing concurrent execution of synchronized methods on the same object.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "ExecutorService benefit",
        question: "Why use `ExecutorService` instead of creating threads manually?",
        options: ["It's the only way to run threads", "It manages a thread pool, reusing threads and limiting resource usage", "It automatically synchronizes code", "Manual threads don't work in Java"],
        answer: "It manages a thread pool, reusing threads and limiting resource usage",
        explanation: "Thread pools avoid the overhead of creating/destroying threads for each task and prevent thread explosion.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "java",
    title: "Design Patterns in Java",
    order: 16,
    theory: [
      {
        order: 1,
        title: "Creational Patterns",
        content: `Factory Method and Builder are the most used creational patterns.

\`\`\`java
// Factory Method
interface Notification {
    void send(String message);
}

class EmailNotification implements Notification {
    public void send(String message) {
        System.out.println("Email: " + message);
    }
}

class SmsNotification implements Notification {
    public void send(String message) {
        System.out.println("SMS: " + message);
    }
}

class NotificationFactory {
    public static Notification create(String type) {
        return switch (type) {
            case "email" -> new EmailNotification();
            case "sms" -> new SmsNotification();
            default -> throw new IllegalArgumentException("Unknown type: " + type);
        };
    }
}

// Builder
class HttpRequest {
    private final String url;
    private final String method;
    private final Map<String, String> headers;
    private final String body;

    private HttpRequest(Builder b) {
        this.url = b.url; this.method = b.method;
        this.headers = b.headers; this.body = b.body;
    }

    public static class Builder {
        private String url, method = "GET", body;
        private Map<String, String> headers = new HashMap<>();
        public Builder(String url) { this.url = url; }
        public Builder method(String m) { this.method = m; return this; }
        public Builder header(String k, String v) { headers.put(k, v); return this; }
        public Builder body(String b) { this.body = b; return this; }
        public HttpRequest build() { return new HttpRequest(this); }
    }
}

var request = new HttpRequest.Builder("https://api.example.com/data")
    .method("POST")
    .header("Content-Type", "application/json")
    .body("{\"key\":\"value\"}")
    .build();
\`\`\``,
      },
      {
        order: 2,
        title: "Structural and Behavioral Patterns",
        content: `Decorator adds behavior; Strategy encapsulates algorithms.

\`\`\`java
// Decorator Pattern
interface TextProcessor {
    String process(String text);
}

class PlainText implements TextProcessor {
    public String process(String text) { return text; }
}

class UpperCaseDecorator implements TextProcessor {
    private final TextProcessor wrapped;
    public UpperCaseDecorator(TextProcessor tp) { this.wrapped = tp; }
    public String process(String text) { return wrapped.process(text).toUpperCase(); }
}

class TrimDecorator implements TextProcessor {
    private final TextProcessor wrapped;
    public TrimDecorator(TextProcessor tp) { this.wrapped = tp; }
    public String process(String text) { return wrapped.process(text).trim(); }
}

TextProcessor processor = new UpperCaseDecorator(new TrimDecorator(new PlainText()));
System.out.println(processor.process("  hello world  ")); // "HELLO WORLD"

// Strategy Pattern
interface SortStrategy {
    void sort(int[] arr);
}

class QuickSort implements SortStrategy {
    public void sort(int[] arr) { /* quicksort */ }
}

class BubbleSort implements SortStrategy {
    public void sort(int[] arr) { /* bubblesort */ }
}

class Sorter {
    private SortStrategy strategy;
    public Sorter(SortStrategy strategy) { this.strategy = strategy; }
    public void setStrategy(SortStrategy s) { this.strategy = s; }
    public void sort(int[] arr) { strategy.sort(arr); }
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Factory Method purpose",
        question: "What problem does the Factory Method pattern solve?",
        options: [
          "Creating only one instance",
          "Creating objects without specifying the exact concrete class",
          "Composing complex objects step by step",
          "Notifying observers of changes",
        ],
        answer: "Creating objects without specifying the exact concrete class",
        explanation: "Factory Method decouples object creation from the caller — the caller gets an object without knowing which class was instantiated.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "Builder pattern return",
        question: "Why do Builder methods return `this`?",
        options: ["Performance optimization", "To enable method chaining (fluent interface)", "Required by Java specification", "To avoid creating new objects"],
        answer: "To enable method chaining (fluent interface)",
        explanation: "Returning `this` allows consecutive method calls to be chained: builder.method1().method2().build().",
        difficulty: "easy",
      },
      {
        number: 3,
        name: "Decorator vs Inheritance",
        question: "What advantage does Decorator have over inheritance for adding behavior?",
        options: ["Decorator is faster", "Decorators can be combined dynamically at runtime without changing classes", "Decorator requires less code", "Inheritance doesn't work in Java"],
        answer: "Decorators can be combined dynamically at runtime without changing classes",
        explanation: "Decorator composes behavior at runtime by wrapping objects, avoiding a class explosion that deep inheritance hierarchies cause.",
        difficulty: "hard",
      },
    ],
  },
  {
    slug: "java",
    title: "Java I/O and NIO",
    order: 17,
    theory: [
      {
        order: 1,
        title: "File I/O with java.nio.file",
        content: `Modern Java uses the NIO.2 API (java.nio.file) for file operations.

\`\`\`java
import java.nio.file.*;
import java.nio.charset.StandardCharsets;

Path file = Path.of("data.txt");

// Write
Files.writeString(file, "Hello, World!\\nLine 2");

// Read all text
String content = Files.readString(file);
System.out.println(content);

// Read lines
List<String> lines = Files.readAllLines(file);

// Append
Files.writeString(file, "\\nLine 3", StandardOpenOption.APPEND);

// Copy, move, delete
Files.copy(file, Path.of("backup.txt"), StandardCopyOption.REPLACE_EXISTING);
Files.move(file, Path.of("renamed.txt"));
Files.deleteIfExists(file);

// Check existence
boolean exists = Files.exists(file);
boolean isDir = Files.isDirectory(file);
long size = Files.size(file);
\`\`\``,
      },
      {
        order: 2,
        title: "Directory Operations and Walking",
        content: `List, walk, and search directory trees with NIO.2.

\`\`\`java
Path dir = Path.of("src");

// Create directories
Files.createDirectories(Path.of("a/b/c"));

// List directory contents
try (var stream = Files.list(dir)) {
    stream.filter(Files::isRegularFile)
          .forEach(System.out::println);
}

// Walk directory tree
try (var walk = Files.walk(dir)) {
    walk.filter(p -> p.toString().endsWith(".java"))
        .forEach(System.out::println);
}

// Find files
try (var found = Files.find(dir, 5, (path, attrs) ->
        attrs.isRegularFile() && path.toString().endsWith(".java"))) {
    found.forEach(System.out::println);
}

// Glob pattern
try (var ds = Files.newDirectoryStream(dir, "*.java")) {
    ds.forEach(System.out::println);
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Files.readString",
        question: "What does `Files.readString(Path.of(\"file.txt\"))` do?",
        options: ["Returns a BufferedReader", "Reads the entire file content as a String", "Reads only the first line", "Returns a Stream of lines"],
        answer: "Reads the entire file content as a String",
        explanation: "Files.readString() is a convenient NIO.2 method that reads the whole file into a String using UTF-8 by default.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "Files.walk",
        question: "What does `Files.walk(dir)` return?",
        options: ["A List of all paths", "A Stream<Path> lazily traversing the directory tree", "A DirectoryStream", "A recursive array"],
        answer: "A Stream<Path> lazily traversing the directory tree",
        explanation: "Files.walk returns a Stream<Path> that visits all files and directories recursively — it should be closed (use try-with-resources).",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "StandardOpenOption.APPEND",
        question: "What does `StandardOpenOption.APPEND` do in Files.writeString?",
        options: ["Creates a new file only", "Overwrites existing content", "Adds new content at the end of the file", "Locks the file"],
        answer: "Adds new content at the end of the file",
        explanation: "APPEND opens the file in append mode — new content is written after existing content rather than replacing it.",
        difficulty: "easy",
      },
    ],
  },
  {
    slug: "java",
    title: "JDBC and Database Access",
    order: 18,
    theory: [
      {
        order: 1,
        title: "JDBC Basics",
        content: `JDBC (Java Database Connectivity) provides a standard API for database access.

\`\`\`java
import java.sql.*;

// Connect to SQLite
String url = "jdbc:sqlite:app.db";

try (Connection conn = DriverManager.getConnection(url)) {
    // Create table
    String create = """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE
        )
        """;
    conn.createStatement().execute(create);

    // Insert with PreparedStatement (prevents SQL injection)
    String insert = "INSERT INTO users (name, email) VALUES (?, ?)";
    try (PreparedStatement ps = conn.prepareStatement(insert)) {
        ps.setString(1, "Alice");
        ps.setString(2, "alice@example.com");
        ps.executeUpdate();
    }

    // Query
    try (ResultSet rs = conn.createStatement()
                            .executeQuery("SELECT * FROM users")) {
        while (rs.next()) {
            System.out.printf("Id: %d, Name: %s%n",
                rs.getInt("id"), rs.getString("name"));
        }
    }
}
\`\`\``,
      },
      {
        order: 2,
        title: "Transactions and Connection Pooling",
        content: `Transactions ensure data consistency; connection pools improve performance.

\`\`\`java
// Transaction
try (Connection conn = DriverManager.getConnection(url)) {
    conn.setAutoCommit(false); // start transaction
    try {
        PreparedStatement debit = conn.prepareStatement(
            "UPDATE accounts SET balance = balance - ? WHERE id = ?");
        debit.setDouble(1, 100.0);
        debit.setInt(2, 1);
        debit.executeUpdate();

        PreparedStatement credit = conn.prepareStatement(
            "UPDATE accounts SET balance = balance + ? WHERE id = ?");
        credit.setDouble(1, 100.0);
        credit.setInt(2, 2);
        credit.executeUpdate();

        conn.commit(); // both succeed or both fail
    } catch (SQLException e) {
        conn.rollback(); // undo all changes
        throw e;
    }
}

// Connection pooling with HikariCP
// <dependency>com.zaxxer:HikariCP:5.x.x</dependency>
HikariConfig config = new HikariConfig();
config.setJdbcUrl("jdbc:postgresql://localhost/mydb");
config.setUsername("user"); config.setPassword("pass");
config.setMaximumPoolSize(10);
HikariDataSource dataSource = new HikariDataSource(config);
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "PreparedStatement benefit",
        question: "Why use `PreparedStatement` over `Statement` for queries with user input?",
        options: ["PreparedStatement is faster in all cases", "It prevents SQL injection by separating SQL from data", "It automatically logs queries", "It works with all databases"],
        answer: "It prevents SQL injection by separating SQL from data",
        explanation: "PreparedStatement parameterizes values (using ?) preventing malicious input from altering SQL structure.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "Transaction rollback",
        question: "What does `conn.rollback()` do in a JDBC transaction?",
        options: ["Commits the transaction", "Undoes all changes made since the last commit", "Closes the connection", "Retries the failed statement"],
        answer: "Undoes all changes made since the last commit",
        explanation: "rollback() reverses all operations done in the current transaction, maintaining data consistency.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "Connection pooling",
        question: "What problem does connection pooling (e.g., HikariCP) solve?",
        options: [
          "SQL syntax errors",
          "The overhead of creating a new database connection for every request",
          "Transaction management",
          "SQL injection attacks",
        ],
        answer: "The overhead of creating a new database connection for every request",
        explanation: "Creating DB connections is expensive. Pools maintain reusable connections, dramatically improving performance under load.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "java",
    title: "Spring Boot Basics",
    order: 19,
    theory: [
      {
        order: 1,
        title: "Spring Boot Introduction",
        content: `Spring Boot simplifies Spring applications with auto-configuration and embedded servers.

\`\`\`java
// pom.xml dependency
// <parent>org.springframework.boot:spring-boot-starter-parent:3.x</parent>
// <dependency>spring-boot-starter-web</dependency>

@SpringBootApplication
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}

// REST Controller
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    public List<User> getAll() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User create(@Valid @RequestBody CreateUserDto dto) {
        return userService.create(dto);
    }
}
\`\`\``,
      },
      {
        order: 2,
        title: "Spring DI and Data",
        content: `Spring manages beans with @Component, @Service, @Repository and Spring Data JPA.

\`\`\`java
// Service layer
@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) { // constructor injection
        this.repo = repo;
    }

    public List<User> findAll() { return repo.findAll(); }
    public Optional<User> findById(Long id) { return repo.findById(id); }
    public User create(CreateUserDto dto) {
        return repo.save(new User(dto.name(), dto.email()));
    }
}

// Spring Data JPA Repository
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByEmail(String email);
    List<User> findByNameContainingIgnoreCase(String name);
}

// Entity
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true) private String email;
}

// application.properties
// spring.datasource.url=jdbc:postgresql://localhost/mydb
// spring.jpa.hibernate.ddl-auto=update
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "@SpringBootApplication",
        question: "What does `@SpringBootApplication` enable?",
        options: ["Only component scanning", "Auto-configuration, component scanning, and configuration — all in one annotation", "Only REST endpoints", "Database connectivity"],
        answer: "Auto-configuration, component scanning, and configuration — all in one annotation",
        explanation: "@SpringBootApplication combines @EnableAutoConfiguration, @ComponentScan, and @Configuration.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "JpaRepository methods",
        question: "What does `JpaRepository` provide out of the box?",
        options: ["Only save() and delete()", "Full CRUD methods (findAll, findById, save, deleteById, etc.) without implementation", "Only read operations", "Only SQL query methods"],
        answer: "Full CRUD methods (findAll, findById, save, deleteById, etc.) without implementation",
        explanation: "Extending JpaRepository gives you complete CRUD and pagination without writing any SQL or implementation code.",
        difficulty: "easy",
      },
      {
        number: 3,
        name: "ResponseEntity usage",
        question: "When should you return `ResponseEntity<T>` instead of `T` from a controller?",
        options: ["Always", "When you need to control the HTTP status code or headers", "Only for error cases", "When the return type is void"],
        answer: "When you need to control the HTTP status code or headers",
        explanation: "ResponseEntity wraps the body and lets you set status codes, headers, and other HTTP response properties.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "java",
    title: "Java Records and Sealed Classes",
    order: 20,
    theory: [
      {
        order: 1,
        title: "Records",
        content: `Records (Java 16+) are immutable data carrier classes with auto-generated methods.

\`\`\`java
// Traditional class for data
class PersonOld {
    private final String name;
    private final int age;
    public PersonOld(String name, int age) { this.name = name; this.age = age; }
    public String getName() { return name; }
    public int getAge() { return age; }
    // equals, hashCode, toString auto-boilerplate...
}

// Record - same in one line
public record Person(String name, int age) {}

Person p = new Person("Alice", 30);
System.out.println(p.name()); // Alice (accessor, not getName())
System.out.println(p.age());  // 30
System.out.println(p);        // Person[name=Alice, age=30]

Person p2 = new Person("Alice", 30);
System.out.println(p.equals(p2)); // true (value equality)

// Compact constructor for validation
public record Range(int min, int max) {
    Range {
        if (min > max) throw new IllegalArgumentException("min > max");
    }
}
\`\`\``,
      },
      {
        order: 2,
        title: "Sealed Classes and Pattern Matching",
        content: `Sealed classes restrict which classes can extend them. Pattern matching (Java 21) extends switch.

\`\`\`java
// Sealed class hierarchy
public sealed interface Shape permits Circle, Rectangle, Triangle {}

public record Circle(double radius) implements Shape {}
public record Rectangle(double width, double height) implements Shape {}
public record Triangle(double base, double height) implements Shape {}

// Pattern matching switch (Java 21)
double area(Shape shape) {
    return switch (shape) {
        case Circle c    -> Math.PI * c.radius() * c.radius();
        case Rectangle r -> r.width() * r.height();
        case Triangle t  -> 0.5 * t.base() * t.height();
    }; // compiler ensures exhaustiveness
}

// Guarded patterns
String describe(Object obj) {
    return switch (obj) {
        case Integer i when i < 0 -> "negative int";
        case Integer i            -> "positive int: " + i;
        case String s when s.isEmpty() -> "empty string";
        case String s             -> "string: " + s;
        case null                 -> "null";
        default                   -> "other";
    };
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Record accessor name",
        question: "For `record Person(String name, int age)`, what is the accessor method for `name`?",
        options: ["getName()", "name()", "get(\"name\")", "name"],
        answer: "name()",
        explanation: "Record accessors match the component name (no 'get' prefix), so `name()` returns the name field.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "Sealed class purpose",
        question: "What does `sealed` on a class/interface guarantee?",
        options: ["The class is immutable", "Only explicitly listed classes can extend/implement it", "The class cannot be instantiated", "All subclasses must be records"],
        answer: "Only explicitly listed classes can extend/implement it",
        explanation: "Sealed types use `permits` to list allowed subtypes, enabling exhaustive pattern matching.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "Pattern matching exhaustiveness",
        question: "What benefit does a sealed hierarchy give when used in a switch expression?",
        options: ["Faster execution", "The compiler verifies all cases are covered — no default needed", "Automatic null safety", "Better memory usage"],
        answer: "The compiler verifies all cases are covered — no default needed",
        explanation: "Since the compiler knows all permitted subtypes, it can verify the switch is exhaustive and warn if a case is missing.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "java",
    title: "Unit Testing with JUnit 5",
    order: 21,
    theory: [
      {
        order: 1,
        title: "JUnit 5 Basics",
        content: `JUnit 5 is the standard testing framework for Java.

\`\`\`java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {

    private Calculator calc;

    @BeforeEach
    void setUp() {
        calc = new Calculator();
    }

    @Test
    void add_positiveNumbers_returnsSum() {
        assertEquals(7, calc.add(3, 4));
    }

    @Test
    void divide_byZero_throwsException() {
        assertThrows(ArithmeticException.class, () -> calc.divide(10, 0));
    }

    @Test
    @Disabled("not implemented yet")
    void multiply_negatives_returnsPositive() { }

    @ParameterizedTest
    @ValueSource(ints = {1, 2, 3, 4, 5})
    void isPositive_returnsTrue(int n) {
        assertTrue(n > 0);
    }

    @ParameterizedTest
    @CsvSource({"3,4,7", "-1,1,0", "0,0,0"})
    void add_multipleInputs(int a, int b, int expected) {
        assertEquals(expected, calc.add(a, b));
    }
}
\`\`\``,
      },
      {
        order: 2,
        title: "Mockito",
        content: `Mockito creates test doubles to isolate the unit under test.

\`\`\`java
import org.mockito.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository repo;

    @InjectMocks
    private UserService service;

    @Test
    void findById_existingUser_returnsUser() {
        User user = new User(1L, "Alice", "alice@example.com");
        when(repo.findById(1L)).thenReturn(Optional.of(user));

        Optional<User> result = service.findById(1L);

        assertTrue(result.isPresent());
        assertEquals("Alice", result.get().getName());
        verify(repo, times(1)).findById(1L);
    }

    @Test
    void create_validDto_savesUser() {
        var dto = new CreateUserDto("Bob", "bob@example.com");
        var expected = new User(2L, "Bob", "bob@example.com");
        when(repo.save(any(User.class))).thenReturn(expected);

        User created = service.create(dto);

        assertEquals("Bob", created.getName());
        verify(repo).save(any(User.class));
    }
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "@BeforeEach purpose",
        question: "When does a method annotated with `@BeforeEach` run?",
        options: ["Once before all tests in the class", "Before each individual test method", "Only before the first test", "After each test"],
        answer: "Before each individual test method",
        explanation: "@BeforeEach resets state before each test, ensuring test isolation.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "Mockito when/thenReturn",
        question: "What does `when(repo.findById(1L)).thenReturn(Optional.of(user))` do?",
        options: ["Calls the real findById method", "Stubs the mock to return Optional.of(user) when findById(1L) is called", "Verifies findById was called", "Creates a new repository"],
        answer: "Stubs the mock to return Optional.of(user) when findById(1L) is called",
        explanation: "when/thenReturn configures mock behavior — when the specified method is called, return the specified value.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "@ParameterizedTest",
        question: "What is the advantage of `@ParameterizedTest` over separate `@Test` methods?",
        options: [
          "Parameterized tests run faster",
          "Run the same test logic with multiple inputs, reducing code duplication",
          "They don't require assertions",
          "Only parameterized tests can use @BeforeEach",
        ],
        answer: "Run the same test logic with multiple inputs, reducing code duplication",
        explanation: "Parameterized tests allow one test method to be run with different data sets via @ValueSource, @CsvSource, etc.",
        difficulty: "easy",
      },
    ],
  },
  {
    slug: "java",
    title: "Java Performance and Best Practices",
    order: 22,
    theory: [
      {
        order: 1,
        title: "String Performance",
        content: `Strings are immutable in Java — understand the performance implications.

\`\`\`java
// String concatenation in a loop - creates many objects
String result = "";
for (int i = 0; i < 1000; i++) {
    result += i; // O(n²) - BAD for large loops
}

// StringBuilder - mutable, use in loops
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i); // O(n) - GOOD
}
String result2 = sb.toString();

// String.join and Collectors.joining for collections
String csv = String.join(", ", "Alice", "Bob", "Carol");
String joined = List.of("a", "b", "c").stream()
    .collect(Collectors.joining(", ", "[", "]")); // [a, b, c]

// String.format vs formatted (Java 15+)
String msg = "Hello, %s! You are %d years old.".formatted("Alice", 30);

// Text blocks (Java 15+)
String json = """
    {
        "name": "Alice",
        "age": 30
    }
    """;
\`\`\``,
      },
      {
        order: 2,
        title: "Memory Management and Profiling",
        content: `Understand the JVM memory model and common memory issues.

\`\`\`java
// Stack vs Heap
void method() {
    int x = 5;          // stack - primitive
    String s = "hello"; // stack ref -> heap object (String pool)
    Object o = new Object(); // stack ref -> heap object
}

// Memory leak example (static collection that grows)
static List<byte[]> leakList = new ArrayList<>();
void causingLeak() {
    leakList.add(new byte[1024 * 1024]); // never cleared!
}

// Use try-with-resources for I/O (prevents resource leak)
try (var in = new FileInputStream("file.txt")) {
    // use it
}

// Weak references for caches
WeakHashMap<Key, Value> cache = new WeakHashMap<>();

// JVM flags for monitoring
// java -Xmx512m -Xms256m -verbose:gc App
// java -XX:+PrintGCDetails App

// jmap -heap <pid>  -- show heap usage
// jconsole          -- visual monitoring
\`\`\``,
      },
      {
        order: 3,
        title: "Best Practices Checklist",
        content: `Key Java best practices for production-quality code.

\`\`\`java
// 1. Use final for constants and immutable fields
private static final int MAX_SIZE = 100;
private final String name;

// 2. Prefer interfaces over concrete types
List<String> list = new ArrayList<>();   // good
ArrayList<String> list2 = new ArrayList<>(); // avoid

// 3. Override equals and hashCode together
@Override public boolean equals(Object o) { ... }
@Override public int hashCode() { ... }

// 4. Use var for obvious types (Java 10+)
var users = new ArrayList<User>();
var count = users.stream().count();

// 5. Avoid null - use Optional or empty collections
Optional<User> findUser(long id) { ... }
List<User> findUsers() { return Collections.emptyList(); } // not null

// 6. Validate inputs early
public void setAge(int age) {
    if (age < 0 || age > 150) throw new IllegalArgumentException("Invalid age: " + age);
    this.age = age;
}

// 7. Close resources with try-with-resources
// 8. Don't swallow exceptions
catch (Exception e) { log.error("Failed", e); } // log it!
// not: catch (Exception e) {}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "StringBuilder usage",
        question: "Why is `StringBuilder` preferred over `+` concatenation in loops?",
        options: ["StringBuilder has more methods", "StringBuilder is mutable — avoids creating new String objects per iteration (O(n) vs O(n²))", "Strings cannot be concatenated in Java", "StringBuilder is thread-safe"],
        answer: "StringBuilder is mutable — avoids creating new String objects per iteration (O(n) vs O(n²))",
        explanation: "String + in a loop creates a new String object each iteration. StringBuilder appends in-place, which is O(n) total.",
        difficulty: "medium",
      },
      {
        number: 2,
        name: "Memory leak cause",
        question: "What is a common cause of memory leaks in Java despite garbage collection?",
        options: ["Using too many threads", "Holding references to objects in static or long-lived collections that are never cleared", "Using too many String objects", "Calling System.gc() too often"],
        answer: "Holding references to objects in static or long-lived collections that are never cleared",
        explanation: "GC collects unreachable objects. If you keep references (e.g., in a static List), objects are always reachable and never collected.",
        difficulty: "hard",
      },
      {
        number: 3,
        name: "Prefer interface",
        question: "Why declare `List<String> list = new ArrayList<>()` instead of `ArrayList<String> list`?",
        options: ["Performance", "To program to an interface — easier to switch implementations later", "ArrayList is deprecated", "List has more methods"],
        answer: "To program to an interface — easier to switch implementations later",
        explanation: "Declaring as List lets you swap implementations (LinkedList, unmodifiableList, etc.) without changing all usages.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "java",
    title: "Java Project: Library Management System",
    order: 23,
    theory: [
      {
        order: 1,
        title: "Project Overview",
        content: `Build a Library Management System combining collections, streams, design patterns, and file I/O.

\`\`\`
LibraryApp/
├── model/
│   ├── Book.java       (record)
│   ├── Member.java     (record)
│   └── Loan.java       (record)
├── repository/
│   ├── BookRepository.java
│   └── LoanRepository.java
├── service/
│   └── LibraryService.java
├── util/
│   └── CsvExporter.java
└── App.java
\`\`\``,
      },
      {
        order: 2,
        title: "Core Models and Repository",
        content: `\`\`\`java
// Models using Records
public record Book(String isbn, String title, String author, int year) {}
public record Member(String id, String name, String email) {}
public record Loan(String loanId, Book book, Member member, LocalDate dueDate) {}

// BookRepository
public class BookRepository {
    private final Map<String, Book> books = new HashMap<>();

    public void add(Book book) { books.put(book.isbn(), book); }
    public Optional<Book> findByIsbn(String isbn) {
        return Optional.ofNullable(books.get(isbn));
    }
    public List<Book> findByAuthor(String author) {
        return books.values().stream()
            .filter(b -> b.author().equalsIgnoreCase(author))
            .collect(Collectors.toList());
    }
    public List<Book> searchByTitle(String keyword) {
        return books.values().stream()
            .filter(b -> b.title().toLowerCase().contains(keyword.toLowerCase()))
            .sorted(Comparator.comparing(Book::title))
            .collect(Collectors.toList());
    }
    public List<Book> getAll() { return new ArrayList<>(books.values()); }
}
\`\`\``,
      },
      {
        order: 3,
        title: "Service and File Export",
        content: `\`\`\`java
// LibraryService
public class LibraryService {
    private final BookRepository bookRepo;
    private final LoanRepository loanRepo;

    public LibraryService(BookRepository b, LoanRepository l) {
        this.bookRepo = b; this.loanRepo = l;
    }

    public Loan checkout(String isbn, String memberId, int daysToReturn) {
        var book = bookRepo.findByIsbn(isbn)
            .orElseThrow(() -> new IllegalArgumentException("Book not found: " + isbn));
        if (loanRepo.isLoaned(isbn))
            throw new IllegalStateException("Book is already on loan");
        var member = memberRepo.findById(memberId)
            .orElseThrow(() -> new IllegalArgumentException("Member not found"));
        var loan = new Loan(UUID.randomUUID().toString(), book, member,
                            LocalDate.now().plusDays(daysToReturn));
        loanRepo.add(loan);
        return loan;
    }

    public List<Loan> getOverdueLoans() {
        return loanRepo.getAll().stream()
            .filter(l -> l.dueDate().isBefore(LocalDate.now()))
            .sorted(Comparator.comparing(Loan::dueDate))
            .collect(Collectors.toList());
    }

    public Map<String, Long> getBooksPerAuthor() {
        return bookRepo.getAll().stream()
            .collect(Collectors.groupingBy(Book::author, Collectors.counting()));
    }
}

// CSV Export
public class CsvExporter {
    public static void exportBooks(List<Book> books, Path path) throws IOException {
        var lines = new ArrayList<String>();
        lines.add("ISBN,Title,Author,Year");
        books.forEach(b -> lines.add(
            String.join(",", b.isbn(), b.title(), b.author(), String.valueOf(b.year()))));
        Files.write(path, lines);
    }
}
\`\`\``,
      },
      {
        order: 4,
        title: "Main App and Testing",
        content: `\`\`\`java
// App.java
public class App {
    public static void main(String[] args) throws IOException {
        var bookRepo = new BookRepository();
        var loanRepo = new LoanRepository();
        var service = new LibraryService(bookRepo, loanRepo);

        // Seed data
        bookRepo.add(new Book("978-0-13-468599-1", "Effective Java", "Joshua Bloch", 2018));
        bookRepo.add(new Book("978-0-201-63361-0", "Design Patterns", "GoF", 1994));

        // Search
        var javaBooks = bookRepo.searchByTitle("java");
        System.out.println("Java books: " + javaBooks.size());

        // Export
        CsvExporter.exportBooks(bookRepo.getAll(), Path.of("books.csv"));
        System.out.println("Exported to books.csv");
    }
}

// Test
@Test
void searchByTitle_caseInsensitive_returnsMatches() {
    var repo = new BookRepository();
    repo.add(new Book("123", "Java in Action", "Authors", 2020));
    repo.add(new Book("456", "Python Cookbook", "Author", 2019));

    var results = repo.searchByTitle("java");
    assertEquals(1, results.size());
    assertEquals("Java in Action", results.get(0).title());
}
\`\`\`

Key concepts combined:
- **Records** for immutable domain models
- **Optional** for null-safe lookups
- **Streams + Collectors** for data processing
- **Generics** in repositories
- **NIO.2** for file export
- **JUnit 5** for testing`,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Repository pattern",
        question: "What is the purpose of the Repository pattern?",
        options: ["To run background tasks", "To abstract data access — service layer doesn't know how data is stored", "To replace the service layer", "To manage HTTP requests"],
        answer: "To abstract data access — service layer doesn't know how data is stored",
        explanation: "Repositories encapsulate data storage (in-memory, DB, file) behind an interface, keeping service logic clean.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "Stream groupingBy in project",
        question: "What does `Collectors.groupingBy(Book::author, Collectors.counting())` return?",
        options: ["A sorted list of authors", "A Map from author name to count of their books", "A set of unique authors", "A list of book counts"],
        answer: "A Map from author name to count of their books",
        explanation: "groupingBy with counting() downstream collector produces Map<String, Long> mapping each author to their book count.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "orElseThrow",
        question: "What does `Optional.orElseThrow(() -> new IllegalArgumentException(\"not found\"))` do?",
        options: ["Returns null if empty", "Returns the value or throws the given exception if empty", "Always throws an exception", "Logs a warning"],
        answer: "Returns the value or throws the given exception if empty",
        explanation: "orElseThrow returns the value if present, or throws the supplied exception — great for 'not found' scenarios.",
        difficulty: "easy",
      },
      {
        number: 4,
        name: "UUID for IDs",
        question: "Why use `UUID.randomUUID().toString()` for loan IDs?",
        options: ["UUIDs are shorter than integers", "UUIDs are globally unique — no coordination needed between systems", "UUIDs are required by Java", "Integers can't be used as IDs"],
        answer: "UUIDs are globally unique — no coordination needed between systems",
        explanation: "UUIDs (128-bit) are statistically unique across distributed systems without needing a central ID counter.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "java",
    title: "Virtual Threads and Modern Java",
    order: 24,
    theory: [
      {
        order: 1,
        title: "Virtual Threads (Java 21)",
        content: `Virtual threads (Project Loom) enable massive concurrency without thread pool tuning.

\`\`\`java
// Traditional platform thread - OS-level, expensive (~1MB stack)
Thread platform = new Thread(() -> doWork());

// Virtual thread - JVM-managed, very lightweight (~few KB)
Thread virtual = Thread.ofVirtual().start(() -> doWork());

// Create many virtual threads easily
for (int i = 0; i < 100_000; i++) {
    Thread.ofVirtual().start(() -> {
        Thread.sleep(Duration.ofMillis(100));
        System.out.println("Done: " + Thread.currentThread());
    });
}

// Virtual thread executor (recommended for servers)
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 1000; i++) {
        final int taskId = i;
        executor.submit(() -> handleRequest(taskId));
    }
}

// Spring Boot 3.2+ - enable virtual threads
// spring.threads.virtual.enabled=true
\`\`\``,
      },
      {
        order: 2,
        title: "Structured Concurrency and Sequenced Collections",
        content: `Java 21 structured concurrency and new collection features.

\`\`\`java
// Structured Concurrency (Java 21 preview)
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Future<User> user = scope.fork(() -> userService.fetch(id));
    Future<Orders> orders = scope.fork(() -> orderService.fetch(id));

    scope.join().throwIfFailed();
    return new UserWithOrders(user.get(), orders.get());
}
// All subtasks are bounded to the scope's lifetime

// Sequenced Collections (Java 21)
SequencedCollection<String> seq = new ArrayList<>(List.of("a", "b", "c"));
System.out.println(seq.getFirst()); // "a"
System.out.println(seq.getLast());  // "c"
seq.addFirst("z"); // ["z", "a", "b", "c"]
seq.reversed().forEach(System.out::println); // c b a z

SequencedMap<String, Integer> seqMap = new LinkedHashMap<>();
seqMap.put("one", 1); seqMap.put("two", 2);
System.out.println(seqMap.firstEntry()); // one=1
\`\`\``,
      },
      {
        order: 3,
        title: "Record Patterns and Modern Switch",
        content: `Java 21 enhances pattern matching with record patterns.

\`\`\`java
sealed interface Expr permits Num, Add, Mul {}
record Num(int value) implements Expr {}
record Add(Expr left, Expr right) implements Expr {}
record Mul(Expr left, Expr right) implements Expr {}

// Record pattern matching (Java 21)
int eval(Expr expr) {
    return switch (expr) {
        case Num(var v)          -> v;
        case Add(var l, var r)   -> eval(l) + eval(r);
        case Mul(var l, var r)   -> eval(l) * eval(r);
    };
}

int result = eval(new Add(new Num(3), new Mul(new Num(2), new Num(4)))); // 11

// String templates (Java 21 preview — now JEP 465)
String name = "Alice";
int age = 30;
String msg = STR."Hello, \{name}! You are \{age} years old.";
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Virtual thread advantage",
        question: "What is the main advantage of virtual threads over platform threads?",
        options: ["Virtual threads are faster for CPU-intensive tasks", "They are extremely lightweight — you can create millions for I/O-heavy workloads", "They automatically synchronize code", "They replace the need for async/await"],
        answer: "They are extremely lightweight — you can create millions for I/O-heavy workloads",
        explanation: "Virtual threads consume far less memory than OS threads, enabling thread-per-request models for high-concurrency I/O-bound applications.",
        difficulty: "medium",
      },
      {
        number: 2,
        name: "Structured concurrency benefit",
        question: "What does structured concurrency ensure about subtask lifetimes?",
        options: ["Subtasks run sequentially", "Subtasks are bounded to their parent scope — all complete or fail together", "Subtasks run forever", "Subtasks create platform threads"],
        answer: "Subtasks are bounded to their parent scope — all complete or fail together",
        explanation: "Structured concurrency prevents subtask leaks — when the scope exits, all forked tasks are completed or cancelled.",
        difficulty: "hard",
      },
      {
        number: 3,
        name: "SequencedCollection",
        question: "What does `SequencedCollection` provide that regular `Collection` does not?",
        options: ["Sorting", "Indexed access", "getFirst(), getLast(), addFirst(), reversed()", "Thread safety"],
        answer: "getFirst(), getLast(), addFirst(), reversed()",
        explanation: "SequencedCollection adds ordered access (first/last) and reversals to collections that have a defined encounter order.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "java",
    title: "Java Advanced Project: REST API with Spring Boot",
    order: 25,
    theory: [
      {
        order: 1,
        title: "Complete Spring Boot REST API",
        content: `Build a production-ready REST API with Spring Boot 3, Spring Data JPA, and validation.

\`\`\`
BookstoreApi/
├── src/main/java/com/example/bookstore/
│   ├── BookstoreApplication.java
│   ├── model/Book.java
│   ├── dto/
│   │   ├── CreateBookDto.java
│   │   └── BookResponseDto.java
│   ├── repository/BookRepository.java
│   ├── service/BookService.java
│   ├── controller/BookController.java
│   └── exception/GlobalExceptionHandler.java
└── src/test/java/com/example/bookstore/
    └── BookControllerTest.java
\`\`\``,
      },
      {
        order: 2,
        title: "Model, DTOs, and Controller",
        content: `\`\`\`java
// Model
@Entity
public class Book {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String title;
    @Column(nullable = false) private String author;
    @Column(unique = true) private String isbn;
    private double price;
    // getters, setters, constructors...
}

// DTOs (Records)
public record CreateBookDto(
    @NotBlank String title,
    @NotBlank String author,
    @NotBlank String isbn,
    @Positive double price
) {}

public record BookResponseDto(Long id, String title, String author, String isbn, double price) {
    public static BookResponseDto from(Book b) {
        return new BookResponseDto(b.getId(), b.getTitle(), b.getAuthor(), b.getIsbn(), b.getPrice());
    }
}

// Controller
@RestController
@RequestMapping("/api/v1/books")
public class BookController {
    private final BookService service;
    public BookController(BookService service) { this.service = service; }

    @GetMapping
    public List<BookResponseDto> getAll(
        @RequestParam(required = false) String author) {
        return author != null
            ? service.findByAuthor(author)
            : service.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookResponseDto create(@Valid @RequestBody CreateBookDto dto) {
        return service.create(dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
\`\`\``,
      },
      {
        order: 3,
        title: "Exception Handling and Testing",
        content: `\`\`\`java
// Global Exception Handler
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleNotFound(NoSuchElementException e) {
        return Map.of("error", e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleValidation(MethodArgumentNotValidException e) {
        var errors = e.getBindingResult().getFieldErrors()
            .stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                fe -> fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "invalid"
            ));
        return Map.of("errors", errors);
    }
}

// Integration Test
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BookControllerTest {
    @Autowired private TestRestTemplate rest;

    @Test
    void createBook_validDto_returns201() {
        var dto = new CreateBookDto("Clean Code", "Robert Martin", "978-0-13-235088-4", 35.99);
        var response = rest.postForEntity("/api/v1/books", dto, BookResponseDto.class);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody().id());
    }
}
\`\`\``,
      },
      {
        order: 4,
        title: "Summary: Java Learning Path",
        content: `You have completed the Java learning path. Here's what you've mastered:

| Topic | Key Concepts |
|-------|-------------|
| OOP | Classes, inheritance, interfaces, abstract |
| Collections | List, Set, Map, Queue, generics |
| Functional | Lambdas, Streams, Optional |
| Concurrency | Threads, sync, ExecutorService, virtual threads |
| Patterns | Factory, Builder, Decorator, Strategy |
| I/O | NIO.2, JDBC, transactions |
| Spring Boot | REST APIs, JPA, DI, validation |
| Testing | JUnit 5, Mockito, integration tests |
| Modern Java | Records, sealed classes, pattern matching |

**Recommended next steps:**
- Spring Security for authentication
- Spring Cloud for microservices
- Apache Kafka for event-driven architecture
- Docker + Kubernetes for deployment`,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "@RestControllerAdvice purpose",
        question: "What does `@RestControllerAdvice` do?",
        options: [
          "Creates a REST controller",
          "Provides centralized exception handling for all controllers",
          "Injects dependencies automatically",
          "Validates request bodies",
        ],
        answer: "Provides centralized exception handling for all controllers",
        explanation: "@RestControllerAdvice with @ExceptionHandler methods catches exceptions from any controller, returning consistent error responses.",
        difficulty: "medium",
      },
      {
        number: 2,
        name: "@Valid annotation",
        question: "What does `@Valid` on a `@RequestBody` parameter do?",
        options: ["Logs the request", "Triggers Bean Validation on the DTO fields", "Converts JSON automatically", "Requires authentication"],
        answer: "Triggers Bean Validation on the DTO fields",
        explanation: "@Valid activates Jakarta Bean Validation — @NotBlank, @Positive, etc. annotations on the DTO are enforced.",
        difficulty: "easy",
      },
      {
        number: 3,
        name: "Integration vs unit test",
        question: "What makes `@SpringBootTest` an integration test rather than a unit test?",
        options: ["It uses JUnit 5", "It starts the full Spring context and can hit a real HTTP port", "It uses Mockito", "It runs faster"],
        answer: "It starts the full Spring context and can hit a real HTTP port",
        explanation: "@SpringBootTest loads the entire application context and optionally starts an HTTP server, testing all layers together.",
        difficulty: "medium",
      },
      {
        number: 4,
        name: "Record DTO benefit",
        question: "Why are Records well-suited as DTOs?",
        options: ["Records have JPA annotations built-in", "Records are immutable and provide equals/hashCode/toString automatically", "Records are faster than classes", "Records can be serialized to XML only"],
        answer: "Records are immutable and provide equals/hashCode/toString automatically",
        explanation: "DTOs are data carriers that shouldn't change — records enforce immutability and auto-generate all boilerplate.",
        difficulty: "easy",
      },
    ],
  },
];

module.exports = { javaMore };
