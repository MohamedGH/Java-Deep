import React, { useState } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { 
  Layers, 
  Cpu, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  SplitSquareVertical, 
  RotateCcw,
  Sparkles,
  HelpCircle,
  Binary
} from 'lucide-react';

interface VTableSlot {
  slot: number;
  methodName: string;
  declaringClass: string;
  codeAddress: string;
  isOverridden: boolean;
}

export const VTableView: React.FC = () => {
  const { language } = useJavaStore();

  const [selectedShape, setSelectedShape] = useState<'circle' | 'rectangle'>('circle');
  const [dispatchStep, setDispatchStep] = useState<number>(0);
  const [callCount, setCallCount] = useState<number>(1);

  // VTable definitions in Metaspace for Circle vs Rectangle
  const vtables: Record<'circle' | 'rectangle', VTableSlot[]> = {
    circle: [
      { slot: 0, methodName: 'hashCode()', declaringClass: 'java.lang.Object', codeAddress: '@0xOBJ_HASH', isOverridden: false },
      { slot: 1, methodName: 'equals(Object)', declaringClass: 'java.lang.Object', codeAddress: '@0xOBJ_EQUALS', isOverridden: false },
      { slot: 2, methodName: 'toString()', declaringClass: 'java.lang.Object', codeAddress: '@0xOBJ_TOSTRING', isOverridden: false },
      { slot: 3, methodName: 'area()', declaringClass: 'Shape -> Circle', codeAddress: '@0xCIRC_AREA', isOverridden: true },
      { slot: 4, methodName: 'draw()', declaringClass: 'Shape -> Circle', codeAddress: '@0xCIRC_DRAW', isOverridden: true },
      { slot: 5, methodName: 'getRadius()', declaringClass: 'Circle', codeAddress: '@0xCIRC_RADIUS', isOverridden: false }
    ],
    rectangle: [
      { slot: 0, methodName: 'hashCode()', declaringClass: 'java.lang.Object', codeAddress: '@0xOBJ_HASH', isOverridden: false },
      { slot: 1, methodName: 'equals(Object)', declaringClass: 'java.lang.Object', codeAddress: '@0xOBJ_EQUALS', isOverridden: false },
      { slot: 2, methodName: 'toString()', declaringClass: 'java.lang.Object', codeAddress: '@0xOBJ_TOSTRING', isOverridden: false },
      { slot: 3, methodName: 'area()', declaringClass: 'Shape -> Rectangle', codeAddress: '@0xRECT_AREA', isOverridden: true },
      { slot: 4, methodName: 'draw()', declaringClass: 'Shape -> Rectangle', codeAddress: '@0xRECT_DRAW', isOverridden: true },
      { slot: 5, methodName: 'getPerimeter()', declaringClass: 'Rectangle', codeAddress: '@0xRECT_PERIM', isOverridden: false }
    ]
  };

  const currentVTable = vtables[selectedShape];

  // JIT Inline Caching status based on calls
  const getJitStatus = () => {
    if (callCount < 5) return { status: 'Interpreter / C1', color: 'text-amber-400', desc: { fr: 'Résolution normale via consultation VTable', en: 'Standard VTable lookup' } };
    if (selectedShape === 'circle') return { status: 'JIT Monomorphic Inlined (C2)', color: 'text-emerald-400', desc: { fr: 'VTable éliminée ! Code machine de Circle.area() inliné directement', en: 'VTable bypassed! Circle.area() machine code inlined directly' } };
    return { status: 'Bimorphic Inline Cache', color: 'text-blue-400', desc: { fr: 'Guard check: if (klass == Circle) ... else ...', en: 'Guard check: if (klass == Circle) ... else ...' } };
  };

  const jitInfo = getJitStatus();

  const handleSimulateInvokeVirtual = () => {
    setDispatchStep(1);
    setTimeout(() => setDispatchStep(2), 600);
    setTimeout(() => setDispatchStep(3), 1200);
    setTimeout(() => {
      setDispatchStep(4);
      setCallCount((prev) => prev + 1);
    }, 1800);
  };

  const handleReset = () => {
    setDispatchStep(0);
    setCallCount(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4" />
              <span>{language === 'fr' ? 'Polymorphisme & Mécanique Interne JVM' : 'Polymorphism & JVM Internals'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {language === 'fr' ? 'La VTable (Virtual Method Table) & invokevirtual' : 'The VTable (Virtual Method Table) & invokevirtual'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              {language === 'fr'
                ? 'Comprenez comment la JVM résout les méthodes polymorphes à l\'exécution: l\'en-tête d\'objet (Klass Pointer), la table des méthodes virtuelles dans le Metaspace, et l\'optimisation d\'inlining du compilateur JIT.'
                : 'Understand how the JVM resolves virtual methods at runtime: object headers (Klass Pointer), Metaspace VTables, and JIT devirtualization.'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSimulateInvokeVirtual}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
            >
              <Zap className="w-4 h-4" />
              <span>{language === 'fr' ? 'Simuler invokevirtual' : 'Simulate invokevirtual'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Shape Selector */}
      <div className="flex flex-wrap items-center justify-between bg-slate-900/90 p-4 rounded-2xl border border-slate-800 gap-4">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-slate-400">
            {language === 'fr' ? 'Instance polymorphe assignée :' : 'Assigned dynamic instance:'}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => { setSelectedShape('circle'); setDispatchStep(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedShape === 'circle'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-300 border border-slate-800'
              }`}
            >
              Shape s = new Circle();
            </button>

            <button
              onClick={() => { setSelectedShape('rectangle'); setDispatchStep(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedShape === 'rectangle'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-300 border border-slate-800'
              }`}
            >
              Shape s = new Rectangle();
            </button>
          </div>
        </div>

        {/* JIT Status Badge */}
        <div className="flex items-center space-x-2 text-xs font-mono bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
          <span className="text-slate-500">JIT State:</span>
          <span className={`font-bold ${jitInfo.color}`}>{jitInfo.status}</span>
        </div>
      </div>

      {/* Main 3-Step Flow Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Thread Stack Variable */}
        <div className={`bg-slate-900/90 rounded-2xl p-5 border transition-all space-y-3 ${
          dispatchStep >= 1 ? 'border-amber-500 shadow-xl ring-1 ring-amber-500/20' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>1. Thread Stack (Variable Locale)</span>
            </div>
            {dispatchStep >= 1 && <span className="text-[11px] text-amber-400 font-semibold">Étape 1</span>}
          </div>

          <p className="text-xs text-slate-400">
            {language === 'fr'
              ? 'La référence locale "shape" réside sur la pile. Son type statique est Shape, mais sa valeur pointe vers le Tas.'
              : 'Local reference variable "shape" lives on stack. Static type is Shape, pointing to Heap.'}
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <div className="text-slate-400">// Cadre: main()</div>
            <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-300 font-semibold">Shape shape</span>
              <span className="text-amber-400 font-bold">
                {selectedShape === 'circle' ? '@0xHEAP_CIRC' : '@0xHEAP_RECT'}
              </span>
            </div>
          </div>
        </div>

        {/* Step 2: Heap Object Header & Klass Pointer */}
        <div className={`bg-slate-900/90 rounded-2xl p-5 border transition-all space-y-3 ${
          dispatchStep >= 2 ? 'border-amber-500 shadow-xl ring-1 ring-amber-500/20' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>2. Tas (Object Header & Klass Word)</span>
            </div>
            {dispatchStep >= 2 && <span className="text-[11px] text-emerald-400 font-semibold">Étape 2</span>}
          </div>

          <p className="text-xs text-slate-400">
            {language === 'fr'
              ? 'L\'objet sur le Tas contient un en-tête avec le Klass Pointer qui référence la classe dans le Metaspace.'
              : 'Heap object header contains the Klass Pointer addressing Metaspace metadata.'}
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Adresse: {selectedShape === 'circle' ? '@0xHEAP_CIRC' : '@0xHEAP_RECT'}</span>
              <span>16 octets</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800 text-[11px] text-slate-300">
              [Mark Word: HashCode=9412, Age=1, Lock=None]
            </div>
            <div className="bg-emerald-950/40 p-2 rounded border border-emerald-500/40 text-[11px] text-emerald-300 font-bold flex justify-between">
              <span>Klass Word:</span>
              <span>{selectedShape === 'circle' ? '➔ Circle.class (Metaspace)' : '➔ Rectangle.class (Metaspace)'}</span>
            </div>
          </div>
        </div>

        {/* Step 3: Metaspace VTable Lookup */}
        <div className={`bg-slate-900/90 rounded-2xl p-5 border transition-all space-y-3 ${
          dispatchStep >= 3 ? 'border-amber-500 shadow-xl ring-1 ring-amber-500/20' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Binary className="w-4 h-4" />
              <span>3. Metaspace VTable (Résolution)</span>
            </div>
            {dispatchStep >= 3 && <span className="text-[11px] text-blue-400 font-semibold">Étape 3</span>}
          </div>

          <p className="text-xs text-slate-400">
            {language === 'fr'
              ? 'invokevirtual consulte l\'index fixe du slot dans la VTable et saute vers l\'adresse de la méthode surchargée.'
              : 'invokevirtual indexes the fixed vtable slot, jumping to the target machine code.'}
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>Opcode:</span>
              <span className="text-amber-400 font-bold">invokevirtual #Slot 3 (area)</span>
            </div>
            <div className="bg-blue-950/40 p-2.5 rounded-lg border border-blue-500/40 flex justify-between items-center">
              <span className="text-blue-300 font-bold">vtable[3] =</span>
              <span className="text-amber-300 font-bold font-mono">
                {selectedShape === 'circle' ? '@0xCIRC_AREA' : '@0xRECT_AREA'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full VTable Slot Table View */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>
                {language === 'fr'
                  ? `Table des Méthodes Virtuelles (VTable) de ${selectedShape === 'circle' ? 'Circle.class' : 'Rectangle.class'} dans le Metaspace`
                  : `Virtual Method Table (VTable) of ${selectedShape === 'circle' ? 'Circle.class' : 'Rectangle.class'} in Metaspace`}
              </span>
            </h3>
            <span className="text-xs text-slate-400">
              {language === 'fr'
                ? 'Les méthodes héritées partagent les mêmes index de slot (0 à 2 pour Object, 3 et 4 pour Shape).'
                : 'Inherited methods share identical slot offsets (slots 0-2 for Object, 3-4 for Shape).'}
            </span>
          </div>
          <span className="text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 px-3 py-1 rounded-full">
            Fixed Offset Indexing O(1)
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {currentVTable.map((slot) => {
            const isTarget = slot.slot === 3;
            return (
              <div
                key={slot.slot}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  isTarget && dispatchStep >= 3
                    ? 'bg-amber-500/15 ring-1 ring-inset ring-amber-400/50'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center space-x-4 font-mono text-xs">
                  <span className="text-slate-500 font-bold w-12">Slot {slot.slot}</span>
                  <div className="space-y-0.5">
                    <span className="text-white font-bold text-sm">{slot.methodName}</span>
                    <span className="text-slate-400 block text-[11px] font-sans">Déclaré par: {slot.declaringClass}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-end sm:self-center font-mono text-xs">
                  {slot.isOverridden && (
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-sans font-bold">
                      @Override
                    </span>
                  )}
                  <span className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-amber-300 font-bold">
                    ➔ {slot.codeAddress}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparative Architecture: C vs C++ vs Java VTable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center space-x-2">
            <SplitSquareVertical className="w-4 h-4" />
            <span>En Langage C (Manuel)</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            En C, il n'y a pas d'objets. Le polymorphisme oblige à déclarer manuellement une <code>struct VTable</code> contenant des pointeurs de fonctions et un pointeur <code>vptr</code> dans chaque instance.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-blue-300">
            s-&gt;vptr-&gt;area(s);
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-2">
            <Cpu className="w-4 h-4" />
            <span>En Langage C++ (Compile-time)</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            En C++, les méthodes ne sont virtuelles que si le mot-clé <code>virtual</code> est présent. Chaque objet stocke son <code>vptr</code> dans ses 8 premiers octets. L'héritage multiple nécessite plusieurs VTables et des <em>thunks</em> d'ajustement.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-purple-300">
            virtual double area();
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>En Java (JVM HotSpot & JIT)</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            En Java, <strong>toutes les méthodes non-statiques/privées/finales sont virtuelles par défaut</strong>. Le Klass Pointer dans l'Object Header mène à la VTable du Metaspace. Le JIT optimise en inlinant le code (Monomorphic Call Inlining) pour un coût nul !
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-amber-300">
            invokevirtual ➔ JIT Inlined
          </div>
        </div>
      </div>
    </div>
  );
};
