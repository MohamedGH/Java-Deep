/**
 * Pure functional Javadoc AST, Doclet visibility, and -Xdoclint simulation engine:
 * - Lexical/DocTree parsing & -Xdoclint contract validation
 * - Visibility flag filtering (-public, -protected, -package, -private)
 * - Evolution milestones (Java 1.0 -> Java 18 JEP 413 {@snippet} -> Java 23 JEP 467 Markdown ///)
 */

export type JavadocVisibilityFlag = 'public' | 'protected' | 'package' | 'private';

export interface JavadocTagMatch {
  kind: 'block' | 'inline';
  tag: string;
  argument: string;
}

export interface JavadocLintIssue {
  severity: 'error' | 'warning';
  rule: string;
  message: string;
}

export interface JavadocValidationResult {
  isValidDocComment: boolean;
  summarySentence: string;
  declaredParams: string[];
  documentedParams: string[];
  returnType: string;
  hasReturnTag: boolean;
  declaredThrows: string[];
  documentedThrows: string[];
  tags: JavadocTagMatch[];
  issues: JavadocLintIssue[];
  errorCount: number;
  warningCount: number;
  isMarkdownDoc: boolean;
}

/**
 * Pure function parsing a Javadoc (classic /** ... * / or Java 23 /// Markdown)
 * against a Java method signature and enforcing -Xdoclint checks.
 */
export const parseAndValidateJavadoc = (
  rawComment: string,
  methodSignature: string
): JavadocValidationResult => {
  const trimmed = rawComment.trim();
  const isMarkdownDoc = trimmed.startsWith('///');
  const isClassicDoc = trimmed.startsWith('/**') && trimmed.endsWith('*/');
  const isValidDocComment = isClassicDoc || isMarkdownDoc;

  const issues: JavadocLintIssue[] = [];

  if (!isValidDocComment) {
    if (trimmed.startsWith('/*') && !trimmed.startsWith('/**')) {
      issues.push({
        severity: 'warning',
        rule: 'lexer-ignored',
        message: 'Standard /* ... */ block comment is stripped by javac lexer and NEVER processed by Javadoc.'
      });
    } else if (trimmed.startsWith('//') && !trimmed.startsWith('///')) {
      issues.push({
        severity: 'warning',
        rule: 'lexer-ignored',
        message: 'Line comment // is ignored by javac DocTree parser (use /// in Java 23+ or /** ... */).'
      });
    } else {
      issues.push({
        severity: 'error',
        rule: 'syntax',
        message: 'Malformed Javadoc block: must start with /** ... */ or /// (Java 23+).'
      });
    }
  }

  // Clean comment lines
  const lines = trimmed
    .replace(/^\/\*\*/, '')
    .replace(/\*\/$/, '')
    .split('\n')
    .map((line) =>
      line
        .trim()
        .replace(/^\/\/\/\s?/, '')
        .replace(/^\*\s?/, '')
    );

  // Extract inline tags like {@code ...}, {@link ...}, {@return ...}, {@snippet ...}
  const inlineTags: JavadocTagMatch[] = [];
  const inlineRegex = /\{@([a-zA-Z0-9_]+)\s*([^}]*)\}/g;
  const fullBody = lines.join('\n');
  let inlineMatch: RegExpExecArray | null;
  while ((inlineMatch = inlineRegex.exec(fullBody)) !== null) {
    inlineTags.push({
      kind: 'inline',
      tag: `@${inlineMatch[1]}`,
      argument: inlineMatch[2].trim()
    });
  }

  // Extract block tags (@param, @return, @throws, @since, @deprecated, @see)
  const blockTags: JavadocTagMatch[] = [];
  const descriptionLines: string[] = [];
  for (const line of lines) {
    if (line.startsWith('@')) {
      const spaceIdx = line.search(/\s/);
      const tag = spaceIdx === -1 ? line : line.slice(0, spaceIdx);
      const argument = spaceIdx === -1 ? '' : line.slice(spaceIdx + 1).trim();
      blockTags.push({ kind: 'block', tag, argument });
    } else if (blockTags.length === 0 && line.length > 0) {
      descriptionLines.push(line);
    }
  }

  const rawDescription = descriptionLines.join(' ').trim();
  const inlineReturnTag = inlineTags.find((t) => t.tag === '@return');
  const summarySentence = inlineReturnTag
    ? `Returns ${inlineReturnTag.argument}.`
    : rawDescription.split(/(?<=[.!?])\s+/)[0] || '(Missing summary sentence)';

  if (isValidDocComment && !rawDescription && !inlineReturnTag) {
    issues.push({
      severity: 'warning',
      rule: 'missing-description',
      message: 'No main description sentence found before block tags.'
    });
  }

  // Unescaped generics like List<String> outside {@code ...} and outside markdown backticks
  const strippedSafeCode = fullBody
    .replace(/\{@code[^}]*\}/g, '')
    .replace(/\{@literal[^}]*\}/g, '')
    .replace(/`[^`]*`/g, '');
  const htmlGenericTrap = /<(?!\/?(?:p|br|ul|ol|li|code|pre|b|i|em|strong|a)\b)[A-Z][a-zA-Z0-9_,\s?]*>/g;
  if (isValidDocComment && !isMarkdownDoc && htmlGenericTrap.test(strippedSafeCode)) {
    issues.push({
      severity: 'error',
      rule: 'html-unescaped-generic',
      message:
        '-Xdoclint:html error — Unescaped generic type (e.g. <T> or <String>) interpreted as unknown HTML tag! Wrap with {@code ...}.'
    });
  }

  // Parse method signature
  const sigWithoutAnnotations = methodSignature
    .replace(/@[A-Za-z0-9_]+(\([^)]*\))?\s*/g, '')
    .trim();
  const hasDeprecatedAnnotation = /@Deprecated\b/.test(methodSignature);
  const hasDeprecatedTag = blockTags.some((t) => t.tag === '@deprecated');

  if (hasDeprecatedAnnotation && !hasDeprecatedTag) {
    issues.push({
      severity: 'warning',
      rule: 'missing-deprecated-tag',
      message: 'Method has @Deprecated annotation but lacks @deprecated Javadoc tag explaining migration path.'
    });
  }
  if (!hasDeprecatedAnnotation && hasDeprecatedTag) {
    issues.push({
      severity: 'warning',
      rule: 'missing-deprecated-annotation',
      message: 'Javadoc has @deprecated tag without @Deprecated annotation (javac will not emit compiler warnings).'
    });
  }

  // Extract params from signature: e.g., "public User findUser(String id, int limit)"
  const paramSectionMatch = sigWithoutAnnotations.match(/\(([^)]*)\)/);
  const declaredParams: string[] = [];
  if (paramSectionMatch && paramSectionMatch[1].trim().length > 0) {
    // Split on commas outside <>
    const rawParams = paramSectionMatch[1].split(/,(?![^<]*>)/);
    for (const rp of rawParams) {
      const tokens = rp.trim().split(/\s+/);
      const paramName = tokens[tokens.length - 1]?.replace(/\.\.\./, '');
      if (paramName) declaredParams.push(paramName);
    }
  }

  const documentedParams = blockTags
    .filter((t) => t.tag === '@param')
    .map((t) => t.argument.split(/\s+/)[0])
    .filter(Boolean);

  for (const dp of declaredParams) {
    if (!documentedParams.includes(dp)) {
      issues.push({
        severity: 'error',
        rule: 'reference-missing-param',
        message: `-Xdoclint:reference error — Missing @param tag for parameter '${dp}'.`
      });
    }
  }
  for (const docP of documentedParams) {
    if (!docP.startsWith('<') && !declaredParams.includes(docP)) {
      issues.push({
        severity: 'error',
        rule: 'reference-unknown-param',
        message: `-Xdoclint:reference error — @param '${docP}' does not match any declared parameter.`
      });
    }
  }

  // Return type check
  const beforeParen = sigWithoutAnnotations.split('(')[0]?.trim() || '';
  const beforeTokens = beforeParen.split(/\s+/);
  const returnType = beforeTokens.length >= 2 ? beforeTokens[beforeTokens.length - 2] : 'void';
  const hasReturnTag =
    blockTags.some((t) => t.tag === '@return') || Boolean(inlineReturnTag);

  if (returnType !== 'void' && !hasReturnTag) {
    issues.push({
      severity: 'error',
      rule: 'missing-return',
      message: `-Xdoclint:missing error — Non-void return type '${returnType}' requires a @return tag (or {@return ...}).`
    });
  }

  // Throws check
  const throwsMatch = sigWithoutAnnotations.match(/throws\s+([^{;]+)/);
  const declaredThrows = throwsMatch
    ? throwsMatch[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const documentedThrows = blockTags
    .filter((t) => t.tag === '@throws' || t.tag === '@exception')
    .map((t) => t.argument.split(/\s+/)[0])
    .filter(Boolean);

  for (const dt of declaredThrows) {
    if (!documentedThrows.includes(dt)) {
      issues.push({
        severity: 'warning',
        rule: 'missing-throws',
        message: `-Xdoclint:missing warning — Declared exception '${dt}' is not documented with @throws.`
      });
    }
  }

  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;

  return {
    isValidDocComment,
    summarySentence,
    declaredParams,
    documentedParams,
    returnType,
    hasReturnTag,
    declaredThrows,
    documentedThrows,
    tags: [...inlineTags, ...blockTags],
    issues,
    errorCount,
    warningCount,
    isMarkdownDoc
  };
};

export interface VisibilityMatrixResult {
  flag: JavadocVisibilityFlag;
  includedModifiers: Array<'public' | 'protected' | 'package-private' | 'private'>;
  excludedModifiers: Array<'public' | 'protected' | 'package-private' | 'private'>;
  isDefaultFlag: boolean;
  useCase: string;
}

/**
 * Pure function modeling StandardDoclet visibility filtering flags.
 */
export const compareJavadocVisibilityFlags = (
  flag: JavadocVisibilityFlag
): VisibilityMatrixResult => {
  switch (flag) {
    case 'public':
      return {
        flag,
        includedModifiers: ['public'],
        excludedModifiers: ['protected', 'package-private', 'private'],
        isDefaultFlag: false,
        useCase: 'Strict public SDK/API portal (hides even protected subclass extension hooks).'
      };
    case 'protected':
      return {
        flag,
        includedModifiers: ['public', 'protected'],
        excludedModifiers: ['package-private', 'private'],
        isDefaultFlag: true,
        useCase: 'Javadoc DEFAULT: documents public contract + protected hooks for subclasses.'
      };
    case 'package':
      return {
        flag,
        includedModifiers: ['public', 'protected', 'package-private'],
        excludedModifiers: ['private'],
        isDefaultFlag: false,
        useCase: 'Internal team module documentation including package-private helpers.'
      };
    case 'private':
      return {
        flag,
        includedModifiers: ['public', 'protected', 'package-private', 'private'],
        excludedModifiers: [],
        isDefaultFlag: false,
        useCase: 'Full white-box audit including private fields and internal invariants.'
      };
  }
};

export interface JavadocMilestone {
  version: string;
  year: number;
  feature: string;
  tagOrApi: string;
  technicalImpact: string;
}

/**
 * Pure function returning Javadoc compiler & Doclet evolution across Java versions.
 */
export const getJavadocEvolutionMilestones = (): JavadocMilestone[] => [
  {
    version: 'Java 1.0 - 1.4',
    year: 1996,
    feature: 'Classic Standard Doclet & {@link}',
    tagOrApi: 'com.sun.javadoc + @param / @return / {@link}',
    technicalImpact: 'Generated HTML 4 framesets from source AST; required custom Doclet API for PDF/XML.'
  },
  {
    version: 'Java 5',
    year: 2004,
    feature: 'Generics <T> & {@code} / {@literal}',
    tagOrApi: '@param <T> & {@code List<String>}',
    technicalImpact: 'Introduced {@code ...} to prevent javac HTML parser from misreading generic <T> as HTML tags.'
  },
  {
    version: 'Java 8',
    year: 2014,
    feature: 'Strict -Xdoclint Compiler Validation',
    tagOrApi: '-Xdoclint:all (enabled by default)',
    technicalImpact: 'Turned broken HTML tags (&, <, unclosed <p>) and missing @param into fatal build errors in Maven/Gradle.'
  },
  {
    version: 'Java 9',
    year: 2017,
    feature: 'HTML5, Search Index & New Doclet API',
    tagOrApi: 'jdk.javadoc.doclet + HTML5 + Search JS',
    technicalImpact: 'Removed framesets in Java 11+, added client-side search index, and replaced com.sun.javadoc with modular DocTree AST.'
  },
  {
    version: 'Java 16',
    year: 2021,
    feature: 'Inline {@return} Tag',
    tagOrApi: '{@return the computed tax amount}',
    technicalImpact: 'Eliminated duplication between the first summary sentence ("Returns...") and the @return block tag.'
  },
  {
    version: 'Java 18',
    year: 2022,
    feature: 'Executable Snippets API (JEP 413)',
    tagOrApi: '{@snippet : ... } / @highlight / @link',
    technicalImpact: 'Replaced brittle <pre>{@code ...}</pre>; supports external tested files in snippet-files/ and line highlighting.'
  },
  {
    version: 'Java 23',
    year: 2024,
    feature: 'Markdown Documentation Comments (JEP 467)',
    tagOrApi: '/// ### Title + [Link][java.util.List]',
    technicalImpact: 'CommonMark Markdown via /// prefix; eliminates verbose <p>, <ul>, <pre> HTML boilerplate while keeping @param/@return.'
  }
];
