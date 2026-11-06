import React, { useState } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { 
  Cpu, 
  Layers, 
  Trash2, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Database,
  Binary,
  RotateCw
} from 'lucide-react';

interface HeapObject {
  id: string;
  className: string;
  memoryAddress: string;
  generation: 'eden' | 'survivor' | 'old';
  age: number;
  state: string;
  isGarbage: boolean;
  references?: string[];
}

export const JvmVisualizer: React.FC = () => {
  const { language } = useJavaStore();

  const [stackFrames, setStackFrames] = useState([
    { 
      method: 'main(String[] args)', 
      variables: [
        { name: 'sessionUser', val: '@0x7F9A', isRef: true },
        { name: 'maxRetries', val: '3', isRef: false },
        { name: 'appCache', val: '@0x9E10', isRef: true }
      ] 
    }
  ]);

  const [heapObjects, setHeapObjects] = useState<HeapObject[]>([
    { id: 'obj-1', className: 'UserSession', memoryAddress: '@0x7F9A', generation: 'eden', age: 1, state: 'username="Alex", role="Admin"', isGarbage: false },
    { id: 'obj-2', className: 'ByteArrayOutputStream', memoryAddress: '@0x4B2C', generation: 'eden', age: 0, state: 'buf=[1024 bytes]', isGarbage: true },
    { id: 'obj-3', className: 'ConcurrentHashMap', memoryAddress: '@0x9E10', generation: 'old', age: 15, state: 'size=128, loadFactor=0.75', isGarbage: false },
    { id: 'obj-4', className: 'CustomerRecord', memoryAddress: '@0x3C88', generation: 'survivor', age: 4, state: 'id=9412, status="ACTIVE"', isGarbage: false }
  ]);

  const [stringPool, setStringPool] = useState<string[]>([
    '"Java"', '"Babel"', '"JVM_HOTSPOT"'
  ]);

  const [gcRunning, setGcRunning] = useState(false);
  const [logMessage, setLogMessage] = useState(
    language === 'fr' 
      ? 'Machine Virtuelle Java démarrée. Espaces Eden, Survivor, Tenured et String Pool actifs.' 
      : 'JVM started. Eden, Survivor, Tenured, and String Pool operational.'
  );

  // Allocate new object in Eden
  const allocateObject = () => {
    const randomHex = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    const addr = `@0x${randomHex}`;
    const classes = ['OrderTicket', 'HttpRequest', 'JsonPayload', 'SocketConnection'];
    const selectedClass = classes[Math.floor(Math.random() * classes.length)];

    const newObj: HeapObject = {
      id: 'obj-' + Date.now(),
      className: selectedClass,
      memoryAddress: addr,
      generation: 'eden',
      age: 0,
      state: 'created=' + new Date().toLocaleTimeString(),
      isGarbage: Math.random() > 0.5
    };

    setHeapObjects((prev) => [...prev, newObj]);

    if (!newObj.isGarbage) {
      setStackFrames((prev) => {
        const copy = [...prev];
        copy[0].variables.push({
          name: selectedClass.toLowerCase() + 'Ref',
          val: addr,
          isRef: true
        });
        return copy;
      });
    }

    setLogMessage(
      language === 'fr'
        ? `Nouvel objet [${selectedClass}] alloué dans l'espace Eden à l'adresse ${addr}.`
        : `Allocated new object [${selectedClass}] in Eden space at ${addr}.`
    );
  };

  // Trigger Minor GC (Eden -> Survivor)
  const runMinorGc = () => {
    setGcRunning(true);
    setLogMessage(
      language === 'fr'
        ? 'Minor GC en cours: Balayage de la Young Gen, recyclage des orphelins, promotion des survivants...'
        : 'Minor GC running: Scanning Young Gen, sweeping orphans, promoting survivors...'
    );

    setTimeout(() => {
      setHeapObjects((prev) => {
        return prev
          .filter((obj) => !obj.isGarbage)
          .map((obj) => {
            if (obj.generation === 'eden') {
              return { ...obj, generation: 'survivor', age: obj.age + 1 };
            }
            if (obj.generation === 'survivor') {
              const newAge = obj.age + 1;
              return {
                ...obj,
                age: newAge,
                generation: newAge >= 8 ? 'old' : 'survivor'
              };
            }
            return obj;
          });
      });
      setGcRunning(false);
      setLogMessage(
        language === 'fr'
          ? 'Minor GC terminé ! Objets orphelins effacés d\'Eden, survivants promus dans Survivor/Old Gen.'
          : 'Minor GC finished! Dead objects swept from Eden; survivors aged into Survivor/Old Gen.'
      );
    }, 900);
  };

  // Trigger Full GC
  const runFullGc = () => {
    setGcRunning(true);
    setLogMessage(
      language === 'fr'
        ? 'Full GC (Stop-The-World) invoqué ! Compactage complet de tout le Tas (Young & Old Gen)...'
        : 'Full GC invoked! Compacting entire Heap (Young & Old Gen)...'
    );

    setTimeout(() => {
      setHeapObjects((prev) => prev.filter((obj) => !obj.isGarbage));
      setGcRunning(false);
      setLogMessage(
        language === 'fr'
          ? 'Full GC terminé. Tous les espaces mémoire ont été défragmentés et compactés.'
          : 'Full GC completed. All heap generations compacted and defragmented.'
      );
    }, 1200);
  };

  // Demo: Make an object garbage
  const makeGarbage = () => {
    const liveObjects = heapObjects.filter((o) => !o.isGarbage);
    if (liveObjects.length === 0) return;
    const target = liveObjects[0];

    setHeapObjects((prev) =>
      prev.map((o) => (o.id === target.id ? { ...o, isGarbage: true } : o))
    );

    setStackFrames((prev) => {
      const copy = [...prev];
      copy[0].variables = copy[0].variables.map((v) =>
        v.val === target.memoryAddress ? { ...v, val: 'null (0x0)' } : v
      );
      return copy;
    });

    setLogMessage(
      language === 'fr'
        ? `La référence vers ${target.className} (${target.memoryAddress}) a été mise à null. L'objet est devenu éligible au GC !`
        : `Reference to ${target.className} (${target.memoryAddress}) set to null. Object is now eligible for GC!`
    );
  };

  // Demo: Simulate Inner Class Memory Leak via this$0
  const simulateInnerClassLeak = () => {
    const outerAddr = '@0xOUTER_A1';
    const innerAddr = '@0xINNER_B2';

    const outerObj: HeapObject = {
      id: 'leak-outer-' + Date.now(),
      className: 'ActivityWindow (Outer)',
      memoryAddress: outerAddr,
      generation: 'old',
      age: 10,
      state: 'heavyBitmapData=[4MB], status="CLOSED"',
      isGarbage: false
    };

    const innerObj: HeapObject = {
      id: 'leak-inner-' + Date.now(),
      className: 'ButtonClickListener$1 (Inner)',
      memoryAddress: innerAddr,
      generation: 'old',
      age: 12,
      state: `synthetic this$0 -> ${outerAddr}`,
      isGarbage: false
    };

    setHeapObjects((prev) => [...prev, outerObj, innerObj]);

    // Outer is null on stack, but inner listener is kept in static cache!
    setStackFrames([
      {
        method: 'main(String[] args)',
        variables: [
          { name: 'outerActivity', val: 'null (Fermé)', isRef: true },
          { name: 'staticEventListenerRegistry', val: innerAddr, isRef: true }
        ]
      }
    ]);

    setLogMessage(
      language === 'fr'
        ? `⚠️ FUITE MÉMOIRE DÉTECTÉE: outerActivity est null sur la pile, mais l'objet Outer (${outerAddr}) reste bloqué en RAM car InnerClass (${innerAddr}) le retient via son champ caché this$0 ! Utilisez 'static class' pour corriger.`
        : `⚠️ MEMORY LEAK SIMULATED: outerActivity is null on stack, but Outer (${outerAddr}) is pinned in RAM because InnerClass (${innerAddr}) holds it through synthetic this$0! Fix with 'static class'.`
    );
  };

  // Reset Visualizer
  const resetVisualizer = () => {
    setStackFrames([
      { 
        method: 'main(String[] args)', 
        variables: [
          { name: 'sessionUser', val: '@0x7F9A', isRef: true },
          { name: 'maxRetries', val: '3', isRef: false },
          { name: 'appCache', val: '@0x9E10', isRef: true }
        ] 
      }
    ]);
    setHeapObjects([
      { id: 'obj-1', className: 'UserSession', memoryAddress: '@0x7F9A', generation: 'eden', age: 1, state: 'username="Alex", role="Admin"', isGarbage: false },
      { id: 'obj-2', className: 'ByteArrayOutputStream', memoryAddress: '@0x4B2C', generation: 'eden', age: 0, state: 'buf=[1024 bytes]', isGarbage: true },
      { id: 'obj-3', className: 'ConcurrentHashMap', memoryAddress: '@0x9E10', generation: 'old', age: 15, state: 'size=128, loadFactor=0.75', isGarbage: false },
      { id: 'obj-4', className: 'CustomerRecord', memoryAddress: '@0x3C88', generation: 'survivor', age: 4, state: 'id=9412, status="ACTIVE"', isGarbage: false }
    ]);
    setLogMessage(language === 'fr' ? 'Simulateur réinitialisé.' : 'Simulator reset.');
  };

  const edenObjects = heapObjects.filter((o) => o.generation === 'eden');
  const survivorObjects = heapObjects.filter((o) => o.generation === 'survivor');
  const oldObjects = heapObjects.filter((o) => o.generation === 'old');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4" />
              <span>{language === 'fr' ? 'Simulateur Mémoire JVM HotSpot' : 'HotSpot JVM Memory Simulator'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {language === 'fr' ? 'Architecture Mémoire: Pile, Tas Générationnel & String Pool' : 'Memory Model: Stack, Generational Heap & String Pool'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              {language === 'fr'
                ? 'Expérimentez l\'allocation dans l\'espace Eden, les promotions d\'âge vers Survivor et Old Gen, et le recyclage automatique par le Garbage Collector.'
                : 'Experience Eden allocations, generational promotion through Survivor into Old Gen, and GC reclamation.'}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={allocateObject}
              className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
            >
              <Zap className="w-4 h-4" />
              <span>{language === 'fr' ? '+ Allouer (Eden)' : '+ Allocate (Eden)'}</span>
            </button>

            <button
              onClick={makeGarbage}
              className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-300 font-bold text-xs border border-slate-700 transition-all"
              title="Nullify pointer"
            >
              <span>{language === 'fr' ? 'Déréférencer (Null)' : 'Nullify Pointer'}</span>
            </button>

            <button
              onClick={simulateInnerClassLeak}
              className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 transition-all"
              title="Simuler fuite de mémoire Inner Class this$0"
            >
              <span>{language === 'fr' ? '⚡ Fuite Inner Class (this$0)' : '⚡ Inner Class Leak (this$0)'}</span>
            </button>

            <button
              onClick={runMinorGc}
              disabled={gcRunning}
              className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>Minor GC</span>
            </button>

            <button
              onClick={runFullGc}
              disabled={gcRunning}
              className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs transition-all disabled:opacity-50"
            >
              <RotateCw className="w-4 h-4" />
              <span>Full GC</span>
            </button>

            <button
              onClick={resetVisualizer}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
              title="Reset"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Status Log */}
      <div className="bg-slate-950 px-5 py-3 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 flex items-center space-x-3 shadow-inner">
        <span className={`w-2.5 h-2.5 rounded-full ${gcRunning ? 'bg-orange-400 animate-ping' : 'bg-emerald-400'}`} />
        <span><strong>HotSpot JVM:</strong> {logMessage}</span>
      </div>

      {/* Main Grid: Thread Stack on Left (4 cols) | Generational Heap & String Pool on Right (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Thread Stack (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Layers className="w-4 h-4" />
              <span>{language === 'fr' ? 'Pile d\'Exécution (Stack)' : 'Thread Stack'}</span>
            </div>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 font-mono">
              LIFO Private
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'fr'
              ? 'Chaque thread possède sa propre pile d\'exécution rapide. Les primitives y sont stockées directement, et les références y conservent les adresses vers le Tas.'
              : 'Each thread has its own private LIFO stack. Primitives hold values; references store memory addresses.'}
          </p>

          <div className="space-y-3">
            {stackFrames.map((frame, fIdx) => (
              <div key={fIdx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300">
                  <span>Frame: {frame.method}</span>
                  <span className="text-[10px] text-slate-500">Active</span>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  {frame.variables.map((v, vIdx) => (
                    <div key={vIdx} className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">{v.name}</span>
                      <span className={`font-bold ${v.isRef ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {v.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* String Constant Pool Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 mt-4">
            <div className="flex items-center justify-between text-xs font-bold text-orange-400">
              <span className="flex items-center space-x-1.5">
                <Binary className="w-4 h-4" />
                <span>String Constant Pool</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Deduplicated</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'fr'
                ? 'Les littéraux de chaîne identiques sont mutualisés ici.'
                : 'Identical string literals share single instances here.'}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {stringPool.map((s, idx) => (
                <span key={idx} className="text-[11px] font-mono bg-slate-900 text-amber-300 px-2 py-1 rounded-lg border border-slate-800">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Generational Heap (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Young Generation (Eden + Survivor) */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <Database className="w-4 h-4" />
                <span>Young Generation (Espace Eden & Espaces Survivor)</span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                Minor GC Focus
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Eden Space */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
                  <span>Eden Space ({edenObjects.length})</span>
                  <span className="text-[10px] text-slate-500">New Objects Landing</span>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {edenObjects.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">Eden vide. Cliquez sur "+ Allouer".</p>
                  ) : (
                    edenObjects.map((obj) => (
                      <div
                        key={obj.id}
                        className={`p-2.5 rounded-lg border text-xs font-mono space-y-1 ${
                          obj.isGarbage ? 'bg-red-950/20 border-red-500/40 text-red-300' : 'bg-slate-900 border-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span className="font-bold text-white">{obj.className}</span>
                          <span className="text-amber-400">{obj.memoryAddress}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Age: {obj.age}</span>
                          <span className={obj.isGarbage ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                            {obj.isGarbage ? 'Orphan' : 'Referenced'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Survivor Spaces (S0 / S1) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-blue-400">
                  <span>Survivor Space ({survivorObjects.length})</span>
                  <span className="text-[10px] text-slate-500">Tenuring Threshold &lt; 8</span>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {survivorObjects.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">Aucun survivant actuellement.</p>
                  ) : (
                    survivorObjects.map((obj) => (
                      <div
                        key={obj.id}
                        className={`p-2.5 rounded-lg border text-xs font-mono space-y-1 ${
                          obj.isGarbage ? 'bg-red-950/20 border-red-500/40 text-red-300' : 'bg-slate-900 border-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span className="font-bold text-white">{obj.className}</span>
                          <span className="text-amber-400">{obj.memoryAddress}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>GC Age: {obj.age} cycles</span>
                          <span className="text-emerald-400">Promoting...</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Old / Tenured Generation */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
                <Database className="w-4 h-4" />
                <span>Old Generation / Tenured Space ({oldObjects.length})</span>
              </div>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20 font-mono">
                Long-Lived Singletons & Caches
              </span>
            </div>

            <p className="text-xs text-slate-400">
              {language === 'fr'
                ? 'Les objets qui survivent à plusieurs cycles de Minor GC sont promus dans la Old Gen. Ils ne sont nettoyés que lors d\'un Major GC ou Full GC.'
                : 'Objects surviving multiple Minor GC cycles are promoted to Old Gen. Reclaimed only by Major or Full GC.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {oldObjects.map((obj) => (
                <div
                  key={obj.id}
                  className={`p-3 rounded-xl border text-xs font-mono space-y-1 ${
                    obj.isGarbage ? 'bg-red-950/20 border-red-500/40 text-red-300' : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex justify-between font-bold">
                    <span className="text-white">{obj.className}</span>
                    <span className="text-purple-400">{obj.memoryAddress}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 bg-slate-900 p-1.5 rounded">
                    {obj.state}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>Age: {obj.age} (Tenured)</span>
                    <span className="text-purple-400 font-semibold">Old Gen</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
