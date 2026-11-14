/**
 * Pure functional Kotlin-on-JVM simulation engines:
 * - Null-Safety Bytecode & Primitive Boxing Analyzer (String vs String?, Int vs Int?, ?., ?:, !!)
 * - kotlinc JVM Lowering Inspector (data class, inline/reified, @JvmInline value class, object, sealed)
 * - Coroutine CPS State Machine Stepper vs Java 21 Virtual Threads
 */

export type KotlinTypeKind = 'String' | 'String?' | 'Int' | 'Int?';
export type KotlinNullOperator = '?.' | '?:' | '!!';

export interface KotlinNullSafetySimulation {
  kotlinType: KotlinTypeKind;
  operator: KotlinNullOperator;
  inputIsNull: boolean;
  compilesCleanly: boolean;
  runtimeNpeThrown: boolean;
  heapBoxedObject: boolean;
  jvmSignature: string;
  bytecodeProbe: string[];
  outcomeValue: string;
  explanation: string;
}

/**
 * Pure function modeling Kotlin's compile-time nullability checks and JVM bytecode emission.
 */
export const simulateKotlinNullSafety = (
  kotlinType: KotlinTypeKind,
  operator: KotlinNullOperator,
  inputIsNull: boolean
): KotlinNullSafetySimulation => {
  const isNullable = kotlinType.endsWith('?');
  const isPrimitive = kotlinType === 'Int' || kotlinType === 'Int?';

  // Non-null types reject null at compile time and avoid Heap boxing for Int
  if (!isNullable) {
    return {
      kotlinType,
      operator,
      inputIsNull: false, // Compile error if caller tries passing null literal
      compilesCleanly: !inputIsNull,
      runtimeNpeThrown: false,
      heapBoxedObject: false,
      jvmSignature: isPrimitive ? '(I)I' : '(Ljava/lang/String;)I',
      bytecodeProbe: isPrimitive
        ? [
            'iload_1          // Unboxed 32-bit primitive int on Stack',
            'iconst_1',
            'iadd             // Zero Heap allocation!'
          ]
        : [
            'aload_1          // Non-null String reference',
            'ldc "arg"        // Intrinsics.checkNotNullParameter inserted for public APIs',
            'invokestatic Intrinsics.checkNotNullParameter:(Ljava/lang/Object;Ljava/lang/String;)V',
            'invokevirtual java/lang/String.length:()I'
          ],
      outcomeValue: inputIsNull
        ? 'COMPILE ERROR: Null can not be a value of a non-null type'
        : isPrimitive
        ? '43 (unboxed int)'
        : '9 (no null check needed on call)',
      explanation: isPrimitive
        ? 'Non-null Int compiles to raw JVM primitive `int` (4 bytes on Stack, zero Heap boxing).'
        : 'Non-null String compiles to `String` with `Intrinsics.checkNotNullParameter` guard at public method entry.'
    };
  }

  // Nullable types: Int? MUST box to java.lang.Integer on Heap!
  const heapBoxedObject = isPrimitive;
  const jvmSignature = isPrimitive
    ? '(Ljava/lang/Integer;)I'
    : '(Ljava/lang/String;)I';

  if (operator === '!!') {
    return {
      kotlinType,
      operator,
      inputIsNull,
      compilesCleanly: true,
      runtimeNpeThrown: inputIsNull,
      heapBoxedObject,
      jvmSignature,
      bytecodeProbe: [
        'aload_1',
        'dup',
        'ifnonnull L_OK   // Branch check injected by !!',
        'new java/lang/NullPointerException',
        'athrow           // Crashes at runtime if null!',
        'L_OK: ...'
      ],
      outcomeValue: inputIsNull
        ? 'java.lang.NullPointerException'
        : isPrimitive
        ? '42 (unboxed after check)'
        : '9',
      explanation:
        'The `!!` operator forces a runtime null check and throws NullPointerException immediately when null.'
    };
  }

  if (operator === '?:') {
    return {
      kotlinType,
      operator,
      inputIsNull,
      compilesCleanly: true,
      runtimeNpeThrown: false,
      heapBoxedObject,
      jvmSignature,
      bytecodeProbe: [
        'aload_1',
        'ifnull L_ELVIS   // Branch to fallback on null',
        'invokevirtual ...',
        'goto L_END',
        'L_ELVIS: iconst_0 // Fallback default without Optional<T> allocation'
      ],
      outcomeValue: inputIsNull ? '0 (Elvis fallback)' : isPrimitive ? '42' : '9',
      explanation:
        'Elvis `?:` lowers to a single `ifnull` bytecode jump—zero `Optional<T>` wrapper allocation on the Heap.'
    };
  }

  // Safe call ?.
  return {
    kotlinType,
    operator,
    inputIsNull,
    compilesCleanly: true,
    runtimeNpeThrown: false,
    heapBoxedObject,
    jvmSignature,
    bytecodeProbe: [
      'aload_1',
      'ifnull L_NULL',
      isPrimitive
        ? 'invokevirtual java/lang/Integer.intValue:()I // Heap dereference'
        : 'invokevirtual java/lang/String.length:()I',
      'goto L_END',
      'L_NULL: aconst_null'
    ],
    outcomeValue: inputIsNull
      ? 'null (short-circuited safely)'
      : isPrimitive
      ? '42 (Integer?)'
      : '9 (Int?)',
    explanation: isPrimitive
      ? 'Int? forces boxing into java.lang.Integer on the Heap (16+ bytes) because JVM primitives cannot hold null.'
      : 'Safe call `?.` emits an `ifnull` guard in bytecode so null propagates cleanly without throwing NPE.'
  };
};

export type KotlinConstructId =
  | 'data_class'
  | 'inline_reified'
  | 'value_class'
  | 'object_singleton'
  | 'sealed_class'
  | 'extension_fn';

export interface KotlinLoweringSpec {
  id: KotlinConstructId;
  title: string;
  kotlinCode: string;
  loweredJvmJava: string;
  bytecodeHighlights: string[];
  heapImpact: string;
  javaComparison: string;
}

/**
 * Pure function returning how kotlinc lowers high-level Kotlin constructs into JVM bytecode.
 */
export const evaluateKotlinJvmLowering = (id: KotlinConstructId): KotlinLoweringSpec => {
  switch (id) {
    case 'data_class':
      return {
        id,
        title: 'data class -> final class + copy$default + componentN()',
        kotlinCode: `data class User(val id: Long, val name: String)`,
        loweredJvmJava: `public final class User {
  private final long id;
  private final String name;
  public final long component1() { return id; }
  public final String component2() { return name; }
  public final User copy(long id, String name) { ... }
  public boolean equals(Object o) { ... }
  public int hashCode() { ... }
}`,
        bytecodeHighlights: [
          'Class flag ACC_FINAL (cannot be subclassed unless open plugin)',
          'Generates component1()/component2() for destructuring',
          'Generates synthetic copy$default(User, long, String, int mask, Object)'
        ],
        heapImpact: 'Same Heap layout as standard Java class (12B header + fields); unlike Java `record`, inherits `Object` instead of `java.lang.Record` unless `@JvmRecord` is used.',
        javaComparison: 'Java 16+ `record` is even stricter: shallowly immutable with `java.lang.Record` supertype and canonical constructor invariants.'
      };
    case 'inline_reified':
      return {
        id,
        title: 'inline fun <reified T> -> Callsite Copy + Class<T> Injection',
        kotlinCode: `inline fun <reified T> parseJson(raw: String): T =
    mapper.readValue(raw, T::class.java)`,
        loweredJvmJava: `// At callsite: parseJson<Order>(payload)
// kotlinc copies the function body directly into the caller!
Order result = mapper.readValue(payload, Order.class);`,
        bytecodeHighlights: [
          'NO `invokestatic` call to parseJson at runtime (body inlined!)',
          'Type parameter T is NOT erased because caller substitutes concrete `ldc Order.class`',
          'Eliminates lambda Function0/Function1 Heap allocations for inline higher-order functions'
        ],
        heapImpact: '0 Heap allocation for lambda closures when inlined; slightly larger bytecode size in caller method.',
        javaComparison: 'Java generics are strictly erased at compile time; reified `T::class.java` requires explicitly passing `Class<T>` tokens.'
      };
    case 'value_class':
      return {
        id,
        title: '@JvmInline value class -> Unboxed Primitive + Name Mangling',
        kotlinCode: `@JvmInline
value class UserId(val raw: Long)`,
        loweredJvmJava: `// At runtime, UserId disappears and passes raw 'long'!
public static final void find-impl(long rawUserId) { ... }
// Signature mangled ('find-xxxxxx') to prevent JVM descriptor clashes`,
        bytecodeHighlights: [
          'Uses primitive `long` (J) instead of Heap object wrapper whenever non-nullable',
          'Method names mangled with hash suffix to keep distinct overloads in bytecode',
          'Boxes to `UserId` wrapper only when used as nullable `UserId?` or generic `List<UserId>`'
        ],
        heapImpact: '0 bytes Heap overhead (avoids 16–24B wrapper object allocation!).',
        javaComparison: 'Preview of Project Valhalla value types — already usable today on standard JVMs via `kotlinc` lowering.'
      };
    case 'object_singleton':
      return {
        id,
        title: 'object Singleton -> Static Field INSTANCE + <clinit>',
        kotlinCode: `object MetricsRegistry {
    fun record(name: String) { ... }
}`,
        loweredJvmJava: `public final class MetricsRegistry {
  public static final MetricsRegistry INSTANCE;
  static { INSTANCE = new MetricsRegistry(); } // Thread-safe <clinit>
  private MetricsRegistry() {}
  public final void record(String name) { ... }
}`,
        bytecodeHighlights: [
          'Guaranteed thread-safe lazy initialization via JVM class initializer `<clinit>`',
          'Access compiles to `getstatic MetricsRegistry.INSTANCE` + `invokevirtual`'
        ],
        heapImpact: '1 single Heap instance referenced from Metaspace static mirror.',
        javaComparison: 'Replaces verbose Java enum-singleton or double-checked locking holder idiom in 1 keyword.'
      };
    case 'sealed_class':
      return {
        id,
        title: 'sealed interface / class -> Exhaustive Switch + PermittedSubclasses',
        kotlinCode: `sealed interface PaymentResult
data class Approved(val txId: String) : PaymentResult
data object Declined : PaymentResult`,
        loweredJvmJava: `// Emits JVM 17+ PermittedSubclasses attribute (when targeting JVM 17+)
// Allows compiler-checked exhaustive 'when(res)' without 'else' branch`,
        bytecodeHighlights: [
          'Direct subtypes restricted to same package/module at compile time',
          'Generates `instanceof` chain (or `tableswitch` / `invokedynamic` on modern targets)'
        ],
        heapImpact: '`data object Declined` allocates 1 shared singleton instance instead of `new Declined()` per call.',
        javaComparison: 'Matches Java 17+ `sealed interface` + Java 21 exhaustive `switch` pattern matching.'
      };
    case 'extension_fn':
      return {
        id,
        title: 'Extension Function -> Static Dispatch (`invokestatic`)',
        kotlinCode: `fun String.maskIban(): String = take(4) + "****"`,
        loweredJvmJava: `// Compiled into FileKt.class:
public static final String maskIban(String $this$maskIban) {
    return StringsKt.take($this$maskIban, 4) + "****";
}`,
        bytecodeHighlights: [
          'Emits `invokestatic` with receiver passed as Slot 0 argument',
          'Statically resolved by compile-time type (does NOT enter VTable!)'
        ],
        heapImpact: '0 Heap or VTable overhead; never modifies target class bytecode.',
        javaComparison: 'Equivalent to calling static helper `StringUtils.maskIban(s)` with clean dot-call syntax; similar to C `mask_iban(const char *s)`.'
      };
  }
};

export interface CoroutineTraceStep {
  step: number;
  labelValue: number;
  threadName: string;
  state: 'RUNNING' | 'SUSPENDED' | 'RESUMED' | 'COMPLETED';
  continuationHeap: string;
  detail: string;
}

/**
 * Pure function returning the 4 stages of a Kotlin suspend function CPS state machine.
 */
export const simulateCoroutineStateMachine = (stepIndex: number): {
  currentStep: CoroutineTraceStep;
  allSteps: CoroutineTraceStep[];
} => {
  const allSteps: CoroutineTraceStep[] = [
    {
      step: 0,
      labelValue: 0,
      threadName: 'DefaultDispatcher-worker-1',
      state: 'RUNNING',
      continuationHeap: 'FetchContinuation@0xCONT1 { label=0, user=null }',
      detail: 'Enters switch(label=0): calls non-blocking `fetchUser(id, cont)`. OS thread is actively executing.'
    },
    {
      step: 1,
      labelValue: 1,
      threadName: 'Thread RELEASED (Free for other coroutines!)',
      state: 'SUSPENDED',
      continuationHeap: 'FetchContinuation@0xCONT1 { label=1, savedId="u42" }',
      detail: 'I/O not ready -> saves locals into Heap `Continuation`, sets `label=1`, returns `COROUTINE_SUSPENDED`. Thread is NOT blocked!'
    },
    {
      step: 2,
      labelValue: 2,
      threadName: 'DefaultDispatcher-worker-3 (Different thread!)',
      state: 'RESUMED',
      continuationHeap: 'FetchContinuation@0xCONT1 { label=2, user=User(u42) }',
      detail: 'I/O completes -> invokes `cont.resumeWith(user)`. Jumps via `tableswitch(label=1)` directly to line after `fetchUser()` and suspends for `fetchOrders()`.'
    },
    {
      step: 3,
      labelValue: 2,
      threadName: 'DefaultDispatcher-worker-3',
      state: 'COMPLETED',
      continuationHeap: 'FetchContinuation@0xCONT1 eligible for Eden GC',
      detail: 'Orders received -> `label=2` finishes, returns combined `Profile` to parent continuation.'
    }
  ];

  const safeIdx = Math.max(0, Math.min(allSteps.length - 1, stepIndex));
  return {
    currentStep: allSteps[safeIdx],
    allSteps
  };
};
