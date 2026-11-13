import { Chapter } from '../types';

export const JAVA_CHAPTERS: Chapter[] = [
  {
    id: 'ch-1',
    title: {
      fr: '1. De C à Java: Machine Virtuelle & Compilation',
      en: '1. From C to Java: JVM Architecture & Compilation'
    },
    subtitle: {
      fr: 'Bytecode, JIT Compiler, et le principe "Write Once, Run Anywhere"',
      en: 'Bytecode, JIT Compiler, and "Write Once, Run Anywhere"'
    },
    category: 'Memory & JVM',
    estimatedTime: '12 min',
    iconName: 'Cpu',
    summary: {
      fr: "En C, le code est compilé directement en binaire machine lié à l'OS. En Java, 'javac' produit du Bytecode intermédiaire (.class) exécuté par la JVM. La JVM interprète d'abord puis compile à la volée (JIT - Just-In-Time) les portions critiques en binaire natif ultra-performant.",
      en: "In C, code compiles directly into OS-specific machine binary. In Java, 'javac' produces intermediate Bytecode (.class) executed by the JVM. The JVM interprets and JIT-compiles hot loops into native assembly for high performance."
    },
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 25;
        int total = a + b;
        System.out.println("Result: " + total);
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 1,
        code: 'public class Main {',
        explanation: {
          fr: "Tout en Java doit résider dans une classe. Le ClassLoader de la JVM charge cette classe dans l'espace Metaspace (qui remplace l'ancien PermGen depuis Java 8).",
          en: "Everything in Java resides within a class. The JVM ClassLoader loads this class into Metaspace."
        },
        memoryHint: {
          fr: "Metaspace / Method Area: Stocke les métadonnées et le bytecode.",
          en: "Metaspace / Method Area: Stores class metadata and bytecode."
        }
      },
      {
        lineNumber: 2,
        code: '    public static void main(String[] args) {',
        explanation: {
          fr: "Point d'entrée du programme. La JVM crée le Thread principal et alloue une Pile d'exécution (Thread Stack). Un cadre d'activation (Stack Frame) pour main() est empilé.",
          en: "Entry point of the program. JVM creates the main thread and pushes a Stack Frame for main()."
        },
        memoryHint: {
          fr: "Stack Frame principal empilé sur la Pile du Thread.",
          en: "Main Stack Frame pushed onto Thread Stack."
        }
      },
      {
        lineNumber: 3,
        code: '        int a = 10;',
        explanation: {
          fr: "Variable primitive locale. Sa valeur 10 est stockée directement dans le tableau des variables locales du cadre de pile (index 1). Aucun pointeur, coût mémoire minimal (4 octets).",
          en: "Local primitive variable. Stored directly in local variable array (slot 1). Exactly 4 bytes, no pointer overhead."
        },
        memoryHint: {
          fr: "Stack Frame: a = 10 (int 32-bit)",
          en: "Stack Frame: a = 10 (int 32-bit)"
        }
      },
      {
        lineNumber: 4,
        code: '        int b = 25;',
        explanation: {
          fr: "Deuxième primitive stockée dans le tableau de variables locales du cadre (index 2).",
          en: "Second primitive stored in local variable slot 2."
        },
        memoryHint: {
          fr: "Stack Frame: b = 25 (int 32-bit)",
          en: "Stack Frame: b = 25 (int 32-bit)"
        }
      },
      {
        lineNumber: 5,
        code: '        int total = a + b;',
        explanation: {
          fr: "La JVM charge 'a' et 'b' sur la pile d'opérandes (iadd), effectue l'addition, puis stocke le résultat dans 'total' (index 3).",
          en: "JVM pushes a and b onto the operand stack, invokes iadd, and stores in total."
        },
        memoryHint: {
          fr: "Stack Frame: total = 35",
          en: "Stack Frame: total = 35"
        }
      },
      {
        lineNumber: 6,
        code: '        System.out.println("Result: " + total);',
        explanation: {
          fr: "Concaténation optimisée (via StringConcatFactory ou StringBuilder), allocation de l'objet String sur le Tas (Heap), puis appel de PrintStream.println.",
          en: "String concatenation via dynamic factory, Heap String allocation, then PrintStream.println invocation."
        },
        memoryHint: {
          fr: "Heap: String \"Result: 35\"",
          en: "Heap: String \"Result: 35\""
        }
      }
    ],
    bytecode: [
      { offset: 0, opcode: 'bipush 10', comment: { fr: 'Empile la constante 10 sur la pile d opérandes', en: 'Push byte constant 10 onto operand stack' } },
      { offset: 2, opcode: 'istore_1', comment: { fr: 'Stocke dans la variable locale 1 (a)', en: 'Store into local variable 1 (a)' } },
      { offset: 3, opcode: 'bipush 25', comment: { fr: 'Empile la constante 25 sur la pile d opérandes', en: 'Push byte constant 25 onto operand stack' } },
      { offset: 5, opcode: 'istore_2', comment: { fr: 'Stocke dans la variable locale 2 (b)', en: 'Store into local variable 2 (b)' } },
      { offset: 6, opcode: 'iload_1', comment: { fr: 'Charge a sur la pile', en: 'Load a onto stack' } },
      { offset: 7, opcode: 'iload_2', comment: { fr: 'Charge b sur la pile', en: 'Load b onto stack' } },
      { offset: 8, opcode: 'iadd', comment: { fr: 'Additionne les deux entiers au sommet', en: 'Add top two integers' } },
      { offset: 9, opcode: 'istore_3', comment: { fr: 'Stocke la somme dans total', en: 'Store sum into total' } },
      { offset: 10, opcode: 'return', comment: { fr: 'Termine l exécution de la méthode', en: 'Return void' } }
    ],
    cComparison: {
      cCode: `#include <stdio.h>

int main(void) {
    int a = 10;
    int b = 25;
    int total = a + b;
    printf("Result: %d\\n", total);
    return 0;
}`,
      explanation: {
        fr: "En C, gcc compile directement en instructions x86-64 ou ARM. Pas de machine virtuelle ni de ClassLoader. En Java, le code est portable et sécurisé par le vérificateur de bytecode de la JVM.",
        en: "In C, gcc emits raw machine assembly. In Java, bytecode runs inside a managed sandbox with runtime verification and JIT."
      },
      memoryDifference: {
        fr: "C: Exécuté directement sur le registre CPU (rax/rbx). Java: Machine à pile d'opérandes (Operand Stack), puis compilé JIT en assembleur.",
        en: "C: Direct CPU register manipulation. Java: Abstract operand stack machine before JIT compilation."
      }
    },
    executionSteps: [
      {
        stepIndex: 0,
        lineNumber: 1,
        programCounter: 0,
        description: {
          fr: "Chargement de la classe Main dans le Metaspace. Initialisation de la machine virtuelle.",
          en: "Class Main loaded into Metaspace. JVM initialization."
        },
        stackFrames: [],
        heapObjects: [],
        stdout: []
      },
      {
        stepIndex: 1,
        lineNumber: 2,
        programCounter: 2,
        description: {
          fr: "Appel de main(String[] args). Création du Stack Frame main() avec le tableau args.",
          en: "Calling main(String[] args). Main Stack Frame allocated."
        },
        stackFrames: [
          {
            method: 'main(String[] args)',
            variables: [{ name: 'args', type: 'String[]', value: '[]', isRef: true }],
            operandStack: []
          }
        ],
        heapObjects: [],
        stdout: []
      },
      {
        stepIndex: 2,
        lineNumber: 3,
        programCounter: 4,
        description: {
          fr: "Allocation de la variable primitive 'a' = 10 dans la Pile (Stack).",
          en: "Local primitive variable 'a' = 10 allocated on Stack."
        },
        stackFrames: [
          {
            method: 'main(String[] args)',
            variables: [
              { name: 'args', type: 'String[]', value: '[]', isRef: true },
              { name: 'a', type: 'int', value: '10' }
            ],
            operandStack: []
          }
        ],
        heapObjects: [],
        stdout: []
      },
      {
        stepIndex: 3,
        lineNumber: 4,
        programCounter: 6,
        description: {
          fr: "Allocation de 'b' = 25 dans la Pile (Stack).",
          en: "Local variable 'b' = 25 allocated on Stack."
        },
        stackFrames: [
          {
            method: 'main(String[] args)',
            variables: [
              { name: 'args', type: 'String[]', value: '[]', isRef: true },
              { name: 'a', type: 'int', value: '10' },
              { name: 'b', type: 'int', value: '25' }
            ],
            operandStack: []
          }
        ],
        heapObjects: [],
        stdout: []
      },
      {
        stepIndex: 4,
        lineNumber: 5,
        programCounter: 9,
        description: {
          fr: "Opération iadd: 'a' + 'b' -> total = 35 stocké dans la pile.",
          en: "Opcode iadd: 'a' + 'b' -> total = 35 saved on Stack."
        },
        stackFrames: [
          {
            method: 'main(String[] args)',
            variables: [
              { name: 'args', type: 'String[]', value: '[]', isRef: true },
              { name: 'a', type: 'int', value: '10' },
              { name: 'b', type: 'int', value: '25' },
              { name: 'total', type: 'int', value: '35' }
            ],
            operandStack: []
          }
        ],
        heapObjects: [],
        stdout: []
      },
      {
        stepIndex: 5,
        lineNumber: 6,
        programCounter: 12,
        description: {
          fr: "Émission vers la console standard via System.out.",
          en: "Output written to stdout via System.out."
        },
        stackFrames: [
          {
            method: 'main(String[] args)',
            variables: [
              { name: 'args', type: 'String[]', value: '[]', isRef: true },
              { name: 'a', type: 'int', value: '10' },
              { name: 'b', type: 'int', value: '25' },
              { name: 'total', type: 'int', value: '35' }
            ],
            operandStack: []
          }
        ],
        heapObjects: [
          { id: 'str-1', address: '@0x5A01', className: 'java.lang.String', fields: { value: '"Result: 35"' }, isGarbage: false }
        ],
        stdout: ['Result: 35']
      }
    ],
    jvmMemoryNotes: {
      fr: "La Pile (Stack) est spécifique à chaque Thread et gère l'exécution LIFO des méthodes avec leurs variables primitives. Le Tas (Heap) est partagé entre tous les threads et héberge tous les objets instanciés.",
      en: "The Stack is thread-private with LIFO execution frames. The Heap is shared across threads and holds all object instances."
    },
    commonPitfalls: {
      fr: [
        "Confondre la compilation binaire de C avec la compilation en bytecode de Java.",
        "Penser que les primitives créées dans une méthode vont sur le Tas (elles restent sur la Pile dans leur cadre)."
      ],
      en: [
        "Confusing C native binary compilation with Java bytecode translation.",
        "Assuming local primitive variables go to the Heap (they stay in the method's stack frame)."
      ]
    },
    quiz: {
      id: 'q-1',
      question: {
        fr: "Quelle est la principale différence d'exécution entre un binaire C et un fichier .class Java ?",
        en: "What is the primary execution difference between a C binary and a Java .class file?"
      },
      options: {
        fr: [
          "Le binaire C est exécuté par la JVM, tandis que Java est exécuté par le processeur directement.",
          "Le C est compilé en code machine natif pour l'OS cible, Java en Bytecode interprété/JIT par la JVM.",
          "Java n'a pas de compilateur et s'exécute comme un script shell.",
          "Il n'y a aucune différence technique."
        ],
        en: [
          "C binary is executed by the JVM, while Java is run directly by the CPU.",
          "C is compiled to native OS machine code; Java compiles to Bytecode executed/JIT-compiled by the JVM.",
          "Java has no compiler and runs as an unparsed shell script.",
          "There is no difference."
        ]
      },
      correctIndex: 1,
      explanation: {
        fr: "Exact ! Le C produit des instructions machine directes, tandis que Java produit du bytecode portable exécuté et optimisé par la JVM.",
        en: "Correct! C compiles directly to native instructions; Java compiles to portable bytecode that the JVM executes and JIT-optimizes."
      }
    }
  },
  {
    id: 'ch-2',
    title: {
      fr: '2. Pile (Stack) vs Tas (Heap): Modèle Mémoire Fondamental',
      en: '2. Stack vs Heap: JVM Core Memory Model'
    },
    subtitle: {
      fr: 'Allocation, durées de vie, cadres LIFO et Garbage Collection',
      en: 'Allocation, lifespans, LIFO frames, and Garbage Collection'
    },
    category: 'Memory & JVM',
    estimatedTime: '15 min',
    iconName: 'Layers',
    summary: {
      fr: "En Java, la mémoire est scindée en deux grands espaces vitaux: la Pile (Stack) qui gère les appels de fonctions et stocke les variables locales (primitives et pointeurs), et le Tas (Heap) où résident TOUS les objets créés avec 'new'.",
      en: "In Java, memory is split into the Stack (handling method calls and local variables) and the Heap (where all objects instantiated with 'new' reside)."
    },
    codeSnippet: `public class MemoryDemo {
    public static void main(String[] args) {
        int count = 5;
        StringBuilder sb = new StringBuilder("Java");
        sb.append("Babel");
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 1,
        code: 'public class MemoryDemo {',
        explanation: {
          fr: "Déclaration de la classe chargée dans la Metaspace.",
          en: "Class declaration loaded into Metaspace."
        }
      },
      {
        lineNumber: 2,
        code: '    public static void main(String[] args) {',
        explanation: {
          fr: "Création du cadre de pile pour main. La pile est rapide, allouée automatiquement et libérée dès que la méthode se termine.",
          en: "Allocation of main's stack frame. Ultra-fast, managed automatically via LIFO."
        }
      },
      {
        lineNumber: 3,
        code: '        int count = 5;',
        explanation: {
          fr: "Primitive 'count' allouée directement dans la pile. Sa valeur est 5.",
          en: "Primitive variable 'count' placed directly on the stack with value 5."
        },
        memoryHint: {
          fr: "Stack: count = 5",
          en: "Stack: count = 5"
        }
      },
      {
        lineNumber: 4,
        code: '        StringBuilder sb = new StringBuilder("Java");',
        explanation: {
          fr: "'sb' est une variable référence dans la Pile. Elle contient l'adresse mémoire (ex: @0x7F9A) qui pointe vers l'objet StringBuilder alloué sur le Tas (Heap).",
          en: "'sb' is a reference variable on the Stack containing the memory address (@0x7F9A) pointing to the StringBuilder instance on the Heap."
        },
        memoryHint: {
          fr: "Stack: sb -> Heap @0x7F9A",
          en: "Stack: sb -> Heap @0x7F9A"
        }
      },
      {
        lineNumber: 5,
        code: '        sb.append("Babel");',
        explanation: {
          fr: "Mutation de l'objet sur le Tas. Contrairement à String, StringBuilder est mutable et réalloue son tableau interne de char sans créer de nouvel objet.",
          en: "Mutating the object on the Heap. StringBuilder expands its internal char array in place."
        },
        memoryHint: {
          fr: "Heap @0x7F9A: valeur mutée en \"JavaBabel\"",
          en: "Heap @0x7F9A: value mutated to \"JavaBabel\""
        }
      }
    ],
    bytecode: [
      { offset: 0, opcode: 'iconst_5', comment: { fr: 'Charge la constante 5 sur la pile', en: 'Push integer constant 5' } },
      { offset: 1, opcode: 'istore_1', comment: { fr: 'Stocke dans variable 1 (count)', en: 'Store into local var 1' } },
      { offset: 2, opcode: 'new #2 <StringBuilder>', comment: { fr: 'Alloue de la mémoire brute sur le Tas (Heap)', en: 'Allocate uninitialized memory on Heap' } },
      { offset: 5, opcode: 'dup', comment: { fr: 'Duplique la référence pour le constructeur', en: 'Duplicate object reference on stack' } },
      { offset: 6, opcode: 'ldc #3 <"Java">', comment: { fr: 'Charge la chaîne depuis le String Pool', en: 'Load constant string from pool' } },
      { offset: 8, opcode: 'invokespecial #4 <init>', comment: { fr: 'Appelle le constructeur <init>', en: 'Invoke constructor' } },
      { offset: 11, opcode: 'astore_2', comment: { fr: 'Stocke la référence dans sb', en: 'Store reference in local var 2' } }
    ],
    cComparison: {
      cCode: `#include <stdlib.h>
#include <string.h>

int main(void) {
    int count = 5;
    // En C, équivalent du Tas: malloc()
    char *sb = malloc(32 * sizeof(char));
    strcpy(sb, "Java");
    strcat(sb, "Babel");
    
    // OBLIGATOIRE en C pour éviter une fuite mémoire!
    free(sb);
    return 0;
}`,
      explanation: {
        fr: "En C, toute allocation sur le Tas se fait via malloc() et DOIT être libérée avec free(). En Java, 'new' alloue sur le Tas, et le Garbage Collector libère automatiquement la mémoire quand l'objet n'est plus référencé !",
        en: "In C, heap memory requires manual malloc() and free(). In Java, 'new' allocates on Heap, and Garbage Collection frees it automatically!"
      },
      memoryDifference: {
        fr: "C: Risque de fuite mémoire (leak) ou double-free. Java: Garbage Collector automatique par détection de racines (GC Roots).",
        en: "C: High risk of leaks or double-free bugs. Java: Automatic tracing GC."
      }
    },
    executionSteps: [
      {
        stepIndex: 0,
        lineNumber: 2,
        programCounter: 0,
        description: {
          fr: "Entrée dans main(). Initialisation du cadre de pile.",
          en: "Entering main(). Stack frame initialized."
        },
        stackFrames: [
          { method: 'main()', variables: [{ name: 'args', type: 'String[]', value: '[]', isRef: true }], operandStack: [] }
        ],
        heapObjects: [],
        stdout: []
      },
      {
        stepIndex: 1,
        lineNumber: 3,
        programCounter: 1,
        description: {
          fr: "Allocation de la primitive 'count' = 5 dans la Pile (Stack).",
          en: "Allocating primitive 'count' = 5 on Stack."
        },
        stackFrames: [
          {
            method: 'main()',
            variables: [
              { name: 'args', type: 'String[]', value: '[]', isRef: true },
              { name: 'count', type: 'int', value: '5' }
            ],
            operandStack: []
          }
        ],
        heapObjects: [],
        stdout: []
      },
      {
        stepIndex: 2,
        lineNumber: 4,
        programCounter: 11,
        description: {
          fr: "Instanciation 'new StringBuilder(\"Java\")'. Objet créé sur le Tas à @0x7F9A, variable sb sur la pile pointe vers cette adresse.",
          en: "'new StringBuilder' creates object on Heap at @0x7F9A; 'sb' stack variable points to it."
        },
        stackFrames: [
          {
            method: 'main()',
            variables: [
              { name: 'args', type: 'String[]', value: '[]', isRef: true },
              { name: 'count', type: 'int', value: '5' },
              { name: 'sb', type: 'StringBuilder', value: '@0x7F9A', isRef: true }
            ],
            operandStack: []
          }
        ],
        heapObjects: [
          { id: 'hb-1', address: '@0x7F9A', className: 'StringBuilder', fields: { value: '"Java"', capacity: '20' }, isGarbage: false }
        ],
        stdout: []
      },
      {
        stepIndex: 3,
        lineNumber: 5,
        programCounter: 15,
        description: {
          fr: "Exécution de sb.append(\"Babel\"). L'objet sur le Tas à @0x7F9A est muté directement sans changer d'adresse.",
          en: "sb.append(\"Babel\") executed. Object at @0x7F9A mutated in-place."
        },
        stackFrames: [
          {
            method: 'main()',
            variables: [
              { name: 'args', type: 'String[]', value: '[]', isRef: true },
              { name: 'count', type: 'int', value: '5' },
              { name: 'sb', type: 'StringBuilder', value: '@0x7F9A', isRef: true }
            ],
            operandStack: []
          }
        ],
        heapObjects: [
          { id: 'hb-1', address: '@0x7F9A', className: 'StringBuilder', fields: { value: '"JavaBabel"', capacity: '20' }, isGarbage: false }
        ],
        stdout: []
      }
    ],
    jvmMemoryNotes: {
      fr: "Si la pile dépasse sa taille maximale (ex: récursion infinie), la JVM lève une 'StackOverflowError'. Si le tas est plein et que le GC ne peut plus libérer de mémoire, la JVM lève 'OutOfMemoryError: Java heap space'.",
      en: "Excessive stack frames trigger 'StackOverflowError'. Depleted Heap triggers 'OutOfMemoryError: Java heap space'."
    },
    commonPitfalls: {
      fr: [
        "Confondre la référence (qui est sur la pile) et l'objet lui-même (qui est sur le tas).",
        "Créer des millions d'objets inutiles dans une boucle au lieu de réutiliser des structures mutables."
      ],
      en: [
        "Confusing the reference pointer on the stack with the object data on the heap.",
        "Allocating millions of temporary objects inside a tight loop instead of reusing buffers."
      ]
    },
    quiz: {
      id: 'q-2',
      question: {
        fr: "Quand on exécute 'Person p = new Person();', où se trouve la variable 'p' et où se trouve l'objet Person ?",
        en: "When running 'Person p = new Person();', where is 'p' and where is the Person instance?"
      },
      options: {
        fr: [
          "'p' et l'objet sont tous deux stockés sur la Pile (Stack).",
          "'p' est sur la Pile (contenant l'adresse mémoire), l'objet est sur le Tas (Heap).",
          "'p' est sur le Tas, l'objet est dans le Metaspace.",
          "Les deux sont stockés dans le registre CPU."
        ],
        en: [
          "Both 'p' and the instance reside on the Stack.",
          "'p' is on the Stack (holding the memory address), the instance is on the Heap.",
          "'p' is on the Heap, the instance is in Metaspace.",
          "Both reside in CPU registers."
        ]
      },
      correctIndex: 1,
      explanation: {
        fr: "Exact ! La variable locale 'p' est une référence (pointeur sécurisé) qui réside dans le cadre de pile et pointe vers l'instance allouée sur le Tas.",
        en: "Exactly! The local variable 'p' is a safe reference pointer on the Stack pointing to the Heap instance."
      }
    }
  },
  {
    id: 'ch-3',
    title: {
      fr: '3. Pointeurs C vs Références Java & Sécurité Mémoire',
      en: '3. C Pointers vs Java References & Memory Safety'
    },
    subtitle: {
      fr: 'Pourquoi Java n a pas d arithmétique de pointeurs ni de Segmentation Fault',
      en: 'Why Java lacks pointer arithmetic and prevents Segmentation Faults'
    },
    category: 'Memory & JVM',
    estimatedTime: '15 min',
    iconName: 'ShieldAlert',
    summary: {
      fr: "En C, un pointeur est une adresse mémoire brute: on peut faire `ptr++`, lire n'importe où dans la RAM et provoquer un 'Segmentation fault'. En Java, TOUTES les variables d'objets sont des 'Références': des pointeurs opaques gérés par la JVM sans arithmétique possible.",
      en: "In C, pointers are raw memory addresses vulnerable to buffer overflows and segfaults. In Java, all object variables are opaque managed references guaranteed memory-safe."
    },
    codeSnippet: `public class PointerDemo {
    public static void main(String[] args) {
        String original = new String("Secured");
        String copy = original; // Copie de référence
        original = null; // Détache la première référence
        System.out.println("Copy still exists: " + copy);
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 3,
        code: '        String original = new String("Secured");',
        explanation: {
          fr: "Allocation de l'objet sur le Tas (@0x10A). La variable 'original' stocke l'adresse @0x10A.",
          en: "String instance allocated on Heap (@0x10A). Variable 'original' holds address @0x10A."
        }
      },
      {
        lineNumber: 4,
        code: '        String copy = original;',
        explanation: {
          fr: "COPIE DE RÉFÉRENCE (et non de l'objet !). 'copy' reçoit la valeur de l'adresse @0x10A. Les deux variables pointent vers le MÊME objet sur le Tas.",
          en: "REFERENCE COPY. 'copy' receives the exact address @0x10A. Both variables point to the same Heap object."
        },
        memoryHint: {
          fr: "Stack: copy -> @0x10A, original -> @0x10A",
          en: "Stack: copy -> @0x10A, original -> @0x10A"
        }
      },
      {
        lineNumber: 5,
        code: '        original = null;',
        explanation: {
          fr: "Affecte null (adresse 0x0) à 'original'. L'objet sur le Tas N'EST PAS détruit car 'copy' le référence toujours ! (Pas de dangling pointer).",
          en: "Sets 'original' to null. The Heap object is NOT destroyed because 'copy' still points to it (prevents dangling pointers)."
        },
        memoryHint: {
          fr: "Stack: original = null (0x0), copy -> @0x10A",
          en: "Stack: original = null (0x0), copy -> @0x10A"
        }
      }
    ],
    bytecode: [
      { offset: 0, opcode: 'new #2 <java/lang/String>', comment: { fr: 'Alloue objet String', en: 'Allocate String' } },
      { offset: 3, opcode: 'astore_1', comment: { fr: 'Stocke référence dans original', en: 'Store ref in original' } },
      { offset: 4, opcode: 'aload_1', comment: { fr: 'Charge original', en: 'Load original' } },
      { offset: 5, opcode: 'astore_2', comment: { fr: 'Copie la référence dans copy', en: 'Copy ref into copy' } },
      { offset: 6, opcode: 'aconst_null', comment: { fr: 'Charge la valeur null (0x0)', en: 'Push null constant' } },
      { offset: 7, opcode: 'astore_1', comment: { fr: 'Met original à null', en: 'Assign null to original' } }
    ],
    cComparison: {
      cCode: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    char *ptr = malloc(10);
    // En C: Arithmétique de pointeur possible (DANGEREUX!)
    ptr = ptr + 100000; // Pointeur sauvage
    *ptr = 'A'; // -> CRASH: Segmentation fault (core dumped)
    return 0;
}`,
      explanation: {
        fr: "En C, vous pouvez corrompre la mémoire en avançant un pointeur en dehors du tampon. En Java, il est impossible d'additionner des entiers à une référence d'objet.",
        en: "In C, pointer arithmetic allows illegal memory access causing segfaults. Java strictly forbids pointer math."
      },
      memoryDifference: {
        fr: "C: Déréférencement aveugle = Segfault. Java: Vérification automatique = NullPointerException ou ArrayIndexOutOfBoundsException.",
        en: "C: Blind dereference = Crash. Java: Checked exceptions with full stack trace."
      }
    },
    executionSteps: [
      {
        stepIndex: 0,
        lineNumber: 3,
        programCounter: 3,
        description: {
          fr: "Création de l'objet \"Secured\" sur le Tas à l'adresse @0x10A. La variable 'original' pointe vers lui.",
          en: "Object \"Secured\" created at Heap @0x10A. 'original' points to it."
        },
        stackFrames: [
          {
            method: 'main()',
            variables: [{ name: 'original', type: 'String', value: '@0x10A', isRef: true }],
            operandStack: []
          }
        ],
        heapObjects: [
          { id: 'str-sec', address: '@0x10A', className: 'java.lang.String', fields: { value: '"Secured"' }, isGarbage: false }
        ],
        stdout: []
      },
      {
        stepIndex: 1,
        lineNumber: 4,
        programCounter: 5,
        description: {
          fr: "Assignation 'copy = original'. La référence @0x10A est copiée dans la pile. Deux variables pointent vers le même objet.",
          en: "'copy = original'. Reference @0x10A copied. Both variables target the same instance."
        },
        stackFrames: [
          {
            method: 'main()',
            variables: [
              { name: 'original', type: 'String', value: '@0x10A', isRef: true },
              { name: 'copy', type: 'String', value: '@0x10A', isRef: true }
            ],
            operandStack: []
          }
        ],
        heapObjects: [
          { id: 'str-sec', address: '@0x10A', className: 'java.lang.String', fields: { value: '"Secured"' }, isGarbage: false }
        ],
        stdout: []
      },
      {
        stepIndex: 2,
        lineNumber: 5,
        programCounter: 7,
        description: {
          fr: "original = null. La variable 'original' vaut null. Mais 'copy' maintient l'objet vivant (non-éligible au Garbage Collector).",
          en: "'original' set to null. 'copy' keeps the object alive, preventing GC collection."
        },
        stackFrames: [
          {
            method: 'main()',
            variables: [
              { name: 'original', type: 'String', value: 'null (0x0)', isRef: true },
              { name: 'copy', type: 'String', value: '@0x10A', isRef: true }
            ],
            operandStack: []
          }
        ],
        heapObjects: [
          { id: 'str-sec', address: '@0x10A', className: 'java.lang.String', fields: { value: '"Secured"' }, isGarbage: false }
        ],
        stdout: ['Copy still exists: Secured']
      }
    ],
    jvmMemoryNotes: {
      fr: "Les références Java sont des adresses compressées sous 64-bit (Compressed OOPs) de 32 bits quand le tas fait moins de 32 Go, optimisant drastiquement l'usage du cache CPU L1/L2.",
      en: "JVM uses Compressed OOPs (Ordinary Object Pointers) to store 64-bit pointers in 32 bits on heaps under 32GB."
    },
    commonPitfalls: {
      fr: [
        "Croire qu'affecter un objet à une autre variable clone l'objet (c'est une copie de pointeur d'adresse).",
        "Tenter d'accéder à un membre via une référence valant null (déclenche NullPointerException)."
      ],
      en: [
        "Believing assigning an object variable clones the object (only the reference pointer is copied).",
        "Invoking a method on null (triggers NullPointerException)."
      ]
    },
    quiz: {
      id: 'q-3',
      question: {
        fr: "Que se passe-t-il si vous tentez d'effectuer une arithmétique de pointeur comme 'ref = ref + 4;' en Java ?",
        en: "What happens if you attempt pointer arithmetic like 'ref = ref + 4;' in Java?"
      },
      options: {
        fr: [
          "Le code compile et saute de 4 octets dans la mémoire.",
          "Une erreur de compilation stricte est levée: Java interdit l'arithmétique sur les références.",
          "La JVM plante avec un Segmentation fault à l'exécution.",
          "La référence est convertie automatiquement en entier long."
        ],
        en: [
          "Code compiles and advances 4 bytes in RAM.",
          "Strict compilation error: Java prohibits pointer arithmetic on references.",
          "JVM crashes with a Segmentation fault at runtime.",
          "The reference is silently cast to a long integer."
        ]
      },
      correctIndex: 1,
      explanation: {
        fr: "Tout à fait ! Le compilateur javac rejette formellement toute tentative d'opération mathématique sur une référence d'objet, garantissant la sécurité de la mémoire.",
        en: "Spot on! The javac compiler rejects mathematical operations on object references, preserving memory safety."
      }
    }
  },
  {
    id: 'ch-4',
    title: {
      fr: '4. Chaînes de Caractères: char* C vs String & String Pool',
      en: '4. Strings: C char* vs Java String & String Pool'
    },
    subtitle: {
      fr: 'Immutabilité, String Constant Pool, et la différence cruciale entre == et .equals()',
      en: 'Immutability, String Constant Pool, and == vs .equals()'
    },
    category: 'Fundamentals',
    estimatedTime: '15 min',
    iconName: 'Sparkles',
    summary: {
      fr: "En C, une chaîne est un simple tableau d'octets terminé par un caractère nul '\\0'. En Java, 'String' est un objet immuable hautement optimisé doté d'un 'String Constant Pool' dans le Tas pour mutualiser la mémoire des littéraux identiques.",
      en: "In C, strings are null-terminated byte buffers. In Java, String is an immutable object backed by a deduplicating String Constant Pool on the Heap."
    },
    codeSnippet: `public class StringDemo {
    public static void main(String[] args) {
        String s1 = "Java"; // Stocké dans le String Pool
        String s2 = "Java"; // Réutilise la même référence !
        String s3 = new String("Java"); // Force un nouvel objet sur le Tas

        boolean sameRef = (s1 == s2); // true (même adresse mémoire)
        boolean sameRefNew = (s1 == s3); // false (adresses différentes)
        boolean sameContent = s1.equals(s3); // true (même contenu texte)
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 3,
        code: '        String s1 = "Java"; // Stocké dans le String Pool',
        explanation: {
          fr: "La JVM vérifie si \"Java\" existe dans le String Pool. Comme ce n'est pas le cas, elle crée l'instance dans le pool et affecte son adresse à s1.",
          en: "JVM checks String Pool. It allocates \"Java\" inside the pool and assigns its address to s1."
        },
        memoryHint: {
          fr: "String Pool: [\"Java\" @0xPOOL1]",
          en: "String Pool: [\"Java\" @0xPOOL1]"
        }
      },
      {
        lineNumber: 4,
        code: '        String s2 = "Java"; // Réutilise la même référence !',
        explanation: {
          fr: "OPTIMISATION MAJEURE: \"Java\" est déjà dans le pool ! Aucune mémoire allouée. s2 reçoit la MÊME adresse mémoire que s1 (@0xPOOL1).",
          en: "MAJOR OPTIMIZATION: \"Java\" already in pool! No new memory allocated. s2 gets the EXACT same address as s1."
        },
        memoryHint: {
          fr: "Stack: s2 -> @0xPOOL1 (Identique à s1)",
          en: "Stack: s2 -> @0xPOOL1 (Same as s1)"
        }
      },
      {
        lineNumber: 5,
        code: '        String s3 = new String("Java"); // Force un nouvel objet',
        explanation: {
          fr: "'new' contourne le pool et force une allocation distincte sur le Tas ordinaire (@0xHEAP2).",
          en: "'new' bypasses pool interning, creating a distinct Heap object at @0xHEAP2."
        },
        memoryHint: {
          fr: "Heap: Nouvel objet à @0xHEAP2",
          en: "Heap: Distinct object at @0xHEAP2"
        }
      },
      {
        lineNumber: 7,
        code: '        boolean sameRef = (s1 == s2); // true',
        explanation: {
          fr: "L'opérateur '==' en Java compare LES ADRESSES MÉMOIRE (identités de pointeurs), pas le texte ! Comme s1 et s2 pointent vers @0xPOOL1, c'est true.",
          en: "'==' compares memory addresses (pointer identities). Since s1 and s2 both point to @0xPOOL1, it evaluates to true."
        }
      },
      {
        lineNumber: 9,
        code: '        boolean sameContent = s1.equals(s3); // true',
        explanation: {
          fr: ".equals() compare la séquence de caractères (valeur textuelle), et renvoie true même si les adresses diffèrent !",
          en: ".equals() compares actual character sequences, returning true even with distinct heap addresses."
        }
      }
    ],
    bytecode: [
      { offset: 0, opcode: 'ldc #2 <"Java">', comment: { fr: 'Charge "Java" depuis le String Constant Pool', en: 'Load constant "Java" from pool' } },
      { offset: 2, opcode: 'astore_1', comment: { fr: 'Stocke dans s1', en: 'Store into s1' } },
      { offset: 3, opcode: 'ldc #2 <"Java">', comment: { fr: 'Charge à nouveau la même référence', en: 'Load same pooled ref' } },
      { offset: 5, opcode: 'astore_2', comment: { fr: 'Stocke dans s2', en: 'Store into s2' } },
      { offset: 6, opcode: 'new #3 <String>', comment: { fr: 'Alloue objet String ordinaire', en: 'Allocate distinct String' } }
    ],
    cComparison: {
      cCode: `#include <stdio.h>
#include <string.h>

int main(void) {
    char s1[] = "Java";
    char s2[] = "Java";
    // En C, s1 == s2 compare les adresses de tableaux dans la pile -> toujours FAUX!
    if (s1 == s2) { /* N'est jamais exécuté */ }
    
    // Il faut utiliser strcmp()
    if (strcmp(s1, s2) == 0) {
        printf("Même texte\\n");
    }
    return 0;
}`,
      explanation: {
        fr: "En C, les chaînes littérales sont mutables ou non selon qu'elles sont dans la section .rodata. En Java, String est strictement immuable (thread-safe par nature).",
        en: "In C, strings are vulnerable to buffer overflows if not null-terminated. In Java, Strings are strictly immutable and thread-safe."
      },
      memoryDifference: {
        fr: "C: Tableaux de char terminés par '\\0'. Java: Objet contenant un byte[] interne, un hashCode pré-calculé et sa longueur.",
        en: "C: Plain '\\0' terminated arrays. Java: Managed object with internal byte[], cached hash, and length."
      }
    },
    executionSteps: [
      {
        stepIndex: 0,
        lineNumber: 3,
        programCounter: 2,
        description: {
          fr: "String s1 = \"Java\". Entrée du littéral dans le String Pool à @0xPOOL_JAVA.",
          en: "s1 = \"Java\". Literal placed in String Pool at @0xPOOL_JAVA."
        },
        stackFrames: [
          { method: 'main()', variables: [{ name: 's1', type: 'String', value: '@0xPOOL_JAVA', isRef: true }], operandStack: [] }
        ],
        heapObjects: [
          { id: 'pool-1', address: '@0xPOOL_JAVA', className: 'java.lang.String (Pool)', fields: { value: '"Java"' }, isGarbage: false }
        ],
        stdout: []
      },
      {
        stepIndex: 1,
        lineNumber: 4,
        programCounter: 5,
        description: {
          fr: "String s2 = \"Java\". Réutilisation immédiate de @0xPOOL_JAVA ! Économie de mémoire.",
          en: "s2 = \"Java\". Immediate reuse of @0xPOOL_JAVA pointer! Zero allocation."
        },
        stackFrames: [
          {
            method: 'main()',
            variables: [
              { name: 's1', type: 'String', value: '@0xPOOL_JAVA', isRef: true },
              { name: 's2', type: 'String', value: '@0xPOOL_JAVA', isRef: true }
            ],
            operandStack: []
          }
        ],
        heapObjects: [
          { id: 'pool-1', address: '@0xPOOL_JAVA', className: 'java.lang.String (Pool)', fields: { value: '"Java"' }, isGarbage: false }
        ],
        stdout: []
      },
      {
        stepIndex: 2,
        lineNumber: 5,
        programCounter: 10,
        description: {
          fr: "String s3 = new String(\"Java\"). Crée un objet distinct sur le Tas à @0xHEAP_S3.",
          en: "s3 = new String(\"Java\"). Forces distinct Heap allocation at @0xHEAP_S3."
        },
        stackFrames: [
          {
            method: 'main()',
            variables: [
              { name: 's1', type: 'String', value: '@0xPOOL_JAVA', isRef: true },
              { name: 's2', type: 'String', value: '@0xPOOL_JAVA', isRef: true },
              { name: 's3', type: 'String', value: '@0xHEAP_S3', isRef: true }
            ],
            operandStack: []
          }
        ],
        heapObjects: [
          { id: 'pool-1', address: '@0xPOOL_JAVA', className: 'java.lang.String (Pool)', fields: { value: '"Java"' }, isGarbage: false },
          { id: 'heap-3', address: '@0xHEAP_S3', className: 'java.lang.String (Heap)', fields: { value: '"Java"' }, isGarbage: false }
        ],
        stdout: ['sameRef: true', 'sameRefNew: false', 'sameContent: true']
      }
    ],
    jvmMemoryNotes: {
      fr: "Depuis Java 9, la JVM utilise 'Compact Strings': si une chaîne ne contient que des caractères ASCII/Latin-1, elle est encodée sur 1 octet par caractère au lieu de 2 octets UTF-16, réduisant l'empreinte mémoire de 50%.",
      en: "Compact Strings (Java 9+) encodes Latin-1 characters in 1 byte instead of 2-byte UTF-16, halving string memory usage."
    },
    commonPitfalls: {
      fr: [
        "Utiliser '==' pour comparer deux Strings au lieu de '.equals()'. C'est le bug n°1 des débutants en Java !",
        "Faire des concaténations 'str += \"autre\"' dans une grande boucle (crée des centaines d'objets intermédiaires éphémères)."
      ],
      en: [
        "Using '==' to compare two Strings instead of '.equals()'. #1 bug for Java learners!",
        "Repeated string concatenation 'str += ...' in loops causing thousands of temporary heap allocations."
      ]
    },
    quiz: {
      id: 'q-4',
      question: {
        fr: "Pourquoi 's1 == s3' renvoie-t-il false lorsque s1 = \"test\" et s3 = new String(\"test\") ?",
        en: "Why does 's1 == s3' return false when s1 = \"test\" and s3 = new String(\"test\")?"
      },
      options: {
        fr: [
          "Parce que leur contenu textuel est différent.",
          "Parce que '==' compare les adresses mémoire: s1 est dans le String Pool et s3 est un objet séparé sur le Tas.",
          "Parce que new String() convertit le texte en majuscules.",
          "Parce que Java interdit la comparaison entre objets."
        ],
        en: [
          "Because their textual content differs.",
          "Because '==' compares memory addresses: s1 is in the String Pool while s3 is a distinct Heap instance.",
          "Because new String() uppercases the text.",
          "Because Java prevents object comparison."
        ]
      },
      correctIndex: 1,
      explanation: {
        fr: "Exactement ! '==' compare l'égalité référentielle (les pointeurs d'adresse mémoire), tandis que '.equals()' compare le contenu réel des caractères.",
        en: "Exactly! '==' checks referential equality (memory address pointers), whereas '.equals()' checks character sequence equality."
      }
    }
  },
  {
    id: 'ch-5',
    title: {
      fr: '5. POO: Classes, Objets, Encapsulation & Constructeurs',
      en: '5. OOP: Classes, Instances, Encapsulation & Constructors'
    },
    subtitle: {
      fr: 'De la struct en C aux Objets Java dotés d état et de comportement',
      en: 'From C structs to Java Objects with state and methods'
    },
    category: 'OOP',
    estimatedTime: '15 min',
    iconName: 'Box',
    summary: {
      fr: "En C, une 'struct' n'est qu'un regroupement passif de données publiques sans méthodes associées. En Java, une classe fusionne l'état (champs privés) et le comportement (méthodes), garantissant l'intégrité des données grâce à l'encapsulation.",
      en: "In C, a struct is passive data. In Java, a class binds private state with methods, guaranteeing data encapsulation."
    },
    codeSnippet: `public class BankAccount {
    private double balance; // Protégé de l'extérieur
    private String owner;

    public BankAccount(String owner, double initialDeposit) {
        this.owner = owner;
        this.balance = initialDeposit;
    }

    public void deposit(double amount) {
        if (amount > 0) {
            this.balance += amount;
        }
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 2,
        code: '    private double balance; // Protégé de l\'extérieur',
        explanation: {
          fr: "Le mot-clé 'private' interdit l'accès direct aux variables depuis l'extérieur de la classe, empêchant toute corruption d'état.",
          en: "'private' access modifier restricts external field access, protecting state invariant."
        }
      },
      {
        lineNumber: 5,
        code: '    public BankAccount(String owner, double initialDeposit) {',
        explanation: {
          fr: "Le constructeur garantit que chaque instance est obligatoirement initialisée avec un état cohérent lors de l'appel à 'new'.",
          en: "Constructor guarantees consistent initialization upon 'new' invocation."
        }
      },
      {
        lineNumber: 6,
        code: '        this.owner = owner;',
        explanation: {
          fr: "'this' est un pointeur implicite vers l'instance courante sur le Tas en cours de construction.",
          en: "'this' is an implicit reference to the current Heap instance being constructed."
        }
      }
    ],
    bytecode: [
      { offset: 0, opcode: 'aload_0', comment: { fr: 'Charge "this" sur la pile', en: 'Load "this" pointer' } },
      { offset: 1, opcode: 'invokespecial #1 <Object.<init>>', comment: { fr: 'Appelle le constructeur parent Object()', en: 'Call superclass Object constructor' } },
      { offset: 4, opcode: 'aload_0', comment: { fr: 'Charge à nouveau "this"', en: 'Load "this"' } },
      { offset: 5, opcode: 'dload_2', comment: { fr: 'Charge le paramètre double initialDeposit', en: 'Load double deposit param' } },
      { offset: 6, opcode: 'putfield #2 <balance>', comment: { fr: 'Écrit la valeur dans le champ mémoire de l objet', en: 'Write field balance into heap memory' } }
    ],
    cComparison: {
      cCode: `// En C: struct simple avec fonctions séparées
struct BankAccount {
    double balance;
    char owner[32];
};

void deposit(struct BankAccount *acc, double amount) {
    if (acc && amount > 0) {
        acc->balance += amount;
    }
}`,
      explanation: {
        fr: "En C, les fonctions sont séparées des données et la struct est totalement ouverte (pas de modificateur private). En Java, classe = données + méthodes inséparables.",
        en: "In C, structs have public fields and separate functions. In Java, objects bundle state and logic with encapsulation."
      },
      memoryDifference: {
        fr: "C: Pointeur struct explicite (acc->balance). Java: Pointeur implicite 'this' passé automatiquement au bytecode.",
        en: "C: Explicit struct pointer. Java: Implicit 'this' pointer handled by JVM bytecode."
      }
    },
    executionSteps: [
      {
        stepIndex: 0,
        lineNumber: 5,
        programCounter: 0,
        description: {
          fr: "Appel 'new BankAccount(\"Alice\", 500.0)'. La JVM alloue l'en-tête de l'objet (Mark Word + Klass Word) et ses champs sur le Tas.",
          en: "'new BankAccount(\"Alice\", 500.0)'. JVM allocates object header and fields on Heap."
        },
        stackFrames: [
          {
            method: 'BankAccount.<init>(owner="Alice", initialDeposit=500.0)',
            variables: [
              { name: 'this', type: 'BankAccount', value: '@0x99AA', isRef: true },
              { name: 'owner', type: 'String', value: '"Alice"' },
              { name: 'initialDeposit', type: 'double', value: '500.0' }
            ],
            operandStack: []
          }
        ],
        heapObjects: [
          { id: 'acc-1', address: '@0x99AA', className: 'BankAccount', fields: { owner: '"Alice"', balance: '500.0' }, isGarbage: false }
        ],
        stdout: []
      },
      {
        stepIndex: 1,
        lineNumber: 10,
        programCounter: 5,
        description: {
          fr: "Appel de deposit(250.0). Le champ balance passe de 500.0 à 750.0 sur le Tas.",
          en: "Calling deposit(250.0). Balance updated from 500.0 to 750.0 in Heap memory."
        },
        stackFrames: [
          {
            method: 'deposit(amount=250.0)',
            variables: [
              { name: 'this', type: 'BankAccount', value: '@0x99AA', isRef: true },
              { name: 'amount', type: 'double', value: '250.0' }
            ],
            operandStack: []
          }
        ],
        heapObjects: [
          { id: 'acc-1', address: '@0x99AA', className: 'BankAccount', fields: { owner: '"Alice"', balance: '750.0' }, isGarbage: false }
        ],
        stdout: []
      }
    ],
    jvmMemoryNotes: {
      fr: "Chaque objet sur le Tas possède un en-tête d'objet (Object Header) de 12 à 16 octets composé du Mark Word (verrous de synchronisation, âge GC) et du Klass Pointer (référence vers les métadonnées de la classe).",
      en: "Every Heap object contains a 12-16 byte Object Header (Mark Word for locks/GC age + Klass Pointer)."
    },
    commonPitfalls: {
      fr: [
        "Laisser des attributs publics sans modificateurs 'private' (violation de l'encapsulation).",
        "Oublier que les doubles souffrent d'imprécisions d'arrondi (pour l'argent, utiliser BigDecimal)."
      ],
      en: [
        "Leaving attributes public without private modifiers (violating encapsulation).",
        "Floating point rounding errors in financial computations (use BigDecimal instead)."
      ]
    },
    quiz: {
      id: 'q-5',
      question: {
        fr: "Quel composant interne de l'en-tête d'un objet Java stocke les informations de verrou (lock) et l'âge pour le Garbage Collector ?",
        en: "Which part of a Java object header stores synchronization lock info and GC age?"
      },
      options: {
        fr: [
          "Le Mark Word",
          "Le Klass Pointer",
          "Le tableau de variables locales",
          "Le Program Counter"
        ],
        en: [
          "The Mark Word",
          "The Klass Pointer",
          "The Local Variable Array",
          "The Program Counter"
        ]
      },
      correctIndex: 0,
      explanation: {
        fr: "Bravo ! Le Mark Word stocke le hashcode d'identité, l'état de verrouillage (synchronization lock) et l'âge de l'objet pour les cycles du Garbage Collector.",
        en: "Correct! The Mark Word holds identity hashcode, synchronization lock states, and generational GC age bits."
      }
    }
  },
  {
    id: 'ch-6',
    title: {
      fr: '6. Polymorphisme, Héritage & VTable JVM',
      en: '6. Polymorphism, Inheritance & JVM VTable'
    },
    subtitle: {
      fr: 'Liaison dynamique, invokevirtual et tables de méthodes virtuelles',
      en: 'Dynamic dispatch, invokevirtual, and virtual method tables'
    },
    category: 'OOP',
    estimatedTime: '18 min',
    iconName: 'Cpu',
    summary: {
      fr: "En C, appeler une fonction polymorphe exige de manipuler manuellement des pointeurs de fonctions dans des structs. En Java, toutes les méthodes non-statiques et non-finales sont VIRTUELLES par défaut: la JVM résout dynamiquement la méthode à exécuter via la table de méthodes virtuelles (VTable).",
      en: "In C, runtime polymorphism requires manual function pointers in structs. In Java, methods are virtual by default; the JVM resolves calls dynamically via the VTable."
    },
    codeSnippet: `abstract class Shape {
    abstract double area();
}

class Circle extends Shape {
    private double radius = 5.0;
    @Override
    double area() { return Math.PI * radius * radius; }
}

public class PolyDemo {
    public static void main(String[] args) {
        Shape shape = new Circle(); // Polymorphisme
        double res = shape.area(); // invokevirtual -> Circle.area()
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 13,
        code: '        Shape shape = new Circle(); // Polymorphisme',
        explanation: {
          fr: "Type statique = Shape (vérifié à la compilation), Type dynamique = Circle (instance réelle sur le Tas).",
          en: "Static type = Shape (compile-time checked), Dynamic type = Circle (actual Heap runtime instance)."
        }
      },
      {
        lineNumber: 14,
        code: '        double res = shape.area(); // invokevirtual',
        explanation: {
          fr: "L'instruction bytecode 'invokevirtual' consulte la VTable de l'instance réelle (Circle) et exécute son implémentation surchargée.",
          en: "The 'invokevirtual' opcode consults Circle's VTable at runtime to execute Circle.area()."
        }
      }
    ],
    bytecode: [
      { offset: 0, opcode: 'new #2 <Circle>', comment: { fr: 'Alloue instance de Circle', en: 'Allocate Circle instance' } },
      { offset: 3, opcode: 'invokespecial #3 <Circle.<init>>', comment: { fr: 'Constructeur Circle', en: 'Constructor Circle' } },
      { offset: 6, opcode: 'astore_1', comment: { fr: 'Stocke dans variable shape', en: 'Store in shape variable' } },
      { offset: 7, opcode: 'aload_1', comment: { fr: 'Charge la référence shape', en: 'Load shape reference' } },
      { offset: 8, opcode: 'invokevirtual #4 <Shape.area>', comment: { fr: 'Liaison dynamique VTable!', en: 'Dynamic VTable dispatch!' } }
    ],
    cComparison: {
      cCode: `// En C: Emulation manuelle de la VTable par pointeurs de fonctions
typedef struct Shape {
    double (*area)(struct Shape *self);
} Shape;

double circle_area(Shape *self) { return 3.14159 * 25.0; }

Shape create_circle() {
    Shape s;
    s.area = circle_area; // Câblage manuel!
    return s;
}`,
      explanation: {
        fr: "En C, vous devez affecter à la main les pointeurs de fonction. En Java, la JVM automatise la VTable au niveau du Klass Pointer sans risque d'erreur de typage.",
        en: "In C, virtual dispatch requires manual function pointer setup. In Java, JVM manages VTables automatically."
      },
      memoryDifference: {
        fr: "C: Pointeur de fonction explicite par instance. Java: VTable partagée par classe dans le Metaspace.",
        en: "C: Function pointers per instance. Java: Shared VTable in Metaspace."
      }
    },
    executionSteps: [
      {
        stepIndex: 0,
        lineNumber: 13,
        programCounter: 3,
        description: {
          fr: "Allocation de Circle sur le Tas à @0xCC11 avec Klass Pointer vers Circle.class.",
          en: "Circle instance allocated at Heap @0xCC11 with Klass Pointer pointing to Circle.class."
        },
        stackFrames: [
          { method: 'main()', variables: [{ name: 'shape', type: 'Shape', value: '@0xCC11', isRef: true }], operandStack: [] }
        ],
        heapObjects: [
          { id: 'c-1', address: '@0xCC11', className: 'Circle (Shape)', fields: { radius: '5.0', vtable: 'Circle::area' }, isGarbage: false }
        ],
        stdout: []
      },
      {
        stepIndex: 1,
        lineNumber: 14,
        programCounter: 8,
        description: {
          fr: "invokevirtual: La JVM lit l'adresse @0xCC11, examine la VTable et appelle Circle.area(). Résultat = 78.53.",
          en: "invokevirtual: JVM inspects @0xCC11 VTable, executing Circle.area(). Returns 78.53."
        },
        stackFrames: [
          {
            method: 'main()',
            variables: [
              { name: 'shape', type: 'Shape', value: '@0xCC11', isRef: true },
              { name: 'res', type: 'double', value: '78.5398' }
            ],
            operandStack: []
          }
        ],
        heapObjects: [
          { id: 'c-1', address: '@0xCC11', className: 'Circle (Shape)', fields: { radius: '5.0', vtable: 'Circle::area' }, isGarbage: false }
        ],
        stdout: ['Calculated Area: ~78.54']
      }
    ],
    jvmMemoryNotes: {
      fr: "Le JIT Compiler de la JVM effectue l'Inlining monomorphique: s'il constate qu'une méthode polymorphe n'a qu'un seul type à l'exécution, il élimine l'appel VTable et insère le code directement (zéro coût d'abstraction).",
      en: "Monomorphic Call Inlining: JIT removes VTable overhead if only one concrete implementation is ever called."
    },
    commonPitfalls: {
      fr: [
        "Vouloir surcharger une méthode statique (les méthodes static ne sont PAS polymorphes et utilisent invokestatic).",
        "Oublier l'annotation @Override, menant à des surcharges accidentelles non appelées."
      ],
      en: [
        "Attempting to override static methods (static methods use invokestatic and cannot be polymorphic).",
        "Omitting @Override, causing accidental overloading."
      ]
    },
    quiz: {
      id: 'q-6',
      question: {
        fr: "Quelle instruction de bytecode Java est utilisée pour appeler une méthode d'instance virtuelle soumise au polymorphisme ?",
        en: "Which Java bytecode opcode invokes a virtual instance method subject to dynamic dispatch?"
      },
      options: {
        fr: ['invokevirtual', 'invokestatic', 'invokespecial', 'invokedynamic'],
        en: ['invokevirtual', 'invokestatic', 'invokespecial', 'invokedynamic']
      },
      correctIndex: 0,
      explanation: {
        fr: "Exact ! 'invokevirtual' effectue la recherche dynamique dans la VTable de l'instance réelle au moment de l'exécution.",
        en: "Spot on! 'invokevirtual' performs dynamic dispatch using the runtime instance's VTable."
      }
    }
  },
  {
    id: 'ch-7',
    title: {
      fr: '7. Le Garbage Collector en Action (Generational GC)',
      en: '7. The Garbage Collector in Action (Generational GC)'
    },
    subtitle: {
      fr: 'Eden, Survivor (S0/S1), Old Gen, Mark & Sweep et GC Roots',
      en: 'Eden, Survivor Spaces, Old Gen, Mark & Sweep and GC Roots'
    },
    category: 'Memory & JVM',
    estimatedTime: '20 min',
    iconName: 'Trash2',
    summary: {
      fr: "L'hypothèse générationnelle faible stipule que la grande majorité des objets meurent très vite après leur création. Le Tas Java est donc divisé en 'Young Generation' (Eden + 2 Survivor) et 'Old Generation' (Tenured) pour maximiser le débit sans longues pauses Stop-The-World.",
      en: "The weak generational hypothesis states most objects die shortly after allocation. JVM divides Heap into Young Gen (Eden + Survivor) and Old Gen for blazing throughput."
    },
    codeSnippet: `public class GCDemo {
    public static void main(String[] args) {
        Object temp = new Object(); // Alloué dans Eden
        temp = null; // Devient orphelin (éligible GC)
        // Les objets survivant à 15 cycles sont promus dans la Old Gen
        System.gc(); // Demande de Garbage Collection
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 3,
        code: '        Object temp = new Object(); // Alloué dans Eden',
        explanation: {
          fr: "Tous les nouveaux objets atterrissent dans l'espace Eden de la Young Generation. L'allocation y est ultra-rapide via un pointeur TLAB (Thread-Local Allocation Buffer).",
          en: "New objects land in Eden space. Allocation is ultra-fast using TLAB (Thread-Local Allocation Buffers)."
        }
      },
      {
        lineNumber: 4,
        code: '        temp = null; // Devient orphelin',
        explanation: {
          fr: "Le lien entre la GC Root (variable de pile temp) et l'objet sur le Tas est coupé. L'objet devient inaccessible.",
          en: "Link between GC Root (stack variable) and Heap instance is broken. Object becomes unreachable garbage."
        }
      }
    ],
    bytecode: [
      { offset: 0, opcode: 'new #2 <java/lang/Object>', comment: { fr: 'Allocation dans Eden', en: 'Allocate in Eden' } },
      { offset: 3, opcode: 'astore_1', comment: { fr: 'Assigne à temp', en: 'Assign to temp' } },
      { offset: 4, opcode: 'aconst_null', comment: { fr: 'Charge null', en: 'Load null' } },
      { offset: 5, opcode: 'astore_1', comment: { fr: 'temp devient null (déclenche éligibilité GC)', en: 'temp set to null' } }
    ],
    cComparison: {
      cCode: `// En C: Libération manuelle
void work(void) {
    int *data = malloc(1024 * sizeof(int));
    // Si on oublie free(data), la mémoire est PERDUE pour toujours (Memory Leak!)
    free(data);
}`,
      explanation: {
        fr: "En C, oublier 'free()' crée une fuite mémoire silencieuse. En Java, le ramasse-miettes (GC) balaie périodiquement le tas pour recycler la mémoire automatiquement.",
        en: "In C, forgotten free() causes memory leaks. In Java, background GC tracks roots and reclaims orphans."
      },
      memoryDifference: {
        fr: "C: Libération déterministe immédiate. Java: Libération différée non-déterministe par tracing des graphes d'objets.",
        en: "C: Immediate manual free. Java: Tracing garbage collection running concurrently."
      }
    },
    executionSteps: [
      {
        stepIndex: 0,
        lineNumber: 3,
        programCounter: 3,
        description: {
          fr: "Allocation de temp dans l'espace Eden à @0xEDE1. Rattaché à la GC Root 'temp'.",
          en: "temp allocated in Eden space at @0xEDE1. Linked to stack GC Root."
        },
        stackFrames: [
          { method: 'main()', variables: [{ name: 'temp', type: 'Object', value: '@0xEDE1', isRef: true }], operandStack: [] }
        ],
        heapObjects: [
          { id: 'eden-1', address: '@0xEDE1', className: 'java.lang.Object (Eden)', fields: { state: 'Active Reference' }, isGarbage: false }
        ],
        stdout: []
      },
      {
        stepIndex: 1,
        lineNumber: 4,
        programCounter: 5,
        description: {
          fr: "temp = null. L'objet à @0xEDE1 n'a plus de GC Root. Il passe à l'état GARBAGE (à recycler).",
          en: "temp = null. Object at @0xEDE1 is now unreachable garbage."
        },
        stackFrames: [
          { method: 'main()', variables: [{ name: 'temp', type: 'Object', value: 'null', isRef: true }], operandStack: [] }
        ],
        heapObjects: [
          { id: 'eden-1', address: '@0xEDE1', className: 'java.lang.Object (Eden)', fields: { state: 'Unreferenced Garbage' }, isGarbage: true }
        ],
        stdout: []
      },
      {
        stepIndex: 2,
        lineNumber: 6,
        programCounter: 8,
        description: {
          fr: "Minor GC déclenché ! L'objet orphelin @0xEDE1 est balayé et effacé. L'espace Eden est compacté.",
          en: "Minor GC triggered! Garbage object swept and reclaimed. Eden compacted."
        },
        stackFrames: [
          { method: 'main()', variables: [{ name: 'temp', type: 'Object', value: 'null', isRef: true }], operandStack: [] }
        ],
        heapObjects: [],
        stdout: ['[GC (Allocation Failure) [PSYoungGen: 512K->0K] 0K reclaimed]']
      }
    ],
    jvmMemoryNotes: {
      fr: "Les collecteurs modernes de Java comme G1 GC, ZGC et Shenandoah garantissent des temps de pause inférieurs à 1 milliseconde, même sur des tas de plusieurs téraoctets.",
      en: "Modern collectors like ZGC and Shenandoah achieve sub-millisecond pause times even on multi-terabyte heaps."
    },
    commonPitfalls: {
      fr: [
        "Garder des références dans des collections statiques (ex: 'static List cache') provoquant des fuites mémoire invisibles.",
        "Appeler 'System.gc()' manuellement en production (désactive les optimisations automatiques de la JVM)."
      ],
      en: [
        "Holding references in static collections (static memory leaks).",
        "Calling 'System.gc()' manually in production."
      ]
    },
    quiz: {
      id: 'q-7',
      question: {
        fr: "Dans quelle région du Tas un nouvel objet ordinaire est-il alloué en premier lieu ?",
        en: "In which Heap region is a newly created object allocated first?"
      },
      options: {
        fr: [
          "Dans l'espace Eden de la Young Generation",
          "Directement dans la Old / Tenured Generation",
          "Dans le Metaspace",
          "Dans la Pile de Thread (Stack)"
        ],
        en: [
          "In the Eden space of the Young Generation",
          "Directly in the Old / Tenured Generation",
          "In the Metaspace",
          "On the Thread Stack"
        ]
      },
      correctIndex: 0,
      explanation: {
        fr: "Correct ! Tous les nouveaux objets sont alloués dans l'espace Eden. Seuls les survivants aux cycles GC sont promus dans Survivor puis Old Gen.",
        en: "Correct! Newly created objects are placed in Eden space. Survivors are subsequently promoted to Survivor and Old Gen."
      }
    }
  },
  {
    id: 'ch-8',
    title: {
      fr: '8. Collections, Génériques & Autoboxing',
      en: '8. Collections Framework, Generics & Autoboxing'
    },
    subtitle: {
      fr: 'ArrayList, HashMap, HashSet, coût de l Autoboxing et effacement de type',
      en: 'ArrayList, HashMap, HashSet, Autoboxing overhead & Type Erasure'
    },
    category: 'Advanced',
    estimatedTime: '18 min',
    iconName: 'ListOrdered',
    summary: {
      fr: "En C, implémenter une table de hachage ou une liste dynamique demande des centaines de lignes de code manuel en void*. Java offre le Java Collections Framework (`List`, `Set`, `Map`) avec vérification des types à la compilation grâce aux Génériques (`<T>`).",
      en: "In C, dynamic lists and hash maps require manual void* buffers. Java provides a battle-tested Collections Framework with generic compile-time type safety."
    },
    codeSnippet: `import java.util.*;

public class CollectionDemo {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(42); // Autoboxing: int primitive -> Integer Object
        
        Map<String, String> map = new HashMap<>();
        map.put("FR", "France");
        String val = map.get("FR"); // O(1) moyen
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 5,
        code: '        List<Integer> list = new ArrayList<>();',
        explanation: {
          fr: "ArrayList gère un tableau interne sur le Tas qui double automatiquement de taille dès qu'il est plein.",
          en: "ArrayList manages an internal heap array that automatically doubles capacity when filled."
        }
      },
      {
        lineNumber: 6,
        code: '        list.add(42); // Autoboxing',
        explanation: {
          fr: "ATTENTION: Les collections ne stockent que des OBJETS ! La primitive 42 est convertie en 'Integer.valueOf(42)' sur le Tas (Autoboxing).",
          en: "Collections only store objects. The primitive 42 is boxed into an 'Integer.valueOf(42)' object."
        },
        memoryHint: {
          fr: "Coût: 16 à 24 octets pour l'objet Integer au lieu de 4 octets pour int !",
          en: "Cost: 16-24 bytes for boxed Integer instead of 4 bytes for primitive int!"
        }
      }
    ],
    bytecode: [
      { offset: 0, opcode: 'new #2 <ArrayList>', comment: { fr: 'Alloue ArrayList', en: 'Allocate ArrayList' } },
      { offset: 3, opcode: 'bipush 42', comment: { fr: 'Constante primitive 42', en: 'Primitive int 42' } },
      { offset: 5, opcode: 'invokestatic #3 <Integer.valueOf>', comment: { fr: 'AUTOBOXING! int -> Integer', en: 'AUTOBOXING! int -> Integer' } },
      { offset: 8, opcode: 'invokeinterface #4 <List.add>', comment: { fr: 'Ajoute l objet dans la liste', en: 'Add object to list' } }
    ],
    cComparison: {
      cCode: `// En C: Tableau dynamique manuel
typedef struct {
    int *data;
    size_t capacity;
    size_t size;
} Vector;

void push(Vector *v, int val) {
    if (v->size == v->capacity) {
        v->capacity *= 2;
        v->data = realloc(v->data, v->capacity * sizeof(int));
    }
    v->data[v->size++] = val;
}`,
      explanation: {
        fr: "En C, un tableau dynamique d'int ne stocke que les 4 octets purs par élément sans surcoût. En Java, ArrayList<Integer> stocke des références vers des objets Integer.",
        en: "In C, dynamic arrays store compact raw primitives. In Java, ArrayList<Integer> stores references to boxed objects."
      },
      memoryDifference: {
        fr: "C: Mémoire contiguë pure. Java: Tableau de pointeurs vers des objets dispersés sur le Tas.",
        en: "C: Contiguous primitive buffer. Java: Array of reference pointers pointing to heap objects."
      }
    },
    executionSteps: [
      {
        stepIndex: 0,
        lineNumber: 5,
        programCounter: 3,
        description: {
          fr: "Instanciation de l'ArrayList sur le Tas avec une capacité initiale de 10.",
          en: "ArrayList allocated on Heap with default initial capacity 10."
        },
        stackFrames: [
          { method: 'main()', variables: [{ name: 'list', type: 'List<Integer>', value: '@0xARR1', isRef: true }], operandStack: [] }
        ],
        heapObjects: [
          { id: 'al-1', address: '@0xARR1', className: 'java.util.ArrayList', fields: { size: '0', capacity: '10' }, isGarbage: false }
        ],
        stdout: []
      },
      {
        stepIndex: 1,
        lineNumber: 6,
        programCounter: 8,
        description: {
          fr: "Autoboxing de 42 -> Integer@0xINT42. Ajout de la référence dans le tableau interne de list.",
          en: "Autoboxing 42 into Integer@0xINT42. Reference placed into ArrayList buffer."
        },
        stackFrames: [
          { method: 'main()', variables: [{ name: 'list', type: 'List<Integer>', value: '@0xARR1', isRef: true }], operandStack: [] }
        ],
        heapObjects: [
          { id: 'al-1', address: '@0xARR1', className: 'java.util.ArrayList', fields: { size: '1', element0: '@0xINT42' }, isGarbage: false },
          { id: 'int-1', address: '@0xINT42', className: 'java.lang.Integer', fields: { value: '42' }, isGarbage: false }
        ],
        stdout: []
      }
    ],
    jvmMemoryNotes: {
      fr: "L'effacement de type (Type Erasure) supprime toutes les informations génériques `<T>` lors de la compilation pour préserver la rétrocompatibilité avec Java 1.4.",
      en: "Type Erasure removes all generic type params at compile time to maintain backwards compatibility."
    },
    commonPitfalls: {
      fr: [
        "Ignorer le surcoût de l'Autoboxing dans les boucles intensives (utiliser plutôt les tableaux primitifs int[]).",
        "Modifier une collection pendant qu'on la parcourt avec un for-each (ConcurrentModificationException)."
      ],
      en: [
        "Overlooking boxing overhead in high-throughput pipelines.",
        "Mutating a collection while iterating with a foreach loop (ConcurrentModificationException)."
      ]
    },
    quiz: {
      id: 'q-8',
      question: {
        fr: "Quel est l'impact mémoire de l'Autoboxing d'un 'int' en 'Integer' dans une ArrayList ?",
        en: "What is the memory impact of Autoboxing an 'int' into 'Integer' in an ArrayList?"
      },
      options: {
        fr: [
          "Aucun surcoût, l'entier reste codé sur 4 octets.",
          "Chaque entier devient un objet complet sur le Tas avec en-tête d'objet (passant de 4 à 16-24 octets).",
          "L'entier est stocké dans le Metaspace.",
          "La taille de l'entier est divisée par deux."
        ],
        en: [
          "Zero overhead, the integer remains 4 bytes.",
          "Each integer becomes a Heap object with object header (ballooning from 4 to 16-24 bytes).",
          "The integer moves to Metaspace.",
          "Integer size is halved."
        ]
      },
      correctIndex: 1,
      explanation: {
        fr: "Exactement ! Un objet Integer nécessite un Object Header (12 octets) + la valeur 4 octets + alignement (16 à 24 octets), multipliant la consommation mémoire par 4 à 6 !",
        en: "Spot on! An Integer object includes headers and padding, multiplying memory footprint by 4-6x!"
      }
    }
  },
  {
    id: 'ch-9',
    title: {
      fr: '9. Gestion des Exceptions & Déroulement de Pile',
      en: '9. Exception Handling & Stack Unwinding'
    },
    subtitle: {
      fr: 'Checked vs Unchecked, try-with-resources et déroulement sécurisé',
      en: 'Checked vs Unchecked, try-with-resources and safe stack unwinding'
    },
    category: 'Fundamentals',
    estimatedTime: '15 min',
    iconName: 'AlertTriangle',
    summary: {
      fr: "En C, les erreurs sont souvent signalées par des codes de retour négatifs ou NULL, que les développeurs oublient souvent de tester. En Java, le système d'exceptions interrompt le flux d'exécution et déroule la pile (Stack Unwinding) de façon garantie et traçable.",
      en: "In C, errors are signaled via status integers or NULL checks frequently overlooked. Java exceptions cleanly unwind stack frames with comprehensive stack traces."
    },
    codeSnippet: `import java.io.*;

public class ExceptionDemo {
    public static void readFile(String path) {
        // try-with-resources garantit la fermeture automatique
        try (BufferedReader br = new BufferedReader(new FileReader(path))) {
            System.out.println(br.readLine());
        } catch (IOException e) {
            System.err.println("Fichier introuvable: " + e.getMessage());
        }
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 6,
        code: '        try (BufferedReader br = new BufferedReader(new FileReader(path))) {',
        explanation: {
          fr: "Le 'try-with-resources' ferme automatiquement tout objet implémentant 'AutoCloseable', même en cas d'exception ou d'erreur imprévue !",
          en: "Try-with-resources automatically invokes close() on any AutoCloseable resource even if an error is thrown."
        }
      },
      {
        lineNumber: 8,
        code: '        } catch (IOException e) {',
        explanation: {
          fr: "IOException est une 'Checked Exception' vérifiée à la compilation: le compilateur refuse de compiler si elle n'est ni attrapée ni déclarée dans 'throws'.",
          en: "IOException is a Checked Exception: the compiler strictly enforces either catch or throws."
        }
      }
    ],
    bytecode: [
      { offset: 0, opcode: 'new #2 <BufferedReader>', comment: { fr: 'Ouvre le reader', en: 'Allocate reader' } },
      { offset: 10, opcode: 'invokevirtual #3 <readLine>', comment: { fr: 'Lit la ligne', en: 'Read line' } },
      { offset: 25, opcode: 'invokevirtual #4 <close>', comment: { fr: 'Fermeture automatique AutoCloseable', en: 'Automatic close invocation' } }
    ],
    cComparison: {
      cCode: `FILE *f = fopen("test.txt", "r");
if (f == NULL) {
    perror("Erreur ouverture");
    return;
}
// Si on retourne ici sans fclose(f), fuite de descripteur de fichier!
fclose(f);`,
      explanation: {
        fr: "En C, tout oubli de fclose() épuise les descripteurs de fichiers de l'OS. En Java, try-with-resources génère un bloc 'finally' automatique certifié étanche.",
        en: "In C, omitted fclose() leaks OS file handles. In Java, try-with-resources compiles to an infallible finally cleanup."
      },
      memoryDifference: {
        fr: "C: Pas de trace d'appel automatique. Java: Objet Throwable contenant l'instantané de tous les cadres de pile.",
        en: "C: No automatic stack traces. Java: Throwable holds complete thread stack snapshot."
      }
    },
    executionSteps: [
      {
        stepIndex: 0,
        lineNumber: 6,
        programCounter: 0,
        description: {
          fr: "Entrée dans le bloc try-with-resources. Allocation de la ressource BufferedReader.",
          en: "Entering try-with-resources block. BufferedReader allocated."
        },
        stackFrames: [
          { method: 'readFile(path="data.txt")', variables: [{ name: 'br', type: 'BufferedReader', value: '@0xFILE1', isRef: true }], operandStack: [] }
        ],
        heapObjects: [
          { id: 'f-1', address: '@0xFILE1', className: 'BufferedReader', fields: { open: 'true' }, isGarbage: false }
        ],
        stdout: []
      },
      {
        stepIndex: 1,
        lineNumber: 8,
        programCounter: 25,
        description: {
          fr: "Fin du bloc. La JVM appelle automatiquement br.close(). La ressource est fermée de manière sûre.",
          en: "Block exit. JVM automatically triggers br.close(). Resource safely closed."
        },
        stackFrames: [
          { method: 'readFile()', variables: [{ name: 'br', type: 'BufferedReader', value: '@0xFILE1', isRef: true }], operandStack: [] }
        ],
        heapObjects: [
          { id: 'f-1', address: '@0xFILE1', className: 'BufferedReader', fields: { open: 'false (Closed)' }, isGarbage: false }
        ],
        stdout: ['[Resource closed safely via AutoCloseable]']
      }
    ],
    jvmMemoryNotes: {
      fr: "Créer une exception est coûteux en performances car la méthode 'fillInStackTrace()' parcourt toute la pile d'exécution du thread pour construire le tableau StackTraceElement[].",
      en: "Constructing exceptions is CPU-intensive because fillInStackTrace() walks the entire thread stack."
    },
    commonPitfalls: {
      fr: [
        "Attraper 'Exception' de manière générique et laisser le bloc catch vide (avale les bugs).",
        "Utiliser les exceptions pour gérer le flux logique normal au lieu de cas exceptionnels."
      ],
      en: [
        "Catching generic Exception and leaving the catch block empty (swallowing bugs).",
        "Using exceptions for standard control flow."
      ]
    },
    quiz: {
      id: 'q-9',
      question: {
        fr: "Quelle interface Java un objet doit-il implémenter pour être utilisé dans un 'try-with-resources' ?",
        en: "Which Java interface must an object implement to be eligible for try-with-resources?"
      },
      options: {
        fr: ['AutoCloseable', 'Serializable', 'Cloneable', 'Comparable'],
        en: ['AutoCloseable', 'Serializable', 'Cloneable', 'Comparable']
      },
      correctIndex: 0,
      explanation: {
        fr: "Exact ! AutoCloseable (ou son sous-type Closeable) définit la méthode 'void close()' appelée automatiquement par le compilateur.",
        en: "Correct! AutoCloseable defines 'void close()' executed automatically by compiler-generated bytecode."
      }
    }
  },
  {
    id: 'ch-10',
    title: {
      fr: '10. Programmation Fonctionnelle, Lambdas & Streams',
      en: '10. Functional Java: Lambdas & Streams API'
    },
    subtitle: {
      fr: 'Pipelines déclaratifs, évaluation paresseuse et invokedynamic',
      en: 'Declarative pipelines, lazy evaluation and invokedynamic'
    },
    category: 'Advanced',
    estimatedTime: '20 min',
    iconName: 'Zap',
    summary: {
      fr: "Depuis Java 8, Java allie programmation orientée objet et paradigme fonctionnel. Les Streams permettent d'écrire des transformations de données (map, filter, reduce) concises, paresseuses et parallélisables sans boucles for impératives.",
      en: "Java combines OOP with functional programming. Streams provide declarative, lazy, and parallel data pipelines (map, filter, reduce) using lambdas."
    },
    codeSnippet: `import java.util.*;
import java.util.stream.*;

public class StreamDemo {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);

        int sumOfEvenSquares = numbers.stream()
            .filter(n -> n % 2 == 0) // Garde [2, 4, 6]
            .map(n -> n * n)        // Transforme en [4, 16, 36]
            .reduce(0, Integer::sum); // Somme = 56
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 8,
        code: '        int sumOfEvenSquares = numbers.stream()',
        explanation: {
          fr: "Création d'un flux (Stream). Un flux ne stocke aucune donnée: c'est un pipeline de calcul paresseux (lazy).",
          en: "Creating a Stream pipeline. Streams do not store data; they are lazy calculation pipelines."
        }
      },
      {
        lineNumber: 9,
        code: '            .filter(n -> n % 2 == 0)',
        explanation: {
          fr: "Opération intermédiaire: les lambdas Java utilisent l'instruction de bytecode 'invokedynamic' pour instancier des fonctions avec une empreinte mémoire quasi-nulle.",
          en: "Intermediate operation: Java lambdas leverage 'invokedynamic' bytecode for minimal memory footprint."
        }
      },
      {
        lineNumber: 11,
        code: '            .reduce(0, Integer::sum);',
        explanation: {
          fr: "Opération TERMINALE: c'est elle qui déclenche l'exécution de tout le pipeline. Sans opération terminale, rien ne s'exécute !",
          en: "TERMINAL operation: triggers actual evaluation. Intermediate steps are purely lazy until a terminal op runs."
        }
      }
    ],
    bytecode: [
      { offset: 0, opcode: 'invokedynamic #2 <apply>', comment: { fr: 'Génère la lambda via LambdaMetafactory', en: 'Lambda generation via LambdaMetafactory' } },
      { offset: 5, opcode: 'invokeinterface #3 <filter>', comment: { fr: 'Ajoute le filtre au pipeline', en: 'Add filter stage' } },
      { offset: 10, opcode: 'invokeinterface #4 <reduce>', comment: { fr: 'Opération terminale de réduction', en: 'Terminal reduce operation' } }
    ],
    cComparison: {
      cCode: `// En C: Boucle for impérative classique
int numbers[] = {1, 2, 3, 4, 5, 6};
int sum = 0;
for (int i = 0; i < 6; i++) {
    if (numbers[i] % 2 == 0) {
        sum += numbers[i] * numbers[i];
    }
}`,
      explanation: {
        fr: "En C, le traitement est impératif et séquentiel. En Java, Streams permet d'écrire du code déclaratif et de basculer en multithread parallèle d'un seul mot : '.parallelStream()'.",
        en: "C requires imperative for loops. Java Streams are declarative and trivially parallelizable via .parallelStream()."
      },
      memoryDifference: {
        fr: "C: Aucun objet temporaire. Java: Pipeline paresseux avec Stream wrapper, compilé par le JIT en boucle vectorisée.",
        en: "C: Zero allocation. Java: Lightweight stream wrappers optimized by JIT into SIMD vector loops."
      }
    },
    executionSteps: [
      {
        stepIndex: 0,
        lineNumber: 8,
        programCounter: 0,
        description: {
          fr: "Création du pipeline stream() sur la liste [1, 2, 3, 4, 5, 6].",
          en: "Stream pipeline created on list [1, 2, 3, 4, 5, 6]."
        },
        stackFrames: [
          { method: 'main()', variables: [{ name: 'numbers', type: 'List<Integer>', value: '@0xNUMS', isRef: true }], operandStack: [] }
        ],
        heapObjects: [
          { id: 'st-1', address: '@0xSTRM', className: 'java.util.stream.ReferencePipeline', fields: { state: 'Ready' }, isGarbage: false }
        ],
        stdout: []
      },
      {
        stepIndex: 1,
        lineNumber: 11,
        programCounter: 10,
        description: {
          fr: "Évaluation du reduce(0, Integer::sum): filter retient [2, 4, 6], map produit [4, 16, 36], somme finale = 56.",
          en: "reduce evaluated: filtered [2, 4, 6], squared [4, 16, 36], total sum = 56."
        },
        stackFrames: [
          {
            method: 'main()',
            variables: [
              { name: 'numbers', type: 'List<Integer>', value: '@0xNUMS', isRef: true },
              { name: 'sumOfEvenSquares', type: 'int', value: '56' }
            ],
            operandStack: []
          }
        ],
        heapObjects: [],
        stdout: ['Reduced Sum: 56']
      }
    ],
    jvmMemoryNotes: {
      fr: "Contrairement aux classes anonymes qui créaient un fichier .class et un objet par appel, les lambdas Java utilisent 'invokedynamic' et LambdaMetafactory, évitant toute allocation d'objet superflue.",
      en: "Unlike anonymous classes, Java lambdas use invokedynamic and LambdaMetafactory, eliminating redundant class generation."
    },
    commonPitfalls: {
      fr: [
        "Réutiliser un Stream après qu'une opération terminale a déjà été appelée (lève IllegalStateException).",
        "Créer des effets de bord (mutations de variables externes) dans les lambdas au lieu d'écrire des fonctions pures."
      ],
      en: [
        "Reusing a consumed Stream (causes IllegalStateException).",
        "Mutating external state inside lambdas instead of writing pure functions."
      ]
    },
    quiz: {
      id: 'q-10',
      question: {
        fr: "Quand les opérations intermédiaires d'un Stream Java (comme .filter() ou .map()) sont-elles réellement exécutées ?",
        en: "When are intermediate operations in a Java Stream (.filter(), .map()) actually executed?"
      },
      options: {
        fr: [
          "Dès qu'on appelle la méthode .filter()",
          "Uniquement lorsqu'une opération terminale (ex: .reduce(), .collect(), .sum()) est invoquée (évaluation paresseuse)",
          "Lors de la compilation par javac",
          "Elles ne s'exécutent jamais"
        ],
        en: [
          "Immediately when calling .filter()",
          "Only when a terminal operation (e.g. .reduce(), .collect()) is invoked (lazy evaluation)",
          "During javac compilation",
          "They never execute"
        ]
      },
      correctIndex: 1,
      explanation: {
        fr: "Bravo ! Les Streams sont 'lazy' (paresseux): ils ne parcourent la source que lorsqu'une opération terminale demande un résultat concret.",
        en: "Spot on! Streams are strictly lazy: data is processed only when demanded by a terminal operation."
      }
    }
  },
  {
    id: 'ch-11',
    title: {
      fr: '11. Classes Imbriquées (Nested Classes) & Référence Cachée this$0',
      en: '11. Nested & Inner Classes: Static vs Inner & The Hidden this$0 Pointer'
    },
    subtitle: {
      fr: 'Static Nested vs Inner Classes, pointeur synthétique this$0 et pièges de fuite mémoire',
      en: 'Static Nested vs Inner Classes, synthetic this$0 pointer and memory leak hazards'
    },
    category: 'OOP',
    estimatedTime: '16 min',
    iconName: 'Box',
    summary: {
      fr: "En Java, il existe 4 types de classes imbriquées: les 'Static Nested Classes' (indépendantes en mémoire), les 'Inner Classes' (liées à une instance parente via un pointeur caché 'this$0'), les 'Local Classes' (dans une méthode) et les 'Classes Anonymes'. Comprendre leur modèle mémoire est capital pour éviter les fuites de mémoire (Memory Leaks).",
      en: "Java has 4 nested class types: Static Nested (memory-independent), Inner Classes (bound to an outer instance via a hidden 'this$0' pointer), Local Classes, and Anonymous Classes. Mastering their memory model prevents elusive memory leaks."
    },
    codeSnippet: `public class OuterClass {
    private String secret = "JVM_KEY_42";

    // 1. Static Nested Class: Aucun lien mémoire avec l'instance Outer!
    public static class StaticNested {
        public void printInfo() {
            System.out.println("Static Nested (Indépendante)");
        }
    }

    // 2. Non-Static Inner Class: Possède la référence cachée this$0 !
    public class InnerClass {
        public void reveal() {
            System.out.println("Inner accède au secret: " + secret); // OuterClass.this.secret
        }
    }

    public static void main(String[] args) {
        OuterClass.StaticNested stat = new OuterClass.StaticNested();
        OuterClass outer = new OuterClass();
        OuterClass.InnerClass inner = outer.new InnerClass(); // outer.new
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 4,
        code: '    // 1. Static Nested Class: Aucun lien mémoire',
        explanation: {
          fr: "Une 'static nested class' est simplement une classe de premier niveau encapsulée dans le namespace d'une autre. Elle n'a AUCUNE référence vers l'instance de OuterClass.",
          en: "A 'static nested class' is logically scoped inside OuterClass but shares NO runtime pointer with any OuterClass instance."
        },
        memoryHint: {
          fr: "0 octet supplémentaire. Aucun pointeur caché vers Outer.",
          en: "0 extra pointer. No hidden reference to Outer."
        }
      },
      {
        lineNumber: 11,
        code: '    // 2. Non-Static Inner Class: Possède la référence cachée this$0 !',
        explanation: {
          fr: "PIÈGE MAJEUR: Le compilateur javac ajoute secrètement un champ 'final OuterClass this$0;' dans chaque instance de InnerClass sur le Tas !",
          en: "MAJOR GOTCHA: The javac compiler injects a hidden synthetic field 'final OuterClass this$0;' in every Heap instance of InnerClass!"
        },
        memoryHint: {
          fr: "Heap @0xINNER: contient [champ this$0 -> @0xOUTER]",
          en: "Heap @0xINNER: holds [field this$0 -> @0xOUTER]"
        }
      },
      {
        lineNumber: 19,
        code: '        OuterClass.StaticNested stat = new OuterClass.StaticNested();',
        explanation: {
          fr: "Instanciation directe sans avoir besoin d'instancier OuterClass au préalable.",
          en: "Direct instantiation without needing any prior OuterClass instance."
        }
      },
      {
        lineNumber: 21,
        code: '        OuterClass.InnerClass inner = outer.new InnerClass(); // outer.new',
        explanation: {
          fr: "Syntaxe 'outer.new': l'instance 'outer' est passée au constructeur compilé 'InnerClass(OuterClass outer)' pour initialiser le champ caché this$0.",
          en: "'outer.new' syntax: the 'outer' pointer is passed into compiler-generated constructor 'InnerClass(OuterClass)' to bind this$0."
        },
        memoryHint: {
          fr: "Lien fort: Tant que 'inner' est vivant, 'outer' ne PEUT PAS être collecté par le GC !",
          en: "Strong link: As long as 'inner' is alive, 'outer' CANNOT be GC collected!"
        }
      }
    ],
    bytecode: [
      { offset: 0, opcode: 'new #2 <OuterClass$StaticNested>', comment: { fr: 'Alloue StaticNested (constructeur normal sans argument caché)', en: 'Allocate StaticNested (no hidden argument)' } },
      { offset: 3, opcode: 'invokespecial #3 <OuterClass$StaticNested.<init>:()V>', comment: { fr: 'Appel constructeur <init>()', en: 'Call default constructor' } },
      { offset: 8, opcode: 'new #5 <OuterClass$InnerClass>', comment: { fr: 'Alloue InnerClass sur le Tas', en: 'Allocate InnerClass on Heap' } },
      { offset: 11, opcode: 'aload_2', comment: { fr: 'Charge l\'instance "outer" sur la pile d\'opérandes', en: 'Load "outer" pointer onto operand stack' } },
      { offset: 12, opcode: 'invokespecial #6 <OuterClass$InnerClass.<init>:(LOuterClass;)V>', comment: { fr: 'LE SECRET: passe outer en argument pour this$0 !', en: 'THE SECRET: passes outer to bind synthetic this$0 !' } }
    ],
    cComparison: {
      cCode: `// En C: Une struct déclarée dans un fichier ou sous-struct
struct StaticHelper {
    int id;
};

// En C, si une sous-struct veut accéder au parent,
// le pointeur parent DOIT ÊTRE ÉCRIT EXPLICITEMENT:
struct InnerHelper {
    struct Outer *parent; // En Java, c'est this$0 généré automatiquement!
    int value;
};`,
      explanation: {
        fr: "En C, rien n'est magique: une structure imbriquée n'a aucun lien avec le parent sauf si vous déclarez expressément un pointeur 'struct Outer *parent'. En Java, la JVM et javac injectent ce pointeur de façon transparente.",
        en: "In C, nested structs have zero parent awareness unless explicitly declared with a parent pointer. In Java, javac injects 'this$0' automatically."
      },
      memoryDifference: {
        fr: "C: Pointeur parent visible et contrôlé. Java: 'this$0' invisible qui empêche le Garbage Collector de libérer Outer (cause classique de fuites mémoire dans Android / GUI).",
        en: "C: Explicit pointer. Java: Invisible synthetic this$0 preventing GC reclamation of enclosing object."
      }
    },
    executionSteps: [
      {
        stepIndex: 0,
        lineNumber: 19,
        programCounter: 3,
        description: {
          fr: "Instanciation de StaticNested sur le Tas à @0xSTAT1. Elle ne contient AUCUN pointeur vers OuterClass.",
          en: "StaticNested allocated at @0xSTAT1. Contains ZERO reference to OuterClass."
        },
        stackFrames: [
          { method: 'main()', variables: [{ name: 'stat', type: 'OuterClass.StaticNested', value: '@0xSTAT1', isRef: true }], operandStack: [] }
        ],
        heapObjects: [
          { id: 'stat-1', address: '@0xSTAT1', className: 'OuterClass$StaticNested', fields: { type: 'Static Independent' }, isGarbage: false }
        ],
        stdout: []
      },
      {
        stepIndex: 1,
        lineNumber: 20,
        programCounter: 7,
        description: {
          fr: "Instanciation de OuterClass sur le Tas à @0xOUTER1 avec secret = \"JVM_KEY_42\".",
          en: "OuterClass allocated at Heap @0xOUTER1 with secret = \"JVM_KEY_42\"."
        },
        stackFrames: [
          {
            method: 'main()',
            variables: [
              { name: 'stat', type: 'OuterClass.StaticNested', value: '@0xSTAT1', isRef: true },
              { name: 'outer', type: 'OuterClass', value: '@0xOUTER1', isRef: true }
            ],
            operandStack: []
          }
        ],
        heapObjects: [
          { id: 'stat-1', address: '@0xSTAT1', className: 'OuterClass$StaticNested', fields: { type: 'Static Independent' }, isGarbage: false },
          { id: 'out-1', address: '@0xOUTER1', className: 'OuterClass', fields: { secret: '"JVM_KEY_42"' }, isGarbage: false }
        ],
        stdout: []
      },
      {
        stepIndex: 2,
        lineNumber: 21,
        programCounter: 12,
        description: {
          fr: "outer.new InnerClass(). L'instance InnerClass est allouée à @0xINNER2 avec le champ synthétique 'this$0 = @0xOUTER1' !",
          en: "outer.new InnerClass(). InnerClass instance allocated at @0xINNER2 with synthetic field 'this$0 = @0xOUTER1'!"
        },
        stackFrames: [
          {
            method: 'main()',
            variables: [
              { name: 'stat', type: 'OuterClass.StaticNested', value: '@0xSTAT1', isRef: true },
              { name: 'outer', type: 'OuterClass', value: '@0xOUTER1', isRef: true },
              { name: 'inner', type: 'OuterClass.InnerClass', value: '@0xINNER2', isRef: true }
            ],
            operandStack: []
          }
        ],
        heapObjects: [
          { id: 'stat-1', address: '@0xSTAT1', className: 'OuterClass$StaticNested', fields: { type: 'Static Independent' }, isGarbage: false },
          { id: 'out-1', address: '@0xOUTER1', className: 'OuterClass', fields: { secret: '"JVM_KEY_42"' }, isGarbage: false },
          { id: 'in-1', address: '@0xINNER2', className: 'OuterClass$InnerClass', fields: { 'this$0 (Synthetic)': '@0xOUTER1' }, isGarbage: false }
        ],
        stdout: ['Static Nested (Indépendante)']
      }
    ],
    jvmMemoryNotes: {
      fr: "Si vous conservez une référence vers une InnerClass dans une variable statique ou un thread en arrière-plan, TOUTE l'instance de la classe parente OuterClass reste bloquée en mémoire vive (inaccessible au GC). Privilégiez TOUJOURS 'static class' quand l'accès aux champs d'instance n'est pas indispensable.",
      en: "Holding references to an InnerClass keeps the entire enclosing Outer instance alive in memory via this$0. ALWAYS prefer 'static class' unless enclosing instance state is strictly required."
    },
    commonPitfalls: {
      fr: [
        "Oublier le mot-clé 'static' sur une classe imbriquée (ex: DTO, Node d'arbre, Builder), provoquant une fuite mémoire silencieuse via this$0.",
        "Utiliser des classes anonymes (ex: new Runnable()) dans des objets à longue durée de vie, retenant inutilement les activités ou contrôleurs en mémoire."
      ],
      en: [
        "Omitting 'static' on nested DTOs, Tree Nodes, or Builders, causing silent memory leaks through this$0.",
        "Using anonymous classes in long-lived background threads holding outer UI/controller objects in memory."
      ]
    },
    quiz: {
      id: 'q-11',
      question: {
        fr: "Pourquoi une 'Inner Class' non-statique peut-elle causer une fuite mémoire alors qu'une 'Static Nested Class' ne le peut pas ?",
        en: "Why can a non-static Inner Class cause a memory leak where a Static Nested Class cannot?"
      },
      options: {
        fr: [
          "Parce que l'Inner Class est automatiquement allouée dans le Metaspace permanent.",
          "Parce que l'Inner Class contient une référence cachée (this$0) vers l'instance de la classe parente, l'empêchant d'être nettoyée par le GC.",
          "Parce que l'Inner Class désactive le Garbage Collector.",
          "Il n'y a aucune différence de gestion mémoire entre les deux."
        ],
        en: [
          "Because Inner Classes are permanently stored in Metaspace.",
          "Because an Inner Class holds a hidden synthetic pointer (this$0) to the enclosing outer instance, preventing GC reclamation.",
          "Because Inner Classes disable the Garbage Collector.",
          "There is zero memory difference between both."
        ]
      },
      correctIndex: 1,
      explanation: {
        fr: "Exactement ! Le compilateur Java injecte le champ caché 'this$0' dans toute Inner Class non-statique. Même si la variable Outer devient null, le lien via this$0 empêche le Garbage Collector de libérer l'objet parent !",
        en: "Spot on! The Java compiler injects a synthetic 'this$0' field into every non-static Inner Class. As long as the inner instance exists, the outer instance cannot be collected by the GC!"
      }
    }
  },
  {
    id: 'ch-12',
    title: {
      fr: '12. Modification de Bytecode, Instrumentation & Java Agents',
      en: '12. Bytecode Modification, Instrumentation & Java Agents'
    },
    subtitle: {
      fr: 'ASM, ByteBuddy, ClassFileTransformer et interception dynamique en RAM',
      en: 'ASM, ByteBuddy, ClassFileTransformer and dynamic in-memory interception'
    },
    category: 'Advanced',
    estimatedTime: '20 min',
    iconName: 'Binary',
    summary: {
      fr: "Modifier le bytecode permet d'injecter du code à la volée sans recompiler les sources. C'est le cœur des frameworks AOP (Spring, Quarkus), des outils de mock (Mockito), des profileurs de performance (New Relic, Datadog) et des agents de sécurité. La JVM permet d'intercepter les classes via les Java Agents (-javaagent) et ClassFileTransformer avant leur entrée dans le Metaspace.",
      en: "Modifying bytecode injects instructions on the fly without recompilation. It powers Spring AOP, Mockito, and APM profilers. The JVM intercepts classes via Java Agents (-javaagent) and ClassFileTransformer before Metaspace ingestion."
    },
    codeSnippet: `import java.lang.instrument.*;
import java.security.ProtectionDomain;

public class PerformanceAgent {
    // Point d'entrée de l'agent JVM exécuté AVANT main() !
    public static void premain(String agentArgs, Instrumentation inst) {
        inst.addTransformer(new ClassFileTransformer() {
            @Override
            public byte[] transform(ClassLoader loader, String className,
                                    Class<?> classBeingRedefined,
                                    ProtectionDomain protectionDomain,
                                    byte[] classfileBuffer) {
                // Interception du flux d'octets du .class
                if (className != null && className.equals("com/app/PaymentService")) {
                    return injectTimingBytecode(classfileBuffer);
                }
                return classfileBuffer; // Non modifié
            }
        });
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 5,
        code: 'public class PerformanceAgent {',
        explanation: {
          fr: "Déclaration d'un Java Agent. Un agent Java est packagé dans un fichier JAR avec un en-tête MANIFEST.MF spécifiant 'Premain-Class'.",
          en: "Java Agent declaration packaged into a JAR with 'Premain-Class' header in MANIFEST.MF."
        }
      },
      {
        lineNumber: 6,
        code: '    public static void premain(String agentArgs, Instrumentation inst) {',
        explanation: {
          fr: "'premain' est le point d'entrée universel exécuté par la JVM avant même la première ligne de votre méthode main() !",
          en: "'premain' is invoked by the JVM before your application main() method ever executes!"
        },
        memoryHint: {
          fr: "Exécuté avant tout chargement de classe applicative.",
          en: "Runs before any application class is loaded into memory."
        }
      },
      {
        lineNumber: 7,
        code: '        inst.addTransformer(new ClassFileTransformer() {',
        explanation: {
          fr: "Enregistre un transformateur de classes (ClassFileTransformer) auprès du moteur de chargement de la JVM.",
          en: "Registers a ClassFileTransformer with the JVM ClassLoader pipeline."
        }
      },
      {
        lineNumber: 12,
        code: '                                    byte[] classfileBuffer) {',
        explanation: {
          fr: "'classfileBuffer' contient la séquence brute des octets du fichier .class (Magic Number 0xCAFEBABE, Constant Pool, Bytecodes). C'est ce tableau que l'on modifie avec des bibliothèques comme ASM ou ByteBuddy !",
          en: "'classfileBuffer' holds the raw .class bytes (0xCAFEBABE, constant pool, opcodes) which ASM or ByteBuddy modifies."
        },
        memoryHint: {
          fr: "Tableau d'octets temporaire intercepté avant allocation Metaspace.",
          en: "Temporary byte array intercepted before Metaspace ingestion."
        }
      }
    ],
    bytecode: [
      { offset: 0, opcode: 'invokestatic #2 <System.nanoTime>', comment: { fr: 'INJECTION AGENT: capture temps départ (t0)', en: 'AGENT INJECTION: capture start time (t0)' } },
      { offset: 3, opcode: 'lstore_1', comment: { fr: 'Stocke t0 dans variable locale', en: 'Store t0 in local slot' } },
      { offset: 4, opcode: 'iload_0', comment: { fr: 'Code d\'origine: charge paramètre', en: 'Original code: load param' } },
      { offset: 5, opcode: 'invokevirtual #3 <processPayment>', comment: { fr: 'Code d\'origine: exécute méthode', en: 'Original code: invoke method' } },
      { offset: 8, opcode: 'invokestatic #2 <System.nanoTime>', comment: { fr: 'INJECTION AGENT: capture temps fin (t1)', en: 'AGENT INJECTION: capture end time (t1)' } },
      { offset: 11, opcode: 'lload_1', comment: { fr: 'Charge t0', en: 'Load t0' } },
      { offset: 12, opcode: 'lsub', comment: { fr: 'Calcule (t1 - t0) en nanosecondes', en: 'Compute (t1 - t0) elapsed' } },
      { offset: 13, opcode: 'invokestatic #4 <MetricLogger.record>', comment: { fr: 'INJECTION AGENT: log métrique APM', en: 'AGENT INJECTION: log APM metric' } }
    ],
    cComparison: {
      cCode: `// En C: Hooking binaire par LD_PRELOAD
#define _GNU_SOURCE
#include <stdio.h>
#include <dlfcn.h>

// Interception de fonction au niveau de l'éditeur de liens dynamique
int open(const char *pathname, int flags) {
    int (*original_open)(const char*, int) = dlsym(RTLD_NEXT, "open");
    printf("[HOOK C] Ouverture de: %s\\n", pathname);
    return original_open(pathname, flags);
}`,
      explanation: {
        fr: "En C, intercepter ou modifier du code nécessite soit LD_PRELOAD (hooking au niveau de la glibc), soit d'écraser la mémoire (.text) avec mprotect, avec un risque majeur de crash. En Java, l'API Instrumentation est native, standardisée et vérifiée par le Bytecode Verifier.",
        en: "In C, binary hooking requires LD_PRELOAD or mprotect memory hacking. In Java, Instrumentation API is standard, safe, and stack-verified."
      },
      memoryDifference: {
        fr: "C: Modification de pointeurs de fonction GOT/PLT ou code binaire x86 en RAM. Java: Réécriture de structures de classes vérifiées avant chargement dans le Metaspace.",
        en: "C: GOT/PLT table hijacking or direct machine code patching. Java: Type-safe bytecode restructuring before Metaspace ingestion."
      }
    },
    executionSteps: [
      {
        stepIndex: 0,
        lineNumber: 6,
        programCounter: 0,
        description: {
          fr: "Lancement de la JVM avec -javaagent:agent.jar. La méthode premain() s'exécute en premier.",
          en: "JVM booted with -javaagent:agent.jar. premain() runs before main()."
        },
        stackFrames: [
          { method: 'PerformanceAgent.premain()', variables: [{ name: 'inst', type: 'Instrumentation', value: '@0xINST1', isRef: true }], operandStack: [] }
        ],
        heapObjects: [
          { id: 'agent-1', address: '@0xINST1', className: 'sun.instrument.InstrumentationImpl', fields: { activeTransformers: '1' }, isGarbage: false }
        ],
        stdout: ['[JavaAgent] Instrumentation hook registered.']
      },
      {
        stepIndex: 1,
        lineNumber: 12,
        programCounter: 5,
        description: {
          fr: "La classe PaymentService est demandée. Le ClassFileTransformer intercepte le tableau byte[] et injecte les opcodes de profilage.",
          en: "PaymentService is requested. ClassFileTransformer intercepts raw byte[] and injects profiling opcodes."
        },
        stackFrames: [
          { method: 'ClassFileTransformer.transform()', variables: [{ name: 'className', type: 'String', value: '"PaymentService"' }], operandStack: [] }
        ],
        heapObjects: [
          { id: 'bc-mod', address: '@0xBC_MOD', className: 'byte[] (Transformed Bytecode)', fields: { size: '1024 bytes', injectedOpcodes: 'nanoTime, lsub' }, isGarbage: false }
        ],
        stdout: ['[JavaAgent] Bytecode patched for PaymentService: injected timing probes.']
      },
      {
        stepIndex: 2,
        lineNumber: 16,
        programCounter: 10,
        description: {
          fr: "La classe modifiée est validée par le Bytecode Verifier et chargée dans le Metaspace. Son exécution mesure désormais le temps automatiquement !",
          en: "Patched class verified and loaded into Metaspace. Now tracks execution duration automatically!"
        },
        stackFrames: [
          { method: 'PaymentService.processPayment()', variables: [{ name: 'elapsedNs', type: 'long', value: '412000' }], operandStack: [] }
        ],
        heapObjects: [],
        stdout: ['[APM Metric] PaymentService.processPayment() executed in 0.41ms']
      }
    ],
    jvmMemoryNotes: {
      fr: "Après modification par un agent, la JVM soumet le nouveau bytecode au 'Bytecode Verifier' (StackMapTable, absence de dépassement de pile, sécurité des types). Si la modification est invalide, la JVM lève 'VerifyError' ou 'ClassFormatError', protégeant l'OS de toute corruption mémoire.",
      en: "The Bytecode Verifier inspects transformed bytes (StackMapTable, type safety). Invalid transformations trigger 'VerifyError', preventing crashes."
    },
    commonPitfalls: {
      fr: [
        "Modifier le bytecode sans recalculer correctement la taille maximale de la pile d'opérandes (max_stack) ou des variables locales (max_locals). Utiliser ASM avec ClassWriter.COMPUTE_FRAMES pour l'automatiser.",
        "Tenter d'ajouter de nouveaux champs d'instance lors d'un 'retransformClasses' à chaud (la JVM interdit de modifier la structure mémoire des classes déjà chargées en production sans Dcevm)."
      ],
      en: [
        "Altering bytecode without updating max_stack or max_locals (use ClassWriter.COMPUTE_FRAMES).",
        "Attempting to add fields during runtime class redefinition (disallowed by standard JVM spec)."
      ]
    },
    quiz: {
      id: 'q-12',
      question: {
        fr: "Quelle interface de la JVM permet à un Java Agent d'intercepter et de modifier le tableau d'octets d'un fichier .class avant son chargement ?",
        en: "Which JVM interface allows a Java Agent to intercept and modify raw .class byte arrays before class loading?"
      },
      options: {
        fr: [
          "ClassFileTransformer (via l'API java.lang.instrument)",
          "Serializable",
          "ThreadLocalAllocationBuffer",
          "GarbageCollectorMXBean"
        ],
        en: [
          "ClassFileTransformer (via java.lang.instrument API)",
          "Serializable",
          "ThreadLocalAllocationBuffer",
          "GarbageCollectorMXBean"
        ]
      },
      correctIndex: 0,
      explanation: {
        fr: "Exact ! ClassFileTransformer fournit la méthode transform(..., byte[] classfileBuffer) qui permet de réécrire les octets du bytecode avant que la classe ne soit validée et chargée dans le Metaspace.",
        en: "Spot on! ClassFileTransformer provides transform(..., byte[] classfileBuffer) to inspect and rewrite bytecode before Metaspace ingestion."
      }
    }
  },
  {
    id: 'ch-13',
    title: {
      fr: '13. Modificateurs: static, private, protected & Empreinte Mémoire',
      en: '13. Modifiers: static, private, protected & Memory Footprint'
    },
    subtitle: {
      fr: 'Metaspace vs Tas, invokestatic vs invokespecial vs invokevirtual, access_flags et sécurité',
      en: 'Metaspace vs Heap, invokestatic vs invokespecial vs invokevirtual, access_flags & security'
    },
    category: 'Memory & JVM',
    estimatedTime: '22 min',
    iconName: 'Shield',
    summary: {
      fr: "Quelle est la différence physique en mémoire et à la compilation entre un champ static ou d'instance, et entre private, protected et public ? Un champ static n'existe qu'en UN SEUL exemplaire dans le miroir de classe (Metaspace), tandis qu'un champ d'instance est dupliqué dans CHAQUE objet sur le Tas (avec 16 octets d'en-tête). À la compilation, les modificateurs sont encodés dans les access_flags (16 bits) et dictent les opcodes de la JVM : invokestatic (sans référence this), invokespecial (appel direct non-virtuel) et invokevirtual (recherche polymorphe via la VTable).",
      en: "What are the exact memory and compilation differences between static and instance fields, and private vs protected vs public? Static fields reside in a single slot in Metaspace (Class mirror), whereas instance fields duplicate inside every single Heap object with 16-byte object headers. At compile time, access_flags (16-bit) govern access, and determine opcodes: invokestatic (no this), invokespecial (direct non-virtual), and invokevirtual (dynamic VTable dispatch)."
    },
    codeSnippet: `public class BankVault {
    // 1 seul exemplaire en mémoire (Metaspace / Class mirror)
    public static int globalVaultCount = 0;
    
    // Dupliqué dans CHAQUE instance sur le Tas (+ 16B Object Header)
    private double goldBalance;
    protected String securityCode;
    
    public BankVault(double initialGold, String code) {
        this.goldBalance = initialGold;
        this.securityCode = code;
        globalVaultCount++; // putstatic
    }
    
    // invokestatic: AUCUN pointeur "this" en Slot 0 des variables locales !
    public static int getGlobalCount() {
        return globalVaultCount; // getstatic
    }
    
    // invokespecial: liaison directe non-virtuelle (pas de slot VTable)
    private void auditInternalSafety() {
        // Accès interne direct
    }
    
    // invokevirtual: Slot 0 = "this", résolution dynamique via VTable
    public void depositGold(double amount) {
        this.goldBalance += amount; // putfield
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 3,
        code: '    public static int globalVaultCount = 0;',
        explanation: {
          fr: "Champ 'static': Alloué une seule fois dans l'objet miroir java.lang.Class stocké dans le Metaspace. Même avec 1 000 000 d'instances de coffres, il n'occupe que 4 octets en RAM !",
          en: "'static' field: Allocated once in the java.lang.Class mirror object in Metaspace. Consumes only 4 bytes even with 1,000,000 instances!"
        },
        memoryHint: {
          fr: "4 octets dans le Metaspace, partagé par tous les threads.",
          en: "4 bytes in Metaspace, shared across all threads."
        }
      },
      {
        lineNumber: 6,
        code: '    private double goldBalance;',
        explanation: {
          fr: "Champ d'instance non-statique: Chaque 'new BankVault()' réserve 8 octets pour ce double sur le Tas, plus 16 octets d'en-tête (Mark Word + Klass Pointer). Le mot-clé 'private' active le flag binaire ACC_PRIVATE (0x0002) dans la table des champs du .class.",
          en: "Instance field: Every 'new' allocates 8 bytes on Heap + 16 bytes object header. 'private' sets ACC_PRIVATE (0x0002) flag."
        },
        memoryHint: {
          fr: "8 octets * N instances sur le Tas + surcoût des en-têtes.",
          en: "8 bytes * N instances on Heap + header overhead."
        }
      },
      {
        lineNumber: 16,
        code: '    public static int getGlobalCount() {',
        explanation: {
          fr: "Méthode 'static': Appelée via l'opcode 'invokestatic'. Particularité majeure : la table des variables locales ne contient PAS de pointeur 'this' à l'index 0. C'est pourquoi 'this.quelqueChose' est une erreur de compilation dans une méthode static !",
          en: "'static' method: Called via 'invokestatic'. Slot 0 of Local Variables does NOT contain 'this'. That is why using 'this' in a static method fails compilation!"
        }
      },
      {
        lineNumber: 21,
        code: '    private void auditInternalSafety() {',
        explanation: {
          fr: "Méthode 'private': Appelée via l'opcode 'invokespecial'. Comme elle est privée, aucune sous-classe ne peut la surcharger (override). La JVM effectue une liaison directe (statique) sans consommer d'entrée dans la VTable.",
          en: "'private' method: Invoked via 'invokespecial'. Cannot be overridden by subclasses; JVM performs direct static linking without a VTable slot."
        }
      },
      {
        lineNumber: 26,
        code: '    public void depositGold(double amount) {',
        explanation: {
          fr: "Méthode 'public' d'instance: Appelée via 'invokevirtual'. Le premier argument implicite (Slot 0) est obligatoirement 'this'. La JVM consulte la VTable de l'objet pour trouver l'adresse du code.",
          en: "'public' instance method: Invoked via 'invokevirtual'. Slot 0 is always 'this'. JVM resolves target through the VTable."
        }
      }
    ],
    bytecode: [
      { offset: 0, opcode: 'getstatic #2 <BankVault.globalVaultCount>', comment: { fr: 'Lit le champ statique dans le Metaspace (pas d\'objet)', en: 'Read static field in Metaspace (no object needed)' } },
      { offset: 3, opcode: 'iconst_1', comment: { fr: 'Empile constante 1', en: 'Push constant 1' } },
      { offset: 4, opcode: 'iadd', comment: { fr: 'Additionne', en: 'Add' } },
      { offset: 5, opcode: 'putstatic #2 <BankVault.globalVaultCount>', comment: { fr: 'Écrit dans le Metaspace', en: 'Write back to Metaspace' } },
      { offset: 8, opcode: 'aload_0', comment: { fr: 'Charge "this" (Slot 0)', en: 'Load "this" from local slot 0' } },
      { offset: 9, opcode: 'dload_1', comment: { fr: 'Charge le paramètre amount', en: 'Load amount param' } },
      { offset: 10, opcode: 'putfield #3 <BankVault.goldBalance>', comment: { fr: 'Écrit dans le champ de l\'objet sur le TAS', en: 'Write instance field on HEAP' } },
      { offset: 13, opcode: 'invokestatic #4 <BankVault.getGlobalCount>', comment: { fr: 'Liaison directe statique (sans VTable)', en: 'Direct static link (no VTable)' } },
      { offset: 16, opcode: 'invokespecial #5 <BankVault.auditInternalSafety>', comment: { fr: 'Liaison directe privée non-virtuelle', en: 'Direct private non-virtual call' } },
      { offset: 19, opcode: 'invokevirtual #6 <BankVault.depositGold>', comment: { fr: 'Liaison dynamique virtuelle via VTable', en: 'Dynamic dispatch via VTable' } }
    ],
    cComparison: {
      cCode: `// En C: static fichier / BSS vs structure
// 1. "static" en C = portée limitée au fichier (unité de traduction),
// logé dans le segment .BSS ou .DATA de l'exécutable ELF/PE
static int global_vault_count = 0;

// 2. Struct = équivalent des champs d'instance
typedef struct {
    double gold_balance;
    char security_code[16];
} BankVault;

// 3. Méthode d'instance = passage explicite du pointeur "self"
void deposit_gold(BankVault *self, double amount) {
    if (self) self->gold_balance += amount;
}`,
      explanation: {
        fr: "En C, 'static' signifie 'restreint au fichier source courant' et les variables résident dans les segments statiques .data/.bss. En C, il n'existe pas de modificateurs 'private' ou 'protected' au niveau du compilateur : toute fonction ou struct déclarée dans un header (.h) est publiquement accessible. En Java, 'static' signifie 'attaché à la classe' et les modificateurs de visibilité sont vérifiés à la fois par javac ET par le Bytecode Verifier de la JVM à l'exécution.",
        en: "In C, 'static' limits scope to translation unit in .bss/.data segment. C lacks access modifiers: everything in headers is accessible. In Java, 'static' binds to the Class mirror, and visibility is enforced by both javac and the JVM Bytecode Verifier."
      },
      memoryDifference: {
        fr: "C: static = segment .data/.bss brut en mémoire binaire fixe. Java: static = champs statiques encapsulés dans le miroir java.lang.Class dans le Metaspace.",
        en: "C: Raw fixed memory in .data/.bss ELF section. Java: Metaspace java.lang.Class mirror instance managed by ClassLoader."
      }
    },
    executionSteps: [
      {
        stepIndex: 0,
        lineNumber: 3,
        programCounter: 0,
        description: {
          fr: "Chargement de la classe BankVault. La JVM alloue le miroir java.lang.Class dans le Metaspace. Le champ static 'globalVaultCount' est initialisé à 0.",
          en: "Loading BankVault class. Metaspace allocates java.lang.Class mirror with static globalVaultCount = 0."
        },
        stackFrames: [
          { method: 'BankVault.<clinit>()', variables: [], operandStack: [] }
        ],
        heapObjects: [
          { id: 'meta-vault', address: '@Metaspace:Class<BankVault>', className: 'java.lang.Class (Metaspace)', fields: { static_globalVaultCount: '0', access_flags: '0x0021 (PUBLIC, SUPER)' }, isGarbage: false }
        ],
        stdout: ['[JVM ClassLoader] Class BankVault loaded into Metaspace. Static fields initialized.']
      },
      {
        stepIndex: 1,
        lineNumber: 10,
        programCounter: 5,
        description: {
          fr: "Instanciation 'new BankVault(500.0, \"SEC-99\")'. Un objet est alloué sur le Tas (24 octets de champs + 16 octets d'en-tête = 40 octets).",
          en: "'new BankVault(500.0, \"SEC-99\")'. Heap allocates instance (24B fields + 16B header = 40 bytes total)."
        },
        stackFrames: [
          {
            method: 'BankVault.<init>()',
            variables: [
              { name: 'this', type: 'BankVault', value: '@0xVAULT1', isRef: true },
              { name: 'initialGold', type: 'double', value: '500.0' },
              { name: 'code', type: 'String', value: '"SEC-99"' }
            ],
            operandStack: []
          }
        ],
        heapObjects: [
          { id: 'meta-vault', address: '@Metaspace:Class<BankVault>', className: 'java.lang.Class (Metaspace)', fields: { static_globalVaultCount: '1' }, isGarbage: false },
          { id: 'vault-1', address: '@0xVAULT1', className: 'BankVault', fields: { goldBalance: '500.0', securityCode: '"SEC-99"' }, isGarbage: false }
        ],
        stdout: ['[Heap] Allocated BankVault instance at @0xVAULT1. globalVaultCount incremented to 1.']
      },
      {
        stepIndex: 2,
        lineNumber: 17,
        programCounter: 13,
        description: {
          fr: "Exécution de getGlobalCount() via 'invokestatic'. La JVM saute directement à l'adresse de la méthode sans passer par la VTable et sans instancier 'this'.",
          en: "invokestatic BankVault.getGlobalCount(). JVM jumps directly to method code without VTable lookup and with no 'this' argument."
        },
        stackFrames: [
          {
            method: 'BankVault.getGlobalCount() [STATIC]',
            variables: [], // Pas de 'this' !
            operandStack: ['result: 1']
          }
        ],
        heapObjects: [
          { id: 'meta-vault', address: '@Metaspace:Class<BankVault>', className: 'java.lang.Class (Metaspace)', fields: { static_globalVaultCount: '1' }, isGarbage: false },
          { id: 'vault-1', address: '@0xVAULT1', className: 'BankVault', fields: { goldBalance: '500.0', securityCode: '"SEC-99"' }, isGarbage: false }
        ],
        stdout: ['[invokestatic] Resolved directly at compile time. Returned 1.']
      }
    ],
    jvmMemoryNotes: {
      fr: "Les champs static vivent aussi longtemps que leur ClassLoader n'est pas déchargé. En pratique, dans une application standard, ils ne sont JAMAIS collectés par le GC, ce qui peut provoquer des fuites de mémoire (ex: cache statique qui grossit indéfiniment).",
      en: "Static fields live as long as their ClassLoader remains loaded. They survive generational GC cycles unless the entire classloader is unloaded."
    },
    commonPitfalls: {
      fr: [
        "Confondre 'static' avec 'constant': un champ 'static' est modifiable par tous les threads sauf s'il est combiné avec 'final' ('public static final'). Sans 'final', attention aux data races !",
        "Appeler une méthode statique via une variable d'instance (ex: 'vault.getGlobalCount()'). Le compilateur remplace la variable par la classe sans évaluer la nullité de la variable, masquant les bugs.",
        "Accéder à un champ private par réflexion (setAccessible(true)) : depuis Java 9+, le système de modules Jigsaw bloque ces accès illégaux sauf ouverture explicite avec 'opens'."
      ],
      en: [
        "Confusing 'static' with 'constant': static fields are mutable across threads unless marked 'final'.",
        "Invoking static methods on an instance variable (e.g. vault.getGlobalCount()), which obfuscates static binding.",
        "Reflective private access (setAccessible): strictly encapsulated in Java 9+ JPMS modules unless explicitly opened."
      ]
    },
    quiz: {
      id: 'q-13',
      question: {
        fr: "Pourquoi le mot-clé 'this' est-il strictement interdit à l'intérieur d'une méthode 'static' en Java ?",
        en: "Why is the keyword 'this' strictly forbidden inside a 'static' method in Java?"
      },
      options: {
        fr: [
          "Parce que les méthodes statiques sont privées.",
          "Parce que 'invokestatic' n'associe aucune instance d'objet : la variable locale Slot 0 ne contient pas de référence 'this'.",
          "Parce que le Garbage Collector interdit l'usage de 'this' dans le Metaspace.",
          "Parce que 'this' est réservé uniquement aux constructeurs."
        ],
        en: [
          "Because static methods are private.",
          "Because 'invokestatic' binds to the class, not an object: Local Variable Slot 0 does not hold a 'this' pointer.",
          "Because Garbage Collector disallows 'this' in Metaspace.",
          "Because 'this' is only valid in constructors."
        ]
      },
      correctIndex: 1,
      explanation: {
        fr: "Exactement ! Lors d'un 'invokestatic', la JVM n'empile aucune référence d'objet. Le slot 0 des variables locales contient directement le premier paramètre de la méthode au lieu de la référence 'this'.",
        en: "Spot on! When calling 'invokestatic', no object reference is pushed onto the frame. Slot 0 holds the first actual argument rather than 'this'."
      }
    }
  },
  {
    id: 'ch-14',
    title: {
      fr: '14. Records, Modèle de Domaine Anémique vs Riche & Enums',
      en: '14. Records, Anemic Domain Model vs Rich Domain & Enums'
    },
    subtitle: {
      fr: 'Immutabilité Java 16+, anti-pattern de Martin Fowler, et types énumérés de première classe',
      en: 'Java 16+ immutability, Martin Fowler anti-pattern, and first-class OOP Enums'
    },
    category: 'OOP',
    estimatedTime: '25 min',
    iconName: 'Box',
    summary: {
      fr: "Les 'records' (Java 16) éliminent le boilerplate en créant des transporteurs de données immuables et transparents. En architecture logicielle, ils s'opposent à l'anti-pattern du 'Modèle de Domaine Anémique' (objets réduits à de simples sacs de getters/setters manipulés par des services procéduraux), au profit d'un Modèle Riche encapsulant ses invariants. Enfin, les 'enums' Java ne sont pas de simples entiers comme en C, mais des classes complètes à part entière capables d'état, de comportement et de servir de Singleton parfait.",
      en: "Java 16 records eliminate boilerplate by providing shallowly immutable transparent data carriers. In domain modeling, they contrast with Martin Fowler's Anemic Domain Model anti-pattern (passive data bags with getters/setters driven by procedural services), favoring Rich Aggregates that protect invariants. Meanwhile, Java enums are full-blown classes with state, methods, and perfect thread-safe singleton semantics."
    },
    codeSnippet: `// 1. Record immuable avec Constructeur Compact (Java 16+)
public record Money(double amount, Currency currency) {
    public Money {
        if (amount < 0) throw new IllegalArgumentException("Amount >= 0");
        if (currency == null) throw new NullPointerException("Currency required");
    }
}

// 2. Enum Java avec comportement spécifique aux constantes
public enum OrderStatus {
    PENDING {
        public boolean canCancel() { return true; }
    },
    PAID {
        public boolean canCancel() { return true; }
    },
    SHIPPED {
        public boolean canCancel() { return false; } // Invariant protégé !
    };
    public abstract boolean canCancel();
}

// 3. Modèle de Domaine Riche (DDD) vs Anémique
public class Order {
    private OrderStatus status = OrderStatus.PENDING;
    private final List<Money> items = new ArrayList<>();

    public void cancel() {
        if (!status.canCancel()) {
            throw new IllegalStateException("Impossible d'annuler une commande expédiée !");
        }
        this.status = OrderStatus.PENDING;
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 2,
        code: 'public record Money(double amount, Currency currency) {',
        explanation: {
          fr: "Déclaration d'un Record : javac génère automatiquement les champs private final, le constructeur canonique, les accesseurs amount() et currency(), equals(), hashCode() et toString().",
          en: "Record declaration: compiler synthesizes private final fields, canonical constructor, accessors amount() and currency(), equals(), hashCode(), and toString()."
        },
        memoryHint: {
          fr: "Alloué sur le Tas comme un objet immuable de 16 octets d'en-tête + 8B double + 8B référence = 32 octets.",
          en: "Heap allocated immutable object: 16B header + 8B double + 8B reference = 32 bytes."
        }
      },
      {
        lineNumber: 3,
        code: '    public Money {',
        explanation: {
          fr: "Constructeur Compact : il ne redéclare pas les paramètres (double amount, Currency currency). Il permet de valider ou normaliser les données avant que javac ne procède automatiquement à l'assignation des champs.",
          en: "Compact Constructor: omits parameter list. Validates or normalizes invariants before compiler automatically assigns fields."
        }
      },
      {
        lineNumber: 10,
        code: 'public enum OrderStatus {',
        explanation: {
          fr: "Contrairement au C où une enum n'est qu'un entier 32 bits, en Java, OrderStatus est une classe héritant de java.lang.Enum avec instances statiques uniques (Singletons JVM garantis).",
          en: "Unlike C where enums are 32-bit ints, in Java OrderStatus is a class extending java.lang.Enum with guaranteed unique singleton instances."
        }
      },
      {
        lineNumber: 26,
        code: '    public void cancel() {',
        explanation: {
          fr: "Modèle Riche : la méthode 'cancel()' protège les invariants du métier. Dans un modèle anémique, un simple setStatus() externe permettrait de corrompre l'état de l'objet sans aucune vérification.",
          en: "Rich Model: 'cancel()' guards domain invariants. In an anemic model, an external setStatus() would allow state corruption without checks."
        }
      }
    ],
    bytecode: [
      { offset: 0, opcode: 'aload_0', comment: { fr: 'Charge "this" pour constructeur Record', en: 'Load "this" for Record constructor' } },
      { offset: 1, opcode: 'invokespecial #1 <java/lang/Record.<init>>', comment: { fr: 'Hérite obligatoirement de java.lang.Record', en: 'Super constructor call to java.lang.Record' } },
      { offset: 4, opcode: 'dload_1', comment: { fr: 'Charge paramètre double amount', en: 'Load double amount parameter' } },
      { offset: 5, opcode: 'putfield #2 <Money.amount>', comment: { fr: 'Écrit dans le champ private final amount', en: 'Write to private final amount field' } },
      { offset: 8, opcode: 'invokedynamic #3 <makeConcatWithConstants>', comment: { fr: 'toString() résolu via Indy (ObjectMethods)', en: 'toString() generated via Indy ObjectMethods' } },
      { offset: 11, opcode: 'getstatic #4 <OrderStatus.SHIPPED>', comment: { fr: 'Récupère la constante Singleton de l\'Enum', en: 'Fetch singleton Enum constant' } },
      { offset: 14, opcode: 'invokevirtual #5 <OrderStatus.canCancel>', comment: { fr: 'Exécute la méthode polymorphe de la constante', en: 'Execute constant-specific method' } }
    ],
    cComparison: {
      cCode: `// En C: Struct pure (données passives) et enum comme simple entier
typedef enum {
    STATUS_PENDING = 0,
    STATUS_PAID = 1,
    STATUS_SHIPPED = 2
} OrderStatus; // Juste un int en mémoire !

typedef struct {
    double amount;
    int currency_code;
} Money; // Aucune méthode, aucun invariant garanti

// Procédural / Anémique par nature en C :
void cancel_order(OrderStatus *status) {
    if (*status != STATUS_SHIPPED) {
        *status = STATUS_PENDING;
    }
}`,
      explanation: {
        fr: "En C, toute structure est par définition 'anémique' : elle ne regroupe que des octets de données passifs, et des fonctions externes les manipulent. En Java, un modèle riche fusionne données et invariants. Les Enums Java sont de vrais objets dotés de méthodes au lieu de simples entiers C.",
        en: "In C, structs are inherently 'anemic' (passive bytes manipulated by external functions). In Java, Rich Models bind state and business invariants. Java enums are heap objects with methods, not raw integers."
      },
      memoryDifference: {
        fr: "C: Enum = 4 octets bruts (int). Java: Enum = objets distincts sur le Tas avec références statiques en Metaspace. Record = layout mémoire optimisé avec attribut de classe officiel.",
        en: "C: Enum = 4-byte raw int. Java: Enum = heap objects with static pointers in Metaspace. Record = heap layout with official classfile metadata."
      }
    },
    executionSteps: [
      {
        stepIndex: 0,
        lineNumber: 2,
        programCounter: 0,
        description: {
          fr: "Instanciation 'new Money(99.99, Currency.EUR)'. Le constructeur compact vérifie amount >= 0.",
          en: "'new Money(99.99, Currency.EUR)'. Compact constructor asserts amount >= 0."
        },
        stackFrames: [
          {
            method: 'Money.<init>(amount=99.99, currency=Currency.EUR)',
            variables: [
              { name: 'this', type: 'Money', value: '@0xREC1', isRef: true },
              { name: 'amount', type: 'double', value: '99.99' },
              { name: 'currency', type: 'Currency', value: '@0xEUR', isRef: true }
            ],
            operandStack: []
          }
        ],
        heapObjects: [
          { id: 'rec-1', address: '@0xREC1', className: 'Money (Record)', fields: { amount: '99.99', currency: '@0xEUR' }, isGarbage: false }
        ],
        stdout: ['[Record] Money instance validated & frozen.']
      },
      {
        stepIndex: 1,
        lineNumber: 26,
        programCounter: 8,
        description: {
          fr: "Appel de order.cancel() sur une commande SHIPPED. L'invariant bloque l'action et lève une exception.",
          en: "order.cancel() invoked on SHIPPED order. Invariant check rejects and throws exception."
        },
        stackFrames: [
          {
            method: 'Order.cancel()',
            variables: [
              { name: 'this', type: 'Order', value: '@0xORD1', isRef: true }
            ],
            operandStack: ['OrderStatus.SHIPPED.canCancel() -> false']
          }
        ],
        heapObjects: [
          { id: 'ord-1', address: '@0xORD1', className: 'Order', fields: { status: 'OrderStatus.SHIPPED' }, isGarbage: false }
        ],
        stdout: ['[Rich Model] Invariant preserved: Shipped orders cannot be cancelled!']
      }
    ],
    jvmMemoryNotes: {
      fr: "L'attribut 'Record' dans le fichier .class permet à la JVM de savoir que tous les champs sont immuables. Le compilateur JIT HotSpot peut ainsi optimiser agressivement les lectures sans craindre d'invalidation de cache mémoire processeur (CPU cache lines).",
      en: "The .class Record attribute informs the JVM of strict component immutability, enabling HotSpot JIT to optimize CPU cache reads safely."
    },
    commonPitfalls: {
      fr: [
        "Penser qu'un Record offre une immutabilité profonde (Deep Immutability) : si un composant est une List mutable, son contenu peut toujours être altéré ! Il faut effectuer une copie défensive dans le constructeur compact.",
        "Confondre Record et Entité DDD : utiliser un Record pour un Aggregate Root ayant une identité et un cycle de vie oblige à le recréer à chaque mise à jour.",
        "Ajouter des setters dans une Entité métier sans méthode de domaine : cela crée un Modèle Anémique où la logique métier fuit dans les contrôleurs ou services."
      ],
      en: [
        "Assuming Records guarantee deep immutability: mutable collections in record components require defensive copying.",
        "Using Records as DDD Aggregate Roots: forcing synthetic re-creation on every state change.",
        "Scattering setters everywhere in domain entities: creates an Anemic Model with logic leaking into procedural services."
      ]
    },
    quiz: {
      id: 'q-14',
      question: {
        fr: "Quelle est la particularité fondamentale du constructeur compact (Compact Constructor) dans un Record Java ?",
        en: "What is the key defining feature of a compact constructor in a Java Record?"
      },
      options: {
        fr: [
          "Il est toujours privé et inaccessible.",
          "Il n'a pas de liste de paramètres explicite et permet de valider les données avant l'assignation automatique des champs.",
          "Il permet de modifier les champs après la création de l'objet.",
          "Il est exécuté uniquement lors de la désérialisation."
        ],
        en: [
          "It is always private.",
          "It omits the explicit parameter list and validates invariants prior to automatic field assignment.",
          "It allows mutating fields after instance creation.",
          "It only executes during deserialization."
        ]
      },
      correctIndex: 1,
      explanation: {
        fr: "Exact ! Le constructeur compact 'public Point { ... }' élimine la répétition des arguments et permet de valider ou normaliser les valeurs avant que javac n'effectue automatiquement les assignations 'this.x = x'.",
        en: "Spot on! The compact constructor 'public Point { ... }' omits parameter repetition, letting you validate invariants before javac automatically assigns fields."
      }
    }
  },
  {
    id: 'ch-15',
    title: {
      fr: '15. Outils de Build: Ant, Maven, Gradle, Bazel & Packaging JVM',
      en: '15. Build Systems: Ant, Maven, Gradle, Bazel & JVM Packaging'
    },
    subtitle: {
      fr: 'Du Makefile en C au POM déclaratif, Task DAG incrémental, résolution de conflits et jlink',
      en: 'From C Makefiles to Declarative POM, Incremental Task DAGs, Conflict Mediation & jlink'
    },
    category: 'Advanced',
    estimatedTime: '22 min',
    iconName: 'Hammer',
    summary: {
      fr: "En C, 'make' orchestre gcc et ld via des commandes shell et des timestamps fichiers. En Java, l'écosystème a évolué vers Apache Ant (XML impératif multiplateforme), puis Apache Maven (convention sur configuration, cycle de vie standardisé et dépôt ~/.m2), puis Gradle (Task DAG incrémental avec cache SHA-256 et Kotlin DSL), jusqu'à Google Bazel, mvnd, JBang et les outils natifs du JDK (jlink et jpackage).",
      en: "In C, 'make' invokes gcc/ld using OS shell scripts and timestamps. Java evolved from Apache Ant (imperative cross-platform XML) to Apache Maven (Convention over Configuration, fixed lifecycles, ~/.m2 cache) and Gradle (incremental Task DAG, SHA-256 build cache, Kotlin DSL), alongside Bazel, mvnd, JBang, and JDK jlink/jpackage."
    },
    codeSnippet: `// build.gradle.kts (Gradle Kotlin DSL moderne)
plugins {
    java
    application
}

java {
    toolchain.languageVersion.set(JavaLanguageVersion.of(21))
}

repositories { mavenCentral() }

dependencies {
    implementation("com.google.guava:guava:32.1.3-jre")
    compileOnly("org.projectlombok:lombok:1.18.32")
    runtimeOnly("org.postgresql:postgresql:42.7.3")
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.2")
}`,
    lineBreakdown: [
      {
        lineNumber: 8,
        code: '    toolchain.languageVersion.set(JavaLanguageVersion.of(21))',
        explanation: {
          fr: "Java Toolchain : Gradle détecte ou télécharge automatiquement le JDK 21 exact requis pour compiler, garantissant des builds identiques sur toutes les machines.",
          en: "Java Toolchain: Gradle discovers or auto-provisions the exact JDK 21 needed for reproducible builds."
        }
      },
      {
        lineNumber: 14,
        code: '    implementation("com.google.guava:guava:32.1.3-jre")',
        explanation: {
          fr: "En Gradle, 'implementation' remplace l'ancien 'compile': la dépendance reste cachée aux consommateurs de votre bibliothèque (encapsulation de classpath), accélérant la recompilation incrémentale.",
          en: "'implementation' encapsulates internal dependencies so downstream consumers don't recompile when internal APIs change."
        }
      },
      {
        lineNumber: 16,
        code: '    runtimeOnly("org.postgresql:postgresql:42.7.3")',
        explanation: {
          fr: "Équivalent du scope 'runtime' de Maven : le pilote JDBC n'est pas visible durant javac (prévenant le couplage fort), mais est présent dans le classpath à l'exécution.",
          en: "Equivalent to Maven 'runtime' scope: excluded at compile time, included at runtime."
        }
      }
    ],
    bytecode: [
      { offset: 0, opcode: 'invokestatic #1 <Maven.validate>', comment: { fr: 'Maven: Vérification pom.xml & versions', en: 'Maven: Validate pom.xml & constraints' } },
      { offset: 1, opcode: 'invokestatic #2 <Compiler.javac>', comment: { fr: 'Compile src/main/java -> target/classes (.class)', en: 'Compile .java -> .class bytecode' } },
      { offset: 2, opcode: 'invokestatic #3 <Surefire.test>', comment: { fr: 'Exécute JUnit 5 (bloque package si échec)', en: 'Run JUnit 5 tests (aborts package on fail)' } },
      { offset: 3, opcode: 'invokestatic #4 <JarPlugin.package>', comment: { fr: 'Assemble MANIFEST.MF + .class -> app.jar', en: 'Package MANIFEST.MF + .class -> app.jar' } }
    ],
    cComparison: {
      cCode: `# En C : Makefile classique + gestion manuelle des bibliothèques système
CC = gcc
CFLAGS = -Wall -O2 -I/usr/include/postgresql
LDFLAGS = -lpq

all: server

server: main.o db.o
\t$(CC) main.o db.o -o server $(LDFLAGS)

# Aucun téléchargement automatique de dépendances (.so/.a),
# il faut apt-get, vcpkg ou Conan en plus du Makefile !`,
      explanation: {
        fr: "En C, Make ne télécharge pas de dépendances externes (il faut Conan, vcpkg ou apt-get) et génère des binaires spécifiques à un OS/CPU. En Java, Maven et Gradle téléchargent automatiquement les archives JAR depuis Maven Central, vérifient les sommes SHA, résolvent les conflits transitifs et empaquettent un JAR multiplateforme.",
        en: "In C, Make doesn't fetch third-party libraries (requiring vcpkg/Conan) and compiles OS-specific binaries. Maven/Gradle resolve transitive JAR graphs from Maven Central automatically."
      },
      memoryDifference: {
        fr: "C/Make : Editeur de liens statique/dynamique (.o -> ELF/.so). Java/Maven/Gradle : Résolution dynamique d'archives .jar sur le Classpath (ou Module-Path JPMS) chargées à la volée par le ClassLoader JVM.",
        en: "C/Make: Linker binds .o into ELF/.so. Java: Build tools assemble Classpath/Module-Path JARs loaded dynamically by JVM ClassLoaders."
      }
    },
    executionSteps: [
      {
        stepIndex: 0,
        lineNumber: 2,
        programCounter: 0,
        description: {
          fr: "Phase Configuration / Résolution : L'outil lit le graphe de dépendances (pom.xml ou build.gradle.kts) et vérifie le cache local (~/.m2 ou ~/.gradle/caches).",
          en: "Configuration & Resolution: Reads dependency coordinates and checks local cache (~/.m2 or ~/.gradle/caches)."
        },
        stackFrames: [
          { method: 'BuildEngine.resolveDependencies()', variables: [{ name: 'guava', type: 'Artifact', value: '32.1.3-jre' }], operandStack: [] }
        ],
        heapObjects: [
          { id: 'cache-1', address: '@Disk:~/.gradle/caches', className: 'LocalArtifactCache', fields: { status: 'HIT (SHA-256 verified)' }, isGarbage: false }
        ],
        stdout: ['> Task :compileJava - Toolchain JDK 21 selected.']
      },
      {
        stepIndex: 1,
        lineNumber: 14,
        programCounter: 1,
        description: {
          fr: "Compilation incrémentale : Seuls les fichiers .java modifiés (et leurs dépendants ABI) sont recompilés par javac en bytecode.",
          en: "Incremental Compilation: Only modified .java files and ABI dependents are recompiled by javac."
        },
        stackFrames: [
          { method: 'GradleWorker.compileJava()', variables: [{ name: 'cacheHit', type: 'boolean', value: 'true' }], operandStack: [] }
        ],
        heapObjects: [
          { id: 'jar-1', address: '@Disk:build/libs/app.jar', className: 'ExecutableJAR', fields: { mainClass: 'com.javababel.Main', size: '42 KB' }, isGarbage: false }
        ],
        stdout: ['BUILD SUCCESSFUL in 412ms (4 tasks: 1 executed, 3 UP-TO-DATE)']
      }
    ],
    jvmMemoryNotes: {
      fr: "Pourquoi Gradle est-il souvent 2 à 10x plus rapide que Maven classique ? Parce que Gradle garde un processus JVM 'Daemon' chaud en RAM entre deux builds (JIT déjà compilé, caches de fichiers en mémoire), alors que 'mvn' lance une JVM à froid à chaque commande (problème désormais résolu par Maven Daemon 'mvnd').",
      en: "Gradle runs a warm persistent JVM Daemon in RAM keeping JIT-compiled build code and VFS snapshots hot, whereas classic mvn cold-starts a JVM per command (now solved by mvnd)."
    },
    commonPitfalls: {
      fr: [
        "Confondre les stratégies de conflits transitifs : Maven applique 'Nearest Definition Wins' (profondeur d'arbre), tandis que Gradle applique 'Highest Version Wins' (version semver maximale).",
        "Oublier d'utiliser les Wrappers (./mvnw ou ./gradlew) : sans Wrapper, chaque développeur ou serveur CI risque de compiler avec une version différente de Maven/Gradle.",
        "Ajouter des fichiers JAR manuellement dans Git au lieu d'utiliser un dépôt Maven / BOM."
      ],
      en: [
        "Confusing dependency conflict mediation: Maven uses Nearest-Wins BFS depth; Gradle picks Highest Semver Version.",
        "Skipping ./mvnw or ./gradlew wrappers, causing 'works on my machine' build drift.",
        "Committing binary .jar files directly into Git instead of using Maven Central / BOMs."
      ]
    },
    quiz: {
      id: 'q-15',
      question: {
        fr: "Si votre projet dépend directement de LibA (qui dépend de Guava 28) et de LibB -> LibC -> Guava 32, quelle version de Guava sera retenue par défaut par Apache Maven ?",
        en: "If your project depends on LibA (-> Guava 28) and LibB -> LibC -> Guava 32, which Guava version does Apache Maven select by default?"
      },
      options: {
        fr: [
          "Guava 32 (car c'est la version la plus récente).",
          "Guava 28 (car Maven utilise la règle 'Nearest Definition Wins' : profondeur 2 < profondeur 3).",
          "Les deux versions sont chargées simultanément dans le Classpath.",
          "Maven refuse de compiler avec une erreur fatale."
        ],
        en: [
          "Guava 32 (highest semantic version).",
          "Guava 28 (Maven uses 'Nearest Definition Wins': BFS depth 2 < depth 3).",
          "Both versions are loaded simultaneously onto the Classpath.",
          "Maven refuses to compile."
        ]
      },
      correctIndex: 1,
      explanation: {
        fr: "Exact ! Contrairement à Gradle qui choisit la version la plus haute (32), Maven choisit la définition la plus proche de la racine du pom.xml (profondeur 2 pour Guava 28 contre 3 pour Guava 32).",
        en: "Correct! Unlike Gradle (which picks highest version 32), Maven uses Nearest Definition Wins (depth 2 beats depth 3)."
      }
    }
  },
  {
    id: 'ch-16',
    title: {
      fr: '16. Spring Framework & Boot: IoC, Proxies CGLIB, Scopes & AOT',
      en: '16. Spring Framework & Boot: IoC, CGLIB Proxies, Scopes & AOT'
    },
    subtitle: {
      fr: 'Sous le capot JVM d’ApplicationContext, @Transactional, Self-Invocation et GraalVM',
      en: 'Under the JVM hood of ApplicationContext, @Transactional, Self-Invocation & GraalVM'
    },
    category: 'Advanced',
    estimatedTime: '25 min',
    iconName: 'Leaf',
    summary: {
      fr: "Spring n'est pas magique : son cœur repose sur un Conteneur d'Inversion de Contrôle (ApplicationContext) qui maintient un registre Singleton (ConcurrentHashMap), réalise un tri topologique pour l'injection par constructeur, génère des sous-classes bytecode CGLIB dynamiques dans le Metaspace pour la programmation orientée aspect (@Transactional, @Cacheable), et peut pré-calculer tout le graphe à la compilation via Spring 6 AOT pour GraalVM.",
      en: "Spring isn't magic: its ApplicationContext maintains a ConcurrentHashMap singleton registry, runs topological constructor wiring, weaves dynamic CGLIB bytecode subclasses in Metaspace for AOP (@Transactional, @Cacheable), and can compile statically ahead-of-time via Spring 6 AOT for GraalVM."
    },
    codeSnippet: `@Service
public class TransferService {
    private final AccountRepository repo;

    // Injection par constructeur recommandée (champs final & sans réflexion de champ)
    public TransferService(AccountRepository repo) {
        this.repo = repo;
    }

    @Transactional // Spring enveloppe ce Bean dans un proxy TransferService$$SpringCGLIB$$0 !
    public void transfer(String fromId, String toId, double amount) {
        repo.debit(fromId, amount);
        repo.credit(toId, amount); // Si RuntimeException -> TransactionInterceptor rollback !
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 1,
        code: '@Service',
        explanation: {
          fr: "Enregistré lors du @ComponentScan. Par défaut, Spring crée UNE SEULE instance (Singleton) stockée dans singletonObjects (ConcurrentHashMap) pour toute la JVM.",
          en: "Discovered via @ComponentScan. By default, Spring creates ONE single instance stored in singletonObjects (ConcurrentHashMap)."
        },
        memoryHint: {
          fr: "1 instance sur le Tas partagée par tous les threads HTTP -> le Bean doit être sans état (stateless) !",
          en: "1 Heap instance shared across all HTTP threads -> Bean MUST remain stateless!"
        }
      },
      {
        lineNumber: 6,
        code: '    public TransferService(AccountRepository repo) {',
        explanation: {
          fr: "L'injection par constructeur permet d'utiliser 'private final', garantit un objet complet à l'instanciation, et rejette immédiatement les cycles par BeanCurrentlyInCreationException.",
          en: "Constructor injection enables 'private final', guarantees valid invariants at construction, and fails fast on circular dependencies."
        }
      },
      {
        lineNumber: 10,
        code: '    @Transactional // Spring enveloppe ce Bean dans un proxy TransferService$$SpringCGLIB$$0 !',
        explanation: {
          fr: "Lors de l'étape BeanPostProcessor.postProcessAfterInitialization(), Spring détecte @Transactional et génère en bytecode une sous-classe CGLIB qui intercepte les appels via TransactionInterceptor.",
          en: "During BeanPostProcessor.postProcessAfterInitialization(), Spring generates a runtime CGLIB subclass intercepting calls with TransactionInterceptor."
        }
      }
    ],
    bytecode: [
      { offset: 0, opcode: 'new #1 <TransferService$$SpringCGLIB$$0>', comment: { fr: 'Spring génère et alloue le proxy CGLIB dans le Metaspace', en: 'Spring generates & allocates CGLIB proxy subclass' } },
      { offset: 3, opcode: 'invokevirtual #2 <TransactionInterceptor.invoke>', comment: { fr: 'Ouvre la connexion JDBC & BEGIN TRANSACTION', en: 'Acquire JDBC connection & BEGIN TRANSACTION' } },
      { offset: 6, opcode: 'invokespecial #3 <TransferService.transfer>', comment: { fr: 'Délègue au vrai POJO cible (target)', en: 'Delegate to actual target POJO' } },
      { offset: 9, opcode: 'invokevirtual #4 <PlatformTransactionManager.commit>', comment: { fr: 'Commit SQL si OK, ou Rollback si RuntimeException', en: 'SQL Commit on return, Rollback on RuntimeException' } }
    ],
    cComparison: {
      cCode: `// En C / Java pur : "Manual Composition Root" sans conteneur IoC
int main(void) {
    DatabasePool *pool = db_pool_init("postgres://...");
    AccountRepo *repo = account_repo_create(pool);
    TransferService *svc = transfer_service_create(repo);

    // En C, pas d'annotations ni de proxies automatiques :
    // Vous devez appeler BEGIN/COMMIT manuellement dans chaque fonction !
    db_begin_tx(pool);
    transfer(svc, "A", "B", 100.0);
    db_commit_tx(pool);
}`,
      explanation: {
        fr: "En C ou Java sans framework, vous assemblez vos dépendances à la main (Composition Root) et gérez manuellement transactions, sécurité et caches dans chaque fonction. Spring automatise l'assemblage (IoC) et déporte les préoccupations transversales (transactions, logs, sécurité) dans des proxies générés en bytecode.",
        en: "In C or plain Java, dependencies are wired manually in a Composition Root and transactions are coded explicitly. Spring automates wiring via IoC and weaves cross-cutting concerns using bytecode proxies."
      },
      memoryDifference: {
        fr: "C : Assemblage statique à la compilation (0 surcharge de proxy). Spring classique : Scanner ASM + métadonnées Reflection + classes CGLIB générées dans le Metaspace (éliminé en Spring 6 AOT + GraalVM).",
        en: "C: Zero runtime reflection/proxy overhead. Classic Spring: ASM bytecode scanning + Reflection + CGLIB classes in Metaspace (eliminated by Spring 6 AOT)."
      }
    },
    executionSteps: [
      {
        stepIndex: 0,
        lineNumber: 6,
        programCounter: 0,
        description: {
          fr: "Phase IoC Startup : ApplicationContext résout AccountRepository puis instancie TransferService via son constructeur.",
          en: "IoC Startup: ApplicationContext resolves AccountRepository then instantiates TransferService via constructor."
        },
        stackFrames: [
          { method: 'DefaultListableBeanFactory.createBean()', variables: [{ name: 'beanName', type: 'String', value: '"transferService"' }], operandStack: [] }
        ],
        heapObjects: [
          { id: 'repo-1', address: '@0xREPO', className: 'AccountRepository', fields: { dataSource: '@0xHIKARI' }, isGarbage: false },
          { id: 'svc-target', address: '@0xPOJO', className: 'TransferService (Target)', fields: { repo: '@0xREPO' }, isGarbage: false }
        ],
        stdout: ['[Spring IoC] Instantiated AccountRepository & TransferService target POJO.']
      },
      {
        stepIndex: 1,
        lineNumber: 10,
        programCounter: 3,
        description: {
          fr: "AnnotationAwareAspectJAutoProxyCreator détecte @Transactional et enveloppe @0xPOJO dans un proxy CGLIB @0xPROXY stocké dans le registre Singleton !",
          en: "BeanPostProcessor detects @Transactional and wraps @0xPOJO inside CGLIB proxy @0xPROXY registered as the Singleton Bean!"
        },
        stackFrames: [
          { method: 'CglibAopProxy.getProxy()', variables: [{ name: 'target', type: 'TransferService', value: '@0xPOJO', isRef: true }], operandStack: [] }
        ],
        heapObjects: [
          { id: 'svc-target', address: '@0xPOJO', className: 'TransferService (Target)', fields: { repo: '@0xREPO' }, isGarbage: false },
          { id: 'svc-proxy', address: '@0xPROXY', className: 'TransferService$$SpringCGLIB$$0', fields: { targetSource: '@0xPOJO', interceptor: 'TransactionInterceptor' }, isGarbage: false }
        ],
        stdout: ['[Spring AOP] Wrapped TransferService in CGLIB Proxy @0xPROXY -> stored in singletonObjects.']
      }
    ],
    jvmMemoryNotes: {
      fr: "Attention : la classe générée 'TransferService$$SpringCGLIB$$0' occupe de la mémoire dans le Metaspace. De plus, lors d'un appel interne 'this.autreMethodeTransactional()', le pointeur 'this' désigne @0xPOJO et non @0xPROXY : l'aspect @Transactional est donc totalement ignoré (Self-Invocation Trap).",
      en: "Generated CGLIB proxy classes reside in Metaspace. Calling 'this.otherMethod()' inside the target POJO hits @0xPOJO directly, bypassing @0xPROXY and skipping @Transactional!"
    },
    commonPitfalls: {
      fr: [
        "Le piège du Self-Invocation : appeler une méthode @Transactional / @Async de la même classe via 'this.' court-circuite le proxy CGLIB !",
        "Mettre 'final' sur une classe ou méthode @Service @Transactional : CGLIB ne peut pas hériter d'une classe finale ni surcharger une méthode finale.",
        "Stocker un champ mutable (ex: int userCounter) dans un Bean @Service singleton : provoque des Data Races entre requêtes HTTP concurrentes !"
      ],
      en: [
        "Self-Invocation Trap: calling this.transactionalMethod() inside the same bean bypasses the Spring CGLIB proxy.",
        "Marking @Transactional classes or methods 'final': CGLIB subclassing cannot override final methods.",
        "Storing mutable state inside default @Service singletons: causes concurrency race conditions across HTTP requests."
      ]
    },
    quiz: {
      id: 'q-16',
      question: {
        fr: "Que se passe-t-il si une méthode publique non-transactionnelle d'un @Service appelle une autre méthode @Transactional de la MÊME classe via 'this.save()' ?",
        en: "What happens when a non-transactional method in a @Service calls another @Transactional method in the SAME class via 'this.save()'?"
      },
      options: {
        fr: [
          "Spring ouvre automatiquement une nouvelle transaction imbriquée.",
          "Aucune transaction n'est ouverte car 'this' pointe vers l'objet cible réel et court-circuite le proxy CGLIB.",
          "La JVM lève une IllegalStateException au démarrage.",
          "Le Garbage Collector supprime le Bean de la mémoire."
        ],
        en: [
          "Spring automatically opens a nested transaction.",
          "No transaction is opened because 'this' points directly to the target POJO, bypassing the CGLIB proxy.",
          "JVM throws IllegalStateException at boot.",
          "Garbage Collector deletes the Bean."
        ]
      },
      correctIndex: 1,
      explanation: {
        fr: "Exact ! Seuls les appels entrants depuis l'extérieur passent par le proxy généré (TransferService$$SpringCGLIB$$0). Un appel interne via 'this' contourne complètement TransactionInterceptor !",
        en: "Spot on! Only external calls pass through the generated proxy (TransferService$$SpringCGLIB$$0). Internal 'this.' calls bypass TransactionInterceptor!"
      }
    }
  },
  {
    id: 'ch-17',
    title: {
      fr: '17. JUnit 5 (Jupiter), Cycle de Vie JVM & ByteBuddy Mocks',
      en: '17. JUnit 5 (Jupiter), JVM Lifecycle & ByteBuddy Mocks'
    },
    subtitle: {
      fr: 'PER_METHOD vs PER_CLASS sur le Tas, assertAll(), Objenesis et CUnit vs JUnit',
      en: 'PER_METHOD vs PER_CLASS Heap Lifecycle, assertAll(), Objenesis & CUnit vs JUnit'
    },
    category: 'Advanced',
    estimatedTime: '22 min',
    iconName: 'FlaskConical',
    summary: {
      fr: "JUnit 5 (Platform + Jupiter + Vintage) exécute les tests grâce à la réflexion JVM. Par défaut (Lifecycle.PER_METHOD), il instancie un nouvel objet de classe de test sur le Tas pour chaque méthode @Test afin d'isoler l'état. Couplé à Mockito, il génère des sous-classes ByteBuddy dans le Metaspace et alloue les @Mock sans exécuter leur constructeur via Objenesis.",
      en: "JUnit 5 (Platform + Jupiter + Vintage) executes tests via JVM reflection. By default (Lifecycle.PER_METHOD), it allocates a fresh Heap instance per @Test method for strict field isolation. With Mockito, ByteBuddy creates runtime subclasses in Metaspace allocated via Objenesis without calling constructors."
    },
    codeSnippet: `@ExtendWith(MockitoExtension.class)
class OrderServiceTest { // Visibilité package-private autorisée en JUnit 5 !
    @Mock
    private PaymentGateway gateway; // Alloué par ByteBuddy + Objenesis (sans <init>)

    @InjectMocks
    private OrderService service;

    @BeforeEach
    void init() { /* Réinitialisé avant chaque @Test */ }

    @Test
    @DisplayName("Vérifie le paiement et la capture d'exception")
    void shouldFailOnNegativeAmount() {
        assertAll(
            () -> assertThrows(IllegalArgumentException.class, () -> service.pay(-10)),
            () -> verifyNoInteractions(gateway)
        );
    }
}`,
    lineBreakdown: [
      {
        lineNumber: 1,
        code: '@ExtendWith(MockitoExtension.class)',
        explanation: {
          fr: "Remplace l'ancien @RunWith de JUnit 4 (limité à 1 seul runner). Plusieurs extensions peuvent être composées simultanément.",
          en: "Replaces JUnit 4's single @RunWith runner; multiple extensions compose cleanly."
        }
      },
      {
        lineNumber: 3,
        code: '    @Mock',
        explanation: {
          fr: "ByteBuddy génère une classe PaymentGateway$MockitoMock$... dans le Metaspace et Objenesis l'alloue sur le Tas sans invoquer son constructeur réel !",
          en: "ByteBuddy generates a runtime subclass in Metaspace and Objenesis allocates it on Heap bypassing the real constructor!"
        },
        memoryHint: {
          fr: "Méthode non stubbée retourne 0/false/null directement via MockMethodInterceptor.",
          en: "Unstubbed methods return 0/false/null via MockMethodInterceptor."
        }
      },
      {
        lineNumber: 15,
        code: '        assertAll(',
        explanation: {
          fr: "Exécute toutes les expressions lambda Executable et agrège chaque AssertionFailedError dans une seule MultipleFailuresError.",
          en: "Runs every Executable lambda and collects all AssertionFailedError instances into a single MultipleFailuresError."
        }
      }
    ],
    bytecode: [
      { offset: 0, opcode: 'new #1 <OrderServiceTest>', comment: { fr: 'JUnit PER_METHOD alloue une instance fraîche sur le Tas', en: 'JUnit PER_METHOD allocates fresh Heap instance' } },
      { offset: 3, opcode: 'invokespecial #2 <OrderServiceTest.<init>>', comment: { fr: 'Constructeur exécuté avant chaque @Test', en: 'Constructor called per @Test method' } },
      { offset: 6, opcode: 'invokevirtual #3 <OrderServiceTest.init>', comment: { fr: 'Exécute @BeforeEach sur cette instance', en: 'Runs @BeforeEach on fresh instance' } },
      { offset: 9, opcode: 'invokevirtual #4 <OrderServiceTest.shouldFailOnNegativeAmount>', comment: { fr: 'Exécute le @Test isolé', en: 'Executes isolated @Test' } }
    ],
    cComparison: {
      cCode: `// En C (CUnit / Criterion) :
// 1. Aucune réflexion au runtime : enregistrement manuel par pointeur de fonction
void test_negative_payment(void) {
    CU_ASSERT_EQUAL(pay(-10), ERR_INVALID_AMOUNT);
}

int main() {
    CU_initialize_registry();
    CU_pSuite suite = CU_add_suite("OrderSuite", NULL, NULL);
    CU_add_test(suite, "negative", test_negative_payment);
    CU_basic_run_tests();
}`,
      explanation: {
        fr: "En C, il n'existe pas d'annotations ni de réflexion : il faut enregistrer manuellement les pointeurs de fonction ou utiliser fork() (Criterion) pour isoler les crashes SEGFAULT. En Java, JUnit Platform découvre les annotations par scan de bytecode et isole les échecs par exceptions JVM.",
        en: "C lacks runtime reflection: tests require manual function pointer registration or OS fork() (Criterion) to survive segfaults. Java JUnit scans bytecode annotations and handles exceptions safely."
      },
      memoryDifference: {
        fr: "C/Criterion : Processus OS fork() séparés par test pour survie mémoire. Java/JUnit : Une même JVM, mais une nouvelle instance d'objet sur le Tas par méthode @Test (PER_METHOD).",
        en: "C/Criterion: OS fork() process isolation per test. Java/JUnit: Single JVM with fresh Heap test class instances per @Test method."
      }
    },
    executionSteps: [
      {
        stepIndex: 0,
        lineNumber: 2,
        programCounter: 0,
        description: {
          fr: "JupiterTestEngine découvre OrderServiceTest et alloue @0xTEST_1 sur le Tas pour le test #1 (mode PER_METHOD).",
          en: "JupiterTestEngine discovers OrderServiceTest and allocates @0xTEST_1 on Heap for test #1 (PER_METHOD)."
        },
        stackFrames: [
          { method: 'JupiterTestEngine.execute()', variables: [{ name: 'lifecycle', type: 'Lifecycle', value: 'PER_METHOD' }], operandStack: [] }
        ],
        heapObjects: [
          { id: 'test-inst-1', address: '@0xTEST_1', className: 'OrderServiceTest', fields: { gateway: '@0xMOCK_BB' }, isGarbage: false },
          { id: 'mock-1', address: '@0xMOCK_BB', className: 'PaymentGateway$MockitoMock$0', fields: { interceptor: 'MockMethodInterceptor' }, isGarbage: false }
        ],
        stdout: ['[JUnit Jupiter] Allocated fresh test instance @0xTEST_1 + ByteBuddy mock @0xMOCK_BB.']
      },
      {
        stepIndex: 1,
        lineNumber: 15,
        programCounter: 9,
        description: {
          fr: "Exécution de assertAll(...) : les deux lambdas sont évalués sans court-circuit et réussissent.",
          en: "Executing assertAll(...): both lambda executables are evaluated and pass."
        },
        stackFrames: [
          { method: 'OrderServiceTest.shouldFailOnNegativeAmount()', variables: [{ name: 'this', type: 'OrderServiceTest', value: '@0xTEST_1', isRef: true }], operandStack: ['assertThrows -> PASSED', 'verifyNoInteractions -> PASSED'] }
        ],
        heapObjects: [
          { id: 'test-inst-1', address: '@0xTEST_1', className: 'OrderServiceTest', fields: { gateway: '@0xMOCK_BB' }, isGarbage: false }
        ],
        stdout: ['[JUnit 5] Test PASSED (100% isolated).']
      }
    ],
    jvmMemoryNotes: {
      fr: "Si une classe contient 100 méthodes @Test, JUnit alloue successivement 100 objets dans l'espace Eden du Tas (ramassés aussitôt par le Minor GC). Avec @SpringBootTest, Spring Test met l'ApplicationContext entier en cache (Context Caching) entre les classes de test partageant la même configuration.",
      en: "For 100 @Test methods, JUnit allocates 100 short-lived instances in Eden space (reclaimed instantly by Minor GC). @SpringBootTest caches the full ApplicationContext across test classes sharing identical configs."
    },
    commonPitfalls: {
      fr: [
        "Utiliser when(spy.get(0)).thenReturn(...) au lieu de doReturn(...).when(spy).get(0) : Java appelle la méthode réelle de l'espion avant même l'appel à when() !",
        "Passer en @TestInstance(Lifecycle.PER_CLASS) sans réinitialiser les champs mutables dans @BeforeEach -> tests non déterministes dépendant de l'ordre d'exécution !",
        "Abuser de @SpringBootTest sur chaque test unitaire au lieu de tests POJO purs ou de slices (@WebMvcTest, @DataJpaTest)."
      ],
      en: [
        "Using when(spy.get(0)) instead of doReturn(...).when(spy).get(0): triggers real method execution prior to stubbing!",
        "Using PER_CLASS without resetting mutable fields in @BeforeEach -> flaky order-dependent tests!",
        "Using heavy @SpringBootTest everywhere instead of pure POJO unit tests or slices (@WebMvcTest, @DataJpaTest)."
      ]
    },
    quiz: {
      id: 'q-17',
      question: {
        fr: "Par défaut (sans annotation @TestInstance), combien d'instances de la classe de test JUnit 5 alloue-t-il sur le Tas pour une classe contenant 5 méthodes @Test ?",
        en: "By default (without @TestInstance), how many test class instances does JUnit 5 allocate on the Heap for a class containing 5 @Test methods?"
      },
      options: {
        fr: [
          "1 seule instance partagée entre les 5 tests.",
          "5 instances distinctes (1 par méthode @Test) grâce au mode PER_METHOD.",
          "0 instance : toutes les méthodes @Test sont static.",
          "2 instances : une pour @BeforeAll et une pour @AfterAll."
        ],
        en: [
          "1 shared instance across all 5 tests.",
          "5 distinct Heap instances (1 per @Test method) under default PER_METHOD lifecycle.",
          "0 instances: @Test methods are static.",
          "2 instances: one for @BeforeAll and one for @AfterAll."
        ]
      },
      correctIndex: 1,
      explanation: {
        fr: "Exact ! En mode par défaut PER_METHOD, JUnit 5 instancie un objet tout neuf pour chaque méthode @Test afin qu'aucune mutation de champ d'un test ne pollue les tests suivants.",
        en: "Spot on! Under default PER_METHOD lifecycle, JUnit 5 creates a brand new test instance per @Test method so mutable fields cannot leak across tests."
      }
    }
  },
  {
    id: 'ch-18',
    title: {
      fr: '18. Javadoc, DocTree AST, Doclets & Markdown (JEP 467)',
      en: '18. Javadoc, DocTree AST, Doclets & Markdown (JEP 467)'
    },
    subtitle: {
      fr: 'Frontend javac, -Xdoclint, StandardDoclet, {@snippet} (Java 18) et /// Markdown (Java 23)',
      en: 'javac frontend, -Xdoclint, StandardDoclet, {@snippet} (Java 18) & /// Markdown (Java 23)'
    },
    category: 'Advanced',
    estimatedTime: '20 min',
    iconName: 'FileText',
    summary: {
      fr: "Javadoc n'est pas un simple extracteur de texte : il s'appuie directement sur le frontend du compilateur javac pour construire un arbre syntaxique DocTree, vérifier la validité des liens {@link} et contrats (-Xdoclint), générer des portails HTML5 via le StandardDoclet (jdk.javadoc.doclet) et supporte les extraits testables {@snippet} (Java 18) ainsi que le Markdown natif /// (Java 23).",
      en: "Javadoc is not a regex scraper: it runs inside javac's compiler frontend to build a DocTree AST, resolve {@link} symbols, enforce -Xdoclint checks, emit HTML5 via StandardDoclet (jdk.javadoc.doclet), and supports {@snippet} (Java 18) plus native /// Markdown (Java 23)."
    },
    codeSnippet: `/**
 * Computes net discount using {@code BigDecimal} rounding.
 *
 * @param price initial positive amount
 * @return discounted price
 * @throws IllegalArgumentException if {@code price} is negative
 */
@Deprecated(since = "2.0")
public BigDecimal applyDiscount(BigDecimal price) {
    if (price.signum() < 0) throw new IllegalArgumentException();
    return price.multiply(new BigDecimal("0.90"));
}`,
    lineBreakdown: [
      {
        lineNumber: 1,
        code: '/**',
        explanation: {
          fr: "Le double astérisque /** signale au Lexer de javac de conserver ce commentaire et de le parser en arbre DocTree (contrairement à /* et // qui sont jetés dès l'analyse lexicale).",
          en: "The double asterisk /** signals javac's lexer to preserve and parse this comment into a DocTree AST (unlike /* and // which are discarded)."
        }
      },
      {
        lineNumber: 2,
        code: ' * Computes net discount using {@code BigDecimal} rounding.',
        explanation: {
          fr: "Le tag inline {@code ...} empêche le parseur HTML strict de -Xdoclint d'interpréter les chevrons génériques (ex: List<String>) comme des balises HTML invalides.",
          en: "Inline {@code ...} escapes angle brackets so -Xdoclint's HTML parser does not misread generics like List<String> as invalid HTML tags."
        },
        memoryHint: {
          fr: "0 octet dans le bytecode .class : le texte Javadoc reste uniquement dans les fichiers .java / -javadoc.jar.",
          en: "0 bytes in .class bytecode: Javadoc prose lives strictly in .java sources or -javadoc.jar artifacts."
        }
      },
      {
        lineNumber: 8,
        code: '@Deprecated(since = "2.0")',
        explanation: {
          fr: "Contrairement au tag @deprecated (HTML uniquement), l'annotation @Deprecated est inscrite dans le bytecode (RuntimeVisibleAnnotations) et déclenche un warning javac.",
          en: "Unlike the Javadoc @deprecated tag, the @Deprecated annotation is written into .class bytecode and triggers javac compiler warnings."
        }
      }
    ],
    bytecode: [
      { offset: 0, opcode: 'RuntimeVisibleAnnotations: @Deprecated(since="2.0")', comment: { fr: 'Seule l annotation survit dans le .class (aucun texte Javadoc)', en: 'Only the @Deprecated annotation survives in .class (zero Javadoc prose)' } },
      { offset: 4, opcode: 'aload_1', comment: { fr: 'Charge price sur la pile d opérandes', en: 'Load price onto operand stack' } },
      { offset: 5, opcode: 'invokevirtual #2 <BigDecimal.signum>', comment: { fr: 'Vérifie précondition documentée dans @throws', en: 'Validates precondition documented by @throws' } }
    ],
    cComparison: {
      cCode: `/**
 * @brief Computes discounted price in C (Doxygen)
 * @param price positive amount
 * @return discounted value
 */
double apply_discount(double price);`,
      explanation: {
        fr: "En C, la documentation repose sur un outil externe (Doxygen) avec son propre parseur C et gestion manuelle des #ifdef du préprocesseur. En Java, javadoc est livré nativement avec le JDK et utilise l'AST réel de javac pour vérifier chaque référence {@link}.",
        en: "In C, documentation uses an external tool (Doxygen) with a standalone C parser. In Java, javadoc ships with the JDK and reuses javac's real AST and classpath resolution for {@link}."
      },
      memoryDifference: {
        fr: "Ni Doxygen ni Javadoc n'existent dans le binaire exécutable final (ELF ou .class) : tous deux sont exploités exclusivement à la compilation / génération de portail.",
        en: "Neither Doxygen nor Javadoc prose enters the compiled binary (ELF or .class); both operate strictly on source ASTs."
      }
    },
    executionSteps: [
      {
        stepIndex: 0,
        lineNumber: 1,
        programCounter: 0,
        description: {
          fr: "javac lit le fichier .java : /** est capturé comme DocCommentTree tandis que /* et // sont jetés.",
          en: "javac lexes .java source: /** is captured as a DocCommentTree while /* and // are discarded."
        },
        stackFrames: [
          { method: 'JavadocTool.run()', variables: [{ name: 'doclint', type: 'String', value: 'all' }], operandStack: [] }
        ],
        heapObjects: [
          { id: 'doctree-1', address: '@0xAST_DOC', className: 'com.sun.source.doctree.DocCommentTree', fields: { blockTags: '3 (@param, @return, @throws)', inlineTags: '2 ({@code})' }, isGarbage: false }
        ],
        stdout: ['[javac DocTree] Parsed /** comment with 0 -Xdoclint errors.']
      },
      {
        stepIndex: 1,
        lineNumber: 9,
        programCounter: 5,
        description: {
          fr: "StandardDoclet (jdk.javadoc.doclet) émet la page HTML5 avec index de recherche JS et valide le contrat.",
          en: "StandardDoclet emits searchable HTML5 documentation pages from DocletEnvironment."
        },
        stackFrames: [
          { method: 'StandardDoclet.run()', variables: [{ name: 'visibility', type: 'Access', value: '-protected (default)' }], operandStack: ['HTML5 emitted'] }
        ],
        heapObjects: [
          { id: 'doclet-1', address: '@0xDOCLET', className: 'jdk.javadoc.doclet.StandardDoclet', fields: { output: 'apidocs/index.html', frames: 'false (HTML5)' }, isGarbage: false }
        ],
        stdout: ['[StandardDoclet] Generated target/apidocs/index.html + element-list']
      }
    ],
    jvmMemoryNotes: {
      fr: "Aucune mémoire Heap ou Metaspace n'est consommée par les commentaires Javadoc à l'exécution de votre application : le compilateur javac les exclut totalement du fichier .class. En Maven/Gradle, la documentation est distribuée séparément dans un archive *-javadoc.jar requise par Maven Central.",
      en: "Zero Heap or Metaspace memory is consumed by Javadoc comments at runtime—javac strips them completely from .class files. Maven/Gradle ship them separately in a *-javadoc.jar required by Maven Central."
    },
    commonPitfalls: {
      fr: [
        "Écrire List<String> directement dans la Javadoc sans {@code List<String>} : -Xdoclint:html interprète <String> comme une balise HTML inconnue et fait échouer le build Maven/Gradle.",
        "Utiliser /* ... */ au lieu de /** ... */ : le commentaire est totalement ignoré par javac et n'apparaît jamais dans l'API HTML.",
        "Ajouter @deprecated en Javadoc sans mettre l'annotation @Deprecated sur la méthode (ou inversement)."
      ],
      en: [
        "Writing raw List<String> without {@code List<String>}: -Xdoclint:html parses <String> as an invalid HTML tag and fails the build.",
        "Using /* ... */ instead of /** ... */: silently discarded by javac's lexer.",
        "Using @deprecated Javadoc tag without the @Deprecated Java annotation (or vice versa)."
      ]
    },
    quiz: {
      id: 'q-18',
      question: {
        fr: "Pourquoi écrire directement List<String> dans un commentaire /** ... */ (hors Markdown ///) provoque-t-il souvent une erreur de build avec -Xdoclint en Java 8+ ?",
        en: "Why does writing raw List<String> inside a classic /** ... */ comment often fail the build under Java 8+ -Xdoclint?"
      },
      options: {
        fr: [
          "Parce que javac charge toute la Javadoc dans le Metaspace au runtime.",
          "Parce que le parseur HTML strict de -Xdoclint interprète <String> comme une balise HTML invalide (il faut l'entourer de {@code List<String>}).",
          "Parce que Javadoc n'autorise pas les types génériques dans les signatures Java.",
          "Parce que -Xdoclint exige le format Doxygen @brief."
        ],
        en: [
          "Because javac loads Javadoc comments into Metaspace at runtime.",
          "Because -Xdoclint's HTML parser treats <String> as an unknown HTML tag unless wrapped with {@code List<String>}.",
          "Because Javadoc forbids generic types in Java signatures.",
          "Because -Xdoclint requires Doxygen @brief syntax."
        ]
      },
      correctIndex: 1,
      explanation: {
        fr: "Exact ! Sous Java 8+, -Xdoclint vérifie strictement le HTML. Tout chevron <...> non reconnu comme balise HTML valide doit être protégé par {@code ...} ou {@literal ...} (ou écrit en Markdown /// depuis Java 23).",
        en: "Spot on! Java 8+ -Xdoclint validates HTML strictly. Raw angle brackets like <String> are treated as invalid HTML tags unless wrapped in {@code ...} or written using Java 23 /// Markdown."
      }
    }
  }
];


