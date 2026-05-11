// C# lessons 16-25
const csharpMore = [
  {
    slug: "csharp",
    title: "LINQ Fundamentals",
    order: 16,
    theory: [
      {
        order: 1,
        title: "What is LINQ?",
        content: `LINQ (Language Integrated Query) allows querying collections using SQL-like syntax directly in C#.

\`\`\`csharp
using System.Linq;

int[] numbers = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// Query syntax
var evens = from n in numbers
            where n % 2 == 0
            select n;

// Method syntax
var evens2 = numbers.Where(n => n % 2 == 0);

foreach (var n in evens)
    Console.WriteLine(n); // 2 4 6 8 10
\`\`\``,
      },
      {
        order: 2,
        title: "Common LINQ Methods",
        content: `LINQ provides many powerful extension methods for collections.

\`\`\`csharp
var names = new List<string> { "Alice", "Bob", "Charlie", "Anna", "Brian" };

// Filter, transform, sort
var result = names
    .Where(n => n.StartsWith("A"))
    .Select(n => n.ToUpper())
    .OrderBy(n => n)
    .ToList();
// ["ALICE", "ANNA"]

// Aggregation
int[] scores = { 80, 90, 75, 95, 85 };
Console.WriteLine(scores.Max());    // 95
Console.WriteLine(scores.Min());    // 75
Console.WriteLine(scores.Average()); // 85
Console.WriteLine(scores.Sum());    // 425
Console.WriteLine(scores.Count());  // 5
\`\`\``,
      },
      {
        order: 3,
        title: "LINQ with Objects",
        content: `LINQ is especially powerful when working with collections of objects.

\`\`\`csharp
class Student {
    public string Name { get; set; }
    public int Grade { get; set; }
    public string Subject { get; set; }
}

var students = new List<Student> {
    new Student { Name = "Alice", Grade = 90, Subject = "Math" },
    new Student { Name = "Bob",   Grade = 75, Subject = "Science" },
    new Student { Name = "Carol", Grade = 85, Subject = "Math" },
    new Student { Name = "Dave",  Grade = 92, Subject = "Science" }
};

// GroupBy
var bySubject = students.GroupBy(s => s.Subject);
foreach (var group in bySubject) {
    Console.WriteLine($"{group.Key}: avg {group.Average(s => s.Grade):F1}");
}

// First, FirstOrDefault
var topStudent = students.OrderByDescending(s => s.Grade).First();
Console.WriteLine(topStudent.Name); // Dave

// Any, All
bool anyFail = students.Any(s => s.Grade < 60);     // false
bool allPass = students.All(s => s.Grade >= 70);     // true
\`\`\``,
      },
      {
        order: 4,
        title: "Projection and Anonymous Types",
        content: `Select can project data into new shapes including anonymous types.

\`\`\`csharp
var students = GetStudents();

// Project to anonymous type
var summary = students.Select(s => new {
    s.Name,
    PassFail = s.Grade >= 70 ? "Pass" : "Fail"
});

foreach (var item in summary)
    Console.WriteLine($"{item.Name}: {item.PassFail}");

// Flatten with SelectMany
var words = new List<string> { "Hello World", "Foo Bar" };
var allWords = words.SelectMany(s => s.Split(' '));
// ["Hello", "World", "Foo", "Bar"]

// Join
var dept = new[] { new { Id = 1, Name = "Math" }, new { Id = 2, Name = "Science" } };
var enrolled = new[] { new { StudentId = 1, DeptId = 1 }, new { StudentId = 2, DeptId = 2 } };

var joined = enrolled.Join(dept,
    e => e.DeptId,
    d => d.Id,
    (e, d) => new { e.StudentId, d.Name });
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "LINQ query syntax",
        question: "Which keyword is used in LINQ query syntax to filter elements?",
        options: ["filter", "where", "select", "from"],
        answer: "where",
        explanation: "The `where` clause filters elements in LINQ query syntax.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "Method chain result",
        question: "What does `new[] {1,2,3,4}.Where(x => x > 2).Sum()` return?",
        options: ["3", "7", "10", "6"],
        answer: "7",
        explanation: "Where filters to [3,4], Sum returns 3+4=7.",
        difficulty: "easy",
      },
      {
        number: 3,
        name: "GroupBy usage",
        question: "What does `GroupBy` return in LINQ?",
        options: ["A flat list", "A sorted list", "Groups of elements keyed by a value", "A dictionary"],
        answer: "Groups of elements keyed by a value",
        explanation: "GroupBy returns an IEnumerable<IGrouping<TKey, TElement>> where each group has a Key.",
        difficulty: "medium",
      },
      {
        number: 4,
        name: "FirstOrDefault",
        question: "What does `FirstOrDefault` return when no element matches?",
        options: ["Throws exception", "null (or default value for the type)", "Empty list", "Last element"],
        answer: "null (or default value for the type)",
        explanation: "FirstOrDefault returns default(T) when no match is found, avoiding exceptions unlike First().",
        difficulty: "medium",
      },
      {
        number: 5,
        name: "SelectMany purpose",
        question: "What does `SelectMany` do that `Select` does not?",
        options: ["Sorts elements", "Flattens nested collections into one sequence", "Groups elements", "Removes duplicates"],
        answer: "Flattens nested collections into one sequence",
        explanation: "SelectMany projects each element to a collection and flattens all resulting collections into one.",
        difficulty: "hard",
      },
    ],
  },
  {
    slug: "csharp",
    title: "Async/Await and Tasks",
    order: 17,
    theory: [
      {
        order: 1,
        title: "Understanding Async Programming",
        content: `Async/await allows writing asynchronous code that reads like synchronous code.

\`\`\`csharp
using System.Threading.Tasks;

// Sync version - blocks thread
string DownloadSync(string url) {
    // Thread blocked while downloading
    return WebClient.DownloadString(url);
}

// Async version - thread is free while awaiting
async Task<string> DownloadAsync(string url) {
    using var client = new HttpClient();
    return await client.GetStringAsync(url);
}

// Calling async method
async Task RunAsync() {
    string content = await DownloadAsync("https://example.com");
    Console.WriteLine(content.Length);
}
\`\`\``,
      },
      {
        order: 2,
        title: "Task and Task<T>",
        content: `Task represents an asynchronous operation; Task<T> returns a result.

\`\`\`csharp
// Task - no return value
async Task DoWorkAsync() {
    await Task.Delay(1000); // simulates async work
    Console.WriteLine("Done!");
}

// Task<T> - returns a value
async Task<int> ComputeAsync() {
    await Task.Delay(500);
    return 42;
}

// Running multiple tasks concurrently
async Task RunParallelAsync() {
    Task<int> t1 = ComputeAsync();
    Task<int> t2 = ComputeAsync();

    int[] results = await Task.WhenAll(t1, t2);
    Console.WriteLine($"Sum: {results[0] + results[1]}"); // 84
}

// Task.WhenAny - get first completed
Task<int> first = await Task.WhenAny(t1, t2);
\`\`\``,
      },
      {
        order: 3,
        title: "Exception Handling in Async",
        content: `Exceptions from async methods are captured in the Task and rethrown on await.

\`\`\`csharp
async Task<string> FetchDataAsync(string url) {
    try {
        using var client = new HttpClient();
        client.Timeout = TimeSpan.FromSeconds(5);
        return await client.GetStringAsync(url);
    }
    catch (HttpRequestException ex) {
        Console.WriteLine($"Network error: {ex.Message}");
        return null;
    }
    catch (TaskCanceledException) {
        Console.WriteLine("Request timed out");
        return null;
    }
}

// CancellationToken for cooperative cancellation
async Task LongOperationAsync(CancellationToken ct) {
    for (int i = 0; i < 100; i++) {
        ct.ThrowIfCancellationRequested();
        await Task.Delay(100, ct);
    }
}

var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));
await LongOperationAsync(cts.Token);
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "async return type",
        question: "What return type should an async method that returns an integer use?",
        options: ["int", "async int", "Task<int>", "Task"],
        answer: "Task<int>",
        explanation: "Async methods returning values use Task<T> where T is the return type.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "await behavior",
        question: "What does `await` do to the current thread?",
        options: ["Blocks it until the task completes", "Terminates it", "Releases it so it can do other work", "Creates a new thread"],
        answer: "Releases it so it can do other work",
        explanation: "await suspends the method without blocking the thread, allowing other work to proceed.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "Task.WhenAll",
        question: "What does `Task.WhenAll(t1, t2)` do?",
        options: ["Runs t2 after t1 completes", "Returns the first completed task", "Awaits all tasks and returns all results", "Cancels all tasks"],
        answer: "Awaits all tasks and returns all results",
        explanation: "Task.WhenAll runs tasks concurrently and completes when all finish, returning an array of results.",
        difficulty: "medium",
      },
      {
        number: 4,
        name: "CancellationToken",
        question: "What is a CancellationToken used for in async code?",
        options: ["To set timeouts automatically", "To cooperatively cancel long-running operations", "To handle exceptions", "To log errors"],
        answer: "To cooperatively cancel long-running operations",
        explanation: "CancellationToken allows callers to signal cancellation; the async method checks it cooperatively.",
        difficulty: "hard",
      },
    ],
  },
  {
    slug: "csharp",
    title: "Entity Framework Core",
    order: 18,
    theory: [
      {
        order: 1,
        title: "ORM and DbContext",
        content: `Entity Framework Core (EF Core) is an ORM that maps C# classes to database tables.

\`\`\`csharp
// Install: dotnet add package Microsoft.EntityFrameworkCore.Sqlite

using Microsoft.EntityFrameworkCore;

// Entity (model)
public class Product {
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
}

// DbContext
public class AppDbContext : DbContext {
    public DbSet<Product> Products { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options) =>
        options.UseSqlite("Data Source=app.db");
}

// Usage
using var db = new AppDbContext();
db.Database.EnsureCreated();

db.Products.Add(new Product { Name = "Widget", Price = 9.99m });
db.SaveChanges();
\`\`\``,
      },
      {
        order: 2,
        title: "CRUD with EF Core",
        content: `EF Core makes Create, Read, Update, Delete straightforward.

\`\`\`csharp
using var db = new AppDbContext();

// Create
db.Products.Add(new Product { Name = "Gadget", Price = 29.99m });
db.SaveChanges();

// Read
var all = db.Products.ToList();
var cheap = db.Products.Where(p => p.Price < 15).ToList();
var single = db.Products.Find(1); // by primary key

// Update
var product = db.Products.Find(1);
product.Price = 19.99m;
db.SaveChanges();

// Delete
db.Products.Remove(product);
db.SaveChanges();
\`\`\``,
      },
      {
        order: 3,
        title: "Migrations",
        content: `Migrations keep the database schema in sync with your models.

\`\`\`bash
# Add a migration
dotnet ef migrations add InitialCreate

# Apply migrations
dotnet ef database update

# Rollback
dotnet ef database update PreviousMigrationName
\`\`\`

\`\`\`csharp
// Relationship example
public class Category {
    public int Id { get; set; }
    public string Name { get; set; }
    public List<Product> Products { get; set; } = new();
}

public class Product {
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; }
}

// Query with include (eager loading)
var categories = db.Categories
    .Include(c => c.Products)
    .ToList();
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "DbContext purpose",
        question: "What is the role of DbContext in EF Core?",
        options: ["It generates SQL scripts", "It represents a session with the database and manages entity objects", "It replaces Migrations", "It only handles connections"],
        answer: "It represents a session with the database and manages entity objects",
        explanation: "DbContext is the primary class for interacting with the database — it tracks changes and coordinates queries.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "SaveChanges",
        question: "When does EF Core actually write changes to the database?",
        options: ["When Add() is called", "When the DbContext is disposed", "When SaveChanges() is called", "Automatically after every operation"],
        answer: "When SaveChanges() is called",
        explanation: "EF Core tracks changes in memory; SaveChanges() persists all tracked changes to the database in a transaction.",
        difficulty: "easy",
      },
      {
        number: 3,
        name: "Include method",
        question: "What does `.Include(c => c.Products)` do in a LINQ query?",
        options: ["Filters by products", "Eager-loads related Products entities", "Joins two tables", "Creates a new product list"],
        answer: "Eager-loads related Products entities",
        explanation: "Include performs eager loading, causing EF Core to fetch related data in the same query via JOIN.",
        difficulty: "medium",
      },
      {
        number: 4,
        name: "Migrations purpose",
        question: "What is the main purpose of EF Core Migrations?",
        options: ["To back up data", "To sync database schema with model class changes", "To generate test data", "To optimize query performance"],
        answer: "To sync database schema with model class changes",
        explanation: "Migrations track model changes over time and generate SQL scripts to update the database schema accordingly.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "csharp",
    title: "Dependency Injection",
    order: 19,
    theory: [
      {
        order: 1,
        title: "Dependency Injection Principle",
        content: `Dependency Injection (DI) is a design pattern where dependencies are provided rather than created internally.

\`\`\`csharp
// Without DI - tightly coupled
class OrderService {
    private EmailService _emailService = new EmailService(); // bad

    public void PlaceOrder(Order order) {
        // process order
        _emailService.Send(order.CustomerEmail, "Order confirmed");
    }
}

// With DI - loosely coupled
interface IEmailService {
    void Send(string to, string subject);
}

class OrderService {
    private readonly IEmailService _emailService;

    public OrderService(IEmailService emailService) { // injected
        _emailService = emailService;
    }

    public void PlaceOrder(Order order) {
        _emailService.Send(order.CustomerEmail, "Order confirmed");
    }
}
\`\`\``,
      },
      {
        order: 2,
        title: "DI Container in ASP.NET Core",
        content: `ASP.NET Core has a built-in DI container configured in Program.cs.

\`\`\`csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddSingleton<IEmailService, SmtpEmailService>();
builder.Services.AddScoped<IOrderRepository, SqlOrderRepository>();
builder.Services.AddTransient<IOrderService, OrderService>();

var app = builder.Build();

// Controller receives injected service
[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase {
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService) {
        _orderService = orderService;
    }

    [HttpPost]
    public IActionResult Create(Order order) {
        _orderService.PlaceOrder(order);
        return Ok();
    }
}
\`\`\``,
      },
      {
        order: 3,
        title: "Service Lifetimes",
        content: `DI containers manage object lifetimes: Singleton, Scoped, and Transient.

\`\`\`csharp
// Singleton - one instance for entire app lifetime
builder.Services.AddSingleton<ICache, MemoryCache>();

// Scoped - one instance per HTTP request
builder.Services.AddScoped<IDbContext, AppDbContext>();

// Transient - new instance every time requested
builder.Services.AddTransient<IEmailValidator, EmailValidator>();
\`\`\`

| Lifetime   | When to use                            |
|------------|----------------------------------------|
| Singleton  | Stateless, shared (e.g., config, cache)|
| Scoped     | Per-request state (e.g., DB context)   |
| Transient  | Lightweight, stateless helpers         |`,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "DI benefit",
        question: "What is the main benefit of Dependency Injection?",
        options: ["Faster code execution", "Loose coupling — easy to replace/test dependencies", "Less memory usage", "Automatic error handling"],
        answer: "Loose coupling — easy to replace/test dependencies",
        explanation: "DI decouples classes from their dependencies, making code testable (mock injection) and maintainable.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "AddScoped lifetime",
        question: "When should you use `AddScoped` for a service?",
        options: ["When you need one instance per class", "When you need one instance per HTTP request", "When you need a new instance every time", "When the service is thread-safe and stateless"],
        answer: "When you need one instance per HTTP request",
        explanation: "Scoped services are created once per request and disposed when the request ends — ideal for DbContext.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "Constructor injection",
        question: "In ASP.NET Core DI, how do controllers receive their dependencies?",
        options: ["Via static properties", "Through constructor parameters", "Using [Inject] attributes on fields", "By calling ServiceLocator"],
        answer: "Through constructor parameters",
        explanation: "ASP.NET Core uses constructor injection — the DI container resolves and passes dependencies to the constructor.",
        difficulty: "easy",
      },
      {
        number: 4,
        name: "Singleton pitfall",
        question: "What is a risk when injecting a Scoped service into a Singleton?",
        options: ["The singleton won't work", "The scoped service acts as a singleton (captive dependency)", "Extra memory is used", "Thread deadlock always occurs"],
        answer: "The scoped service acts as a singleton (captive dependency)",
        explanation: "A singleton holds one scoped instance for the app's lifetime, breaking the per-request assumption. ASP.NET Core detects this in development.",
        difficulty: "hard",
      },
    ],
  },
  {
    slug: "csharp",
    title: "Unit Testing with xUnit",
    order: 20,
    theory: [
      {
        order: 1,
        title: "xUnit Basics",
        content: `xUnit is a popular testing framework for .NET. Tests are methods decorated with [Fact] or [Theory].

\`\`\`csharp
// Install: dotnet add package xunit xunit.runner.visualstudio

using Xunit;

public class CalculatorTests {
    [Fact]
    public void Add_TwoPositiveNumbers_ReturnsSum() {
        // Arrange
        var calc = new Calculator();

        // Act
        int result = calc.Add(3, 4);

        // Assert
        Assert.Equal(7, result);
    }

    [Theory]
    [InlineData(2, 3, 5)]
    [InlineData(-1, 1, 0)]
    [InlineData(0, 0, 0)]
    public void Add_MultipleInputs_ReturnsCorrectSum(int a, int b, int expected) {
        var calc = new Calculator();
        Assert.Equal(expected, calc.Add(a, b));
    }
}
\`\`\``,
      },
      {
        order: 2,
        title: "Mocking with Moq",
        content: `Moq creates mock objects to isolate the unit under test.

\`\`\`csharp
// Install: dotnet add package Moq

using Moq;
using Xunit;

public class OrderServiceTests {
    [Fact]
    public void PlaceOrder_ValidOrder_SendsEmail() {
        // Arrange
        var mockEmail = new Mock<IEmailService>();
        var service = new OrderService(mockEmail.Object);
        var order = new Order { CustomerEmail = "test@example.com" };

        // Act
        service.PlaceOrder(order);

        // Assert
        mockEmail.Verify(e => e.Send("test@example.com", "Order confirmed"), Times.Once);
    }

    [Fact]
    public void GetPrice_CallsRepository() {
        var mockRepo = new Mock<IProductRepository>();
        mockRepo.Setup(r => r.GetById(1)).Returns(new Product { Price = 9.99m });

        var service = new ProductService(mockRepo.Object);
        var price = service.GetPrice(1);

        Assert.Equal(9.99m, price);
    }
}
\`\`\``,
      },
      {
        order: 3,
        title: "Test Organization and Best Practices",
        content: `Organize tests clearly and follow the Arrange-Act-Assert pattern.

\`\`\`csharp
public class BankAccountTests : IDisposable {
    private BankAccount _account;

    // Runs before each test
    public BankAccountTests() {
        _account = new BankAccount(initialBalance: 1000);
    }

    // Runs after each test
    public void Dispose() => _account?.Close();

    [Fact]
    public void Deposit_PositiveAmount_IncreasesBalance() {
        _account.Deposit(500);
        Assert.Equal(1500, _account.Balance);
    }

    [Fact]
    public void Withdraw_ExceedsBalance_ThrowsException() {
        Assert.Throws<InvalidOperationException>(() =>
            _account.Withdraw(2000));
    }

    [Fact]
    public void Withdraw_ValidAmount_DecreasesBalance() {
        _account.Withdraw(300);
        Assert.Equal(700, _account.Balance);
    }
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Fact vs Theory",
        question: "What is the difference between [Fact] and [Theory] in xUnit?",
        options: [
          "[Fact] runs once; [Theory] runs multiple times with different data via [InlineData]",
          "[Fact] is for async tests; [Theory] is for sync",
          "[Theory] is faster than [Fact]",
          "They are identical",
        ],
        answer: "[Fact] runs once; [Theory] runs multiple times with different data via [InlineData]",
        explanation: "[Fact] marks a single test case. [Theory] with [InlineData] allows parameterized test runs with different inputs.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "Moq Setup",
        question: "What does `mockRepo.Setup(r => r.GetById(1)).Returns(product)` do?",
        options: ["Calls the real GetById method", "Configures the mock to return product when GetById(1) is called", "Throws an exception if GetById is called", "Verifies GetById was called"],
        answer: "Configures the mock to return product when GetById(1) is called",
        explanation: "Setup defines behavior for mock method calls; Returns specifies what value to return.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "Assert.Throws",
        question: "How do you test that a method throws a specific exception in xUnit?",
        options: ["try/catch in the test", "Assert.Throws<ExceptionType>(() => method())", "[ExpectedException] attribute", "Assert.Exception()"],
        answer: "Assert.Throws<ExceptionType>(() => method())",
        explanation: "Assert.Throws<T> verifies that the action throws an exception of type T.",
        difficulty: "medium",
      },
      {
        number: 4,
        name: "AAA pattern",
        question: "What does the Arrange-Act-Assert (AAA) pattern describe in unit tests?",
        options: [
          "Three test files — arrange, act, assert",
          "Set up data, execute the code under test, verify the outcome",
          "Authentication, Authorization, and Auditing",
          "Three phases of the DI container lifecycle",
        ],
        answer: "Set up data, execute the code under test, verify the outcome",
        explanation: "AAA is the recommended structure: Arrange sets up preconditions, Act calls the method, Assert verifies the result.",
        difficulty: "easy",
      },
    ],
  },
  {
    slug: "csharp",
    title: "Design Patterns in C#",
    order: 21,
    theory: [
      {
        order: 1,
        title: "Singleton Pattern",
        content: `Singleton ensures only one instance of a class exists.

\`\`\`csharp
// Thread-safe Singleton using Lazy<T>
public sealed class AppConfig {
    private static readonly Lazy<AppConfig> _instance =
        new Lazy<AppConfig>(() => new AppConfig());

    public static AppConfig Instance => _instance.Value;

    private AppConfig() {
        // load config
    }

    public string DatabaseUrl { get; private set; } = "localhost:5432";
}

// Usage
var config = AppConfig.Instance;
Console.WriteLine(config.DatabaseUrl);
\`\`\``,
      },
      {
        order: 2,
        title: "Factory and Builder Patterns",
        content: `Factory creates objects without specifying the exact class. Builder constructs complex objects step-by-step.

\`\`\`csharp
// Factory Pattern
interface IAnimal { void Speak(); }

class Dog : IAnimal { public void Speak() => Console.WriteLine("Woof!"); }
class Cat : IAnimal { public void Speak() => Console.WriteLine("Meow!"); }

static class AnimalFactory {
    public static IAnimal Create(string type) => type switch {
        "dog" => new Dog(),
        "cat" => new Cat(),
        _ => throw new ArgumentException("Unknown animal")
    };
}

// Builder Pattern
class QueryBuilder {
    private string _table;
    private List<string> _conditions = new();
    private int? _limit;

    public QueryBuilder From(string table) { _table = table; return this; }
    public QueryBuilder Where(string condition) { _conditions.Add(condition); return this; }
    public QueryBuilder Limit(int n) { _limit = n; return this; }

    public string Build() {
        var sql = $"SELECT * FROM {_table}";
        if (_conditions.Any()) sql += " WHERE " + string.Join(" AND ", _conditions);
        if (_limit.HasValue) sql += $" LIMIT {_limit}";
        return sql;
    }
}

var query = new QueryBuilder()
    .From("products")
    .Where("price < 100")
    .Limit(10)
    .Build();
\`\`\``,
      },
      {
        order: 3,
        title: "Observer Pattern",
        content: `Observer allows objects to subscribe to events and get notified of changes.

\`\`\`csharp
// Using C# events (built-in observer)
public class StockMarket {
    public event EventHandler<decimal> PriceChanged;

    private decimal _price;
    public decimal Price {
        get => _price;
        set {
            _price = value;
            PriceChanged?.Invoke(this, value);
        }
    }
}

class Investor {
    public string Name { get; set; }
    public void OnPriceChanged(object sender, decimal newPrice) =>
        Console.WriteLine($"{Name} notified: price is now {newPrice}");
}

var market = new StockMarket();
var alice = new Investor { Name = "Alice" };
var bob = new Investor { Name = "Bob" };

market.PriceChanged += alice.OnPriceChanged;
market.PriceChanged += bob.OnPriceChanged;

market.Price = 150.00m; // Both Alice and Bob notified
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Singleton guarantee",
        question: "What does the Singleton pattern guarantee?",
        options: ["The class cannot be inherited", "Only one instance exists throughout the application", "The class is immutable", "The class is thread-safe by default"],
        answer: "Only one instance exists throughout the application",
        explanation: "Singleton restricts instantiation to one object, providing a global access point to that instance.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "Factory pattern use case",
        question: "When is the Factory pattern most useful?",
        options: [
          "When you need multiple instances",
          "When object creation logic is complex or depends on runtime conditions",
          "When you want to prevent subclassing",
          "For logging purposes",
        ],
        answer: "When object creation logic is complex or depends on runtime conditions",
        explanation: "Factory centralizes object creation, allowing the caller to request an object by type without knowing the concrete class.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "Builder pattern benefit",
        question: "What problem does the Builder pattern solve?",
        options: ["Thread safety", "Creating complex objects step-by-step with readable chained calls", "Reducing memory allocation", "Lazy initialization"],
        answer: "Creating complex objects step-by-step with readable chained calls",
        explanation: "Builder constructs complex objects incrementally, avoiding constructors with many parameters.",
        difficulty: "medium",
      },
      {
        number: 4,
        name: "C# events and Observer",
        question: "In C#, what mechanism implements the Observer pattern natively?",
        options: ["Interfaces", "Delegates and Events", "Abstract classes", "Reflection"],
        answer: "Delegates and Events",
        explanation: "C# delegates and the event keyword are a built-in implementation of the Observer pattern.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "csharp",
    title: "ASP.NET Core Web API",
    order: 22,
    theory: [
      {
        order: 1,
        title: "Building a REST API",
        content: `ASP.NET Core makes building REST APIs straightforward with controllers and attributes.

\`\`\`csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();
app.Run();

// ProductsController.cs
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase {
    private static List<Product> _products = new();

    [HttpGet]
    public IActionResult GetAll() => Ok(_products);

    [HttpGet("{id}")]
    public IActionResult GetById(int id) {
        var product = _products.FirstOrDefault(p => p.Id == id);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpPost]
    public IActionResult Create(Product product) {
        product.Id = _products.Count + 1;
        _products.Add(product);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, Product updated) {
        var product = _products.FirstOrDefault(p => p.Id == id);
        if (product is null) return NotFound();
        product.Name = updated.Name;
        product.Price = updated.Price;
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id) {
        var product = _products.FirstOrDefault(p => p.Id == id);
        if (product is null) return NotFound();
        _products.Remove(product);
        return NoContent();
    }
}
\`\`\``,
      },
      {
        order: 2,
        title: "Model Validation and DTOs",
        content: `Use Data Transfer Objects (DTOs) and validation attributes to secure your API.

\`\`\`csharp
using System.ComponentModel.DataAnnotations;

// DTO with validation
public class CreateProductDto {
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; }

    [Range(0.01, 10000)]
    public decimal Price { get; set; }

    [Required]
    public string Category { get; set; }
}

[HttpPost]
public IActionResult Create(CreateProductDto dto) {
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    var product = new Product {
        Name = dto.Name,
        Price = dto.Price,
        Category = dto.Category
    };
    // save...
    return Created(...);
}
\`\`\``,
      },
      {
        order: 3,
        title: "Minimal APIs",
        content: `Minimal APIs provide a concise way to build APIs without controllers.

\`\`\`csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var todos = new List<Todo>();

app.MapGet("/todos", () => todos);

app.MapGet("/todos/{id}", (int id) =>
    todos.FirstOrDefault(t => t.Id == id) is Todo todo
        ? Results.Ok(todo)
        : Results.NotFound());

app.MapPost("/todos", (Todo todo) => {
    todos.Add(todo);
    return Results.Created($"/todos/{todo.Id}", todo);
});

app.MapDelete("/todos/{id}", (int id) => {
    var todo = todos.FirstOrDefault(t => t.Id == id);
    if (todo is null) return Results.NotFound();
    todos.Remove(todo);
    return Results.NoContent();
});

app.Run();

record Todo(int Id, string Title, bool IsComplete);
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "HTTP method mapping",
        question: "Which attribute maps a controller action to HTTP GET requests?",
        options: ["[HttpRequest]", "[Get]", "[HttpGet]", "[RouteGet]"],
        answer: "[HttpGet]",
        explanation: "[HttpGet] maps the action to HTTP GET. Other verbs use [HttpPost], [HttpPut], [HttpDelete].",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "NotFound response",
        question: "What HTTP status code does `return NotFound()` produce?",
        options: ["400", "401", "404", "500"],
        answer: "404",
        explanation: "NotFound() returns HTTP 404 — the standard response when a requested resource doesn't exist.",
        difficulty: "easy",
      },
      {
        number: 3,
        name: "Model validation",
        question: "What attribute ensures a property is not null or empty in model validation?",
        options: ["[NotNull]", "[Required]", "[Mandatory]", "[NotEmpty]"],
        answer: "[Required]",
        explanation: "[Required] from System.ComponentModel.DataAnnotations marks a property as mandatory.",
        difficulty: "easy",
      },
      {
        number: 4,
        name: "Minimal API vs Controllers",
        question: "What is an advantage of Minimal APIs over controller-based APIs?",
        options: ["Better performance always", "Less boilerplate, faster startup", "Built-in authentication", "Automatic Swagger generation"],
        answer: "Less boilerplate, faster startup",
        explanation: "Minimal APIs reduce ceremony (no controller class, no [ApiController]), improving startup time and reducing code for simple endpoints.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "csharp",
    title: "Generics and Collections",
    order: 23,
    theory: [
      {
        order: 1,
        title: "Generic Classes and Methods",
        content: `Generics enable type-safe, reusable code without boxing.

\`\`\`csharp
// Generic class
public class Stack<T> {
    private List<T> _items = new();

    public void Push(T item) => _items.Add(item);

    public T Pop() {
        if (_items.Count == 0) throw new InvalidOperationException("Empty stack");
        var item = _items[^1];
        _items.RemoveAt(_items.Count - 1);
        return item;
    }

    public int Count => _items.Count;
}

// Generic method
public static T Max<T>(T a, T b) where T : IComparable<T>
    => a.CompareTo(b) >= 0 ? a : b;

// Usage
var stack = new Stack<int>();
stack.Push(1); stack.Push(2);
Console.WriteLine(stack.Pop()); // 2

Console.WriteLine(Max(5, 3));       // 5
Console.WriteLine(Max("apple", "banana")); // banana
\`\`\``,
      },
      {
        order: 2,
        title: "Generic Constraints",
        content: `Constraints restrict what types can be used with generics.

\`\`\`csharp
// where T : class  — reference type only
// where T : struct — value type only
// where T : new()  — must have parameterless constructor
// where T : IComparable<T> — must implement interface
// where T : BaseClass — must inherit from class

public class Repository<T> where T : class, IEntity, new() {
    public T CreateDefault() => new T();

    public void Save(T entity) {
        Console.WriteLine($"Saving entity with Id: {entity.Id}");
    }
}

interface IEntity {
    int Id { get; set; }
}

// Multiple constraints
public static TOut Convert<TIn, TOut>(TIn input)
    where TIn : class
    where TOut : class, new() {
    // conversion logic
    return new TOut();
}
\`\`\``,
      },
      {
        order: 3,
        title: ".NET Collection Types",
        content: `The .NET standard library provides rich generic collection types.

\`\`\`csharp
// List<T> - dynamic array
var list = new List<int> { 1, 2, 3 };
list.Add(4);
list.Remove(2);
list.Sort();

// Dictionary<TKey, TValue>
var dict = new Dictionary<string, int> {
    ["one"] = 1, ["two"] = 2
};
dict.TryGetValue("three", out int val); // val = 0, returns false

// HashSet<T> - unique elements
var set = new HashSet<string> { "a", "b", "c" };
set.Add("a"); // ignored, already exists
bool has = set.Contains("b"); // true

// Queue<T> - FIFO
var queue = new Queue<string>();
queue.Enqueue("first"); queue.Enqueue("second");
Console.WriteLine(queue.Dequeue()); // "first"

// Stack<T> - LIFO
var stack = new System.Collections.Generic.Stack<int>();
stack.Push(1); stack.Push(2);
Console.WriteLine(stack.Pop()); // 2

// SortedDictionary - keeps keys sorted
var sorted = new SortedDictionary<string, int>();
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Generic benefit",
        question: "What is the main advantage of generics over using `object` type?",
        options: ["Generics are faster to type", "Type safety at compile time without boxing/unboxing", "Generics work with primitives only", "No difference"],
        answer: "Type safety at compile time without boxing/unboxing",
        explanation: "Generics catch type errors at compile time and avoid the performance cost of boxing value types to object.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "Generic constraint",
        question: "What does `where T : new()` constraint require?",
        options: ["T must be a new class", "T must have a parameterless constructor", "T must implement INew", "T must be immutable"],
        answer: "T must have a parameterless constructor",
        explanation: "The new() constraint allows calling `new T()` inside the generic method/class.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "Dictionary TryGetValue",
        question: "Why use `TryGetValue` instead of the indexer `dict[key]` when a key might not exist?",
        options: ["TryGetValue is faster", "The indexer only works with strings", "The indexer throws KeyNotFoundException; TryGetValue returns false safely", "There is no difference"],
        answer: "The indexer throws KeyNotFoundException; TryGetValue returns false safely",
        explanation: "TryGetValue avoids exceptions for missing keys, returning false and the default value.",
        difficulty: "medium",
      },
      {
        number: 4,
        name: "HashSet use case",
        question: "When should you prefer `HashSet<T>` over `List<T>`?",
        options: ["When you need indexed access", "When elements must be unique and you need O(1) lookups", "When order matters", "When you need to store value types"],
        answer: "When elements must be unique and you need O(1) lookups",
        explanation: "HashSet provides O(1) Contains/Add/Remove and automatically enforces uniqueness.",
        difficulty: "medium",
      },
    ],
  },
  {
    slug: "csharp",
    title: "Records, Tuples and Pattern Matching",
    order: 24,
    theory: [
      {
        order: 1,
        title: "Records",
        content: `Records are immutable reference types with value-based equality, ideal for DTOs.

\`\`\`csharp
// Record declaration
public record Person(string FirstName, string LastName, int Age);

var p1 = new Person("Alice", "Smith", 30);
var p2 = new Person("Alice", "Smith", 30);

Console.WriteLine(p1 == p2);          // true (value equality)
Console.WriteLine(p1.FirstName);       // Alice

// Non-destructive mutation with 'with'
var p3 = p1 with { Age = 31 };
Console.WriteLine(p3.Age);    // 31
Console.WriteLine(p1.Age);    // 30 (unchanged)

// Records support inheritance
public record Employee(string FirstName, string LastName, int Age, string Dept)
    : Person(FirstName, LastName, Age);

// Struct records (value type)
public record struct Point(double X, double Y);
\`\`\``,
      },
      {
        order: 2,
        title: "Tuples",
        content: `Tuples group multiple values without a dedicated class.

\`\`\`csharp
// Named tuples
(string Name, int Age) person = ("Alice", 30);
Console.WriteLine(person.Name); // Alice

// Return multiple values
(int Min, int Max, double Avg) Analyze(int[] data) {
    return (data.Min(), data.Max(), data.Average());
}

var stats = Analyze(new[] { 1, 2, 3, 4, 5 });
Console.WriteLine($"Min: {stats.Min}, Max: {stats.Max}, Avg: {stats.Avg}");

// Deconstruction
var (min, max, avg) = Analyze(new[] { 10, 20, 30 });
Console.WriteLine(avg); // 20.0

// Discard with _
var (_, maximum, _) = Analyze(new[] { 5, 2, 8 });
\`\`\``,
      },
      {
        order: 3,
        title: "Pattern Matching",
        content: `C# pattern matching provides expressive type and value checks.

\`\`\`csharp
// Switch expression with patterns
string Describe(object obj) => obj switch {
    int n when n < 0  => "negative integer",
    int n             => $"positive integer: {n}",
    string s          => $"string of length {s.Length}",
    null              => "null",
    _                 => "something else"
};

// Property pattern
string GetShipping(Order order) => order switch {
    { Total: > 100 }   => "Free",
    { IsExpress: true } => "Express $15",
    _                   => "Standard $5"
};

// Type pattern with is
void Process(Animal animal) {
    if (animal is Dog { Name: var name, Age: > 5 })
        Console.WriteLine($"Old dog named {name}");
    else if (animal is Cat cat)
        Console.WriteLine($"Cat: {cat.Name}");
}
\`\`\``,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Record equality",
        question: "How does equality work for C# records?",
        options: [
          "By reference (same as class)",
          "By comparing all property values (value-based equality)",
          "Only by Id property",
          "Records cannot be compared",
        ],
        answer: "By comparing all property values (value-based equality)",
        explanation: "Records override Equals and == to compare all properties, unlike classes which compare references by default.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "with expression",
        question: "What does `var p2 = p1 with { Age = 31 }` do?",
        options: ["Modifies p1's Age to 31", "Creates a new record with all of p1's values except Age=31", "Clones p1 completely", "Throws an error for immutable records"],
        answer: "Creates a new record with all of p1's values except Age=31",
        explanation: "The `with` expression creates a new record copy with specified property changes — non-destructive mutation.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "Tuple deconstruction",
        question: "What does the discard `_` do in tuple deconstruction `var (_, max, _) = stats;`?",
        options: ["Throws an error", "Assigns to a variable named _", "Ignores that tuple element", "Sets the value to null"],
        answer: "Ignores that tuple element",
        explanation: "The discard pattern _ explicitly ignores values you don't need in deconstruction.",
        difficulty: "easy",
      },
      {
        number: 4,
        name: "Switch expression default",
        question: "What does `_` represent in a switch expression?",
        options: ["A variable named underscore", "A null check", "The default/catch-all case", "An error case"],
        answer: "The default/catch-all case",
        explanation: "_ in a switch expression is the discard pattern that matches everything — it's the default arm.",
        difficulty: "easy",
      },
    ],
  },
  {
    slug: "csharp",
    title: "C# Project: Task Management API",
    order: 25,
    theory: [
      {
        order: 1,
        title: "Project Architecture",
        content: `Build a complete Task Management REST API combining EF Core, DI, validation, and async.

\`\`\`
TaskApi/
├── Models/
│   └── TodoItem.cs
├── DTOs/
│   ├── CreateTodoDto.cs
│   └── UpdateTodoDto.cs
├── Data/
│   └── AppDbContext.cs
├── Services/
│   ├── ITodoService.cs
│   └── TodoService.cs
├── Controllers/
│   └── TodoController.cs
└── Program.cs
\`\`\``,
      },
      {
        order: 2,
        title: "Models, DTOs and DbContext",
        content: `\`\`\`csharp
// Models/TodoItem.cs
public class TodoItem {
    public int Id { get; set; }
    public string Title { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
}

// DTOs
public record CreateTodoDto([Required][StringLength(200)] string Title);
public record UpdateTodoDto([Required][StringLength(200)] string Title, bool IsCompleted);

// Data/AppDbContext.cs
public class AppDbContext : DbContext {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<TodoItem> Todos { get; set; }
}
\`\`\``,
      },
      {
        order: 3,
        title: "Service and Controller",
        content: `\`\`\`csharp
// Services/ITodoService.cs
public interface ITodoService {
    Task<List<TodoItem>> GetAllAsync();
    Task<TodoItem?> GetByIdAsync(int id);
    Task<TodoItem> CreateAsync(CreateTodoDto dto);
    Task<bool> UpdateAsync(int id, UpdateTodoDto dto);
    Task<bool> DeleteAsync(int id);
}

// Program.cs registration
builder.Services.AddDbContext<AppDbContext>(o =>
    o.UseInMemoryDatabase("TodoDb"));
builder.Services.AddScoped<ITodoService, TodoService>();

// Controllers/TodoController.cs
[ApiController]
[Route("api/todos")]
public class TodoController : ControllerBase {
    private readonly ITodoService _service;
    public TodoController(ITodoService service) => _service = service;

    [HttpGet] public async Task<IActionResult> GetAll() =>
        Ok(await _service.GetAllAsync());

    [HttpPost] public async Task<IActionResult> Create(CreateTodoDto dto) {
        var todo = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetAll), new { todo.Id }, todo);
    }

    [HttpPut("{id}")] public async Task<IActionResult> Update(int id, UpdateTodoDto dto) =>
        await _service.UpdateAsync(id, dto) ? NoContent() : NotFound();

    [HttpDelete("{id}")] public async Task<IActionResult> Delete(int id) =>
        await _service.DeleteAsync(id) ? NoContent() : NotFound();
}
\`\`\``,
      },
      {
        order: 4,
        title: "Testing and Running the API",
        content: `Test your API with curl or Swagger UI.

\`\`\`bash
# Run the API
dotnet run

# Create a todo
curl -X POST https://localhost:5001/api/todos \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Learn C#"}'

# Get all todos
curl https://localhost:5001/api/todos

# Update todo
curl -X PUT https://localhost:5001/api/todos/1 \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Learn C# Advanced","isCompleted":true}'

# Delete todo
curl -X DELETE https://localhost:5001/api/todos/1
\`\`\`

Key concepts combined:
- **Records** for immutable DTOs
- **EF Core + async** for data access
- **DI** for loose coupling
- **Validation attributes** for input safety
- **LINQ** for querying
- **Pattern matching** in switch expressions`,
      },
    ],
    tasks: [
      {
        number: 1,
        name: "Architecture layer",
        question: "In a layered architecture, which layer should business logic live in?",
        options: ["Controller", "Model", "Service", "Database"],
        answer: "Service",
        explanation: "Controllers handle HTTP, services contain business logic, and data access is in repositories/DbContext.",
        difficulty: "easy",
      },
      {
        number: 2,
        name: "DI in the project",
        question: "Why does the controller accept `ITodoService` rather than `TodoService`?",
        options: ["It's faster", "To depend on an abstraction — enabling mocking in tests and swapping implementations", "ASP.NET Core requires interfaces", "Services can't be used directly"],
        answer: "To depend on an abstraction — enabling mocking in tests and swapping implementations",
        explanation: "Programming to interfaces enables testing with mocks and loose coupling — a core DI principle.",
        difficulty: "medium",
      },
      {
        number: 3,
        name: "AddScoped for DbContext",
        question: "Why is `AddScoped` the right lifetime for `AppDbContext`?",
        options: [
          "DbContext is thread-safe so it should be singleton",
          "DbContext tracks changes per request; scoped ensures a fresh context per HTTP request",
          "DbContext must be transient to work",
          "Scoped is the only option that works",
        ],
        answer: "DbContext tracks changes per request; scoped ensures a fresh context per HTTP request",
        explanation: "EF Core's DbContext is not thread-safe and tracks request-scoped state, making Scoped the correct lifetime.",
        difficulty: "hard",
      },
      {
        number: 4,
        name: "HTTP 201 Created",
        question: "What does `CreatedAtAction` return and why use it instead of `Ok()`?",
        options: [
          "200 OK — there's no difference",
          "201 Created with a Location header pointing to the new resource",
          "204 No Content for newly created items",
          "302 Redirect to the new resource",
        ],
        answer: "201 Created with a Location header pointing to the new resource",
        explanation: "CreatedAtAction returns HTTP 201 and sets the Location header to the new resource's URL — RESTful best practice for POST.",
        difficulty: "medium",
      },
    ],
  },
];

module.exports = { csharpMore };
