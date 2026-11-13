/**
 * Pure functional JUnit 5 (Jupiter) & Mockito/ByteBuddy simulation engines:
 * - Lifecycle & Heap Instance Allocation (PER_METHOD vs PER_CLASS)
 * - Sequential Assertions vs assertAll() MultipleFailuresError Collector
 * - ByteBuddy @Mock vs @Spy Behavior & Stubbing Trap Evaluator
 */

export type TestLifecycleMode = 'PER_METHOD' | 'PER_CLASS';

export interface LifecycleTraceEvent {
  step: number;
  hook: string;
  targetInstanceId: string;
  detail: string;
}

export interface JunitLifecycleSimulation {
  mode: TestLifecycleMode;
  testCount: number;
  heapInstancesAllocated: number;
  beforeAllMustBeStatic: boolean;
  sharedStateRisk: boolean;
  events: LifecycleTraceEvent[];
}

/**
 * Pure function simulating JUnit 5 Jupiter TestEngine lifecycle for N @Test methods.
 */
export const simulateJunitLifecycle = (
  mode: TestLifecycleMode,
  testCount: number
): JunitLifecycleSimulation => {
  const safeCount = Math.max(1, Math.min(6, testCount));
  const events: LifecycleTraceEvent[] = [];
  let stepCounter = 1;

  if (mode === 'PER_CLASS') {
    const sharedAddr = '@0xTEST_SHARED';
    events.push({
      step: stepCounter++,
      hook: 'new CalculatorTest()',
      targetInstanceId: sharedAddr,
      detail: '1 single Heap instance created once before @BeforeAll'
    });
    events.push({
      step: stepCounter++,
      hook: '@BeforeAll (instance or static)',
      targetInstanceId: sharedAddr,
      detail: 'Runs once on the shared test class instance'
    });

    for (let i = 1; i <= safeCount; i++) {
      events.push({
        step: stepCounter++,
        hook: '@BeforeEach',
        targetInstanceId: sharedAddr,
        detail: `Prepare fixture before test #${i} (same instance!)`
      });
      events.push({
        step: stepCounter++,
        hook: `@Test testCase${i}()`,
        targetInstanceId: sharedAddr,
        detail: `Executes test #${i} — shares mutable fields with previous tests!`
      });
      events.push({
        step: stepCounter++,
        hook: '@AfterEach',
        targetInstanceId: sharedAddr,
        detail: `Cleanup after test #${i}`
      });
    }

    events.push({
      step: stepCounter++,
      hook: '@AfterAll',
      targetInstanceId: sharedAddr,
      detail: 'Runs once after all tests on shared instance'
    });

    return {
      mode,
      testCount: safeCount,
      heapInstancesAllocated: 1,
      beforeAllMustBeStatic: false,
      sharedStateRisk: true,
      events
    };
  }

  // PER_METHOD (JUnit 5 Default)
  events.push({
    step: stepCounter++,
    hook: 'static @BeforeAll',
    targetInstanceId: '@Metaspace:Class<CalculatorTest>',
    detail: 'Runs ONCE at class level before any Heap test instance exists'
  });

  for (let i = 1; i <= safeCount; i++) {
    const instanceAddr = `@0xTEST_${i}`;
    events.push({
      step: stepCounter++,
      hook: 'new CalculatorTest()',
      targetInstanceId: instanceAddr,
      detail: `Fresh isolated Heap object allocated specifically for test #${i}`
    });
    events.push({
      step: stepCounter++,
      hook: '@BeforeEach',
      targetInstanceId: instanceAddr,
      detail: `Setup clean fixture on ${instanceAddr}`
    });
    events.push({
      step: stepCounter++,
      hook: `@Test testCase${i}()`,
      targetInstanceId: instanceAddr,
      detail: `Runs test #${i} in total field isolation`
    });
    events.push({
      step: stepCounter++,
      hook: '@AfterEach',
      targetInstanceId: instanceAddr,
      detail: `Teardown on ${instanceAddr} (then eligible for Eden GC)`
    });
  }

  events.push({
    step: stepCounter++,
    hook: 'static @AfterAll',
    targetInstanceId: '@Metaspace:Class<CalculatorTest>',
    detail: 'Runs ONCE at class level after all tests finish'
  });

  return {
    mode,
    testCount: safeCount,
    heapInstancesAllocated: safeCount,
    beforeAllMustBeStatic: true,
    sharedStateRisk: false,
    events
  };
};

export interface AssertionCheck {
  label: string;
  expected: string | number;
  actual: string | number;
}

export interface AssertionEvaluationResult {
  mode: 'sequential' | 'assertAll';
  executedCount: number;
  passedCount: number;
  failures: string[];
  hiddenFailuresCount: number;
}

/**
 * Pure function comparing fail-fast sequential assertions vs JUnit 5 assertAll() collector.
 */
export const evaluateAssertions = (
  checks: ReadonlyArray<AssertionCheck>,
  mode: 'sequential' | 'assertAll'
): AssertionEvaluationResult => {
  if (mode === 'sequential') {
    const failures: string[] = [];
    let executedCount = 0;
    let passedCount = 0;

    for (const check of checks) {
      executedCount++;
      if (check.expected !== check.actual) {
        failures.push(
          `AssertionFailedError [${check.label}]: expected <${check.expected}> but was <${check.actual}>`
        );
        break; // Fail-fast aborts remaining assertions!
      }
      passedCount++;
    }

    const totalActualFailures = checks.filter((c) => c.expected !== c.actual).length;
    return {
      mode,
      executedCount,
      passedCount,
      failures,
      hiddenFailuresCount: Math.max(0, totalActualFailures - failures.length)
    };
  }

  // assertAll collects all failures into MultipleFailuresError
  const failures = checks
    .filter((c) => c.expected !== c.actual)
    .map(
      (c) =>
        `AssertionFailedError [${c.label}]: expected <${c.expected}> but was <${c.actual}>`
    );

  return {
    mode,
    executedCount: checks.length,
    passedCount: checks.length - failures.length,
    failures,
    hiddenFailuresCount: 0
  };
};

export interface MockitoSimulationResult {
  kind: 'mock' | 'spy';
  generatedClassName: string;
  constructorInvoked: boolean;
  realFieldsInitialized: boolean;
  unstubbedMethodReturn: string;
  whenStubTrapTriggered: boolean;
  explanation: string;
}

/**
 * Pure function simulating Mockito ByteBuddy @Mock vs @Spy runtime mechanics.
 */
export const simulateMockitoBehavior = (
  kind: 'mock' | 'spy',
  useDoReturnForSpy: boolean
): MockitoSimulationResult => {
  if (kind === 'mock') {
    return {
      kind: 'mock',
      generatedClassName: 'PaymentGateway$MockitoMock$A8F2',
      constructorInvoked: false, // Objenesis allocates memory bypassing constructor!
      realFieldsInitialized: false,
      unstubbedMethodReturn: '0 / false / null (Smart Default)',
      whenStubTrapTriggered: false,
      explanation:
        'Mockito + ByteBuddy generates a subclass and allocates it via Objenesis WITHOUT running the real constructor. Every method is intercepted by MockMethodInterceptor.'
    };
  }

  return {
    kind: 'spy',
    generatedClassName: 'ArrayList$MockitoMock$Spy9C1',
    constructorInvoked: true, // Wraps a real instance!
    realFieldsInitialized: true,
    unstubbedMethodReturn: 'Delegates directly to real object method!',
    whenStubTrapTriggered: !useDoReturnForSpy,
    explanation: useDoReturnForSpy
      ? 'doReturn("X").when(spy).get(0) suppresses real execution during stubbing -> SAFE (no IndexOutOfBoundsException).'
      : 'TRAP: when(spy.get(0)).thenReturn("X") calls REAL spy.get(0) FIRST -> throws IndexOutOfBoundsException if list is empty!'
  };
};
