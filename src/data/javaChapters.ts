import { Chapter } from '../types';

export const JAVA_CHAPTERS: Chapter[] = [
  {
    id: 'ch-1',
    title: '1. JVM Architecture & Memory Model',
    subtitle: 'Stack, Heap, Method Area, and Garbage Collection',
    category: 'Memory & JVM',
    iconName: 'Cpu',
    estimatedTime: '12 min',
    summary: 'Understand how Java executes bytecode via the Java Virtual Machine (JVM) and how memory is allocated between the Stack and Heap.',
    codeSnippet: `public class JVMDemo {
    public static void main(String[] args) {
        int primitiveValue = 42; // Stored in Stack
        String text = new String("Hello Java"); // Reference in Stack, Object in Heap
        process(primitiveValue);
    }
    public static void process(int val) {
        int localVal = val * 2;
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 1,
        code: 'public class JVMDemo {',
        explanation: 'Declares a public class. The JVM Class Loader loads this class into the Method Area (Metaspace), storing bytecode and metadata.',
        memoryHint: 'Method Area / Metaspace'
      },
      {
        lineNumber: 2,
        code: '    public static void main(String[] args) {',
        explanation: 'The entry point of the application. A new Thread Stack is created, pushing the main() frame onto the Stack.',
        memoryHint: 'Thread Stack Frame'
      },
      {
        lineNumber: 3,
        code: '        int primitiveValue = 42; // Stored in Stack',
        explanation: 'Local primitive variables are stored directly inside the current stack frame with their exact numerical value.',
        memoryHint: 'Stack: primitiveValue = 42'
      },
      {
        lineNumber: 4,
        code: '        String text = new String("Hello Java"); // Reference in Stack, Object in Heap',
        explanation: 'The reference variable "text" lives on the Stack, pointing to the actual String object allocated on the Heap. String literals also leverage the String Intern Pool.',
        memoryHint: 'Stack pointer -> Heap Object'
      },
      {
        lineNumber: 5,
        code: '        process(primitiveValue);',
        explanation: 'Invokes the process method. A new stack frame is pushed on top of main() with parameter val = 42.',
        memoryHint: 'Stack Frame Push'
      },
      {
        lineNumber: 6,
        code: '    }',
        explanation: 'End of main method. Stack frames are popped as methods complete.',
        memoryHint: 'Stack Frame Pop'
      }
    ],
    jvmMemoryNotes: 'The JVM divides memory into the Heap (for all object instances created with "new" and arrays, managed by Garbage Collector) and Stack (for local primitive variables and method call frames).',
    commonPitfalls: [
      'Assuming primitive variables are stored on the heap (they live in stack frames unless they are instance fields of an object).',
      'Forgetting that reference variables on the stack only hold memory addresses, not the object data itself.'
    ],
    quiz: {
      id: 'q-1',
      question: 'Where is a local primitive variable declared inside a method stored in Java?',
      options: [
        'On the Heap memory',
        'In the Method Area',
        'Directly inside the Thread Stack frame',
        'In the String Constant Pool'
      ],
      correctIndex: 2,
      explanation: 'Local primitives and object reference variables reside inside the thread stack frame allocated for that method execution.'
    }
  },
  {
    id: 'ch-2',
    title: '2. Object-Oriented Programming & Encapsulation',
    subtitle: 'Classes, Objects, Constructors, and Access Modifiers',
    category: 'OOP',
    iconName: 'Box',
    estimatedTime: '15 min',
    summary: 'Master the pillars of OOP in Java: abstraction, encapsulation, inheritance, and polymorphism with rigorous memory tracking.',
    codeSnippet: `public class BankAccount {
    private double balance; // Encapsulation
    private String owner;

    public BankAccount(String owner, initialDeposit) {
        this.owner = owner;
        this.balance = initialDeposit;
    }

    public void deposit(double amount) {
        if (amount > 0) this.balance += amount;
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 1,
        code: 'public class BankAccount {',
        explanation: 'Defines the blueprint (class) for bank accounts. Classes specify state (fields) and behavior (methods).',
        memoryHint: 'Class Metadata in Metaspace'
      },
      {
        lineNumber: 2,
        code: '    private double balance; // Encapsulation',
        explanation: 'Private access modifier hides internal state from outside classes, enforcing controlled access via getters/setters.',
        memoryHint: 'Instance Field on Heap'
      },
      {
        lineNumber: 5,
        code: '    public BankAccount(String owner, double initialDeposit) {',
        explanation: 'Constructor method invoked when "new BankAccount(...)" is called. Initializes object state.',
        memoryHint: 'Constructor Invocation'
      },
      {
        lineNumber: 6,
        code: '        this.owner = owner;',
        explanation: '"this" reference points to the current object instance being constructed on the Heap.',
        memoryHint: 'Pointer Binding'
      }
    ],
    jvmMemoryNotes: 'When you call "new BankAccount()", memory is allocated on the Heap for both the owner reference and the primitive balance field. The reference variable points to this heap address.',
    commonPitfalls: [
      'Forgetting to initialize a reference field, resulting in a NullPointerException when calling methods on it.',
      'Confusing static members (shared across all instances) with instance members (unique per object).'
    ],
    quiz: {
      id: 'q-2',
      question: 'What keyword is used inside an instance method to refer to the current object on the heap?',
      options: ['super', 'this', 'self', 'instance'],
      correctIndex: 1,
      explanation: '"this" is a reference to the current object whose method or constructor is being called.'
    }
  },
  {
    id: 'ch-3',
    title: '3. Collections Framework & Generics',
    subtitle: 'ArrayList, HashMap, HashSet, and Type Safety',
    category: 'Advanced',
    iconName: 'Layers',
    estimatedTime: '18 min',
    summary: 'Explore Java data structures, time complexities, generics (<T>), and high-performance collection operations.',
    codeSnippet: `import java.util.*;

public class CollectionDemo {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>();
        names.add("Alice");
        names.add("Bob");
        
        Map<String, Integer> scores = new HashMap<>();
        scores.put("Alice", 95);
        scores.put("Bob", 88);
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 5,
        code: '        List<String> names = new ArrayList<>();',
        explanation: 'Creates a type-safe dynamic array using Generics (<String>). Diamond operator <> infers the type automatically.',
        memoryHint: 'Heap Array Resizing'
      },
      {
        lineNumber: 9,
        code: '        Map<String, Integer> scores = new HashMap<>();',
        explanation: 'HashMap stores key-value pairs using hash buckets with O(1) average time complexity for get and put operations.',
        memoryHint: 'Hash Buckets Table on Heap'
      }
    ],
    jvmMemoryNotes: 'ArrayList doubles its internal capacity array when full, copying references to a new larger heap array. HashMap allocates node buckets.',
    commonPitfalls: [
      'Modifying a collection (e.g. removing items) while iterating over it with a standard for-each loop, throwing ConcurrentModificationException.',
      'Using mutable objects as keys in HashMaps.'
    ],
    quiz: {
      id: 'q-3',
      question: 'Which collection guarantees unique elements with no duplicates and fast lookup?',
      options: ['ArrayList', 'LinkedList', 'HashSet', 'Vector'],
      correctIndex: 2,
      explanation: 'HashSet uses a backing HashMap to ensure all stored elements are unique.'
    }
  },
  {
    id: 'ch-4',
    title: '4. Streams API & Lambda Expressions',
    subtitle: 'Functional Programming in Java (map, filter, reduce)',
    category: 'Advanced',
    iconName: 'Zap',
    estimatedTime: '15 min',
    summary: 'Write expressive, declarative data processing pipelines using Java 8 Lambdas and Stream Operations.',
    codeSnippet: `import java.util.*;
import java.util.stream.*;

public class StreamDemo {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);
        
        int sumOfEvens = numbers.stream()
            .filter(n -> n % 2 == 0)
            .mapToInt(n -> n * 2)
            .sum();
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 7,
        code: '        int sumOfEvens = numbers.stream()',
        explanation: 'Converts the collection into a lazy Stream pipeline for functional data transformations.',
        memoryHint: 'Stream Pipeline Wrapper'
      },
      {
        lineNumber: 8,
        code: '            .filter(n -> n % 2 == 0)',
        explanation: 'Intermediate operation using a lambda expression (n -> ...) to retain only even numbers.',
        memoryHint: 'Lazy Predicate Evaluation'
      },
      {
        lineNumber: 9,
        code: '            .mapToInt(n -> n * 2)',
        explanation: 'Transforms each integer by multiplying by 2, optimizing primitive performance with mapToInt.',
        memoryHint: 'Primitive IntStream'
      }
    ],
    jvmMemoryNotes: 'Streams are declarative and lazy; intermediate operations do not execute until a terminal operation (like .sum() or .collect()) is invoked.',
    commonPitfalls: [
      'Attempting to reuse a Stream after a terminal operation has already consumed it (throws IllegalStateException).',
      'Overcomplicating simple loops with complex multi-stage streams where readability suffers.'
    ],
    quiz: {
      id: 'q-4',
      question: 'What triggers execution in a Java Stream pipeline?',
      options: ['stream() method', 'filter() method', 'Terminal operation like collect() or sum()', 'Lambda declaration'],
      correctIndex: 2,
      explanation: 'Streams are lazy and only execute when a terminal operation is called.'
    }
  },
  {
    id: 'ch-5',
    title: '5. Exception Handling & Error Management',
    subtitle: 'Checked vs Unchecked Exceptions, try-with-resources',
    category: 'Fundamentals',
    iconName: 'ShieldAlert',
    estimatedTime: '10 min',
    summary: 'Robustly manage runtime failures, resource leaks, and custom error types using Java exception architecture.',
    codeSnippet: `import java.io.*;

public class ExceptionDemo {
    public static void readFile(String path) {
        try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
            System.out.println(reader.readLine());
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
        }
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 5,
        code: '        try (BufferedReader reader = new BufferedReader(new FileReader(path))) {',
        explanation: 'Try-with-resources statement ensures that any AutoCloseable resource is automatically closed, preventing file descriptor leaks.',
        memoryHint: 'Implicit finally block cleanup'
      },
      {
        lineNumber: 7,
        code: '        } catch (IOException e) {',
        explanation: 'Catches checked IOException thrown by file operations, preventing application crash.',
        memoryHint: 'Exception Stack Trace'
      }
    ],
    jvmMemoryNotes: 'When an exception occurs, the JVM unwinds the stack frames looking for a matching catch block. If none is found, the thread terminates and prints the stack trace.',
    commonPitfalls: [
      'Catching generic Exception or Throwable instead of specific exception types.',
      'Swallowing exceptions in empty catch blocks without logging or handling.'
    ],
    quiz: {
      id: 'q-5',
      question: 'Which statement ensures automatic closure of resources like files or database connections in Java?',
      options: ['try-finally', 'try-with-resources', 'auto-close catch', 'resource-lock'],
      correctIndex: 1,
      explanation: 'Try-with-resources (introduced in Java 7) automatically closes implementing AutoCloseable resources.'
    }
  }
];
