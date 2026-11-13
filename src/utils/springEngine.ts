/**
 * Pure functional Spring Framework & Boot JVM simulation engine:
 * - IoC Bean Graph Topological Resolver & Circular Dependency Detector
 * - Bean Scope JVM Memory & Lifecycle Calculator (singleton vs prototype vs request)
 * - AOP Proxy Call-Chain Evaluator (CGLIB / JDK Dynamic Proxy vs Self-Invocation trap)
 */

export interface BeanDefinition {
  name: string;
  stereotype: '@RestController' | '@Service' | '@Repository' | '@Bean';
  dependsOn: string[];
  proxied?: boolean;
}

export interface IocResolutionResult {
  success: boolean;
  creationOrder: string[];
  cyclePath: string[] | null;
  error: string | null;
}

/**
 * Pure DFS topological sort resolving Spring IoC Constructor Injection order.
 * Detects cycles immediately (BeanCurrentlyInCreationException).
 */
export const resolveSpringIocGraph = (
  beans: ReadonlyArray<BeanDefinition>
): IocResolutionResult => {
  const beanMap = new Map<string, BeanDefinition>(beans.map((b) => [b.name, b]));
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const creationOrder: string[] = [];

  const dfs = (beanName: string, stack: string[]): string[] | null => {
    if (visiting.has(beanName)) {
      const idx = stack.indexOf(beanName);
      return [...stack.slice(idx), beanName];
    }
    if (visited.has(beanName)) return null;

    visiting.add(beanName);
    const def = beanMap.get(beanName);
    if (def) {
      for (const dep of def.dependsOn) {
        const cycle = dfs(dep, [...stack, beanName]);
        if (cycle) {
          return cycle;
        }
      }
    }
    visiting.delete(beanName);
    visited.add(beanName);
    creationOrder.push(beanName);
    return null;
  };

  for (const bean of beans) {
    if (!visited.has(bean.name)) {
      const detectedCycle = dfs(bean.name, []);
      if (detectedCycle) {
        return {
          success: false,
          creationOrder: [],
          cyclePath: detectedCycle,
          error: `BeanCurrentlyInCreationException: Requested bean is currently in creation: Is there an unresolvable circular reference? (${detectedCycle.join(' -> ')})`
        };
      }
    }
  }

  return {
    success: true,
    creationOrder,
    cyclePath: null,
    error: null
  };
};

export type SpringScope = 'singleton' | 'prototype' | 'request';

export interface ScopeMemoryProfile {
  scope: SpringScope;
  instancesAllocated: number;
  heapBytesPerInstance: number;
  totalHeapBytes: number;
  preDestroyCalled: boolean;
  threadSafeRisk: string;
}

/**
 * Pure function calculating JVM Heap usage and lifecycle semantics for Spring Bean Scopes.
 */
export const calculateBeanScopeMemory = (
  scope: SpringScope,
  requestCount: number,
  beanSizeBytes: number = 48
): ScopeMemoryProfile => {
  const safeRequests = Math.max(1, requestCount);
  if (scope === 'singleton') {
    return {
      scope,
      instancesAllocated: 1,
      heapBytesPerInstance: beanSizeBytes,
      totalHeapBytes: beanSizeBytes,
      preDestroyCalled: true,
      threadSafeRisk: 'CRITICAL if stateful: shared across all concurrent Tomcat/Jetty threads!'
    };
  }
  if (scope === 'prototype') {
    return {
      scope,
      instancesAllocated: safeRequests,
      heapBytesPerInstance: beanSizeBytes,
      totalHeapBytes: safeRequests * beanSizeBytes,
      preDestroyCalled: false,
      threadSafeRisk: 'Safe (isolated instance), but GC pressure rises and @PreDestroy is NOT invoked!'
    };
  }
  return {
    scope: 'request',
    instancesAllocated: safeRequests,
    heapBytesPerInstance: beanSizeBytes,
    totalHeapBytes: safeRequests * beanSizeBytes,
    preDestroyCalled: true,
    threadSafeRisk: 'Safe per HTTP request (scoped proxy injects current RequestAttributes).'
  };
};

export interface AopCallStep {
  step: string;
  actor: 'Caller' | 'CGLIB Proxy (OrderService$$SpringCGLIB$$0)' | 'TransactionInterceptor' | 'Target POJO (OrderService)';
  active: boolean;
}

export interface AopSimulationResult {
  proxyIntercepted: boolean;
  transactionOpened: boolean;
  rollbackOnError: boolean;
  steps: AopCallStep[];
  summary: string;
}

/**
 * Pure function simulating Spring AOP Proxy interception vs Self-Invocation trap.
 */
export const simulateSpringAopCall = (
  callType: 'external_proxy' | 'self_invocation',
  simulateSqlError: boolean
): AopSimulationResult => {
  if (callType === 'external_proxy') {
    return {
      proxyIntercepted: true,
      transactionOpened: true,
      rollbackOnError: simulateSqlError,
      steps: [
        { step: '1. OrderController invokes orderService.placeOrder()', actor: 'Caller', active: true },
        { step: '2. Call enters generated subclass OrderService$$SpringCGLIB$$0', actor: 'CGLIB Proxy (OrderService$$SpringCGLIB$$0)', active: true },
        { step: '3. PlatformTransactionManager.getTransaction() -> BEGIN SQL TX', actor: 'TransactionInterceptor', active: true },
        { step: '4. super.placeOrder() executes real POJO business logic', actor: 'Target POJO (OrderService)', active: true },
        {
          step: simulateSqlError
            ? '5. RuntimeException thrown -> TransactionInterceptor calls ROLLBACK!'
            : '5. Method returns cleanly -> TransactionInterceptor calls COMMIT!',
          actor: 'TransactionInterceptor',
          active: true
        }
      ],
      summary: simulateSqlError
        ? 'Proxy caught RuntimeException and rolled back DB transaction cleanly.'
        : 'Proxy intercepted call, managed SQL transaction, and committed.'
    };
  }

  return {
    proxyIntercepted: false,
    transactionOpened: false,
    rollbackOnError: false,
    steps: [
      { step: '1. OrderService.outerMethod() executes inside real target POJO', actor: 'Target POJO (OrderService)', active: true },
      { step: '2. Calls this.saveAuditLog() directly using JVM invokevirtual/invokespecial on "this"', actor: 'Target POJO (OrderService)', active: true },
      { step: '3. BYPASSED: CGLIB Proxy & TransactionInterceptor are NEVER invoked!', actor: 'CGLIB Proxy (OrderService$$SpringCGLIB$$0)', active: false },
      {
        step: simulateSqlError
          ? '4. RuntimeException thrown -> NO TRANSACTION OPENED -> Partial DB writes NOT rolled back!'
          : '4. Executed without @Transactional / @Async / @Cacheable aspect!',
        actor: 'TransactionInterceptor',
        active: false
      }
    ],
    summary: 'SELF-INVOCATION TRAP: "this.method()" bypasses the Spring Proxy completely! @Transactional ignored.'
  };
};
