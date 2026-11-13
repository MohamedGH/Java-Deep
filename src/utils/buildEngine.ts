/**
 * Pure functional simulation engines for Java Build Systems:
 * - Maven Lifecycle Phase Pipeline
 * - Transitive Dependency Conflict Resolution (Maven Nearest-Wins BFS vs Gradle Highest-Wins Semver)
 * - Gradle Incremental Task DAG & Build Cache Evaluator
 */

export type MavenPhase =
  | 'validate'
  | 'compile'
  | 'test'
  | 'package'
  | 'verify'
  | 'install'
  | 'deploy';

export interface MavenPhaseStep {
  phase: MavenPhase;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  pluginGoal: string;
  durationMs: number;
}

export const MAVEN_DEFAULT_LIFECYCLE: ReadonlyArray<{ phase: MavenPhase; pluginGoal: string; baseMs: number }> = [
  { phase: 'validate', pluginGoal: 'enforcer:enforce (check pom.xml & Java version)', baseMs: 120 },
  { phase: 'compile', pluginGoal: 'maven-compiler-plugin:compile (javac -> target/classes)', baseMs: 850 },
  { phase: 'test', pluginGoal: 'maven-surefire-plugin:test (JUnit 5 -> target/surefire-reports)', baseMs: 1420 },
  { phase: 'package', pluginGoal: 'maven-jar-plugin:jar (archive -> target/app-1.0.jar)', baseMs: 310 },
  { phase: 'verify', pluginGoal: 'maven-failsafe-plugin:verify (integration tests)', baseMs: 980 },
  { phase: 'install', pluginGoal: 'maven-install-plugin:install (copy -> ~/.m2/repository)', baseMs: 190 },
  { phase: 'deploy', pluginGoal: 'maven-deploy-plugin:deploy (upload -> Nexus / Artifactory)', baseMs: 1250 }
];

/**
 * Pure function simulating a Maven default lifecycle run up to `targetPhase`.
 * If `failAtPhase` matches a phase encountered before/at `targetPhase`, pipeline short-circuits cleanly.
 */
export const simulateMavenLifecycle = (
  targetPhase: MavenPhase,
  failAtPhase: MavenPhase | null = null
): { steps: MavenPhaseStep[]; buildSuccess: boolean; failedPhase: MavenPhase | null; totalMs: number } => {
  const targetIdx = MAVEN_DEFAULT_LIFECYCLE.findIndex((p) => p.phase === targetPhase);
  const activeSlice = MAVEN_DEFAULT_LIFECYCLE.slice(0, targetIdx + 1);

  let halted = false;
  let failedPhase: MavenPhase | null = null;

  const steps: MavenPhaseStep[] = activeSlice.map((item) => {
    if (halted) {
      return {
        phase: item.phase,
        status: 'SKIPPED',
        pluginGoal: item.pluginGoal,
        durationMs: 0
      };
    }
    if (failAtPhase === item.phase) {
      halted = true;
      failedPhase = item.phase;
      return {
        phase: item.phase,
        status: 'FAILED',
        pluginGoal: item.pluginGoal,
        durationMs: Math.round(item.baseMs * 0.4)
      };
    }
    return {
      phase: item.phase,
      status: 'SUCCESS',
      pluginGoal: item.pluginGoal,
      durationMs: item.baseMs
    };
  });

  const totalMs = steps.reduce((acc, s) => acc + s.durationMs, 0);
  return {
    steps,
    buildSuccess: failedPhase === null,
    failedPhase,
    totalMs
  };
};

export interface DependencyPathNode {
  artifact: string;
  version: string;
  depth: number;
  path: string;
}

const parseSemverTuple = (version: string): [number, number, number] => {
  const parts = version.split('.').map((n) => parseInt(n, 10) || 0);
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
};

export const compareSemver = (a: string, b: string): number => {
  const [a1, a2, a3] = parseSemverTuple(a);
  const [b1, b2, b3] = parseSemverTuple(b);
  if (a1 !== b1) return a1 - b1;
  if (a2 !== b2) return a2 - b2;
  return a3 - b3;
};

/**
 * Pure functional conflict resolver comparing Maven vs Gradle dependency mediation:
 * - Maven: Nearest Definition Wins (smallest BFS depth; ties broken by declaration order).
 * - Gradle: Highest Version Wins (maximum semantic version across graph).
 */
export const resolveDependencyConflict = (
  candidates: ReadonlyArray<DependencyPathNode>,
  strategy: 'maven' | 'gradle'
): DependencyPathNode | null => {
  if (candidates.length === 0) return null;

  if (strategy === 'maven') {
    return candidates.reduce((winner, current) =>
      current.depth < winner.depth ? current : winner
    );
  }

  return candidates.reduce((winner, current) =>
    compareSemver(current.version, winner.version) > 0 ? current : winner
  );
};

export interface GradleTaskInputs {
  srcModified: boolean;
  testModified: boolean;
  resourcesModified: boolean;
  buildCacheEnabled: boolean;
  configCacheEnabled: boolean;
  daemonWarm: boolean;
}

export interface GradleTaskOutcome {
  taskName: string;
  dependsOn: string[];
  outcome: 'EXECUTED' | 'UP-TO-DATE' | 'FROM-CACHE';
  durationMs: number;
  reason: string;
}

/**
 * Pure function evaluating Gradle's incremental Task DAG based on input snapshots.
 */
export const evaluateGradleDag = (
  inputs: GradleTaskInputs
): {
  configPhaseMs: number;
  tasks: GradleTaskOutcome[];
  totalMs: number;
} => {
  const daemonPenalty = inputs.daemonWarm ? 0 : 1850;
  const configPhaseMs = inputs.configCacheEnabled ? 35 : 420 + daemonPenalty;

  const compileJava: GradleTaskOutcome = inputs.srcModified
    ? {
        taskName: ':compileJava',
        dependsOn: [],
        outcome: inputs.buildCacheEnabled ? 'FROM-CACHE' : 'EXECUTED',
        durationMs: inputs.buildCacheEnabled ? 45 : 680,
        reason: inputs.buildCacheEnabled
          ? 'Input hash matched remote/local Build Cache'
          : 'Main.java AST changed -> incremental javac'
      }
    : {
        taskName: ':compileJava',
        dependsOn: [],
        outcome: 'UP-TO-DATE',
        durationMs: 12,
        reason: 'SHA-256 input snapshot identical to previous build'
      };

  const processResources: GradleTaskOutcome = inputs.resourcesModified
    ? {
        taskName: ':processResources',
        dependsOn: [],
        outcome: 'EXECUTED',
        durationMs: 95,
        reason: 'application.properties modified -> copied to build/resources'
      }
    : {
        taskName: ':processResources',
        dependsOn: [],
        outcome: 'UP-TO-DATE',
        durationMs: 5,
        reason: 'No resource changes detected'
      };

  const classes: GradleTaskOutcome = {
    taskName: ':classes',
    dependsOn: [':compileJava', ':processResources'],
    outcome:
      compileJava.outcome === 'UP-TO-DATE' && processResources.outcome === 'UP-TO-DATE'
        ? 'UP-TO-DATE'
        : 'EXECUTED',
    durationMs: 4,
    reason: 'Lifecycle aggregation task'
  };

  const compileTestJava: GradleTaskOutcome =
    inputs.srcModified || inputs.testModified
      ? {
          taskName: ':compileTestJava',
          dependsOn: [':classes'],
          outcome: 'EXECUTED',
          durationMs: 320,
          reason: inputs.testModified
            ? 'Test source changed -> recompiled test classes'
            : 'Upstream :compileJava ABI changed -> recompiled tests'
        }
      : {
          taskName: ':compileTestJava',
          dependsOn: [':classes'],
          outcome: 'UP-TO-DATE',
          durationMs: 8,
          reason: 'Test inputs & compile classpath unchanged'
        };

  const testTask: GradleTaskOutcome =
    inputs.srcModified || inputs.testModified || inputs.resourcesModified
      ? {
          taskName: ':test',
          dependsOn: [':compileTestJava', ':classes'],
          outcome: inputs.buildCacheEnabled && !inputs.testModified && !inputs.srcModified ? 'FROM-CACHE' : 'EXECUTED',
          durationMs: 790,
          reason: 'Inputs changed -> running JUnit 5 test workers'
        }
      : {
          taskName: ':test',
          dependsOn: [':compileTestJava', ':classes'],
          outcome: 'UP-TO-DATE',
          durationMs: 10,
          reason: 'Inputs & test classpath unchanged -> skipped test JVM'
        };

  const jarTask: GradleTaskOutcome =
    inputs.srcModified || inputs.resourcesModified
      ? {
          taskName: ':jar',
          dependsOn: [':classes'],
          outcome: 'EXECUTED',
          durationMs: 140,
          reason: 'Updated class/resource outputs packed into build/libs/app.jar'
        }
      : {
          taskName: ':jar',
          dependsOn: [':classes'],
          outcome: 'UP-TO-DATE',
          durationMs: 6,
          reason: 'Existing JAR archive still valid'
        };

  const tasks = [compileJava, processResources, classes, compileTestJava, testTask, jarTask];
  const tasksMs = tasks.reduce((sum, t) => sum + t.durationMs, 0);

  return {
    configPhaseMs,
    tasks,
    totalMs: configPhaseMs + tasksMs
  };
};
