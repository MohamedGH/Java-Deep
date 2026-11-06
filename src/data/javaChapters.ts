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
  }
];

