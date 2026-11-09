import React, { useState } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { 
  Shield, 
  Cpu, 
  Layers, 
  Binary, 
  Lock, 
  Unlock, 
  Users, 
  Database, 
  SplitSquareVertical, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Zap,
  Boxes
} from 'lucide-react';

export const ModifiersView: React.FC = () => {
  const { language } = useJavaStore();

  const [activeTab, setActiveTab] = useState<'static_vs_instance' | 'visibility' | 'cvsjava'>('static_vs_instance');
  const [instanceCount, setInstanceCount] = useState<number>(100);
  const [selectedAccessModifier, setSelectedAccessModifier] = useState<'private' | 'default' | 'protected' | 'public'>('private');

  // Memory calculation for static vs instance
  const primitiveFieldBytes = 4; // int 32-bit
  const objectHeaderBytes = 16;  // Mark word (8) + Klass word (4/8) + padding
  const totalInstanceMemoryBytes = instanceCount * (objectHeaderBytes + primitiveFieldBytes);
  const totalStaticMemoryBytes = primitiveFieldBytes; // exactly 1 in Metaspace/Class mirror

  const accessModifiersData = {
    private: {
      flag: 'ACC_PRIVATE (0x0002)',
      opcode: 'invokespecial',
      vtable: 'Non (Lié statiquement à la classe, pas de slot VTable)',
      sameClass: true,
      samePackage: false,
      subclassDiffPackage: false,
      world: false,
      desc: {
        fr: 'Strictement confiné à la classe déclarante. Le bytecode utilise "invokespecial" et la méthode NE PEUT PAS être surchargée (@Override impossible).',
        en: 'Strictly confined to the declaring class. Uses "invokespecial" opcode; cannot be overridden (no VTable slot).'
      }
    },
    default: {
      flag: 'ACC_PACKAGE (0x0000 - aucun mot-clé)',
      opcode: 'invokevirtual',
      vtable: 'Oui (Visibilité limitée au package)',
      sameClass: true,
      samePackage: true,
      subclassDiffPackage: false,
      world: false,
      desc: {
        fr: 'Visibilité "Package-Private" (défaut). Accessible par toutes les classes du même package, mais invisible en dehors, même pour les classes filles.',
        en: 'Package-private visibility. Accessible by all classes within the same package, but hidden from outside packages including subclasses.'
      }
    },
    protected: {
      flag: 'ACC_PROTECTED (0x0004)',
      opcode: 'invokevirtual',
      vtable: 'Oui (Résolution dynamique VTable)',
      sameClass: true,
      samePackage: true,
      subclassDiffPackage: true,
      world: false,
      desc: {
        fr: 'Accessible au sein du même package ET par héritage dans les sous-classes situées dans d\'autres packages. Enregistré dans la VTable pour le polymorphisme.',
        en: 'Accessible within the same package AND through inheritance in subclasses located in foreign packages. Present in VTable.'
      }
    },
    public: {
      flag: 'ACC_PUBLIC (0x0001)',
      opcode: 'invokevirtual',
      vtable: 'Oui (Résolution dynamique VTable)',
      sameClass: true,
      samePackage: true,
      subclassDiffPackage: true,
      world: true,
      desc: {
        fr: 'Visibilité universelle. Accessible depuis n\'importe quel package ou module de l\'application.',
        en: 'Universal visibility across all packages and modules.'
      }
    }
  };

  const currentMod = accessModifiersData[selectedAccessModifier];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4" />
            <span>{language === 'fr' ? 'Architecture Mémoire, Compilation & Opcodes' : 'Memory Model, Compilation & Opcodes'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {language === 'fr' ? 'Champs & Méthodes : static, private, protected, public' : 'Fields & Methods: static, private, protected, public'}
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            {language === 'fr'
              ? 'Démystifiez les différences profondes : allocation mémoire (Tas vs Metaspace Class Mirror), opcodes de bytecode (invokestatic, invokespecial, invokevirtual, getstatic vs getfield), présence du pointeur "this" et vérification de sécurité par la JVM.'
              : 'Demystify the deep differences: memory allocation (Heap vs Metaspace Class Mirror), bytecode opcodes (invokestatic vs invokespecial vs invokevirtual), the "this" pointer, and JVM runtime access verification.'}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('static_vs_instance')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
            activeTab === 'static_vs_instance'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>{language === 'fr' ? '1. static vs instance (Mémoire & Opcodes)' : '1. static vs instance (Memory & Opcodes)'}</span>
        </button>

        <button
          onClick={() => setActiveTab('visibility')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
            activeTab === 'visibility'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>{language === 'fr' ? '2. private, protected, public & VTable' : '2. private, protected, public & VTable'}</span>
        </button>

        <button
          onClick={() => setActiveTab('cvsjava')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
            activeTab === 'cvsjava'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <SplitSquareVertical className="w-4 h-4" />
          <span>{language === 'fr' ? '3. Comparaison C vs C++ vs Java' : '3. C vs C++ vs Java Comparison'}</span>
        </button>
      </div>

      {/* TAB 1: static vs instance */}
      {activeTab === 'static_vs_instance' && (
        <div className="space-y-6">
          {/* Interactive Memory Consumption Simulator */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Database className="w-5 h-5 text-amber-400" />
                  <span>{language === 'fr' ? 'Simulateur d\'Empreinte Mémoire : 1 Variable Partagée vs N Réplications' : 'Memory Footprint Simulator: 1 Shared vs N Instances'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'fr'
                    ? 'Observez comment un champ static n\'occupe qu\'un seul emplacement en mémoire, alors qu\'un champ d\'instance est dupliqué dans chaque objet du Tas.'
                    : 'Observe how static fields consume a single memory slot, whereas instance fields multiply across every Heap object.'}
                </p>
              </div>

              {/* Multiplier Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-mono">Nombre d'instances :</span>
                {[1, 10, 100, 1000, 5000].map((count) => (
                  <button
                    key={count}
                    onClick={() => setInstanceCount(count)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      instanceCount === count
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* KPI Cards Comparing Static vs Instance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Static Field Memory Card */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    static int sharedCount;
                  </span>
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                    1 Seule Copie Globale
                  </span>
                </div>

                <div className="text-2xl font-black text-white font-mono">
                  {totalStaticMemoryBytes} octets
                  <span className="text-xs text-slate-500 font-normal block mt-1">
                    Logé dans l'objet java.lang.Class (Class Mirror / Metaspace)
                  </span>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-1">
                  <p>• Initialisé au chargement de la classe lors de l'exécution de <code>&lt;clinit&gt;</code>.</p>
                  <p>• Partagé entre tous les threads et toutes les instances de l'application.</p>
                  <p>• Accédé en Bytecode via les opcodes <code>getstatic</code> et <code>putstatic</code> (aucun objet sur la pile).</p>
                </div>
              </div>

              {/* Instance Field Memory Card */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                    int instanceScore; ({instanceCount} objets)
                  </span>
                  <span className="text-[10px] bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                    Dupliqué x{instanceCount} sur le Tas
                  </span>
                </div>

                <div className="text-2xl font-black text-amber-400 font-mono">
                  {(totalInstanceMemoryBytes / 1024).toFixed(1)} Ko ({totalInstanceMemoryBytes.toLocaleString()} octets)
                  <span className="text-xs text-slate-500 font-normal block mt-1">
                    {instanceCount} x (16 octets d'Object Header + 4 octets de champ)
                  </span>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-1">
                  <p>• Initialisé à chaque appel de constructeur <code>new</code> (<code>&lt;init&gt;</code>).</p>
                  <p>• Chaque objet possède son propre état indépendant sur le Tas (Heap).</p>
                  <p>• Accédé en Bytecode via <code>getfield</code> et <code>putfield</code> (nécessite le pointeur <code>this</code> sur la pile).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Static vs Instance Methods & The "this" Pointer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Méthode Statique (static method)</span>
              </h4>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300">
                public static int add(int a, int b) &#123; return a + b; &#125;
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <li>• <strong>Opcode Bytecode :</strong> Invoqué avec <code>invokestatic</code>.</li>
                <li>• <strong>Table des variables locales :</strong> Le <strong>Slot 0</strong> contient le 1er argument (<code>a</code>). <strong>IL N'Y A AUCUN POINTEUR "this" !</strong></li>
                <li>• <strong>Polymorphisme :</strong> ❌ Aucun polymorphisme possible. La liaison est faite à la compilation. Pas d'entrée dans la VTable.</li>
              </ul>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Boxes className="w-4 h-4 text-amber-400" />
                <span>Méthode d'Instance (instance method)</span>
              </h4>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-amber-300">
                public int compute(int x) &#123; return this.score + x; &#125;
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <li>• <strong>Opcode Bytecode :</strong> Invoqué avec <code>invokevirtual</code> (ou <code>invokeinterface</code>).</li>
                <li>• <strong>Table des variables locales :</strong> Le <strong>Slot 0 est TOUJOURS "this"</strong> (pointeur vers l'instance sur le Tas). Le 1er argument (<code>x</code>) commence au Slot 1.</li>
                <li>• <strong>Polymorphisme :</strong> ✔️ Résolu dynamiquement à l'exécution via la VTable dans le Metaspace.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: private, package, protected, public */}
      {activeTab === 'visibility' && (
        <div className="space-y-6">
          {/* Access Modifier Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['private', 'default', 'protected', 'public'] as const).map((mod) => {
              const active = mod === selectedAccessModifier;
              return (
                <button
                  key={mod}
                  onClick={() => setSelectedAccessModifier(mod)}
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    active
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-mono text-sm block capitalize">{mod}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{accessModifiersData[mod].flag.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Deep-Dive Card on Selected Modifier */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-mono">Modificateur Sélectionné :</span>
                <h3 className="text-xl font-black text-white font-mono capitalize">{selectedAccessModifier}</h3>
              </div>
              <span className="text-xs font-mono bg-slate-950 text-amber-400 px-3 py-1 rounded-full border border-slate-800">
                {currentMod.flag}
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {currentMod.desc[language]}
            </p>

            {/* Matrix of Visibility */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {language === 'fr' ? 'Matrice d\'Accessibilité & Portée' : 'Scope & Accessibility Matrix'}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Même Classe:</span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span>OUI</span>
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Même Package:</span>
                  {currentMod.samePackage ? (
                    <span className="text-emerald-400 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> <span>OUI</span>
                    </span>
                  ) : (
                    <span className="text-red-400 font-bold flex items-center space-x-1">
                      <XCircle className="w-3.5 h-3.5" /> <span>NON</span>
                    </span>
                  )}
                </div>

                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Sous-Classe (Autre Pkg):</span>
                  {currentMod.subclassDiffPackage ? (
                    <span className="text-emerald-400 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> <span>OUI</span>
                    </span>
                  ) : (
                    <span className="text-red-400 font-bold flex items-center space-x-1">
                      <XCircle className="w-3.5 h-3.5" /> <span>NON</span>
                    </span>
                  )}
                </div>

                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Monde Extérieur:</span>
                  {currentMod.world ? (
                    <span className="text-emerald-400 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> <span>OUI</span>
                    </span>
                  ) : (
                    <span className="text-red-400 font-bold flex items-center space-x-1">
                      <XCircle className="w-3.5 h-3.5" /> <span>NON</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Compilation & Bytecode Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Opcode d'Invocation :</span>
                <span className="text-amber-300 font-bold text-sm">{currentMod.opcode}</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Présence dans la VTable Metaspace :</span>
                <span className="text-white font-bold text-sm">{currentMod.vtable}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: C vs C++ vs Java */}
      {activeTab === 'cvsjava' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center space-x-2">
              <SplitSquareVertical className="w-4 h-4" />
              <span>En Langage C</span>
            </h4>
            <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-2">
              <p>• <strong>Aucun modificateur d'accès :</strong> <code>private</code> et <code>protected</code> n'existent pas. Si vous connaissez l'adresse mémoire d'une struct, tout est accessible.</p>
              <p>• <strong>static :</strong> En C, <code>static</code> a deux sens :
                <br />1. Sur une variable/fonction globale : réduit sa visibilité au fichier actuel (<em>internal linkage</em>).
                <br />2. Sur une variable locale : conserve sa valeur en mémoire <code>.data</code> ou <code>.bss</code> entre les appels de fonction.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-2">
              <Cpu className="w-4 h-4" />
              <span>En Langage C++</span>
            </h4>
            <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-2">
              <p>• <strong>private / protected :</strong> Vérifiés <strong>uniquement à la compilation</strong>. Le binaire final ne stocke aucune métadonnée de protection.</p>
              <p>• <strong>Piratage mémoire :</strong> Un cast de pointeur brut <code>*(int*)((char*)obj + 4)</code> permet de lire et modifier un champ <code>private</code> directement en RAM sans aucune erreur !</p>
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>En Langage Java (JVM)</span>
            </h4>
            <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-2">
              <p>• <strong>Vérification à l'Exécution :</strong> Le <em>Bytecode Verifier</em> de la JVM contrôle rigoureusement chaque <code>access_flags</code>.</p>
              <p>• <strong>Sécurité Absolue :</strong> Tenter d'accéder à un membre <code>private</code> depuis une autre classe en manipulant le bytecode déclenche immédiatement une <code>IllegalAccessError</code> à l'exécution.</p>
              <p>• <strong>Nestmates (Java 11+) :</strong> Élimine les méthodes pont synthétiques <code>access$000</code> entre classes imbriquées.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
