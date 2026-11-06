import React, { useState } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { 
  SplitSquareVertical, 
  Cpu, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Copy, 
  Check, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface ComparisonTopic {
  id: string;
  title: { fr: string; en: string };
  icon: string;
  cCode: string;
  javaCode: string;
  cExplanation: { fr: string; en: string };
  javaExplanation: { fr: string; en: string };
  memoryModel: { fr: string; en: string };
  keyTakeaway: { fr: string; en: string };
}

export const CvsJavaView: React.FC = () => {
  const { language, setRoute, setSelectedChapterId } = useJavaStore();
  const [selectedTopicId, setSelectedTopicId] = useState<string>('pointers');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const topics: ComparisonTopic[] = [
    {
      id: 'pointers',
      title: {
        fr: '1. Pointeurs C vs Références Java',
        en: '1. C Pointers vs Java References'
      },
      icon: 'Cpu',
      cCode: `// En C: Pointeur brut avec adresse physique
int x = 42;
int *ptr = &x; // Adresse en RAM
ptr++; // Arithmétique de pointeur!
*ptr = 99; // DANGER: Risque de crash ou corruption`,
      javaCode: `// En Java: Référence managée & sécurisée
Integer ref = Integer.valueOf(42);
// ref++; IMPOSSIBLE: Pas d'arithmétique!
// Les adresses sont opaques et contrôlées par la JVM`,
      cExplanation: {
        fr: "En C, un pointeur est une adresse numérique brute en mémoire vive. On peut le décaler, lire n'importe où et provoquer un crash immédiat (Segmentation Fault).",
        en: "In C, pointers represent raw memory addresses. Pointer arithmetic can corrupt arbitrary RAM addresses causing instant segfaults."
      },
      javaExplanation: {
        fr: "En Java, les variables d'objets sont des 'Références': des pointeurs opaques que le développeur ne peut pas manipuler directement. Aucune arithmétique de pointeur n'est permise.",
        en: "In Java, object variables are opaque managed references. The JVM prevents direct memory tampering and arithmetic."
      },
      memoryModel: {
        fr: "C: Accès direct aux octets de la RAM. Java: La JVM gère une table d'adresses compressées (Compressed OOPs) avec vérification de bornes garantie.",
        en: "C: Direct unconstrained RAM byte access. Java: Sandboxed runtime with bounds verification and Compressed OOPs."
      },
      keyTakeaway: {
        fr: "Java élimine 90% des vulnérabilités de sécurité mémoire (Buffer Overflow, Dangling Pointer) qui affectent le C.",
        en: "Java eliminates over 90% of memory safety vulnerabilities (Buffer Overflows, Dangling Pointers) common in C."
      }
    },
    {
      id: 'memory',
      title: {
        fr: '2. malloc/free vs Garbage Collector',
        en: '2. malloc/free vs Garbage Collector'
      },
      icon: 'Layers',
      cCode: `// En C: Allocation manuelle sur le Tas
char *buf = (char*)malloc(1024);
// Si on oublie free() -> Fuite mémoire!
// Si on appelle free() 2 fois -> Double-free crash!
free(buf);`,
      javaCode: `// En Java: Allocation automatique avec 'new'
byte[] buf = new byte[1024];
// Pas de free() ! Le Garbage Collector (ZGC / G1)
// détecte automatiquement quand buf n'est plus utilisé.`,
      cExplanation: {
        fr: "En C, chaque malloc() exige rigoureusement un free() au bon moment. Les fuites mémoire et les accès après libération (Use-After-Free) sont monnaie courante.",
        en: "In C, every malloc() requires exactly one matching free(). Memory leaks and Use-After-Free bugs are notorious pitfalls."
      },
      javaExplanation: {
        fr: "En Java, 'new' alloue sur le Tas, et le ramasse-miettes (Garbage Collector) balaie périodiquement les objets inaccessibles sans intervention humaine.",
        en: "In Java, 'new' allocates on Heap while the GC scans roots and reclaims unreferenced memory autonomously."
      },
      memoryModel: {
        fr: "C: Tas géré manuellement par glibc ptmalloc. Java: Tas générationnel (Eden, Survivor, Old Gen) avec compactage automatique.",
        en: "C: Manual heap management via ptmalloc. Java: Generational Heap (Eden, Survivor, Tenured) with automatic compaction."
      },
      keyTakeaway: {
        fr: "La gestion automatique de mémoire libère le développeur de la gestion manuelle des cycles de vie d'objets.",
        en: "Automatic memory reclamation frees developers from tracking intricate object lifecycles."
      }
    },
    {
      id: 'strings',
      title: {
        fr: '3. Chaînes: char[] C vs Java String',
        en: '3. Strings: C char[] vs Java String'
      },
      icon: 'ShieldCheck',
      cCode: `// En C: Tableau d'octets terminé par '\\0'
char str[6] = "Hello"; // 5 lettres + '\\0'
// Si le '\\0' est écrasé, strlen() lit jusqu'au crash!
strcpy(str, "World");`,
      javaCode: `// En Java: Objet immuable + String Pool
String str = "Hello";
// str[0] = 'h'; // IMPOSSIBLE: String est immuable!
// Les chaînes identiques partagent la même mémoire dans le Pool.`,
      cExplanation: {
        fr: "En C, une chaîne est un buffer dépendant d'un octet nul terminal '\\0'. Un dépassement de buffer écrase la mémoire adjacente.",
        en: "In C, strings depend on a terminal '\\0' byte. Buffer overflows overwrite adjacent stack or heap memory."
      },
      javaExplanation: {
        fr: "En Java, String est un objet immuable (thread-safe). Deux littéraux identiques partagent la même adresse mémoire grâce au String Constant Pool.",
        en: "In Java, String is an immutable, thread-safe object. Identical string literals are interned in the String Pool."
      },
      memoryModel: {
        fr: "C: Mémoire brute contiguë non protégée. Java: En-tête d'objet (12 octets) + tableau byte[] compact (Latin-1 ou UTF-16) + hash mis en cache.",
        en: "C: Unchecked raw byte buffer. Java: 12-byte Object Header + compact byte array + cached hashcode."
      },
      keyTakeaway: {
        fr: "L'immutabilité des Strings en Java garantit la sécurité des identifiants, URLs et clés de dictionnaires.",
        en: "String immutability ensures security for credentials, file paths, and hashmap keys."
      }
    },
    {
      id: 'oop',
      title: {
        fr: '4. struct C vs Classes & Encapsulation',
        en: '4. C structs vs Classes & Encapsulation'
      },
      icon: 'SplitSquareVertical',
      cCode: `// En C: Données publiques sans méthodes
struct User {
    char name[32];
    int age;
};

void setAge(struct User *u, int age) {
    if (age > 0) u->age = age;
}`,
      javaCode: `// En Java: Encapsulation stricte
public class User {
    private String name; // Masqué
    private int age;

    public void setAge(int age) {
        if (age > 0) this.age = age;
    }
}`,
      cExplanation: {
        fr: "En C, les structures sont de simples agrégats de mémoire ouverte. N'importe quelle partie du code peut modifier les champs directement.",
        en: "In C, structs are open public memory layouts. Any function can directly mutate fields."
      },
      javaExplanation: {
        fr: "En Java, l'encapsulation via 'private' protège l'état interne de l'objet et oblige à passer par des méthodes validant les règles métier.",
        en: "In Java, 'private' encapsulation shields state and enforces business invariants through validated methods."
      },
      memoryModel: {
        fr: "C: Alignement binaire direct des membres (padding). Java: Objet avec Klass Pointer pointant vers le Metaspace pour les métadonnées et méthodes.",
        en: "C: Strict struct padding alignment. Java: Heap instance linked via Klass Pointer to Metaspace class metadata."
      },
      keyTakeaway: {
        fr: "Les classes Java unissent l'état et le comportement pour un code maintenable et découplé.",
        en: "Java classes combine state and behavior into cohesive, maintainable modules."
      }
    },
    {
      id: 'dispatch',
      title: {
        fr: '5. Pointeurs de Fonction vs Polymorphisme VTable',
        en: '5. Function Pointers vs VTable Dynamic Dispatch'
      },
      icon: 'Cpu',
      cCode: `// En C: Table manuelle de pointeurs de fonction
typedef struct Animal {
    void (*speak)(void);
} Animal;

void dog_speak() { printf("Woof!\\n"); }
Animal dog = { .speak = dog_speak };
dog.speak();`,
      javaCode: `// En Java: Polymorphisme automatique (VTable)
abstract class Animal {
    abstract void speak();
}
class Dog extends Animal {
    void speak() { System.out.println("Woof!"); }
}
Animal a = new Dog();
a.speak(); // invokevirtual automatique`,
      cExplanation: {
        fr: "En C, simuler le polymorphisme exige d'allouer et câbler manuellement des pointeurs de fonctions dans chaque instance de struct.",
        en: "In C, polymorphism requires tedious manual wiring of function pointer tables."
      },
      javaExplanation: {
        fr: "En Java, toutes les méthodes sont virtuelles par défaut. La JVM utilise l'instruction 'invokevirtual' pour inspecter la VTable à l'exécution.",
        en: "In Java, methods are virtual by default. The JVM uses 'invokevirtual' to resolve overrides via the class VTable."
      },
      memoryModel: {
        fr: "C: Pointeur de fonction stocké dans chaque struct (coût mémoire élevé). Java: VTable unique par classe hébergée dans le Metaspace.",
        en: "C: Function pointers replicated in each struct instance. Java: Single shared VTable per class in Metaspace."
      },
      keyTakeaway: {
        fr: "Le polymorphisme Java est transparent et optimisé à la volée par le JIT (Method Inlining).",
        en: "Java polymorphism is clean, type-safe, and JIT-optimized at runtime."
      }
    },
    {
      id: 'compilation',
      title: {
        fr: '6. Compilation Machine vs Bytecode & JIT',
        en: '6. Native Binary vs Bytecode & JIT'
      },
      icon: 'AlertTriangle',
      cCode: `// Compilation C:
// gcc -O2 main.c -o myapp
// -> Binaire natif x86-64 ou ARM (spécifique à l'OS)`,
      javaCode: `// Compilation Java:
// javac Main.java -> Main.class (Bytecode portable)
// java Main -> La JVM exécute et JIT-compile à chaud`,
      cExplanation: {
        fr: "Le C produit un binaire dépendant de l'architecture matérielle et de l'OS. Impossible d'exécuter un binaire Linux x86 sur Windows ARM sans le recompiler.",
        en: "C binaries target a specific CPU and OS. An x86 Linux binary will not execute on Windows ARM without recompilation."
      },
      javaExplanation: {
        fr: "Java compile vers un langage machine virtuel (Bytecode). N'importe quelle machine dotée d'une JVM (serveur, PC, Android) l'exécute immédiatement.",
        en: "Java compiles into virtual machine Bytecode (.class) that executes on any platform hosting a JVM."
      },
      memoryModel: {
        fr: "C: Chargé directement dans la mémoire de l'OS (ELF/PE). Java: Chargé dans le Metaspace de la JVM avec vérification stricte du bytecode.",
        en: "C: Direct OS memory layout (text/data/bss). Java: JVM Metaspace loading with bytecode verifier security."
      },
      keyTakeaway: {
        fr: "'Write Once, Run Anywhere': Le JIT compiler égalise ou surpasse souvent les performances du C grâce au profilage en temps réel.",
        en: "'Write Once, Run Anywhere': JIT dynamic profiling frequently matches or beats native code through adaptive optimization."
      }
    },
    {
      id: 'nested',
      title: {
        fr: '7. Structs Imbriquées C vs Nested Classes Java',
        en: '7. C Nested Structs vs Java Nested Classes'
      },
      icon: 'SplitSquareVertical',
      cCode: `// En C: Struct imbriquée sans lien parent implicite
struct Outer {
    int id;
    struct Inner { // Simple struct, 0 pointeur caché
        int value;
    } helper;
};
// Pour lier au parent, il FAUT un pointeur manuel:
struct LinkedInner {
    struct Outer *parent; // Manuel!
};`,
      javaCode: `// En Java: Static Nested vs Inner Class
public class Outer {
    int id;
    // Static Nested: Indépendante, 0 lien mémoire
    public static class StaticNested { int val; }

    // Inner Class: POINTEUR CACHÉ this$0 INJECTÉ !
    public class Inner {
        void print() { System.out.println(id); } // Outer.this.id
    }
}`,
      cExplanation: {
        fr: "En C, imbriquer une struct n'est qu'une question de portée de nom ou de composition mémoire contiguë. Aucun pointeur vers la struct englobante n'est jamais créé en secret.",
        en: "In C, nesting a struct is purely naming scope or byte composition. Zero hidden pointers to parent structs are ever created."
      },
      javaExplanation: {
        fr: "En Java, 'class Inner' (non-statique) contient secrètement un champ 'final Outer this$0;'. Si l'instance Inner survit, l'instance Outer entière est retenue en RAM, risquant un Memory Leak !",
        en: "In Java, non-static 'class Inner' silently receives a synthetic field 'final Outer this$0;'. If the inner instance outlives the outer, the entire outer instance is leaked in Heap!"
      },
      memoryModel: {
        fr: "C: Composition mémoire plate ou pointeur explicite. Java: Graphe de références avec pointeur synthétique this$0 sur le Tas pour chaque instance d'Inner Class.",
        en: "C: Flat memory layout or explicit pointer. Java: Reference graph holding compiler-injected this$0 pointers on Heap."
      },
      keyTakeaway: {
        fr: "En Java, préférez TOUJOURS 'static class' pour vos classes imbriquées sauf si vous devez impérativement accéder aux champs d'instance de la classe parente.",
        en: "In Java, ALWAYS prefer 'static class' for nested classes unless accessing outer instance state is strictly mandatory."
      }
    }
  ];

  const currentTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <SplitSquareVertical className="w-4 h-4" />
              <span>{language === 'fr' ? 'Pierre de Rosette C & Java' : 'C & Java Rosetta Stone'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {language === 'fr' ? 'Comprendre Java à travers le Prisme du C' : 'Understanding Java Through the Lens of C'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              {language === 'fr'
                ? 'Comme dans Babel-IT, visualisez comment les mécanismes bas-niveau du C (pointeurs, malloc, struct) sont réinventés et sécurisés par la JVM en Java.'
                : 'As in Babel-IT, discover how low-level C concepts (pointers, malloc, structs) are transformed and memory-hardened in Java.'}
            </p>
          </div>
        </div>
      </div>

      {/* Topic Switcher Pills */}
      <div className="flex flex-wrap gap-2">
        {topics.map((t) => {
          const active = t.id === currentTopic.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTopicId(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
                active
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{t.title[language]}</span>
            </button>
          );
        })}
      </div>

      {/* Side-by-Side Comparative Code Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* C Code Box */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
          <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs font-mono font-bold text-blue-400">Langage C (Bas-Niveau / Manuel)</span>
            </div>
            <button
              onClick={() => copyToClipboard(currentTopic.cCode, 'c')}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-all"
              title="Copier le code C"
            >
              {copiedCode === 'c' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="p-5 font-mono text-xs overflow-x-auto bg-slate-950/70 text-slate-200 leading-relaxed">
            <pre>{currentTopic.cCode}</pre>
          </div>

          <div className="p-5 bg-slate-950/90 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
              {language === 'fr' ? 'Fonctionnement en C' : 'Mechanics in C'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {currentTopic.cExplanation[language]}
            </p>
          </div>
        </div>

        {/* Java Code Box */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
          <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-xs font-mono font-bold text-amber-400">Langage Java (Managé / Sécurisé)</span>
            </div>
            <button
              onClick={() => copyToClipboard(currentTopic.javaCode, 'java')}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-all"
              title="Copier le code Java"
            >
              {copiedCode === 'java' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="p-5 font-mono text-xs overflow-x-auto bg-slate-950/70 text-amber-200 leading-relaxed">
            <pre>{currentTopic.javaCode}</pre>
          </div>

          <div className="p-5 bg-slate-950/90 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {language === 'fr' ? 'Fonctionnement en Java' : 'Mechanics in Java'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {currentTopic.javaExplanation[language]}
            </p>
          </div>
        </div>
      </div>

      {/* Memory Model & Architecture Deep Dive Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Cpu className="w-4 h-4" />
            <span>{language === 'fr' ? 'Différence d\'Architecture Mémoire' : 'Memory Architecture Difference'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentTopic.memoryModel[language]}
          </p>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'fr' ? 'Point Clé à Retenir' : 'Key Pedagogical Takeaway'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentTopic.keyTakeaway[language]}
          </p>
        </div>
      </div>

      {/* Interactive Quick-Jump Link */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent p-5 rounded-2xl border border-amber-500/20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">
            {language === 'fr' ? 'Envie d\'observer l\'exécution en direct ?' : 'Want to observe live execution?'}
          </h4>
          <p className="text-xs text-slate-300 mt-0.5">
            {language === 'fr'
              ? 'Lancez le débogueur pas-à-pas pour suivre la pile et le tas en temps réel.'
              : 'Launch the step-by-step debugger to trace stack and heap in real time.'}
          </p>
        </div>

        <button
          onClick={() => setRoute('stepper')}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
        >
          <span>{language === 'fr' ? 'Ouvrir le Débogueur Pas-à-Pas' : 'Open Step Debugger'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
