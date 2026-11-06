import { JavaVersionRelease } from '../types';

export const JAVA_HISTORY_RELEASES: JavaVersionRelease[] = [
  {
    version: 'Java 1.0',
    year: 1996,
    codename: 'Oak',
    isLts: false,
    status: 'Historic',
    era: 'Foundation',
    description: {
      fr: 'Naissance publique de Java par James Gosling chez Sun Microsystems. Le slogan révolutionnaire "Write Once, Run Anywhere" (WORA) introduit la machine virtuelle (JVM) et le Bytecode.',
      en: 'Public release of Java by James Gosling at Sun Microsystems. Slogan "Write Once, Run Anywhere" introduces the JVM and portable Bytecode.'
    },
    jvmChanges: {
      fr: 'Création de la première machine virtuelle avec ramasse-miettes automatique et bac à sable de sécurité pour les Applets du web.',
      en: 'First JVM runtime featuring automatic garbage collection and Applet security sandboxing.'
    },
    features: [
      {
        name: 'JVM & Bytecode',
        description: {
          fr: 'Compilation vers un format binaire intermédiaire (.class) interprété par la machine virtuelle.',
          en: 'Compilation to intermediate binary bytecode (.class) executed in a virtual machine.'
        },
        codeSnippet: `// Java 1.0 (1996)
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
      },
      {
        name: 'Applets & AWT',
        description: {
          fr: 'Intégration d\'applications interactives directement dans Netscape Navigator.',
          en: 'In-browser interactive applets running inside Netscape Navigator.'
        }
      }
    ]
  },
  {
    version: 'Java 1.1',
    year: 1997,
    isLts: false,
    status: 'Historic',
    era: 'Foundation',
    description: {
      fr: 'Stabilisation industrielle du langage avec l\'ajout des classes imbriquées (Inner Classes), de l\'accès aux bases de données (JDBC) et de l\'invocation distante (RMI).',
      en: 'Enterprise stabilization introducing Inner Classes, JDBC database connectivity, and RMI.'
    },
    jvmChanges: {
      fr: 'Génération par javac des champs cachés this$0 pour lier les Inner Classes à leur instance englobante.',
      en: 'Compiler synthesis of hidden this$0 pointers to bind inner instances to enclosing objects.'
    },
    features: [
      {
        name: 'Inner Classes (Classes Imbriquées)',
        description: {
          fr: 'Possibilité de déclarer des classes à l\'intérieur d\'autres classes pour gérer les écouteurs d\'événements GUI.',
          en: 'Nesting classes within classes to facilitate GUI event listener callbacks.'
        },
        codeSnippet: `button.addActionListener(new ActionListener() { // Classe anonyme
    public void actionPerformed(ActionEvent e) {
        System.out.println("Clic!");
    }
});`
      },
      {
        name: 'JDBC & RMI',
        description: {
          fr: 'Connectivité standardisée aux bases de données SQL et communication d\'objets distants.',
          en: 'Standard SQL database connectivity and remote method invocation.'
        }
      }
    ]
  },
  {
    version: 'Java 1.2',
    year: 1998,
    codename: 'Playground / Java 2',
    isLts: false,
    status: 'Historic',
    era: 'Foundation',
    description: {
      fr: 'Rebaptisé "Java 2" (J2SE). Introduction majeure du Java Collections Framework (List, Map, Set) et de la bibliothèque graphique Swing.',
      en: 'Rebranded as Java 2 (J2SE). Introduced the landmark Java Collections Framework and Swing UI.'
    },
    jvmChanges: {
      fr: 'Arrivée du premier compilateur JIT (Just-In-Time) dans la machine virtuelle pour accélérer le code chaud.',
      en: 'First JIT (Just-In-Time) native code compiler integrated into the JVM runtime.'
    },
    features: [
      {
        name: 'Collections Framework (List, Map, Set)',
        description: {
          fr: 'Remplacement des anciennes classes Vector et Hashtable par ArrayList, HashMap, etc.',
          en: 'Modern collection interfaces (List, Set, Map) replacing legacy Vector and Hashtable.'
        },
        codeSnippet: `// Java 1.2: Collections (encore sans génériques, cast requis!)
List list = new ArrayList();
list.add("JavaBabel");
String s = (String) list.get(0); // Cast manuel obligatoire!`
      }
    ]
  },
  {
    version: 'Java 1.4',
    year: 2002,
    codename: 'Merlin',
    isLts: false,
    status: 'Historic',
    era: 'Foundation',
    description: {
      fr: 'Amélioration des performances I/O réseau avec NIO (Non-blocking I/O), support natif des expressions régulières et du mot-clé assert.',
      en: 'High-performance networking with NIO (Non-blocking I/O), regular expressions, and assertions.'
    },
    jvmChanges: {
      fr: 'Adoption définitive de HotSpot JVM avec compilateurs C1 (Client rapide) et C2 (Server optimisé).',
      en: 'HotSpot JVM becomes default featuring tiered C1 (client) and C2 (server) JIT compilers.'
    },
    features: [
      {
        name: 'NIO (New I/O / Canaux non-bloquants)',
        description: {
          fr: 'Tampons directs hors-tas (DirectByteBuffer) et sélecteurs de sockets non-bloquants.',
          en: 'Direct off-heap byte buffers and non-blocking socket selectors.'
        }
      },
      {
        name: 'Expressions Régulières (java.util.regex)',
        description: {
          fr: 'Support standard de Pattern et Matcher sans bibliothèque tierce.',
          en: 'Native pattern matching with regex.'
        }
      }
    ]
  },
  {
    version: 'Java 5.0',
    year: 2004,
    codename: 'Tiger',
    isLts: false,
    status: 'Historic',
    era: 'Generics & Concurrency',
    description: {
      fr: 'L\'UNE DES PLUS GRANDES RÉVOLUTIONS DE L\'HISTOIRE DE JAVA: Génériques (<T>), Autoboxing, Énumérations, Annotations et Concurrence moderne (Doug Lea).',
      en: 'ONE OF THE GREATEST REVOLUTIONS: Generics (<T>), Autoboxing, Enums, Annotations, and java.util.concurrent.'
    },
    jvmChanges: {
      fr: 'Effacement de type (Type Erasure) pour préserver la rétrocompatibilité binaire. Optimisations de verrouillage de threads (Biased Locking).',
      en: 'Type Erasure for backwards compatibility. Biased locking and lightweight thread synchronization.'
    },
    features: [
      {
        name: 'Types Génériques (<T>)',
        description: {
          fr: 'Sécurité du typage vérifiée à la compilation: fini les ClassCastException à l\'exécution !',
          en: 'Compile-time type safety eliminating runtime ClassCastExceptions.'
        },
        codeSnippet: `// Java 5: Typage fort sans cast
List<String> names = new ArrayList<String>();
names.add("Babel");
String first = names.get(0); // Garanti String par le compilateur`
      },
      {
        name: 'Autoboxing & Unboxing',
        description: {
          fr: 'Conversion automatique entre types primitifs (int) et objets wrappers (Integer).',
          en: 'Automatic conversion between primitives (int) and wrapper objects (Integer).'
        }
      },
      {
        name: 'Énumérations (enum)',
        description: {
          fr: 'Les enums en Java sont des classes complètes avec constructeurs et méthodes.',
          en: 'Type-safe enums with fields and methods.'
        }
      },
      {
        name: 'java.util.concurrent',
        description: {
          fr: 'ThreadPoolExecutor, ConcurrentHashMap, AtomicInteger créés par Doug Lea.',
          en: 'High-throughput thread pools and non-blocking atomic data structures.'
        }
      }
    ]
  },
  {
    version: 'Java 6',
    year: 2006,
    codename: 'Mustang',
    isLts: false,
    status: 'Historic',
    era: 'Generics & Concurrency',
    description: {
      fr: 'Période de transition marquée par des gains de performances, l\'API de compilation à la volée et le rachat de Sun Microsystems par Oracle en 2009-2010.',
      en: 'Performance stabilization and compiler APIs. Sun Microsystems acquired by Oracle in 2009-2010.'
    },
    jvmChanges: {
      fr: 'Optimisations massives du JIT, inlining de méthodes virtuelles, escape analysis pour allouer sur la pile.',
      en: 'Escape Analysis (allocating non-escaping objects on stack instead of heap).'
    },
    features: [
      {
        name: 'Pluggable Annotation Processing API',
        description: {
          fr: 'Permet aux frameworks (Lombok, MapStruct, Dagger) d\'analyser et générer du code à la compilation.',
          en: 'Compiler plugins to generate code at compile time.'
        }
      }
    ]
  },
  {
    version: 'Java 7',
    year: 2011,
    codename: 'Dolphin',
    isLts: false,
    status: 'Historic',
    era: 'Generics & Concurrency',
    description: {
      fr: 'Première version publiée sous l\'égide d\'Oracle. Ajout du try-with-resources pour éliminer les fuites de ressources et amélioration de la syntaxe.',
      en: 'First release under Oracle stewardship. Added try-with-resources and syntax enhancements.'
    },
    jvmChanges: {
      fr: 'Introduction du nouveau ramasse-miettes G1 (Garbage-First) et de la nouvelle instruction de bytecode "invokedynamic" pour les langages dynamiques.',
      en: 'Introduced G1 GC (Garbage-First) and the revolutionary "invokedynamic" bytecode opcode.'
    },
    features: [
      {
        name: 'Try-with-resources (AutoCloseable)',
        description: {
          fr: 'Fermeture garantie des fichiers et sockets sans écrire de blocs finally verbeux.',
          en: 'Automatic resource closure without boilerplate finally blocks.'
        },
        codeSnippet: `// Java 7: Fermeture garantie automatique
try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
    return br.readLine();
} // br.close() invoqué automatiquement !`
      },
      {
        name: 'Opérateur Diamant (<>) & Switch sur String',
        description: {
          fr: 'List<String> list = new ArrayList<>(); Inférence du type et switch sur chaînes de texte.',
          en: 'Diamond operator for constructor type inference and switch over String.'
        }
      }
    ]
  },
  {
    version: 'Java 8',
    year: 2014,
    isLts: true,
    status: 'Active LTS',
    era: 'Functional Revolution',
    description: {
      fr: 'LA PLUS GRANDE VERSION MODERNE DE JAVA: Arrivée de la programmation fonctionnelle avec les Lambdas, la Streams API, Optional et l\'API Date/Time.',
      en: 'THE BIGGEST MODERN RELEASE: Functional programming with Lambdas, Streams API, Optional, and java.time.'
    },
    jvmChanges: {
      fr: 'Suppression définitive du PermGen (Permanent Generation) remplacé par Metaspace (mémoire native OS). Les lambdas utilisent invokedynamic sans générer de classes anonymes superflues.',
      en: 'PermGen completely removed in favor of native Metaspace. Lambdas leverage invokedynamic with zero-class-file overhead.'
    },
    features: [
      {
        name: 'Expressions Lambda (->)',
        description: {
          fr: 'Fonctions anonymes concises pour passer des comportements en argument.',
          en: 'Concise anonymous functions passed as first-class parameters.'
        },
        codeSnippet: `// Java 8: Lambda et Streams
List<String> names = List.of("Java", "Babel", "JVM");
names.stream()
     .filter(s -> s.length() > 3)
     .map(String::toUpperCase)
     .forEach(System.out::println);`
      },
      {
        name: 'Streams API (map, filter, reduce)',
        description: {
          fr: 'Pipelines déclaratifs, évaluation paresseuse et parallélisation via .parallelStream().',
          en: 'Declarative lazy data processing pipelines trivially parallelized.'
        }
      },
      {
        name: 'Nouvelle API Date & Time (java.time)',
        description: {
          fr: 'LocalDate, ZonedDateTime immuables et thread-safe remplaçant le vieux java.util.Date.',
          en: 'Immutable, thread-safe date-time domain objects (JSR-310).'
        }
      }
    ]
  },
  {
    version: 'Java 9',
    year: 2017,
    isLts: false,
    status: 'Historic',
    era: 'Modular & Rapid Cadence',
    description: {
      fr: 'Projet Jigsaw: modularisation complète du JDK avec module-info.java pour sceller les API internes et réduire la taille des conteneurs.',
      en: 'Project Jigsaw modular system (JPMS), JShell REPL, and G1 GC becoming the default collector.'
    },
    jvmChanges: {
      fr: 'G1 GC devient le ramasse-miettes par défaut. Compact Strings divise par 2 la taille mémoire des chaînes de caractères contenant des caractères ASCII/Latin-1.',
      en: 'G1 GC becomes default. Compact Strings encodes Latin-1 strings into single-byte arrays, halving memory footprint.'
    },
    features: [
      {
        name: 'Système de Modules JPMS (module-info.java)',
        description: {
          fr: 'Encapsulation forte au niveau des packages et dépendances explicites.',
          en: 'Strong package encapsulation and explicit module graphs.'
        },
        codeSnippet: `module com.app.billing {
    requires java.sql;
    exports com.app.billing.api;
}`
      },
      {
        name: 'JShell REPL',
        description: {
          fr: 'Console interactive pour tester du code Java sans déclarer de classe ou de main.',
          en: 'Interactive Read-Eval-Print Loop for fast prototyping.'
        }
      }
    ]
  },
  {
    version: 'Java 11',
    year: 2018,
    isLts: true,
    status: 'Active LTS',
    era: 'Modular & Rapid Cadence',
    description: {
      fr: 'Version LTS majeure marquant l\'adoption du cycle de publication de 6 mois. Nouveau client HTTP moderne et exécution directe de fichiers .java.',
      en: 'Major LTS release cementing the 6-month rapid release cadence. Features standardized HttpClient and single-file launcher.'
    },
    jvmChanges: {
      fr: 'Introduction du ramasse-miettes ZGC (Zero pause Garbage Collector) avec temps de pause sub-milliseconde. Epsilon GC (No-Op GC pour benchmarks).',
      en: 'Introduction of ZGC (sub-millisecond pause GC) and Epsilon No-Op GC.'
    },
    features: [
      {
        name: 'Standard HttpClient (HTTP/2 & WebSockets)',
        description: {
          fr: 'Client HTTP asynchrone moderne remplaçant l\'antique HttpURLConnection.',
          en: 'Native reactive HTTP/2 and WebSocket client.'
        },
        codeSnippet: `HttpClient client = HttpClient.newHttpClient();
HttpRequest req = HttpRequest.newBuilder(URI.create("https://api.github.com")).build();
HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());`
      },
      {
        name: 'Lancement direct de fichiers sources',
        description: {
          fr: 'Exécution d\'un script "java Script.java" sans étape manuelle javac.',
          en: 'Run standalone single-file source code without separate javac step.'
        }
      }
    ]
  },
  {
    version: 'Java 17',
    year: 2021,
    isLts: true,
    status: 'Active LTS',
    era: 'Modular & Rapid Cadence',
    description: {
      fr: 'Version LTS de référence en entreprise. Intègre les Records, les Classes Scellées (Sealed Classes), les Text Blocks et le Pattern Matching.',
      en: 'Enterprise LTS benchmark integrating Records, Sealed Classes, Multi-line Text Blocks, and Pattern Matching.'
    },
    jvmChanges: {
      fr: 'Encapsulation stricte définitive de tous les composants internes de la JVM (sun.misc.Unsafe restreint). ZGC passe en mode de production.',
      en: 'Strong internal encapsulation by default. ZGC promoted to production.'
    },
    features: [
      {
        name: 'Records (Classes de Données Immuables)',
        description: {
          fr: 'Génération automatique de constructeur, getters, equals, hashCode et toString en 1 seule ligne !',
          en: 'Boilerplate-free immutable data classes generated in a single line.'
        },
        codeSnippet: `// Java 16/17: Fini le boilerplate Lombok/getters!
public record User(long id, String name, String email) {}`
      },
      {
        name: 'Classes Scellées (Sealed Classes)',
        description: {
          fr: 'Contrôle strict des classes autorisées à hériter via "sealed ... permits".',
          en: 'Restricting inheritance hierarchies using "sealed" and "permits".'
        },
        codeSnippet: `public sealed interface Payment permits CreditCard, PayPal, Crypto {}`
      },
      {
        name: 'Text Blocks Multi-lignes (""")',
        description: {
          fr: 'Écriture native de JSON, SQL ou HTML sans concaténation ni \\n.',
          en: 'Multi-line string literals for clean JSON, SQL, and HTML.'
        }
      }
    ]
  },
  {
    version: 'Java 21',
    year: 2023,
    isLts: true,
    status: 'Active LTS',
    era: 'Modern Loom & Panama',
    description: {
      fr: 'RÉVOLUTION HISTORIQUE DE LA CONCURRENCE: Projet Loom avec les Virtual Threads (threads virtuels ultra-légers), Sequenced Collections et Pattern Matching complet.',
      en: 'HISTORIC CONCURRENCY MILESTONE: Virtual Threads (Project Loom), Sequenced Collections, and Record Pattern Matching.'
    },
    jvmChanges: {
      fr: 'Projet Loom: La JVM découple les threads applicatifs des threads de l\'OS. Un serveur peut désormais exécuter 1 million de threads simultanés avec quelques Mo de RAM ! ZGC devient générationnel.',
      en: 'Project Loom decouples virtual threads from carrier OS threads, allowing 1,000,000 concurrent threads. Generational ZGC.'
    },
    features: [
      {
        name: 'Virtual Threads (Projet Loom)',
        description: {
          fr: 'Permet d\'écrire du code synchrone bloquant simple avec le débit d\'un système réactif non-bloquant.',
          en: 'Synchronous blocking code with the throughput of reactive architectures.'
        },
        codeSnippet: `// Java 21: Créer 10 000 threads virtuels sans épuiser la RAM
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i -> {
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1));
            return i;
        });
    });
}`
      },
      {
        name: 'Pattern Matching pour Switch & Records',
        description: {
          fr: 'Déstructuration directe des données dans les expressions switch.',
          en: 'Direct pattern matching and record deconstruction in switch.'
        },
        codeSnippet: `static String format(Object obj) {
    return switch (obj) {
        case Integer i -> "Entier: " + i;
        case String s  -> "Texte de taille " + s.length();
        case User(var id, var name, _) -> "Utilisateur: " + name;
        default        -> "Autre type";
    };
}`
      },
      {
        name: 'Sequenced Collections',
        description: {
          fr: 'Interfaces uniformes avec .getFirst(), .getLast(), .reversed().',
          en: 'Uniform first/last and reversed collection operations.'
        }
      }
    ]
  },
  {
    version: 'Java 22 - 25',
    year: 2024,
    isLts: false,
    status: 'Latest',
    era: 'Modern Loom & Panama',
    description: {
      fr: 'Projet Panama: L\'API Foreign Function & Memory (FFM) remplace définitivement JNI. Interopérabilité directe et sécurisée avec le code C/C++ et les bibliothèques natives.',
      en: 'Project Panama Foreign Function & Memory (FFM) API replaces JNI, enabling safe native C interop and off-heap memory.'
    },
    jvmChanges: {
      fr: 'Gestion unifiée de la mémoire off-heap sans risque de crash mémoire. Vector API pour calculs SIMD matériels.',
      en: 'Safe off-heap foreign memory access and Vector API hardware SIMD acceleration.'
    },
    features: [
      {
        name: 'FFM API (Projet Panama vs JNI)',
        description: {
          fr: 'Appel direct de fonctions en C (ex: printf, blas, ffmpeg) en pur Java sans compiler de fichier .so/.dll intermédiaire !',
          en: 'Direct invocation of C libraries without boilerplate JNI header generation or native C shims.'
        },
        codeSnippet: `// Java 22: Appel direct d'une fonction C (ex: strlen)
Linker linker = Linker.nativeLinker();
MethodHandle strlen = linker.downcallHandle(
    linker.defaultLookup().find("strlen").orElseThrow(),
    FunctionDescriptor.of(ValueLayout.JAVA_LONG, ValueLayout.ADDRESS)
);`
      },
      {
        name: 'Variables & Patterns Sans Nom (_)',
        description: {
          fr: 'Utilisation du caractère souligné (_) pour ignorer explicitement une variable.',
          en: 'Unnamed variables and pattern discard using underscore (_).'
        }
      }
    ]
  }
];
